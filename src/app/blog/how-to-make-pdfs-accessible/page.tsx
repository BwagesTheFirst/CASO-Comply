import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title: "How to Make PDFs Accessible: A Complete Guide | CASO Comply",
  description:
    "Learn what makes a PDF accessible, the most common accessibility issues, and step-by-step instructions for remediating your documents to meet WCAG 2.1 AA and PDF/UA standards.",
  openGraph: {
    title: "How to Make PDFs Accessible: A Complete Guide",
    description:
      "Step-by-step guide to making PDFs accessible for screen readers and assistive technologies. Covers tagging, alt text, reading order, and more.",
    type: "article",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" },
    ],
  },
  alternates: {
    canonical: "/blog/how-to-make-pdfs-accessible",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Make PDFs Accessible: A Complete Guide",
  description:
    "Learn what makes a PDF accessible, the most common accessibility issues, and step-by-step instructions for remediating your documents.",
  author: {
    "@type": "Organization",
    name: "CASO Comply",
  },
  publisher: {
    "@type": "Organization",
    name: "CASO Comply",
    url: "https://casocomply.com",
  },
  datePublished: "2026-03-14",
  dateModified: "2026-03-14",
};

export default function HowToMakePDFsAccessiblePage() {
  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              href="/blog"
              className="text-sm text-caso-blue transition-colors hover:text-caso-blue-bright"
            >
              &larr; Back to Blog
            </Link>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <span className="inline-block rounded-full border border-caso-blue/50 bg-caso-blue/10 px-3 py-1 text-xs font-semibold text-caso-blue">
              Guides
            </span>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              How to Make PDFs Accessible: A Complete Guide
            </h1>
            <div className="mt-4 flex items-center gap-4 text-sm text-caso-slate">
              <span>By CASO Comply</span>
              <span aria-hidden="true">&middot;</span>
              <time dateTime="2026-03-14">March 14, 2026</time>
              <span aria-hidden="true">&middot;</span>
              <span>8 min read</span>
            </div>
          </header>

          {/* Content */}
          <div className="space-y-6 text-caso-slate leading-relaxed">
            <p className="text-lg">
              PDF documents are everywhere &mdash; government agencies, universities, businesses, and nonprofits
              publish millions of them every year. But the vast majority of those PDFs are inaccessible to
              people who use screen readers, braille displays, and other assistive technologies. If your
              organization publishes PDFs, making them accessible is not just good practice &mdash; under
              ADA Title II, Section 508, and similar regulations, it may be a legal requirement.
            </p>

            <p>
              This guide walks you through everything you need to know about PDF accessibility: what it
              means, why it matters, the most common issues, and how to fix them.
            </p>

            <hr className="my-12 border-caso-border/50" />

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              What Makes a PDF Accessible?
            </h2>

            <p>
              An accessible PDF is one that can be read and navigated by assistive technologies. When a
              screen reader encounters a PDF, it relies on the document&apos;s internal structure to
              understand the content. A well-structured, accessible PDF provides all the information a
              sighted user would get from looking at the page &mdash; headings, paragraphs, images with
              descriptions, tables with headers, and a logical reading order.
            </p>

            <p>
              The two primary standards governing PDF accessibility are{" "}
              <strong className="text-caso-white">WCAG 2.1 Level AA</strong> (Web Content Accessibility
              Guidelines) and <strong className="text-caso-white">PDF/UA</strong> (ISO 14289, Universal
              Accessibility). WCAG provides the overall framework for digital accessibility, while PDF/UA
              defines the specific technical requirements for PDF files. A document that meets both
              standards is considered fully accessible.
            </p>

            <hr className="my-12 border-caso-border/50" />

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              Common PDF Accessibility Issues
            </h2>

            <p>
              Most PDFs fail accessibility checks for one or more of the following reasons. Understanding
              these issues is the first step toward fixing them.
            </p>

            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
              1. No Tags (Untagged PDFs)
            </h3>
            <p>
              Tags are the structural backbone of an accessible PDF. They tell assistive technologies what
              each element is &mdash; a heading, a paragraph, a list item, a table cell, or an image. An
              untagged PDF looks like a single undifferentiated block of text to a screen reader, making it
              nearly impossible to navigate. This is the single most common accessibility failure.
              PDFs exported from Word or other authoring tools without enabling the &quot;tagged PDF&quot;
              option will be untagged. Scanned documents converted to PDF are almost always untagged.
            </p>

            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
              2. Missing Alternative Text for Images
            </h3>
            <p>
              Every meaningful image in a PDF needs alternative text (alt text) that describes what the
              image conveys. Charts, graphs, diagrams, photographs, logos, and icons all need descriptions.
              Without alt text, a screen reader will either skip the image entirely or announce a meaningless
              filename like &quot;image_0042.png.&quot; Decorative images &mdash; those that add visual
              interest but carry no informational value &mdash; should be marked as artifacts so screen
              readers skip them intentionally.
            </p>

            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
              3. Incorrect Reading Order
            </h3>
            <p>
              The reading order of a PDF determines the sequence in which a screen reader encounters
              content. In a multi-column layout, the reading order might jump from the first column to
              the second column mid-sentence, or read a sidebar before the main content. Headers,
              footers, page numbers, and floating text boxes can all disrupt the logical flow. The tag
              tree must be ordered so that content is read in the same sequence a sighted reader would
              naturally follow.
            </p>

            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
              4. Tables Without Headers
            </h3>
            <p>
              Data tables need header cells (TH tags) so screen readers can associate each data cell with
              its column and row header. Without headers, a screen reader reads table cells in sequence
              without any context, making the data incomprehensible. Complex tables with merged cells,
              spanning headers, or nested structures require additional scope attributes to be interpreted
              correctly.
            </p>

            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
              5. Missing Document Language
            </h3>
            <p>
              The document must declare its primary language (such as English or Spanish) so screen
              readers use the correct pronunciation engine. Without a language declaration, a screen
              reader may attempt to read English text with a French pronunciation engine, rendering the
              content unintelligible. If the document contains passages in multiple languages, each
              passage should be tagged with the appropriate language attribute.
            </p>

            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
              6. No Bookmarks
            </h3>
            <p>
              Documents longer than a few pages should include bookmarks that mirror the heading
              structure. Bookmarks allow users to jump directly to specific sections without scrolling
              through the entire document. For a 50-page budget report or a 200-page comprehensive plan,
              bookmarks are essential for usability.
            </p>

            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
              7. Insufficient Color Contrast
            </h3>
            <p>
              Text must have sufficient contrast against its background. WCAG 2.1 AA requires a minimum
              contrast ratio of 4.5:1 for normal text and 3:1 for large text (18pt or 14pt bold). Light
              gray text on a white background, or colored text on a colored background, frequently fails
              this requirement. Information must also not be conveyed by color alone &mdash; a chart that
              uses only color to distinguish data series is inaccessible to colorblind users.
            </p>

            <hr className="my-12 border-caso-border/50" />

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              Step-by-Step: How to Remediate a PDF
            </h2>

            <p>
              Whether you are working with a single document or thousands, the remediation process
              follows the same general steps. Here is how to bring a non-compliant PDF into full
              accessibility compliance.
            </p>

            <div className="mt-8 space-y-8">
              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  1
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Run an Accessibility Check
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Before you fix anything, you need to understand what is broken. Use a tool like Adobe
                    Acrobat&apos;s built-in accessibility checker, PAC (PDF Accessibility Checker), or
                    veraPDF to scan the document and generate a report of all accessibility issues. This
                    gives you a roadmap for remediation.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  2
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Add or Fix the Tag Structure
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Open the document&apos;s tag tree and ensure every content element has the correct
                    tag. Headings should be tagged as H1, H2, H3, etc. in a logical hierarchy. Paragraphs
                    should be tagged as P. Lists should use L, LI, Lbl, and LBody tags. If the document
                    is untagged, you will need to add the entire tag structure from scratch &mdash; either
                    manually or using auto-tagging tools.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  3
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Write Alt Text for Images
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Review every image in the document and write descriptive alt text. Good alt text
                    is concise but informative &mdash; it should convey the same information the image
                    provides visually. For charts and graphs, describe the key data and trends. For
                    decorative images, mark them as artifacts. This is often the most time-consuming
                    step of manual remediation, especially for documents with complex diagrams or data
                    visualizations.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  4
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Fix the Reading Order
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Review the tag tree order and rearrange tags so that content flows logically. In
                    multi-column layouts, ensure each column is read completely before moving to the
                    next. Move headers, footers, and page numbers to the correct position. Test by
                    reading the tag tree top to bottom &mdash; does the content make sense in that order?
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  5
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Mark Up Tables Correctly
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    For every data table, ensure header cells are tagged as TH and data cells as TD.
                    Add scope attributes (row or column) to header cells so screen readers can
                    associate data with headers. For complex tables with multiple header rows or merged
                    cells, additional work is needed to make the relationships clear.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  6
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Set Document Metadata and Language
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Set the document title in the metadata properties (not just the filename). Declare
                    the primary language. Ensure the document is set to display the title (not the
                    filename) in the title bar. Add bookmarks that mirror your heading structure for
                    documents longer than a few pages.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  7
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Validate and Test
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Run the accessibility checker again to confirm all issues are resolved. Validate
                    against PDF/UA using veraPDF or PAC. Then perform a manual screen reader test &mdash;
                    open the document with NVDA, JAWS, or VoiceOver and listen to how the content is
                    read. Automated tools catch structural problems, but only a human can verify that
                    alt text is meaningful and the reading order makes logical sense.
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-12 border-caso-border/50" />

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              Manual vs. Automated Remediation
            </h2>

            <p>
              Manual PDF remediation using Adobe Acrobat Pro is thorough but extremely time-consuming.
              A skilled remediation specialist can spend 30 minutes to several hours on a single
              document, depending on complexity. For a government website with thousands of PDFs, manual
              remediation is not practical within any reasonable timeline or budget.
            </p>

            <p>
              Automated remediation tools use AI and machine learning to handle the bulk of the work.
              They can add tag structures, generate alt text, fix reading order, and mark up tables in
              minutes rather than hours. The best automated tools combine AI processing with
              standards-based validation to ensure the output meets PDF/UA requirements.
            </p>

            <p>
              The most effective approach is a hybrid: use automated tools to handle the heavy lifting,
              then apply human review for quality assurance on alt text, reading order logic, and edge
              cases that automation struggles with (such as complex multi-page tables or unusual
              document layouts).
            </p>

            <hr className="my-12 border-caso-border/50" />

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              Preventing Accessibility Issues at the Source
            </h2>

            <p>
              The most efficient way to have accessible PDFs is to create accessible source documents
              in the first place. If your team creates documents in Microsoft Word, Google Docs, or
              InDesign, following accessibility best practices during creation is far easier than
              remediating after the fact.
            </p>

            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong className="text-caso-white">Use built-in heading styles</strong> rather than
                manually formatting text to look like headings.
              </li>
              <li>
                <strong className="text-caso-white">Add alt text to images</strong> as you insert them,
                not after the fact.
              </li>
              <li>
                <strong className="text-caso-white">Use true table structures</strong> for tabular
                data, not spaces or tabs to align columns.
              </li>
              <li>
                <strong className="text-caso-white">Use bulleted and numbered list tools</strong>{" "}
                rather than manually typing numbers or dashes.
              </li>
              <li>
                <strong className="text-caso-white">Export as tagged PDF</strong> &mdash; in Word,
                check the &quot;Document structure tags for accessibility&quot; option when saving as
                PDF.
              </li>
            </ul>

            <p>
              Even with good source practices, exported PDFs should still be validated. Authoring tools
              do not always generate perfect tag structures, especially for complex layouts.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-20 rounded-2xl border border-caso-blue/30 bg-caso-blue/5 p-8 text-center md:p-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white md:text-3xl">
              Need help making your PDFs accessible?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-caso-slate">
              CASO Comply uses AI to remediate PDFs at scale &mdash; tags, alt text, reading order,
              tables, and metadata, all validated against PDF/UA standards. Start with a free scan to
              see how many of your documents need remediation.
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

          {/* Related Posts */}
          <div className="mt-20">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              Related Posts
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Link
                href="/blog/ada-title-ii-deadline-what-you-need-to-know"
                className="group rounded-xl border border-caso-border bg-caso-navy-light/30 p-6 transition-all hover:border-caso-blue/30 hover:bg-caso-navy-light/50"
              >
                <span className="inline-block rounded-full border border-caso-warm/50 bg-caso-warm/10 px-3 py-1 text-xs font-semibold text-caso-warm">
                  Compliance
                </span>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue transition-colors">
                  ADA Title II Deadline: What Government Agencies Need to Know in 2026
                </h3>
                <p className="mt-2 text-sm text-caso-slate">
                  The April 24, 2026 deadline has passed. What happened and what comes next.
                </p>
              </Link>
              <Link
                href="/blog/document-accessibility-policy-template"
                className="group rounded-xl border border-caso-border bg-caso-navy-light/30 p-6 transition-all hover:border-caso-blue/30 hover:bg-caso-navy-light/50"
              >
                <span className="inline-block rounded-full border border-caso-blue/50 bg-caso-blue/10 px-3 py-1 text-xs font-semibold text-caso-blue">
                  Guides
                </span>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue transition-colors">
                  Document Accessibility Policy Template for Government Agencies
                </h3>
                <p className="mt-2 text-sm text-caso-slate">
                  A practical, ready-to-adopt policy template with sample language.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </MarketingLayout>
  );
}
