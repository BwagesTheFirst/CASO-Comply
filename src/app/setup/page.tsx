import Image from "next/image";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import HipaaConfig from "@/components/HipaaConfig";

function TerminalBlock({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-caso-border/50 bg-caso-navy font-mono text-sm">
      <div className="flex items-center gap-2 border-b border-caso-border/50 bg-caso-navy-light/50 px-4 py-2">
        <span
          className="h-2.5 w-2.5 rounded-full bg-caso-red/60"
          aria-hidden="true"
        />
        <span
          className="h-2.5 w-2.5 rounded-full bg-yellow-500/60"
          aria-hidden="true"
        />
        <span
          className="h-2.5 w-2.5 rounded-full bg-caso-green/60"
          aria-hidden="true"
        />
        <span className="ml-2 text-xs text-caso-slate">
          {title || "terminal"}
        </span>
      </div>
      <div className="overflow-x-auto p-4 text-caso-glacier">{children}</div>
    </div>
  );
}

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-caso-navy text-caso-white">
      {/* Skip to main content */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <nav
        aria-label="Primary navigation"
        className="sticky top-0 z-40 border-b border-caso-border/50 bg-caso-navy/95 backdrop-blur-md"
      >
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
              href="/services/pdf-remediation"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              How It Works
            </a>
            <a
              href="/pricing"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Pricing
            </a>
            <a
              href="/solutions/enterprise"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Enterprise
            </a>
            <a
              href="/about"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              About
            </a>
            <a
              href="/free-scan"
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
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-caso-blue/5 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-3xl text-center">
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              CASO Comply Agent
              <span className="mt-2 block text-caso-glacier">Setup Guide</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-caso-slate md:text-xl">
              Deploy automated PDF remediation on your infrastructure in under
              10 minutes.
            </p>
          </div>
        </section>

        {/* Prerequisites */}
        <section
          aria-labelledby="prerequisites-heading"
          className="px-6 pb-16 md:pb-24"
        >
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-caso-border/50 bg-caso-navy-light/30 p-8">
              <h2
                id="prerequisites-heading"
                className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight"
              >
                Prerequisites
              </h2>
              <ul className="mt-6 space-y-4" role="list">
                <li className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-caso-teal"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-caso-slate">
                    <strong className="text-caso-white">
                      Docker Engine 20+
                    </strong>{" "}
                    or Docker Desktop
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-caso-teal"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-caso-slate">
                    <strong className="text-caso-white">
                      Network access to your PDF file shares
                    </strong>{" "}
                    (for folder scanning)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-caso-teal"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-caso-slate">
                    <strong className="text-caso-white">
                      A CASO Comply license key
                    </strong>{" "}
                    &mdash;{" "}
                    <a
                      href="/free-scan"
                      className="text-caso-glacier underline decoration-caso-glacier/30 underline-offset-2 hover:text-caso-blue hover:decoration-caso-blue/50"
                    >
                      get one with a free site audit
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-caso-slate"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-caso-slate">
                    <strong className="text-caso-white">
                      A CASO API key
                    </strong>{" "}
                    from your dashboard (determines your pricing tier)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section
          aria-labelledby="quickstart-heading"
          className="border-t border-caso-border/50 bg-caso-navy-light/30 px-6 py-16 md:py-24"
        >
          <div className="mx-auto max-w-3xl">
            <h2
              id="quickstart-heading"
              className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Quick Start
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              Three steps to get up and running.
            </p>

            {/* Step 1 */}
            <div className="mt-12">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-caso-blue text-sm font-bold text-caso-white">
                  1
                </span>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
                  Pull the image
                </h3>
              </div>
              <TerminalBlock>
                <div>
                  <span className="text-caso-slate">$</span> docker pull
                  caso/comply-agent:latest
                </div>
              </TerminalBlock>
            </div>

            {/* Step 2 */}
            <div className="mt-12">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-caso-blue text-sm font-bold text-caso-white">
                  2
                </span>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
                  Create your config file
                </h3>
              </div>
              <p className="ml-14 mt-2 text-caso-slate">
                Save this as <code className="rounded bg-caso-navy-light px-1.5 py-0.5 text-caso-glacier">docker-compose.yml</code> in your working directory.
              </p>
              <TerminalBlock title="docker-compose.yml">
                <pre className="whitespace-pre leading-relaxed">
{`version: "3.8"
services:
  caso-agent:
    image: caso/comply-agent:latest
    environment:
      - CASO_LICENSE_KEY=YOUR_API_KEY_HERE
      - CASO_SCAN_PATHS=/data/input
      - CASO_OUTPUT_DIR=/data/remediated
      - CASO_CRON=0 2 * * *
    volumes:
      - ./documents:/data/input
      - ./remediated:/data/remediated
      - ./agent-data:/data
    ports:
      - "9090:9090"
    restart: unless-stopped`}
                </pre>
              </TerminalBlock>
              <p className="ml-14 mt-3 text-sm text-caso-slate">
                Replace{" "}
                <code className="rounded bg-caso-navy-light px-1.5 py-0.5 text-caso-warm">
                  YOUR_API_KEY_HERE
                </code>{" "}
                with your full API key. Your pricing tier (Standard, AI Verified, or Human Review) is determined by your plan — the agent reads it automatically.
              </p>
            </div>

            {/* Step 3 */}
            <div className="mt-12">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-caso-blue text-sm font-bold text-caso-white">
                  3
                </span>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
                  Run it
                </h3>
              </div>
              <TerminalBlock>
                <pre className="whitespace-pre leading-relaxed">
{`$ docker compose up -d`}
                </pre>
              </TerminalBlock>
              <p className="ml-14 mt-4 text-caso-slate">
                Open{" "}
                <a
                  href="http://localhost:9090"
                  className="text-caso-glacier underline decoration-caso-glacier/30 underline-offset-2 hover:text-caso-blue hover:decoration-caso-blue/50"
                >
                  http://localhost:9090
                </a>{" "}
                to view your dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* Docker Compose */}
        <section
          aria-labelledby="compose-heading"
          className="border-t border-caso-border/50 px-6 py-16 md:py-24"
        >
          <div className="mx-auto max-w-3xl">
            <h2
              id="compose-heading"
              className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Docker Compose
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              Prefer Docker Compose? Save this as{" "}
              <code className="rounded bg-caso-navy-light px-1.5 py-0.5 text-caso-glacier">
                docker-compose.yml
              </code>{" "}
              and run{" "}
              <code className="rounded bg-caso-navy-light px-1.5 py-0.5 text-caso-glacier">
                docker compose up -d
              </code>
              .
            </p>
            <TerminalBlock title="docker-compose.yml">
              <pre className="whitespace-pre leading-relaxed">
{`version: "3.8"

services:
  caso-agent:
    image: caso/comply-agent:latest
    restart: unless-stopped
    environment:
      - CASO_LICENSE_KEY=YOUR_API_KEY_HERE
      - CASO_SCAN_PATHS=/data/input
      - CASO_OUTPUT_DIR=/data/remediated
      - CASO_CRON=0 2 * * *
    ports:
      - "9090:9090"
    volumes:
      - ./documents:/data/input
      - ./remediated:/data/remediated
      - ./agent-data:/data`}
              </pre>
            </TerminalBlock>
            <TerminalBlock>
              <div>
                <span className="text-caso-slate">$</span> docker compose up -d
              </div>
            </TerminalBlock>
          </div>
        </section>

        {/* HIPAA Compliance Mode */}
        <HipaaConfig />

        {/* Pricing Tiers */}
        <section
          aria-labelledby="tiers-heading"
          className="border-t border-caso-border/50 bg-caso-navy-light/30 px-6 py-16 md:py-24"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="tiers-heading"
                className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Pricing Tiers
              </h2>
              <p className="mt-4 text-lg text-caso-slate">
                Simple per-page pricing. Your plan determines how the agent processes your documents.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {/* Standard */}
              <div className="rounded-2xl border border-caso-border/50 bg-caso-navy p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-caso-blue/10 text-caso-blue">
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
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                      Standard
                    </h3>
                    <p className="text-sm text-caso-glacier">$0.25/page</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-caso-slate">
                  Automated remediation with font-size heuristic tagging. Fast,
                  reliable, and cost-effective for bulk processing.
                </p>
                <ul className="mt-4 space-y-2" role="list">
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Structure tree tagging
                  </li>
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Heading hierarchy detection
                  </li>
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Before &amp; after scoring
                  </li>
                </ul>
                <p className="mt-4 text-xs text-caso-slate">
                  <strong className="text-caso-white">Ideal for:</strong> Bulk
                  processing, simple documents
                </p>
              </div>

              {/* AI Verified */}
              <div className="rounded-2xl border-2 border-caso-blue bg-caso-navy p-8 shadow-lg shadow-caso-blue/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-caso-green/10 text-caso-green">
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
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                      AI Verified
                    </h3>
                    <p className="text-sm text-caso-glacier">$0.35/page</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-caso-slate">
                  Gemini AI verifies heading hierarchy, reading order, and
                  generates alt text for images. Higher accuracy for complex
                  documents with mixed layouts.
                </p>
                <ul className="mt-4 space-y-2" role="list">
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Everything in Standard
                  </li>
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    AI-generated alt text for images
                  </li>
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    AI-verified reading order
                  </li>
                </ul>
                <p className="mt-4 text-xs text-caso-slate">
                  <strong className="text-caso-white">Ideal for:</strong>{" "}
                  Complex documents, image-heavy PDFs
                </p>
              </div>

              {/* Human Review */}
              <div className="rounded-2xl border border-caso-border/50 bg-caso-navy p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
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
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                      Human Review
                    </h3>
                    <p className="text-sm text-caso-glacier">$4.00/page</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-caso-slate">
                  AI-verified remediation plus expert human review for files
                  scoring below 60. Full compliance certification for
                  mission-critical documents.
                </p>
                <ul className="mt-4 space-y-2" role="list">
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Everything in AI Verified
                  </li>
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Expert human review for low-scoring files
                  </li>
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Compliance certification
                  </li>
                </ul>
                <p className="mt-4 text-xs text-caso-slate">
                  <strong className="text-caso-white">Ideal for:</strong>{" "}
                  Government, healthcare, regulated industries
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Monitoring */}
        <section
          aria-labelledby="monitoring-heading"
          className="border-t border-caso-border/50 px-6 py-16 md:py-24"
        >
          <div className="mx-auto max-w-3xl">
            <h2
              id="monitoring-heading"
              className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Monitoring
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              Keep tabs on your remediation pipeline.
            </p>

            <div className="mt-10 space-y-8">
              {/* Dashboard */}
              <div className="rounded-2xl border border-caso-border/50 bg-caso-navy-light/30 p-8">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                  Local Dashboard
                </h3>
                <p className="mt-2 text-caso-slate">
                  The agent includes a built-in web dashboard at{" "}
                  <a
                    href="http://localhost:9090"
                    className="text-caso-glacier underline decoration-caso-glacier/30 underline-offset-2 hover:text-caso-blue hover:decoration-caso-blue/50"
                  >
                    localhost:9090
                  </a>{" "}
                  showing processing status, queue depth, success/error rates,
                  and remediation history.
                </p>
              </div>

              {/* API Endpoints */}
              <div className="rounded-2xl border border-caso-border/50 bg-caso-navy-light/30 p-8">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                  API Endpoints
                </h3>
                <p className="mt-2 text-caso-slate">
                  Integrate with your existing monitoring tools.
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <code className="rounded bg-caso-navy px-2 py-1 text-sm text-caso-glacier">
                      GET /api/health
                    </code>
                    <span className="text-sm text-caso-slate">
                      Health check &mdash; returns 200 if agent is running
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="rounded bg-caso-navy px-2 py-1 text-sm text-caso-glacier">
                      GET /api/stats
                    </code>
                    <span className="text-sm text-caso-slate">
                      Processing statistics (pages processed, errors, queue
                      depth)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="rounded bg-caso-navy px-2 py-1 text-sm text-caso-glacier">
                      GET /api/pdfs
                    </code>
                    <span className="text-sm text-caso-slate">
                      List all tracked PDFs with remediation status
                    </span>
                  </div>
                </div>
              </div>

              {/* Logs */}
              <div className="rounded-2xl border border-caso-border/50 bg-caso-navy-light/30 p-8">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                  Container Logs
                </h3>
                <p className="mt-2 text-caso-slate">
                  Follow the agent logs in real time:
                </p>
                <TerminalBlock>
                  <div>
                    <span className="text-caso-slate">$</span> docker logs
                    caso-comply -f
                  </div>
                </TerminalBlock>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section
          aria-labelledby="troubleshooting-heading"
          className="border-t border-caso-border/50 bg-caso-navy-light/30 px-6 py-16 md:py-24"
        >
          <div className="mx-auto max-w-3xl">
            <h2
              id="troubleshooting-heading"
              className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Troubleshooting
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              Common issues and how to resolve them.
            </p>

            <dl className="mt-10 space-y-6">
              <div className="rounded-2xl border border-caso-border/50 bg-caso-navy p-6">
                <dt className="font-semibold text-caso-white">
                  &ldquo;Permission denied on PDF folder&rdquo;
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-caso-slate">
                  Make sure the volume is mounted with the{" "}
                  <code className="rounded bg-caso-navy-light px-1.5 py-0.5 text-caso-glacier">
                    :ro
                  </code>{" "}
                  flag for read-only access. Check that the host user running
                  Docker has read permissions on the source folder:{" "}
                  <code className="rounded bg-caso-navy-light px-1.5 py-0.5 text-caso-glacier">
                    ls -la /your/pdf/folder
                  </code>
                  .
                </dd>
              </div>

              <div className="rounded-2xl border border-caso-border/50 bg-caso-navy p-6">
                <dt className="font-semibold text-caso-white">
                  &ldquo;License validation failed&rdquo;
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-caso-slate">
                  Verify your{" "}
                  <code className="rounded bg-caso-navy-light px-1.5 py-0.5 text-caso-glacier">
                    CASO_LICENSE_KEY
                  </code>{" "}
                  environment variable is correct. The agent needs outbound HTTPS
                  access to{" "}
                  <code className="rounded bg-caso-navy-light px-1.5 py-0.5 text-caso-glacier">
                    api.caso.com
                  </code>{" "}
                  for license validation. Check your firewall and proxy
                  settings.
                </dd>
              </div>

              <div className="rounded-2xl border border-caso-border/50 bg-caso-navy p-6">
                <dt className="font-semibold text-caso-white">
                  &ldquo;No PDFs found&rdquo;
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-caso-slate">
                  Verify that your{" "}
                  <code className="rounded bg-caso-navy-light px-1.5 py-0.5 text-caso-glacier">
                    CASO_SCAN_PATHS
                  </code>{" "}
                  environment variable matches the paths{" "}
                  <em>inside the container</em>, not on the host. If you mounted{" "}
                  <code className="rounded bg-caso-navy-light px-1.5 py-0.5 text-caso-glacier">
                    -v /host/path:/data/documents
                  </code>
                  , your scan path should be{" "}
                  <code className="rounded bg-caso-navy-light px-1.5 py-0.5 text-caso-glacier">
                    /data/documents
                  </code>
                  .
                </dd>
              </div>

              <div className="rounded-2xl border border-caso-border/50 bg-caso-navy p-6">
                <dt className="font-semibold text-caso-white">
                  &ldquo;Container won&apos;t start&rdquo;
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-caso-slate">
                  Check the container logs for error details:{" "}
                  <code className="rounded bg-caso-navy-light px-1.5 py-0.5 text-caso-glacier">
                    docker logs caso-comply
                  </code>
                  . Common causes include missing environment variables or
                  port 9090 already in use (change the host port with{" "}
                  <code className="rounded bg-caso-navy-light px-1.5 py-0.5 text-caso-glacier">
                    -p 8080:9090
                  </code>
                  ).
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Support */}
        <section
          aria-labelledby="support-heading"
          className="border-t border-caso-border/50 px-6 py-16 md:py-24"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2
              id="support-heading"
              className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Need Help?
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              Our team is here to help you get set up.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="mailto:support@caso.com"
                className="inline-flex items-center gap-2 rounded-xl bg-caso-blue px-6 py-3 text-sm font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                Contact support@caso.com
              </a>
              <a
                href="https://caso.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-caso-border px-6 py-3 text-sm font-bold text-caso-white transition-all hover:bg-caso-navy-light"
              >
                Visit caso.com
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="border-t border-caso-border/50 bg-caso-navy-light/50"
        role="contentinfo"
      >
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
              <p className="mt-2 text-sm text-caso-slate">
                San Antonio, Texas
              </p>
            </div>

            {/* Product links */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-caso-glacier">
                Product
              </h3>
              <ul className="mt-4 space-y-3" role="list">
                <li>
                  <a
                    href="/services/pdf-remediation"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/free-scan"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
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
                  <a
                    href="https://caso.com/about/"
                    className="text-sm text-caso-slate hover:text-caso-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    About CASO
                  </a>
                </li>
                <li>
                  <a
                    href="https://caso.com/services/"
                    className="text-sm text-caso-slate hover:text-caso-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="https://caso.com/services/accessibility-on-demand/"
                    className="text-sm text-caso-slate hover:text-caso-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Accessibility on Demand
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    About CASO
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
                  <a
                    href="/security"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/privacy"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/terms"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
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
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
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
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
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
