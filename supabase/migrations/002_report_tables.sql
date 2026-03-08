-- Individual PDF analysis results
CREATE TABLE scan_pdfs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id uuid REFERENCES scans(id) ON DELETE CASCADE,
  url text NOT NULL,
  filename text NOT NULL,
  score integer,
  grade text,
  issues jsonb DEFAULT '[]'::jsonb,
  checks jsonb DEFAULT '{}'::jsonb,
  page_count integer,
  error text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_scan_pdfs_scan_id ON scan_pdfs(scan_id);

ALTER TABLE scan_pdfs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON scan_pdfs FOR ALL USING (true);

-- Add report columns to scans
ALTER TABLE scans
  ADD COLUMN IF NOT EXISTS report_status text,
  ADD COLUMN IF NOT EXISTS overall_score integer,
  ADD COLUMN IF NOT EXISTS overall_grade text,
  ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS report_email text;
