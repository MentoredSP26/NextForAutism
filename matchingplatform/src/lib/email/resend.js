const RESEND_ENDPOINT = "https://api.resend.com/emails";

export async function sendEmail({ to, subject, html, dryRun = false }) {
  if (!to) {
    return { success: false, error: "Recipient email is missing" };
  }

  const shouldDryRun = dryRun || process.env.EMAIL_DRY_RUN === "true" || !process.env.RESEND_API_KEY;
  if (shouldDryRun) {
    return {
      success: true,
      dryRun: true,
      data: { id: `dry-run-${Date.now()}` },
    };
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "NEXT For Autism <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { success: false, error: data };
  }

  return { success: true, data };
}
