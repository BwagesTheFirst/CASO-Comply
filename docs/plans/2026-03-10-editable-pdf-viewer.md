# Editable PDF Viewer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an `editable` prop to PdfViewer that enables inline tag editing (type reassignment, alt text, mark decorative, heading validation) so reviewers can fix accessibility issues directly in the tag inspector.

**Architecture:** The existing PdfViewer component gets an optional `editable` boolean prop. When true, each tag row in the reading order panel gains edit controls. Edits are tracked in local state (`editedTags`) as a map of `tagKey → partial overrides`. An `onSave` callback passes the edited tag list back to the parent. The demo page passes `editable={false}` (current behavior). The dashboard review page passes `editable={true}` with an `onSave` handler.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, existing PdfViewer component

---

### Task 1: Add `editable` prop and local edit state

**Files:**
- Modify: `src/components/PdfViewer.tsx`

**Step 1: Add new props and types**

Add to the existing interfaces at the top of PdfViewer.tsx:

```typescript
// Add after existing TagAssignment interface (line 12)
type TagType = "H1" | "H2" | "H3" | "H4" | "H5" | "H6" | "P" | "Table" | "Figure" | "List" | "Artifact";

const ALL_TAG_TYPES: TagType[] = ["H1", "H2", "H3", "H4", "H5", "H6", "P", "Table", "Figure", "List", "Artifact"];
```

Update `PdfViewerProps`:

```typescript
interface PdfViewerProps {
  downloadUrl: string;
  tagAssignments: TagAssignment[];
  pageDimensions: PageDimension[];
  title?: string;
  onClose: () => void;
  editable?: boolean;                              // NEW
  onSave?: (tags: TagAssignment[]) => void;        // NEW
}
```

**Step 2: Add edit state inside the component**

After the existing `useState` declarations (around line 54), add:

```typescript
// --- Edit mode state ---
const [editedTags, setEditedTags] = useState<Map<string, Partial<TagAssignment>>>(new Map());
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
```

Add a helper to compute the "live" tag list (original + edits merged):

```typescript
const liveTags = useMemo(() => {
  if (editedTags.size === 0) return tagAssignments;
  return tagAssignments.map((tag) => {
    const key = `${tag.page}-${tag.mcid}`;
    const edits = editedTags.get(key);
    return edits ? { ...tag, ...edits } : tag;
  });
}, [tagAssignments, editedTags]);
```

**Step 3: Replace `tagAssignments` with `liveTags` in all downstream usages**

In the existing code, every place that reads `tagAssignments` for display/grouping needs to read `liveTags` instead:
- `tagsByPage` memo (line 66): change `tagAssignments` → `liveTags`
- `pageNumbers` memo (line 75): change `tagAssignments` → `liveTags`
- `stats` memo (line 90): change `tagAssignments` → `liveTags`
- The `.map()` in the reading order list (line 446): change `tagAssignments.map` → `liveTags.map`
- The `.length === 0` check (line 440): change `tagAssignments.length` → `liveTags.length`

**Step 4: Add edit helper function**

```typescript
const updateTag = useCallback((tagKey: string, updates: Partial<TagAssignment>) => {
  setEditedTags((prev) => {
    const next = new Map(prev);
    const existing = next.get(tagKey) || {};
    next.set(tagKey, { ...existing, ...updates });
    return next;
  });
  setHasUnsavedChanges(true);
}, []);
```

**Step 5: Destructure new props**

Change the function signature:
```typescript
export default function PdfViewer({ downloadUrl, tagAssignments, pageDimensions, title, onClose, editable = false, onSave }: PdfViewerProps) {
```

**Step 6: Verify**

Run: `cd "caso-comply" && npx next build 2>&1 | tail -5`
Expected: Build succeeds (no visual changes yet — editable defaults to false)

**Step 7: Commit**

```bash
git add src/components/PdfViewer.tsx
git commit -m "feat(PdfViewer): add editable prop and local edit state infrastructure"
```

---

### Task 2: Tag type reassignment dropdown

