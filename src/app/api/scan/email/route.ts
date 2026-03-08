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

      // Verify the scan exists
      const { data: scan, error: scanError } = await supabase
        .from("scans")
        .select("id")
        .eq("id", scanId)
        .single();

      if (scanError || !scan) {
        console.error("Scan lookup failed:", scanError?.message);
        // Still return success — don't leak internal state
        return NextResponse.json({ success: true });
      }

      // Insert the lead
      const { error: insertError } = await supabase
        .from("scan_leads")
        .insert({ scan_id: scanId, email: normalizedEmail });

      if (insertError) {
        console.error("scan_leads insert error:", insertError.message);
      }
    } catch (dbError) {
      // Supabase may not be configured — gracefully degrade
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
