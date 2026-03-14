import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title: "ADA & PDF Accessibility Compliance for New York — CASO Comply",
  description:
    "New York's NYS-P08-005 policy and 2023 WCAG law (S.3114-A) require accessible documents. Meet ADA Title II deadlines with automated PDF remediation from CASO Comply.",
  openGraph: {
    title: "ADA & PDF Accessibility Compliance for New York — CASO Comply",
    description:
      "New York's NYS-P08-005 policy and 2023 WCAG law (S.3114-A) require accessible documents. Meet ADA Title II deadlines with automated PDF remediation from CASO Comply.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/solutions/states/new-york",
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

function AlertIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );
}

const STATE_LAWS = [
  {
    title: "NYS-P08-005 — Web Accessibility Policy",
    description:
      "The core statewide policy establishing minimum accessibility requirements for web-based information and applications developed, procured, maintained, or used by state entities — including documents delivered through websites.",
  },
  {
    title: "S.3114-A — 2023 WCAG Law",
    description:
      "State Technology Law amendment requiring state agencies to conform websites to the most current WCAG standard. Effective mid-2024, departments are now being told WCAG 2.2 AA going forward.",
  },
  {
    title: "NYSED Web Accessibility Policy",
    description:
      "NYSED spells it out: any documents, web-based information, and applications must comply — and NYSED will QA the documents before accepting them. PDFs are explicitly in scope.",
  },
  {
    title: "NYC Digital Accessibility (MOPD)",
    description:
      "New York City adopted WCAG 2.1 AA in 2021 and applies it to digital content, covering city agencies, BOE, and NYC-funded programs.",
  },
  {
    title: "SUNY / CUNY Accessibility Requirements",
    description:
      "SUNY and CUNY explicitly reference NYS-P08-005 and require web-based information to be accessible. SUNY notes this applies to documents, not just web pages.",
  },
];

const HOW_WE_HELP = [
  {
    title: "SiteScan Document Inventory",
    description:
      "Automated crawling of your entire web presence to identify every PDF, Word document, and spreadsheet. Know the full scope of your compliance gap in hours, not months.",
  },
  {
    title: "Automated Remediation at Scale",
    description:
      "AI-powered remediation processes thousands of documents per day. Structure tagging, alt text generation, reading order correction, and metadata cleanup — all automated.",
  },
  {
    title: "Certificate of Compliance",
    description:
      "Every remediated document receives a verifiable compliance certificate with before-and-after scoring. Audit-ready documentation for DOJ inquiries.",
  },
  {
    title: "Ongoing Monitoring",
    description:
      "New documents are scanned automatically as they are published. Stay compliant as your content library grows.",
  },
];

const THREE_REASONS = [
  {
    title: "Clear the PDF Backlog Fast",
    description:
      "NY agencies, SUNY/CUNY campuses, school districts, and authorities have years of PDFs online — FOIL forms, program brochures, policy memos, RFPs, board minutes, and school notices. NYS-P08-005 and the 2023 WCAG bill say these have to be accessible. CASO Comply automates it so you can bring older, still-used PDFs into compliance without adding staff.",
  },
  {
    title: "Stay Compliant on Every New Upload",
    description:
      "Even if you clean up the old stuff, next week someone will post another PDF to ny.gov, an agency microsite, a school portal, or a SUNY/CUNY site. CASO Comply gives you a repeatable way to make new public-facing documents accessible at publish time, so you don't drift out of compliance again.",
  },
  {
    title: "No Accessibility Expertise Required",
    description:
      "New York's policy is a hybrid of Section 508 and WCAG — and now the federal rule says WCAG 2.1 AA — which is more than most content owners in Albany, NYC, or school districts can do by hand. CASO Comply bakes in tagging, reading order, alt text, and structure so IT or Communications can meet the 2026 and 2027 dates without hiring PDF/UA specialists.",
  },
];

