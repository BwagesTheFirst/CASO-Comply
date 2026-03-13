import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title:
    "ADA Title II Document Compliance Guide: WCAG 2.1 AA Requirements for Government PDFs | CASO Comply",
  description:
    "Complete guide to ADA Title II digital document accessibility requirements. Learn WCAG 2.1 AA compliance deadlines, PDF accessibility standards, and how state and local governments can remediate documents before the April 2026 deadline.",
  keywords:
    "ADA Title II document compliance, WCAG 2.1 AA document requirements, government PDF accessibility, ADA Title II deadline 2026, accessible PDF requirements, Section 508 compliance, PDF/UA, government document remediation",
  openGraph: {
    title:
      "ADA Title II Document Compliance Guide: WCAG 2.1 AA Requirements for Government PDFs | CASO Comply",
    description:
      "Complete guide to ADA Title II digital document accessibility requirements. Learn WCAG 2.1 AA compliance deadlines, PDF accessibility standards, and how state and local governments can remediate documents before the April 2026 deadline.",
  },
  alternates: {
    canonical: "/resources/ada-title-ii-guide",
  },
};

const TOC_ITEMS = [
  { id: "what-is-ada-title-ii", label: "What is ADA Title II?" },
  {
    id: "digital-accessibility-requirements",
    label: "New Digital Accessibility Requirements",
  },
  { id: "who-is-affected", label: "Who Is Affected?" },
  { id: "compliance-deadlines", label: "Compliance Deadlines" },
  { id: "documents-covered", label: "What Documents Are Covered?" },
  {
    id: "what-makes-a-document-accessible",
    label: "What Makes a Document Accessible?",
  },
  {
    id: "consequences-of-non-compliance",
    label: "Consequences of Non-Compliance",
  },
  { id: "how-to-get-compliant", label: "How to Get Compliant" },
  { id: "how-caso-comply-helps", label: "How CASO Comply Can Help" },
];

