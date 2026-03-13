"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PdfViewer from "@/components/PdfViewer";

// ── Types ──────────────────────────────────────────────────────────────────

type NodeType = "document" | "page" | "heading" | "paragraph" | "image" | "table" | "table-row" | "list" | "list-item";
type Severity = "error" | "warning" | "info";
type ReviewStatus = "pending_review" | "in_review" | "completed";

interface StructureNode {
  id: string;
  type: NodeType;
  label: string;
  content?: string;
  altText?: string;
  headingLevel?: number;
  children?: StructureNode[];
  page?: number;
  tableSize?: { rows: number; cols: number };
  headerRow?: string[];
}

interface AccessibilityIssue {
  id: string;
  severity: Severity;
  description: string;
  nodeId: string;
  page: number;
}

// ── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_REVIEW = {
  id: "rev-001",
  filename: "annual-report-2025.pdf",
  format: "PDF",
  pageCount: 3,
  scoreBefore: 42,
  scoreAfter: 87,
  status: "in_review" as ReviewStatus,
  tenant: "City of Springfield",
  submittedAt: "2026-02-28T14:30:00Z",
};

const MOCK_STRUCTURE: StructureNode = {
  id: "root",
  type: "document",
  label: "Document",
  content: "annual-report-2025.pdf",
  children: [
    { id: "meta-title", type: "heading", label: "Title", content: "Annual Report 2025", headingLevel: 1 },
    { id: "meta-lang", type: "paragraph", label: "Language", content: "en-US" },
    {
      id: "page-1",
      type: "page",
      label: "Page 1",
      page: 1,
      children: [
        { id: "p1-h1", type: "heading", label: "H1", content: "Introduction to Annual Compliance Review", headingLevel: 1, page: 1 },
        { id: "p1-p1", type: "paragraph", label: "P", content: "This report summarizes the City of Springfield's ongoing efforts to ensure digital accessibility compliance across all public-facing documents and web properties.", page: 1 },
        { id: "p1-p2", type: "paragraph", label: "P", content: "In accordance with ADA Title II requirements, all government entities serving populations over 50,000 must achieve WCAG 2.1 AA compliance by April 24, 2026.", page: 1 },
        { id: "p1-img1", type: "image", label: "IMG", content: "[City seal graphic]", altText: "Official seal of the City of Springfield", page: 1 },
        {
          id: "p1-table1",
          type: "table",
          label: "Table",
          content: "Compliance Summary by Department",
          page: 1,
          tableSize: { rows: 4, cols: 3 },
          headerRow: ["Department", "Documents Reviewed", "Compliance Rate"],
          children: [
            { id: "p1-t1-r1", type: "table-row", label: "Row 1", content: "Public Works | 47 | 89%", page: 1 },
            { id: "p1-t1-r2", type: "table-row", label: "Row 2", content: "Parks & Recreation | 32 | 76%", page: 1 },
            { id: "p1-t1-r3", type: "table-row", label: "Row 3", content: "City Clerk | 61 | 94%", page: 1 },
          ],
        },
      ],
    },
    {
      id: "page-2",
      type: "page",
      label: "Page 2",
      page: 2,
      children: [
        { id: "p2-h2", type: "heading", label: "H2", content: "Remediation Progress", headingLevel: 2, page: 2 },
        { id: "p2-p1", type: "paragraph", label: "P", content: "Over the past fiscal year, the city has remediated 847 documents across 12 departments, achieving an average compliance score improvement of 34 points.", page: 2 },
        { id: "p2-h3-bad", type: "heading", label: "H4", content: "Key Milestones", headingLevel: 4, page: 2 },
        {
          id: "p2-list1",
          type: "list",
          label: "List",
          content: "Milestones list (4 items)",
          page: 2,
          children: [
            { id: "p2-li1", type: "list-item", label: "LI", content: "Q1: Completed initial audit of all public PDF documents", page: 2 },
            { id: "p2-li2", type: "list-item", label: "LI", content: "Q2: Deployed automated remediation pipeline", page: 2 },
            { id: "p2-li3", type: "list-item", label: "LI", content: "Q3: Trained departmental staff on accessibility best practices", page: 2 },
            { id: "p2-li4", type: "list-item", label: "LI", content: "Q4: Achieved 85% average compliance across all departments", page: 2 },
          ],
        },
        { id: "p2-img1", type: "image", label: "IMG", content: "[Bar chart showing progress]", altText: "", page: 2 },
      ],
    },
    {
      id: "page-3",
      type: "page",
      label: "Page 3",
      page: 3,
      children: [
        { id: "p3-h2", type: "heading", label: "H2", content: "Next Steps and Recommendations", headingLevel: 2, page: 3 },
        { id: "p3-p1", type: "paragraph", label: "P", content: "The following recommendations are provided to ensure continued compliance momentum through the upcoming fiscal year.", page: 3 },
        { id: "p3-p2", type: "paragraph", label: "P", content: "Priority should be given to the Parks & Recreation and Finance departments, which currently have the lowest compliance scores among major departments.", page: 3 },
        { id: "p3-img1", type: "image", label: "IMG", content: "[Organizational chart]", altText: "Organizational chart showing accessibility compliance team structure", page: 3 },
        { id: "p3-p3", type: "paragraph", label: "P", content: "For questions regarding this report, contact the ADA Compliance Coordinator at ada@springfield.gov.", page: 3 },
      ],
    },
  ],
};

