import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title:
    "WCAG 2.1 AA Compliance Guide for PDFs and Documents | CASO Comply",
  description:
    "Complete guide to WCAG 2.1 AA compliance for PDF documents. Learn the four principles, specific success criteria for PDFs, common violations, testing methods, and how to achieve full WCAG 2.1 AA document accessibility.",
  keywords:
    "WCAG 2.1 AA compliance, WCAG 2.1 AA PDF requirements, WCAG document accessibility, WCAG success criteria PDFs, accessible PDF standards, WCAG 2.1 vs WCAG 2.0",
  openGraph: {
    title:
      "WCAG 2.1 AA Compliance Guide for PDFs and Documents | CASO Comply",
    description:
      "Complete guide to WCAG 2.1 AA compliance for PDF documents. Learn the four principles, specific success criteria for PDFs, common violations, and testing methods.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/resources/wcag-21-aa-guide",
  },
};

const TOC_ITEMS = [
  { id: "what-is-wcag", label: "What is WCAG 2.1 AA?" },
  { id: "four-principles", label: "The Four Principles of WCAG" },
  { id: "success-criteria-for-pdfs", label: "Key Success Criteria for PDFs" },
  { id: "wcag-21-vs-20", label: "WCAG 2.1 vs WCAG 2.0" },
  { id: "common-violations", label: "Common WCAG Violations in PDFs" },
  { id: "testing-pdfs", label: "How to Test PDFs for WCAG Compliance" },
  { id: "achieving-compliance", label: "Achieving WCAG 2.1 AA Compliance" },
  { id: "how-caso-helps", label: "How CASO Comply Helps" },
];

