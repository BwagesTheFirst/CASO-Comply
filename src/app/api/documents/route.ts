import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

// Pricing per page in cents
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

// GET — List documents for authenticated tenant
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
  const status = searchParams.get("status");
  const serviceLevel = searchParams.get("service_level");
  const search = searchParams.get("search");
  const offset = (page - 1) * limit;

  const admin = createAdminClient();

  let query = admin
    .from("documents")
    .select("*", { count: "exact" })
    .eq("tenant_id", auth.tenantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq("status", status);
  }
  if (serviceLevel) {
    query = query.eq("service_level", serviceLevel);
  }
  if (search) {
    query = query.ilike("filename", `%${search}%`);
  }

  const { data: documents, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    documents,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      total_pages: Math.ceil((count ?? 0) / limit),
    },
  });
}

// POST — Upload document(s)
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
      { error: "Invalid form data. Send multipart/form-data with a 'file' field." },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "No file provided. Include a 'file' field." },
      { status: 400 }
    );
  }

  const serviceLevel = (formData.get("service_level") as string) || "standard";
  if (!PRICING_CENTS[serviceLevel]) {
    return NextResponse.json(
      { error: `Invalid service_level. Must be one of: ${Object.keys(PRICING_CENTS).join(", ")}` },
      { status: 400 }
    );
  }

  const batchId = formData.get("batch_id") as string | null;

  // Validate file type
  const allowedTypes = ["application/pdf"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Only PDF files are accepted." },
      { status: 400 }
    );
  }

  // Max file size: 50MB
  const MAX_SIZE = 50 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File size exceeds 50MB limit." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const fileId = crypto.randomUUID();
  const storagePath = `${auth.tenantId}/${fileId}/${file.name}`;

  // Upload to Supabase storage
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await admin.storage
    .from("documents")
    .upload(storagePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: `Storage upload failed: ${uploadError.message}` },
      { status: 500 }
    );
  }

  // Create document record
  const documentData: Record<string, unknown> = {
    id: fileId,
    tenant_id: auth.tenantId,
    uploaded_by: auth.user.id,
    filename: file.name,
    file_size: file.size,
    mime_type: file.type,
    storage_path: storagePath,
    service_level: serviceLevel,
    status: "queued",
  };

  if (batchId) {
    documentData.batch_id = batchId;
  }

  const { data: document, error: dbError } = await admin
    .from("documents")
    .insert(documentData)
    .select()
    .single();

  if (dbError) {
    // Clean up uploaded file on DB failure
    await admin.storage.from("documents").remove([storagePath]);
    return NextResponse.json(
      { error: `Failed to create document record: ${dbError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ document }, { status: 201 });
}
