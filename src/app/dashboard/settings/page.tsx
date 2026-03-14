"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface TenantSettings {
  name: string;
  billing_email: string;
  brand_color: string;
  logo_url: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<TenantSettings>({
    name: "",
    billing_email: "",
    brand_color: "#2EA3F2",
    logo_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/tenants/settings");
      const data = await res.json();
      if (res.ok && data.tenant) {
        setSettings({
          name: data.tenant.name ?? "",
          billing_email: data.tenant.billing_email ?? "",
          brand_color: data.tenant.brand_color ?? "#2EA3F2",
          logo_url: data.tenant.logo_url ?? "",
        });
      }
    } catch {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/tenants/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to save settings");
      }
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (deleteText !== "DELETE") return;
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/tenants/settings", { method: "DELETE" });

      if (res.ok) {
        // Account deleted — redirect to home page
        window.location.href = "/";
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to delete account");
      }
    } catch {
      setError("Failed to delete account");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="text-caso-slate text-sm">Loading settings...</div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
        Settings
      </h1>

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-caso-red/10 border border-caso-red/30 px-4 py-3 text-sm text-caso-red"
        >
          {error}
        </div>
      )}

      {saved && (
        <div className="rounded-lg bg-caso-green/10 border border-caso-green/30 px-4 py-3 text-sm text-caso-green">
          Settings saved successfully.
        </div>
      )}

      {/* Team Link */}
      <Link
        href="/dashboard/settings/team"
        className="flex items-center justify-between rounded-xl bg-caso-navy-light border border-caso-border p-5 hover:border-caso-blue/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-caso-slate group-hover:text-caso-blue transition-colors">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <div>
            <p className="text-sm font-medium text-caso-white">Team Members</p>
            <p className="text-xs text-caso-slate">Manage who has access to your organization</p>
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-caso-slate group-hover:text-caso-blue transition-colors">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Link>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Settings */}
        <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6 space-y-5">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white">
            Organization
          </h2>

          <div>
            <label
              htmlFor="company-name"
              className="block text-sm font-medium text-caso-slate mb-1.5"
            >
              Company Name
            </label>
            <input
              id="company-name"
              type="text"
              value={settings.name}
              onChange={(e) =>
                setSettings({ ...settings, name: e.target.value })
              }
              className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white placeholder-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors"
              placeholder="Your Company"
            />
          </div>

          <div>
            <label
              htmlFor="billing-email"
              className="block text-sm font-medium text-caso-slate mb-1.5"
            >
              Billing Email
            </label>
            <input
              id="billing-email"
              type="email"
              value={settings.billing_email}
              onChange={(e) =>
                setSettings({ ...settings, billing_email: e.target.value })
              }
              className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white placeholder-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors"
              placeholder="billing@company.com"
            />
          </div>
        </div>

        {/* White-label / Branding */}
        <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6 space-y-5">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white">
            Branding
          </h2>

          <div>
            <label
              htmlFor="brand-color"
              className="block text-sm font-medium text-caso-slate mb-1.5"
            >
              Brand Color
            </label>
            <div className="flex items-center gap-3">
              <input
                id="brand-color"
                type="color"
                value={settings.brand_color}
                onChange={(e) =>
                  setSettings({ ...settings, brand_color: e.target.value })
                }
                className="w-12 h-10 rounded-lg border border-caso-border bg-caso-navy cursor-pointer"
              />
              <input
                type="text"
                value={settings.brand_color}
                onChange={(e) =>
                  setSettings({ ...settings, brand_color: e.target.value })
                }
                className="w-32 rounded-lg border border-caso-border bg-caso-navy px-3 py-2 text-caso-white font-mono text-sm focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors"
                placeholder="#2EA3F2"
              />
              <span className="text-xs text-caso-slate">
                Used in white-label reports
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="logo-url"
              className="block text-sm font-medium text-caso-slate mb-1.5"
            >
              Logo URL
            </label>
            <input
              id="logo-url"
              type="url"
              value={settings.logo_url}
              onChange={(e) =>
                setSettings({ ...settings, logo_url: e.target.value })
              }
              className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white placeholder-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors"
              placeholder="https://example.com/logo.png"
            />
            <p className="text-xs text-caso-slate mt-1">
              URL to your company logo for use in generated reports
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-caso-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-caso-blue-bright disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="rounded-xl border border-caso-red/30 p-6 space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-red">
          Danger Zone
        </h2>
        <p className="text-caso-slate text-sm">
          Permanently delete your organization and all associated data. This
          action cannot be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg border border-caso-red/50 px-4 py-2 text-sm font-medium text-caso-red hover:bg-caso-red/10 transition-colors"
          >
            Delete Account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-caso-red text-sm font-medium">
              Type &quot;DELETE&quot; to confirm:
            </p>
            <input
              type="text"
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              className="w-full rounded-lg border border-caso-red/30 bg-caso-navy px-4 py-2.5 text-caso-white placeholder-caso-slate/50 focus:border-caso-red focus:outline-none focus:ring-1 focus:ring-caso-red transition-colors"
              placeholder="DELETE"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteText("");
                }}
                className="rounded-lg border border-caso-border px-4 py-2 text-sm text-caso-slate hover:text-caso-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteText !== "DELETE" || deleting}
                className="rounded-lg bg-caso-red px-4 py-2 text-sm font-semibold text-white hover:bg-caso-red-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
