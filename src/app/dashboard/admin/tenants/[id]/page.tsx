"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Member {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  email: string;
  last_sign_in_at: string | null;
}

interface UsageSummary {
  action: string;
  count: number;
  total_pages: number;
}

interface Scan {
  id: string;
  domain: string;
  status: string;
  score: number | null;
  created_at: string;
}

interface Plan {
  id: string;
  name: string;
  standard_rate_cents: number;
  ai_verified_rate_cents: number;
  human_review_rate_cents: number;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  status: string;
  billing_email: string | null;
  trial_ends_at: string | null;
  trial_pages_limit: number | null;
  trial_pages_used: number | null;
  created_at: string;
  plan: Plan | null;
  members: Member[];
  usage_summary: UsageSummary[];
  recent_scans: Scan[];
}

// Plans are fetched from the database, no hardcoded values

const STATUS_OPTIONS = ["active", "trial", "suspended", "cancelled"];

function statusBadgeClass(status: string): string {
  switch (status) {
    case "active":
      return "bg-caso-green/10 text-caso-green";
    case "trial":
      return "bg-caso-warm/10 text-caso-warm";
    case "suspended":
      return "bg-caso-red/10 text-caso-red";
    case "cancelled":
      return "bg-caso-slate/10 text-caso-slate";
    default:
      return "bg-caso-slate/10 text-caso-slate";
  }
}

function actionColor(action: string): string {
  switch (action) {
    case "analyze":
      return "text-caso-blue";
    case "remediate":
      return "text-caso-green";
    case "scan":
      return "text-caso-warm";
    case "verify":
      return "text-caso-slate";
    case "convert":
      return "text-caso-blue";
    default:
      return "text-caso-slate";
  }
}

