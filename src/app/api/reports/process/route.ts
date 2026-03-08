import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendReportEmail } from "@/lib/sendgrid";

const CASO_API_URL =
  process.env.NEXT_PUBLIC_CASO_API_URL ||
  "https://caso-comply-api.onrender.com";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const PDF_DOWNLOAD_HEADERS: Record<string, string> = {
  "User-Agent": USER_AGENT,
  Accept:
    "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.ms-excel,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};
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
      headers: PDF_DOWNLOAD_HEADERS,
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
          const failedFilename = decodeURIComponent(
            new URL(pdfUrl).pathname.split("/").pop() || "document.pdf"
          );
          const failedExt = failedFilename.split(".").pop()?.toLowerCase() || "pdf";
          await supabase.from("scan_pdfs").insert({
            scan_id: scanId,
            url: pdfUrl,
            filename: failedFilename,
            error: "Failed to download",
            original_format: failedExt,
          });
          return null;
        }

        const ext = downloaded.filename.split(".").pop()?.toLowerCase() || "pdf";

        const analysis = await analyzePdf(
          downloaded.buffer,
          downloaded.filename
        );
        if (!analysis) {
          await supabase.from("scan_pdfs").insert({
            scan_id: scanId,
            url: pdfUrl,
            filename: downloaded.filename,
            error: "Analysis failed",
            original_format: ext,
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
          original_format: ext,
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
