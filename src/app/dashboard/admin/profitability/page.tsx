"use client";

import { useState, useEffect, useCallback } from "react";

interface TenantRow {
  tenant_id: string;
  tenant_name: string;
  total_documents: number;
  total_pages: number;
  revenue_cents: number;
  cost_cents: number;
  margin_cents: number;
  margin_percent: number;
}

interface ProfitabilityData {
  summary: {
    total_revenue_cents: number;
    total_cost_cents: number;
    total_margin_cents: number;
    margin_percent: number;
    total_documents: number;
    total_pages: number;
    avg_cost_per_page_cents: number;
    avg_revenue_per_page_cents: number;
    gemini_total_cents: number;
    render_total_cents: number;
    storage_total_cents: number;
  };
  per_tenant: TenantRow[];
  fixed_costs: {
    monthly_total_cents: number;
    breakdown: {
      supabase_db_cents: number;
      render_cents: number;
      vercel_cents: number;
    };
  };
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatCentsCompact(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1) {
    return `$${dollars.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `$${dollars.toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })}`;
}

function marginColor(pct: number): string {
  if (pct >= 70) return "text-caso-green";
  if (pct >= 40) return "text-caso-warm";
  return "text-caso-red";
}

function getMonthRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

export default function ProfitabilityPage() {
  const defaultRange = getMonthRange();
  const [startDate, setStartDate] = useState(defaultRange.start);
  const [endDate, setEndDate] = useState(defaultRange.end);
  const [data, setData] = useState<ProfitabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/profitability?start_date=${startDate}&end_date=${endDate}`
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch profitability data (${res.status})`);
      }
      const json = await res.json();
      // Normalize: ensure summary has defaults if null
      const defaultSummary = {
        total_revenue_cents: 0, total_cost_cents: 0, total_margin_cents: 0,
        margin_percent: 0, total_documents: 0, total_pages: 0,
        avg_cost_per_page_cents: 0, avg_revenue_per_page_cents: 0,
        gemini_total_cents: 0, render_total_cents: 0, storage_total_cents: 0,
      };
      setData({
        summary: json.summary ? { ...defaultSummary, ...json.summary } : defaultSummary,
        per_tenant: json.per_tenant || [],
        fixed_costs: json.fixed_costs || { monthly_total_cents: 0, breakdown: { supabase_db_cents: 0, render_cents: 0, vercel_cents: 0 } },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
          Profitability
        </h1>
        <div className="flex items-center gap-3">
          <label className="text-sm text-caso-slate">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg bg-caso-navy border border-caso-border px-3 py-1.5 text-sm text-caso-white focus:outline-none focus:ring-1 focus:ring-caso-blue"
          />
          <label className="text-sm text-caso-slate">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg bg-caso-navy border border-caso-border px-3 py-1.5 text-sm text-caso-white focus:outline-none focus:ring-1 focus:ring-caso-blue"
          />
        </div>
      </div>

      {loading && (
        <div className="rounded-xl bg-caso-navy-light border border-caso-border p-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-caso-blue border-t-transparent" />
          <p className="mt-3 text-sm text-caso-slate">Loading profitability data...</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-caso-red/10 border border-caso-red/30 p-6">
          <p className="text-sm text-caso-red">{error}</p>
        </div>
      )}

      {data && !loading && (
        <>
          {/* Row 1: Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
              <h2 className="text-sm font-medium text-caso-slate mb-2">
                Total Revenue
              </h2>
              <p className="text-3xl font-bold text-caso-green font-mono">
                {formatCents(data.summary.total_revenue_cents)}
              </p>
            </div>
            <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
              <h2 className="text-sm font-medium text-caso-slate mb-2">
                Total Internal Cost
              </h2>
              <p className="text-3xl font-bold text-caso-warm font-mono">
                {formatCents(data.summary.total_cost_cents)}
              </p>
            </div>
            <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
              <h2 className="text-sm font-medium text-caso-slate mb-2">
                Gross Margin
              </h2>
              <p
                className={`text-3xl font-bold font-mono ${
                  data.summary.total_margin_cents >= 0
                    ? "text-caso-green"
                    : "text-caso-red"
                }`}
              >
                {formatCents(data.summary.total_margin_cents)}
              </p>
            </div>
            <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
              <h2 className="text-sm font-medium text-caso-slate mb-2">
                Margin %
              </h2>
              <p
                className={`text-3xl font-bold font-mono ${marginColor(
                  data.summary.margin_percent
                )}`}
              >
                {data.summary.margin_percent.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Row 2: Cost Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-caso-blue/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-caso-blue"
                  >
                    <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
                    <circle cx="12" cy="15" r="2" />
                  </svg>
                </div>
                <h2 className="text-sm font-medium text-caso-slate">
                  Gemini API Cost
                </h2>
              </div>
              <p className="text-2xl font-bold text-caso-warm font-mono">
                {formatCents(data.summary.gemini_total_cents)}
              </p>
              <p className="text-xs text-caso-slate mt-1 font-mono">
                {data.summary.total_pages > 0
                  ? `${formatCentsCompact(
                      data.summary.gemini_total_cents / data.summary.total_pages
                    )}/page avg`
                  : "No pages processed"}
              </p>
            </div>
            <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-caso-blue/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-caso-blue"
                  >
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" />
                    <line x1="6" y1="18" x2="6.01" y2="18" />
                  </svg>
                </div>
                <h2 className="text-sm font-medium text-caso-slate">
                  Compute Cost
                </h2>
              </div>
              <p className="text-2xl font-bold text-caso-warm font-mono">
                {formatCents(data.summary.render_total_cents)}
              </p>
              <p className="text-xs text-caso-slate mt-1">
                Render processing time
              </p>
            </div>
            <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-caso-blue/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-caso-blue"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                </div>
                <h2 className="text-sm font-medium text-caso-slate">
                  Storage Cost
                </h2>
              </div>
              <p className="text-2xl font-bold text-caso-warm font-mono">
                {formatCents(data.summary.storage_total_cents)}
              </p>
              <p className="text-xs text-caso-slate mt-1">
                Monthly storage fees
              </p>
            </div>
          </div>

          {/* Row 3: Fixed Monthly Costs */}
          <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-4">
              Fixed Monthly Costs
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-caso-border">
                    <th className="text-left py-2 px-3 text-caso-slate font-medium">
                      Service
                    </th>
                    <th className="text-right py-2 px-3 text-caso-slate font-medium">
                      Monthly Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-caso-border/50">
                    <td className="py-2 px-3 text-caso-white">Supabase Pro</td>
                    <td className="py-2 px-3 text-right text-caso-warm font-mono">
                      {formatCents(data.fixed_costs.breakdown.supabase_db_cents)}
                    </td>
                  </tr>
                  <tr className="border-b border-caso-border/50">
                    <td className="py-2 px-3 text-caso-white">
                      Render Starter
                    </td>
                    <td className="py-2 px-3 text-right text-caso-warm font-mono">
                      {formatCents(data.fixed_costs.breakdown.render_cents)}
                    </td>
                  </tr>
                  <tr className="border-b border-caso-border/50">
                    <td className="py-2 px-3 text-caso-white">Vercel Pro</td>
                    <td className="py-2 px-3 text-right text-caso-warm font-mono">
                      {formatCents(data.fixed_costs.breakdown.vercel_cents)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-caso-white font-semibold">
                      Total Fixed
                    </td>
                    <td className="py-2 px-3 text-right text-caso-warm font-bold font-mono">
                      {formatCents(data.fixed_costs.monthly_total_cents)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-caso-slate/60 mt-3">
              These are platform costs shared across all tenants
            </p>
          </div>

          {/* Row 4: Per-Tenant Profitability Table */}
          <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-4">
              Per-Tenant Profitability
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-caso-border">
                    <th className="text-left py-2 px-3 text-caso-slate font-medium">
                      Tenant
                    </th>
                    <th className="text-right py-2 px-3 text-caso-slate font-medium">
                      Documents
                    </th>
                    <th className="text-right py-2 px-3 text-caso-slate font-medium">
                      Pages
                    </th>
                    <th className="text-right py-2 px-3 text-caso-slate font-medium">
                      Revenue
                    </th>
                    <th className="text-right py-2 px-3 text-caso-slate font-medium">
                      Cost
                    </th>
                    <th className="text-right py-2 px-3 text-caso-slate font-medium">
                      Margin
                    </th>
                    <th className="text-right py-2 px-3 text-caso-slate font-medium">
                      Margin %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.per_tenant.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-8 text-center text-caso-slate"
                      >
                        No tenant data for this period
                      </td>
                    </tr>
                  ) : (
                    [...data.per_tenant]
                      .sort((a, b) => b.revenue_cents - a.revenue_cents)
                      .map((t) => (
                        <tr
                          key={t.tenant_id}
                          className="border-b border-caso-border/50 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-2 px-3 text-caso-white">
                            {t.tenant_name}
                          </td>
                          <td className="py-2 px-3 text-right text-caso-slate font-mono">
                            {t.total_documents.toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-right text-caso-slate font-mono">
                            {t.total_pages.toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-right text-caso-green font-mono">
                            {formatCents(t.revenue_cents)}
                          </td>
                          <td className="py-2 px-3 text-right text-caso-warm font-mono">
                            {formatCents(t.cost_cents)}
                          </td>
                          <td className="py-2 px-3 text-right text-caso-green font-mono">
                            {formatCents(t.margin_cents)}
                          </td>
                          <td
                            className={`py-2 px-3 text-right font-bold font-mono ${marginColor(
                              t.margin_percent
                            )}`}
                          >
                            {t.margin_percent.toFixed(1)}%
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Row 5: Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
              <h2 className="text-sm font-medium text-caso-slate mb-2">
                Avg Cost / Page
              </h2>
              <p className="text-3xl font-bold text-caso-warm font-mono">
                {formatCentsCompact(data.summary.avg_cost_per_page_cents)}
              </p>
              <p className="text-xs text-caso-slate mt-1">Across all tiers</p>
            </div>
            <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
              <h2 className="text-sm font-medium text-caso-slate mb-2">
                Avg Revenue / Page
              </h2>
              <p className="text-3xl font-bold text-caso-green font-mono">
                {formatCentsCompact(data.summary.avg_revenue_per_page_cents)}
              </p>
            </div>
            <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
              <h2 className="text-sm font-medium text-caso-slate mb-2">
                Documents Processed
              </h2>
              <p className="text-3xl font-bold text-caso-blue font-mono">
                {data.summary.total_documents.toLocaleString()}
              </p>
              <p className="text-xs text-caso-slate mt-1">This period</p>
            </div>
            <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
              <h2 className="text-sm font-medium text-caso-slate mb-2">
                Total Pages Processed
              </h2>
              <p className="text-3xl font-bold text-caso-blue font-mono">
                {data.summary.total_pages.toLocaleString()}
              </p>
              <p className="text-xs text-caso-slate mt-1">This period</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
