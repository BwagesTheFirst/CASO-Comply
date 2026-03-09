import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AgentSetupContent from "@/components/dashboard/AgentSetupContent";

export default async function AgentSetupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

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

  // Get the user's active API key (first one)
  const { data: apiKeys } = await admin
    .from("api_keys")
    .select("id, key_prefix, is_active")
    .eq("tenant_id", tenantId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1);

  const plan = tenant?.subscription_plans;
  const features = (plan?.features as Record<string, boolean>) ?? {};
  const hasApiAccess = features.api_access === true;
  const activeKey = apiKeys?.[0] ?? null;

  if (!hasApiAccess) {
    return (
      <div className="space-y-6 max-w-4xl">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
          Agent Setup
        </h1>
        <div className="rounded-xl bg-caso-navy-light border border-caso-border p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-caso-warm/10 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-caso-warm">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
              <line x1="6" y1="6" x2="6.01" y2="6" />
              <line x1="6" y1="18" x2="6.01" y2="18" />
            </svg>
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-caso-white mb-2">
            API Access Required
          </h2>
          <p className="text-caso-slate text-sm max-w-md mx-auto mb-6">
            The Docker Agent requires API access. Contact support to enable
            API access on your account and install the agent on your
            infrastructure.
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-block rounded-lg bg-caso-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-caso-blue-bright transition-colors"
          >
            Upgrade Plan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
        Docker Agent Setup
      </h1>

      {/* Intro */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <p className="text-caso-slate text-sm leading-relaxed">
          Install the CASO Comply agent on your infrastructure to automatically
          scan and remediate documents. The agent runs as a Docker container,
          watches configured directories for new PDFs, and processes them on a
          schedule or on demand.
        </p>
      </div>

      {/* Your API Key */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-4">
          Your API Key
        </h2>
        {activeKey ? (
          <div className="flex items-center gap-3 mb-3">
            <code className="rounded-lg bg-caso-navy border border-caso-border px-3 py-2 text-sm text-caso-green font-mono">
              {activeKey.key_prefix}...
            </code>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-caso-green/10 text-caso-green">
              Active
            </span>
          </div>
        ) : (
          <p className="text-caso-warm text-sm mb-3">
            No active API key found. Create one before setting up the agent.
          </p>
        )}
        <Link
          href="/dashboard/api-keys"
          className="text-sm text-caso-blue hover:text-caso-blue-bright transition-colors"
        >
          Manage API Keys &rarr;
        </Link>
        <p className="text-caso-slate/60 text-xs mt-2">
          You will need your full API key for the setup below. If you have lost
          it, create a new one.
        </p>
      </div>

      {/* Quick Start - client component for copy buttons */}
      <AgentSetupContent />
    </div>
  );
}
