import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title: "K-12 School District ADA Compliance — CASO Comply",
  description:
    "K-12 school accessibility compliance made simple. CASO Comply helps school districts remediate PDFs for ADA Title II, Section 504, and OCR requirements — protecting students, parents, and your district.",
  openGraph: {
    title: "K-12 School District ADA Compliance — CASO Comply",
    description:
      "K-12 school accessibility compliance made simple. CASO Comply helps school districts remediate PDFs for ADA Title II, Section 504, and OCR requirements — protecting students, parents, and your district.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/solutions/k-12-education",
  },
};

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-caso-teal"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-caso-blue"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );
}

const K12_DOCUMENTS = [
  "Individualized Education Programs (IEPs)",
  "Report cards and progress reports",
  "School board meeting minutes and agendas",
  "Student and parent handbooks",
  "School newsletters and announcements",
  "Curriculum guides and course catalogs",
  "Free and reduced lunch applications",
  "Field trip permission forms",
  "Special education evaluation reports",
  "School improvement plans",
];

const OCR_ENFORCEMENT = [
  {
    title: "Complaint-Driven Investigations",
    description:
      "A single parent complaint to the Office for Civil Rights can trigger a full investigation of your district's digital accessibility. OCR has investigated hundreds of school districts for inaccessible websites and documents.",
  },
  {
    title: "Resolution Agreements",
    description:
      "Districts found non-compliant must enter into binding resolution agreements that require full remediation, staff training, policy changes, and ongoing monitoring — often at significant expense.",
  },
  {
    title: "Loss of Federal Funding",
    description:
      "OCR enforcement under Section 504 and Title II can ultimately lead to the withholding of federal funds. For districts that depend on Title I, IDEA, and other federal grants, this is an existential risk.",
  },
  {
    title: "Private Legal Action",
    description:
      "Parents can also file private lawsuits under the ADA and Section 504. Districts have paid six-figure settlements for inaccessible digital content, including PDFs that parents with disabilities could not read.",
  },
];

const LEGAL_FRAMEWORK = [
  {
    law: "ADA Title II",
    description:
      "Public school districts are government entities covered by Title II. The DOJ's 2024 final rule requires all web content — including PDFs — to meet WCAG 2.1 AA. Deadlines are April 2026 (50,000+ population) and April 2027 (under 50,000).",
  },
  {
    law: "Section 504 of the Rehabilitation Act",
    description:
      "Any school receiving federal financial assistance (virtually every public school) must provide equal access to programs and services. Inaccessible documents create a barrier to participation for students and parents with disabilities.",
  },
  {
    law: "IDEA (Individuals with Disabilities Education Act)",
    description:
      "IEPs, evaluation reports, and procedural safeguard notices must be provided in accessible formats. When these critical documents are inaccessible PDFs, districts violate both the letter and spirit of IDEA.",
  },
  {
    law: "Section 508 (for federally funded programs)",
    description:
      "Districts administering federally funded programs must ensure that digital content meets Section 508 standards, which incorporate WCAG 2.1 AA by reference.",
  },
];

const HOW_WE_HELP = [
  {
    title: "District-Wide Document Discovery",
    description:
      "Our SiteScan crawler identifies every PDF across your district website, individual school sites, and any subdomains. You get a complete inventory of documents with accessibility scores — often revealing thousands of PDFs you did not know were there.",
  },
  {
    title: "Prioritize Parent-Facing Documents",
    description:
      "We help you focus remediation on the documents that matter most: IEPs, handbooks, enrollment forms, and board minutes. High-traffic, legally required documents are flagged for immediate remediation.",
  },
  {
    title: "AI-Powered Remediation at Scale",
    description:
      "Our engine processes documents at a pace your staff never could. Structure tags, alt text, reading order, language settings, and metadata are all corrected automatically — turning a months-long project into days.",
  },
  {
    title: "Certificate of Compliance",
    description:
      "Every remediated document receives a verifiable compliance certificate. When OCR comes knocking or a parent files a complaint, you have documented proof that your district took accessibility seriously.",
  },
  {
    title: "Ongoing Monitoring for New Content",
    description:
      "School newsletters, board agendas, and new forms are published constantly. CASO Comply monitors your sites and flags new documents that need remediation, so your compliance does not lapse the moment you finish the initial project.",
  },
  {
    title: "Staff Awareness Resources",
    description:
      "We provide guidance that helps your administrative staff understand why accessible documents matter and how to avoid common mistakes when creating new PDFs, reducing the number of documents that need automated remediation.",
  },
];

