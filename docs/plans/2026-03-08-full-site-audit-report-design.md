# Full Site Audit Report — Design Doc

## Goal

When a user submits their email after a scan, analyze ALL PDFs found on their site, generate a comprehensive compliance report, and email them a link to a public report page. The report page is the conversion engine: full results + meeting scheduler + remediation CTA.

## Architecture

### Flow

1. User submits email (scan results page or demo CTA) → `/api/scan/email` stores lead, sets `report_status = 'pending'`
2. Supabase Edge Function (cron, every 60s) picks up pending reports
3. For each pending report: download and analyze up to 15 PDFs via existing Python API (`caso-comply-api.onrender.com/api/analyze`), 3 concurrent at a time
4. Store individual PDF results in `scan_pdfs` table, calculate overall score/grade, update `scans` row
5. Send short email via SendGrid with link to `/report/<scanId>`
6. Mark `report_status = 'sent'`

### Database Changes

**New table: `scan_pdfs`**
- `id` uuid PK
- `scan_id` uuid FK → scans
- `url` text
- `filename` text
- `score` integer
- `grade` text
- `issues` jsonb
- `checks` jsonb
- `page_count` integer
- `created_at` timestamptz

**Alter `scans` table:**
- Add `report_status` text (null, 'pending', 'processing', 'sent', 'failed')
- Add `overall_score` integer
- Add `overall_grade` text
- Add `view_count` integer default 0

### SendGrid Email

- From: configurable (env var)
- Subject: "Your PDF Compliance Audit — [domain]"
- Body: Overall grade, PDF count, one-line summary, big "View Full Report" button → `/report/<scanId>`
- No detailed results in email — drive traffic to the report page for conversion tracking

### Report Page (`/report/[scanId]`)

Public, no auth. UUID is unguessable and shareable.

**Sections:**
1. **Header** — CASO logo, "Compliance Audit Report", domain, scan date
2. **Overview card** — Overall grade (color-coded ring), score/100, PDFs found/analyzed, verdict line
3. **PDF results table** — Sorted worst-first. Each row: filename, score, grade badge, page count, top issue. Expandable detail with full checks.
4. **Common issues summary** — Aggregate most frequent issues across all PDFs (the "pain" section)
5. **CTA section** — "Schedule a Meeting" (Calendly placeholder), "Start Remediating" (→ /demo), "Share This Report" (copy link)

**Analytics:**
- Increment `view_count` on page load
- UTM-friendly URL structure

### Limits & Error Handling

- Cap: 15 PDFs per report (note "X more found on your site" if over)
- 3 concurrent PDF analyses to avoid overloading Python API
- Supabase Edge Function timeout: 150s — sufficient for 15 PDFs batched 3 at a time (~5-8s each)
- If a PDF fails to download or analyze, skip it and note in results
- If all PDFs fail, send email noting the issue with a "contact us" fallback

## Tech Stack

- Supabase Edge Function (Deno) — background job
- SendGrid (`@sendgrid/mail`) — email delivery
- Next.js dynamic route `/report/[scanId]` — report page
- Existing Python API — PDF analysis
- Supabase PostgreSQL — storage
