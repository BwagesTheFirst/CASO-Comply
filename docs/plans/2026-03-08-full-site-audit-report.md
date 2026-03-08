# Full Site Audit Report — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** When a user submits their email after a scan, analyze ALL PDFs found on their site in the background, then email them a link to a public report page with full results, meeting scheduler CTA, and conversion tracking.

**Architecture:** Vercel Cron Job triggers `/api/reports/process` every 60s, which picks up scans marked `report_pending`, analyzes up to 15 PDFs via the existing Python API, stores results in `scan_pdfs`, calculates overall score, sends email via SendGrid with link to `/report/[scanId]`. Report page is a server-rendered Next.js page with results table, common issues, and CTAs.

**Tech Stack:** Next.js API routes, Vercel Cron, SendGrid (`@sendgrid/mail`), Supabase PostgreSQL, existing Python API on Render

---

### Task 1: Install SendGrid package

**Files:**
- Modify: `package.json`

**Step 1: Install dependency**

Run: `npm install @sendgrid/mail`

**Step 2: Verify installation**

Run: `node -e "require('@sendgrid/mail'); console.log('ok')"`
Expected: `ok`

**Step 3: Add env vars**

Add to `.env.local`:
```
SENDGRID_API_KEY=<your-sendgrid-api-key>
SENDGRID_FROM_EMAIL=reports@casocomply.com
```

Also add `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL` to Vercel environment variables.

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @sendgrid/mail for report emails"
```

---

### Task 2: Database migration — `scan_pdfs` table + alter `scans`

**Files:**
- Create: `supabase/migrations/002_report_tables.sql`

**Step 1: Write the migration SQL**

```sql
-- Individual PDF analysis results
CREATE TABLE scan_pdfs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id uuid REFERENCES scans(id) ON DELETE CASCADE,
  url text NOT NULL,
  filename text NOT NULL,
  score integer,
  grade text,
  issues jsonb DEFAULT '[]'::jsonb,
  checks jsonb DEFAULT '{}'::jsonb,
  page_count integer,
  error text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_scan_pdfs_scan_id ON scan_pdfs(scan_id);

ALTER TABLE scan_pdfs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON scan_pdfs FOR ALL USING (true);

-- Add report columns to scans
ALTER TABLE scans
  ADD COLUMN IF NOT EXISTS report_status text,
  ADD COLUMN IF NOT EXISTS overall_score integer,
  ADD COLUMN IF NOT EXISTS overall_grade text,
  ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS report_email text;
```

**Step 2: Run the migration against Supabase**

Run this SQL in the Supabase SQL Editor (Dashboard → SQL Editor → New query) for project `ukiujsqpjhhksduaolrp`.

**Step 3: Verify tables exist**

In Supabase SQL Editor, run:
```sql
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'scan_pdfs';
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'scans' AND column_name IN ('report_status', 'overall_score', 'overall_grade', 'view_count', 'report_email');
```
Expected: All columns listed.

**Step 4: Commit**

```bash
git add supabase/migrations/002_report_tables.sql
git commit -m "feat: add scan_pdfs table and report columns to scans"
```

---

### Task 3: Update `/api/scan/email` to set `report_status`

**Files:**
- Modify: `src/app/api/scan/email/route.ts`

**Step 1: Update the route to set report_status and store email on the scan**

Replace the entire file with:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { email, scanId } = await req.json();

    // Validate inputs
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }

    if (!scanId || typeof scanId !== "string") {
      return NextResponse.json(
        { error: "A valid scanId is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
      const supabase = createAdminClient();

      // Insert the lead
      await supabase
        .from("scan_leads")
        .insert({ scan_id: scanId, email: normalizedEmail });

      // Mark scan for report generation
      await supabase
        .from("scans")
        .update({
          report_status: "pending",
          report_email: normalizedEmail,
        })
        .eq("id", scanId);
    } catch (dbError) {
      console.error("Supabase unavailable:", dbError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("scan/email route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
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
git commit -m "feat: /api/scan/email sets report_status=pending on scan"
```

---

### Task 4: Create SendGrid email helper

**Files:**
- Create: `src/lib/sendgrid.ts`

