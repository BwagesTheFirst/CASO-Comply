import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

  // Get usage for billing context
  const { data: usage } = await admin.rpc("get_tenant_usage", {
    p_tenant_id: tenantId,
  });

  const usageRows = Array.isArray(usage) ? usage : usage ? [usage] : [];
  const totalPages = usageRows.reduce((sum: number, r: { total_pages?: number }) => sum + (r.total_pages ?? 0), 0);
  const pagesIncluded = usageRows[0]?.pages_included ?? plan?.pages_included ?? 0;
  const overagePages = Math.max(0, totalPages - pagesIncluded);
  const overageCost = plan?.overage_rate_cents
    ? ((overagePages * plan.overage_rate_cents) / 100).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
        Billing
      </h1>

      {/* Current Plan */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <h2 className="text-sm font-medium text-caso-slate mb-4">
          Current Plan
        </h2>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-2xl font-bold text-caso-white">
              {plan?.name ?? "No Plan"}
            </p>
            {plan && (
              <ul className="mt-3 space-y-1 text-sm text-caso-slate">
                <li>
                  {plan.pages_included?.toLocaleString()} pages included/month
                </li>
              </ul>
            )}
          </div>
          <Link
            href="/pricing"
            className="rounded-lg border border-caso-border px-4 py-2 text-sm font-medium text-caso-slate hover:text-caso-white hover:bg-white/5 transition-colors"
          >
            Change Plan
          </Link>
        </div>
      </div>

      {/* Current Period */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <h2 className="text-sm font-medium text-caso-slate mb-4">
          Current Billing Period
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-caso-slate mb-1">Pages Used</p>
            <p className="text-xl font-bold text-caso-blue">
              {totalPages.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-caso-slate mb-1">Pages Included</p>
            <p className="text-xl font-bold text-caso-white">
              {pagesIncluded.toLocaleString()}
            </p>
          </div>
        </div>
        {overagePages > 0 && (
          <p className="text-caso-red/70 text-xs mt-3">
            {overagePages.toLocaleString()} pages over plan limit this period
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
          Contact your account manager or email billing@casocomply.com for questions.
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
