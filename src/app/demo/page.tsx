"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PdfUpload from "@/components/PdfUpload";
import PdfViewer from "@/components/PdfViewer";
import ScoreCard from "@/components/ScoreCard";
import ScreenReaderSim from "@/components/ScreenReaderSim";

const API_BASE = process.env.NEXT_PUBLIC_CASO_API_URL || "http://localhost:8787";

type DemoState = "idle" | "uploading" | "analyzing" | "remediating" | "complete" | "error";

interface Check {
  name: string;
  passed: boolean;
  message?: string;
}

interface ScoreResult {
  score: number;
  grade: string;
  checks: Check[];
}

interface TagAssignment {
  type: string;
  text: string;
  page: number;
  mcid: number;
  font_size: number;
}

interface RemediateResult {
  before: ScoreResult;
  after: ScoreResult;
  download_url: string;
  improvements: string[];
  tag_assignments: TagAssignment[];
}

function ProgressBar({ progress, label }: { progress: number; label: string }) {
  return (
    <div className="w-full" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-caso-slate">{label}</span>
        <span className="text-sm font-bold text-caso-blue">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-caso-navy-light">
        <div
          className="progress-bar-fill h-full rounded-full bg-gradient-to-r from-caso-blue to-caso-teal transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function StepIndicator({ state }: { state: DemoState }) {
  const steps = [
    { key: "uploading", label: "Upload" },
    { key: "analyzing", label: "Analyze" },
    { key: "remediating", label: "Remediate" },
    { key: "complete", label: "Results" },
  ] as const;

  const stateOrder: Record<string, number> = {
    idle: -1,
    uploading: 0,
    analyzing: 1,
    remediating: 2,
    complete: 3,
    error: -1,
  };

  const currentIndex = stateOrder[state] ?? -1;

  return (
    <nav aria-label="Demo progress" className="mb-10">
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((step, i) => {
          const isActive = i === currentIndex;
          const isComplete = i < currentIndex;
          return (
            <li key={step.key} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-500 ${
                    isComplete
                      ? "bg-caso-green text-caso-white"
                      : isActive
                        ? "step-active bg-caso-blue text-caso-white shadow-lg shadow-caso-blue/30"
                        : "bg-caso-navy-light text-caso-slate"
                  }`}
                  aria-hidden="true"
                >
                  {isComplete ? (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={`hidden text-sm font-medium sm:inline ${
                    isActive ? "text-caso-white" : isComplete ? "text-caso-green" : "text-caso-slate"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-px w-6 transition-colors duration-500 sm:w-12 ${
                    isComplete ? "bg-caso-green" : "bg-caso-border"
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function SpinnerIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={`spinner-icon ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

export default function DemoPage() {
  const [state, setState] = useState<DemoState>("idle");
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<RemediateResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const simulateProgress = useCallback(
    (from: number, to: number, durationMs: number) => {
      const startTime = Date.now();
      const step = () => {
        const elapsed = Date.now() - startTime;
        const p = Math.min(elapsed / durationMs, 1);
        const eased = 1 - Math.pow(1 - p, 2);
        setProgress(from + (to - from) * eased);
        if (p < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    },
    []
  );

  const handleFileSelected = useCallback(
    async (selectedFile: File) => {
      setFile(selectedFile);
      setState("uploading");
      setProgress(0);
      setErrorMessage("");
      setResult(null);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        // Phase 1: Upload + Analyze
        setState("uploading");
        simulateProgress(0, 30, 1500);

        const analyzeForm = new FormData();
        analyzeForm.append("file", selectedFile);

        await new Promise((r) => setTimeout(r, 800));
        setState("analyzing");
        simulateProgress(30, 60, 3000);

        const analyzeRes = await fetch(`${API_BASE}/api/analyze`, {
          method: "POST",
          body: analyzeForm,
          signal: controller.signal,
        });

        if (!analyzeRes.ok) {
          throw new Error(`Analysis failed: ${analyzeRes.statusText}`);
        }

        // We get the analysis result but use the remediate endpoint for the full before/after
        await analyzeRes.json();

        // Phase 2: Remediate
        setState("remediating");
        simulateProgress(60, 90, 4000);

        const remediateForm = new FormData();
        remediateForm.append("file", selectedFile);

        const remediateRes = await fetch(`${API_BASE}/api/remediate`, {
          method: "POST",
          body: remediateForm,
          signal: controller.signal,
        });

        if (!remediateRes.ok) {
          throw new Error(`Remediation failed: ${remediateRes.statusText}`);
        }

        const raw = await remediateRes.json();

        // Transform API checks object into Check[] array
        const transformChecks = (checksObj: Record<string, { passed: boolean; description: string }>) =>
          Object.entries(checksObj).map(([, val]) => ({
            name: val.description,
            passed: val.passed,
          }));

        const remediateData: RemediateResult = {
          before: {
            score: raw.before.score.score,
            grade: raw.before.score.grade,
            checks: transformChecks(raw.before.score.checks),
          },
          after: {
            score: raw.after.score.score,
            grade: raw.after.score.grade,
            checks: transformChecks(raw.after.score.checks),
          },
          download_url: raw.download_url,
          improvements: raw.before.structure.issues.filter(
            (issue: string) => !raw.after.structure.issues.includes(issue)
          ),
          tag_assignments: raw.tag_assignments || [],
        };

        simulateProgress(90, 100, 500);
        await new Promise((r) => setTimeout(r, 600));

        setResult(remediateData);
        setState("complete");
        setProgress(100);

        // Scroll to results after a short delay
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      } catch (err) {
        if (controller.signal.aborted) return;
        setState("error");
        setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    },
    [simulateProgress]
  );

  const handleReset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setState("idle");
    setProgress(0);
    setFile(null);
    setResult(null);
    setErrorMessage("");
  }, []);

  const handleDownload = useCallback(() => {
    if (!result?.download_url) return;
    const url = result.download_url.startsWith("http")
      ? result.download_url
      : `${API_BASE}${result.download_url}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [result]);

  const isProcessing = state === "uploading" || state === "analyzing" || state === "remediating";

  return (
    <div className="min-h-screen bg-caso-navy text-caso-white">
      {/* Skip link */}
      <a href="#demo-content" className="skip-link">
        Skip to demo content
      </a>

      {/* Nav */}
      <nav aria-label="Demo navigation" className="sticky top-0 z-40 border-b border-caso-border/50 bg-caso-navy/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2" aria-label="Back to CASO Comply home">
            <Image
              src="/caso-comply-logo-white.png"
              alt="CASO Comply"
              width={426}
              height={80}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      <main id="demo-content" className="relative">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-caso-blue/5 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-caso-teal/3 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 py-12 md:py-20">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-900 tracking-tight sm:text-4xl md:text-5xl">
              PDF Accessibility{" "}
              <span className="text-gradient">Live Demo</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-caso-slate">
              Upload a PDF and watch CASO Comply analyze and remediate it in real time.
              See your before and after compliance scores side by side.
            </p>
          </div>

          {/* Step Indicator */}
          {state !== "idle" && state !== "error" && <StepIndicator state={state} />}

          {/* Idle State: Upload Zone */}
          {state === "idle" && (
            <div className="demo-fade-in mx-auto max-w-xl">
              <PdfUpload onFileSelected={handleFileSelected} />
              <div className="mt-6 text-center">
                <p className="text-xs text-caso-slate/60">
                  Your file is processed securely and never stored permanently.
                  We evaluate against WCAG 2.1 AA, PDF/UA, and Section 508 standards.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-sm text-caso-slate/50">or</span>
                  <button
                    onClick={async () => {
                      const res = await fetch("/sample-budget-report.pdf");
                      const blob = await res.blob();
                      const sampleFile = new File([blob], "Springfield-Budget-Report-2026.pdf", { type: "application/pdf" });
                      handleFileSelected(sampleFile);
                    }}
                    className="text-sm font-semibold text-caso-blue underline decoration-caso-blue/30 underline-offset-2 transition-colors hover:text-caso-blue-bright hover:decoration-caso-blue/60"
                  >
                    Try a sample PDF
                  </button>
                  <span className="text-xs text-caso-slate/40">(3-page government budget report)</span>
                </div>
              </div>
            </div>
          )}

          {/* Processing States */}
          {isProcessing && (
            <div className="demo-fade-in mx-auto max-w-xl">
              <div className="rounded-2xl border border-caso-border bg-caso-navy-light p-8 text-center">
                {/* File info */}
                {file && (
                  <div className="mb-6 inline-flex items-center gap-3 rounded-xl bg-caso-navy/50 px-4 py-2">
                    <svg className="h-5 w-5 text-caso-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span className="text-sm font-medium text-caso-white">{file.name}</span>
                  </div>
                )}

                {/* Spinner + Status */}
                <div className="mb-6 flex flex-col items-center gap-4">
                  <SpinnerIcon className="h-10 w-10 text-caso-blue" />
                  <p className="text-lg font-semibold text-caso-white" aria-live="polite">
                    {state === "uploading" && "Uploading your PDF..."}
                    {state === "analyzing" && "Analyzing accessibility compliance..."}
                    {state === "remediating" && "Generating remediated document..."}
                  </p>
                  <p className="text-sm text-caso-slate">
                    {state === "uploading" && "Securely transferring your document"}
                    {state === "analyzing" && "Checking tags, structure, alt text, reading order, and more"}
                    {state === "remediating" && "Applying AI-powered fixes to your PDF"}
                  </p>
                </div>

                <ProgressBar
                  progress={progress}
                  label={
                    state === "uploading"
                      ? "Uploading"
                      : state === "analyzing"
                        ? "Analyzing"
                        : "Remediating"
                  }
                />
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={handleReset}
                  className="text-sm text-caso-slate underline underline-offset-2 transition-colors hover:text-caso-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Error State */}
          {state === "error" && (
            <div className="demo-fade-in mx-auto max-w-xl">
              <div className="rounded-2xl border border-caso-red-dark/30 bg-caso-red/5 p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-caso-red/10">
                  <svg className="h-7 w-7 text-caso-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-caso-white">Something went wrong</h2>
                <p className="mt-2 text-sm text-caso-slate" role="alert">{errorMessage}</p>
                <button
                  onClick={handleReset}
                  className="mt-6 rounded-xl bg-caso-blue px-6 py-3 text-sm font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Complete State: Results */}
          {state === "complete" && result && (
            <div ref={resultsRef} className="demo-fade-in">
              {/* Score Comparison */}
              <div className="grid gap-6 md:grid-cols-2">
                <ScoreCard
                  score={result.before.score}
                  grade={result.before.grade}
                  checks={result.before.checks ?? []}
                  variant="before"
                  animate={true}
                  label="Score before remediation"
                />
                <ScoreCard
                  score={result.after.score}
                  grade={result.after.grade}
                  checks={result.after.checks ?? []}
                  variant="after"
                  animate={true}
                  label="Score after remediation"
                />
              </div>

              {/* Screen Reader Comparison */}
              {result.tag_assignments && result.tag_assignments.length > 0 && (
                <div className="mt-8 rounded-2xl border border-caso-border bg-caso-navy-light p-6 md:p-8">
                  <div className="mb-4 text-center">
                    <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white">
                      Hear the Difference
                    </h3>
                    <p className="mt-1 text-sm text-caso-slate">
                      Listen to how a screen reader interprets your PDF — before and after remediation
                    </p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <ScreenReaderSim
                      tagAssignments={result.tag_assignments}
                      variant="before"
                    />
                    <ScreenReaderSim
                      tagAssignments={result.tag_assignments}
                      variant="after"
                    />
                  </div>
                </div>
              )}

              {/* Score improvement banner */}
              <div className="mt-8 overflow-hidden rounded-2xl border border-caso-green/20 bg-gradient-to-r from-caso-green/5 to-caso-teal/5 p-6 md:p-8">
                <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-caso-green/10">
                    <svg className="h-7 w-7 text-caso-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white">
                      Score improved by{" "}
                      <span className="text-caso-green">
                        +{result.after.score - result.before.score} points
                      </span>
                    </h3>
                    <p className="mt-1 text-sm text-caso-slate">
                      From grade {result.before.grade} to grade {result.after.grade} — your PDF is now
                      {result.after.grade === "A"
                        ? " fully compliant."
                        : " significantly more accessible."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Improvements list */}
              {result.improvements && result.improvements.length > 0 && (
                <div className="mt-8 rounded-2xl border border-caso-border bg-caso-navy-light p-6 md:p-8">
                  <h3 className="mb-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                    Improvements Made
                  </h3>
                  <ul className="space-y-3" role="list">
                    {result.improvements.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-caso-slate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  onClick={handleDownload}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-caso-blue px-8 py-4 text-base font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25 sm:w-auto"
                  aria-label="Download remediated PDF"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download Remediated PDF
                </button>
                {result.tag_assignments && result.tag_assignments.length > 0 && (
                  <button
                    onClick={() => setShowPdfViewer(true)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-caso-blue/50 bg-caso-blue/10 px-8 py-4 text-base font-bold text-caso-blue transition-all hover:border-caso-blue hover:bg-caso-blue/20 hover:shadow-lg hover:shadow-caso-blue/15 sm:w-auto"
                    aria-label="View tagged PDF with tag inspector"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                    View Tagged PDF
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-caso-border bg-transparent px-8 py-4 text-base font-bold text-caso-white transition-all hover:border-caso-blue hover:bg-caso-navy-light sm:w-auto"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                  </svg>
                  Try Another PDF
                </button>
              </div>

              {/* CTA */}
              <div className="mt-14 rounded-2xl border border-caso-border bg-gradient-to-b from-caso-navy-light to-caso-navy p-8 text-center md:p-10">
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                  Ready to remediate your entire PDF library?
                </h3>
                <p className="mx-auto mt-3 max-w-lg text-sm text-caso-slate">
                  CASO Comply can scan your website, identify every non-compliant PDF,
                  and remediate them at scale — starting at just $0.10 per page.
                </p>
                <Link
                  href="/#scan"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-caso-blue px-8 py-4 text-base font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
                >
                  Get Your Free Site Audit
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* PDF Viewer Modal */}
      {showPdfViewer && result && (
        <PdfViewer
          downloadUrl={
            result.download_url.startsWith("http")
              ? result.download_url
              : `${API_BASE}${result.download_url}`
          }
          tagAssignments={result.tag_assignments}
          title={
            result.tag_assignments.find((t) => t.type === "H1")?.text || "Remediated PDF"
          }
          onClose={() => setShowPdfViewer(false)}
        />
      )}
    </div>
  );
}