export default function WCAG21AAGuidePage() {
  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "WCAG 2.1 AA Compliance Guide for PDFs and Documents",
            description: "Complete guide to WCAG 2.1 AA compliance for PDF documents, covering the four principles, success criteria, common violations, and testing methods.",
            author: { "@type": "Organization", name: "CASO Comply" },
            publisher: { "@type": "Organization", name: "CASO Comply", url: "https://casocomply.com" },
            datePublished: "2025-02-01",
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
            WCAG 2.1 AA{" "}
            <span className="text-caso-blue">Compliance Guide</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-caso-slate">
            A comprehensive guide to understanding WCAG 2.1 AA as it applies to
            PDF documents and digital publications. Learn the principles, success
            criteria, common pitfalls, and how to ensure your documents meet the
            standard.
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
          <section id="what-is-wcag" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              1. What is WCAG 2.1 AA?
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                The{" "}
                <strong className="text-caso-white">
                  Web Content Accessibility Guidelines (WCAG)
                </strong>{" "}
                are a set of internationally recognized standards published by the
                World Wide Web Consortium (W3C) that define how to make digital
                content accessible to people with disabilities. While originally
                developed for websites, WCAG applies equally to digital documents,
                including PDFs, Word files, spreadsheets, and presentations.
              </p>
              <p>
                WCAG is organized into three conformance levels:{" "}
                <strong className="text-caso-white">Level A</strong> (minimum),{" "}
                <strong className="text-caso-white">Level AA</strong> (mid-range, and the most widely adopted legal standard), and{" "}
                <strong className="text-caso-white">Level AAA</strong> (highest).
                Level AA is the standard referenced by the ADA Title II final rule,
                Section 508 of the Rehabilitation Act, and most international
                accessibility laws.
              </p>
              <p>
                WCAG 2.1, published in June 2018, builds on WCAG 2.0 by adding 17
                new success criteria that address mobile accessibility, low vision,
                and cognitive disabilities. When a regulation requires &quot;WCAG 2.1
                Level AA,&quot; it means compliance with all Level A and Level AA
                success criteria from both WCAG 2.0 and the additional criteria
                introduced in 2.1.
              </p>
              <p>
                For organizations managing large volumes of PDF documents,
                understanding WCAG 2.1 AA is not optional — it is the technical
                benchmark against which your documents will be measured in any
                enforcement action, lawsuit, or audit.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 2 */}
          <section id="four-principles" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              2. The Four Principles of WCAG
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                WCAG is built on four foundational principles, often referred to by
                the acronym{" "}
                <strong className="text-caso-white">POUR</strong>. Every success
                criterion in the standard falls under one of these principles.
                Understanding them is key to understanding why specific technical
                requirements exist.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Perceivable
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Information and user interface components must be presentable to
                  users in ways they can perceive. This means providing text
                  alternatives for non-text content (images, charts, diagrams),
                  captions and audio descriptions for multimedia, and ensuring
                  content can be presented in different ways without losing
                  information. For PDFs, perceivability requires alt text on every
                  meaningful image, proper tagging so content structure is
                  programmatically determinable, and sufficient color contrast for
                  all text.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Operable
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  User interface components and navigation must be operable by all
                  users, including those who rely on keyboards, switch devices, or
                  voice control. In documents, this means interactive form fields
                  must be navigable via keyboard with a logical tab order, and
                  documents must have bookmarks or a table of contents to allow
                  non-sequential navigation. Links must have descriptive text so
                  users know where they lead without relying on visual context.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Understandable
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Information and the operation of the user interface must be
                  understandable. The document must declare its primary language so
                  screen readers use the correct pronunciation. Content should be
                  organized with clear headings and a logical reading order.
                  Abbreviations and unusual terms should be defined. For forms,
                  labels must clearly describe what input is expected, and error
                  messages must be descriptive and helpful.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Robust
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Content must be robust enough to be interpreted reliably by a wide
                  variety of user agents, including assistive technologies. For PDFs,
                  robustness requires proper tagged structure that conforms to PDF/UA
                  (ISO 14289), embedded fonts so text renders correctly on any
                  system, and valid document structure that current and future screen
                  readers, braille displays, and other assistive technologies can
                  parse without errors.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 3 */}
          <section id="success-criteria-for-pdfs" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              3. Key Success Criteria for PDFs
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                WCAG 2.1 AA contains 50 success criteria across Levels A and AA.
                While all are technically applicable, certain criteria are
                especially relevant — and commonly violated — in PDF documents.
                Below are the most critical ones to understand.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-caso-blue/10 px-2 py-1 text-xs font-bold text-caso-blue">
                    1.1.1
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Non-text Content (Level A)
                  </h3>
                </div>
                <p className="mt-3 text-sm text-caso-slate leading-relaxed">
                  All non-text content — images, charts, graphs, icons, logos —
                  must have a text alternative that serves the equivalent purpose.
                  In PDFs, this means every meaningful image must have alt text in
                  its tag properties. Decorative images must be marked as artifacts
                  so screen readers skip them entirely. This is the single most
                  commonly violated criterion in government PDFs.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-caso-blue/10 px-2 py-1 text-xs font-bold text-caso-blue">
                    1.3.1
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Info and Relationships (Level A)
                  </h3>
                </div>
                <p className="mt-3 text-sm text-caso-slate leading-relaxed">
                  Information, structure, and relationships conveyed through
                  presentation must also be programmatically determinable. In PDFs,
                  this means headings must be tagged as headings (H1-H6), lists
                  must be tagged as lists (L, LI), tables must have proper table
                  tags (Table, TR, TH, TD), and the visual hierarchy must match the
                  tag structure. A PDF that looks structured to a sighted reader but
                  has no tags is invisible to a screen reader.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-caso-blue/10 px-2 py-1 text-xs font-bold text-caso-blue">
                    1.3.2
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Meaningful Sequence (Level A)
                  </h3>
                </div>
                <p className="mt-3 text-sm text-caso-slate leading-relaxed">
                  When the sequence of content affects its meaning, a correct
                  reading sequence must be programmatically determinable. In PDFs
                  with multi-column layouts, sidebars, pull quotes, or complex page
                  designs, the reading order in the tag tree must reflect the logical
                  flow. A screen reader follows the tag order, not the visual
                  layout — if tags are in the wrong order, the content is
                  incomprehensible.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-caso-blue/10 px-2 py-1 text-xs font-bold text-caso-blue">
                    1.4.3
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Contrast (Minimum) (Level AA)
                  </h3>
                </div>
                <p className="mt-3 text-sm text-caso-slate leading-relaxed">
                  Text and images of text must have a contrast ratio of at least
                  4.5:1 against their background (3:1 for large text, defined as
                  18pt or 14pt bold). Many government PDFs use low-contrast design
                  elements — light gray text on white backgrounds, colored text on
                  colored backgrounds, or text over watermarks — that fail this
                  criterion.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-caso-blue/10 px-2 py-1 text-xs font-bold text-caso-blue">
                    2.4.2
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Page Titled (Level A)
                  </h3>
                </div>
                <p className="mt-3 text-sm text-caso-slate leading-relaxed">
                  Documents must have titles that describe their topic or purpose.
                  In PDFs, this means the document Title field in the metadata
                  properties must be set to a meaningful, descriptive title — not
                  just a filename like &quot;report_final_v3.pdf.&quot; The document
                  should also be configured to display the title (not the filename)
                  in the viewer title bar.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-caso-blue/10 px-2 py-1 text-xs font-bold text-caso-blue">
                    3.1.1
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Language of Page (Level A)
                  </h3>
                </div>
                <p className="mt-3 text-sm text-caso-slate leading-relaxed">
                  The default human language of the document must be
                  programmatically determinable. In PDFs, the language must be set in
                  the document catalog. Without a declared language, screen readers
                  cannot determine which pronunciation rules to apply, resulting in
                  garbled or unintelligible speech output for the user.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-caso-blue/10 px-2 py-1 text-xs font-bold text-caso-blue">
                    4.1.2
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Name, Role, Value (Level A)
                  </h3>
                </div>
                <p className="mt-3 text-sm text-caso-slate leading-relaxed">
                  For all user interface components (form fields, links, buttons),
                  the name, role, and value must be programmatically determinable.
                  In PDF forms, every field must have a descriptive label, the
                  correct form field type (text, checkbox, radio, dropdown), and its
                  current value must be accessible to assistive technologies.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 4 */}
          <section id="wcag-21-vs-20" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              4. WCAG 2.1 vs WCAG 2.0
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                WCAG 2.1 is a superset of WCAG 2.0 — it includes all of the
                original 2.0 success criteria plus 17 new ones. A document that
                conforms to WCAG 2.1 also conforms to WCAG 2.0, but not vice
                versa. Understanding the differences matters because some older
                tools and processes were designed for 2.0 compliance and may not
                address the newer criteria.
              </p>
              <p>
                The key additions in WCAG 2.1 that affect documents include:
              </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-caso-teal">
                  1.3.4 Orientation (AA)
                </p>
                <p className="mt-3 text-sm text-caso-slate leading-relaxed">
                  Content must not be restricted to a single display orientation
                  (portrait or landscape) unless a specific orientation is
                  essential. Documents should be viewable in both orientations.
                </p>
              </div>
              <div className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-caso-teal">
                  1.4.11 Non-text Contrast (AA)
                </p>
                <p className="mt-3 text-sm text-caso-slate leading-relaxed">
                  User interface components and graphical objects must have a
                  contrast ratio of at least 3:1 against adjacent colors. This
                  applies to form field borders, chart elements, and icons in PDFs.
                </p>
              </div>
              <div className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-caso-teal">
                  1.4.12 Text Spacing (AA)
                </p>
                <p className="mt-3 text-sm text-caso-slate leading-relaxed">
                  Content must remain readable and functional when users adjust
                  text spacing properties (line height, paragraph spacing, letter
                  spacing, word spacing). PDFs with fixed layouts can fail this
                  criterion if text overflows or gets clipped when spacing is
                  modified.
                </p>
              </div>
              <div className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-caso-teal">
                  1.4.10 Reflow (AA)
                </p>
                <p className="mt-3 text-sm text-caso-slate leading-relaxed">
                  Content must be presentable without loss of information at up to
                  400% zoom without requiring horizontal scrolling. This is
                  particularly challenging for PDF documents, which often have fixed
                  page dimensions.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-caso-slate leading-relaxed">
              <p>
                One important distinction: WCAG 2.0 was published in 2008 and was
                the basis for the original Section 508 refresh in 2017. The ADA
                Title II final rule of 2024 specifically adopted WCAG 2.1, not
                2.0, as the compliance standard. Organizations that achieved WCAG
                2.0 compliance in the past must verify they also meet the
                additional 2.1 criteria.
              </p>
              <p>
                Note that WCAG 2.2 was published in October 2023 and adds nine
                more success criteria. While WCAG 2.2 is not currently required by
                the ADA Title II rule, it represents the direction the standard is
                heading, and forward-thinking organizations may choose to target
                2.2 conformance.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 5 */}
          <section id="common-violations" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              5. Common WCAG Violations in PDFs
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                After scanning thousands of government PDF documents, certain
                accessibility failures appear with overwhelming frequency. These
                are the issues most likely to be flagged in an audit, enforcement
                action, or complaint.
              </p>
            </div>

            <div className="mt-8 space-y-8">
              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/50 bg-red-500/10 text-sm font-bold text-red-400">
                  1
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Missing or No Tags
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    The most fundamental failure. A PDF without tags is completely
                    opaque to assistive technologies. Screen readers cannot
                    identify headings, paragraphs, lists, or any structural
                    elements. The entire document reads as a single, unstructured
                    block of text — if it reads at all. Scanned PDFs (images of
                    text) have no tags and no selectable text, making them entirely
                    inaccessible.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/50 bg-red-500/10 text-sm font-bold text-red-400">
                  2
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Missing Alternative Text
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Images, charts, graphs, logos, and other visual elements without
                    alt text are invisible to screen reader users. Even when alt text
                    exists, it is frequently inadequate — describing an image as
                    &quot;chart&quot; rather than conveying the data the chart
                    represents. Every meaningful visual element needs alt text that
                    provides equivalent information.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/50 bg-red-500/10 text-sm font-bold text-red-400">
                  3
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Incorrect Reading Order
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Multi-column documents, pages with sidebars, or PDFs generated
                    from complex layouts often have reading orders that jump between
                    columns, read footnotes in the middle of body text, or present
                    content in an order that makes no logical sense. The visual
                    layout may look correct, but the underlying tag order is
                    scrambled.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/50 bg-red-500/10 text-sm font-bold text-red-400">
                  4
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Missing Document Language
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    A surprisingly common failure that is easy to fix but routinely
                    overlooked. Without a declared language, screen readers default
                    to the user&apos;s system language setting, which may result in
                    English text being read with Spanish pronunciation rules or vice
                    versa. Setting the document language takes seconds but is missed
                    in the vast majority of PDFs.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/50 bg-red-500/10 text-sm font-bold text-red-400">
                  5
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    No Bookmarks
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Documents with more than a few pages need bookmarks for
                    navigation. Without bookmarks, users of assistive technologies
                    must navigate sequentially through every page to find the
                    section they need. For a 100-page budget document, this makes
                    the content effectively unusable. Bookmarks should mirror the
                    heading structure of the document.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/50 bg-red-500/10 text-sm font-bold text-red-400">
                  6
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Untagged Tables
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Data tables without proper table tags, header cells, and scope
                    attributes are extremely difficult for screen reader users to
                    interpret. Without headers, a screen reader reads each cell as
                    an isolated value with no context — the user has no way to know
                    which column or row a value belongs to. Government documents
                    are heavy with tabular data, making this a pervasive issue.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 6 */}
          <section id="testing-pdfs" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              6. How to Test PDFs for WCAG Compliance
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                Testing PDF accessibility requires a combination of automated tools
                and manual verification. No single tool catches everything, and
                some criteria — like alt text quality — require human judgment.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Automated Validation Tools
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  <strong className="text-caso-white">veraPDF</strong> is the
                  industry-standard open-source PDF/UA validator. It checks
                  structural conformance against ISO 14289-1 (PDF/UA-1) and reports
                  every violation with specific rule references.{" "}
                  <strong className="text-caso-white">PAC (PDF Accessibility Checker)</strong>,
                  developed by the Swiss accessibility foundation, provides a
                  user-friendly interface with detailed reports and a screen reader
                  preview. Adobe Acrobat Pro also includes a built-in accessibility
                  checker, though it is less comprehensive than veraPDF or PAC.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Manual Testing with Screen Readers
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Automated tools catch structural issues but cannot evaluate the
                  quality of alt text, the logic of reading order, or the overall
                  user experience. Testing with an actual screen reader (NVDA,
                  JAWS, or VoiceOver) reveals how a real user will experience the
                  document. Listen to the entire document being read aloud —
                  does it make sense? Can you navigate by headings? Do table
                  headers announce correctly?
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Adobe Acrobat Accessibility Check
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Adobe Acrobat Pro includes an accessibility checker under
                  Tools &gt; Accessibility &gt; Full Check. This runs through
                  common issues including document title, language, tags, reading
                  order, alt text, and table structure. While not as thorough as
                  veraPDF, it provides a good first-pass assessment and allows you
                  to fix many issues directly within Acrobat.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Color Contrast Analysis
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Use contrast checking tools like the Colour Contrast Analyser
                  (CCA) to verify that text in your PDF meets the 4.5:1 ratio for
                  normal text and 3:1 for large text. Pay special attention to text
                  over colored backgrounds, watermarks, or images. Automated PDF
                  checkers may not always catch contrast failures, so manual spot
                  checking is important.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 7 */}
          <section id="achieving-compliance" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              7. Achieving WCAG 2.1 AA Compliance
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                Bringing existing PDF documents into WCAG 2.1 AA compliance is a
                process known as remediation. The scope of the effort depends on
                how many documents you have and how they were originally created.
              </p>
              <p>
                For a typical government entity with hundreds or thousands of PDFs,
                the remediation process involves:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong className="text-caso-white">Document inventory</strong> —
                  Identifying and cataloging every PDF published on your website.
                </li>
                <li>
                  <strong className="text-caso-white">Triage and prioritization</strong> —
                  Categorizing documents by traffic, legal significance, and
                  remediation complexity to determine which to fix first.
                </li>
                <li>
                  <strong className="text-caso-white">Automated tagging</strong> —
                  Using AI-powered tools to automatically add tags, structure, and
                  alt text to documents at scale.
                </li>
                <li>
                  <strong className="text-caso-white">Quality review</strong> —
                  Verifying that automated remediation produced correct results,
                  especially for complex layouts, tables, and images.
                </li>
                <li>
                  <strong className="text-caso-white">Validation</strong> —
                  Running every remediated document through veraPDF or PAC to
                  confirm PDF/UA conformance.
                </li>
                <li>
                  <strong className="text-caso-white">Process integration</strong> —
                  Updating your document creation workflows so all new documents
                  are accessible from the start.
                </li>
              </ul>
              <p>
                Manual remediation of a single complex PDF can take 2-4 hours.
                For organizations with thousands of documents, AI-powered
                automation is not just helpful — it is the only way to meet
                deadlines at a feasible cost.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 8 */}
          <section id="how-caso-helps" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              8. How CASO Comply Helps
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                CASO Comply is purpose-built for the WCAG 2.1 AA document
                compliance challenge. Our AI-powered platform automates the
                remediation process at a fraction of the cost and time of manual
                methods.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                AI-Powered Tagging and Structure
              </h3>
              <p>
                Our{" "}
                <Link
                  href="/services/pdf-remediation"
                  className="text-caso-blue underline decoration-caso-blue/30 transition-colors hover:text-caso-blue-bright hover:decoration-caso-blue"
                >
                  PDF remediation engine
                </Link>{" "}
                automatically detects document structure — headings, paragraphs,
                lists, tables, images — and applies correct WCAG-compliant tags.
                AI generates descriptive alt text for images, charts, and
                diagrams, going beyond simple labels to convey the actual
                information the visual content provides.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Automated Validation
              </h3>
              <p>
                Every remediated document is automatically validated against PDF/UA
                (ISO 14289) standards using veraPDF. You receive a compliance
                certificate for every document that passes, providing an auditable
                record of your compliance efforts.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Free Compliance Scan
              </h3>
              <p>
                Not sure how your documents measure up against WCAG 2.1 AA? Our{" "}
                <Link
                  href="/free-scan"
                  className="text-caso-blue underline decoration-caso-blue/30 transition-colors hover:text-caso-blue-bright hover:decoration-caso-blue"
                >
                  free compliance scan
                </Link>{" "}
                crawls your website, identifies every document, and produces a
                detailed report showing your current compliance status. No
                commitment required.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-20 rounded-2xl border border-caso-blue/30 bg-caso-blue/5 p-8 text-center md:p-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white md:text-3xl">
              Check your WCAG 2.1 AA compliance.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-caso-slate">
              Find out how your PDF documents measure up against WCAG 2.1 AA
              standards. Our free scan identifies every accessibility issue across
              your entire document library.
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
