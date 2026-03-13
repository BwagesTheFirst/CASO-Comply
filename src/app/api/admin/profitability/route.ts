import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "../middleware";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const user = await requireSuperAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { searchParams } = new URL(request.url);

  // Date range defaults to current month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const today = now.toISOString().split("T")[0];

  const startDate = searchParams.get("start_date") || monthStart;
  const endDate = searchParams.get("end_date") || today;

  try {
    const [summaryRes, tenantRes, configRes] = await Promise.all([
      // Overall profitability summary
      admin.rpc("get_profitability_summary", {
        p_start_date: startDate,
        p_end_date: endDate,
      }),

      // Per-tenant breakdown
      admin.rpc("get_tenant_profitability", {
        p_start_date: startDate,
        p_end_date: endDate,
      }),

      // Current cost configuration
      admin
        .from("platform_cost_config")
        .select("key, value, unit, description, updated_at")
        .order("key"),
    ]);

    if (summaryRes.error) {
      throw new Error(
        `Profitability summary query failed: ${summaryRes.error.message}`
      );
    }
    if (tenantRes.error) {
      throw new Error(
        `Tenant profitability query failed: ${tenantRes.error.message}`
      );
    }
    if (configRes.error) {
      throw new Error(
        `Cost config query failed: ${configRes.error.message}`
      );
    }

    // Calculate fixed monthly costs from config
    const configMap: Record<string, number> = {};
    for (const row of configRes.data || []) {
      configMap[row.key] = Number(row.value);
    }

    const fixedMonthlyCents =
      ((configMap["supabase_db_monthly"] || 0) +
        (configMap["render_monthly"] || 0) +
        (configMap["vercel_monthly"] || 0)) *
      100;

    // The RPC returns a single row for summary
    const summary = Array.isArray(summaryRes.data)
      ? summaryRes.data[0] || null
      : summaryRes.data;

    return NextResponse.json({
      period: { start_date: startDate, end_date: endDate },
      summary,
      per_tenant: tenantRes.data || [],
      cost_config: configRes.data || [],
      fixed_costs: {
        monthly_total_cents: fixedMonthlyCents,
        breakdown: {
          supabase_db_cents: (configMap["supabase_db_monthly"] || 0) * 100,
          render_cents: (configMap["render_monthly"] || 0) * 100,
          vercel_cents: (configMap["vercel_monthly"] || 0) * 100,
        },
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch profitability data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
