import { NextResponse } from "next/server";
import { sendMatchConfirmation } from "@/lib/email/matchEmails";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin.authorized) return admin.response;

  try {
    const body = await request.json();
    const result = await sendMatchConfirmation(body.match_id);
    return NextResponse.json(result, { status: result.success ? 200 : 502 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
