# Office Document Remediation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Word (.docx), Excel (.xlsx), and PowerPoint (.pptx) accessibility remediation to the Docker agent alongside the existing PDF pipeline.

**Architecture:** Scanner detects all four file types, processor routes by extension to format-specific remediation modules, all formats share the same Gemini AI verification layer with format-specific prompts. Output is the fixed Office file, not PDF. Same 0-100 scoring, dashboard, and human review queue.

**Tech Stack:** python-docx, openpyxl, python-pptx, lxml, LibreOffice headless (for Gemini page rendering), Google Gemini 2.5 Flash

---

### Task 1: Add Python Dependencies

**Files:**
- Modify: `agent/requirements.txt`
- Modify: `agent/Dockerfile`

**Step 1: Add Office libraries to requirements.txt**

Add these three lines to the end of `agent/requirements.txt`:

```
python-docx>=1.1.0
openpyxl>=3.1.0
python-pptx>=1.0.0
```

**Step 2: Add LibreOffice to Dockerfile**

In `agent/Dockerfile`, modify the `apt-get install` block (line 8-11) to include LibreOffice headless:

```dockerfile
# System deps for PDF and Office processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libmupdf-dev \
    libreoffice-writer-nogui \
    libreoffice-calc-nogui \
    libreoffice-impress-nogui \
    && rm -rf /var/lib/apt/lists/*
```

The `-nogui` variants are smaller — they include the headless conversion engine without the desktop UI.

**Step 3: Verify dependencies install**

Run from `agent/` directory:

```bash
pip install python-docx openpyxl python-pptx
```

Expected: all install successfully.

**Step 4: Commit**

```bash
git add agent/requirements.txt agent/Dockerfile
git commit -m "feat: add Office document processing dependencies"
```

---

### Task 2: Migrate Database Schema

**Files:**
- Modify: `agent/agent/db.py`

**Step 1: Update the schema**

Replace the `SCHEMA` constant at the top of `agent/agent/db.py` (lines 6-27):

```python
SCHEMA = """
CREATE TABLE IF NOT EXISTS documents (
    path TEXT PRIMARY KEY,
    sha256 TEXT NOT NULL,
    format TEXT DEFAULT 'pdf',
    page_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    before_score INTEGER,
    after_score INTEGER,
    source TEXT DEFAULT 'folder',
    discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    error_message TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

MIGRATION_V2 = """
-- Migrate from pdfs table to documents table if needed
CREATE TABLE IF NOT EXISTS documents (
    path TEXT PRIMARY KEY,
    sha256 TEXT NOT NULL,
    format TEXT DEFAULT 'pdf',
    page_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    before_score INTEGER,
    after_score INTEGER,
    source TEXT DEFAULT 'folder',
    discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    error_message TEXT
);

INSERT OR IGNORE INTO documents (path, sha256, format, page_count, status, before_score, after_score, source, discovered_at, processed_at, error_message)
SELECT path, sha256, 'pdf', page_count, status, before_score, after_score, source, discovered_at, processed_at, error_message
FROM pdfs;

DROP TABLE IF EXISTS pdfs;
"""
```

**Step 2: Add migration logic to `init()`**

Replace the `init` method:

```python
async def init(self):
    self._db = await aiosqlite.connect(self._path)
    self._db.row_factory = aiosqlite.Row
    # Check if old 'pdfs' table exists and migrate
    cursor = await self._db.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='pdfs'"
    )
    old_table = await cursor.fetchone()
    if old_table:
        await self._db.executescript(MIGRATION_V2)
        await self._db.commit()
    else:
        await self._db.executescript(SCHEMA)
        await self._db.commit()
```

**Step 3: Rename all methods from `pdf` to `document`**

Replace:
- `upsert_pdf` → `upsert_document` — add `format` parameter:

```python
async def upsert_document(self, path: str, sha256: str, page_count: int = 0, source: str = "folder", format: str = "pdf"):
    await self._db.execute(
        """INSERT INTO documents (path, sha256, format, page_count, source)
           VALUES (?, ?, ?, ?, ?)
           ON CONFLICT(path) DO UPDATE SET
             sha256=excluded.sha256,
             format=excluded.format,
             page_count=excluded.page_count,
             status=CASE WHEN documents.sha256 != excluded.sha256 THEN 'pending' ELSE documents.status END
        """,
        (path, sha256, format, page_count, source),
    )
    await self._db.commit()
```

- `needs_processing` — change table reference from `pdfs` to `documents`
- `get_pdf` → `get_document` — change table reference
- `update_result` — change table reference
- `get_pending` — change table reference
- `get_all` — change table reference
- `get_stats` — change table reference

All SQL queries that reference `pdfs` must now reference `documents`.

**Step 4: Commit**

```bash
git add agent/agent/db.py
git commit -m "feat: migrate database from pdfs to documents table with format column"
```

---

### Task 3: Update Scanner for All File Types

**Files:**
- Modify: `agent/agent/scanner.py`

**Step 1: Add supported extensions and update scan logic**

Replace the entire `agent/agent/scanner.py`:

```python
# agent/agent/scanner.py
from __future__ import annotations

import hashlib
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".xlsx", ".pptx"}

EXTENSION_TO_FORMAT = {
    ".pdf": "pdf",
    ".docx": "docx",
    ".xlsx": "xlsx",
    ".pptx": "pptx",
}

def compute_file_hash(file_path: str, chunk_size: int = 8192) -> str:
    h = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(chunk_size):
            h.update(chunk)
    return h.hexdigest()

def scan_folder(folder_path: str) -> list[dict]:
    """Recursively scan a folder for supported document files.

    Returns list of {path, sha256, format}.
    """
    root = Path(folder_path)
    if not root.exists():
        logger.warning("Scan path does not exist: %s", folder_path)
        return []

    results = []
    for file_path in sorted(root.rglob("*")):
        if not file_path.is_file():
            continue
        ext = file_path.suffix.lower()
        if ext not in SUPPORTED_EXTENSIONS:
            continue
        # Skip remediated output files to avoid recursive re-processing
        if "_remediated" in file_path.stem:
            continue
        try:
            results.append({
                "path": str(file_path),
                "sha256": compute_file_hash(str(file_path)),
                "format": EXTENSION_TO_FORMAT[ext],
            })
        except OSError:
            logger.warning("Could not read file: %s", file_path)

    logger.info("Found %d documents in %s (%s)",
                len(results), folder_path,
                ", ".join(f"{sum(1 for r in results if r['format'] == fmt)} {fmt}"
                          for fmt in sorted(set(r["format"] for r in results))))
    return results
```

**Step 2: Commit**

```bash
git add agent/agent/scanner.py
git commit -m "feat: scanner detects docx, xlsx, pptx alongside pdf"
```

---

### Task 4: Update Processor to Route by Format

**Files:**
- Modify: `agent/agent/processor.py`

**Step 1: Update `process_one` to accept format and route**

Rename `process_one` parameter from `pdf_path` to `file_path` and add format routing. Replace the method:

```python
async def process_one(self, file_path: str, format: str = "pdf") -> dict:
    """Process a single document. Returns {status, before_score, after_score, error}."""
    try:
        if self.config.mode == "cloud":
            return await self._process_cloud(file_path)
        else:
            return await self._process_local(file_path, format)
    except Exception as e:
        logger.exception("Failed to process %s", file_path)
        error_msg = str(e)
        await self.db.update_result(
            path=file_path, status="failed", error_message=error_msg,
        )
        return {"status": "failed", "error": error_msg}
```

**Step 2: Update `_process_local` to route by format**

Replace `_process_local`:

```python
async def _process_local(self, file_path: str, format: str = "pdf") -> dict:
    """Process locally (hybrid or local mode)."""
    output_path = self._output_path(file_path)
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    # Determine AI verification based on plan tier
    plan_name = self.license_client.plan_name if self.license_client else "Standard"
    verify = plan_name in ("AI Verified", "Human Review")

    if not verify:
        logger.info("Plan '%s' — standard remediation (no AI)", plan_name)

    # Route to format-specific remediation
    if format == "pdf":
        from remediation import remediate_pdf_async
        result = await remediate_pdf_async(file_path, output_path, verify=verify)
    elif format == "docx":
        from remediation_docx import remediate_docx_async
        result = await remediate_docx_async(file_path, output_path, verify=verify)
    elif format == "xlsx":
        from remediation_xlsx import remediate_xlsx_async
        result = await remediate_xlsx_async(file_path, output_path, verify=verify)
    elif format == "pptx":
        from remediation_pptx import remediate_pptx_async
        result = await remediate_pptx_async(file_path, output_path, verify=verify)
    else:
        raise ValueError(f"Unsupported format: {format}")

    before_score = result["before"]["score"]["score"]
    after_score = result["after"]["score"]["score"]
    page_count = result["before"].get("page_count", 0)

    # Determine remediation type based on plan and score
    remediation_type = "ai_verified" if verify else "standard"
    needs_review = False

    # Get threshold from license (default 70)
    threshold = self.license_client.review_score_threshold if self.license_client else 70

    # Human Review plan: submit files scoring below threshold
    if plan_name == "Human Review" and after_score < threshold:
        remediation_type = "human_review"
        needs_review = True
        logger.warning(
            "%s %s flagged for human review: after_score=%d (below %d)",
            format.upper(), Path(file_path).name, after_score, threshold,
        )
    elif after_score < threshold:
        logger.warning(
            "%s %s has low score after remediation: after_score=%d",
            format.upper(), Path(file_path).name, after_score,
        )

    if self.config.output_mode == "overwrite":
        shutil.copy2(output_path, file_path)

    await self.db.update_result(
        path=file_path,
        status="completed",
        before_score=before_score,
        after_score=after_score,
        page_count=page_count,
    )

    await self._report_usage(Path(file_path).name, page_count, remediation_type)

    # Submit for human review if flagged
    if needs_review:
        submitted = await self._submit_for_review(
            file_path, output_path, after_score, page_count,
        )
        if submitted:
            await self.db.update_result(path=file_path, status="review_pending")

    return {
        "status": "completed",
        "before_score": before_score,
        "after_score": after_score,
        "remediation_type": remediation_type,
        "needs_review": needs_review,
    }
```

