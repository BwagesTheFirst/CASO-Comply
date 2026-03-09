import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Compare — CASO Comply",
  description:
    "See how CASO Comply's Docker-based autonomous remediation agent compares to Continual Engine PREP, Equidox, Codemantra, and other document accessibility solutions.",
};

const COMPETITORS = [
  {
    name: "Continual Engine PREP",
    type: "Cloud Platform + On-Prem",
    formats: "PDF, DOCX, PPTX, XLSX, ePub3",
    automation: "~90%",
    deployment: "Web UI upload or API",
    pricing: "Custom enterprise quotes",
    setupTime: "Weeks",
    dataLocal: false,
    folderWatch: false,
    llmPowered: false,
    strengths: ["Broad format support", "LMS integrations (Canvas, D2L)", "Hybrid deployment option"],
    weaknesses: ["Requires web UI interaction", "Opaque pricing", "Heavy server install for on-prem"],
  },
  {
    name: "Equidox",
    type: "Cloud SaaS / VM Appliance",
    formats: "PDF only",
    automation: "~60-70%",
    deployment: "Web UI with human review",
    pricing: "Per-seat licensing + $2.50-15/pg service",
    setupTime: "Days",
    dataLocal: false,
    folderWatch: false,
    llmPowered: false,
    strengths: ["Industry-leading table detection", "Collaborative multi-user editing", "Managed service option"],
    weaknesses: ["PDF only — no Office docs", "Requires human operators", "Templated docs only for full automation"],
  },
  {
    name: "Codemantra",
    type: "Cloud Platform (AWS)",
    formats: "PDF, DOCX, XLSX, PPTX, EPUB",
    automation: "~80%",
    deployment: "Web UI or REST API",
    pricing: "Custom enterprise quotes",
    setupTime: "Weeks",
    dataLocal: false,
    folderWatch: false,
    llmPowered: false,
    strengths: ["Modular (Check/Fix/Review)", "MathML equation support", "UK Gov approved"],
    weaknesses: ["Lower automation rate", "Older ML approach", "Review UI not accessible itself"],
  },
  {
    name: "Crawford Tech",
    type: "Enterprise Middleware",
    formats: "AFP, PCL, PDF, Image",
    automation: "High (transactional)",
    deployment: "Server install + ECM integration",
    pricing: "Enterprise licensing",
    setupTime: "Months",
    dataLocal: true,
    folderWatch: true,
    llmPowered: false,
    strengths: ["Watched folder support", "ECM integrations", "High-volume transactional docs"],
    weaknesses: ["Heavyweight enterprise middleware", "Not for arbitrary documents", "Significant integration work"],
  },
  {
    name: "CommonLook / Allyant",
    type: "Acrobat Plugin + Web",
    formats: "PDF, Word, PowerPoint",
    automation: "~50-60%",
    deployment: "Desktop plugin or web app",
    pricing: "Per-seat concurrent licensing",
    setupTime: "Days",
    dataLocal: true,
    folderWatch: false,
    llmPowered: false,
    strengths: ["New AI-powered web version (2025)", "Deep PDF tag tree control", "HHS compliance"],
    weaknesses: ["Historically Windows-only", "Cost-prohibitive licensing", "Manual-heavy workflow"],
  },
];

const COMPARISON_FEATURES = [
  { label: "Deployment", key: "deployment" as const, caso: "Docker pull → run" },
  { label: "Setup time", key: "setup" as const, caso: "Minutes" },
  { label: "Autonomous operation", key: "autonomous" as const, caso: "Yes — watches folders 24/7" },
  { label: "Documents stay local", key: "local" as const, caso: "Always" },
  { label: "File formats", key: "formats" as const, caso: "PDF, DOCX, PPTX, XLSX" },
  { label: "AI engine", key: "ai" as const, caso: "LLM + Vision models" },
  { label: "Alt text generation", key: "alttext" as const, caso: "AI vision (per-image)" },
  { label: "Per-page cost", key: "cost" as const, caso: "From $0.25/page" },
  { label: "Human review option", key: "human" as const, caso: "$4.00/page" },
  { label: "Compliance dashboard", key: "dashboard" as const, caso: "Built-in at localhost:9090" },
  { label: "API access", key: "api" as const, caso: "REST API included" },
];

