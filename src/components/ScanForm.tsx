"use client";

import { useState, type FormEvent } from "react";

interface ScanFormProps {
  variant?: "hero" | "footer";
}

export default function ScanForm({ variant = "hero" }: ScanFormProps) {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsSubmitting(true);
    // TODO: Connect to scan API
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  const inputId = `scan-url-${variant}`;

  if (variant === "footer") {
    return (
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
            className="flex-1 rounded-xl bg-transparent px-5 py-4 text-base text-caso-white placeholder:text-caso-slate focus:outline-none"
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
    );
  }

  return (
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
            className="w-full bg-transparent py-3 text-base text-caso-white placeholder:text-caso-slate focus:outline-none sm:text-lg"
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
      <p className="mt-4 text-sm text-caso-slate">
        Free audit — no credit card, no sales call. Results in under 5 minutes.
      </p>
    </form>
  );
}
