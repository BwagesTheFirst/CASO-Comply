"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: string;
  created_at: string;
  plan: { name: string } | null;
  member_count: number;
  pages_used: number;
}

const STATUS_OPTIONS = ["all", "active", "trial", "suspended", "cancelled"];

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

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/tenants?${params}`);
      const data = await res.json();
      if (res.ok) {
        setTenants(data.tenants);
        setTotalPages(data.total_pages);
        setTotal(data.total);
      } else {
        setError(data.error || "Failed to fetch tenants");
      }
    } catch {
      setError("Failed to fetch tenants");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, search]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
          Tenants
        </h1>
        <Link
          href="/dashboard/admin"
          className="text-sm text-caso-blue hover:text-caso-blue-bright transition-colors"
        >
          &larr; Back to Admin
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or domain..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white placeholder-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-caso-red/10 border border-caso-red/30 px-4 py-3 text-sm text-caso-red"
        >
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-caso-slate text-sm">
            Loading tenants...
          </div>
        ) : tenants.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-caso-slate text-sm">No tenants found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-caso-border text-left">
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Name
                    </th>
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Status
                    </th>
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Members
                    </th>
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Pages Used
                    </th>
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Created
                    </th>
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => (
                    <tr
                      key={tenant.id}
                      className="border-b border-caso-border/50 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-3 text-caso-white font-medium">
                        {tenant.name}
                      </td>
                      <td className="px-6 py-3 text-caso-slate">
                        {tenant.plan?.name ?? "No Plan"}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(tenant.status)}`}
                        >
                          {tenant.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-caso-slate">
                        {tenant.member_count ?? 0}
                      </td>
                      <td className="px-6 py-3 text-caso-slate">
                        {(tenant.pages_used ?? 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-caso-slate">
                        {new Date(tenant.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">
                        <Link
                          href={`/dashboard/admin/tenants/${tenant.id}`}
                          className="text-caso-blue hover:text-caso-blue-bright text-sm transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-caso-border flex items-center justify-between">
                <p className="text-sm text-caso-slate">
                  Page {page} of {totalPages} ({total} total tenants)
                </p>
                <div className="flex gap-2">
                  {page > 1 && (
                    <button
                      onClick={() => setPage(page - 1)}
                      className="rounded-lg border border-caso-border px-3 py-1.5 text-sm text-caso-slate hover:text-caso-white hover:bg-white/5 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  {page < totalPages && (
                    <button
                      onClick={() => setPage(page + 1)}
                      className="rounded-lg border border-caso-border px-3 py-1.5 text-sm text-caso-slate hover:text-caso-white hover:bg-white/5 transition-colors"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