function CheckIcon() {
  return (
    <svg className="h-5 w-5 text-caso-green" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-5 w-5 text-caso-red/60" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="h-5 w-5 text-caso-slate/40" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
    </svg>
  );
}

export default function CompetitorsPage() {
  return (
    <div className="min-h-screen bg-caso-navy text-caso-white">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Nav */}
      <nav aria-label="Page navigation" className="sticky top-0 z-40 border-b border-caso-border/50 bg-caso-navy/95 backdrop-blur-md">
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
            <Link href="/signup" className="rounded-xl bg-caso-blue px-5 py-2 text-sm font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-caso-blue/5 blur-3xl" />
            <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-caso-teal/3 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-caso-teal">Competitive Landscape</p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              The only agent that remediates{" "}
              <span className="text-gradient">while you sleep</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-caso-slate">
              Every other solution requires you to upload files, click buttons, and wait. CASO Comply runs autonomously on your infrastructure — scanning folders, remediating documents, and reporting results without human intervention.
            </p>
          </div>
        </section>

        {/* Key Differentiators */}
        <section className="border-y border-caso-border/50 bg-caso-navy-light/30 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                What makes us different
              </h2>
              <p className="mt-4 text-lg text-caso-slate">
                Five things no competitor offers together.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  icon: (
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                    </svg>
                  ),
                  title: "Docker Agent",
                  description: "One container. Runs on your servers. No cloud uploads.",
                },
                {
                  icon: (
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  title: "Folder Watching",
                  description: "Scans directories 24/7. New files remediated automatically.",
                },
                {
                  icon: (
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                    </svg>
                  ),
                  title: "LLM-Powered",
                  description: "Vision models generate alt text. LLMs fix structure intelligently.",
                },
                {
                  icon: (
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  ),
                  title: "Data Sovereignty",
                  description: "Documents never leave your network. Only metadata hits our API.",
                },
                {
                  icon: (
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  ),
                  title: "$0.25/page",
                  description: "10-60x cheaper than competitors. No enterprise licensing fees.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-caso-blue/10 text-caso-blue">
                    {item.icon}
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-caso-slate">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Feature-by-feature comparison
              </h2>
              <p className="mt-4 text-lg text-caso-slate">
                How CASO Comply stacks up against the top document accessibility platforms.
              </p>
            </div>

            {/* Desktop table */}
            <div className="mt-14 hidden overflow-x-auto lg:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="w-[200px] border-b border-caso-border/50 pb-4 text-left text-sm font-medium text-caso-slate">&nbsp;</th>
                    <th className="w-[180px] border-b-2 border-caso-blue pb-4 text-center">
                      <div className="rounded-xl bg-caso-blue/10 px-3 py-2">
                        <span className="text-sm font-bold text-caso-blue">CASO Comply</span>
                      </div>
                    </th>
                    <th className="w-[150px] border-b border-caso-border/50 pb-4 text-center text-sm font-medium text-caso-slate">PREP</th>
                    <th className="w-[150px] border-b border-caso-border/50 pb-4 text-center text-sm font-medium text-caso-slate">Equidox</th>
                    <th className="w-[150px] border-b border-caso-border/50 pb-4 text-center text-sm font-medium text-caso-slate">Codemantra</th>
                    <th className="w-[150px] border-b border-caso-border/50 pb-4 text-center text-sm font-medium text-caso-slate">CommonLook</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Deployment", caso: "Docker agent", prep: "Server install / cloud", equidox: "Cloud SaaS", codemantra: "Cloud (AWS)", commonlook: "Desktop plugin" },
                    { label: "Setup time", caso: "Minutes", prep: "Weeks", equidox: "Days", codemantra: "Weeks", commonlook: "Days" },
                    { label: "Autonomous (no UI)", caso: true, prep: false, equidox: false, codemantra: false, commonlook: false },
                    { label: "Folder watching", caso: true, prep: false, equidox: false, codemantra: false, commonlook: false },
                    { label: "Data stays local", caso: true, prep: "On-prem option", equidox: false, codemantra: "On-prem option", commonlook: true },
                    { label: "PDF support", caso: true, prep: true, equidox: true, codemantra: true, commonlook: true },
                    { label: "Word support", caso: true, prep: true, equidox: false, codemantra: true, commonlook: true },
                    { label: "Excel support", caso: true, prep: true, equidox: false, codemantra: true, commonlook: false },
                    { label: "PowerPoint support", caso: true, prep: true, equidox: false, codemantra: true, commonlook: true },
                    { label: "LLM/Vision AI", caso: true, prep: false, equidox: false, codemantra: false, commonlook: false },
                    { label: "AI alt text", caso: true, prep: "Limited", equidox: false, codemantra: "Basic", commonlook: false },
                    { label: "Human review option", caso: "$4/pg", prep: "Included", equidox: "$2.50-15/pg", codemantra: "Included", commonlook: "Manual" },
                    { label: "Per-page pricing", caso: "$0.25", prep: "Custom", equidox: "$2.50+", codemantra: "Custom", commonlook: "Per-seat" },
                    { label: "Automation rate", caso: "90%+", prep: "~90%", equidox: "~65%", codemantra: "~80%", commonlook: "~55%" },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-caso-border/30">
                      <td className="py-4 text-sm font-medium text-caso-slate">{row.label}</td>
                      {(["caso", "prep", "equidox", "codemantra", "commonlook"] as const).map((col) => {
                        const val = row[col];
                        return (
                          <td key={col} className={`py-4 text-center text-sm ${col === "caso" ? "bg-caso-blue/5" : ""}`}>
                            {val === true ? (
                              <span className="inline-flex justify-center"><CheckIcon /></span>
                            ) : val === false ? (
                              <span className="inline-flex justify-center"><XIcon /></span>
                            ) : (
                              <span className={col === "caso" ? "font-semibold text-caso-white" : "text-caso-slate"}>{val}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="mt-14 space-y-6 lg:hidden">
              <p className="text-center text-sm text-caso-slate">Comparison with top competitors</p>
              {COMPETITORS.slice(0, 3).map((comp) => (
                <div key={comp.name} className="rounded-2xl border border-caso-border bg-caso-navy-light/50 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">{comp.name}</h3>
                    <span className="rounded-full bg-caso-navy px-3 py-1 text-xs text-caso-slate">{comp.type}</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-caso-slate">Formats</span><span>{comp.formats}</span></div>
                    <div className="flex justify-between"><span className="text-caso-slate">Automation</span><span>{comp.automation}</span></div>
                    <div className="flex justify-between"><span className="text-caso-slate">Pricing</span><span>{comp.pricing}</span></div>
                    <div className="flex justify-between"><span className="text-caso-slate">Setup</span><span>{comp.setupTime}</span></div>
                    <div className="flex justify-between"><span className="text-caso-slate">Autonomous</span><span><XIcon /></span></div>
                    <div className="flex justify-between"><span className="text-caso-slate">LLM-powered</span><span><XIcon /></span></div>
                  </div>
                  <div className="mt-4 border-t border-caso-border/30 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-caso-green">Strengths</p>
                    <ul className="mt-2 space-y-1">
                      {comp.strengths.map((s) => (
                        <li key={s} className="text-sm text-caso-slate">+ {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Competitor Deep Dives */}
        <section className="border-y border-caso-border/50 bg-caso-navy-light/30 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Competitor deep dives
              </h2>
              <p className="mt-4 text-lg text-caso-slate">
                How the top platforms actually work — and where they fall short.
              </p>
            </div>

            <div className="mt-14 space-y-8">
              {COMPETITORS.map((comp) => (
                <div key={comp.name} className="rounded-2xl border border-caso-border bg-caso-navy/80 p-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">{comp.name}</h3>
                        <span className="rounded-full border border-caso-border px-3 py-0.5 text-xs text-caso-slate">{comp.type}</span>
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-caso-slate">Formats</p>
                          <p className="mt-1 text-sm">{comp.formats}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-caso-slate">Automation</p>
                          <p className="mt-1 text-sm">{comp.automation}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-caso-slate">Deployment</p>
                          <p className="mt-1 text-sm">{comp.deployment}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-caso-slate">Pricing</p>
                          <p className="mt-1 text-sm">{comp.pricing}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-6 md:flex-col md:items-end">
                      <div className="flex items-center gap-2">
                        {comp.folderWatch ? <CheckIcon /> : <XIcon />}
                        <span className="text-xs text-caso-slate">Folder watch</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {comp.dataLocal ? <CheckIcon /> : <XIcon />}
                        <span className="text-xs text-caso-slate">Data local</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {comp.llmPowered ? <CheckIcon /> : <XIcon />}
                        <span className="text-xs text-caso-slate">LLM-powered</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 border-t border-caso-border/30 pt-6 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-caso-green">Strengths</p>
                      <ul className="mt-2 space-y-1">
                        {comp.strengths.map((s) => (
                          <li key={s} className="flex items-start gap-2 text-sm text-caso-slate">
                            <CheckIcon />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-caso-warm">Limitations</p>
                      <ul className="mt-2 space-y-1">
                        {comp.weaknesses.map((w) => (
                          <li key={w} className="flex items-start gap-2 text-sm text-caso-slate">
                            <MinusIcon />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Technology Gap */}
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Built on next-gen AI
              </h2>
              <p className="mt-4 text-lg text-caso-slate">
                Every competitor uses pre-LLM machine learning from 2020 or earlier. CASO Comply uses the latest vision-language models for dramatically better results.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-caso-border/50 bg-caso-navy-light/30 p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-caso-slate">Traditional approach</p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold text-caso-slate/70">Pattern matching ML</h3>
                <ul className="mt-6 space-y-3 text-sm text-caso-slate/60">
                  <li className="flex items-start gap-2"><MinusIcon /><span>Rule-based tag assignment</span></li>
                  <li className="flex items-start gap-2"><MinusIcon /><span>Template-dependent accuracy</span></li>
                  <li className="flex items-start gap-2"><MinusIcon /><span>No alt text generation (or generic captions)</span></li>
                  <li className="flex items-start gap-2"><MinusIcon /><span>Fails on non-standard layouts</span></li>
                  <li className="flex items-start gap-2"><MinusIcon /><span>Requires human review for 20-40% of content</span></li>
                </ul>
              </div>
              <div className="rounded-2xl border border-caso-blue bg-caso-navy-light/50 p-8 shadow-lg shadow-caso-blue/10">
                <p className="text-xs font-semibold uppercase tracking-wider text-caso-blue">CASO Comply</p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold">LLM + Vision models</h3>
                <ul className="mt-6 space-y-3 text-sm">
                  <li className="flex items-start gap-2"><CheckIcon /><span>Semantic document understanding</span></li>
                  <li className="flex items-start gap-2"><CheckIcon /><span>Works on any layout — no templates needed</span></li>
                  <li className="flex items-start gap-2"><CheckIcon /><span>Vision AI generates contextual alt text per image</span></li>
                  <li className="flex items-start gap-2"><CheckIcon /><span>Intelligently fixes heading hierarchy and reading order</span></li>
                  <li className="flex items-start gap-2"><CheckIcon /><span>90%+ automated with higher accuracy</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-caso-border/50 bg-caso-navy-light/30 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to see it in action?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-caso-slate">
              Scan your website for free. See every inaccessible document, with remediation cost estimates at a fraction of what competitors charge.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/#scan"
                className="rounded-xl bg-caso-blue px-8 py-4 text-base font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
              >
                Get Free Site Audit
              </Link>
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
