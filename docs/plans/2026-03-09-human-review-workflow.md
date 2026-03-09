# Human Review Workflow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** When a Docker agent on the Human Review plan processes a PDF that scores below threshold, automatically upload it for CASO team review, then deliver the corrected file back to the customer's output directory.

**Architecture:** Supabase Storage holds files persistently (Render disk is ephemeral). A `review_queue` table tracks status through pending → in_review → completed → delivered. The Docker agent submits low-scoring files at the end of processing and polls for completed reviews at the end of each scan cycle. Admin dashboard provides a simple queue UI for CASO team to download, fix, and upload corrected files.

**Tech Stack:** Supabase (PostgreSQL + Storage), FastAPI (api-service on Render), Python Docker agent, Next.js 15 + TypeScript admin dashboard

**Design doc:** `docs/plans/2026-03-09-human-review-workflow-design.md`

---

### Task 1: Supabase Migration — review_queue table + plan threshold

**Files:**
- Create: `supabase/migrations/009_human_review_queue.sql`

**Step 1: Write the migration**

```sql
-- 009_human_review_queue.sql
-- Human Review workflow: queue table, score threshold, storage bucket

-- 1. Review queue table
CREATE TABLE IF NOT EXISTS review_queue (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
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

-- 2. Add review score threshold to plans
ALTER TABLE subscription_plans
  ADD COLUMN IF NOT EXISTS review_score_threshold INTEGER DEFAULT 70;

-- 3. Enable RLS on review_queue (service role bypasses, but good hygiene)
ALTER TABLE review_queue ENABLE ROW LEVEL SECURITY;

-- 4. Insert Supabase Storage bucket via SQL
-- Note: This may need to be done via Supabase dashboard if SQL insert is not supported.
-- The bucket name is 'review-files' with public=false.
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-files', 'review-files', false)
ON CONFLICT (id) DO NOTHING;
```

**Step 2: Run the migration on Supabase**

```bash
# From the project root, using the Supabase CLI or dashboard SQL editor
# Copy the contents of supabase/migrations/009_human_review_queue.sql
# and run it in the Supabase SQL editor at:
# https://supabase.com/dashboard/project/ukiujsqpjhhksduaolrp/sql
```

Expected: Table `review_queue` created, `review_score_threshold` column added to `subscription_plans`, `review-files` storage bucket created.

**Step 3: Verify in Supabase dashboard**
- Table Editor: `review_queue` should appear
- Storage: `review-files` bucket should appear
- `subscription_plans`: new column `review_score_threshold` with default 70

**Step 4: Commit**

```bash
git add supabase/migrations/009_human_review_queue.sql
git commit -m "feat: add review_queue table and storage bucket migration"
```

---

### Task 2: API — Review submit endpoint (agent uploads low-scoring file)

**Files:**
- Modify: `api-service/main.py` — add `POST /api/review/submit`
- Modify: `api-service/auth.py` — no changes needed, reuse `validate_api_key` + `enforce_tenant_access`

**Context:** The Docker agent calls this endpoint when a PDF scores below the threshold. It sends the file + metadata. The endpoint stores the file in Supabase Storage and creates a `review_queue` row.

**Step 1: Add Supabase Storage helper at the top of main.py**

After the existing imports in `api-service/main.py` (around line 20), add:

```python
from supabase import create_client

def _get_supabase_admin():
    """Return a Supabase client using service role key for Storage access."""
    import os
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required")
    return create_client(url, key)
```

Note: `auth.py` already has `_get_supabase()` but it's private to that module. We create a similar one here, or refactor later. Keep it simple for now.

**Step 2: Add the Pydantic model for review submission**

After the existing `LicenseUsageRequest` model (around line 169), add:

```python
class ReviewSubmitResponse(BaseModel):
    review_id: str
    status: str
```

**Step 3: Add the POST /api/review/submit endpoint**

After the `/api/license/usage` endpoint (around line 272), add:

```python
@app.post("/api/review/submit")
async def review_submit(
    file: UploadFile = File(...),
    filename: str = Query(..., description="Original filename"),
    original_path: str = Query(..., description="Path on customer's machine"),
    output_path: str = Query(..., description="Where the AI-remediated file was written"),
    ai_score: int = Query(..., description="Score after AI remediation"),
    page_count: int = Query(0, description="Number of pages"),
    authorization: str | None = Header(None),
):
    """
    Docker agent submits a low-scoring file for human review.

    Stores the file in Supabase Storage and creates a review_queue row.
    """
    auth_ctx = validate_api_key(authorization or "")
    enforce_tenant_access(auth_ctx["tenant_id"], required_scope="api_access")

    sb = _get_supabase_admin()

    # 1. Create the review_queue row first to get the ID
    insert_result = sb.table("review_queue").insert({
        "tenant_id": auth_ctx["tenant_id"],
        "filename": filename,
        "original_path": original_path,
        "output_path": output_path,
        "ai_score": ai_score,
        "page_count": page_count,
        "status": "pending",
        "storage_path": "",  # will update after upload
    }).execute()

    if not insert_result.data:
        raise HTTPException(status_code=500, detail="Failed to create review queue entry")

    review_id = insert_result.data[0]["id"]

    # 2. Upload file to Supabase Storage
    storage_path = f"{auth_ctx['tenant_id']}/{review_id}/original.pdf"
    file_bytes = await file.read()

    sb.storage.from_("review-files").upload(
        path=storage_path,
        file=file_bytes,
        file_options={"content-type": "application/pdf"},
    )

    # 3. Update the row with the storage path
    sb.table("review_queue").update({
        "storage_path": storage_path,
    }).eq("id", review_id).execute()

    logger.info(
        "Review submitted: %s (score %d) for tenant %s → %s",
        filename, ai_score, auth_ctx["tenant_id"], review_id,
    )

    return {"review_id": review_id, "status": "pending"}
```

**Step 4: Test manually with curl**

```bash
curl -X POST "https://caso-comply-api.onrender.com/api/review/submit" \
  -H "Authorization: Bearer caso_ak_YOUR_KEY" \
  -F "file=@test.pdf" \
  -F "filename=test.pdf" \
  -F "original_path=/data/input/test.pdf" \
  -F "output_path=/data/remediated/test.pdf" \
  -F "ai_score=55" \
  -F "page_count=5"
```

Expected: `{"review_id": "some-uuid", "status": "pending"}`

**Step 5: Commit**

```bash
git add api-service/main.py
git commit -m "feat: add POST /api/review/submit endpoint for human review"
```

---

### Task 3: API — Review queue list + download endpoints (admin-facing)

**Files:**
- Modify: `api-service/main.py` — add `GET /api/review/queue`, `GET /api/review/{id}/download`, `POST /api/review/{id}/start`, `POST /api/review/{id}/release`

**Step 1: Add GET /api/review/queue**

```python
@app.get("/api/review/queue")
async def review_queue_list(
    status: str | None = Query(None, description="Filter by status"),
    authorization: str | None = Header(None),
):
    """List review queue items. Admin only (enforced by frontend auth)."""
    # Note: This endpoint will be called by the Next.js admin dashboard
    # which authenticates via Supabase session. For now, require a valid API key
    # or allow unauthenticated access (the Next.js API route will proxy with auth).

    sb = _get_supabase_admin()

    query = sb.table("review_queue").select(
        "*, tenants(name)"
    ).order("created_at", desc=False)

    if status:
        query = query.eq("status", status)

    result = query.execute()

    return {"reviews": result.data or []}
```

**Step 2: Add GET /api/review/{id}/download**

```python
@app.get("/api/review/{review_id}/download")
async def review_download_original(review_id: str):
    """Download the original (low-scoring) file for review."""
    sb = _get_supabase_admin()

    # Look up the review
    result = sb.table("review_queue").select("*").eq("id", review_id).limit(1).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Review not found")

    review = result.data[0]

    # Download from Supabase Storage
    file_bytes = sb.storage.from_("review-files").download(review["storage_path"])

    from fastapi.responses import Response
    return Response(
        content=file_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{review["filename"]}"'
        },
    )
```

**Step 3: Add POST /api/review/{id}/start and /release**

```python
@app.post("/api/review/{review_id}/start")
async def review_start(review_id: str):
    """Mark a review as in_review (someone is working on it)."""
    sb = _get_supabase_admin()

    result = sb.table("review_queue").update({
        "status": "in_review",
    }).eq("id", review_id).eq("status", "pending").execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Review not found or not in pending status")

    return {"status": "in_review"}


@app.post("/api/review/{review_id}/release")
async def review_release(review_id: str):
    """Release a review back to pending (e.g., grabbed by mistake)."""
    sb = _get_supabase_admin()

    result = sb.table("review_queue").update({
        "status": "pending",
    }).eq("id", review_id).eq("status", "in_review").execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Review not found or not in_review status")

    return {"status": "pending"}
```