**Files:**
- Modify: `src/components/PdfViewer.tsx`

**Step 1: Add tag type colors for new types**

Add entries to `TAG_HIGHLIGHT_COLORS` for missing types:

```typescript
H4: { fill: "rgba(99, 102, 241, 0.18)", border: "rgba(99, 102, 241, 0.6)", bg: "bg-indigo-500/20", text: "text-indigo-400", borderClass: "border-indigo-500/30" },
H5: { fill: "rgba(139, 92, 246, 0.18)", border: "rgba(139, 92, 246, 0.6)", bg: "bg-violet-500/20", text: "text-violet-400", borderClass: "border-violet-500/30" },
H6: { fill: "rgba(192, 132, 252, 0.18)", border: "rgba(192, 132, 252, 0.6)", bg: "bg-purple-300/20", text: "text-purple-300", borderClass: "border-purple-300/30" },
List: { fill: "rgba(34, 197, 94, 0.18)", border: "rgba(34, 197, 94, 0.6)", bg: "bg-green-500/20", text: "text-green-400", borderClass: "border-green-500/30" },
Artifact: { fill: "rgba(115, 115, 115, 0.12)", border: "rgba(115, 115, 115, 0.4)", bg: "bg-neutral-500/20", text: "text-neutral-400", borderClass: "border-neutral-500/30" },
```

**Step 2: Add state for open dropdown**

```typescript
const [openDropdown, setOpenDropdown] = useState<string | null>(null);
```

**Step 3: Replace the tag badge in the reading order list**

Find the `<span>` that renders the tag type badge (line 468-472). Wrap it with edit logic:

