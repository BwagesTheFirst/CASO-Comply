import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title: "ADA Compliance for Local Government & Municipalities — CASO Comply",
  description:
    "Municipal ADA compliance made affordable. CASO Comply helps cities, counties, and towns remediate PDFs for ADA Title II — meeting the April 2027 deadline without straining your budget.",
  openGraph: {
    title: "ADA Compliance for Local Government & Municipalities — CASO Comply",
    description:
      "Municipal ADA compliance made affordable. CASO Comply helps cities, counties, and towns remediate PDFs for ADA Title II — meeting the April 2027 deadline without straining your budget.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/solutions/municipal",
  },
};

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-caso-teal"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-caso-teal"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

const MUNICIPAL_DOCUMENTS = [
  "City council and board meeting minutes",
  "Annual budgets and financial reports",
  "Zoning ordinances and land-use maps",
  "Building permits and inspection forms",
  "Public hearing notices and agendas",
  "Parks and recreation program guides",
  "Utility billing statements and rate schedules",
  "Emergency preparedness and evacuation plans",
];

const CHALLENGES = [
  {
    title: "No Dedicated IT Accessibility Staff",
    description:
      "Most municipalities under 50,000 people have a small IT team — sometimes just one person. Nobody on staff has accessibility expertise, and hiring a full-time specialist is not in the budget.",
  },
  {
    title: "Decades of Legacy Documents",
    description:
      "Years of board minutes, ordinances, permits, and public notices have accumulated on your website. Many were scanned from paper originals with no text layer, no tags, and no reading order.",
  },
  {
    title: "Tight Municipal Budgets",
    description:
      "Accessibility consultants charge $5 to $15 per page for manual remediation. When you have thousands of documents, that can exceed an entire department's annual budget.",
  },
  {
    title: "Constant New Content",
    description:
      "Every council meeting, every new permit application, every budget amendment generates more PDFs. Compliance is not a one-time project — it is ongoing.",
  },
];

const COST_COMPARISON = [
  {
    method: "Manual Accessibility Consultant",
    cost: "$5 - $15 per page",
    timeline: "Months to years",
    highlight: false,
  },
  {
    method: "In-House Staff (Training + Tools)",
    cost: "$3 - $8 per page",
    timeline: "Requires dedicated FTE",
    highlight: false,
  },
  {
    method: "CASO Comply Automated Remediation",
    cost: "Starting at $0.30 per page",
    timeline: "Thousands of pages per day",
    highlight: true,
  },
];

const GETTING_STARTED_STEPS = [
  {
    step: "1",
    title: "Free SiteScan Assessment",
    description:
      "We crawl your municipal website and identify every PDF and document. You receive a full inventory with accessibility scores — no cost, no commitment.",
  },
  {
    step: "2",
    title: "Prioritize by Risk",
    description:
      "Not every document needs to be fixed at once. We help you prioritize high-traffic, legally required, and citizen-facing documents so you make the biggest compliance impact first.",
  },
  {
    step: "3",
    title: "Automated Remediation",
    description:
      "Our AI engine processes your documents — adding structure tags, generating alt text, correcting reading order, and fixing metadata. Thousands of pages remediated per day.",
  },
  {
    step: "4",
    title: "Ongoing Compliance",
    description:
      "New documents are automatically scanned as your staff publishes them. Stay compliant without changing your workflow or adding headcount.",
  },
];

