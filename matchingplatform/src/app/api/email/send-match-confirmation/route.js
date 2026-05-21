import { NextResponse } from "next/server";
import { sendMatchConfirmation } from "@/lib/email/matchEmails";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await sendMatchConfirmation(body.match_id);
    return NextResponse.json(result, { status: result.success ? 200 : 502 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
