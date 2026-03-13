import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "@/components/CountdownTimer";
import WorkflowAnimation from "@/components/WorkflowAnimation";
import MarketingLayout from "@/components/MarketingLayout";

const SERVICE_LEVELS = [
  {
    level: "Level 1",
    name: "Basic Accessibility",
    price: "$0.30",
    description:
      "Automated tagging, structure, and reading order for standard PDF documents. Fast turnaround for bulk processing.",
    features: [
      "Auto-tag structure (headings, lists, paragraphs)",
      "Metadata cleanup & language tagging",
      "Logical reading order correction",
      "Before & after compliance scoring",
      "Batch processing support",
    ],
    turnaround: "24-48 hours",
  },
  {
    level: "Level 2",
    name: "Enhanced Compliance",
    price: "$1.80",
    description:
      "AI-powered remediation with enhanced checks, alt text generation, and a detailed compliance report.",
    features: [
      "Everything in Basic Accessibility",
      "AI-generated alt text for images",
      "AI-verified heading hierarchy",
      "Complex table header association",
      "Detailed compliance report",
      "Remediation log & audit trail",
    ],
    featured: true,
    turnaround: "2-3 business days",
  },
  {
    level: "Level 3",
    name: "Full Remediation",
    price: "$12.00",
    description:
      "Complete remediation with expert human QA review and a Certificate of Compliance for regulated industries.",
    features: [
      "Everything in Enhanced Compliance",
      "Expert human QA review",
      "Certificate of Compliance",
      "Priority processing",
      "Dedicated account support",
      "VPAT documentation",
    ],
    turnaround: "3-5 business days",
  },
];

const DEPLOYMENT_MODES = [
  {
    mode: "Cloud API",
    description:
      "Upload documents to our secure cloud for processing. Fastest setup — no infrastructure required.",
    dataPolicy: "Full PDFs sent to CASO cloud (AES-256 encrypted)",
    icon: (
      <svg
        className="h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
        />
      </svg>
    ),
    features: [
      "Zero infrastructure setup",
      "Automatic updates",
      "Cloud dashboard & reporting",
    ],
    ideal: "Small orgs, public website PDFs",
  },
  {
    mode: "Docker Agent",
    description:
      "Run the agent on your infrastructure. Scans folders, processes on a schedule, reports back to the dashboard.",
    dataPolicy: "Documents processed locally on your servers",
    icon: (
      <svg
        className="h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7"
        />
      </svg>
    ),
    features: [
      "Documents never leave your network",
      "Scheduled scans & batch processing",
      "Local dashboard at localhost:9090",
    ],
    ideal: "Mid-size, document-sensitive orgs",
    featured: true,
  },
  {
    mode: "Enterprise",
    description:
      "Custom deployment with dedicated support, SLAs, and compliance certification for regulated industries.",
    dataPolicy: "Fully configurable data handling",
    icon: (
      <svg
        className="h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21"
        />
      </svg>
    ),
    features: [
      "Dedicated account manager",
      "Custom SLAs & reporting",
      "On-premise or cloud deployment",
    ],
    ideal: "Hospitals, large gov, regulated industries",
  },
];

const TRUST_BADGES = [
  { label: "SOC 2 Type II", icon: "shield" },
  { label: "HIPAA Compliant", icon: "shield" },
  { label: "WCAG 2.1 AA", icon: "check" },
  { label: "Section 508", icon: "check" },
  { label: "PDF/UA (ISO 14289)", icon: "check" },
  { label: "ADA Title II", icon: "check" },
];

