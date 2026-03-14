import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title: "ADA & PDF Accessibility Compliance for South Dakota — CASO Comply",
  description:
    "South Dakota agencies must meet BIT web accessibility standards, Section 508 requirements, and the federal ADA Title II deadline. CASO Comply automates PDF remediation at scale.",
  openGraph: {
    title: "ADA & PDF Accessibility Compliance for South Dakota — CASO Comply",
    description:
      "South Dakota agencies must meet BIT web accessibility standards, Section 508 requirements, and the federal ADA Title II deadline. CASO Comply automates PDF remediation at scale.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/solutions/states/south-dakota",
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
    title: "BIT Online Accessibility Policy",
    description:
      "The South Dakota Bureau of Information and Telecommunications sets web development and design standards to provide an accessible web presence, ensuring the public has full access to government information and services.",
  },
  {
    title: "WCAG & Section 508 Compliance",
    description:
      "All newly built South Dakota state sites must meet Web Content Accessibility Guidelines (WCAG) and federal Section 508 standards. BIT enforces these requirements as part of the state's web development process.",
  },
  {
    title: "South Dakota Nondiscrimination Law",
    description:
      "No person can be denied the right to full and equal use of any public accommodation or public service in South Dakota because of disability — a principle that extends to digital government services.",
  },
  {
    title: "ADA Title II — Federal Overlay",
    description:
      "While South Dakota relies primarily on federal standards rather than a standalone state digital accessibility law, the DOJ's ADA Title II web rule now sets hard deadlines for all state and local government web content, including PDFs.",
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
    title: "Small Teams, Big Compliance Requirements",
    description:
      "South Dakota agencies often run lean IT teams. Manual PDF remediation isn't realistic when you're already stretched thin. CASO Comply automates the entire process — from finding inaccessible documents to fixing them — so your team can stay focused on core work.",
  },
  {
    title: "Cover Every County and School District",
    description:
      "South Dakota's 66 counties and 149 school districts all post PDFs on their websites. Even smaller entities fall under the April 2027 federal deadline. CASO Comply processes documents at scale so no entity gets left behind.",
  },
  {
    title: "No Accessibility Expertise Required",
    description:
      "Most South Dakota departments don't have WCAG or PDF/UA specialists on staff. CASO Comply applies the right structure, tags, and fixes automatically — so IT or Records can meet BIT standards and the federal deadline without hiring specialists.",
  },
];

export default function SouthDakotaSolutionPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="border-b border-caso-border/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-caso-glacier">
            Solutions for South Dakota
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            South Dakota Web Accessibility + ADA Title II Compliance
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-caso-slate md:text-xl">
            South Dakota&apos;s Bureau of Information and Telecommunications
            already requires state sites to meet WCAG and Section 508 standards.
            Now the federal ADA Title II rule adds enforceable deadlines for
            all state and local government web content — including PDFs. For
            South Dakota agencies running lean, CASO Comply automates document
            remediation so you can meet the deadlines without adding staff.
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
              What South Dakota Already Requires
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              South Dakota follows federal WCAG and Section 508 standards
              through its BIT accessibility policy. The federal ADA Title II
              rule now adds hard deadlines. CASO Comply automates compliance
              at scale.
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
              The Federal Clock South Dakota Is Following
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              The DOJ&apos;s ADA Title II web rule says &ldquo;web content&rdquo;
              includes documents posted on the site — which is why public-facing PDFs
              that are still in use are in scope.
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
                South Dakota agencies serving populations of{" "}
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
                Smaller South Dakota entities and special districts serving populations{" "}
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
              Why South Dakota Entities Choose CASO Comply
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
              A complete solution for South Dakota document accessibility — from discovery
              to remediation to ongoing compliance.
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
                ADA Title II compliance for North Dakota state and local government entities.
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
                Minnesota IT accessibility standards and ADA Title II compliance.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            Start Your South Dakota Compliance Assessment
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
