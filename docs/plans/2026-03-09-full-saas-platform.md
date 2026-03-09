# Full SaaS Platform Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform CASO Comply from a public demo tool into a full multi-tenant SaaS with authentication, API key licensing, usage metering, Stripe billing, tenant dashboard, and a downloadable Docker agent that phones home for license validation.

**Architecture:** Supabase Auth for user sessions, multi-tenant database with RLS, FastAPI middleware for API key auth + usage tracking, Stripe for billing, Next.js dashboard for tenant management, Docker agent image for client-side deployment.

**Tech Stack:** Next.js 15, Supabase Auth + RLS, FastAPI, Stripe, Docker, SendGrid

---

## Phase 1: Database & Auth Foundation

### Task 1: Multi-Tenancy Database Migration

**Files:**
- Create: `supabase/migrations/004_multi_tenancy.sql`

Run this migration via psql against the Supabase database.

```sql
-- Tenants
CREATE TABLE tenants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  domain text,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text,
  plan_id uuid,
  billing_email text,
  logo_url text,
  brand_color text DEFAULT '#3B82F6',
  custom_report_footer text,
  status text DEFAULT 'trial' CHECK (status IN ('active', 'suspended', 'cancelled', 'trial')),
  trial_ends_at timestamptz DEFAULT (now() + interval '14 days'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_tenants_slug ON tenants(slug);

-- Subscription plans
CREATE TABLE subscription_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  stripe_price_id text,
  pages_included integer NOT NULL,
  overage_rate_cents integer NOT NULL,
  features jsonb DEFAULT '{}'::jsonb,
  max_domains integer DEFAULT 1,
  monthly_price_cents integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tenants ADD CONSTRAINT fk_tenant_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans(id);

-- Seed plans
INSERT INTO subscription_plans (name, pages_included, overage_rate_cents, monthly_price_cents, features) VALUES
  ('Starter', 500, 15, 29900, '{"api_access": false, "white_label": false}'),
  ('Professional', 2000, 12, 79900, '{"api_access": true, "white_label": false}'),
  ('Enterprise', 10000, 8, 249900, '{"api_access": true, "white_label": true}');

-- API keys
CREATE TABLE api_keys (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  key_hash text NOT NULL,
  key_prefix text NOT NULL,
  name text DEFAULT 'Default',
  scopes text[] DEFAULT ARRAY['analyze', 'remediate', 'scan'],
  is_active boolean DEFAULT true,
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_tenant ON api_keys(tenant_id);

-- Usage records (append-only)
CREATE TABLE usage_records (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  api_key_id uuid REFERENCES api_keys(id),
  action text NOT NULL CHECK (action IN ('analyze', 'remediate', 'scan', 'verify', 'convert')),
  pages_consumed integer NOT NULL DEFAULT 1,
  document_filename text,
  document_format text,
  billing_period_start date NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_usage_tenant_period ON usage_records(tenant_id, billing_period_start);

-- Tenant members
CREATE TABLE tenant_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

CREATE INDEX idx_members_user ON tenant_members(user_id);

-- Add tenant_id to existing tables
ALTER TABLE scans ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id);
ALTER TABLE scan_pdfs ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id);

-- Usage summary function
CREATE OR REPLACE FUNCTION get_tenant_usage(p_tenant_id uuid)
RETURNS TABLE (
  total_pages bigint,
  pages_included integer,
  pages_remaining integer,
  overage_pages integer
) AS $$
  SELECT
    COALESCE(SUM(ur.pages_consumed), 0) AS total_pages,
    COALESCE(sp.pages_included, 0),
    GREATEST(0, COALESCE(sp.pages_included, 0) - COALESCE(SUM(ur.pages_consumed), 0)::integer),
    GREATEST(0, COALESCE(SUM(ur.pages_consumed), 0)::integer - COALESCE(sp.pages_included, 0))
  FROM tenants t
  LEFT JOIN subscription_plans sp ON t.plan_id = sp.id
  LEFT JOIN usage_records ur ON ur.tenant_id = t.id
    AND ur.billing_period_start = date_trunc('month', CURRENT_DATE)::date
  WHERE t.id = p_tenant_id
  GROUP BY sp.pages_included;
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans are publicly readable" ON subscription_plans FOR SELECT USING (true);

CREATE POLICY "Members can view own tenant" ON tenants FOR SELECT
  USING (id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "Members can view own usage" ON usage_records FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "Admins manage API keys" ON api_keys FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')));

CREATE POLICY "Members can view own membership" ON tenant_members FOR SELECT
  USING (user_id = auth.uid());
```

