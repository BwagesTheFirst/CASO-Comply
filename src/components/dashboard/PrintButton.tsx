"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-lg border border-caso-border px-4 py-2 text-sm text-caso-slate hover:text-caso-white transition-colors"
    >
      Print Invoice
    </button>
  );
}
