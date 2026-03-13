"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Lead {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  organization: string | null;
  source: string;
  status: string;
  metadata: Record<string, string>;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  contacted_at: string | null;
}

interface Activity {
  id: string;
  action: string;
  details: Record<string, string>;
  actor_id: string | null;
  created_at: string;
}

interface Note {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
}

const STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost"];

function statusBadgeClass(status: string): string {
  switch (status) {
    case "new": return "bg-caso-blue/10 text-caso-blue border-caso-blue/30";
    case "contacted": return "bg-caso-warm/10 text-caso-warm border-caso-warm/30";
    case "qualified": return "bg-caso-green/10 text-caso-green border-caso-green/30";
    case "proposal": return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    case "won": return "bg-caso-green/20 text-caso-green border-caso-green/30";
    case "lost": return "bg-caso-slate/10 text-caso-slate border-caso-slate/30";
    default: return "bg-caso-slate/10 text-caso-slate border-caso-slate/30";
  }
}

function sourceLabel(source: string): string {
  switch (source) {
    case "contact": return "Contact Form";
    case "free_scan": return "Free Scan Request";
    case "scan_email": return "Scan Email";
    case "manual": return "Manual Entry";
    default: return source;
  }
}

function activityIcon(action: string): string {
  switch (action) {
    case "created": return "●";
    case "status_changed": return "↻";
    case "note_added": return "✎";
    case "assigned": return "→";
    case "email_sent": return "✉";
    default: return "•";
  }
}

function activityLabel(activity: Activity): string {
  switch (activity.action) {
    case "created":
      return `Lead created from ${sourceLabel(activity.details.source || "unknown")}`;
    case "status_changed":
      return `Status changed from ${activity.details.from} to ${activity.details.to}`;
    case "note_added":
      return "Note added";
    case "assigned":
      return "Lead assigned";
    case "email_sent":
      return "Email sent";
    default:
      return activity.action;
  }
}

