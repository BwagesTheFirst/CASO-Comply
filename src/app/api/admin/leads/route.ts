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
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
  const offset = (page - 1) * limit;
  const status = searchParams.get("status"); // new, contacted, qualified, etc.
  const source = searchParams.get("source"); // contact, free_scan, scan_email
  const search = searchParams.get("search");

  const admin = createAdminClient();

  // Build query
  let query = admin
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq("status", status);
  }
  if (source) {
    query = query.eq("source", source);
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,organization.ilike.%${search}%`);
  }

  const { data: leads, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get stats
  const { data: stats } = await admin.rpc("get_lead_stats").single();

  return NextResponse.json({
    leads: leads || [],
    total: count || 0,
    page,
    limit,
    stats: stats || null,
  });
}
