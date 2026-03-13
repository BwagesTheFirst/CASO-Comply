"use client";

import { useState, type FormEvent } from "react";

const HELP_OPTIONS = [
  "PDF Remediation",
  "Free Compliance Scan",
  "Enterprise/Volume Pricing",
  "Partnership Inquiry",
  "Other",
];

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      organization: formData.get("organization") as string,
      helpWith: formData.get("helpWith") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Something went wrong. Please try again.");
      }

      setIsSuccess(true);
      form.reset();
    } catch {
      setError("Something went wrong. Please try again or contact us directly at sales@casocomply.com.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-caso-green/30 bg-caso-green/10 p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-caso-green"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-bold text-caso-white">
          Message Sent
        </h3>
        <p className="mt-2 text-caso-slate">
          Thank you for reaching out. Our team will get back to you within one
          business day.
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="mt-6 rounded-xl border border-caso-border px-6 py-2.5 text-sm font-bold text-caso-white transition-all hover:bg-caso-navy-light"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-sm font-medium text-caso-slate"
          >
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            required
            autoComplete="name"
            className="w-full rounded-xl border border-caso-border bg-caso-navy-light px-4 py-3 text-sm text-caso-white placeholder:text-caso-slate/50 focus:outline-none focus:ring-2 focus:ring-caso-blue focus:border-caso-blue transition-colors"
            placeholder="Your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block text-sm font-medium text-caso-slate"
          >
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-caso-border bg-caso-navy-light px-4 py-3 text-sm text-caso-white placeholder:text-caso-slate/50 focus:outline-none focus:ring-2 focus:ring-caso-blue focus:border-caso-blue transition-colors"
            placeholder="you@organization.gov"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="contact-phone"
            className="mb-2 block text-sm font-medium text-caso-slate"
          >
            Phone
          </label>
          <input
            type="tel"
            id="contact-phone"
            name="phone"
            autoComplete="tel"
            className="w-full rounded-xl border border-caso-border bg-caso-navy-light px-4 py-3 text-sm text-caso-white placeholder:text-caso-slate/50 focus:outline-none focus:ring-2 focus:ring-caso-blue focus:border-caso-blue transition-colors"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Organization */}
        <div>
          <label
            htmlFor="contact-organization"
            className="mb-2 block text-sm font-medium text-caso-slate"
          >
            Organization <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="contact-organization"
            name="organization"
            required
            autoComplete="organization"
            className="w-full rounded-xl border border-caso-border bg-caso-navy-light px-4 py-3 text-sm text-caso-white placeholder:text-caso-slate/50 focus:outline-none focus:ring-2 focus:ring-caso-blue focus:border-caso-blue transition-colors"
            placeholder="Your organization name"
          />
        </div>
      </div>

      {/* Help With */}
      <div className="mt-6">
        <label
          htmlFor="contact-help-with"
          className="mb-2 block text-sm font-medium text-caso-slate"
        >
          What can we help you with? <span className="text-red-400">*</span>
        </label>
        <select
          id="contact-help-with"
          name="helpWith"
          required
          defaultValue=""
          className="w-full rounded-xl border border-caso-border bg-caso-navy-light px-4 py-3 text-sm text-caso-white focus:outline-none focus:ring-2 focus:ring-caso-blue focus:border-caso-blue transition-colors appearance-none"
        >
          <option value="" disabled className="text-caso-slate">
            Select a topic
          </option>
          {HELP_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div className="mt-6">
        <label
          htmlFor="contact-message"
          className="mb-2 block text-sm font-medium text-caso-slate"
        >
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="w-full rounded-xl border border-caso-border bg-caso-navy-light px-4 py-3 text-sm text-caso-white placeholder:text-caso-slate/50 focus:outline-none focus:ring-2 focus:ring-caso-blue focus:border-caso-blue transition-colors resize-y"
          placeholder="Tell us about your accessibility needs, the number of documents you need remediated, or any questions you have."
        />
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex rounded-xl bg-caso-blue px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}
