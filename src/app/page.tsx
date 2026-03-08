import Image from "next/image";
import CountdownTimer from "@/components/CountdownTimer";
import ScanForm from "@/components/ScanForm";
import MobileNav from "@/components/MobileNav";

const SERVICE_LEVELS = [
  {
    level: "Level 1",
    name: "Standard",
    price: "$0.10",
    description:
      "Automated tagging, metadata, and structure for straightforward documents. Ideal for high-volume, text-heavy PDFs.",
    features: [
      "Auto-tag structure (headings, lists, paragraphs)",
      "Metadata cleanup & language tagging",
      "Logical reading order correction",
      "veraPDF + PAC 2024 validation",
      "Batch processing via API",
    ],
  },
  {
    level: "Level 2",
    name: "Enhanced",
    price: "$0.20",
    description:
      "AI-powered alt text, complex table handling, and quality review. For documents with images, charts, and data tables.",
    features: [
      "Everything in Standard",
      "AI-generated alt text for images",
      "Complex table header association",
      "Form field labeling",
      "Automated quality review pass",
      "Remediation log & audit artifacts",
    ],
    featured: true,
  },
  {
    level: "Level 3",
    name: "Full Remediation",
    price: "$0.50",
    description:
      "Human-in-the-loop review for mission-critical and legal documents. Compliance certificate included.",
    features: [
      "Everything in Enhanced",
      "Human expert review & correction",
      "VPAT/compliance certificate",
      "Priority processing (24-hr SLA)",
      "Dedicated account manager",
      "Custom reporting & analytics",
    ],
  },
];

const STEPS = [
  {
    step: "1",
    title: "Scan",
    description: "Enter your URL. We crawl your entire site and identify every PDF document.",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    step: "2",
    title: "Score",
    description: "AI evaluates each document against WCAG 2.1 AA, PDF/UA, and Section 508.",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    step: "3",
    title: "Remediate",
    description: "We fix sample PDFs automatically and show you side-by-side before and after.",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.56-5.56a2.002 2.002 0 010-2.83l.28-.28a2 2 0 012.83 0l5.56 5.56m-7.12 7.12l7.12-7.12m0 0l2.83-2.83a2 2 0 000-2.83l-.28-.28a2 2 0 00-2.83 0L10.59 12.3" />
      </svg>
    ),
  },
  {
    step: "4",
    title: "Report",
    description: "Receive a full audit report with costs, timelines, and a remediation roadmap.",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
];

