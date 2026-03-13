import MarketingLayout from "@/components/MarketingLayout";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Remediation Services — CASO Comply",
  description:
    "Professional PDF accessibility remediation services. Make your documents compliant with WCAG 2.1 AA, Section 508, and PDF/UA standards using AI-powered automation and expert review.",
};

const WHAT_GETS_FIXED = [
  {
    title: "Reading Order",
    description:
      "Ensure content is read in the correct sequence by screen readers and other assistive technologies.",
  },
  {
    title: "Heading Structure",
    description:
      "Establish a logical heading hierarchy (H1 through H6) so users can navigate the document efficiently.",
  },
  {
    title: "Alt Text",
    description:
      "Add descriptive alternative text to images, charts, and diagrams so non-visual users understand the content.",
  },
  {
    title: "Table Headers",
    description:
      "Mark row and column headers in data tables so screen readers can associate cells with their headings.",
  },
  {
    title: "Form Labels",
    description:
      "Associate labels with form fields so users know what information each field requires.",
  },
  {
    title: "Color Contrast",
    description:
      "Verify that text and background colors meet minimum contrast ratios for readability.",
  },
  {
    title: "Document Language",
    description:
      "Set the document language attribute so assistive technologies use the correct pronunciation rules.",
  },
  {
    title: "Bookmarks",
    description:
      "Generate bookmarks from the heading structure for quick navigation within longer documents.",
  },
];

const SERVICE_TIERS = [
  {
    level: "Level 1",
    name: "Basic Accessibility",
    price: "$0.30",
    unit: "/page",
    description:
      "Automated tagging, structure, and reading order correction. Best for high-volume internal documents that need baseline accessibility.",
    features: [
      "Automated PDF/UA structure tagging",
      "Reading order correction",
      "Document language setting",
      "Bookmark generation",
      "Machine-verified output",
    ],
    bestFor: "High-volume internal docs",
    turnaround: "Minutes",
  },
  {
    level: "Level 2",
    name: "Enhanced Compliance",
    price: "$1.80",
    unit: "/page",
    description:
      "Automated remediation plus enhanced checks and a compliance report. Best for public-facing documents that must meet regulatory standards.",
    features: [
      "Everything in Level 1",
      "AI-verified heading hierarchy",
      "Enhanced alt text generation",
      "Table header identification",
      "Form label association",
      "Color contrast validation",
      "Compliance report included",
    ],
    bestFor: "Public-facing docs",
    turnaround: "1\u20132 business days",
    featured: true,
  },
  {
    level: "Level 3",
    name: "Full Remediation",
    price: "$12.00",
    unit: "/page",
    description:
      "Complete remediation with expert human QA and a Certificate of Compliance. Best for legal filings, government submissions, and compliance-critical documents.",
    features: [
      "Everything in Level 2",
      "Expert human QA review",
      "Manual tag corrections",
      "Complex table remediation",
      "Certificate of Compliance",
      "Dedicated account manager",
    ],
    bestFor: "Legal/government filings",
    turnaround: "2\u20135 business days",
  },
];

const VOLUME_DISCOUNTS = [
  { volume: "100K+ pages", price: "$0.29/page" },
  { volume: "500K+ pages", price: "$0.28/page" },
  { volume: "1M+ pages", price: "$0.26/page" },
  { volume: "5M+ pages", price: "$0.25/page" },
];

const STANDARDS = [
  {
    name: "WCAG 2.1 AA",
    description:
      "Web Content Accessibility Guidelines — the global standard for digital accessibility, required by most regulations.",
  },
  {
    name: "Section 508",
    description:
      "U.S. federal requirement for accessible electronic and information technology, applicable to all federal agencies and their contractors.",
  },
  {
    name: "PDF/UA (ISO 14289)",
    description:
      "The international standard for universally accessible PDF documents, defining requirements for tagged PDF structure.",
  },
  {
    name: "HHS",
    description:
      "U.S. Department of Health and Human Services accessibility requirements for health-related documents and communications.",
  },
  {
    name: "EN 301 549",
    description:
      "European standard for ICT accessibility, harmonized with the EU Web Accessibility Directive and European Accessibility Act.",
  },
];

const PROCESS_STEPS = [
  {
    step: "1",
    title: "Upload",
    description:
      "Upload your PDF documents through our secure portal, API, or bulk import. Files are encrypted in transit and at rest.",
  },
  {
    step: "2",
    title: "AI Analyzes",
    description:
      "Our AI engine scans each document, identifies accessibility issues, and applies automated remediation — tagging structure, reading order, alt text, and more.",
  },
  {
    step: "3",
    title: "Expert QA",
    description:
      "For Level 2 and Level 3 services, trained accessibility specialists review the output, correct edge cases, and validate compliance.",
  },
  {
    step: "4",
    title: "Download with Certificate",
    description:
      "Download your fully remediated documents along with a compliance report or Certificate of Compliance, ready for publication or filing.",
  },
];

