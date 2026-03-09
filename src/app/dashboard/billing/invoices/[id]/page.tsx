import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import PrintButton from "@/components/dashboard/PrintButton";

interface LineItem {
  description: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
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

export default async function ClientInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const admin = createAdminClient();

  // Get user's tenant
  const { data: membership } = await admin
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!membership) redirect("/dashboard");

  // Fetch invoice - ensure it belongs to the user's tenant
  const { data: invoice } = await admin
    .from("invoices")
    .select("*, tenants(name, billing_email)")
    .eq("id", id)
    .eq("tenant_id", membership.tenant_id)
    .single();

  if (!invoice) {
    redirect("/dashboard/billing");
  }

  const lineItems: LineItem[] = invoice.line_items || [];
  const tenant = invoice.tenants as { name: string; billing_email: string | null } | null;

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          /* Hide dashboard chrome */
          aside, header, nav, .no-print { display: none !important; }
          main { padding: 0 !important; }
          .print-container {
            background: white !important;
            color: #1a1a1a !important;
            border: none !important;
          }
          .print-container * {
            color: #1a1a1a !important;
            border-color: #e5e7eb !important;
          }
          .print-header { color: #1a1a1a !important; }
          .print-subtle { color: #6b7280 !important; }
          .status-badge { display: none !important; }
        }
      `}</style>

      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between no-print">
          <Link
            href="/dashboard/billing"
            className="text-sm text-caso-blue hover:text-caso-blue-bright transition-colors"
          >
            &larr; Back to Billing
          </Link>
          <PrintButton />
        </div>

        <div className="print-container rounded-xl bg-caso-navy-light border border-caso-border p-8">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-caso-border">
            <div>
              <h2 className="print-header text-2xl font-bold text-caso-white mb-1">INVOICE</h2>
              <p className="print-subtle text-caso-slate font-mono text-sm">{invoice.invoice_number}</p>
            </div>
            <div className="text-right">
              <p className="print-header text-lg font-bold text-caso-white">CASO Comply</p>
              <p className="print-subtle text-sm text-caso-slate">PDF Accessibility Platform</p>
              <p className="print-subtle text-sm text-caso-slate">support@casocomply.com</p>
            </div>
          </div>

          {/* Bill To / Invoice Details */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="print-subtle text-xs text-caso-slate uppercase tracking-wider mb-2">Bill To</p>
              <p className="print-header text-caso-white font-semibold">{tenant?.name || "Unknown"}</p>
              {tenant?.billing_email && (
                <p className="print-subtle text-sm text-caso-slate">{tenant.billing_email}</p>
              )}
            </div>
            <div className="text-right space-y-1">
              <div>
                <span className="print-subtle text-xs text-caso-slate">Invoice Date: </span>
                <span className="print-header text-sm text-caso-white">
                  {formatDate(invoice.created_at)}
                </span>
              </div>
              <div>
                <span className="print-subtle text-xs text-caso-slate">Due Date: </span>
                <span className="print-header text-sm text-caso-white">
                  {invoice.due_date
                    ? formatDate(invoice.due_date + "T00:00:00")
                    : "Not set"}
                </span>
              </div>
              <div>
                <span className="print-subtle text-xs text-caso-slate">Payment Terms: </span>
                <span className="print-header text-sm text-caso-white">{invoice.payment_terms}</span>
              </div>
              {invoice.po_number && (
                <div>
                  <span className="print-subtle text-xs text-caso-slate">PO Number: </span>
                  <span className="print-header text-sm text-caso-white font-mono">{invoice.po_number}</span>
                </div>
              )}
              <div className="status-badge pt-1">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(invoice.status)}`}
                >
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>

          {/* Billing Period */}
          <div className="mb-6">
            <p className="print-subtle text-xs text-caso-slate uppercase tracking-wider mb-1">Billing Period</p>
            <p className="print-header text-sm text-caso-white">
              {formatDate(invoice.billing_period_start + "T00:00:00")} &ndash;{" "}
              {formatDate(invoice.billing_period_end + "T00:00:00")}
            </p>
          </div>

          {/* Line Items */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-caso-border text-left">
                  <th className="py-3 text-caso-slate font-medium print-subtle">Description</th>
                  <th className="py-3 text-caso-slate font-medium text-right print-subtle">Qty</th>
                  <th className="py-3 text-caso-slate font-medium text-right print-subtle">Unit Price</th>
                  <th className="py-3 text-caso-slate font-medium text-right print-subtle">Total</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, idx) => (
                  <tr key={idx} className="border-b border-caso-border/50">
                    <td className="py-3 text-caso-white print-header">{item.description}</td>
                    <td className="py-3 text-caso-white text-right print-header">
                      {item.quantity.toLocaleString()}
                    </td>
                    <td className="py-3 text-caso-white text-right print-header">
                      {formatCents(item.unit_price_cents)}
                    </td>
                    <td className="py-3 text-caso-white text-right font-medium print-header">
                      {formatCents(item.total_cents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-caso-slate print-subtle">Subtotal</span>
                <span className="text-caso-white font-medium print-header">
                  {formatCents(invoice.subtotal_cents)}
                </span>
              </div>
              {invoice.tax_cents > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-caso-slate print-subtle">Tax</span>
                  <span className="text-caso-white print-header">
                    {formatCents(invoice.tax_cents)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t border-caso-border pt-2">
                <span className="text-caso-white font-semibold print-header">Total Due</span>
                <span className="text-caso-white font-bold text-lg print-header">
                  {formatCents(invoice.total_cents)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="border-t border-caso-border pt-4">
              <p className="print-subtle text-xs text-caso-slate uppercase tracking-wider mb-1">Notes</p>
              <p className="print-header text-sm text-caso-white whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}

          {/* Paid stamp */}
          {invoice.status === "paid" && (
            <div className="mt-6 text-center">
              <span className="inline-block border-4 border-caso-green text-caso-green text-2xl font-bold px-6 py-2 rounded-lg rotate-[-5deg] opacity-70">
                PAID
              </span>
              {invoice.paid_at && (
                <p className="text-xs text-caso-green mt-2">
                  Payment received {formatDate(invoice.paid_at)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
