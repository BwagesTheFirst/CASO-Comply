"use client";

import { useState, useEffect, useCallback } from "react";

interface Review {
  id: string;
  tenant_id: string;
  filename: string;
  original_path: string;
  output_path: string;
  ai_score: number;
  page_count: number;
  status: string;
  reviewer_notes: string | null;
  created_at: string;
  completed_at: string | null;
  delivered_at: string | null;
  tenants: { name: string } | null;
}

function statusBadge(status: string) {
  switch (status) {
    case "pending":
      return "bg-caso-warm/10 text-caso-warm";
    case "in_review":
      return "bg-caso-blue/10 text-caso-blue";
    case "completed":
      return "bg-caso-green/10 text-caso-green";
    case "delivered":
      return "bg-caso-slate/10 text-caso-slate";
    default:
      return "bg-caso-slate/10 text-caso-slate";
  }
}

export default function AdminReviewQueuePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews);
      } else {
        setError(data.error || "Failed to fetch reviews");
      }
    } catch {
      setError("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function handleStartReview(id: string) {
    const link = document.createElement("a");
    link.href = `/api/admin/reviews/${id}/download`;
    link.download = "";
    link.click();

    await fetch(`/api/admin/reviews/${id}/start`, { method: "POST" });
    fetchReviews();
  }

  async function handleRelease(id: string) {
    await fetch(`/api/admin/reviews/${id}/release`, { method: "POST" });
    fetchReviews();
  }

  async function handleUploadCorrected(id: string) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setUploading(id);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("notes", "");

      try {
        const res = await fetch(`/api/admin/reviews/${id}/complete`, {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          fetchReviews();
        } else {
          const data = await res.json();
          setError(data.error || "Upload failed");
        }
      } catch {
        setError("Upload failed");
      } finally {
        setUploading(null);
      }
    };
    input.click();
  }

  if (loading) {
    return (
      <div className="text-caso-slate text-sm">Loading review queue...</div>
    );
  }

  const pending = reviews.filter((r) => r.status === "pending" || r.status === "in_review");
  const completed = reviews.filter((r) => r.status === "completed" || r.status === "delivered");

  return (
    <div className="space-y-6 max-w-6xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
        Human Review Queue
      </h1>

      {error && (
        <div className="rounded-lg bg-caso-red/10 border border-caso-red/30 px-4 py-3 text-sm text-caso-red">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            dismiss
          </button>
        </div>
      )}

      {/* Active Reviews */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
        <div className="px-6 py-4 border-b border-caso-border">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white">
            Needs Review ({pending.length})
          </h2>
        </div>
        {pending.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-caso-border text-left">
                  <th className="px-6 py-3 text-caso-slate font-medium">Tenant</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Filename</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">AI Score</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Pages</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Status</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Submitted</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b border-caso-border/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3 text-caso-white font-medium">
                      {review.tenants?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-3 text-caso-white font-mono text-xs">
                      {review.filename}
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-caso-red font-bold">{review.ai_score}</span>
                    </td>
                    <td className="px-6 py-3 text-caso-slate">{review.page_count}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(review.status)}`}
                      >
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-caso-slate">
                      {new Date(review.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {review.status === "pending" && (
                          <button
                            onClick={() => handleStartReview(review.id)}
                            className="rounded-lg bg-caso-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-caso-blue-bright transition-colors"
                          >
                            Start Review
                          </button>
                        )}
                        {review.status === "in_review" && (
                          <>
                            <button
                              onClick={() => handleUploadCorrected(review.id)}
                              disabled={uploading === review.id}
                              className="rounded-lg bg-caso-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-caso-green/80 disabled:opacity-50 transition-colors"
                            >
                              {uploading === review.id ? "Uploading..." : "Upload Corrected"}
                            </button>
                            <button
                              onClick={() => handleRelease(review.id)}
                              className="rounded-lg border border-caso-border px-3 py-1.5 text-xs font-medium text-caso-slate hover:text-caso-white transition-colors"
                            >
                              Release
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-caso-slate text-sm">
            No files waiting for review.
          </div>
        )}
      </div>

      {/* Completed / Delivered */}
      {completed.length > 0 && (
        <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
          <div className="px-6 py-4 border-b border-caso-border">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-caso-white">
              Completed ({completed.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-caso-border text-left">
                  <th className="px-6 py-3 text-caso-slate font-medium">Tenant</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Filename</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">AI Score</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Status</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Completed</th>
                  <th className="px-6 py-3 text-caso-slate font-medium">Delivered</th>
                </tr>
              </thead>
              <tbody>
                {completed.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b border-caso-border/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3 text-caso-white font-medium">
                      {review.tenants?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-3 text-caso-white font-mono text-xs">
                      {review.filename}
                    </td>
                    <td className="px-6 py-3 text-caso-slate">{review.ai_score}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(review.status)}`}
                      >
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-caso-slate">
                      {review.completed_at
                        ? new Date(review.completed_at).toLocaleDateString()
                        : "\u2014"}
                    </td>
                    <td className="px-6 py-3 text-caso-slate">
                      {review.delivered_at
                        ? new Date(review.delivered_at).toLocaleDateString()
                        : "Waiting for agent"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
