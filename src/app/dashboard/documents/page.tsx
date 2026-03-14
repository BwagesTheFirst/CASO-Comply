"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Document {
  id: string;
  filename: string;
  file_size: number;
  mime_type: string;
  status: string;
  service_level: string;
  page_count: number | null;
  score_before: number | null;
  score_after: number | null;
  grade_before: string | null;
  grade_after: string | null;
  remediated_path: string | null;
  created_at: string;
  completed_at: string | null;
}

interface Stats {
  total: number;
  queued: number;
  processing: number;
  completed: number;
  failed: number;
}

const STATUS_OPTIONS = ["all", "queued", "processing", "completed", "failed"];
const SERVICE_LEVEL_OPTIONS = ["all", "standard", "enhanced", "expert"];

function statusBadgeClass(status: string): string {
  switch (status) {
    case "queued":
      return "bg-caso-slate/10 text-caso-slate border-caso-slate/30";
    case "processing":
      return "bg-caso-blue/10 text-caso-blue border-caso-blue/30 animate-pulse";
    case "completed":
      return "bg-caso-green/10 text-caso-green border-caso-green/30";
    case "failed":
      return "bg-caso-red/10 text-caso-red border-caso-red/30";
    default:
      return "bg-caso-slate/10 text-caso-slate border-caso-slate/30";
  }
}

