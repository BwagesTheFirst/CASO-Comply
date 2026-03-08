import Image from "next/image";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";

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
              href="/#how-it-works"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              How It Works
            </a>
            <a
              href="/#service-levels"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Service Levels
            </a>
            <a
              href="/#pricing"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Pricing
            </a>
            <a
              href="/#enterprise"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Enterprise
            </a>
            <a
              href="/#partners"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Partners
            </a>
            <a
              href="/#scan"
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
                      href="/#scan"
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
                      Optional: Gemini API key
                    </strong>{" "}
                    for AI verification (hybrid mode)
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
                Save this as <code className="rounded bg-caso-navy-light px-1.5 py-0.5 text-caso-glacier">config.yaml</code> in your working directory.
              </p>
              <TerminalBlock title="config.yaml">
                <pre className="whitespace-pre leading-relaxed">
{`# Processing mode: cloud | hybrid | local
# cloud   — PDFs sent to CASO cloud ($0.10/page)
# hybrid  — Local processing + AI verification ($0.20/page)
# local   — Everything on-premise (Enterprise license)
mode: hybrid

# Your CASO license key
license_key: "CASO-XXXX-XXXX-XXXX"

# Folders to scan for PDFs (add as many as needed)
scan_paths:
  - /data/documents
  - /data/shared-drive

# Websites to crawl for PDFs
website_urls:
  - https://your-website.gov

# Where to save remediated PDFs
output_dir: /data/remediated

# Output mode: suffix (file_remediated.pdf) | overwrite | directory
output_mode: suffix

# Scan schedule (cron format) - default: every hour
# Examples: "0 2 * * *" = 2am daily, "0 */4 * * *" = every 4 hours
cron: "0 2 * * *"

# Gemini API key (required for hybrid mode AI verification)
gemini_api_key: ""`}
                </pre>
              </TerminalBlock>
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
{`$ docker run -d \\
    --name caso-comply \\
    --restart unless-stopped \\
    -v /your/pdf/folder:/data/documents:ro \\
    -v /your/output/folder:/data/remediated \\
    -v ./config.yaml:/app/config.yaml:ro \\
    -p 9090:9090 \\
    caso/comply-agent:latest`}
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
  caso-comply:
    image: caso/comply-agent:latest
    container_name: caso-comply
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - /your/pdf/folder:/data/documents:ro
      - /your/output/folder:/data/remediated
      - ./config.yaml:/app/config.yaml:ro`}
              </pre>
            </TerminalBlock>
            <TerminalBlock>
              <div>
                <span className="text-caso-slate">$</span> docker compose up -d
              </div>
            </TerminalBlock>
          </div>
        </section>

        {/* Processing Modes */}
        <section
          aria-labelledby="modes-heading"
          className="border-t border-caso-border/50 bg-caso-navy-light/30 px-6 py-16 md:py-24"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="modes-heading"
                className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Processing Modes
              </h2>
              <p className="mt-4 text-lg text-caso-slate">
                Choose the mode that matches your security requirements.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {/* Cloud */}
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
                        d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                      Cloud
                    </h3>
                    <p className="text-sm text-caso-glacier">$0.10/page</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-caso-slate">
                  Upload PDFs to our secure cloud for processing. Fastest setup
                  with no infrastructure required. PDFs are encrypted in transit
                  and at rest, processed, then deleted within 24 hours.
                </p>
                <div className="mt-4 rounded-lg bg-caso-navy-light/50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-caso-glacier">
                    Data flow
                  </p>
                  <p className="mt-1 text-sm text-caso-slate">
                    Full PDFs sent to CASO cloud (AES-256 encrypted)
                  </p>
                </div>
                <ul className="mt-4 space-y-2" role="list">
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Zero infrastructure setup
                  </li>
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Automatic updates
                  </li>
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Cloud dashboard &amp; reporting
                  </li>
                </ul>
                <p className="mt-4 text-xs text-caso-slate">
                  <strong className="text-caso-white">Ideal for:</strong> Small
                  orgs, public website PDFs
                </p>
              </div>

              {/* Hybrid */}
              <div className="rounded-2xl border-2 border-caso-blue bg-caso-navy p-8 shadow-lg shadow-caso-blue/10">
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
                        d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                      Hybrid
                    </h3>
                    <p className="text-sm text-caso-glacier">$0.20/page</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-caso-slate">
                  Remediation runs locally on your servers. Only rendered page
                  images (no text, no metadata) are sent to Gemini for AI
                  verification. Your source PDFs never leave your network.
                </p>
                <div className="mt-4 rounded-lg bg-caso-navy-light/50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-caso-glacier">
                    Data flow
                  </p>
                  <p className="mt-1 text-sm text-caso-slate">
                    Only page images sent (no text or metadata extracted)
                  </p>
                </div>
                <ul className="mt-4 space-y-2" role="list">
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    PDFs never leave your network
                  </li>
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    AI-powered quality verification
                  </li>
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Local processing + cloud review
                  </li>
                </ul>
                <p className="mt-4 text-xs text-caso-slate">
                  <strong className="text-caso-white">Ideal for:</strong>{" "}
                  Mid-size, document-sensitive orgs
                </p>
              </div>

              {/* Local */}
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
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                      Local
                    </h3>
                    <p className="text-sm text-caso-glacier">
                      Enterprise pricing
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-caso-slate">
                  Everything runs on-premise. No data leaves your network. Full
                  air-gap support with bring-your-own AI keys. Includes
                  dedicated account manager and custom SLAs.
                </p>
                <div className="mt-4 rounded-lg bg-caso-navy-light/50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-caso-glacier">
                    Data flow
                  </p>
                  <p className="mt-1 text-sm text-caso-slate">
                    Nothing leaves your network
                  </p>
                </div>
                <ul className="mt-4 space-y-2" role="list">
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Complete air-gap support
                  </li>
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Bring your own AI keys
                  </li>
                  <li className="flex items-center gap-2 text-sm text-caso-slate">
                    <svg className="h-4 w-4 flex-shrink-0 text-caso-teal" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Dedicated account manager
                  </li>
                </ul>
                <p className="mt-4 text-xs text-caso-slate">
                  <strong className="text-caso-white">Ideal for:</strong>{" "}
                  Hospitals, large gov, regulated industries
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
                    license_key
                  </code>{" "}
                  in config.yaml is correct. The agent needs outbound HTTPS
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
                    scan_paths
                  </code>{" "}
                  in config.yaml match the paths{" "}
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
                  . Common causes include invalid YAML syntax in config.yaml or
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
                    href="/#how-it-works"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="/#service-levels"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    Service Levels
                  </a>
                </li>
                <li>
                  <a
                    href="/#pricing"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/#scan"
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
                    href="/#partners"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
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
                  <a
                    href="/accessibility"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    Accessibility Statement
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
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
