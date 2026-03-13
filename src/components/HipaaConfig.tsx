"use client";

import { useState } from "react";

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

const GCP_REGIONS = [
  "us-central1",
  "us-east1",
  "us-east4",
  "us-west1",
  "us-west4",
  "europe-west1",
  "europe-west2",
  "europe-west4",
  "asia-east1",
  "asia-northeast1",
  "asia-southeast1",
];

export default function HipaaConfig() {
  const [hipaaEnabled, setHipaaEnabled] = useState(false);
  const [geminiProvider, setGeminiProvider] = useState<"standard" | "vertex">(
    "vertex"
  );
  const [gcpProject, setGcpProject] = useState("");
  const [gcpRegion, setGcpRegion] = useState("us-central1");
  const [purgeOriginals, setPurgeOriginals] = useState(24);
  const [purgeRemediated, setPurgeRemediated] = useState(72);
  const [purgeDbPaths, setPurgeDbPaths] = useState(30);

  const configSnippet = `    environment:
      - CASO_LICENSE_KEY=YOUR_API_KEY_HERE
      - CASO_SCAN_PATHS=/data/input
      - CASO_OUTPUT_DIR=/data/remediated
      - CASO_CRON=0 2 * * *
      - CASO_HIPAA_MODE=true
      - CASO_GEMINI_PROVIDER=${geminiProvider}${
    geminiProvider === "vertex"
      ? `
      - CASO_GCP_PROJECT=${gcpProject || "your-project-id"}
      - CASO_GCP_LOCATION=${gcpRegion}
      - GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json`
      : ""
  }
      - CASO_PURGE_ORIGINALS_HOURS=${purgeOriginals}
      - CASO_PURGE_REMEDIATED_HOURS=${purgeRemediated}
      - CASO_PURGE_DB_PATHS_DAYS=${purgeDbPaths}`;

  return (
    <section
      aria-labelledby="hipaa-heading"
      className="border-t border-caso-border/50 bg-caso-navy-light/30 px-6 py-16 md:py-24"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id="hipaa-heading"
          className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl"
        >
          HIPAA Compliance Mode
        </h2>
        <p className="mt-4 text-lg text-caso-slate">
          For healthcare organizations and covered entities handling protected
          health information (PHI).
        </p>

        {/* Toggle */}
        <div className="mt-10 rounded-2xl border border-caso-border/50 bg-caso-navy p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                Enable HIPAA Compliance Mode
              </h3>
              <p className="mt-1 text-sm text-caso-slate">
                Activates data retention policies, restricted networking, and
                HIPAA-safe AI processing.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={hipaaEnabled}
              onClick={() => setHipaaEnabled(!hipaaEnabled)}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-caso-blue focus:ring-offset-2 focus:ring-offset-caso-navy ${
                hipaaEnabled ? "bg-caso-blue" : "bg-caso-border"
              }`}
            >
              <span className="sr-only">Enable HIPAA Compliance Mode</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-caso-white shadow ring-0 transition duration-200 ease-in-out ${
                  hipaaEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Conditional HIPAA fields */}
        {hipaaEnabled && (
          <div className="mt-6 space-y-6">
            {/* Info callout */}
            <div className="rounded-2xl border border-caso-blue/30 bg-caso-blue/5 p-6">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-caso-blue"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-sm leading-relaxed text-caso-slate">
                  <strong className="text-caso-white">
                    What HIPAA mode does:
                  </strong>{" "}
                  Blocks all outbound data transmission except Vertex AI,
                  requires authentication on all API endpoints, hashes filenames
                  in logs, and restricts CORS to localhost.
                </div>
              </div>
            </div>

            {/* Gemini Provider */}
            <div className="rounded-2xl border border-caso-border/50 bg-caso-navy p-8">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                Gemini Provider
              </h3>
              <p className="mt-1 text-sm text-caso-slate">
                Select how the agent connects to Gemini for AI verification.
              </p>
              <div className="mt-4">
                <label htmlFor="gemini-provider" className="sr-only">
                  Gemini Provider
                </label>
                <select
                  id="gemini-provider"
                  value={geminiProvider}
                  onChange={(e) =>
                    setGeminiProvider(
                      e.target.value as "standard" | "vertex"
                    )
                  }
                  className="w-full rounded-lg border border-caso-border/50 bg-caso-navy-light px-4 py-2.5 text-sm text-caso-white focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue"
                >
                  <option value="standard">Standard (API Key)</option>
                  <option value="vertex">
                    Vertex AI (HIPAA-Compliant)
                  </option>
                </select>
              </div>

              {/* Vertex AI fields */}
              {geminiProvider === "vertex" && (
                <div className="mt-6 space-y-4 border-t border-caso-border/50 pt-6">
                  <div>
                    <label
                      htmlFor="gcp-project"
                      className="block text-sm font-medium text-caso-white"
                    >
                      GCP Project ID
                    </label>
                    <input
                      type="text"
                      id="gcp-project"
                      value={gcpProject}
                      onChange={(e) => setGcpProject(e.target.value)}
                      placeholder="my-hipaa-project"
                      className="mt-1.5 w-full rounded-lg border border-caso-border/50 bg-caso-navy-light px-4 py-2.5 text-sm text-caso-white placeholder:text-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="gcp-region"
                      className="block text-sm font-medium text-caso-white"
                    >
                      GCP Region
                    </label>
                    <select
                      id="gcp-region"
                      value={gcpRegion}
                      onChange={(e) => setGcpRegion(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-caso-border/50 bg-caso-navy-light px-4 py-2.5 text-sm text-caso-white focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue"
                    >
                      {GCP_REGIONS.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm text-caso-slate">
                    Mount your service account key at{" "}
                    <code className="rounded bg-caso-navy-light px-1.5 py-0.5 text-caso-glacier">
                      /app/credentials.json
                    </code>{" "}
                    in the Docker container.
                  </p>
                </div>
              )}
            </div>

            {/* Data Retention */}
            <div className="rounded-2xl border border-caso-border/50 bg-caso-navy p-8">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                Data Retention
              </h3>
              <p className="mt-1 text-sm text-caso-slate">
                Configure automatic purging of sensitive files and metadata.
              </p>
              <div className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="purge-originals"
                    className="block text-sm font-medium text-caso-white"
                  >
                    Purge original files after (hours)
                  </label>
                  <input
                    type="number"
                    id="purge-originals"
                    value={purgeOriginals}
                    onChange={(e) =>
                      setPurgeOriginals(
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    min={1}
                    className="mt-1.5 w-full rounded-lg border border-caso-border/50 bg-caso-navy-light px-4 py-2.5 text-sm text-caso-white focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue"
                  />
                </div>
                <div>
                  <label
                    htmlFor="purge-remediated"
                    className="block text-sm font-medium text-caso-white"
                  >
                    Purge remediated files after (hours)
                  </label>
                  <input
                    type="number"
                    id="purge-remediated"
                    value={purgeRemediated}
                    onChange={(e) =>
                      setPurgeRemediated(
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    min={1}
                    className="mt-1.5 w-full rounded-lg border border-caso-border/50 bg-caso-navy-light px-4 py-2.5 text-sm text-caso-white focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue"
                  />
                </div>
                <div>
                  <label
                    htmlFor="purge-db-paths"
                    className="block text-sm font-medium text-caso-white"
                  >
                    Scrub file paths from DB after (days)
                  </label>
                  <input
                    type="number"
                    id="purge-db-paths"
                    value={purgeDbPaths}
                    onChange={(e) =>
                      setPurgeDbPaths(
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    min={1}
                    className="mt-1.5 w-full rounded-lg border border-caso-border/50 bg-caso-navy-light px-4 py-2.5 text-sm text-caso-white focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue"
                  />
                </div>
              </div>
            </div>

            {/* Prerequisites callout */}
            <div className="rounded-2xl border border-caso-warm/30 bg-caso-warm/5 p-6">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-caso-warm"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.345 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <strong className="text-sm font-semibold text-caso-white">
                    HIPAA Prerequisites
                  </strong>
                  <ul className="mt-2 space-y-2 text-sm text-caso-slate" role="list">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-caso-warm" aria-hidden="true" />
                      Your Docker volumes MUST be on encrypted storage (LUKS,
                      BitLocker, or cloud encrypted disks)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-caso-warm" aria-hidden="true" />
                      You must sign a Google Cloud BAA in your GCP console
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-caso-warm" aria-hidden="true" />
                      Use a reverse proxy (nginx/Caddy) with TLS certificates
                      for HTTPS
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Generated config snippet */}
            <div className="rounded-2xl border border-caso-border/50 bg-caso-navy p-8">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                Your HIPAA Configuration
              </h3>
              <p className="mt-1 text-sm text-caso-slate">
                Add these environment variables to your{" "}
                <code className="rounded bg-caso-navy-light px-1.5 py-0.5 text-caso-glacier">
                  docker-compose.yml
                </code>{" "}
                to enable HIPAA mode.
              </p>
              <TerminalBlock title="docker-compose.yml (environment section)">
                <pre className="whitespace-pre leading-relaxed">
                  {configSnippet}
                </pre>
              </TerminalBlock>
              {geminiProvider === "vertex" && (
                <div className="mt-4">
                  <p className="text-sm text-caso-slate">
                    Add this volume mount to your service:
                  </p>
                  <TerminalBlock title="docker-compose.yml (volumes section)">
                    <pre className="whitespace-pre leading-relaxed">
{`    volumes:
      - ./documents:/data/input
      - ./remediated:/data/remediated
      - ./agent-data:/data
      - ./credentials.json:/app/credentials.json:ro`}
                    </pre>
                  </TerminalBlock>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
