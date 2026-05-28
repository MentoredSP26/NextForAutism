export async function logEmailAttempt(supabase, payload) {
  const { error } = await supabase.from("email_logs").insert({
    match_id: payload.matchId,
    recipient_email: payload.recipientEmail,
    recipient_name: payload.recipientName,
    email_type: payload.emailType,
    week_number: payload.weekNumber ?? null,
    status: payload.status,
    resend_id: payload.resendId ?? null,
    error_message: payload.errorMessage ?? null,
  });

  if (error) {
    console.error("Failed to write email log:", error);
  }
}

export async function hasSentWeeklyReminder(supabase, matchId, weekNumber) {
  const { data, error } = await supabase
    .from("email_logs")
    .select("id")
    .eq("match_id", matchId)
    .eq("email_type", "weekly_reminder")
    .eq("week_number", weekNumber)
    .eq("status", "sent")
    .limit(1);

  if (error) {
    console.error("Failed to check email log:", error);
    return false;
  }

  return (data || []).length > 0;
}
