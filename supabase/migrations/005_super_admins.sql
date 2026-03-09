-- ============================================================
-- 005_super_admins.sql
-- Super admin support for platform-wide management
-- ============================================================

BEGIN;

-- ----------------------------------------------------------
-- 1. super_admins table
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS super_admins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- RLS: only service role can manage super_admins
ALTER TABLE super_admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on super_admins" ON super_admins;
CREATE POLICY "Service role full access on super_admins"
  ON super_admins FOR ALL
  USING (auth.role() = 'service_role');

-- ----------------------------------------------------------
-- 2. Helper function: check if a user is super admin
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION is_super_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM super_admins WHERE user_id = p_user_id
  );
$$;

-- ----------------------------------------------------------
-- 3. Platform stats function for admin dashboard
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS TABLE (
  total_tenants bigint,
  active_tenants bigint,
  trial_tenants bigint,
  total_users bigint,
  total_scans bigint,
  total_pages_this_month bigint,
  total_revenue_cents bigint
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT
    (SELECT COUNT(*)::bigint FROM tenants) AS total_tenants,
    (SELECT COUNT(*)::bigint FROM tenants WHERE status = 'active') AS active_tenants,
    (SELECT COUNT(*)::bigint FROM tenants WHERE status = 'trial') AS trial_tenants,
    (SELECT COUNT(*)::bigint FROM tenant_members) AS total_users,
    (SELECT COUNT(*)::bigint FROM scans) AS total_scans,
    COALESCE((
      SELECT SUM(pages_consumed)::bigint
      FROM usage_records
      WHERE billing_period_start = date_trunc('month', CURRENT_DATE)::date
    ), 0) AS total_pages_this_month,
    COALESCE((
      SELECT SUM(sp.monthly_price_cents)::bigint
      FROM tenants t
      JOIN subscription_plans sp ON sp.id = t.plan_id
      WHERE t.status IN ('active', 'trial')
    ), 0) AS total_revenue_cents
$$;

-- ----------------------------------------------------------
-- 4. Seed: Brancewages@gmail.com as super admin
-- ----------------------------------------------------------
INSERT INTO super_admins (user_id)
VALUES ('63d2af95-cf09-4848-b6ea-e41944f03d7d')
ON CONFLICT (user_id) DO NOTHING;

COMMIT;
