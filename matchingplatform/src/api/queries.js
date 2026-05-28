import { createClient } from "./createClient";

const supabase = createClient();

const DEFAULT_TOTAL_WEEKS = 16;

// a) Get users by role type
export async function getUsersByRole(role) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', role);
    if (error) throw error;
    return data;
}

// Get aspiring professionals with their extra details
export async function getAspiringProfessionals() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*, aspiring_professionals(*)')
        .eq('role', 'aspiring');
    if (error) throw error;
    return data;
}

// Get established professionals with their extra details
export async function getEstablishedProfessionals() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*, established_professionals(*)')
        .eq('role', 'established');
    if (error) throw error;
    return data;
}

// b) Get users by activity status
export async function getUsersByStatus(status) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('activity_status', status);
    if (error) throw error;
    return data;
}

// c) Get suggested matches with compatibility info
export async function getSuggestedMatches() {
    const { data, error } = await supabase
        .from('matches')
        .select(`
            *,
            aspiring:aspiring_id(id, full_name, role, aspiring_professionals(university, major, field_of_interest)),
            established:established_id(id, full_name, role, established_professionals(company, job_title, field))
        `)
        .eq('status', 'suggested')
        .order('compatibility_score', { ascending: false });
    if (error) throw error;
    return data;
}

export async function generateSuggestedMatches(adminId, options = {}) {
    const maxPerAspiring = options.maxPerAspiring || 3;

    const [aspiring, established, existingMatches] = await Promise.all([
        getAspiringProfessionals(),
        getEstablishedProfessionals(),
        getOpenMatches(),
    ]);

    const unavailablePairs = new Set(
        existingMatches.map(match => `${match.aspiring_id}:${match.established_id}`)
    );
    const activeEstablishedCounts = getActiveEstablishedCounts(existingMatches);
    const openAspiringIds = new Set(
        aspiring
            .filter(person => !person.is_matched)
            .map(person => person.id)
    );

    const suggestions = [];

    openAspiringIds.forEach(aspiringId => {
        const aspiringPerson = aspiring.find(person => person.id === aspiringId);
        const rankedMentors = established
            .filter(mentor => mentor.activity_status !== 'unavailable')
            .filter(mentor => !unavailablePairs.has(`${aspiringPerson.id}:${mentor.id}`))
            .filter(mentor => hasMentorCapacity(mentor, activeEstablishedCounts.get(mentor.id) || 0))
            .map(mentor => ({
                mentor,
                compatibility: calculateCompatibility(aspiringPerson, mentor, activeEstablishedCounts.get(mentor.id) || 0),
            }))
            .filter(({ compatibility }) => compatibility.score > 0)
            .sort((a, b) => b.compatibility.score - a.compatibility.score)
            .slice(0, maxPerAspiring);

        rankedMentors.forEach(({ mentor, compatibility }) => {
            suggestions.push({
                aspiring_id: aspiringPerson.id,
                established_id: mentor.id,
                compatibility_score: compatibility.score,
                compatibility_attributes: compatibility.attributes,
                status: 'suggested',
                current_week: 0,
                total_weeks: DEFAULT_TOTAL_WEEKS,
                approved_by: adminId,
            });
        });
    });

    if (suggestions.length === 0) {
        return [];
    }

    const { data, error } = await supabase
        .from('matches')
        .insert(suggestions)
        .select();
    if (error) throw error;

    await supabase.from('activity_log').insert({
        action: 'Generated suggested matches',
        detail: `${data.length} suggested matches generated`,
        user_id: adminId,
    });

    return data;
}

