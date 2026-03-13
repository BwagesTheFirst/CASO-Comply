import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

const PRICING_CENTS: Record<string, number> = {
  standard: 30,
  enhanced: 180,
  expert: 1200,
};

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

// GET — List batches for tenant
export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
  );
  const offset = (page - 1) * limit;

  const admin = createAdminClient();

  const { data: batches, error, count } = await admin
    .from("document_batches")
    .select("*", { count: "exact" })
    .eq("tenant_id", auth.tenantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    batches,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      total_pages: Math.ceil((count ?? 0) / limit),
    },
  });
}

// POST — Create a batch with files
export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data. Send multipart/form-data." },
      { status: 400 }
    );
  }

  const name = (formData.get("name") as string) || "Untitled Batch";
  const serviceLevel = (formData.get("service_level") as string) || "standard";

  if (!PRICING_CENTS[serviceLevel]) {
    return NextResponse.json(
      { error: `Invalid service_level. Must be one of: ${Object.keys(PRICING_CENTS).join(", ")}` },
      { status: 400 }
    );
  }

  const files = formData.getAll("files") as File[];
  if (!files.length || !(files[0] instanceof File)) {
    return NextResponse.json(
      { error: "No files provided. Include one or more 'files' fields." },
      { status: 400 }
    );
  }

  // Validate all files
  const MAX_SIZE = 50 * 1024 * 1024;
  for (const file of files) {
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: `File "${file.name}" is not a PDF.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File "${file.name}" exceeds 50MB limit.` },
        { status: 400 }
      );
    }
  }

  const admin = createAdminClient();
  const batchId = crypto.randomUUID();

  // Create batch record
  const { data: batch, error: batchError } = await admin
    .from("document_batches")
    .insert({
      id: batchId,
      tenant_id: auth.tenantId,
      created_by: auth.user.id,
      name,
      service_level: serviceLevel,
      total_files: files.length,
      completed_files: 0,
      failed_files: 0,
      total_pages: 0,
      estimated_cost_cents: 0,
      status: "pending",
    })
    .select()
    .single();

  if (batchError) {
    return NextResponse.json(
      { error: `Failed to create batch: ${batchError.message}` },
      { status: 500 }
    );
  }

  // Upload each file and create document records
  const documents = [];
  const uploadErrors = [];

  for (const file of files) {
    const fileId = crypto.randomUUID();
    const storagePath = `${auth.tenantId}/${fileId}/${file.name}`;

    try {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const { error: uploadError } = await admin.storage
        .from("documents")
        .upload(storagePath, fileBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        uploadErrors.push({ filename: file.name, error: uploadError.message });
        continue;
      }

      const { data: doc, error: dbError } = await admin
        .from("documents")
        .insert({
          id: fileId,
          tenant_id: auth.tenantId,
          uploaded_by: auth.user.id,
          filename: file.name,
          file_size: file.size,
          mime_type: file.type,
          storage_path: storagePath,
          service_level: serviceLevel,
          status: "queued",
          batch_id: batchId,
        })
        .select()
        .single();

      if (dbError) {
        await admin.storage.from("documents").remove([storagePath]);
        uploadErrors.push({ filename: file.name, error: dbError.message });
        continue;
      }

      documents.push(doc);
    } catch (err) {
      uploadErrors.push({
        filename: file.name,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  // Update batch total_files to reflect actually uploaded files
  if (documents.length !== files.length) {
    await admin
      .from("document_batches")
      .update({
        total_files: documents.length,
        updated_at: new Date().toISOString(),
      })
      .eq("id", batchId);
  }

  return NextResponse.json(
    {
      batch: { ...batch, total_files: documents.length },
      documents,
      errors: uploadErrors.length > 0 ? uploadErrors : undefined,
    },
    { status: 201 }
  );
}
