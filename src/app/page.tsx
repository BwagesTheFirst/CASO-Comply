import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "@/components/CountdownTimer";
import ScanForm from "@/components/ScanForm";
import MobileNav from "@/components/MobileNav";
import WorkflowAnimation from "@/components/WorkflowAnimation";

const SERVICE_LEVELS = [
  {
    level: "Standard",
    name: "Standard",
    price: "$0.25",
    description:
      "Automated remediation with font-size heuristic tagging. Fast, reliable, and cost-effective for bulk processing.",
    features: [
      "Auto-tag structure (headings, lists, paragraphs)",
      "Metadata cleanup & language tagging",
      "Logical reading order correction",
      "Before & after scoring",
      "Batch processing via API or Docker agent",
    ],
  },
  {
    level: "AI Verified",
    name: "AI Verified",
    price: "$0.35",
    description:
      "AI verifies heading hierarchy, reading order, and generates alt text. Higher accuracy for complex documents.",
    features: [
      "Everything in Standard",
      "AI-generated alt text for images",
      "AI-verified heading hierarchy",
      "AI-verified reading order",
      "Complex table header association",
      "Remediation log & audit artifacts",
    ],
    featured: true,
  },
  {
    level: "Human Review",
    name: "Human Review",
    price: "$4.00",
    description:
      "AI-verified remediation plus expert human review for files scoring below 60. Full compliance certification.",
    features: [
      "Everything in AI Verified",
      "Human expert review & correction",
      "VPAT/compliance certificate",
      "Priority processing (24-hr SLA)",
      "Dedicated account manager",
      "Custom reporting & analytics",
    ],
  },
];


