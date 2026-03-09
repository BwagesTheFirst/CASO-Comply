import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "../../middleware";
import { createAdminClient } from "@/lib/supabase/admin";

// POST /api/admin/invoices/generate — Bulk generate invoices for all active tenants
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

  const { billing_period_start, billing_period_end } = body;

  if (!billing_period_start || !billing_period_end) {
    return NextResponse.json(
      { error: "billing_period_start and billing_period_end are required" },
      { status: 400 }
    );
  }

  // Get all active/trial tenants with plans
  const { data: tenants, error: tenantsError } = await admin
    .from("tenants")
    .select("*, subscription_plans(*)")
    .in("status", ["active", "trial"])
    .not("plan_id", "is", null);

  if (tenantsError) {
    return NextResponse.json({ error: tenantsError.message }, { status: 500 });
  }

  if (!tenants || tenants.length === 0) {
    return NextResponse.json({
      generated: 0,
      skipped: 0,
      message: "No active tenants with plans found",
    });
  }

  // Check which tenants already have invoices for this period
  const { data: existingInvoices } = await admin
    .from("invoices")
    .select("tenant_id")
    .eq("billing_period_start", billing_period_start)
    .eq("billing_period_end", billing_period_end);

  const existingTenantIds = new Set(
    (existingInvoices || []).map((inv: { tenant_id: string }) => inv.tenant_id)
  );

  let generated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const tenant of tenants) {
    // Skip if invoice already exists for this period
    if (existingTenantIds.has(tenant.id)) {
      skipped++;
      continue;
    }

    const plan = tenant.subscription_plans;
    if (!plan) {
      skipped++;
      continue;
    }

    // Build line items
    const lineItems: Array<{
      description: string;
      quantity: number;
      unit_price_cents: number;
      total_cents: number;
    }> = [];

    // Plan base cost
    lineItems.push({
      description: `${plan.name} Plan - ${formatPeriod(billing_period_start, billing_period_end)}`,
      quantity: 1,
      unit_price_cents: plan.monthly_price_cents,
      total_cents: plan.monthly_price_cents,
    });

    // Calculate usage overage
    const { data: usageRecords } = await admin
      .from("usage_records")
      .select("pages_consumed")
      .eq("tenant_id", tenant.id)
      .gte("billing_period_start", billing_period_start)
      .lte("billing_period_start", billing_period_end);

    const totalPages = (usageRecords || []).reduce(
      (sum: number, r: { pages_consumed: number }) => sum + (r.pages_consumed || 0),
      0
    );

    const overagePages = Math.max(0, totalPages - (plan.pages_included || 0));
    const overageRate = plan.overage_rate_cents || 0;

    if (overagePages > 0 && overageRate > 0) {
      lineItems.push({
        description: `Overage: ${overagePages.toLocaleString()} pages @ $${(overageRate / 100).toFixed(2)}/page`,
        quantity: overagePages,
        unit_price_cents: overageRate,
        total_cents: overagePages * overageRate,
      });
    }

    const subtotalCents = lineItems.reduce((sum, item) => sum + item.total_cents, 0);

    // Generate invoice number
    const year = new Date().getFullYear();
    const { count } = await admin
      .from("invoices")
      .select("*", { count: "exact", head: true });
    const seq = (count || 0) + 1;
    const invoiceNumber = `INV-${year}-${String(seq).padStart(4, "0")}`;

    // Due date: Net 30 default
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const { error: insertError } = await admin.from("invoices").insert({
      invoice_number: invoiceNumber,
      tenant_id: tenant.id,
      billing_period_start,
      billing_period_end,
      line_items: lineItems,
      subtotal_cents: subtotalCents,
      tax_cents: 0,
      total_cents: subtotalCents,
      payment_terms: "Net 30",
      status: "draft",
      due_date: dueDate.toISOString().split("T")[0],
    });

    if (insertError) {
      errors.push(`${tenant.name}: ${insertError.message}`);
    } else {
      generated++;
    }
  }

  return NextResponse.json({
    generated,
    skipped,
    total_tenants: tenants.length,
    errors: errors.length > 0 ? errors : undefined,
  });
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
