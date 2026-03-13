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
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold ${colors[type] || colors.PDF}`}>
      {type}
    </span>
  );
}

const GRADE_COLORS: Record<
  string,
  { bg: string; text: string; ring: string }
> = {
  A: {
    bg: "bg-caso-green/10",
    text: "text-caso-green",
    ring: "border-caso-green",
  },
  B: {
    bg: "bg-caso-blue/10",
    text: "text-caso-blue",
    ring: "border-caso-blue",
  },
  C: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    ring: "border-yellow-500",
  },
  F: { bg: "bg-caso-red/10", text: "text-caso-red", ring: "border-caso-red" },
};

function GradeBadge({
  grade,
  size = "sm",
}: {
  grade: string;
  size?: "sm" | "lg";
}) {
  const colors = GRADE_COLORS[grade] || GRADE_COLORS.F;
  if (size === "lg") {
    return (
      <div
        className={`flex h-28 w-28 items-center justify-center rounded-full border-4 ${colors.ring} ${colors.bg}`}
      >
        <span
          className={`font-[family-name:var(--font-display)] text-5xl font-black ${colors.text}`}
        >
          {grade}
        </span>
      </div>
    );
  }
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 ${colors.ring} ${colors.bg} text-xs font-black ${colors.text}`}
    >
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
  if (
    !typedScan.report_status ||
    typedScan.report_status === "pending" ||
    typedScan.report_status === "processing"
  ) {
    return (
      <main className="min-h-screen bg-caso-navy px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-caso-white">
            Your report is being generated...
          </h1>
          <p className="mt-4 text-caso-slate">
            We&apos;re analyzing all documents on your site. This usually takes 2-5
            minutes. Refresh this page in a moment.
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
            <Link
              href="/"
              className="text-sm font-bold text-caso-blue hover:text-caso-blue-bright"
            >
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
            {score}
            <span className="text-lg text-caso-slate">/100</span>
          </p>
          <p className="mt-2 text-caso-slate">
            {analyzedPdfs.length} of {typedScan.pdf_count} documents analyzed
          </p>
          {analyzedPdfs.length > 0 && (
            <p className="mt-1 text-sm text-caso-slate">
              {analyzedPdfs.filter((p) => (p.score ?? 0) < 70).length} of{" "}
              {analyzedPdfs.length} documents have accessibility issues
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
                      <p
                        className="flex items-center gap-2 truncate text-sm font-medium text-caso-white"
                        title={pdf.filename}
                      >
                        <FileTypeBadge filename={pdf.filename} />
                        {pdf.filename}
                      </p>
                      <p className="text-xs text-caso-slate">
                        {pdf.page_count} page
                        {pdf.page_count !== 1 ? "s" : ""} &middot; Score:{" "}
                        {pdf.score}/100
                        {(pdf.issues?.length ?? 0) > 0 && (
                          <>
                            {" "}
                            &middot;{" "}
                            <span className="text-caso-red">
                              {pdf.issues.length} issue
                              {pdf.issues.length !== 1 ? "s" : ""}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                    <svg
                      className="h-4 w-4 shrink-0 text-caso-slate transition-transform group-open:rotate-180"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </summary>
                  <div className="border-t border-caso-border/20 bg-caso-navy/20 px-6 py-4">
                    {(pdf.issues?.length ?? 0) > 0 ? (
                      <ul className="space-y-2">
                        {pdf.issues.map((issue, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                          >
                            <svg
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-caso-red"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <span className="text-caso-slate">{issue}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="flex items-center gap-2 text-sm text-caso-green">
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
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
                  {failedPdfs.length} PDF
                  {failedPdfs.length !== 1 ? "s" : ""} could not be analyzed
                  (download failed or timed out)
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
            CASO Comply can automatically remediate all {typedScan.pdf_count}{" "}
            documents on your site for full WCAG 2.2 AA and PDF/UA compliance.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-caso-blue px-8 py-4 text-base font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
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
          Report generated by{" "}
          <Link href="/" className="text-caso-blue hover:underline">
            CASO Comply
          </Link>{" "}
          &middot; {scanDate}
        </p>
      </div>
    </main>
  );
}
