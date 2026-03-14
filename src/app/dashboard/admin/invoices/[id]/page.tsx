"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface LineItem {
  description: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
}

interface Tenant {
  name: string;
  billing_email: string | null;
  domain: string | null;
  slug: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  tenant_id: string;
  tenants: Tenant | null;
  billing_period_start: string;
  billing_period_end: string;
  line_items: LineItem[];
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  payment_terms: string;
  po_number: string | null;
  notes: string | null;
  status: string;
  sent_at: string | null;
  paid_at: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ["draft", "sent", "cancelled"],
  sent: ["sent", "paid", "overdue", "cancelled"],
  overdue: ["overdue", "paid", "cancelled"],
  paid: ["paid", "cancelled"],
  cancelled: ["cancelled"],
};
const PAYMENT_TERMS_OPTIONS = ["Net 30", "Net 45", "Net 60", "Due on Receipt"];

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AdminInvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Editable fields
  const [editStatus, setEditStatus] = useState("");
  const [editPaymentTerms, setEditPaymentTerms] = useState("");
  const [editPoNumber, setEditPoNumber] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editLineItems, setEditLineItems] = useState<LineItem[]>([]);

  const fetchInvoice = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}`);
      const data = await res.json();
      if (res.ok) {
        setInvoice(data.invoice);
        setEditStatus(data.invoice.status);
        setEditPaymentTerms(data.invoice.payment_terms || "Net 30");
        setEditPoNumber(data.invoice.po_number || "");
        setEditNotes(data.invoice.notes || "");
        setEditLineItems(data.invoice.line_items || []);
      } else {
        setError(data.error || "Failed to fetch invoice");
      }
    } catch {
      setError("Failed to fetch invoice");
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          payment_terms: editPaymentTerms,
          po_number: editPoNumber || null,
          notes: editNotes || null,
          line_items: editLineItems,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Invoice updated successfully.");
        setInvoice(data.invoice);
      } else {
        setError(data.error || "Failed to update invoice");
      }
    } catch {
      setError("Failed to update invoice");
    } finally {
      setSaving(false);
    }
  }

  async function quickStatusChange(newStatus: string) {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Invoice marked as ${newStatus}.`);
        setInvoice(data.invoice);
        setEditStatus(newStatus);
      } else {
        setError(data.error || "Failed to update status");
      }
    } catch {
      setError("Failed to update status");
    } finally {
      setSaving(false);
    }
  }

  function updateLineItem(index: number, field: keyof LineItem, value: string | number) {
    const updated = [...editLineItems];
    const item = { ...updated[index] };

    if (field === "description") {
      item.description = value as string;
    } else if (field === "quantity") {
      item.quantity = Number(value);
      item.total_cents = item.quantity * item.unit_price_cents;
    } else if (field === "unit_price_cents") {
      item.unit_price_cents = Math.round(Number(value) * 100);
      item.total_cents = item.quantity * item.unit_price_cents;
    }

    updated[index] = item;
    setEditLineItems(updated);
  }

  function addLineItem() {
    setEditLineItems([
      ...editLineItems,
      { description: "", quantity: 1, unit_price_cents: 0, total_cents: 0 },
    ]);
  }

  function removeLineItem(index: number) {
    setEditLineItems(editLineItems.filter((_, i) => i !== index));
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl">
        <div className="text-caso-slate text-sm">Loading invoice...</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="space-y-6 max-w-6xl">
        <Link
          href="/dashboard/admin/invoices"
          className="text-sm text-caso-blue hover:text-caso-blue-bright transition-colors"
        >
          &larr; Back to Invoices
        </Link>
        <div className="text-caso-red text-sm">{error || "Invoice not found."}</div>
      </div>
    );
  }

  const isDraft = invoice.status === "draft";
  const editSubtotal = editLineItems.reduce((sum, item) => sum + item.total_cents, 0);

  return (
    <div className="space-y-6 max-w-6xl">
      <Link
        href="/dashboard/admin/invoices"
        className="inline-block text-sm text-caso-blue hover:text-caso-blue-bright transition-colors"
      >
        &larr; Back to Invoices
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
            {invoice.invoice_number}
          </h1>
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(invoice.status)}`}
          >
            {invoice.status}
          </span>
        </div>
        <div className="flex gap-2">
          {invoice.status === "draft" && (
            <button
              onClick={() => quickStatusChange("sent")}
              disabled={saving}
              className="rounded-lg bg-caso-blue px-4 py-2 text-sm font-semibold text-white hover:bg-caso-blue-bright disabled:opacity-50 transition-colors"
            >
              Mark as Sent
            </button>
          )}
          {invoice.status === "sent" && (
            <button
              onClick={() => quickStatusChange("overdue")}
              disabled={saving}
              className="rounded-lg bg-caso-red/80 px-4 py-2 text-sm font-semibold text-white hover:bg-caso-red disabled:opacity-50 transition-colors"
            >
              Mark as Overdue
            </button>
          )}
          {(invoice.status === "sent" || invoice.status === "overdue") && (
            <button
              onClick={() => quickStatusChange("paid")}
              disabled={saving}
              className="rounded-lg bg-caso-green px-4 py-2 text-sm font-semibold text-white hover:bg-caso-green/80 disabled:opacity-50 transition-colors"
            >
              Mark as Paid
            </button>
          )}
          {invoice.status !== "cancelled" && invoice.status !== "paid" && (
            <button
              onClick={() => quickStatusChange("cancelled")}
              disabled={saving}
              className="rounded-lg border border-caso-red/50 px-4 py-2 text-sm font-medium text-caso-red hover:bg-caso-red/10 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="rounded-lg border border-caso-border px-4 py-2 text-sm text-caso-slate hover:text-caso-white transition-colors"
          >
            Print
          </button>
        </div>
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

      {/* Invoice Details */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div>
            <p className="text-xs text-caso-slate mb-1">Tenant</p>
            <p className="text-sm text-caso-white font-medium">
              {invoice.tenants?.name || "Unknown"}
            </p>
            {invoice.tenants?.billing_email && (
              <p className="text-xs text-caso-slate mt-0.5">{invoice.tenants.billing_email}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-caso-slate mb-1">Billing Period</p>
            <p className="text-sm text-caso-white">
              {formatDate(invoice.billing_period_start + "T00:00:00")} &ndash;{" "}
              {formatDate(invoice.billing_period_end + "T00:00:00")}
            </p>
          </div>
          <div>
            <p className="text-xs text-caso-slate mb-1">Due Date</p>
            <p className="text-sm text-caso-white">
              {invoice.due_date
                ? formatDate(invoice.due_date + "T00:00:00")
                : "Not set"}
            </p>
          </div>
          <div>
            <p className="text-xs text-caso-slate mb-1">Created</p>
            <p className="text-sm text-caso-white">
              {formatDate(invoice.created_at)}
            </p>
          </div>
        </div>

        {invoice.sent_at && (
          <p className="text-xs text-caso-slate mb-2">
            Sent: {formatDate(invoice.sent_at)}
          </p>
        )}
        {invoice.paid_at && (
          <p className="text-xs text-caso-green mb-2">
            Paid: {formatDate(invoice.paid_at)}
          </p>
        )}
      </div>

      {/* Line Items */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
        <div className="px-6 py-4 border-b border-caso-border flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white">
            Line Items
          </h2>
          {isDraft && (
            <button
              onClick={addLineItem}
              className="text-sm text-caso-blue hover:text-caso-blue-bright transition-colors"
            >
              + Add Item
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-caso-border text-left">
                <th className="px-6 py-3 text-caso-slate font-medium">Description</th>
                <th className="px-6 py-3 text-caso-slate font-medium text-right">Qty</th>
                <th className="px-6 py-3 text-caso-slate font-medium text-right">Unit Price</th>
                <th className="px-6 py-3 text-caso-slate font-medium text-right">Total</th>
                {isDraft && <th className="px-6 py-3 text-caso-slate font-medium w-10"></th>}
              </tr>
            </thead>
            <tbody>
              {editLineItems.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-caso-border/50 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-3">
                    {isDraft ? (
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateLineItem(idx, "description", e.target.value)}
                        className="w-full bg-transparent text-caso-white border-b border-caso-border/50 focus:border-caso-blue focus:outline-none py-1 text-sm"
                      />
                    ) : (
                      <span className="text-caso-white">{item.description}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right">
                    {isDraft ? (
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(idx, "quantity", e.target.value)}
                        className="w-20 bg-transparent text-caso-white border-b border-caso-border/50 focus:border-caso-blue focus:outline-none py-1 text-sm text-right"
                      />
                    ) : (
                      <span className="text-caso-white">{item.quantity.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right">
                    {isDraft ? (
                      <input
                        type="number"
                        step="0.01"
                        value={(item.unit_price_cents / 100).toFixed(2)}
                        onChange={(e) => updateLineItem(idx, "unit_price_cents", e.target.value)}
                        className="w-28 bg-transparent text-caso-white border-b border-caso-border/50 focus:border-caso-blue focus:outline-none py-1 text-sm text-right"
                      />
                    ) : (
                      <span className="text-caso-white">{formatCents(item.unit_price_cents)}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right text-caso-white font-medium">
                    {formatCents(item.total_cents)}
                  </td>
                  {isDraft && (
                    <td className="px-6 py-3">
                      <button
                        onClick={() => removeLineItem(idx)}
                        className="text-caso-red hover:text-caso-red/80 transition-colors"
                        title="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-6 py-4 border-t border-caso-border">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-caso-slate">Subtotal</span>
                <span className="text-caso-white font-medium">
                  {isDraft ? formatCents(editSubtotal) : formatCents(invoice.subtotal_cents)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-caso-slate">Tax</span>
                <span className="text-caso-white">{formatCents(invoice.tax_cents)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-caso-border pt-2">
                <span className="text-caso-white font-semibold">Total</span>
                <span className="text-caso-white font-bold text-lg">
                  {isDraft ? formatCents(editSubtotal) : formatCents(invoice.total_cents)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-4">
          Invoice Settings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label htmlFor="edit-status" className="block text-sm font-medium text-caso-slate mb-1.5">
              Status
            </label>
            <select
              id="edit-status"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors text-sm"
            >
              {(VALID_TRANSITIONS[invoice.status] || [invoice.status]).map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="edit-terms" className="block text-sm font-medium text-caso-slate mb-1.5">
              Payment Terms
            </label>
            <select
              id="edit-terms"
              value={editPaymentTerms}
              onChange={(e) => setEditPaymentTerms(e.target.value)}
              className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors text-sm"
            >
              {PAYMENT_TERMS_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="edit-po" className="block text-sm font-medium text-caso-slate mb-1.5">
              PO Number
            </label>
            <input
              id="edit-po"
              type="text"
              value={editPoNumber}
              onChange={(e) => setEditPoNumber(e.target.value)}
              placeholder="e.g. PO-2026-1234"
              className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white placeholder:text-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors text-sm"
            />
          </div>
          <div>
            <label htmlFor="edit-due" className="block text-sm font-medium text-caso-slate mb-1.5">
              Due Date
            </label>
            <p className="text-sm text-caso-white py-2.5">
              {invoice.due_date
                ? formatDate(invoice.due_date + "T00:00:00")
                : "Not set"}
            </p>
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="edit-notes" className="block text-sm font-medium text-caso-slate mb-1.5">
            Notes
          </label>
          <textarea
            id="edit-notes"
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            rows={3}
            placeholder="Internal notes or payment instructions..."
            className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white placeholder:text-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors text-sm resize-none"
          />
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
  );
}
