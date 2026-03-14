import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title:
    "Document Accessibility Policy Template for Government Agencies | CASO Comply",
  description:
    "A practical, ready-to-adopt document accessibility policy template for government agencies. Includes sample policy language, key components, implementation steps, and best practices for ADA Title II compliance.",
  openGraph: {
    title:
      "Document Accessibility Policy Template for Government Agencies",
    description:
      "Ready-to-adopt document accessibility policy template with sample language and implementation steps for government agencies.",
    type: "article",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" },
    ],
  },
  alternates: {
    canonical: "/blog/document-accessibility-policy-template",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Document Accessibility Policy Template for Government Agencies",
  description:
    "A practical, ready-to-adopt document accessibility policy template for government agencies, including sample policy language and implementation steps.",
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

export default function DocumentAccessibilityPolicyPage() {
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
              Document Accessibility Policy Template for Government Agencies
            </h1>
            <div className="mt-4 flex items-center gap-4 text-sm text-caso-slate">
              <span>By CASO Comply</span>
              <span aria-hidden="true">&middot;</span>
              <time dateTime="2026-03-14">March 14, 2026</time>
              <span aria-hidden="true">&middot;</span>
              <span>10 min read</span>
            </div>
          </header>

          {/* Content */}
          <div className="space-y-6 text-caso-slate leading-relaxed">
            <p className="text-lg">
              A document accessibility policy is one of the most important steps
              a government agency can take toward ADA Title II compliance. It
              establishes organizational commitment, defines standards, assigns
              responsibility, and creates a framework for ongoing compliance.
              Without a formal policy, accessibility efforts tend to be ad hoc,
              inconsistent, and unsustainable.
            </p>

            <p>
              This guide provides a complete, ready-to-adapt policy template
              along with guidance on why each component matters and how to
              implement it effectively. The template is designed for state and
              local government agencies but can be adapted for any organization
              that publishes digital documents.
            </p>

            <hr className="my-12 border-caso-border/50" />

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              Why You Need a Document Accessibility Policy
            </h2>

            <p>
              Many government agencies approach document accessibility as a
              technical problem &mdash; remediate the PDFs, check the boxes,
              move on. But without a policy to guide the process, compliance
              gains erode quickly. New inaccessible documents are published,
              staff turnover leads to lost knowledge, and the backlog grows
              again.
            </p>

            <p>A formal document accessibility policy serves several critical functions:</p>

            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong className="text-caso-white">Establishes accountability.</strong> It names who
                is responsible for accessibility and what that responsibility includes.
              </li>
              <li>
                <strong className="text-caso-white">Defines standards.</strong> It specifies which
                accessibility standards the organization will follow (WCAG 2.1 AA, PDF/UA, Section 508).
              </li>
              <li>
                <strong className="text-caso-white">Creates consistency.</strong> It ensures every
                department follows the same process for creating and publishing accessible documents.
              </li>
              <li>
                <strong className="text-caso-white">Demonstrates good faith.</strong> In the event of a
                complaint or legal action, a published policy demonstrates organizational commitment to
                accessibility.
              </li>
              <li>
                <strong className="text-caso-white">Supports training.</strong> It provides the
                foundation for staff training programs and onboarding materials.
              </li>
              <li>
                <strong className="text-caso-white">Enables enforcement.</strong> Internal compliance
                is difficult to enforce without a documented standard to measure against.
              </li>
            </ul>

            <hr className="my-12 border-caso-border/50" />

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              Key Components of a Document Accessibility Policy
            </h2>

            <p>
              An effective document accessibility policy should include the following sections. The
              template below provides sample language for each.
            </p>

            <hr className="my-12 border-caso-border/50" />

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              Sample Policy Template
            </h2>

            <p>
              The following template can be adapted to your organization. Replace bracketed text with
              your specific details.
            </p>

            {/* Policy Section 1 */}
            <div className="mt-8 rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6 md:p-8">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Section 1: Purpose and Scope
              </h3>
              <blockquote className="mt-4 border-l-4 border-caso-blue/50 pl-4 text-sm text-caso-slate italic leading-relaxed">
                <p>
                  &quot;[Organization Name] is committed to ensuring that all digital documents
                  published on its website and through its digital channels are accessible to all
                  individuals, including those with disabilities. This policy establishes the standards,
                  responsibilities, and processes for creating, publishing, and maintaining accessible
                  digital documents in compliance with the Americans with Disabilities Act (ADA) Title
                  II, Section 508 of the Rehabilitation Act, WCAG 2.1 Level AA, and PDF/UA (ISO
                  14289).&quot;
                </p>
                <p className="mt-4">
                  &quot;This policy applies to all departments, divisions, and offices of [Organization
                  Name] and covers all digital documents published on the organization&apos;s website,
                  intranet, and any other public-facing digital platform. Covered document types include
                  but are not limited to PDF files, Microsoft Word documents, Excel spreadsheets,
                  PowerPoint presentations, and any other digital files made available to the
                  public.&quot;
                </p>
              </blockquote>
            </div>

            {/* Policy Section 2 */}
            <div className="mt-6 rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6 md:p-8">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Section 2: Accessibility Standards
              </h3>
              <blockquote className="mt-4 border-l-4 border-caso-blue/50 pl-4 text-sm text-caso-slate italic leading-relaxed">
                <p>
                  &quot;All digital documents published by [Organization Name] must conform to the
                  following accessibility standards:&quot;
                </p>
                <ul className="mt-3 ml-4 list-disc space-y-2 not-italic">
                  <li>Web Content Accessibility Guidelines (WCAG) 2.1, Level AA</li>
                  <li>PDF/UA (ISO 14289-1) for all PDF documents</li>
                  <li>Section 508 of the Rehabilitation Act, as applicable</li>
                </ul>
                <p className="mt-4">
                  &quot;At a minimum, all documents must include: proper tag structure identifying
                  headings, paragraphs, lists, and tables; alternative text for all meaningful images,
                  charts, and graphics; a logical reading order that matches the visual layout;
                  properly marked table headers with scope attributes; document title set in metadata
                  properties; primary language declaration; bookmarks for documents exceeding five pages;
                  and sufficient color contrast (minimum 4.5:1 ratio for normal text).&quot;
                </p>
              </blockquote>
            </div>

            {/* Policy Section 3 */}
            <div className="mt-6 rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6 md:p-8">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Section 3: Roles and Responsibilities
              </h3>
              <blockquote className="mt-4 border-l-4 border-caso-blue/50 pl-4 text-sm text-caso-slate italic leading-relaxed">
                <p>
                  &quot;<strong className="not-italic text-caso-white">Document Accessibility
                  Coordinator:</strong> [Title/Department] shall serve as the Document Accessibility
                  Coordinator with responsibility for overseeing implementation of this policy,
                  coordinating training programs, monitoring compliance, and serving as the primary
                  point of contact for accessibility-related inquiries.&quot;
                </p>
                <p className="mt-4">
                  &quot;<strong className="not-italic text-caso-white">Department Heads:</strong> Each
                  department head is responsible for ensuring that all documents published by their
                  department comply with this policy. Department heads shall designate at least one
                  staff member to serve as the department&apos;s accessibility liaison.&quot;
                </p>
                <p className="mt-4">
                  &quot;<strong className="not-italic text-caso-white">Content Authors:</strong> All
                  staff who create or publish digital documents are responsible for following accessible
                  document creation practices as outlined in this policy and related training
                  materials.&quot;
                </p>
                <p className="mt-4">
                  &quot;<strong className="not-italic text-caso-white">IT/Web Team:</strong> The
                  IT/Web team is responsible for maintaining accessibility validation tools, supporting
                  automated remediation workflows, and ensuring the website publishing process includes
                  accessibility checks.&quot;
                </p>
              </blockquote>
            </div>

            {/* Policy Section 4 */}
            <div className="mt-6 rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6 md:p-8">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Section 4: Document Creation and Publishing Process
              </h3>
              <blockquote className="mt-4 border-l-4 border-caso-blue/50 pl-4 text-sm text-caso-slate italic leading-relaxed">
                <p>
                  &quot;All digital documents must be created using accessible authoring practices.
                  Staff shall:&quot;
                </p>
                <ol className="mt-3 ml-4 list-decimal space-y-2 not-italic">
                  <li>Use built-in heading styles for document structure (Heading 1, Heading 2, etc.) rather than manual formatting.</li>
                  <li>Add alternative text to all meaningful images at the time of insertion.</li>
                  <li>Use built-in table tools for tabular data, with clearly designated header rows.</li>
                  <li>Use built-in list tools (bulleted and numbered lists) for list content.</li>
                  <li>Ensure sufficient color contrast in all visual elements.</li>
                  <li>Export documents as tagged PDFs using the &quot;Document structure tags for accessibility&quot; option.</li>
                  <li>Validate all documents against PDF/UA standards before publishing.</li>
                </ol>
                <p className="mt-4">
                  &quot;No document shall be published to the organization&apos;s website or digital
                  channels without passing an automated accessibility validation check. Documents that
                  fail validation must be remediated before publication.&quot;
                </p>
              </blockquote>
            </div>

            {/* Policy Section 5 */}
            <div className="mt-6 rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6 md:p-8">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Section 5: Legacy Document Remediation
              </h3>
              <blockquote className="mt-4 border-l-4 border-caso-blue/50 pl-4 text-sm text-caso-slate italic leading-relaxed">
                <p>
                  &quot;[Organization Name] shall conduct a comprehensive audit of all digital
                  documents currently published on its website and digital channels. Documents shall
                  be prioritized for remediation based on the following criteria:&quot;
                </p>
                <ol className="mt-3 ml-4 list-decimal space-y-2 not-italic">
                  <li>Documents related to critical public services (permits, applications, public health, public safety)</li>
                  <li>High-traffic documents (budgets, meeting agendas and minutes, annual reports)</li>
                  <li>Legally mandated publications (ordinances, public notices, required disclosures)</li>
                  <li>All remaining publicly available documents</li>
                </ol>
                <p className="mt-4">
                  &quot;Documents that are outdated, no longer relevant, or duplicative should be
                  reviewed for removal rather than remediation. Removing inaccessible content that
                  serves no current purpose reduces compliance risk and maintenance burden.&quot;
                </p>
              </blockquote>
            </div>

            {/* Policy Section 6 */}
            <div className="mt-6 rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6 md:p-8">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Section 6: Training Requirements
              </h3>
              <blockquote className="mt-4 border-l-4 border-caso-blue/50 pl-4 text-sm text-caso-slate italic leading-relaxed">
                <p>
                  &quot;All staff who create or publish digital documents shall complete document
                  accessibility training within [90 days] of adoption of this policy and within [30
                  days] of hire for new employees. Refresher training shall be provided annually.
                  Training shall cover accessible document creation practices, use of accessibility
                  validation tools, and the legal requirements under ADA Title II.&quot;
                </p>
              </blockquote>
            </div>

            {/* Policy Section 7 */}
            <div className="mt-6 rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6 md:p-8">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Section 7: Monitoring and Reporting
              </h3>
              <blockquote className="mt-4 border-l-4 border-caso-blue/50 pl-4 text-sm text-caso-slate italic leading-relaxed">
                <p>
                  &quot;The Document Accessibility Coordinator shall conduct quarterly reviews of
                  document accessibility compliance across all departments. Reviews shall include
                  automated scanning of all published documents and spot-check manual reviews of
                  alt text quality and reading order. Compliance reports shall be submitted to
                  [City Manager/County Administrator/Agency Director] on a quarterly basis.&quot;
                </p>
                <p className="mt-4">
                  &quot;An annual accessibility report shall be published summarizing the
                  organization&apos;s compliance status, remediation progress, training completion
                  rates, and any accessibility complaints received and their resolution.&quot;
                </p>
              </blockquote>
            </div>

            {/* Policy Section 8 */}
            <div className="mt-6 rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6 md:p-8">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Section 8: Feedback and Complaint Process
              </h3>
              <blockquote className="mt-4 border-l-4 border-caso-blue/50 pl-4 text-sm text-caso-slate italic leading-relaxed">
                <p>
                  &quot;[Organization Name] welcomes feedback regarding the accessibility of its
                  digital documents. Individuals who encounter an inaccessible document or wish to
                  request an accessible alternative may contact the Document Accessibility Coordinator
                  at [email/phone]. Requests for accessible alternatives shall be fulfilled within
                  [5 business days]. All accessibility complaints shall be logged, investigated, and
                  resolved in accordance with the organization&apos;s ADA grievance procedures.&quot;
                </p>
              </blockquote>
            </div>

            <hr className="my-12 border-caso-border/50" />

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              Implementation Steps
            </h2>

            <p>
              Adopting a policy is just the beginning. Here is how to put it into practice:
            </p>

            <div className="mt-8 space-y-8">
              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  1
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Get Leadership Buy-In
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Present the policy to your executive team or governing body along with the
                    legal requirements, consequences of non-compliance, and estimated costs of
                    remediation. Formal adoption by resolution or executive order gives the policy
                    organizational weight.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  2
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Appoint the Accessibility Coordinator
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Designate a specific individual (not just a department) to own accessibility
                    compliance. This person needs authority to enforce the policy, budget for tools
                    and training, and time allocated to the role. In smaller agencies, this may be
                    a partial responsibility added to an existing role.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  3
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Conduct the Baseline Audit
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Before you can measure progress, you need to understand your starting point.
                    Crawl your website to identify all published documents, run automated
                    accessibility checks, and categorize results by department and priority level.
                    This audit becomes your remediation roadmap.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  4
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Deploy Training
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Roll out accessibility training to all staff who create or publish documents.
                    Training should be practical and tool-specific &mdash; show people exactly how
                    to use heading styles in Word, add alt text, create accessible tables, and export
                    tagged PDFs. Generic awareness training is not sufficient.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  5
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Integrate Into Publishing Workflows
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Make accessibility a gate in your content publishing process. No document should
                    go live on your website without passing an accessibility check. This can be
                    automated &mdash; tools like CASO Comply can validate documents as part of your
                    upload workflow and flag or remediate issues before publication.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  6
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Begin Remediation of Legacy Content
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Following your prioritization criteria, start remediating existing documents.
                    Use automated tools for the bulk of the work and apply human review for quality
                    assurance. Track progress by department and document category so you can report
                    meaningful metrics.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                  7
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Monitor and Report
                  </h3>
                  <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                    Establish the quarterly review cadence outlined in the policy. Automated
                    monitoring tools can continuously scan your website for new inaccessible
                    content and alert the appropriate department. Regular reporting keeps
                    accessibility visible to leadership and ensures sustained attention.
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-12 border-caso-border/50" />

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              Common Pitfalls to Avoid
            </h2>

            <p>
              Based on our experience working with government agencies on document accessibility, here
              are the most common mistakes to watch for:
            </p>

            <ul className="ml-6 list-disc space-y-3">
              <li>
                <strong className="text-caso-white">Writing a policy but not enforcing it.</strong> A
                policy that exists on paper but is not integrated into daily workflows provides minimal
                protection and no practical value.
              </li>
              <li>
                <strong className="text-caso-white">Treating it as a one-time project.</strong>{" "}
                Remediating your existing documents is necessary, but compliance requires ongoing
                processes. New inaccessible content is published every day without proper workflows in
                place.
              </li>
              <li>
                <strong className="text-caso-white">Relying solely on automated tools.</strong>{" "}
                Automated tools are essential for scale, but they cannot assess whether alt text is
                meaningful or whether reading order makes logical sense. Human review is a necessary
                complement.
              </li>
              <li>
                <strong className="text-caso-white">Not training staff.</strong> The most sustainable
                path to compliance is creating accessible documents at the source. Without training,
                staff will continue producing inaccessible content that needs remediation after the
                fact.
              </li>
              <li>
                <strong className="text-caso-white">Ignoring the feedback mechanism.</strong> If
                someone reports an inaccessible document and gets no response, you have both a
                compliance failure and a customer service failure. Ensure the feedback process is
                staffed and responsive.
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-20 rounded-2xl border border-caso-blue/30 bg-caso-blue/5 p-8 text-center md:p-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white md:text-3xl">
              Need help implementing your policy?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-caso-slate">
              CASO Comply helps government agencies move from policy to practice.
              We provide the baseline audit, automated remediation, and ongoing
              monitoring you need to make your accessibility policy real.
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
                href="/blog/ada-title-ii-deadline-what-you-need-to-know"
                className="group rounded-xl border border-caso-border bg-caso-navy-light/30 p-6 transition-all hover:border-caso-blue/30 hover:bg-caso-navy-light/50"
              >
                <span className="inline-block rounded-full border border-caso-warm/50 bg-caso-warm/10 px-3 py-1 text-xs font-semibold text-caso-warm">
                  Compliance
                </span>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue transition-colors">
                  ADA Title II Deadline: What Government Agencies Need to Know
                  in 2026
                </h3>
                <p className="mt-2 text-sm text-caso-slate">
                  The April 24, 2026 deadline is weeks away. What you need to
                  know now.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </MarketingLayout>
  );
}
