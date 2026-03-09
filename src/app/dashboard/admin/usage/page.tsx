"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ActionBreakdown {
  action: string;
  pages: number;
  count: number;
}

interface TenantTierData {
  pages: number;
  revenue_cents: number;
}

interface TenantBreakdown {
  tenant_id: string;
  name: string;
  pages_this_month: number;
  pages_all_time: number;
  revenue_cents_this_month: number;
  tiers: Record<string, TenantTierData>;
}

interface RecentRecord {
  id: string;
  created_at: string;
  action: string;
  pages_consumed: number;
  document_filename: string | null;
  remediation_type: string | null;
  cost_cents: number | null;
  tenant_name: string;
}

interface TierBreakdown {
  remediation_type: string;
  pages: number;
  revenue_cents: number;
}

interface UsageData {
  pages_today: number;
  pages_this_month: number;
  pages_all_time: number;
  action_breakdown: ActionBreakdown[];
  tenant_breakdown: TenantBreakdown[];
  recent_activity: RecentRecord[];
  tier_breakdown: TierBreakdown[];
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  analyze: { label: "Analyze", color: "text-caso-blue" },
  remediate: { label: "Remediate", color: "text-caso-green" },
  scan: { label: "Scan", color: "text-caso-warm" },
  verify: { label: "Verify", color: "text-purple-400" },
  convert: { label: "Convert", color: "text-cyan-400" },
};

function actionBadgeClass(action: string): string {
  switch (action) {
    case "analyze":
      return "bg-caso-blue/10 text-caso-blue";
    case "remediate":
      return "bg-caso-green/10 text-caso-green";
    case "scan":
      return "bg-caso-warm/10 text-caso-warm";
    case "verify":
      return "bg-purple-400/10 text-purple-400";
    case "convert":
      return "bg-cyan-400/10 text-cyan-400";
    default:
      return "bg-caso-slate/10 text-caso-slate";
  }
}

