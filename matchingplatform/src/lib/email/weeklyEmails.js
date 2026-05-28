import { hasSentWeeklyReminder, logEmailAttempt } from "./emailLogs";
import { sendEmail } from "./resend";
import { createSupabaseAdminClient } from "./supabaseAdmin";
import { weeklyReminderTemplate } from "./templates";
import { weeks } from "./weekData";

const MATCH_SELECT = `
  id,
  current_week,
  total_weeks,
  aspiring:profiles!matches_aspiring_id_fkey(email, full_name),
  established:profiles!matches_established_id_fkey(email, full_name)
`;

export async function sendWeeklyReminders({ matchId = null, force = false, dryRun = false, limit = 50 } = {}) {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("matches")
    .select(MATCH_SELECT)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (matchId) {
    query = query.eq("id", matchId);
  }

  const { data: matches, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  const processed = [];
  for (const match of matches || []) {
    processed.push(await processMatch(supabase, match, force, dryRun));
  }

  return {
    success: processed.every((match) => match.status !== "failed"),
    processed,
  };
}

async function processMatch(supabase, match, force, dryRun) {
  const currentWeek = Number(match.current_week || 1);
  const weekData = weeks[currentWeek - 1];
  if (!weekData || currentWeek > Number(match.total_weeks || weeks.length)) {
    return { matchId: match.id, week: currentWeek, status: "skipped", reason: "No week content available" };
  }

  if (!force && await hasSentWeeklyReminder(supabase, match.id, currentWeek)) {
    return { matchId: match.id, week: currentWeek, status: "skipped", reason: "Already sent" };
  }

  const aspiringProfessional = match.aspiring;
  const establishedProfessional = match.established;
  const recipients = [
    {
      email: establishedProfessional?.email,
      name: establishedProfessional?.full_name,
      partnerName: aspiringProfessional?.full_name,
      partnerRoleLabel: "aspiring professional",
    },
    {
      email: aspiringProfessional?.email,
      name: aspiringProfessional?.full_name,
      partnerName: establishedProfessional?.full_name,
      partnerRoleLabel: "established professional",
    },
  ];
  const results = [];

  for (const recipient of recipients) {
    const html = weeklyReminderTemplate({
      recipientName: recipient.name,
      partnerName: recipient.partnerName,
      partnerRoleLabel: recipient.partnerRoleLabel,
      weekNumber: currentWeek,
      weekData,
    });
    const result = await sendEmail({
      to: recipient.email,
      subject: weekData.subject,
      html,
      dryRun,
    });

    await logEmailAttempt(supabase, {
      matchId: match.id,
      recipientEmail: recipient.email,
      recipientName: recipient.name,
      emailType: "weekly_reminder",
      weekNumber: currentWeek,
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

  const allSent = results.every((result) => result.success);
  const allReallySent = allSent && results.every((result) => !result.dryRun);
  if (allReallySent && currentWeek < Math.min(Number(match.total_weeks || weeks.length), weeks.length)) {
    const { error } = await supabase
      .from("matches")
      .update({ current_week: currentWeek + 1 })
      .eq("id", match.id);
    if (error) {
      console.error("Failed to advance match week:", error);
    }
  }

  return {
    matchId: match.id,
    week: currentWeek,
    status: allSent ? (allReallySent ? "sent" : "dry_run") : "failed",
    results,
  };
}
