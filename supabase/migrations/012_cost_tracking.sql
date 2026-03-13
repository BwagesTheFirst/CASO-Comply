-- ============================================================
-- 012_cost_tracking.sql
-- Internal cost tracking for profitability analysis
-- Tracks our actual costs per document remediation
-- ============================================================

BEGIN;

-- ----------------------------------------------------------
-- 1. Cost records — tracks our internal costs per document
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS cost_records (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- API costs (in cents, supports fractional via numeric)
  gemini_input_tokens integer DEFAULT 0,
  gemini_output_tokens integer DEFAULT 0,
  gemini_cost_cents numeric(10,4) DEFAULT 0,

  -- Compute costs
  processing_ms integer DEFAULT 0,
  render_cost_cents numeric(10,4) DEFAULT 0,

  -- Storage costs
  original_bytes bigint DEFAULT 0,
  remediated_bytes bigint DEFAULT 0,
  storage_cost_cents numeric(10,4) DEFAULT 0,

  -- Totals
  total_internal_cost_cents numeric(10,4) DEFAULT 0,
  revenue_cents integer DEFAULT 0,
  margin_cents numeric(10,4) DEFAULT 0,

  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cost_records_document_id ON cost_records(document_id);
CREATE INDEX IF NOT EXISTS idx_cost_records_tenant_id ON cost_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cost_records_created_at ON cost_records(created_at DESC);

-- RLS
ALTER TABLE cost_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on cost_records" ON cost_records;
CREATE POLICY "Service role full access on cost_records"
  ON cost_records FOR ALL
  USING (auth.role() = 'service_role');

-- ----------------------------------------------------------
-- 2. Platform cost config — stores our cost rates
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS platform_cost_config (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value numeric NOT NULL,
  unit text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

-- Seed with current cost rates
INSERT INTO platform_cost_config (key, value, unit, description) VALUES
  ('gemini_input_per_1m_tokens', 0.075, 'dollars', 'Gemini 2.5 Flash input cost per 1M tokens'),
  ('gemini_output_per_1m_tokens', 0.30, 'dollars', 'Gemini 2.5 Flash output cost per 1M tokens'),
  ('render_per_hour', 0.10, 'dollars', 'Render compute cost per hour (Starter plan)'),
  ('supabase_storage_per_gb_month', 0.021, 'dollars', 'Supabase storage cost per GB per month'),
  ('supabase_db_monthly', 25.00, 'dollars', 'Supabase Pro plan monthly cost'),
  ('render_monthly', 7.00, 'dollars', 'Render Starter monthly base cost'),
  ('vercel_monthly', 20.00, 'dollars', 'Vercel Pro plan monthly cost')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

ALTER TABLE platform_cost_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on platform_cost_config"
  ON platform_cost_config FOR ALL
  USING (auth.role() = 'service_role');

-- ----------------------------------------------------------
-- 3. Trial page limit on tenants
-- ----------------------------------------------------------
ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS trial_pages_used integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS trial_pages_limit integer NOT NULL DEFAULT 10;

-- ----------------------------------------------------------
-- 4. Profitability summary function
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION get_profitability_summary(
  p_start_date date DEFAULT date_trunc('month', CURRENT_DATE)::date,
  p_end_date date DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  total_revenue_cents bigint,
  total_cost_cents numeric,
  total_margin_cents numeric,
  margin_percent numeric,
  total_documents bigint,
  total_pages bigint,
  avg_cost_per_page_cents numeric,
  avg_revenue_per_page_cents numeric,
  gemini_total_cents numeric,
  render_total_cents numeric,
  storage_total_cents numeric
)
LANGUAGE sql STABLE
AS $$
  SELECT
    COALESCE(SUM(revenue_cents), 0)::bigint,
    COALESCE(SUM(total_internal_cost_cents), 0),
    COALESCE(SUM(margin_cents), 0),
    CASE WHEN SUM(revenue_cents) > 0
      THEN ROUND(SUM(margin_cents) / SUM(revenue_cents) * 100, 1)
      ELSE 0
    END,
    COUNT(*)::bigint,
    COALESCE(SUM(d.page_count), 0)::bigint,
    CASE WHEN SUM(d.page_count) > 0
      THEN ROUND(SUM(total_internal_cost_cents) / SUM(d.page_count), 4)
      ELSE 0
    END,
    CASE WHEN SUM(d.page_count) > 0
      THEN ROUND(SUM(revenue_cents)::numeric / SUM(d.page_count), 4)
      ELSE 0
    END,
    COALESCE(SUM(gemini_cost_cents), 0),
    COALESCE(SUM(render_cost_cents), 0),
    COALESCE(SUM(storage_cost_cents), 0)
  FROM cost_records cr
  JOIN documents d ON d.id = cr.document_id
  WHERE cr.created_at >= p_start_date
    AND cr.created_at < p_end_date + 1;
$$;

-- Per-tenant profitability
CREATE OR REPLACE FUNCTION get_tenant_profitability(
  p_start_date date DEFAULT date_trunc('month', CURRENT_DATE)::date,
  p_end_date date DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  tenant_id uuid,
  tenant_name text,
  total_documents bigint,
  total_pages bigint,
  revenue_cents bigint,
  cost_cents numeric,
  margin_cents numeric,
  margin_percent numeric
)
LANGUAGE sql STABLE
AS $$
  SELECT
    t.id,
    t.name,
    COUNT(cr.id)::bigint,
    COALESCE(SUM(d.page_count), 0)::bigint,
    COALESCE(SUM(cr.revenue_cents), 0)::bigint,
    COALESCE(SUM(cr.total_internal_cost_cents), 0),
    COALESCE(SUM(cr.margin_cents), 0),
    CASE WHEN SUM(cr.revenue_cents) > 0
      THEN ROUND(SUM(cr.margin_cents) / SUM(cr.revenue_cents) * 100, 1)
      ELSE 0
    END
  FROM cost_records cr
  JOIN documents d ON d.id = cr.document_id
  JOIN tenants t ON t.id = cr.tenant_id
  WHERE cr.created_at >= p_start_date
    AND cr.created_at < p_end_date + 1
  GROUP BY t.id, t.name
  ORDER BY SUM(cr.revenue_cents) DESC;
$$;

COMMIT;
