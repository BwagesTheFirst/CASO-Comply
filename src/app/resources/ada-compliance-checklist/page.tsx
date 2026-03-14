import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title:
    "ADA Title II Compliance Checklist for Local Government Documents | CASO Comply",
  description:
    "Actionable ADA Title II compliance checklist for state and local governments. Step-by-step document accessibility checklist covering inventory, remediation priorities, technical requirements, and ongoing maintenance before the April 2026 deadline.",
  keywords:
    "ADA Title II compliance checklist, ADA compliance checklist for local government, document accessibility checklist, ADA Title II deadline 2026, government PDF compliance, WCAG 2.1 AA checklist",
  openGraph: {
    title:
      "ADA Title II Compliance Checklist for Local Government Documents | CASO Comply",
    description:
      "Actionable ADA Title II compliance checklist for state and local governments. Step-by-step guide covering document inventory, remediation, and ongoing maintenance.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/resources/ada-compliance-checklist",
  },
};

const TOC_ITEMS = [
  { id: "pre-compliance-assessment", label: "Pre-Compliance Assessment" },
  { id: "document-inventory", label: "Document Inventory Checklist" },
  { id: "remediation-priorities", label: "Remediation Priority Checklist" },
  { id: "technical-compliance", label: "Technical Compliance Checklist" },
  { id: "forms-and-interactive", label: "Forms and Interactive Content" },
  { id: "validation-and-testing", label: "Validation and Testing" },
  { id: "ongoing-maintenance", label: "Ongoing Compliance Maintenance" },
  { id: "deadline-awareness", label: "Deadline Awareness" },
];

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-caso-blue/40 bg-caso-blue/10">
        <svg
          className="h-3.5 w-3.5 text-caso-blue"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span className="text-sm text-caso-slate leading-relaxed">{children}</span>
    </li>
  );
}