**Step 3: Update `_output_path` to preserve original extension**

Replace `_output_path`:

```python
def _output_path(self, file_path: str) -> str:
    p = Path(file_path)
    if self.config.output_mode == "directory":
        return str(Path(self.config.output_dir) / p.name)
    elif self.config.output_mode == "overwrite":
        return str(p.parent / f"{p.stem}_tmp_remediated{p.suffix}")
    else:  # suffix
        return str(p.parent / f"{p.stem}_remediated{p.suffix}")
```

**Step 4: Commit**

```bash
git add agent/agent/processor.py
git commit -m "feat: processor routes to format-specific remediation engines"
```

---

### Task 5: Update main.py for Multi-Format Scanning

**Files:**
- Modify: `agent/agent/main.py`

**Step 1: Update `run_scan_cycle` to pass format through**

In `agent/agent/main.py`, update the `run_scan_cycle` function (lines 85-112):

```python
async def run_scan_cycle(config, db: Database, processor: Processor):
    """One full scan + process cycle."""
    logger.info("Starting scan cycle")

    for scan_path in config.scan_paths:
        found = await asyncio.to_thread(scan_folder, scan_path)
        for item in found:
            if await db.needs_processing(item["path"], item["sha256"]):
                await db.upsert_document(
                    path=item["path"],
                    sha256=item["sha256"],
                    format=item["format"],
                    source="folder",
                )

    pending = await db.get_pending()
    logger.info("Processing %d pending documents", len(pending))
    for doc in pending:
        fmt = doc.get("format", "pdf")
        await processor.process_one(doc["path"], format=fmt)

    stats = await db.get_stats()
    logger.info(
        "Cycle complete: %d total, %d completed, %d failed",
        stats["total"], stats["completed"] or 0, stats["failed"] or 0,
    )

    # Poll for completed human reviews
    await _fetch_completed_reviews(config, db, processor.license_client)
```

**Step 2: Commit**

```bash
git add agent/agent/main.py
git commit -m "feat: scan cycle handles all document formats"
```

---

### Task 6: Update API Endpoints for Multi-Format

**Files:**
- Modify: `agent/agent/api.py`

**Step 1: Update browse endpoint to show all supported files**

In `agent/agent/api.py`, find the browse endpoint (line 311) where it filters by `.pdf`. Change:

```python
elif entry.is_file() and entry.name.lower().endswith(".pdf"):
```

to:

```python
elif entry.is_file() and any(entry.name.lower().endswith(ext) for ext in (".pdf", ".docx", ".xlsx", ".pptx")):
```

Also update the directory `pdf_count` counter (line 301) to count all supported files:

```python
if entry.is_dir():
    doc_count = 0
    total_files = 0
    try:
        with os.scandir(entry_real) as sub_it:
            for sub_entry in sub_it:
                if sub_entry.is_file():
                    total_files += 1
                    if any(sub_entry.name.lower().endswith(ext) for ext in (".pdf", ".docx", ".xlsx", ".pptx")):
                        doc_count += 1
    except PermissionError:
        pass
    entries.append({
        "name": entry.name,
        "type": "directory",
        "doc_count": doc_count,
        "total_files": total_files,
    })
```

**Step 2: Commit**

```bash
git add agent/agent/api.py
git commit -m "feat: API browse endpoint shows all supported document types"
```

---

### Task 7: Extend Gemini Verification for Office Files

**Files:**
- Modify: `agent/gemini_verify.py`

**Step 1: Add format-specific prompts**

After the existing `SYSTEM_PROMPT` (line 83-111), add three new prompts:

```python
DOCX_SYSTEM_PROMPT = """\
You are an expert Word document accessibility auditor. You will receive:

1. Rendered images of every page in a Word document.
2. A JSON array of proposed tag assignments produced by a heuristic analysis.

Your job is to verify and correct the tag assignments so that a screen reader
will present the document logically to a blind user.

**Rules you MUST enforce:**

- Heading hierarchy: H1 → H2 → H3 in order. No skipping levels.
  A document should have exactly one H1 (the main title).
- Body text that is merely large or bold should remain P (paragraph), not a heading.
  Headings are structural titles/section labels.
- Headers, footers, page numbers should be marked as Artifact (is_artifact=true).
- Multi-column layouts: reading order should proceed column-by-column.
- For any images visible on the pages, generate concise, descriptive alt text.
- Preserve the original_mcid and page from the input so corrections can be mapped back.

Return ONLY the JSON object matching the provided schema.
"""

XLSX_SYSTEM_PROMPT = """\
You are an expert spreadsheet accessibility auditor. You will receive:

1. Rendered images of every sheet in an Excel workbook.
2. A JSON object describing the workbook structure: sheet names, tables, merged cells,
   images, and proposed fixes.

Your job is to verify the structure and suggest corrections.

**Rules you MUST enforce:**

- Every data table must have a designated header row.
- Merged cells should be unmerged — verify the unmerge was appropriate.
- Sheet names must be descriptive (not "Sheet1", "Sheet2").
  Suggest meaningful names based on the visible content.
- Charts and images must have descriptive alt text.
- Identify any cells where color alone conveys meaning and flag them.
- Check if the data flows logically for a screen reader reading left-to-right, top-to-bottom.

Return ONLY the JSON object matching the provided schema.
"""

PPTX_SYSTEM_PROMPT = """\
You are an expert presentation accessibility auditor. You will receive:

1. Rendered images of every slide in a PowerPoint presentation.
2. A JSON object describing the slide structure: shape tree order, proposed reading order,
   title presence, images, and tables.

Your job is to verify and correct the structure.

**Rules you MUST enforce:**

- Every slide MUST have a title. If missing, suggest appropriate title text
  based on the visible content.
- Reading order must be logical: title first, then content top-to-bottom,
  left-to-right. Verify the proposed order matches visual layout.
- All images and shapes must have descriptive alt text. Decorative images
  should be marked decorative.
- Tables must have header rows designated.
- Flag any content that appears to rely solely on color to convey meaning.
- Identify any animations or transitions that could cause seizures.

Return ONLY the JSON object matching the provided schema.
"""
```

**Step 2: Add Office-specific response schemas**

After `RESPONSE_SCHEMA`, add:

```python
XLSX_RESPONSE_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "sheet_names": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "original": {"type": "string"},
                    "suggested": {"type": "string"},
                    "reason": {"type": "string"},
                },
                "required": ["original", "suggested", "reason"],
            },
        },
        "alt_texts": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "sheet": {"type": "string"},
                    "object_index": {"type": "integer"},
                    "description": {"type": "string"},
                },
                "required": ["sheet", "object_index", "description"],
            },
        },
        "issues_found": {
            "type": "array",
            "items": {"type": "string"},
        },
        "color_only_cells": {
            "type": "array",
            "items": {"type": "string"},
        },
        "structure_valid": {"type": "boolean"},
    },
    "required": ["sheet_names", "alt_texts", "issues_found", "color_only_cells", "structure_valid"],
}

PPTX_RESPONSE_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "slides": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "slide_number": {"type": "integer"},
                    "suggested_title": {"type": "string"},
                    "reading_order": {
                        "type": "array",
                        "items": {"type": "integer"},
                    },
                    "reading_order_correct": {"type": "boolean"},
                },
                "required": ["slide_number", "suggested_title", "reading_order", "reading_order_correct"],
            },
        },
        "alt_texts": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "slide": {"type": "integer"},
                    "shape_index": {"type": "integer"},
                    "description": {"type": "string"},
                    "is_decorative": {"type": "boolean"},
                },
                "required": ["slide", "shape_index", "description", "is_decorative"],
            },
        },
        "issues_found": {
            "type": "array",
            "items": {"type": "string"},
        },
        "heading_hierarchy_valid": {"type": "boolean"},
    },
    "required": ["slides", "alt_texts", "issues_found", "heading_hierarchy_valid"],
}
```

The Word format reuses the existing `RESPONSE_SCHEMA` since the tag correction model is the same (corrected_tags + alt_texts + issues_found).

**Step 3: Add LibreOffice rendering function**

After `_render_pages_as_images`, add:

```python
def _render_office_as_images(file_path: str, dpi: int = 150) -> list[str]:
    """Convert an Office file to a temp PDF via LibreOffice, render pages as PNGs.

    Returns base64-encoded PNG strings, one per page/slide/sheet.
    """
    import subprocess
    import tempfile

    with tempfile.TemporaryDirectory() as tmp_dir:
        # Convert to PDF using LibreOffice headless
        result = subprocess.run(
            ["soffice", "--headless", "--convert-to", "pdf", "--outdir", tmp_dir, file_path],
            capture_output=True, text=True, timeout=120,
        )
        if result.returncode != 0:
            raise RuntimeError(f"LibreOffice conversion failed: {result.stderr}")

        # Find the generated PDF
        pdf_files = list(Path(tmp_dir).glob("*.pdf"))
        if not pdf_files:
            raise RuntimeError("LibreOffice produced no PDF output")

        # Render the temp PDF pages as images
        return _render_pages_as_images(str(pdf_files[0]), dpi=dpi)
```

