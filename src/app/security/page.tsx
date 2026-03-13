import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security & Privacy — CASO Comply",
  description:
    "Learn how CASO Comply protects your documents with on-premise processing, SOC 2 certification, encryption, and enterprise-grade security controls.",
};

function ShieldIcon() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function ServerIcon() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008H18.75v-.008zm-3 0h.008v.008H15.75v-.008z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CloudOffIcon() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
    </svg>
  );
}

const ARCHITECTURE_FEATURES = [
  {
    icon: <ServerIcon />,
    title: "On-Premise Processing",
    description:
      "The CASO Comply Docker agent runs entirely on your infrastructure. Documents are processed locally — they never leave your network, your servers, or your control.",
  },
  {
    icon: <EyeOffIcon />,
    title: "Zero Document Exposure",
    description:
      "Your files are never uploaded to our cloud. The agent reads from your directories, processes in-memory, and writes remediated files back to your storage. We never see your documents.",
  },
  {
    icon: <LockIcon />,
    title: "Encrypted Communications",
    description:
      "All communication between the agent and our API uses TLS 1.2+ encryption. The only data transmitted is licensing metadata and usage counts — never document content.",
  },
  {
    icon: <KeyIcon />,
    title: "API Key Authentication",
    description:
      "Every agent authenticates with a cryptographically generated API key. Keys are hashed before storage — even we can't see them. Revoke access instantly from your dashboard.",
  },
];

const COMPLIANCE_ITEMS = [
  {
    name: "SOC 2 Type II",
    status: "Certified",
    description:
      "Independently audited controls for security, availability, and confidentiality. Request our report during procurement.",
    available: true,
  },
  {
    name: "WCAG 2.1 AA",
    status: "Compliant",
    description:
      "Our platform is built to the same accessibility standards we help you achieve. We practice what we preach.",
    available: true,
  },
  {
    name: "PDF/UA (ISO 14289)",
    status: "Output Standard",
    description:
      "Every remediated document conforms to the PDF/UA standard for universal accessibility.",
    available: true,
  },
  {
    name: "Section 508",
    status: "Compliant",
    description:
      "Full conformance with federal ICT accessibility requirements. VPAT available on request.",
    available: true,
  },
  {
    name: "HIPAA",
    status: "Architecture Ready",
    description:
      "Docker agent processes PHI on your infrastructure — documents never leave your HIPAA boundary. No BAA required for on-premise deployment.",
    available: true,
  },
  {
    name: "FedRAMP",
    status: "Not Required",
    description:
      "Our Docker agent runs on your infrastructure, not our cloud. FedRAMP applies to cloud services — on-premise software falls under your existing ATO.",
    available: true,
  },
];

const DATA_FLOW = [
  {
    step: "01",
    title: "Agent scans your folders",
    description: "The Docker agent monitors directories you configure. New or modified documents are detected automatically.",
    highlight: "Local only — no network traffic",
  },
  {
    step: "02",
    title: "Documents processed in-memory",
    description: "Remediation happens entirely within the container. Structure analysis, tag assignment, and metadata correction all run locally.",
    highlight: "Zero cloud uploads",
  },
  {
    step: "03",
    title: "AI verification (optional)",
    description: "If enabled, page-level data is sent to our AI service for tag verification and alt text generation. Full documents are never transmitted — only the minimum data needed for verification.",
    highlight: "Minimal data, encrypted in transit",
  },
  {
    step: "04",
    title: "Remediated files saved locally",
    description: "Compliant documents are written back to your output directory. Original files can be preserved or overwritten based on your configuration.",
    highlight: "You control retention",
  },
];