function serviceLevelBadgeClass(level: string): string {
  switch (level) {
    case "standard":
      return "bg-caso-slate/10 text-caso-slate";
    case "enhanced":
      return "bg-caso-blue/10 text-caso-blue";
    case "expert":
      return "bg-purple-500/10 text-purple-400";
    default:
      return "bg-caso-slate/10 text-caso-slate";
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function scoreColor(score: number | null): string {
  if (score === null) return "text-caso-slate";
  if (score >= 90) return "text-caso-green";
  if (score >= 70) return "text-caso-warm";
  return "text-caso-red";
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceLevelFilter, setServiceLevelFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [processingAll, setProcessingAll] = useState(false);
  const limit = 25;

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (serviceLevelFilter !== "all") params.set("service_level", serviceLevelFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/documents?${params}`);
      if (!res.ok) throw new Error("Failed to fetch documents");
      const data = await res.json();

      setDocuments(data.documents || []);
      setTotal(data.pagination?.total ?? data.total ?? 0);
      setTotalPages(data.pagination?.total_pages ?? Math.ceil((data.total ?? 0) / limit));

      // Build stats from all documents if not provided directly
      if (data.stats) {
        setStats(data.stats);
      }
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, serviceLevelFilter, search]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Fetch stats separately (one-time, unfiltered count)
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/documents?limit=1");
        if (!res.ok) return;
        const data = await res.json();
        // Try to compute stats from a quick all-docs query
        const allRes = await fetch("/api/documents?limit=1000");
        if (!allRes.ok) return;
        const allData = await allRes.json();
        const docs = allData.documents || [];
        setStats({
          total: allData.pagination?.total ?? docs.length,
          queued: docs.filter((d: Document) => d.status === "queued").length,
          processing: docs.filter((d: Document) => d.status === "processing").length,
          completed: docs.filter((d: Document) => d.status === "completed").length,
          failed: docs.filter((d: Document) => d.status === "failed").length,
        });
      } catch {
        // Ignore stats fetch errors
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
            Documents
          </h1>
          <p className="mt-1 text-sm text-caso-slate">
            {total} document{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          {stats && stats.queued > 0 && (
            <button
              onClick={async () => {
                setProcessingAll(true);
                try {
                  const res = await fetch("/api/documents?status=queued&limit=100");
                  if (res.ok) {
                    const data = await res.json();
                    const queued = data.documents || [];
                    for (const doc of queued) {
                      fetch(`/api/documents/${doc.id}`, { method: "POST" }).catch(() => {});
                    }
                    // Refresh after a short delay to show status change
                    setTimeout(() => {
                      fetchDocuments();
                      setProcessingAll(false);
                    }, 2000);
                  } else {
                    setProcessingAll(false);
                  }
                } catch {
                  setProcessingAll(false);
                }
              }}
              disabled={processingAll}
              className="rounded-lg border border-caso-blue/50 bg-caso-blue/10 px-4 py-2 text-sm font-medium text-caso-blue hover:bg-caso-blue/20 transition-colors disabled:opacity-40"
            >
              {processingAll ? "Starting..." : `Process ${stats.queued} Queued`}
            </button>
          )}
          <Link
            href="/dashboard/remediate"
            className="rounded-lg bg-caso-blue-deep px-4 py-2 text-sm font-medium text-caso-white hover:bg-caso-blue transition-colors"
          >
            + Upload Documents
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && stats.total > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Queued" value={stats.queued} className="text-caso-slate" />
          <StatCard label="Processing" value={stats.processing} className="text-caso-blue" />
          <StatCard label="Completed" value={stats.completed} className="text-caso-green" />
          <StatCard label="Failed" value={stats.failed} className="text-caso-red" />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search filenames..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-caso-border bg-caso-navy px-3 py-2 text-sm text-caso-white placeholder:text-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-caso-border bg-caso-navy px-3 py-2 text-sm text-caso-white focus:border-caso-blue focus:outline-none"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={serviceLevelFilter}
          onChange={(e) => {
            setServiceLevelFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-caso-border bg-caso-navy px-3 py-2 text-sm text-caso-white focus:border-caso-blue focus:outline-none"
        >
          {SERVICE_LEVEL_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All Levels" : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-caso-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-caso-border bg-caso-navy-light/50">
              <th className="px-4 py-3 text-left font-medium text-caso-slate">Filename</th>
              <th className="px-4 py-3 text-left font-medium text-caso-slate">Service Level</th>
              <th className="px-4 py-3 text-left font-medium text-caso-slate">Status</th>
              <th className="px-4 py-3 text-left font-medium text-caso-slate">Score</th>
              <th className="px-4 py-3 text-left font-medium text-caso-slate">Pages</th>
              <th className="px-4 py-3 text-left font-medium text-caso-slate">Date</th>
              <th className="px-4 py-3 text-left font-medium text-caso-slate">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-caso-slate">
                  Loading...
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="text-caso-slate">
                    No documents yet. Upload your first document to get started.
                  </p>
                  <Link
                    href="/dashboard/remediate"
                    className="mt-3 inline-block text-sm text-caso-blue hover:underline"
                  >
                    Upload Documents
                  </Link>
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b border-caso-border/50 hover:bg-caso-navy-light/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/documents/${doc.id}`}
                      className="font-medium text-caso-white hover:text-caso-blue transition-colors"
                    >
                      {doc.filename}
                    </Link>
                    <div className="text-xs text-caso-slate">{formatFileSize(doc.file_size)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${serviceLevelBadgeClass(doc.service_level)}`}
                    >
                      {doc.service_level}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusBadgeClass(doc.status)}`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {doc.score_before !== null || doc.score_after !== null ? (
                      <span className="text-xs">
                        <span className={scoreColor(doc.score_before)}>
                          {doc.score_before !== null ? `${doc.score_before}%` : "--"}
                        </span>
                        <span className="text-caso-slate mx-1">→</span>
                        <span className={scoreColor(doc.score_after)}>
                          {doc.score_after !== null ? `${doc.score_after}%` : "--"}
                        </span>
                      </span>
                    ) : (
                      <span className="text-xs text-caso-slate">--</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-caso-slate">
                    {doc.page_count ?? "--"}
                  </td>
                  <td className="px-4 py-3 text-caso-slate">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/documents/${doc.id}`}
                        className="rounded-lg border border-caso-border px-2.5 py-1 text-xs text-caso-slate hover:text-caso-white hover:border-caso-blue transition-colors"
                      >
                        View
                      </Link>
                      {doc.status === "completed" && doc.remediated_path && (
                        <a
                          href={`/api/documents/${doc.id}/download?type=remediated`}
                          className="rounded-lg border border-caso-border px-2.5 py-1 text-xs text-caso-slate hover:text-caso-green hover:border-caso-green transition-colors"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-caso-slate">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-lg border border-caso-border px-3 py-1.5 text-sm text-caso-slate hover:text-caso-white disabled:opacity-30"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-caso-border px-3 py-1.5 text-sm text-caso-slate hover:text-caso-white disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  className = "",
}: {
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-4">
      <p className="text-xs font-medium text-caso-slate">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${className || "text-caso-white"}`}>
        {value}
      </p>
    </div>
  );
}
