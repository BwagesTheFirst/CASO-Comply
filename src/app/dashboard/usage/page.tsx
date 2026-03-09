import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function UsagePage() {
  // Auth check (server client)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Data queries (admin client, bypasses RLS)
  const admin = createAdminClient();

  const { data: membership } = await admin
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!membership) redirect("/dashboard");

  const tenantId = membership.tenant_id;

  // Get usage summary via RPC
  const { data: usage } = await admin.rpc("get_tenant_usage", {
    p_tenant_id: tenantId,
  });

  // Get daily usage breakdown for the current billing period
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const { data: dailyUsage } = await admin
    .from("usage_records")
    .select("created_at, action, pages_consumed")
    .eq("tenant_id", tenantId)
    .gte("created_at", periodStart.toISOString())
    .lte("created_at", periodEnd.toISOString())
    .order("created_at", { ascending: false });

  // RPC returns one row per (billing_period_start, action) — aggregate them
  const usageRows = Array.isArray(usage) ? usage : usage ? [usage] : [];
  const totalPages = usageRows.reduce((sum: number, r: { total_pages?: number }) => sum + (r.total_pages ?? 0), 0);
  const pagesIncluded = usageRows[0]?.pages_included ?? 0;
  const pagesRemaining = Math.max(0, pagesIncluded - totalPages);
  const overagePages = Math.max(0, totalPages - pagesIncluded);
  const totalAnalyses = usageRows
    .filter((r: { action?: string }) => r.action === "analyze")
    .reduce((sum: number, r: { record_count?: number }) => sum + (r.record_count ?? 0), 0);
  const totalRemediations = usageRows
    .filter((r: { action?: string }) => r.action === "remediate")
    .reduce((sum: number, r: { record_count?: number }) => sum + (r.record_count ?? 0), 0);
  const usagePercent =
    pagesIncluded > 0 ? (totalPages / pagesIncluded) * 100 : 0;

  function barColor(pct: number) {
    if (pct > 100) return "bg-caso-red";
    if (pct >= 80) return "bg-caso-warm";
    return "bg-caso-green";
  }

  // Group daily usage by date
  interface DayBucket {
    date: string;
    analyze: number;
    remediate: number;
    scan: number;
    pages: number;
  }

  const dayMap = new Map<string, DayBucket>();
  if (dailyUsage) {
    for (const record of dailyUsage) {
      const dateKey = new Date(record.created_at).toLocaleDateString();
      const existing = dayMap.get(dateKey) ?? {
        date: dateKey,
        analyze: 0,
        remediate: 0,
        scan: 0,
        pages: 0,
      };
      if (record.action === "analyze") existing.analyze++;
      else if (record.action === "remediate") existing.remediate++;
      else if (record.action === "scan") existing.scan++;
      existing.pages += record.pages_consumed ?? 0;
      dayMap.set(dateKey, existing);
    }
  }
  const dailyRows = Array.from(dayMap.values());

  const monthName = now.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
        Usage &mdash; {monthName}
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-caso-navy-light border border-caso-border p-5">
          <p className="text-xs text-caso-slate mb-1">Pages Used</p>
          <p className="text-2xl font-bold text-caso-white">
            {totalPages.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl bg-caso-navy-light border border-caso-border p-5">
          <p className="text-xs text-caso-slate mb-1">Pages Included</p>
          <p className="text-2xl font-bold text-caso-white">
            {pagesIncluded.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl bg-caso-navy-light border border-caso-border p-5">
          <p className="text-xs text-caso-slate mb-1">Remaining</p>
          <p className="text-2xl font-bold text-caso-green">
            {pagesRemaining.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl bg-caso-navy-light border border-caso-border p-5">
          <p className="text-xs text-caso-slate mb-1">Overage</p>
          <p
            className={`text-2xl font-bold ${
              overagePages > 0 ? "text-caso-red" : "text-caso-white"
            }`}
          >
            {overagePages.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-caso-slate">
            Usage Progress
          </p>
          <p className="text-sm text-caso-slate">
            {Math.round(usagePercent)}%
          </p>
        </div>
        <div className="w-full bg-caso-navy rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${barColor(usagePercent)}`}
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>
        {usagePercent > 100 && (
          <p className="text-caso-red text-xs mt-2">
            You have exceeded your included pages by{" "}
            {overagePages.toLocaleString()} pages. Overage charges will apply.
          </p>
        )}
      </div>

      {/* Action Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-caso-navy-light border border-caso-border p-5">
          <p className="text-xs text-caso-slate mb-1">Total Analyses</p>
          <p className="text-2xl font-bold text-caso-blue">
            {totalAnalyses.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl bg-caso-navy-light border border-caso-border p-5">
          <p className="text-xs text-caso-slate mb-1">Total Remediations</p>
          <p className="text-2xl font-bold text-caso-blue">
            {totalRemediations.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
        <div className="px-6 py-4 border-b border-caso-border">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white">
            Daily Breakdown
          </h2>
        </div>

        {dailyRows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-caso-border text-left">
                  <th className="px-6 py-3 text-caso-slate font-medium">Date</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Pages</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Analyses</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Remediations</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Scans</th>
                </tr>
              </thead>
              <tbody>
                {dailyRows.map((day) => (
                  <tr
                    key={day.date}
                    className="border-b border-caso-border/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3 text-caso-white">{day.date}</td>
                    <td className="px-6 py-3 text-caso-slate">
                      {day.pages.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-caso-slate">{day.analyze}</td>
                    <td className="px-6 py-3 text-caso-slate">
                      {day.remediate}
                    </td>
                    <td className="px-6 py-3 text-caso-slate">{day.scan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-caso-slate text-sm">
            No usage recorded this billing period.
          </div>
        )}
      </div>
    </div>
  );
}