const ENTERPRISE_QUESTIONS = [
  {
    question: "Where is my data processed?",
    answer:
      "On your infrastructure. The CASO Comply Docker agent runs on your servers. Documents are read, processed, and written locally. They never leave your network.",
  },
  {
    question: "What data does the agent send to CASO?",
    answer:
      "Only licensing metadata: a license key validation on startup, and page count usage reports for billing. No document content, filenames, or personally identifiable information is transmitted.",
  },
  {
    question: "Do you store our documents?",
    answer:
      "No. We never receive, store, or have access to your documents. The Docker agent operates entirely within your environment. We couldn't access your files even if we wanted to.",
  },
  {
    question: "How does AI verification work without uploading files?",
    answer:
      "When AI Verified mode is enabled, the agent sends only the minimum data needed for verification — structural metadata and page-level information. Complete documents are never transmitted to any external service.",
  },
  {
    question: "Is this FedRAMP authorized?",
    answer:
      "FedRAMP applies to cloud service providers. Since the CASO Comply agent runs on your infrastructure (not ours), it falls under your agency's existing Authority to Operate (ATO), not FedRAMP. This is the same model used by other on-premise software in government environments.",
  },
  {
    question: "Can we use this with HIPAA-protected documents?",
    answer:
      "Yes. Because documents are processed entirely on your infrastructure, protected health information (PHI) never leaves your HIPAA boundary. No Business Associate Agreement is required for on-premise deployment since we never handle PHI.",
  },
  {
    question: "How do you handle API key security?",
    answer:
      "API keys are cryptographically generated with 256 bits of entropy. We store only a one-way SHA-256 hash — the raw key is shown once at creation and never stored. Keys support expiration dates and can be revoked instantly.",
  },
  {
    question: "Do you have a SOC 2 report?",
    answer:
      "Yes. CASO Document Management maintains SOC 2 Type II certification. Our report is available under NDA during procurement. Contact sales@caso.com to request a copy.",
  },
  {
    question: "What happens if we need to process classified or FOUO documents?",
    answer:
      "Use the agent in local-only mode — all AI verification is disabled and the agent makes zero network calls during processing. Documents are processed entirely offline within your air-gapped or classified environment.",
  },
  {
    question: "Can we run the agent in an air-gapped environment?",
    answer:
      "Yes. The agent supports a fully offline mode. License validation can be configured for initial activation only, after which the agent operates without any network connectivity.",
  },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-caso-navy text-caso-white">
      <a href="#security-content" className="skip-link">
        Skip to security content
      </a>

      {/* Nav */}
      <nav aria-label="Security page navigation" className="sticky top-0 z-40 border-b border-caso-border/50 bg-caso-navy/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2" aria-label="Back to CASO Comply home">
            <Image src="/caso-comply-logo-white.png" alt="CASO Comply" width={426} height={80} className="h-10 w-auto" priority />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white">
              Home
            </Link>
            <Link href="/pricing" className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white">
              Pricing
            </Link>
            <Link href="/signup" className="rounded-xl bg-caso-blue-deep px-5 py-2 text-sm font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main id="security-content">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-caso-blue/5 blur-3xl" />
            <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-caso-teal/3 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-caso-teal">Security & Privacy</p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              Your documents never{" "}
              <span className="text-gradient">leave your servers</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-caso-slate">
              CASO Comply processes documents on your infrastructure — not ours. We built the only remediation platform where your files stay exactly where they are: under your control, behind your firewall, on your terms.
            </p>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="border-y border-caso-border/50 bg-caso-navy-light/30 px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { label: "SOC 2 Type II", sublabel: "Certified" },
                { label: "WCAG 2.1 AA", sublabel: "Compliant" },
                { label: "Section 508", sublabel: "Conformant" },
                { label: "TLS 1.2+", sublabel: "All Communications" },
              ].map((badge) => (
                <div key={badge.label} className="flex flex-col items-center rounded-xl border border-caso-border/50 bg-caso-navy/50 px-4 py-5 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-caso-green/10 text-caso-green">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="mt-3 text-sm font-bold">{badge.label}</p>
                  <p className="text-xs text-caso-slate">{badge.sublabel}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture Overview */}
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Security by architecture
              </h2>
              <p className="mt-4 text-lg text-caso-slate">
                Most remediation platforms require you to upload documents to their cloud. We took the opposite approach — the engine comes to you.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {ARCHITECTURE_FEATURES.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-8">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-caso-blue/10 text-caso-blue">
                    {feature.icon}
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-caso-slate">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Flow */}
        <section className="border-y border-caso-border/50 bg-caso-navy-light/30 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                How your data flows
              </h2>
              <p className="mt-4 text-lg text-caso-slate">
                From input to output, your documents stay on your infrastructure.
              </p>
            </div>

            <div className="mt-14 space-y-0">
              {DATA_FLOW.map((step, i) => (
                <div key={step.step} className="relative flex gap-6 pb-12 last:pb-0">
                  {/* Connector line */}
                  {i < DATA_FLOW.length - 1 && (
                    <div className="absolute left-[23px] top-12 h-[calc(100%-48px)] w-px bg-caso-border/50" aria-hidden="true" />
                  )}
                  {/* Step number */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-caso-blue/50 bg-caso-navy text-sm font-bold text-caso-blue">
                    {step.step}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm text-caso-slate">{step.description}</p>
                    <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-caso-green/10 px-3 py-1.5 text-xs font-semibold text-caso-green">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      {step.highlight}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance & Certifications */}
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Compliance & certifications
              </h2>
              <p className="mt-4 text-lg text-caso-slate">
                Built for regulated industries. Our on-premise architecture simplifies compliance across frameworks.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {COMPLIANCE_ITEMS.map((item) => (
                <div key={item.name} className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-[family-name:var(--font-display)] text-base font-bold">{item.name}</h3>
                    <span className="rounded-full bg-caso-green/10 px-3 py-1 text-xs font-semibold text-caso-green">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-caso-slate">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cloud vs On-Prem comparison */}
        <section className="border-y border-caso-border/50 bg-caso-navy-light/30 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Cloud upload vs. on-premise
              </h2>
              <p className="mt-4 text-lg text-caso-slate">
                See why on-premise processing eliminates entire categories of risk.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-2">
              {/* Cloud upload (competitors) */}
              <div className="rounded-2xl border border-caso-border/50 bg-caso-navy-light/30 p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-caso-slate">Typical cloud platform</p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold text-caso-slate/70">Upload to their servers</h3>
                <ul className="mt-6 space-y-3 text-sm text-caso-slate">
                  {[
                    "Documents uploaded to vendor cloud",
                    "Files stored on third-party infrastructure",
                    "Data crosses network boundaries",
                    "Requires BAAs, DPAs, and vendor trust",
                    "FedRAMP required for federal use",
                    "You hope they delete your files",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-red/60" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* On-prem (CASO) */}
              <div className="rounded-2xl border border-caso-blue bg-caso-navy-light/50 p-8 shadow-lg shadow-caso-blue/10">
                <p className="text-xs font-semibold uppercase tracking-wider text-caso-blue-bright">CASO Comply</p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold">Runs on your servers</h3>
                <ul className="mt-6 space-y-3 text-sm">
                  {[
                    "Documents processed on your infrastructure",
                    "Files never leave your network",
                    "No data crosses trust boundaries",
                    "No BAA needed — you control the data",
                    "Falls under your existing ATO",
                    "You control retention and deletion",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Security FAQ */}
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Questions procurement teams ask
              </h2>
              <p className="mt-4 text-lg text-caso-slate">
                We answer these in every security questionnaire. Here they are upfront.
              </p>
            </div>

            <div className="mt-14 space-y-4">
              {ENTERPRISE_QUESTIONS.map((item) => (
                <div key={item.question} className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6">
                  <h3 className="font-[family-name:var(--font-display)] text-base font-bold">{item.question}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-caso-slate">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-caso-border/50 bg-caso-navy-light/30 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Need our SOC 2 report?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-caso-slate">
              We provide our SOC 2 Type II report, security whitepaper, and completed SIG/CAIQ questionnaires under NDA. Contact our team to start the security review process.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="mailto:security@caso.com?subject=Security%20Review%20Request%20-%20CASO%20Comply"
                className="rounded-xl bg-caso-blue-deep px-8 py-4 text-base font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
              >
                Request Security Package
              </a>
              <Link
                href="/setup"
                className="rounded-xl border border-caso-border bg-transparent px-8 py-4 text-base font-bold text-caso-white transition-all hover:border-caso-blue hover:bg-caso-navy-light"
              >
                View Setup Guide
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-caso-border/50 px-6 py-8">
        <div className="mx-auto max-w-7xl text-center text-sm text-caso-slate">
          <p>&copy; 2026 CASO Document Management, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
