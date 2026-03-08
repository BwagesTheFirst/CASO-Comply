# Scan My Site — Quick Audit MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** When a user enters a website URL and clicks "Scan My Site", crawl the page for PDF links, score one sample PDF via the Python API, and show inline results with lead capture.

**Architecture:** Next.js API route (`/api/scan`) fetches the target URL's HTML, extracts PDF links by following internal links 1 level deep, downloads the first PDF, forwards it to the existing Python API on Render (`caso-comply-api.onrender.com/api/analyze`) as a multipart file upload, stores the scan in Supabase, and returns results. The ScanForm component displays results inline with a "Send Full Report" email capture.

**Tech Stack:** Next.js 16 API routes, cheerio (HTML parsing), Supabase (storage), existing Python FastAPI on Render

---

### Task 1: Install cheerio for HTML parsing

**Files:**
- Modify: `package.json`

**Step 1: Install dependency**

Run: `npm install cheerio`

**Step 2: Verify installation**

Run: `node -e "require('cheerio'); console.log('ok')"`
Expected: `ok`

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add cheerio for HTML parsing"
```

---

### Task 2: Create Supabase tables

**Files:**
- Create: `supabase/migrations/001_scan_tables.sql` (for reference/docs)

**Step 1: Create tables via Supabase dashboard or SQL editor**

Run this SQL against the Supabase project (ref: ukiujsqpjhhksduaolrp):

```sql
-- Scans table: stores each website audit
CREATE TABLE scans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  url text NOT NULL,
  pdf_count integer DEFAULT 0,
  pdf_urls jsonb DEFAULT '[]'::jsonb,
  sample_pdf_url text,
  sample_filename text,
  sample_score integer,
  sample_grade text,
  sample_issues jsonb DEFAULT '[]'::jsonb,
  sample_checks jsonb DEFAULT '{}'::jsonb,
  sample_page_count integer,
  created_at timestamptz DEFAULT now()
);