```tsx
{/* Tag type badge — clickable dropdown in edit mode */}
{editable ? (
  <div className="relative mt-0.5 shrink-0">
    <button
      onClick={(e) => {
        e.stopPropagation();
        setOpenDropdown(openDropdown === tagKey ? null : tagKey);
      }}
      className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${color.bg} ${color.text} border ${color.borderClass} hover:brightness-125 transition-all`}
      title="Change tag type"
    >
      {tag.type}
      <svg className="h-2.5 w-2.5 opacity-60" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
      </svg>
    </button>
    {openDropdown === tagKey && (
      <div className="absolute left-0 top-full z-20 mt-1 rounded-lg border border-caso-border bg-caso-navy-light shadow-xl shadow-black/40 py-1 min-w-[100px]">
        {ALL_TAG_TYPES.map((t) => {
          const tc = getTagColor(t);
          return (
            <button
              key={t}
              onClick={(e) => {
                e.stopPropagation();
                updateTag(tagKey, { type: t });
                setOpenDropdown(null);
              }}
              className={`w-full px-3 py-1 text-left text-xs hover:bg-white/5 flex items-center gap-2 ${
                tag.type === t ? "text-caso-white font-medium" : "text-caso-slate"
              }`}
            >
              <span className={`inline-block w-6 rounded px-1 py-0.5 text-center text-[9px] font-bold ${tc.bg} ${tc.text}`}>
                {t}
              </span>
              {tag.type === t && (
                <svg className="h-3 w-3 text-caso-green ml-auto" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    )}
  </div>
) : (
  <span
    className={`mt-0.5 inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${color.bg} ${color.text} border ${color.borderClass}`}
  >
    {tag.type}
  </span>
)}
```

**Step 4: Close dropdown when clicking elsewhere**

Add an effect to close the dropdown:

```typescript
useEffect(() => {
  if (!openDropdown) return;
  const handleClick = () => setOpenDropdown(null);
  window.addEventListener("click", handleClick);
  return () => window.removeEventListener("click", handleClick);
}, [openDropdown]);
```

**Step 5: Verify**

Run: `cd "caso-comply" && npx next build 2>&1 | tail -5`
Expected: Build succeeds. Dropdown doesn't appear in demo (editable=false).

**Step 6: Commit**

```bash
git add src/components/PdfViewer.tsx
git commit -m "feat(PdfViewer): add tag type reassignment dropdown in edit mode"
```

---

### Task 3: Alt text inline editing for images

**Files:**
- Modify: `src/components/PdfViewer.tsx`

**Step 1: Add alt text edit field below Figure tags**

In the reading order list, after the text content `<span>` and page/MCID info, add a conditional alt text editor. Find the `<div className="min-w-0 flex-1">` block inside the tag map (around line 473-484). After the closing of that div, but still inside the button wrapper, add:

```tsx
{/* Alt text editor for images */}
{editable && tag.type === "Figure" && (
  <div className="mt-1.5 w-full" onClick={(e) => e.stopPropagation()}>
    <label className="text-[10px] text-caso-slate/60 block mb-0.5">Alt text</label>
    <textarea
      value={tag.text}
      onChange={(e) => updateTag(tagKey, { text: e.target.value })}
      placeholder="Describe this image for screen readers..."
      rows={2}
      className="w-full rounded-md border border-caso-border bg-caso-navy px-2 py-1.5 text-xs text-caso-white placeholder-caso-slate/40 focus:border-caso-blue focus:outline-none focus:ring-1 focus:ring-caso-blue resize-none"
    />
    {!tag.text.trim() && (
      <span className="text-[10px] text-caso-red mt-0.5 block">Missing alt text — required for accessibility</span>
    )}
  </div>
)}
```

Note: The tag button's `onClick` navigates to the tag. The `e.stopPropagation()` on the textarea container prevents that when editing alt text.

**Step 2: Change button to div for editable tags**

When `editable` is true, the tag row needs to be a `<div>` instead of `<button>` to properly nest the textarea. Wrap the tag rendering:

```tsx
{editable ? (
  <div
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
    {/* ... same inner content as the button, plus alt text editor ... */}
  </div>
) : (
  <button ...> {/* existing read-only button */} </button>
)}
```

**Step 3: Verify**

Run: `cd "caso-comply" && npx next build 2>&1 | tail -5`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/components/PdfViewer.tsx
git commit -m "feat(PdfViewer): add inline alt text editing for Figure tags"
```

---

### Task 4: Mark as decorative / artifact button

**Files:**
- Modify: `src/components/PdfViewer.tsx`

**Step 1: Add a "Mark Decorative" button to each tag row**

In edit mode, add a small button at the end of each tag row (after the pulse dot, in the flex row). This appears for all tag types:

```tsx
{editable && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      updateTag(tagKey, { type: tag.type === "Artifact" ? "Figure" : "Artifact" });
    }}
    className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] transition-colors ${
      tag.type === "Artifact"
        ? "bg-neutral-500/20 text-neutral-400 hover:bg-neutral-500/30"
        : "bg-transparent text-caso-slate/40 hover:bg-caso-red/10 hover:text-caso-red"
    }`}
    title={tag.type === "Artifact" ? "Restore from decorative" : "Mark as decorative (hide from screen readers)"}
  >
    {tag.type === "Artifact" ? (
      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.598a.75.75 0 00-.75.75v3.634a.75.75 0 001.5 0v-2.033l.312.311a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm-2.114-7.536a.75.75 0 00-.382-.981 7 7 0 00-11.712 3.138.75.75 0 001.449.39A5.5 5.5 0 0111.889 4.07l.311.31H9.767a.75.75 0 000 1.5h3.634a.75.75 0 00.75-.75V1.497a.75.75 0 00-1.5 0v2.033l-.311-.311a7.003 7.003 0 01.857-.331z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
      </svg>
    )}
  </button>
)}
```

**Step 2: Style Artifact tags with strikethrough in the text**

In the text content span, add a conditional strikethrough:

```tsx
<span
  className={`block text-left text-xs leading-relaxed ${
    tag.type === "Artifact" ? "line-through opacity-40" : ""
  } ${
    isSelected ? "text-caso-white" : isOnCurrentPage ? "text-caso-white/90" : "text-caso-slate"
  } group-hover:text-caso-white`}
>
```

**Step 3: Verify**

Run: `cd "caso-comply" && npx next build 2>&1 | tail -5`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/components/PdfViewer.tsx
git commit -m "feat(PdfViewer): add mark as decorative/artifact toggle"
```

---

### Task 5: Heading level validation warnings

**Files:**
- Modify: `src/components/PdfViewer.tsx`

**Step 1: Add validation function**

Add after the `updateTag` callback:

```typescript
const headingWarnings = useMemo(() => {
  const warnings: Map<string, string> = new Map();
  const headingTags = liveTags.filter((t) => t.type.match(/^H[1-6]$/));

  for (let i = 1; i < headingTags.length; i++) {
    const prev = parseInt(headingTags[i - 1].type.slice(1));
    const curr = parseInt(headingTags[i].type.slice(1));
    if (curr > prev + 1) {
      const key = `${headingTags[i].page}-${headingTags[i].mcid}`;
      warnings.set(key, `Heading level skipped: ${headingTags[i - 1].type} → ${headingTags[i].type}`);
    }
  }

  return warnings;
}, [liveTags]);
```

**Step 2: Display warnings inline on tag rows**

Inside each tag row, after the page/MCID info span, add:

```tsx
{editable && headingWarnings.has(tagKey) && (
  <span className="mt-0.5 flex items-center gap-1 text-[10px] text-caso-warm">
    <svg className="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.168-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.457-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
    {headingWarnings.get(tagKey)}
  </span>
)}
```

**Step 3: Add warning count to footer**

In the footer section, after the tag type badges, add:

```tsx
{editable && headingWarnings.size > 0 && (
  <>
    <span className="text-caso-border" aria-hidden="true">|</span>
    <span className="text-[11px] font-medium text-caso-warm">
      <svg className="inline h-3 w-3 mr-0.5 -mt-0.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.168-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.457-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
      {headingWarnings.size} heading warning{headingWarnings.size !== 1 ? "s" : ""}
    </span>
  </>
)}
```

**Step 4: Verify**

Run: `cd "caso-comply" && npx next build 2>&1 | tail -5`
Expected: Build succeeds.

**Step 5: Commit**

```bash
git add src/components/PdfViewer.tsx
git commit -m "feat(PdfViewer): add heading level skip validation warnings"
```

---

### Task 6: Save/Cancel action bar

**Files:**
- Modify: `src/components/PdfViewer.tsx`

**Step 1: Add save action bar to footer**

Replace the footer with a conditional version. When `editable && hasUnsavedChanges`, show save/discard buttons alongside the stats:

```tsx
<footer className="flex shrink-0 items-center justify-between border-t border-caso-border bg-caso-navy-light px-4 py-2.5 sm:px-6">
  <div className="flex flex-wrap items-center gap-3">
    {/* Existing stats */}
    <span className="text-[11px] font-medium text-caso-slate">
      <span className="text-caso-white">{stats.total}</span> tags
    </span>
    <span className="text-caso-border" aria-hidden="true">|</span>
    <span className="text-[11px] font-medium text-caso-slate">
      <span className="text-caso-white">{stats.pages}</span> page{stats.pages !== 1 ? "s" : ""}
    </span>
    {/* ... tag type badges ... */}
    {/* ... heading warnings count ... */}
  </div>

  {editable && (
    <div className="flex items-center gap-2">
      {hasUnsavedChanges && (
        <span className="flex items-center gap-1.5 text-[11px] text-caso-warm mr-2">
          <span className="h-1.5 w-1.5 rounded-full bg-caso-warm animate-pulse" />
          Unsaved changes
        </span>
      )}
      <button
        onClick={() => {
          setEditedTags(new Map());
          setHasUnsavedChanges(false);
        }}
        disabled={!hasUnsavedChanges}
        className="rounded-md border border-caso-border px-3 py-1.5 text-xs font-medium text-caso-slate hover:text-caso-white hover:bg-white/5 transition-colors disabled:opacity-30"
      >
        Discard
      </button>
      <button
        onClick={() => {
          if (onSave) onSave(liveTags);
          setHasUnsavedChanges(false);
        }}
        disabled={!hasUnsavedChanges}
        className="rounded-md bg-caso-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-caso-blue-bright transition-colors disabled:opacity-50"
      >
        Save Changes
      </button>
    </div>
  )}
</footer>
```

**Step 2: Verify**

Run: `cd "caso-comply" && npx next build 2>&1 | tail -5`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/components/PdfViewer.tsx
git commit -m "feat(PdfViewer): add save/discard action bar for edit mode"
```

---

### Task 7: Wire up demo page (read-only) and review page (editable)

**Files:**
- Modify: `src/app/demo/page.tsx` (one line change)
- Modify: `src/app/dashboard/admin/reviews/[id]/page.tsx` (integrate PdfViewer)

**Step 1: Demo page — explicit `editable={false}`**

In `src/app/demo/page.tsx`, find the `<PdfViewer` usage (line 856) and add the prop:

```tsx
<PdfViewer
  downloadUrl={...}
  tagAssignments={result.tag_assignments}
  pageDimensions={result.page_dimensions}
  title={...}
  onClose={() => setShowPdfViewer(false)}
  editable={false}
/>
```

This is technically a no-op since `editable` defaults to `false`, but makes the intent explicit.

**Step 2: Review page — add PdfViewer with `editable={true}`**

In `src/app/dashboard/admin/reviews/[id]/page.tsx`, add a button to open the PdfViewer in edit mode and wire up the `onSave` callback. This page currently uses mock data, so add mock tag assignments and a PdfViewer modal trigger.

Add state at the top of the component:

```typescript
const [showEditor, setShowEditor] = useState(false);
```

Add a "Edit Tags" button in the header action area:

```tsx
<button
  onClick={() => setShowEditor(true)}
  className="rounded-lg bg-caso-blue px-4 py-2 text-sm font-semibold text-white hover:bg-caso-blue-bright transition-colors"
>
  Edit Tags
</button>
```

Add the PdfViewer modal at the end of the component return:

```tsx
{showEditor && (
  <PdfViewer
    downloadUrl=""
    tagAssignments={MOCK_TAG_ASSIGNMENTS}
    pageDimensions={[{ page: 0, width: 612, height: 792 }]}
    title="Document Review"
    onClose={() => setShowEditor(false)}
    editable={true}
    onSave={(updatedTags) => {
      console.log("Saving edited tags:", updatedTags);
      setShowEditor(false);
    }}
  />
)}
```

Define `MOCK_TAG_ASSIGNMENTS` as a const with sample data (5-10 tags) for testing until the real API is connected.

**Step 3: Verify**

Run: `cd "caso-comply" && npx next build 2>&1 | tail -5`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/app/demo/page.tsx src/app/dashboard/admin/reviews/\[id\]/page.tsx src/components/PdfViewer.tsx
git commit -m "feat: wire PdfViewer editable mode into demo (read-only) and review (editable) pages"
```

---

### Task 8: Deploy and verify

**Step 1: Build production**

Run: `cd "caso-comply" && npx next build`
Expected: Clean build, no errors.

**Step 2: Deploy**

Run: `cd "caso-comply" && vercel --prod`

**Step 3: Manual verification checklist**

- [ ] Visit `/demo` → upload a PDF → click "View Tagged PDF" → tags are **read-only** (no dropdowns, no edit fields)
- [ ] Visit `/dashboard/admin/reviews/{id}` → click "Edit Tags" → tags have **dropdown badges**, **alt text fields on images**, **decorative toggle**, **heading warnings**
- [ ] Change a tag type in edit mode → badge color updates immediately
- [ ] Edit alt text on a Figure → text saves in state
- [ ] Mark a tag as Artifact → text gets strikethrough, badge turns gray
- [ ] Create a heading skip (H1 → H3) → warning appears
- [ ] Click "Discard" → all edits revert
- [ ] Click "Save Changes" → `onSave` callback fires with edited tags

**Step 4: Commit**

```bash
git commit -m "chore: deploy editable PdfViewer"
```
