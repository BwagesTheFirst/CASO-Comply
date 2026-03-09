import { NextResponse } from "next/server";
import { requireSuperAdmin } from "../middleware";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const user = await requireSuperAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();

  // Run all queries in parallel
  const [
    totalTenantsRes,
    activeTenantsRes,
    trialTenantsRes,
    totalUsersRes,
    totalScansRes,
    pagesThisMonthRes,
    mrrRes,
  ] = await Promise.all([
    // Total tenants
    admin.from("tenants").select("*", { count: "exact", head: true }),

    // Active tenants
    admin
      .from("tenants")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),

    // Trial tenants
    admin
      .from("tenants")
      .select("*", { count: "exact", head: true })
      .eq("status", "trial"),

    // Total users
    admin.from("tenant_members").select("*", { count: "exact", head: true }),

    // Total scans
    admin.from("scans").select("*", { count: "exact", head: true }),

    // Total pages this month
    (() => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      return admin
        .from("usage_records")
        .select("pages_consumed")
        .gte("billing_period_start", monthStart);
    })(),

    // MRR: sum monthly_price_cents for active/trial tenants via their plan
    admin
      .from("tenants")
      .select("subscription_plans(monthly_price_cents)")
      .in("status", ["active", "trial"])
      .not("plan_id", "is", null),
  ]);

  // Calculate total pages this month
  const totalPagesThisMonth =
    pagesThisMonthRes.data?.reduce(
      (sum: number, r: { pages_consumed: number }) =>
        sum + (r.pages_consumed || 0),
      0
    ) ?? 0;

  // Calculate MRR from joined plan data
  const mrr =
    mrrRes.data?.reduce(
      (
        sum: number,
        t: {
          subscription_plans:
            | { monthly_price_cents: number }
            | { monthly_price_cents: number }[]
            | null;
        }
      ) => {
        const plan = t.subscription_plans;
        if (Array.isArray(plan)) {
          return sum + (plan[0]?.monthly_price_cents || 0);
        }
        return sum + (plan?.monthly_price_cents || 0);
      },
      0
    ) ?? 0;

  return NextResponse.json({
    total_tenants: totalTenantsRes.count ?? 0,
    active_tenants: activeTenantsRes.count ?? 0,
    trial_tenants: trialTenantsRes.count ?? 0,
    total_users: totalUsersRes.count ?? 0,
    total_scans: totalScansRes.count ?? 0,
    total_pages_this_month: totalPagesThisMonth,
    mrr_cents: mrr,
  });
}
