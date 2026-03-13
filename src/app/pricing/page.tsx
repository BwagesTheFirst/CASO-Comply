import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";
import PricingCalculator from "@/components/PricingCalculator";

export const metadata: Metadata = {
  title: "Pricing — CASO Comply",
  description:
    "Simple, per-page pricing for AI-powered document accessibility remediation. Three service levels starting at $0.30/page. WCAG 2.1 AA, PDF/UA, and Section 508 compliance.",
  openGraph: {
    title: "Pricing — CASO Comply",
    description:
      "Simple, per-page pricing for AI-powered document accessibility remediation. Three service levels starting at $0.30/page. WCAG 2.1 AA, PDF/UA, and Section 508 compliance.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/pricing",
  },
};

const PLANS = [
  {
    level: "Level 1",
    name: "Basic Accessibility",
    price: "$0.30",
    period: "/page",
    description:
      "Automated tagging, structure, and reading order for standard PDF documents. Fast turnaround for bulk processing.",
    features: [
      "Auto-tag structure (headings, lists, paragraphs)",
      "Metadata cleanup & language tagging",
      "Logical reading order correction",
      "Before & after compliance scoring",
      "Batch processing support",
      "Download remediated files",
    ],
    turnaround: "24-48 hours",
    cta: "Get Started",
    ctaHref: "/free-scan",
    featured: false,
  },
  {
    level: "Level 2",
    name: "Enhanced Compliance",
    price: "$1.80",
    period: "/page",
    description:
      "AI-powered remediation with enhanced checks, alt text generation, and a detailed compliance report.",
    features: [
      "Everything in Basic Accessibility",
      "AI-generated alt text for images",
      "AI-verified heading hierarchy",
      "Complex table header association",
      "Detailed compliance report",
      "Remediation log & audit trail",
      "API access",
    ],
    turnaround: "2-3 business days",
    cta: "Get Started",
    ctaHref: "/free-scan",
    featured: true,
  },
  {
    level: "Level 3",
    name: "Full Remediation",
    price: "$12.00",
    period: "/page",
    description:
      "Complete remediation with expert human QA review and a Certificate of Compliance for regulated industries.",
    features: [
      "Everything in Enhanced Compliance",
      "Expert human QA review",
      "Certificate of Compliance",
      "VPAT documentation",
      "Priority processing",
      "Dedicated account support",
      "Custom SLA",
    ],
    turnaround: "3-5 business days",
    cta: "Contact Sales",
    ctaHref: "/contact",
    featured: false,
  },
];

const VOLUME_DISCOUNTS = [
  { range: "1 - 500 pages", discount: "Standard pricing" },
  { range: "501 - 5,000 pages", discount: "10% discount" },
  { range: "5,001 - 25,000 pages", discount: "15% discount" },
  { range: "25,001+ pages", discount: "Custom pricing" },
];

export default function PricingPage() {
  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "CASO Comply Document Remediation",
            description: "AI-powered document accessibility remediation service",
            brand: { "@type": "Brand", name: "CASO Comply" },
            offers: [
              {
                "@type": "Offer",
                name: "Basic Accessibility",
                price: "0.30",
                priceCurrency: "USD",
                unitText: "per page",
                description: "Automated tagging, structure, and reading order",
              },
              {
                "@type": "Offer",
                name: "Enhanced Compliance",
                price: "1.80",
                priceCurrency: "USD",
                unitText: "per page",
                description: "AI-powered remediation with alt text and compliance report",
              },
              {
                "@type": "Offer",
                name: "Full Remediation",
                price: "12.00",
                priceCurrency: "USD",
                unitText: "per page",
                description: "Complete remediation with expert QA and Certificate of Compliance",
              },
            ],
          }),
        }}
      />
      <div className="relative">
        {/* Background */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-caso-blue/5 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-caso-teal/3 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-900 tracking-tight sm:text-4xl md:text-5xl">
              Simple, transparent{" "}
              <span className="text-gradient">pricing</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-caso-slate">
              Three service levels to match your document complexity. All plans
              include WCAG 2.1 AA, PDF/UA, and Section 508 compliance. Volume
              discounts available.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  plan.featured
                    ? "border-caso-blue bg-caso-navy-light shadow-xl shadow-caso-blue/10"
                    : "border-caso-border bg-caso-navy-light/50"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-caso-blue-deep px-4 py-1 text-xs font-bold uppercase tracking-wider text-caso-white">
                    Most Popular
                  </div>
                )}

                {/* Level */}
                <div className="text-sm font-semibold uppercase tracking-wider text-caso-glacier">
                  {plan.level}
                </div>

                {/* Plan name */}
                <div className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold text-caso-white">
                  {plan.name}
                </div>

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-display)] text-5xl font-bold text-caso-white">
                    {plan.price}
                  </span>
                  <span className="text-lg text-caso-slate">{plan.period}</span>
                </div>

                {/* Turnaround */}
                <div className="mt-2 text-xs text-caso-slate">
                  Turnaround: {plan.turnaround}
                </div>

                {/* Description */}
                <p className="mt-4 text-sm leading-relaxed text-caso-slate">
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="mt-8 flex-1 space-y-3" role="list">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-caso-slate"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-caso-green"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={plan.ctaHref}
                  className={`mt-8 block rounded-xl px-6 py-3.5 text-center text-sm font-bold transition-all ${
                    plan.featured
                      ? "bg-caso-blue-deep text-caso-white hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
                      : "border border-caso-border bg-transparent text-caso-white hover:border-caso-blue hover:bg-caso-navy-light"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Volume Discounts */}
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-8">
              <h2 className="text-center font-[family-name:var(--font-display)] text-xl font-bold text-caso-white">
                Volume discounts
              </h2>
              <p className="mt-2 text-center text-sm text-caso-slate">
                Processing large document libraries? We offer tiered discounts
                for higher volumes.
              </p>
              <div className="mt-6 space-y-3">
                {VOLUME_DISCOUNTS.map((tier) => (
                  <div
                    key={tier.range}
                    className="flex items-center justify-between rounded-lg border border-caso-border/50 bg-caso-navy/50 px-4 py-3"
                  >
                    <span className="text-sm font-medium text-caso-white">
                      {tier.range}
                    </span>
                    <span className="text-sm font-semibold text-caso-green">
                      {tier.discount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Calculator */}
          <div className="mx-auto mt-16 max-w-3xl">
            <PricingCalculator />
          </div>

          {/* Custom Plan CTA */}
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-8 text-center">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white">
                Need a custom plan?
              </h2>
              <p className="mt-3 text-sm text-caso-slate">
                We offer on-premise deployment, custom SLAs, and dedicated
                support for organizations with unique requirements.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-caso-blue-deep px-8 py-3.5 text-sm font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
              >
                Talk to Sales
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Info Cards */}
          <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-caso-blue/10 text-caso-blue">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-base font-bold text-caso-white">
                Free Compliance Scan
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                Start with a free scan of your website to identify every
                inaccessible document.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-caso-blue/10 text-caso-blue">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-base font-bold text-caso-white">
                All Document Types
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                PDFs today, with Word (.docx) and Excel (.xlsx) remediation
                coming soon.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-caso-blue/10 text-caso-blue">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-base font-bold text-caso-white">
                SOC 2 Certified
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                Enterprise-grade security. Your documents are processed securely
                and never stored permanently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
