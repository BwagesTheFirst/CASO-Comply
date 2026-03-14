"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface DocumentDetail {
  id: string;
  tenant_id: string;
  uploaded_by: string;
  filename: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  remediated_path: string | null;
  status: string;
  service_level: string;
  page_count: number | null;
  score_before: number | null;
  score_after: number | null;
  grade_before: string | null;
  grade_after: string | null;
  issues_found: IssueItem[] | null;
  checks_passed: CheckItem[] | null;
  certificate_json: CertificateData | null;
  error: string | null;
  batch_id: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

interface IssueItem {
  criterion?: string;
  category?: string;
  description?: string;
  severity?: string;
  rule?: string;
  message?: string;
}

interface CheckItem {
  criterion?: string;
  category?: string;
  description?: string;
  rule?: string;
  message?: string;
}

interface CertificateData {
  id?: string;
  issued_at?: string;
  standard?: string;
  level?: string;
  score?: number;
  valid_until?: string;
  [key: string]: unknown;
}

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
      return "bg-caso-slate/10 text-caso-slate border-caso-slate/30";
    case "enhanced":
      return "bg-caso-blue/10 text-caso-blue border-caso-blue/30";
    case "expert":
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    default:
      return "bg-caso-slate/10 text-caso-slate border-caso-slate/30";
  }
}

