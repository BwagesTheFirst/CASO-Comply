import MarketingLayout from "@/components/MarketingLayout";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Accessibility Audit & Compliance Checker — CASO Comply",
  description:
    "Run a comprehensive PDF accessibility audit across your entire website. CASO Comply's SiteScan crawler finds every PDF, checks compliance with WCAG 2.1 AA and Section 508, and delivers a prioritized remediation report.",
  openGraph: {
    title: "PDF Accessibility Audit & Compliance Checker — CASO Comply",
    description:
      "Run a comprehensive PDF accessibility audit across your entire website. CASO Comply's SiteScan crawler finds every PDF, checks compliance with WCAG 2.1 AA and Section 508, and delivers a prioritized remediation report.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/services/accessibility-audit",
  },
};

const AUDIT_INCLUDES = [
  {
    title: "Document Discovery",
    description:
      "Our SiteScan crawler traverses your entire website — following links, sitemaps, and navigation menus — to locate every PDF document hosted on your domain. No manual inventory needed.",
  },
  {
    title: "Structural Analysis",
    description:
      "Each PDF is analyzed for proper tag structure, heading hierarchy, reading order, and logical content flow. We identify documents that lack any tagging entirely versus those with partial or incorrect tagging.",
  },
  {
    title: "Content Evaluation",
    description:
      "We check for missing alt text on images, unlabeled form fields, improperly marked tables, missing document language, and absent bookmarks — every criterion that affects how assistive technologies interpret the document.",
  },
  {
    title: "Compliance Scoring",
    description:
      "Each document receives a compliance score from 0 to 100 based on how many accessibility criteria it meets. Scores are weighted by severity: critical issues like missing tags count more than minor omissions.",
  },
  {
    title: "Violation Cataloging",
    description:
      "Every specific violation is cataloged with its type, severity, page location, and the relevant WCAG success criterion. You get an itemized list of exactly what needs to be fixed, not a vague summary.",
  },
  {
    title: "Remediation Prioritization",
    description:
      "Documents are ranked by priority based on their compliance score, public visibility, and traffic. This lets you tackle the highest-impact documents first when resources are limited.",
  },
];

const CRAWLER_STEPS = [
  {
    step: "1",
    title: "Enter Your URL",
    description:
      "Provide your website's root URL. SiteScan begins by fetching your sitemap, then follows internal links to discover all pages and subdomains.",
  },
  {
    step: "2",
    title: "Automated Crawl",
    description:
      "The crawler visits every discoverable page, identifies linked PDF documents, and downloads each one for analysis. It respects robots.txt and rate-limits requests to avoid impacting your server.",
  },
  {
    step: "3",
    title: "AI-Powered Analysis",
    description:
      "Each PDF passes through our accessibility engine, which checks for tag structure, reading order, alt text, table headers, form labels, contrast, language settings, and bookmarks.",
  },
  {
    step: "4",
    title: "Report Delivery",
    description:
      "You receive a comprehensive audit report with an executive summary, document-level scores, prioritized violation lists, and recommended remediation steps — delivered within hours, not weeks.",
  },
];

const REPORT_SECTIONS = [
  {
    title: "Executive Summary",
    description:
      "A high-level overview of your document accessibility posture: total PDFs found, overall compliance rate, critical issues count, and estimated remediation effort. Designed for leadership and decision-makers.",
  },
  {
    title: "Document Inventory",
    description:
      "A complete catalog of every PDF discovered on your website, including file name, URL, page count, file size, and current compliance score. Sortable by any column for easy analysis.",
  },
  {
    title: "Violation Details",
    description:
      "For each document, a line-by-line breakdown of every accessibility violation found — categorized by type (structural, content, metadata) and severity (critical, major, minor).",
  },
  {
    title: "WCAG Criterion Mapping",
    description:
      "Each violation is mapped to the specific WCAG 2.1 AA success criterion it violates, so your compliance team can cross-reference against regulatory requirements and VPAT documentation.",
  },
  {
    title: "Remediation Roadmap",
    description:
      "A prioritized action plan that groups documents by remediation complexity and public impact. Includes estimated per-document remediation cost so you can budget accurately.",
  },
  {
    title: "Trend Tracking",
    description:
      "For organizations running recurring audits, we track compliance scores over time so you can measure progress, demonstrate improvement, and identify regression before it becomes a liability.",
  },
];

const COMPARISON = [
  {
    aspect: "Speed",
    manual:
      "A skilled accessibility specialist can manually audit 10-20 PDF pages per hour.",
    automated:
      "CASO Comply analyzes hundreds of documents per hour across your entire site.",
  },
  {
    aspect: "Cost",
    manual:
      "$50-150 per document for expert manual review, plus the cost of building the document inventory.",
    automated:
      "Free initial scan. Full audit reports start at a fraction of manual audit costs.",
  },
  {
    aspect: "Coverage",
    manual:
      "Typically limited to a sample of documents due to time and budget constraints.",
    automated:
      "Every PDF on your website is discovered and analyzed — no sampling, no gaps.",
  },
  {
    aspect: "Consistency",
    manual:
      "Results vary between auditors. Different specialists may flag different issues or apply criteria differently.",
    automated:
      "Identical criteria applied uniformly to every document. Reproducible results every time.",
  },
  {
    aspect: "Frequency",
    manual:
      "Annual or semi-annual audits are typical due to cost. New documents published between audits go unchecked.",
    automated:
      "Run on-demand or on a recurring schedule. Catch new documents as soon as they are published.",
  },
  {
    aspect: "Depth",
    manual:
      "Expert auditors catch nuanced issues that require human judgment — complex reading order, ambiguous alt text, contextual heading structure.",
    automated:
      "Excels at comprehensive, rules-based checks. Flags potential human-judgment issues for expert review.",
  },
];

