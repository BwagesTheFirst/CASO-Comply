import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { email, scanId } = await req.json();

    // Validate inputs
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }

    if (!scanId || typeof scanId !== "string") {
      return NextResponse.json(
        { error: "A valid scanId is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
      const supabase = createAdminClient();

      // Insert the lead
      await supabase
        .from("scan_leads")
        .insert({ scan_id: scanId, email: normalizedEmail });

      // Mark scan for report generation
      await supabase
        .from("scans")
        .update({
          report_status: "pending",
          report_email: normalizedEmail,
        })
        .eq("id", scanId);
    } catch (dbError) {
      console.error("Supabase unavailable:", dbError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("scan/email route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
