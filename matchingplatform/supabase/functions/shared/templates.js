// shared/templates.js
// Reusable HTML email templates for the mentorship program.
// Both functions return { subject, html, text } so they work with
// any email provider (Resend, SendGrid, Mailgun, etc.).
 
import { isLearningWeek } from "./weeklyData.js";
 
// ─── Shared Styles ────────────────────────────────────────────────────────────
 
const BASE_STYLES = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #f4f4f5; color: #18181b; }
    .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
    .header { background: #18181b; padding: 32px 40px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
    .header p.sub { color: #a1a1aa; font-size: 13px; margin-top: 4px; }
    .accent-bar { height: 4px; background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%); }
    .body { padding: 40px; }
    .greeting { font-size: 16px; font-weight: 600; margin-bottom: 16px; }
    .intro { font-size: 15px; line-height: 1.65; color: #3f3f46; margin-bottom: 28px; }
    .card { background: #f9f9fb; border: 1px solid #e4e4e7; border-radius: 8px; padding: 24px; margin-bottom: 24px; }
    .card h2 { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #6366f1; margin-bottom: 14px; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e4e4e7; font-size: 14px; }
    .info-row:last-child { border-bottom: none; }
    .info-row .label { color: #71717a; font-weight: 500; }
    .info-row .value { font-weight: 600; color: #18181b; text-align: right; max-width: 60%; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-learning { background: #ede9fe; color: #5b21b6; }
    .badge-discussion { background: #fce7f3; color: #9d174d; }
    .resources-list { list-style: none; padding: 0; }
    .resources-list li { padding: 10px 0; border-bottom: 1px solid #e4e4e7; font-size: 14px; }
    .resources-list li:last-child { border-bottom: none; }
    .resources-list a { color: #6366f1; text-decoration: none; font-weight: 500; }
    .resources-list .desc { color: #71717a; font-size: 13px; margin-top: 3px; }
    .prompts-list { list-style: none; padding: 0; }
    .prompts-list li { display: flex; gap: 10px; padding: 8px 0; font-size: 14px; line-height: 1.55; color: #3f3f46; }
    .prompts-list li::before { content: "→"; color: #8b5cf6; font-weight: 700; flex-shrink: 0; }
    .cta-block { text-align: center; margin: 28px 0; }
    .cta-btn { display: inline-block; background: #6366f1; color: #ffffff; padding: 13px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; }
    .divider { height: 1px; background: #e4e4e7; margin: 24px 0; }
    .footer { background: #fafafa; border-top: 1px solid #e4e4e7; padding: 24px 40px; text-align: center; }
    .footer p { font-size: 12px; color: #a1a1aa; line-height: 1.6; }
    .footer a { color: #6366f1; text-decoration: none; }
  </style>
`;
 
function footerHtml(programName) {
  return `
  <div class="footer">
    <p>
      You're receiving this because you're part of <strong>${programName}</strong>.<br/>
      Questions? Reply to this email or contact your program coordinator.<br/>
      <a href="#">Unsubscribe</a> · <a href="#">Privacy Policy</a>
    </p>
  </div>
`;
}
 
// ─── matchConfirmationTemplate ────────────────────────────────────────────────
 
/**
 * Generates an email template sent to both mentor and mentee
 * immediately after a match is confirmed by an admin.
 *
 * @param {Object} data
 * @param {string} data.mentorName
 * @param {string} data.menteeName
 * @param {string} data.mentorEmail
 * @param {string} data.menteeEmail
 * @param {string} data.matchId
 * @param {string} [data.programName]
 * @param {string} [data.firstSessionDate]
 * @param {string} [data.schedulingLink]
 * @param {"mentor"|"mentee"} recipientRole
 * @returns {{ subject: string, html: string, text: string }}
 */
export function matchConfirmationTemplate(data, recipientRole) {
  const {
    mentorName,
    menteeName,
    mentorEmail,
    menteeEmail,
    matchId,
    programName = "Mentorship Program",
    firstSessionDate,
    schedulingLink,
  } = data;
 
  const isMentor = recipientRole === "mentor";
  const recipientName = isMentor ? mentorName : menteeName;
  const partnerName = isMentor ? menteeName : mentorName;
  const partnerEmail = isMentor ? menteeEmail : mentorEmail;
  const partnerRole = isMentor ? "mentee" : "mentor";
 
  const subject = `🎉 You've been matched! Meet your ${partnerRole}, ${partnerName}`;
 
  const schedulingBlock = schedulingLink
    ? `
      <div class="cta-block">
        <a href="${schedulingLink}" class="cta-btn">📅 Schedule Your First Session</a>
      </div>
    `
    : firstSessionDate
    ? `
      <div class="card">
        <h2>First Session</h2>
        <div class="info-row">
          <span class="label">Scheduled</span>
          <span class="value">${firstSessionDate}</span>
        </div>
      </div>
    `
    : "";
 
  const tipsList = isMentor
    ? [
        "Share your professional journey — even the detours",
        "Ask questions more than you give advice at first",
        "Help your mentee set 2–3 concrete goals for the semester",
      ]
    : [
        "Come to each session with a topic or question prepared",
        "Be honest about where you're struggling — mentors are here to help",
        "Take notes and follow through on any actions you commit to",
      ];
 
  const tipsHeading = isMentor ? "Mentor Tips" : "Mentee Tips";
 
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
  ${BASE_STYLES}
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>${programName}</h1>
      <p class="sub">Match Confirmation</p>
    </div>
    <div class="accent-bar"></div>
 
    <div class="body">
      <p class="greeting">Hi ${recipientName} 👋</p>
      <p class="intro">
        Great news — you've been matched! We're excited to introduce you to your
        ${partnerRole} for this semester. This is the start of what we hope will be
        a meaningful and productive relationship.
      </p>
 
      <div class="card">
        <h2>Your Match</h2>
        <div class="info-row">
          <span class="label">Your ${partnerRole}</span>
          <span class="value">${partnerName}</span>
        </div>
        <div class="info-row">
          <span class="label">Contact</span>
          <span class="value"><a href="mailto:${partnerEmail}" style="color:#6366f1">${partnerEmail}</a></span>
        </div>
        <div class="info-row">
          <span class="label">Match ID</span>
          <span class="value" style="font-family:monospace;font-size:12px">${matchId}</span>
        </div>
      </div>
 
      ${schedulingBlock}
 
      <div class="card">
        <h2>What Happens Next</h2>
        <ul class="prompts-list">
          <li>Reach out to ${partnerName} to introduce yourself</li>
          <li>Schedule your first session within the next week</li>
          <li>Review the program guide for Week 1 expectations</li>
          <li>Check your email each week for session reminders &amp; materials</li>
        </ul>
      </div>
 
      <div class="card">
        <h2>${tipsHeading}</h2>
        <ul class="prompts-list">
          ${tipsList.map((t) => `<li>${t}</li>`).join("")}
        </ul>
      </div>
 
      <div class="divider"></div>
      <p style="font-size:13px;color:#71717a;text-align:center">
        Need to report an issue with your match? Contact your program coordinator.
      </p>
    </div>
 
    ${footerHtml(programName)}
  </div>
</body>
</html>
  `.trim();
 
  const text = `
Hi ${recipientName},
 
You've been matched with your ${partnerRole}, ${partnerName} (${partnerEmail})!
 
WHAT HAPPENS NEXT
- Reach out to ${partnerName} to introduce yourself
- Schedule your first session within the next week
- Review the program guide for Week 1 expectations
- Check your email each week for session reminders & materials
${schedulingLink ? `\nSchedule your first session: ${schedulingLink}` : ""}
${firstSessionDate ? `\nFirst session: ${firstSessionDate}` : ""}
 
Match ID: ${matchId}
 
Questions? Reply to this email or contact your program coordinator.
 
— The ${programName} Team
  `.trim();
 
  return { subject, html, text };
}
 
// ─── weeklyReminderTemplate ───────────────────────────────────────────────────
 
/**
 * Generates a weekly session reminder email.
 * Odd weeks (1, 3, 5…) = Learning weeks (resources + assignment).
 * Even weeks (2, 4, 6…) = Discussion weeks (prompts + agenda).
 *
 * @param {Object} data
 * @param {string} data.recipientName
 * @param {"mentor"|"mentee"} data.role
 * @param {string} data.partnerName
 * @param {Object} data.week  - a WeekData object from weeklyData.js
 * @param {string} [data.sessionDate]
 * @param {string} [data.sessionLink]
 * @param {string} [data.programName]
 * @returns {{ subject: string, html: string, text: string }}
 */
export function weeklyReminderTemplate(data) {
  const {
    recipientName,
    role,
    partnerName,
    week,
    sessionDate,
    sessionLink,
    programName = "Mentorship Program",
  } = data;
 
  const isLearning = isLearningWeek(week.week);
  const weekTypeLabel = isLearning ? "Learning Week" : "Discussion Week";
  const badgeClass = isLearning ? "badge-learning" : "badge-discussion";
  const emoji = isLearning ? "📚" : "💬";
 
  const subject = `${emoji} Week ${week.week}: ${week.theme} — Your session is coming up`;
 
  // ── Resources section ──────────────────────────────────────────────────────
  const resourcesHtml =
    week.resources.length > 0
      ? `
    <div class="card">
      <h2>${isLearning ? "This Week's Resources" : "Reference Materials"}</h2>
      <ul class="resources-list">
        ${week.resources
          .map(
            (r) => `
          <li>
            ${r.url ? `<a href="${r.url}">${r.title}</a>` : `<strong>${r.title}</strong>`}
            ${r.description ? `<div class="desc">${r.description}</div>` : ""}
          </li>
        `
          )
          .join("")}
      </ul>
    </div>
  `
      : "";
 
  // ── Discussion prompts (even weeks only) ───────────────────────────────────
  const promptsHtml =
    !isLearning && week.discussionPrompts && week.discussionPrompts.length > 0
      ? `
    <div class="card">
      <h2>Discussion Prompts</h2>
      <p style="font-size:13px;color:#71717a;margin-bottom:14px">
        Use these to guide your conversation — no need to cover all of them.
      </p>
      <ul class="prompts-list">
        ${week.discussionPrompts.map((p) => `<li>${p}</li>`).join("")}
      </ul>
    </div>
  `
      : "";
 
  // ── Assignment (odd weeks only) ────────────────────────────────────────────
  const assignmentHtml =
    isLearning && week.assignment
      ? `
    <div class="card" style="border-color:#c4b5fd;background:#faf5ff;">
      <h2 style="color:#7c3aed;">📝 This Week's Assignment</h2>
      <p style="font-size:14px;line-height:1.65;color:#3f3f46;">${week.assignment}</p>
    </div>
  `
      : "";
 
  // ── Session info block ─────────────────────────────────────────────────────
  const sessionHtml =
    sessionDate || sessionLink
      ? `
    <div class="card">
      <h2>Your Session</h2>
      ${sessionDate ? `<div class="info-row"><span class="label">When</span><span class="value">${sessionDate}</span></div>` : ""}
      ${sessionLink ? `<div class="info-row"><span class="label">Link</span><span class="value"><a href="${sessionLink}" style="color:#6366f1">Join Session</a></span></div>` : ""}
    </div>
    ${sessionLink ? `<div class="cta-block"><a href="${sessionLink}" class="cta-btn">Join Session</a></div>` : ""}
  `
      : "";
 
  const partnerRole = role === "mentor" ? "mentee" : "mentor";
 
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
  ${BASE_STYLES}
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>${programName}</h1>
      <p class="sub">Week ${week.week} Session Reminder</p>
    </div>
    <div class="accent-bar"></div>
 
    <div class="body">
      <p class="greeting">Hi ${recipientName} 👋</p>
      <p class="intro">
        Your upcoming session with your ${partnerRole},
        <strong>${partnerName}</strong>, is just around the corner.
        Here's everything you need to know for Week ${week.week}.
      </p>
 
      <div class="card">
        <h2>This Week at a Glance</h2>
        <div class="info-row">
          <span class="label">Week</span>
          <span class="value">Week ${week.week} of 12</span>
        </div>
        <div class="info-row">
          <span class="label">Type</span>
          <span class="value">
            <span class="badge ${badgeClass}">${emoji} ${weekTypeLabel}</span>
          </span>
        </div>
        <div class="info-row">
          <span class="label">Theme</span>
          <span class="value">${week.theme}</span>
        </div>
      </div>
 
      <div class="card">
        <h2>Overview</h2>
        <p style="font-size:14px;line-height:1.65;color:#3f3f46;">${week.overview}</p>
        <div class="divider"></div>
        <h2 style="margin-top:0">Session Objectives</h2>
        <ul class="prompts-list">
          ${week.objectives.map((o) => `<li>${o}</li>`).join("")}
        </ul>
      </div>
 
      ${sessionHtml}
      ${resourcesHtml}
      ${promptsHtml}
      ${assignmentHtml}
 
      <div class="divider"></div>
      <p style="font-size:13px;color:#71717a;text-align:center">
        Need to reschedule? Reach out to ${partnerName} directly or contact your coordinator.
      </p>
    </div>
 
    ${footerHtml(programName)}
  </div>
</body>
</html>
  `.trim();
 
  const resourcesText =
    week.resources.length > 0
      ? `\nRESOURCES\n${week.resources
          .map(
            (r) =>
              `- ${r.title}${r.url ? ` (${r.url})` : ""}${r.description ? `\n  ${r.description}` : ""}`
          )
          .join("\n")}`
      : "";
 
  const promptsText =
    !isLearning && week.discussionPrompts
      ? `\nDISCUSSION PROMPTS\n${week.discussionPrompts.map((p) => `→ ${p}`).join("\n")}`
      : "";
 
  const assignmentText =
    isLearning && week.assignment ? `\nASSIGNMENT\n${week.assignment}` : "";
 
  const text = `
Hi ${recipientName},
 
Your Week ${week.week} session with ${partnerName} is coming up!
 
WEEK ${week.week}: ${week.theme.toUpperCase()}
Type: ${weekTypeLabel}
${sessionDate ? `When: ${sessionDate}` : ""}
${sessionLink ? `Link: ${sessionLink}` : ""}
 
OVERVIEW
${week.overview}
 
OBJECTIVES
${week.objectives.map((o) => `• ${o}`).join("\n")}
${resourcesText}
${promptsText}
${assignmentText}
 
Questions? Reply to this email or contact your program coordinator.
 
— The ${programName} Team
  `.trim();
 
  return { subject, html, text };
}