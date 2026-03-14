import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title:
    "The Cost of ADA Non-Compliance: Financial Risk of Inaccessible Documents | CASO Comply",
  description:
    "Understand the real financial cost of ADA non-compliance. Learn about DOJ enforcement actions, lawsuit trends, settlement amounts ($50k-$500k+), reputational damage, and why proactive PDF remediation costs a fraction of legal defense.",
  keywords:
    "cost of ADA non-compliance, ADA compliance for websites, ADA lawsuit settlements, ADA enforcement actions, cost of accessibility remediation, ADA Title II penalties, document accessibility ROI",
  openGraph: {
    title:
      "The Cost of ADA Non-Compliance: Financial Risk of Inaccessible Documents | CASO Comply",
    description:
      "Understand the real financial cost of ADA non-compliance. DOJ enforcement, lawsuit trends, settlement amounts, and why remediation costs a fraction of legal defense.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/resources/cost-of-non-compliance",
  },
};

const TOC_ITEMS = [
  { id: "financial-reality", label: "The Financial Reality" },
  { id: "doj-enforcement", label: "DOJ Enforcement Actions" },
  { id: "lawsuit-trends", label: "Lawsuit Trends" },
  { id: "settlement-costs", label: "Settlement and Legal Costs" },
  { id: "reputational-damage", label: "Reputational Damage" },
  { id: "lost-audience", label: "The Lost Audience" },
  { id: "cost-comparison", label: "Remediation vs Legal Defense" },
  { id: "roi-of-accessibility", label: "ROI of Accessibility" },
  { id: "risk-management", label: "Insurance and Risk Management" },
  { id: "take-action", label: "Take Action Now" },
];

