"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PdfViewer from "@/components/PdfViewer";

// ── Types ──────────────────────────────────────────────────────────────────

type ReviewStatus = "pending" | "in_review" | "completed" | "delivered";

interface ReviewRecord {
  id: string;
  tenant_id: string;
  document_id: string | null;
  filename: string;
  original_path: string | null;
  output_path: string | null;
  storage_path: string | null;
  corrected_path: string | null;
  ai_score: number | null;
  page_count: number | null;
  status: ReviewStatus;
  reviewer_notes: string | null;
  created_at: string;
  completed_at: string | null;
  delivered_at: string | null;
  tenants: { name: string } | null;
}

// ── Status helpers ─────────────────────────────────────────────────────────

function statusBadgeClass(status: ReviewStatus) {
  switch (status) {
    case "pending":
      return "bg-caso-warm/10 text-caso-warm border-caso-warm/30";
    case "in_review":
      return "bg-caso-blue/10 text-caso-blue border-caso-blue/30";
    case "completed":
      return "bg-caso-green/10 text-caso-green border-caso-green/30";
    case "delivered":
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    default:
      return "bg-caso-slate/10 text-caso-slate border-caso-slate/30";
  }
}

function statusLabel(status: ReviewStatus) {
  switch (status) {
    case "pending":
      return "Pending";
    case "in_review":
      return "In Review";
    case "completed":
      return "Completed";
    case "delivered":
      return "Delivered";
    default:
      return status;
  }
}

function scoreColor(score: number | null): string {
  if (score === null) return "text-caso-slate";
  if (score >= 80) return "text-caso-green";
  if (score >= 50) return "text-caso-warm";
  return "text-caso-red";
}

// ── Info Field Component ───────────────────────────────────────────────────

function InfoField({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs font-medium text-caso-slate">{label}</dt>
      <dd className="mt-1 text-sm text-caso-white">{value || "\u2014"}</dd>
    </div>
  );
}

