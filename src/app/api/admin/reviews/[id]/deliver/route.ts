import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSuperAdmin } from "../../../middleware";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await requireSuperAdmin();
  if (!user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const admin = createAdminClient();

  // Fetch the review
  const { data: review, error: fetchError } = await admin
    .from("review_queue")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  if (review.status !== "completed") {
    return NextResponse.json(
      { error: `Cannot deliver review in '${review.status}' status. Must be 'completed'.` },
      { status: 400 }
    );
  }

  // If there's a linked document, copy corrected file to remediated bucket
  if (review.document_id && review.corrected_path) {
    // Download corrected file from review-files bucket
    const { data: fileData, error: downloadError } = await admin.storage
      .from("review-files")
      .download(review.corrected_path);

    if (downloadError || !fileData) {
      return NextResponse.json(
        { error: `Failed to download corrected file: ${downloadError?.message || "No data"}` },
        { status: 500 }
      );
    }

    // Build the remediated path matching the pattern used during processing
    const remediatedPath = `${review.tenant_id}/${review.document_id}/remediated_${review.filename}`;

    // Upload to remediated bucket (overwrite the auto-remediated version)
    const buffer = Buffer.from(await fileData.arrayBuffer());
    const { error: uploadError } = await admin.storage
      .from("remediated")
      .upload(remediatedPath, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Failed to upload to remediated bucket: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Update the document's remediated_path and review_status
    await admin
      .from("documents")
      .update({
        remediated_path: remediatedPath,
        review_status: "delivered",
        updated_at: new Date().toISOString(),
      })
      .eq("id", review.document_id);
  } else if (review.document_id) {
    // No corrected file but still linked — just update review_status
    await admin
      .from("documents")
      .update({
        review_status: "delivered",
        updated_at: new Date().toISOString(),
      })
      .eq("id", review.document_id);
  }

  // Mark review as delivered
  const { error: updateError } = await admin
    .from("review_queue")
    .update({
      status: "delivered",
      delivered_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json(
      { error: `Failed to update review: ${updateError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: "delivered", review_id: id });
}