export default function MunicipalSolutionPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="border-b border-caso-border/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-caso-glacier">
            Solutions for Municipalities
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            ADA Compliance for Cities, Counties & Towns
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-caso-slate md:text-xl">
            Your municipality has until April 2027 to make every public-facing
            document accessible. CASO Comply gives small and mid-size local
            governments an affordable, automated path to ADA Title II compliance
            — without hiring consultants or adding staff.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/free-scan"
              className="inline-flex rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Get Your Free SiteScan
            </Link>
            <Link
              href="/contact"
              className="inline-flex rounded-xl border border-caso-border px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-navy-light"
            >
              Talk to Our Municipal Team
            </Link>
          </div>
        </div>
      </section>

      {/* Deadline */}
      <section className="border-b border-caso-border/50 bg-caso-navy-light px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-yellow-500/30 bg-caso-navy p-8 md:p-10">
            <div className="flex items-start gap-4">
              <ClockIcon />
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
                  Your Deadline
                </p>
                <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold md:text-3xl">
                  April 26, 2027
                </p>
                <p className="mt-3 text-lg leading-relaxed text-caso-slate">
                  Under the DOJ&apos;s final ADA Title II rule, state and local
                  governments serving populations{" "}
                  <span className="font-semibold text-caso-white">
                    under 50,000
                  </span>{" "}
                  must bring all web content and digital documents into WCAG 2.1
                  AA compliance by this date. That includes every PDF on your
                  municipal website — meeting minutes, ordinances, budgets,
                  permits, and more.
                </p>
                <p className="mt-4 text-sm text-caso-slate">
                  Municipalities serving 50,000 or more already face enforcement
                  as of April 2026. If your community is approaching that
                  population threshold, the earlier deadline may apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Municipal Challenges */}
      <section className="border-b border-caso-border/50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              The Unique Challenges Municipalities Face
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              Local governments deal with compliance constraints that larger
              state agencies and enterprises do not. We built CASO Comply with
              these realities in mind.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {CHALLENGES.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-caso-border bg-caso-navy-light p-6"
              >
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-caso-slate">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents That Need Remediation */}
      <section className="border-b border-caso-border/50 bg-caso-navy-light px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              Common Municipal Documents That Need Remediation
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              If it is published on your website and a resident might need to
              read it, it must be accessible under ADA Title II.
            </p>
          </div>
          <ul
            role="list"
            className="mt-12 grid gap-4 sm:grid-cols-2"
          >
            {MUNICIPAL_DOCUMENTS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-caso-border bg-caso-navy p-5"
              >
                <CheckIcon />
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cost Comparison */}
      <section className="border-b border-caso-border/50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              Budget-Friendly Compliance
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              Manual remediation can cost more than your entire clerk&apos;s
              office budget. CASO Comply brings the per-page cost down by over
              90%.
            </p>
          </div>
          <div className="mt-12 space-y-4">
            {COST_COMPARISON.map((item) => (
              <div
                key={item.method}
                className={`flex flex-col gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between ${
                  item.highlight
                    ? "border-caso-teal/50 bg-caso-navy-light"
                    : "border-caso-border bg-caso-navy-light"
                }`}
              >
                <div className="flex items-start gap-3">
                  {item.highlight ? <DollarIcon /> : <div className="h-5 w-5 shrink-0" />}
                  <div>
                    <p className={`font-[family-name:var(--font-display)] font-bold ${item.highlight ? "text-caso-teal" : ""}`}>
                      {item.method}
                    </p>
                    <p className="mt-1 text-sm text-caso-slate">
                      {item.timeline}
                    </p>
                  </div>
                </div>
                <p className={`font-[family-name:var(--font-display)] text-xl font-bold ${item.highlight ? "text-caso-teal" : "text-caso-slate"}`}>
                  {item.cost}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-caso-slate">
            For a municipality with 3,000 pages of public documents, CASO Comply
            can achieve full compliance for under $1,000 — compared to $15,000
            or more with traditional consultants.
          </p>
        </div>
      </section>

      {/* Getting Started */}
      <section className="border-b border-caso-border/50 bg-caso-navy-light px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              How to Get Started with Limited Resources
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              You do not need a large team or a large budget. Here is how
              municipalities across the country are tackling ADA compliance with
              CASO Comply.
            </p>
          </div>
          <div className="mt-12 space-y-6">
            {GETTING_STARTED_STEPS.map((item) => (
              <div
                key={item.step}
                className="flex gap-5 rounded-2xl border border-caso-border bg-caso-navy p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-blue/10 font-[family-name:var(--font-display)] text-lg font-bold text-caso-blue">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-caso-slate">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why CASO for Municipalities */}
      <section className="border-b border-caso-border/50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              Why Municipalities Choose CASO
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              We have worked with government clients for over 40 years. We
              understand how local government procurement works, and we price
              our services so small communities are not left behind.
            </p>
          </div>
          <ul role="list" className="mt-12 grid gap-4 sm:grid-cols-2">
            {[
              "Pricing designed for municipal budgets",
              "No long-term contracts required",
              "SOC 2 Type II certified data handling",
              "HIPAA compliant for sensitive documents",
              "Cooperative purchasing agreements supported",
              "Dedicated support for government clients",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 p-3">
                <CheckIcon />
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related Solutions */}
      <section className="border-t border-caso-border px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center font-[family-name:var(--font-display)] text-2xl font-bold">
            Related Solutions
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/solutions/government"
              className="group rounded-xl border border-caso-border bg-caso-navy-light p-6 transition-colors hover:border-caso-blue/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue">
                Government
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                ADA Title II compliance for state and local government agencies
                of all sizes.
              </p>
            </Link>
            <Link
              href="/solutions/states"
              className="group rounded-xl border border-caso-border bg-caso-navy-light p-6 transition-colors hover:border-caso-blue/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue">
                States Hub
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                State-specific ADA compliance resources and deadline information.
              </p>
            </Link>
            <Link
              href="/solutions/enterprise"
              className="group rounded-xl border border-caso-border bg-caso-navy-light p-6 transition-colors hover:border-caso-blue/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue">
                Enterprise
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                ADA Title III compliance with API integration and SOC 2
                certification.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            Your Community Deserves Accessible Documents
          </h2>
          <p className="mt-4 text-lg text-caso-slate">
            Find out how many inaccessible documents are on your municipal
            website. Our free SiteScan identifies every PDF that needs
            remediation — and shows you exactly what it will cost to fix.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/free-scan"
              className="inline-flex rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Get Your Free SiteScan
            </Link>
            <Link
              href="/contact"
              className="inline-flex rounded-xl border border-caso-border px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-navy-light"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
