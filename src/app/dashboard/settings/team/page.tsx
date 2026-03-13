"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface TeamMember {
  id: string;
  user_id: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  created_at: string;
}

function roleBadgeClass(role: string): string {
  switch (role) {
    case "owner":
      return "bg-caso-green/10 text-caso-green";
    case "admin":
      return "bg-caso-blue/10 text-caso-blue";
    case "member":
      return "bg-caso-slate/20 text-caso-slate";
    case "viewer":
      return "bg-caso-slate/10 text-caso-slate/70";
    default:
      return "bg-caso-slate/10 text-caso-slate";
  }
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [currentRole, setCurrentRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Add member form
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState("member");
  const [addLoading, setAddLoading] = useState(false);

  // Remove confirmation
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  const isOwner = currentRole === "owner";
  const canManage = currentRole === "owner" || currentRole === "admin";

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/tenants/team");
      if (!res.ok) throw new Error("Failed to load team");
      const data = await res.json();
      setMembers(data.members);
      setCurrentRole(data.currentRole);
    } catch {
      setError("Failed to load team members");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!addEmail.trim()) return;

    setAddLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/tenants/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: addEmail.trim(), role: addRole }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add member");
        return;
      }

      setSuccess(`${addEmail} added as ${addRole}`);
      setAddEmail("");
      setAddRole("member");
      setTimeout(() => setSuccess(null), 4000);
      fetchMembers();
    } catch {
      setError("Failed to add member");
    } finally {
      setAddLoading(false);
    }
  }

  async function handleRemove(memberId: string) {
    setRemoveLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        `/api/tenants/team?member_id=${memberId}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to remove member");
        return;
      }

      setSuccess("Member removed");
      setTimeout(() => setSuccess(null), 4000);
      setRemovingId(null);
      fetchMembers();
    } catch {
      setError("Failed to remove member");
    } finally {
      setRemoveLoading(false);
    }
  }

  async function handleRoleChange(memberId: string, newRole: string) {
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/tenants/team/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update role");
        return;
      }

      setSuccess("Role updated");
      setTimeout(() => setSuccess(null), 4000);
      fetchMembers();
    } catch {
      setError("Failed to update role");
    }
  }

  if (loading) {
    return (
      <div className="text-caso-slate text-sm">Loading team...</div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-caso-slate">
        <Link
          href="/dashboard/settings"
          className="hover:text-caso-white transition-colors"
        >
          Settings
        </Link>
        <span>/</span>
        <span className="text-caso-white">Team</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
          Team Members
        </h1>
        <p className="mt-1 text-sm text-caso-slate">
          Manage who has access to your organization
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div
          role="alert"
          className="rounded-lg bg-caso-red/10 border border-caso-red/30 px-4 py-3 text-sm text-caso-red"
        >
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-caso-green/10 border border-caso-green/30 px-4 py-3 text-sm text-caso-green">
          {success}
        </div>
      )}

      {/* Add Member */}
      {canManage && (
        <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white mb-4">
            Add Member
          </h2>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="flex-1 rounded-lg border border-caso-border bg-caso-navy px-4 py-2.5 text-sm text-caso-white placeholder-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors"
            />
            <select
              value={addRole}
              onChange={(e) => setAddRole(e.target.value)}
              className="rounded-lg border border-caso-border bg-caso-navy px-3 py-2.5 text-sm text-caso-white focus:border-caso-blue focus:outline-none"
            >
              {isOwner && <option value="admin">Admin</option>}
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
            <button
              type="submit"
              disabled={addLoading}
              className="rounded-lg bg-caso-blue-deep px-6 py-2.5 text-sm font-semibold text-white hover:bg-caso-blue transition-colors disabled:opacity-50"
            >
              {addLoading ? "Adding..." : "Add"}
            </button>
          </form>
        </div>
      )}

      {/* Members List */}
      <div className="rounded-xl border border-caso-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-caso-border bg-caso-navy-light/50">
              <th className="px-4 py-3 text-left font-medium text-caso-slate">
                Email
              </th>
              <th className="px-4 py-3 text-left font-medium text-caso-slate">
                Role
              </th>
              <th className="px-4 py-3 text-left font-medium text-caso-slate">
                Joined
              </th>
              {canManage && (
                <th className="px-4 py-3 text-right font-medium text-caso-slate">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td
                  colSpan={canManage ? 4 : 3}
                  className="px-4 py-8 text-center text-caso-slate"
                >
                  No team members found
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-caso-border/50 hover:bg-caso-navy-light/30 transition-colors"
                >
                  <td className="px-4 py-3 text-caso-white font-medium">
                    {member.email}
                  </td>
                  <td className="px-4 py-3">
                    {isOwner && member.role !== "owner" ? (
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(member.id, e.target.value)
                        }
                        className="rounded-md border border-caso-border bg-caso-navy px-2 py-1 text-xs text-caso-white focus:border-caso-blue focus:outline-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${roleBadgeClass(member.role)}`}
                      >
                        {member.role}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-caso-slate">
                    {new Date(member.created_at).toLocaleDateString()}
                  </td>
                  {canManage && (
                    <td className="px-4 py-3 text-right">
                      {member.role !== "owner" && (
                        <>
                          {removingId === member.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-xs text-caso-slate">
                                Remove?
                              </span>
                              <button
                                onClick={() => handleRemove(member.id)}
                                disabled={removeLoading}
                                className="rounded-md bg-caso-red/10 border border-caso-red/30 px-2.5 py-1 text-xs font-medium text-caso-red hover:bg-caso-red/20 transition-colors disabled:opacity-50"
                              >
                                {removeLoading ? "..." : "Yes"}
                              </button>
                              <button
                                onClick={() => setRemovingId(null)}
                                className="rounded-md border border-caso-border px-2.5 py-1 text-xs text-caso-slate hover:text-caso-white transition-colors"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setRemovingId(member.id)}
                              className="rounded-md border border-caso-border px-2.5 py-1 text-xs text-caso-slate hover:text-caso-red hover:border-caso-red/30 transition-colors"
                              aria-label={`Remove ${member.email}`}
                            >
                              Remove
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Role legend */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-6">
        <h3 className="text-sm font-semibold text-caso-white mb-3">
          Role Permissions
        </h3>
        <div className="grid gap-2 text-xs text-caso-slate">
          <div className="flex items-start gap-2">
            <span className={`inline-flex rounded-full px-2 py-0.5 font-medium whitespace-nowrap ${roleBadgeClass("owner")}`}>
              Owner
            </span>
            <span>Full access. Can manage billing, team, and all settings.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className={`inline-flex rounded-full px-2 py-0.5 font-medium whitespace-nowrap ${roleBadgeClass("admin")}`}>
              Admin
            </span>
            <span>Can manage scans, documents, API keys, and add members.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className={`inline-flex rounded-full px-2 py-0.5 font-medium whitespace-nowrap ${roleBadgeClass("member")}`}>
              Member
            </span>
            <span>Can run scans and view documents.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className={`inline-flex rounded-full px-2 py-0.5 font-medium whitespace-nowrap ${roleBadgeClass("viewer")}`}>
              Viewer
            </span>
            <span>Read-only access to scan results and documents.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
