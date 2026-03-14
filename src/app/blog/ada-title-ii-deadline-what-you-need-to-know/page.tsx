import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title:
    "ADA Title II Deadline: What Government Agencies Need to Know in 2026 | CASO Comply",
  description:
    "The April 24, 2026 ADA Title II deadline for large government agencies is just weeks away. Learn what it means, the consequences of non-compliance, and how smaller agencies can prepare for the April 2027 deadline.",
  openGraph: {
    title:
      "ADA Title II Deadline: What Government Agencies Need to Know in 2026",
    description:
      "The April 24, 2026 ADA Title II deadline is imminent for agencies serving 50,000+ residents. Here is what comes next.",
    type: "article",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" },
    ],
  },
  alternates: {
    canonical: "/blog/ada-title-ii-deadline-what-you-need-to-know",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "ADA Title II Deadline: What Government Agencies Need to Know in 2026",
  description:
    "The April 24, 2026 ADA Title II deadline for large government agencies is imminent. Learn what happened and how to prepare for the next deadline.",
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

export default function ADADeadlinePage() {
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
            <span className="inline-block rounded-full border border-caso-warm/50 bg-caso-warm/10 px-3 py-1 text-xs font-semibold text-caso-warm">
              Compliance
            </span>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              ADA Title II Deadline: What Government Agencies Need to Know in
              2026
            </h1>
            <div className="mt-4 flex items-center gap-4 text-sm text-caso-slate">
              <span>By CASO Comply</span>
              <span aria-hidden="true">&middot;</span>
              <time dateTime="2026-03-14">March 14, 2026</time>
              <span aria-hidden="true">&middot;</span>
              <span>9 min read</span>
            </div>
          </header>

          {/* Content */}
          <div className="space-y-6 text-caso-slate leading-relaxed">
            {/* Urgent callout */}
            <div className="rounded-2xl border border-caso-red/50 bg-caso-red/5 p-6">
              <p className="text-sm font-semibold text-red-400">
                Deadline Update &mdash; March 14, 2026
              </p>
              <p className="mt-2 text-caso-white">
                The first ADA Title II digital accessibility deadline &mdash;{" "}
                <strong>April 24, 2026</strong> &mdash; is just weeks away.
                Government entities serving populations of 50,000 or more must
                have all web content and digital documents compliant with WCAG
                2.1 AA by that date. If your agency has not started remediation,
                the time to act is now.
              </p>
            </div>

            <p className="text-lg">
              In April 2024, the Department of Justice published the final rule
              under ADA Title II that, for the first time, establishes clear
              technical standards for digital accessibility. State and local
              governments must make their web content &mdash; including all
              published PDF documents, Word files, spreadsheets, and
              presentations &mdash; conform to WCAG 2.1 Level AA. The rule
              created two compliance deadlines based on population size, and the
              first of those deadlines is now imminent.
            </p>

            <hr className="my-12 border-caso-border/50" />

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              The Two Deadlines
            </h2>

            <p>
              The DOJ established a tiered deadline structure based on the
              population served by each government entity:
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-caso-red/50 bg-caso-red/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Deadline 1
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-black text-caso-white">
                  April 24, 2026
                </p>
                <p className="mt-2 text-sm text-caso-slate">
                  Entities serving{" "}
                  <strong className="text-caso-white">
                    50,000 or more
                  </strong>{" "}
                  residents.
                </p>
                <p className="mt-4 rounded-lg bg-caso-red/10 px-3 py-2 text-xs font-semibold text-red-400">
                  Less than 6 weeks away
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
                  <strong className="text-caso-white">
                    fewer than 50,000
                  </strong>{" "}
                  residents.
                </p>
                <p className="mt-4 rounded-lg bg-caso-warm/10 px-3 py-2 text-xs font-semibold text-caso-warm">
                  About 13 months away
                </p>
              </div>
            </div>

            <p>
              Population size is determined using the most recent Census data.
              For entities serving multiple jurisdictions, such as regional
              transit authorities or multi-county districts, the total combined
              population is used. There is no grace period, no extension
              mechanism, and no grandfather clause for existing content.
            </p>

            <hr className="my-12 border-caso-border/50" />

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              Who Is Affected?
            </h2>

            <p>
              ADA Title II covers every state and local government entity in the
              United States. This is not limited to city websites &mdash; it
              includes:
            </p>

            <ul className="ml-6 list-disc space-y-2">
              <li>State agencies and departments</li>
              <li>Counties and municipalities</li>
              <li>Public school districts (K-12)</li>
              <li>Public colleges and universities</li>
              <li>Public libraries and library systems</li>
              <li>Courts and judicial systems</li>
              <li>Public transit authorities</li>
              <li>Public utilities and special districts</li>
              <li>Law enforcement agencies</li>
              <li>Public health departments and hospitals</li>
            </ul>

            <p>
              Any organization that operates as a function of state or local
              government is covered, regardless of its size. The only difference
              is the timeline: larger entities face the April 2026 deadline,
              while smaller ones have until April 2027.
            </p>

            <hr className="my-12 border-caso-border/50" />

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              What Content Must Be Accessible?
            </h2>

            <p>
              The rule applies to all web content and digital documents published
              by the entity. This includes:
            </p>

            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong className="text-caso-white">Web pages</strong> &mdash;
                All pages on the entity&apos;s website must meet WCAG 2.1 AA.
              </li>
              <li>
                <strong className="text-caso-white">PDF documents</strong>{" "}
                &mdash; Meeting agendas, minutes, budgets, reports, forms,
                permits, ordinances, plans, and any other PDFs posted online.
              </li>
              <li>
                <strong className="text-caso-white">
                  Office documents
                </strong>{" "}
                &mdash; Word documents, Excel spreadsheets, and PowerPoint
                presentations available for download.
              </li>
              <li>
                <strong className="text-caso-white">
                  Multimedia content
                </strong>{" "}
                &mdash; Videos, audio recordings, and interactive content.
              </li>
            </ul>

            <p>
              A critical detail: the rule applies to{" "}
              <strong className="text-caso-white">
                all currently published content
              </strong>
              , not just new content created after the rule took effect. If a PDF
              from 2018 is still available on your website, it must be made
              accessible by the deadline. For many government websites, this
              means remediating hundreds or thousands of legacy documents.
            </p>

            <hr className="my-12 border-caso-border/50" />

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              Consequences of Missing the Deadline
            </h2>

            <p>
              The consequences of non-compliance are real and significant. Here
              is what government agencies face:
            </p>

            <div className="mt-6 space-y-6">
              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  DOJ Enforcement Actions
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  The Department of Justice has actively enforced digital
                  accessibility requirements against government entities for
                  years, even before the new rule. With explicit deadlines now in
                  place, enforcement is expected to intensify. The DOJ can
                  initiate investigations based on complaints, advocacy
                  organization referrals, or its own monitoring.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Civil Penalties
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Financial penalties for ADA violations can reach{" "}
                  <strong className="text-caso-white">
                    $75,000 for a first offense
                  </strong>{" "}
                  and{" "}
                  <strong className="text-caso-white">
                    $150,000 for subsequent violations
                  </strong>
                  . These are assessed per violation &mdash; and with hundreds or
                  thousands of inaccessible documents on a typical government
                  website, the financial exposure is enormous.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Private Lawsuits
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Individuals and disability rights organizations can file
                  lawsuits against non-compliant entities. The legal costs of
                  defending an accessibility lawsuit &mdash; including
                  attorney&apos;s fees, settlement costs, and the cost of
                  court-ordered remediation &mdash; typically far exceed what
                  proactive compliance would have cost.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Loss of Federal Funding
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Federal agencies may condition grants and contracts on
                  demonstrated ADA compliance. Non-compliant government entities
                  risk losing access to federal funding that supports critical
                  programs and services.
                </p>
              </div>
            </div>

            <hr className="my-12 border-caso-border/50" />

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              What to Do Right Now
            </h2>

            <p>
              Whether your deadline is April 2026 or April 2027, here is a
              practical action plan:
            </p>

            <div className="mt-8 space-y-8">
              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  1
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Audit Your Current State
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Crawl your website to identify every document that is
                    publicly available. Run automated accessibility checks on
                    each one. You need to know the scope of the problem: how
                    many documents do you have, how many are non-compliant, and
                    what types of issues exist? A free compliance scan from CASO
                    Comply can give you this picture in hours, not weeks.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  2
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Prioritize High-Risk Documents
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Not every document carries equal risk. Focus first on
                    high-traffic content (budgets, meeting agendas, public
                    notices), legally mandated publications, and documents tied
                    to critical services like permits, applications, and public
                    health information. Documents that are outdated or rarely
                    accessed may be candidates for removal rather than
                    remediation.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  3
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Remediate at Scale
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Manual remediation of individual PDFs is not feasible at
                    government scale. A mid-size city might have 5,000 to
                    20,000 PDFs on its website. At 1-2 hours per document for
                    manual remediation, that is 5,000 to 40,000 hours of work.
                    AI-powered remediation tools like CASO Comply can process
                    the same volume in days, not years, at a fraction of the
                    cost.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  4
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Establish Ongoing Processes
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Compliance is not a one-time project. Every new document
                    published to your website must be accessible from day one.
                    Train staff on accessible document creation, integrate
                    accessibility checks into your publishing workflow, and set
                    up automated monitoring to catch new non-compliant content
                    before it reaches the public.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  5
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Document Your Compliance Efforts
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Keep records of your compliance activities: audits performed,
                    documents remediated, staff trained, and policies adopted.
                    In the event of a complaint or investigation, demonstrating
                    a good-faith effort toward compliance can significantly
                    impact the outcome. A formal document accessibility policy
                    is a key part of this documentation.
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-12 border-caso-border/50" />

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              For Agencies Approaching the April 2026 Deadline
            </h2>

            <p>
              If your agency serves 50,000 or more residents and has not yet
              achieved full compliance, the situation is urgent but not hopeless.
              Here is what matters:
            </p>

            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong className="text-caso-white">
                  Start immediately.
                </strong>{" "}
                Being late but actively remediating is far better than having no
                plan at all. Demonstrating progress matters.
              </li>
              <li>
                <strong className="text-caso-white">
                  Prioritize ruthlessly.
                </strong>{" "}
                Focus on the highest-traffic, highest-risk documents first. Get
                your most-visited PDFs compliant as fast as possible.
              </li>
              <li>
                <strong className="text-caso-white">
                  Adopt a formal policy.
                </strong>{" "}
                A published document accessibility policy signals organizational
                commitment and provides a framework for ongoing compliance.
              </li>
              <li>
                <strong className="text-caso-white">
                  Use automated tools.
                </strong>{" "}
                Manual remediation cannot close a large compliance gap quickly
                enough. AI-powered tools can process thousands of documents in
                the time it takes to manually fix a few dozen.
              </li>
              <li>
                <strong className="text-caso-white">
                  Seek legal counsel.
                </strong>{" "}
                Consult with your legal team about risk mitigation strategies
                specific to your jurisdiction and situation.
              </li>
            </ul>

            <hr className="my-12 border-caso-border/50" />

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              For Agencies Facing the April 2027 Deadline
            </h2>

            <p>
              Agencies serving fewer than 50,000 residents have until April 26,
              2027. That may seem like ample time, but the experience of larger
              agencies approaching the 2026 deadline has shown that document
              remediation at any scale takes longer than most organizations
              expect. Starting now gives you the advantage of time.
            </p>

            <p>
              Use the next 13 months to audit your content, adopt an
              accessibility policy, begin remediation, and train your staff.
              Agencies that start early avoid the scramble and cost premium that
              comes with last-minute compliance efforts.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-20 rounded-2xl border border-caso-blue/30 bg-caso-blue/5 p-8 text-center md:p-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white md:text-3xl">
              Know where you stand.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-caso-slate">
              Get a free compliance scan of your website. We will identify every
              inaccessible document and show you exactly what needs to be fixed
              &mdash; no commitment required.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/free-scan"
                className="rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-base font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
              >
                Get a Free Compliance Scan
              </Link>
              <Link
                href="/solutions/government"
                className="rounded-xl border border-caso-border bg-transparent px-8 py-4 font-[family-name:var(--font-display)] text-base font-bold text-caso-white transition-all hover:border-caso-blue hover:bg-caso-navy-light"
              >
                Government Solutions
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
                href="/blog/how-to-make-pdfs-accessible"
                className="group rounded-xl border border-caso-border bg-caso-navy-light/30 p-6 transition-all hover:border-caso-blue/30 hover:bg-caso-navy-light/50"
              >
                <span className="inline-block rounded-full border border-caso-blue/50 bg-caso-blue/10 px-3 py-1 text-xs font-semibold text-caso-blue">
                  Guides
                </span>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue transition-colors">
                  How to Make PDFs Accessible: A Complete Guide
                </h3>
                <p className="mt-2 text-sm text-caso-slate">
                  Step-by-step instructions for remediating your documents.
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
                  A practical, ready-to-adopt policy template with sample
                  language.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </MarketingLayout>
  );
}