export default function Home() {
  return (
    <MarketingLayout>
      {/* Hero Section — Urgency-first messaging */}
      <section className="relative overflow-hidden px-6 pb-8 pt-16 md:pb-16 md:pt-24">
        {/* Background image + gradient overlay */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Image
            src="/bg-hero.png"
            alt=""
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-caso-navy/60" />
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-caso-blue/5 blur-3xl" />
          <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-caso-teal/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* Deadline Alert Banner */}
          <div className="mb-10 flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-caso-red-dark/30 bg-caso-red-dark/10 px-5 py-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full bg-caso-red opacity-75"
                  aria-hidden="true"
                />
                <span
                  className="relative inline-flex h-2.5 w-2.5 rounded-full bg-caso-red"
                  aria-hidden="true"
                />
              </span>
              <span className="text-sm font-semibold text-caso-red">
                ADA Title II Compliance Deadline: April 24, 2026
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-900 leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Your documents aren&apos;t accessible.
              <br />
              <span className="text-gradient">The deadline is coming.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-caso-slate md:text-xl">
              CASO Comply remediates PDFs, Word documents, and spreadsheets to
              WCAG 2.1 AA, PDF/UA, and Section 508 compliance —
              automatically, starting at just $0.30/page.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="mx-auto mt-10 flex max-w-lg flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/free-scan"
              className="inline-flex items-center gap-2 rounded-xl bg-caso-blue px-8 py-4 text-base font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Get a Free Compliance Scan
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-caso-border px-8 py-4 text-base font-bold text-caso-white transition-all hover:border-caso-blue hover:bg-caso-navy-light"
            >
              See Pricing
            </Link>
          </div>

          {/* Countdown Timer */}
          <div className="mt-16">
            <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-caso-slate">
              Time remaining until ADA Title II deadline
            </p>
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section
        aria-label="Compliance certifications"
        className="border-y border-caso-border/50 bg-caso-navy-light/50"
      >
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 text-caso-slate"
              >
                {badge.icon === "shield" ? (
                  <svg
                    className="h-5 w-5 text-caso-green"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-caso-green"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                <span className="text-sm font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem / Urgency Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-caso-navy" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Non-compliance isn&apos;t just a risk.{" "}
              <span className="text-caso-red">It&apos;s a liability.</span>
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              The ADA Title II deadline is April 24, 2026 for entities serving
              populations of 50,000+. Penalties start at $75,000 for first
              violations and $150,000 for subsequent violations.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              {
                stat: "$75K",
                label: "First violation penalty",
                detail: "Per ADA Title II enforcement",
              },
              {
                stat: "$150K",
                label: "Subsequent violations",
                detail: "Penalties compound quickly",
              },
              {
                stat: "Apr 2026",
                label: "Compliance deadline",
                detail: "For populations 50,000+",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-8 text-center"
              >
                <div className="font-[family-name:var(--font-display)] text-4xl font-bold text-caso-red">
                  {item.stat}
                </div>
                <div className="mt-2 text-sm font-semibold text-caso-white">
                  {item.label}
                </div>
                <div className="mt-1 text-xs text-caso-slate">
                  {item.detail}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/resources/ada-title-ii-guide"
              className="inline-flex items-center gap-2 text-sm font-semibold text-caso-blue transition-colors hover:text-caso-blue-bright"
            >
              Read the full ADA Title II compliance guide
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works — Simplified 3 Steps + WorkflowAnimation */}
      <section
        id="how-it-works"
        className="relative overflow-hidden border-b border-caso-border/50 bg-caso-navy px-6 py-20 md:py-28"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Image
            src="/bg-workflow.png"
            alt=""
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-caso-navy/60" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps to compliance.
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              Upload your documents. We handle the rest.
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Upload",
                desc: "Upload PDFs, Word documents, or spreadsheets — individually or in bulk.",
                icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5",
              },
              {
                step: "2",
                title: "AI Remediation",
                desc: "Our AI engine tags structure, generates alt text, fixes reading order, and validates compliance.",
                icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5",
              },
              {
                step: "3",
                title: "Download",
                desc: "Download fully compliant documents with compliance reports and audit trails.",
                icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-caso-border bg-caso-navy-light/50 p-8 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-caso-blue/20 text-caso-blue">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={item.icon}
                    />
                  </svg>
                </div>
                <div className="mt-4 font-[family-name:var(--font-display)] text-xl font-bold text-caso-white">
                  {item.title}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-caso-slate">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Under the hood */}
          <div className="mt-16">
            <p className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-caso-slate">
              Under the hood
            </p>
            <WorkflowAnimation />
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Document remediation services
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              Powered by Accessibility on Demand&trade; — CASO&apos;s
              AI-driven remediation engine.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
            {/* PDF Remediation - Active */}
            <Link
              href="/services/pdf-remediation"
              className="group rounded-2xl border border-caso-border bg-caso-navy-light/50 p-8 transition-all hover:border-caso-blue hover:shadow-lg hover:shadow-caso-blue/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-caso-blue/20 text-caso-blue">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
                </svg>
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-bold text-caso-white group-hover:text-caso-blue">
                PDF Remediation
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-caso-slate">
                Full WCAG 2.1 AA, PDF/UA, and Section 508 compliance. Starting
                at $0.30/page.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-caso-blue">
                Learn more
                <svg
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </Link>

            {/* Office Remediation - Coming Soon */}
            <div className="rounded-2xl border border-caso-border/50 bg-caso-navy-light/30 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-caso-glacier/10 text-caso-glacier/70">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
                </svg>
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-bold text-caso-glacier">
                Office Remediation
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-caso-slate">
                Word, Excel, and PowerPoint accessibility remediation.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 rounded-full border border-caso-border px-3 py-1 text-xs font-semibold text-caso-glacier">
                Coming Soon
              </span>
            </div>

            {/* SiteScan - Coming Soon */}
            <div className="rounded-2xl border border-caso-border/50 bg-caso-navy-light/30 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-caso-glacier/10 text-caso-glacier/70">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 3.236a1 1 0 01.842-.164l6 1.667a1 1 0 01.751.969v4.097a6 6 0 01-3.037 5.213l-3.515 2.007a1 1 0 01-.992 0L6.5 15.018A6 6 0 013.463 9.805V5.708a1 1 0 01.751-.969l6-1.667z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-bold text-caso-glacier">
                SiteScan
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-caso-slate">
                Automated document inventory, scoring, and compliance
                monitoring.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 rounded-full border border-caso-border px-3 py-1 text-xs font-semibold text-caso-glacier">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Preview */}
      <section
        id="demo"
        aria-label="Remediation preview"
        className="relative overflow-hidden border-y border-gray-200 bg-[#F0F4F8] px-6 py-20 md:py-28"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Image
            src="/bg-demo-light.png"
            alt=""
            fill
            className="object-cover opacity-40"
          />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              See the difference
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Watch a non-compliant document transform into a fully accessible,
              tagged file — in real time.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-4xl">
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-0">
              {/* Before */}
              <div className="w-full max-w-sm rounded-2xl border border-slate-200 border-t-4 border-t-red-400 bg-white p-6 shadow-md shadow-slate-200/50 md:scale-95 md:opacity-90">
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-caso-red/20"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-3.5 w-3.5 text-caso-red"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-bold uppercase tracking-wider text-red-500">
                    Before
                  </span>
                </div>
                <div className="flex h-48 items-center justify-center rounded-xl border border-red-100 bg-red-50/50">
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-red-200 bg-red-50">
                      <span className="font-[family-name:var(--font-display)] text-2xl font-black text-red-600">
                        F
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-red-500">
                      Score: 23/100
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {[
                    "No structure tags",
                    "Missing alt text",
                    "Incorrect reading order",
                  ].map((issue) => (
                    <div
                      key={issue}
                      className="flex items-center gap-2 text-sm text-red-600"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      {issue}
                    </div>
                  ))}
                </div>
              </div>

              {/* Transformation Arrow */}
              <div
                className="z-20 hidden h-14 w-14 items-center justify-center rounded-full border border-slate-100 bg-white shadow-xl md:flex md:-mx-7"
                aria-hidden="true"
              >
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
              {/* Mobile arrow */}
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white shadow-lg md:hidden"
                aria-hidden="true"
              >
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>

              {/* After */}
              <div className="relative z-10 w-full max-w-sm rounded-2xl border-2 border-green-500 bg-gradient-to-b from-green-50/30 to-white p-6 shadow-xl shadow-green-900/10 md:scale-105">
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-caso-green/20"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-3.5 w-3.5 text-caso-green"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-bold uppercase tracking-wider text-caso-green">
                    After
                  </span>
                </div>
                <div className="flex h-48 items-center justify-center rounded-xl border border-green-100 bg-green-50/30">
                  <div className="text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/40">
                      <span className="font-[family-name:var(--font-display)] text-3xl font-black text-white">
                        A
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-green-500">
                      Score: 97/100
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {[
                    "Full PDF/UA structure tags",
                    "AI-generated alt text",
                    "Correct logical reading order",
                  ].map((fix) => (
                    <div
                      key={fix}
                      className="flex items-center gap-2 text-sm text-green-600"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {fix}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Demo CTA */}
            <div className="mt-8 text-center">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-xl bg-caso-blue px-8 py-4 text-base font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
              >
                Try the Live Demo
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
              <p className="mt-3 text-sm text-gray-500">
                Upload your own document and see the results in real time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="relative overflow-hidden border-y border-gray-200 bg-[#F0F4F8] px-6 py-20 md:py-28"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Image
            src="/bg-pricing-light.png"
            alt=""
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple per-page pricing.{" "}
              <span className="text-caso-blue">No surprises.</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the service level that matches your documents&apos;
              complexity. Mix and match across your library.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
            {SERVICE_LEVELS.map((tier) => (
              <div
                key={tier.level}
                className={`service-card relative rounded-2xl border p-8 ${
                  tier.featured
                    ? "border-caso-blue bg-white shadow-xl shadow-caso-blue/10"
                    : "border-gray-200 bg-white shadow-sm"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-caso-blue px-4 py-1 text-xs font-bold uppercase tracking-wider text-caso-white">
                    Most Popular
                  </div>
                )}
                <div className="text-sm font-semibold uppercase tracking-wider text-caso-blue">
                  {tier.level}
                </div>
                <div className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-gray-900">
                  {tier.name}
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-gray-900">
                    {tier.price}
                  </span>
                  <span className="text-base text-gray-500">/page</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  {tier.description}
                </p>
                <div className="mt-3 text-xs text-gray-400">
                  Turnaround: {tier.turnaround}
                </div>
                <ul className="mt-6 space-y-3" role="list">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-gray-600"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-caso-green"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/free-scan"
                  className={`mt-8 block rounded-xl px-6 py-3 text-center text-sm font-bold transition-all ${
                    tier.featured
                      ? "bg-caso-blue text-white hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
                      : "border border-gray-300 bg-transparent text-gray-700 hover:border-caso-blue hover:bg-gray-50"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-sm font-semibold text-caso-blue transition-colors hover:text-caso-blue-bright"
            >
              View full pricing details & volume discounts
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Built for the organizations that need it most.
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              From state agencies to universities to Fortune 500 companies — we
              serve organizations with the highest compliance requirements.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              {
                title: "Government",
                desc: "ADA Title II compliance for state, county, and municipal agencies. Meet your April 2026 deadline with confidence.",
                href: "/solutions/government",
                icon: "M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H18v8.75A2.75 2.75 0 0115.25 15h-1.072l.798 3.06a.75.75 0 01-1.452.38L12.69 15H7.31l-.834 3.44a.75.75 0 01-1.452-.38L5.822 15H4.75A2.75 2.75 0 012 12.25V3.5h-.25A.75.75 0 011 2.75z",
              },
              {
                title: "Higher Education",
                desc: "Section 508 and ADA compliance for universities. Bulk remediation for course materials, research, and administrative documents.",
                href: "/solutions/higher-education",
                icon: "M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-3.14 1.346 2.352 1.005a1 1 0 00.788 0l7-3a1 1 0 000-1.838l-7-3.001z",
              },
              {
                title: "Enterprise",
                desc: "ADA Title III compliance and lawsuit prevention. API integration, security certifications, and dedicated support for large organizations.",
                href: "/solutions/enterprise",
                icon: "M4 16.5v-13h-.25a.75.75 0 010-1.5h12.5a.75.75 0 010 1.5H16v13h.25a.75.75 0 010 1.5H3.75a.75.75 0 010-1.5H4zm3-11a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 017 5.5zm0 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 017 8.5zm0 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm-1 4.75v-2.5a.75.75 0 01.75-.75h2.5a.75.75 0 01.75.75v2.5h-4z",
              },
            ].map((sector) => (
              <Link
                key={sector.title}
                href={sector.href}
                className="group rounded-2xl border border-caso-border bg-caso-navy-light/50 p-8 transition-all hover:border-caso-blue hover:shadow-lg hover:shadow-caso-blue/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-caso-blue/20 text-caso-blue">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d={sector.icon}
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-bold text-caso-white group-hover:text-caso-blue">
                  {sector.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-caso-slate">
                  {sector.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-caso-blue">
                  Learn more
                  <svg
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment Options */}
      <section
        id="enterprise"
        className="relative overflow-hidden px-6 py-20 md:py-28"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Image
            src="/bg-enterprise.png"
            alt=""
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-caso-navy/70" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-caso-teal/30 bg-caso-teal/10 px-4 py-1.5">
              <svg
                className="h-4 w-4 text-caso-teal"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7"
                />
              </svg>
              <span className="text-sm font-semibold text-caso-teal">
                Flexible Deployment
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Deploy your way.{" "}
              <span className="text-caso-teal">Your data, your control.</span>
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              Cloud, on-premise, or hybrid — choose the deployment model that
              matches your security requirements.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
            {DEPLOYMENT_MODES.map((mode) => (
              <div
                key={mode.mode}
                className={`relative rounded-2xl border p-8 ${
                  mode.featured
                    ? "border-caso-teal bg-caso-navy-light shadow-xl shadow-caso-teal/10"
                    : "border-caso-border bg-caso-navy-light/50"
                }`}
              >
                {mode.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-caso-teal px-4 py-1 text-xs font-bold uppercase tracking-wider text-caso-navy">
                    Recommended
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      mode.featured
                        ? "bg-caso-teal/20 text-caso-teal"
                        : "bg-caso-blue/10 text-caso-blue"
                    }`}
                  >
                    {mode.icon}
                  </div>
                  <div className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white">
                    {mode.mode}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-caso-slate">
                  {mode.description}
                </p>
                <div className="mt-4 rounded-lg border border-caso-border/50 bg-caso-navy/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-3.5 w-3.5 shrink-0 text-caso-green"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                      />
                    </svg>
                    <span className="text-xs font-medium text-caso-slate">
                      {mode.dataPolicy}
                    </span>
                  </div>
                </div>
                <ul className="mt-5 space-y-2.5" role="list">
                  {mode.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-caso-slate"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-caso-green"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-caso-slate/70">
                  Ideal for: {mode.ideal}
                </p>
                <Link
                  href={
                    mode.mode === "Enterprise" ? "/contact" : "/free-scan"
                  }
                  className={`mt-6 block rounded-xl px-6 py-3 text-center text-sm font-bold transition-all ${
                    mode.featured
                      ? "bg-caso-teal text-caso-navy hover:bg-caso-teal/90 hover:shadow-lg hover:shadow-caso-teal/25"
                      : "border border-caso-border bg-transparent text-caso-white hover:border-caso-teal hover:bg-caso-navy-light"
                  }`}
                >
                  {mode.mode === "Enterprise"
                    ? "Contact Sales"
                    : "Get Started"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section
        aria-label="Trusted by organizations"
        className="relative overflow-hidden px-6 py-20 md:py-28"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Image
            src="/bg-partners.png"
            alt=""
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-caso-navy/70" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by government and education
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              CASO has over 30 years of experience serving public sector
              organizations across the country since 1994.
            </p>
          </div>

          {/* Client types strip */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-10">
            {[
              "State Agencies",
              "Universities",
              "Medical Centers",
              "Municipalities",
              "Nonprofits",
              "Construction",
            ].map((name) => (
              <div
                key={name}
                className="flex h-12 items-center rounded-lg border border-caso-border/50 bg-caso-navy-light/50 px-6"
              >
                <span className="text-sm font-medium text-caso-slate/60">
                  {name}
                </span>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "The CDM Team has been exceptional. They completed the work faster and cheaper than we could have, and have always accommodated our needs. It is a pleasure working with them.",
                name: "Richard Ajimati",
                org: "SUNY Downstate Medical Center",
                initials: "RA",
              },
              {
                quote:
                  "We saw immediate benefits in efficiency, accuracy and process control. With ECM Toolbox AP Workflow, we have a solution that allows us to grow and meet our new needs.",
                name: "Nick Coccagna",
                org: "CIO, PJ Dick/Trumbull",
                initials: "NC",
              },
              {
                quote:
                  "CDM\u2019s Digital Mail Workflow has given us the ability to not only serve our clients during these unprecedented times, but also to empower us to deliver our renowned services with unmatched speed, accuracy and security.",
                name: "Gregory Lawler",
                org: "GPM Life",
                initials: "GL",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-caso-blue/30 bg-white/[0.07] p-6 shadow-lg shadow-black/20 backdrop-blur-sm md:p-8"
              >
                <svg
                  className="h-7 w-7 text-caso-teal"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
                </svg>
                <blockquote className="mt-3">
                  <p className="text-sm leading-relaxed text-gray-200 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-caso-teal/20 text-xs font-bold text-caso-teal"
                      aria-hidden="true"
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {t.name}
                      </div>
                      <div className="text-xs text-caso-teal">{t.org}</div>
                    </div>
                  </footer>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About CASO */}
      <section className="border-t border-caso-border/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
            Backed by 30+ years of document expertise.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-caso-slate">
            CASO Comply is a product of{" "}
            <a
              href="https://caso.com"
              className="text-caso-glacier underline decoration-caso-glacier/30 underline-offset-2 hover:text-caso-blue hover:decoration-caso-blue/50"
              target="_blank"
              rel="noopener noreferrer"
            >
              CASO Document Management
            </a>
            , a SOC 2 Type II certified company that has served government
            agencies, universities, medical centers, and enterprises since 1994.
            Our Accessibility on Demand&trade; platform combines AI-powered
            automation with decades of document management expertise.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
            <Image
              src="/soc2-badge.jpg"
              alt="AICPA SOC 2 Type II Certified"
              width={130}
              height={97}
              className="h-16 w-auto"
            />
            <div className="text-left">
              <div className="text-sm font-semibold text-caso-white">
                CASO Document Management, Inc.
              </div>
              <div className="text-sm text-caso-slate">
                Bohemia, NY &bull; Founded 1994
              </div>
              <div className="text-sm text-caso-slate">
                SOC 2 Type II &bull; HIPAA Compliant
              </div>
            </div>
          </div>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-caso-blue transition-colors hover:text-caso-blue-bright"
          >
            Learn more about CASO
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