export default function ADAGuidePage() {
  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "ADA Title II Document Compliance Guide",
            description: "Complete guide to ADA Title II digital document accessibility requirements for government agencies.",
            author: { "@type": "Organization", name: "CASO Comply" },
            publisher: { "@type": "Organization", name: "CASO Comply", url: "https://casocomply.com" },
            datePublished: "2025-01-15",
            dateModified: "2026-03-01",
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
            ADA Title II Document{" "}
            <span className="text-caso-blue">Compliance Guide</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-caso-slate">
            Everything state and local governments need to know about the new
            digital document accessibility requirements under ADA Title II,
            including WCAG 2.1 AA standards, deadlines, and how to remediate
            your documents.
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
          <section id="what-is-ada-title-ii" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              1. What is ADA Title II?
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                The Americans with Disabilities Act (ADA) was signed into law in
                1990 to prohibit discrimination against individuals with
                disabilities. <strong className="text-caso-white">Title II</strong> of the ADA
                specifically applies to state and local government entities,
                requiring that all programs, services, and activities be
                accessible to people with disabilities.
              </p>
              <p>
                For decades, Title II primarily focused on physical
                accessibility — ramps, elevators, accessible restrooms, and
                similar accommodations. But as government services moved online,
                a critical gap emerged: digital content, including the documents
                governments publish on their websites, was largely inaccessible
                to people using assistive technologies like screen readers.
              </p>
              <p>
                In April 2024, the Department of Justice (DOJ) published a{" "}
                <strong className="text-caso-white">
                  final rule under Title II
                </strong>{" "}
                that explicitly establishes technical standards for web and
                digital content accessibility. For the first time, there are
                clear, enforceable requirements for making digital documents —
                including PDFs, Word files, spreadsheets, and presentations —
                accessible to all users.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 2 */}
          <section
            id="digital-accessibility-requirements"
            className="scroll-mt-24"
          >
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              2. New Digital Accessibility Requirements
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                The 2024 final rule adopts{" "}
                <strong className="text-caso-white">
                  WCAG 2.1 Level AA
                </strong>{" "}
                (Web Content Accessibility Guidelines) as the technical standard
                that state and local governments must meet. WCAG 2.1 is
                published by the World Wide Web Consortium (W3C) and is the most
                widely recognized international standard for digital
                accessibility.
              </p>
              <p>
                WCAG 2.1 AA covers four core principles. All digital content
                must be:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong className="text-caso-white">Perceivable</strong> —
                  Information must be presentable in ways all users can perceive,
                  including providing text alternatives for images and captions
                  for multimedia.
                </li>
                <li>
                  <strong className="text-caso-white">Operable</strong> —
                  Navigation and interaction must be possible using a keyboard
                  alone, without requiring a mouse.
                </li>
                <li>
                  <strong className="text-caso-white">Understandable</strong> —
                  Content and interface behavior must be predictable and
                  readable.
                </li>
                <li>
                  <strong className="text-caso-white">Robust</strong> — Content
                  must work reliably with current and future assistive
                  technologies, including screen readers and braille displays.
                </li>
              </ul>
              <p>
                For documents specifically, this means PDFs, Word files, and
                other digital publications must have proper structure, tagged
                content, alternative text for images, and a logical reading
                order that assistive technologies can interpret.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 3 */}
          <section id="who-is-affected" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              3. Who Is Affected?
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                ADA Title II applies to{" "}
                <strong className="text-caso-white">
                  all state and local government entities
                </strong>
                , regardless of size. This includes:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>State agencies and departments</li>
                <li>County and municipal governments</li>
                <li>Public school districts (K-12)</li>
                <li>Public colleges and universities</li>
                <li>Public libraries</li>
                <li>Public transit authorities</li>
                <li>Courts and judicial systems</li>
                <li>Public utilities and special districts</li>
                <li>Law enforcement agencies</li>
                <li>Public health departments and hospitals</li>
              </ul>
              <p>
                If your organization receives public funding or operates as a
                function of state or local government, you are covered by Title
                II. There is no minimum size threshold — a small town with 500
                residents has the same legal obligations as a city of 5 million,
                though the compliance deadlines differ based on population.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 4 */}
          <section id="compliance-deadlines" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              4. Compliance Deadlines
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                The DOJ established two compliance deadlines based on the
                population served by the government entity:
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
                  State and local government entities serving a population of{" "}
                  <strong className="text-caso-white">
                    50,000 or more
                  </strong>
                  .
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
                  State and local government entities serving a population of{" "}
                  <strong className="text-caso-white">
                    fewer than 50,000
                  </strong>
                  .
                </p>
                <p className="mt-4 rounded-lg bg-caso-warm/10 px-3 py-2 text-xs font-semibold text-caso-warm">
                  About 13 months away
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-caso-slate leading-relaxed">
              <p>
                These deadlines apply to all web content and digital documents
                published by the entity. There is no grace period and no
                extension mechanism in the final rule. Governments that miss the
                deadline are immediately subject to enforcement actions and
                complaints.
              </p>
              <p>
                Population size is determined using the most recent Census data.
                For entities that serve multiple jurisdictions (such as regional
                transit authorities), the total combined population is used.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 5 */}
          <section id="documents-covered" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              5. What Documents Are Covered?
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                The rule covers{" "}
                <strong className="text-caso-white">
                  all digital content
                </strong>{" "}
                made available through a government entity&apos;s website or
                digital channels. For documents, this includes:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong className="text-caso-white">PDF files</strong> —
                  Meeting agendas, minutes, budgets, reports, forms,
                  applications, permits, ordinances, plans, and any other
                  publicly posted PDF documents.
                </li>
                <li>
                  <strong className="text-caso-white">
                    Microsoft Word documents
                  </strong>{" "}
                  — Letters, memos, policies, and any .doc/.docx files available
                  for download.
                </li>
                <li>
                  <strong className="text-caso-white">
                    Excel spreadsheets
                  </strong>{" "}
                  — Budget data, datasets, statistical reports, and any
                  .xls/.xlsx files.
                </li>
                <li>
                  <strong className="text-caso-white">
                    PowerPoint presentations
                  </strong>{" "}
                  — Meeting presentations, training materials, and any
                  .ppt/.pptx files.
                </li>
                <li>
                  <strong className="text-caso-white">
                    Other digital content
                  </strong>{" "}
                  — Interactive maps, data visualizations, embedded media, and
                  any other digital content published through web channels.
                </li>
              </ul>
              <p>
                A common misconception is that only &quot;new&quot; documents
                need to be accessible. The rule applies to{" "}
                <strong className="text-caso-white">
                  all content currently published
                </strong>{" "}
                on your website, not just documents created after the rule took
                effect. If a PDF from 2015 is still available on your site, it
                must be made accessible by the deadline.
              </p>
              <p>
                For most government websites, PDFs represent the largest volume
                of non-compliant documents. It is common for a mid-size city
                website to have thousands of PDFs, the vast majority of which
                were created without accessibility in mind.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 6 */}
          <section
            id="what-makes-a-document-accessible"
            className="scroll-mt-24"
          >
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              6. What Makes a Document Accessible?
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                An accessible document is one that can be read and navigated by
                assistive technologies, particularly screen readers. To meet
                WCAG 2.1 AA and PDF/UA (ISO 14289) standards, documents must
                include:
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Tagged Structure
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Every element in the document — headings, paragraphs, lists,
                  tables, images — must be tagged with its semantic role. Tags
                  tell screen readers what type of content each element is, just
                  as HTML tags do on a web page. An untagged PDF appears as a
                  wall of undifferentiated text to a screen reader.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Alternative Text for Images
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Every meaningful image, chart, graph, or diagram must have
                  alternative text (alt text) that conveys the same information
                  the image provides visually. Decorative images should be
                  marked as artifacts so screen readers skip them.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Logical Reading Order
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  The order in which a screen reader encounters content must
                  match the logical order a sighted reader would follow.
                  Multi-column layouts, sidebars, headers, and footers must be
                  ordered correctly in the tag tree so content flows naturally.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Table Headers
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Data tables must have properly marked header cells (TH tags)
                  so screen readers can associate data cells with their column
                  and row headers. Complex tables with merged cells or multiple
                  header levels require additional scope attributes.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Form Labels and Fields
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Interactive PDF forms must have every field properly labeled so
                  users know what information is expected. Tab order must follow
                  a logical sequence, and required fields must be identified.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Bookmarks and Navigation
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Documents longer than a few pages should include bookmarks
                  that mirror the heading structure, allowing users to quickly
                  navigate to specific sections without scrolling through the
                  entire document.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Document Language
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  The document must declare its primary language (e.g., English,
                  Spanish) so screen readers use the correct pronunciation
                  engine. Passages in other languages should be marked with
                  language attributes as well.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Color Contrast and Visual Design
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Text must have sufficient contrast against its background (a
                  minimum ratio of 4.5:1 for normal text, 3:1 for large text).
                  Information must not be conveyed by color alone — for example,
                  a chart that uses only color to distinguish data series is not
                  accessible.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 7 */}
          <section
            id="consequences-of-non-compliance"
            className="scroll-mt-24"
          >
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              7. Consequences of Non-Compliance
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                Failing to meet ADA Title II requirements carries serious legal
                and financial consequences:
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                DOJ Enforcement Actions
              </h3>
              <p>
                The Department of Justice actively investigates and enforces ADA
                compliance. The DOJ has pursued enforcement actions against
                government entities of all sizes, from small counties to major
                state agencies. Investigations can be triggered by individual
                complaints, advocacy organizations, or DOJ-initiated reviews.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Lawsuits and Legal Costs
              </h3>
              <p>
                Private individuals can file lawsuits against government entities
                that fail to provide accessible digital content. Disability
                rights organizations also bring systematic litigation. The legal
                costs of defending an accessibility lawsuit — even if you settle
                — typically far exceed the cost of proactive remediation.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Financial Penalties
              </h3>
              <p>
                Civil penalties for ADA violations can reach{" "}
                <strong className="text-caso-white">
                  $75,000 for a first offense
                </strong>{" "}
                and{" "}
                <strong className="text-caso-white">
                  $150,000 for subsequent violations
                </strong>
                . These penalties are per violation — and with hundreds or
                thousands of inaccessible documents on a website, the exposure
                adds up rapidly.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Reputational Damage
              </h3>
              <p>
                Government entities exist to serve all members of their
                community. When a city or county is sued for accessibility
                failures, it generates negative press coverage and erodes public
                trust. Proactive compliance demonstrates a commitment to
                equitable access for all constituents.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Loss of Federal Funding
              </h3>
              <p>
                In some cases, ADA non-compliance can jeopardize federal funding.
                Federal agencies may condition grants and contracts on
                demonstrated compliance with civil rights laws, including the
                ADA.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 8 */}
          <section id="how-to-get-compliant" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              8. How to Get Compliant
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                Achieving compliance is a process, not a one-time event. Here is
                a practical roadmap:
              </p>
            </div>

            <div className="mt-8 space-y-8">
              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  1
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Audit Your Current Documents
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Start by understanding the scope of the problem. Crawl your
                    website to identify every document that is publicly
                    available. Run automated accessibility checks against each
                    one. You need to know how many documents you have, how many
                    are non-compliant, and the severity of the issues.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  2
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Prioritize by Risk and Impact
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Not all documents carry equal risk. Prioritize high-traffic
                    documents (budget reports, meeting agendas), legally required
                    publications, and documents related to critical services
                    (permits, applications, public health information).
                    Documents that are rarely accessed or outdated may be
                    candidates for removal rather than remediation.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  3
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Remediate Documents
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Each document needs to be brought into compliance with WCAG
                    2.1 AA and PDF/UA standards. This involves adding tags,
                    writing alt text, fixing reading order, marking up tables,
                    and setting document metadata. Manual remediation of a
                    single PDF can take 30 minutes to several hours depending on
                    complexity. Automated tools can dramatically reduce this
                    time.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  4
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Verify Compliance
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    After remediation, every document should be validated against
                    PDF/UA standards using tools like veraPDF or PAC (PDF
                    Accessibility Checker). Automated validation catches
                    structural issues, but manual review is also important —
                    especially for alt text quality and reading order logic.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  5
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Establish Ongoing Processes
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Compliance is not a one-time project. Every new document
                    published to your website must be accessible from the start.
                    This requires training staff on accessible document creation,
                    integrating accessibility checks into your publishing
                    workflow, and periodically auditing your site for new
                    non-compliant content.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 9 */}
          <section id="how-caso-comply-helps" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              9. How CASO Comply Can Help
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                CASO Comply is an AI-powered document accessibility remediation
                platform built specifically for organizations facing the scale
                of the ADA Title II challenge. Instead of manually remediating
                each PDF one at a time, CASO Comply automates the process at a
                fraction of the cost.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Automated PDF Remediation
              </h3>
              <p>
                Our{" "}
                <Link
                  href="/services/pdf-remediation"
                  className="text-caso-blue underline decoration-caso-blue/30 transition-colors hover:text-caso-blue-bright hover:decoration-caso-blue"
                >
                  PDF remediation service
                </Link>{" "}
                uses AI to automatically tag document structure, generate
                accurate alt text for images, fix reading order, mark up tables,
                and set all required metadata. What would take a human hours per
                document, CASO Comply handles in minutes.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Free Compliance Scan
              </h3>
              <p>
                Not sure where you stand? Our{" "}
                <Link
                  href="/free-scan"
                  className="text-caso-blue underline decoration-caso-blue/30 transition-colors hover:text-caso-blue-bright hover:decoration-caso-blue"
                >
                  free compliance scan
                </Link>{" "}
                crawls your website, identifies every document, and produces a
                detailed report showing how many are non-compliant and what
                issues exist. No commitment required — just a clear picture of
                your current status.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Built for Government Scale
              </h3>
              <p>
                Whether you have 50 PDFs or 50,000, CASO Comply scales to meet
                the challenge. Our on-premise Docker agent processes documents
                on your infrastructure, so sensitive government files never
                leave your network. We are SOC 2 Type II certified and built
                with government procurement requirements in mind.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Ongoing Compliance
              </h3>
              <p>
                CASO Comply is not just a one-time fix. The agent monitors your
                document directories and automatically remediates new files as
                they are added, ensuring you stay compliant long after the
                deadline has passed.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-20 rounded-2xl border border-caso-blue/30 bg-caso-blue/5 p-8 text-center md:p-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white md:text-3xl">
              The deadline is approaching.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-caso-slate">
              Governments serving 50,000+ residents must be compliant by April
              24, 2026. Start with a free scan to understand the scope of your
              compliance gap.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/free-scan"
                className="rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-base font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
              >
                Get a Free Compliance Scan
              </Link>
              <Link
                href="/services/pdf-remediation"
                className="rounded-xl border border-caso-border bg-transparent px-8 py-4 font-[family-name:var(--font-display)] text-base font-bold text-caso-white transition-all hover:border-caso-blue hover:bg-caso-navy-light"
              >
                Learn About Remediation
              </Link>
            </div>
          </div>
        </div>
      </article>
    </MarketingLayout>
  );
}
