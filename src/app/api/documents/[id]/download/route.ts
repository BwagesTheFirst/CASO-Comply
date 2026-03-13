import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

// GET — Download original or remediated file
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "remediated";
  const admin = createAdminClient();

  // Fetch document and verify ownership
  const { data: document, error: fetchError } = await admin
    .from("documents")
    .select("filename, storage_path, remediated_path, mime_type, status, tenant_id")
    .eq("id", id)
    .eq("tenant_id", auth.tenantId)
    .single();

  if (fetchError || !document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  let bucket: string;
  let storagePath: string;
  let downloadFilename: string;

  if (type === "original") {
    bucket = "documents";
    storagePath = document.storage_path;
    downloadFilename = document.filename;
  } else {
    if (document.status !== "completed" || !document.remediated_path) {
      return NextResponse.json(
        { error: "Remediated file is not available. Document must be processed first." },
        { status: 404 }
      );
    }
    bucket = "remediated";
    storagePath = document.remediated_path;
    downloadFilename = `remediated_${document.filename}`;
  }

  // Download from storage
  const { data: fileData, error: downloadError } = await admin.storage
    .from(bucket)
    .download(storagePath);

  if (downloadError || !fileData) {
    return NextResponse.json(
      { error: `Failed to download file: ${downloadError?.message || "File not found"}` },
      { status: 500 }
    );
  }

  const buffer = Buffer.from(await fileData.arrayBuffer());
  const contentType = document.mime_type || "application/pdf";

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${downloadFilename}"`,
      "Content-Length": buffer.length.toString(),
    },
  });
}