**Commit:** `feat: add multi-tenancy schema with plans, API keys, usage tracking`

---

### Task 2: Supabase Auth — Signup/Login Pages

**Files:**
- Create: `src/app/login/page.tsx`
- Create: `src/app/signup/page.tsx`
- Create: `src/middleware.ts`
- Create: `src/app/auth/callback/route.ts`

**Login page** (`src/app/login/page.tsx`):
- Email + password form
- "Sign up" link
- Uses `createBrowserClient` from `@/lib/supabase/client`
- Calls `supabase.auth.signInWithPassword({ email, password })`
- On success, redirect to `/dashboard`
- Style with existing caso-navy/caso-blue theme

**Signup page** (`src/app/signup/page.tsx`):
- Email, password, company name fields
- Calls `supabase.auth.signUp({ email, password })`
- After signup, create tenant + tenant_member records via API route
- Redirect to `/dashboard`

**Auth callback** (`src/app/auth/callback/route.ts`):
- Handle Supabase email confirmation callback
- Exchange code for session
- Redirect to `/dashboard`

**Middleware** (`src/middleware.ts`):
- Protect `/dashboard/*` routes
- Check for valid Supabase session
- Redirect unauthenticated users to `/login`
- Allow public routes: `/`, `/demo`, `/report/*`, `/login`, `/signup`, `/api/*`

**Commit:** `feat: add Supabase auth with login/signup pages and route protection`

---

### Task 3: Tenant Provisioning API

**Files:**
- Create: `src/app/api/tenants/provision/route.ts`

When a user signs up, this API route:
1. Gets the authenticated user from the session
2. Creates a tenant record (name = company name from signup, slug = slugified name)
3. Creates a tenant_member record (role = 'owner')
4. Assigns the free trial (Starter plan, 14-day trial)
5. Generates a default API key and returns it (show once)

API key generation:
```typescript
import crypto from 'crypto';
const rawKey = `caso_ak_${crypto.randomBytes(20).toString('hex')}`;
const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
const keyPrefix = rawKey.slice(0, 16);
// Store keyHash + keyPrefix, return rawKey once
```

**Commit:** `feat: add tenant provisioning with API key generation`

---

## Phase 2: Dashboard

### Task 4: Dashboard Layout & Overview

**Files:**
- Create: `src/app/dashboard/layout.tsx`
- Create: `src/app/dashboard/page.tsx`
- Create: `src/components/dashboard/Sidebar.tsx`
- Create: `src/components/dashboard/UsageCard.tsx`

**Dashboard layout:**
- Sidebar navigation: Overview, Scans, API Keys, Usage, Billing, Settings
- Top bar: tenant name, user email, logout button
- Dark theme matching existing caso-navy design

**Overview page:**
- Usage card: pages used / pages included, progress bar, overage warning
- Recent scans table (last 10)
- Quick actions: "New Scan", "View API Keys"
- Plan info card: current plan name, price, renewal date

**Commit:** `feat: add dashboard layout with overview page`

---

### Task 5: API Keys Management Page

**Files:**
- Create: `src/app/dashboard/api-keys/page.tsx`
- Create: `src/app/api/tenants/api-keys/route.ts`

**Page features:**
- List all API keys for the tenant (show prefix, name, created date, last used, active/inactive)
- "Create New Key" button → modal with name field → generates key → shows full key ONCE with copy button
- Revoke key button (sets is_active = false)
- Keys shown masked: `caso_ak_a1b2c3d4...` (only prefix visible)

**API route** (`/api/tenants/api-keys`):
- GET: list keys for authenticated user's tenant
- POST: create new key, return raw key once
- DELETE: revoke key by ID

