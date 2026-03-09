import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: superAdmin } = await admin
    .from("super_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();
  if (!superAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { data: review } = await admin
    .from("review_queue")
    .select("*")
    .eq("id", id)
    .single();

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  if (!["pending", "in_review"].includes(review.status)) {
    return NextResponse.json(
      { error: `Cannot complete review in '${review.status}' status` },
      { status: 400 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const notes = (formData.get("notes") as string) || "";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const correctedPath = `${review.tenant_id}/${id}/corrected.pdf`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from("review-files")
    .upload(correctedPath, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: `Upload failed: ${uploadError.message}` },
      { status: 500 }
    );
  }

  const { error: updateError } = await admin
    .from("review_queue")
    .update({
      status: "completed",
      corrected_path: correctedPath,
      reviewer_notes: notes || null,
      completed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json(
      { error: `Update failed: ${updateError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: "completed", review_id: id });
}
