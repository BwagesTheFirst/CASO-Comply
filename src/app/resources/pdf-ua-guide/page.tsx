import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title:
    "PDF/UA Compliance Guide: What is PDF/UA (ISO 14289) and Why It Matters | CASO Comply",
  description:
    "Complete guide to PDF/UA (ISO 14289-1) compliance. Learn what PDF/UA is, how it differs from WCAG, technical requirements, validation tools like veraPDF and PAC, and how to achieve machine-verifiable PDF accessibility.",
  keywords:
    "PDF/UA compliance, what is PDF/UA, ISO 14289, PDF/UA vs WCAG, PDF accessibility standard, veraPDF, PAC checker, PDF/UA-2, tagged PDF",
  openGraph: {
    title:
      "PDF/UA Compliance Guide: What is PDF/UA (ISO 14289) and Why It Matters | CASO Comply",
    description:
      "Complete guide to PDF/UA (ISO 14289-1) compliance. Learn what PDF/UA is, technical requirements, validation tools, and how to achieve machine-verifiable PDF accessibility.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/resources/pdf-ua-guide",
  },
};

const TOC_ITEMS = [
  { id: "what-is-pdf-ua", label: "What is PDF/UA?" },
  { id: "why-pdf-ua-matters", label: "Why PDF/UA Matters" },
  { id: "pdf-ua-vs-wcag", label: "PDF/UA vs WCAG" },
  { id: "technical-requirements", label: "Technical Requirements of PDF/UA" },
  { id: "validating-pdf-ua", label: "How to Validate PDF/UA Compliance" },
  { id: "pdf-ua-2", label: "PDF/UA-2: The Newer Standard" },
  { id: "common-failures", label: "Common PDF/UA Failures" },
  { id: "how-caso-helps", label: "How CASO Comply Ensures PDF/UA Compliance" },
];