-- Scan leads: email captures linked to scans
CREATE TABLE scan_leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id uuid REFERENCES scans(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Index for lookups
CREATE INDEX idx_scans_created_at ON scans(created_at DESC);
CREATE INDEX idx_scan_leads_scan_id ON scan_leads(scan_id);

-- Enable RLS but allow service role full access
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_leads ENABLE ROW LEVEL SECURITY;

-- Policy: service role can do everything (our API routes use admin client)
CREATE POLICY "Service role full access" ON scans FOR ALL USING (true);
CREATE POLICY "Service role full access" ON scan_leads FOR ALL USING (true);
```

**Step 2: Save migration file for reference**

```bash
mkdir -p supabase/migrations
```

Save the SQL above to `supabase/migrations/001_scan_tables.sql`.

**Step 3: Commit**

```bash
git add supabase/
git commit -m "feat: add Supabase schema for scans and scan_leads"
```

---

### Task 3: Create `/api/scan` route

**Files:**
- Create: `src/app/api/scan/route.ts`

**Step 1: Create the scan API route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { createAdminClient } from "@/lib/supabase/admin";

const PYTHON_API = process.env.NEXT_PUBLIC_CASO_API_URL || "https://caso-comply-api.onrender.com";
const MAX_PAGES_TO_CRAWL = 20;
const CRAWL_TIMEOUT_MS = 25000;

// -- Helpers ------------------------------------------------------------------

function normalizeUrl(input: string): string {
  let url = input.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  return url;
}

function isInternalLink(link: string, baseHost: string): boolean {
  try {
    const u = new URL(link);
    return u.hostname === baseHost;
  } catch {
    return false;
  }
}

function isPdfLink(href: string): boolean {
  try {
    const pathname = new URL(href).pathname;
    return pathname.toLowerCase().endsWith(".pdf");
  } catch {
    return false;
  }
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "CASO-Comply-Scanner/1.0" },
      redirect: "follow",
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractLinks(html: string, baseUrl: string): { pdfUrls: Set<string>; pageUrls: Set<string> } {
  const $ = cheerio.load(html);
  const pdfUrls = new Set<string>();
  const pageUrls = new Set<string>();
  const base = new URL(baseUrl);

  $("a[href]").each((_, el) => {
    const rawHref = $(el).attr("href");
    if (!rawHref) return;

    let absolute: string;
    try {
      absolute = new URL(rawHref, baseUrl).href;
    } catch {
      return;
    }

    if (isPdfLink(absolute)) {
      pdfUrls.add(absolute);
    } else if (isInternalLink(absolute, base.hostname)) {
      // Strip hash/query for dedup
      const clean = new URL(absolute);
      clean.hash = "";
      pageUrls.add(clean.href);
    }
  });

  return { pdfUrls, pageUrls };
}

async function crawlForPdfs(startUrl: string): Promise<string[]> {
  const visited = new Set<string>();
  const allPdfs = new Set<string>();

  // Level 0: fetch the start page
  const html = await fetchHtml(startUrl);
  if (!html) return [];

  visited.add(startUrl);
  const { pdfUrls, pageUrls } = extractLinks(html, startUrl);
  pdfUrls.forEach((u) => allPdfs.add(u));

  // Level 1: fetch internal pages (up to MAX_PAGES_TO_CRAWL)
  const pagesToVisit = [...pageUrls].filter((u) => !visited.has(u)).slice(0, MAX_PAGES_TO_CRAWL);

  const results = await Promise.allSettled(
    pagesToVisit.map(async (pageUrl) => {
      visited.add(pageUrl);
      const pageHtml = await fetchHtml(pageUrl);
      if (!pageHtml) return;
      const { pdfUrls: morePdfs } = extractLinks(pageHtml, pageUrl);
      morePdfs.forEach((u) => allPdfs.add(u));
    })
  );

  return [...allPdfs];
}

async function analyzeSamplePdf(pdfUrl: string): Promise<{
  filename: string;
  score: number;
  grade: string;
  issues: string[];
  checks: Record<string, unknown>;
  pageCount: number;
} | null> {
  try {
    // Download the PDF
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const pdfRes = await fetch(pdfUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "CASO-Comply-Scanner/1.0" },
    });
    clearTimeout(timeout);

    if (!pdfRes.ok) return null;

    const pdfBuffer = await pdfRes.arrayBuffer();
    const filename = decodeURIComponent(
      new URL(pdfUrl).pathname.split("/").pop() || "document.pdf"
    );

    // Send to Python API for analysis
    const formData = new FormData();
    formData.append("file", new Blob([pdfBuffer], { type: "application/pdf" }), filename);

    const apiRes = await fetch(`${PYTHON_API}/api/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!apiRes.ok) return null;
    const data = await apiRes.json();

    // Extract failed checks as issues
    const issues: string[] = [];
    if (data.score?.checks) {
      for (const [, check] of Object.entries(data.score.checks) as [string, { passed: boolean; description: string }][]) {
        if (!check.passed) {
          issues.push(check.description);
        }
      }
    }

    // Also add structural issues
    if (data.structure?.issues) {
      for (const issue of data.structure.issues) {
        if (!issues.includes(issue)) {
          issues.push(issue);
        }
      }
    }

    return {
      filename,
      score: data.score?.score ?? 0,
      grade: data.score?.grade ?? "F",
      issues: issues.slice(0, 5), // top 5 issues
      checks: data.score?.checks ?? {},
      pageCount: data.structure?.page_count ?? 0,
    };
  } catch {
    return null;
  }
}

