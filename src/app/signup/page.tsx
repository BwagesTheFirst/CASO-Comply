"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name: companyName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Provision the tenant
    if (data.user) {
      try {
        const res = await fetch("/api/tenants/provision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyName }),
        });

        if (!res.ok) {
          const body = await res.json();
          console.error("Tenant provisioning failed:", body);
          // Don't block signup — tenant can be provisioned later
        } else {
          const body = await res.json();
          if (body.apiKey) {
            setApiKey(body.apiKey);
          }
        }
      } catch (err) {
        console.error("Tenant provisioning error:", err);
      }
    }

    setSuccess(true);
    setLoading(false);
  }

  async function handleCopyKey() {
    if (!apiKey) return;
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select the text in the code block
      const el = document.getElementById("api-key-display");
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-caso-navy flex items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          <div className="bg-caso-navy-light border border-caso-border rounded-xl p-8 shadow-lg">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-caso-green/10 p-3">
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white mb-2">
              Account created
            </h2>
            <p className="text-caso-slate text-sm mb-6">
              Follow these steps to get started.
            </p>

            {/* Sequential steps */}
            <ol className="text-left space-y-4 mb-6">
              {/* Step 1: Save API key */}
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-caso-blue/20 text-caso-blue text-xs font-bold">
                  1
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-caso-white">
                    Save your license key
                  </p>
                  {apiKey ? (
                    <div className="mt-2 rounded-lg border border-caso-yellow/30 bg-caso-yellow/5 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="h-4 w-4 text-caso-yellow flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-xs font-semibold text-caso-yellow">
                          Copy this now — you will not see it again
                        </p>
                      </div>
                      <div className="relative">
                        <code
                          id="api-key-display"
                          className="block w-full rounded-md bg-caso-navy border border-caso-border px-3 py-2.5 pr-20 text-sm text-caso-white font-mono break-all select-all"
                        >
                          {apiKey}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyKey}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-caso-border/50 px-3 py-1 text-xs font-medium text-caso-slate hover:text-caso-white hover:bg-caso-border transition-colors"
                        >
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-caso-slate text-xs mt-1">
                      You can find your key later on the API Keys page in your
                      dashboard.
                    </p>
                  )}
                </div>
              </li>

              {/* Step 2: Verify email */}
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-caso-blue/20 text-caso-blue text-xs font-bold">
                  2
                </span>
                <div>
                  <p className="text-sm font-medium text-caso-white">
                    Check your email for a verification link
                  </p>
                  <p className="text-caso-slate text-xs mt-1">
                    We sent a confirmation link to{" "}
                    <span className="text-caso-white font-medium">{email}</span>.
                    Click it to activate your account.
                  </p>
                </div>
              </li>

              {/* Step 3: Log in */}
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-caso-blue/20 text-caso-blue text-xs font-bold">
                  3
                </span>
                <div>
                  <p className="text-sm font-medium text-caso-white">
                    Log in to your dashboard
                  </p>
                  <p className="text-caso-slate text-xs mt-1">
                    After verifying your email, sign in to access your dashboard
                    and API keys.
                  </p>
                </div>
              </li>

              {/* Step 4: Set up agent */}
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-caso-blue/20 text-caso-blue text-xs font-bold">
                  4
                </span>
                <div>
                  <p className="text-sm font-medium text-caso-white">
                    Set up your Docker agent
                  </p>
                  <p className="text-caso-slate text-xs mt-1">
                    Follow the Getting Started guide in your dashboard to
                    install and configure the CASO Comply agent.
                  </p>
                </div>
              </li>
            </ol>

            <Link
              href="/login"
              className="inline-block rounded-lg bg-caso-blue-deep px-6 py-2.5 text-sm font-semibold text-white hover:bg-caso-blue transition-colors"
            >
              Go to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-caso-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-caso-white">
              CASO <span className="text-caso-blue">Comply</span>
            </h1>
          </Link>
          <p className="text-caso-slate mt-2 text-sm">
            Create your account
          </p>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSignup}
          className="bg-caso-navy-light border border-caso-border rounded-xl p-8 shadow-lg"
        >
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg bg-caso-red/10 border border-caso-red/30 px-4 py-3 text-sm text-caso-red"
            >
              {error}
            </div>
          )}

          <div className="mb-5">
            <label
              htmlFor="company-name"
              className="block text-sm font-medium text-caso-slate mb-1.5"
            >
              Company name
            </label>
            <input
              id="company-name"
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white placeholder-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors"
              placeholder="Acme Corp"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-caso-slate mb-1.5"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white placeholder-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors"
              placeholder="you@company.com"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-caso-slate mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white placeholder-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors"
              placeholder="At least 8 characters"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-caso-slate mb-1.5"
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white placeholder-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-caso-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-caso-blue-bright disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-caso-blue focus:ring-offset-2 focus:ring-offset-caso-navy-light"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-caso-slate">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-caso-blue hover:text-caso-blue-bright transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