export default function CostOfNonCompliancePage() {
  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "The Cost of ADA Non-Compliance: Financial Risk of Inaccessible Documents",
            description: "Analysis of the financial costs of ADA non-compliance, including enforcement actions, lawsuit trends, settlement amounts, and the ROI of proactive document accessibility.",
            author: { "@type": "Organization", name: "CASO Comply" },
            publisher: { "@type": "Organization", name: "CASO Comply", url: "https://casocomply.com" },
            datePublished: "2025-03-15",
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
            The Cost of{" "}
            <span className="text-caso-blue">Non-Compliance</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-caso-slate">
            The financial, legal, and reputational consequences of failing to
            make your documents accessible. Why proactive remediation is a
            fraction of the cost of inaction.
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
          <section id="financial-reality" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              1. The Financial Reality
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                Many organizations treat document accessibility as a future
                concern — something to address when budget allows or when
                regulations are &quot;finalized.&quot; The regulations are
                finalized. The ADA Title II rule was published in April 2024,
                and the first compliance deadline for government entities serving
                50,000+ residents is{" "}
                <strong className="text-caso-white">April 24, 2026</strong> —
                less than two months from now.
              </p>
              <p>
                The cost of non-compliance is not hypothetical. It is measured in
                DOJ investigations, private lawsuits, settlement payments, legal
                fees, remediation costs under duress, and the reputational harm
                of being publicly identified as an organization that fails to
                serve people with disabilities.
              </p>
              <p>
                This guide lays out the real financial exposure of non-compliance
                and demonstrates why investing in proactive remediation is not
                just the right thing to do — it is the financially prudent
                decision.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 2 */}
          <section id="doj-enforcement" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              2. DOJ Enforcement Actions
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                The Department of Justice has actively enforced digital
                accessibility requirements under the ADA for over a decade, and
                enforcement has accelerated significantly since the 2024 final
                rule. The DOJ pursues enforcement through investigations,
                settlement agreements, and consent decrees.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  How DOJ Enforcement Works
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  The DOJ can initiate investigations based on individual
                  complaints filed by people with disabilities, referrals from
                  advocacy organizations, or its own proactive review program.
                  Once an investigation begins, the entity must provide detailed
                  documentation of its digital accessibility status, respond to
                  information requests, and negotiate a resolution. Investigations
                  typically result in a consent decree or settlement agreement
                  that mandates full remediation, ongoing monitoring, and
                  financial penalties.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Notable Enforcement Examples
                </h3>
                <div className="mt-3 space-y-4 text-sm text-caso-slate leading-relaxed">
                  <p>
                    The DOJ has pursued enforcement actions against government
                    entities of all sizes. Settlement agreements routinely require
                    organizations to remediate all web content and documents within
                    12-24 months, hire accessibility consultants, train staff, and
                    submit to ongoing monitoring for 3-5 years. The total cost of
                    a typical DOJ settlement — including remediation, consulting,
                    training, monitoring, and penalties — ranges from{" "}
                    <strong className="text-caso-white">
                      $100,000 to over $500,000
                    </strong>
                    .
                  </p>
                  <p>
                    The DOJ has also entered into agreements with major
                    universities, transit authorities, and state agencies. In each
                    case, the entity was required to bring all digital content into
                    WCAG 2.1 AA conformance, often under tight timelines that
                    required expensive emergency remediation efforts.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-caso-red/50 bg-caso-red/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                Civil Penalties
              </p>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="font-[family-name:var(--font-display)] text-3xl font-black text-caso-white">
                    $75,000
                  </p>
                  <p className="mt-1 text-sm text-caso-slate">
                    Maximum penalty for a first ADA violation
                  </p>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-display)] text-3xl font-black text-caso-white">
                    $150,000
                  </p>
                  <p className="mt-1 text-sm text-caso-slate">
                    Maximum penalty for subsequent violations
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                These penalties are per violation. With hundreds or thousands of
                inaccessible documents on a website, the theoretical maximum
                exposure is staggering — though in practice, settlements
                aggregate violations into a single negotiated amount.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 3 */}
          <section id="lawsuit-trends" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              3. Lawsuit Trends
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                ADA digital accessibility lawsuits have grown dramatically over
                the past decade. While the majority of lawsuits target private
                businesses under Title III, the 2024 Title II final rule is
                expected to trigger a significant increase in claims against
                government entities.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Growth in ADA Digital Accessibility Lawsuits
                </h3>
                <div className="mt-3 space-y-4 text-sm text-caso-slate leading-relaxed">
                  <p>
                    According to accessibility litigation tracking data, the
                    number of ADA digital accessibility lawsuits filed in federal
                    court has grown from approximately 800 in 2017 to over 4,600
                    in 2023 — a{" "}
                    <strong className="text-caso-white">
                      475% increase in six years
                    </strong>
                    . This does not include demand letters, state-level claims, or
                    DOJ enforcement actions, which would significantly increase
                    the total.
                  </p>
                  <p>
                    The trend is clear and accelerating. As the ADA Title II
                    deadlines approach and pass, plaintiff attorneys and disability
                    rights organizations will have a clear, enforceable standard
                    (WCAG 2.1 AA) to test against. Government entities that have
                    not remediated their documents will be easy targets — the
                    compliance status of any public PDF can be verified in seconds
                    using automated tools.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Serial Litigation
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  A significant portion of ADA digital accessibility cases are
                  filed by a small number of plaintiff firms and individual
                  litigants who file dozens or hundreds of cases per year. These
                  serial litigants use automated scanning tools to identify
                  non-compliant websites and file standardized complaints.
                  Government websites with publicly available, non-compliant PDFs
                  are particularly vulnerable to this type of systematic
                  targeting.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Post-Deadline Exposure
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Before the 2024 final rule, plaintiffs had to argue that digital
                  accessibility was implied by the ADA&apos;s general
                  anti-discrimination provisions. After April 2026, the standard
                  is explicit: WCAG 2.1 AA. This removes legal ambiguity and makes
                  cases easier to bring and harder to defend. The cost of defense —
                  even in cases that settle quickly — adds up rapidly when your
                  documents demonstrably fail a clearly defined standard.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 4 */}
          <section id="settlement-costs" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              4. Settlement and Legal Costs
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                The financial cost of an accessibility lawsuit extends far
                beyond the settlement amount itself. Organizations facing legal
                action incur costs across multiple categories.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-2xl border border-caso-red/50 bg-caso-red/5 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Typical Cost Breakdown
                </h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-caso-border/30 pb-3">
                    <span className="text-sm text-caso-slate">Settlement payment</span>
                    <span className="font-[family-name:var(--font-display)] font-bold text-caso-white">
                      $50,000 - $200,000+
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-caso-border/30 pb-3">
                    <span className="text-sm text-caso-slate">Legal defense fees</span>
                    <span className="font-[family-name:var(--font-display)] font-bold text-caso-white">
                      $25,000 - $150,000+
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-caso-border/30 pb-3">
                    <span className="text-sm text-caso-slate">Emergency remediation</span>
                    <span className="font-[family-name:var(--font-display)] font-bold text-caso-white">
                      $50,000 - $300,000+
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-caso-border/30 pb-3">
                    <span className="text-sm text-caso-slate">Accessibility consulting</span>
                    <span className="font-[family-name:var(--font-display)] font-bold text-caso-white">
                      $15,000 - $75,000
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-caso-border/30 pb-3">
                    <span className="text-sm text-caso-slate">Ongoing monitoring (3-5 years)</span>
                    <span className="font-[family-name:var(--font-display)] font-bold text-caso-white">
                      $10,000 - $50,000/yr
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-caso-border/30 pb-3">
                    <span className="text-sm text-caso-slate">Staff time and disruption</span>
                    <span className="font-[family-name:var(--font-display)] font-bold text-caso-white">
                      $20,000 - $100,000+
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-[family-name:var(--font-display)] font-bold text-caso-white">
                      Total typical exposure
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-xl font-black text-red-400">
                      $170,000 - $875,000+
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-caso-slate leading-relaxed">
              <p>
                These figures represent a single legal action. Organizations
                that fail to achieve compliance after a first lawsuit are
                vulnerable to subsequent suits, each with its own set of costs.
                The compounding nature of non-compliance means that the longer
                you wait, the more expensive the eventual resolution becomes.
              </p>
              <p>
                Additionally, consent decrees and settlement agreements
                typically require the organization to achieve full compliance
                within 12-24 months — a much tighter timeline than proactive
                planning allows. Rush remediation under legal duress is
                significantly more expensive than planned, phased remediation.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 5 */}
          <section id="reputational-damage" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              5. Reputational Damage
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                The financial costs of lawsuits and settlements are quantifiable.
                Reputational damage is harder to measure but can be equally
                consequential, particularly for government entities whose
                legitimacy depends on public trust.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Media Coverage
              </h3>
              <p>
                ADA lawsuits against government entities generate local and
                sometimes national media coverage. Headlines about a city or
                county being sued for failing to serve residents with
                disabilities are damaging — they frame the organization as
                neglectful of a vulnerable population. Local news outlets
                regularly cover these cases because they directly affect
                constituents.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Community Trust
              </h3>
              <p>
                Government entities exist to serve all members of their
                community. When an organization publishes hundreds of documents
                that people with disabilities cannot access, it sends a clear
                message — intentional or not — that those residents are not a
                priority. Rebuilding trust after a public accessibility failure
                takes years of demonstrated commitment.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Political Consequences
              </h3>
              <p>
                Elected officials and appointed leaders are accountable for
                compliance failures. An ADA lawsuit or DOJ investigation can
                become a political liability, affecting elections, appointments,
                and professional reputations. Proactive compliance, by contrast,
                demonstrates leadership and commitment to equity.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 6 */}
          <section id="lost-audience" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              6. The Lost Audience
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                Beyond legal risk, inaccessible documents exclude a significant
                portion of your community from accessing information and services
                they are entitled to.
              </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6 text-center">
                <p className="font-[family-name:var(--font-display)] text-4xl font-black text-caso-blue">
                  27%
                </p>
                <p className="mt-2 text-sm text-caso-slate">
                  of U.S. adults have some form of disability (CDC, 2023)
                </p>
              </div>
              <div className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6 text-center">
                <p className="font-[family-name:var(--font-display)] text-4xl font-black text-caso-blue">
                  7.6M
                </p>
                <p className="mt-2 text-sm text-caso-slate">
                  Americans have a visual disability affecting daily tasks
                </p>
              </div>
              <div className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6 text-center">
                <p className="font-[family-name:var(--font-display)] text-4xl font-black text-caso-blue">
                  15M
                </p>
                <p className="mt-2 text-sm text-caso-slate">
                  Americans have a cognitive disability affecting comprehension
                </p>
              </div>
              <div className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6 text-center">
                <p className="font-[family-name:var(--font-display)] text-4xl font-black text-caso-blue">
                  2X
                </p>
                <p className="mt-2 text-sm text-caso-slate">
                  People aged 65+ are twice as likely to have a disability
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-caso-slate leading-relaxed">
              <p>
                When your budget documents, meeting minutes, permit applications,
                and public health notices are inaccessible, you are not just
                failing a compliance checklist — you are preventing real people
                from participating in their government. A resident who cannot
                read the city council agenda cannot meaningfully participate in
                public comment. A person who cannot fill out a permit application
                cannot start their business.
              </p>
              <p>
                The disability community is also not a small niche. At 27% of the
                adult population, people with disabilities represent the
                largest minority group in the United States — and one that every
                person may join at any point in their life through aging, illness,
                or injury.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 7 */}
          <section id="cost-comparison" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              7. Remediation vs Legal Defense
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                The most compelling argument for proactive remediation is the
                simple cost comparison. Fixing your documents before a lawsuit
                costs a fraction of fixing them after one.
              </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-caso-teal/50 bg-caso-teal/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-caso-teal">
                  Proactive Remediation
                </p>
                <p className="mt-4 font-[family-name:var(--font-display)] text-2xl font-black text-caso-white">
                  $0.30 - $0.85
                </p>
                <p className="mt-1 text-sm text-caso-slate">
                  per page with AI-powered remediation
                </p>
                <div className="mt-4 space-y-2 text-sm text-caso-slate">
                  <p>For a typical government site with 5,000 pages:</p>
                  <p className="font-[family-name:var(--font-display)] font-bold text-caso-white">
                    $1,500 - $4,250
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-caso-red/50 bg-caso-red/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Reactive (Post-Lawsuit)
                </p>
                <p className="mt-4 font-[family-name:var(--font-display)] text-2xl font-black text-caso-white">
                  $50,000 - $500,000+
                </p>
                <p className="mt-1 text-sm text-caso-slate">
                  total cost including legal, settlement, rush remediation
                </p>
                <div className="mt-4 space-y-2 text-sm text-caso-slate">
                  <p>Minimum exposure for a single lawsuit:</p>
                  <p className="font-[family-name:var(--font-display)] font-bold text-red-400">
                    35x - 330x more expensive
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-caso-slate leading-relaxed">
              <p>
                Even manual remediation at $5-$15 per page — which totals
                $25,000-$75,000 for 5,000 pages — is still dramatically less
                expensive than the combined cost of a single lawsuit. And manual
                remediation done proactively on your own timeline is far less
                costly than emergency manual remediation demanded by a consent
                decree with a 12-month deadline.
              </p>
              <p>
                The math is unambiguous:{" "}
                <strong className="text-caso-white">
                  proactive AI-powered remediation costs less than 1% of what a
                  single lawsuit would cost
                </strong>
                . There is no financial argument for waiting.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 8 */}
          <section id="roi-of-accessibility" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              8. ROI of Accessibility
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                Accessibility compliance is not just a cost center — it delivers
                measurable returns beyond legal risk mitigation.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Improved SEO and Discoverability
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Accessible documents with proper tags, titles, and metadata are
                  better indexed by search engines. Tagged PDFs with alt text,
                  headings, and document titles rank higher in search results than
                  untagged, inaccessible PDFs. Remediation improves the
                  discoverability of your content for all users.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Better User Experience for Everyone
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Accessibility improvements benefit all users, not just those
                  with disabilities. Bookmarks make long documents navigable.
                  Proper headings make documents scannable. Alt text helps when
                  images fail to load. Logical reading order improves the
                  experience on mobile devices. The curb-cut effect applies to
                  documents: features designed for accessibility benefit everyone.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Reduced Support Burden
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Inaccessible documents generate support requests. When a
                  resident cannot fill out a PDF form or read a document with
                  their screen reader, they call your office for help. Each of
                  these interactions costs staff time and taxpayer dollars.
                  Accessible documents reduce the volume of support requests by
                  enabling self-service access for all users.
                </p>
              </div>

              <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                  Grant and Funding Eligibility
                </h3>
                <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                  Increasingly, federal grant programs require demonstrated ADA
                  compliance as a condition of eligibility. Organizations that
                  cannot show compliance risk losing access to federal funding
                  streams. Proactive compliance protects your eligibility for
                  current and future grant opportunities.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 9 */}
          <section id="risk-management" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              9. Insurance and Risk Management
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                From a risk management perspective, ADA non-compliance is a
                known, quantifiable liability that can and should be mitigated
                proactively.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Insurance Coverage Gaps
              </h3>
              <p>
                Many government liability insurance policies exclude or limit
                coverage for ADA violations, particularly when the entity was
                aware of the non-compliance and failed to act. After the 2024
                final rule and its clear deadlines, it is difficult to argue
                that non-compliance was unintentional or unknown. This means
                settlement costs and legal fees may come directly from the
                entity&apos;s budget rather than insurance.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Risk Pool Considerations
              </h3>
              <p>
                Government risk pools — which provide liability coverage for
                member entities — are increasingly factoring digital
                accessibility compliance into their risk assessments.
                Non-compliant members may face higher premiums, reduced
                coverage, or requirements to demonstrate a compliance plan.
                Proactive remediation can improve your standing with your
                risk pool.
              </p>

              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white pt-4">
                Documenting Good Faith Efforts
              </h3>
              <p>
                Even if full compliance is not achieved by the deadline, having
                a documented, active compliance program demonstrates good faith.
                Courts and the DOJ are more favorably disposed toward
                organizations that can show they were actively working toward
                compliance — with budgets, timelines, vendor contracts, and
                progress reports — than toward organizations that ignored the
                requirement entirely.
              </p>
            </div>
          </section>

          <hr className="my-16 border-caso-border/50" />

          {/* Section 10 */}
          <section id="take-action" className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              10. Take Action Now
            </h2>
            <div className="mt-6 space-y-4 text-caso-slate leading-relaxed">
              <p>
                The cost of inaction is clear. The cost of action is
                comparatively minimal. The first step is understanding where you
                stand today.
              </p>
              <p>
                CASO Comply&apos;s{" "}
                <Link
                  href="/free-scan"
                  className="text-caso-blue underline decoration-caso-blue/30 transition-colors hover:text-caso-blue-bright hover:decoration-caso-blue"
                >
                  free compliance scan
                </Link>{" "}
                crawls your website, identifies every document, and produces a
                detailed report showing how many are non-compliant and what
                issues exist. There is no cost, no commitment, and no sales
                pressure — just a clear, data-driven picture of your compliance
                gap.
              </p>
              <p>
                Once you know your exposure, you can make an informed decision
                about remediation. Our{" "}
                <Link
                  href="/services/pdf-remediation"
                  className="text-caso-blue underline decoration-caso-blue/30 transition-colors hover:text-caso-blue-bright hover:decoration-caso-blue"
                >
                  AI-powered PDF remediation
                </Link>{" "}
                handles the work at $0.30-$0.85 per page — a fraction of a
                percent of what a lawsuit would cost. The technology, the
                timeline, and the financial case are all on your side. The only
                question is whether you act before the deadline or after the
                lawsuit.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-20 rounded-2xl border border-caso-blue/30 bg-caso-blue/5 p-8 text-center md:p-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white md:text-3xl">
              Assess your risk for free.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-caso-slate">
              Our free scan identifies every non-compliant document on your
              website and quantifies your exposure. No commitment, no sales
              pitch — just data you can act on.
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
