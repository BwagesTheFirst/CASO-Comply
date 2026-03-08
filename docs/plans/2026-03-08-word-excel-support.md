# Word & Excel Document Accessibility Support

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extend CASO Comply to discover, analyze, and remediate `.docx` and `.xlsx` files found on websites, using LibreOffice to convert them to PDF and then running them through the existing Gemini-powered analysis/remediation pipeline.

**Architecture:** Add LibreOffice to the Python API Docker container. Create a `convert.py` module that converts Word/Excel files to PDF via LibreOffice CLI. Update the existing `/api/analyze` and `/api/remediate` endpoints to accept `.docx`/`.xlsx` uploads (auto-converting before processing). Update the Next.js crawler to discover document links beyond just PDFs. Update the frontend to display document type indicators.

**Tech Stack:** LibreOffice (headless CLI), Python subprocess, FastAPI, existing Gemini 2.5 Flash pipeline, Next.js, Cheerio, Tailwind CSS

---

### Task 1: Add LibreOffice to Docker Container

**Files:**
- Modify: `api-service/Dockerfile`
- Modify: `api-service/render.yaml`

**Context:** The current Dockerfile uses `python:3.12-slim` and installs `build-essential`, `pkg-config`, `libqpdf-dev`. We need to add `libreoffice-nogui` (headless LibreOffice without GUI deps — smaller than full `libreoffice`).

**Step 1: Update Dockerfile to install LibreOffice**

In `api-service/Dockerfile`, update the `apt-get install` block:

```dockerfile
FROM python:3.12-slim AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    pkg-config \
    libqpdf-dev \
    libreoffice-nogui \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY main.py remediation.py gemini_verify.py convert.py ./

RUN mkdir -p /app/uploads /app/output

ENV PORT=10000
EXPOSE 10000

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}
```

Changes:
1. Added `libreoffice-nogui` to apt-get install
2. Added `convert.py` to COPY line

**Step 2: Update render.yaml plan to handle larger image**

In `api-service/render.yaml`, bump the plan from `starter` to `standard` (LibreOffice needs more memory):

```yaml
services:
  - type: web
    name: caso-comply-api
    runtime: docker
    dockerfilePath: ./Dockerfile
    dockerContext: .
    repo: https://github.com/YOUR_ORG/caso-comply-api
    branch: main
    plan: standard
    region: oregon
    healthCheckPath: /health
    envVars:
      - key: PORT
        value: "8787"
```

**Step 3: Build locally to verify LibreOffice installs**

```bash
cd api-service
docker build -t caso-comply-api-test .
docker run --rm caso-comply-api-test libreoffice --version
```

Expected: `LibreOffice 7.x.x` or similar version string.

**Step 4: Commit**

```bash
git add api-service/Dockerfile api-service/render.yaml
git commit -m "feat: add LibreOffice to Docker container for document conversion"
```

---

### Task 2: Create Document Conversion Module

**Files:**
- Create: `api-service/convert.py`

**Context:** LibreOffice CLI can convert documents to PDF headlessly:
```
libreoffice --headless --convert-to pdf --outdir /tmp input.docx
```
We need a Python module that wraps this, handles errors, and returns the path to the converted PDF.

**Step 1: Create convert.py**

