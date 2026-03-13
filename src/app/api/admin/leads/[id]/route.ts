import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "../../middleware";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireSuperAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const admin = createAdminClient();

  // Get lead
  const { data: lead, error } = await admin
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  // Get activity
  const { data: activity } = await admin
    .from("lead_activity")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  // Get notes
  const { data: notes } = await admin
    .from("lead_notes")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    lead,
    activity: activity || [],
    notes: notes || [],
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireSuperAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const admin = createAdminClient();

  // Get current lead for activity logging
  const { data: current } = await admin
    .from("leads")
    .select("status")
    .eq("id", id)
    .single();

  if (!current) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  // Build update object (only allowed fields)
  const updates: Record<string, unknown> = {};
  if (body.status) updates.status = body.status;
  if (body.assigned_to !== undefined) updates.assigned_to = body.assigned_to;
  if (body.contacted_at !== undefined) updates.contacted_at = body.contacted_at;

  const { data: lead, error } = await admin
    .from("leads")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log status change
  if (body.status && body.status !== current.status) {
    await admin.from("lead_activity").insert({
      lead_id: id,
      action: "status_changed",
      details: { from: current.status, to: body.status },
      actor_id: user.id,
    });
  }

  // Log assignment
  if (body.assigned_to !== undefined) {
    await admin.from("lead_activity").insert({
      lead_id: id,
      action: "assigned",
      details: { assigned_to: body.assigned_to },
      actor_id: user.id,
    });
  }

  return NextResponse.json({ lead });
}
