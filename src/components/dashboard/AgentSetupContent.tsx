"use client";

import { useState } from "react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 rounded-md bg-caso-blue/10 border border-caso-blue/20 px-2.5 py-1 text-xs text-caso-blue hover:bg-caso-blue/20 transition-colors"
      aria-label="Copy to clipboard"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <div className="relative rounded-lg bg-caso-navy border border-caso-border overflow-hidden">
      {language && (
        <div className="px-4 py-1.5 border-b border-caso-border">
          <span className="text-xs text-caso-slate font-mono">{language}</span>
        </div>
      )}
      <CopyButton text={code} />
      <pre className="px-4 py-3 overflow-x-auto">
        <code className="text-sm text-caso-green font-mono whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}

function StepNumber({ num }: { num: number }) {
  return (
    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-caso-blue/10 text-caso-blue text-sm font-bold">
      {num}
    </span>
  );
}

const MODES = [
  {
    value: "local",
    label: "Local (Air-Gapped)",
    description:
      "Everything runs on-premise. No data leaves your network. Best for HIPAA, classified, or air-gapped environments.",
  },
  {
    value: "hybrid",
    label: "Hybrid (Recommended)",
    description:
      "Local remediation with AI quality verification via Gemini. Only page images are sent for review — no text or PDFs leave your network.",
  },
  {
    value: "cloud",
    label: "Cloud",
    description:
      "PDFs are uploaded to the CASO cloud API for processing. Fastest setup for non-sensitive documents.",
  },
];

const envVars = [
  {
    name: "CASO_LICENSE_KEY",
    required: "Yes",
    defaultVal: "\u2014",
    description: "Your license key from the dashboard",
  },
  {
    name: "CASO_ADMIN_PASSWORD",
    required: "Yes",
    defaultVal: "\u2014",
    description: "Password for the agent web dashboard",
  },
  {
    name: "CASO_MODE",
    required: "No",
    defaultVal: "hybrid",
    description: "Processing mode: local, hybrid, or cloud",
  },
  {
    name: "CASO_CRON",
    required: "No",
    defaultVal: "0 * * * *",
    description: "Cron schedule for automatic scans",
  },
  {
    name: "CASO_SCAN_PATHS",
    required: "No",
    defaultVal: "/data/documents",
    description: "Comma-separated folder paths to scan",
  },
  {
    name: "CASO_OUTPUT_DIR",
    required: "No",
    defaultVal: "/data/remediated",
    description: "Where remediated files are saved",
  },
  {
    name: "CASO_OUTPUT_MODE",
    required: "No",
    defaultVal: "suffix",
    description: "Output naming: suffix, overwrite, or directory",
  },
  {
    name: "CASO_MAX_WORKERS",
    required: "No",
    defaultVal: "1",
    description: "Number of PDFs to process simultaneously",
  },
  {
    name: "CASO_HIPAA_MODE",
    required: "No",
    defaultVal: "false",
    description: "Enable HIPAA compliance (hashes filenames, restricts CORS)",
  },
  {
    name: "CASO_GEMINI_API_KEY",
    required: "Hybrid only",
    defaultVal: "\u2014",
    description: "Gemini API key for AI verification (hybrid mode)",
  },
];

const tiers = [
  {
    name: "Standard",
    price: "$0.25/page",
    tagColor: "bg-caso-blue/10 text-caso-blue",
    description:
      "Automated remediation with font-size heuristic tagging. Fast, reliable, and cost-effective for bulk processing.",
  },
  {
    name: "AI Verified",
    price: "$0.35/page",
    tagColor: "bg-caso-green/10 text-caso-green",
    description:
      "AI verifies heading hierarchy, reading order, and generates alt text. Higher accuracy for complex documents.",
  },
  {
    name: "Human Review",
    price: "$4.00/page",
    tagColor: "bg-purple-400/10 text-purple-400",
    description:
      "AI-verified remediation plus expert human review for files scoring below 60. Full compliance certification.",
  },
];

