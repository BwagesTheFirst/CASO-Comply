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

type TagType = "H1" | "H2" | "H3" | "H4" | "H5" | "H6" | "P" | "Table" | "Figure" | "List" | "Artifact";
const ALL_TAG_TYPES: TagType[] = ["H1", "H2", "H3", "H4", "H5", "H6", "P", "Table", "Figure", "List", "Artifact"];

interface PageDimension {
  page: number;
  width: number;
  height: number;
}

interface VerificationResult {
  tag_assignments: TagAssignment[];
  verification?: {
    issues_found: string[];
    verification_score: number;
  };
}

interface PdfViewerProps {
  downloadUrl: string;
  tagAssignments: TagAssignment[];
  pageDimensions: PageDimension[];
  title?: string;
  onClose: () => void;
  editable?: boolean;
  onSave?: (tags: TagAssignment[]) => void;
  onVerify?: () => Promise<VerificationResult>;
}

const TAG_HIGHLIGHT_COLORS: Record<string, { fill: string; border: string; bg: string; text: string; borderClass: string }> = {
  H1: { fill: "rgba(59, 130, 246, 0.18)", border: "rgba(59, 130, 246, 0.6)", bg: "bg-blue-500/20", text: "text-blue-400", borderClass: "border-blue-500/30" },
  H2: { fill: "rgba(20, 184, 166, 0.18)", border: "rgba(20, 184, 166, 0.6)", bg: "bg-teal-500/20", text: "text-teal-400", borderClass: "border-teal-500/30" },
  H3: { fill: "rgba(6, 182, 212, 0.18)", border: "rgba(6, 182, 212, 0.6)", bg: "bg-cyan-500/20", text: "text-cyan-400", borderClass: "border-cyan-500/30" },
  P: { fill: "rgba(148, 163, 184, 0.12)", border: "rgba(148, 163, 184, 0.4)", bg: "bg-slate-500/20", text: "text-slate-400", borderClass: "border-slate-500/30" },
  Table: { fill: "rgba(168, 85, 247, 0.18)", border: "rgba(168, 85, 247, 0.6)", bg: "bg-purple-500/20", text: "text-purple-400", borderClass: "border-purple-500/30" },
  Figure: { fill: "rgba(249, 115, 22, 0.18)", border: "rgba(249, 115, 22, 0.6)", bg: "bg-orange-500/20", text: "text-orange-400", borderClass: "border-orange-500/30" },
  H4: { fill: "rgba(99, 102, 241, 0.18)", border: "rgba(99, 102, 241, 0.6)", bg: "bg-indigo-500/20", text: "text-indigo-400", borderClass: "border-indigo-500/30" },
  H5: { fill: "rgba(139, 92, 246, 0.18)", border: "rgba(139, 92, 246, 0.6)", bg: "bg-violet-500/20", text: "text-violet-400", borderClass: "border-violet-500/30" },
  H6: { fill: "rgba(192, 132, 252, 0.18)", border: "rgba(192, 132, 252, 0.6)", bg: "bg-purple-300/20", text: "text-purple-300", borderClass: "border-purple-300/30" },
  List: { fill: "rgba(34, 197, 94, 0.18)", border: "rgba(34, 197, 94, 0.6)", bg: "bg-green-500/20", text: "text-green-400", borderClass: "border-green-500/30" },
  Artifact: { fill: "rgba(115, 115, 115, 0.12)", border: "rgba(115, 115, 115, 0.4)", bg: "bg-neutral-500/20", text: "text-neutral-400", borderClass: "border-neutral-500/30" },
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

// --- Verification step progress types ---
type StepStatus = "waiting" | "active" | "complete";

interface VerificationStep {
  label: string;
  status: StepStatus;
}

const VERIFICATION_STEPS: string[] = [
  "Rendering pages as images",
  "Analyzing heading hierarchy",
  "Checking reading order",
  "Generating alt text",
  "Validating tag assignments",
];

const STEP_TIMINGS = [1500, 3000, 4500, 6000, 7500]; // ms from start

// --- AI Verification Progress Component ---
function VerificationProgress({
  steps,
  currentStepLabel,
}: {
  steps: VerificationStep[];
  currentStepLabel: string;
}) {
  return (
    <div className="flex flex-col items-center px-4 py-8" role="status" aria-live="polite" aria-label={currentStepLabel}>
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 ring-1 ring-amber-500/20">
        <svg className="h-6 w-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </div>
      <h4 className="mb-1 text-sm font-bold text-caso-white">AI Verification in Progress</h4>
      <p className="mb-6 text-[11px] text-caso-slate">Analyzing your document with AI vision</p>

      <div className="w-full max-w-xs space-y-3">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-500 ${
              step.status === "complete"
                ? "bg-caso-green/5"
                : step.status === "active"
                  ? "bg-amber-500/5"
                  : "bg-transparent"
            }`}
          >
            {/* Status icon */}
            <div className="flex h-5 w-5 shrink-0 items-center justify-center">
              {step.status === "complete" ? (
                <svg
                  className="h-4 w-4 text-caso-green animate-[slideCheckIn_0.3s_ease-out]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : step.status === "active" ? (
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-50" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400" />
                </span>
              ) : (
                <span className="h-2 w-2 rounded-full bg-caso-slate/30" />
              )}
            </div>

            {/* Label */}
            <span
              className={`flex-1 text-xs font-medium transition-colors duration-300 ${
                step.status === "complete"
                  ? "text-caso-green"
                  : step.status === "active"
                    ? "text-amber-300"
                    : "text-caso-slate/40"
              }`}
            >
              Step {i + 1}: {step.label}
            </span>

            {/* Done badge */}
            {step.status === "complete" && (
              <span className="text-[10px] font-medium text-caso-green/70 animate-[fadeIn_0.3s_ease-out]">
                done
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Verification summary bar ---
function VerificationSummary({
  correctedCount,
  confirmedCount,
  onDismiss,
}: {
  correctedCount: number;
  confirmedCount: number;
  onDismiss?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-caso-green/20 bg-caso-green/5 px-3 py-2 animate-[fadeIn_0.5s_ease-out]">
      <svg className="h-4 w-4 shrink-0 text-caso-green" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
      </svg>
      <span className="flex-1 text-[11px] text-caso-slate">
        {correctedCount > 0 && (
          <span className="font-semibold text-amber-400">AI corrected {correctedCount} tag{correctedCount !== 1 ? "s" : ""}</span>
        )}
        {correctedCount > 0 && confirmedCount > 0 && ", "}
        {confirmedCount > 0 && (
          <span className="font-semibold text-caso-green">confirmed {confirmedCount} tag{confirmedCount !== 1 ? "s" : ""}</span>
        )}
      </span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-caso-slate/40 hover:text-caso-slate transition-colors" aria-label="Dismiss summary">
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
        </button>
      )}
    </div>
  );
}

// --- Confidence badge (small inline icon) ---
function ConfidenceBadge({ status }: { status: "confirmed" | "corrected" }) {
  if (status === "confirmed") {
    return (
      <span title="AI confirmed" className="inline-flex items-center">
        <svg className="h-3 w-3 text-caso-green" viewBox="0 0 20 20" fill="currentColor" aria-label="AI confirmed">
          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
        </svg>
      </span>
    );
  }
  return (
    <span title="AI corrected" className="inline-flex items-center">
      <svg className="h-3 w-3 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-label="AI corrected">
        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
      </svg>
    </span>
  );
}

export default function PdfViewer({ downloadUrl, tagAssignments, pageDimensions, title, onClose, editable = false, onSave, onVerify }: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedTagKey, setSelectedTagKey] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<unknown>(null);
  const [totalPages, setTotalPages] = useState(1);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editedTags, setEditedTags] = useState<Map<string, Partial<TagAssignment>>>(new Map());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // --- AI Verification state ---
  const [verificationState, setVerificationState] = useState<"idle" | "running" | "complete">("idle");
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>(
    VERIFICATION_STEPS.map((label) => ({ label, status: "waiting" as StepStatus }))
  );
  const [showProgress, setShowProgress] = useState(false);
  const [verificationDiff, setVerificationDiff] = useState<Map<string, "confirmed" | "corrected">>(new Map());
  const [showSummary, setShowSummary] = useState(false);
  const [highlightedTags, setHighlightedTags] = useState<Set<string>>(new Set());
  const stepTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const apiCompleteRef = useRef(false);

  const liveTags = useMemo(() => {
    if (editedTags.size === 0) return tagAssignments;
    return tagAssignments.map((tag) => {
      const key = `${tag.page}-${tag.mcid}`;
      const edits = editedTags.get(key);
      return edits ? { ...tag, ...edits } : tag;
    });
  }, [tagAssignments, editedTags]);

  const updateTag = useCallback((tagKey: string, updates: Partial<TagAssignment>) => {
    setEditedTags((prev) => {
      const next = new Map(prev);
      const existing = next.get(tagKey) || {};
      next.set(tagKey, { ...existing, ...updates });
      return next;
    });
    setHasUnsavedChanges(true);
  }, []);

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
    for (const tag of liveTags) {
      if (!grouped[tag.page]) grouped[tag.page] = [];
      grouped[tag.page].push(tag);
    }
    return grouped;
  }, [liveTags]);

  const pageNumbers = useMemo(() => {
    const pages = new Set(liveTags.map((t) => t.page));
    return Array.from(pages).sort((a, b) => a - b);
  }, [liveTags]);

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
    for (const tag of liveTags) {
      typeCounts[tag.type] = (typeCounts[tag.type] || 0) + 1;
    }
    const maxPage = pageDimensions.length > 0 ? pageDimensions.length : (pageNumbers.length > 0 ? Math.max(...pageNumbers) + 1 : 1);
    return { total: liveTags.length, typeCounts, pages: maxPage };
  }, [liveTags, pageDimensions, pageNumbers]);

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

  // Close tag-type dropdown on click-away
  useEffect(() => {
    if (!openDropdown) return;
    const handleClick = () => setOpenDropdown(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [openDropdown]);

  // Task 5: Heading level validation warnings
  const headingWarnings = useMemo(() => {
    const warnings: Map<string, string> = new Map();
    const headingTags = liveTags.filter((t) => /^H[1-6]$/.test(t.type));
    for (let i = 1; i < headingTags.length; i++) {
      const prev = parseInt(headingTags[i - 1].type.slice(1));
      const curr = parseInt(headingTags[i].type.slice(1));
      if (curr > prev + 1) {
        const key = `${headingTags[i].page}-${headingTags[i].mcid}`;
        warnings.set(key, `Heading skip: ${headingTags[i - 1].type} \u2192 ${headingTags[i].type}`);
      }
    }
    return warnings;
  }, [liveTags]);

  // Cleanup step timers on unmount
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      stepTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  // --- AI Verification handler ---
  const handleRunVerification = useCallback(async () => {
    if (!onVerify || verificationState === "running") return;

    // Reset state
    setVerificationState("running");
    setShowProgress(true);
    apiCompleteRef.current = false;
    setVerificationDiff(new Map());
    setShowSummary(false);
    setHighlightedTags(new Set());

    // Initialize steps
    const initialSteps = VERIFICATION_STEPS.map((label) => ({ label, status: "waiting" as StepStatus }));
    initialSteps[0].status = "active";
    setVerificationSteps([...initialSteps]);

    // Start fake step timers
    const timers: ReturnType<typeof setTimeout>[] = [];
    stepTimersRef.current = timers;

    for (let i = 0; i < STEP_TIMINGS.length; i++) {
      const timer = setTimeout(() => {
        if (apiCompleteRef.current) return; // API already resolved, skip
        setVerificationSteps((prev) => {
          const next = [...prev];
          // Complete current step
          next[i] = { ...next[i], status: "complete" };
          // Activate next step if exists
          if (i + 1 < next.length) {
            next[i + 1] = { ...next[i + 1], status: "active" };
          }
          return next;
        });
      }, STEP_TIMINGS[i]);
      timers.push(timer);
    }

    // Start real API call
    try {
      const result = await onVerify();
      apiCompleteRef.current = true;

      // Clear remaining timers
      timers.forEach(clearTimeout);

      // Quickly cascade remaining incomplete steps
      const completeRemaining = async () => {
        for (let i = 0; i < VERIFICATION_STEPS.length; i++) {
          await new Promise<void>((resolve) => {
            setTimeout(() => {
              setVerificationSteps((prev) => {
                const next = [...prev];
                if (next[i].status !== "complete") {
                  next[i] = { ...next[i], status: "complete" };
                }
                // Activate the next if needed
                if (i + 1 < next.length && next[i + 1].status === "waiting") {
                  next[i + 1] = { ...next[i + 1], status: "active" };
                }
                return next;
              });
              resolve();
            }, 200);
          });
        }
      };
      await completeRemaining();

      // Wait a moment before transitioning
      await new Promise((r) => setTimeout(r, 600));

      // Compute diff between old tags and new tags
      const diffMap = new Map<string, "confirmed" | "corrected">();
      const newTags = result.tag_assignments;
      const oldTagMap = new Map<string, string>();
      for (const tag of tagAssignments) {
        oldTagMap.set(`${tag.page}-${tag.mcid}`, tag.type);
      }
      const changedKeys = new Set<string>();
      for (const tag of newTags) {
        const key = `${tag.page}-${tag.mcid}`;
        const oldType = oldTagMap.get(key);
        if (oldType && oldType !== tag.type) {
          diffMap.set(key, "corrected");
          changedKeys.add(key);
        } else {
          diffMap.set(key, "confirmed");
        }
      }

      setVerificationDiff(diffMap);
      setHighlightedTags(changedKeys);
      setShowSummary(true);

      // Apply corrected tags as edits so liveTags reflects the AI corrections
      const newEdits = new Map(editedTags);
      for (const tag of newTags) {
        const key = `${tag.page}-${tag.mcid}`;
        const oldType = oldTagMap.get(key);
        if (oldType && oldType !== tag.type) {
          newEdits.set(key, { type: tag.type as TagType });
        }
      }
      if (newEdits.size > 0) {
        setEditedTags(newEdits);
      }

      // Fade out progress, fade in tags
      setShowProgress(false);
      setVerificationState("complete");

      // Clear highlight animation after 2s
      setTimeout(() => {
        setHighlightedTags(new Set());
      }, 2000);
    } catch {
      // On error, reset
      timers.forEach(clearTimeout);
      setVerificationState("idle");
      setShowProgress(false);
    }
  }, [onVerify, verificationState, tagAssignments]);

  // Compute summary counts
  const correctedCount = useMemo(() => {
    let count = 0;
    verificationDiff.forEach((v) => { if (v === "corrected") count++; });
    return count;
  }, [verificationDiff]);

  const confirmedCount = useMemo(() => {
    let count = 0;
    verificationDiff.forEach((v) => { if (v === "confirmed") count++; });
    return count;
  }, [verificationDiff]);

  // Active step label for aria
  const currentStepLabel = useMemo(() => {
    const active = verificationSteps.find((s) => s.status === "active");
    return active ? `Running: ${active.label}` : "AI verification in progress";
  }, [verificationSteps]);

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
      {/* Inline keyframes for animations */}
      <style>{`
        @keyframes slideCheckIn {
          from { transform: scale(0) rotate(-45deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes amberFlash {
          0% { background-color: rgba(245, 158, 11, 0.15); }
          50% { background-color: rgba(245, 158, 11, 0.25); }
          100% { background-color: transparent; }
        }
        .tag-highlight-flash {
          animation: amberFlash 2s ease-out forwards;
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-slide-in {
          animation: fadeSlideIn 0.4s ease-out forwards;
        }
        .fade-slide-out {
          animation: fadeSlideIn 0.3s ease-out reverse forwards;
        }
      `}</style>

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

            {/* AI Verification Banner — shown in editable mode when onVerify is available and not yet run */}
            {editable && onVerify && verificationState === "idle" && (
              <div className="shrink-0 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent px-4 py-3 fade-slide-in">
                <p className="text-[11px] text-caso-slate leading-relaxed mb-2.5">
                  Tags were auto-assigned by font size. Run AI Verification to validate heading hierarchy, reading order, and generate alt text.
                </p>
                <button
                  onClick={handleRunVerification}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-caso-navy shadow-lg shadow-amber-500/15 transition-all hover:from-amber-400 hover:to-amber-500 hover:shadow-xl hover:shadow-amber-500/25"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Run AI Verification
                </button>
              </div>
            )}

            {/* Verification summary bar — shown after verification completes */}
            {editable && verificationState === "complete" && showSummary && (
              <div className="shrink-0 border-b border-caso-border/50 px-4 py-2">
                <VerificationSummary
                  correctedCount={correctedCount}
                  confirmedCount={confirmedCount}
                  onDismiss={() => setShowSummary(false)}
                />
              </div>
            )}

            <div ref={tagListRef} className="flex-1 overflow-y-auto p-3 sm:p-4" role="list" aria-label="PDF tag reading order">
              {/* Show progress animation when verification is running */}
              {showProgress && (
                <div className="fade-slide-in">
                  <VerificationProgress steps={verificationSteps} currentStepLabel={currentStepLabel} />
                </div>
              )}

              {/* Tag list — hidden during verification progress */}
              {!showProgress && (
                <>
                  {liveTags.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-caso-slate">
                      No tags found.
                    </div>
                  ) : (
                    <div className={`space-y-1 ${verificationState === "complete" ? "fade-slide-in" : ""}`}>
                      {liveTags.map((tag) => {
                        const color = getTagColor(tag.type);
                        const tagKey = `${tag.page}-${tag.mcid}`;
                        const isSelected = selectedTagKey === tagKey;
                        const isOnCurrentPage = tag.page === currentPage;
                        const aiStatus = verificationDiff.get(tagKey);
                        const isHighlighted = highlightedTags.has(tagKey);

                        return (
                        editable ? (
                          <div
                            key={tagKey}
                            data-tag-key={tagKey}
                            onClick={() => handleTagClick(tag)}
                            role="listitem"
                            className={`group w-full rounded-lg border px-2.5 py-2 text-left transition-all cursor-pointer ${
                              isHighlighted ? "tag-highlight-flash" : ""
                            } ${
                              isSelected
                                ? "border-caso-blue/60 bg-caso-blue/10 shadow-sm shadow-caso-blue/10"
                                : isOnCurrentPage
                                  ? "border-caso-border/30 bg-caso-navy/60 hover:bg-caso-navy/80"
                                  : "border-transparent bg-transparent hover:bg-caso-navy/40 opacity-60 hover:opacity-100"
                            }`}
                            aria-label={`${tag.type}: ${tag.text}. Page ${tag.page + 1}`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="relative mt-0.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdown((prev) => (prev === tagKey ? null : tagKey));
                                  }}
                                  className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${color.bg} ${color.text} border ${color.borderClass} hover:brightness-125 transition-all`}
                                >
                                  {tag.type}
                                  {/* AI confidence badge inline with tag type */}
                                  {verificationState === "complete" && aiStatus && (
                                    <ConfidenceBadge status={aiStatus} />
                                  )}
                                  <svg className="h-2.5 w-2.5 opacity-60" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                {openDropdown === tagKey && (
                                  <div
                                    className="absolute left-0 top-full z-20 mt-1 rounded-lg border border-caso-border bg-caso-navy-light shadow-xl shadow-black/40 py-1 min-w-[100px]"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {ALL_TAG_TYPES.map((t) => {
                                      const optColor = getTagColor(t);
                                      return (
                                        <button
                                          key={t}
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            updateTag(tagKey, { type: t });
                                            setOpenDropdown(null);
                                          }}
                                          className={`w-full px-3 py-1 text-left text-xs hover:bg-white/5 flex items-center gap-2 ${optColor.text}`}
                                        >
                                          {tag.type === t ? (
                                            <svg className="h-3 w-3 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                            </svg>
                                          ) : (
                                            <span className="h-3 w-3" />
                                          )}
                                          {t}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span
                                  className={`block text-left text-xs leading-relaxed ${
                                    tag.type === "Artifact" ? "line-through opacity-40" : ""
                                  } ${
                                    isSelected ? "text-caso-white" : isOnCurrentPage ? "text-caso-white/90" : "text-caso-slate"
                                  } group-hover:text-caso-white`}
                                >
                                  {tag.text.length > 100 ? tag.text.slice(0, 100) + "..." : tag.text}
                                </span>
                                <span className="mt-0.5 flex items-center gap-2 text-[10px] text-caso-slate/50">
                                  <span>Page {tag.page + 1}</span>
                                  <span>MCID {tag.mcid}</span>
                                </span>
                                {/* Task 5: Heading level skip warning */}
                                {headingWarnings.has(tagKey) && (
                                  <span className="mt-0.5 flex items-center gap-1 text-[10px] text-caso-warm">
                                    <svg className="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    {headingWarnings.get(tagKey)}
                                  </span>
                                )}
                              </div>
                              {/* Task 4: Mark as decorative / artifact button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateTag(tagKey, { type: tag.type === "Artifact" ? "Figure" : "Artifact" });
                                }}
                                title={tag.type === "Artifact" ? "Restore from decorative" : "Mark as decorative (hide from screen readers)"}
                                className="shrink-0 rounded px-1.5 py-0.5 text-[10px] text-caso-slate/60 hover:text-caso-white hover:bg-caso-navy-light transition-colors"
                              >
                                {tag.type === "Artifact" ? (
                                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                            {/* Task 3: Alt text inline editing for Figure tags */}
                            {tag.type === "Figure" && (
                              <div className="mt-1.5" onClick={(e) => e.stopPropagation()}>
                                <label className="block text-[10px] text-caso-slate/60 mb-0.5">Alt text</label>
                                <textarea
                                  value={tag.text}
                                  onChange={(e) => updateTag(tagKey, { text: e.target.value })}
                                  placeholder="Describe this image for screen readers..."
                                  rows={2}
                                  className="w-full rounded-md border border-caso-border bg-caso-navy px-2 py-1.5 text-xs text-caso-white placeholder:text-caso-slate/40 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue/50 resize-none"
                                />
                                {(!tag.text || !tag.text.trim()) && (
                                  <span className="mt-0.5 flex items-center gap-1 text-[10px] text-red-400">
                                    <svg className="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    Missing alt text — required for accessibility
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
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
                        )
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-caso-border bg-caso-navy-light px-4 py-2.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
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
            {editable && headingWarnings.size > 0 && (
              <>
                <span className="text-caso-border" aria-hidden="true">|</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-caso-warm">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  {headingWarnings.size} heading skip{headingWarnings.size !== 1 ? "s" : ""}
                </span>
              </>
            )}
            {editable && verificationState === "complete" && (
              <>
                <span className="text-caso-border" aria-hidden="true">|</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-caso-green">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  AI Verified
                </span>
              </>
            )}
          </div>
          {editable && (
            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-orange-400">
                  <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                  Unsaved changes
                </span>
              )}
              <button
                onClick={() => {
                  setEditedTags(new Map());
                  setHasUnsavedChanges(false);
                }}
                disabled={!hasUnsavedChanges}
                className="rounded-lg border border-caso-border px-3 py-1.5 text-xs font-semibold text-caso-slate transition-colors hover:bg-caso-navy hover:text-caso-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Discard
              </button>
              <button
                onClick={() => {
                  onSave?.(liveTags);
                  setHasUnsavedChanges(false);
                }}
                disabled={!hasUnsavedChanges}
                className="rounded-lg bg-caso-blue px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-caso-blue-bright disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
