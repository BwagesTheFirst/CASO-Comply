import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const SERVICE_RATES: Record<string, { label: string; rate: number }> = {
  standard: { label: "Standard", rate: 0.30 },
  enhanced: { label: "Enhanced", rate: 1.80 },
  expert: { label: "Expert", rate: 12.00 },
};

export default async function BillingPage() {
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

  const { data: tenant } = await admin
    .from("tenants")
    .select("*, subscription_plans(*)")
    .eq("id", tenantId)
    .single();

  const plan = tenant?.subscription_plans;
  const isTrial = tenant?.status === "trial";

  // Get current billing period start (first of the current month)
  const now = new Date();
  const billingPeriodStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  // Query usage_records grouped by remediation_type for the current billing period
  const { data: usageByType } = await admin
    .from("usage_records")
    .select("remediation_type, pages_consumed, cost_cents")
    .eq("tenant_id", tenantId)
    .gte("billing_period_start", billingPeriodStart);

  // Aggregate usage by remediation type
  const usageSummary: Record<string, { pages: number; cost: number }> = {};
  let totalPages = 0;
  let totalCostCents = 0;

  if (usageByType) {
    for (const row of usageByType) {
      const type = row.remediation_type ?? "standard";
      if (!usageSummary[type]) {
        usageSummary[type] = { pages: 0, cost: 0 };
      }
      usageSummary[type].pages += row.pages_consumed ?? 0;
      usageSummary[type].cost += row.cost_cents ?? 0;
      totalPages += row.pages_consumed ?? 0;
      totalCostCents += row.cost_cents ?? 0;
    }
  }

  // For trial accounts, also get total usage via RPC for the trial page limit
  const { data: usage } = await admin.rpc("get_tenant_usage", {
    p_tenant_id: tenantId,
  });
  const usageRows = Array.isArray(usage) ? usage : usage ? [usage] : [];
  const trialTotalPages = usageRows.reduce(
    (sum: number, r: { total_pages?: number }) => sum + (r.total_pages ?? 0),
    0
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
        Billing
      </h1>

      {/* Account Status */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <h2 className="text-sm font-medium text-caso-slate mb-4">
          Account Status
        </h2>
        {isTrial ? (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-caso-warm/10 text-caso-warm">
                Trial
              </span>
              <p className="text-2xl font-bold text-caso-white">
                Trial Account
              </p>
            </div>
            <div className="flex items-end justify-between mb-2">
              <span className="text-sm text-caso-slate">
                {trialTotalPages} of 10 pages used
              </span>
              <span className="text-sm text-caso-slate">
                {Math.max(0, 10 - trialTotalPages)} remaining
              </span>
            </div>
            <div className="w-full bg-caso-navy rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${
                  trialTotalPages >= 10 ? "bg-caso-red" : trialTotalPages >= 8 ? "bg-caso-warm" : "bg-caso-green"
                }`}
                style={{ width: `${Math.min((trialTotalPages / 10) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-caso-slate mt-3">
              Trial accounts are limited to 10 pages. Contact us to activate your account.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-caso-green/10 text-caso-green">
                Active
              </span>
              <p className="text-2xl font-bold text-caso-white">
                {plan?.name ?? "Per-Page Plan"}
              </p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4">
              {Object.entries(SERVICE_RATES).map(([key, { label, rate }]) => (
                <div key={key} className="text-center">
                  <p className="text-xs text-caso-slate mb-1">{label}</p>
                  <p className="text-lg font-bold text-caso-white">
                    ${rate.toFixed(2)}
                    <span className="text-xs text-caso-slate font-normal">/pg</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Usage This Period */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <h2 className="text-sm font-medium text-caso-slate mb-4">
          Usage This Period
        </h2>
        {totalPages > 0 ? (
          <>
            <div className="space-y-3">
              {Object.entries(SERVICE_RATES).map(([key, { label, rate }]) => {
                const u = usageSummary[key];
                if (!u || u.pages === 0) return null;
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-caso-slate">
                      {label} pages:{" "}
                      <span className="text-caso-white font-medium">
                        {u.pages.toLocaleString()}
                      </span>{" "}
                      &times; ${rate.toFixed(2)}
                    </span>
                    <span className="text-caso-white font-medium">
                      ${(u.cost / 100).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-caso-border flex items-center justify-between">
              <span className="text-sm font-medium text-caso-slate">Total</span>
              <span className="text-xl font-bold text-caso-white">
                ${(totalCostCents / 100).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </>
        ) : (
          <p className="text-caso-slate text-sm">
            No usage recorded this billing period.
          </p>
        )}
      </div>

      {/* Invoices */}
      <InvoicesSection tenantId={tenantId} />

      {/* Payment Info */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <h2 className="text-sm font-medium text-caso-slate mb-4">
          Payment Information
        </h2>
        <p className="text-caso-slate text-sm">
          Invoices are issued with Net 30/60 payment terms. Please reference your PO number when submitting payment.
          Contact your account manager or email{" "}
          <a
            href="mailto:billing@casocomply.com"
            className="text-caso-blue underline decoration-caso-blue/30 transition-colors hover:text-caso-blue-bright"
          >
            billing@casocomply.com
          </a>{" "}
          for questions.
        </p>
      </div>
    </div>
  );
}

async function InvoicesSection({ tenantId }: { tenantId: string }) {
  const admin = createAdminClient();

  const { data: invoices } = await admin
    .from("invoices")
    .select("id, invoice_number, billing_period_start, billing_period_end, total_cents, status, due_date")
    .eq("tenant_id", tenantId)
    .neq("status", "draft")
    .order("created_at", { ascending: false })
    .limit(20);

  function statusBadgeClass(status: string): string {
    switch (status) {
      case "sent":
        return "bg-caso-blue/10 text-caso-blue";
      case "paid":
        return "bg-caso-green/10 text-caso-green";
      case "overdue":
        return "bg-caso-red/10 text-caso-red";
      case "cancelled":
        return "bg-caso-slate/10 text-caso-slate";
      default:
        return "bg-caso-slate/10 text-caso-slate";
    }
  }

  function formatPeriodShort(start: string, end: string): string {
    const s = new Date(start + "T00:00:00");
    const e = new Date(end + "T00:00:00");
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
      return `${months[s.getMonth()]} ${s.getFullYear()}`;
    }
    return `${months[s.getMonth()]} - ${months[e.getMonth()]} ${e.getFullYear()}`;
  }

  return (
    <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
      <div className="px-6 py-4 border-b border-caso-border">
        <h2 className="text-sm font-medium text-caso-slate">
          Invoices
        </h2>
      </div>
      {invoices && invoices.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-caso-border text-left">
                <th className="px-6 py-3 text-caso-slate font-medium">Invoice #</th>
                <th className="px-6 py-3 text-caso-slate font-medium">Period</th>
                <th className="px-6 py-3 text-caso-slate font-medium text-right">Total</th>
                <th className="px-6 py-3 text-caso-slate font-medium">Status</th>
                <th className="px-6 py-3 text-caso-slate font-medium">Due Date</th>
                <th className="px-6 py-3 text-caso-slate font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-caso-border/50 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-3 text-caso-white font-medium font-mono text-xs">
                    {inv.invoice_number}
                  </td>
                  <td className="px-6 py-3 text-caso-slate">
                    {formatPeriodShort(inv.billing_period_start, inv.billing_period_end)}
                  </td>
                  <td className="px-6 py-3 text-caso-white text-right font-medium">
                    ${(inv.total_cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(inv.status)}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-caso-slate">
                    {inv.due_date
                      ? new Date(inv.due_date + "T00:00:00").toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-3">
                    <Link
                      href={`/dashboard/billing/invoices/${inv.id}`}
                      className="text-caso-blue hover:text-caso-blue-bright text-sm font-medium transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-8 text-center text-caso-slate text-sm">
          No invoices yet.
        </div>
      )}
    </div>
  );
}