export default function K12EducationSolutionPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="border-b border-caso-border/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-caso-glacier">
            Solutions for K-12 Education
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Document Accessibility for K-12 School Districts
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-caso-slate md:text-xl">
            Every parent, student, and community member deserves equal access to
            your district&apos;s documents. ADA Title II, Section 504, and IDEA
            all require it — and the Office for Civil Rights is actively
            enforcing it. CASO Comply helps school districts remediate thousands
            of PDFs affordably and fast.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/free-scan"
              className="inline-flex rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Scan Your District&apos;s Website
            </Link>
            <Link
              href="/contact"
              className="inline-flex rounded-xl border border-caso-border px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-navy-light"
            >
              Talk to Our Education Team
            </Link>
          </div>
        </div>
      </section>

      {/* Why K-12 Is Different */}
      <section className="border-b border-caso-border/50 bg-caso-navy-light px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              Why K-12 Is Not the Same as Higher Ed
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              School districts face a different set of challenges than colleges
              and universities. The stakes, the documents, and the audience are
              fundamentally different.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-caso-border bg-caso-navy p-6">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                Parents Are the Primary Audience
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-caso-slate">
                In higher education, students are adults navigating their own
                documents. In K-12, parents and guardians — including those with
                visual impairments, cognitive disabilities, and limited English
                proficiency — must be able to read IEPs, report cards, handbooks,
                and permission forms. Inaccessible documents shut parents out of
                their child&apos;s education.
              </p>
            </div>
            <div className="rounded-2xl border border-caso-border bg-caso-navy p-6">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                IDEA Adds Another Layer
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-caso-slate">
                Higher education does not operate under IDEA. K-12 districts do.
                IEPs, procedural safeguards, evaluation reports, and prior
                written notices are legally required documents that must be
                provided in accessible formats. A parent who cannot read their
                child&apos;s IEP cannot meaningfully participate in the IEP
                process — a core IDEA requirement.
              </p>
            </div>
            <div className="rounded-2xl border border-caso-border bg-caso-navy p-6">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                Tighter Budgets, More Documents
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-caso-slate">
                School districts often operate multiple school websites, each
                publishing newsletters, forms, and announcements. A district with
                ten schools might have ten times the document volume of a single
                university department — but a fraction of the IT budget.
                Traditional remediation at $5-$15 per page is simply not viable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Framework */}
      <section className="border-b border-caso-border/50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              The Legal Requirements for K-12 Districts
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              School districts sit at the intersection of multiple federal
              accessibility laws. Document accessibility is not optional under
              any of them.
            </p>
          </div>
          <div className="mt-12 space-y-4">
            {LEGAL_FRAMEWORK.map((item) => (
              <div
                key={item.law}
                className="flex gap-4 rounded-2xl border border-caso-border bg-caso-navy-light p-6"
              >
                <ShieldIcon />
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                    {item.law}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-caso-slate">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OCR Enforcement */}
      <section className="border-b border-caso-border/50 bg-caso-navy-light px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              OCR Enforcement Is Real
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              The Office for Civil Rights does not wait for deadlines. School
              districts are already facing investigations, resolution
              agreements, and legal consequences for inaccessible digital
              content.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {OCR_ENFORCEMENT.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-caso-border bg-caso-navy p-6"
              >
                <div className="flex items-start gap-3">
                  <AlertIcon />
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-caso-slate">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents List */}
      <section className="border-b border-caso-border/50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              K-12 Documents That Must Be Accessible
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              These are the documents OCR looks at first during an
              investigation. If parents or community members access them on your
              website, they must meet WCAG 2.1 AA standards.
            </p>
          </div>
          <ul
            role="list"
            className="mt-12 grid gap-4 sm:grid-cols-2"
          >
            {K12_DOCUMENTS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-caso-border bg-caso-navy-light p-5"
              >
                <CheckIcon />
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How CASO Comply Helps */}
      <section className="border-b border-caso-border/50 bg-caso-navy-light px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              How CASO Comply Helps School Districts
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              From initial discovery to ongoing compliance, we handle the heavy
              lifting so your staff can focus on educating students.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {HOW_WE_HELP.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-caso-border bg-caso-navy p-6"
              >
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
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

      {/* Budget Section */}
      <section className="border-b border-caso-border/50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              Designed for School District Budgets
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              We know that every dollar in a school budget is accounted for.
              CASO Comply is priced so that compliance does not come at the
              expense of classrooms.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-caso-border bg-caso-navy-light p-6 text-center">
              <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-caso-teal">
                90%+
              </p>
              <p className="mt-2 text-sm text-caso-slate">
                Cost savings vs. manual remediation consultants
              </p>
            </div>
            <div className="rounded-2xl border border-caso-border bg-caso-navy-light p-6 text-center">
              <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-caso-teal">
                $0.30
              </p>
              <p className="mt-2 text-sm text-caso-slate">
                Starting per-page price for automated remediation
              </p>
            </div>
            <div className="rounded-2xl border border-caso-border bg-caso-navy-light p-6 text-center">
              <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-caso-teal">
                Days
              </p>
              <p className="mt-2 text-sm text-caso-slate">
                Not months — to remediate your entire document library
              </p>
            </div>
          </div>
          <ul role="list" className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              "Volume pricing for large document libraries",
              "No long-term contracts required",
              "Compatible with E-Rate and federal grant funding",
              "Cooperative purchasing agreements supported",
              "SOC 2 Type II certified — safe for student data",
              "HIPAA and FERPA compliant processing",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 p-3">
                <CheckIcon />
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related Solutions */}
      <section className="border-t border-caso-border px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center font-[family-name:var(--font-display)] text-2xl font-bold">
            Related Solutions
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/solutions/higher-education"
              className="group rounded-xl border border-caso-border bg-caso-navy-light p-6 transition-colors hover:border-caso-blue/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue">
                Higher Education
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                Section 508 and ADA compliance for universities and colleges.
              </p>
            </Link>
            <Link
              href="/solutions/government"
              className="group rounded-xl border border-caso-border bg-caso-navy-light p-6 transition-colors hover:border-caso-blue/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue">
                Government
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                ADA Title II compliance for state and local government agencies.
              </p>
            </Link>
            <Link
              href="/solutions/states"
              className="group rounded-xl border border-caso-border bg-caso-navy-light p-6 transition-colors hover:border-caso-blue/50"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white group-hover:text-caso-blue">
                States Hub
              </h3>
              <p className="mt-2 text-sm text-caso-slate">
                State-specific ADA compliance resources and deadline information.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            Every Parent Deserves to Read Their Child&apos;s Documents
          </h2>
          <p className="mt-4 text-lg text-caso-slate">
            Find out how many inaccessible documents are on your district&apos;s
            website. Our free SiteScan identifies every PDF that needs
            remediation — before OCR does.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/free-scan"
              className="inline-flex rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Scan Your District&apos;s Website
            </Link>
            <Link
              href="/contact"
              className="inline-flex rounded-xl border border-caso-border px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-navy-light"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