```python
"""Convert Word/Excel documents to PDF using LibreOffice headless."""

import subprocess
import shutil
from pathlib import Path

LIBREOFFICE_BIN = shutil.which("libreoffice") or "libreoffice"
CONVERT_TIMEOUT = 60  # seconds

SUPPORTED_EXTENSIONS = {".docx", ".xlsx", ".doc", ".xls", ".pptx", ".ppt"}


def is_convertible(filename: str) -> bool:
    """Check if a file can be converted to PDF."""
    return Path(filename).suffix.lower() in SUPPORTED_EXTENSIONS


def convert_to_pdf(input_path: Path, output_dir: Path) -> Path:
    """
    Convert a document to PDF using LibreOffice headless.

    Args:
        input_path: Path to the source document (.docx, .xlsx, etc.)
        output_dir: Directory to write the converted PDF

    Returns:
        Path to the converted PDF file

    Raises:
        RuntimeError: If conversion fails
        FileNotFoundError: If input file doesn't exist
    """
    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")

    output_dir.mkdir(parents=True, exist_ok=True)

    try:
        result = subprocess.run(
            [
                LIBREOFFICE_BIN,
                "--headless",
                "--norestore",
                "--convert-to",
                "pdf",
                "--outdir",
                str(output_dir),
                str(input_path),
            ],
            capture_output=True,
            text=True,
            timeout=CONVERT_TIMEOUT,
        )
    except subprocess.TimeoutExpired:
        raise RuntimeError(
            f"LibreOffice conversion timed out after {CONVERT_TIMEOUT}s"
        )

    if result.returncode != 0:
        raise RuntimeError(
            f"LibreOffice conversion failed (exit {result.returncode}): {result.stderr}"
        )

    # LibreOffice names the output file with .pdf extension
    expected_pdf = output_dir / (input_path.stem + ".pdf")
    if not expected_pdf.exists():
        raise RuntimeError(
            f"Conversion completed but PDF not found at {expected_pdf}. "
            f"stdout: {result.stdout}, stderr: {result.stderr}"
        )

    return expected_pdf
```

**Step 2: Verify module loads**

```bash
cd api-service
python -c "from convert import is_convertible, convert_to_pdf; print('OK')"
```

Expected: `OK`

**Step 3: Commit**

```bash
git add api-service/convert.py
git commit -m "feat: add document-to-PDF conversion module using LibreOffice"
```

---

### Task 3: Update FastAPI Endpoints to Accept Word/Excel

**Files:**
- Modify: `api-service/main.py:28-45` (file validation in `_save_upload`)
- Modify: `api-service/main.py:47-95` (`/api/analyze` endpoint)
- Modify: `api-service/main.py:97-160` (`/api/remediate` endpoint)

**Context:** Currently `_save_upload()` rejects non-PDF files. We need to:
1. Accept `.docx`, `.xlsx`, `.doc`, `.xls` files
2. Convert them to PDF before analysis/remediation
3. Track the original filename and type in the response
4. Clean up converted files after processing

**Step 1: Update `_save_upload` to accept document files**

Replace the file validation in `_save_upload()`:

```python
from convert import is_convertible, convert_to_pdf

ACCEPTED_EXTENSIONS = {".pdf", ".docx", ".xlsx", ".doc", ".xls", ".pptx", ".ppt"}

async def _save_upload(upload: UploadFile) -> tuple[str, Path, str]:
    """Save uploaded file, return (file_id, saved_path, original_filename)."""
    if not upload.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    ext = Path(upload.filename).suffix.lower()
    if ext not in ACCEPTED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Accepted: {', '.join(sorted(ACCEPTED_EXTENSIONS))}",
        )

    file_id = uuid.uuid4().hex[:12]
    save_path = UPLOAD_DIR / f"{file_id}_{upload.filename}"
    content = await upload.read()
    save_path.write_bytes(content)
    return file_id, save_path, upload.filename
```

**Step 2: Add helper to convert if needed**

Add this helper function after `_save_upload`:

```python
def _ensure_pdf(file_id: str, file_path: Path, original_filename: str) -> tuple[Path, bool]:
    """
    If file is not a PDF, convert it to PDF using LibreOffice.

    Returns:
        (pdf_path, was_converted) — the path to the PDF and whether conversion happened
    """
    if file_path.suffix.lower() == ".pdf":
        return file_path, False

    converted_pdf = convert_to_pdf(file_path, OUTPUT_DIR)
    # Rename to include file_id for consistency
    final_path = UPLOAD_DIR / f"{file_id}_converted.pdf"
    converted_pdf.rename(final_path)
    return final_path, True
```