const DEPLOYMENT_MODES = [
  {
    mode: "Cloud API",
    description: "Upload documents to our secure cloud for processing. Fastest setup — no infrastructure required.",
    dataPolicy: "Full PDFs sent to CASO cloud (AES-256 encrypted)",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
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
    description: "Run the agent on your infrastructure. Scans folders, processes on a schedule, reports back to the dashboard.",
    dataPolicy: "Documents processed locally on your servers",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7" />
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
    description: "Custom deployment with dedicated support, SLAs, and compliance certification for regulated industries.",
    dataPolicy: "Fully configurable data handling",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
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

const STATS = [
  { value: "2.5T+", label: "documents on the web globally" },
  { value: "90%", label: "are inaccessible" },
  { value: "24/7", label: "automated remediation" },
  { value: "95%+", label: "automated accuracy rate" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-caso-navy text-caso-white">
      {/* Skip to main content */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <nav aria-label="Primary navigation" className="sticky top-0 z-40 border-b border-caso-border/50 bg-caso-navy/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2" aria-label="CASO Comply home">
            <Image
              src="/caso-comply-logo-white.png"
              alt="CASO Comply"
              width={426}
              height={80}
              className="h-10 w-auto"
              priority
            />
            <span className="hidden rounded border border-caso-border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-caso-glacier sm:inline-block">
              Beta
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 lg:flex">
            <a
              href="#how-it-works"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              How It Works
            </a>
            <a
              href="#enterprise"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Enterprise
            </a>
            <a
              href="#demo"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Demo
            </a>
            <a
              href="#partners"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Partners
            </a>
            <Link
              href="/pricing"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="ml-4 rounded-xl bg-caso-blue px-5 py-2.5 text-sm font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Nav */}
          <MobileNav />
        </div>
      </nav>

      <main id="main-content">
        {/* Hero Section — Enterprise-first messaging */}
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
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-caso-red opacity-75" aria-hidden="true" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-caso-red" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-caso-red">
                  ADA Title II Compliance Deadline: April 24, 2026
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="font-[family-name:var(--font-display)] text-4xl font-900 leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                PDFs. Word docs. Spreadsheets.
                <br />
                <span className="text-gradient">
                  All made accessible — automatically.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-caso-slate md:text-xl">
                CASO Comply deploys on your infrastructure and remediates every document
                to WCAG 2.2 AA, PDF/UA, and Section 508 compliance — PDFs, Word files,
                and Excel spreadsheets, automatically on your schedule.
              </p>
            </div>

            {/* Scan Form */}
            <div id="scan" className="mx-auto mt-10 max-w-2xl">
              <ScanForm variant="hero" />
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

        {/* Stats Strip */}
        <section aria-label="Key statistics" className="border-y border-gray-200 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-14 md:grid-cols-4 md:gap-8">
            {STATS.map((item) => (
              <div key={item.label} className="text-center">
                <div className="font-[family-name:var(--font-display)] text-3xl font-bold text-caso-blue sm:text-4xl">
                  {item.value}
                </div>
                <div className="mt-2 text-sm font-medium text-gray-600">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works — Animated Workflow */}
        <section id="how-it-works" className="relative overflow-hidden border-b border-caso-border/50 bg-caso-navy px-6 py-20 md:py-28">
          {/* Background image */}
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
                How It Works
              </h2>
              <p className="mt-4 text-lg text-caso-slate">
                Install the agent. Watch your documents become compliant.
              </p>
            </div>

            <div className="mt-14">
              <WorkflowAnimation />
            </div>
          </div>
        </section>

        {/* Enterprise Deployment / On-Premise Agent */}
        <section id="enterprise" className="relative overflow-hidden px-6 py-20 md:py-28">
          {/* Background image */}
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
                <svg className="h-4 w-4 text-caso-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
                </svg>
                <span className="text-sm font-semibold text-caso-teal">On-Premise Agent</span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Deploy on your infrastructure.{" "}
                <span className="text-caso-teal">Your data never leaves.</span>
              </h2>
              <p className="mt-4 text-lg text-caso-slate">
                Install our Docker-based agent on your servers. It scans folders, crawls
                websites, and remediates documents automatically — on your schedule, under your
                control.
              </p>
            </div>

            {/* How the agent works */}
            <div className="mx-auto mt-12 max-w-3xl">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z", label: "Scan folders & sites" },
                  { icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z", label: "Deduplicate by hash" },
                  { icon: "M11.42 15.17l-5.56-5.56a2.002 2.002 0 010-2.83l.28-.28a2 2 0 012.83 0l5.56 5.56m-7.12 7.12l7.12-7.12m0 0l2.83-2.83a2 2 0 000-2.83l-.28-.28a2 2 0 00-2.83 0L10.59 12.3", label: "Remediate automatically" },
                  { icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z", label: "Track & report" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-2 rounded-xl border border-caso-border/50 bg-caso-navy-light/50 p-4 text-center">
                    <svg className="h-6 w-6 text-caso-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    <span className="text-xs font-medium text-caso-slate">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deployment mode cards */}
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
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${mode.featured ? "bg-caso-teal/20 text-caso-teal" : "bg-caso-blue/10 text-caso-blue"}`}>
                      {mode.icon}
                    </div>
                    <div>
                      <div className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white">
                        {mode.mode}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-caso-slate">
                    {mode.description}
                  </p>
                  <div className="mt-4 rounded-lg border border-caso-border/50 bg-caso-navy/50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <svg className="h-3.5 w-3.5 shrink-0 text-caso-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                      <span className="text-xs font-medium text-caso-slate">{mode.dataPolicy}</span>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2.5" role="list">
                    {mode.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-caso-slate">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-caso-slate/70">
                    Ideal for: {mode.ideal}
                  </p>
                  <a
                    href="#scan"
                    className={`mt-6 block rounded-xl px-6 py-3 text-center text-sm font-bold transition-all ${
                      mode.featured
                        ? "bg-caso-teal text-caso-navy hover:bg-caso-teal/90 hover:shadow-lg hover:shadow-caso-teal/25"
                        : "border border-caso-border bg-transparent text-caso-white hover:border-caso-teal hover:bg-caso-navy-light"
                    }`}
                  >
                    {mode.mode === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </a>
                </div>
              ))}
            </div>

            {/* Dashboard preview */}
            <div className="mx-auto mt-14 max-w-4xl">
              <div className="mx-auto mb-6 max-w-2xl text-center">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white sm:text-2xl">
                  Install once. Remediate forever.
                </h3>
                <p className="mt-2 text-sm text-caso-slate">
                  The agent runs on your servers 24/7 — scanning folders, finding new documents,
                  and remediating them automatically. Track everything from the built-in dashboard.
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-caso-border shadow-2xl shadow-caso-teal/5">
                <Image
                  src="/agent-dashboard.png"
                  alt="CASO Comply Agent dashboard showing document remediation status, scores, and configuration"
                  width={1440}
                  height={800}
                  className="w-full"
                />
              </div>
              <p className="mt-3 text-center text-sm text-caso-slate">
                Built-in dashboard at localhost:9090 — monitor every document in real time
              </p>
            </div>

            {/* Deploy CTA */}
            <div className="mx-auto mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/setup"
                className="inline-flex items-center gap-2 rounded-xl bg-caso-teal px-8 py-4 text-base font-bold text-caso-navy transition-all hover:bg-caso-teal/90 hover:shadow-lg hover:shadow-caso-teal/25"
              >
                View Setup Guide
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <span className="text-sm text-caso-slate">
                One Docker image. One config file. Deploy in minutes.
              </span>
            </div>
          </div>
        </section>

        {/* Before/After Preview */}
        <section id="demo" aria-label="Remediation preview" className="relative overflow-hidden border-y border-gray-200 bg-[#F0F4F8] px-6 py-20 md:py-28">
          {/* Background image */}
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
              <div className="grid gap-6 md:grid-cols-2">
                {/* Before */}
                <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-caso-red/20" aria-hidden="true">
                      <svg className="h-3.5 w-3.5 text-caso-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wider text-caso-red">Before</span>
                  </div>
                  <div className="flex h-48 items-center justify-center rounded-xl border border-red-100 bg-red-50/50">
                    <div className="text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <span className="font-[family-name:var(--font-display)] text-2xl font-black text-red-600">F</span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-red-500">
                        Score: 23/100
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      No structure tags
                    </div>
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Missing alt text
                    </div>
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Incorrect reading order
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-caso-green/20" aria-hidden="true">
                      <svg className="h-3.5 w-3.5 text-caso-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wider text-caso-green">After</span>
                  </div>
                  <div className="flex h-48 items-center justify-center rounded-xl border border-green-100 bg-green-50/50">
                    <div className="text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <span className="font-[family-name:var(--font-display)] text-2xl font-black text-green-600">A</span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-green-500">
                        Score: 97/100
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Full PDF/UA structure tags
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      AI-generated alt text
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Correct logical reading order
                    </div>
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
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
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
        <section id="pricing" className="relative overflow-hidden border-y border-gray-200 bg-[#F0F4F8] px-6 py-20 md:py-28">
          {/* Background image */}
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
                Per-page pricing for{" "}
                <span className="text-caso-blue">any volume.</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Choose the service level that matches your documents&apos; complexity.
                Mix and match across your library.
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
                  <a
                    href="#scan"
                    className={`mt-8 block rounded-xl px-6 py-3 text-center text-sm font-bold transition-all ${
                      tier.featured
                        ? "bg-caso-blue text-white hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
                        : "border border-gray-300 bg-transparent text-gray-700 hover:border-caso-blue hover:bg-gray-50"
                    }`}
                  >
                    Get Started
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof / Testimonials */}
        <section id="partners" aria-label="Trusted by organizations" className="relative overflow-hidden px-6 py-20 md:py-28">
          {/* Background image */}
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
                CASO has over 20 years of experience serving public sector
                organizations across the country.
              </p>
            </div>

            {/* Logo placeholder strip */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-10">
              {["State Agencies", "Universities", "Municipalities", "School Districts", "Federal Contractors"].map(
                (name) => (
                  <div
                    key={name}
                    className="flex h-12 items-center rounded-lg border border-caso-border/50 bg-caso-navy-light/50 px-6"
                  >
                    <span className="text-sm font-medium text-caso-slate/60">{name}</span>
                  </div>
                )
              )}
            </div>

            {/* Testimonial placeholder */}
            <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-caso-border bg-caso-navy-light p-8 md:p-10">
              <svg className="h-8 w-8 text-caso-blue/30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
              </svg>
              <blockquote className="mt-4">
                <p className="text-lg leading-relaxed text-caso-slate italic">
                  &ldquo;Testimonial from a satisfied client will go here. This
                  section is ready for real customer quotes once collected.&rdquo;
                </p>
                <footer className="mt-6 flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-caso-blue/10 text-sm font-bold text-caso-blue" aria-hidden="true">
                    AB
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-caso-white">
                      Client Name
                    </div>
                    <div className="text-sm text-caso-slate">
                      Title, Organization
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section aria-label="Get your free accessibility report" className="relative overflow-hidden px-6 py-20 md:py-28">
          {/* Background image */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <Image
              src="/bg-cta.png"
              alt=""
              fill
              className="object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-caso-navy/60" />
          </div>
          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Get your free accessibility report
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              See every inaccessible document on your site, with remediation cost
              estimates and a compliance roadmap. No credit card required.
            </p>
            <div className="mt-10">
              <ScanForm variant="footer" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-caso-border/50 bg-caso-navy-light/50" role="contentinfo">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-4">
            {/* Brand column */}
            <div className="md:col-span-1">
              <Image
                src="/caso-comply-logo-white.png"
                alt="CASO Comply"
                width={426}
                height={80}
                className="h-8 w-auto"
              />
              <p className="mt-3 text-sm leading-relaxed text-caso-slate">
                AI-powered document accessibility remediation by{" "}
                <a
                  href="https://caso.com"
                  className="text-caso-glacier underline decoration-caso-glacier/30 underline-offset-2 hover:text-caso-blue hover:decoration-caso-blue/50"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CASO Document Management
                </a>
                .
              </p>
              <p className="mt-2 text-sm text-caso-slate">San Antonio, Texas</p>
            </div>

            {/* Product links */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-caso-glacier">
                Product
              </h3>
              <ul className="mt-4 space-y-3" role="list">
                <li>
                  <a href="#how-it-works" className="text-sm text-caso-slate hover:text-caso-white">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#enterprise" className="text-sm text-caso-slate hover:text-caso-white">
                    Enterprise Agent
                  </a>
                </li>
                <li>
                  <Link href="/setup" className="text-sm text-caso-slate hover:text-caso-white">
                    Setup Guide
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm text-caso-slate hover:text-caso-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <a href="#scan" className="text-sm text-caso-slate hover:text-caso-white">
                    Free Site Audit
                  </a>
                </li>
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-caso-glacier">
                Company
              </h3>
              <ul className="mt-4 space-y-3" role="list">
                <li>
                  <a href="https://caso.com/about/" className="text-sm text-caso-slate hover:text-caso-white" target="_blank" rel="noopener noreferrer">
                    About CASO
                  </a>
                </li>
                <li>
                  <a href="https://caso.com/services/" className="text-sm text-caso-slate hover:text-caso-white" target="_blank" rel="noopener noreferrer">
                    Services
                  </a>
                </li>
                <li>
                  <a href="https://caso.com/services/accessibility-on-demand/" className="text-sm text-caso-slate hover:text-caso-white" target="_blank" rel="noopener noreferrer">
                    Accessibility on Demand
                  </a>
                </li>
                <li>
                  <a href="#partners" className="text-sm text-caso-slate hover:text-caso-white">
                    Partner Program
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal links */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-caso-glacier">
                Legal
              </h3>
              <ul className="mt-4 space-y-3" role="list">
                <li>
                  <a href="/accessibility" className="text-sm text-caso-slate hover:text-caso-white">
                    Accessibility Statement
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-sm text-caso-slate hover:text-caso-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-sm text-caso-slate hover:text-caso-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 border-t border-caso-border/50 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-6">
                <Image
                  src="/soc2-badge.jpg"
                  alt="AICPA SOC 2 Type II Certified"
                  width={130}
                  height={97}
                  className="h-12 w-auto"
                />
                <div className="text-center text-sm text-caso-slate md:text-left">
                  <p>
                    &copy; {new Date().getFullYear()} CASO Document Management,
                    Inc. All rights reserved.
                  </p>
                  <p className="mt-1">
                    Accessibility on Demand&trade; is a service of CASO Document
                    Management.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.linkedin.com/company/caso-inc"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CASO on LinkedIn"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/casodocumentmanagement/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CASO on Facebook"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
