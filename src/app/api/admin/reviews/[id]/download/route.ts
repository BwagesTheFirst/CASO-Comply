import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
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

  // Determine which file to serve based on ?type= query parameter
  const url = new URL(request.url);
  const fileType = url.searchParams.get("type") || "original";

  let storagePath: string | null = null;
  switch (fileType) {
    case "corrected":
      storagePath = review.corrected_path || review.output_path || review.storage_path;
      break;
    case "output":
      storagePath = review.output_path || review.storage_path;
      break;
    case "original":
    default:
      storagePath = review.storage_path;
      break;
  }

  if (!storagePath) {
    return NextResponse.json({ error: "No file path available" }, { status: 404 });
  }

  const { data: fileData, error } = await admin.storage
    .from("review-files")
    .download(storagePath);

  if (error || !fileData) {
    return NextResponse.json({ error: "File not found in storage" }, { status: 404 });
  }

  const buffer = Buffer.from(await fileData.arrayBuffer());
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${review.filename}"`,
    },
  });
}
