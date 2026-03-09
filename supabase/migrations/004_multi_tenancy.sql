-- ============================================================
-- 004_multi_tenancy.sql
-- Multi-tenancy support for CASO Comply
-- ============================================================

BEGIN;

-- ----------------------------------------------------------
-- 1. subscription_plans (must exist before tenants FK)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  stripe_price_id text,
  pages_included integer NOT NULL DEFAULT 0,
  overage_rate_cents integer NOT NULL DEFAULT 0,
  features jsonb DEFAULT '{}'::jsonb,
  max_domains integer NOT NULL DEFAULT 1,
  monthly_price_cents integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Seed plans (idempotent via ON CONFLICT)
ALTER TABLE subscription_plans
  ADD CONSTRAINT uq_subscription_plans_name UNIQUE (name);

INSERT INTO subscription_plans (name, pages_included, overage_rate_cents, features, max_domains, monthly_price_cents)
VALUES
  ('Starter',      500,   12, '{"analyze":true,"remediate":true,"scan":true,"verify":false,"api_access":false}'::jsonb,   3,  29900),
  ('Professional', 2000,   9, '{"analyze":true,"remediate":true,"scan":true,"verify":true,"api_access":true,"priority_support":true}'::jsonb, 10,  79900),
  ('Enterprise',  10000,   6, '{"analyze":true,"remediate":true,"scan":true,"verify":true,"api_access":true,"priority_support":true,"custom_branding":true,"sso":true}'::jsonb, -1, 249900)
ON CONFLICT (name) DO UPDATE SET
  pages_included     = EXCLUDED.pages_included,
  overage_rate_cents = EXCLUDED.overage_rate_cents,
  features           = EXCLUDED.features,
  max_domains        = EXCLUDED.max_domains,
  monthly_price_cents= EXCLUDED.monthly_price_cents;

-- ----------------------------------------------------------
-- 2. tenants
-- ----------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tenant_status') THEN
    CREATE TYPE tenant_status AS ENUM ('active','suspended','cancelled','trial');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS tenants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  domain text,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan_id uuid REFERENCES subscription_plans(id),
  billing_email text,
  logo_url text,
  brand_color text DEFAULT '#2563EB',
  custom_report_footer text,
  status tenant_status NOT NULL DEFAULT 'trial',
  trial_ends_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);

