"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface TagAssignment {
  type: string;
  text: string;
  page: number;
  mcid: number;
  font_size: number;
  bbox: [number, number, number, number];
}

interface PageDimension {
  page: number;
  width: number;
  height: number;
}

interface PdfViewerProps {
  downloadUrl: string;
  tagAssignments: TagAssignment[];
  pageDimensions: PageDimension[];
  title?: string;
  onClose: () => void;
}

const TAG_HIGHLIGHT_COLORS: Record<string, { fill: string; border: string; bg: string; text: string; borderClass: string }> = {
  H1: { fill: "rgba(59, 130, 246, 0.18)", border: "rgba(59, 130, 246, 0.6)", bg: "bg-blue-500/20", text: "text-blue-400", borderClass: "border-blue-500/30" },
  H2: { fill: "rgba(20, 184, 166, 0.18)", border: "rgba(20, 184, 166, 0.6)", bg: "bg-teal-500/20", text: "text-teal-400", borderClass: "border-teal-500/30" },
  H3: { fill: "rgba(6, 182, 212, 0.18)", border: "rgba(6, 182, 212, 0.6)", bg: "bg-cyan-500/20", text: "text-cyan-400", borderClass: "border-cyan-500/30" },
  P: { fill: "rgba(148, 163, 184, 0.12)", border: "rgba(148, 163, 184, 0.4)", bg: "bg-slate-500/20", text: "text-slate-400", borderClass: "border-slate-500/30" },
  Table: { fill: "rgba(168, 85, 247, 0.18)", border: "rgba(168, 85, 247, 0.6)", bg: "bg-purple-500/20", text: "text-purple-400", borderClass: "border-purple-500/30" },
  Figure: { fill: "rgba(249, 115, 22, 0.18)", border: "rgba(249, 115, 22, 0.6)", bg: "bg-orange-500/20", text: "text-orange-400", borderClass: "border-orange-500/30" },
};

function getTagColor(type: string) {
  return TAG_HIGHLIGHT_COLORS[type] || {
    fill: "rgba(148, 163, 184, 0.12)",
    border: "rgba(148, 163, 184, 0.4)",
    bg: "bg-caso-slate/20",
    text: "text-caso-slate",
    borderClass: "border-caso-slate/30",
  };
}