**Step 1: Create the helper**

```typescript
import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "reports@casocomply.com";
const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : process.env.NEXT_PUBLIC_BASE_URL || "https://caso-comply.vercel.app";

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export async function sendReportEmail({
  to,
  scanId,
  domain,
  overallGrade,
  overallScore,
  pdfCount,
  analyzedCount,
}: {
  to: string;
  scanId: string;
  domain: string;
  overallGrade: string;
  overallScore: number;
  pdfCount: number;
  analyzedCount: number;
}): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn("SENDGRID_API_KEY not set — skipping email");
    return false;
  }

  const reportUrl = `${BASE_URL}/report/${scanId}`;

  const gradeColors: Record<string, string> = {
    A: "#10B981",
    B: "#2EA3F2",
    C: "#EAB308",
    F: "#EF4444",
  };
  const gradeColor = gradeColors[overallGrade] || gradeColors.F;

  const msg = {
    to,
    from: { email: FROM_EMAIL, name: "CASO Comply" },
    subject: `Your PDF Compliance Audit — ${domain}`,
    html: [
      '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #0B1D3A; color: #FFFFFF;">',
      '  <div style="text-align: center; margin-bottom: 32px;">',
      '    <h1 style="font-size: 24px; margin: 0;">PDF Compliance Audit</h1>',
      `    <p style="color: #94A3B8; margin-top: 8px; font-size: 14px;">${domain}</p>`,
      '  </div>',
      `  <div style="text-align: center; padding: 24px; background: #132D54; border-radius: 12px; margin-bottom: 24px;">`,
      `    <div style="display: inline-block; width: 80px; height: 80px; border-radius: 50%; border: 4px solid ${gradeColor}; line-height: 72px; font-size: 32px; font-weight: bold; color: ${gradeColor};">`,
      `      ${overallGrade}`,
      '    </div>',
      `    <p style="margin: 12px 0 0; font-size: 18px; font-weight: bold;">${overallScore}/100 Overall Score</p>`,
      `    <p style="color: #94A3B8; margin: 8px 0 0; font-size: 14px;">${analyzedCount} of ${pdfCount} PDFs analyzed</p>`,
      '  </div>',
      '  <div style="text-align: center; margin: 32px 0;">',
      `    <a href="${reportUrl}" style="display: inline-block; background: #2EA3F2; color: #FFFFFF; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">View Full Report</a>`,
      '  </div>',
      '  <p style="color: #94A3B8; font-size: 12px; text-align: center;">This report was generated by CASO Comply. Share this link with your team — no login required.</p>',
      '</div>',
    ].join("\n"),
  };

  try {
    await sgMail.send(msg);
    return true;
  } catch (err) {
    console.error("SendGrid send error:", err);
    return false;
  }
}
```

**Step 2: Verify it compiles**

Run: `npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/lib/sendgrid.ts
git commit -m "feat: add SendGrid email helper for audit reports"
```

---

### Task 5: Create `/api/reports/process` background job route

**Files:**
- Create: `src/app/api/reports/process/route.ts`

**Step 1: Create the route**

This route is called by Vercel Cron every 60 seconds. It picks up scans with `report_status = 'pending'`, analyzes all their PDFs, stores results, calculates overall score, sends the email, and updates the status.

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendReportEmail } from "@/lib/sendgrid";

const CASO_API_URL =
  process.env.NEXT_PUBLIC_CASO_API_URL ||
  "https://caso-comply-api.onrender.com";
const USER_AGENT = "CASO-Comply-Scanner/1.0";
const PDF_DOWNLOAD_TIMEOUT = 15_000;
const ANALYZE_TIMEOUT = 60_000;
const MAX_PDFS_PER_REPORT = 15;
const CONCURRENCY = 3;

const CRON_SECRET = process.env.CRON_SECRET;

interface AnalyzeResult {
  file_id: string;
  filename: string;
  score: {
    score: number;
    grade: string;
    checks: Record<
      string,
      { passed: boolean; weight: number; description: string }
    >;
  };
  structure: {
    tagged: boolean;
    has_lang: boolean;
    issues: string[];
    page_count: number;
  };
}