export default function LeadDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchLead = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/leads/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLead(data.lead);
      setActivity(data.activity);
      setNotes(data.notes);
    } catch {
      setLead(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  async function updateStatus(newStatus: string) {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === "contacted" ? { contacted_at: new Date().toISOString() } : {}),
        }),
      });
      if (res.ok) {
        await fetchLead();
      }
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function addNote() {
    if (!newNote.trim()) return;
    setSubmittingNote(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });
      if (res.ok) {
        setNewNote("");
        await fetchLead();
      }
    } finally {
      setSubmittingNote(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-caso-slate">
        Loading...
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="py-20 text-center">
        <p className="text-caso-slate">Lead not found</p>
        <Link href="/dashboard/admin/leads" className="mt-4 inline-block text-caso-blue hover:underline">
          Back to Leads
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <Link
          href="/dashboard/admin/leads"
          className="text-sm text-caso-slate hover:text-caso-white transition-colors"
        >
          ← Back to Leads
        </Link>
        <div className="mt-3 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{lead.name || lead.email}</h1>
            <p className="mt-1 text-sm text-caso-slate">
              {lead.organization && `${lead.organization} · `}
              {sourceLabel(lead.source)} · {new Date(lead.created_at).toLocaleDateString()}
            </p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-sm font-medium capitalize ${statusBadgeClass(lead.status)}`}>
            {lead.status}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Lead Info + Metadata */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contact Info */}
          <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
            <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
              Contact Information
            </h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <InfoField label="Email" value={lead.email} href={`mailto:${lead.email}`} />
              <InfoField label="Phone" value={lead.phone} href={lead.phone ? `tel:${lead.phone}` : undefined} />
              <InfoField label="Organization" value={lead.organization} />
              <InfoField label="Source" value={sourceLabel(lead.source)} />
            </dl>
          </div>

          {/* Metadata (source-specific) */}
          {lead.metadata && Object.keys(lead.metadata).length > 0 && (
            <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
              <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
                Submission Details
              </h2>
              <dl className="grid gap-4 sm:grid-cols-2">
                {lead.metadata.helpWith && (
                  <InfoField label="Topic" value={lead.metadata.helpWith} />
                )}
                {lead.metadata.message && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium text-caso-slate">Message</dt>
                    <dd className="mt-1 text-sm text-caso-white whitespace-pre-wrap">
                      {lead.metadata.message}
                    </dd>
                  </div>
                )}
                {lead.metadata.websiteUrl && (
                  <InfoField label="Website" value={lead.metadata.websiteUrl} />
                )}
                {lead.metadata.documentCount && (
                  <InfoField label="Est. Documents" value={lead.metadata.documentCount} />
                )}
                {lead.metadata.industry && (
                  <InfoField label="Industry" value={lead.metadata.industry} />
                )}
              </dl>
            </div>
          )}

          {/* Notes */}
          <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
            <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
              Notes
            </h2>

            {/* Add note */}
            <div className="flex gap-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                rows={2}
                className="flex-1 rounded-lg border border-caso-border bg-caso-navy px-3 py-2 text-sm text-caso-white placeholder:text-caso-slate/50 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue resize-none"
              />
              <button
                onClick={addNote}
                disabled={submittingNote || !newNote.trim()}
                className="self-end rounded-lg bg-caso-blue-deep px-4 py-2 text-sm font-medium text-caso-white hover:bg-caso-blue transition-colors disabled:opacity-40"
              >
                {submittingNote ? "..." : "Add"}
              </button>
            </div>

            {/* Notes list */}
            {notes.length > 0 && (
              <div className="mt-4 space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg border border-caso-border/50 bg-caso-navy/50 p-3"
                  >
                    <p className="text-sm text-caso-white whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <p className="mt-2 text-xs text-caso-slate">
                      {new Date(note.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions + Activity */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
            <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
              Update Status
            </h2>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={updatingStatus || lead.status === s}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    lead.status === s
                      ? statusBadgeClass(s) + " cursor-default"
                      : "border-caso-border text-caso-slate hover:text-caso-white hover:border-caso-blue"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
            <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <a
                href={`mailto:${lead.email}`}
                className="flex w-full items-center gap-2 rounded-lg border border-caso-border px-3 py-2 text-sm text-caso-slate hover:text-caso-white hover:border-caso-blue transition-colors"
              >
                <span>✉</span> Send Email
              </a>
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="flex w-full items-center gap-2 rounded-lg border border-caso-border px-3 py-2 text-sm text-caso-slate hover:text-caso-white hover:border-caso-blue transition-colors"
                >
                  <span>☏</span> Call
                </a>
              )}
              {lead.metadata?.websiteUrl && (
                <a
                  href={lead.metadata.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center gap-2 rounded-lg border border-caso-border px-3 py-2 text-sm text-caso-slate hover:text-caso-white hover:border-caso-blue transition-colors"
                >
                  <span>↗</span> Visit Website
                </a>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
            <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
              Activity
            </h2>
            {activity.length === 0 ? (
              <p className="text-sm text-caso-slate">No activity yet</p>
            ) : (
              <div className="space-y-4">
                {activity.map((a) => (
                  <div key={a.id} className="flex gap-3">
                    <span className="mt-0.5 text-caso-slate">{activityIcon(a.action)}</span>
                    <div>
                      <p className="text-sm text-caso-white">{activityLabel(a)}</p>
                      <p className="text-xs text-caso-slate">
                        {new Date(a.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoField({
  label,
  value,
  href,
}: {
  label: string;
  value: string | null;
  href?: string;
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-caso-slate">{label}</dt>
      <dd className="mt-1 text-sm text-caso-white">
        {href && value ? (
          <a href={href} className="text-caso-blue hover:underline">
            {value}
          </a>
        ) : (
          value || "—"
        )}
      </dd>
    </div>
  );
}
