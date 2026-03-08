"use client";

import { useState, type FormEvent } from "react";

interface ScanFormProps {
  variant?: "hero" | "footer";
}

interface SamplePdf {
  url: string;
  filename: string;
  score: number;
  grade: string;
  issues: string[];
  pageCount: number;
}

interface ScanResult {
  scanId: string | null;
  url: string;
  pdfCount: number;
  samplePdf: SamplePdf | null;
}

const GRADE_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  A: { bg: "bg-caso-green/10", text: "text-caso-green", ring: "border-caso-green" },
  B: { bg: "bg-caso-blue/10", text: "text-caso-blue", ring: "border-caso-blue" },
  C: { bg: "bg-yellow-500/10", text: "text-yellow-400", ring: "border-yellow-500" },
  F: { bg: "bg-caso-red/10", text: "text-caso-red", ring: "border-caso-red" },
};

const SCANNING_MESSAGES = [
  "Connecting to site...",
  "Crawling pages for PDFs...",
  "Found some documents...",
  "Analyzing accessibility...",
  "Scoring document structure...",
  "Almost done...",
];

export default function ScanForm({ variant = "hero" }: ScanFormProps) {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Email capture state
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailSubmitting, setEmailSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setResult(null);
    setShowEmailForm(false);
    setEmailSubmitted(false);

    // Cycle through scanning messages
    let messageIndex = 0;
    setScanMessage(SCANNING_MESSAGES[0]);
    const messageInterval = setInterval(() => {
      messageIndex = Math.min(messageIndex + 1, SCANNING_MESSAGES.length - 1);
      setScanMessage(SCANNING_MESSAGES[messageIndex]);
    }, 3000);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      if (data.pdfCount === 0) {
        setError("No PDFs found on that site. Try a different URL or check the address.");
        return;
      }

      setResult(data);
    } catch {
      setError("Couldn't connect to the scanning service. Please try again.");
    } finally {
      clearInterval(messageInterval);
      setIsSubmitting(false);
      setScanMessage("");
    }
  };

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !result?.scanId) return;

    setEmailSubmitting(true);
    try {
      await fetch("/api/scan/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), scanId: result.scanId }),
      });
      setEmailSubmitted(true);
    } catch {
      // Still show success — we don't want to block the UX
      setEmailSubmitted(true);
    } finally {
      setEmailSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setUrl("");
    setShowEmailForm(false);
    setEmailSubmitted(false);
  };

  const inputId = `scan-url-${variant}`;

  // -- Results Card (shared by both variants) --
  const ResultsCard = () => {
    if (!result?.samplePdf) return null;

    const { samplePdf, pdfCount, url: scannedUrl } = result;
    const colors = GRADE_COLORS[samplePdf.grade] || GRADE_COLORS.F;
    const domain = (() => {
      try { return new URL(scannedUrl).hostname; } catch { return scannedUrl; }
    })();

    return (
      <div className="mt-6 overflow-hidden rounded-2xl border border-caso-border bg-caso-navy-light">
        {/* Header */}
        <div className="border-b border-caso-border/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-caso-glacier">Scan Complete</p>
              <p className="mt-0.5 text-lg font-bold text-caso-white">
                We found <span className="text-caso-blue">{pdfCount} PDF{pdfCount !== 1 ? "s" : ""}</span> on {domain}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-caso-slate transition-colors hover:bg-caso-navy hover:text-caso-white"
            >
              Scan another
            </button>
          </div>
        </div>

        {/* Sample PDF result */}
        <div className="px-6 py-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-caso-slate">
            Sample analysis
          </p>
          <div className="flex gap-5">
            {/* Score ring */}
            <div className="flex shrink-0 flex-col items-center">
              <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 ${colors.ring} ${colors.bg}`}>
                <div className="text-center">
                  <div className={`font-[family-name:var(--font-display)] text-2xl font-black ${colors.text}`}>
                    {samplePdf.grade}
                  </div>
                  <div className={`text-xs font-bold ${colors.text} opacity-70`}>
                    {samplePdf.score}/100
                  </div>
                </div>
              </div>
              <p className="mt-2 max-w-[100px] truncate text-center text-xs text-caso-slate" title={samplePdf.filename}>
                {samplePdf.filename}
              </p>
            </div>

            {/* Issues */}
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-sm font-semibold text-caso-white">
                {samplePdf.issues.length > 0 ? "Issues found:" : "No critical issues"}
              </p>
              <ul className="space-y-1.5">
                {samplePdf.issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-caso-red/80">
                    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
              {pdfCount > 1 && (
                <p className="mt-3 text-xs text-caso-slate">
                  + {pdfCount - 1} more PDF{pdfCount - 1 !== 1 ? "s" : ""} need analysis
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Email capture / CTA */}
        <div className="border-t border-caso-border/50 bg-caso-navy/50 px-6 py-4">
          {emailSubmitted ? (
            <div className="flex items-center gap-2 text-sm text-caso-green">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold">Report requested! We&apos;ll send the full analysis to {email}</span>
            </div>
          ) : showEmailForm ? (
            <form onSubmit={handleEmailSubmit} className="flex gap-3">
              <label htmlFor={`email-${variant}`} className="sr-only">Your email address</label>
              <input
                id={`email-${variant}`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@organization.gov"
                required
                className="flex-1 rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-sm text-caso-white placeholder:text-caso-slate focus:border-caso-blue focus:outline-none"
              />
              <button
                type="submit"
                disabled={emailSubmitting}
                className="whitespace-nowrap rounded-lg bg-caso-blue px-5 py-2.5 text-sm font-bold text-caso-white transition-all hover:bg-caso-blue-bright disabled:opacity-60"
              >
                {emailSubmitting ? "Sending..." : "Send Report"}
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowEmailForm(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-caso-blue px-6 py-3 text-sm font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Send Full Report for All {pdfCount} PDFs
            </button>
          )}
        </div>
      </div>
    );
  };

  // -- Error display --
  const ErrorDisplay = () => {
    if (!error) return null;
    return (
      <div className="mt-6 rounded-xl border border-caso-red-dark/30 bg-caso-red-dark/10 px-5 py-4">
        <div className="flex items-start gap-3">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-caso-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-caso-red">{error}</p>
            <button
              onClick={handleReset}
              className="mt-2 text-sm font-medium text-caso-slate underline decoration-caso-slate/30 underline-offset-2 hover:text-caso-white"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  };

  // -- Footer variant --
  if (variant === "footer") {
    return (
      <div>
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row"
          aria-label="Website accessibility scan"
        >
          <label htmlFor={inputId} className="sr-only">
            Website URL to scan
          </label>
          <div className="scan-input-glow flex flex-1 rounded-xl border-2 border-caso-border bg-caso-navy-light">
            <input
              id={inputId}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your website URL..."
              required
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-transparent px-5 py-4 text-base text-caso-white placeholder:text-caso-slate focus:outline-none disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-caso-blue px-8 py-4 font-[family-name:var(--font-display)] text-base font-bold text-caso-white transition-all hover:bg-caso-blue-bright focus-visible:outline-offset-4 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Scanning...
              </>
            ) : (
              "Get Free Report"
            )}
          </button>
        </form>
        {isSubmitting && scanMessage && (
          <p className="mt-3 text-center text-sm text-caso-slate animate-pulse">{scanMessage}</p>
        )}
        <ErrorDisplay />
        <ResultsCard />
      </div>
    );
  }

  // -- Hero variant --
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl"
        aria-label="Website accessibility scan"
      >
        <label htmlFor={inputId} className="sr-only">
          Website URL to scan
        </label>
        <div className="scan-input-glow flex flex-col gap-3 rounded-2xl border-2 border-caso-border bg-caso-navy-light p-2 sm:flex-row sm:items-center sm:p-2">
          <div className="flex flex-1 items-center gap-3 px-3">
            <svg
              className="hidden h-5 w-5 shrink-0 text-caso-slate sm:block"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            <input
              id={inputId}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your website URL..."
              required
              disabled={isSubmitting}
              className="w-full bg-transparent py-3 text-base text-caso-white placeholder:text-caso-slate focus:outline-none disabled:opacity-60 sm:text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-caso-blue px-8 py-4 font-[family-name:var(--font-display)] text-base font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25 focus-visible:outline-offset-4 disabled:opacity-60 sm:text-lg"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Scanning...
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                Scan My Site
              </>
            )}
          </button>
        </div>
        {!isSubmitting && !result && !error && (
          <p className="mt-4 text-sm text-caso-slate">
            Free audit — no credit card, no sales call. Results in under 60 seconds.
          </p>
        )}
      </form>
      {isSubmitting && scanMessage && (
        <p className="mt-4 text-center text-sm text-caso-slate animate-pulse">{scanMessage}</p>
      )}
      <ErrorDisplay />
      <ResultsCard />
    </div>
  );
}
