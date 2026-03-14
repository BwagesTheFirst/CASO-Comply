import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { jsPDF } from "jspdf";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: membership } = await admin
    .from("tenant_members")
    .select("tenant_id, role")
    .eq("user_id", user.id)
    .single();

  if (!membership) return null;
  return { user, tenantId: membership.tenant_id, role: membership.role };
}

// GET — Generate and return a PDF certificate of compliance
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const admin = createAdminClient();

  // Fetch document and verify ownership
  const { data: document, error } = await admin
    .from("documents")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", auth.tenantId)
    .single();

  if (error || !document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  if (document.status !== "completed") {
    return NextResponse.json(
      { error: "Certificate is only available for completed documents" },
      { status: 400 }
    );
  }

  // Build certificate data
  const certificateData = {
    certificate_id: document.id,
    filename: document.filename,
    page_count: document.page_count,
    service_level: document.service_level,
    score_before: document.score_before,
    score_after: document.score_after,
    grade_before: document.grade_before,
    grade_after: document.grade_after,
    standards_met: [
      "WCAG 2.1 Level AA",
      "PDF/UA (ISO 14289)",
      "Section 508",
    ],
    checks_passed: document.checks_passed || [],
    remediation_date: document.completed_at || document.updated_at,
    issued_at: new Date().toISOString(),
  };

  // Populate certificate_json if not already set
  if (!document.certificate_json) {
    await admin
      .from("documents")
      .update({
        certificate_json: {
          id: certificateData.certificate_id,
          issued_at: certificateData.issued_at,
          standard: "WCAG 2.1 AA / PDF/UA / Section 508",
          level: "AA",
          score: certificateData.score_after,
          valid_until: null,
          filename: certificateData.filename,
          page_count: certificateData.page_count,
          service_level: certificateData.service_level,
          score_before: certificateData.score_before,
          standards_met: certificateData.standards_met,
          checks_passed_count: certificateData.checks_passed.length,
          remediation_date: certificateData.remediation_date,
        },
      })
      .eq("id", id);
  }

  // Generate PDF
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // Colors
  const navy = [15, 23, 42] as const;       // caso-navy-ish
  const green = [34, 197, 94] as const;      // caso-green-ish
  const slate = [100, 116, 139] as const;
  const darkText = [30, 41, 59] as const;

  // --- Top decorative bar ---
  pdf.setFillColor(navy[0], navy[1], navy[2]);
  pdf.rect(0, 0, pageWidth, 12, "F");
  pdf.setFillColor(green[0], green[1], green[2]);
  pdf.rect(0, 12, pageWidth, 3, "F");

  y = 28;

  // --- CASO Comply branding ---
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(slate[0], slate[1], slate[2]);
  pdf.text("CASO COMPLY", pageWidth / 2, y, { align: "center" });
  y += 5;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.text("AI-Powered Document Accessibility", pageWidth / 2, y, { align: "center" });

  y += 14;

  // --- Title ---
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.setTextColor(darkText[0], darkText[1], darkText[2]);
  pdf.text("Certificate of Accessibility", pageWidth / 2, y, { align: "center" });
  y += 9;
  pdf.text("Compliance", pageWidth / 2, y, { align: "center" });

  y += 12;

  // --- Thin separator ---
  pdf.setDrawColor(green[0], green[1], green[2]);
  pdf.setLineWidth(0.5);
  pdf.line(margin + 40, y, pageWidth - margin - 40, y);

  y += 10;

  // --- Verification note ---
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(9);
  pdf.setTextColor(slate[0], slate[1], slate[2]);
  const verifyText =
    "This certificate verifies that the above document has been remediated for accessibility compliance.";
  const verifyLines = pdf.splitTextToSize(verifyText, contentWidth - 20);
  pdf.text(verifyLines, pageWidth / 2, y, { align: "center" });

  y += verifyLines.length * 5 + 8;

  // --- Document details box ---
  const boxStartY = y;
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(margin, y, contentWidth, 52, 3, 3, "F");
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(margin, y, contentWidth, 52, 3, 3, "S");

  y += 8;
  const labelX = margin + 8;
  const valueX = margin + 50;
  const col2LabelX = pageWidth / 2 + 5;
  const col2ValueX = pageWidth / 2 + 45;

  function drawField(label: string, value: string, lx: number, vx: number, yPos: number) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(slate[0], slate[1], slate[2]);
    pdf.text(label, lx, yPos);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(darkText[0], darkText[1], darkText[2]);
    pdf.text(value, vx, yPos);
  }

  const serviceLabel =
    (certificateData.service_level || "standard").charAt(0).toUpperCase() +
    (certificateData.service_level || "standard").slice(1);

  drawField("Document:", certificateData.filename, labelX, valueX, y);
  drawField("Certificate ID:", certificateData.certificate_id.slice(0, 13) + "...", col2LabelX, col2ValueX, y);

  y += 10;
  drawField("Pages:", String(certificateData.page_count ?? "N/A"), labelX, valueX, y);
  drawField("Service Level:", serviceLabel, col2LabelX, col2ValueX, y);

  y += 10;
  const remDate = certificateData.remediation_date
    ? new Date(certificateData.remediation_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";
  drawField("Remediated:", remDate, labelX, valueX, y);

  // Score display
  const scoreBefore = certificateData.score_before !== null ? `${certificateData.score_before}%` : "N/A";
  const scoreAfter = certificateData.score_after !== null ? `${certificateData.score_after}%` : "N/A";
  drawField("Score:", `${scoreBefore} → ${scoreAfter}`, col2LabelX, col2ValueX, y);

  y = boxStartY + 52 + 10;

  // --- Standards Met ---
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(darkText[0], darkText[1], darkText[2]);
  pdf.text("Standards Met", pageWidth / 2, y, { align: "center" });

  y += 8;

  // Draw standards as badges
  const standards = certificateData.standards_met;
  const badgeWidth = (contentWidth - 8) / 3;
  standards.forEach((std, i) => {
    const bx = margin + i * (badgeWidth + 4);
    pdf.setFillColor(green[0], green[1], green[2]);
    pdf.roundedRect(bx, y, badgeWidth, 10, 2, 2, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text(std, bx + badgeWidth / 2, y + 6.5, { align: "center" });
  });

  y += 18;

  // --- Checks Passed ---
  const checksArr = certificateData.checks_passed;
  if (checksArr.length > 0) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(darkText[0], darkText[1], darkText[2]);
    pdf.text("Checks Passed", pageWidth / 2, y, { align: "center" });

    y += 7;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(slate[0], slate[1], slate[2]);

    // Show up to 16 checks in two columns
    const maxChecks = Math.min(checksArr.length, 16);
    const colMid = Math.ceil(maxChecks / 2);
    const checkStartY = y;

    for (let i = 0; i < maxChecks; i++) {
      const check = checksArr[i] as { criterion?: string; rule?: string; description?: string; message?: string };
      const label = check.criterion || check.rule || check.description || check.message || "Check passed";
      const truncated = label.length > 42 ? label.slice(0, 39) + "..." : label;

      const cx = i < colMid ? margin + 4 : pageWidth / 2 + 2;
      const cy = i < colMid ? checkStartY + i * 5 : checkStartY + (i - colMid) * 5;

      // Green checkmark
      pdf.setTextColor(green[0], green[1], green[2]);
      pdf.setFont("helvetica", "bold");
      pdf.text("\u2713", cx, cy);

      // Check text
      pdf.setTextColor(slate[0], slate[1], slate[2]);
      pdf.setFont("helvetica", "normal");
      pdf.text(truncated, cx + 5, cy);
    }

    if (checksArr.length > maxChecks) {
      const extraY = checkStartY + colMid * 5 + 2;
      pdf.setTextColor(slate[0], slate[1], slate[2]);
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(7);
      pdf.text(
        `+ ${checksArr.length - maxChecks} more checks passed`,
        pageWidth / 2,
        extraY,
        { align: "center" }
      );
    }
  }

  // --- Bottom decorative bar ---
  const pageHeight = pdf.internal.pageSize.getHeight();
  pdf.setFillColor(green[0], green[1], green[2]);
  pdf.rect(0, pageHeight - 15, pageWidth, 3, "F");
  pdf.setFillColor(navy[0], navy[1], navy[2]);
  pdf.rect(0, pageHeight - 12, pageWidth, 12, "F");

  // Footer text
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(200, 200, 200);
  pdf.text(
    "CASO Comply  |  casocomply.com  |  AI-Powered Accessibility Remediation",
    pageWidth / 2,
    pageHeight - 5,
    { align: "center" }
  );

  // Generate buffer
  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

  const safeFilename = document.filename.replace(/[^a-zA-Z0-9._-]/g, "_");

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificate_${safeFilename}"`,
      "Content-Length": String(pdfBuffer.length),
    },
  });
}