export default function AdminTenantDetailPage() {
  const params = useParams();
  const tenantId = params.id as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Editable fields
  const [editStatus, setEditStatus] = useState("");
  const [editPlanId, setEditPlanId] = useState("");
  const [editTrialEndsAt, setEditTrialEndsAt] = useState("");
  const [editTrialPagesLimit, setEditTrialPagesLimit] = useState<number>(10);
  const [editTrialPagesUsed, setEditTrialPagesUsed] = useState<number>(0);

  const fetchTenant = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/tenants/${tenantId}`);
      const data = await res.json();
      if (res.ok) {
        setTenant(data.tenant);
        setEditStatus(data.tenant.status);
        setEditPlanId(data.tenant.plan?.id ?? "");
        setEditTrialEndsAt(
          data.tenant.trial_ends_at
            ? data.tenant.trial_ends_at.split("T")[0]
            : ""
        );
        setEditTrialPagesLimit(data.tenant.trial_pages_limit ?? 10);
        setEditTrialPagesUsed(data.tenant.trial_pages_used ?? 0);
        // If the API returned plans, use them; otherwise keep known plans
        if (data.plans) {
          setPlans(data.plans);
        }
      } else {
        setError(data.error || "Failed to fetch tenant");
      }
    } catch {
      setError("Failed to fetch tenant");
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchTenant();
  }, [fetchTenant]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const body: Record<string, string | number | null> = {
        status: editStatus,
        plan_id: editPlanId || null,
        trial_pages_limit: editTrialPagesLimit,
        trial_pages_used: editTrialPagesUsed,
      };
      if (editStatus === "trial" && editTrialEndsAt) {
        body.trial_ends_at = editTrialEndsAt;
      }

      const res = await fetch(`/api/admin/tenants/${tenantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess("Tenant updated successfully.");
        fetchTenant();
      } else {
        setError(data.error || "Failed to update tenant");
      }
    } catch {
      setError("Failed to update tenant");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl">
        <div className="text-caso-slate text-sm">Loading tenant details...</div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="space-y-6 max-w-6xl">
        <Link
          href="/dashboard/admin/tenants"
          className="text-sm text-caso-blue hover:text-caso-blue-bright transition-colors"
        >
          &larr; Back to Tenants
        </Link>
        <div className="text-caso-red text-sm">
          {error || "Tenant not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <Link
        href="/dashboard/admin/tenants"
        className="inline-block text-sm text-caso-blue hover:text-caso-blue-bright transition-colors"
      >
        &larr; Back to Tenants
      </Link>

      <div className="flex items-center gap-4">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
          {tenant.name}
        </h1>
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(tenant.status)}`}
        >
          {tenant.status}
        </span>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-caso-red/10 border border-caso-red/30 px-4 py-3 text-sm text-caso-red"
        >
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-caso-green/10 border border-caso-green/30 px-4 py-3 text-sm text-caso-green">
          {success}
        </div>
      )}

      {/* Edit Card */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-4">
          Tenant Settings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-caso-slate mb-1.5">
              Slug
            </label>
            <p className="text-sm text-caso-white">{tenant.slug}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-caso-slate mb-1.5">
              Domain
            </label>
            <p className="text-sm text-caso-white">
              {tenant.domain || "Not set"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-caso-slate mb-1.5">
              Billing Email
            </label>
            <p className="text-sm text-caso-white">
              {tenant.billing_email || "Not set"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-caso-slate mb-1.5">
              Created
            </label>
            <p className="text-sm text-caso-white">
              {new Date(tenant.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="border-t border-caso-border pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label
                htmlFor="edit-status"
                className="block text-sm font-medium text-caso-slate mb-1.5"
              >
                Status
              </label>
              <select
                id="edit-status"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors text-sm"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="edit-plan"
                className="block text-sm font-medium text-caso-slate mb-1.5"
              >
                Plan
              </label>
              <select
                id="edit-plan"
                value={editPlanId}
                onChange={(e) => setEditPlanId(e.target.value)}
                className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors text-sm"
              >
                <option value="">No Plan</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            {editStatus === "trial" && (
              <div>
                <label
                  htmlFor="edit-trial-ends"
                  className="block text-sm font-medium text-caso-slate mb-1.5"
                >
                  Trial Ends At
                </label>
                <input
                  id="edit-trial-ends"
                  type="date"
                  value={editTrialEndsAt}
                  onChange={(e) => setEditTrialEndsAt(e.target.value)}
                  className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors text-sm"
                />
              </div>
            )}
            <div>
              <label
                htmlFor="edit-trial-pages-limit"
                className="block text-sm font-medium text-caso-slate mb-1.5"
              >
                Trial Pages Limit
              </label>
              <input
                id="edit-trial-pages-limit"
                type="number"
                min={0}
                value={editTrialPagesLimit}
                onChange={(e) => setEditTrialPagesLimit(Number(e.target.value))}
                className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="edit-trial-pages-used"
                className="block text-sm font-medium text-caso-slate mb-1.5"
              >
                Trial Pages Used
              </label>
              <div className="flex gap-2">
                <input
                  id="edit-trial-pages-used"
                  type="number"
                  min={0}
                  value={editTrialPagesUsed}
                  onChange={(e) => setEditTrialPagesUsed(Number(e.target.value))}
                  className="flex-1 rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setEditTrialPagesUsed(0)}
                  className="rounded-lg border border-caso-border px-3 py-2.5 text-xs font-medium text-caso-slate hover:text-caso-white hover:border-caso-blue transition-colors"
                >
                  Reset
                </button>
              </div>
              {editTrialPagesUsed >= editTrialPagesLimit && (
                <p className="text-xs text-caso-warm mt-1">
                  Limit reached — uploads are disabled for this tenant
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-caso-blue px-4 py-2 text-sm font-semibold text-white hover:bg-caso-blue-bright disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Members */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
        <div className="px-6 py-4 border-b border-caso-border">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white">
            Members ({tenant.members?.length ?? 0})
          </h2>
        </div>
        {tenant.members && tenant.members.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-caso-border text-left">
                  <th className="px-6 py-3 text-caso-slate font-medium">
                    Email
                  </th>
                  <th className="px-6 py-3 text-caso-slate font-medium">
                    Role
                  </th>
                  <th className="px-6 py-3 text-caso-slate font-medium">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {tenant.members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-caso-border/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3 text-caso-white font-medium">
                      {member.email}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.role === "owner"
                            ? "bg-caso-blue/10 text-caso-blue"
                            : member.role === "admin"
                              ? "bg-caso-warm/10 text-caso-warm"
                              : "bg-caso-slate/10 text-caso-slate"
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-caso-slate">
                      {new Date(member.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-caso-slate text-sm">
            No members found.
          </div>
        )}
      </div>

      {/* Usage Summary */}
      {tenant.usage_summary && tenant.usage_summary.length > 0 && (
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-4">
            Usage Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenant.usage_summary.map((u) => (
              <div
                key={u.action}
                className="rounded-xl bg-caso-navy-light border border-caso-border p-6"
              >
                <h3 className="text-sm font-medium text-caso-slate mb-2 capitalize">
                  {u.action}
                </h3>
                <p className={`text-2xl font-bold ${actionColor(u.action)}`}>
                  {u.total_pages.toLocaleString()}
                  <span className="text-sm font-normal text-caso-slate ml-1">
                    pages
                  </span>
                </p>
                <p className="text-xs text-caso-slate mt-1">
                  {u.count.toLocaleString()} request
                  {u.count !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Scans */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
        <div className="px-6 py-4 border-b border-caso-border">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white">
            Recent Scans
          </h2>
        </div>
        {tenant.recent_scans && tenant.recent_scans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-caso-border text-left">
                  <th className="px-6 py-3 text-caso-slate font-medium">
                    Domain
                  </th>
                  <th className="px-6 py-3 text-caso-slate font-medium">
                    Date
                  </th>
                  <th className="px-6 py-3 text-caso-slate font-medium">
                    Score
                  </th>
                  <th className="px-6 py-3 text-caso-slate font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {tenant.recent_scans.map((scan) => (
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
                    <td className="px-6 py-3 text-caso-white">
                      {scan.score !== null ? scan.score : "N/A"}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-caso-slate text-sm">
            No scans found.
          </div>
        )}
      </div>
    </div>
  );
}