**Commit:** `feat: add API key management page`

---

### Task 6: Usage & Scans Pages

**Files:**
- Create: `src/app/dashboard/usage/page.tsx`
- Create: `src/app/dashboard/scans/page.tsx`

**Usage page:**
- Current billing period usage breakdown
- Bar chart or table: pages by day
- Split by action type (analyze vs remediate)
- Overage indicator if over limit

**Scans page:**
- Table of all scans for this tenant
- Columns: domain, date, documents found, status, score, actions
- Click to view report (links to existing `/report/[scanId]`)
- "New Scan" button → reuse existing ScanForm component

**Commit:** `feat: add usage tracking and scans management pages`

---

## Phase 3: FastAPI Auth Middleware

### Task 7: API Key Auth Middleware for FastAPI

**Files:**
- Create: `api-service/auth.py`
- Modify: `api-service/main.py`
- Modify: `api-service/requirements.txt` (add `supabase`)

**Auth module** (`api-service/auth.py`):
```python
import hashlib
from fastapi import Request, HTTPException
# Use direct Supabase client or psycopg2

async def validate_api_key(request: Request) -> dict:
    """Extract and validate API key, return tenant context."""
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer caso_ak_"):
        raise HTTPException(401, "Missing or invalid API key")

    key = auth.removeprefix("Bearer ").strip()
    key_hash = hashlib.sha256(key.encode()).hexdigest()

    # Query api_keys table
    # Return tenant_id, scopes, plan info
    # Check is_active, expires_at
    # Update last_used_at
```

**Usage tracking** (add to auth.py):
```python
async def record_usage(tenant_id, api_key_id, action, pages, filename, doc_format):
    """Insert usage record and check limits."""
    # Insert into usage_records
    # Return usage info (pages_used, pages_included, is_overage)
```

**Update main.py:**
- Add Supabase client initialization (using service role key from env)
- Add auth dependency to `/api/analyze` and `/api/remediate` endpoints
- Skip auth for `/health` and `/` endpoints
- Add `X-CASO-Usage` response headers (pages_used, pages_remaining)
- Record usage after successful processing

**Commit:** `feat: add API key authentication and usage tracking to FastAPI`

---

### Task 8: Fix LibreOffice Concurrency Bug

**Files:**
- Modify: `api-service/convert.py`

Add unique UserInstallation per conversion to prevent profile lock collisions:

```python
import tempfile
import shutil

def convert_to_pdf(input_path: Path, output_dir: Path) -> Path:
    # Create unique temp dir for LibreOffice user profile
    user_install_dir = tempfile.mkdtemp(prefix="lo_profile_")
    try:
        result = subprocess.run([
            LIBREOFFICE_BIN,
            "--headless",
            "--norestore",
            f"-env:UserInstallation=file://{user_install_dir}",
            "--convert-to", "pdf",
            "--outdir", str(output_dir),
            str(input_path),
        ], ...)
        # ... rest of conversion
    finally:
        shutil.rmtree(user_install_dir, ignore_errors=True)
```

**Also:** Add non-root USER to Dockerfile, add file cleanup, add --workers 2 to uvicorn CMD.

**Commit:** `fix: LibreOffice concurrency + Docker hardening`

---

## Phase 4: Stripe Billing

### Task 9: Install Stripe & Create Billing API Routes

**Files:**
- Modify: `package.json` (add `stripe`)
- Create: `src/lib/stripe.ts`
- Create: `src/app/api/billing/create-checkout/route.ts`
- Create: `src/app/api/billing/webhook/route.ts`
- Create: `src/app/api/billing/portal/route.ts`

**Stripe client** (`src/lib/stripe.ts`):
```typescript
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
```

**Checkout route** — creates Stripe Checkout session for plan selection:
- Takes plan_id, creates checkout with correct price
- Sets metadata.tenant_id for webhook matching
- Returns checkout URL