export default function PdfViewer({ downloadUrl, tagAssignments, pageDimensions, title, onClose }: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedTagKey, setSelectedTagKey] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<unknown>(null);
  const [totalPages, setTotalPages] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const tagListRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<unknown>(null);

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

  // Page dimension lookup
  const getPageDim = useCallback(
    (pageNum: number) => {
      const dim = pageDimensions.find((d) => d.page === pageNum);
      return dim || { width: 612, height: 792 };
    },
    [pageDimensions]
  );

  // Summary stats
  const stats = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    for (const tag of tagAssignments) {
      typeCounts[tag.type] = (typeCounts[tag.type] || 0) + 1;
    }
    const maxPage = pageDimensions.length > 0 ? pageDimensions.length : (pageNumbers.length > 0 ? Math.max(...pageNumbers) + 1 : 1);
    return { total: tagAssignments.length, typeCounts, pages: maxPage };
  }, [tagAssignments, pageDimensions, pageNumbers]);

  // Fetch PDF data
  useEffect(() => {
    fetch(downloadUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch PDF");
        return res.arrayBuffer();
      })
      .then((data) => setPdfData(data))
      .catch(() => setLoadError(true));
  }, [downloadUrl]);

  // Load PDF.js and the document
  useEffect(() => {
    if (!pdfData) return;

    let cancelled = false;

    async function loadPdf() {
      const pdfjsLib = await import("pdfjs-dist");

      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      const doc = await pdfjsLib.getDocument({ data: pdfData! }).promise;
      if (!cancelled) {
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
      }
    }

    loadPdf().catch(() => setLoadError(true));

    return () => {
      cancelled = true;
    };
  }, [pdfData]);

  // Draw highlight rectangles on the overlay using DOM elements
  const drawHighlights = useCallback(
    (viewportWidth: number, viewportHeight: number) => {
      const overlay = overlayRef.current;
      if (!overlay) return;

      // Clear existing highlights using safe DOM method
      while (overlay.firstChild) {
        overlay.removeChild(overlay.firstChild);
      }

      const pageTags = tagsByPage[currentPage] || [];
      const pageDim = getPageDim(currentPage);

      const scaleX = viewportWidth / pageDim.width;
      const scaleY = viewportHeight / pageDim.height;

      for (const tag of pageTags) {
        const [x0, y0, x1, y1] = tag.bbox;
        const color = getTagColor(tag.type);
        const tagKey = `${tag.page}-${tag.mcid}`;
        const isSelected = selectedTagKey === tagKey;

        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.left = `${x0 * scaleX}px`;
        div.style.top = `${y0 * scaleY}px`;
        div.style.width = `${(x1 - x0) * scaleX}px`;
        div.style.height = `${(y1 - y0) * scaleY}px`;
        div.style.backgroundColor = isSelected ? color.fill.replace(/[\d.]+\)$/, "0.35)") : color.fill;
        div.style.border = isSelected ? `2px solid ${color.border}` : `1px solid ${color.border.replace(/[\d.]+\)$/, "0.3)")}`;
        div.style.borderRadius = "3px";
        div.style.pointerEvents = "none";
        div.style.transition = "all 0.2s ease";
        div.style.boxSizing = "border-box";

        if (isSelected) {
          div.style.boxShadow = `0 0 12px ${color.border}`;
          div.style.zIndex = "10";
        }

        overlay.appendChild(div);
      }
    },
    [tagsByPage, currentPage, getPageDim, selectedTagKey]
  );

  // Render current page to canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = pdfDoc as any;

    async function renderPage() {
      if (renderTaskRef.current) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (renderTaskRef.current as any).cancel();
        } catch {
          // ignore cancel errors
        }
      }

      const page = await doc.getPage(currentPage + 1);
      if (cancelled) return;

      const canvas = canvasRef.current!;
      const container = containerRef.current!;
      const ctx = canvas.getContext("2d")!;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const unscaledViewport = page.getViewport({ scale: 1 });
      const scaleW = containerWidth / unscaledViewport.width;
      const scaleH = containerHeight / unscaledViewport.height;
      const scale = Math.min(scaleW, scaleH) * 0.95;

      const viewport = page.getViewport({ scale });
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const renderTask = page.render({
        canvasContext: ctx,
        viewport,
      });
      renderTaskRef.current = renderTask;

      await renderTask.promise;
      if (cancelled) return;

      if (overlayRef.current) {
        overlayRef.current.style.width = `${viewport.width}px`;
        overlayRef.current.style.height = `${viewport.height}px`;
      }

      drawHighlights(viewport.width, viewport.height);
    }

    renderPage().catch(() => {
      if (!cancelled) setLoadError(true);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, currentPage, selectedTagKey, drawHighlights]);

  // Body scroll lock + focus management
  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => setIsVisible(true));
    setTimeout(() => closeButtonRef.current?.focus(), 50);

    return () => {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    };
  }, []);

  // Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
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

  const handleTagClick = useCallback(
    (tag: TagAssignment) => {
      const tagKey = `${tag.page}-${tag.mcid}`;
      setCurrentPage(tag.page);
      setSelectedTagKey((prev) => (prev === tagKey ? null : tagKey));
    },
    []
  );

  // Scroll the tag list item into view when selected
  useEffect(() => {
    if (!selectedTagKey || !tagListRef.current) return;
    const el = tagListRef.current.querySelector(`[data-tag-key="${selectedTagKey}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedTagKey]);

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
          {/* Left panel: PDF canvas */}
          <div className="flex flex-col border-b border-caso-border lg:w-[60%] lg:border-b-0 lg:border-r" style={{ minHeight: "40vh" }}>
            {/* Page nav */}
            <div className="flex shrink-0 items-center justify-between border-b border-caso-border/50 bg-caso-navy px-4 py-2">
              <button
                onClick={() => { setCurrentPage((p) => Math.max(0, p - 1)); setSelectedTagKey(null); }}
                disabled={currentPage === 0}
                className="flex h-7 w-7 items-center justify-center rounded-md text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white disabled:opacity-30"
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
                onClick={() => { setCurrentPage((p) => Math.min(totalPages - 1, p + 1)); setSelectedTagKey(null); }}
                disabled={currentPage >= totalPages - 1}
                className="flex h-7 w-7 items-center justify-center rounded-md text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white disabled:opacity-30"
                aria-label="Next page"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
            {/* Canvas container */}
            <div ref={containerRef} className="relative flex flex-1 items-center justify-center overflow-hidden bg-caso-navy">
              {loadError ? (
                <div className="text-sm text-caso-slate">Could not load PDF preview.</div>
              ) : !pdfDoc ? (
                <svg className="h-8 w-8 animate-spin text-caso-blue" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <div className="relative">
                  <canvas ref={canvasRef} className="block rounded shadow-lg" />
                  <div
                    ref={overlayRef}
                    className="absolute left-0 top-0"
                    style={{ pointerEvents: "none" }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Reading order */}
          <div className="flex min-h-0 flex-col lg:w-[40%]">
            <div className="shrink-0 border-b border-caso-border/50 bg-caso-navy px-4 py-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-caso-slate">
                Reading Order
              </h3>
              <p className="text-[10px] text-caso-slate/50 mt-0.5">Click a tag to highlight it on the page</p>
            </div>
            <div ref={tagListRef} className="flex-1 overflow-y-auto p-3 sm:p-4" role="list" aria-label="PDF tag reading order">
              {tagAssignments.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-caso-slate">
                  No tags found.
                </div>
              ) : (
                <div className="space-y-1">
                  {tagAssignments.map((tag) => {
                    const color = getTagColor(tag.type);
                    const tagKey = `${tag.page}-${tag.mcid}`;
                    const isSelected = selectedTagKey === tagKey;
                    const isOnCurrentPage = tag.page === currentPage;

                    return (
                      <button
                        key={tagKey}
                        data-tag-key={tagKey}
                        onClick={() => handleTagClick(tag)}
                        role="listitem"
                        className={`group w-full rounded-lg border px-2.5 py-2 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-caso-blue/60 bg-caso-blue/10 shadow-sm shadow-caso-blue/10"
                            : isOnCurrentPage
                              ? "border-caso-border/30 bg-caso-navy/60 hover:bg-caso-navy/80"
                              : "border-transparent bg-transparent hover:bg-caso-navy/40 opacity-60 hover:opacity-100"
                        }`}
                        aria-label={`${tag.type}: ${tag.text}. Page ${tag.page + 1}`}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={`mt-0.5 inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${color.bg} ${color.text} border ${color.borderClass}`}
                          >
                            {tag.type}
                          </span>
                          <div className="min-w-0 flex-1">
                            <span
                              className={`block text-left text-xs leading-relaxed ${
                                isSelected ? "text-caso-white" : isOnCurrentPage ? "text-caso-white/90" : "text-caso-slate"
                              } group-hover:text-caso-white`}
                            >
                              {tag.text.length > 100 ? tag.text.slice(0, 100) + "..." : tag.text}
                            </span>
                            <span className="mt-0.5 flex items-center gap-2 text-[10px] text-caso-slate/50">
                              <span>Page {tag.page + 1}</span>
                              <span>MCID {tag.mcid}</span>
                            </span>
                          </div>
                          {isSelected && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-caso-blue animate-pulse" />
                          )}
                        </div>
                      </button>
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
                    className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${color.bg} ${color.text} border ${color.borderClass}`}
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
