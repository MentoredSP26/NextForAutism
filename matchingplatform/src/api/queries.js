import { createClient } from "./createClient";

const supabase = createClient();

// get users by role type
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

// get users by activity status
export async function getUsersByStatus(status) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('activity_status', status);
    if (error) throw error;
    return data;
}

// get suggested matches with compatibility info
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

// get active matches with progress
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

// get matched vs unmatched users
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
        .select('aspiring_id, established_id')
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
        detail: `Match ${matchId} approved`,
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

// Create a manual match
export async function createManualMatch(aspiringId, establishedId, adminId) {
    const { data, error } = await supabase
        .from('matches')
        .insert({
            aspiring_id: aspiringId,
            established_id: establishedId,
            compatibility_score: 0,
            compatibility_attributes: [],
            status: 'active',
            current_week: 1,
            approved_by: adminId,
        })
        .select()
        .single();
    if (error) throw error;

    await supabase.from('profiles').update({ is_matched: true }).eq('id', aspiringId);
    await supabase.from('profiles').update({ is_matched: true }).eq('id', establishedId);

    await supabase.from('activity_log').insert({
        action: 'Created match',
        detail: `Manual match created`,
        user_id: adminId,
    });

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
