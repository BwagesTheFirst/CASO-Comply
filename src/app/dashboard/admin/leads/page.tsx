"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Lead {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  organization: string | null;
  source: string;
  status: string;
  metadata: Record<string, string>;
  created_at: string;
  contacted_at: string | null;
}

interface Stats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  this_week: number;
  this_month: number;
  by_source: Record<string, number> | null;
}

const STATUS_OPTIONS = ["all", "new", "contacted", "qualified", "proposal", "won", "lost"];
const SOURCE_OPTIONS = ["all", "contact", "free_scan", "scan_email", "manual"];

function statusBadgeClass(status: string): string {
  switch (status) {
    case "new":
      return "bg-caso-blue/10 text-caso-blue";
    case "contacted":
      return "bg-caso-warm/10 text-caso-warm";
    case "qualified":
      return "bg-caso-green/10 text-caso-green";
    case "proposal":
      return "bg-purple-500/10 text-purple-400";
    case "won":
      return "bg-caso-green/20 text-caso-green";
    case "lost":
      return "bg-caso-slate/10 text-caso-slate";
    default:
      return "bg-caso-slate/10 text-caso-slate";
  }
}

function sourceBadgeClass(source: string): string {
  switch (source) {
    case "contact":
      return "bg-caso-blue/10 text-caso-blue";
    case "free_scan":
      return "bg-caso-teal/10 text-caso-teal";
    case "scan_email":
      return "bg-caso-glacier/10 text-caso-glacier";
    default:
      return "bg-caso-slate/10 text-caso-slate";
  }
}

function sourceLabel(source: string): string {
  switch (source) {
    case "contact":
      return "Contact";
    case "free_scan":
      return "Free Scan";
    case "scan_email":
      return "Scan Email";
    case "manual":
      return "Manual";
    default:
      return source;
  }
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 25;

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", phone: "", organization: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  async function handleAddLead(e: React.FormEvent) {
    e.preventDefault();
    if (!addForm.email.trim()) {
      setAddError("Email is required");
      return;
    }
    setAddLoading(true);
    setAddError("");
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const data = await res.json();
        setAddError(data.error || "Failed to create lead");
        return;
      }
      setShowAddModal(false);
      setAddForm({ name: "", email: "", phone: "", organization: "" });
      fetchLeads();
    } catch {
      setAddError("Failed to create lead");
    } finally {
      setAddLoading(false);
    }
  }

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (sourceFilter !== "all") params.set("source", sourceFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/leads?${params}`);
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(data.leads);
      setTotal(data.total);
      if (data.stats) setStats(data.stats);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, sourceFilter, search]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">Leads</h1>
          <p className="mt-1 text-sm text-caso-slate">
            All form submissions and lead tracking
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-lg bg-caso-blue-deep px-4 py-2 text-sm font-medium text-caso-white hover:bg-caso-blue transition-colors"
        >
          + Add Lead
        </button>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl border border-caso-border bg-caso-navy-light p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Add Lead
              </h2>
              <button
                onClick={() => { setShowAddModal(false); setAddError(""); }}
                className="text-caso-slate hover:text-caso-white transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddLead} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-caso-slate mb-1">Name</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full rounded-lg border border-caso-border bg-caso-navy px-3 py-2 text-sm text-caso-white placeholder:text-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-caso-slate mb-1">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="w-full rounded-lg border border-caso-border bg-caso-navy px-3 py-2 text-sm text-caso-white placeholder:text-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-caso-slate mb-1">Phone</label>
                <input
                  type="tel"
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  className="w-full rounded-lg border border-caso-border bg-caso-navy px-3 py-2 text-sm text-caso-white placeholder:text-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-caso-slate mb-1">Organization</label>
                <input
                  type="text"
                  value={addForm.organization}
                  onChange={(e) => setAddForm({ ...addForm, organization: e.target.value })}
                  className="w-full rounded-lg border border-caso-border bg-caso-navy px-3 py-2 text-sm text-caso-white placeholder:text-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue"
                  placeholder="Acme Corp"
                />
              </div>
              {addError && (
                <p className="text-sm text-red-400">{addError}</p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setAddError(""); }}
                  className="flex-1 rounded-lg border border-caso-border px-4 py-2 text-sm font-medium text-caso-slate hover:text-caso-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="flex-1 rounded-lg bg-caso-blue-deep px-4 py-2 text-sm font-medium text-caso-white hover:bg-caso-blue transition-colors disabled:opacity-40"
                >
                  {addLoading ? "Adding..." : "Add Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total Leads" value={stats.total} />
          <StatCard label="New" value={stats.new} className="text-caso-blue" />
          <StatCard label="Contacted" value={stats.contacted} className="text-caso-warm" />
          <StatCard label="This Week" value={stats.this_week} />
          <StatCard label="This Month" value={stats.this_month} />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search name, email, org..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-caso-border bg-caso-navy px-3 py-2 text-sm text-caso-white placeholder:text-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-caso-border bg-caso-navy px-3 py-2 text-sm text-caso-white focus:border-caso-blue focus:outline-none"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => {
            setSourceFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-caso-border bg-caso-navy px-3 py-2 text-sm text-caso-white focus:border-caso-blue focus:outline-none"
        >
          {SOURCE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All Sources" : sourceLabel(s)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-caso-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-caso-border bg-caso-navy-light/50">
              <th className="px-4 py-3 text-left font-medium text-caso-slate">Name</th>
              <th className="px-4 py-3 text-left font-medium text-caso-slate">Organization</th>
              <th className="px-4 py-3 text-left font-medium text-caso-slate">Source</th>
              <th className="px-4 py-3 text-left font-medium text-caso-slate">Status</th>
              <th className="px-4 py-3 text-left font-medium text-caso-slate">Date</th>
              <th className="px-4 py-3 text-left font-medium text-caso-slate">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-caso-slate">
                  Loading...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-caso-slate">
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-caso-border/50 hover:bg-caso-navy-light/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/admin/leads/${lead.id}`}
                      className="font-medium text-caso-white hover:text-caso-blue transition-colors"
                    >
                      {lead.name || "—"}
                    </Link>
                    <div className="text-xs text-caso-slate">{lead.email}</div>
                  </td>
                  <td className="px-4 py-3 text-caso-slate">
                    {lead.organization || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${sourceBadgeClass(lead.source)}`}
                    >
                      {sourceLabel(lead.source)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadgeClass(lead.status)}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-caso-slate">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-caso-slate text-xs max-w-[200px] truncate">
                    {lead.metadata?.helpWith ||
                      lead.metadata?.industry ||
                      lead.metadata?.websiteUrl ||
                      "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-caso-slate">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{" "}
            {total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-lg border border-caso-border px-3 py-1.5 text-sm text-caso-slate hover:text-caso-white disabled:opacity-30"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-caso-border px-3 py-1.5 text-sm text-caso-slate hover:text-caso-white disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  className = "",
}: {
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-4">
      <p className="text-xs font-medium text-caso-slate">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${className || "text-caso-white"}`}>
        {value}
      </p>
    </div>
  );
}