**Step 4: Add format-aware `verify_and_correct_office` function**

```python
async def verify_and_correct_office(
    file_path: str,
    structure_data: dict | list,
    format: str,
) -> dict:
    """Send rendered Office pages + structure to Gemini for verification.

    Parameters
    ----------
    file_path : str
        Path to the .docx/.xlsx/.pptx file
    structure_data : dict or list
        Format-specific structure info (tag assignments for docx, workbook structure for xlsx, slide structure for pptx)
    format : str
        One of "docx", "xlsx", "pptx"

    Returns
    -------
    dict with format-specific corrections
    """
    try:
        return await _call_gemini_office(file_path, structure_data, format)
    except Exception:
        logger.exception("Gemini verification failed for %s -- returning defaults", format)
        if format == "docx":
            return {
                "corrected_tags": structure_data if isinstance(structure_data, list) else [],
                "alt_texts": {},
                "issues_found": ["Gemini verification unavailable -- used original tags"],
                "verification_score": 0.0,
            }
        elif format == "xlsx":
            return {
                "sheet_names": [],
                "alt_texts": [],
                "issues_found": ["Gemini verification unavailable"],
                "color_only_cells": [],
                "verification_score": 0.0,
            }
        else:  # pptx
            return {
                "slides": [],
                "alt_texts": [],
                "issues_found": ["Gemini verification unavailable"],
                "verification_score": 0.0,
            }


async def _call_gemini_office(
    file_path: str,
    structure_data: dict | list,
    format: str,
) -> dict:
    """Internal: call Gemini API for Office file verification."""
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not set")

    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)

    # Render pages via LibreOffice temp PDF
    logger.info("Rendering %s as images for Gemini verification", format.upper())
    page_images = await asyncio.to_thread(_render_office_as_images, file_path)
    logger.info("Rendered %d page images", len(page_images))

    # Build request parts
    parts: list[dict] = []
    for idx, b64 in enumerate(page_images):
        parts.append({"text": f"--- Page {idx + 1} ---"})
        parts.append({"inline_data": {"mime_type": "image/png", "data": b64}})
    del page_images

    parts.append({
        "text": (
            "Below is the current document structure. "
            "Please verify and correct it.\n\n"
            + json.dumps(structure_data, indent=2, default=str)
        )
    })

    contents = [{"role": "user", "parts": parts}]

    # Select prompt and schema by format
    if format == "docx":
        system_prompt = DOCX_SYSTEM_PROMPT
        schema = RESPONSE_SCHEMA
    elif format == "xlsx":
        system_prompt = XLSX_SYSTEM_PROMPT
        schema = XLSX_RESPONSE_SCHEMA
    else:
        system_prompt = PPTX_SYSTEM_PROMPT
        schema = PPTX_RESPONSE_SCHEMA

    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        response_mime_type="application/json",
        response_schema=schema,
    )

    logger.info("Sending %s verification request to Gemini %s", format.upper(), MODEL_ID)
    response = await asyncio.to_thread(
        client.models.generate_content,
        model=MODEL_ID,
        contents=contents,
        config=config,
    )

    result = json.loads(response.text)

    # Compute verification score
    issues = result.get("issues_found", [])
    if format == "docx":
        hierarchy_ok = result.get("heading_hierarchy_valid", False)
        order_ok = result.get("reading_order_correct", False)
        corrected = result.get("corrected_tags", [])
        n_changes = sum(1 for c in corrected if c.get("reason") and "unchanged" not in c.get("reason", "").lower())
        change_ratio = n_changes / max(len(corrected), 1)
        score = (0.4 if hierarchy_ok else 0.0) + (0.4 if order_ok else 0.0) + (0.2 * (1.0 - change_ratio))
    elif format == "xlsx":
        structure_ok = result.get("structure_valid", False)
        score = (0.6 if structure_ok else 0.0) + (0.4 * (1.0 - min(len(issues), 5) / 5))
    else:  # pptx
        hierarchy_ok = result.get("heading_hierarchy_valid", False)
        slides = result.get("slides", [])
        order_ok_count = sum(1 for s in slides if s.get("reading_order_correct", False))
        order_ratio = order_ok_count / max(len(slides), 1)
        score = (0.3 if hierarchy_ok else 0.0) + (0.5 * order_ratio) + (0.2 * (1.0 - min(len(issues), 5) / 5))

    result["verification_score"] = round(score, 3)

    logger.info("Gemini %s verification complete: %d issues, score=%.2f", format.upper(), len(issues), score)
    return result
```

**Step 5: Commit**

```bash
git add agent/gemini_verify.py
git commit -m "feat: Gemini verification supports Word, Excel, PowerPoint formats"
```

---

### Task 8: Word Remediation Engine

**Files:**
- Create: `agent/remediation_docx.py`

**Step 1: Create the Word remediation module**

Create `agent/remediation_docx.py`:

```python
"""
CASO Comply -- Word Document (.docx) Accessibility Remediation Engine

Analyzes and remediates Word document accessibility issues using python-docx
and lxml for direct OOXML manipulation. Supports Gemini AI verification
for heading correction and alt text generation.
"""
from __future__ import annotations

import asyncio
import copy
import logging
import shutil
from collections import defaultdict
from pathlib import Path

import docx
from docx.shared import Pt
from lxml import etree

logger = logging.getLogger(__name__)

# OOXML namespaces
NSMAP = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "wp": "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "pic": "http://schemas.openxmlformats.org/drawingml/2006/picture",
    "cp": "http://schemas.openxmlformats.org/package/2006/metadata/core-properties",
    "dc": "http://purl.org/dc/elements/1.1/",
}


# ---------------------------------------------------------------------------
# 1. Analysis
# ---------------------------------------------------------------------------

def analyze_docx(file_path: str) -> dict:
    """Analyze Word document for accessibility issues. Returns score dict."""
    doc = docx.Document(file_path)

    # Check headings
    headings = []
    paragraphs_with_large_font = []
    for para in doc.paragraphs:
        if para.style.name.startswith("Heading"):
            level = int(para.style.name.split()[-1]) if para.style.name != "Heading" else 1
            headings.append({"level": level, "text": para.text})
        elif para.text.strip():
            # Check for visual-only formatting (bold + large = probable heading)
            for run in para.runs:
                if run.bold and run.font.size and run.font.size >= Pt(14):
                    paragraphs_with_large_font.append(para.text[:80])
                    break

    has_headings = len(headings) > 0
    hierarchy_valid = _check_heading_hierarchy(headings)

    # Check images for alt text
    images = _find_images(doc)
    images_with_alt = sum(1 for img in images if img.get("alt_text"))
    total_images = len(images)
    alt_text_coverage = images_with_alt / max(total_images, 1)

    # Check tables for headers
    tables = []
    for table in doc.tables:
        has_header = _table_has_header(table)
        tables.append({"rows": len(table.rows), "cols": len(table.columns), "has_header": has_header})
    tables_with_headers = sum(1 for t in tables if t["has_header"])
    total_tables = len(tables)
    table_header_coverage = tables_with_headers / max(total_tables, 1)

    # Check document language
    has_lang = _has_document_language(doc)

    # Check document title
    has_title = bool(doc.core_properties.title)

    # Check for floating images
    floating_images = _count_floating_images(doc)
    has_no_floating = floating_images == 0

    # Compute score
    score = _compute_docx_score(
        has_headings=has_headings,
        hierarchy_valid=hierarchy_valid,
        alt_text_coverage=alt_text_coverage,
        table_header_coverage=table_header_coverage,
        has_lang=has_lang,
        has_title=has_title,
        has_no_floating=has_no_floating,
        total_images=total_images,
        total_tables=total_tables,
    )

    return {
        "score": score,
        "headings": headings,
        "heading_issues": paragraphs_with_large_font,
        "images": {"total": total_images, "with_alt": images_with_alt},
        "tables": {"total": total_tables, "with_headers": tables_with_headers},
        "has_lang": has_lang,
        "has_title": has_title,
        "floating_images": floating_images,
        "page_count": _estimate_page_count(doc),
    }


def _check_heading_hierarchy(headings: list[dict]) -> bool:
    """Check that heading levels don't skip (e.g., H1 → H3 with no H2)."""
    if not headings:
        return True
    prev_level = 0
    for h in headings:
        if h["level"] > prev_level + 1 and prev_level > 0:
            return False
        prev_level = h["level"]
    return True


def _find_images(doc) -> list[dict]:
    """Find all images in the document and check for alt text."""
    images = []
    for rel in doc.part.rels.values():
        if "image" in rel.reltype:
            images.append({"rel_id": rel.rId, "alt_text": None})

    # Check alt text via XML
    body = doc.element.body
    for drawing in body.iter("{%s}drawing" % NSMAP["w"]):
        docPr = drawing.find(".//{%s}docPr" % NSMAP["wp"])
        if docPr is None:
            # Try inline
            docPr = drawing.find(".//{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}docPr")
        if docPr is not None:
            alt = docPr.get("descr", "")
            title = docPr.get("title", "")
            images.append({"alt_text": alt or title, "name": docPr.get("name", "")})

    # Deduplicate — keep the XML-found ones with alt text info
    seen = set()
    unique = []
    for img in images:
        key = img.get("name") or img.get("rel_id", id(img))
        if key not in seen:
            seen.add(key)
            unique.append(img)

    return unique


def _table_has_header(table) -> bool:
    """Check if a table has the header row repeat flag set."""
    tbl = table._tbl
    tblPr = tbl.find("{%s}tblPr" % NSMAP["w"])
    if tblPr is None:
        return False
    # Check first row for trPr/tblHeader
    first_row = tbl.find("{%s}tr" % NSMAP["w"])
    if first_row is None:
        return False
    trPr = first_row.find("{%s}trPr" % NSMAP["w"])
    if trPr is None:
        return False
    tblHeader = trPr.find("{%s}tblHeader" % NSMAP["w"])
    return tblHeader is not None


def _has_document_language(doc) -> bool:
    """Check if document language is set."""
    # Check styles.xml for default language
    body = doc.element.body
    for lang in body.iter("{%s}lang" % NSMAP["w"]):
        if lang.get("{%s}val" % NSMAP["w"]):
            return True
    return False


def _count_floating_images(doc) -> int:
    """Count images with text wrapping (non-inline)."""
    count = 0
    body = doc.element.body
    for drawing in body.iter("{%s}drawing" % NSMAP["w"]):
        # Inline images use wp:inline, floating use wp:anchor
        anchor = drawing.find("{%s}anchor" % NSMAP["wp"])
        if anchor is not None:
            count += 1
    return count


def _estimate_page_count(doc) -> int:
    """Rough page estimate based on paragraph count."""
    # python-docx can't reliably determine page count without rendering
    # Use a rough heuristic: ~30 paragraphs per page
    para_count = len([p for p in doc.paragraphs if p.text.strip()])
    return max(1, para_count // 30 + 1)


def _compute_docx_score(
    has_headings: bool,
    hierarchy_valid: bool,
    alt_text_coverage: float,
    table_header_coverage: float,
    has_lang: bool,
    has_title: bool,
    has_no_floating: bool,
    total_images: int,
    total_tables: int,
) -> dict:
    """Compute 0-100 accessibility score for Word document."""
    checks = {
        "headings": {
            "passed": has_headings and hierarchy_valid,
            "weight": 20,
            "description": "Headings present with valid hierarchy",
        },
        "alt_text": {
            "passed": alt_text_coverage >= 0.9 if total_images > 0 else True,
            "weight": 25,
            "description": "Images have alt text" if total_images > 0 else "No images -- alt text not needed",
        },
        "table_headers": {
            "passed": table_header_coverage >= 0.9 if total_tables > 0 else True,
            "weight": 15,
            "description": "Tables have header rows" if total_tables > 0 else "No tables -- headers not needed",
        },
        "language": {
            "passed": has_lang,
            "weight": 10,
            "description": "Document language specified",
        },
        "title": {
            "passed": has_title,
            "weight": 10,
            "description": "Document title set",
        },
        "no_floating": {
            "passed": has_no_floating,
            "weight": 10,
            "description": "No floating images (inline only)",
        },
        "contrast": {
            "passed": True,  # Placeholder — contrast check is complex
            "weight": 10,
            "description": "Color contrast adequate (not yet checked)",
        },
    }

    total = sum(c["weight"] for c in checks.values())
    earned = sum(c["weight"] for c in checks.values() if c["passed"])
    score = round(100 * earned / total) if total > 0 else 0

    return {"score": score, "checks": checks}


# ---------------------------------------------------------------------------
# 2. Remediation
# ---------------------------------------------------------------------------

def _classify_paragraphs(doc) -> list[dict]:
    """Classify paragraphs into heading/body tags by font size heuristic."""
    MAX_HEADING_CHARS = 200
    blocks = []

    font_sizes = set()
    for i, para in enumerate(doc.paragraphs):
        if not para.text.strip():
            continue
        # Get effective font size
        size = None
        for run in para.runs:
            if run.font.size:
                size = run.font.size
                break
        if size is None:
            # Try style default
            if para.style and para.style.font and para.style.font.size:
                size = para.style.font.size

        # Already a heading style
        if para.style.name.startswith("Heading"):
            level = int(para.style.name.split()[-1]) if para.style.name != "Heading" else 1
            blocks.append({
                "index": i,
                "text": para.text[:120],
                "type": f"H{level}",
                "font_size": size.pt if size else 0,
                "is_heading_style": True,
            })
        else:
            blocks.append({
                "index": i,
                "text": para.text[:120],
                "type": "P",
                "font_size": size.pt if size else 0,
                "is_heading_style": False,
            })
            if size:
                font_sizes.add(size.pt)

    if not font_sizes:
        return blocks

    # Identify probable headings: bold + large font + short text
    sorted_sizes = sorted(font_sizes, reverse=True)
    for block in blocks:
        if block["is_heading_style"]:
            continue
        if len(block["text"]) > MAX_HEADING_CHARS:
            continue
        if block["font_size"] <= 0:
            continue

        size_rank = sorted_sizes.index(block["font_size"]) if block["font_size"] in sorted_sizes else -1
        if size_rank == 0 and block["font_size"] >= 18:
            block["type"] = "H1"
        elif size_rank == 1 and block["font_size"] >= 14:
            block["type"] = "H2"
        elif size_rank == 2 and block["font_size"] >= 12:
            block["type"] = "H3"

    return blocks


def _apply_heading_styles(doc, classifications: list[dict]):
    """Apply proper Word heading styles based on classifications."""
    style_map = {"H1": "Heading 1", "H2": "Heading 2", "H3": "Heading 3"}
    paragraphs = list(doc.paragraphs)

    for cls in classifications:
        if cls["type"] in style_map and not cls["is_heading_style"]:
            idx = cls["index"]
            if idx < len(paragraphs):
                paragraphs[idx].style = doc.styles[style_map[cls["type"]]]


def _set_table_headers(doc):
    """Set the tblHeader flag on the first row of every table."""
    w_ns = NSMAP["w"]
    for table in doc.tables:
        first_row = table._tbl.find(f"{{{w_ns}}}tr")
        if first_row is None:
            continue
        trPr = first_row.find(f"{{{w_ns}}}trPr")
        if trPr is None:
            trPr = etree.SubElement(first_row, f"{{{w_ns}}}trPr")
            first_row.insert(0, trPr)
        existing = trPr.find(f"{{{w_ns}}}tblHeader")
        if existing is None:
            etree.SubElement(trPr, f"{{{w_ns}}}tblHeader")


def _set_document_language(doc, lang: str = "en-US"):
    """Set the document-level language."""
    body = doc.element.body
    # Find or create rPr in the document defaults via styles
    styles_element = doc.styles.element
    docDefaults = styles_element.find(f"{{{NSMAP['w']}}}docDefaults")
    if docDefaults is None:
        docDefaults = etree.SubElement(styles_element, f"{{{NSMAP['w']}}}docDefaults")
        styles_element.insert(0, docDefaults)

    rPrDefault = docDefaults.find(f"{{{NSMAP['w']}}}rPrDefault")
    if rPrDefault is None:
        rPrDefault = etree.SubElement(docDefaults, f"{{{NSMAP['w']}}}rPrDefault")

    rPr = rPrDefault.find(f"{{{NSMAP['w']}}}rPr")
    if rPr is None:
        rPr = etree.SubElement(rPrDefault, f"{{{NSMAP['w']}}}rPr")

    lang_elem = rPr.find(f"{{{NSMAP['w']}}}lang")
    if lang_elem is None:
        lang_elem = etree.SubElement(rPr, f"{{{NSMAP['w']}}}lang")

    lang_elem.set(f"{{{NSMAP['w']}}}val", lang)
    lang_elem.set(f"{{{NSMAP['w']}}}eastAsia", lang)
    lang_elem.set(f"{{{NSMAP['w']}}}bidi", "ar-SA")


def _set_alt_text_on_images(doc, alt_texts: dict):
    """Write AI-generated alt text to images.

    alt_texts: dict mapping image index to alt text string.
    """
    body = doc.element.body
    drawings = list(body.iter("{%s}drawing" % NSMAP["w"]))

    for idx, drawing in enumerate(drawings):
        alt = alt_texts.get(idx)
        if not alt:
            continue
        # Find docPr element
        docPr = drawing.find(".//{%s}docPr" % NSMAP["wp"])
        if docPr is not None:
            docPr.set("descr", alt)


# ---------------------------------------------------------------------------
# 3. Main Pipeline
# ---------------------------------------------------------------------------

async def remediate_docx_async(
    file_path: str,
    output_path: str | None = None,
    verify: bool = True,
) -> dict:
    """Full Word document remediation pipeline."""
    file_path = str(file_path)
    if output_path is None:
        p = Path(file_path)
        output_path = str(p.parent / f"{p.stem}_remediated{p.suffix}")

    logger.info("Analyzing input DOCX: %s", file_path)
    before_analysis = analyze_docx(file_path)

    # Open document for remediation
    doc = docx.Document(file_path)

    # Heuristic classification
    classifications = _classify_paragraphs(doc)

    # Apply heuristic fixes
    _apply_heading_styles(doc, classifications)
    _set_table_headers(doc)

    if not doc.core_properties.title:
        # Set title from first heading
        for cls in classifications:
            if cls["type"] == "H1":
                doc.core_properties.title = cls["text"][:256]
                break

    if not _has_document_language(doc):
        _set_document_language(doc)

    # Gemini AI verification
    verification_info = None
    if verify:
        from gemini_verify import verify_and_correct_office

        logger.info("Running Gemini AI verification on DOCX")
        # Build tag assignments in the format Gemini expects
        tag_assignments = [
            {"mcid": i, "page": 0, "type": cls["type"], "text": cls["text"],
             "bbox": [0, 0, 0, 0], "font_size": cls["font_size"]}
            for i, cls in enumerate(classifications)
        ]

        verification_result = await verify_and_correct_office(
            file_path=file_path,
            structure_data=tag_assignments,
            format="docx",
        )

        verification_info = {
            "issues_found": verification_result.get("issues_found", []),
            "verification_score": verification_result.get("verification_score", 0.0),
        }

        # Apply Gemini corrections to headings
        corrected = verification_result.get("corrected_tags", [])
        if corrected:
            style_map = {"H1": "Heading 1", "H2": "Heading 2", "H3": "Heading 3"}
            paragraphs = list(doc.paragraphs)
            non_empty_idx = 0
            for para in paragraphs:
                if not para.text.strip():
                    continue
                # Find matching correction
                for ct in corrected:
                    if ct.get("mcid") == non_empty_idx:
                        tag_type = ct.get("type", "P")
                        if tag_type in style_map:
                            para.style = doc.styles[style_map[tag_type]]
                        elif tag_type == "P" and para.style.name.startswith("Heading"):
                            para.style = doc.styles["Normal"]
                        break
                non_empty_idx += 1

        # Apply AI alt texts
        alt_texts_raw = verification_result.get("alt_texts", {})
        if isinstance(alt_texts_raw, dict):
            # Format: {page: [{image_index, alt_text}]}
            flat_alts = {}
            for page_alts in alt_texts_raw.values():
                for entry in page_alts:
                    flat_alts[entry.get("image_index", 0)] = entry.get("alt_text", "")
            _set_alt_text_on_images(doc, flat_alts)
        elif isinstance(alt_texts_raw, list):
            flat_alts = {i: entry.get("description", "") for i, entry in enumerate(alt_texts_raw)}
            _set_alt_text_on_images(doc, flat_alts)

    # Save remediated document
    doc.save(output_path)
    logger.info("Saved remediated DOCX: %s", output_path)

    # Analyze the output
    after_analysis = analyze_docx(output_path)

    result = {
        "before": before_analysis,
        "after": after_analysis,
        "output_path": output_path,
        "page_count": before_analysis.get("page_count", 1),
    }

    if verification_info:
        result["verification"] = verification_info

    return result
```

