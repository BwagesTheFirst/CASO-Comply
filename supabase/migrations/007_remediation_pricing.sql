-- ============================================================
-- 007_remediation_pricing.sql
-- Per-page remediation pricing by type (standard, AI-verified,
-- human review) on usage_records and subscription_plans.
-- ============================================================

BEGIN;

-- ----------------------------------------------------------
-- 1. remediation_type enum
-- ----------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'remediation_type') THEN
    CREATE TYPE remediation_type AS ENUM ('standard', 'ai_verified', 'human_review');
  END IF;
END $$;

-- ----------------------------------------------------------
-- 2. Add 'human_review' to usage_action enum
-- ----------------------------------------------------------
ALTER TYPE usage_action ADD VALUE IF NOT EXISTS 'human_review';

-- ----------------------------------------------------------
-- 3. New columns on usage_records
-- ----------------------------------------------------------
ALTER TABLE usage_records
  ADD COLUMN IF NOT EXISTS remediation_type remediation_type,
  ADD COLUMN IF NOT EXISTS rate_cents_applied integer,
  ADD COLUMN IF NOT EXISTS cost_cents integer;

COMMENT ON COLUMN usage_records.remediation_type IS 'Only set for remediate / human_review actions';
COMMENT ON COLUMN usage_records.rate_cents_applied IS 'Per-page rate in cents charged for this record';
COMMENT ON COLUMN usage_records.cost_cents IS 'Total cost in cents (pages_consumed * rate_cents_applied)';

-- ----------------------------------------------------------
-- 4. Per-tier pricing columns on subscription_plans
-- ----------------------------------------------------------
ALTER TABLE subscription_plans
  ADD COLUMN IF NOT EXISTS standard_rate_cents integer NOT NULL DEFAULT 25,
  ADD COLUMN IF NOT EXISTS ai_verified_rate_cents integer NOT NULL DEFAULT 35,
  ADD COLUMN IF NOT EXISTS human_review_rate_cents integer NOT NULL DEFAULT 400;

COMMENT ON COLUMN subscription_plans.standard_rate_cents IS '$0.25/page — basic auto-tag remediation';
COMMENT ON COLUMN subscription_plans.ai_verified_rate_cents IS '$0.35/page — AI-verified remediation';
COMMENT ON COLUMN subscription_plans.human_review_rate_cents IS '$4.00/page — human-reviewed remediation';

-- ----------------------------------------------------------
-- 5. Seed the per-page rates on existing plans
-- ----------------------------------------------------------
UPDATE subscription_plans
SET standard_rate_cents     = 25,
    ai_verified_rate_cents  = 35,
    human_review_rate_cents = 400;

COMMIT;
