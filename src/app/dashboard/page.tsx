import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function DashboardOverview() {
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
    .select("tenant_id, role")
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return (
      <div className="text-caso-white">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-4">
          No Tenant Found
        </h1>
        <p className="text-caso-slate">
          Your account is not associated with any organization. Please contact
          support.
        </p>
      </div>
    );
  }

  const tenantId = membership.tenant_id;

  // Get tenant + plan info
  const { data: tenant } = await admin
    .from("tenants")
    .select("*, subscription_plans(*)")
    .eq("id", tenantId)
    .single();

  // Get usage via RPC
  const { data: usage } = await admin.rpc("get_tenant_usage", {
    p_tenant_id: tenantId,
  });

  // Recent scans (last 5)
  const { data: recentScans } = await admin
    .from("scans")
    .select("id, domain, status, created_at, score")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(5);

  const plan = tenant?.subscription_plans;
  // RPC may return array or single object
  const usageRow = Array.isArray(usage) ? usage[0] : usage;
  const totalPages = usageRow?.total_pages ?? 0;
  const pagesIncluded = usageRow?.pages_included ?? plan?.pages_included ?? 0;
  const pagesRemaining = usageRow?.pages_remaining ?? pagesIncluded;
  const overagePages = usageRow?.overage_pages ?? 0;
  const usagePercent = pagesIncluded > 0 ? Math.min((totalPages / pagesIncluded) * 100, 100) : 0;

  // Trial banner
  const isTrial = tenant?.status === "trial";
  const trialEndsAt = tenant?.trial_ends_at ? new Date(tenant.trial_ends_at) : null;
  const trialDaysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  function usageBarColor(pct: number) {
    if (pct >= 100) return "bg-caso-red";
    if (pct >= 80) return "bg-caso-warm";
    return "bg-caso-green";
  }

  function gradeFromScore(score: number | null): string {
    if (score === null || score === undefined) return "N/A";
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
        Dashboard
      </h1>

      {/* Trial Banner */}
      {isTrial && (
        <div className="rounded-xl bg-caso-warm/10 border border-caso-warm/30 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-caso-warm font-semibold text-sm">
              Trial Period
            </p>
            <p className="text-caso-slate text-sm mt-0.5">
              Your trial ends in{" "}
              <span className="text-caso-white font-medium">
                {trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""}
              </span>
              . Upgrade to keep your access.
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="rounded-lg bg-caso-warm px-4 py-2 text-sm font-semibold text-caso-navy hover:bg-caso-warm-dark transition-colors whitespace-nowrap"
          >
            Upgrade Now
          </Link>
        </div>
      )}

      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Usage Summary */}
        <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
          <h2 className="text-sm font-medium text-caso-slate mb-4">
            Page Usage This Period
          </h2>
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold text-caso-white">
              {totalPages.toLocaleString()}
            </span>
            <span className="text-sm text-caso-slate">
              / {pagesIncluded.toLocaleString()} included
            </span>
          </div>
          <div className="w-full bg-caso-navy rounded-full h-2.5 mb-3">
            <div
              className={`h-2.5 rounded-full transition-all ${usageBarColor(usagePercent)}`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-caso-slate">
            <span>{pagesRemaining.toLocaleString()} remaining</span>
            {overagePages > 0 && (
              <span className="text-caso-red">
                {overagePages.toLocaleString()} overage
              </span>
            )}
          </div>
        </div>

        {/* Current Plan */}
        <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
          <h2 className="text-sm font-medium text-caso-slate mb-4">
            Current Plan
          </h2>
          <p className="text-2xl font-bold text-caso-white mb-1">
            {plan?.name ?? "No Plan"}
          </p>
          {plan && (
            <>
              <p className="text-caso-blue text-lg font-semibold">
                ${(plan.monthly_price_cents / 100).toFixed(0)}
                <span className="text-caso-slate text-sm font-normal">/mo</span>
              </p>
              <p className="text-xs text-caso-slate mt-2">
                {plan.pages_included?.toLocaleString()} pages included
              </p>
            </>
          )}
          <Link
            href="/dashboard/billing"
            className="inline-block mt-4 text-sm text-caso-blue hover:text-caso-blue-bright transition-colors"
          >
            Manage billing &rarr;
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
          <h2 className="text-sm font-medium text-caso-slate mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/demo"
              className="flex items-center gap-3 rounded-lg bg-caso-blue/10 border border-caso-blue/20 px-4 py-3 text-sm font-medium text-caso-blue hover:bg-caso-blue/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              New Scan
            </Link>
            <Link
              href="/dashboard/api-keys"
              className="flex items-center gap-3 rounded-lg bg-white/5 border border-caso-border px-4 py-3 text-sm font-medium text-caso-slate hover:text-caso-white hover:bg-white/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
              View API Keys
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
        <div className="px-6 py-4 border-b border-caso-border flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white">
            Recent Scans
          </h2>
          <Link
            href="/dashboard/scans"
            className="text-sm text-caso-blue hover:text-caso-blue-bright transition-colors"
          >
            View all &rarr;
          </Link>
        </div>

        {recentScans && recentScans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-caso-border text-left">
                  <th className="px-6 py-3 text-caso-slate font-medium">Domain</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Date</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Grade</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Status</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.map((scan) => (
                  <tr
                    key={scan.id}
                    className="border-b border-caso-border/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3 text-caso-white font-medium">
                      {scan.domain}
                    </td>
                    <td className="px-6 py-3 text-caso-slate">
                      {new Date(scan.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          gradeFromScore(scan.score) === "A"
                            ? "bg-caso-green/20 text-caso-green"
                            : gradeFromScore(scan.score) === "B"
                            ? "bg-caso-blue/20 text-caso-blue"
                            : gradeFromScore(scan.score) === "C"
                            ? "bg-caso-warm/20 text-caso-warm"
                            : gradeFromScore(scan.score) === "N/A"
                            ? "bg-caso-slate/20 text-caso-slate"
                            : "bg-caso-red/20 text-caso-red"
                        }`}
                      >
                        {gradeFromScore(scan.score)}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          scan.status === "completed"
                            ? "bg-caso-green/10 text-caso-green"
                            : scan.status === "running"
                            ? "bg-caso-blue/10 text-caso-blue"
                            : scan.status === "failed"
                            ? "bg-caso-red/10 text-caso-red"
                            : "bg-caso-slate/10 text-caso-slate"
                        }`}
                      >
                        {scan.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/report/${scan.id}`}
                        className="text-caso-blue hover:text-caso-blue-bright text-sm transition-colors"
                      >
                        View Report
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-caso-slate text-sm">No scans yet.</p>
            <Link
              href="/demo"
              className="inline-block mt-3 text-sm text-caso-blue hover:text-caso-blue-bright transition-colors"
            >
              Run your first scan &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
