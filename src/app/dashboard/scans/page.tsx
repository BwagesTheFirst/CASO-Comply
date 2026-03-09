import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 20;

export default async function ScansPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!membership) redirect("/dashboard");

  const tenantId = membership.tenant_id;

  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  // Get total count
  const { count: totalCount } = await supabase
    .from("scans")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId);

  const totalPages = Math.ceil((totalCount ?? 0) / PAGE_SIZE);

  // Get scans for current page
  const { data: scans } = await supabase
    .from("scans")
    .select("id, domain, status, created_at, score, pdf_count")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  function gradeFromScore(score: number | null): string {
    if (score === null || score === undefined) return "N/A";
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  }

  function gradeColor(grade: string): string {
    switch (grade) {
      case "A":
        return "bg-caso-green/20 text-caso-green";
      case "B":
        return "bg-caso-blue/20 text-caso-blue";
      case "C":
        return "bg-caso-warm/20 text-caso-warm";
      default:
        return grade === "N/A"
          ? "bg-caso-slate/20 text-caso-slate"
          : "bg-caso-red/20 text-caso-red";
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
          Scans
        </h1>
        <Link
          href="/demo"
          className="rounded-lg bg-caso-blue px-4 py-2 text-sm font-semibold text-white hover:bg-caso-blue-bright transition-colors"
        >
          New Scan
        </Link>
      </div>

      <div className="rounded-xl bg-caso-navy-light border border-caso-border overflow-hidden">
        {scans && scans.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-caso-border text-left">
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Domain
                    </th>
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Date
                    </th>
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Documents
                    </th>
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Status
                    </th>
                    <th className="px-6 py-3 text-caso-slate font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scans.map((scan) => {
                    const grade = gradeFromScore(scan.score);
                    return (
                      <tr
                        key={scan.id}
                        className="border-b border-caso-border/50 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-3 text-caso-white font-medium">
                          {scan.domain}
                        </td>
                        <td className="px-6 py-3 text-caso-slate">
                          {new Date(scan.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-caso-slate">
                          {scan.pdf_count ?? "---"}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${gradeColor(grade)}`}
                          >
                            {grade}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              scan.status === "completed"
                                ? "bg-caso-green/10 text-caso-green"
                                : scan.status === "running"
                                ? "bg-caso-blue/10 text-caso-blue"
                                : scan.status === "failed"
                                ? "bg-caso-red/10 text-caso-red"
                                : "bg-caso-slate/10 text-caso-slate"
                            }`}
                          >
                            {scan.status}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <Link
                            href={`/report/${scan.id}`}
                            className="text-caso-blue hover:text-caso-blue-bright text-sm transition-colors"
                          >
                            View Report
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-caso-border flex items-center justify-between">
                <p className="text-sm text-caso-slate">
                  Page {currentPage} of {totalPages} ({totalCount} total scans)
                </p>
                <div className="flex gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={`/dashboard/scans?page=${currentPage - 1}`}
                      className="rounded-lg border border-caso-border px-3 py-1.5 text-sm text-caso-slate hover:text-caso-white hover:bg-white/5 transition-colors"
                    >
                      Previous
                    </Link>
                  )}
                  {currentPage < totalPages && (
                    <Link
                      href={`/dashboard/scans?page=${currentPage + 1}`}
                      className="rounded-lg border border-caso-border px-3 py-1.5 text-sm text-caso-slate hover:text-caso-white hover:bg-white/5 transition-colors"
                    >
                      Next
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-caso-slate text-sm">No scans found.</p>
            <Link
              href="/demo"
              className="inline-block mt-3 text-sm text-caso-blue hover:text-caso-blue-bright transition-colors"
            >
              Run your first scan &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