export default function PdfRemediationPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="border-b border-caso-border/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            PDF Remediation Services
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-caso-slate md:text-xl">
            PDF remediation is the process of making PDF documents accessible to
            everyone — including people who use screen readers, keyboard
            navigation, and other assistive technologies. We add the underlying
            structure that allows these tools to interpret your content correctly,
            so every user can read, navigate, and understand your documents.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex rounded-xl bg-caso-blue px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Get Started
            </Link>
            <Link
              href="/pricing"
              className="inline-flex rounded-xl border border-caso-border px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-slate transition-all hover:border-caso-glacier hover:text-caso-white"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* What Gets Fixed */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="what-gets-fixed"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="what-gets-fixed"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            What Gets Fixed
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            Every remediated document is checked and corrected across these
            critical accessibility areas.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHAT_GETS_FIXED.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-caso-border bg-caso-navy-light p-6"
              >
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-caso-slate">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Tiers */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="service-tiers"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="service-tiers"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            Service Tiers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            Choose the level of remediation that matches your compliance
            requirements and document complexity.
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {SERVICE_TIERS.map((tier) => (
              <div
                key={tier.level}
                className={`relative rounded-xl border p-8 ${
                  tier.featured
                    ? "border-caso-blue bg-caso-navy-light shadow-lg shadow-caso-blue/10"
                    : "border-caso-border bg-caso-navy-light"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-caso-blue px-4 py-1 text-xs font-bold uppercase tracking-wider text-caso-white">
                    Most Popular
                  </span>
                )}
                <p className="text-sm font-semibold uppercase tracking-wider text-caso-glacier">
                  {tier.level}
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold">
                  {tier.name}
                </h3>
                <div className="mt-4">
                  <span className="font-[family-name:var(--font-display)] text-4xl font-bold">
                    {tier.price}
                  </span>
                  <span className="text-caso-slate">{tier.unit}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-caso-slate">
                  {tier.description}
                </p>
                <ul className="mt-6 space-y-3" role="list">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-caso-teal"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-caso-slate">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href="/contact"
                    className={`block w-full rounded-xl px-6 py-3 text-center font-[family-name:var(--font-display)] text-sm font-bold transition-all ${
                      tier.featured
                        ? "bg-caso-blue text-caso-white hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
                        : "border border-caso-border text-caso-slate hover:border-caso-glacier hover:text-caso-white"
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Volume Discounts */}
          <div className="mt-12 rounded-xl border border-caso-border bg-caso-navy-light p-8">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
              Volume Discounts
            </h3>
            <p className="mt-2 text-sm text-caso-slate">
              Level 1 (Basic Accessibility) per-page pricing for high-volume
              commitments.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {VOLUME_DISCOUNTS.map((discount) => (
                <div
                  key={discount.volume}
                  className="rounded-lg border border-caso-border/50 bg-caso-navy px-5 py-4 text-center"
                >
                  <p className="text-sm font-medium text-caso-slate">
                    {discount.volume}
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold">
                    {discount.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Standards We Remediate To */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="standards"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="standards"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            Standards We Remediate To
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            Every document we process is validated against the standards that
            apply to your organization and jurisdiction.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STANDARDS.map((standard) => (
              <div
                key={standard.name}
                className="rounded-xl border border-caso-border bg-caso-navy-light p-6"
              >
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-glacier">
                  {standard.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-caso-slate">
                  {standard.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="how-it-works"
      >
        <div className="mx-auto max-w-5xl">
          <h2
            id="how-it-works"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            From upload to compliant download in four straightforward steps.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <div key={step.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-caso-blue bg-caso-navy-light">
                  <span
                    className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-blue"
                    aria-hidden="true"
                  >
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold">
                  <span className="sr-only">Step {step.step}: </span>
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-caso-slate">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Turnaround Times */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="turnaround"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="turnaround"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            Turnaround Times
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            Processing speed depends on the level of remediation and review
            required.
          </p>
          <div className="mt-12 overflow-hidden rounded-xl border border-caso-border bg-caso-navy-light">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-caso-border">
                  <th
                    scope="col"
                    className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-caso-glacier"
                  >
                    Service Level
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-caso-glacier"
                  >
                    Typical Turnaround
                  </th>
                </tr>
              </thead>
              <tbody>
                {SERVICE_TIERS.map((tier, index) => (
                  <tr
                    key={tier.level}
                    className={
                      index < SERVICE_TIERS.length - 1
                        ? "border-b border-caso-border/50"
                        : ""
                    }
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold">{tier.level}</span>
                      <span className="text-caso-slate">
                        {" "}
                        &mdash; {tier.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {tier.turnaround}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="cta-heading"
            className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            Ready to make your documents accessible?
          </h2>
          <p className="mt-4 text-lg text-caso-slate">
            Whether you have a handful of PDFs or millions of pages, we have a
            remediation solution that fits your needs and budget.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex rounded-xl bg-caso-blue px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Get Started
            </Link>
            <Link
              href="/pricing"
              className="inline-flex rounded-xl border border-caso-border px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-slate transition-all hover:border-caso-glacier hover:text-caso-white"
            >
              View Full Pricing
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