// -- Route handler ------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = body.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const url = normalizeUrl(rawUrl);

    // Validate URL format
    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return NextResponse.json({ error: "Only http/https URLs are supported" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Crawl for PDFs
    const pdfUrls = await crawlForPdfs(url);

    if (pdfUrls.length === 0) {
      // Still store the scan for analytics
      const supabase = createAdminClient();
      await supabase.from("scans").insert({ url, pdf_count: 0 });

      return NextResponse.json({
        url,
        pdfCount: 0,
        pdfUrls: [],
        samplePdf: null,
      });
    }

    // Analyze the first PDF
    const sampleResult = await analyzeSamplePdf(pdfUrls[0]);

    // Store in Supabase
    const supabase = createAdminClient();
    const { data: scan } = await supabase
      .from("scans")
      .insert({
        url,
        pdf_count: pdfUrls.length,
        pdf_urls: pdfUrls,
        sample_pdf_url: pdfUrls[0],
        sample_filename: sampleResult?.filename ?? null,
        sample_score: sampleResult?.score ?? null,
        sample_grade: sampleResult?.grade ?? null,
        sample_issues: sampleResult?.issues ?? [],
        sample_checks: sampleResult?.checks ?? {},
        sample_page_count: sampleResult?.pageCount ?? null,
      })
      .select("id")
      .single();

    return NextResponse.json({
      scanId: scan?.id ?? null,
      url,
      pdfCount: pdfUrls.length,
      pdfUrls: pdfUrls.slice(0, 10), // return first 10 for display
      samplePdf: sampleResult
        ? {
            url: pdfUrls[0],
            filename: sampleResult.filename,
            score: sampleResult.score,
            grade: sampleResult.grade,
            issues: sampleResult.issues,
            checks: sampleResult.checks,
            pageCount: sampleResult.pageCount,
          }
        : null,
    });
  } catch (err) {
    console.error("Scan error:", err);
    return NextResponse.json(
      { error: "An error occurred while scanning. Please try again." },
      { status: 500 }
    );
  }
}
```

**Step 2: Verify it compiles**

Run: `npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/api/scan/route.ts
git commit -m "feat: add /api/scan route — crawls site for PDFs and scores sample"
```

---

### Task 4: Create `/api/scan/email` route

**Files:**
- Create: `src/app/api/scan/email/route.ts`

**Step 1: Create the email capture route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, scanId } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    if (!scanId || typeof scanId !== "string") {
      return NextResponse.json({ error: "Scan ID is required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Verify scan exists
    const { data: scan } = await supabase
      .from("scans")
      .select("id")
      .eq("id", scanId)
      .single();

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    // Store the lead
    await supabase.from("scan_leads").insert({
      scan_id: scanId,
      email: email.toLowerCase().trim(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email capture error:", err);
    return NextResponse.json(
      { error: "Failed to save. Please try again." },
      { status: 500 }
    );
  }
}
```

**Step 2: Verify it compiles**

Run: `npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/api/scan/email/route.ts
git commit -m "feat: add /api/scan/email route for lead capture"
```

---

### Task 5: Update ScanForm component with inline results

**Files:**
- Modify: `src/components/ScanForm.tsx`

**Step 1: Rewrite ScanForm with results display and email capture**

Replace the entire ScanForm component. Key states:
- `idle` → form visible
- `scanning` → loading spinner with progress messages
- `results` → inline results card + email capture
- `error` → error message with retry

The results card shows:
- "We found X PDFs on [domain]" headline
- Sample PDF card: filename, score ring (color-coded), grade letter, top issues with X/check icons
- "Send Full Report" button → expands email input → submit → confirmation message

Score color logic:
- A (≥90): caso-green
- B (≥70): caso-blue
- C (≥50): yellow-500
- F (<50): caso-red

See complete implementation in `src/components/ScanForm.tsx` (Task 5 of this plan).

**Step 2: Verify it compiles and renders**

Run: `npx next build`
Expected: Build succeeds

Run: `npm run dev` and test manually:
1. Enter a URL → see scanning state with progress messages
2. Results appear inline with PDF count, sample score, issues
3. "Send Full Report" captures email
4. Error states display correctly

**Step 3: Commit**

```bash
git add src/components/ScanForm.tsx
git commit -m "feat: ScanForm with inline results and email lead capture"
```

---

### Task 6: End-to-end test and deploy

**Step 1: Test with a real government site**

Run: `npm run dev`

Test URLs:
- A .gov site known to have PDFs
- A site with no PDFs (should show "No PDFs found")
- An invalid URL (should show error)

**Step 2: Verify Supabase data**

Check the Supabase dashboard for:
- `scans` table has rows with pdf_count, sample data
- `scan_leads` table captures emails correctly

**Step 3: Build and deploy**

Run: `npx next build && vercel --prod`

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "feat: Scan My Site MVP — complete"
```

---

## Build Order Summary

1. **cheerio** — install HTML parser dependency
2. **Supabase tables** — create scans + scan_leads schema
3. **`/api/scan`** — the core crawl + analyze route
4. **`/api/scan/email`** — email lead capture route
5. **ScanForm** — UI with inline results + email capture
6. **Test & deploy** — end-to-end verification