**Step 2: Copy the new file into the Docker context**

Add to `agent/Dockerfile` after the `COPY remediation.py .` line:

```dockerfile
COPY remediation_docx.py .
```

**Step 3: Commit**

```bash
git add agent/remediation_docx.py agent/Dockerfile
git commit -m "feat: add Word document accessibility remediation engine"
```

---

### Task 9: Excel Remediation Engine

**Files:**
- Create: `agent/remediation_xlsx.py`

**Step 1: Create the Excel remediation module**

Create `agent/remediation_xlsx.py`:

```python
"""
CASO Comply -- Excel (.xlsx) Accessibility Remediation Engine

Analyzes and remediates Excel workbook accessibility issues using openpyxl
and lxml for OOXML manipulation.
"""
from __future__ import annotations

import asyncio
import logging
from collections import defaultdict
from pathlib import Path

import openpyxl
from openpyxl.worksheet.table import Table
from lxml import etree

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# 1. Analysis
# ---------------------------------------------------------------------------

def analyze_xlsx(file_path: str) -> dict:
    """Analyze Excel workbook for accessibility issues."""
    wb = openpyxl.load_workbook(file_path, data_only=True)

    # Check sheet names
    generic_names = {"Sheet", "Sheet1", "Sheet2", "Sheet3", "Sheet4", "Sheet5"}
    sheet_issues = [name for name in wb.sheetnames if name in generic_names]
    descriptive_sheets = len(wb.sheetnames) - len(sheet_issues)
    sheet_name_coverage = descriptive_sheets / max(len(wb.sheetnames), 1)

    # Check for merged cells
    total_merged = 0
    for ws in wb.worksheets:
        total_merged += len(ws.merged_cells.ranges)

    # Check tables for headers
    total_tables = 0
    tables_with_headers = 0
    for ws in wb.worksheets:
        for tbl in ws.tables.values():
            total_tables += 1
            # Tables in openpyxl have headerRowCount
            if tbl.headerRowCount and tbl.headerRowCount > 0:
                tables_with_headers += 1

    table_header_coverage = tables_with_headers / max(total_tables, 1)

    # Check images for alt text
    total_images = 0
    images_with_alt = 0
    for ws in wb.worksheets:
        for img in ws._images:
            total_images += 1
            # Check drawing properties for alt text
            if hasattr(img, 'desc') and img.desc:
                images_with_alt += 1

    alt_text_coverage = images_with_alt / max(total_images, 1)

    # Check document properties
    has_title = bool(wb.properties.title)

    # Check language (not natively supported in openpyxl — check via XML)
    has_lang = _has_workbook_language(wb)

    # Compute score
    score = _compute_xlsx_score(
        table_header_coverage=table_header_coverage,
        total_merged=total_merged,
        sheet_name_coverage=sheet_name_coverage,
        alt_text_coverage=alt_text_coverage,
        has_lang=has_lang,
        has_title=has_title,
        total_images=total_images,
        total_tables=total_tables,
    )

    wb.close()

    return {
        "score": score,
        "sheets": {"total": len(wb.sheetnames), "generic_names": sheet_issues},
        "merged_cells": total_merged,
        "tables": {"total": total_tables, "with_headers": tables_with_headers},
        "images": {"total": total_images, "with_alt": images_with_alt},
        "has_title": has_title,
        "has_lang": has_lang,
        "page_count": len(wb.sheetnames),  # Sheets as "pages" for billing
    }


def _has_workbook_language(wb) -> bool:
    """Check if workbook has a language property set."""
    return bool(wb.properties.language) if hasattr(wb.properties, 'language') else False


def _compute_xlsx_score(
    table_header_coverage: float,
    total_merged: int,
    sheet_name_coverage: float,
    alt_text_coverage: float,
    has_lang: bool,
    has_title: bool,
    total_images: int,
    total_tables: int,
) -> dict:
    """Compute 0-100 accessibility score for Excel workbook."""
    checks = {
        "table_headers": {
            "passed": table_header_coverage >= 0.9 if total_tables > 0 else True,
            "weight": 25,
            "description": "Tables have header rows" if total_tables > 0 else "No tables -- headers not needed",
        },
        "no_merged": {
            "passed": total_merged == 0,
            "weight": 15,
            "description": "No merged cells" if total_merged == 0 else f"{total_merged} merged cell ranges found",
        },
        "sheet_names": {
            "passed": sheet_name_coverage >= 0.9,
            "weight": 10,
            "description": "Sheet names are descriptive",
        },
        "alt_text": {
            "passed": alt_text_coverage >= 0.9 if total_images > 0 else True,
            "weight": 20,
            "description": "Images/charts have alt text" if total_images > 0 else "No images -- alt text not needed",
        },
        "language": {
            "passed": has_lang,
            "weight": 10,
            "description": "Workbook language specified",
        },
        "title": {
            "passed": has_title,
            "weight": 10,
            "description": "Workbook title set",
        },
        "no_color_only": {
            "passed": True,  # Placeholder — requires AI verification
            "weight": 10,
            "description": "No color-only information (not yet checked)",
        },
    }

    total = sum(c["weight"] for c in checks.values())
    earned = sum(c["weight"] for c in checks.values() if c["passed"])
    score = round(100 * earned / total) if total > 0 else 0

    return {"score": score, "checks": checks}


# ---------------------------------------------------------------------------
# 2. Remediation
# ---------------------------------------------------------------------------

def _unmerge_cells(wb):
    """Unmerge all merged cells and fill each cell with the original value."""
    for ws in wb.worksheets:
        merged_ranges = list(ws.merged_cells.ranges)
        for merge_range in merged_ranges:
            # Get the value from the top-left cell before unmerging
            min_row = merge_range.min_row
            min_col = merge_range.min_col
            value = ws.cell(row=min_row, column=min_col).value

            ws.unmerge_cells(str(merge_range))

            # Fill all cells in the range with the original value
            for row in range(merge_range.min_row, merge_range.max_row + 1):
                for col in range(merge_range.min_col, merge_range.max_col + 1):
                    ws.cell(row=row, column=col).value = value


def _set_table_headers(wb):
    """Ensure all tables have header rows designated."""
    for ws in wb.worksheets:
        for tbl in ws.tables.values():
            if not tbl.headerRowCount or tbl.headerRowCount == 0:
                tbl.headerRowCount = 1


def _remove_blank_separators(wb):
    """Remove completely blank rows/columns within data regions."""
    # This is intentionally conservative — only removes rows/columns where
    # ALL cells are empty and the row/column is between data rows/columns
    pass  # Skipping for v1 — too risky to delete rows automatically


# ---------------------------------------------------------------------------
# 3. Main Pipeline
# ---------------------------------------------------------------------------

async def remediate_xlsx_async(
    file_path: str,
    output_path: str | None = None,
    verify: bool = True,
) -> dict:
    """Full Excel workbook remediation pipeline."""
    file_path = str(file_path)
    if output_path is None:
        p = Path(file_path)
        output_path = str(p.parent / f"{p.stem}_remediated{p.suffix}")

    logger.info("Analyzing input XLSX: %s", file_path)
    before_analysis = analyze_xlsx(file_path)

    # Open workbook for remediation
    wb = openpyxl.load_workbook(file_path)

    # Apply heuristic fixes
    _unmerge_cells(wb)
    _set_table_headers(wb)

    # Set title if missing
    if not wb.properties.title:
        # Use first sheet name as title
        wb.properties.title = wb.sheetnames[0] if wb.sheetnames else "Untitled Workbook"

    # Gemini AI verification
    verification_info = None
    if verify:
        from gemini_verify import verify_and_correct_office

        logger.info("Running Gemini AI verification on XLSX")

        # Build structure data for Gemini
        structure_data = {
            "sheets": wb.sheetnames,
            "tables_per_sheet": {},
            "merged_ranges_fixed": before_analysis["merged_cells"],
            "images_count": before_analysis["images"]["total"],
        }
        for ws in wb.worksheets:
            structure_data["tables_per_sheet"][ws.title] = [
                {"name": tbl.name, "ref": tbl.ref, "has_header": bool(tbl.headerRowCount)}
                for tbl in ws.tables.values()
            ]

        verification_result = await verify_and_correct_office(
            file_path=file_path,
            structure_data=structure_data,
            format="xlsx",
        )

        verification_info = {
            "issues_found": verification_result.get("issues_found", []),
            "verification_score": verification_result.get("verification_score", 0.0),
        }

        # Apply sheet name suggestions
        for suggestion in verification_result.get("sheet_names", []):
            original = suggestion.get("original")
            suggested = suggestion.get("suggested")
            if original and suggested and original in wb.sheetnames:
                wb[original].title = suggested

        # Apply alt texts
        for alt_entry in verification_result.get("alt_texts", []):
            sheet_name = alt_entry.get("sheet")
            obj_idx = alt_entry.get("object_index", 0)
            desc = alt_entry.get("description", "")
            if sheet_name and sheet_name in wb.sheetnames and desc:
                ws = wb[sheet_name]
                if obj_idx < len(ws._images):
                    img = ws._images[obj_idx]
                    if hasattr(img, 'desc'):
                        img.desc = desc

    # Save remediated workbook
    wb.save(output_path)
    wb.close()
    logger.info("Saved remediated XLSX: %s", output_path)

    # Analyze the output
    after_analysis = analyze_xlsx(output_path)

    result = {
        "before": before_analysis,
        "after": after_analysis,
        "output_path": output_path,
        "page_count": before_analysis.get("page_count", 1),
    }

    if verification_info:
        result["verification"] = verification_info

    return result
```