-- ----------------------------------------------------------
-- 3. tenant_members
-- ----------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tenant_role') THEN
    CREATE TYPE tenant_role AS ENUM ('owner','admin','member','viewer');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS tenant_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role tenant_role NOT NULL DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  UNIQUE (tenant_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_members_user_id ON tenant_members(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_members_tenant_id ON tenant_members(tenant_id);

-- ----------------------------------------------------------
-- 4. api_keys
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  key_hash text NOT NULL,
  key_prefix text NOT NULL,
  name text NOT NULL DEFAULT 'Default',
  scopes text[] NOT NULL DEFAULT '{analyze,scan}',
  is_active boolean NOT NULL DEFAULT true,
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_tenant_id ON api_keys(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_prefix ON api_keys(key_prefix);

-- ----------------------------------------------------------
-- 5. usage_records
-- ----------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'usage_action') THEN
    CREATE TYPE usage_action AS ENUM ('analyze','remediate','scan','verify','convert');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS usage_records (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  api_key_id uuid REFERENCES api_keys(id) ON DELETE SET NULL,
  action usage_action NOT NULL,
  pages_consumed integer NOT NULL DEFAULT 1,
  document_filename text,
  document_format text,
  billing_period_start date NOT NULL DEFAULT date_trunc('month', CURRENT_DATE)::date,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usage_records_tenant_id ON usage_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_billing_period ON usage_records(tenant_id, billing_period_start);
CREATE INDEX IF NOT EXISTS idx_usage_records_created_at ON usage_records(created_at DESC);

-- ----------------------------------------------------------
-- 6. Add tenant_id to existing tables
-- ----------------------------------------------------------
ALTER TABLE scans
  ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id) ON DELETE SET NULL;

ALTER TABLE scan_pdfs
  ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_scans_tenant_id ON scans(tenant_id);
CREATE INDEX IF NOT EXISTS idx_scan_pdfs_tenant_id ON scan_pdfs(tenant_id);

-- ----------------------------------------------------------
-- 7. get_tenant_usage function
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION get_tenant_usage(p_tenant_id uuid)
RETURNS TABLE (
  billing_period_start date,
  action usage_action,
  total_pages bigint,
  record_count bigint,
  pages_included integer,
  overage_pages bigint,
  overage_cost_cents bigint
)
LANGUAGE sql STABLE
AS $$
  SELECT
    ur.billing_period_start,
    ur.action,
    SUM(ur.pages_consumed)::bigint                          AS total_pages,
    COUNT(*)::bigint                                        AS record_count,
    COALESCE(sp.pages_included, 0)                          AS pages_included,
    GREATEST(0, SUM(ur.pages_consumed)::bigint - COALESCE(sp.pages_included, 0)) AS overage_pages,
    GREATEST(0, SUM(ur.pages_consumed)::bigint - COALESCE(sp.pages_included, 0))
      * COALESCE(sp.overage_rate_cents, 0)                  AS overage_cost_cents
  FROM usage_records ur
  JOIN tenants t ON t.id = ur.tenant_id
  LEFT JOIN subscription_plans sp ON sp.id = t.plan_id
  WHERE ur.tenant_id = p_tenant_id
  GROUP BY ur.billing_period_start, ur.action, sp.pages_included, sp.overage_rate_cents
  ORDER BY ur.billing_period_start DESC, ur.action;
$$;

-- ----------------------------------------------------------
-- 8. Row Level Security
-- ----------------------------------------------------------

-- subscription_plans: publicly readable
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Plans are publicly readable" ON subscription_plans;
CREATE POLICY "Plans are publicly readable"
  ON subscription_plans FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role manages plans" ON subscription_plans;
CREATE POLICY "Service role manages plans"
  ON subscription_plans FOR ALL
  USING (auth.role() = 'service_role');

-- tenants: members can view their own tenant
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view own tenant" ON tenants;
CREATE POLICY "Members can view own tenant"
  ON tenants FOR SELECT
  USING (
    id IN (
      SELECT tenant_id FROM tenant_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Service role full access on tenants" ON tenants;
CREATE POLICY "Service role full access on tenants"
  ON tenants FOR ALL
  USING (auth.role() = 'service_role');

-- tenant_members: can view own memberships
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view own memberships" ON tenant_members;
CREATE POLICY "Members can view own memberships"
  ON tenant_members FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Service role full access on tenant_members" ON tenant_members;
CREATE POLICY "Service role full access on tenant_members"
  ON tenant_members FOR ALL
  USING (auth.role() = 'service_role');

-- api_keys: admins+ can manage
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view api keys" ON api_keys;
CREATE POLICY "Admins can view api keys"
  ON api_keys FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members
      WHERE user_id = auth.uid()
        AND role IN ('owner','admin')
    )
  );

DROP POLICY IF EXISTS "Admins can manage api keys" ON api_keys;
CREATE POLICY "Admins can manage api keys"
  ON api_keys FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members
      WHERE user_id = auth.uid()
        AND role IN ('owner','admin')
    )
  );

DROP POLICY IF EXISTS "Service role full access on api_keys" ON api_keys;
CREATE POLICY "Service role full access on api_keys"
  ON api_keys FOR ALL
  USING (auth.role() = 'service_role');

-- usage_records: members can view own tenant usage
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view own usage" ON usage_records;
CREATE POLICY "Members can view own usage"
  ON usage_records FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Service role full access on usage_records" ON usage_records;
CREATE POLICY "Service role full access on usage_records"
  ON usage_records FOR ALL
  USING (auth.role() = 'service_role');

-- ----------------------------------------------------------
-- 9. updated_at trigger for tenants
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_tenants_updated_at ON tenants;
CREATE TRIGGER set_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMIT;
