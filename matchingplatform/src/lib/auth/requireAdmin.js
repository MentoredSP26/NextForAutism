import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../api/supabase-server";

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      authorized: false,
      response: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || profile?.role !== "admin") {
    return {
      authorized: false,
      response: NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 }),
    };
  }

  return { authorized: true, user, profile };
}
