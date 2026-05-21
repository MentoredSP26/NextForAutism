const BASE_STYLES = `
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; background: #f4f6f8; color: #18181b; }
    .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e4e4e7; }
    .header { background: #041e42; padding: 30px 36px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 22px; font-weight: 700; }
    .header p { color: #8bc8ff; font-size: 13px; margin-top: 4px; }
    .accent-bar { height: 4px; background: #cb333b; }
    .body { padding: 36px; }
    .greeting { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
    .intro { font-size: 15px; line-height: 1.65; color: #3f3f46; margin-bottom: 24px; }
    .card { background: #f9f9fb; border: 1px solid #e4e4e7; border-radius: 8px; padding: 22px; margin-bottom: 22px; }
    .card h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .6px; color: #cb333b; margin-bottom: 12px; }
    .info-row { padding: 8px 0; border-bottom: 1px solid #e4e4e7; font-size: 14px; }
    .info-row:last-child { border-bottom: none; }
    .label { color: #041e42; font-weight: 700; }
    .value { color: #0072ce; font-weight: 700; }
    .items-list, .prompts-list { list-style: none; padding: 0; }
    .items-list li, .prompts-list li { padding: 9px 0; border-bottom: 1px solid #e4e4e7; font-size: 14px; line-height: 1.5; }
    .items-list li:last-child, .prompts-list li:last-child { border-bottom: none; }
    a { color: #0072ce; text-decoration: none; font-weight: 700; }
    .footer-bar { background: #041e42; border-top: 1px solid #cb333b; padding: 22px 36px; text-align: center; }
    .footer-bar p { font-size: 12px; color: #ffffff; line-height: 1.6; }
  </style>
`;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function footerHtml() {
  return `
    <div class="footer-bar">
      <p>
        You are receiving this because you are part of <strong>NEXT For Autism</strong>.<br/>
        Questions? Reply to this email or contact your program coordinator.
      </p>
    </div>
  `;
}

export function matchConfirmationTemplate({ mentorName, menteeName }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${BASE_STYLES}
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>NEXT For Autism</h1>
      <p>Match Confirmation</p>
    </div>
    <div class="accent-bar"></div>
    <div class="body">
      <p class="greeting">You have been matched.</p>
      <p class="intro">
        We are excited to introduce your new co-mentor pair for NEXT Connects.
        This is the start of your mentorship journey together.
      </p>
      <div class="card">
        <h2>Your Match</h2>
        <div class="info-row"><span class="label">Established Professional:</span> <span class="value">${escapeHtml(mentorName)}</span></div>
        <div class="info-row"><span class="label">Aspiring Professional:</span> <span class="value">${escapeHtml(menteeName)}</span></div>
      </div>
      <div class="card">
        <h2>What Happens Next</h2>
        <ul class="prompts-list">
          <li>Reach out to your co-mentor to introduce yourself.</li>
          <li>Schedule your first session within the next week.</li>
          <li>Watch for weekly reminders and materials by email.</li>
          <li>Week 1 materials will arrive in your next reminder.</li>
        </ul>
      </div>
    </div>
    ${footerHtml()}
  </div>
</body>
</html>
  `.trim();
}

export function weeklyReminderTemplate({ recipientName, partnerName, weekNumber, weekData }) {
  const weekTypeLabel = weekData.type === "learning" ? "Learning Week" : "Discussion Week";
  const itemsHtml = weekData.items
    .map((item) => {
      const text = escapeHtml(item.text);
      return item.link
        ? `<li><a href="${escapeHtml(item.link)}">${text}</a></li>`
        : `<li>${text}</li>`;
    })
    .join("");
  const footerNote = weekData.footer
    ? `<p style="font-size:13px;color:#0072ce;text-align:center;margin-top:16px">${escapeHtml(weekData.footer)}</p>`
    : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${BASE_STYLES}
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>NEXT For Autism</h1>
      <p>Week ${escapeHtml(weekNumber)} - ${weekTypeLabel}</p>
    </div>
    <div class="accent-bar"></div>
    <div class="body">
      <p class="greeting">Hi ${escapeHtml(recipientName)},</p>
      <p class="intro">
        ${escapeHtml(weekData.description)} Your co-mentor this week is <strong>${escapeHtml(partnerName)}</strong>.
      </p>
      <div class="card">
        <h2>This Week's Materials</h2>
        <ul class="items-list">
          ${itemsHtml}
        </ul>
      </div>
      ${footerNote}
    </div>
    ${footerHtml()}
  </div>
</body>
</html>
  `.trim();
}