**Step 3: Update `/api/analyze` endpoint**

```python
@app.post("/api/analyze")
async def analyze(file: UploadFile = File(...)):
    file_id, saved_path, original_filename = await _save_upload(file)
    original_ext = Path(original_filename).suffix.lower()

    try:
        pdf_path, was_converted = _ensure_pdf(file_id, saved_path, original_filename)
    except RuntimeError as e:
        raise HTTPException(status_code=422, detail=f"Document conversion failed: {e}")

    try:
        structure = analyze_structure(str(pdf_path))
        content = extract_content(str(pdf_path))
        tables = detect_tables(str(pdf_path))
        score_result = compute_score(structure, content, tables)

        return {
            "file_id": file_id,
            "filename": original_filename,
            "original_format": original_ext,
            "was_converted": was_converted,
            "score": score_result,
            "structure": structure,
            "content": {
                "total_text_blocks": len(content),
                "total_images": sum(1 for b in content if b.get("type") == "image"),
                "pages_analyzed": len(set(b.get("page", 0) for b in content)),
            },
            "tables": tables,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**Step 4: Update `/api/remediate` endpoint**

Apply the same pattern — call `_ensure_pdf()` before remediation:

```python
@app.post("/api/remediate")
async def remediate(
    file: UploadFile = File(...),
    verify: bool = Query(True, description="Run Gemini AI verification"),
):
    file_id, saved_path, original_filename = await _save_upload(file)
    original_ext = Path(original_filename).suffix.lower()

    try:
        pdf_path, was_converted = _ensure_pdf(file_id, saved_path, original_filename)
    except RuntimeError as e:
        raise HTTPException(status_code=422, detail=f"Document conversion failed: {e}")

    try:
        result = remediate_pdf(str(pdf_path), file_id, verify=verify)
        result["original_format"] = original_ext
        result["was_converted"] = was_converted
        result["filename"] = original_filename
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**Step 5: Test locally with a sample DOCX**

```bash
cd api-service
source venv/bin/activate
uvicorn main:app --reload --port 8787 &
curl -X POST http://localhost:8787/api/analyze \
  -F "file=@/path/to/test.docx"
```

Expected: JSON response with `"original_format": ".docx"`, `"was_converted": true`, and a valid score.

**Step 6: Commit**

```bash
git add api-service/main.py
git commit -m "feat: accept Word/Excel uploads with auto-conversion to PDF"
```

---

### Task 4: Update Next.js Crawler to Discover Document Links

**Files:**
- Modify: `src/app/api/scan/route.ts:83-108` (`extractLinks` function)
- Modify: `src/app/api/scan/route.ts:110-130` (`downloadPdf` function)
- Modify: `src/app/api/scan/route.ts:284-348` (response shaping)

**Context:** The crawler currently uses `/\.pdf(\?|#|$)/i` to find PDF links. We need to also find `.docx`, `.xlsx`, `.doc`, `.xls` links. The variable names say "pdf" throughout — we'll keep backward compatibility but extend detection.

**Step 1: Update the regex in `extractLinks`**

In `src/app/api/scan/route.ts`, find the `extractLinks` function and change the regex:

```typescript
function extractLinks(
  html: string,
  pageUrl: string
): { internalLinks: string[]; pdfLinks: string[] } {
  const $ = cheerio.load(html);
  const internalLinks = new Set<string>();
  const pdfLinks = new Set<string>();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    const resolved = resolveHref(href, pageUrl);
    if (!resolved) return;

    if (/\.(pdf|docx?|xlsx?)(\?|#|$)/i.test(resolved)) {
      pdfLinks.add(resolved);
    } else if (isSameOrigin(pageUrl, resolved)) {
      internalLinks.add(resolved);
    }
  });

  return {
    internalLinks: [...internalLinks],
    pdfLinks: [...pdfLinks],
  };
}
```

