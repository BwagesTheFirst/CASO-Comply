# Office Document Remediation Pipeline — Design Document

**Date:** 2026-03-09
**Status:** Approved

## Problem

The ADA Title II final rule (28 CFR Part 35, Subpart H) explicitly requires WCAG 2.1 AA compliance for four "conventional electronic document" formats: PDFs, Word (.docx), Excel (.xlsx), and PowerPoint (.pptx). The April 24, 2026 deadline for entities with population >= 50,000 is 7 weeks away. CASO Comply's Docker agent currently only remediates PDFs. No competitor offers autonomous, Docker-based remediation for Office files.

## Solution

Add Word, Excel, and PowerPoint remediation to the Docker agent alongside the existing PDF pipeline. Each format gets its own remediation module. The scanner detects all four file types, the processor routes by extension, and all formats share the same Gemini AI verification layer, scoring system, dashboard, and human review queue. Output is the fixed Office file (not PDF conversion).

## Architecture

```
scanner.py finds: *.pdf, *.docx, *.xlsx, *.pptx
                        ↓
processor.py checks extension:
  .pdf  → remediation.py (existing, unchanged)
  .docx → remediation_docx.py (new)
  .xlsx → remediation_xlsx.py (new)
  .pptx → remediation_pptx.py (new)
                        ↓
All formats → gemini_verify.py (shared, format-specific prompts)
                        ↓
Same scoring (0-100), same dashboard, same human review queue
```

### Remediation Module Interface

Every remediation module exposes the same async function signature:

```python
async def remediate_<format>_async(file_path: str, output_path: str, verify: bool = True) -> dict:
    # Returns: {before: {score: {score: int}}, after: {score: {score: int}}, output_path: str, ...}
```

The processor doesn't care about format — it gets back scores and a path.

### Output

The remediated file keeps its original format. A `.docx` comes out as a fixed `.docx`. No PDF conversion. Screen readers handle well-structured Office files better than converted PDFs in most cases.

## Scanner Changes

`scanner.py` currently only finds `*.pdf`. Change to support all four types:

```python
SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".xlsx", ".pptx"}
```

Each scan result includes a `format` field: `{"path": "...", "sha256": "...", "format": "docx"}`.

Skip files with `_remediated` in the stem (same as current behavior).

## Database Changes

Rename `pdfs` table to `documents`. Add `format` column (`pdf`, `docx`, `xlsx`, `pptx`). SQLite migration: create new table, copy existing data with `format='pdf'`, drop old table.

Rename methods: `upsert_pdf` → `upsert_document`, `get_pdf` → `get_document`, etc.

## Gemini Verification for Office Files

### Rendering

Office files can't be rendered directly with PyMuPDF. Use LibreOffice headless to convert to a temporary PDF (for rendering only, not output), render pages with PyMuPDF, then delete the temp PDF.

```
.docx → LibreOffice headless → temp.pdf → PyMuPDF renders PNGs → Gemini → delete temp.pdf
```

### Format-Specific Prompts

Each format gets its own system prompt tailored to its accessibility concerns:

- **Word**: heading hierarchy, alt text, table headers, reading order, artifacts
- **Excel**: table headers, merged cells, sheet names, chart alt text, color-only information
- **PowerPoint**: slide titles, reading order per slide, alt text, table headers, animations

The response schema stays nearly identical across formats. The `verify_and_correct` function gets a `format` parameter.

### Fallback

If LibreOffice rendering fails, skip the Gemini verification step and apply heuristic fixes only. Same graceful fallback as current PDF behavior.

## Word Remediation (`remediation_docx.py`)

**Libraries:** python-docx + lxml

**Heuristic pass:**
- Detect text styled bold/large but using "Normal" style → classify as H1/H2/H3 by font size
- Find images without alt text (`descr` attribute on `cNvPr` via lxml)
- Find tables without header rows (`tblHeader` XML flag)
- Check document language (`w:lang` element)
- Check document title in `core.xml` properties
- Detect floating/wrapped images
- Check color contrast (font color vs background)

