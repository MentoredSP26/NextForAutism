# Email Automation

This app sends email from Next.js API routes using Resend. It does not require paid Supabase Edge Functions.

## Environment Variables

- `RESEND_API_KEY`: required for real sends. If missing, emails run in dry-run mode.
- `EMAIL_FROM`: optional sender, for example `NEXT For Autism <program@yourdomain.org>`.
- `EMAIL_DRY_RUN`: set to `true` to log email attempts without sending.
- `SUPABASE_SERVICE_ROLE_KEY`: recommended for deployed email routes so server code can read matches and write `email_logs`.
- `CRON_SECRET`: required in production for `/api/cron/send-weekly-emails`.

## Routes

- `POST /api/email/send-match-confirmation` with `{ "match_id": "..." }`
- `POST /api/email/send-weekly-reminders` optionally with `{ "match_id": "...", "force": true, "dryRun": true }`
- `GET /api/cron/send-weekly-emails` for scheduled weekly sends

Weekly reminders skip a match/week if a sent `email_logs` row already exists. When both recipients are sent successfully, the match advances to the next week.

The manual email routes require an authenticated admin session. The cron route requires `Authorization: Bearer $CRON_SECRET` in production.

## Deployment Notes

Vercel cron is configured in `vercel.json` for Mondays at 16:00 UTC. Keep `EMAIL_DRY_RUN=true` until the nonprofit has verified the Resend sender/domain and tested with a real match.
