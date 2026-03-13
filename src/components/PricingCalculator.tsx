"use client";

import { useState } from "react";

const TIERS = [
  { name: "Basic Accessibility", rate: 0.30, level: "Level 1" },
  { name: "Enhanced Compliance", rate: 1.80, level: "Level 2" },
  { name: "Full Remediation", rate: 12.00, level: "Level 3" },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PricingCalculator() {
  const [pages, setPages] = useState(500);

  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPages(parseInt(e.target.value, 10));
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 0) {
      setPages(Math.min(val, 100000));
    } else if (e.target.value === "") {
      setPages(0);
    }
  }

  return (
    <div className="rounded-2xl border border-caso-blue/30 bg-caso-navy-light/50 p-8">
      <h2 className="text-center font-[family-name:var(--font-display)] text-xl font-bold text-caso-white">
        Pricing calculator
      </h2>
      <p className="mt-2 text-center text-sm text-caso-slate">
        Estimate your cost based on the number of pages you need remediated.
      </p>

      {/* Input */}
      <div className="mx-auto mt-8 max-w-md">
        <label htmlFor="page-count" className="block text-sm font-medium text-caso-slate mb-2">
          How many pages do you need remediated?
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            id="page-slider"
            min="10"
            max="10000"
            step="10"
            value={Math.min(pages, 10000)}
            onChange={handleSliderChange}
            className="flex-1 accent-caso-blue"
            aria-label="Page count slider"
          />
          <input
            type="number"
            id="page-count"
            value={pages}
            onChange={handleInputChange}
            min="1"
            max="100000"
            className="w-24 rounded-lg border border-caso-border bg-caso-navy px-3 py-2 text-center text-sm font-medium text-caso-white focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue"
          />
        </div>
        <p className="mt-1 text-right text-xs text-caso-slate">
          {pages.toLocaleString()} pages
        </p>
      </div>

      {/* Results */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {TIERS.map((tier) => {
          const total = pages * tier.rate;
          return (
            <div
              key={tier.name}
              className="rounded-xl border border-caso-border/50 bg-caso-navy/50 p-4 text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-caso-glacier">
                {tier.level}
              </p>
              <p className="mt-1 text-sm font-medium text-caso-white">
                {tier.name}
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                {formatCurrency(total)}
              </p>
              <p className="mt-1 text-xs text-caso-slate">
                {pages.toLocaleString()} pages × ${tier.rate.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-caso-slate">
        Volume discounts available for larger projects.{" "}
        <a href="/contact" className="text-caso-blue hover:underline">
          Contact us
        </a>{" "}
        for a custom quote.
      </p>
    </div>
  );
}
