import { sendEmail } from "../shared/resend.js";
import { weeklyReminderTemplate } from "../shared/templates.js"
import { createClient } from 'npm:@supabase/supabase-js'
import { weeks } from "../shared/weekData.js"

Deno.serve(async (req) => {
    try {
        const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"))

        const { data: matches, error: matchesError } = await supabase.from("matches").select(`id, current_week,
            aspiring:profiles!matches_aspiring_id_fkey (email, full_name),
            established:profiles!matches_established_id_fkey (email, full_name)`).eq("status", "active")

        if (matchesError) {
            return new Response(matchesError.message, { status: 500 })
        }

        if (!matches || matches.length === 0) {
            return new Response("No active matches found", { status: 200 }) 
        }

        for (const match of matches) {
            const weekIndex = match.current_week - 1
            if (weekIndex < 0 || weekIndex >= weeks.length) continue
            const weekData = weeks[weekIndex]
            const mentee = match.aspiring
            const mentor = match.established

            const recipients = [
                { email: mentor.email, name: mentor.full_name, partnerName: mentee.full_name },
                { email: mentee.email, name: mentee.full_name, partnerName: mentor.full_name }
            ]

            for (const recipient of recipients) {
                const html = weeklyReminderTemplate({
                recipientName: recipient.name,
                partnerName: recipient.partnerName,
                weekNumber: match.current_week,
                weekData
                });

                const result = await sendEmail({
                to: recipient.email,
                subject: weekData.subject,
                html,
                recipientName: recipient.name
                });

                await supabase.from("email_logs").insert({
                match_id: match.id,
                recipient_email: recipient.email,
                recipient_name: recipient.name,
                email_type: "weekly_reminder",
                week_number: match.current_week,
                status: result.success ? "sent" : "failed",
                resend_id: result.success ? result.data.id : null,
                error_message: result.success ? null : JSON.stringify(result.error)
                })
            }
        }
        return new Response(JSON.stringify({ success: true, processed: matches.length }), { status: 200 })
    } catch (err) {
        return new Response(err.message, { status: 500 })
    }
})