**Webhook route** — handles Stripe events:
- `checkout.session.completed` → update tenant with stripe_customer_id, stripe_subscription_id, plan_id, status='active'
- `invoice.payment_failed` → set tenant status='suspended'
- `invoice.paid` → set tenant status='active'
- `customer.subscription.deleted` → set status='cancelled'

**Portal route** — creates Stripe Customer Portal session for self-service billing management

**Commit:** `feat: add Stripe billing with checkout, webhooks, and customer portal`

---

### Task 10: Billing Dashboard Page

**Files:**
- Create: `src/app/dashboard/billing/page.tsx`

**Features:**
- Current plan card with name, price, pages included
- "Upgrade Plan" button → Stripe Checkout
- "Manage Billing" button → Stripe Customer Portal
- Usage this period: X / Y pages used
- Overage charges estimate
- Billing history (from Stripe invoices)

**Commit:** `feat: add billing management dashboard page`

---

## Phase 5: Docker Agent for Clients

### Task 11: Create the Client Docker Agent

**Files:**
- Create: `agent/Dockerfile`
- Create: `agent/agent.py`
- Create: `agent/requirements.txt`
- Create: `agent/docker-compose.yml`

The agent is a lightweight Python service that:
1. Reads `CASO_API_KEY` and `TARGET_DOMAINS` from env
2. Crawls specified domains for PDFs/DOCX/XLSX (reuse crawler logic)
3. For each document found, sends it to your API (`POST /api/analyze` with Bearer token)
4. Stores results locally in SQLite
5. Serves a simple dashboard at `localhost:9090` showing:
   - Documents found, analyzed, scores
   - Usage stats (from API response headers)
   - Errors/failures
6. Runs on a configurable schedule (default: daily)

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  caso-agent:
    image: casodocument/caso-comply-agent:latest
    environment:
      - CASO_API_KEY=${CASO_API_KEY}
      - TARGET_DOMAINS=example.gov,example.edu
      - SCAN_SCHEDULE=0 2 * * *  # 2 AM daily
      - DASHBOARD_PORT=9090
    ports:
      - "9090:9090"
    volumes:
      - caso-data:/app/data
volumes:
  caso-data:
```

**Commit:** `feat: create Docker agent for client-side deployment`

---

## Phase 6: Website Updates

### Task 12: Update Website Messaging for Multi-Format + SaaS

**Files:**
- Modify: `src/app/layout.tsx` (SEO metadata)
- Modify: `src/app/page.tsx` (landing page — ~20 text changes)
- Modify: `src/app/demo/page.tsx` (~15 text changes)

Key changes:
- Title: "AI-Powered Document Accessibility Remediation" (not just PDF)
- Hero: "PDFs. Word docs. Spreadsheets. All made accessible — automatically."
- Feature bullets mentioning multi-format support
- Add "Pricing" section to landing page with plan cards
- Add "Login" / "Sign Up" to navigation
- Update OG meta tags

**Commit:** `feat: update website messaging for multi-format SaaS launch`

---

### Task 13: Add Pricing Page

**Files:**
- Create: `src/app/pricing/page.tsx`

Three-column pricing cards:
- Starter ($299/mo), Professional ($799/mo), Enterprise ($2,499/mo)
- Feature comparison table
- "Start Free Trial" CTA → signup flow
- "Contact Sales" for Enterprise
- FAQ section

**Commit:** `feat: add pricing page with plan comparison`

---

## Phase 7: Polish & Deploy

### Task 14: Navigation Updates

**Files:**
- Modify: `src/components/MobileNav.tsx`
- Modify: `src/app/page.tsx` (header/nav section)

Add to navigation:
- "Pricing" link
- "Login" / "Dashboard" (conditional on auth state)
- "Sign Up" CTA button

**Commit:** `feat: update navigation with auth-aware links`

---

### Task 15: End-to-End Testing & Deploy

1. Test signup → tenant creation → API key generation
2. Test API key auth on FastAPI endpoints
3. Test usage tracking and limit enforcement
4. Test Stripe checkout → webhook → plan activation
5. Deploy: push api-service to Render, vercel --prod for Next.js
6. Configure Stripe webhook endpoint on Vercel

**Commit:** Any final fixes