async function downloadPdf(
  url: string
): Promise<{ buffer: ArrayBuffer; filename: string } | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
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

async function analyzePdf(
  buffer: ArrayBuffer,
  filename: string
): Promise<AnalyzeResult | null> {
  try {
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([buffer], { type: "application/pdf" }),
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

function extractIssues(result: AnalyzeResult): string[] {
  const issues: string[] = [];
  if (result.score?.checks) {
    for (const check of Object.values(result.score.checks)) {
      if (!check.passed && check.description) {
        issues.push(check.description);
      }
    }
  }
  if (result.structure?.issues) {
    for (const issue of result.structure.issues) {
      if (!issues.includes(issue)) issues.push(issue);
    }
  }
  return issues;
}

function scoreToGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  return "F";
}

async function processPdfsInBatches(
  pdfUrls: string[],
  scanId: string,
  supabase: ReturnType<typeof createAdminClient>
): Promise<{ analyzed: number; totalScore: number }> {
  let analyzed = 0;
  let totalScore = 0;

  for (let i = 0; i < pdfUrls.length; i += CONCURRENCY) {
    const batch = pdfUrls.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map(async (pdfUrl) => {
        const downloaded = await downloadPdf(pdfUrl);
        if (!downloaded) {
          await supabase.from("scan_pdfs").insert({
            scan_id: scanId,
            url: pdfUrl,
            filename: decodeURIComponent(
              new URL(pdfUrl).pathname.split("/").pop() || "document.pdf"
            ),
            error: "Failed to download",
          });
          return null;
        }

        const analysis = await analyzePdf(downloaded.buffer, downloaded.filename);
        if (!analysis) {
          await supabase.from("scan_pdfs").insert({
            scan_id: scanId,
            url: pdfUrl,
            filename: downloaded.filename,
            error: "Analysis failed",
          });
          return null;
        }

        const issues = extractIssues(analysis);
        await supabase.from("scan_pdfs").insert({
          scan_id: scanId,
          url: pdfUrl,
          filename: analysis.filename || downloaded.filename,
          score: analysis.score?.score ?? 0,
          grade: analysis.score?.grade ?? "F",
          issues,
          checks: analysis.score?.checks ?? {},
          page_count: analysis.structure?.page_count ?? 0,
        });

        return analysis.score?.score ?? 0;
      })
    );

    for (const r of results) {
      if (r.status === "fulfilled" && r.value !== null) {
        analyzed++;
        totalScore += r.value;
      }
    }
  }

  return { analyzed, totalScore };
}

