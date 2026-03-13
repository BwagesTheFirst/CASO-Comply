import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Helper: authenticate user and get tenant membership
async function getAuthenticatedMembership() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: membership } = await admin
    .from("tenant_members")
    .select("id, tenant_id, role, user_id")
    .eq("user_id", user.id)
    .single();

  return membership;
}

// GET — list team members
export async function GET() {
  const membership = await getAuthenticatedMembership();
  if (!membership) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Get all members for this tenant
  const { data: members, error } = await admin
    .from("tenant_members")
    .select("id, user_id, role, created_at")
    .eq("tenant_id", membership.tenant_id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch emails from auth.users for each member
  const membersWithEmail = await Promise.all(
    (members || []).map(async (member) => {
      const {
        data: { user },
      } = await admin.auth.admin.getUserById(member.user_id);
      return {
        id: member.id,
        user_id: member.user_id,
        email: user?.email ?? "Unknown",
        role: member.role,
        created_at: member.created_at,
      };
    })
  );

  return NextResponse.json({
    members: membersWithEmail,
    currentRole: membership.role,
  });
}

// POST — invite / add team member
export async function POST(request: NextRequest) {
  const membership = await getAuthenticatedMembership();
  if (!membership) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only owner/admin can invite
  if (membership.role !== "owner" && membership.role !== "admin") {
    return NextResponse.json(
      { error: "Only owners and admins can add team members" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { email, role } = body;

  if (!email?.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const validRoles = ["admin", "member", "viewer"];
  if (!validRoles.includes(role)) {
    return NextResponse.json(
      { error: "Invalid role. Must be admin, member, or viewer" },
      { status: 400 }
    );
  }

  // Admins cannot add other admins — only owners can
  if (role === "admin" && membership.role !== "owner") {
    return NextResponse.json(
      { error: "Only owners can add admins" },
      { status: 403 }
    );
  }

  const admin = createAdminClient();

  // Find user by email
  const { data: userList, error: listError } =
    await admin.auth.admin.listUsers();

  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  const targetUser = userList.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase().trim()
  );

  if (!targetUser) {
    return NextResponse.json(
      { error: "User must sign up first. No account found for this email." },
      { status: 404 }
    );
  }

  // Check if already a member
  const { data: existing } = await admin
    .from("tenant_members")
    .select("id")
    .eq("tenant_id", membership.tenant_id)
    .eq("user_id", targetUser.id)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "This user is already a team member" },
      { status: 409 }
    );
  }

  // Add to tenant_members
  const { error: insertError } = await admin.from("tenant_members").insert({
    tenant_id: membership.tenant_id,
    user_id: targetUser.id,
    role,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE — remove team member
export async function DELETE(request: NextRequest) {
  const membership = await getAuthenticatedMembership();
  if (!membership) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get("member_id");

  if (!memberId) {
    return NextResponse.json(
      { error: "member_id is required" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Fetch the member to remove
  const { data: targetMember } = await admin
    .from("tenant_members")
    .select("id, user_id, role")
    .eq("id", memberId)
    .eq("tenant_id", membership.tenant_id)
    .single();

  if (!targetMember) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  // Can't remove yourself if you're the only owner
  if (targetMember.user_id === membership.user_id) {
    if (targetMember.role === "owner") {
      const { count } = await admin
        .from("tenant_members")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", membership.tenant_id)
        .eq("role", "owner");

      if ((count ?? 0) <= 1) {
        return NextResponse.json(
          { error: "Cannot remove the only owner" },
          { status: 400 }
        );
      }
    }
  }

  // Only owner can remove admins
  if (targetMember.role === "admin" && membership.role !== "owner") {
    return NextResponse.json(
      { error: "Only owners can remove admins" },
      { status: 403 }
    );
  }

  // Only owner/admin can remove members
  if (membership.role !== "owner" && membership.role !== "admin") {
    return NextResponse.json(
      { error: "Only owners and admins can remove members" },
      { status: 403 }
    );
  }

  const { error } = await admin
    .from("tenant_members")
    .delete()
    .eq("id", memberId)
    .eq("tenant_id", membership.tenant_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