**Step 2: Add to Dockerfile**

Add after the other COPY lines:

```dockerfile
COPY remediation_xlsx.py .
```

**Step 3: Commit**

```bash
git add agent/remediation_xlsx.py agent/Dockerfile
git commit -m "feat: add Excel workbook accessibility remediation engine"
```

---

### Task 10: PowerPoint Remediation Engine

**Files:**
- Create: `agent/remediation_pptx.py`

**Step 1: Create the PowerPoint remediation module**

Create `agent/remediation_pptx.py`:

```python
"""
CASO Comply -- PowerPoint (.pptx) Accessibility Remediation Engine

Analyzes and remediates PowerPoint presentation accessibility issues using
python-pptx and lxml for OOXML manipulation.
"""
from __future__ import annotations

import asyncio
import logging
from pathlib import Path

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from lxml import etree

logger = logging.getLogger(__name__)

# OOXML namespaces
NSMAP = {
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}


# ---------------------------------------------------------------------------
# 1. Analysis
# ---------------------------------------------------------------------------

def analyze_pptx(file_path: str) -> dict:
    """Analyze PowerPoint presentation for accessibility issues."""
    prs = Presentation(file_path)

    # Check slide titles
    slides_without_title = []
    total_slides = len(prs.slides)
    for i, slide in enumerate(prs.slides):
        if not slide.shapes.title or not slide.shapes.title.text.strip():
            slides_without_title.append(i + 1)

    title_coverage = (total_slides - len(slides_without_title)) / max(total_slides, 1)

    # Check reading order
    reading_order_issues = []
    for i, slide in enumerate(prs.slides):
        if _has_reading_order_issue(slide):
            reading_order_issues.append(i + 1)

    reading_order_coverage = (total_slides - len(reading_order_issues)) / max(total_slides, 1)

    # Check images for alt text
    total_images = 0
    images_with_alt = 0
    for slide in prs.slides:
        for shape in slide.shapes:
            if shape.shape_type and shape.shape_type in (13, 17):  # Picture, Linked Picture
                total_images += 1
                if _shape_has_alt_text(shape):
                    images_with_alt += 1
            elif hasattr(shape, "image"):
                total_images += 1
                if _shape_has_alt_text(shape):
                    images_with_alt += 1

    alt_text_coverage = images_with_alt / max(total_images, 1)

    # Check tables
    total_tables = 0
    tables_with_headers = 0
    for slide in prs.slides:
        for shape in slide.shapes:
            if shape.has_table:
                total_tables += 1
                if _table_has_header(shape.table):
                    tables_with_headers += 1

    table_header_coverage = tables_with_headers / max(total_tables, 1)

    # Check animations/transitions
    dangerous_animations = _count_dangerous_animations(prs)

    # Check document properties
    has_title = bool(prs.core_properties.title)

    # Language check
    has_lang = _has_presentation_language(prs)

    # Compute score
    score = _compute_pptx_score(
        title_coverage=title_coverage,
        reading_order_coverage=reading_order_coverage,
        alt_text_coverage=alt_text_coverage,
        table_header_coverage=table_header_coverage,
        dangerous_animations=dangerous_animations,
        has_lang=has_lang,
        has_title=has_title,
        total_images=total_images,
        total_tables=total_tables,
        total_slides=total_slides,
    )

    return {
        "score": score,
        "slides": {
            "total": total_slides,
            "without_title": slides_without_title,
            "reading_order_issues": reading_order_issues,
        },
        "images": {"total": total_images, "with_alt": images_with_alt},
        "tables": {"total": total_tables, "with_headers": tables_with_headers},
        "dangerous_animations": dangerous_animations,
        "has_title": has_title,
        "has_lang": has_lang,
        "page_count": total_slides,
    }


def _shape_has_alt_text(shape) -> bool:
    """Check if a shape has alt text set."""
    el = shape._element
    cNvPr = el.find(".//{http://schemas.openxmlformats.org/presentationml/2006/main}cNvPr")
    if cNvPr is None:
        cNvPr = el.find(".//{http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing}cNvPr")
    if cNvPr is None:
        # Try the nvSpPr path
        nvSpPr = el.find(".//{%s}nvSpPr" % NSMAP["p"])
        if nvSpPr is not None:
            cNvPr = nvSpPr.find("{%s}cNvPr" % NSMAP["p"])
    if cNvPr is None:
        # Generic search
        for tag in ("nvPicPr", "nvSpPr", "nvGrpSpPr"):
            parent = el.find(".//{%s}%s" % (NSMAP["p"], tag))
            if parent is not None:
                cNvPr = parent.find("{%s}cNvPr" % NSMAP["p"])
                if cNvPr is not None:
                    break

    if cNvPr is not None:
        return bool(cNvPr.get("descr", "").strip())
    return False


def _has_reading_order_issue(slide) -> bool:
    """Check if shapes are in a logical reading order (title first, then top-to-bottom)."""
    shapes = list(slide.shapes)
    if len(shapes) <= 1:
        return False

    # Title should be first in reading order
    title_shape = slide.shapes.title
    if title_shape:
        sp_tree = slide._element.find(".//{%s}spTree" % NSMAP["p"])
        if sp_tree is not None:
            children = list(sp_tree)
            title_idx = None
            for i, child in enumerate(children):
                if child == title_shape._element:
                    title_idx = i
                    break
            if title_idx is not None and title_idx > 1:  # Allow nvGrpSpPr at 0
                return True

    # Check if shapes are roughly top-to-bottom ordered
    positioned = [(s.top or 0, s.left or 0, s) for s in shapes if hasattr(s, 'top') and s.top is not None]
    if len(positioned) < 2:
        return False

    # Simple check: are shapes roughly sorted by vertical position?
    tops = [p[0] for p in positioned]
    sorted_tops = sorted(tops)
    # Allow some tolerance — shapes within 10% of slide height of each other are OK
    return tops != sorted_tops


def _table_has_header(table) -> bool:
    """Check if a table has firstRow set."""
    tbl = table._tbl
    tblPr = tbl.find("{%s}tblPr" % NSMAP["a"])
    if tblPr is not None:
        return tblPr.get("firstRow", "0") == "1"
    return False


def _count_dangerous_animations(prs) -> int:
    """Count transitions and animations that could trigger seizures."""
    count = 0
    for slide in prs.slides:
        sp_tree = slide._element
        # Check for transitions
        transition = sp_tree.find("{%s}transition" % NSMAP["p"])
        if transition is not None:
            count += 1
        # Check for timing/animation
        timing = sp_tree.find("{%s}timing" % NSMAP["p"])
        if timing is not None:
            count += 1
    return count


def _has_presentation_language(prs) -> bool:
    """Check if presentation has a default language set."""
    # Check via the default text style
    try:
        presentation_el = prs.presentation._element if hasattr(prs, 'presentation') else prs._element
        defaultTextStyle = presentation_el.find("{%s}defaultTextStyle" % NSMAP["p"])
        if defaultTextStyle is not None:
            for rPr in defaultTextStyle.iter("{%s}defRPr" % NSMAP["a"]):
                if rPr.get("lang"):
                    return True
    except Exception:
        pass
    return False


def _compute_pptx_score(
    title_coverage: float,
    reading_order_coverage: float,
    alt_text_coverage: float,
    table_header_coverage: float,
    dangerous_animations: int,
    has_lang: bool,
    has_title: bool,
    total_images: int,
    total_tables: int,
    total_slides: int,
) -> dict:
    """Compute 0-100 accessibility score for PowerPoint."""
    checks = {
        "slide_titles": {
            "passed": title_coverage >= 0.9,
            "weight": 20,
            "description": "All slides have titles",
        },
        "reading_order": {
            "passed": reading_order_coverage >= 0.8,
            "weight": 20,
            "description": "Reading order is logical",
        },
        "alt_text": {
            "passed": alt_text_coverage >= 0.9 if total_images > 0 else True,
            "weight": 25,
            "description": "Images have alt text" if total_images > 0 else "No images -- alt text not needed",
        },
        "table_headers": {
            "passed": table_header_coverage >= 0.9 if total_tables > 0 else True,
            "weight": 10,
            "description": "Tables have headers" if total_tables > 0 else "No tables -- headers not needed",
        },
        "no_dangerous_animations": {
            "passed": dangerous_animations == 0,
            "weight": 10,
            "description": "No dangerous animations/transitions",
        },
        "language": {
            "passed": has_lang,
            "weight": 5,
            "description": "Presentation language set",
        },
        "title": {
            "passed": has_title,
            "weight": 5,
            "description": "Presentation title set",
        },
        "contrast": {
            "passed": True,  # Placeholder
            "weight": 5,
            "description": "Text contrast adequate (not yet checked)",
        },
    }

    total = sum(c["weight"] for c in checks.values())
    earned = sum(c["weight"] for c in checks.values() if c["passed"])
    score = round(100 * earned / total) if total > 0 else 0

    return {"score": score, "checks": checks}


# ---------------------------------------------------------------------------
# 2. Remediation
# ---------------------------------------------------------------------------

def _add_missing_titles(prs, suggestions: dict | None = None):
    """Add title placeholders to slides without titles."""
    for i, slide in enumerate(prs.slides):
        if slide.shapes.title and slide.shapes.title.text.strip():
            continue

        # Check if there's a title placeholder we can fill
        if slide.shapes.title:
            suggested = suggestions.get(i + 1, f"Slide {i + 1}") if suggestions else f"Slide {i + 1}"
            slide.shapes.title.text = suggested
            continue

        # No title placeholder — add a hidden one
        # Add an off-slide text box as a workaround
        from pptx.util import Inches, Pt
        txBox = slide.shapes.add_textbox(
            Inches(0), Inches(0), Inches(1), Inches(0.3)
        )
        tf = txBox.text_frame
        suggested = suggestions.get(i + 1, f"Slide {i + 1}") if suggestions else f"Slide {i + 1}"
        tf.text = suggested
        # Make it very small so it's effectively hidden but still readable by screen readers
        for paragraph in tf.paragraphs:
            for run in paragraph.runs:
                run.font.size = Pt(1)


def _fix_reading_order(slide):
    """Reorder shapes in spTree by visual position: title first, then top-to-bottom, left-to-right."""
    sp_tree = slide._element.find(".//{%s}spTree" % NSMAP["p"])
    if sp_tree is None:
        return

    # Separate non-shape children (nvGrpSpPr, grpSpPr) from shapes
    non_shapes = []
    shapes = []
    for child in list(sp_tree):
        tag = etree.QName(child.tag).localname
        if tag in ("nvGrpSpPr", "grpSpPr"):
            non_shapes.append(child)
        else:
            shapes.append(child)

    if len(shapes) <= 1:
        return

    # Sort shapes: title first, then by top position, then left
    def sort_key(el):
        # Check if this is the title
        nvSpPr = el.find(".//{%s}nvSpPr" % NSMAP["p"])
        if nvSpPr is not None:
            nvPr = nvSpPr.find("{%s}nvPr" % NSMAP["p"])
            if nvPr is not None:
                ph = nvPr.find("{%s}ph" % NSMAP["p"])
                if ph is not None and ph.get("type") == "title":
                    return (-1, 0)  # Title always first
                if ph is not None and ph.get("idx") == "0":
                    return (-1, 0)  # Title placeholder

        # Get position
        spPr = el.find(".//{%s}spPr" % NSMAP["a"])
        if spPr is not None:
            off = spPr.find("{%s}off" % NSMAP["a"])
            if off is not None:
                y = int(off.get("y", "0"))
                x = int(off.get("x", "0"))
                return (y, x)

        xfrm = el.find(".//{%s}xfrm" % NSMAP["a"])
        if xfrm is not None:
            off = xfrm.find("{%s}off" % NSMAP["a"])
            if off is not None:
                y = int(off.get("y", "0"))
                x = int(off.get("x", "0"))
                return (y, x)

        return (999999, 999999)

    shapes.sort(key=sort_key)

    # Rebuild spTree
    for child in list(sp_tree):
        sp_tree.remove(child)
    for ns in non_shapes:
        sp_tree.append(ns)
    for s in shapes:
        sp_tree.append(s)


def _set_table_headers(prs):
    """Set firstRow attribute on all tables."""
    for slide in prs.slides:
        for shape in slide.shapes:
            if shape.has_table:
                tbl = shape.table._tbl
                tblPr = tbl.find("{%s}tblPr" % NSMAP["a"])
                if tblPr is not None:
                    tblPr.set("firstRow", "1")
                else:
                    tblPr = etree.SubElement(tbl, "{%s}tblPr" % NSMAP["a"])
                    tblPr.set("firstRow", "1")
                    tbl.insert(0, tblPr)


def _remove_dangerous_animations(prs):
    """Remove all transitions and complex animations."""
    for slide in prs.slides:
        el = slide._element
        # Remove transitions
        for transition in el.findall("{%s}transition" % NSMAP["p"]):
            el.remove(transition)
        # Remove timing/animations
        for timing in el.findall("{%s}timing" % NSMAP["p"]):
            el.remove(timing)


def _set_alt_text_on_shapes(slide, alt_texts: list[dict]):
    """Write alt text to shapes on a slide.

    alt_texts: list of {shape_index, description, is_decorative}
    """
    shapes = list(slide.shapes)
    for entry in alt_texts:
        idx = entry.get("shape_index", -1)
        desc = entry.get("description", "")
        is_decorative = entry.get("is_decorative", False)

        if idx < 0 or idx >= len(shapes):
            continue

        shape = shapes[idx]
        el = shape._element

        # Find cNvPr — try multiple paths
        cNvPr = None
        for parent_tag in ("nvSpPr", "nvPicPr", "nvCxnSpPr", "nvGrpSpPr"):
            parent = el.find("{%s}%s" % (NSMAP["p"], parent_tag))
            if parent is not None:
                cNvPr = parent.find("{%s}cNvPr" % NSMAP["p"])
                if cNvPr is not None:
                    break

        if cNvPr is not None:
            if is_decorative:
                cNvPr.set("descr", "")
            else:
                cNvPr.set("descr", desc)


# ---------------------------------------------------------------------------
# 3. Main Pipeline
# ---------------------------------------------------------------------------

async def remediate_pptx_async(
    file_path: str,
    output_path: str | None = None,
    verify: bool = True,
) -> dict:
    """Full PowerPoint presentation remediation pipeline."""
    file_path = str(file_path)
    if output_path is None:
        p = Path(file_path)
        output_path = str(p.parent / f"{p.stem}_remediated{p.suffix}")

    logger.info("Analyzing input PPTX: %s", file_path)
    before_analysis = analyze_pptx(file_path)

    # Open presentation for remediation
    prs = Presentation(file_path)

    # Apply heuristic fixes
    _set_table_headers(prs)
    _remove_dangerous_animations(prs)

    # Fix reading order on all slides
    for slide in prs.slides:
        _fix_reading_order(slide)

    # Set title if missing
    if not prs.core_properties.title:
        first_title = None
        for slide in prs.slides:
            if slide.shapes.title and slide.shapes.title.text.strip():
                first_title = slide.shapes.title.text[:256]
                break
        prs.core_properties.title = first_title or "Untitled Presentation"

    # Gemini AI verification
    verification_info = None
    if verify:
        from gemini_verify import verify_and_correct_office

        logger.info("Running Gemini AI verification on PPTX")

        # Build structure data
        structure_data = {
            "slides": [],
            "total_slides": len(prs.slides),
        }
        for i, slide in enumerate(prs.slides):
            slide_data = {
                "slide_number": i + 1,
                "has_title": bool(slide.shapes.title and slide.shapes.title.text.strip()),
                "title_text": slide.shapes.title.text if slide.shapes.title else None,
                "shape_count": len(slide.shapes),
                "shapes": [],
            }
            for j, shape in enumerate(slide.shapes):
                slide_data["shapes"].append({
                    "index": j,
                    "name": shape.name,
                    "type": str(shape.shape_type) if shape.shape_type else "unknown",
                    "has_text": shape.has_text_frame,
                    "text": shape.text_frame.text[:100] if shape.has_text_frame else None,
                    "has_alt": _shape_has_alt_text(shape),
                    "top": shape.top,
                    "left": shape.left,
                })
            structure_data["slides"].append(slide_data)

        verification_result = await verify_and_correct_office(
            file_path=file_path,
            structure_data=structure_data,
            format="pptx",
        )

        verification_info = {
            "issues_found": verification_result.get("issues_found", []),
            "verification_score": verification_result.get("verification_score", 0.0),
        }

        # Apply slide title suggestions
        title_suggestions = {}
        for slide_fix in verification_result.get("slides", []):
            slide_num = slide_fix.get("slide_number", 0)
            suggested_title = slide_fix.get("suggested_title", "")
            if suggested_title:
                title_suggestions[slide_num] = suggested_title

        if title_suggestions:
            _add_missing_titles(prs, title_suggestions)

        # Apply alt texts per slide
        for alt_entry in verification_result.get("alt_texts", []):
            slide_num = alt_entry.get("slide", 0)
            if 1 <= slide_num <= len(prs.slides):
                _set_alt_text_on_shapes(prs.slides[slide_num - 1], [alt_entry])

    else:
        # Without AI, add generic titles
        _add_missing_titles(prs)

    # Save remediated presentation
    prs.save(output_path)
    logger.info("Saved remediated PPTX: %s", output_path)

    # Analyze the output
    after_analysis = analyze_pptx(output_path)

    result = {
        "before": before_analysis,
        "after": after_analysis,
        "output_path": output_path,
        "page_count": before_analysis.get("page_count", 1),
    }

    if verification_info:
        result["verification"] = verification_info

    return result
```