export async function GET(req: NextRequest) {
  // Verify the request is from Vercel Cron
  if (CRON_SECRET) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = createAdminClient();

  // Pick up one pending scan at a time
  const { data: pendingScans, error: fetchError } = await supabase
    .from("scans")
    .select("id, url, pdf_urls, report_email")
    .eq("report_status", "pending")
    .order("created_at", { ascending: true })
    .limit(1);

  if (fetchError || !pendingScans || pendingScans.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  const scan = pendingScans[0];

  // Mark as processing
  await supabase
    .from("scans")
    .update({ report_status: "processing" })
    .eq("id", scan.id);

  try {
    const pdfUrls = (scan.pdf_urls as string[]).slice(0, MAX_PDFS_PER_REPORT);

    const { analyzed, totalScore } = await processPdfsInBatches(
      pdfUrls,
      scan.id,
      supabase
    );

    const overallScore = analyzed > 0 ? Math.round(totalScore / analyzed) : 0;
    const overallGrade = scoreToGrade(overallScore);

    await supabase
      .from("scans")
      .update({
        overall_score: overallScore,
        overall_grade: overallGrade,
        report_status: "sent",
      })
      .eq("id", scan.id);

    if (scan.report_email) {
      let domain: string;
      try {
        domain = new URL(scan.url).hostname;
      } catch {
        domain = scan.url;
      }

      await sendReportEmail({
        to: scan.report_email,
        scanId: scan.id,
        domain,
        overallGrade,
        overallScore,
        pdfCount: (scan.pdf_urls as string[]).length,
        analyzedCount: analyzed,
      });
    }

    return NextResponse.json({ processed: 1, scanId: scan.id, analyzed });
  } catch (err) {
    console.error("Report processing error:", err);
    await supabase
      .from("scans")
      .update({ report_status: "failed" })
      .eq("id", scan.id);
    return NextResponse.json({ processed: 0, error: "Processing failed" });
  }
}
```

**Step 2: Verify it compiles**

Run: `npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/api/reports/process/route.ts
git commit -m "feat: add /api/reports/process background job for full audit"
```

---

### Task 6: Add Vercel Cron configuration

**Files:**
- Create: `vercel.json`

**Step 1: Create vercel.json with cron config**

```json
{
  "crons": [
    {
      "path": "/api/reports/process",
      "schedule": "* * * * *"
    }
  ]
}
```

**Step 2: Add CRON_SECRET env var**

Generate a random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env.local`:
```
CRON_SECRET=<generated-value>
```

Add the same `CRON_SECRET` value to Vercel environment variables.

**Step 3: Commit**

```bash
git add vercel.json
git commit -m "feat: add Vercel Cron to trigger report processing every 60s"
```

---

### Task 7: Create report page components

**Files:**
- Create: `src/app/report/[scanId]/page.tsx`
- Create: `src/components/CopyLinkButton.tsx`

**Step 1: Create the CopyLinkButton client component**

```tsx
"use client";

import { useState } from "react";

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="mt-4 text-sm text-caso-slate hover:text-caso-white transition-colors"
    >
      {copied ? "Link copied!" : "Share This Report — Copy Link"}
    </button>
  );
}
```

**Step 2: Create the report page (server component)**

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import CopyLinkButton from "@/components/CopyLinkButton";

interface ScanPdf {
  id: string;
  url: string;
  filename: string;
  score: number | null;
  grade: string | null;
  issues: string[];
  page_count: number | null;
  error: string | null;
}

interface Scan {
  id: string;
  url: string;
  pdf_count: number;
  overall_score: number | null;
  overall_grade: string | null;
  view_count: number;
  created_at: string;
  report_status: string | null;
}

const GRADE_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  A: { bg: "bg-caso-green/10", text: "text-caso-green", ring: "border-caso-green" },
  B: { bg: "bg-caso-blue/10", text: "text-caso-blue", ring: "border-caso-blue" },
  C: { bg: "bg-yellow-500/10", text: "text-yellow-400", ring: "border-yellow-500" },
  F: { bg: "bg-caso-red/10", text: "text-caso-red", ring: "border-caso-red" },
};

