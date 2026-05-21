import { logEmailAttempt } from "./emailLogs";
import { matchConfirmationTemplate } from "./templates";
import { sendEmail } from "./resend";
import { createSupabaseAdminClient } from "./supabaseAdmin";

const MATCH_SELECT = `
  id,
  aspiring:profiles!matches_aspiring_id_fkey(email, full_name),
  established:profiles!matches_established_id_fkey(email, full_name)
`;

export async function sendMatchConfirmation(matchId) {
  if (!matchId) {
    throw new Error("match_id is required");
  }

  const supabase = createSupabaseAdminClient();
  const { data: match, error } = await supabase
    .from("matches")
    .select(MATCH_SELECT)
    .eq("id", matchId)
    .single();

  if (error || !match) {
    throw new Error(error?.message || "Match not found");
  }

  const mentee = match.aspiring;
  const mentor = match.established;
  const html = matchConfirmationTemplate({
    mentorName: mentor?.full_name,
    menteeName: mentee?.full_name,
  });
  const recipients = [
    { email: mentor?.email, name: mentor?.full_name },
    { email: mentee?.email, name: mentee?.full_name },
  ];

  const results = [];
  for (const recipient of recipients) {
    const result = await sendEmail({
      to: recipient.email,
      subject: "You've been matched on NEXT Connects",
      html,
    });

    await logEmailAttempt(supabase, {
      matchId: match.id,
      recipientEmail: recipient.email,
      recipientName: recipient.name,
      emailType: "match_confirmation",
      status: result.success ? (result.dryRun ? "dry_run" : "sent") : "failed",
      resendId: result.success ? result.data?.id : null,
      errorMessage: result.success ? null : JSON.stringify(result.error),
    });

    results.push({
      recipient: recipient.email,
      success: result.success,
      dryRun: Boolean(result.dryRun),
      error: result.success ? null : result.error,
    });
  }

  return {
    success: results.every((result) => result.success),
    matchId: match.id,
    results,
  };
}
