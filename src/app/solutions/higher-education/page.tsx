import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title: "Document Accessibility for Higher Education — CASO Comply",
  description:
    "ADA Title II compliance for public universities and colleges. Automated PDF remediation, document inventory, and compliance tracking for higher education institutions.",
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

const SCOPE_ITEMS = [
  {
    title: "Course Materials",
    description:
      "Syllabi, lecture slides, handouts, and assignments published through the LMS or departmental sites.",
  },
  {
    title: "LMS Content",
    description:
      "Documents embedded in Canvas, Blackboard, Moodle, and other learning management systems.",
  },
  {
    title: "Administrative Documents",
    description:
      "Financial aid forms, enrollment documents, policy handbooks, and campus communications.",
  },
  {
    title: "Public-Facing PDFs",
    description:
      "Annual reports, research publications, campus maps, event materials, and institutional documents.",
  },
  {
    title: "Vendor-Provided Content",
    description:
      "Third-party documents hosted on university domains. Your institution is responsible for their accessibility.",
  },
  {
    title: "Library & Research Materials",
    description:
      "Digitized collections, institutional repositories, and research publications made available online.",
  },
];

const CHALLENGES = [
  {
    title: "Decentralized Content Creation",
    description:
      "Hundreds of departments and thousands of faculty create and publish documents independently. There is no single point of control.",
  },
  {
    title: "No Centralized Inventory",
    description:
      "Most institutions have no idea how many PDFs exist across their web presence. The number is typically in the tens of thousands.",
  },
  {
    title: "Vendor Responsibility Gap",
    description:
      "Universities are legally responsible for the accessibility of vendor-provided content hosted on their domains — even when they did not create it.",
  },
  {
    title: "Volume and Budget Constraints",
    description:
      "Manual remediation at $5-10 per page is not feasible when you have 50,000+ documents. Institutions need automation to make compliance achievable.",
  },
];

const HOW_WE_HELP = [
  {
    title: "SiteScan Document Discovery",
    description:
      "Automated crawling across your entire web presence — main site, department pages, LMS, and subdomains. Get a complete inventory of every document that needs attention.",
  },
  {
    title: "Bulk Automated Remediation",
    description:
      "Process thousands of documents per day with AI-powered structure tagging, alt text generation, and reading order correction. Pricing designed for higher-ed volume.",
  },
  {
    title: "Compliance Tracking Dashboard",
    description:
      "Track remediation progress by department, document type, and compliance score. Generate reports for administration and accreditation reviews.",
  },
  {
    title: "Ongoing Monitoring",
    description:
      "New documents are automatically scanned as they are published. Prevent compliance regression as faculty and staff add content.",
  },
];

export default function HigherEducationSolutionPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="border-b border-caso-border/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-caso-glacier">
            Solutions for Higher Education
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Document Accessibility for Higher Education
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-caso-slate md:text-xl">
            Public universities and colleges must meet ADA Title II requirements
            for all digital content. With tens of thousands of documents spread
            across departments, manual remediation is not an option.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
            >
              See How We Help Universities
            </Link>
            <Link
              href="/free-scan"
              className="inline-flex rounded-xl border border-caso-border px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-navy-light"
            >
              Run a Free Site Scan
            </Link>
          </div>
        </div>
      </section>

      {/* ADA Title II for Higher Ed */}
      <section className="border-b border-caso-border/50 bg-caso-navy-light px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              ADA Title II Applies to Public Universities
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-caso-slate">
              As state entities, public colleges and universities are covered
              under ADA Title II. All digital content — including every PDF on
              your website — must conform to WCAG 2.1 AA standards. The DOJ
              deadline for entities serving populations over 50,000 was April 24,
              2026. Smaller institutions have until April 26, 2027.
            </p>
          </div>
          <div className="mt-12 rounded-2xl border border-caso-border bg-caso-navy p-8">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
              Vendor Content Is Your Responsibility
            </h3>
            <p className="mt-3 leading-relaxed text-caso-slate">
              If a third-party vendor provides documents that are hosted on your
              university&apos;s website or LMS, your institution is responsible
              for ensuring those documents meet accessibility standards. This
              includes publisher content, contracted service providers, and
              embedded third-party materials. CASO Comply can remediate these
              documents regardless of their origin.
            </p>
          </div>
        </div>
      </section>

      {/* Scope of Content */}
      <section className="border-b border-caso-border/50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              The Scope of the Problem
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              Document accessibility in higher education spans every department,
              every course, and every public-facing page.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SCOPE_ITEMS.map((item) => (
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

      {/* Volume Challenge */}
      <section className="border-b border-caso-border/50 bg-caso-navy-light px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              Why Higher Ed Needs Automation
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              The volume and decentralization of university content makes manual
              remediation impractical.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {CHALLENGES.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-caso-border bg-caso-navy p-6"
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

      {/* How CASO Comply Helps */}
      <section className="border-b border-caso-border/50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              How CASO Comply Helps
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              Purpose-built for the scale and complexity of higher education
              document accessibility.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {HOW_WE_HELP.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-caso-border bg-caso-navy-light p-6"
              >
                <div className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-caso-slate">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Pricing Note */}
      <section className="border-b border-caso-border/50 bg-caso-navy-light px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            Volume Pricing for Higher Education
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-caso-slate">
            We offer bulk pricing designed for the scale of university document
            libraries. Whether you have 5,000 or 500,000 pages, we can build a
            remediation plan that fits your budget and timeline.
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-flex text-sm font-semibold text-caso-glacier transition-colors hover:text-caso-white"
          >
            View standard pricing &rarr;
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-caso-slate">
            Talk to our team about document accessibility for your institution.
            We will walk you through the process, pricing, and timeline.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
          >
            See How We Help Universities
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