export default function AgentSetupContent() {
  const [selectedMode, setSelectedMode] = useState("hybrid");

  const dockerComposeYml = `version: "3.8"
services:
  caso-agent:
    image: bwages/caso-comply-agent:latest
    environment:
      # REQUIRED: Your license key from the API Keys page
      - CASO_LICENSE_KEY=YOUR_LICENSE_KEY_HERE
      # REQUIRED: Set a strong password for the dashboard
      - CASO_ADMIN_PASSWORD=YOUR_SECURE_PASSWORD
      # Processing mode
      - CASO_MODE=${selectedMode}
      # Scan schedule (default: every hour)
      - CASO_CRON=0 * * * *${selectedMode === "hybrid" ? "\n      # Gemini API key for AI verification (get one at https://aistudio.google.com/apikey)\n      # - CASO_GEMINI_API_KEY=your-gemini-key" : ""}${selectedMode === "local" ? "\n      # Disable telemetry for air-gapped environments\n      - CASO_PHONE_HOME=false" : ""}
    ports:
      - "9090:9090"
    volumes:
      # Your document folder → agent scans this for PDFs
      - ./documents:/data/documents
      # Remediated output folder
      - ./remediated:/data/output
      # Persistent data (scan history, database)
      - caso-data:/app/data
    restart: unless-stopped

volumes:
  caso-data:`;

  return (
    <>
      {/* Mode Selection */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-2">
          Choose a Processing Mode
        </h2>
        <p className="text-caso-slate text-sm mb-5">
          Select how you want documents processed. This affects what data (if
          any) leaves your network.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MODES.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setSelectedMode(mode.value)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                selectedMode === mode.value
                  ? "border-caso-blue bg-caso-blue/5"
                  : "border-caso-border hover:border-caso-blue/40"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full border-2 ${
                    selectedMode === mode.value
                      ? "border-caso-blue bg-caso-blue"
                      : "border-caso-slate"
                  }`}
                />
                <span className="text-sm font-semibold text-caso-white">
                  {mode.label}
                </span>
              </div>
              <p className="text-caso-slate text-xs leading-relaxed">
                {mode.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Start */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-6">
          Setup Instructions
        </h2>

        <div className="space-y-6">
          {/* Step 1: Prerequisites */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StepNumber num={1} />
              <h3 className="text-sm font-medium text-caso-white">
                Prerequisites
              </h3>
            </div>
            <div className="rounded-lg bg-caso-navy border border-caso-border px-4 py-3">
              <ul className="text-sm text-caso-slate space-y-1.5">
                <li>
                  <strong className="text-caso-white">Docker</strong> installed
                  and running (
                  <a
                    href="https://docs.docker.com/get-docker/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-caso-blue hover:text-caso-blue-bright"
                  >
                    Install Docker
                  </a>
                  )
                </li>
                <li>
                  <strong className="text-caso-white">Docker Compose</strong>{" "}
                  v2+ (included with Docker Desktop)
                </li>
                <li>
                  Your{" "}
                  <strong className="text-caso-white">CASO license key</strong>{" "}
                  from the{" "}
                  <a
                    href="/dashboard/api-keys"
                    className="text-caso-blue hover:text-caso-blue-bright"
                  >
                    API Keys page
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 2: Create project folder */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StepNumber num={2} />
              <h3 className="text-sm font-medium text-caso-white">
                Create a project folder
              </h3>
            </div>
            <CodeBlock
              code="mkdir caso-agent && cd caso-agent\nmkdir -p documents remediated"
              language="bash"
            />
          </div>

          {/* Step 3: docker-compose.yml */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StepNumber num={3} />
              <h3 className="text-sm font-medium text-caso-white">
                Save this as{" "}
                <code className="text-caso-slate font-mono text-xs">
                  docker-compose.yml
                </code>
              </h3>
            </div>
            <CodeBlock code={dockerComposeYml} language="yaml" />
            <div className="mt-3 space-y-2">
              <div className="flex items-start gap-2 rounded-lg bg-caso-warm/5 border border-caso-warm/20 px-3 py-2">
                <span className="text-caso-warm text-sm mt-0.5">!</span>
                <p className="text-caso-slate text-xs">
                  Replace{" "}
                  <code className="text-caso-warm font-mono">
                    YOUR_LICENSE_KEY_HERE
                  </code>{" "}
                  with your full API key from the{" "}
                  <a
                    href="/dashboard/api-keys"
                    className="text-caso-blue hover:text-caso-blue-bright"
                  >
                    API Keys page
                  </a>
                  . The key starts with{" "}
                  <code className="text-caso-green font-mono">caso_ak_</code>.
                </p>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-caso-warm/5 border border-caso-warm/20 px-3 py-2">
                <span className="text-caso-warm text-sm mt-0.5">!</span>
                <p className="text-caso-slate text-xs">
                  Replace{" "}
                  <code className="text-caso-warm font-mono">
                    YOUR_SECURE_PASSWORD
                  </code>{" "}
                  with a strong password. This protects the agent dashboard at
                  port 9090.
                </p>
              </div>
            </div>
          </div>

          {/* Step 4: Start */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StepNumber num={4} />
              <h3 className="text-sm font-medium text-caso-white">
                Start the agent
              </h3>
            </div>
            <CodeBlock code="docker compose up -d" language="bash" />
          </div>

          {/* Step 5: Verify */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StepNumber num={5} />
              <h3 className="text-sm font-medium text-caso-white">
                Verify it&apos;s running
              </h3>
            </div>
            <CodeBlock code="curl http://localhost:9090/health" language="bash" />
            <p className="text-caso-slate text-xs mt-2">
              You should get a JSON response with{" "}
              <code className="text-caso-green font-mono">
                {`{"status":"ok"}`}
              </code>
              . Then open{" "}
              <a
                href="http://localhost:9090"
                target="_blank"
                rel="noopener noreferrer"
                className="text-caso-blue hover:text-caso-blue-bright font-mono"
              >
                http://localhost:9090
              </a>{" "}
              to access the dashboard.
            </p>
          </div>

          {/* Step 6: Add documents */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StepNumber num={6} />
              <h3 className="text-sm font-medium text-caso-white">
                Add documents
              </h3>
            </div>
            <div className="rounded-lg bg-caso-navy border border-caso-border px-4 py-3">
              <p className="text-sm text-caso-slate">
                Drop PDF files into the{" "}
                <code className="text-caso-green font-mono">./documents</code>{" "}
                folder. The agent scans automatically on schedule, or click{" "}
                <strong className="text-caso-white">Run Scan Now</strong> in the
                dashboard. Remediated files appear in{" "}
                <code className="text-caso-green font-mono">./remediated</code>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-4">
          Pricing Tiers
        </h2>
        <p className="text-caso-slate text-sm mb-4">
          Your plan determines how the agent processes documents. The agent reads
          your plan automatically from your license key.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="rounded-xl bg-caso-navy-light border border-caso-border p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-caso-white">
                  {tier.name}
                </h3>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${tier.tagColor}`}
                >
                  {tier.price}
                </span>
              </div>
              <p className="text-caso-slate text-sm leading-relaxed">
                {tier.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Reference */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
        <div className="px-6 py-4 border-b border-caso-border">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white">
            Configuration Reference
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-caso-border text-left">
                <th className="px-6 py-3 text-caso-slate font-medium">
                  Variable
                </th>
                <th className="px-6 py-3 text-caso-slate font-medium">
                  Required
                </th>
                <th className="px-6 py-3 text-caso-slate font-medium">
                  Default
                </th>
                <th className="px-6 py-3 text-caso-slate font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {envVars.map((v) => (
                <tr
                  key={v.name}
                  className="border-b border-caso-border/50 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-3">
                    <code className="text-caso-green font-mono text-xs">
                      {v.name}
                    </code>
                  </td>
                  <td className="px-6 py-3 text-caso-slate">{v.required}</td>
                  <td className="px-6 py-3">
                    <code className="text-caso-slate font-mono text-xs">
                      {v.defaultVal}
                    </code>
                  </td>
                  <td className="px-6 py-3 text-caso-slate">
                    {v.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-6">
          Troubleshooting
        </h2>

        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-medium text-caso-white mb-2">
              Health Check
            </h3>
            <CodeBlock
              code="curl http://localhost:9090/health"
              language="bash"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-caso-white mb-2">
              View Logs
            </h3>
            <CodeBlock
              code="docker compose logs -f caso-agent"
              language="bash"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-caso-white mb-2">
              Trigger Manual Scan
            </h3>
            <CodeBlock
              code="curl -X POST http://localhost:9090/api/scan"
              language="bash"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-caso-white mb-4">
              Common Issues
            </h3>
            <div className="space-y-3">
              <div className="rounded-lg bg-caso-navy border border-caso-border px-4 py-3">
                <p className="text-sm font-medium text-caso-white mb-1">
                  &quot;License validation failed. Exiting.&quot;
                </p>
                <p className="text-caso-slate text-xs">
                  Your{" "}
                  <code className="text-caso-green font-mono">
                    CASO_LICENSE_KEY
                  </code>{" "}
                  is invalid or your account is inactive. Generate a new key from
                  the{" "}
                  <a
                    href="/dashboard/api-keys"
                    className="text-caso-blue hover:text-caso-blue-bright"
                  >
                    API Keys page
                  </a>
                  . Make sure the full key is pasted (starts with{" "}
                  <code className="text-caso-green font-mono">caso_ak_</code>).
                </p>
              </div>
              <div className="rounded-lg bg-caso-navy border border-caso-border px-4 py-3">
                <p className="text-sm font-medium text-caso-white mb-1">
                  Container starts then immediately stops
                </p>
                <p className="text-caso-slate text-xs">
                  Check logs with{" "}
                  <code className="text-caso-green font-mono">
                    docker compose logs caso-agent
                  </code>
                  . The most common cause is a missing or invalid license key.
                  The agent validates your key on startup and exits if it fails.
                </p>
              </div>
              <div className="rounded-lg bg-caso-navy border border-caso-border px-4 py-3">
                <p className="text-sm font-medium text-caso-white mb-1">
                  Documents not being processed
                </p>
                <p className="text-caso-slate text-xs">
                  Ensure your input directory is mounted correctly and contains
                  PDF files. Check that the volume mount in docker-compose.yml
                  maps to{" "}
                  <code className="text-caso-green font-mono">
                    /data/documents
                  </code>{" "}
                  inside the container. Try a manual scan:{" "}
                  <code className="text-caso-green font-mono">
                    curl -X POST http://localhost:9090/api/scan
                  </code>
                </p>
              </div>
              <div className="rounded-lg bg-caso-navy border border-caso-border px-4 py-3">
                <p className="text-sm font-medium text-caso-white mb-1">
                  Permission errors on output directory
                </p>
                <p className="text-caso-slate text-xs">
                  The container runs as a non-root user. Ensure the host
                  directories have appropriate write permissions:{" "}
                  <code className="text-caso-green font-mono">
                    chmod 755 ./remediated
                  </code>
                </p>
              </div>
              <div className="rounded-lg bg-caso-navy border border-caso-border px-4 py-3">
                <p className="text-sm font-medium text-caso-white mb-1">
                  Port 9090 already in use
                </p>
                <p className="text-caso-slate text-xs">
                  Change the port mapping in docker-compose.yml to a different
                  port, e.g.{" "}
                  <code className="text-caso-green font-mono">
                    &quot;8080:9090&quot;
                  </code>
                  , then access the dashboard at http://localhost:8080.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
