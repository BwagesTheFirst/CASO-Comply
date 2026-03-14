import MarketingLayout from "@/components/MarketingLayout";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulk PDF Remediation — Automated Document Remediation at Scale — CASO Comply",
  description:
    "Remediate thousands of PDFs overnight with CASO Comply's bulk document remediation pipeline. Automated parallel processing at $0.30-$0.85/page vs $5-15/page for manual remediation.",
  openGraph: {
    title: "Bulk PDF Remediation — Automated Document Remediation at Scale — CASO Comply",
    description:
      "Remediate thousands of PDFs overnight with CASO Comply's bulk document remediation pipeline. Automated parallel processing at $0.30-$0.85/page vs $5-15/page for manual remediation.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/services/bulk-remediation",
  },
};

const SCALE_CHALLENGES = [
  {
    title: "Government Agencies",
    volume: "5,000 – 50,000+ PDFs",
    description:
      "City, county, and state agencies accumulate thousands of documents over years — meeting minutes, budget reports, planning documents, ordinances, public notices. ADA Title II deadlines mean they all need to be accessible, and manual remediation at that volume is financially impossible.",
  },
  {
    title: "Universities",
    volume: "10,000 – 100,000+ PDFs",
    description:
      "Course catalogs, syllabi, research papers, administrative forms, financial aid documents, and campus publications. Higher education institutions face Section 508 obligations and face legal action when their document libraries are inaccessible.",
  },
  {
    title: "Healthcare Systems",
    volume: "2,000 – 30,000+ PDFs",
    description:
      "Patient-facing materials, benefit summaries, compliance documentation, and provider directories. HHS requires accessible health information, and the volume of documents in a typical health system makes manual remediation cost-prohibitive.",
  },
  {
    title: "Enterprise",
    volume: "1,000 – 500,000+ PDFs",
    description:
      "Annual reports, product documentation, HR policies, training materials, and customer-facing collateral. Large enterprises generate documents continuously, and ADA Title III litigation increasingly targets document accessibility.",
  },
];

const PIPELINE_FEATURES = [
  {
    title: "Containerized Processing",
    description:
      "Each document is processed in an isolated Docker container with dedicated CPU, memory, and GPU resources. This ensures consistent performance regardless of document complexity and prevents any single problematic file from affecting the rest of the batch.",
  },
  {
    title: "Parallel Execution",
    description:
      "Our infrastructure scales horizontally — processing dozens of documents simultaneously across distributed compute nodes. A batch of 1,000 documents that would take one machine 40 hours finishes in under 2 hours with parallel processing.",
  },
  {
    title: "Overnight Remediation",
    description:
      "Submit your batch before end of day and have fully remediated, validated documents waiting in the morning. Our pipeline runs 24/7 and automatically retries any document that encounters a processing issue.",
  },
  {
    title: "Intelligent Queuing",
    description:
      "Documents are analyzed and sorted by complexity before processing. Simple documents (text-only, well-structured) flow through fast paths while complex documents (scanned images, intricate tables, multi-column layouts) are routed to specialized processing pipelines.",
  },
  {
    title: "Automated Validation",
    description:
      "Every remediated document is automatically validated against PDF/UA using veraPDF before delivery. Documents that do not pass validation are flagged for secondary processing or expert review — you never receive a non-compliant output.",
  },
  {
    title: "Progress Monitoring",
    description:
      "Track your batch in real time through our dashboard. See how many documents are queued, in-progress, completed, and flagged. Download completed documents individually or wait for the full batch.",
  },
];

const PRICING_COMPARISON = [
  {
    method: "Manual Remediation Firm",
    perPage: "$5 – $15",
    for1000Pages: "$5,000 – $15,000",
    for10000Pages: "$50,000 – $150,000",
    turnaround: "4 – 12 weeks",
  },
  {
    method: "Freelance Specialist",
    perPage: "$3 – $8",
    for1000Pages: "$3,000 – $8,000",
    for10000Pages: "$30,000 – $80,000",
    turnaround: "6 – 16 weeks",
  },
  {
    method: "CASO Comply (Level 1)",
    perPage: "$0.30",
    for1000Pages: "$300",
    for10000Pages: "$3,000",
    turnaround: "Hours",
    highlighted: true,
  },
  {
    method: "CASO Comply (Level 2)",
    perPage: "$1.80",
    for1000Pages: "$1,800",
    for10000Pages: "$18,000",
    turnaround: "1 – 2 days",
    highlighted: true,
  },
];