The regex `/\.(pdf|docx?|xlsx?)(\?|#|$)/i` matches:
- `.pdf` — PDF files
- `.doc` / `.docx` — Word documents
- `.xls` / `.xlsx` — Excel spreadsheets

**Step 2: Update the `downloadPdf` function to handle different MIME types**

```typescript
const DOCUMENT_DOWNLOAD_HEADERS: Record<string, string> = {
  ...BROWSER_HEADERS,
  Accept:
    "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,*/*;q=0.8",
};

async function downloadPdf(
  url: string
): Promise<{ buffer: ArrayBuffer; filename: string } | null> {
  try {
    const res = await fetch(url, {
      headers: DOCUMENT_DOWNLOAD_HEADERS,
      signal: AbortSignal.timeout(PDF_DOWNLOAD_TIMEOUT),
      redirect: "follow",
    });
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const pathname = new URL(url).pathname;
    const filename =
      decodeURIComponent(pathname.split("/").pop() || "document.pdf") ||
      "document.pdf";
    return { buffer, filename };
  } catch {
    return null;
  }
}
```

**Step 3: Update `analyzePdf` to send correct MIME type**

The Python API now auto-detects format from the filename extension, so we just need to send the correct filename in the FormData:

```typescript
async function analyzePdf(
  buffer: ArrayBuffer,
  filename: string
): Promise<AnalyzeResult | null> {
  try {
    // Detect MIME type from extension
    const ext = filename.split(".").pop()?.toLowerCase() || "pdf";
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      doc: "application/msword",
      xls: "application/vnd.ms-excel",
    };
    const mimeType = mimeTypes[ext] || "application/octet-stream";

    const formData = new FormData();
    formData.append(
      "file",
      new Blob([buffer], { type: mimeType }),
      filename
    );

    const res = await fetch(`${CASO_API_URL}/api/analyze`, {
      method: "POST",
      body: formData,
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(60_000),
    });

    if (!res.ok) {
      console.error("Analyze API error:", res.status, await res.text());
      return null;
    }

    return (await res.json()) as AnalyzeResult;
  } catch (err) {
    console.error("Analyze API fetch error:", err);
    return null;
  }
}
```

**Step 4: Update response to include document count naming**

In the response JSON (around line 342), rename `pdfCount` to `documentCount` but keep `pdfCount` for backward compatibility:

```typescript
return NextResponse.json({
  scanId,
  url: normalizedUrl,
  pdfCount: pdfUrls.length, // backward compat
  documentCount: pdfUrls.length,
  pdfUrls: pdfUrls.slice(0, MAX_PDF_URLS_RETURNED),
  samplePdf,
});
```

**Step 5: Commit**

```bash
git add src/app/api/scan/route.ts
git commit -m "feat: extend crawler to discover Word and Excel documents"
```

---

### Task 5: Update Report Processing for Multi-Format

**Files:**
- Modify: `src/app/api/reports/process/route.ts:41-60` (`downloadPdf` function)
- Modify: `src/app/api/reports/process/route.ts:62-84` (`analyzePdf` function)

**Context:** The report processing route downloads and analyzes PDFs from stored URLs. It needs the same MIME type updates as the scan route.

**Step 1: Update `downloadPdf` in reports/process/route.ts**

```typescript
const DOCUMENT_DOWNLOAD_HEADERS: Record<string, string> = {
  "User-Agent": USER_AGENT,
  Accept:
    "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};
```

Replace `PDF_DOWNLOAD_HEADERS` with `DOCUMENT_DOWNLOAD_HEADERS` throughout.

**Step 2: Update `analyzePdf` to send correct MIME type**

Same pattern as Task 4 Step 3 — detect MIME type from filename extension:

```typescript
async function analyzePdf(
  buffer: ArrayBuffer,
  filename: string
): Promise<AnalyzeResult | null> {
  try {
    const ext = filename.split(".").pop()?.toLowerCase() || "pdf";
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      doc: "application/msword",
      xls: "application/vnd.ms-excel",
    };
    const mimeType = mimeTypes[ext] || "application/octet-stream";

    const formData = new FormData();
    formData.append(
      "file",
      new Blob([buffer], { type: mimeType }),
      filename
    );
    const res = await fetch(`${CASO_API_URL}/api/analyze`, {
      method: "POST",
      body: formData,
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(ANALYZE_TIMEOUT),
    });
    if (!res.ok) return null;
    return (await res.json()) as AnalyzeResult;
  } catch {
    return null;
  }
}
```

**Step 3: Commit**

```bash
git add src/app/api/reports/process/route.ts
git commit -m "feat: update report processing for Word/Excel document support"
```

---

### Task 6: Update Frontend to Show Document Types

**Files:**
- Modify: `src/components/ScanForm.tsx` (results display)
- Modify: `src/app/report/[scanId]/page.tsx` (report page)

**Context:** Currently the UI says "PDFs" everywhere. We need to update labels to say "documents" and show file type badges (PDF, DOCX, XLSX) next to filenames.

**Step 1: Update ScanForm.tsx labels**

Find instances of "PDF" in user-facing text and update:

- `"{pdfCount} PDFs found"` → `"{pdfCount} documents found"`
- `"We're analyzing all {pdfCount} PDFs"` → `"We're analyzing all {pdfCount} documents"`
- Keep "PDF Compliance" in the product name — that stays

**Step 2: Add file type badge helper**

Add this to `ScanForm.tsx` (or a shared utils):

```tsx
function getFileType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  if (ext === "docx" || ext === "doc") return "DOCX";
  if (ext === "xlsx" || ext === "xls") return "XLSX";
  return "PDF";
}

function FileTypeBadge({ filename }: { filename: string }) {
  const type = getFileType(filename);
  const colors: Record<string, string> = {
    PDF: "bg-red-500/10 text-red-400",
    DOCX: "bg-blue-500/10 text-blue-400",
    XLSX: "bg-green-500/10 text-green-400",
  };
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold ${colors[type] || colors.PDF}`}
    >
      {type}
    </span>
  );
}
```

**Step 3: Update report page individual PDF results**

In `src/app/report/[scanId]/page.tsx`, add the `FileTypeBadge` next to each filename in the results table:

```tsx
<p className="truncate text-sm font-medium text-caso-white" title={pdf.filename}>
  <FileTypeBadge filename={pdf.filename} />{" "}
  {pdf.filename}
</p>
```

**Step 4: Update report page text**

- `"PDFs analyzed"` → `"documents analyzed"`
- `"PDFs have accessibility issues"` → `"documents have accessibility issues"`
- `"PDFs on your site"` → `"documents on your site"`
- Keep "PDF Compliance Audit Report" as the product name

**Step 5: Commit**

```bash
git add src/components/ScanForm.tsx src/app/report/[scanId]/page.tsx
git commit -m "feat: update UI to show document types (PDF, DOCX, XLSX)"
```

---

### Task 7: Update Database Schema for Document Types

**Files:**
- Create: `supabase/migrations/003_document_types.sql`

**Context:** The `scan_pdfs` table should track original document format. This is informational — the analysis results are the same regardless of format (everything gets converted to PDF).

**Step 1: Write and run migration**

```sql
-- Add original_format column to scan_pdfs
ALTER TABLE scan_pdfs
  ADD COLUMN IF NOT EXISTS original_format text DEFAULT 'pdf';

-- Add comment for clarity
COMMENT ON COLUMN scan_pdfs.original_format IS 'Original file format: pdf, docx, xlsx, doc, xls';
```

Run via psql:
```bash
psql "postgresql://postgres.ukiujsqpjhhksduaolrp:PASSWORD@aws-0-us-west-2.pooler.supabase.com:5432/postgres" -f supabase/migrations/003_document_types.sql
```

**Step 2: Update report processing to store format**

In `src/app/api/reports/process/route.ts`, when inserting into `scan_pdfs`, add the format:

```typescript
const ext = downloaded.filename.split(".").pop()?.toLowerCase() || "pdf";

