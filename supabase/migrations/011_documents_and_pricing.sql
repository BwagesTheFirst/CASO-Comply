-- ============================================================
-- 011_documents_and_pricing.sql
-- 1. Update pricing to match AOD service levels
-- 2. Create documents table for remediation jobs
-- 3. Create storage bucket for document files
-- ============================================================

BEGIN;

-- ----------------------------------------------------------
-- 1. Update subscription plans to AOD pricing model
--    Standard  = $0.30/page (30 cents)
--    Enhanced  = $1.80/page (180 cents)  — AI-verified
--    Expert    = $12.00/page (1200 cents) — human review
-- ----------------------------------------------------------

-- Deactivate old per-page plans
UPDATE subscription_plans
SET is_active = false
WHERE name IN ('Standard', 'AI Verified', 'Human Review');

-- Insert new AOD-aligned plans
INSERT INTO subscription_plans (name, pages_included, overage_rate_cents, features, max_domains, monthly_price_cents, standard_rate_cents, ai_verified_rate_cents, human_review_rate_cents)
VALUES
  ('Standard', 0, 0,
   '{"analyze":true,"remediate":true,"scan":true,"verify":false,"api_access":true,"description":"Automated tagging with structure tree, language, and metadata"}'::jsonb,
   -1, 0, 30, 0, 0),
  ('Enhanced', 0, 0,
   '{"analyze":true,"remediate":true,"scan":true,"verify":true,"api_access":true,"priority_support":true,"description":"AI-verified remediation with alt text generation and reading order correction"}'::jsonb,
   -1, 0, 30, 180, 0),
  ('Expert', 0, 0,
   '{"analyze":true,"remediate":true,"scan":true,"verify":true,"api_access":true,"priority_support":true,"human_review":true,"description":"Human expert review with full WCAG 2.1 AA compliance guarantee"}'::jsonb,
   -1, 0, 30, 180, 1200)
ON CONFLICT (name) DO UPDATE SET
  pages_included          = EXCLUDED.pages_included,
  overage_rate_cents      = EXCLUDED.overage_rate_cents,
  features                = EXCLUDED.features,
  max_domains             = EXCLUDED.max_domains,
  monthly_price_cents     = EXCLUDED.monthly_price_cents,
  standard_rate_cents     = EXCLUDED.standard_rate_cents,
  ai_verified_rate_cents  = EXCLUDED.ai_verified_rate_cents,
  human_review_rate_cents = EXCLUDED.human_review_rate_cents,
  is_active               = true;

-- ----------------------------------------------------------
-- 2. Document status and service level enums
-- ----------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_status') THEN
    CREATE TYPE document_status AS ENUM ('queued', 'processing', 'completed', 'failed');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_level') THEN
    CREATE TYPE service_level AS ENUM ('standard', 'enhanced', 'expert');
  END IF;
END $$;

-- ----------------------------------------------------------
-- 3. Documents table — tracks uploaded files for remediation
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL,
  filename text NOT NULL,
  file_size bigint,
  mime_type text,
  storage_path text NOT NULL,
  remediated_path text,
  status document_status NOT NULL DEFAULT 'queued',
  service_level service_level NOT NULL DEFAULT 'standard',
  page_count integer,
  score_before numeric(5,2),
  score_after numeric(5,2),
  grade_before text,
  grade_after text,
  issues_found jsonb DEFAULT '[]'::jsonb,
  checks_passed jsonb DEFAULT '[]'::jsonb,
  certificate_json jsonb,
  error text,
  batch_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_documents_tenant_id ON documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_batch_id ON documents(batch_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);

-- updated_at trigger
DROP TRIGGER IF EXISTS set_documents_updated_at ON documents;
CREATE TRIGGER set_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------
-- 4. Batches table — groups multiple documents
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS document_batches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_by uuid NOT NULL,
  name text,
  service_level service_level NOT NULL DEFAULT 'standard',
  total_files integer NOT NULL DEFAULT 0,
  completed_files integer NOT NULL DEFAULT 0,
  failed_files integer NOT NULL DEFAULT 0,
  total_pages integer NOT NULL DEFAULT 0,
  estimated_cost_cents integer NOT NULL DEFAULT 0,
  status document_status NOT NULL DEFAULT 'queued',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_document_batches_tenant_id ON document_batches(tenant_id);

DROP TRIGGER IF EXISTS set_document_batches_updated_at ON document_batches;
CREATE TRIGGER set_document_batches_updated_at
  BEFORE UPDATE ON document_batches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------
-- 5. Row Level Security
-- ----------------------------------------------------------
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view own documents" ON documents;
CREATE POLICY "Members can view own documents"
  ON documents FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can insert documents" ON documents;
CREATE POLICY "Members can insert documents"
  ON documents FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Service role full access on documents" ON documents;
CREATE POLICY "Service role full access on documents"
  ON documents FOR ALL
  USING (auth.role() = 'service_role');

ALTER TABLE document_batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view own batches" ON document_batches;
CREATE POLICY "Members can view own batches"
  ON document_batches FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can insert batches" ON document_batches;
CREATE POLICY "Members can insert batches"
  ON document_batches FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Service role full access on document_batches" ON document_batches;
CREATE POLICY "Service role full access on document_batches"
  ON document_batches FOR ALL
  USING (auth.role() = 'service_role');

COMMIT;
