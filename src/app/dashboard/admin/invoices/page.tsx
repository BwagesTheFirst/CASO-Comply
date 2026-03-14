"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Tenant {
  name: string;
  billing_email: string | null;
}

interface Invoice {
  id: string;
  invoice_number: string;
  tenant_id: string;
  tenants: Tenant | null;
  billing_period_start: string;
  billing_period_end: string;
  total_cents: number;
  status: string;
  due_date: string | null;
  po_number: string | null;
  payment_terms: string;
  created_at: string;
}

const STATUS_TABS = ["all", "draft", "sent", "paid", "overdue", "cancelled"];

function statusBadgeClass(status: string): string {
  switch (status) {
    case "draft":
      return "bg-caso-slate/10 text-caso-slate";
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

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
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

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const limit = 20;

  // Generate modal
  const [showGenerate, setShowGenerate] = useState(false);
  const [genStart, setGenStart] = useState("");
  const [genEnd, setGenEnd] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (activeTab !== "all") params.set("status", activeTab);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/invoices?${params}`);
      const data = await res.json();
      if (res.ok) {
        setInvoices(data.invoices || []);
        setTotal(data.total || 0);
      }
    } catch {
      // Error fetching
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, page]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [activeTab, search]);

  async function handleGenerate() {
    if (!genStart || !genEnd) return;
    setGenerating(true);
    setGenResult(null);
    try {
      const res = await fetch("/api/admin/invoices/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing_period_start: genStart,
          billing_period_end: genEnd,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setGenResult(
          `Generated ${data.generated} invoice(s). ${data.skipped} skipped.${
            data.errors ? ` Errors: ${data.errors.join(", ")}` : ""
          }`
        );
        fetchInvoices();
      } else {
        setGenResult(`Error: ${data.error}`);
      }
    } catch {
      setGenResult("Failed to generate invoices");
    } finally {
      setGenerating(false);
    }
  }

  async function quickStatusChange(invoiceId: string, newStatus: string) {
    setUpdatingId(invoiceId);
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchInvoices();
      }
    } catch {
      // Error updating
    } finally {
      setUpdatingId(null);
    }
  }

  // Pre-fill generate modal with current month
  function openGenerateModal() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).toISOString().split("T")[0];
    const lastDay = new Date(year, month + 1, 0).toISOString().split("T")[0];
    setGenStart(firstDay);
    setGenEnd(lastDay);
    setGenResult(null);
    setShowGenerate(true);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
          Invoices
        </h1>
        <button
          onClick={openGenerateModal}
          className="rounded-lg bg-caso-blue px-4 py-2 text-sm font-semibold text-white hover:bg-caso-blue-bright transition-colors"
        >
          Generate Monthly Invoices
        </button>
      </div>

      {/* Generate Modal */}
      {showGenerate && (
        <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-4">
            Generate Monthly Invoices
          </h2>
          <p className="text-sm text-caso-slate mb-4">
            This will create draft invoices for all active tenants with plans for the specified billing period.
            Tenants that already have an invoice for this period will be skipped.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="gen-start" className="block text-sm font-medium text-caso-slate mb-1.5">
                Period Start
              </label>
              <input
                id="gen-start"
                type="date"
                value={genStart}
                onChange={(e) => setGenStart(e.target.value)}
                className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors text-sm"
              />
            </div>
            <div>
              <label htmlFor="gen-end" className="block text-sm font-medium text-caso-slate mb-1.5">
                Period End
              </label>
              <input
                id="gen-end"
                type="date"
                value={genEnd}
                onChange={(e) => setGenEnd(e.target.value)}
                className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={generating || !genStart || !genEnd}
              className="rounded-lg bg-caso-blue px-4 py-2 text-sm font-semibold text-white hover:bg-caso-blue-bright disabled:opacity-50 transition-colors"
            >
              {generating ? "Generating..." : "Generate"}
            </button>
            <button
              onClick={() => setShowGenerate(false)}
              className="rounded-lg border border-caso-border px-4 py-2 text-sm text-caso-slate hover:text-caso-white transition-colors"
            >
              Cancel
            </button>
          </div>
          {genResult && (
            <p className={`mt-3 text-sm ${genResult.startsWith("Error") ? "text-caso-red" : "text-caso-green"}`}>
              {genResult}
            </p>
          )}
        </div>
      )}

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by tenant name or invoice number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white placeholder:text-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors text-sm"
        />
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 border-b border-caso-border">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-caso-blue text-caso-blue"
                : "border-transparent text-caso-slate hover:text-caso-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
        {loading ? (
          <div className="px-6 py-8 text-center text-caso-slate text-sm">
            Loading invoices...
          </div>
        ) : invoices.length === 0 ? (
          <div className="px-6 py-8 text-center text-caso-slate text-sm">
            No invoices found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-caso-border text-left">
                  <th className="px-6 py-3 text-caso-slate font-medium">Invoice #</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Tenant</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Period</th>
                  <th className="px-6 py-3 text-caso-slate font-medium text-right">Total</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Status</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Due Date</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">PO #</th>
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
                    <td className="px-6 py-3 text-caso-white">
                      {inv.tenants?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-3 text-caso-slate">
                      {formatPeriodShort(inv.billing_period_start, inv.billing_period_end)}
                    </td>
                    <td className="px-6 py-3 text-caso-white text-right font-medium">
                      {formatCents(inv.total_cents)}
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
                    <td className="px-6 py-3 text-caso-slate font-mono text-xs">
                      {inv.po_number || "-"}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/admin/invoices/${inv.id}`}
                          className="text-caso-blue hover:text-caso-blue-bright text-sm font-medium transition-colors"
                        >
                          View
                        </Link>
                        {inv.status === "draft" && (
                          <button
                            onClick={() => quickStatusChange(inv.id, "sent")}
                            disabled={updatingId === inv.id}
                            className="text-xs text-caso-slate hover:text-caso-blue disabled:opacity-50 transition-colors"
                          >
                            {updatingId === inv.id ? "..." : "Send"}
                          </button>
                        )}
                        {(inv.status === "sent" || inv.status === "overdue") && (
                          <button
                            onClick={() => quickStatusChange(inv.id, "paid")}
                            disabled={updatingId === inv.id}
                            className="text-xs text-caso-slate hover:text-caso-green disabled:opacity-50 transition-colors"
                          >
                            {updatingId === inv.id ? "..." : "Paid"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-caso-border flex items-center justify-between">
            <p className="text-xs text-caso-slate">
              Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-caso-border px-3 py-1.5 text-xs text-caso-slate hover:text-caso-white disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-caso-border px-3 py-1.5 text-xs text-caso-slate hover:text-caso-white disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
