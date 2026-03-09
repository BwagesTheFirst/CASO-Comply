import { NextResponse } from "next/server";
import { requireSuperAdmin } from "../middleware";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const user = await requireSuperAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const todayStart = now.toISOString().split("T")[0];

  const [
    pagesTodayRes,
    pagesThisMonthRes,
    pagesAllTimeRes,
    actionBreakdownRes,
    tenantBreakdownRes,
    recentActivityRes,
    tierBreakdownRes,
  ] = await Promise.all([
    // Pages today
    admin
      .from("usage_records")
      .select("pages_consumed")
      .gte("created_at", `${todayStart}T00:00:00.000Z`),

    // Pages this month
    admin
      .from("usage_records")
      .select("pages_consumed")
      .gte("created_at", `${monthStart}T00:00:00.000Z`),

    // Pages all time
    admin.from("usage_records").select("pages_consumed"),

    // Action breakdown this month
    admin
      .from("usage_records")
      .select("action, pages_consumed")
      .gte("created_at", `${monthStart}T00:00:00.000Z`),

    // Tenant breakdown: get usage with tenant info
    admin
      .from("usage_records")
      .select("tenant_id, pages_consumed, created_at, tenants(name)")
      .order("created_at", { ascending: false }),

    // Recent activity: last 50 records
    admin
      .from("usage_records")
      .select(
        "id, created_at, action, pages_consumed, document_filename, tenant_id, tenants(name)"
      )
      .order("created_at", { ascending: false })
      .limit(50),

    // Tier breakdown this month (remediation_type + cost)
    admin
      .from("usage_records")
      .select("remediation_type, pages_consumed, cost_cents")
      .gte("created_at", `${monthStart}T00:00:00.000Z`)
      .not("remediation_type", "is", null),
  ]);

  // Pages today
  const pagesToday =
    pagesTodayRes.data?.reduce(
      (sum: number, r: { pages_consumed: number }) =>
        sum + (r.pages_consumed || 0),
      0
    ) ?? 0;

  // Pages this month
  const pagesThisMonth =
    pagesThisMonthRes.data?.reduce(
      (sum: number, r: { pages_consumed: number }) =>
        sum + (r.pages_consumed || 0),
      0
    ) ?? 0;

  // Pages all time
  const pagesAllTime =
    pagesAllTimeRes.data?.reduce(
      (sum: number, r: { pages_consumed: number }) =>
        sum + (r.pages_consumed || 0),
      0
    ) ?? 0;

  // Action breakdown
  const actionMap: Record<string, { pages: number; count: number }> = {};
  for (const r of actionBreakdownRes.data ?? []) {
    const rec = r as { action: string; pages_consumed: number };
    if (!actionMap[rec.action]) {
      actionMap[rec.action] = { pages: 0, count: 0 };
    }
    actionMap[rec.action].pages += rec.pages_consumed || 0;
    actionMap[rec.action].count += 1;
  }
  const actionBreakdown = Object.entries(actionMap).map(([action, data]) => ({
    action,
    pages: data.pages,
    count: data.count,
  }));

  // Tenant breakdown
  interface TenantUsageRow {
    tenant_id: string;
    pages_consumed: number;
    created_at: string;
    tenants: { name: string } | { name: string }[] | null;
  }
  const tenantMap: Record<
    string,
    { name: string; pages_this_month: number; pages_all_time: number }
  > = {};
  for (const r of (tenantBreakdownRes.data ?? []) as TenantUsageRow[]) {
    const tenantId = r.tenant_id;
    if (!tenantMap[tenantId]) {
      const tenantData = r.tenants;
      let tenantName: string;
      if (tenantId === "00000000-0000-0000-0000-000000000000") {
        tenantName = "Demo / Anonymous";
      } else if (Array.isArray(tenantData)) {
        tenantName = tenantData[0]?.name ?? "Unknown";
      } else {
        tenantName = tenantData?.name ?? "Unknown";
      }
      tenantMap[tenantId] = {
        name: tenantName,
        pages_this_month: 0,
        pages_all_time: 0,
      };
    }
    tenantMap[tenantId].pages_all_time += r.pages_consumed || 0;
    if (r.created_at >= `${monthStart}T00:00:00.000Z`) {
      tenantMap[tenantId].pages_this_month += r.pages_consumed || 0;
    }
  }
  const tenantBreakdown = Object.entries(tenantMap)
    .map(([tenant_id, data]) => ({
      tenant_id,
      ...data,
    }))
    .sort((a, b) => b.pages_this_month - a.pages_this_month);

  // Recent activity
  interface RecentRow {
    id: string;
    created_at: string;
    action: string;
    pages_consumed: number;
    document_filename: string | null;
    tenant_id: string;
    tenants: { name: string } | { name: string }[] | null;
  }
  const recentActivity = ((recentActivityRes.data ?? []) as RecentRow[]).map(
    (r) => {
      let tenantName: string;
      if (r.tenant_id === "00000000-0000-0000-0000-000000000000") {
        tenantName = "Demo / Anonymous";
      } else if (Array.isArray(r.tenants)) {
        tenantName = r.tenants[0]?.name ?? "Unknown";
      } else {
        tenantName = r.tenants?.name ?? "Unknown";
      }
      return {
        id: r.id,
        created_at: r.created_at,
        action: r.action,
        pages_consumed: r.pages_consumed,
        document_filename: r.document_filename,
        tenant_name: tenantName,
      };
    }
  );

  // Tier breakdown (remediation type revenue)
  interface TierRow {
    remediation_type: string;
    pages_consumed: number;
    cost_cents: number | null;
  }
  const tierMap: Record<string, { pages: number; revenue_cents: number }> = {};
  for (const r of (tierBreakdownRes.data ?? []) as TierRow[]) {
    const tier = r.remediation_type;
    if (!tierMap[tier]) {
      tierMap[tier] = { pages: 0, revenue_cents: 0 };
    }
    tierMap[tier].pages += r.pages_consumed || 0;
    tierMap[tier].revenue_cents += r.cost_cents || 0;
  }
  const tierBreakdown = Object.entries(tierMap).map(
    ([remediation_type, data]) => ({
      remediation_type,
      pages: data.pages,
      revenue_cents: data.revenue_cents,
    })
  );

  return NextResponse.json({
    pages_today: pagesToday,
    pages_this_month: pagesThisMonth,
    pages_all_time: pagesAllTime,
    action_breakdown: actionBreakdown,
    tenant_breakdown: tenantBreakdown,
    recent_activity: recentActivity,
    tier_breakdown: tierBreakdown,
  });
}
