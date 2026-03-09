import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

// Helper: get tenant_id for the authenticated user
async function getTenantId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  return membership?.tenant_id ?? null;
}

// GET — list API keys (masked)
export async function GET() {
  const supabase = await createClient();
  const tenantId = await getTenantId(supabase);

  if (!tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: keys, error } = await supabase
    .from("api_keys")
    .select("id, name, prefix, is_active, created_at, last_used_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ keys });
}

// POST — create new API key
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const tenantId = await getTenantId(supabase);

  if (!tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = body.name?.trim();

  if (!name) {
    return NextResponse.json(
      { error: "Key name is required" },
      { status: 400 }
    );
  }

  // Generate a secure API key
  const rawKey = `caso_${crypto.randomBytes(32).toString("hex")}`;
  const prefix = rawKey.slice(0, 12);
  const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");

  const { data: newKey, error } = await supabase
    .from("api_keys")
    .insert({
      tenant_id: tenantId,
      name,
      prefix,
      key_hash: keyHash,
      is_active: true,
    })
    .select("id, name, prefix, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return the raw key ONCE
  return NextResponse.json({
    id: newKey.id,
    name: newKey.name,
    prefix: newKey.prefix,
    rawKey,
    created_at: newKey.created_at,
  });
}

// DELETE — revoke API key
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const tenantId = await getTenantId(supabase);

  if (!tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const keyId = searchParams.get("id");

  if (!keyId) {
    return NextResponse.json(
      { error: "Key ID is required" },
      { status: 400 }
    );
  }

  // Verify the key belongs to this tenant
  const { data: existing } = await supabase
    .from("api_keys")
    .select("id")
    .eq("id", keyId)
    .eq("tenant_id", tenantId)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("api_keys")
    .update({ is_active: false })
    .eq("id", keyId)
    .eq("tenant_id", tenantId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