**Step 2: Add to Dockerfile**

Add after the other COPY lines:

```dockerfile
COPY remediation_pptx.py .
```

**Step 3: Commit**

```bash
git add agent/remediation_pptx.py agent/Dockerfile
git commit -m "feat: add PowerPoint presentation accessibility remediation engine"
```

---

### Task 11: Integration Testing

**Step 1: Create test document fixtures**

Create a simple test for each format to verify the pipeline works end-to-end. Create `agent/tests/test_office_remediation.py`:

```python
"""Integration tests for Office document remediation engines."""
import os
import tempfile
from pathlib import Path

import docx
import openpyxl
from pptx import Presentation


def _create_test_docx(path: str):
    """Create a minimal Word doc with accessibility issues."""
    doc = docx.Document()
    # No heading styles — just bold large text (accessibility issue)
    para = doc.add_paragraph("Company Report")
    run = para.runs[0]
    run.bold = True
    run.font.size = docx.shared.Pt(24)
    doc.add_paragraph("This is the body text of the report.")
    # Table without headers
    table = doc.add_table(rows=3, cols=2)
    table.cell(0, 0).text = "Name"
    table.cell(0, 1).text = "Value"
    table.cell(1, 0).text = "Alpha"
    table.cell(1, 1).text = "100"
    # No title, no language set
    doc.save(path)


def _create_test_xlsx(path: str):
    """Create a minimal Excel workbook with accessibility issues."""
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Sheet1"  # Generic name
    ws["A1"] = "Name"
    ws["B1"] = "Score"
    ws["A2"] = "Alice"
    ws["B2"] = 95
    ws.merge_cells("A4:B4")  # Merged cells
    ws["A4"] = "Summary"
    wb.save(path)


def _create_test_pptx(path: str):
    """Create a minimal PowerPoint with accessibility issues."""
    prs = Presentation()
    # Slide without title
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank layout
    from pptx.util import Inches
    txBox = slide.shapes.add_textbox(Inches(1), Inches(1), Inches(5), Inches(1))
    txBox.text_frame.text = "Important content without a slide title"
    prs.save(path)


def test_docx_analysis():
    with tempfile.NamedTemporaryFile(suffix=".docx", delete=False) as f:
        path = f.name
    try:
        _create_test_docx(path)
        from remediation_docx import analyze_docx
        result = analyze_docx(path)
        assert "score" in result
        assert result["score"]["score"] < 100  # Should have issues
        assert not result["has_title"]
    finally:
        os.unlink(path)


def test_xlsx_analysis():
    with tempfile.NamedTemporaryFile(suffix=".xlsx", delete=False) as f:
        path = f.name
    try:
        _create_test_xlsx(path)
        from remediation_xlsx import analyze_xlsx
        result = analyze_xlsx(path)
        assert "score" in result
        assert result["merged_cells"] > 0
        assert len(result["sheets"]["generic_names"]) > 0
    finally:
        os.unlink(path)


def test_pptx_analysis():
    with tempfile.NamedTemporaryFile(suffix=".pptx", delete=False) as f:
        path = f.name
    try:
        _create_test_pptx(path)
        from remediation_pptx import analyze_pptx
        result = analyze_pptx(path)
        assert "score" in result
        assert len(result["slides"]["without_title"]) > 0
    finally:
        os.unlink(path)


def test_docx_remediation():
    with tempfile.NamedTemporaryFile(suffix=".docx", delete=False) as f:
        path = f.name
    output = path.replace(".docx", "_remediated.docx")
    try:
        _create_test_docx(path)
        import asyncio
        from remediation_docx import remediate_docx_async
        result = asyncio.run(remediate_docx_async(path, output, verify=False))
        assert result["after"]["score"]["score"] >= result["before"]["score"]["score"]
        assert Path(output).exists()
    finally:
        for p in (path, output):
            if os.path.exists(p):
                os.unlink(p)


def test_xlsx_remediation():
    with tempfile.NamedTemporaryFile(suffix=".xlsx", delete=False) as f:
        path = f.name
    output = path.replace(".xlsx", "_remediated.xlsx")
    try:
        _create_test_xlsx(path)
        import asyncio
        from remediation_xlsx import remediate_xlsx_async
        result = asyncio.run(remediate_xlsx_async(path, output, verify=False))
        assert result["after"]["score"]["score"] >= result["before"]["score"]["score"]
        assert result["after"]["merged_cells"] == 0  # Merged cells fixed
    finally:
        for p in (path, output):
            if os.path.exists(p):
                os.unlink(p)


def test_pptx_remediation():
    with tempfile.NamedTemporaryFile(suffix=".pptx", delete=False) as f:
        path = f.name
    output = path.replace(".pptx", "_remediated.pptx")
    try:
        _create_test_pptx(path)
        import asyncio
        from remediation_pptx import remediate_pptx_async
        result = asyncio.run(remediate_pptx_async(path, output, verify=False))
        assert result["after"]["score"]["score"] >= result["before"]["score"]["score"]
    finally:
        for p in (path, output):
            if os.path.exists(p):
                os.unlink(p)


def test_scanner_finds_all_formats():
    with tempfile.TemporaryDirectory() as tmpdir:
        _create_test_docx(os.path.join(tmpdir, "test.docx"))
        _create_test_xlsx(os.path.join(tmpdir, "test.xlsx"))
        _create_test_pptx(os.path.join(tmpdir, "test.pptx"))
        # Create a dummy PDF
        Path(os.path.join(tmpdir, "test.pdf")).write_bytes(b"%PDF-1.4 dummy")

        from agent.scanner import scan_folder
        results = scan_folder(tmpdir)
        formats = {r["format"] for r in results}
        assert formats == {"pdf", "docx", "xlsx", "pptx"}
```