// ── Main Page Component ────────────────────────────────────────────────────

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reviewId = params.id as string;

  const [review, setReview] = useState<ReviewRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [tagAssignments, setTagAssignments] = useState<
    { type: string; text: string; page: number; mcid: number; font_size: number; bbox: [number, number, number, number] }[]
  >([]);
  const [scoreAfter, setScoreAfter] = useState<number | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [completeFile, setCompleteFile] = useState<File | null>(null);
  const [deliverSuccess, setDeliverSuccess] = useState(false);

  const fetchReview = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Failed to load" }));
        throw new Error(data.error || `Error ${res.status}`);
      }
      const data = await res.json();
      setReview(data.review);
      setReviewerNotes(data.review.reviewer_notes || "");
      setScoreAfter(data.review.ai_score);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load review");
    } finally {
      setLoading(false);
    }
  }, [reviewId]);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  // ── Action handlers ────────────────────────────────────────────────────

  async function handleStartReview() {
    setActionLoading("start");
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}/start`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(data.error || "Failed to start review");
      }
      await fetchReview();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to start review");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleComplete() {
    if (!completeFile) {
      alert("Please select a corrected PDF file to upload.");
      return;
    }
    setActionLoading("complete");
    try {
      const formData = new FormData();
      formData.append("file", completeFile);
      formData.append("notes", reviewerNotes);
      const res = await fetch(`/api/admin/reviews/${reviewId}/complete`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(data.error || "Failed to complete review");
      }
      setCompleteFile(null);
      await fetchReview();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to complete review");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRelease() {
    setActionLoading("release");
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}/release`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(data.error || "Failed to release review");
      }
      await fetchReview();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to release review");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDownload() {
    setActionLoading("download");
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}/download`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = review?.filename || "document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Download failed");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeliver() {
    setActionLoading("deliver");
    setDeliverSuccess(false);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}/deliver`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(data.error || "Failed to deliver review");
      }
      setDeliverSuccess(true);
      await fetchReview();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to deliver review");
    } finally {
      setActionLoading(null);
    }
  }

  // ── Loading / Error states ─────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-caso-slate">
        Loading review...
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="py-20 text-center">
        <p className="text-caso-slate">{error || "Review not found"}</p>
        <Link
          href="/dashboard/admin/reviews"
          className="mt-4 inline-block text-caso-blue hover:underline"
        >
          Back to Review Queue
        </Link>
      </div>
    );
  }

  const tenantName = review.tenants?.name || "Unknown Tenant";

  return (
    <div className="space-y-6">
      {/* ── Back link ──────────────────────────────────────────────────── */}
      <div>
        <Link
          href="/dashboard/admin/reviews"
          className="text-sm text-caso-slate hover:text-caso-white transition-colors"
        >
          &larr; Back to Review Queue
        </Link>
      </div>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* File icon */}
            <div className="w-12 h-12 rounded-xl bg-caso-blue/10 flex items-center justify-center shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-caso-blue"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                {review.filename}
              </h1>
              <p className="mt-1 text-sm text-caso-slate">
                {tenantName} &middot;{" "}
                {review.page_count !== null ? `${review.page_count} pages` : "Unknown pages"} &middot;{" "}
                Submitted {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* AI Score */}
            {review.ai_score !== null && (
              <div className="text-center px-3">
                <p className="text-[10px] uppercase font-semibold text-caso-slate/60 tracking-wider">
                  AI Score
                </p>
                <p className={`text-2xl font-bold ${scoreColor(scoreAfter ?? review.ai_score)}`}>
                  {scoreAfter ?? review.ai_score}
                </p>
              </div>
            )}

            {/* Status badge */}
            <span
              className={`inline-block rounded-full border px-3 py-1 text-sm font-medium capitalize ${statusBadgeClass(
                review.status
              )}`}
            >
              {statusLabel(review.status)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ─────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Details + Notes */}
        <div className="space-y-6 lg:col-span-2">
          {/* Review Details */}
          <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
            <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
              Review Details
            </h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <InfoField label="Filename" value={review.filename} />
              <InfoField label="Tenant" value={tenantName} />
              <InfoField label="Status" value={statusLabel(review.status)} />
              <InfoField
                label="AI Score"
                value={review.ai_score !== null ? String(review.ai_score) : null}
              />
              <InfoField
                label="Page Count"
                value={review.page_count !== null ? String(review.page_count) : null}
              />
              <InfoField label="Tenant ID" value={review.tenant_id} />
              <InfoField
                label="Submitted"
                value={new Date(review.created_at).toLocaleString()}
              />
              <InfoField
                label="Completed"
                value={review.completed_at ? new Date(review.completed_at).toLocaleString() : null}
              />
              <InfoField
                label="Delivered"
                value={review.delivered_at ? new Date(review.delivered_at).toLocaleString() : null}
              />
              <InfoField
                label="Storage Path"
                value={review.storage_path}
              />
              <InfoField
                label="Output Path"
                value={review.output_path}
              />
              <InfoField
                label="Corrected Path"
                value={review.corrected_path}
              />
            </dl>
          </div>

          {/* Reviewer Notes */}
          <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
            <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
              Reviewer Notes
            </h2>
            {review.status === "in_review" || review.status === "pending" ? (
              <textarea
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                placeholder="Add notes about this review..."
                rows={4}
                className="w-full rounded-lg border border-caso-border bg-caso-navy px-3 py-2 text-sm text-caso-white placeholder:text-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue resize-none"
              />
            ) : (
              <p className="text-sm text-caso-white whitespace-pre-wrap">
                {review.reviewer_notes || "No notes recorded."}
              </p>
            )}
          </div>

          {/* Complete Review - File Upload (only when in_review) */}
          {review.status === "in_review" && (
            <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
              <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
                Complete Review
              </h2>
              <p className="text-sm text-caso-slate mb-4">
                Upload the corrected PDF to mark this review as complete.
              </p>
              <div className="flex items-center gap-4">
                <label className="flex-1">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setCompleteFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-caso-slate file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-caso-border file:text-sm file:font-medium file:bg-caso-navy file:text-caso-white hover:file:bg-caso-navy-light file:cursor-pointer file:transition-colors"
                  />
                </label>
                <button
                  onClick={handleComplete}
                  disabled={actionLoading === "complete" || !completeFile}
                  className="rounded-lg bg-caso-green px-4 py-2 text-sm font-semibold text-white hover:bg-caso-green/80 disabled:opacity-40 transition-colors shrink-0"
                >
                  {actionLoading === "complete" ? "Uploading..." : "Complete Review"}
                </button>
              </div>
              {completeFile && (
                <p className="mt-2 text-xs text-caso-slate">
                  Selected: {completeFile.name} ({(completeFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          {/* Status Actions */}
          <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
            <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
              Actions
            </h2>
            <div className="space-y-3">
              {/* Download */}
              <button
                onClick={handleDownload}
                disabled={actionLoading === "download"}
                className="flex w-full items-center gap-2 rounded-lg border border-caso-border px-3 py-2.5 text-sm text-caso-slate hover:text-caso-white hover:border-caso-blue transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {actionLoading === "download" ? "Downloading..." : "Download PDF"}
              </button>

              {/* Tag Inspector */}
              <button
                onClick={() => setShowEditor(true)}
                className="flex w-full items-center gap-2 rounded-lg border border-caso-blue/50 bg-caso-blue/10 px-3 py-2.5 text-sm font-medium text-caso-blue hover:bg-caso-blue/20 hover:border-caso-blue transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="4 7 4 4 20 4 20 7" />
                  <line x1="9" y1="20" x2="15" y2="20" />
                  <line x1="12" y1="4" x2="12" y2="20" />
                </svg>
                Edit in Tag Inspector
              </button>

              {/* Start Review (only when pending) */}
              {review.status === "pending" && (
                <button
                  onClick={handleStartReview}
                  disabled={actionLoading === "start"}
                  className="flex w-full items-center gap-2 rounded-lg bg-caso-blue px-3 py-2.5 text-sm font-semibold text-white hover:bg-caso-blue-bright disabled:opacity-40 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  {actionLoading === "start" ? "Starting..." : "Start Review"}
                </button>
              )}

              {/* Release (only when in_review) */}
              {review.status === "in_review" && (
                <button
                  onClick={handleRelease}
                  disabled={actionLoading === "release"}
                  className="flex w-full items-center gap-2 rounded-lg border border-caso-warm px-3 py-2.5 text-sm font-medium text-caso-warm hover:bg-caso-warm/10 disabled:opacity-40 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  {actionLoading === "release" ? "Releasing..." : "Release (Back to Pending)"}
                </button>
              )}

              {/* Deliver to Customer (only when completed) */}
              {review.status === "completed" && (
                <button
                  onClick={handleDeliver}
                  disabled={actionLoading === "deliver"}
                  className="flex w-full items-center gap-2 rounded-lg bg-purple-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 disabled:opacity-40 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                  {actionLoading === "deliver" ? "Delivering..." : "Deliver to Customer"}
                </button>
              )}

              {deliverSuccess && (
                <p className="text-sm text-caso-green font-medium">
                  Successfully delivered to customer.
                </p>
              )}
            </div>
          </div>

          {/* Linked Document */}
          {review.document_id && (
            <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
              <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
                Linked Document
              </h2>
              <Link
                href={`/dashboard/documents/${review.document_id}`}
                className="flex items-center gap-2 text-sm text-caso-blue hover:underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                View Customer Document
              </Link>
              <p className="mt-1 text-xs text-caso-slate font-mono">{review.document_id}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
            <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
              Timeline
            </h2>
            <div className="space-y-4">
              <TimelineItem
                label="Submitted"
                date={review.created_at}
                active
              />
              {review.status !== "pending" && (
                <TimelineItem
                  label="Review Started"
                  date={null}
                  active={review.status === "in_review" || review.status === "completed" || review.status === "delivered"}
                />
              )}
              {review.completed_at && (
                <TimelineItem
                  label="Completed"
                  date={review.completed_at}
                  active
                />
              )}
              {review.delivered_at && (
                <TimelineItem
                  label="Delivered"
                  date={review.delivered_at}
                  active
                />
              )}
            </div>
          </div>

          {/* Quick Navigate */}
          <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
            <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
              Quick Navigate
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => router.push("/dashboard/admin/reviews")}
                className="flex w-full items-center gap-2 rounded-lg border border-caso-border px-3 py-2 text-sm text-caso-slate hover:text-caso-white hover:border-caso-blue transition-colors"
              >
                &larr; Review Queue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tag Inspector Modal ────────────────────────────────────────── */}
      {showEditor && (
        <PdfViewer
          downloadUrl={`/api/admin/reviews/${reviewId}/download?type=${review.corrected_path ? "corrected" : review.output_path ? "output" : "original"}`}
          tagAssignments={tagAssignments}
          pageDimensions={[
            ...(review.page_count
              ? Array.from({ length: review.page_count }, (_, i) => ({
                  page: i,
                  width: 612,
                  height: 792,
                }))
              : [{ page: 0, width: 612, height: 792 }]),
          ]}
          title={`Review: ${review.filename}`}
          onClose={() => setShowEditor(false)}
          editable={review.status === "in_review" || review.status === "pending"}
          onSave={async (updatedTags) => {
            try {
              const res = await fetch("/api/apply-edits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  file_id: reviewId,
                  edits: updatedTags,
                }),
              });
              if (!res.ok) {
                const err = await res.json().catch(() => ({ error: "Unknown error" }));
                throw new Error(err.error || `Apply-edits failed: ${res.status}`);
              }
              const data = await res.json();
              if (data.after?.score != null) {
                setScoreAfter(data.after.score);
              }
              if (data.tag_assignments) {
                setTagAssignments(data.tag_assignments);
              }
              setShowEditor(false);
            } catch (err) {
              console.error("Failed to apply edits:", err);
              alert(
                err instanceof Error
                  ? err.message
                  : "Failed to apply edits. Please try again."
              );
            }
          }}
        />
      )}
    </div>
  );
}

// ── Timeline Item Component ──────────────────────────────────────────────

function TimelineItem({
  label,
  date,
  active,
}: {
  label: string;
  date: string | null;
  active: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
          active ? "bg-caso-green" : "bg-caso-slate/30"
        }`}
      />
      <div>
        <p className={`text-sm ${active ? "text-caso-white" : "text-caso-slate/50"}`}>
          {label}
        </p>
        {date && (
          <p className="text-xs text-caso-slate">
            {new Date(date).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
