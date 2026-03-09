import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — CASO Comply",
  description:
    "Simple, per-page pricing for AI-powered document accessibility remediation. Pay only for what you use — PDFs, Word documents, and Excel spreadsheets.",
};

const PLANS = [
  {
    name: "Standard",
    price: "Per Page",
    period: "",
    description:
      "Automated remediation with font-size heuristic tagging. Perfect for bulk document processing.",
    features: [
      "PDF, Word & Excel support",
      "WCAG 2.1 AA compliance",
      "PDF/UA structure tagging",
      "Automated tag assignment",
      "Download remediated files",
      "Usage dashboard",
    ],
    cta: "Start Free Trial",
    ctaHref: "/signup",
    featured: false,
  },
  {
    name: "AI Verified",
    price: "Per Page",
    period: "",
    description:
      "Everything in Standard plus Gemini AI verification for heading hierarchy, reading order, and alt text.",
    features: [
      "Everything in Standard",
      "AI-verified tag accuracy",
      "Heading hierarchy validation",
      "Reading order correction",
      "Auto-generated alt text",
      "API access",
      "Priority support",
    ],
    cta: "Start Free Trial",
    ctaHref: "/signup",
    featured: true,
  },
  {
    name: "Human Review",
    price: "Per Page",
    period: "",
    description:
      "For documents that need expert human review — complex layouts, low-scoring files, or compliance-critical content.",
    features: [
      "Everything in AI Verified",
      "Expert human accessibility review",
      "Manual tag corrections",
      "Compliance certification",
      "Dedicated account manager",
      "Custom SLA",
    ],
    cta: "Contact Sales",
    ctaHref: "mailto:sales@caso.com?subject=CASO%20Comply%20Human%20Review%20Inquiry",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-caso-navy text-caso-white">
      {/* Skip link */}
      <a href="#pricing-content" className="skip-link">
        Skip to pricing content
      </a>

      {/* Nav */}
      <nav
        aria-label="Pricing navigation"
        className="sticky top-0 z-40 border-b border-caso-border/50 bg-caso-navy/95 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="Back to CASO Comply home"
          >
            <Image
              src="/caso-comply-logo-white.png"
              alt="CASO Comply"
              width={426}
              height={80}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Home
            </Link>
            <Link
              href="/demo"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Demo
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="ml-2 rounded-xl bg-caso-blue px-5 py-2.5 text-sm font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main id="pricing-content" className="relative">
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
              Choose the plan that fits your organization. All plans include
              full support for PDFs, Word documents, and Excel spreadsheets.
              Start with a 14-day free trial.
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
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-caso-blue px-4 py-1 text-xs font-bold uppercase tracking-wider text-caso-white">
                    Most Popular
                  </div>
                )}

                {/* Plan name */}
                <div className="text-sm font-semibold uppercase tracking-wider text-caso-glacier">
                  {plan.name}
                </div>

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-display)] text-5xl font-bold text-caso-white">
                    {plan.price}
                  </span>
                  <span className="text-lg text-caso-slate">{plan.period}</span>
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
                {plan.name === "Enterprise" ? (
                  <a
                    href={plan.ctaHref}
                    className="mt-8 block rounded-xl border border-caso-border bg-transparent px-6 py-3.5 text-center text-sm font-bold text-caso-white transition-all hover:border-caso-blue hover:bg-caso-navy-light"
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <Link
                    href={plan.ctaHref}
                    className={`mt-8 block rounded-xl px-6 py-3.5 text-center text-sm font-bold transition-all ${
                      plan.featured
                        ? "bg-caso-blue text-caso-white hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
                        : "border border-caso-border bg-transparent text-caso-white hover:border-caso-blue hover:bg-caso-navy-light"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Extra info */}
          <div className="mx-auto mt-16 max-w-3xl">
            <div className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-8 text-center">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white">
                Need a custom plan?
              </h2>
              <p className="mt-3 text-sm text-caso-slate">
                We offer volume discounts, on-premise deployment, and custom
                SLAs for organizations with unique requirements. All plans
                include WCAG 2.1 AA, PDF/UA, and Section 508 compliance.
              </p>
              <a
                href="mailto:sales@caso.com?subject=CASO%20Comply%20Custom%20Plan%20Inquiry"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-caso-blue px-8 py-3.5 text-sm font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
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
              </a>
            </div>
          </div>

          {/* FAQ-style notes */}
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
                14-Day Free Trial
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                Try any plan free for 14 days. No credit card required to start.
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
                Every plan supports PDFs, Word documents (.docx), and Excel
                spreadsheets (.xlsx).
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
      </main>

      {/* Footer */}
      <footer
        className="border-t border-caso-border/50 bg-caso-navy-light/50"
        role="contentinfo"
      >
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-4">
              <Image
                src="/caso-comply-logo-white.png"
                alt="CASO Comply"
                width={426}
                height={80}
                className="h-6 w-auto"
              />
              <span className="text-sm text-caso-slate">
                &copy; {new Date().getFullYear()} CASO Document Management, Inc.
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-caso-slate hover:text-caso-white"
              >
                Home
              </Link>
              <Link
                href="/demo"
                className="text-sm text-caso-slate hover:text-caso-white"
              >
                Demo
              </Link>
              <a
                href="mailto:sales@caso.com"
                className="text-sm text-caso-slate hover:text-caso-white"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
