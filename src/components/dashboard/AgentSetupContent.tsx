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
          <span className="text-xs text-caso-slate/60 font-mono">{language}</span>
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

const dockerPullCommand = `docker pull caso/comply-agent:latest`;

const dockerComposeYml = `version: "3.8"
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
    restart: unless-stopped`;

const dockerComposeUpCommand = `docker-compose up -d`;

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

const envVars = [
  {
    name: "CASO_LICENSE_KEY",
    required: "Yes",
    defaultVal: "\u2014",
    description: "Your API key from the dashboard",
  },
  {
    name: "CASO_SCAN_PATHS",
    required: "No",
    defaultVal: "/data/input",
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
    defaultVal: "directory",
    description: "How to name output: suffix, overwrite, directory",
  },
  {
    name: "CASO_CRON",
    required: "No",
    defaultVal: "0 2 * * *",
    description: "Cron schedule for automatic scans",
  },
  {
    name: "CASO_MAX_WORKERS",
    required: "No",
    defaultVal: "1",
    description: "Parallel processing threads",
  },
];

export default function AgentSetupContent() {
  return (
    <>
      {/* Quick Start */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-6">
          Quick Start
        </h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-caso-blue/10 text-caso-blue text-sm font-bold">
                1
              </span>
              <h3 className="text-sm font-medium text-caso-white">
                Pull the image
              </h3>
            </div>
            <CodeBlock code={dockerPullCommand} language="bash" />
          </div>

          {/* Step 2 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-caso-blue/10 text-caso-blue text-sm font-bold">
                2
              </span>
              <h3 className="text-sm font-medium text-caso-white">
                Create a config file{" "}
                <code className="text-caso-slate font-mono text-xs">
                  docker-compose.yml
                </code>
              </h3>
            </div>
            <CodeBlock code={dockerComposeYml} language="yaml" />
            <p className="text-caso-slate/60 text-xs mt-2">
              Replace <code className="text-caso-warm font-mono">YOUR_API_KEY_HERE</code>{" "}
              with your full API key.
            </p>
          </div>

          {/* Step 3 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-caso-blue/10 text-caso-blue text-sm font-bold">
                3
              </span>
              <h3 className="text-sm font-medium text-caso-white">
                Start the agent
              </h3>
            </div>
            <CodeBlock code={dockerComposeUpCommand} language="bash" />
          </div>

          {/* Step 4 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-caso-blue/10 text-caso-blue text-sm font-bold">
                4
              </span>
              <h3 className="text-sm font-medium text-caso-white">
                View the dashboard
              </h3>
            </div>
            <div className="rounded-lg bg-caso-navy border border-caso-border px-4 py-3">
              <p className="text-sm text-caso-slate">
                Open{" "}
                <a
                  href="http://localhost:9090"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-caso-blue hover:text-caso-blue-bright transition-colors font-mono"
                >
                  http://localhost:9090
                </a>{" "}
                in your browser
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
          Your plan determines how the agent processes documents. The agent reads your plan automatically from your API key.
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
                  <td className="px-6 py-3 text-caso-slate">{v.description}</td>
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
              code="docker-compose logs -f caso-agent"
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
                  Agent fails to start
                </p>
                <p className="text-caso-slate text-xs">
                  Verify your <code className="text-caso-green font-mono">CASO_LICENSE_KEY</code> is
                  correct and active. Check that port 9090 is not already in use.
                </p>
              </div>
              <div className="rounded-lg bg-caso-navy border border-caso-border px-4 py-3">
                <p className="text-sm font-medium text-caso-white mb-1">
                  Documents not being processed
                </p>
                <p className="text-caso-slate text-xs">
                  Ensure your input directory is mounted correctly and contains
                  supported files (.pdf, .docx, .xlsx, .pptx). Check that <code className="text-caso-green font-mono">CASO_SCAN_PATHS</code>{" "}
                  matches your volume mount.
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
                    chmod 777 ./remediated ./agent-data
                  </code>
                </p>
              </div>
              <div className="rounded-lg bg-caso-navy border border-caso-border px-4 py-3">
                <p className="text-sm font-medium text-caso-white mb-1">
                  Low scores after remediation
                </p>
                <p className="text-caso-slate text-xs">
                  Some documents with complex layouts may score below 60 after
                  automated remediation. Consider upgrading to the Human Review
                  tier for expert review of these files.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
