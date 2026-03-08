"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface TagAssignment {
  type: string;
  text: string;
  page: number;
  mcid: number;
  font_size: number;
}

interface PdfViewerProps {
  downloadUrl: string;
  tagAssignments: TagAssignment[];
  title?: string;
  onClose: () => void;
}

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  H1: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
  H2: { bg: "bg-teal-500/20", text: "text-teal-400", border: "border-teal-500/30" },
  H3: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" },
  P: { bg: "bg-slate-500/20", text: "text-slate-400", border: "border-slate-500/30" },
  Table: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
  Figure: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
};

function getTagColor(type: string) {
  return TAG_COLORS[type] || { bg: "bg-caso-slate/20", text: "text-caso-slate", border: "border-caso-slate/30" };
}

export default function PdfViewer({ downloadUrl, tagAssignments, title, onClose }: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Group tags by page
  const tagsByPage = useMemo(() => {
    const grouped: Record<number, TagAssignment[]> = {};
    for (const tag of tagAssignments) {
      if (!grouped[tag.page]) grouped[tag.page] = [];
      grouped[tag.page].push(tag);
    }
    return grouped;
  }, [tagAssignments]);

  const pageNumbers = useMemo(() => {
    const pages = new Set(tagAssignments.map((t) => t.page));
    return Array.from(pages).sort((a, b) => a - b);
  }, [tagAssignments]);

  const totalPages = pageNumbers.length > 0 ? Math.max(...pageNumbers) + 1 : 1;

  // Summary stats
  const stats = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    for (const tag of tagAssignments) {
      typeCounts[tag.type] = (typeCounts[tag.type] || 0) + 1;
    }
    return { total: tagAssignments.length, typeCounts, pages: totalPages };
  }, [tagAssignments, totalPages]);

  // Fetch PDF as blob to avoid cross-origin download trigger
  useEffect(() => {
    let revoke: string | null = null;
    fetch(downloadUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch PDF");
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        revoke = url;
        setBlobUrl(url);
      })
      .catch(() => setLoadError(true));

    return () => {
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [downloadUrl]);

  // Body scroll lock + focus management
  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";

    // Animate in
    requestAnimationFrame(() => setIsVisible(true));

    // Focus close button
    setTimeout(() => closeButtonRef.current?.focus(), 50);

    return () => {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    };
  }, []);

  // Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Focus trap
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  const toggleTag = useCallback((key: string) => {
    setExpandedTags((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const navigateToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Build PDF URL with page fragment (use blob URL so browser renders inline)
  const pdfUrl = blobUrl ? `${blobUrl}#page=${currentPage + 1}` : null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Tagged PDF Inspector"
      ref={modalRef}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`relative flex h-[95vh] w-[95vw] max-w-[1600px] flex-col overflow-hidden rounded-2xl border border-caso-border bg-caso-navy shadow-2xl shadow-black/50 transition-transform duration-200 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-caso-border bg-caso-navy-light px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-caso-blue/10">
              <svg className="h-4 w-4 text-caso-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-sm font-bold text-caso-white sm:text-base">
                Tagged PDF Inspector
              </h2>
              {title && (
                <p className="text-xs text-caso-slate truncate max-w-[200px] sm:max-w-[400px]">{title}</p>
              )}
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-caso-slate transition-colors hover:bg-caso-navy hover:text-caso-white focus-visible:ring-2 focus-visible:ring-caso-blue"
            aria-label="Close inspector"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* Body — split view */}
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* Left panel: PDF */}
          <div className="flex flex-col border-b border-caso-border lg:w-[60%] lg:border-b-0 lg:border-r" style={{ minHeight: "40vh" }}>
            {/* Page nav */}
            <div className="flex shrink-0 items-center justify-between border-b border-caso-border/50 bg-caso-navy px-4 py-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="flex h-7 w-7 items-center justify-center rounded-md text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-caso-slate"
                aria-label="Previous page"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <span className="text-xs font-medium text-caso-slate">
                Page <span className="text-caso-white">{currentPage + 1}</span> of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
                className="flex h-7 w-7 items-center justify-center rounded-md text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-caso-slate"
                aria-label="Next page"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
            {/* PDF embed */}
            <div className="relative flex-1 bg-caso-navy">
              {loadError ? (
                <div className="flex h-full items-center justify-center text-sm text-caso-slate">
                  <p>Could not load PDF preview.</p>
                </div>
              ) : pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  className="absolute inset-0 h-full w-full"
                  title="Remediated PDF document"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <svg className="h-8 w-8 animate-spin text-caso-blue" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Tag tree */}
          <div className="flex min-h-0 flex-col lg:w-[40%]">
            <div className="shrink-0 border-b border-caso-border/50 bg-caso-navy px-4 py-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-caso-slate">
                Tag Structure
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-3 sm:p-4" role="tree" aria-label="PDF tag structure">
              {pageNumbers.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-caso-slate">
                  No tags found in this document.
                </div>
              ) : (
                <div className="space-y-3">
                  {pageNumbers.map((pageNum) => {
                    const isActivePage = pageNum === currentPage;
                    const tags = tagsByPage[pageNum] || [];
                    return (
                      <div
                        key={pageNum}
                        className={`overflow-hidden rounded-xl border transition-colors ${
                          isActivePage
                            ? "border-caso-blue/40 bg-caso-blue/5"
                            : "border-caso-border/50 bg-caso-navy-light/50"
                        }`}
                        role="treeitem"
                        aria-expanded="true"
                      >
                        {/* Page header */}
                        <button
                          onClick={() => navigateToPage(pageNum)}
                          className={`flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-caso-navy-light ${
                            isActivePage ? "text-caso-blue" : "text-caso-slate hover:text-caso-white"
                          }`}
                          aria-label={`Navigate to page ${pageNum + 1}`}
                        >
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Page {pageNum + 1}
                          </span>
                          <span className="text-[10px] text-caso-slate">
                            {tags.length} tag{tags.length !== 1 ? "s" : ""}
                          </span>
                        </button>

                        {/* Tags */}
                        <div className="space-y-1 px-2 pb-2" role="group">
                          {tags.map((tag, idx) => {
                            const color = getTagColor(tag.type);
                            const tagKey = `${pageNum}-${idx}`;
                            const isExpanded = expandedTags.has(tagKey);
                            const isLong = tag.text.length > 80;
                            const displayText = isLong && !isExpanded
                              ? tag.text.slice(0, 80) + "..."
                              : tag.text;

                            return (
                              <div
                                key={tagKey}
                                className={`group rounded-lg border px-2.5 py-1.5 transition-colors ${
                                  isActivePage
                                    ? "border-caso-border/30 bg-caso-navy/60 hover:bg-caso-navy/80"
                                    : "border-transparent bg-transparent hover:bg-caso-navy/40"
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  {/* Tag badge */}
                                  <span
                                    className={`mt-0.5 inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${color.bg} ${color.text} border ${color.border}`}
                                  >
                                    {tag.type}
                                  </span>
                                  {/* Content */}
                                  <div className="min-w-0 flex-1">
                                    <button
                                      onClick={() => isLong && toggleTag(tagKey)}
                                      className={`text-left text-xs leading-relaxed ${
                                        isActivePage ? "text-caso-white/90" : "text-caso-slate"
                                      } ${isLong ? "cursor-pointer hover:text-caso-white" : "cursor-default"}`}
                                      aria-expanded={isLong ? isExpanded : undefined}
                                      tabIndex={isLong ? 0 : -1}
                                    >
                                      {displayText}
                                    </button>
                                    {/* MCID */}
                                    <span className="mt-0.5 block text-[10px] text-caso-slate/50">
                                      MCID {tag.mcid}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex shrink-0 flex-wrap items-center gap-3 border-t border-caso-border bg-caso-navy-light px-4 py-2.5 sm:px-6">
          <span className="text-[11px] font-medium text-caso-slate">
            <span className="text-caso-white">{stats.total}</span> tags
          </span>
          <span className="text-caso-border" aria-hidden="true">|</span>
          <span className="text-[11px] font-medium text-caso-slate">
            <span className="text-caso-white">{stats.pages}</span> page{stats.pages !== 1 ? "s" : ""}
          </span>
          <span className="text-caso-border" aria-hidden="true">|</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.typeCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => {
                const color = getTagColor(type);
                return (
                  <span
                    key={type}
                    className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${color.bg} ${color.text} border ${color.border}`}
                  >
                    {type} <span className="opacity-70">{count}</span>
                  </span>
                );
              })}
          </div>
        </footer>
      </div>
    </div>
  );
}