const AUTOMATION_BENEFITS = [
  {
    title: "Consistency",
    manual:
      "Quality varies between remediators. A team of 10 specialists will produce 10 slightly different approaches to the same document.",
    automated:
      "Every document is processed with identical rules, identical validation, identical output quality. Consistency at any volume.",
  },
  {
    title: "Speed",
    manual:
      "An experienced remediator handles 30-50 pages per day. At 10,000 pages, that is 200-330 person-days — roughly a full year for one person.",
    automated:
      "CASO Comply processes 10,000 pages in hours, not months. The bottleneck shifts from labor to upload speed.",
  },
  {
    title: "Scalability",
    manual:
      "Scaling manual remediation means hiring more people, training them, and managing quality. Lead times grow as volume increases.",
    automated:
      "Processing 100 documents or 100,000 documents uses the same pipeline. Infrastructure scales automatically — no hiring, no training.",
  },
  {
    title: "Cost Predictability",
    manual:
      "Manual quotes vary based on document complexity, often with change orders mid-project. Final costs frequently exceed initial estimates by 30-50%.",
    automated:
      "Flat per-page pricing with volume discounts. The price you see is the price you pay. No surprises, no change orders.",
  },
  {
    title: "Ongoing Compliance",
    manual:
      "Manual remediation is a one-time fix. New documents published after the project are non-compliant again. Re-engagement means re-contracting.",
    automated:
      "Integrate CASO Comply into your document publishing workflow. New PDFs are automatically remediated before they reach your website.",
  },
];

const ENTERPRISE_FEATURES = [
  {
    title: "REST API Integration",
    description:
      "Integrate document remediation directly into your content management system, document workflow, or publishing pipeline. Submit documents programmatically and receive remediated versions via webhook or polling.",
  },
  {
    title: "Batch Upload Portal",
    description:
      "Upload hundreds or thousands of documents at once through our secure web portal. Drag-and-drop interface supports ZIP archives, folder structures, and individual file selection. Files are encrypted in transit and at rest.",
  },
  {
    title: "Real-Time Progress Tracking",
    description:
      "Monitor every batch through a live dashboard showing queue position, processing status, completion percentage, and any documents flagged for review. Export status reports for stakeholder updates.",
  },
  {
    title: "Custom Processing Rules",
    description:
      "Configure remediation settings per batch or per document type: specify heading detection rules, alt text generation preferences, table handling behavior, and output format requirements.",
  },
  {
    title: "Compliance Reporting",
    description:
      "Generate aggregate compliance reports across your entire document library. Track compliance rates over time, identify document categories with recurring issues, and demonstrate progress to auditors.",
  },
  {
    title: "Dedicated Account Management",
    description:
      "Enterprise customers receive a dedicated account manager who understands your document landscape, compliance requirements, and internal workflows. Priority support with guaranteed response times.",
  },
];