const MOCK_ISSUES: AccessibilityIssue[] = [
  { id: "issue-1", severity: "error", description: "Image on page 2 missing alt text", nodeId: "p2-img1", page: 2 },
  { id: "issue-2", severity: "warning", description: "Heading level skipped (H2 \u2192 H4) on page 2", nodeId: "p2-h3-bad", page: 2 },
  { id: "issue-3", severity: "info", description: "Table on page 1 has header row properly defined", nodeId: "p1-table1", page: 1 },
  { id: "issue-4", severity: "warning", description: "Document title metadata should match visible H1", nodeId: "meta-title", page: 1 },
];

const MOCK_TAG_ASSIGNMENTS = [
  { type: "H1", text: "Annual Budget Report FY2025", page: 0, mcid: 0, font_size: 24, bbox: [72, 72, 540, 110] as [number, number, number, number] },
  { type: "P", text: "Prepared by the Office of Financial Management for public review and comment.", page: 0, mcid: 1, font_size: 12, bbox: [72, 120, 540, 145] as [number, number, number, number] },
  { type: "H2", text: "Executive Summary", page: 0, mcid: 2, font_size: 18, bbox: [72, 170, 300, 200] as [number, number, number, number] },
  { type: "P", text: "This report summarizes the proposed budget allocations for fiscal year 2025, including departmental breakdowns and capital improvement projects.", page: 0, mcid: 3, font_size: 12, bbox: [72, 210, 540, 260] as [number, number, number, number] },
  { type: "Figure", text: "", page: 0, mcid: 4, font_size: 0, bbox: [72, 280, 540, 500] as [number, number, number, number] },
  { type: "Table", text: "Department | Budget | Change\nPublic Works | $2.4M | +5%\nParks & Rec | $1.1M | +3%", page: 1, mcid: 5, font_size: 11, bbox: [72, 72, 540, 250] as [number, number, number, number] },
  { type: "H2", text: "Capital Projects", page: 1, mcid: 6, font_size: 18, bbox: [72, 270, 350, 300] as [number, number, number, number] },
  { type: "P", text: "The following capital improvement projects have been approved for the upcoming fiscal year.", page: 1, mcid: 7, font_size: 12, bbox: [72, 310, 540, 350] as [number, number, number, number] },
];

// ── SVG Icons ──────────────────────────────────────────────────────────────

