import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/auth/requireAdmin";
import { sendWeeklyReminders } from "../../../../lib/email/weeklyEmails";

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin.authorized) return admin.response;

  try {
    const body = await request.json().catch(() => ({}));
    const result = await sendWeeklyReminders({
      matchId: body.match_id || null,
      force: Boolean(body.force),
      dryRun: Boolean(body.dryRun),
    });
    return NextResponse.json(result, { status: result.success ? 200 : 502 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
