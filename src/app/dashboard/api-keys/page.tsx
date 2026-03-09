"use client";

import { useState, useEffect, useCallback } from "react";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    try {
      const res = await fetch("/api/tenants/api-keys");
      const data = await res.json();
      if (res.ok) {
        setKeys(data.keys);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/tenants/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });
      const data = await res.json();

      if (res.ok) {
        setCreatedKey(data.rawKey);
        setNewKeyName("");
        fetchKeys();
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to create API key");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(keyId: string) {
    if (!confirm("Are you sure you want to revoke this API key? This cannot be undone.")) {
      return;
    }

    setRevoking(keyId);
    try {
      const res = await fetch(`/api/tenants/api-keys?id=${keyId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchKeys();
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch {
      setError("Failed to revoke key");
    } finally {
      setRevoking(null);
    }
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
          API Keys
        </h1>
        <button
          onClick={() => {
            setShowCreateModal(true);
            setCreatedKey(null);
          }}
          className="rounded-lg bg-caso-blue px-4 py-2 text-sm font-semibold text-white hover:bg-caso-blue-bright transition-colors"
        >
          Create New Key
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-caso-red/10 border border-caso-red/30 px-4 py-3 text-sm text-caso-red"
        >
          {error}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl bg-caso-navy-light border border-caso-border p-6 mx-4">
            {createdKey ? (
              <>
                <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-4">
                  API Key Created
                </h2>
                <div className="rounded-lg bg-caso-warm/10 border border-caso-warm/30 px-4 py-3 mb-4">
                  <p className="text-caso-warm text-sm font-medium mb-1">
                    Save this key now — you will not see it again.
                  </p>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <code className="flex-1 rounded-lg bg-caso-navy border border-caso-border px-3 py-2 text-sm text-caso-green font-mono break-all">
                    {createdKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(createdKey)}
                    className="shrink-0 rounded-lg bg-caso-blue/10 border border-caso-blue/20 px-3 py-2 text-sm text-caso-blue hover:bg-caso-blue/20 transition-colors"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreatedKey(null);
                  }}
                  className="w-full rounded-lg bg-caso-blue px-4 py-2 text-sm font-semibold text-white hover:bg-caso-blue-bright transition-colors"
                >
                  Done
                </button>
              </>
            ) : (
              <form onSubmit={handleCreate}>
                <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-4">
                  Create API Key
                </h2>
                <label
                  htmlFor="key-name"
                  className="block text-sm font-medium text-caso-slate mb-1.5"
                >
                  Key Name
                </label>
                <input
                  id="key-name"
                  type="text"
                  required
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production, Staging"
                  className="w-full rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-caso-white placeholder-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors mb-6"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 rounded-lg border border-caso-border px-4 py-2 text-sm font-medium text-caso-slate hover:text-caso-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 rounded-lg bg-caso-blue px-4 py-2 text-sm font-semibold text-white hover:bg-caso-blue-bright disabled:opacity-50 transition-colors"
                  >
                    {creating ? "Creating..." : "Create Key"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Keys Table */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-caso-slate text-sm">
            Loading API keys...
          </div>
        ) : keys.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-caso-slate text-sm">No API keys yet.</p>
            <p className="text-caso-slate/60 text-xs mt-1">
              Create a key to start using the CASO Comply API.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-caso-border text-left">
                  <th className="px-6 py-3 text-caso-slate font-medium">Name</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Key</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Created</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Last Used</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Status</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => (
                  <tr
                    key={key.id}
                    className="border-b border-caso-border/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3 text-caso-white font-medium">
                      {key.name}
                    </td>
                    <td className="px-6 py-3">
                      <code className="text-caso-slate font-mono text-xs">
                        {key.prefix}...
                      </code>
                    </td>
                    <td className="px-6 py-3 text-caso-slate">
                      {new Date(key.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-caso-slate">
                      {key.last_used_at
                        ? new Date(key.last_used_at).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          key.is_active
                            ? "bg-caso-green/10 text-caso-green"
                            : "bg-caso-red/10 text-caso-red"
                        }`}
                      >
                        {key.is_active ? "Active" : "Revoked"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {key.is_active && (
                        <button
                          onClick={() => handleRevoke(key.id)}
                          disabled={revoking === key.id}
                          className="text-caso-red/70 hover:text-caso-red text-sm transition-colors disabled:opacity-50"
                        >
                          {revoking === key.id ? "Revoking..." : "Revoke"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