export default function NewYorkSolutionPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="border-b border-caso-border/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-caso-glacier">
            Solutions for New York
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            NYS-P08-005 &amp; ADA Title II Compliance for New York
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-caso-slate md:text-xl">
            New York already has a statewide accessibility policy — NYS-P08-005
            — that requires state entities to make web-based information
            accessible. In 2023, NY doubled down with S.3114-A, requiring
            conformance to the current WCAG standard. Now add the federal ADA
            Title II web rule: for most NY entities serving 50,000+ people,
            public-facing PDFs need to be accessible by April 24, 2026. CASO
            Comply lets you fix those in minutes instead of doing them one by
            one.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/free-scan"
              className="inline-flex rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Free Compliance Assessment
            </Link>
            <Link
              href="/resources/ada-title-ii-guide"
              className="inline-flex rounded-xl border border-caso-border px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-navy-light"
            >
              ADA Title II Guide
            </Link>
          </div>
        </div>
      </section>

      {/* State Law */}
      <section className="border-b border-caso-border/50 bg-caso-navy-light px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              What New York Already Requires
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              New York has already told agencies, SUNY/CUNY, and schools that
              documents and applications must meet WCAG — CASO Comply lets you
              do that for hundreds or thousands of PDFs at once.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {STATE_LAWS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-caso-border bg-caso-navy p-6"
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

      {/* Federal Deadline */}
      <section className="border-b border-caso-border/50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              The Federal Clock New York Is Following
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              New York&apos;s 2023 updates line right up with the DOJ&apos;s ADA
              Title II rule. &ldquo;Web content&rdquo; includes documents posted
              on the site — that is exactly the PDFs living on ny.gov, agency
              sites, and school portals.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-red-500/30 bg-caso-navy-light p-8">
              <p className="text-sm font-bold uppercase tracking-widest text-red-400">
                Deadline Passed
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold md:text-3xl">
                April 24, 2026
              </p>
              <p className="mt-2 text-caso-slate">
                NY state agencies, authorities, SUNY/CUNY units, and larger
                school districts serving{" "}
                <span className="font-semibold text-caso-white">
                  50,000 or more
                </span>
              </p>
              <p className="mt-4 text-sm font-semibold text-red-400">
                This deadline has passed. Non-compliant entities are now subject
                to enforcement.
              </p>
            </div>
            <div className="rounded-2xl border border-caso-border bg-caso-navy-light p-8">
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
                Approaching
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold md:text-3xl">
                April 26, 2027
              </p>
              <p className="mt-2 text-caso-slate">
                Smaller NY entities, school districts, and towns serving
                populations{" "}
                <span className="font-semibold text-caso-white">
                  under 50,000
                </span>
              </p>
              <p className="mt-4 text-sm text-caso-slate">
                Approximately 13 months remain to achieve full compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Reasons */}
      <section className="border-b border-caso-border/50 bg-caso-navy-light px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              Why New York Entities Choose CASO Comply
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {THREE_REASONS.map((item) => (
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
              A complete solution for New York document accessibility — from
              discovery to remediation to ongoing compliance.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {HOW_WE_HELP.map((item) => (
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
                ADA Title II compliance for all state and local government agencies.
              </p>
            </Link>
            <Link
              href="/solutions/states/illinois"
              className="group rounded-xl border border-caso-border bg-caso-navy-light p-6 transition-colors hover:border-caso-blue/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue">
                Illinois
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                IITAA 2.1 and ADA Title II compliance for Illinois public entities.
              </p>
            </Link>
            <Link
              href="/solutions/states/minnesota"
              className="group rounded-xl border border-caso-border bg-caso-navy-light p-6 transition-colors hover:border-caso-blue/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue">
                Minnesota
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                MNIT WCAG 2.1 AA standards and ADA compliance for Minnesota entities.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            Start Your New York Compliance Assessment
          </h2>
          <p className="mt-4 text-lg text-caso-slate">
            Find out how many inaccessible documents are on your website. Our
            free SiteScan identifies every PDF and document that needs
            remediation.
          </p>
          <Link
            href="/free-scan"
            className="mt-8 inline-flex rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
          >
            Schedule a Compliance Assessment
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