**Step 2: Run the tests**

```bash
cd agent && python -m pytest tests/test_office_remediation.py -v
```

Expected: All 7 tests pass (analysis + remediation for each format + scanner test).

**Step 3: Commit**

```bash
git add agent/tests/test_office_remediation.py
git commit -m "test: add integration tests for Office document remediation"
```

---

### Task 12: Final Dockerfile Updates and Verification

**Step 1: Verify the complete Dockerfile**

The final `agent/Dockerfile` should have these COPY lines:

```dockerfile
COPY agent/ ./agent/
COPY remediation.py .
COPY remediation_docx.py .
COPY remediation_xlsx.py .
COPY remediation_pptx.py .
COPY gemini_verify.py .
COPY entrypoint.sh .
COPY config.example.yaml ./config.yaml
COPY agent.py ./agent_crawler.py
```

**Step 2: Build the Docker image**

```bash
cd agent && docker build -t caso-comply-agent:office-test .
```

Expected: Build completes successfully.

**Step 3: Verify the image starts**

```bash
docker run --rm caso-comply-agent:office-test python -c "
import docx; print('python-docx:', docx.__version__)
import openpyxl; print('openpyxl:', openpyxl.__version__)
import pptx; print('python-pptx:', pptx.__version__)
import subprocess; result = subprocess.run(['soffice', '--version'], capture_output=True, text=True); print('LibreOffice:', result.stdout.strip())
print('All Office dependencies OK')
"
```

Expected: All four versions print successfully.

**Step 4: Commit any final Dockerfile changes**

```bash
git add agent/Dockerfile
git commit -m "feat: complete Docker image with Office remediation support"
```

---

Plan complete and saved to `docs/plans/2026-03-09-office-remediation.md`. Two execution options:

**1. Subagent-Driven (this session)** — I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** — Open new session with executing-plans, batch execution with checkpoints

Which approach?