function GradeBadge({ grade, size = "sm" }: { grade: string; size?: "sm" | "lg" }) {
  const colors = GRADE_COLORS[grade] || GRADE_COLORS.F;
  if (size === "lg") {
    return (
      <div className={`flex h-28 w-28 items-center justify-center rounded-full border-4 ${colors.ring} ${colors.bg}`}>
        <span className={`font-[family-name:var(--font-display)] text-5xl font-black ${colors.text}`}>{grade}</span>
      </div>
    );
  }
  return (
    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 ${colors.ring} ${colors.bg} text-xs font-black ${colors.text}`}>
      {grade}
    </span>
  );
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ scanId: string }>;
}) {
  const { scanId } = await params;
  const supabase = createAdminClient();

  const { data: scan } = await supabase
    .from("scans")
    .select("*")
    .eq("id", scanId)
    .single();

  if (!scan) notFound();

  const typedScan = scan as Scan;

  // Increment view count (fire and forget)
  supabase
    .from("scans")
    .update({ view_count: (typedScan.view_count || 0) + 1 })
    .eq("id", scanId)
    .then(() => {});

  // If report isn't ready yet
  if (!typedScan.report_status || typedScan.report_status === "pending" || typedScan.report_status === "processing") {
    return (
      <main className="min-h-screen bg-caso-navy px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-caso-white">
            Your report is being generated...
          </h1>
          <p className="mt-4 text-caso-slate">
            We&apos;re analyzing all PDFs on your site. This usually takes 2-5 minutes.
            Refresh this page in a moment.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-caso-border border-t-caso-blue" />
          </div>
        </div>
      </main>
    );
  }

  // Fetch individual PDF results
  const { data: pdfResults } = await supabase
    .from("scan_pdfs")
    .select("*")
    .eq("scan_id", scanId)
    .order("score", { ascending: true, nullsFirst: false });

  const pdfs = (pdfResults || []) as ScanPdf[];
  const analyzedPdfs = pdfs.filter((p) => p.score !== null);
  const failedPdfs = pdfs.filter((p) => p.error);

  let domain: string;
  try {
    domain = new URL(typedScan.url).hostname;
  } catch {
    domain = typedScan.url;
  }

  const scanDate = new Date(typedScan.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Aggregate common issues
  const issueFrequency: Record<string, number> = {};
  for (const pdf of analyzedPdfs) {
    for (const issue of pdf.issues || []) {
      issueFrequency[issue] = (issueFrequency[issue] || 0) + 1;
    }
  }
  const commonIssues = Object.entries(issueFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const grade = typedScan.overall_grade || "F";
  const score = typedScan.overall_score || 0;

  return (
    <main className="min-h-screen bg-caso-navy">
      {/* Header */}
      <header className="border-b border-caso-border bg-caso-navy-light px-4 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <Link href="/" className="text-sm font-bold text-caso-blue hover:text-caso-blue-bright">
              CASO Comply
            </Link>
            <h1 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold text-caso-white md:text-2xl">
              PDF Compliance Audit Report
            </h1>
          </div>
          <div className="text-right text-sm text-caso-slate">
            <p>{domain}</p>
            <p>{scanDate}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Overview Card */}
        <div className="rounded-2xl border border-caso-border bg-caso-navy-light p-8 text-center">
          <div className="flex justify-center">
            <GradeBadge grade={grade} size="lg" />
          </div>
          <p className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold text-caso-white">
            {score}<span className="text-lg text-caso-slate">/100</span>
          </p>
          <p className="mt-2 text-caso-slate">
            {analyzedPdfs.length} of {typedScan.pdf_count} PDFs analyzed
          </p>
          {analyzedPdfs.length > 0 && (
            <p className="mt-1 text-sm text-caso-slate">
              {analyzedPdfs.filter((p) => (p.score ?? 0) < 70).length} of {analyzedPdfs.length} PDFs have accessibility issues
            </p>
          )}
        </div>

        {/* Common Issues */}
        {commonIssues.length > 0 && (
          <div className="mt-8 rounded-2xl border border-caso-border bg-caso-navy-light p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
              Most Common Issues
            </h2>
            <ul className="mt-4 space-y-3">
              {commonIssues.map(([issue, count]) => (
                <li key={issue} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 rounded bg-caso-red/10 px-2 py-0.5 text-xs font-bold text-caso-red">
                    {count}/{analyzedPdfs.length}
                  </span>
                  <span className="text-sm text-caso-white">{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* PDF Results Table */}
        <div className="mt-8 rounded-2xl border border-caso-border bg-caso-navy-light">
          <div className="border-b border-caso-border/50 px-6 py-4">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
              Individual PDF Results
            </h2>
          </div>
          <div className="divide-y divide-caso-border/30">
            {analyzedPdfs.map((pdf) => {
              const pdfGrade = pdf.grade || "F";
              return (
                <details key={pdf.id} className="group">
                  <summary className="flex cursor-pointer items-center gap-4 px-6 py-4 hover:bg-caso-navy/30">
                    <GradeBadge grade={pdfGrade} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-caso-white" title={pdf.filename}>
                        {pdf.filename}
                      </p>
                      <p className="text-xs text-caso-slate">
                        {pdf.page_count} page{pdf.page_count !== 1 ? "s" : ""} &middot; Score: {pdf.score}/100
                        {(pdf.issues?.length ?? 0) > 0 && (
                          <> &middot; <span className="text-caso-red">{pdf.issues.length} issue{pdf.issues.length !== 1 ? "s" : ""}</span></>
                        )}
                      </p>
                    </div>
                    <svg className="h-4 w-4 shrink-0 text-caso-slate transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="border-t border-caso-border/20 bg-caso-navy/20 px-6 py-4">
                    {(pdf.issues?.length ?? 0) > 0 ? (
                      <ul className="space-y-2">
                        {pdf.issues.map((issue, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-caso-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-caso-slate">{issue}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="flex items-center gap-2 text-sm text-caso-green">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        No issues found
                      </p>
                    )}
                    <a
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-xs text-caso-blue hover:underline"
                    >
                      View original PDF &rarr;
                    </a>
                  </div>
                </details>
              );
            })}
            {failedPdfs.length > 0 && (
              <div className="px-6 py-4">
                <p className="text-sm text-caso-slate">
                  {failedPdfs.length} PDF{failedPdfs.length !== 1 ? "s" : ""} could not be analyzed (download failed or timed out)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-10 rounded-2xl border border-caso-border bg-gradient-to-b from-caso-navy-light to-caso-navy p-8 text-center md:p-10">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
            Ready to fix these issues?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-caso-slate">
            CASO Comply can automatically remediate all {typedScan.pdf_count} PDFs on your site
            for full WCAG 2.1 AA and PDF/UA compliance.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-caso-blue px-8 py-4 text-base font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Schedule a Meeting
            </a>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-caso-border px-8 py-4 text-base font-bold text-caso-white transition-all hover:border-caso-blue hover:bg-caso-navy-light"
            >
              Try Remediation Demo
            </Link>
          </div>
          <CopyLinkButton />
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-caso-slate">
          Report generated by <Link href="/" className="text-caso-blue hover:underline">CASO Comply</Link> &middot; {scanDate}
        </p>
      </div>
    </main>
  );
}
```

**Step 2: Verify it compiles**

Run: `npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/report/ src/components/CopyLinkButton.tsx
git commit -m "feat: add /report/[scanId] page with full audit results and CTAs"
```

---

### Task 8: Update ScanForm email confirmation text

**Files:**
- Modify: `src/components/ScanForm.tsx`

**Step 1: Update the success message after email submit**

In `ScanForm.tsx`, find the `emailSubmitted` success message (line ~230) and update:

Change:
```tsx
<span className="font-semibold">Report requested! We&apos;ll send the full analysis to {email}</span>
```

To:
```tsx
<span className="font-semibold">We&apos;re analyzing all {result?.pdfCount} PDFs now. Check {email} in a few minutes for your full report!</span>
```

**Step 2: Verify it compiles**

Run: `npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/ScanForm.tsx
git commit -m "feat: update email success message to reflect async report generation"
```

---

### Task 9: Test end-to-end and deploy

**Step 1: Test locally**

Run: `npm run dev`

1. Go to homepage, enter a URL with PDFs (e.g. `w3.org/WAI`)
2. Wait for scan results
3. Click "Send Full Report" and enter an email
4. Verify in Supabase that `scans.report_status` is `'pending'` and `report_email` is set
5. Manually trigger the processor: `curl http://localhost:3000/api/reports/process`
6. Verify in Supabase: `scan_pdfs` rows created, `scans.overall_score/grade` populated, `report_status = 'sent'`
7. Visit `http://localhost:3000/report/<scanId>` — verify report page renders

**Step 2: Build**

Run: `npx next build`
Expected: Build succeeds

**Step 3: Add env vars to Vercel**

Add to Vercel environment variables:
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`
- `CRON_SECRET`

**Step 4: Deploy**

Run: `vercel --prod`

**Step 5: Verify cron is active**

In Vercel Dashboard → Settings → Cron Jobs, verify `/api/reports/process` shows with `* * * * *` schedule.

**Step 6: Commit any fixes**

```bash
git add -A
git commit -m "feat: Full Site Audit Report — complete"
```

---

## Build Order Summary

1. **SendGrid** — install email package
2. **Database** — `scan_pdfs` table + report columns on `scans`
3. **Email route** — update to set `report_status=pending`
4. **SendGrid helper** — email template function
5. **Report processor** — background job route
6. **Vercel Cron** — trigger the processor every 60s
7. **Report page** — `/report/[scanId]` with full results + CTAs + CopyLinkButton
8. **ScanForm** — update confirmation copy
9. **Test & deploy** — end-to-end verification
