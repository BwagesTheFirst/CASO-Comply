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