**Step 4: Commit**

```bash
git add api-service/main.py
git commit -m "feat: add admin review queue list, download, start, release endpoints"
```

---

### Task 4: API — Review complete endpoint (admin uploads corrected file)

**Files:**
- Modify: `api-service/main.py` — add `POST /api/review/{id}/complete`

**Step 1: Add the complete endpoint**

```python
@app.post("/api/review/{review_id}/complete")
async def review_complete(
    review_id: str,
    file: UploadFile = File(...),
    notes: str = Query("", description="Optional reviewer notes"),
):
    """Upload the corrected file and mark the review as completed."""
    sb = _get_supabase_admin()

    # Verify the review exists and is in_review
    result = sb.table("review_queue").select("*").eq("id", review_id).limit(1).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Review not found")

    review = result.data[0]
    if review["status"] not in ("pending", "in_review"):
        raise HTTPException(status_code=400, detail=f"Cannot complete review in '{review['status']}' status")

    # Upload corrected file to Supabase Storage
    corrected_path = f"{review['tenant_id']}/{review_id}/corrected.pdf"
    file_bytes = await file.read()

    sb.storage.from_("review-files").upload(
        path=corrected_path,
        file=file_bytes,
        file_options={"content-type": "application/pdf"},
    )

    # Update the review_queue row
    from datetime import datetime, timezone
    sb.table("review_queue").update({
        "status": "completed",
        "corrected_path": corrected_path,
        "reviewer_notes": notes or None,
        "completed_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", review_id).execute()

    logger.info("Review %s completed for %s", review_id, review["filename"])

    return {"status": "completed", "review_id": review_id}
```

**Step 2: Commit**

```bash
git add api-service/main.py
git commit -m "feat: add POST /api/review/{id}/complete for uploading corrected files"
```

---

### Task 5: API — Agent-facing pending + download-corrected + delivered endpoints

**Files:**
- Modify: `api-service/main.py` — add `GET /api/review/pending`, `GET /api/review/{id}/download-corrected`, `POST /api/review/{id}/delivered`

**Context:** These are called by the Docker agent during its scan cycle to pick up completed reviews.

**Step 1: Add GET /api/review/pending**

```python
@app.get("/api/review/pending")
async def review_pending(
    authorization: str | None = Header(None),
):
    """
    Returns completed reviews for this tenant (ready for agent to download).

    The agent calls this at the end of each scan cycle.
    """
    auth_ctx = validate_api_key(authorization or "")

    sb = _get_supabase_admin()

    result = sb.table("review_queue").select("*").eq(
        "tenant_id", auth_ctx["tenant_id"]
    ).eq("status", "completed").execute()

    return {"reviews": result.data or []}
```

**Step 2: Add GET /api/review/{id}/download-corrected**

```python
@app.get("/api/review/{review_id}/download-corrected")
async def review_download_corrected(
    review_id: str,
    authorization: str | None = Header(None),
):
    """Download the corrected file. Called by the Docker agent."""
    auth_ctx = validate_api_key(authorization or "")

    sb = _get_supabase_admin()

    result = sb.table("review_queue").select("*").eq("id", review_id).limit(1).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Review not found")

    review = result.data[0]

    # Verify tenant owns this review
    if review["tenant_id"] != auth_ctx["tenant_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    if not review.get("corrected_path"):
        raise HTTPException(status_code=404, detail="Corrected file not yet uploaded")

    file_bytes = sb.storage.from_("review-files").download(review["corrected_path"])

    from fastapi.responses import Response
    return Response(
        content=file_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{review["filename"]}"'
        },
    )
```

**Step 3: Add POST /api/review/{id}/delivered**

