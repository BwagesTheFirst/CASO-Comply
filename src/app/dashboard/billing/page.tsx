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
              <>
                <p className="text-caso-blue text-lg font-semibold mt-1">
                  ${(plan.monthly_price_cents / 100).toFixed(2)}
                  <span className="text-caso-slate text-sm font-normal">
                    /month
                  </span>
                </p>
                <ul className="mt-3 space-y-1 text-sm text-caso-slate">
                  <li>
                    {plan.pages_included?.toLocaleString()} pages included
                  </li>
                  {plan.overage_rate_cents && (
                    <li>
                      ${(plan.overage_rate_cents / 100).toFixed(2)}/page
                      overage
                    </li>
                  )}
                </ul>
              </>
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
            <p className="text-xs text-caso-slate mb-1">Base Cost</p>
            <p className="text-xl font-bold text-caso-white">
              ${plan ? (plan.monthly_price_cents / 100).toFixed(2) : "0.00"}
            </p>
          </div>
          <div>
            <p className="text-xs text-caso-slate mb-1">Overage Cost</p>
            <p
              className={`text-xl font-bold ${
                overagePages > 0 ? "text-caso-red" : "text-caso-white"
              }`}
            >
              ${overageCost}
            </p>
          </div>
        </div>
        {overagePages > 0 && (
          <p className="text-caso-red/70 text-xs mt-3">
            {overagePages.toLocaleString()} overage pages this period
          </p>
        )}
      </div>

      {/* Payment Method placeholder */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <h2 className="text-sm font-medium text-caso-slate mb-4">
          Payment Method
        </h2>
        <p className="text-caso-slate text-sm">
          Payment management will be available via Stripe integration.
        </p>
        <button
          disabled
          className="mt-4 rounded-lg border border-caso-border px-4 py-2 text-sm text-caso-slate/50 cursor-not-allowed"
        >
          Update Payment Method (Coming Soon)
        </button>
      </div>
    </div>
  );
}
