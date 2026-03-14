import MarketingLayout from "@/components/MarketingLayout";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Section 508 Compliance & Document Remediation — CASO Comply",
  description:
    "Achieve Section 508 compliance for your documents with AI-powered remediation. CASO Comply helps federal agencies, contractors, and grant recipients meet Section 508 document remediation requirements.",
  openGraph: {
    title: "Section 508 Compliance & Document Remediation — CASO Comply",
    description:
      "Achieve Section 508 compliance for your documents with AI-powered remediation. CASO Comply helps federal agencies, contractors, and grant recipients meet Section 508 document remediation requirements.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/services/section-508-compliance",
  },
};

const WHO_NEEDS_508 = [
  {
    title: "Federal Agencies",
    description:
      "All U.S. federal agencies must ensure their electronic and information technology — including PDF documents — is accessible to employees and members of the public with disabilities.",
  },
  {
    title: "Federal Contractors",
    description:
      "Any organization that sells products or services to the federal government must meet Section 508 standards. Non-compliance can disqualify you from federal procurement.",
  },
  {
    title: "Grant Recipients",
    description:
      "Organizations that receive federal funding — including state agencies, universities, nonprofits, and research institutions — are often required to comply with Section 508 as a condition of their grant.",
  },
  {
    title: "State & Local Government",
    description:
      "Many state governments have adopted Section 508 as their own accessibility standard, extending the same requirements to state agencies and their vendors.",
  },
];

const DOCUMENT_REQUIREMENTS = [
  {
    title: "Tagged PDF Structure",
    description:
      "Every PDF must contain a logical tag tree that identifies headings, paragraphs, lists, tables, and other structural elements so assistive technologies can interpret the content.",
  },
  {
    title: "Reading Order",
    description:
      "Content must be presented in a meaningful reading sequence. Screen readers follow the tag order, not the visual layout — so the underlying structure must match the intended reading flow.",
  },
  {
    title: "Alternative Text",
    description:
      "All non-decorative images, charts, graphs, and diagrams must include descriptive alternative text that conveys the same information to users who cannot see the visual content.",
  },
  {
    title: "Table Markup",
    description:
      "Data tables must have properly marked row and column headers. Complex tables with merged cells or multi-level headers require explicit header-cell associations.",
  },
  {
    title: "Form Accessibility",
    description:
      "Interactive form fields must have associated labels, logical tab order, and clear instructions. Required fields and validation errors must be programmatically conveyed.",
  },
  {
    title: "Color & Contrast",
    description:
      "Text must meet minimum contrast ratios (4.5:1 for normal text, 3:1 for large text). Information cannot be conveyed by color alone — patterns or labels must supplement color cues.",
  },
  {
    title: "Document Language",
    description:
      "The primary language of the document must be specified in the metadata so screen readers apply the correct pronunciation rules. Language changes within the document must also be marked.",
  },
  {
    title: "Bookmarks & Navigation",
    description:
      "Documents longer than a few pages must include bookmarks that mirror the heading structure, allowing users to navigate directly to specific sections without scrolling.",
  },
];

const HOW_WE_HELP = [
  {
    title: "Automated Remediation",
    description:
      "Our AI engine analyzes each document, builds a compliant tag structure, sets reading order, generates alt text, and marks up tables — all without manual intervention. Most documents are fully remediated in under a minute.",
  },
  {
    title: "VPAT Generation Support",
    description:
      "We provide detailed compliance reports that map directly to VPAT (Voluntary Product Accessibility Template) criteria, making it straightforward to document your 508 conformance for procurement officers.",
  },
  {
    title: "Compliance Certificates",
    description:
      "Each remediated document can be accompanied by a Certificate of Compliance that attests to its conformance with Section 508 standards — documentation you can present during audits or procurement reviews.",
  },
  {
    title: "veraPDF Validation",
    description:
      "Every output document is validated against the PDF/UA standard using veraPDF, the industry-standard open-source validator. You receive a machine-verified guarantee, not just a promise.",
  },
];

const DIFFERENCES = [
  {
    aspect: "Who it applies to",
    section508:
      "Federal agencies, federal contractors, and organizations receiving federal funding.",
    adaTitle2:
      "State and local government entities, regardless of federal funding.",
  },
  {
    aspect: "Legal basis",
    section508:
      "Section 508 of the Rehabilitation Act of 1973, as amended in 2017.",
    adaTitle2:
      "Title II of the Americans with Disabilities Act of 1990, with 2024 rulemaking update.",
  },
  {
    aspect: "Technical standard",
    section508:
      "Incorporates WCAG 2.0 Level AA by reference (with the 2017 Refresh).",
    adaTitle2:
      "References WCAG 2.1 Level AA under the 2024 DOJ final rule.",
  },
  {
    aspect: "Scope",
    section508:
      "Electronic and information technology: documents, software, websites, hardware, and telecommunications.",
    adaTitle2:
      "Web content and mobile applications of state and local government entities.",
  },
  {
    aspect: "Enforcement",
    section508:
      "Complaints to the agency, administrative remedies, or lawsuits under the Rehabilitation Act.",
    adaTitle2:
      "DOJ enforcement actions, private lawsuits, and compliance reviews.",
  },
  {
    aspect: "Deadlines",
    section508:
      "Ongoing obligation — no phase-in period. Agencies must comply now.",
    adaTitle2:
      "Population ≥50K: April 24, 2026. Population <50K: April 26, 2027.",
  },
];