// Get active matches with progress
export async function getActiveMatches() {
    const { data, error } = await supabase
        .from('matches')
        .select(`
            *,
            aspiring:aspiring_id(id, full_name, role),
            established:established_id(id, full_name, role)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

// d) Get matched vs unmatched users
export async function getUnmatchedUsers() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_matched', false)
        .in('role', ['aspiring', 'established']);
    if (error) throw error;
    return data;
}

export async function getMatchedUsers() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_matched', true)
        .in('role', ['aspiring', 'established']);
    if (error) throw error;
    return data;
}

// e) Dashboard stats
export async function getDashboardStats() {
    const [aspiring, established, matched, unmatched] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'aspiring'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'established'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_matched', true).in('role', ['aspiring', 'established']),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_matched', false).in('role', ['aspiring', 'established']),
    ]);
    return {
        totalAspiring: aspiring.count || 0,
        totalEstablished: established.count || 0,
        totalMatched: matched.count || 0,
        totalUnmatched: unmatched.count || 0,
    };
}

// Activity log
export async function getRecentActivity(limit = 10) {
    const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error) throw error;
    return data;
}

// Approve a suggested match
export async function approveMatch(matchId, adminId) {
    const { data: match, error: fetchError } = await supabase
        .from('matches')
        .select(`
            aspiring_id,
            established_id,
            aspiring:aspiring_id(full_name),
            established:established_id(full_name)
        `)
        .eq('id', matchId)
        .single();
    if (fetchError) throw fetchError;

    const { error: updateError } = await supabase
        .from('matches')
        .update({ status: 'active', current_week: 1, approved_by: adminId })
        .eq('id', matchId);
    if (updateError) throw updateError;

    // Mark both users as matched
    await supabase.from('profiles').update({ is_matched: true }).eq('id', match.aspiring_id);
    await supabase.from('profiles').update({ is_matched: true }).eq('id', match.established_id);

    // Log the activity
    await supabase.from('activity_log').insert({
        action: 'Match approved',
        detail: `${getDisplayName(match.aspiring, 'Aspiring professional')} matched with ${getDisplayName(match.established, 'Established professional')}`,
        user_id: adminId,
    });
}

// Reject a suggested match
export async function rejectMatch(matchId) {
    const { error } = await supabase
        .from('matches')
        .update({ status: 'rejected' })
        .eq('id', matchId);
    if (error) throw error;
}

export async function removeActiveMatch(matchId, adminId) {
    const { data: match, error: fetchError } = await supabase
        .from('matches')
        .select(`
            aspiring_id,
            established_id,
            aspiring:aspiring_id(full_name, email),
            established:established_id(full_name, email)
        `)
        .eq('id', matchId)
        .eq('status', 'active')
        .maybeSingle();
    if (fetchError) throw fetchError;
    if (!match) throw new Error('This active match could not be found. It may have already been removed.');

    const { error: updateError } = await supabase
        .from('matches')
        .update({ status: 'rejected' })
        .eq('id', matchId);
    if (updateError) throw updateError;

    await refreshMatchedFlag(match.aspiring_id);
    await refreshMatchedFlag(match.established_id);

    await supabase.from('activity_log').insert({
        action: 'Removed match',
        detail: `${getDisplayName(match.aspiring, 'Aspiring professional')} and ${getDisplayName(match.established, 'Established professional')} are no longer matched`,
        user_id: adminId,
    });
}

// Create a manual match
export async function createManualMatch(aspiringId, establishedId, adminId) {
    const [aspiring, established, existingMatches] = await Promise.all([
        getProfileForCompatibility(aspiringId, 'aspiring'),
        getProfileForCompatibility(establishedId, 'established'),
        getOpenMatches(),
    ]);
    const existingPair = existingMatches.find(match =>
        match.aspiring_id === aspiringId && match.established_id === establishedId
    );
    if (existingPair?.status === 'active') {
        throw new Error('This pair is already actively matched.');
    }

    const activeEstablishedCounts = getActiveEstablishedCounts(existingMatches);
    const compatibility = calculateCompatibility(
        aspiring,
        established,
        activeEstablishedCounts.get(establishedId) || 0
    );

    if (existingPair?.status === 'suggested') {
        const { data, error } = await supabase
            .from('matches')
            .update({
                compatibility_score: compatibility.score,
                compatibility_attributes: compatibility.attributes,
                status: 'active',
                current_week: 1,
                total_weeks: DEFAULT_TOTAL_WEEKS,
                approved_by: adminId,
            })
            .eq('id', existingPair.id)
            .select()
            .single();
        if (error) throw error;

        await markProfilesMatched(aspiringId, establishedId);
        await logManualMatch(adminId, aspiring, established, compatibility.score);
        return data;
    }

    const { data, error } = await supabase
        .from('matches')
        .insert({
            aspiring_id: aspiringId,
            established_id: establishedId,
            compatibility_score: compatibility.score,
            compatibility_attributes: compatibility.attributes,
            status: 'active',
            current_week: 1,
            total_weeks: DEFAULT_TOTAL_WEEKS,
            approved_by: adminId,
        })
        .select()
        .single();
    if (error) throw error;

    await markProfilesMatched(aspiringId, establishedId);
    await logManualMatch(adminId, aspiring, established, compatibility.score);

    return data;
}

// Get admin profile
export async function getAdminProfile(adminId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', adminId)
        .single();
    if (error) throw error;
    return data;
}

async function getOpenMatches() {
    const { data, error } = await supabase
        .from('matches')
        .select('id, aspiring_id, established_id, status')
        .in('status', ['suggested', 'active']);
    if (error) throw error;
    return data || [];
}

async function getProfileForCompatibility(profileId, role) {
    const detailTable = role === 'aspiring' ? 'aspiring_professionals(*)' : 'established_professionals(*)';
    const { data, error } = await supabase
        .from('profiles')
        .select(`*, ${detailTable}`)
        .eq('id', profileId)
        .single();
    if (error) throw error;
    return data;
}

function getActiveEstablishedCounts(matches) {
    return matches.reduce((counts, match) => {
        if (match.status !== 'active') return counts;
        counts.set(match.established_id, (counts.get(match.established_id) || 0) + 1);
        return counts;
    }, new Map());
}

function hasMentorCapacity(mentor, activeCount) {
    const capacity = mentor.established_professionals?.[0]?.mentoring_capacity;
    if (!capacity) return true;
    return activeCount < capacity;
}

function calculateCompatibility(aspiring, established, activeMentorCount = 0) {
    const student = aspiring.aspiring_professionals?.[0] || {};
    const mentor = established.established_professionals?.[0] || {};
    const attributes = [];
    let score = 0;

    const studentInterest = normalizeText(student.field_of_interest);
    const studentMajor = normalizeText(student.major);
    const mentorField = normalizeText(mentor.field);

    if (studentInterest && mentorField && studentInterest === mentorField) {
        score += 45;
        attributes.push('same field');
    } else if (studentInterest && mentorField && hasTokenOverlap(studentInterest, mentorField)) {
        score += 32;
        attributes.push('related field');
    }

    if (studentMajor && mentorField && studentMajor === mentorField) {
        score += 20;
        attributes.push('same major field');
    } else if (studentMajor && mentorField && hasTokenOverlap(studentMajor, mentorField)) {
        score += 12;
        attributes.push('related major');
    }

    if (normalizeText(student.university) && normalizeText(mentor.university) && normalizeText(student.university) === normalizeText(mentor.university)) {
        score += 20;
        attributes.push('same university');
    }

    if (established.activity_status === 'available') {
        score += 5;
        attributes.push('mentor available');
    }

    const capacity = mentor.mentoring_capacity;
    if (capacity && activeMentorCount < capacity) {
        score += 5;
        attributes.push(`${capacity - activeMentorCount} capacity open`);
    }

    const experience = Number(mentor.years_experience || 0);
    if (experience >= 10) {
        score += 5;
        attributes.push('10+ years experience');
    } else if (experience >= 5) {
        score += 3;
        attributes.push('5+ years experience');
    }

    if (attributes.length === 0) {
        attributes.push('manual review');
    }

    return {
        score: Math.min(score, 100),
        attributes,
    };
}

function normalizeText(value) {
    return String(value || '').trim().toLowerCase();
}

function hasTokenOverlap(left, right) {
    const leftTokens = new Set(left.split(/[^a-z0-9]+/).filter(Boolean));
    const rightTokens = right.split(/[^a-z0-9]+/).filter(Boolean);
    return rightTokens.some(token => leftTokens.has(token));
}

async function markProfilesMatched(aspiringId, establishedId) {
    await supabase.from('profiles').update({ is_matched: true }).eq('id', aspiringId);
    await supabase.from('profiles').update({ is_matched: true }).eq('id', establishedId);
}

async function refreshMatchedFlag(profileId) {
    const { count, error } = await supabase
        .from('matches')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active')
        .or(`aspiring_id.eq.${profileId},established_id.eq.${profileId}`);
    if (error) throw error;

    await supabase
        .from('profiles')
        .update({ is_matched: (count || 0) > 0 })
        .eq('id', profileId);
}

function getDisplayName(profile, fallback) {
    return profile?.full_name || profile?.email || fallback;
}

async function logManualMatch(adminId, aspiring, established, score) {
    await supabase.from('activity_log').insert({
        action: 'Created match',
        detail: `${getDisplayName(aspiring, 'Aspiring professional')} matched with ${getDisplayName(established, 'Established professional')} (${score}% compatibility)`,
        user_id: adminId,
    });
}
