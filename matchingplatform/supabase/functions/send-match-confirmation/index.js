import { createClient } from "npm:@supabase/supabase-js"
import { sendEmail } from "../shared/resend.js"
import { matchConfirmationTemplate } from "../shared/templates.js"

Deno.serve(async (req) => {
    try {
        const { match_id } = await req.json()

        if (!match_id) {
            return new Response("match_id is required", { status: 400 })
        }

        const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"))

        const { data: match, error: matchError } = await supabase.from("matches").select(`id, 
            aspiring_professionals(profile_id, profiles (email, full_name)),
            established_professionals(profile_id, profiles (email, full_name))`).eq("id", match_id).single()

        if (matchError || !match) {
            return new Response("Match not found", { status: 404 })
        }

        const mentee = match.aspiring_professionals.profiles
        const mentor = match.established_professionals.profiles

        const html = matchConfirmationTemplate({
            mentorName: mentor.full_name,
            menteeName: mentee.full_name
        })

        const recipients = [
            { email: mentor.email, name: mentor.full_name },
            { email: mentee.email, name: mentee.full_name }
        ]

        for (const recipient of recipients) {
            const result = await sendEmail({
            to: recipient.email,
            subject: "You've been matched on NEXT Connects!",
            html,
            recipientName: recipient.name
            })

            await supabase.from("email_logs").insert({
            match_id: match.id,
            recipient_email: recipient.email,
            recipient_name: recipient.name,
            email_type: "match_confirmation",
            week_number: null,
            status: result.success ? "sent" : "failed",
            resend_id: result.success ? result.data.id : null,
            error_message: result.success ? null : JSON.stringify(result.error)
            })
        }
    return new Response("Match confirmation emails sent", { status: 200 })
      } catch (err) {
        return new Response(err.message, { status: 500 })
      }
})