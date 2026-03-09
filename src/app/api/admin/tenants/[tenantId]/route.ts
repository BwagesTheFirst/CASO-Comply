import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "../../middleware";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  const user = await requireSuperAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { tenantId } = await params;
  const admin = createAdminClient();

  // Fetch tenant with plan details
  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .select("*, subscription_plans(*)")
    .eq("id", tenantId)
    .single();

  if (tenantError || !tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  // Fetch members, usage summary, and recent scans in parallel
  const [membersRes, usageRes, scansRes] = await Promise.all([
    admin
      .from("tenant_members")
      .select("id, user_id, role, created_at")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: true }),

    admin
      .from("usage_records")
      .select("action, pages_consumed, created_at")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(500),

    admin
      .from("scans")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  // Enrich members with email from auth
  const members = membersRes.data ?? [];
  let enrichedMembers = members;

  if (members.length > 0) {
    // Fetch all auth users to match by user_id
    const {
      data: { users: authUsers },
    } = await admin.auth.admin.listUsers({ perPage: 1000 });

    const userMap = new Map(
      authUsers.map((u) => [u.id, { email: u.email, last_sign_in_at: u.last_sign_in_at }])
    );

    enrichedMembers = members.map((m) => {
      const authInfo = userMap.get(m.user_id);
      return {
        ...m,
        email: authInfo?.email ?? null,
        last_sign_in_at: authInfo?.last_sign_in_at ?? null,
      };
    });
  }

  // Summarize usage by action
  const usageByAction: Record<string, number> = {};
  let totalPages = 0;
  for (const record of usageRes.data ?? []) {
    const action = record.action as string;
    usageByAction[action] = (usageByAction[action] || 0) + (record.pages_consumed || 0);
    totalPages += record.pages_consumed || 0;
  }

  // Fetch all available plans from DB
  const { data: allPlans } = await admin
    .from("subscription_plans")
    .select("id, name, monthly_price_cents, pages_included")
    .order("monthly_price_cents", { ascending: true });

  return NextResponse.json({
    tenant,
    members: enrichedMembers,
    plans: allPlans ?? [],
    usage_summary: {
      total_pages: totalPages,
      by_action: usageByAction,
    },
    recent_scans: scansRes.data ?? [],
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  const user = await requireSuperAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { tenantId } = await params;
  const body = await request.json();

  // Only allow updating specific fields
  const allowedFields = ["status", "plan_id", "trial_ends_at"];
  const updates: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (field in body) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  // Validate status enum if provided
  if (updates.status) {
    const validStatuses = ["active", "suspended", "cancelled", "trial"];
    if (!validStatuses.includes(updates.status as string)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }
  }

  updates.updated_at = new Date().toISOString();

  const admin = createAdminClient();
  const { data: updated, error } = await admin
    .from("tenants")
    .update(updates)
    .eq("id", tenantId)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!updated) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  return NextResponse.json({ tenant: updated });
}
