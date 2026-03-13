import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "../../../middleware";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireSuperAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  if (!body.content?.trim()) {
    return NextResponse.json({ error: "Note content is required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Verify lead exists
  const { data: lead } = await admin
    .from("leads")
    .select("id")
    .eq("id", id)
    .single();

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  // Insert note
  const { data: note, error } = await admin
    .from("lead_notes")
    .insert({
      lead_id: id,
      author_id: user.id,
      content: body.content.trim(),
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log activity
  await admin.from("lead_activity").insert({
    lead_id: id,
    action: "note_added",
    details: { note_id: note.id },
    actor_id: user.id,
  });

  return NextResponse.json({ note });
}