export default function AccessibilityAuditPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="border-b border-caso-border/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            PDF Accessibility Audit
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-caso-slate md:text-xl">
            You cannot fix what you cannot see. CASO Comply&apos;s SiteScan
            crawler finds every PDF on your website, checks each one against
            WCAG 2.1 AA and Section 508 standards, and delivers a detailed
            compliance report — so you know exactly where you stand and what
            to prioritize.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/free-scan"
              className="inline-flex rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Run a Free Scan
            </Link>
            <Link
              href="/contact"
              className="inline-flex rounded-xl border border-caso-border px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-slate transition-all hover:border-caso-glacier hover:text-caso-white"
            >
              Request Full Audit
            </Link>
          </div>
        </div>
      </section>

      {/* What an Audit Includes */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="audit-includes"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="audit-includes"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            What a Document Accessibility Audit Includes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            Our audit goes beyond a simple pass/fail check. Every PDF is
            analyzed across multiple dimensions of accessibility compliance.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AUDIT_INCLUDES.map((item) => (
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

      {/* How SiteScan Works */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="how-sitescan-works"
      >
        <div className="mx-auto max-w-5xl">
          <h2
            id="how-sitescan-works"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            How SiteScan Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            From URL to audit report in four steps — no software to install, no
            documents to gather manually.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {CRAWLER_STEPS.map((step) => (
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

      {/* What the Report Covers */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="report-coverage"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="report-coverage"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            What the Audit Report Covers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            Your audit report is a complete compliance intelligence package —
            actionable data for your IT team and clear summaries for
            leadership.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {REPORT_SECTIONS.map((item) => (
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

      {/* Free Scan CTA */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="free-scan-cta"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="free-scan-cta"
            className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            Try it free — scan your website now
          </h2>
          <p className="mt-4 text-lg text-caso-slate">
            Our free scan crawls up to 25 pages on your website, identifies
            every linked PDF, and delivers a summary compliance report. No
            credit card, no commitment — just data about where your documents
            stand.
          </p>
          <div className="mt-10">
            <Link
              href="/free-scan"
              className="inline-flex rounded-xl bg-caso-blue-deep px-10 py-5 font-[family-name:var(--font-display)] text-xl font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Start Your Free Scan
            </Link>
          </div>
        </div>
      </section>

      {/* Manual vs Automated */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="comparison"
      >
        <div className="mx-auto max-w-5xl">
          <h2
            id="comparison"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            Manual Audit vs. Automated Audit
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            Manual accessibility audits have their place, but they are slow,
            expensive, and impossible to scale. Here is how the two approaches
            compare.
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
                      Factor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-caso-glacier"
                    >
                      Manual Audit
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-caso-glacier"
                    >
                      CASO Comply Automated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, index) => (
                    <tr
                      key={row.aspect}
                      className={
                        index < COMPARISON.length - 1
                          ? "border-b border-caso-border/50"
                          : ""
                      }
                    >
                      <td className="px-6 py-4 font-semibold">
                        {row.aspect}
                      </td>
                      <td className="px-6 py-4 text-sm text-caso-slate">
                        {row.manual}
                      </td>
                      <td className="px-6 py-4 text-sm text-caso-slate">
                        {row.automated}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-caso-slate">
            The ideal approach combines automated scanning for comprehensive
            coverage with targeted expert review for documents that require
            human judgment. CASO Comply supports both.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="bottom-cta"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="bottom-cta"
            className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            Know where you stand before the deadline
          </h2>
          <p className="mt-4 text-lg text-caso-slate">
            With ADA Title II deadlines approaching and Section 508
            requirements already in effect, the first step is understanding
            your current compliance posture. A CASO Comply audit gives you
            that clarity.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/free-scan"
              className="inline-flex rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Free Compliance Scan
            </Link>
            <Link
              href="/contact"
              className="inline-flex rounded-xl border border-caso-border px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-slate transition-all hover:border-caso-glacier hover:text-caso-white"
            >
              Schedule a Demo
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
                Once your audit identifies issues, our remediation service fixes
                them — from automated tagging to expert human review.
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
                Meet federal accessibility requirements with automated
                remediation, VPAT support, and compliance certificates.
              </p>
            </Link>
            <Link
              href="/services/bulk-remediation"
              className="group rounded-xl border border-caso-border bg-caso-navy-light p-6 transition-colors hover:border-caso-blue/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue">
                Bulk Remediation
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                Your audit found thousands of non-compliant PDFs? Our bulk
                pipeline remediates them all overnight.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
