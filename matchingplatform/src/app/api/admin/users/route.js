import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/auth/requireAdmin";
import { createSupabaseAdminClient } from "../../../../lib/email/supabaseAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.authorized) return admin.response;

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, activity_status")
      .eq("role", "admin")
      .order("full_name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, admins: data || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin.authorized) return admin.response;

  try {
    const { email } = await request.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail) {
      return NextResponse.json({ success: false, error: "Email is required." }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { data: profile, error: lookupError } = await supabase
      .from("profiles")
      .select("id, email, full_name, role")
      .ilike("email", normalizedEmail)
      .maybeSingle();

    if (lookupError) throw lookupError;
    if (!profile) {
      return NextResponse.json(
        { success: false, error: "No profile exists for that email. Have the person sign up first, then promote them." },
        { status: 404 }
      );
    }

    if (profile.role === "admin") {
      return NextResponse.json({ success: true, alreadyAdmin: true, admin: profile });
    }

    const { data: updated, error: updateError } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", profile.id)
      .select("id, email, full_name, activity_status")
      .single();

    if (updateError) throw updateError;

    await supabase.from("activity_log").insert({
      action: "Promoted admin",
      detail: `${updated.full_name || updated.email} was promoted to admin`,
      user_id: admin.user.id,
    });

    return NextResponse.json({ success: true, admin: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
