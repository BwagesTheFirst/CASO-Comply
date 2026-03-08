ALTER TABLE scan_pdfs
  ADD COLUMN IF NOT EXISTS original_format text DEFAULT 'pdf';
