import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: superAdmin } = await admin
    .from("super_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();
  if (!superAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { data, error } = await admin
    .from("review_queue")
    .update({ status: "in_review" })
    .eq("id", id)
    .eq("status", "pending")
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Review not found or not in pending status" },
      { status: 404 }
    );
  }

  // Sync review_status on linked document
  if (data.document_id) {
    await admin
      .from("documents")
      .update({ review_status: "in_review" })
      .eq("id", data.document_id);
  }

  return NextResponse.json({ status: "in_review" });
}
