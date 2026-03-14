"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface BatchDocument {
  id: string;
  filename: string;
  file_size: number;
  status: string;
  page_count: number | null;
  score_before: number | null;
  score_after: number | null;
  remediated_path: string | null;
  created_at: string;
  completed_at: string | null;
}

interface Batch {
  id: string;
  name: string;
  service_level: string;
  status: string;
  total_files: number;
  total_pages: number | null;
  estimated_cost: number | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

interface BatchResponse {
  batch: Batch;
  documents: BatchDocument[];
  stats: {
    total: number;
    queued: number;
    processing: number;
    completed: number;
    failed: number;
    total_pages: number;
  };
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case "queued":
    case "pending":
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
      return "bg-caso-slate/10 text-caso-slate border-caso-slate/30";
    case "enhanced":
      return "bg-caso-blue/10 text-caso-blue border-caso-blue/30";
    case "expert":
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    default:
      return "bg-caso-slate/10 text-caso-slate border-caso-slate/30";
  }
}

function scoreColor(score: number | null): string {
  if (score === null) return "text-caso-slate";
  if (score >= 90) return "text-caso-green";
  if (score >= 70) return "text-caso-warm";
  return "text-caso-red";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function BatchDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<BatchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBatch = useCallback(async () => {
    try {
      const res = await fetch(`/api/documents/batch/${id}`);
      if (!res.ok) throw new Error("Failed to fetch batch");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError("Failed to load batch details");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBatch();
  }, [fetchBatch]);

  // Auto-refresh while pending or processing
  useEffect(() => {
    if (!data) return;
    const status = data.batch.status;
    if (status !== "pending" && status !== "processing") return;
    const interval = setInterval(fetchBatch, 5000);
    return () => clearInterval(interval);
  }, [data?.batch.status, fetchBatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-caso-slate">
        Loading...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-20 text-center">
        <p className="text-caso-slate">{error || "Batch not found"}</p>
        <Link
          href="/dashboard/documents"
          className="mt-4 inline-block text-caso-blue hover:underline"
        >
          Back to Documents
        </Link>
      </div>
    );
  }

  const { batch, documents, stats } = data;
  const completedCount = stats.completed + stats.failed;
  const progressPercent =
    stats.total > 0 ? Math.round((completedCount / stats.total) * 100) : 0;
  const isActive = batch.status === "pending" || batch.status === "processing";

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <Link
          href="/dashboard/documents"
          className="text-sm text-caso-slate hover:text-caso-white transition-colors"
        >
          &larr; Back to Documents
        </Link>
        <div className="mt-3 flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              {batch.name || "Batch Upload"}
            </h1>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span
                className={`rounded-full border px-3 py-1 text-sm font-medium capitalize ${serviceLevelBadgeClass(batch.service_level)}`}
              >
                {batch.service_level}
              </span>
              <span
                className={`rounded-full border px-3 py-1 text-sm font-medium capitalize ${statusBadgeClass(batch.status)}`}
              >
                {batch.status}
              </span>
              <span className="text-sm text-caso-slate">
                Created {new Date(batch.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-caso-white">
            {completedCount} of {stats.total} file{stats.total !== 1 ? "s" : ""} complete
          </p>
          <p className="text-sm text-caso-slate">{progressPercent}%</p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-caso-navy">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              stats.failed > 0 && stats.completed === 0
                ? "bg-caso-red"
                : progressPercent === 100
                  ? "bg-caso-green"
                  : "bg-caso-blue"
            } ${isActive ? "animate-pulse" : ""}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {isActive && (
          <p className="mt-2 text-xs text-caso-slate">
            Auto-refreshing every 5 seconds...
          </p>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Files" value={stats.total.toString()} />
        <StatCard
          label="Total Pages"
          value={stats.total_pages > 0 ? stats.total_pages.toString() : "--"}
        />
        <StatCard
          label="Completed"
          value={stats.completed.toString()}
          className="text-caso-green"
        />
        <StatCard
          label="Failed"
          value={stats.failed.toString()}
          className={stats.failed > 0 ? "text-caso-red" : undefined}
        />
        <StatCard
          label="Est. Cost"
          value={
            batch.estimated_cost !== null
              ? `$${batch.estimated_cost.toFixed(2)}`
              : "--"
          }
        />
      </div>

      {/* File Table */}
      <div className="overflow-x-auto rounded-xl border border-caso-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-caso-border bg-caso-navy-light/50">
              <th className="px-4 py-3 text-left font-medium text-caso-slate">
                Filename
              </th>
              <th className="px-4 py-3 text-left font-medium text-caso-slate">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-caso-slate">
                Score
              </th>
              <th className="px-4 py-3 text-left font-medium text-caso-slate">
                Pages
              </th>
              <th className="px-4 py-3 text-left font-medium text-caso-slate">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-caso-slate">
                  No documents in this batch.
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
                    <div className="text-xs text-caso-slate">
                      {formatFileSize(doc.file_size)}
                    </div>
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
                          {doc.score_before !== null
                            ? `${doc.score_before}%`
                            : "--"}
                        </span>
                        <span className="text-caso-slate mx-1">&rarr;</span>
                        <span className={scoreColor(doc.score_after)}>
                          {doc.score_after !== null
                            ? `${doc.score_after}%`
                            : "--"}
                        </span>
                      </span>
                    ) : (
                      <span className="text-xs text-caso-slate">--</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-caso-slate">
                    {doc.page_count ?? "--"}
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
    </div>
  );
}

function StatCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
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
