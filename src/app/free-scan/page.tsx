"use client";

import { useState, type FormEvent } from "react";

const DOCUMENT_COUNT_OPTIONS = [
  "Less than 100",
  "100-500",
  "500-2,000",
  "More than 2,000",
];

const INDUSTRY_OPTIONS = [
  "Government",
  "Higher Education",
  "Healthcare",
  "Financial Services",
  "Other",
];

const TRUST_SIGNALS = [
  {
    icon: (
      <svg
        className="h-6 w-6 text-caso-green"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: "SOC 2 Type II Certified",
    description: "Enterprise-grade security and data protection.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-caso-green"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    title: "HIPAA Compliant",
    description: "Safe handling of sensitive documents.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-caso-green"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
    title: "No Credit Card Required",
    description: "Completely free — no strings attached.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-caso-green"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Report in 2 Business Days",
    description:
      "We deliver a full compliance report quickly so you can take action.",
  },
];

export default function FreeScanPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [orgName, setOrgName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [documentCount, setDocumentCount] = useState("");
  const [industry, setIndustry] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/free-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgName,
          websiteUrl,
          contactName,
          email,
          phone: phone || undefined,
          documentCount,
          industry,
        }),
      });

      if (!res.ok) {
        throw new Error("Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="px-6 pb-8 pt-16 md:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Get a{" "}
            <span className="bg-gradient-to-r from-caso-blue to-caso-teal bg-clip-text text-transparent">
              Free Compliance Scan
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-caso-slate md:text-xl">
            We&apos;ll crawl your website, identify every document, and deliver
            a comprehensive compliance summary showing exactly what needs to be
            fixed.
          </p>
        </div>
      </section>

      {/* Form + Trust Signals */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="rounded-2xl border border-caso-green/30 bg-caso-green/10 p-8 text-center md:p-12">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-caso-green/20">
                  <svg
                    className="h-8 w-8 text-caso-green"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold md:text-3xl">
                  Request Received
                </h2>
                <p className="mt-4 text-lg text-caso-slate">
                  Thank you &mdash; we&apos;ll deliver your compliance report
                  within 2 business days.
                </p>
                <p className="mt-2 text-caso-slate">
                  Keep an eye on your inbox at{" "}
                  <span className="font-medium text-caso-white">{email}</span>.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-caso-border bg-caso-navy-light p-6 md:p-8"
                noValidate
              >
                <h2 className="font-[family-name:var(--font-display)] text-xl font-bold md:text-2xl">
                  Request Your Free Scan
                </h2>
                <p className="mt-2 text-sm text-caso-slate">
                  Tell us about your organization and we&apos;ll get started.
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  {/* Organization Name */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="orgName"
                      className="mb-1.5 block text-sm font-medium text-caso-slate"
                    >
                      Organization Name{" "}
                      <span className="text-red-400" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <input
                      id="orgName"
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="City of Springfield"
                      className="w-full rounded-xl border border-caso-border bg-caso-navy px-4 py-3 text-caso-white placeholder:text-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-2 focus:ring-caso-blue/40"
                    />
                  </div>

                  {/* Website URL */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="websiteUrl"
                      className="mb-1.5 block text-sm font-medium text-caso-slate"
                    >
                      Website URL{" "}
                      <span className="text-red-400" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <input
                      id="websiteUrl"
                      type="url"
                      required
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://www.springfield.gov"
                      className="w-full rounded-xl border border-caso-border bg-caso-navy px-4 py-3 text-caso-white placeholder:text-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-2 focus:ring-caso-blue/40"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="contactName"
                      className="mb-1.5 block text-sm font-medium text-caso-slate"
                    >
                      Your Name{" "}
                      <span className="text-red-400" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <input
                      id="contactName"
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full rounded-xl border border-caso-border bg-caso-navy px-4 py-3 text-caso-white placeholder:text-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-2 focus:ring-caso-blue/40"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-caso-slate"
                    >
                      Email{" "}
                      <span className="text-red-400" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@springfield.gov"
                      className="w-full rounded-xl border border-caso-border bg-caso-navy px-4 py-3 text-caso-white placeholder:text-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-2 focus:ring-caso-blue/40"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1.5 block text-sm font-medium text-caso-slate"
                    >
                      Phone{" "}
                      <span className="text-caso-slate">(optional)</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full rounded-xl border border-caso-border bg-caso-navy px-4 py-3 text-caso-white placeholder:text-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-2 focus:ring-caso-blue/40"
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label
                      htmlFor="industry"
                      className="mb-1.5 block text-sm font-medium text-caso-slate"
                    >
                      Industry{" "}
                      <span className="text-red-400" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <select
                      id="industry"
                      required
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-caso-border bg-caso-navy px-4 py-3 text-caso-white focus:border-caso-blue focus:outline-none focus:ring-2 focus:ring-caso-blue/40"
                    >
                      <option value="" disabled>
                        Select your industry
                      </option>
                      {INDUSTRY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Document Count */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="documentCount"
                      className="mb-1.5 block text-sm font-medium text-caso-slate"
                    >
                      How many documents do you estimate are on your website?{" "}
                      <span className="text-red-400" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <select
                      id="documentCount"
                      required
                      value={documentCount}
                      onChange={(e) => setDocumentCount(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-caso-border bg-caso-navy px-4 py-3 text-caso-white focus:border-caso-blue focus:outline-none focus:ring-2 focus:ring-caso-blue/40"
                    >
                      <option value="" disabled>
                        Select an estimate
                      </option>
                      {DOCUMENT_COUNT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-8 w-full rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25 disabled:cursor-not-allowed disabled:bg-caso-blue/40 disabled:text-caso-white/70"
                >
                  {submitting ? "Submitting..." : "Request Free Scan"}
                </button>

                <p className="mt-4 text-center text-xs text-caso-slate">
                  By submitting, you agree to our{" "}
                  <a
                    href="/legal/privacy"
                    className="underline hover:text-caso-white"
                  >
                    Privacy Policy
                  </a>
                  . We&apos;ll never share your information.
                </p>
              </form>
            )}
          </div>

          {/* Trust Signals */}
          <aside className="lg:col-span-2" aria-label="Trust signals">
            <div className="sticky top-28 space-y-6">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-glacier">
                Why request a scan?
              </h3>
              <p className="text-sm leading-relaxed text-caso-slate">
                Our compliance scan gives you a clear picture of every document
                on your website and how it measures up against WCAG 2.1 AA,
                PDF/UA, and Section 508 standards.
              </p>

              <div className="space-y-5 pt-2">
                {TRUST_SIGNALS.map((signal) => (
                  <div key={signal.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-caso-border bg-caso-navy">
                      {signal.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-caso-white">
                        {signal.title}
                      </h4>
                      <p className="mt-0.5 text-sm text-caso-slate">
                        {signal.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Deadline callout */}
              <div className="mt-4 rounded-2xl border border-caso-border bg-caso-navy p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-caso-glacier">
                  ADA Title II Deadline
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold">
                  April 24, 2026
                </p>
                <p className="mt-1 text-sm text-caso-slate">
                  State and local governments with populations of 50,000+ must
                  comply by this date. Don&apos;t wait until it&apos;s too late.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