```python
@app.post("/api/review/{review_id}/delivered")
async def review_delivered(
    review_id: str,
    authorization: str | None = Header(None),
):
    """Agent confirms it has downloaded and placed the corrected file."""
    auth_ctx = validate_api_key(authorization or "")

    sb = _get_supabase_admin()

    from datetime import datetime, timezone
    result = sb.table("review_queue").update({
        "status": "delivered",
        "delivered_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", review_id).eq("tenant_id", auth_ctx["tenant_id"]).eq("status", "completed").execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Review not found or not in completed status")

    logger.info("Review %s delivered to agent for tenant %s", review_id, auth_ctx["tenant_id"])

    return {"status": "delivered"}
```

**Step 4: Commit**

```bash
git add api-service/main.py
git commit -m "feat: add agent-facing review pending, download-corrected, delivered endpoints"
```

---

### Task 6: API — Add review_score_threshold to license validation response

**Files:**
- Modify: `api-service/main.py:214-220` — add threshold to validate response
- Modify: `api-service/auth.py:248-256` — include threshold in enforce_tenant_access query

**Step 1: Update enforce_tenant_access to fetch review_score_threshold**

In `api-service/auth.py`, the `enforce_tenant_access` function queries subscription_plans at around line 252. The select string already includes many plan fields. Add `review_score_threshold` to the select:

Find the select string (around line 253):
```python
"subscription_plans(id, name, pages_included, features, overage_rate_cents, "
"standard_rate_cents, ai_verified_rate_cents, human_review_rate_cents)"
```

Change to:
```python
"subscription_plans(id, name, pages_included, features, overage_rate_cents, "
"standard_rate_cents, ai_verified_rate_cents, human_review_rate_cents, review_score_threshold)"
```

**Step 2: Update the license/validate response in main.py**

In `api-service/main.py`, the `/api/license/validate` endpoint returns a dict around line 214. Change:

```python
return {
    "valid": True,
    "org": tenant_info["org_name"],
    "plan": tenant_info["plan_name"],
    "pages_used": tenant_info["pages_used"],
    "features": tenant_info.get("features", {}),
}
```

To:

```python
# Get the plan dict from enforce_tenant_access for threshold
plan = tenant_info.get("plan", {})
threshold = plan.get("review_score_threshold", 70) if isinstance(plan, dict) else 70

return {
    "valid": True,
    "org": tenant_info["org_name"],
    "plan": tenant_info["plan_name"],
    "pages_used": tenant_info["pages_used"],
    "features": tenant_info.get("features", {}),
    "review_score_threshold": threshold,
}
```

Note: `enforce_tenant_access` currently does not return the full plan dict in its return value, only `plan_name`. We need to also add the plan object to the return. In `auth.py` around line 348, add `"plan": plan,` to the return dict (where `plan = tenant.get("subscription_plans") or {}`).

**Step 3: Commit**

```bash
git add api-service/main.py api-service/auth.py
git commit -m "feat: include review_score_threshold in license validation response"
```

---

### Task 7: Agent — LicenseClient reads review_score_threshold

**Files:**
- Modify: `agent/agent/license.py:24-26` — add review_score_threshold property

**Step 1: Add the property**

After the `plan_name` property (line 24-26 of `agent/agent/license.py`), add:

```python
@property
def review_score_threshold(self) -> int:
    return self._data.get("review_score_threshold", 70)
```

**Step 2: Commit**

```bash
git add agent/agent/license.py
git commit -m "feat: agent reads review_score_threshold from license validation"
```

---

### Task 8: Agent — Processor submits low-scoring files for human review

**Files:**
- Modify: `agent/agent/processor.py:104-139` — add review submission logic after the needs_review check

**Context:** Currently at line 107-113, when `plan_name == "Human Review"` and `after_score < 60`, the code sets `needs_review = True` and logs a warning. We need to:
1. Change the threshold from hardcoded 60 to `self.license_client.review_score_threshold`
2. Actually upload the file to the review API
3. Update local DB status to `review_pending`

**Step 1: Add the _submit_for_review method to Processor**

After the `_report_usage` method (around line 63), add:

```python
async def _submit_for_review(
    self, pdf_path: str, output_path: str, ai_score: int, page_count: int,
) -> bool:
    """Upload a low-scoring file to CASO for human review. Returns True on success."""
    if not self.config.license_key:
        logger.debug("No license key — skipping review submission")
        return False
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            with open(output_path, "rb") as f:
                resp = await client.post(
                    f"{self.config.caso_api_url}/api/review/submit",
                    files={"file": (Path(pdf_path).name, f, "application/pdf")},
                    params={
                        "filename": Path(pdf_path).name,
                        "original_path": pdf_path,
                        "output_path": output_path,
                        "ai_score": ai_score,
                        "page_count": page_count,
                    },
                    headers={"Authorization": f"Bearer {self.config.license_key}"},
                )
            if resp.status_code == 200:
                data = resp.json()
                logger.info(
                    "Submitted %s for human review (score %d) → review_id=%s",
                    Path(pdf_path).name, ai_score, data.get("review_id"),
                )
                return True
            else:
                logger.warning(
                    "Review submission failed for %s: %d %s",
                    Path(pdf_path).name, resp.status_code, resp.text,
                )
                return False
    except Exception:
        logger.warning("Failed to submit %s for review — will retry next cycle", Path(pdf_path).name)
        return False
```

**Step 2: Update the needs_review logic in _process_local**

Replace the current threshold check (lines 104-118) with:

```python
        # Determine remediation type based on plan and score
        remediation_type = "ai_verified" if verify else "standard"
        needs_review = False

        # Get threshold from license (default 70)
        threshold = self.license_client.review_score_threshold if self.license_client else 70

        # Human Review plan: submit files scoring below threshold for human review
        if plan_name == "Human Review" and after_score < threshold:
            remediation_type = "human_review"
            needs_review = True
            logger.warning(
                "PDF %s flagged for human review: after_score=%d (below %d, plan: %s)",
                Path(pdf_path).name, after_score, threshold, plan_name,
            )
        elif after_score < threshold:
            logger.warning(
                "PDF %s has low score after remediation: after_score=%d (plan: %s)",
                Path(pdf_path).name, after_score, plan_name,
            )
```

Then, after `await self._report_usage(...)` (around line 131), add:

```python
        # Submit for human review if flagged
        if needs_review:
            submitted = await self._submit_for_review(
                pdf_path, output_path, after_score, page_count,
            )
            if submitted:
                await self.db.update_result(
                    path=pdf_path, status="review_pending",
                )
```

**Step 3: Update db.py to accept review_pending status**

