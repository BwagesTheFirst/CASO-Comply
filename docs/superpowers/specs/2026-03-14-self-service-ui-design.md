# Self-Service UI Design

## Problem

Every customer needs access to the cloud-based self-service UI for uploading and remediating documents, regardless of whether they also use the Docker agent. The batch upload API exists but has no frontend. The upload page doesn't use the batch API. Trial limits need a soft wall (not a hard block) with a sales handoff.

## Decisions

- One service level per batch (no mixing)
- Single unified upload page handles 1 or 100 files using the batch API
- Soft wall at trial limit: documents visible and downloadable, uploads disabled, sales CTA
- Trial enforcement is page-count based (`tenant.trial_pages_used >= tenant.trial_pages_limit`)
- Stripe integration is out of scope (future)
- Docker agent service level selection is out of scope (uses plan-level config)

## Design

### 1. Upload Page Redesign (`/dashboard/remediate`)

Rewire the existing upload page to use the batch API instead of individual uploads.

**Flow:**
1. Pick service level (Standard $0.30/pg, Enhanced $1.80/pg, Expert $12.00/pg)
2. Drag-and-drop files (same UI as today)
3. Review: file count, service level, estimated cost
4. Submit: `POST /api/documents/batch` to create batch + upload files, then fire-and-forget `POST /api/documents/batch/[id]/process` to trigger processing
5. Redirect to `/dashboard/documents/batch/[id]` to watch progress

**Service level lock:** Disable the service level selector once files have been added to the upload queue. User must clear files to change level.

**Trial soft wall:** On mount, fetch tenant status via `/api/tenants/settings` (or a lightweight endpoint). If `trial_pages_used >= trial_pages_limit`, disable the drop zone. Show: "You've used all 10 trial pages. Your remediated documents are still available to download." CTA card with sales@casocomply.com.

**Changes to existing file:**
- Replace `handleSubmit` to use batch API
- Add trial limit check (fetch tenant info on mount)
- Lock service level selector when files are queued
- Redirect to batch detail page instead of documents list

### 2. New API Endpoint: GET `/api/documents/batch/[id]`

The batch detail page needs to fetch a single batch by ID. This endpoint does not exist yet.

**Create:** `src/app/api/documents/batch/[id]/route.ts` with a GET handler that:
- Authenticates the user and verifies tenant ownership
- Returns the batch record plus all its documents (joined via `batch_id`)
- Includes aggregated stats: completed count, failed count, total pages

### 3. Batch Detail Page (`/dashboard/documents/batch/[id]`)

New page showing a single batch's progress and results.

**Layout:**
- Header: batch name, service level badge, created date, status badge
- Progress bar: "X of Y files complete"
- Stats row: total files, total pages, completed, failed, estimated cost
- File table: filename, status badge, score before/after, pages, download action. Each row links to existing `/dashboard/documents/[id]` detail page.

**Behavior:**
- Fetch batch + documents via `GET /api/documents/batch/[id]`
- Auto-refresh every 5 seconds while batch status is "pending" or "processing"
- Stop polling when batch status is "completed" or "failed"

**Note on processing:** The batch process endpoint runs synchronously (all docs in one request). The batch may already be complete by the time the user lands on this page. The polling handles both cases: if complete, it shows final results immediately; if still processing (e.g., large batch), it updates live.

### 4. Documents List Updates (`/dashboard/documents`)

Add tab navigation at the top: "All Documents" | "Batches"

**All Documents tab:** Unchanged from current implementation.

**Batches tab:**
- List of batches: name, service level badge, file count (completed/total), status badge, date, link to batch detail page
- Fetches from `GET /api/documents/batch`

### 5. Trial Soft Wall (across all pages)

Trial enforcement uses `tenant.trial_pages_used` and `tenant.trial_pages_limit` from the tenants table. Each affected page fetches tenant info on mount to determine trial state.

When `trial_pages_used >= trial_pages_limit`:

| Page | Behavior |
|------|----------|
| Upload (`/remediate`) | Drop zone disabled, sales CTA shown |
| Documents list | Fully accessible, "Process Queued" button hidden |
| Document detail | Download works, "Start Remediation" / "Re-process" disabled with message |
| Dashboard home | Trial banner shows limit reached + sales CTA |

### 6. Files to Create

- `src/app/api/documents/batch/[id]/route.ts` — GET single batch with documents
- `src/app/dashboard/documents/batch/[id]/page.tsx` — Batch detail page

### 7. Files to Modify

- `src/app/dashboard/remediate/page.tsx` — Rewire to batch API, add trial soft wall, lock service level
- `src/app/dashboard/documents/page.tsx` — Add tabs (All Documents / Batches)
- `src/app/dashboard/documents/[id]/page.tsx` — Disable actions when trial limit reached
- `src/app/dashboard/page.tsx` — Update trial banner for limit-reached state
