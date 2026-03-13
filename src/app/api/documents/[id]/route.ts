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

// GET — Get document detail
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

  const { data: document, error } = await admin
    .from("documents")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", auth.tenantId)
    .single();

  if (error || !document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json({ document });
}

// POST — Trigger remediation processing
export async function POST(
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
  const { data: document, error: fetchError } = await admin
    .from("documents")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", auth.tenantId)
    .single();

  if (fetchError || !document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  if (document.status === "processing") {
    return NextResponse.json(
      { error: "Document is already being processed" },
      { status: 409 }
    );
  }

  if (document.status === "completed") {
    return NextResponse.json(
      { error: "Document has already been remediated" },
      { status: 409 }
    );
  }

  // Update status to processing
  await admin
    .from("documents")
    .update({ status: "processing", updated_at: new Date().toISOString() })
    .eq("id", id);

  try {
    // Download file from Supabase storage
    const { data: fileData, error: downloadError } = await admin.storage
      .from("documents")
      .download(document.storage_path);

    if (downloadError || !fileData) {
      throw new Error(`Failed to download file: ${downloadError?.message || "No data"}`);
    }

    // Send to external remediation API
    const useVerify =
      document.service_level === "enhanced" || document.service_level === "expert";
    const remediateUrl = `${EXTERNAL_API}/api/remediate${useVerify ? "?verify=true" : ""}`;

    const externalForm = new FormData();
    externalForm.append(
      "file",
      new Blob([await fileData.arrayBuffer()], { type: "application/pdf" }),
      document.filename
    );

    const remediateResponse = await fetch(remediateUrl, {
      method: "POST",
      body: externalForm,
    });

    if (!remediateResponse.ok) {
      const errorText = await remediateResponse.text().catch(() => "Unknown error");
      throw new Error(`Remediation API returned ${remediateResponse.status}: ${errorText}`);
    }

    const remediateResult = await remediateResponse.json();

    // Extract results
    const fileId = remediateResult.file_id;
    const scoreBefore = remediateResult.score_before ?? remediateResult.score?.before ?? null;
    const scoreAfter = remediateResult.score_after ?? remediateResult.score?.after ?? null;
    const gradeBefore = remediateResult.grade_before ?? remediateResult.grade?.before ?? null;
    const gradeAfter = remediateResult.grade_after ?? remediateResult.grade?.after ?? null;
    const issuesFound = remediateResult.issues_found ?? remediateResult.issues ?? null;
    const checksPassed = remediateResult.checks_passed ?? null;
    const pageCount = remediateResult.page_count ?? remediateResult.pages ?? null;
    const certificateJson = remediateResult.certificate ?? null;

    // Download remediated file
    if (!fileId) {
      throw new Error("Remediation API did not return a file_id");
    }

    const downloadResponse = await fetch(`${EXTERNAL_API}/api/download/${fileId}`);
    if (!downloadResponse.ok) {
      throw new Error(`Failed to download remediated file: ${downloadResponse.status}`);
    }

    const remediatedBuffer = Buffer.from(await downloadResponse.arrayBuffer());
    const remediatedPath = `${auth.tenantId}/${id}/remediated_${document.filename}`;

    // Upload remediated file to storage
    const { error: remUploadError } = await admin.storage
      .from("remediated")
      .upload(remediatedPath, remediatedBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (remUploadError) {
      throw new Error(`Failed to upload remediated file: ${remUploadError.message}`);
    }

    // Calculate cost
    const pages = pageCount || 1;
    const costCents = pages * (PRICING_CENTS[document.service_level] || PRICING_CENTS.standard);

    // Update document record
    const now = new Date().toISOString();
    const { error: updateError } = await admin
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
      .eq("id", id);

    if (updateError) {
      throw new Error(`Failed to update document: ${updateError.message}`);
    }

    // Record usage
    await admin.from("usage_records").insert({
      id: crypto.randomUUID(),
      tenant_id: auth.tenantId,
      user_id: auth.user.id,
      action: "remediation",
      pages_consumed: pages,
      document_id: id,
      document_filename: document.filename,
      remediation_type: document.service_level,
      cost_cents: costCents,
    });

    // Update batch counters if applicable
    if (document.batch_id) {
      const { data: batchDoc } = await admin
        .from("documents")
        .select("status")
        .eq("batch_id", document.batch_id);

      const completedFiles = batchDoc?.filter((d) => d.status === "completed").length ?? 0;
      const failedFiles = batchDoc?.filter((d) => d.status === "failed").length ?? 0;

      await admin
        .from("document_batches")
        .update({
          completed_files: completedFiles,
          failed_files: failedFiles,
          updated_at: now,
        })
        .eq("id", document.batch_id);
    }

    // Re-fetch updated document
    const { data: updatedDoc } = await admin
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    return NextResponse.json({ document: updatedDoc });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Processing failed";

    // Set status to failed
    await admin
      .from("documents")
      .update({
        status: "failed",
        error: errorMessage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    // Update batch counters if applicable
    if (document.batch_id) {
      const { data: batchDoc } = await admin
        .from("documents")
        .select("status")
        .eq("batch_id", document.batch_id);

      const failedFiles = batchDoc?.filter((d) => d.status === "failed").length ?? 0;
      const completedFiles = batchDoc?.filter((d) => d.status === "completed").length ?? 0;

      await admin
        .from("document_batches")
        .update({
          completed_files: completedFiles,
          failed_files: failedFiles,
          updated_at: new Date().toISOString(),
        })
        .eq("id", document.batch_id);
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE — Delete document and storage files
export async function DELETE(
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
  const { data: document, error: fetchError } = await admin
    .from("documents")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", auth.tenantId)
    .single();

  if (fetchError || !document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  // Delete files from storage
  const filesToRemove: string[] = [document.storage_path];
  if (document.remediated_path) {
    filesToRemove.push(document.remediated_path);
  }

  await admin.storage.from("documents").remove([document.storage_path]);
  if (document.remediated_path) {
    await admin.storage.from("remediated").remove([document.remediated_path]);
  }

  // Delete document record
  const { error: deleteError } = await admin
    .from("documents")
    .delete()
    .eq("id", id)
    .eq("tenant_id", auth.tenantId);

  if (deleteError) {
    return NextResponse.json(
      { error: `Failed to delete document: ${deleteError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
