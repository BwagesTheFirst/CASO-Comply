import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "../middleware";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/admin/invoices — List invoices with filters
export async function GET(request: NextRequest) {
  const user = await requireSuperAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status");
  const tenantId = searchParams.get("tenant_id");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const offset = (page - 1) * limit;

  let query = admin
    .from("invoices")
    .select("*, tenants(name, billing_email)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq("status", status);
  }

  if (tenantId) {
    query = query.eq("tenant_id", tenantId);
  }

  const { data: invoices, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If search is provided, filter by tenant name or invoice number client-side
  // (Supabase doesn't support cross-table text search easily)
  let filtered = invoices || [];
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (inv: Record<string, unknown>) => {
        const tenant = inv.tenants as { name?: string } | null;
        return (
          (inv.invoice_number as string).toLowerCase().includes(q) ||
          (tenant?.name || "").toLowerCase().includes(q)
        );
      }
    );
  }

  return NextResponse.json({
    invoices: filtered,
    total: search ? filtered.length : (count ?? 0),
    page,
    limit,
  });
}

// POST /api/admin/invoices — Generate invoice for a tenant
export async function POST(request: NextRequest) {
  const user = await requireSuperAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    tenant_id,
    billing_period_start,
    billing_period_end,
    payment_terms = "Net 30",
    po_number,
    notes,
  } = body;

  if (!tenant_id || !billing_period_start || !billing_period_end) {
    return NextResponse.json(
      { error: "tenant_id, billing_period_start, and billing_period_end are required" },
      { status: 400 }
    );
  }

  // Fetch tenant with plan
  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .select("*, subscription_plans(*)")
    .eq("id", tenant_id)
    .single();

  if (tenantError || !tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  const plan = tenant.subscription_plans;

  // Build line items
  const lineItems: Array<{
    description: string;
    quantity: number;
    unit_price_cents: number;
    total_cents: number;
  }> = [];

  // 1. Plan base cost
  if (plan) {
    lineItems.push({
      description: `${plan.name} Plan - ${formatPeriod(billing_period_start, billing_period_end)}`,
      quantity: 1,
      unit_price_cents: plan.monthly_price_cents,
      total_cents: plan.monthly_price_cents,
    });
  }

  // 2. Calculate usage for billing period
  const { data: usageRecords } = await admin
    .from("usage_records")
    .select("pages_consumed")
    .eq("tenant_id", tenant_id)
    .gte("billing_period_start", billing_period_start)
    .lte("billing_period_start", billing_period_end);

  const totalPages = (usageRecords || []).reduce(
    (sum: number, r: { pages_consumed: number }) => sum + (r.pages_consumed || 0),
    0
  );

  const pagesIncluded = plan?.pages_included || 0;
  const overagePages = Math.max(0, totalPages - pagesIncluded);
  const overageRate = plan?.overage_rate_cents || 0;

  if (overagePages > 0 && overageRate > 0) {
    lineItems.push({
      description: `Overage: ${overagePages.toLocaleString()} pages @ $${(overageRate / 100).toFixed(2)}/page`,
      quantity: overagePages,
      unit_price_cents: overageRate,
      total_cents: overagePages * overageRate,
    });
  }

  // Calculate totals
  const subtotalCents = lineItems.reduce((sum, item) => sum + item.total_cents, 0);
  const taxCents = 0; // No tax for government clients
  const totalCents = subtotalCents + taxCents;

  // Generate invoice number
  const year = new Date().getFullYear();
  const { data: seqResult } = await admin.rpc("nextval", {
    seq_name: "invoice_number_seq",
  });

  // Fallback: count existing invoices if RPC doesn't work
  let seq = seqResult;
  if (!seq) {
    const { count } = await admin
      .from("invoices")
      .select("*", { count: "exact", head: true });
    seq = (count || 0) + 1;
  }

  const invoiceNumber = `INV-${year}-${String(seq).padStart(4, "0")}`;

  // Calculate due date
  const dueDate = calculateDueDate(payment_terms);

  // Create invoice
  const { data: invoice, error: insertError } = await admin
    .from("invoices")
    .insert({
      invoice_number: invoiceNumber,
      tenant_id,
      billing_period_start,
      billing_period_end,
      line_items: lineItems,
      subtotal_cents: subtotalCents,
      tax_cents: taxCents,
      total_cents: totalCents,
      payment_terms: payment_terms,
      po_number: po_number || null,
      notes: notes || null,
      status: "draft",
      due_date: dueDate,
    })
    .select("*, tenants(name, billing_email)")
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ invoice }, { status: 201 });
}

function formatPeriod(start: string, end: string): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${months[s.getMonth()]} ${s.getFullYear()}`;
  }

  return `${months[s.getMonth()]} ${s.getFullYear()} - ${months[e.getMonth()]} ${e.getFullYear()}`;
}

function calculateDueDate(paymentTerms: string): string {
  const now = new Date();
  let days = 30;

  if (paymentTerms === "Net 60") {
    days = 60;
  } else if (paymentTerms === "Net 45") {
    days = 45;
  } else if (paymentTerms === "Due on Receipt") {
    days = 0;
  }

  now.setDate(now.getDate() + days);
  return now.toISOString().split("T")[0];
}