The `update_result` method in `agent/agent/db.py` (line 71) does a simple UPDATE. The `status` field has no CHECK constraint in SQLite (it's just TEXT), so `review_pending` will work without schema changes. No modification needed.

**Step 4: Commit**

```bash
git add agent/agent/processor.py
git commit -m "feat: agent submits low-scoring files for human review via API"
```

---

### Task 9: Agent — Poll for completed reviews in scan cycle

**Files:**
- Modify: `agent/agent/main.py:24-48` — add review polling at end of `run_scan_cycle()`

**Step 1: Add _fetch_completed_reviews helper to main.py**

At the top of `agent/agent/main.py`, after imports, add:

```python
async def _fetch_completed_reviews(config, db, license_client):
    """Poll for completed human reviews and download corrected files."""
    if not config.license_key or not license_client:
        return

    plan_name = license_client.plan_name
    if plan_name != "Human Review":
        return

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            # 1. Get completed reviews
            resp = await client.get(
                f"{config.caso_api_url}/api/review/pending",
                headers={"Authorization": f"Bearer {config.license_key}"},
            )
            if resp.status_code != 200:
                logger.warning("Failed to fetch pending reviews: %d", resp.status_code)
                return

            reviews = resp.json().get("reviews", [])
            if not reviews:
                return

            logger.info("Found %d completed reviews to download", len(reviews))

            for review in reviews:
                review_id = review["id"]
                output_path = review["output_path"]
                filename = review["filename"]

                try:
                    # 2. Download corrected file
                    dl_resp = await client.get(
                        f"{config.caso_api_url}/api/review/{review_id}/download-corrected",
                        headers={"Authorization": f"Bearer {config.license_key}"},
                    )
                    if dl_resp.status_code != 200:
                        logger.warning("Failed to download corrected %s: %d", filename, dl_resp.status_code)
                        continue

                    # 3. Write to output_path (overwrite AI-remediated version)
                    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
                    with open(output_path, "wb") as f:
                        f.write(dl_resp.content)

                    logger.info("Downloaded corrected file: %s → %s", filename, output_path)

                    # 4. Mark as delivered
                    await client.post(
                        f"{config.caso_api_url}/api/review/{review_id}/delivered",
                        headers={"Authorization": f"Bearer {config.license_key}"},
                    )

                    # 5. Update local DB
                    await db.update_result(path=review["original_path"], status="completed")

                    logger.info("Review %s delivered: %s", review_id, filename)

                except Exception:
                    logger.exception("Failed to process review %s for %s", review_id, filename)

    except Exception:
        logger.exception("Failed to fetch completed reviews")
```

Add to imports at the top of main.py:

```python
import httpx
from pathlib import Path
```

**Step 2: Call it at the end of run_scan_cycle()**

In the `run_scan_cycle()` function (around line 44, after the processing loop stats), add:

```python
    # Poll for completed human reviews
    await _fetch_completed_reviews(config, db, license_client)
```

Note: `run_scan_cycle` currently takes `config, db, processor` as arguments (via closure in main). We need to also make `license_client` accessible. Looking at the code, `run_scan_cycle` is defined as a nested function inside `main()` so it has access to all local variables including `license_client`. Just add the call.

**Step 3: Commit**

```bash
git add agent/agent/main.py
git commit -m "feat: agent polls for completed reviews and downloads corrected files"
```

---

### Task 10: Next.js Admin API Route — proxy to review endpoints

**Files:**
- Create: `src/app/api/admin/reviews/route.ts` — GET (list queue)
- Create: `src/app/api/admin/reviews/[id]/download/route.ts` — GET (download original)
- Create: `src/app/api/admin/reviews/[id]/start/route.ts` — POST (start review)
- Create: `src/app/api/admin/reviews/[id]/release/route.ts` — POST (release)
- Create: `src/app/api/admin/reviews/[id]/complete/route.ts` — POST (upload corrected)

**Context:** The admin dashboard calls Next.js API routes, which proxy to the Render FastAPI service using the Supabase service role. This follows the same pattern as existing admin API routes (e.g., `src/app/api/admin/tenants/`).

**Step 1: Create the list route**

File: `src/app/api/admin/reviews/route.ts`

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Check super admin
  const admin = createAdminClient();
  const { data: superAdmin } = await admin
    .from("super_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!superAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Fetch review queue with tenant names
  const { data: reviews, error } = await admin
    .from("review_queue")
    .select("*, tenants(name)")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reviews: reviews || [] });
}
```

**Step 2: Create the download route**

File: `src/app/api/admin/reviews/[id]/download/route.ts`

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: superAdmin } = await admin
    .from("super_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();
  if (!superAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Get the review
  const { data: review } = await admin
    .from("review_queue")
    .select("*")
    .eq("id", id)
    .single();

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  // Download from Supabase Storage
  const { data: fileData, error } = await admin.storage
    .from("review-files")
    .download(review.storage_path);

  if (error || !fileData) {
    return NextResponse.json({ error: "File not found in storage" }, { status: 404 });
  }

  const buffer = Buffer.from(await fileData.arrayBuffer());
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${review.filename}"`,
    },
  });
}
```

**Step 3: Create start and release routes**

File: `src/app/api/admin/reviews/[id]/start/route.ts`

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: superAdmin } = await admin
    .from("super_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();
  if (!superAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { data, error } = await admin
    .from("review_queue")
    .update({ status: "in_review" })
    .eq("id", id)
    .eq("status", "pending")
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Review not found or not in pending status" },
      { status: 404 }
    );
  }

  return NextResponse.json({ status: "in_review" });
}
```

