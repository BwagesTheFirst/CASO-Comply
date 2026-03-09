import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "../middleware";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const user = await requireSuperAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "50", 10))
  );

  const admin = createAdminClient();

  // Fetch auth users with pagination
  const {
    data: { users: authUsers },
    error: authError,
  } = await admin.auth.admin.listUsers({
    page,
    perPage: limit,
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  // Fetch all tenant memberships for these users
  const userIds = authUsers.map((u) => u.id);

  const { data: memberships } = await admin
    .from("tenant_members")
    .select("user_id, role, tenant_id, tenants(id, name, slug, status)")
    .in("user_id", userIds);

  // Build a map of user_id -> memberships
  const membershipMap = new Map<
    string,
    {
      tenant_id: string;
      role: string;
      tenant: { id: string; name: string; slug: string; status: string } | null;
    }[]
  >();

  for (const m of memberships ?? []) {
    const existing = membershipMap.get(m.user_id) ?? [];
    const rawTenant = m.tenants as unknown;
    const tenant = Array.isArray(rawTenant)
      ? (rawTenant[0] as { id: string; name: string; slug: string; status: string } | undefined) ?? null
      : (rawTenant as { id: string; name: string; slug: string; status: string } | null);
    existing.push({
      tenant_id: m.tenant_id,
      role: m.role,
      tenant,
    });
    membershipMap.set(m.user_id, existing);
  }

  // Shape response
  const users = authUsers.map((u) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
    is_super_admin: u.user_metadata?.is_super_admin === true,
    memberships: membershipMap.get(u.id) ?? [],
  }));

  return NextResponse.json({
    users,
    page,
    limit,
  });
}