export default function Section508CompliancePage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="border-b border-caso-border/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Section 508 Compliance for Documents
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-caso-slate md:text-xl">
            Section 508 of the Rehabilitation Act requires federal agencies and
            their partners to make electronic content accessible to people with
            disabilities. For PDF documents, that means proper tagging, reading
            order, alt text, and structural markup — and CASO Comply automates
            the entire process.
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
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>

      {/* What Section 508 Requires */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="requirements"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="requirements"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            What Section 508 Requires for Documents
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            The 2017 Section 508 Refresh aligned federal accessibility standards
            with WCAG 2.0 Level AA. For PDF documents, this translates into
            specific technical requirements.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DOCUMENT_REQUIREMENTS.map((item) => (
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

      {/* Who Needs 508 */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="who-needs"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="who-needs"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            Who Needs Section 508 Compliance?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            Section 508 applies to more organizations than many realize. If your
            organization touches federal systems or funding, you likely have
            compliance obligations.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {WHO_NEEDS_508.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-caso-border bg-caso-navy-light p-8"
              >
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
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
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="how-we-help"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="how-we-help"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            How CASO Comply Achieves 508 Compliance
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            Our platform combines AI-powered automation with industry-standard
            validation to deliver fast, reliable Section 508 compliance at
            scale.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {HOW_WE_HELP.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-caso-border bg-caso-navy-light p-8"
              >
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-glacier">
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

      {/* Section 508 vs ADA Title II */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="508-vs-ada"
      >
        <div className="mx-auto max-w-5xl">
          <h2
            id="508-vs-ada"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            Section 508 vs. ADA Title II
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-caso-slate">
            Both laws require accessible documents, but they apply to different
            organizations with different enforcement mechanisms. Many
            government entities must comply with both.
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
                      Aspect
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-caso-glacier"
                    >
                      Section 508
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-caso-glacier"
                    >
                      ADA Title II
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DIFFERENCES.map((row, index) => (
                    <tr
                      key={row.aspect}
                      className={
                        index < DIFFERENCES.length - 1
                          ? "border-b border-caso-border/50"
                          : ""
                      }
                    >
                      <td className="px-6 py-4 font-semibold">
                        {row.aspect}
                      </td>
                      <td className="px-6 py-4 text-sm text-caso-slate">
                        {row.section508}
                      </td>
                      <td className="px-6 py-4 text-sm text-caso-slate">
                        {row.adaTitle2}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* WCAG 2.1 AA Relationship */}
      <section
        className="border-b border-caso-border/50 px-6 py-20"
        aria-labelledby="wcag-relationship"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="wcag-relationship"
            className="text-center font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl"
          >
            How Section 508 Relates to WCAG 2.1 AA
          </h2>
          <div className="mt-12 space-y-8">
            <div className="rounded-xl border border-caso-border bg-caso-navy-light p-8">
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-glacier">
                The 2017 Refresh
              </h3>
              <p className="mt-3 leading-relaxed text-caso-slate">
                The 2017 Section 508 Refresh eliminated the previous set of
                technology-specific requirements and replaced them with a direct
                incorporation of WCAG 2.0 Level AA. This means that if your
                documents meet WCAG 2.0 AA, they satisfy the technical
                requirements of Section 508.
              </p>
            </div>
            <div className="rounded-xl border border-caso-border bg-caso-navy-light p-8">
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-glacier">
                Why We Target WCAG 2.1 AA
              </h3>
              <p className="mt-3 leading-relaxed text-caso-slate">
                WCAG 2.1 is a superset of WCAG 2.0 — every WCAG 2.0 criterion
                is included in 2.1. By remediating to the newer 2.1 AA standard,
                CASO Comply ensures your documents exceed Section 508
                requirements while also satisfying ADA Title II, EN 301 549
                (European standard), and other frameworks that reference WCAG
                2.1. One remediation pass covers all your compliance
                obligations.
              </p>
            </div>
            <div className="rounded-xl border border-caso-border bg-caso-navy-light p-8">
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-glacier">
                PDF/UA and Section 508
              </h3>
              <p className="mt-3 leading-relaxed text-caso-slate">
                PDF/UA (ISO 14289) is the international standard specifically
                for accessible PDFs. While Section 508 does not explicitly
                require PDF/UA conformance, meeting PDF/UA is the most reliable
                way to demonstrate that a PDF satisfies the WCAG success
                criteria referenced by Section 508. CASO Comply validates every
                output document against PDF/UA using the veraPDF validator.
              </p>
            </div>
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
            Start your path to Section 508 compliance
          </h2>
          <p className="mt-4 text-lg text-caso-slate">
            Run a free scan to identify accessibility issues across your
            document library, or talk to our team about a remediation plan
            tailored to your agency or organization.
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
              Contact Sales
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
                Full-service PDF accessibility remediation with three service
                tiers to match your compliance needs.
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
                Scan your entire website to find every PDF and assess its
                accessibility compliance status.
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
                Remediate thousands of documents at scale with automated
                parallel processing.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
