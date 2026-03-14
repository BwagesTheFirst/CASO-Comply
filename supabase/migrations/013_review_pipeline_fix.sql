-- 013_review_pipeline_fix.sql
-- Link review_queue back to documents and track review state on documents

BEGIN;

-- 1. Add document_id to review_queue so we can trace back to the customer's document
ALTER TABLE review_queue
  ADD COLUMN IF NOT EXISTS document_id UUID REFERENCES documents(id);

CREATE INDEX IF NOT EXISTS idx_review_queue_document_id ON review_queue(document_id);

-- 2. Add review_status to documents so the customer can see expert review progress
ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS review_status TEXT
    CHECK (review_status IS NULL OR review_status IN ('pending', 'in_review', 'completed', 'delivered'));

COMMIT;