File: `src/app/api/admin/reviews/[id]/release/route.ts`

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: superAdmin } = await admin
    .from("super_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();
  if (!superAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { data, error } = await admin
    .from("review_queue")
    .update({ status: "pending" })
    .eq("id", id)
    .eq("status", "in_review")
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Review not found or not in_review status" },
      { status: 404 }
    );
  }

  return NextResponse.json({ status: "pending" });
}
```

**Step 4: Create the complete route (file upload)**

File: `src/app/api/admin/reviews/[id]/complete/route.ts`

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: superAdmin } = await admin
    .from("super_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();
  if (!superAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Get the review
  const { data: review } = await admin
    .from("review_queue")
    .select("*")
    .eq("id", id)
    .single();

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  if (!["pending", "in_review"].includes(review.status)) {
    return NextResponse.json(
      { error: `Cannot complete review in '${review.status}' status` },
      { status: 400 }
    );
  }

  // Parse form data
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const notes = (formData.get("notes") as string) || "";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Upload corrected file to Supabase Storage
  const correctedPath = `${review.tenant_id}/${id}/corrected.pdf`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from("review-files")
    .upload(correctedPath, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: `Upload failed: ${uploadError.message}` },
      { status: 500 }
    );
  }

  // Update the review_queue row
  const { error: updateError } = await admin
    .from("review_queue")
    .update({
      status: "completed",
      corrected_path: correctedPath,
      reviewer_notes: notes || null,
      completed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json(
      { error: `Update failed: ${updateError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: "completed", review_id: id });
}
```

**Step 5: Commit**

```bash
git add src/app/api/admin/reviews/
git commit -m "feat: add Next.js admin API routes for review queue management"
```

---

### Task 11: Admin Dashboard — Review Queue Page

**Files:**
- Create: `src/app/dashboard/admin/reviews/page.tsx`

**Step 1: Create the review queue page**

This is a "use client" page with a table showing all reviews, status badges, and action buttons (Start Review / Upload Corrected / Release).

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";

interface Review {
  id: string;
  tenant_id: string;
  filename: string;
  original_path: string;
  output_path: string;
  ai_score: number;
  page_count: number;
  status: string;
  reviewer_notes: string | null;
  created_at: string;
  completed_at: string | null;
  delivered_at: string | null;
  tenants: { name: string } | null;
}

function statusBadge(status: string) {
  switch (status) {
    case "pending":
      return "bg-caso-warm/10 text-caso-warm";
    case "in_review":
      return "bg-caso-blue/10 text-caso-blue";
    case "completed":
      return "bg-caso-green/10 text-caso-green";
    case "delivered":
      return "bg-caso-slate/10 text-caso-slate";
    default:
      return "bg-caso-slate/10 text-caso-slate";
  }
}

export default function AdminReviewQueuePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews);
      } else {
        setError(data.error || "Failed to fetch reviews");
      }
    } catch {
      setError("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function handleStartReview(id: string) {
    // Download the file
    const link = document.createElement("a");
    link.href = `/api/admin/reviews/${id}/download`;
    link.download = "";
    link.click();

    // Set status to in_review
    await fetch(`/api/admin/reviews/${id}/start`, { method: "POST" });
    fetchReviews();
  }

  async function handleRelease(id: string) {
    await fetch(`/api/admin/reviews/${id}/release`, { method: "POST" });
    fetchReviews();
  }

  async function handleUploadCorrected(id: string) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setUploading(id);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("notes", "");

      try {
        const res = await fetch(`/api/admin/reviews/${id}/complete`, {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          fetchReviews();
        } else {
          const data = await res.json();
          setError(data.error || "Upload failed");
        }
      } catch {
        setError("Upload failed");
      } finally {
        setUploading(null);
      }
    };
    input.click();
  }

  if (loading) {
    return (
      <div className="text-caso-slate text-sm">Loading review queue...</div>
    );
  }

  const pending = reviews.filter((r) => r.status === "pending" || r.status === "in_review");
  const completed = reviews.filter((r) => r.status === "completed" || r.status === "delivered");

  return (
    <div className="space-y-6 max-w-6xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
        Human Review Queue
      </h1>

      {error && (
        <div className="rounded-lg bg-caso-red/10 border border-caso-red/30 px-4 py-3 text-sm text-caso-red">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            dismiss
          </button>
        </div>
      )}

      {/* Active Reviews */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
        <div className="px-6 py-4 border-b border-caso-border">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white">
            Needs Review ({pending.length})
          </h2>
        </div>
        {pending.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-caso-border text-left">
                  <th className="px-6 py-3 text-caso-slate font-medium">Tenant</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Filename</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">AI Score</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Pages</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Status</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Submitted</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b border-caso-border/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3 text-caso-white font-medium">
                      {review.tenants?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-3 text-caso-white font-mono text-xs">
                      {review.filename}
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-caso-red font-bold">{review.ai_score}</span>
                    </td>
                    <td className="px-6 py-3 text-caso-slate">{review.page_count}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(review.status)}`}
                      >
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-caso-slate">
                      {new Date(review.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {review.status === "pending" && (
                          <button
                            onClick={() => handleStartReview(review.id)}
                            className="rounded-lg bg-caso-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-caso-blue-bright transition-colors"
                          >
                            Start Review
                          </button>
                        )}
                        {review.status === "in_review" && (
                          <>
                            <button
                              onClick={() => handleUploadCorrected(review.id)}
                              disabled={uploading === review.id}
                              className="rounded-lg bg-caso-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-caso-green/80 disabled:opacity-50 transition-colors"
                            >
                              {uploading === review.id ? "Uploading..." : "Upload Corrected"}
                            </button>
                            <button
                              onClick={() => handleRelease(review.id)}
                              className="rounded-lg border border-caso-border px-3 py-1.5 text-xs font-medium text-caso-slate hover:text-caso-white transition-colors"
                            >
                              Release
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-caso-slate text-sm">
            No files waiting for review.
          </div>
        )}
      </div>

      {/* Completed / Delivered */}
      {completed.length > 0 && (
        <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
          <div className="px-6 py-4 border-b border-caso-border">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white">
              Completed ({completed.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-caso-border text-left">
                  <th className="px-6 py-3 text-caso-slate font-medium">Tenant</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Filename</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">AI Score</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Status</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Completed</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Delivered</th>
                </tr>
              </thead>
              <tbody>
                {completed.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b border-caso-border/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3 text-caso-white font-medium">
                      {review.tenants?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-3 text-caso-white font-mono text-xs">
                      {review.filename}
                    </td>
                    <td className="px-6 py-3 text-caso-slate">{review.ai_score}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(review.status)}`}
                      >
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-caso-slate">
                      {review.completed_at
                        ? new Date(review.completed_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-3 text-caso-slate">
                      {review.delivered_at
                        ? new Date(review.delivered_at).toLocaleDateString()
                        : "Waiting for agent"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/dashboard/admin/reviews/page.tsx
git commit -m "feat: add admin Review Queue dashboard page"
```

---

### Task 12: Admin Sidebar — Add Reviews link

**Files:**
- Modify: the admin sidebar/nav component that renders the admin dashboard navigation

**Context:** Find the component that renders the admin sidebar links (likely in `src/app/dashboard/admin/` layout or a shared component). Add a "Reviews" link pointing to `/dashboard/admin/reviews`.

**Step 1: Find and update the admin nav**

Search for existing admin nav links like "Tenants", "Users", "Usage", "Invoices". Add after them:

```typescript
{
  name: "Reviews",
  href: "/dashboard/admin/reviews",
  // use an appropriate icon
}
```

**Step 2: Commit**

```bash
git add <the-nav-file>
git commit -m "feat: add Reviews link to admin sidebar"
```

---

### Task 13: Deploy and test end-to-end

**Step 1: Run the Supabase migration**
- Go to Supabase SQL editor
- Run the contents of `supabase/migrations/009_human_review_queue.sql`
- Verify: `review_queue` table exists, `review-files` bucket exists, `review_score_threshold` column on `subscription_plans`

**Step 2: Deploy API service to Render**
- Push changes to the repo
- Render auto-deploys from the api-service directory
- Verify `/api/review/submit` returns 401 without auth (not 404)

**Step 3: Deploy frontend to Vercel**
```bash
vercel --prod
```
- Verify `/dashboard/admin/reviews` page loads (should show empty queue)

**Step 4: End-to-end test flow**
1. Use curl to simulate agent submitting a file:
```bash
curl -X POST "https://caso-comply-api.onrender.com/api/review/submit" \
  -H "Authorization: Bearer caso_ak_YOUR_KEY" \
  -F "file=@test.pdf" \
  -F "filename=test-review.pdf" \
  -F "original_path=/data/input/test.pdf" \
  -F "output_path=/data/remediated/test.pdf" \
  -F "ai_score=55" \
  -F "page_count=3"
```
2. Check admin dashboard — should see the file in the queue
3. Click "Start Review" — file downloads, status changes to in_review
4. Click "Upload Corrected" — upload a fixed PDF
5. Verify status changes to completed
6. Use curl to simulate agent polling:
```bash
curl "https://caso-comply-api.onrender.com/api/review/pending" \
  -H "Authorization: Bearer caso_ak_YOUR_KEY"
```
7. Should return the completed review with download info

**Step 5: Commit any fixes**

```bash
git commit -m "fix: end-to-end testing fixes for human review workflow"
```