const STATS = [
  { value: "2.5T+", label: "PDFs on the web globally" },
  { value: "90%", label: "are inaccessible" },
  { value: "$0.10", label: "per page starting cost" },
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
          <a href="/" className="flex items-baseline gap-1" aria-label="CASO Comply home">
            <Image
              src="/caso-logo.png"
              alt="CASO"
              width={164}
              height={57}
              className="h-9 w-auto brightness-0 invert"
              priority
            />
            <span className="text-[1.65rem] font-extrabold lowercase leading-none tracking-tight text-caso-blue" style={{ fontFamily: "var(--font-raleway), sans-serif", letterSpacing: "-0.02em" }}>
              comply
            </span>
            <span className="ml-1 hidden rounded border border-caso-border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-caso-glacier sm:inline-block">
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
              href="#service-levels"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Service Levels
            </a>
            <a
              href="#pricing"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Pricing
            </a>
            <a
              href="#resources"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Resources
            </a>
            <a
              href="#partners"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Partners
            </a>
            <a
              href="#scan"
              className="ml-4 rounded-xl bg-caso-blue px-5 py-2.5 text-sm font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Free Site Audit
            </a>
          </div>

          {/* Mobile Nav */}
          <MobileNav />
        </div>
      </nav>

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 pb-8 pt-16 md:pb-16 md:pt-24">
          {/* Background gradient */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
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
                Your PDFs aren&apos;t accessible.
                <br />
                <span className="text-gradient">
                  We can prove it in 60 seconds.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-caso-slate md:text-xl">
                CASO Comply scans your website, finds every PDF, and shows you
                exactly what&apos;s non-compliant — with before-and-after proof of
                automated remediation. Starting at{" "}
                <strong className="text-caso-white">$0.10/page</strong>.
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
        <section aria-label="Key statistics" className="border-y border-caso-border/50 bg-caso-navy-light/50">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-14 md:grid-cols-4 md:gap-8">
            {STATS.map((item) => (
              <div key={item.label} className="text-center">
                <div className="font-[family-name:var(--font-display)] text-3xl font-bold text-caso-blue sm:text-4xl">
                  {item.value}
                </div>
                <div className="mt-2 text-sm font-medium text-caso-slate">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Service Levels */}
        <section id="service-levels" className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Three levels. One goal:{" "}
                <span className="text-caso-blue">compliance.</span>
              </h2>
              <p className="mt-4 text-lg text-caso-slate">
                Choose the service level that matches your documents&apos; complexity.
                Mix and match across your library.
              </p>
            </div>

            <div id="pricing" className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
              {SERVICE_LEVELS.map((tier) => (
                <div
                  key={tier.level}
                  className={`service-card relative rounded-2xl border p-8 ${
                    tier.featured
                      ? "border-caso-blue bg-caso-navy-light shadow-xl shadow-caso-blue/10"
                      : "border-caso-border bg-caso-navy-light/50"
                  }`}
                >
                  {tier.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-caso-blue px-4 py-1 text-xs font-bold uppercase tracking-wider text-caso-white">
                      Most Popular
                    </div>
                  )}
                  <div className="text-sm font-semibold uppercase tracking-wider text-caso-glacier">
                    {tier.level}
                  </div>
                  <div className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                    {tier.name}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-caso-white">
                      {tier.price}
                    </span>
                    <span className="text-base text-caso-slate">/page</span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-caso-slate">
                    {tier.description}
                  </p>
                  <ul className="mt-6 space-y-3" role="list">
                    {tier.features.map((feature) => (
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
                  <a
                    href="#scan"
                    className={`mt-8 block rounded-xl px-6 py-3 text-center text-sm font-bold transition-all ${
                      tier.featured
                        ? "bg-caso-blue text-caso-white hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
                        : "border border-caso-border bg-transparent text-caso-white hover:border-caso-blue hover:bg-caso-navy-light"
                    }`}
                  >
                    Get Started
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="border-y border-caso-border/50 bg-caso-navy-light/30 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                How CASO Comply works
              </h2>
              <p className="mt-4 text-lg text-caso-slate">
                From scan to compliant — in four simple steps.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-4">
              {STEPS.map((item, index) => (
                <div
                  key={item.step}
                  className={`relative text-center ${index < STEPS.length - 1 ? "step-connector" : ""}`}
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-caso-blue/10 text-caso-blue">
                    {item.icon}
                  </div>
                  <div className="mt-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-caso-navy-light text-xs font-bold text-caso-glacier">
                    {item.step}
                  </div>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
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

        {/* Before/After Preview Placeholder */}
        <section aria-label="Remediation preview" className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                See the difference
              </h2>
              <p className="mt-4 text-lg text-caso-slate">
                Watch a non-compliant PDF transform into a fully accessible,
                tagged document — in real time.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-4xl">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Before */}
                <div className="rounded-2xl border border-caso-red-dark/30 bg-caso-navy-light p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-caso-red/20" aria-hidden="true">
                      <svg className="h-3.5 w-3.5 text-caso-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wider text-caso-red">Before</span>
                  </div>
                  <div className="flex h-48 items-center justify-center rounded-xl border border-caso-border bg-caso-navy/50">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-caso-slate/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <p className="mt-3 text-sm text-caso-slate/50">
                        Untagged PDF preview
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-caso-red/80">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      No structure tags
                    </div>
                    <div className="flex items-center gap-2 text-sm text-caso-red/80">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Missing alt text
                    </div>
                    <div className="flex items-center gap-2 text-sm text-caso-red/80">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Incorrect reading order
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="rounded-2xl border border-caso-green/30 bg-caso-navy-light p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-caso-green/20" aria-hidden="true">
                      <svg className="h-3.5 w-3.5 text-caso-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wider text-caso-green">After</span>
                  </div>
                  <div className="flex h-48 items-center justify-center rounded-xl border border-caso-border bg-caso-navy/50">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-caso-slate/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
                      </svg>
                      <p className="mt-3 text-sm text-caso-slate/50">
                        Remediated PDF preview
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-caso-green/80">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Full PDF/UA structure tags
                    </div>
                    <div className="flex items-center gap-2 text-sm text-caso-green/80">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      AI-generated alt text
                    </div>
                    <div className="flex items-center gap-2 text-sm text-caso-green/80">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Correct logical reading order
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Testimonials Placeholder */}
        <section aria-label="Trusted by organizations" className="border-y border-caso-border/50 bg-caso-navy-light/30 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
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
        <section aria-label="Get your free accessibility report" className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Get your free accessibility report
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              See every inaccessible PDF on your site, with remediation cost
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
              <div className="flex items-center gap-2">
                <Image
                  src="/caso-logo.png"
                  alt="CASO"
                  width={164}
                  height={57}
                  className="h-7 w-auto brightness-0 invert"
                />
                <span className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-blue">
                  Comply
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-caso-slate">
                AI-powered PDF accessibility remediation by{" "}
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
                  <a href="#service-levels" className="text-sm text-caso-slate hover:text-caso-white">
                    Service Levels
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-caso-slate hover:text-caso-white">
                    Pricing
                  </a>
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
