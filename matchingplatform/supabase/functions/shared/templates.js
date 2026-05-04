const BASE_STYLES = `
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #f4f4f5; color: #18181b; }
    .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
    .header { background: #18181b; padding: 32px 40px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 22px; font-weight: 700; }
    .header p { color: #a1a1aa; font-size: 13px; margin-top: 4px; }
    .accent-bar { height: 4px; background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%); }
    .body { padding: 40px; }
    .greeting { font-size: 16px; font-weight: 600; margin-bottom: 16px; }
    .intro { font-size: 15px; line-height: 1.65; color: #3f3f46; margin-bottom: 28px; }
    .card { background: #f9f9fb; border: 1px solid #e4e4e7; border-radius: 8px; padding: 24px; margin-bottom: 24px; }
    .card h2 { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #6366f1; margin-bottom: 14px; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e4e4e7; font-size: 14px; }
    .info-row:last-child { border-bottom: none; }
    .info-row .label { color: #71717a; font-weight: 500; }
    .info-row .value { font-weight: 600; color: #18181b; }
    .items-list { list-style: none; padding: 0; }
    .items-list li { padding: 10px 0; border-bottom: 1px solid #e4e4e7; font-size: 14px; }
    .items-list li:last-child { border-bottom: none; }
    .items-list a { color: #6366f1; text-decoration: none; font-weight: 500; }
    .prompts-list { list-style: none; padding: 0; }
    .prompts-list li { display: flex; gap: 10px; padding: 8px 0; font-size: 14px; line-height: 1.55; color: #3f3f46; }
    .prompts-list li::before { content: "→"; color: #8b5cf6; font-weight: 700; flex-shrink: 0; }
    .divider { height: 1px; background: #e4e4e7; margin: 24px 0; }
    .footer-bar { background: #fafafa; border-top: 1px solid #e4e4e7; padding: 24px 40px; text-align: center; }
    .footer-bar p { font-size: 12px; color: #a1a1aa; line-height: 1.6; }
  </style>
`

function footerHtml() {
  return `
    <div class="footer-bar">
      <p>
        You're receiving this because you're part of <strong>NEXT Connects</strong>.<br/>
        Questions? Reply to this email or contact your program coordinator.
      </p>
    </div>
  `
}

export function matchConfirmationTemplate({ mentorName, menteeName }) {
  const html = `
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
      <h1>NEXT Connects</h1>
      <p>Match Confirmation</p>
    </div>
    <div class="accent-bar"></div>
    <div class="body">
      <p class="greeting">🎉 You've been matched!</p>
      <p class="intro">
        We're excited to introduce your new co-mentor pair for NEXT Connects.
        This is the start of a great mentorship journey together!
      </p>
      <div class="card">
        <h2>Your Match</h2>
        <div class="info-row">
          <span class="label">Mentor</span>
          <span class="value">${mentorName}</span>
        </div>
        <div class="info-row">
          <span class="label">Mentee</span>
          <span class="value">${menteeName}</span>
        </div>
      </div>
      <div class="card">
        <h2>What Happens Next</h2>
        <ul class="prompts-list">
          <li>Reach out to your co-mentor to introduce yourself</li>
          <li>Schedule your first session within the next week</li>
          <li>Check your email each week for session reminders and materials</li>
          <li>Week 1 materials will arrive in your next email!</li>
        </ul>
      </div>
    </div>
    ${footerHtml()}
  </div>
</body>
</html>
  `.trim()

  return html
}

export function weeklyReminderTemplate({ recipientName, partnerName, weekNumber, weekData }) {
  const isLearning = weekData.type === "learning"
  const weekTypeLabel = isLearning ? "Learning Week" : "Discussion Week"
  const emoji = isLearning ? "📚" : "💬"

  const itemsHtml = weekData.items.map(item => {
    if (item.link) {
      return `<li><a href="${item.link}">${item.text}</a></li>`
    }
    return `<li>${item.text}</li>`
  }).join("")

  const footerNote = weekData.footer
    ? `<p style="font-size:13px;color:#71717a;text-align:center;margin-top:16px">${weekData.footer}</p>`
    : ""

  const html = `
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
      <h1>NEXT Connects</h1>
      <p>${emoji} Week ${weekNumber} — ${weekTypeLabel}</p>
    </div>
    <div class="accent-bar"></div>
    <div class="body">
      <p class="greeting">Hi ${recipientName} 👋</p>
      <p class="intro">
        ${weekData.description} Your co-mentor this week is <strong>${partnerName}</strong>.
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
  `.trim()

  return html
}