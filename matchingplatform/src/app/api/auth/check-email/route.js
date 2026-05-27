import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../lib/email/supabaseAdmin";

export async function POST(request) {
  try {
    const { email } = await request.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json({ exists: false });
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", normalizedEmail)
      .limit(1);

    if (error) {
      return NextResponse.json({ exists: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ exists: (data || []).length > 0 });
  } catch (error) {
    return NextResponse.json({ exists: false, error: error.message }, { status: 500 });
  }
}
