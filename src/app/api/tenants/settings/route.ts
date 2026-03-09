import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Helper: get tenant membership for authenticated user
async function getTenantMembership(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("tenant_members")
    .select("tenant_id, role")
    .eq("user_id", user.id)
    .single();

  return membership;
}

// GET — return tenant settings
export async function GET() {
  const supabase = await createClient();
  const membership = await getTenantMembership(supabase);

  if (!membership) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: tenant, error } = await supabase
    .from("tenants")
    .select("id, name, billing_email, brand_color, logo_url")
    .eq("id", membership.tenant_id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tenant });
}

// PUT — update tenant settings
export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const membership = await getTenantMembership(supabase);

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

  const { error } = await supabase
    .from("tenants")
    .update(updates)
    .eq("id", membership.tenant_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
