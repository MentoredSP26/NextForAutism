import { Resend } from "npm:resend"

const from = "Next For Autism <AutoEmail@nextforautism.org>"

export async function sendEmail({ to, subject, html }) {
  const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html
  })

  if (error) {
    return { success: false, error }
  } else {
    return { success: true, data }
  }
}