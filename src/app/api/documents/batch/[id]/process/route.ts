import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

const PRICING_CENTS: Record<string, number> = {
  standard: 30,
  enhanced: 180,
  expert: 1200,
};

const EXTERNAL_API = "https://caso-comply-api.onrender.com";

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

async function processDocument(
  admin: ReturnType<typeof createAdminClient>,
  document: Record<string, unknown>,
  tenantId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const docId = document.id as string;
  const filename = document.filename as string;
  const storagePath = document.storage_path as string;
  const serviceLevel = (document.service_level as string) || "standard";

  // Update status to processing
  await admin
    .from("documents")
    .update({ status: "processing", updated_at: new Date().toISOString() })
    .eq("id", docId);

  try {
    // Download file from storage
    const { data: fileData, error: downloadError } = await admin.storage
      .from("documents")
      .download(storagePath);

    if (downloadError || !fileData) {
      throw new Error(`Failed to download: ${downloadError?.message || "No data"}`);
    }

    // Send to remediation API
    const useVerify = serviceLevel === "enhanced" || serviceLevel === "expert";
    const remediateUrl = `${EXTERNAL_API}/api/remediate${useVerify ? "?verify=true" : ""}`;

    const externalForm = new FormData();
    externalForm.append(
      "file",
      new Blob([await fileData.arrayBuffer()], { type: "application/pdf" }),
      filename
    );

    const remediateResponse = await fetch(remediateUrl, {
      method: "POST",
      body: externalForm,
    });

    if (!remediateResponse.ok) {
      const errorText = await remediateResponse.text().catch(() => "Unknown error");
      throw new Error(`Remediation API returned ${remediateResponse.status}: ${errorText}`);
    }

    const result = await remediateResponse.json();

    const fileId = result.file_id;
    const scoreBefore = result.score_before ?? result.score?.before ?? null;
    const scoreAfter = result.score_after ?? result.score?.after ?? null;
    const gradeBefore = result.grade_before ?? result.grade?.before ?? null;
    const gradeAfter = result.grade_after ?? result.grade?.after ?? null;
    const issuesFound = result.issues_found ?? result.issues ?? null;
    const checksPassed = result.checks_passed ?? null;
    const pageCount = result.page_count ?? result.pages ?? null;
    const certificateJson = result.certificate ?? null;

    if (!fileId) {
      throw new Error("Remediation API did not return a file_id");
    }

    // Download remediated file
    const dlResponse = await fetch(`${EXTERNAL_API}/api/download/${fileId}`);
    if (!dlResponse.ok) {
      throw new Error(`Failed to download remediated file: ${dlResponse.status}`);
    }

    const remediatedBuffer = Buffer.from(await dlResponse.arrayBuffer());
    const remediatedPath = `${tenantId}/${docId}/remediated_${filename}`;

    const { error: remUploadError } = await admin.storage
      .from("remediated")
      .upload(remediatedPath, remediatedBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (remUploadError) {
      throw new Error(`Failed to upload remediated file: ${remUploadError.message}`);
    }

    const pages = pageCount || 1;
    const costCents = pages * (PRICING_CENTS[serviceLevel] || PRICING_CENTS.standard);
    const now = new Date().toISOString();

    await admin
      .from("documents")
      .update({
        status: "completed",
        remediated_path: remediatedPath,
        score_before: scoreBefore,
        score_after: scoreAfter,
        grade_before: gradeBefore,
        grade_after: gradeAfter,
        issues_found: issuesFound,
        checks_passed: checksPassed,
        page_count: pages,
        certificate_json: certificateJson,
        updated_at: now,
        completed_at: now,
      })
      .eq("id", docId);

    // Record usage
    await admin.from("usage_records").insert({
      id: crypto.randomUUID(),
      tenant_id: tenantId,
      user_id: userId,
      action: "remediation",
      pages_consumed: pages,
      document_id: docId,
      document_filename: filename,
      remediation_type: serviceLevel,
      cost_cents: costCents,
    });

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Processing failed";

    await admin
      .from("documents")
      .update({
        status: "failed",
        error: errorMessage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", docId);

    return { success: false, error: errorMessage };
  }
}

// POST — Process all queued documents in a batch
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: batchId } = await params;
  const admin = createAdminClient();

  // Verify batch ownership
  const { data: batch, error: batchError } = await admin
    .from("document_batches")
    .select("*")
    .eq("id", batchId)
    .eq("tenant_id", auth.tenantId)
    .single();

  if (batchError || !batch) {
    return NextResponse.json({ error: "Batch not found" }, { status: 404 });
  }

  // Get queued documents in this batch
  const { data: queuedDocs, error: docsError } = await admin
    .from("documents")
    .select("*")
    .eq("batch_id", batchId)
    .eq("status", "queued")
    .order("created_at", { ascending: true });

  if (docsError) {
    return NextResponse.json({ error: docsError.message }, { status: 500 });
  }

  if (!queuedDocs || queuedDocs.length === 0) {
    return NextResponse.json(
      { error: "No queued documents in this batch" },
      { status: 400 }
    );
  }

  // Update batch status to processing
  await admin
    .from("document_batches")
    .update({ status: "processing", updated_at: new Date().toISOString() })
    .eq("id", batchId);

  // Process each document sequentially
  const results: Array<{
    document_id: string;
    filename: string;
    success: boolean;
    error?: string;
  }> = [];

  for (const doc of queuedDocs) {
    const result = await processDocument(admin, doc, auth.tenantId, auth.user.id);
    results.push({
      document_id: doc.id,
      filename: doc.filename,
      success: result.success,
      error: result.error,
    });
  }

  // Get final batch stats
  const { data: allBatchDocs } = await admin
    .from("documents")
    .select("status, page_count")
    .eq("batch_id", batchId);

  const completedFiles = allBatchDocs?.filter((d) => d.status === "completed").length ?? 0;
  const failedFiles = allBatchDocs?.filter((d) => d.status === "failed").length ?? 0;
  const totalPages = allBatchDocs?.reduce(
    (sum, d) => sum + ((d.status === "completed" ? d.page_count : 0) || 0),
    0
  ) ?? 0;
  const totalFiles = allBatchDocs?.length ?? 0;
  const allDone = completedFiles + failedFiles === totalFiles;

  const now = new Date().toISOString();
  const batchUpdate: Record<string, unknown> = {
    completed_files: completedFiles,
    failed_files: failedFiles,
    total_pages: totalPages,
    updated_at: now,
  };

  if (allDone) {
    batchUpdate.status = failedFiles === totalFiles ? "failed" : "completed";
    batchUpdate.completed_at = now;
    batchUpdate.estimated_cost_cents =
      totalPages * (PRICING_CENTS[batch.service_level] || PRICING_CENTS.standard);
  }

  await admin
    .from("document_batches")
    .update(batchUpdate)
    .eq("id", batchId);

  // Re-fetch batch
  const { data: updatedBatch } = await admin
    .from("document_batches")
    .select("*")
    .eq("id", batchId)
    .single();

  return NextResponse.json({
    batch: updatedBatch,
    results,
  });
}