export default function PDFUAGuidePage() {
  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "PDF/UA Compliance Guide: What is PDF/UA (ISO 14289) and Why It Matters",
            description: "Complete guide to PDF/UA (ISO 14289-1) compliance, covering technical requirements, validation tools, and the difference between PDF/UA and WCAG.",
            author: { "@type": "Organization", name: "CASO Comply" },
            publisher: { "@type": "Organization", name: "CASO Comply", url: "https://casocomply.com" },
            datePublished: "2025-02-15",
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
            PDF/UA{" "}
            <span className="text-caso-blue">Compliance Guide</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-caso-slate">
            Understanding PDF/UA (ISO 14289) — the international standard for
            machine-verifiable PDF accessibility. Learn what it requires, how it
            relates to WCAG, and how to validate your documents.
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
          <section id="what-is-pdf-ua" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              1. What is PDF/UA?
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                <strong className="text-caso-white">PDF/UA</strong> stands for
                PDF/Universal Accessibility. It is an international standard
                published as{" "}
                <strong className="text-caso-white">ISO 14289-1</strong>,
                first released in 2012, that defines the technical requirements
                for making PDF documents accessible to people with disabilities.
              </p>
              <p>
                While WCAG provides broad guidelines for digital accessibility,
                PDF/UA is laser-focused on the PDF format. It specifies exactly
                how a PDF&apos;s internal structure — its tags, metadata, fonts,
                and content streams — must be constructed to be interpretable by
                assistive technologies like screen readers and braille displays.
              </p>
              <p>
                The &quot;UA&quot; in PDF/UA stands for Universal Accessibility,
                reflecting the standard&apos;s goal: every PDF should be usable
                by every person, regardless of ability. Unlike WCAG, which
                provides principles and success criteria that require human
                judgment to evaluate, PDF/UA defines requirements that are largely{" "}
                <strong className="text-caso-white">
                  machine-verifiable
                </strong>
                . A tool can check a PDF against the PDF/UA specification and
                definitively report whether it conforms or not.
              </p>
              <p>
                This makes PDF/UA the backbone of automated accessibility
                validation. When organizations need to verify that thousands of
                documents are accessible, PDF/UA provides the testable criteria
                that make large-scale validation possible.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 2 */}
          <section id="why-pdf-ua-matters" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              2. Why PDF/UA Matters
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                PDF/UA matters because it transforms accessibility from a
                subjective judgment into an{" "}
                <strong className="text-caso-white">
                  objective, verifiable standard
                </strong>
                . Here is why that matters in practice:
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Legal Protection
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  When the ADA Title II final rule requires WCAG 2.1 AA
                  conformance for documents, PDF/UA provides the technical
                  specification for how that conformance is achieved in PDFs. A
                  PDF/UA-conformant document is strong evidence of compliance.
                  Conversely, a document that fails PDF/UA validation is
                  demonstrably non-compliant — which is exactly what a plaintiff
                  or the DOJ would present in an enforcement action.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Scalable Validation
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Because PDF/UA requirements are machine-testable, you can
                  validate thousands of documents automatically. Manual
                  accessibility review of every document is impractical at scale;
                  PDF/UA validation makes it possible to verify compliance across
                  your entire document library programmatically.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Interoperability
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  PDF/UA-conformant documents work reliably across different
                  screen readers, operating systems, and PDF viewers. Without
                  PDF/UA conformance, a document might work with JAWS on Windows
                  but fail with VoiceOver on macOS. The standard ensures
                  consistent behavior across all assistive technologies.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  International Recognition
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  As an ISO standard, PDF/UA is recognized internationally. The
                  European Union&apos;s EN 301 549 references PDF/UA, as do
                  accessibility regulations in Canada, Australia, and other
                  countries. Achieving PDF/UA compliance positions your documents
                  for global accessibility requirements, not just U.S. law.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 3 */}
          <section id="pdf-ua-vs-wcag" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              3. PDF/UA vs WCAG
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                PDF/UA and WCAG are complementary standards, not competitors. They
                address accessibility from different angles, and understanding
                their relationship is essential for anyone managing document
                compliance.
              </p>
            </div>

            <div className="mt-8 overflow-hidden rounded-xl border border-caso-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-caso-border bg-caso-navy-light/50">
                    <th className="px-6 py-4 text-left font-[family-name:var(--font-display)] font-bold text-caso-white">
                      Aspect
                    </th>
                    <th className="px-6 py-4 text-left font-[family-name:var(--font-display)] font-bold text-caso-white">
                      WCAG 2.1
                    </th>
                    <th className="px-6 py-4 text-left font-[family-name:var(--font-display)] font-bold text-caso-white">
                      PDF/UA
                    </th>
                  </tr>
                </thead>
                <tbody className="text-caso-slate">
                  <tr className="border-b border-caso-border/50">
                    <td className="px-6 py-4 font-medium text-caso-white">Scope</td>
                    <td className="px-6 py-4">All digital content (web, documents, apps)</td>
                    <td className="px-6 py-4">PDF documents only</td>
                  </tr>
                  <tr className="border-b border-caso-border/50">
                    <td className="px-6 py-4 font-medium text-caso-white">Published by</td>
                    <td className="px-6 py-4">W3C (World Wide Web Consortium)</td>
                    <td className="px-6 py-4">ISO (International Organization for Standardization)</td>
                  </tr>
                  <tr className="border-b border-caso-border/50">
                    <td className="px-6 py-4 font-medium text-caso-white">Nature</td>
                    <td className="px-6 py-4">Principles and guidelines</td>
                    <td className="px-6 py-4">Technical specification</td>
                  </tr>
                  <tr className="border-b border-caso-border/50">
                    <td className="px-6 py-4 font-medium text-caso-white">Testability</td>
                    <td className="px-6 py-4">Mix of automated and manual</td>
                    <td className="px-6 py-4">Primarily machine-verifiable</td>
                  </tr>
                  <tr className="border-b border-caso-border/50">
                    <td className="px-6 py-4 font-medium text-caso-white">Content quality</td>
                    <td className="px-6 py-4">Addresses alt text quality, readability</td>
                    <td className="px-6 py-4">Requires alt text presence, not quality</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-caso-white">Legal reference</td>
                    <td className="px-6 py-4">ADA Title II, Section 508, EN 301 549</td>
                    <td className="px-6 py-4">Referenced by WCAG techniques for PDFs</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 space-y-4 text-caso-slate leading-relaxed">
              <p>
                In practice, you need both.{" "}
                <strong className="text-caso-white">
                  WCAG defines what your documents need to achieve
                </strong>{" "}
                (alternative text that conveys meaning, logical reading order,
                sufficient contrast).{" "}
                <strong className="text-caso-white">
                  PDF/UA defines how to achieve it technically
                </strong>{" "}
                (specific tag structures, metadata properties, font embedding
                rules). A PDF can pass PDF/UA validation but still fail WCAG if
                its alt text is present but meaningless. Conversely, a document
                with excellent alt text but no proper tag structure fails both
                standards.
              </p>
              <p>
                The W3C&apos;s official PDF techniques for WCAG explicitly
                reference PDF/UA as the technical implementation standard. When
                a regulator or auditor evaluates your PDF compliance, they are
                likely to use PDF/UA validation as the starting point and then
                manually review content quality criteria from WCAG.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 4 */}
          <section id="technical-requirements" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              4. Technical Requirements of PDF/UA
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                PDF/UA-1 (ISO 14289-1) defines specific technical requirements
                for PDF files. These requirements address every layer of a
                PDF&apos;s internal structure. Here are the major categories:
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Tagged Structure
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Every piece of content in the document must be included in the
                  tag tree or marked as an artifact. The tag tree must use
                  standard PDF structure types (Document, Part, Sect, H1-H6, P,
                  L, LI, Table, TR, TH, TD, Figure, etc.) that map to their
                  semantic roles. Custom tags are allowed only if they are mapped
                  to standard roles. No content may exist outside the tag tree
                  unless it is a page artifact (headers, footers, page numbers,
                  watermarks).
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Alternative Text
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Every Figure tag must have an Alt attribute containing a text
                  description. Decorative images must not be tagged as Figures —
                  they must be marked as artifacts. The standard requires that
                  alt text be present but does not define quality criteria; WCAG
                  handles content quality. Complex images may also use the
                  ActualText attribute or a longer description linked via the
                  LongDesc attribute.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Document Metadata
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  The document must have a Title set in both the document info
                  dictionary and XMP metadata, and they must match. The
                  DisplayDocTitle viewer preference must be set to true so the
                  title (not the filename) appears in the viewer title bar. The
                  document language must be set in the catalog&apos;s Lang entry.
                  The PDF must declare itself as PDF/UA-conformant via an XMP
                  metadata property (pdfuaid:part = 1).
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Font Requirements
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  All fonts must be embedded in the document. Every glyph used
                  must have a Unicode mapping so that text can be extracted and
                  interpreted correctly by assistive technologies. Fonts that do
                  not map to Unicode (some symbol fonts, custom barcode fonts)
                  require ActualText attributes on their containing spans to
                  provide the text equivalent.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Table Structure
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Tables must use Table, TR, TH, and TD tags. Header cells (TH)
                  must have a Scope attribute indicating whether they are row
                  headers or column headers. For complex tables with multiple
                  header levels, cells must use the Headers attribute to
                  explicitly associate data cells with their header cells. Every
                  table must have at least one header row or column.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Lists
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Lists must be tagged with L (list), LI (list item), Lbl
                  (label/marker), and LBody (list item body) elements. Nested
                  lists must be properly nested within parent list items. Bulleted
                  lists, numbered lists, and definition lists each have specific
                  tagging requirements to ensure screen readers announce them
                  correctly.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Links and Annotations
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Hyperlinks must be tagged as Link structure elements containing
                  an OBJR (object reference) to the link annotation. The link
                  annotation must have a Contents entry or the Link tag must
                  contain text content that describes the link destination. Link
                  annotations must not overlap or interfere with the document&apos;s
                  tag structure.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 5 */}
          <section id="validating-pdf-ua" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              5. How to Validate PDF/UA Compliance
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                One of PDF/UA&apos;s greatest strengths is that compliance can be
                verified programmatically. Several tools exist for this purpose,
                ranging from free open-source options to commercial products.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-caso-blue/30 bg-caso-blue/5 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  veraPDF
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-caso-teal">
                  Open Source / Industry Standard
                </p>
                <p className="mt-3 text-sm text-caso-slate leading-relaxed">
                  veraPDF is the industry-reference open-source PDF/UA validator,
                  endorsed by the PDF Association. It checks PDF files against
                  the complete ISO 14289-1 specification and produces detailed
                  machine-readable reports listing every rule that passed or
                  failed. veraPDF runs as a Java CLI tool or library, making it
                  ideal for integration into automated pipelines. It is the
                  validator used by CASO Comply in our remediation pipeline.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  PAC (PDF Accessibility Checker)
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-caso-teal">
                  Free / Swiss Foundation
                </p>
                <p className="mt-3 text-sm text-caso-slate leading-relaxed">
                  PAC is a free desktop tool developed by the Swiss Foundation for
                  Access for All. It provides a graphical interface for checking
                  PDF/UA conformance and includes a unique &quot;screen reader
                  preview&quot; that shows how a document will be interpreted by
                  assistive technologies. PAC is excellent for manual spot-checking
                  and understanding specific failures, though it is Windows-only
                  and less suited for batch automation.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Adobe Acrobat Pro
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-caso-teal">
                  Commercial / Adobe
                </p>
                <p className="mt-3 text-sm text-caso-slate leading-relaxed">
                  Adobe Acrobat Pro includes an accessibility checker that tests
                  for many PDF/UA requirements. It is useful for both checking and
                  fixing issues, as you can address problems directly in Acrobat.
                  However, Acrobat&apos;s checker is not a complete PDF/UA
                  validator — it misses some requirements that veraPDF and PAC
                  catch. Use it as a first step, not a final validation.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-caso-slate leading-relaxed">
              <p>
                For organizations with large document libraries, the practical
                approach is to use veraPDF in an automated pipeline for bulk
                validation and PAC for manual review of edge cases or complex
                documents. The combination provides both coverage and depth.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 6 */}
          <section id="pdf-ua-2" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              6. PDF/UA-2: The Newer Standard
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                <strong className="text-caso-white">PDF/UA-2</strong> (ISO
                14289-2) was published in December 2023. It is the next
                generation of the PDF/UA standard, aligned with PDF 2.0 (ISO
                32000-2) and WCAG 2.1/2.2.
              </p>
              <p>
                Key changes in PDF/UA-2 compared to PDF/UA-1:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong className="text-caso-white">Based on PDF 2.0</strong> —
                  PDF/UA-2 requires PDF 2.0 as its base format, which
                  introduces new structure types like DocumentFragment, Aside,
                  and enhanced support for MathML annotations.
                </li>
                <li>
                  <strong className="text-caso-white">
                    Aligned with WCAG 2.1/2.2
                  </strong>{" "}
                  — The standard explicitly maps its requirements to WCAG
                  success criteria, making the relationship between the two
                  standards clear and formal.
                </li>
                <li>
                  <strong className="text-caso-white">
                    Namespaces for structure types
                  </strong>{" "}
                  — PDF 2.0 introduces namespaced structure types, allowing for
                  richer semantic markup including HTML-like elements.
                </li>
                <li>
                  <strong className="text-caso-white">
                    Enhanced pronunciation support
                  </strong>{" "}
                  — Improved mechanisms for specifying pronunciation of
                  specialized terms, abbreviations, and non-standard words.
                </li>
                <li>
                  <strong className="text-caso-white">
                    Better mathematical content
                  </strong>{" "}
                  — Native support for MathML annotations within PDF structure,
                  improving accessibility of scientific and technical documents.
                </li>
              </ul>
              <p>
                Currently, most regulatory requirements reference PDF/UA-1, and
                the majority of tools and workflows target PDF/UA-1 conformance.
                PDF/UA-2 adoption is growing but is not yet the dominant
                standard. Organizations should achieve PDF/UA-1 conformance now
                and plan to transition to PDF/UA-2 as tool support matures and
                regulations update their references.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 7 */}
          <section id="common-failures" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              7. Common PDF/UA Failures
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                Based on validation of thousands of government and enterprise
                PDFs, these are the most frequently encountered PDF/UA failures:
              </p>
            </div>

            <div className="mt-8 space-y-8">
              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/50 bg-red-500/10 text-sm font-bold text-red-400">
                  1
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    No PDF/UA Identifier
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    The document does not declare itself as PDF/UA-conformant
                    in its XMP metadata. Even documents that are structurally
                    compliant often lack this declaration, which is required for
                    formal conformance.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/50 bg-red-500/10 text-sm font-bold text-red-400">
                  2
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Content Outside the Tag Tree
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Real content (text, images) exists in the page stream but is
                    not referenced by any tag and is not marked as an artifact.
                    This &quot;orphaned&quot; content is invisible to assistive
                    technologies. Common with headers, footers, and watermarks
                    that were not properly artifacted.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/50 bg-red-500/10 text-sm font-bold text-red-400">
                  3
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Figure Tags Without Alt Text
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Images are tagged as Figure elements but lack the required Alt
                    attribute. This is a clear PDF/UA violation — every Figure must
                    have alt text. Alternatively, purely decorative images should
                    not be tagged as Figures at all but marked as artifacts.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/50 bg-red-500/10 text-sm font-bold text-red-400">
                  4
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Missing or Mismatched Document Title
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    The document lacks a title, or the title in the document info
                    dictionary does not match the XMP metadata title.
                    DisplayDocTitle is not set to true. These are among the
                    simplest PDF/UA requirements to fix but are consistently
                    overlooked.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/50 bg-red-500/10 text-sm font-bold text-red-400">
                  5
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Table Headers Not Identified
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Tables use TD tags for all cells, including header cells that
                    should be TH. The Scope attribute is missing from header cells.
                    This makes it impossible for screen readers to associate data
                    values with their column and row headers.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/50 bg-red-500/10 text-sm font-bold text-red-400">
                  6
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Fonts Without Unicode Mapping
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Glyphs in the document cannot be mapped to Unicode characters.
                    This typically happens with symbol fonts, decorative fonts, or
                    fonts embedded without proper encoding tables. Affected text
                    cannot be extracted or read by assistive technologies.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 8 */}
          <section id="how-caso-helps" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              8. How CASO Comply Ensures PDF/UA Compliance
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                CASO Comply&apos;s remediation pipeline is built around PDF/UA as
                the definitive technical standard. Every document we process goes
                through a pipeline designed to produce PDF/UA-conformant output.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                AI-Powered Structural Tagging
              </h3>
              <p>
                Our{" "}
                <Link
                  href="/services/pdf-remediation"
                  className="text-caso-blue underline decoration-caso-blue/30 transition-colors hover:text-caso-blue-bright hover:decoration-caso-blue"
                >
                  PDF remediation engine
                </Link>{" "}
                uses Adobe Auto-Tag API combined with Claude AI to build a
                complete, correct tag tree for every document. Tags are mapped
                to standard PDF structure types, ensuring PDF/UA conformance.
                Complex layouts, multi-column pages, and nested tables are
                handled automatically.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                veraPDF Validation on Every Document
              </h3>
              <p>
                Every remediated document is validated against the full PDF/UA-1
                specification using veraPDF before delivery. Documents that fail
                validation are flagged for additional processing or manual review.
                You receive a validation report for every document, providing an
                auditable compliance record.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Metadata and Font Compliance
              </h3>
              <p>
                CASO Comply automatically sets all required PDF/UA metadata —
                document title, language, PDF/UA identifier, DisplayDocTitle — and
                ensures all fonts are properly embedded with Unicode mappings. These
                are the &quot;easy fixes&quot; that are nonetheless missed in the
                vast majority of PDF documents.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Free Compliance Scan
              </h3>
              <p>
                Want to know how your current documents measure up against PDF/UA?
                Our{" "}
                <Link
                  href="/free-scan"
                  className="text-caso-blue underline decoration-caso-blue/30 transition-colors hover:text-caso-blue-bright hover:decoration-caso-blue"
                >
                  free compliance scan
                </Link>{" "}
                identifies every PDF on your website and runs automated
                accessibility checks to show your current status. No commitment
                required.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-20 rounded-2xl border border-caso-blue/30 bg-caso-blue/5 p-8 text-center md:p-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white md:text-3xl">
              Verify your PDF/UA compliance.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-caso-slate">
              Find out which of your PDF documents pass PDF/UA validation and
              which need remediation. Our free scan provides a complete compliance
              report for your entire document library.
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
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </article>
    </MarketingLayout>
  );
}
