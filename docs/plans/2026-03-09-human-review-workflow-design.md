# Human Review Workflow — Design Document

**Date:** 2026-03-09
**Status:** Approved

## Problem

When a Docker agent on the Human Review plan ($4.00/page) processes a PDF and the AI remediation scores below the threshold (default 70), the file needs expert human review. Today the agent sets `needs_review=True` but nothing happens — the flag is never persisted or acted on.

## Solution

Automatically upload low-scoring files from the customer's Docker agent to CASO via the API. CASO team reviews and fixes them in Acrobat, uploads the corrected version. The agent automatically downloads corrected files and overwrites the AI-remediated version. Customer does nothing — files just appear fixed.

## Data Flow

```
Customer's Docker Agent                    CASO Cloud (Render + Supabase)                CASO Team
─────────────────────                      ──────────────────────────────                ─────────
1. Agent processes PDF
2. AI score comes back < threshold
3. Agent POSTs file to                 →   4. API stores file in Supabase Storage
   /api/review/submit                      5. Creates row in review_queue table
                                           6. Status: "pending"
                                                                                    ←   7. Admin sees it in Review Queue page
                                                                                        8. Downloads PDF, fixes in Acrobat
                                                                                    →   9. Uploads corrected file via admin UI
                                           10. Corrected file stored in Supabase
                                           11. Status: "completed"
12. Agent polls /api/review/pending    →   13. Returns list of completed reviews
14. Agent downloads corrected file     ←   15. Serves file from Supabase Storage
15. Agent writes to same output path
    (overwrites AI-remediated version)
16. Agent marks review as "delivered"  →   17. Status: "delivered"
```

## Database: `review_queue` Table

```sql
CREATE TABLE review_queue (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  filename        TEXT NOT NULL,
  original_path   TEXT NOT NULL,
  output_path     TEXT NOT NULL,
  ai_score        INTEGER NOT NULL,
  page_count      INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'in_review', 'completed', 'delivered')),
  storage_path    TEXT NOT NULL,
  corrected_path  TEXT,
  reviewer_notes  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at    TIMESTAMPTZ,
  delivered_at    TIMESTAMPTZ
);

CREATE INDEX idx_review_queue_tenant_status ON review_queue(tenant_id, status);
CREATE INDEX idx_review_queue_status ON review_queue(status);
```

New column on `subscription_plans`:
```sql
ALTER TABLE subscription_plans ADD COLUMN review_score_threshold INTEGER DEFAULT 70;
```

## Supabase Storage

Bucket: `review-files`

Path convention:
- `{tenant_id}/{review_id}/original.pdf`
- `{tenant_id}/{review_id}/corrected.pdf`

## API Endpoints (Render FastAPI Service)

### Agent-facing

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/review/submit` | POST | Bearer key | Upload low-scoring file + metadata, creates review_queue row |
| `/api/review/pending` | GET | Bearer key | Returns completed reviews for this tenant (ready to download) |
| `/api/review/{id}/download-corrected` | GET | Bearer key | Download the corrected file |
| `/api/review/{id}/delivered` | POST | Bearer key | Mark review as delivered after downloading |

### Admin-facing

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/review/queue` | GET | Admin session | List all reviews across all tenants |
| `/api/review/{id}/download` | GET | Admin session | Download the original file to review |
| `/api/review/{id}/start` | POST | Admin session | Set status to in_review |
| `/api/review/{id}/release` | POST | Admin session | Set status back to pending |
| `/api/review/{id}/complete` | POST | Admin session | Upload corrected file, set status to completed |

## License Validation Response Change

Add `review_score_threshold` to the `/api/license/validate` response:

```json
{
  "valid": true,
  "org": "Acme Corp",
  "plan": "Human Review",
  "pages_used": 1234,
  "features": { "human_review": true, ... },
  "review_score_threshold": 70
}
```

## Agent Changes

### 1. Processor: Submit on low score

In `processor.py` `_process_local()`, when plan is "Human Review" and `after_score < threshold`:
- POST the AI-remediated file to `/api/review/submit`
- Update local SQLite status to `review_pending`
- Log that file was submitted for human review

### 2. Scan cycle: Poll for completed reviews

New step at the end of `run_scan_cycle()` in `main.py`:
- `GET /api/review/pending` — returns completed reviews for this tenant
- For each: download corrected file, write to `output_path` (overwrite AI version)
- `POST /api/review/{id}/delivered`
- Update local SQLite status to `completed`

### 3. Local DB: New status value

Add `review_pending` as a valid status in the `pdfs` table so the agent doesn't resubmit files on the next scan cycle.

## Admin UI

New page: `/dashboard/admin/reviews`

Table columns: Tenant | Filename | AI Score | Pages | Status | Submitted | Actions

Status badges:
- **pending** (orange) — waiting for pickup
- **in_review** (blue) — someone is working on it
- **completed** (green) — corrected file uploaded, waiting for agent
- **delivered** (gray) — agent downloaded it, done

Actions:
- Pending → "Start Review" (downloads file + sets in_review)
- In Review → "Upload Corrected" (file upload + notes) + "Release" (back to pending)
- Completed/Delivered → view only

## File Return Behavior

The corrected file overwrites the AI-remediated version at the same `output_path` the agent originally wrote to. Whatever output mode the customer configured (directory, suffix, overwrite), the human-reviewed file replaces the AI version at that destination. The customer's existing setup (web server, file sync, etc.) picks it up automatically.

## What's NOT in Scope

- Email notifications (can add later)
- In-browser PDF editing (use Acrobat)
- SLA tracking or deadline enforcement
- Batch operations (one file at a time)
- Customer-facing review status page (agent handles everything silently)
