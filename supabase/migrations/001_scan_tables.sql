-- Scans table: stores each website audit
CREATE TABLE scans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  url text NOT NULL,
  pdf_count integer DEFAULT 0,
  pdf_urls jsonb DEFAULT '[]'::jsonb,
  sample_pdf_url text,
  sample_filename text,
  sample_score integer,
  sample_grade text,
  sample_issues jsonb DEFAULT '[]'::jsonb,
  sample_checks jsonb DEFAULT '{}'::jsonb,
  sample_page_count integer,
  created_at timestamptz DEFAULT now()
);

-- Scan leads: email captures linked to scans
CREATE TABLE scan_leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id uuid REFERENCES scans(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_scans_created_at ON scans(created_at DESC);
CREATE INDEX idx_scan_leads_scan_id ON scan_leads(scan_id);

-- Enable RLS (service role bypasses automatically)
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_leads ENABLE ROW LEVEL SECURITY;