function gradeBadgeClass(grade: string | null): string {
  switch (grade?.toUpperCase()) {
    case "A":
      return "bg-caso-green/20 text-caso-green";
    case "B":
      return "bg-caso-green/10 text-caso-green";
    case "C":
      return "bg-caso-warm/10 text-caso-warm";
    case "D":
      return "bg-caso-red/10 text-caso-red";
    case "F":
      return "bg-caso-red/20 text-caso-red";
    default:
      return "bg-caso-slate/10 text-caso-slate";
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

function issueCategory(item: IssueItem | CheckItem): string {
  return item.category || item.criterion?.split(".")[0] || "General";
}

const CATEGORY_ORDER = ["Structure", "Navigation", "Text", "Images", "Tables", "Forms", "General"];

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [doc, setDoc] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reprocessing, setReprocessing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchDocument = useCallback(async () => {
    try {
      const res = await fetch(`/api/documents/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDoc(data.document);
    } catch {
      setDoc(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  // Poll for status updates when processing
  useEffect(() => {
    if (doc?.status !== "processing") return;
    const interval = setInterval(fetchDocument, 5000);
    return () => clearInterval(interval);
  }, [doc?.status, fetchDocument]);

  async function handleReprocess() {
    setReprocessing(true);
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "POST" });
      if (res.ok) {
        await fetchDocument();
      }
    } finally {
      setReprocessing(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this document? This cannot be undone.")) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard/documents");
      }
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-caso-slate">
        Loading...
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="py-20 text-center">
        <p className="text-caso-slate">Document not found</p>
        <Link
          href="/dashboard/documents"
          className="mt-4 inline-block text-caso-blue hover:underline"
        >
          Back to Documents
        </Link>
      </div>
    );
  }

  const improvement =
    doc.score_before !== null && doc.score_after !== null
      ? doc.score_after - doc.score_before
      : null;

  // Group issues and checks by category
  const issues = doc.issues_found || [];
  const checks = doc.checks_passed || [];

  const groupedItems = [...CATEGORY_ORDER, "Other"].reduce(
    (acc, cat) => {
      const catIssues = issues.filter(
        (i) => issueCategory(i).toLowerCase() === cat.toLowerCase()
      );
      const catChecks = checks.filter(
        (c) => issueCategory(c).toLowerCase() === cat.toLowerCase()
      );
      if (catIssues.length > 0 || catChecks.length > 0) {
        acc[cat] = { issues: catIssues, checks: catChecks };
      }
      return acc;
    },
    {} as Record<string, { issues: IssueItem[]; checks: CheckItem[] }>
  );

  // Catch items not in any defined category
  const categorizedIssueCount = Object.values(groupedItems).reduce(
    (sum, g) => sum + g.issues.length,
    0
  );
  const categorizedCheckCount = Object.values(groupedItems).reduce(
    (sum, g) => sum + g.checks.length,
    0
  );
  const uncategorizedIssues = issues.slice(categorizedIssueCount);
  const uncategorizedChecks = checks.slice(categorizedCheckCount);
  if (uncategorizedIssues.length > 0 || uncategorizedChecks.length > 0) {
    if (!groupedItems["Other"]) {
      groupedItems["Other"] = { issues: [], checks: [] };
    }
    groupedItems["Other"].issues.push(...uncategorizedIssues);
    groupedItems["Other"].checks.push(...uncategorizedChecks);
  }

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <Link
          href="/dashboard/documents"
          className="text-sm text-caso-slate hover:text-caso-white transition-colors"
        >
          ← Back to Documents
        </Link>
        <div className="mt-3 flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
              {doc.filename}
            </h1>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span
                className={`rounded-full border px-3 py-1 text-sm font-medium capitalize ${statusBadgeClass(doc.status)}`}
              >
                {doc.status}
              </span>
              <span
                className={`rounded-full border px-3 py-1 text-sm font-medium capitalize ${serviceLevelBadgeClass(doc.service_level)}`}
              >
                {doc.service_level}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {doc.status === "failed" && doc.error && (
        <div className="rounded-xl border border-caso-red/30 bg-caso-red/5 p-4">
          <p className="text-sm font-medium text-caso-red">Processing Error</p>
          <p className="mt-1 text-sm text-caso-red/80">{doc.error}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Scores Card */}
          {(doc.score_before !== null || doc.score_after !== null) && (
            <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
              <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
                Compliance Scores
              </h2>
              <div className="flex items-center justify-center gap-8">
                {/* Before */}
                <div className="text-center">
                  <p className="text-xs font-medium text-caso-slate mb-2">Before</p>
                  <div
                    className={`inline-flex h-20 w-20 items-center justify-center rounded-full border-4 ${
                      doc.grade_before
                        ? gradeBadgeClass(doc.grade_before)
                        : "border-caso-border"
                    }`}
                  >
                    <div>
                      <p className={`text-2xl font-bold ${scoreColor(doc.score_before)}`}>
                        {doc.score_before !== null ? `${doc.score_before}` : "--"}
                      </p>
                      {doc.grade_before && (
                        <p className="text-xs font-semibold">{doc.grade_before}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center">
                  <svg
                    className="h-8 w-8 text-caso-slate"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  {improvement !== null && (
                    <p
                      className={`mt-1 text-sm font-bold ${
                        improvement > 0 ? "text-caso-green" : improvement < 0 ? "text-caso-red" : "text-caso-slate"
                      }`}
                    >
                      {improvement > 0 ? "+" : ""}
                      {improvement.toFixed(1)}%
                    </p>
                  )}
                </div>

                {/* After */}
                <div className="text-center">
                  <p className="text-xs font-medium text-caso-slate mb-2">After</p>
                  <div
                    className={`inline-flex h-20 w-20 items-center justify-center rounded-full border-4 ${
                      doc.grade_after
                        ? gradeBadgeClass(doc.grade_after)
                        : "border-caso-border"
                    }`}
                  >
                    <div>
                      <p className={`text-2xl font-bold ${scoreColor(doc.score_after)}`}>
                        {doc.score_after !== null ? `${doc.score_after}` : "--"}
                      </p>
                      {doc.grade_after && (
                        <p className="text-xs font-semibold">{doc.grade_after}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Compliance Checklist */}
          {(issues.length > 0 || checks.length > 0) && (
            <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
              <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
                Compliance Checklist
              </h2>
              <div className="space-y-5">
                {Object.entries(groupedItems).map(([category, { issues: catIssues, checks: catChecks }]) => (
                  <div key={category}>
                    <h3 className="text-xs font-semibold text-caso-slate uppercase tracking-wider mb-2">
                      {category}
                    </h3>
                    <div className="space-y-1.5">
                      {catChecks.map((check, i) => (
                        <div
                          key={`check-${i}`}
                          className="flex items-start gap-2 rounded-lg px-3 py-2 bg-caso-green/5"
                        >
                          <span className="mt-0.5 shrink-0 text-caso-green" aria-label="Passed">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm text-caso-white">
                              {check.criterion || check.rule || "Check passed"}
                            </p>
                            {(check.description || check.message) && (
                              <p className="text-xs text-caso-slate mt-0.5">
                                {check.description || check.message}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      {catIssues.map((issue, i) => (
                        <div
                          key={`issue-${i}`}
                          className="flex items-start gap-2 rounded-lg px-3 py-2 bg-caso-red/5"
                        >
                          <span className="mt-0.5 shrink-0 text-caso-red" aria-label="Failed">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm text-caso-white">
                              {issue.criterion || issue.rule || "Issue found"}
                            </p>
                            {(issue.description || issue.message) && (
                              <p className="text-xs text-caso-slate mt-0.5">
                                {issue.description || issue.message}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificate */}
          {doc.certificate_json && (
            <div className="rounded-xl border border-caso-green/30 bg-caso-green/5 p-6">
              <h2 className="text-sm font-semibold text-caso-green uppercase tracking-wider mb-4">
                Compliance Certificate
              </h2>
              <dl className="grid gap-4 sm:grid-cols-2">
                {doc.certificate_json.id && (
                  <InfoField label="Certificate ID" value={doc.certificate_json.id} />
                )}
                {doc.certificate_json.standard && (
                  <InfoField label="Standard" value={doc.certificate_json.standard} />
                )}
                {doc.certificate_json.level && (
                  <InfoField label="Conformance Level" value={doc.certificate_json.level} />
                )}
                {doc.certificate_json.score !== undefined && (
                  <InfoField label="Score" value={`${doc.certificate_json.score}%`} />
                )}
                {doc.certificate_json.issued_at && (
                  <InfoField
                    label="Issued"
                    value={new Date(doc.certificate_json.issued_at).toLocaleDateString()}
                  />
                )}
                {doc.certificate_json.valid_until && (
                  <InfoField
                    label="Valid Until"
                    value={new Date(doc.certificate_json.valid_until).toLocaleDateString()}
                  />
                )}
              </dl>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Document Info */}
          <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
            <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
              Document Info
            </h2>
            <dl className="space-y-3">
              <InfoField label="Filename" value={doc.filename} />
              <InfoField label="Size" value={formatFileSize(doc.file_size)} />
              <InfoField label="Type" value={doc.mime_type} />
              <InfoField
                label="Uploaded"
                value={new Date(doc.created_at).toLocaleString()}
              />
              <InfoField label="Service Level" value={doc.service_level} capitalize />
              <InfoField
                label="Pages"
                value={doc.page_count !== null ? doc.page_count.toString() : "Pending"}
              />
            </dl>
          </div>

          {/* Processing Timeline */}
          <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
            <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
              Processing Timeline
            </h2>
            <div className="space-y-4">
              <TimelineStep
                label="Uploaded"
                timestamp={doc.created_at}
                active={true}
              />
              <TimelineStep
                label="Processing"
                timestamp={
                  doc.status === "processing" || doc.status === "completed" || doc.status === "failed"
                    ? doc.updated_at
                    : null
                }
                active={doc.status === "processing"}
                pulse={doc.status === "processing"}
              />
              <TimelineStep
                label={doc.status === "failed" ? "Failed" : "Completed"}
                timestamp={doc.status === "completed" ? doc.completed_at : doc.status === "failed" ? doc.updated_at : null}
                active={doc.status === "completed" || doc.status === "failed"}
                failed={doc.status === "failed"}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
            <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
              Actions
            </h2>
            <div className="space-y-2">
              <a
                href={`/api/documents/${doc.id}/download?type=original`}
                className="flex w-full items-center gap-2 rounded-lg border border-caso-border px-3 py-2 text-sm text-caso-slate hover:text-caso-white hover:border-caso-blue transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Original
              </a>
              {doc.status === "completed" && doc.remediated_path && (
                <a
                  href={`/api/documents/${doc.id}/download?type=remediated`}
                  className="flex w-full items-center gap-2 rounded-lg border border-caso-green/30 bg-caso-green/5 px-3 py-2 text-sm text-caso-green hover:bg-caso-green/10 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Remediated
                </a>
              )}
              {doc.status === "completed" && doc.score_after !== null && (
                <a
                  href={`/api/documents/${doc.id}/certificate`}
                  className="flex w-full items-center gap-2 rounded-lg border border-caso-blue/30 bg-caso-blue/5 px-3 py-2 text-sm text-caso-blue hover:bg-caso-blue/10 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Download Certificate
                </a>
              )}
              {(doc.status === "queued" || doc.status === "failed") && (
                <button
                  onClick={handleReprocess}
                  disabled={reprocessing}
                  className="flex w-full items-center gap-2 rounded-lg border border-caso-border px-3 py-2 text-sm text-caso-slate hover:text-caso-white hover:border-caso-blue transition-colors disabled:opacity-40"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {reprocessing ? "Processing..." : "Re-process"}
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={deleting || doc.status === "processing"}
                className="flex w-full items-center gap-2 rounded-lg border border-caso-red/30 px-3 py-2 text-sm text-caso-red/70 hover:text-caso-red hover:border-caso-red hover:bg-caso-red/5 transition-colors disabled:opacity-40"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                {deleting ? "Deleting..." : "Delete Document"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoField({
  label,
  value,
  capitalize = false,
}: {
  label: string;
  value: string | null;
  capitalize?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-caso-slate">{label}</dt>
      <dd className={`mt-1 text-sm text-caso-white ${capitalize ? "capitalize" : ""}`}>
        {value || "--"}
      </dd>
    </div>
  );
}

function TimelineStep({
  label,
  timestamp,
  active,
  pulse = false,
  failed = false,
}: {
  label: string;
  timestamp: string | null;
  active: boolean;
  pulse?: boolean;
  failed?: boolean;
}) {
  const dotColor = failed
    ? "bg-caso-red"
    : active
      ? "bg-caso-green"
      : "bg-caso-border";

  return (
    <div className="flex items-start gap-3">
      <div className="relative mt-1">
        <div
          className={`h-3 w-3 rounded-full ${dotColor} ${pulse ? "animate-pulse" : ""}`}
        />
      </div>
      <div>
        <p className={`text-sm ${active ? "text-caso-white font-medium" : "text-caso-slate"}`}>
          {label}
        </p>
        {timestamp && (
          <p className="text-xs text-caso-slate">
            {new Date(timestamp).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
