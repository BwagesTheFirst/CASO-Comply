-- Migration 010: Leads CRM
-- Unified leads table for all form submissions (contact, free-scan, scan email captures)

-- Lead status enum
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');

-- Lead source enum
CREATE TYPE lead_source AS ENUM ('contact', 'free_scan', 'scan_email', 'manual');

-- Unified leads table
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contact info
  name text,
  email text NOT NULL,
  phone text,
  organization text,

  -- Lead metadata
  source lead_source NOT NULL DEFAULT 'manual',
  status lead_status NOT NULL DEFAULT 'new',

  -- Source-specific fields (stored as JSONB for flexibility)
  -- contact: { helpWith, message }
  -- free_scan: { websiteUrl, documentCount, industry }
  -- scan_email: { scanId, websiteUrl }
  metadata jsonb DEFAULT '{}',

  -- Assignment
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  contacted_at timestamptz,

  -- Indexing
  CONSTRAINT leads_email_check CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$')
);

-- Lead notes (team can annotate leads)
CREATE TABLE lead_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Lead activity log (auto-tracked events)
CREATE TABLE lead_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  action text NOT NULL, -- 'created', 'status_changed', 'note_added', 'email_sent', 'assigned'
  details jsonb DEFAULT '{}',
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- null = system
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_lead_notes_lead_id ON lead_notes(lead_id);
CREATE INDEX idx_lead_activity_lead_id ON lead_activity(lead_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();

-- RLS Policies
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activity ENABLE ROW LEVEL SECURITY;

-- Super admins (via service role) have full access
-- Public API routes use service role to insert leads
CREATE POLICY "Service role full access on leads"
  ON leads FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on lead_notes"
  ON lead_notes FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on lead_activity"
  ON lead_activity FOR ALL
  USING (true)
  WITH CHECK (true);

-- Stats function for admin dashboard
CREATE OR REPLACE FUNCTION get_lead_stats()
RETURNS json AS $$
  SELECT json_build_object(
    'total', (SELECT count(*) FROM leads),
    'new', (SELECT count(*) FROM leads WHERE status = 'new'),
    'contacted', (SELECT count(*) FROM leads WHERE status = 'contacted'),
    'qualified', (SELECT count(*) FROM leads WHERE status = 'qualified'),
    'this_week', (SELECT count(*) FROM leads WHERE created_at >= date_trunc('week', now())),
    'this_month', (SELECT count(*) FROM leads WHERE created_at >= date_trunc('month', now())),
    'by_source', (
      SELECT json_object_agg(source, cnt)
      FROM (SELECT source, count(*) as cnt FROM leads GROUP BY source) s
    )
  );
$$ LANGUAGE sql SECURITY DEFINER;
