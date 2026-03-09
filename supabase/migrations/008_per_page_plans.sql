-- ============================================================
-- 008_per_page_plans.sql
-- Replace Starter/Professional/Enterprise monthly plans with
-- per-page pricing tiers: Standard, AI Verified, Human Review.
-- ============================================================

BEGIN;

-- Deactivate old monthly plans
UPDATE subscription_plans
SET is_active = false
WHERE name IN ('Starter', 'Professional', 'Enterprise');

-- Insert new per-page tiers
INSERT INTO subscription_plans (name, pages_included, overage_rate_cents, features, max_domains, monthly_price_cents, standard_rate_cents, ai_verified_rate_cents, human_review_rate_cents)
VALUES
  ('Standard',     0, 0, '{"analyze":true,"remediate":true,"scan":true,"verify":false,"api_access":true}'::jsonb,  -1, 0, 25, 0, 0),
  ('AI Verified',  0, 0, '{"analyze":true,"remediate":true,"scan":true,"verify":true,"api_access":true,"priority_support":true}'::jsonb, -1, 0, 25, 35, 0),
  ('Human Review', 0, 0, '{"analyze":true,"remediate":true,"scan":true,"verify":true,"api_access":true,"priority_support":true,"human_review":true}'::jsonb, -1, 0, 25, 35, 400)
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

COMMIT;
