import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: sa } = await admin
    .from("super_admins")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!sa) redirect("/dashboard");

  // Query stats directly
  const [tenantsResult, usersResult, scansResult, usageResult, revenueResult] =
    await Promise.all([
      admin.from("tenants").select("id, status"),
      admin
        .from("tenant_members")
        .select("id", { count: "exact", head: true }),
      admin.from("scans").select("id", { count: "exact", head: true }),
      admin
        .from("usage_records")
        .select("pages_consumed")
        .gte(
          "billing_period_start",
          new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            .toISOString()
            .split("T")[0]
        ),
      admin
        .from("tenants")
        .select("subscription_plans(monthly_price_cents)")
        .in("status", ["active", "trial"]),
    ]);

  const tenants = tenantsResult.data ?? [];
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.status === "active").length;
  const trialTenants = tenants.filter((t) => t.status === "trial").length;
  const totalUsers = usersResult.count ?? 0;
  const totalScans = scansResult.count ?? 0;

  const usageRows = usageResult.data ?? [];
  const totalPagesThisMonth = usageRows.reduce(
    (sum: number, r: { pages_consumed: number }) =>
      sum + (r.pages_consumed ?? 0),
    0
  );

  const revenueRows = revenueResult.data ?? [];
  const mrrCents = revenueRows.reduce(
    (sum: number, r: Record<string, unknown>) => {
      const plan = r.subscription_plans as
        | { monthly_price_cents: number }
        | { monthly_price_cents: number }[]
        | null;
      if (!plan) return sum;
      if (Array.isArray(plan)) {
        return sum + (plan[0]?.monthly_price_cents ?? 0);
      }
      return sum + (plan.monthly_price_cents ?? 0);
    },
    0
  );

  const stats = [
    {
      label: "Total Tenants",
      value: totalTenants.toLocaleString(),
      color: "text-caso-blue",
    },
    {
      label: "Active Tenants",
      value: activeTenants.toLocaleString(),
      color: "text-caso-green",
    },
    {
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      color: "text-caso-blue",
    },
    {
      label: "MRR",
      value: `$${(mrrCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      color: "text-caso-green",
    },
  ];

  const secondaryStats = [
    {
      label: "Trial Tenants",
      value: trialTenants.toLocaleString(),
      color: "text-caso-warm",
    },
    {
      label: "Total Scans",
      value: totalScans.toLocaleString(),
      color: "text-caso-blue",
    },
    {
      label: "Pages This Month",
      value: totalPagesThisMonth.toLocaleString(),
      color: "text-caso-blue",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
        Platform Admin
      </h1>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-caso-navy-light border border-caso-border p-6"
          >
            <h2 className="text-sm font-medium text-caso-slate mb-2">
              {stat.label}
            </h2>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {secondaryStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-caso-navy-light border border-caso-border p-6"
          >
            <h2 className="text-sm font-medium text-caso-slate mb-2">
              {stat.label}
            </h2>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/admin/tenants"
            className="flex items-center gap-3 rounded-lg bg-caso-blue/10 border border-caso-blue/20 px-4 py-3 text-sm font-medium text-caso-blue hover:bg-caso-blue/20 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Manage Tenants
          </Link>
          <Link
            href="/dashboard/admin/users"
            className="flex items-center gap-3 rounded-lg bg-white/5 border border-caso-border px-4 py-3 text-sm font-medium text-caso-slate hover:text-caso-white hover:bg-white/10 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Manage Users
          </Link>
          <Link
            href="/dashboard/admin/usage"
            className="flex items-center gap-3 rounded-lg bg-white/5 border border-caso-border px-4 py-3 text-sm font-medium text-caso-slate hover:text-caso-white hover:bg-white/10 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
            Usage Tracking
          </Link>
        </div>
      </div>
    </div>
  );
}
