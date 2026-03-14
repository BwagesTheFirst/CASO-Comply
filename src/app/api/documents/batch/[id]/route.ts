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

// GET — Fetch a single batch with its documents
export async function GET(
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

  // Fetch all documents in this batch
  const { data: documents, error: docsError } = await admin
    .from("documents")
    .select("*")
    .eq("batch_id", batchId)
    .order("created_at", { ascending: true });

  if (docsError) {
    return NextResponse.json({ error: docsError.message }, { status: 500 });
  }

  return NextResponse.json({
    batch,
    documents: documents ?? [],
  });
}