function ChevronIcon({ open, className = "" }: { open: boolean; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-150 ${open ? "rotate-90" : ""} ${className}`}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function nodeIcon(type: NodeType) {
  switch (type) {
    case "document":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-caso-blue shrink-0">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
    case "page":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-caso-slate shrink-0">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        </svg>
      );
    case "heading":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-caso-warm shrink-0">
          <path d="M6 4v16" /><path d="M18 4v16" /><path d="M6 12h12" />
        </svg>
      );
    case "paragraph":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-caso-slate shrink-0">
          <line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" />
        </svg>
      );
    case "image":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-caso-green shrink-0">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case "table":
    case "table-row":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-caso-blue shrink-0">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" />
        </svg>
      );
    case "list":
    case "list-item":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-caso-slate shrink-0">
          <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      );
    default:
      return null;
  }
}

function severityIcon(severity: Severity) {
  switch (severity) {
    case "error":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-caso-red shrink-0">
          <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    case "warning":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-caso-warm shrink-0">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case "info":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-caso-blue shrink-0">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
}

// ── Status badge helper ────────────────────────────────────────────────────

function statusBadge(status: ReviewStatus) {
  switch (status) {
    case "pending_review":
      return "bg-caso-warm/10 text-caso-warm";
    case "in_review":
      return "bg-caso-blue/10 text-caso-blue";
    case "completed":
      return "bg-caso-green/10 text-caso-green";
    default:
      return "bg-caso-slate/10 text-caso-slate";
  }
}

function statusLabel(status: ReviewStatus) {
  switch (status) {
    case "pending_review": return "Pending Review";
    case "in_review": return "In Review";
    case "completed": return "Completed";
    default: return status;
  }
}

// ── Tree Node Component ────────────────────────────────────────────────────

function TreeNode({
  node,
  depth,
  expandedNodes,
  toggleNode,
  highlightedNode,
  onHighlight,
  onUpdateAltText,
  onUpdateHeadingLevel,
}: {
  node: StructureNode;
  depth: number;
  expandedNodes: Set<string>;
  toggleNode: (id: string) => void;
  highlightedNode: string | null;
  onHighlight: (id: string) => void;
  onUpdateAltText: (id: string, altText: string) => void;
  onUpdateHeadingLevel: (id: string, level: number) => void;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const isHighlighted = highlightedNode === node.id;
  const contentPreview = node.content ? (node.content.length > 50 ? node.content.slice(0, 50) + "..." : node.content) : "";

  return (
    <div>
      <div
        className={`group flex items-start gap-1.5 py-1 px-2 rounded-md cursor-pointer transition-colors ${
          isHighlighted
            ? "bg-caso-blue/10 border border-caso-blue/30"
            : "hover:bg-white/[0.04] border border-transparent"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onHighlight(node.id)}
      >
        {/* Expand/collapse toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) toggleNode(node.id);
          }}
          className={`mt-0.5 shrink-0 ${hasChildren ? "opacity-60 hover:opacity-100" : "opacity-0 pointer-events-none"}`}
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          <ChevronIcon open={isExpanded} />
        </button>

        {/* Type icon */}
        <span className="mt-0.5">{nodeIcon(node.type)}</span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-caso-slate/70 uppercase">
              {node.label}
            </span>

            {/* Heading level dropdown */}
            {node.type === "heading" && node.headingLevel !== undefined && (
              <select
                value={node.headingLevel}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.stopPropagation();
                  onUpdateHeadingLevel(node.id, parseInt(e.target.value, 10));
                }}
                className="rounded border border-caso-border bg-caso-navy px-1.5 py-0.5 text-xs text-caso-white focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors"
              >
                {[1, 2, 3, 4, 5, 6].map((l) => (
                  <option key={l} value={l}>H{l}</option>
                ))}
              </select>
            )}

            {/* Table size badge */}
            {node.type === "table" && node.tableSize && (
              <span className="text-[10px] font-mono text-caso-slate/50 bg-caso-slate/10 px-1.5 py-0.5 rounded">
                {node.tableSize.rows}x{node.tableSize.cols}
              </span>
            )}
          </div>

          {/* Content preview */}
          {contentPreview && node.type !== "image" && (
            <p className="text-sm text-caso-white/70 truncate mt-0.5">
              {contentPreview}
            </p>
          )}

          {/* Table header row preview */}
          {node.type === "table" && node.headerRow && (
            <div className="flex gap-1 mt-1">
              {node.headerRow.map((col, i) => (
                <span key={i} className="text-[10px] font-mono text-caso-slate bg-caso-slate/10 px-1.5 py-0.5 rounded">
                  {col}
                </span>
              ))}
            </div>
          )}

          {/* Image alt-text editor */}
          {node.type === "image" && (
            <div className="mt-1">
              <p className="text-xs text-caso-slate/60 mb-1">{node.content}</p>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-caso-slate/70 uppercase shrink-0">Alt:</label>
                <input
                  type="text"
                  value={node.altText ?? ""}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onUpdateAltText(node.id, e.target.value)}
                  placeholder="Enter alt text..."
                  className={`flex-1 rounded border px-2 py-1 text-xs text-caso-white bg-caso-navy focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue transition-colors ${
                    !node.altText ? "border-caso-red/50 placeholder:text-caso-red/40" : "border-caso-border"
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              highlightedNode={highlightedNode}
              onHighlight={onHighlight}
              onUpdateAltText={onUpdateAltText}
              onUpdateHeadingLevel={onUpdateHeadingLevel}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page Component ────────────────────────────────────────────────────

export default function ReviewEditorPage() {
  const params = useParams();
  const reviewId = params.id as string;

  // State
  const [review] = useState(MOCK_REVIEW);
  const [structure, setStructure] = useState<StructureNode>(MOCK_STRUCTURE);
  const [issues] = useState<AccessibilityIssue[]>(MOCK_ISSUES);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(["root", "page-1", "page-2", "page-3"])
  );
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [scoreAfter, setScoreAfter] = useState(review.scoreAfter);
  const [tagAssignments, setTagAssignments] = useState(MOCK_TAG_ASSIGNMENTS);
  const [applyingEdits, setApplyingEdits] = useState(false);

  const toggleNode = useCallback((id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Deep-update a node in the tree
  function updateNodeInTree(root: StructureNode, id: string, updater: (n: StructureNode) => StructureNode): StructureNode {
    if (root.id === id) return updater(root);
    if (!root.children) return root;
    return {
      ...root,
      children: root.children.map((child) => updateNodeInTree(child, id, updater)),
    };
  }

  function handleUpdateAltText(nodeId: string, altText: string) {
    setStructure((prev) => updateNodeInTree(prev, nodeId, (n) => ({ ...n, altText })));
    setHasUnsavedChanges(true);
  }

  function handleUpdateHeadingLevel(nodeId: string, level: number) {
    setStructure((prev) =>
      updateNodeInTree(prev, nodeId, (n) => ({
        ...n,
        headingLevel: level,
        label: `H${level}`,
      }))
    );
    setHasUnsavedChanges(true);
  }

  function handleJumpToNode(nodeId: string) {
    // Expand all ancestors to make the node visible
    const pathIds = findNodePath(structure, nodeId);
    if (pathIds) {
      setExpandedNodes((prev) => {
        const next = new Set(prev);
        pathIds.forEach((id) => next.add(id));
        return next;
      });
    }
    setHighlightedNode(nodeId);
  }

  function findNodePath(root: StructureNode, targetId: string, path: string[] = []): string[] | null {
    if (root.id === targetId) return [...path, root.id];
    if (!root.children) return null;
    for (const child of root.children) {
      const result = findNodePath(child, targetId, [...path, root.id]);
      if (result) return result;
    }
    return null;
  }

  async function handleSave() {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSaving(false);
    setHasUnsavedChanges(false);
  }

  async function handleApprove() {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSaving(false);
    setHasUnsavedChanges(false);
  }

  // Suppress unused var lint
  void reviewId;
  void applyingEdits;

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-[1600px]">
      {/* ── Back link ──────────────────────────────────────────────────── */}
      <Link
        href="/dashboard/admin/reviews"
        className="inline-flex items-center gap-1 text-sm text-caso-blue hover:text-caso-blue-bright transition-colors mb-4 shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Review Queue
      </Link>

      {/* ── Document Info Header ───────────────────────────────────────── */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border p-4 mb-4 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* File icon */}
            <div className="w-10 h-10 rounded-lg bg-caso-blue/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-caso-blue">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                {review.filename}
              </h1>
              <div className="flex items-center gap-3 text-xs text-caso-slate mt-0.5">
                <span>{review.format}</span>
                <span className="w-1 h-1 rounded-full bg-caso-slate/40" />
                <span>{review.pageCount} pages</span>
                <span className="w-1 h-1 rounded-full bg-caso-slate/40" />
                <span>{review.tenant}</span>
                <span className="w-1 h-1 rounded-full bg-caso-slate/40" />
                <span>Submitted {new Date(review.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Scores */}
            <div className="flex items-center gap-2">
              <div className="text-center">
                <p className="text-[10px] uppercase font-semibold text-caso-slate/60 tracking-wider">Before</p>
                <p className="text-lg font-bold text-caso-red">{review.scoreBefore}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-caso-slate/40">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <div className="text-center">
                <p className="text-[10px] uppercase font-semibold text-caso-slate/60 tracking-wider">After</p>
                <p className="text-lg font-bold text-caso-green">{scoreAfter}</p>
              </div>
            </div>

            {/* Status badge */}
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(review.status)}`}>
              {statusLabel(review.status)}
            </span>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEditor(true)}
                className="rounded-lg border border-caso-blue/50 bg-caso-blue/10 px-3 py-1.5 text-xs font-semibold text-caso-blue hover:bg-caso-blue/20 hover:border-caso-blue transition-colors"
              >
                Edit in Tag Inspector
              </button>
              <button className="rounded-lg bg-caso-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-caso-green/80 transition-colors">
                Approve
              </button>
              <button className="rounded-lg border border-caso-warm px-3 py-1.5 text-xs font-semibold text-caso-warm hover:bg-caso-warm/10 transition-colors">
                Request Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content: Preview + Structure ──────────────────────────── */}
      <div className="flex gap-4 flex-1 min-h-0 mb-4">

        {/* ── Document Preview Panel (left, ~60%) ────────────────────── */}
        <div className="w-[60%] rounded-xl bg-caso-navy-light border border-caso-border flex flex-col overflow-hidden shrink-0">
          <div className="px-4 py-3 border-b border-caso-border flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-caso-slate">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
            </svg>
            <h2 className="text-sm font-semibold text-caso-white">Document Preview</h2>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-caso-navy/50">
            <div className="w-20 h-20 rounded-2xl bg-caso-slate/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-caso-slate/40">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <p className="text-sm text-caso-slate text-center max-w-xs">
              Document preview requires the review API endpoint. Upload the remediated file to view.
            </p>
            <button className="mt-4 rounded-lg border border-caso-border px-4 py-2 text-xs font-medium text-caso-slate hover:text-caso-white hover:border-caso-slate transition-colors">
              Upload Remediated File
            </button>
          </div>
        </div>

        {/* ── Right Panel: Structure + Issues (~40%) ─────────────────── */}
        <div className="w-[40%] flex flex-col gap-4 min-h-0">

          {/* ── Accessibility Structure Panel ──────────────────────────── */}
          <div className="flex-1 rounded-xl bg-caso-navy-light border border-caso-border flex flex-col overflow-hidden min-h-0">
            <div className="px-4 py-3 border-b border-caso-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-caso-slate">
                  <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
                </svg>
                <h2 className="text-sm font-semibold text-caso-white">Tag Structure</h2>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setExpandedNodes(new Set(["root", "page-1", "page-2", "page-3", "p1-table1", "p2-list1"]))}
                  className="rounded px-2 py-1 text-[10px] font-medium text-caso-slate hover:text-caso-white hover:bg-white/5 transition-colors"
                >
                  Expand All
                </button>
                <button
                  onClick={() => setExpandedNodes(new Set(["root"]))}
                  className="rounded px-2 py-1 text-[10px] font-medium text-caso-slate hover:text-caso-white hover:bg-white/5 transition-colors"
                >
                  Collapse All
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
              <TreeNode
                node={structure}
                depth={0}
                expandedNodes={expandedNodes}
                toggleNode={toggleNode}
                highlightedNode={highlightedNode}
                onHighlight={setHighlightedNode}
                onUpdateAltText={handleUpdateAltText}
                onUpdateHeadingLevel={handleUpdateHeadingLevel}
              />
            </div>
          </div>

          {/* ── Issues Panel ───────────────────────────────────────────── */}
          <div className="rounded-xl bg-caso-navy-light border border-caso-border flex flex-col overflow-hidden shrink-0" style={{ maxHeight: "260px" }}>
            <div className="px-4 py-3 border-b border-caso-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-caso-slate">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <h2 className="text-sm font-semibold text-caso-white">Issues</h2>
              </div>
              <div className="flex items-center gap-2">
                {errorCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-caso-red/10 text-caso-red">
                    {errorCount} error{errorCount !== 1 ? "s" : ""}
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-caso-warm/10 text-caso-warm">
                    {warningCount} warning{warningCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-start gap-3 px-4 py-3 border-b border-caso-border/30 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="mt-0.5">{severityIcon(issue.severity)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-caso-white">{issue.description}</p>
                    <p className="text-[10px] text-caso-slate/60 mt-0.5">Page {issue.page}</p>
                  </div>
                  <button
                    onClick={() => handleJumpToNode(issue.nodeId)}
                    className="shrink-0 rounded px-2 py-1 text-[10px] font-medium text-caso-blue hover:text-caso-blue-bright hover:bg-caso-blue/10 transition-colors"
                  >
                    Jump to
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Action Bar ──────────────────────────────────────────── */}
      <div className="rounded-xl bg-caso-navy-light border border-caso-border px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {hasUnsavedChanges ? (
            <>
              <span className="w-2 h-2 rounded-full bg-caso-warm animate-pulse" />
              <span className="text-xs text-caso-warm font-medium">Unsaved changes</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-caso-green" />
              <span className="text-xs text-caso-slate">All changes saved</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges}
            className="rounded-lg bg-caso-blue px-4 py-2 text-sm font-semibold text-white hover:bg-caso-blue-bright disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleApprove}
            disabled={saving}
            className="rounded-lg bg-caso-green px-4 py-2 text-sm font-semibold text-white hover:bg-caso-green/80 disabled:opacity-50 transition-colors"
          >
            Approve & Complete
          </button>
          <button
            disabled={saving}
            className="rounded-lg border border-caso-red px-4 py-2 text-sm font-semibold text-caso-red hover:bg-caso-red/10 disabled:opacity-50 transition-colors"
          >
            Reject
          </button>
        </div>
      </div>

      {/* ── Tag Inspector Modal ────────────────────────────────────────── */}
      {showEditor && (
        <PdfViewer
          downloadUrl=""
          tagAssignments={tagAssignments}
          pageDimensions={[{ page: 0, width: 612, height: 792 }, { page: 1, width: 612, height: 792 }]}
          title="Document Review — Edit Tags"
          onClose={() => setShowEditor(false)}
          editable={true}
          onSave={async (updatedTags) => {
            setApplyingEdits(true);
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
              setHasUnsavedChanges(false);
            } catch (err) {
              console.error("Failed to apply edits:", err);
              alert(
                err instanceof Error
                  ? err.message
                  : "Failed to apply edits. Please try again."
              );
            } finally {
              setApplyingEdits(false);
            }
          }}
        />
      )}
    </div>
  );
}