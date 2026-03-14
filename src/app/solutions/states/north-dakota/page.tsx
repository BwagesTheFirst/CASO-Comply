import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title: "ADA & PDF Accessibility Compliance for North Dakota — CASO Comply",
  description:
    "North Dakota state portals already point to WCAG and Section 508 for published content. Meet ADA Title II deadlines with automated PDF remediation from CASO Comply.",
  openGraph: {
    title: "ADA & PDF Accessibility Compliance for North Dakota — CASO Comply",
    description:
      "North Dakota state portals already point to WCAG and Section 508 for published content. Meet ADA Title II deadlines with automated PDF remediation from CASO Comply.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/solutions/states/north-dakota",
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
    title: "ND.gov Accessibility Policy",
    description:
      "The state site complies with all priority 1 and 2 guidelines of the W3C WCAG and is Section 508 approved — the statewide tone-setter for accessible digital content.",
  },
  {
    title: "North Dakota OMB Accessibility Standards",
    description:
      "OMB is working toward WCAG 2.2 AA and actively scanning with accessibility-checking software, demonstrating that the state tests and monitors compliance.",
  },
  {
    title: "NDIT Accessibility Monitoring",
    description:
      "The state uses tooling to monitor accessibility on the statewide platform, with documents and content in scope — not just HTML pages.",
  },
  {
    title: "Agency Accessibility Statements (SOS, DOT, Legislature)",
    description:
      "Multiple ND agencies publish accessibility statements committing to WCAG and Section 508, showing that buyers already expect vendors to support accessible documents.",
  },
  {
    title: "UND Digital Accessibility Guidance",
    description:
      "The University of North Dakota states it directly: accessibility is essential in every PDF — not just for web pages, but for every document published online.",
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
      "ND agencies, cities, and school districts already have years of council minutes, board agendas, reports, program descriptions, and parent materials posted as PDFs. Manually remediating those is slow and expensive. CASO Comply automates it so you can bring older, still-used PDFs into compliance without adding staff.",
  },
  {
    title: "Stay Compliant on Every New Upload",
    description:
      "Even if you clean up the old stuff, next week someone will post another PDF on nd.gov, the school site, or the city portal. CASO Comply gives you a repeatable way to make new public-facing documents accessible right when you publish, so you don't drift out of compliance again.",
  },
  {
    title: "No Accessibility Expertise Required",
    description:
      "Most ND entities don't have an in-house WCAG or PDF/UA person. CASO Comply bakes that in — it applies the right tags, reading order, and structure — so IT, Communications, or the business office can meet the 2026 and 2027 federal dates without hiring specialists.",
  },
];

export default function NorthDakotaSolutionPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="border-b border-caso-border/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-caso-glacier">
            Solutions for North Dakota
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            WCAG &amp; Section 508 Compliance for North Dakota
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-caso-slate md:text-xl">
            North Dakota already publishes accessibility expectations on its
            state portals that point to WCAG and Section 508 — not just for web
            pages, but for the content they publish. With the DOJ&apos;s ADA
            Title II web rule, most ND state and local entities serving 50,000+
            people will need their public-facing PDFs to meet WCAG 2.1 AA by
            April 24, 2026. CASO Comply lets them fix those in minutes instead
            of doing them one by one.
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
              What North Dakota Already Requires
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              North Dakota is already telling agencies and schools to meet WCAG
              and Section 508 — including for documents and PDFs. CASO Comply
              lets them do it at scale.
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
              The Federal Clock North Dakota Is Following
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              The DOJ&apos;s ADA Title II rule says &ldquo;web content&rdquo;
              includes documents posted on the site. Public-facing PDFs that are
              still in use are in scope — old or archived PDFs can be excepted.
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
                ND agencies and cities serving populations of{" "}
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
                Smaller ND jurisdictions and special districts serving populations{" "}
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
              Why North Dakota Entities Choose CASO Comply
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
              A complete solution for North Dakota document accessibility — from
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
            <Link
              href="/solutions/states/south-carolina"
              className="group rounded-xl border border-caso-border bg-caso-navy-light p-6 transition-colors hover:border-caso-blue/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue">
                South Carolina
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                Digital accessibility compliance for South Carolina public entities.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            Start Your North Dakota Compliance Assessment
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