export default function BulkRemediationPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="border-b border-caso-border/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Bulk PDF Remediation at Scale
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-caso-slate md:text-xl">
            Your organization has thousands of PDFs that need to be accessible.
            Manual remediation would take months and cost hundreds of thousands
            of dollars. CASO Comply&apos;s automated pipeline remediates
            documents in parallel — turning a year-long project into an
            overnight job.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Get a Volume Quote
            </Link>
            <Link
              href="/free-scan"
              className="inline-flex rounded-xl border border-caso-border px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-slate transition-all hover:border-caso-glacier hover:text-caso-white"
            >
              Free Site Scan
            </Link>
          </div>
        </div>
      </section>

      {/* The Scale Problem */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="scale-problem"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="scale-problem"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            The Document Volume Problem
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            Organizations across every sector have accumulated massive PDF
            libraries over years of digital publishing. When compliance
            deadlines arrive, the scale of the challenge becomes clear.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {SCALE_CHALLENGES.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-caso-border bg-caso-navy-light p-8"
              >
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-caso-glacier">
                  Typical volume: {item.volume}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-caso-slate">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Bulk Processing Works */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="how-it-works"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="how-it-works"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            How Bulk Processing Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            Our infrastructure is purpose-built for high-volume document
            remediation — from containerized processing to automated quality
            validation.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PIPELINE_FEATURES.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-caso-border bg-caso-navy-light p-6"
              >
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-glacier">
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

      {/* Pricing at Scale */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="pricing-comparison"
      >
        <div className="mx-auto max-w-5xl">
          <h2
            id="pricing-comparison"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            The Cost Advantage at Scale
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            The economics of bulk remediation are dramatic. Automation does
            not just save time — it changes what is financially possible.
          </p>
          <div className="mt-12 overflow-hidden rounded-xl border border-caso-border bg-caso-navy-light">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-caso-border">
                    <th
                      scope="col"
                      className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-caso-glacier"
                    >
                      Method
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-caso-glacier"
                    >
                      Per Page
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-caso-glacier"
                    >
                      1,000 Pages
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-caso-glacier"
                    >
                      10,000 Pages
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-caso-glacier"
                    >
                      Turnaround
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING_COMPARISON.map((row, index) => (
                    <tr
                      key={row.method}
                      className={`${
                        index < PRICING_COMPARISON.length - 1
                          ? "border-b border-caso-border/50"
                          : ""
                      } ${row.highlighted ? "bg-caso-blue/5" : ""}`}
                    >
                      <td className="px-6 py-4 font-semibold">
                        {row.method}
                      </td>
                      <td className="px-6 py-4 text-sm text-caso-slate">
                        {row.perPage}
                      </td>
                      <td className="px-6 py-4 text-sm text-caso-slate">
                        {row.for1000Pages}
                      </td>
                      <td className="px-6 py-4 text-sm text-caso-slate">
                        {row.for10000Pages}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-caso-slate">
                        {row.turnaround}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-8 rounded-xl border border-caso-border bg-caso-navy-light p-8 text-center">
            <p className="font-[family-name:var(--font-display)] text-2xl font-bold">
              Save up to 98% compared to manual remediation
            </p>
            <p className="mt-2 text-caso-slate">
              A 10,000-page project that costs $150,000 with a manual firm
              costs $3,000 with CASO Comply Level 1 — and finishes in hours
              instead of months.
            </p>
          </div>
        </div>
      </section>

      {/* Automation vs Manual */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="automation-case"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="automation-case"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            The Case for Automation at Scale
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            Manual remediation works for small batches. At scale, automation
            is not just better — it is the only viable path.
          </p>
          <div className="mt-12 space-y-6">
            {AUTOMATION_BENEFITS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-caso-border bg-caso-navy-light p-8"
              >
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
                  {item.title}
                </h3>
                <div className="mt-4 grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-caso-slate">
                      Manual Approach
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-caso-slate">
                      {item.manual}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-caso-glacier">
                      CASO Comply
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-caso-slate">
                      {item.automated}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="enterprise-features"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="enterprise-features"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            Enterprise Features
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            Built for organizations that need document remediation integrated
            into their workflows, not bolted on as an afterthought.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ENTERPRISE_FEATURES.map((item) => (
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

      {/* CTA */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="cta-heading"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="cta-heading"
            className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            Ready to remediate at scale?
          </h2>
          <p className="mt-4 text-lg text-caso-slate">
            Tell us about your document volume and compliance timeline. We
            will provide a custom quote and a remediation plan that fits your
            budget and deadline.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Get a Volume Quote
            </Link>
            <Link
              href="/free-scan"
              className="inline-flex rounded-xl border border-caso-border px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-slate transition-all hover:border-caso-glacier hover:text-caso-white"
            >
              Free Site Scan
            </Link>
          </div>
        </div>
      </section>

      {/* Related Solutions */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center font-[family-name:var(--font-display)] text-2xl font-bold">
            Related Solutions
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/services/pdf-remediation"
              className="group rounded-xl border border-caso-border bg-caso-navy-light p-6 transition-colors hover:border-caso-blue/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue">
                PDF Remediation
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                Individual document remediation with three service tiers — from
                automated baseline to expert human review.
              </p>
            </Link>
            <Link
              href="/services/accessibility-audit"
              className="group rounded-xl border border-caso-border bg-caso-navy-light p-6 transition-colors hover:border-caso-blue/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue">
                Accessibility Audit
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                Discover how many documents need remediation before committing
                to a bulk project. SiteScan finds every PDF on your site.
              </p>
            </Link>
            <Link
              href="/services/section-508-compliance"
              className="group rounded-xl border border-caso-border bg-caso-navy-light p-6 transition-colors hover:border-caso-blue/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue">
                Section 508 Compliance
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                Federal agencies and contractors: meet Section 508 requirements
                with VPAT support and compliance certificates.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