export default function ADAComplianceChecklistPage() {
  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "ADA Title II Compliance Checklist for Local Government Documents",
            description: "Actionable ADA Title II compliance checklist for state and local governments covering document inventory, remediation priorities, technical requirements, and ongoing maintenance.",
            author: { "@type": "Organization", name: "CASO Comply" },
            publisher: { "@type": "Organization", name: "CASO Comply", url: "https://casocomply.com" },
            datePublished: "2025-03-01",
            dateModified: "2026-03-14",
          }),
        }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-caso-blue/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-caso-teal">
            Resources
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            ADA Compliance{" "}
            <span className="text-caso-blue">Checklist</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-caso-slate">
            A practical, actionable checklist for state and local governments
            working toward ADA Title II document compliance. Use this as your
            roadmap from initial assessment through ongoing maintenance.
          </p>
          <p className="mt-4 text-sm text-caso-slate">
            Last updated: March 2026
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="border-y border-caso-border/50 bg-caso-navy-light/30 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Table of contents">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold">
              Table of Contents
            </h2>
            <ol className="mt-4 space-y-2">
              {TOC_ITEMS.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-caso-glacier transition-colors hover:text-caso-blue"
                  >
                    {i + 1}. {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* Content */}
      <article className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          {/* Section 1 */}
          <section id="pre-compliance-assessment" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              1. Pre-Compliance Assessment
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                Before you can fix your documents, you need to understand where
                you stand. This initial assessment phase establishes the scope of
                the work and helps you plan resources and timelines.
              </p>
            </div>

            <div className="mt-8 rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Organizational Readiness
              </h3>
              <ul className="mt-4 space-y-3">
                <CheckItem>
                  <strong className="text-caso-white">Determine your deadline.</strong>{" "}
                  Entities serving 50,000+ residents must comply by April 24, 2026.
                  Entities serving fewer than 50,000 must comply by April 26, 2027.
                  Use Census data to confirm your population tier.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Assign a compliance lead.</strong>{" "}
                  Designate a person or team responsible for overseeing document
                  accessibility. This should be someone with authority to allocate
                  budget and coordinate across departments.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Establish a budget.</strong>{" "}
                  Estimate costs based on your document volume. AI-powered
                  remediation typically costs $0.30-$0.85 per page. Manual
                  remediation averages $5-$15 per page. Factor in validation,
                  training, and ongoing maintenance costs.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Identify all departments that publish documents.</strong>{" "}
                  Documents come from across the organization — finance, public
                  works, planning, parks, human resources, the clerk&apos;s
                  office, and more. Each department is a potential source of
                  non-compliant content.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Review your website architecture.</strong>{" "}
                  Understand where documents are hosted — your main CMS, separate
                  portals, third-party platforms, board meeting systems, or
                  archived sites. All publicly accessible documents must be
                  compliant.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Check existing contracts.</strong>{" "}
                  If you use third-party vendors for document creation (agenda
                  management, financial reporting, GIS mapping), review their
                  accessibility capabilities. Vendor-generated documents are your
                  responsibility.
                </CheckItem>
              </ul>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 2 */}
          <section id="document-inventory" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              2. Document Inventory Checklist
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                A complete inventory of your publicly available documents is the
                foundation of your compliance effort. You cannot remediate what
                you have not identified.
              </p>
            </div>

            <div className="mt-8 rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Inventory Steps
              </h3>
              <ul className="mt-4 space-y-3">
                <CheckItem>
                  <strong className="text-caso-white">Crawl your entire website.</strong>{" "}
                  Use a web crawler to discover every document linked from your
                  site. This includes PDFs, Word docs, Excel files, and
                  PowerPoint presentations. A manual review will miss documents
                  buried deep in your site structure.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Check all subdomains and microsites.</strong>{" "}
                  Many governments operate multiple web properties — a main site,
                  a parks portal, a utilities site, a transparency portal. Each
                  must be inventoried separately.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Include third-party hosted documents.</strong>{" "}
                  Documents hosted on platforms like Issuu, Scribd, Google Drive,
                  or Dropbox that are linked from your website are covered by the
                  rule.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Catalog document metadata.</strong>{" "}
                  For each document, record the URL, file type, page count,
                  department of origin, date published, and last modified date.
                  This metadata is critical for prioritization.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Run initial accessibility scans.</strong>{" "}
                  Use automated tools to test each document for basic
                  accessibility — is it tagged? Does it have a title? Is the
                  language set? This gives you a quick severity assessment for
                  every document.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Count and categorize.</strong>{" "}
                  How many total documents? How many are PDFs? How many are
                  scanned images (zero accessibility)? How many have some tags
                  but are incomplete? How many are fully compliant? These numbers
                  define the scope of your project.
                </CheckItem>
              </ul>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 3 */}
          <section id="remediation-priorities" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              3. Remediation Priority Checklist
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                With thousands of documents to remediate, prioritization is
                essential. Not all documents carry equal risk or serve equal
                purpose. Focus your initial efforts where they matter most.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-2xl border border-caso-red/50 bg-caso-red/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Priority 1 — Immediate
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  High-Traffic, High-Impact Documents
                </h3>
                <ul className="mt-4 space-y-3">
                  <CheckItem>
                    <strong className="text-caso-white">Budget documents and financial reports</strong> —
                    Among the most frequently accessed government documents,
                    often legally required to be publicly available.
                  </CheckItem>
                  <CheckItem>
                    <strong className="text-caso-white">Meeting agendas and minutes</strong> —
                    Regularly published documents with high public interest.
                    Boards, councils, and commissions generate these weekly or
                    monthly.
                  </CheckItem>
                  <CheckItem>
                    <strong className="text-caso-white">Applications, permits, and forms</strong> —
                    Documents that residents must use to access government
                    services. Inaccessible forms directly prevent participation.
                  </CheckItem>
                  <CheckItem>
                    <strong className="text-caso-white">Emergency and public safety documents</strong> —
                    Emergency plans, public health notices, and safety
                    information must be accessible to all residents.
                  </CheckItem>
                </ul>
              </div>

              <div className="rounded-2xl border border-caso-warm/50 bg-caso-warm/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-caso-warm">
                  Priority 2 — High
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Legally Required and Frequently Accessed
                </h3>
                <ul className="mt-4 space-y-3">
                  <CheckItem>
                    <strong className="text-caso-white">Ordinances and municipal codes</strong> —
                    Legal documents that affect residents&apos; rights and
                    obligations.
                  </CheckItem>
                  <CheckItem>
                    <strong className="text-caso-white">Comprehensive plans and land use documents</strong> —
                    Planning documents with high public interest, especially
                    during public comment periods.
                  </CheckItem>
                  <CheckItem>
                    <strong className="text-caso-white">Policy documents and procedures</strong> —
                    Internal policies that affect public services and employee
                    operations.
                  </CheckItem>
                  <CheckItem>
                    <strong className="text-caso-white">Annual reports and performance metrics</strong> —
                    Transparency documents that the public and media frequently
                    access.
                  </CheckItem>
                </ul>
              </div>

              <div className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-caso-glacier">
                  Priority 3 — Standard
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Remaining Active Documents
                </h3>
                <ul className="mt-4 space-y-3">
                  <CheckItem>
                    <strong className="text-caso-white">Historical documents still published online</strong> —
                    Past meeting minutes, archived reports, and legacy content
                    still accessible on your website.
                  </CheckItem>
                  <CheckItem>
                    <strong className="text-caso-white">Newsletters and communications</strong> —
                    Public-facing communications, press releases, and informational
                    materials.
                  </CheckItem>
                  <CheckItem>
                    <strong className="text-caso-white">Training materials and presentations</strong> —
                    Internal and external training content published online.
                  </CheckItem>
                </ul>
              </div>

              <div className="mt-6 rounded-xl border border-caso-teal/30 bg-caso-teal/5 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Consider Removal
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Before remediating every document, ask whether each one still
                  needs to be publicly available. Outdated documents, superseded
                  policies, and content with no current relevance may be better
                  removed than remediated. Every document you remove is one fewer
                  you need to fix and maintain. However, ensure removal does not
                  violate records retention requirements.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 4 */}
          <section id="technical-compliance" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              4. Technical Compliance Checklist
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                Each document must meet these technical requirements to conform
                to WCAG 2.1 AA and PDF/UA standards. Use this checklist to verify
                every remediated document.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Document Structure
                </h3>
                <ul className="mt-4 space-y-3">
                  <CheckItem>
                    Document is tagged (not an untagged or image-only PDF).
                  </CheckItem>
                  <CheckItem>
                    All content is within the tag tree or marked as an artifact.
                  </CheckItem>
                  <CheckItem>
                    Headings are tagged with H1-H6 in a logical hierarchy (no
                    skipped levels).
                  </CheckItem>
                  <CheckItem>
                    Paragraphs are tagged with P tags.
                  </CheckItem>
                  <CheckItem>
                    Lists are tagged with L, LI, Lbl, and LBody elements.
                  </CheckItem>
                  <CheckItem>
                    Reading order matches the logical visual flow of the document.
                  </CheckItem>
                </ul>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Images and Visual Content
                </h3>
                <ul className="mt-4 space-y-3">
                  <CheckItem>
                    Every meaningful image has descriptive alt text that conveys
                    the same information as the image.
                  </CheckItem>
                  <CheckItem>
                    Decorative images are marked as artifacts (not tagged as
                    Figures).
                  </CheckItem>
                  <CheckItem>
                    Charts and graphs have alt text that describes the data, not
                    just the chart type.
                  </CheckItem>
                  <CheckItem>
                    Complex images have extended descriptions where needed.
                  </CheckItem>
                  <CheckItem>
                    Information is not conveyed by color alone.
                  </CheckItem>
                </ul>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Tables
                </h3>
                <ul className="mt-4 space-y-3">
                  <CheckItem>
                    Tables are tagged with Table, TR, TH, and TD elements.
                  </CheckItem>
                  <CheckItem>
                    Header cells use TH tags with appropriate Scope attributes.
                  </CheckItem>
                  <CheckItem>
                    Complex tables with merged cells have Headers attributes
                    linking data cells to their headers.
                  </CheckItem>
                  <CheckItem>
                    Layout tables (used for positioning, not data) are avoided;
                    if present, they are not tagged as Table elements.
                  </CheckItem>
                </ul>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Metadata and Properties
                </h3>
                <ul className="mt-4 space-y-3">
                  <CheckItem>
                    Document title is set to a meaningful, descriptive title (not
                    a filename).
                  </CheckItem>
                  <CheckItem>
                    DisplayDocTitle is set to true.
                  </CheckItem>
                  <CheckItem>
                    Document language is set (e.g., &quot;en&quot; for English).
                  </CheckItem>
                  <CheckItem>
                    PDF/UA identifier is present in XMP metadata.
                  </CheckItem>
                  <CheckItem>
                    All fonts are embedded with Unicode mappings.
                  </CheckItem>
                </ul>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Navigation
                </h3>
                <ul className="mt-4 space-y-3">
                  <CheckItem>
                    Bookmarks are present for documents longer than a few pages.
                  </CheckItem>
                  <CheckItem>
                    Bookmarks mirror the document&apos;s heading structure.
                  </CheckItem>
                  <CheckItem>
                    Hyperlinks have descriptive text (not &quot;click here&quot;
                    or bare URLs).
                  </CheckItem>
                  <CheckItem>
                    Tab order follows the document structure.
                  </CheckItem>
                </ul>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Visual Design
                </h3>
                <ul className="mt-4 space-y-3">
                  <CheckItem>
                    Text has a contrast ratio of at least 4.5:1 against its
                    background (3:1 for large text).
                  </CheckItem>
                  <CheckItem>
                    Color is not the sole means of conveying information.
                  </CheckItem>
                  <CheckItem>
                    Text is actual text, not images of text (with limited
                    exceptions for logos).
                  </CheckItem>
                </ul>
              </div>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 5 */}
          <section id="forms-and-interactive" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              5. Forms and Interactive Content
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                Interactive PDF forms — applications, permits, surveys,
                registrations — have additional accessibility requirements beyond
                static documents. If your organization publishes fillable PDFs,
                every form must meet these criteria.
              </p>
            </div>

            <div className="mt-8 rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Form Accessibility Checklist
              </h3>
              <ul className="mt-4 space-y-3">
                <CheckItem>
                  Every form field has a descriptive label that a screen reader
                  can announce.
                </CheckItem>
                <CheckItem>
                  Required fields are identified programmatically, not just
                  visually (e.g., not just a red asterisk).
                </CheckItem>
                <CheckItem>
                  Tab order follows the logical sequence of the form (top to
                  bottom, left to right for multi-column layouts).
                </CheckItem>
                <CheckItem>
                  Radio buttons and checkboxes are properly grouped with group
                  labels.
                </CheckItem>
                <CheckItem>
                  Dropdown menus have descriptive labels and all options are
                  accessible.
                </CheckItem>
                <CheckItem>
                  Submit and reset buttons have descriptive names.
                </CheckItem>
                <CheckItem>
                  Form validation provides clear, specific error messages that
                  identify what needs to be corrected.
                </CheckItem>
                <CheckItem>
                  Tooltips or help text is programmatically associated with
                  their form fields.
                </CheckItem>
              </ul>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 6 */}
          <section id="validation-and-testing" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              6. Validation and Testing
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                Remediation is only complete when a document passes validation.
                Use this checklist to verify every document before publishing.
              </p>
            </div>

            <div className="mt-8 rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Validation Checklist
              </h3>
              <ul className="mt-4 space-y-3">
                <CheckItem>
                  <strong className="text-caso-white">Run veraPDF or PAC validation</strong> —
                  Every remediated document should pass PDF/UA-1 validation with
                  zero failures.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Run Adobe Acrobat accessibility check</strong> —
                  Use as a supplementary check. Address any issues flagged.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Test with a screen reader</strong> —
                  Listen to a sample of remediated documents with NVDA, JAWS, or
                  VoiceOver. Verify that the reading order makes sense, headings
                  are navigable, and table headers announce correctly.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Review alt text quality</strong> —
                  Automated tools check that alt text exists but cannot evaluate
                  quality. Manually review alt text on images, charts, and
                  diagrams to ensure it conveys the same information as the visual.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Verify color contrast</strong> —
                  Spot-check text contrast, especially in documents with colored
                  backgrounds, branded headers, or watermarks.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Document the results</strong> —
                  Maintain a compliance log for each document showing the
                  validation tool used, date tested, and results. This creates an
                  auditable record of your compliance efforts.
                </CheckItem>
              </ul>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 7 */}
          <section id="ongoing-maintenance" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              7. Ongoing Compliance Maintenance
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                Compliance is not a one-time project. Every new document
                published to your website must be accessible from day one, and
                your existing library must be monitored for regression. Build
                these practices into your operations.
              </p>
            </div>

            <div className="mt-8 rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Maintenance Checklist
              </h3>
              <ul className="mt-4 space-y-3">
                <CheckItem>
                  <strong className="text-caso-white">Train staff on accessible document creation.</strong>{" "}
                  Every person who creates or publishes documents needs to
                  understand accessibility basics — using heading styles, adding
                  alt text in Word before exporting to PDF, running accessibility
                  checks before publishing.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Establish a publishing workflow.</strong>{" "}
                  No document goes live without passing an accessibility check.
                  Build this gate into your CMS or publishing process.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Schedule periodic audits.</strong>{" "}
                  Re-crawl your website quarterly to identify new documents that
                  may have been published without accessibility review. Catch
                  gaps before a complainant or the DOJ does.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Update vendor requirements.</strong>{" "}
                  Require all vendors who produce documents for your organization
                  to deliver accessible content. Include WCAG 2.1 AA and PDF/UA
                  conformance in procurement specifications.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Monitor regulatory changes.</strong>{" "}
                  Accessibility standards evolve. WCAG 2.2 has been published,
                  and future regulatory updates may adopt it. Stay informed about
                  changes that could affect your compliance obligations.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Maintain a remediation log.</strong>{" "}
                  Track which documents have been remediated, when, by whom, and
                  what validation results were obtained. This log is your primary
                  defense in any enforcement inquiry.
                </CheckItem>
                <CheckItem>
                  <strong className="text-caso-white">Designate a complaint response process.</strong>{" "}
                  Have a documented process for responding to accessibility
                  complaints. Prompt, good-faith response to complaints
                  significantly reduces legal risk.
                </CheckItem>
              </ul>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 8 */}
          <section id="deadline-awareness" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              8. Deadline Awareness
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                The ADA Title II rule established firm compliance deadlines with
                no extension mechanism. Understanding your timeline is critical
                for planning and resource allocation.
              </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-caso-red/50 bg-caso-red/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Deadline 1
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-black text-caso-white">
                  April 24, 2026
                </p>
                <p className="mt-2 text-sm text-caso-slate">
                  Entities serving{" "}
                  <strong className="text-caso-white">50,000+ residents</strong>.
                </p>
                <p className="mt-4 rounded-lg bg-caso-red/10 px-3 py-2 text-xs font-semibold text-red-400">
                  Less than 2 months away
                </p>
              </div>
              <div className="rounded-2xl border border-caso-warm/50 bg-caso-warm/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-caso-warm">
                  Deadline 2
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-black text-caso-white">
                  April 26, 2027
                </p>
                <p className="mt-2 text-sm text-caso-slate">
                  Entities serving{" "}
                  <strong className="text-caso-white">fewer than 50,000</strong>.
                </p>
                <p className="mt-4 rounded-lg bg-caso-warm/10 px-3 py-2 text-xs font-semibold text-caso-warm">
                  About 13 months away
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-caso-slate leading-relaxed">
              <p>
                There is no phased rollout or partial compliance option. By
                your deadline, all web content and digital documents must
                conform to WCAG 2.1 Level AA. Governments that miss the
                deadline are immediately subject to DOJ enforcement actions,
                private lawsuits, and civil penalties of up to $75,000 for a
                first offense and $150,000 for subsequent violations.
              </p>
              <p>
                The time to start is now. Document remediation at scale takes
                weeks to months, and compliance programs need time to build
                momentum across departments. Organizations that wait until the
                final months face rushed timelines, higher costs, and greater
                risk of gaps.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-20 rounded-2xl border border-caso-blue/30 bg-caso-blue/5 p-8 text-center md:p-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white md:text-3xl">
              Start your compliance assessment today.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-caso-slate">
              Our free scan crawls your website, inventories every document, and
              shows you exactly where you stand. It is the first item on this
              checklist — and it takes just minutes.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/free-scan"
                className="rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-base font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
              >
                Get a Free Compliance Scan
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-caso-border bg-transparent px-8 py-4 font-[family-name:var(--font-display)] text-base font-bold text-caso-white transition-all hover:border-caso-blue hover:bg-caso-navy-light"
              >
                Talk to Our Team
              </Link>
            </div>
          </div>
        </div>
      </article>
    </MarketingLayout>
  );
}
