-- ============================================================
-- 006_invoicing.sql
-- Invoice system for government/hospital PO-based billing
-- ============================================================

BEGIN;

-- ----------------------------------------------------------
-- 1. Invoice status enum
-- ----------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN
    CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
  END IF;
END $$;

-- ----------------------------------------------------------
-- 2. Invoices table
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number text NOT NULL UNIQUE,  -- e.g. INV-2026-0001
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  billing_period_start date NOT NULL,
  billing_period_end date NOT NULL,
  -- Line items stored as JSONB array
  line_items jsonb NOT NULL DEFAULT '[]',
  -- Totals
  subtotal_cents integer NOT NULL DEFAULT 0,
  tax_cents integer NOT NULL DEFAULT 0,
  total_cents integer NOT NULL DEFAULT 0,
  -- Payment terms
  payment_terms text DEFAULT 'Net 30',  -- Net 30, Net 60, Due on Receipt
  po_number text,  -- Client's purchase order number
  notes text,
  -- Status tracking
  status invoice_status NOT NULL DEFAULT 'draft',
  sent_at timestamptz,
  paid_at timestamptz,
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_tenant_id ON invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

-- ----------------------------------------------------------
-- 3. Auto-increment invoice numbers
-- ----------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;

-- ----------------------------------------------------------
-- 4. Row Level Security
-- ----------------------------------------------------------
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Tenants can view their own invoices
DROP POLICY IF EXISTS "Members can view own invoices" ON invoices;
CREATE POLICY "Members can view own invoices" ON invoices FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

-- Service role full access
DROP POLICY IF EXISTS "Service role full access on invoices" ON invoices;
CREATE POLICY "Service role full access on invoices" ON invoices FOR ALL
  USING (auth.role() = 'service_role');

-- ----------------------------------------------------------
-- 5. Updated_at trigger
-- ----------------------------------------------------------
DROP TRIGGER IF EXISTS set_invoices_updated_at ON invoices;
CREATE TRIGGER set_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;
