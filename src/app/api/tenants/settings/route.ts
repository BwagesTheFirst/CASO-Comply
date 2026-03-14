import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Helper: authenticate user and get tenant membership using admin client
async function getAuthenticatedMembership() {
  // Auth check (server client)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Data query (admin client, bypasses RLS)
  const admin = createAdminClient();
  const { data: membership } = await admin
    .from("tenant_members")
    .select("tenant_id, role")
    .eq("user_id", user.id)
    .single();

  return membership ? { ...membership, user_id: user.id } : null;
}

// GET — return tenant settings
export async function GET() {
  const membership = await getAuthenticatedMembership();

  if (!membership) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: tenant, error } = await admin
    .from("tenants")
    .select("id, name, billing_email, brand_color, logo_url, status, trial_pages_used, trial_pages_limit")
    .eq("id", membership.tenant_id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tenant });
}

// PUT — update tenant settings
export async function PUT(request: NextRequest) {
  const membership = await getAuthenticatedMembership();

  if (!membership) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only owners and admins can update settings
  if (membership.role !== "owner" && membership.role !== "admin") {
    return NextResponse.json(
      { error: "Only owners and admins can update settings" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { name, billing_email, brand_color, logo_url } = body;

  const updates: Record<string, string> = {};
  if (name !== undefined) updates.name = name;
  if (billing_email !== undefined) updates.billing_email = billing_email;
  if (brand_color !== undefined) updates.brand_color = brand_color;
  if (logo_url !== undefined) updates.logo_url = logo_url;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("tenants")
    .update(updates)
    .eq("id", membership.tenant_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE — permanently delete tenant account and all associated data
export async function DELETE() {
  const membership = await getAuthenticatedMembership();

  if (!membership) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only the tenant owner can delete the account
  if (membership.role !== "owner") {
    return NextResponse.json(
      { error: "Only the account owner can delete the organization" },
      { status: 403 }
    );
  }

  const admin = createAdminClient();
  const tenantId = membership.tenant_id;
  const userId = membership.user_id;

  try {
    // 1. Delete storage files and documents
    const { data: documents } = await admin
      .from("documents")
      .select("id, storage_path, remediated_path")
      .eq("tenant_id", tenantId);

    if (documents && documents.length > 0) {
      // Delete original files from storage
      const storagePaths = documents
        .map((d: { storage_path: string | null }) => d.storage_path)
        .filter(Boolean) as string[];
      if (storagePaths.length > 0) {
        await admin.storage.from("documents").remove(storagePaths);
      }

      // Delete remediated files from storage
      const remediatedPaths = documents
        .map((d: { remediated_path: string | null }) => d.remediated_path)
        .filter(Boolean) as string[];
      if (remediatedPaths.length > 0) {
        await admin.storage.from("remediated").remove(remediatedPaths);
      }

      const documentIds = documents.map((d: { id: string }) => d.id);

      // 3. Delete cost_records linked to tenant's documents
      await admin
        .from("cost_records")
        .delete()
        .in("document_id", documentIds);

      // Delete documents
      await admin.from("documents").delete().eq("tenant_id", tenantId);
    }

    // 2. Delete document_batches
    await admin.from("document_batches").delete().eq("tenant_id", tenantId);

    // 4. Delete usage_records
    await admin.from("usage_records").delete().eq("tenant_id", tenantId);

    // 5. Delete api_keys
    await admin.from("api_keys").delete().eq("tenant_id", tenantId);

    // 6. Delete invoices
    await admin.from("invoices").delete().eq("tenant_id", tenantId);

    // 7. Delete all tenant_members
    await admin.from("tenant_members").delete().eq("tenant_id", tenantId);

    // 8. Delete the tenant itself
    await admin.from("tenants").delete().eq("id", tenantId);

    // 9. Delete the auth user
    const { error: authError } = await admin.auth.admin.deleteUser(userId);
    if (authError) {
      console.error("Failed to delete auth user:", authError.message);
      // The tenant data is already gone, so we still return success
      // but log the error for manual cleanup
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Account deletion failed:", err);
    return NextResponse.json(
      { error: "Account deletion failed. Please contact support." },
      { status: 500 }
    );
  }
}
