import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "../../middleware";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/admin/invoices/[id] — Single invoice detail
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireSuperAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const admin = createAdminClient();

  const { data: invoice, error } = await admin
    .from("invoices")
    .select("*, tenants(name, billing_email, domain, slug)")
    .eq("id", id)
    .single();

  if (error || !invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json({ invoice });
}

// PUT /api/admin/invoices/[id] — Update invoice
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireSuperAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const admin = createAdminClient();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Fetch current invoice to detect status transitions
  const { data: current } = await admin
    .from("invoices")
    .select("status")
    .eq("id", id)
    .single();

  if (!current) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  // Build update object with only allowed fields
  const update: Record<string, unknown> = {};

  if (body.status !== undefined) update.status = body.status;
  if (body.po_number !== undefined) update.po_number = body.po_number;
  if (body.notes !== undefined) update.notes = body.notes;
  if (body.payment_terms !== undefined) update.payment_terms = body.payment_terms;
  if (body.line_items !== undefined) {
    update.line_items = body.line_items;
    // Recalculate totals if line items changed
    const items = body.line_items as Array<{ total_cents: number }>;
    const subtotal = items.reduce((sum, item) => sum + (item.total_cents || 0), 0);
    update.subtotal_cents = subtotal;
    update.total_cents = subtotal + (body.tax_cents ?? 0);
  }
  if (body.tax_cents !== undefined) update.tax_cents = body.tax_cents;
  if (body.due_date !== undefined) update.due_date = body.due_date;

  // Status transition side effects
  if (body.status === "sent" && current.status !== "sent") {
    update.sent_at = new Date().toISOString();
  }
  if (body.status === "paid" && current.status !== "paid") {
    update.paid_at = new Date().toISOString();
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data: invoice, error } = await admin
    .from("invoices")
    .update(update)
    .eq("id", id)
    .select("*, tenants(name, billing_email, domain, slug)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ invoice });
}