await supabase.from("scan_pdfs").insert({
  scan_id: scanId,
  url: pdfUrl,
  filename: analysis.filename || downloaded.filename,
  score: analysis.score?.score ?? 0,
  grade: analysis.score?.grade ?? "F",
  issues,
  checks: analysis.score?.checks ?? {},
  page_count: analysis.structure?.page_count ?? 0,
  original_format: ext,
});
```

**Step 3: Commit**

```bash
git add supabase/migrations/003_document_types.sql src/app/api/reports/process/route.ts
git commit -m "feat: track original document format in database"
```

---

### Task 8: Update Demo Page for Multi-Format Upload

**Files:**
- Modify: `src/app/demo/page.tsx`

**Context:** The demo page lets users upload a single file for remediation. Currently it only accepts PDFs. Update the file input to accept Word/Excel too, and update the proxy/analysis flow.

**Step 1: Update file input accept attribute**

Find the file input and update:

```tsx
<input
  type="file"
  accept=".pdf,.docx,.xlsx,.doc,.xls"
  // ... rest of props
/>
```

**Step 2: Update the upload handler**

The demo page sends files to `/api/analyze` via the CASO API. Since the API now accepts all formats, just make sure the MIME type is set correctly when uploading:

```typescript
const formData = new FormData();
formData.append("file", file);
// FormData automatically uses the file's type — no changes needed
```

**Step 3: Update UI labels**

- `"Upload a PDF"` → `"Upload a document"`
- `"Drag and drop your PDF"` → `"Drag and drop your PDF, Word, or Excel file"`
- `"Only PDF files"` → `"PDF, DOCX, XLSX files accepted"`

**Step 4: Commit**

```bash
git add src/app/demo/page.tsx
git commit -m "feat: accept Word/Excel uploads on demo page"
```

---

### Task 9: End-to-End Testing & Deploy

**Step 1: Test document conversion locally**

```bash
cd api-service
docker build -t caso-test .
docker run --rm -p 8787:8787 caso-test &

# Test PDF (should still work)
curl -s -X POST http://localhost:8787/api/analyze -F "file=@test.pdf" | jq '.filename, .was_converted'

# Test DOCX
curl -s -X POST http://localhost:8787/api/analyze -F "file=@test.docx" | jq '.filename, .original_format, .was_converted'

# Test XLSX
curl -s -X POST http://localhost:8787/api/analyze -F "file=@test.xlsx" | jq '.filename, .original_format, .was_converted'
```

Expected for DOCX/XLSX: `"was_converted": true`, `"original_format": ".docx"` (or `.xlsx`), valid score.

**Step 2: Test crawler finds documents**

```bash
# Start Next.js locally
npm run dev &

# Scan a site known to have DOCX/XLSX files
curl -s -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.gsa.gov"}' | jq '.pdfCount, .pdfUrls[:3]'
```

Verify that `.docx` and `.xlsx` URLs appear in the results.

**Step 3: Deploy Python API to Render**

```bash
cd api-service
git push origin main
# Render auto-deploys from main branch
# Monitor build at render.com dashboard — LibreOffice install takes ~2-3 min
```

**Step 4: Deploy Next.js to Vercel**

```bash
cd ..
vercel --prod
```

**Step 5: Smoke test production**

1. Go to caso-comply.vercel.app
2. Scan a government site with Word/Excel docs
3. Verify documents appear in results
4. Upload a DOCX on the demo page
5. Verify analysis works

**Step 6: Commit any final fixes**

```bash
git add -A
git commit -m "chore: final adjustments for Word/Excel support"
```
