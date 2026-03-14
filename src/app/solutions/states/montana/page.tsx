import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title: "ADA & PDF Accessibility Compliance for Montana — CASO Comply",
  description:
    "Montana state law (MCA 18-5-601 through 18-5-605) requires accessible information technology for individuals with disabilities. Meet state and federal ADA Title II deadlines with CASO Comply.",
  openGraph: {
    title: "ADA & PDF Accessibility Compliance for Montana — CASO Comply",
    description:
      "Montana state law (MCA 18-5-601 through 18-5-605) requires accessible information technology for individuals with disabilities. Meet state and federal ADA Title II deadlines with CASO Comply.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/solutions/states/montana",
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
    title: "MCA 18-5-601 through 18-5-605 (HB 239)",
    description:
      "Montana's Information Technology Access Act, passed in 2001, requires state agencies to provide accessible information technology for individuals who are blind or visually impaired, including documents and web content.",
  },
  {
    title: "MCA 18-5-603 — Nonvisual Access Ensured",
    description:
      "Requires that technology procured by state agencies presents information in formats intended for both visual and nonvisual use, ensuring compatibility with screen readers and assistive devices.",
  },
  {
    title: "MCA 18-5-604 — Procurement Requirements",
    description:
      "Mandates that state contracts for information technology include a technology access clause, ensuring all procured systems and documents meet accessibility standards from day one.",
  },
  {
    title: "Montana SITSD Accessibility Standards",
    description:
      "The State Information Technology Services Division sets accessibility standards aligned with Section 508 and WCAG 2.1 AA for all state agency websites, applications, and digital content.",
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
    title: "Montana's IT Access Law Already Applies",
    description:
      "Unlike some states still catching up, Montana has had accessibility requirements on the books since 2001 under MCA 18-5-601. The federal ADA Title II deadline adds enforcement teeth to what Montana already expects. CASO Comply helps you meet both at once — state procurement requirements and federal WCAG 2.1 AA standards — without hiring specialized staff.",
  },
  {
    title: "Rural Agencies Need an Efficient Path",
    description:
      "Montana has some of the most geographically spread-out government operations in the country. County offices, health departments, and school districts across Big Sky Country don't have large IT teams. CASO Comply gives a one-person office the same remediation capability as a fully staffed department.",
  },
  {
    title: "Get Ahead of Federal Enforcement",
    description:
      "With Montana's existing state law plus the new federal rule, the compliance expectation is clear. CASO Comply automates the heavy lifting — structure tagging, alt text, reading order — so your team can focus on serving Montanans instead of manually fixing PDFs.",
  },
];

export default function MontanaSolutionPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="border-b border-caso-border/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-caso-glacier">
            Solutions for Montana
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Montana IT Access Law + ADA Title II Compliance
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-caso-slate md:text-xl">
            Montana has required accessible information technology since 2001
            under MCA 18-5-601, and the federal ADA Title II web rule now sets a
            hard deadline. Public-facing PDFs on state and local government
            websites need to be accessible — and CASO Comply makes that happen
            at scale instead of one document at a time.
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
              What Montana Already Requires
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              Montana was one of the earlier states to codify IT accessibility
              requirements. The federal deadline reinforces what the state has
              expected for over two decades.
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
              The Federal Clock Montana Is On
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              The DOJ&apos;s ADA Title II web rule defines &ldquo;web
              content&rdquo; to include documents posted on public websites —
              which puts PDFs squarely in scope for Montana agencies.
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
                Montana agencies serving populations of{" "}
                <span className="font-semibold text-caso-white">
                  50,000 or more
                </span>
              </p>
              <p className="mt-4 text-sm font-semibold text-red-400">
                This deadline has passed. Non-compliant agencies are now subject
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
                Smaller Montana entities and counties serving populations{" "}
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
              Why Montana Entities Choose CASO Comply
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
              A complete solution for Montana document accessibility — from
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
              href="/solutions/states/north-dakota"
              className="group rounded-xl border border-caso-border bg-caso-navy-light p-6 transition-colors hover:border-caso-blue/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue">
                North Dakota
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                Accessibility compliance for North Dakota state and local government entities.
              </p>
            </Link>
            <Link
              href="/solutions/states/nebraska"
              className="group rounded-xl border border-caso-border bg-caso-navy-light p-6 transition-colors hover:border-caso-blue/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue">
                Nebraska
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                NITC accessibility standards and ADA Title II compliance for Nebraska agencies.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            Start Your Montana Compliance Assessment
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
