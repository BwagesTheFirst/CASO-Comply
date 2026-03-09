"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Membership {
  tenant_id: string;
  tenant_name: string;
  role: string;
}

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_super_admin: boolean;
  memberships: Membership[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 20;
  const totalPages = Math.ceil(total / perPage);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        setTotal(data.total);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
          Users
        </h1>
        <Link
          href="/dashboard/admin"
          className="text-sm text-caso-blue hover:text-caso-blue-bright transition-colors"
        >
          &larr; Back to Admin
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-caso-red/10 border border-caso-red/30 px-4 py-3 text-sm text-caso-red"
        >
          {error}
        </div>
      )}

      <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-caso-slate text-sm">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-caso-slate text-sm">No users found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-caso-border text-left">
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Email
                    </th>
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Role
                    </th>
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Super Admin
                    </th>
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Last Sign In
                    </th>
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-caso-border/50 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-3 text-caso-white font-medium">
                        {user.email}
                      </td>
                      <td className="px-6 py-3 text-caso-slate">
                        {user.memberships.length > 0
                          ? user.memberships
                              .map((m) => m.tenant_name)
                              .join(", ")
                          : "None"}
                      </td>
                      <td className="px-6 py-3">
                        {user.memberships.length > 0 ? (
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.memberships[0].role === "owner"
                                ? "bg-caso-blue/10 text-caso-blue"
                                : user.memberships[0].role === "admin"
                                  ? "bg-caso-warm/10 text-caso-warm"
                                  : "bg-caso-slate/10 text-caso-slate"
                            }`}
                          >
                            {user.memberships[0].role}
                          </span>
                        ) : (
                          <span className="text-caso-slate">---</span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        {user.is_super_admin && (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-caso-red/10 text-caso-red">
                            Super Admin
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-caso-slate">
                        {user.last_sign_in_at
                          ? new Date(
                              user.last_sign_in_at
                            ).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-6 py-3 text-caso-slate">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-caso-border flex items-center justify-between">
                <p className="text-sm text-caso-slate">
                  Page {page} of {totalPages} ({total} total users)
                </p>
                <div className="flex gap-2">
                  {page > 1 && (
                    <button
                      onClick={() => setPage(page - 1)}
                      className="rounded-lg border border-caso-border px-3 py-1.5 text-sm text-caso-slate hover:text-caso-white hover:bg-white/5 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  {page < totalPages && (
                    <button
                      onClick={() => setPage(page + 1)}
                      className="rounded-lg border border-caso-border px-3 py-1.5 text-sm text-caso-slate hover:text-caso-white hover:bg-white/5 transition-colors"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
