import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// PUT — update member role
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const { memberId } = await params;

  // Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Get current user's membership
  const { data: currentMembership } = await admin
    .from("tenant_members")
    .select("tenant_id, role")
    .eq("user_id", user.id)
    .single();

  if (!currentMembership) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only owner can change roles
  if (currentMembership.role !== "owner") {
    return NextResponse.json(
      { error: "Only owners can change roles" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { role } = body;

  const validRoles = ["admin", "member", "viewer"];
  if (!validRoles.includes(role)) {
    return NextResponse.json(
      { error: "Invalid role. Must be admin, member, or viewer" },
      { status: 400 }
    );
  }

  // Get the target member
  const { data: targetMember } = await admin
    .from("tenant_members")
    .select("id, role, user_id")
    .eq("id", memberId)
    .eq("tenant_id", currentMembership.tenant_id)
    .single();

  if (!targetMember) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  // Can't demote the last owner
  if (targetMember.role === "owner") {
    const { count } = await admin
      .from("tenant_members")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", currentMembership.tenant_id)
      .eq("role", "owner");

    if ((count ?? 0) <= 1) {
      return NextResponse.json(
        { error: "Cannot demote the last owner" },
        { status: 400 }
      );
    }
  }

  const { error } = await admin
    .from("tenant_members")
    .update({ role })
    .eq("id", memberId)
    .eq("tenant_id", currentMembership.tenant_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