export default function AdminUsagePage() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsage() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/usage");
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          setError(json.error || "Failed to fetch usage data");
        }
      } catch {
        setError("Failed to fetch usage data");
      } finally {
        setLoading(false);
      }
    }
    fetchUsage();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
            Usage Tracking
          </h1>
          <Link
            href="/dashboard/admin"
            className="text-sm text-caso-blue hover:text-caso-blue-bright transition-colors"
          >
            &larr; Back to Admin
          </Link>
        </div>
        <div className="px-6 py-12 text-center text-caso-slate text-sm">
          Loading usage data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
            Usage Tracking
          </h1>
          <Link
            href="/dashboard/admin"
            className="text-sm text-caso-blue hover:text-caso-blue-bright transition-colors"
          >
            &larr; Back to Admin
          </Link>
        </div>
        <div
          role="alert"
          className="rounded-lg bg-caso-red/10 border border-caso-red/30 px-4 py-3 text-sm text-caso-red"
        >
          {error}
        </div>
      </div>
    );
  }

  const {
    pages_today,
    pages_this_month,
    pages_all_time,
    action_breakdown,
    tenant_breakdown,
    recent_activity,
    tier_breakdown,
  } = data!;

  const topStats = [
    { label: "Pages Today", value: pages_today.toLocaleString(), color: "text-caso-green" },
    { label: "Pages This Month", value: pages_this_month.toLocaleString(), color: "text-caso-blue" },
    { label: "Pages All Time", value: pages_all_time.toLocaleString(), color: "text-caso-warm" },
  ];

  // Ensure all five actions appear even if no records exist
  const allActions = ["analyze", "remediate", "scan", "verify", "convert"];
  const actionMap = new Map(action_breakdown.map((a) => [a.action, a]));
  const fullActionBreakdown = allActions.map((action) => ({
    action,
    pages: actionMap.get(action)?.pages ?? 0,
    count: actionMap.get(action)?.count ?? 0,
  }));

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
          Usage Tracking
        </h1>
        <Link
          href="/dashboard/admin"
          className="text-sm text-caso-blue hover:text-caso-blue-bright transition-colors"
        >
          &larr; Back to Admin
        </Link>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {topStats.map((stat) => (
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

      {/* Action Breakdown */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-4">
          Action Breakdown
          <span className="text-sm font-normal text-caso-slate ml-2">
            (this month)
          </span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {fullActionBreakdown.map((a) => {
            const meta = ACTION_LABELS[a.action] ?? {
              label: a.action,
              color: "text-caso-slate",
            };
            return (
              <div
                key={a.action}
                className="rounded-lg bg-caso-navy border border-caso-border p-4"
              >
                <p className="text-xs font-medium text-caso-slate mb-1 uppercase tracking-wide">
                  {meta.label}
                </p>
                <p className={`text-2xl font-bold ${meta.color}`}>
                  {a.pages.toLocaleString()}
                </p>
                <p className="text-xs text-caso-slate mt-1">
                  {a.count.toLocaleString()} {a.count === 1 ? "request" : "requests"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue by Tier */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-4">
          Revenue by Tier
          <span className="text-sm font-normal text-caso-slate ml-2">
            (this month)
          </span>
        </h2>
        {(() => {
          const TIER_META: Record<string, { label: string; rate: string; rateCents: number; color: string }> = {
            standard: { label: "Standard", rate: "$0.25", rateCents: 25, color: "text-caso-blue" },
            ai_verified: { label: "AI Verified", rate: "$0.35", rateCents: 35, color: "text-caso-green" },
            human_review: { label: "Human Review", rate: "$4.00", rateCents: 400, color: "text-purple-400" },
          };
          const tierMap = new Map((tier_breakdown ?? []).map((t) => [t.remediation_type, t]));
          const allTiers = ["standard", "ai_verified", "human_review"];
          const rows = allTiers.map((key) => {
            const meta = TIER_META[key];
            const data = tierMap.get(key);
            const pages = data?.pages ?? 0;
            const revenueCents = data?.revenue_cents ?? pages * meta.rateCents;
            return { key, ...meta, pages, revenueDollars: revenueCents / 100 };
          });
          const totalRevenue = rows.reduce((sum, r) => sum + r.revenueDollars, 0);

          return (
            <div className="space-y-3">
              {rows.map((r) => (
                <div
                  key={r.key}
                  className="flex items-center justify-between rounded-lg bg-caso-navy border border-caso-border px-4 py-3"
                >
                  <div>
                    <span className={`font-medium ${r.color}`}>{r.label}</span>
                    <span className="text-caso-slate text-sm ml-2">
                      {r.pages.toLocaleString()} pages x {r.rate}
                    </span>
                  </div>
                  <span className="text-caso-white font-bold">
                    ${r.revenueDollars.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-lg bg-caso-navy border border-caso-green/30 px-4 py-3">
                <span className="font-medium text-caso-white">Total Estimated Revenue</span>
                <span className="text-caso-green font-bold text-lg">
                  ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Per-Tenant Usage */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
        <div className="px-6 py-4 border-b border-caso-border">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white">
            Per-Tenant Usage
          </h2>
        </div>
        {tenant_breakdown.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-caso-slate text-sm">No usage recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-caso-border text-left">
                  <th className="px-6 py-3 text-caso-slate font-medium">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-caso-slate font-medium text-right">
                    Standard
                  </th>
                  <th className="px-6 py-3 text-caso-slate font-medium text-right">
                    AI Verified
                  </th>
                  <th className="px-6 py-3 text-caso-slate font-medium text-right">
                    Human Review
                  </th>
                  <th className="px-6 py-3 text-caso-slate font-medium text-right">
                    Total Pages
                  </th>
                  <th className="px-6 py-3 text-caso-slate font-medium text-right">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {tenant_breakdown.map((t) => (
                  <tr
                    key={t.tenant_id}
                    className="border-b border-caso-border/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3 text-caso-white font-medium">
                      <div>{t.name}</div>
                      <div className="text-xs text-caso-slate font-normal">
                        {t.pages_all_time.toLocaleString()} pages all time
                      </div>
                    </td>
                    <td className="px-6 py-3 text-caso-blue text-right">
                      {(t.tiers?.standard?.pages ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-caso-green text-right">
                      {(t.tiers?.ai_verified?.pages ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-purple-400 text-right">
                      {(t.tiers?.human_review?.pages ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-caso-white text-right font-medium">
                      {t.pages_this_month.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-caso-green text-right font-bold">
                      ${(t.revenue_cents_this_month / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
        <div className="px-6 py-4 border-b border-caso-border">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white">
            Recent Activity
          </h2>
        </div>
        {recent_activity.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-caso-slate text-sm">No recent activity.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-caso-border text-left">
                  <th className="px-6 py-3 text-caso-slate font-medium">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-caso-slate font-medium">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-caso-slate font-medium">
                    Action
                  </th>
                  <th className="px-6 py-3 text-caso-slate font-medium">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-caso-slate font-medium text-right">
                    Pages
                  </th>
                  <th className="px-6 py-3 text-caso-slate font-medium text-right">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-caso-slate font-medium">
                    Filename
                  </th>
                </tr>
              </thead>
              <tbody>
                {recent_activity.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-caso-border/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3 text-caso-slate whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-caso-white font-medium">
                      {r.tenant_name}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${actionBadgeClass(r.action)}`}
                      >
                        {r.action}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {r.remediation_type ? (
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          r.remediation_type === "ai_verified"
                            ? "bg-caso-green/10 text-caso-green"
                            : r.remediation_type === "human_review"
                              ? "bg-purple-400/10 text-purple-400"
                              : "bg-caso-blue/10 text-caso-blue"
                        }`}>
                          {r.remediation_type === "ai_verified" ? "AI" : r.remediation_type === "human_review" ? "Human" : "Std"}
                        </span>
                      ) : (
                        <span className="text-caso-slate/50">--</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-caso-blue text-right font-medium">
                      {r.pages_consumed.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-caso-green text-right font-medium">
                      {r.cost_cents ? `$${(r.cost_cents / 100).toFixed(2)}` : "--"}
                    </td>
                    <td className="px-6 py-3 text-caso-slate truncate max-w-[200px]">
                      {r.document_filename ?? "--"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
