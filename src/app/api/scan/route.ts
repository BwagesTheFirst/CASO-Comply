import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { createAdminClient } from "@/lib/supabase/admin";

const CASO_API_URL =
  process.env.NEXT_PUBLIC_CASO_API_URL ||
  "https://caso-comply-api.onrender.com";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent": USER_AGENT,
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};
const PAGE_FETCH_TIMEOUT = 15_000;
const PDF_DOWNLOAD_TIMEOUT = 15_000;
const MAX_PAGES = 20;
const MAX_PDF_URLS_RETURNED = 10;
const MAX_ISSUES_RETURNED = 5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalizeUrl(raw: string): string {
  let url = raw.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  return url;
}

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isSameOrigin(base: string, candidate: string): boolean {
  try {
    return new URL(base).origin === new URL(candidate).origin;
  } catch {
    return false;
  }
}

function resolveHref(href: string, pageUrl: string): string | null {
  try {
    return new URL(href, pageUrl).href;
  } catch {
    return null;
  }
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: BROWSER_HEADERS,
      signal: AbortSignal.timeout(PAGE_FETCH_TIMEOUT),
      redirect: "follow",
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("text/html")) return null;
    return await res.text();
  } catch {
    return null;
  }
}

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

async function downloadPdf(
  url: string
): Promise<{ buffer: ArrayBuffer; filename: string } | null> {
  try {
    const res = await fetch(url, {
      headers: {
        ...BROWSER_HEADERS,
        Accept:
          "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.ms-excel,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(PDF_DOWNLOAD_TIMEOUT),
      redirect: "follow",
    });
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    // Derive filename from URL path
    const pathname = new URL(url).pathname;
    const filename =
      decodeURIComponent(pathname.split("/").pop() || "document.pdf") ||
      "document.pdf";
    return { buffer, filename };
  } catch {
    return null;
  }
}

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
  content: {
    total_text_blocks: number;
    total_images: number;
    pages_analyzed: number;
  };
  tables: { tables_found: number };
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
      signal: AbortSignal.timeout(60_000), // analysis can take a while
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

function extractIssues(result: AnalyzeResult): string[] {
  const issues: string[] = [];

  // Failed checks → descriptions
  if (result.score?.checks) {
    for (const check of Object.values(result.score.checks)) {
      if (!check.passed && check.description) {
        issues.push(check.description);
      }
    }
  }

  // Structure issues
  if (result.structure?.issues) {
    for (const issue of result.structure.issues) {
      if (!issues.includes(issue)) {
        issues.push(issue);
      }
    }
  }

  return issues.slice(0, MAX_ISSUES_RETURNED);
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = body?.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `url` field" },
        { status: 400 }
      );
    }

    const normalizedUrl = normalizeUrl(rawUrl);
    if (!isValidUrl(normalizedUrl)) {
      return NextResponse.json(
        { error: "Invalid URL" },
        { status: 400 }
      );
    }

    // 1. Fetch root page (retry with www. prefix if first attempt fails)
    let rootHtml = await fetchPage(normalizedUrl);
    let effectiveUrl = normalizedUrl;

    if (!rootHtml) {
      // Try adding/removing www.
      try {
        const u = new URL(normalizedUrl);
        if (u.hostname.startsWith("www.")) {
          u.hostname = u.hostname.slice(4);
        } else {
          u.hostname = `www.${u.hostname}`;
        }
        effectiveUrl = u.href;
        rootHtml = await fetchPage(effectiveUrl);
      } catch {
        // ignore
      }
    }

    if (!rootHtml) {
      return NextResponse.json(
        { error: "Could not fetch the provided URL. The site may be blocking automated requests." },
        { status: 422 }
      );
    }

    const allPdfUrls = new Set<string>();
    const { internalLinks, pdfLinks } = extractLinks(rootHtml, effectiveUrl);
    pdfLinks.forEach((u) => allPdfUrls.add(u));

    // 2. Follow internal links 1 level deep (up to MAX_PAGES)
    const pagesToCrawl = internalLinks.slice(0, MAX_PAGES - 1); // -1 for root
    const crawlResults = await Promise.allSettled(
      pagesToCrawl.map(async (link) => {
        const html = await fetchPage(link);
        if (!html) return;
        const { pdfLinks: childPdfs } = extractLinks(html, link);
        childPdfs.forEach((u) => allPdfUrls.add(u));
      })
    );
    // Log any crawl failures for debugging
    crawlResults.forEach((r, i) => {
      if (r.status === "rejected") {
        console.warn(`Crawl failed for ${pagesToCrawl[i]}:`, r.reason);
      }
    });

    const pdfUrls = [...allPdfUrls];

    // 3. Analyze the first PDF found
    let samplePdf: {
      url: string;
      filename: string;
      score: number;
      grade: string;
      issues: string[];
      checks: Record<string, unknown>;
      pageCount: number;
    } | null = null;

    if (pdfUrls.length > 0) {
      const firstPdfUrl = pdfUrls[0];
      const downloaded = await downloadPdf(firstPdfUrl);

      if (downloaded) {
        const analysis = await analyzePdf(downloaded.buffer, downloaded.filename);

        if (analysis) {
          samplePdf = {
            url: firstPdfUrl,
            filename: analysis.filename || downloaded.filename,
            score: analysis.score?.score ?? 0,
            grade: analysis.score?.grade ?? "N/A",
            issues: extractIssues(analysis),
            checks: analysis.score?.checks ?? {},
            pageCount: analysis.structure?.page_count ?? 0,
          };
        }
      }
    }

    // 4. Generate a scan ID
    const scanId = crypto.randomUUID();

    // 5. Store in Supabase (gracefully skip if not configured)
    try {
      const supabase = createAdminClient();
      await supabase.from("scans").insert({
        id: scanId,
        url: normalizedUrl,
        pdf_count: pdfUrls.length,
        pdf_urls: pdfUrls,
        sample_pdf_url: samplePdf?.url ?? null,
        sample_filename: samplePdf?.filename ?? null,
        sample_score: samplePdf?.score ?? null,
        sample_grade: samplePdf?.grade ?? null,
        sample_issues: samplePdf?.issues ?? [],
        sample_checks: samplePdf?.checks ?? {},
        sample_page_count: samplePdf?.pageCount ?? null,
      });
    } catch (dbErr) {
      console.warn("Supabase insert skipped:", dbErr);
    }

    // 6. Return results
    return NextResponse.json({
      scanId,
      url: normalizedUrl,
      pdfCount: pdfUrls.length,
      documentCount: pdfUrls.length,
      pdfUrls: pdfUrls.slice(0, MAX_PDF_URLS_RETURNED),
      samplePdf,
    });
  } catch (err) {
    console.error("Scan route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
