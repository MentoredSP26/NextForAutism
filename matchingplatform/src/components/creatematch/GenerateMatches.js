import { createClient } from '../../api/createClient';

const supabase = createClient();

const MATCHABLE_STATUSES = ['suggested', 'active'];

function getFirstDetail(profile, key) {
  const value = profile?.[key];
  return Array.isArray(value) ? value[0] || {} : value || {};
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function getAspiringField(aspiring) {
  const details = getFirstDetail(aspiring, 'aspiring_professionals');
  return (
    details.field_of_interest
    || details.field
    || details.major
    || aspiring.field
    || aspiring.major
  );
}

function getEstablishedField(established) {
  const details = getFirstDetail(established, 'established_professionals');
  return details.field || established.field;
}

function getUniversity(profile) {
  const aspiringDetails = getFirstDetail(profile, 'aspiring_professionals');
  const establishedDetails = getFirstDetail(profile, 'established_professionals');
  return aspiringDetails.university || establishedDetails.university || profile.university;
}

function getMentorCapacity(mentor) {
  const details = getFirstDetail(mentor, 'established_professionals');
  const raw = mentor.capacity
    ?? mentor.mentoring_capacity
    ?? details.capacity
    ?? details.mentoring_capacity;
  const capacity = Number(raw ?? 1);
  return Number.isFinite(capacity) && capacity > 0 ? Math.floor(capacity) : 1;
}

function scoreMatch(aspiring, mentor) {
  let score = 0;
  const attributes = [];

  if (normalizeText(getAspiringField(aspiring)) === normalizeText(getEstablishedField(mentor))) {
    score += 70;
    attributes.push('field');
  }

  if (normalizeText(getUniversity(aspiring)) === normalizeText(getUniversity(mentor))) {
    score += 30;
    attributes.push('university');
  }

  return { score, attributes };
}

function createGraph(size) {
  return Array.from({ length: size }, () => []);
}

function addEdge(graph, from, to, capacity, cost, metadata = null) {
  const forward = { to, rev: graph[to].length, capacity, originalCapacity: capacity, cost, metadata };
  const backward = { to: from, rev: graph[from].length, capacity: 0, cost: -cost, metadata: null };

  graph[from].push(forward);
  graph[to].push(backward);
}

function minCostMaxFlow(graph, source, sink) {
  while (true) {
    const distance = Array(graph.length).fill(Infinity);
    const previousNode = Array(graph.length).fill(-1);
    const previousEdge = Array(graph.length).fill(-1);
    const inQueue = Array(graph.length).fill(false);
    const queue = [source];

    distance[source] = 0;
    inQueue[source] = true;

    for (let head = 0; head < queue.length; head += 1) {
      const node = queue[head];
      inQueue[node] = false;

      graph[node].forEach((edge, edgeIndex) => {
        if (edge.capacity <= 0) return;

        const nextDistance = distance[node] + edge.cost;
        if (nextDistance >= distance[edge.to]) return;

        distance[edge.to] = nextDistance;
        previousNode[edge.to] = node;
        previousEdge[edge.to] = edgeIndex;

        if (!inQueue[edge.to]) {
          queue.push(edge.to);
          inQueue[edge.to] = true;
        }
      });
    }

    if (previousNode[sink] === -1 || distance[sink] >= 0) break;

    let node = sink;

    while (node !== source) {
      const from = previousNode[node];
      const edge = graph[from][previousEdge[node]];

      edge.capacity -= 1;
      graph[edge.to][edge.rev].capacity += 1;

      node = from;
    }
  }
}

async function getExistingMatchUsage() {
  const { data, error } = await supabase
    .from('matches')
    .select('aspiring_id, established_id, status')
    .in('status', MATCHABLE_STATUSES);

  if (error) throw error;

  return (data || []).reduce((usage, match) => {
    usage.aspiringIds.add(match.aspiring_id);
    usage.mentorCounts.set(
      match.established_id,
      (usage.mentorCounts.get(match.established_id) || 0) + 1
    );
    return usage;
  }, { aspiringIds: new Set(), mentorCounts: new Map() });
}

async function getUnmatchedAspiringProfessionals(excludedAspiringIds) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, aspiring_professionals(*)')
    .eq('role', 'aspiring')
    .eq('is_matched', false);

  if (error) throw error;

  return (data || []).filter((profile) => !excludedAspiringIds.has(profile.id));
}

async function getMentorsWithCapacity(mentorCounts) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, established_professionals(*)')
    .eq('role', 'established')
    .ilike('activity_status', 'available');

  if (error) throw error;

  return (data || [])
    .map((mentor) => ({
      mentor,
      remainingCapacity: getMentorCapacity(mentor) - (mentorCounts.get(mentor.id) || 0),
    }))
    .filter(({ remainingCapacity }) => remainingCapacity > 0);
}

function findBestGlobalMatches(aspiringProfessionals, mentorsWithCapacity) {
  const source = 0;
  const aspiringOffset = 1;
  const mentorOffset = aspiringOffset + aspiringProfessionals.length;
  const sink = mentorOffset + mentorsWithCapacity.length;
  const graph = createGraph(sink + 1);

  aspiringProfessionals.forEach((aspiring, index) => {
    addEdge(graph, source, aspiringOffset + index, 1, 0);
  });

  mentorsWithCapacity.forEach(({ remainingCapacity }, index) => {
    addEdge(graph, mentorOffset + index, sink, remainingCapacity, 0);
  });

  aspiringProfessionals.forEach((aspiring, aspiringIndex) => {
    mentorsWithCapacity.forEach(({ mentor }, mentorIndex) => {
      const { score, attributes } = scoreMatch(aspiring, mentor);
      if (score <= 0) return;

      addEdge(
        graph,
        aspiringOffset + aspiringIndex,
        mentorOffset + mentorIndex,
        1,
        -score,
        { aspiring, mentor, score, attributes }
      );
    });
  });

  minCostMaxFlow(graph, source, sink);

  return graph
    .slice(aspiringOffset, mentorOffset)
    .flatMap((edges) => edges
      .filter((edge) => edge.metadata && edge.capacity < edge.originalCapacity)
      .map((edge) => edge.metadata));
}

export default async function generateMatches() {
  try {
    const usage = await getExistingMatchUsage();
    const aspiringProfessionals = await getUnmatchedAspiringProfessionals(usage.aspiringIds);
    const mentorsWithCapacity = await getMentorsWithCapacity(usage.mentorCounts);

    if (aspiringProfessionals.length === 0) {
      return { success: false, message: 'No unmatched aspiring professionals found.' };
    }

    if (mentorsWithCapacity.length === 0) {
      return { success: false, message: 'No established professionals currently have capacity.' };
    }

    const matches = findBestGlobalMatches(aspiringProfessionals, mentorsWithCapacity);

    if (matches.length === 0) {
      return { success: false, message: 'No suggested matches found.' };
    }

    const rows = matches.map(({ aspiring, mentor, score, attributes }) => ({
      aspiring_id: aspiring.id,
      established_id: mentor.id,
      compatibility_score: score,
      compatibility_attributes: attributes,
      status: 'suggested',
      created_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('matches')
      .insert(rows)
      .select();

    if (error) throw error;

    return {
      success: true,
      message: `Successfully generated ${data.length} suggested match${data.length === 1 ? '' : 'es'}.`,
      matches: data,
    };
  } catch (error) {
    console.error('Error generating matches:', error);
    return { success: false, error: error.message };
  }
}

export {
  findBestGlobalMatches,
  getMentorCapacity,
  scoreMatch,
};
