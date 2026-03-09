import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "../middleware";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const user = await requireSuperAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
  );
  const offset = (page - 1) * limit;

  const admin = createAdminClient();

  // Build query with plan name join
  let query = admin
    .from("tenants")
    .select(
      "*, subscription_plans(name, monthly_price_cents), tenant_members(count), usage_records(pages_consumed)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data: tenants, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Shape the response
  const shaped = (tenants ?? []).map((t) => {
    const plan = t.subscription_plans as
      | { name: string; monthly_price_cents: number }
      | null;
    const memberRows = t.tenant_members as { count: number }[] | null;
    const usageRows = t.usage_records as { pages_consumed: number }[] | null;

    const memberCount = memberRows?.[0]?.count ?? 0;
    const totalPages =
      usageRows?.reduce((sum, r) => sum + (r.pages_consumed || 0), 0) ?? 0;

    return {
      id: t.id,
      name: t.name,
      slug: t.slug,
      domain: t.domain,
      status: t.status,
      plan_name: plan?.name ?? null,
      member_count: memberCount,
      total_pages_consumed: totalPages,
      trial_ends_at: t.trial_ends_at,
      created_at: t.created_at,
    };
  });

  return NextResponse.json({
    tenants: shaped,
    total: count ?? 0,
    page,
    limit,
    total_pages: Math.ceil((count ?? 0) / limit),
  });
}
