import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title: "Enterprise Document Accessibility — CASO Comply",
  description:
    "Enterprise-grade document accessibility remediation with API integration, SOC 2 certification, and HIPAA compliance. Reduce legal risk and make your documents accessible at scale.",
  openGraph: {
    title: "Enterprise Document Accessibility — CASO Comply",
    description:
      "Enterprise-grade document accessibility remediation with API integration, SOC 2 certification, and HIPAA compliance. Reduce legal risk and make your documents accessible at scale.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/solutions/enterprise",
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

const USE_CASES = [
  {
    title: "Customer-Facing Documents",
    description:
      "Contracts, statements, invoices, product documentation, and terms of service. Any document your customers interact with must be accessible.",
  },
  {
    title: "Investor & Financial Materials",
    description:
      "Annual reports, prospectuses, earnings presentations, and SEC filings. Accessibility demonstrates ESG commitment and broadens your investor base.",
  },
  {
    title: "HR & Benefits Documentation",
    description:
      "Employee handbooks, benefits guides, onboarding materials, and training documents. ADA compliance applies to employment practices.",
  },
  {
    title: "Marketing Collateral",
    description:
      "Brochures, whitepapers, case studies, and sales materials. Inaccessible marketing excludes potential customers and creates legal exposure.",
  },
];

const LAWSUIT_STATS = [
  { stat: "4,600+", label: "ADA digital accessibility lawsuits filed in 2023" },
  {
    stat: "265%",
    label: "increase in accessibility lawsuits since 2017",
  },
  {
    stat: "$300K+",
    label: "average settlement cost for ADA digital lawsuits",
  },
];

const API_FEATURES = [
  "RESTful API with comprehensive documentation",
  "Webhook notifications for processing status",
  "Batch upload and retrieval endpoints",
  "SDKs for Python, Node.js, and Java",
  "Docker agent for on-premise deployment",
  "Custom processing rules and configuration",
];

const SECURITY_FEATURES = [
  {
    title: "SOC 2 Type II Certified",
    description:
      "Annual third-party audits verify our security controls meet the highest standards for data protection, availability, and confidentiality.",
  },
  {
    title: "HIPAA Compliant",
    description:
      "Secure processing for healthcare, insurance, and benefits documents. BAA available for covered entities and business associates.",
  },
  {
    title: "On-Premise Option",
    description:
      "Deploy our Docker agent on your own infrastructure. Documents never leave your network. Full processing capability with local-only data handling.",
  },
  {
    title: "Encryption at Rest and in Transit",
    description:
      "AES-256 encryption for stored documents. TLS 1.3 for all data in transit. Automatic deletion after processing with configurable retention.",
  },
];

export default function EnterpriseSolutionPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="border-b border-caso-border/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-caso-glacier">
            Solutions for Enterprise
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Enterprise Document Accessibility
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-caso-slate md:text-xl">
            Accessibility lawsuits against private companies have increased
            dramatically. Protect your organization with automated document
            remediation that integrates into your existing workflows.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Talk to Us About Enterprise Pricing
            </Link>
            <Link
              href="/demo"
              className="inline-flex rounded-xl border border-caso-border px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-navy-light"
            >
              See a Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ADA Title III */}
      <section className="border-b border-caso-border/50 bg-caso-navy-light px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              ADA Title III and Digital Accessibility
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-caso-slate">
              ADA Title III covers &ldquo;places of public accommodation&rdquo;
              — and courts have consistently ruled that this includes websites
              and digital content. Any business that serves the public faces
              potential liability for inaccessible documents.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {LAWSUIT_STATS.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-caso-border bg-caso-navy p-6 text-center"
              >
                <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-caso-blue md:text-4xl">
                  {item.stat}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-caso-slate">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="border-b border-caso-border/50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              Document Types We Remediate
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              Any document your organization publishes, shares, or distributes
              should be accessible.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {USE_CASES.map((item) => (
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

      {/* API Integration */}
      <section className="border-b border-caso-border/50 bg-caso-navy-light px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
                API Integration for Automated Workflows
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-caso-slate">
                Embed document remediation directly into your content management
                system, publishing pipeline, or document workflow. Documents are
                remediated automatically before they reach your customers.
              </p>
              <ul role="list" className="mt-8 space-y-3">
                {API_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-caso-border bg-caso-navy p-6">
              <div className="flex items-center gap-2 border-b border-caso-border/50 pb-4">
                <div className="h-3 w-3 rounded-full bg-red-500/60" aria-hidden="true" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" aria-hidden="true" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" aria-hidden="true" />
                <span className="ml-2 text-xs text-caso-slate">
                  api-example.sh
                </span>
              </div>
              <pre className="mt-4 overflow-x-auto text-sm leading-relaxed">
                <code className="text-caso-slate">
                  <span className="text-caso-glacier">curl</span> -X POST \{"\n"}
                  {"  "}https://api.casocomply.com/v1/remediate \{"\n"}
                  {"  "}-H <span className="text-green-400">&quot;Authorization: Bearer $API_KEY&quot;</span> \{"\n"}
                  {"  "}-F <span className="text-green-400">&quot;file=@document.pdf&quot;</span> \{"\n"}
                  {"  "}-F <span className="text-green-400">&quot;level=ai-verified&quot;</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="border-b border-caso-border/50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              Security and Compliance
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              Enterprise-grade security for sensitive documents. Your data is
              protected at every step.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {SECURITY_FEATURES.map((item) => (
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

      {/* Related Solutions */}
      <section className="border-t border-caso-border px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center font-[family-name:var(--font-display)] text-2xl font-bold">
            Solutions for Every Sector
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href="/solutions/government"
              className="group rounded-xl border border-caso-border bg-caso-navy-light p-6 transition-colors hover:border-caso-blue/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue">
                Government
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                ADA Title II compliance for state, county, and municipal agencies.
              </p>
            </Link>
            <Link
              href="/solutions/higher-education"
              className="group rounded-xl border border-caso-border bg-caso-navy-light p-6 transition-colors hover:border-caso-blue/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue">
                Higher Education
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                Section 508 and ADA compliance for universities and colleges.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            Ready to Discuss Enterprise Pricing?
          </h2>
          <p className="mt-4 text-lg text-caso-slate">
            Tell us about your document volume, security requirements, and
            integration needs. We will build a custom plan for your organization.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
          >
            Talk to Us About Enterprise Pricing
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