**Auto-fix pass:**
- Apply proper heading styles
- Set `tblHeader` on first row of every table
- Set document language if missing
- Set document title from first heading if blank

**Gemini pass:** Corrects heading assignments, generates alt text, detects artifacts, validates reading order.

**Scoring (0-100):** Headings (20), alt text (25), table headers (15), language (10), title (10), no floating images (10), contrast (10).

## Excel Remediation (`remediation_xlsx.py`)

**Libraries:** openpyxl + lxml

**Heuristic pass:**
- Detect tables without header rows
- Find merged cells
- Check sheet names for generic names ("Sheet1")
- Find images/charts without alt text
- Detect blank separator rows/columns
- Check document language, title
- Check color contrast (font vs cell fill)

**Auto-fix pass:**
- Set header row flag on tables
- Unmerge cells, fill each with original value
- Set document language and title if missing
- Remove blank separator rows/columns within data regions

**Gemini pass:** Suggests sheet names, generates chart/image alt text, detects color-only information, validates table structure.

**Scoring (0-100):** Table headers (25), no merged cells (15), sheet names (10), alt text (20), language (10), title (10), no color-only info (10).

**Note:** Excel is the hardest format (~70-80% automation with Gemini, ~40-60% without). Mixed layouts are difficult to parse programmatically.

## PowerPoint Remediation (`remediation_pptx.py`)

**Libraries:** python-pptx + lxml

**Heuristic pass:**
- Detect slides without titles (`slide.shapes.title is None`)
- Analyze reading order (shape positions vs XML shape tree order)
- Find images/shapes without alt text (`cNvPr.descr`)
- Find tables without header rows (`firstRow` in `tblPr`)
- Detect animations/transitions (`<p:transition>`, `<p:timing>`)
- Check document language, title
- Check text contrast against slide background

**Auto-fix pass:**
- Add hidden title placeholders to untitled slides
- Reorder shapes in `spTree` by visual position (top-to-bottom, left-to-right), title first
- Set `firstRow = True` on all tables
- Remove transitions and complex animations
- Set document language and title if missing

**Gemini pass:** Corrects reading order, generates alt text, suggests slide titles, identifies if removed animations carried meaning.

**Scoring (0-100):** Slide titles (20), reading order (20), alt text (25), table headers (10), no dangerous animations (10), language (5), title (5), contrast (5).

**Note:** PowerPoint is the most automatable (~90%+ with Gemini). Predictable slide structure.

## Error Handling

- **Corrupted/password-protected:** Try to open, mark `failed` with error message, move on.
- **Empty files:** Score them, mark complete with low score, don't fail.
- **Embedded OLE objects:** Flag as "needs review" in score, don't try to remediate inside them.
- **LibreOffice rendering fails:** Skip Gemini verification, apply heuristic fixes only.
- **Large files (>50MB):** Log warning, proceed. LibreOffice may be slow.

## Output Naming

Same pattern as PDFs: `report_remediated.docx` (suffix mode), overwrite (overwrite mode), output directory (directory mode). Preserve original extension.

## Files Modified

- `agent/agent/scanner.py` — scan for all four extensions
- `agent/agent/processor.py` — route by extension
- `agent/agent/db.py` — rename table, add format column
- `agent/gemini_verify.py` — format parameter, format-specific prompts, LibreOffice rendering
- `agent/agent/api.py` — return format field in responses
- `agent/Dockerfile` — add dependencies + LibreOffice
- `agent/requirements.txt` — add python-docx, openpyxl, python-pptx

## Files Created

- `agent/remediation_docx.py`
- `agent/remediation_xlsx.py`
- `agent/remediation_pptx.py`

## Files Unchanged

- `agent/remediation.py` — existing PDF pipeline untouched
- Dashboard frontend — reads scores and status, format-agnostic
- License/billing — usage reporting already accepts any remediation_type
- Human review queue — already format-agnostic

## Dependencies Added

- `python-docx` (~1.2.0)
- `openpyxl` (~3.1.0)
- `python-pptx` (~1.0.0)
- LibreOffice headless (system package in Dockerfile, for Gemini page rendering only)
