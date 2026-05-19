import { createClient } from "./createClient";

export const ROLE_DETAIL_TABLES = {
    aspiring: "aspiring_professionals",
    established: "established_professionals",
};

export const ROLE_DETAIL_FIELDS = {
    aspiring: ["university", "major", "field_of_interest", "graduation_year", "goals"],
    established: ["company", "job_title", "field", "years_experience", "mentoring_capacity", "university"],
};

const PROFILE_FIELDS = ["full_name", "phone", "location", "bio", "activity_status"];

function pickFields(source, fields) {
    return fields.reduce((picked, field) => {
        if (source[field] !== undefined) {
            picked[field] = source[field] === "" ? null : source[field];
        }
        return picked;
    }, {});
}

function normalizeNumber(value) {
    if (value === "" || value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isNaN(number) ? null : number;
}

function normalizeDetail(role, detail) {
    const fields = ROLE_DETAIL_FIELDS[role] || [];
    const payload = pickFields(detail, fields);

    if ("graduation_year" in payload) payload.graduation_year = normalizeNumber(payload.graduation_year);
    if ("years_experience" in payload) payload.years_experience = normalizeNumber(payload.years_experience);
    if ("mentoring_capacity" in payload) payload.mentoring_capacity = normalizeNumber(payload.mentoring_capacity);

    return payload;
}

export async function getCurrentProfileWithDetails() {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) return null;

    const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
    if (profileError) throw profileError;

    const profile = existingProfile || await createProfileFromMetadata(supabase, user);
    const table = ROLE_DETAIL_TABLES[profile.role];
    let details = null;

    if (table) {
        const { data, error } = await supabase
            .from(table)
            .select("*")
            .eq("profile_id", user.id)
            .maybeSingle();
        if (error) throw error;
        details = data || normalizeDetail(profile.role, user.user_metadata?.profile_details || {});
    }

    return { user, profile, details };
}

export async function saveCurrentProfile({ profile, details }) {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("You must be logged in to update your profile.");

    const profilePayload = pickFields(profile, PROFILE_FIELDS);
    const { data: updatedProfile, error: profileError } = await supabase
        .from("profiles")
        .update(profilePayload)
        .eq("id", user.id)
        .select("*")
        .single();
    if (profileError) throw profileError;

    const role = updatedProfile.role;
    const table = ROLE_DETAIL_TABLES[role];
    let updatedDetails = null;

    if (table) {
        updatedDetails = await saveRoleDetails(supabase, table, role, user.id, details);
    }

    await supabase.from("activity_log").insert({
        action: "Updated profile",
        detail: `${updatedProfile.full_name || updatedProfile.email || "User"} updated their profile`,
        user_id: user.id,
    });

    return { profile: updatedProfile, details: updatedDetails };
}

export async function getManagedProfileWithDetails(profileId, role) {
    const supabase = createClient();
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .single();
    if (profileError) throw profileError;

    const table = ROLE_DETAIL_TABLES[role || profile.role];
    let details = null;

    if (table) {
        const { data, error } = await supabase
            .from(table)
            .select("*")
            .eq("profile_id", profileId)
            .maybeSingle();
        if (error) throw error;
        details = data;
    }

    return { profile, details };
}

export async function saveManagedProfile(profileId, role, { profile, details }) {
    const supabase = createClient();
    const profilePayload = pickFields(profile, PROFILE_FIELDS);

    const { data: updatedProfile, error: profileError } = await supabase
        .from("profiles")
        .update(profilePayload)
        .eq("id", profileId)
        .select("*")
        .single();
    if (profileError) throw profileError;

    const table = ROLE_DETAIL_TABLES[role || updatedProfile.role];
    let updatedDetails = null;

    if (table) {
        updatedDetails = await saveRoleDetails(supabase, table, role || updatedProfile.role, profileId, details);
    }

    await supabase.from("activity_log").insert({
        action: "Updated managed profile",
        detail: `${updatedProfile.full_name || updatedProfile.email || "User"} was updated by staff`,
    });

    return { profile: updatedProfile, details: updatedDetails };
}

export async function deleteManagedRoleDetails(profileId, role) {
    const supabase = createClient();
    const table = ROLE_DETAIL_TABLES[role];
    if (!table) return;

    const { error } = await supabase
        .from(table)
        .delete()
        .eq("profile_id", profileId);
    if (error) throw error;

    await supabase.from("activity_log").insert({
        action: "Deleted managed profile details",
        detail: `Role-specific details were deleted for ${profileId}`,
    });
}

export async function saveSignupProfile(supabase, userId, role, profile, details) {
    const profilePayload = {
        id: userId,
        email: profile.email,
        full_name: profile.full_name,
        role,
        activity_status: profile.activity_status || "available",
    };

    const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profilePayload, { onConflict: "id" });
    if (profileError) throw profileError;

    const table = ROLE_DETAIL_TABLES[role];
    if (!table) return;

    await saveRoleDetails(supabase, table, role, userId, details);
}

export async function deleteCurrentRoleDetails() {
    const supabase = createClient();
    const current = await getCurrentProfileWithDetails();
    if (!current) throw new Error("You must be logged in to delete profile details.");

    const table = ROLE_DETAIL_TABLES[current.profile.role];
    if (!table) return;

    const { error } = await supabase
        .from(table)
        .delete()
        .eq("profile_id", current.user.id);
    if (error) throw error;

    await supabase.from("activity_log").insert({
        action: "Deleted profile details",
        detail: `${current.profile.full_name || current.profile.email || "User"} deleted their role-specific profile details`,
        user_id: current.user.id,
    });
}

async function saveRoleDetails(supabase, table, role, profileId, details) {
    const detailPayload = {
        profile_id: profileId,
        ...normalizeDetail(role, details),
    };

    const { data: existing, error: existingError } = await supabase
        .from(table)
        .select("id")
        .eq("profile_id", profileId)
        .maybeSingle();
    if (existingError) throw existingError;

    if (existing) {
        const { data, error } = await supabase
            .from(table)
            .update(detailPayload)
            .eq("id", existing.id)
            .select("*")
            .single();
        if (error) throw error;
        return data;
    }

    const { data, error } = await supabase
        .from(table)
        .insert(detailPayload)
        .select("*")
        .single();
    if (error) throw error;
    return data;
}

async function createProfileFromMetadata(supabase, user) {
    const metadata = user.user_metadata || {};
    const role = metadata.role || "aspiring";
    const profilePayload = {
        id: user.id,
        email: user.email,
        full_name: metadata.full_name || user.email,
        role,
        activity_status: "available",
    };

    const { data, error } = await supabase
        .from("profiles")
        .upsert(profilePayload, { onConflict: "id" })
        .select("*")
        .single();
    if (error) throw error;

    const table = ROLE_DETAIL_TABLES[role];
    const details = metadata.profile_details;
    if (table && details) {
        await saveRoleDetails(supabase, table, role, user.id, details);
    }

    return data;
}
