import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendLeadNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orgName, websiteUrl, contactName, email, phone, documentCount, industry } = body;

    // Validate required fields
    if (!orgName || !websiteUrl || !contactName || !email || !documentCount || !industry) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Insert lead
    const { data: lead, error: insertError } = await admin
      .from("leads")
      .insert({
        name: contactName,
        email,
        phone: phone || null,
        organization: orgName,
        source: "free_scan",
        status: "new",
        metadata: { websiteUrl, documentCount, industry },
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("[free-scan] Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save submission" },
        { status: 500 }
      );
    }

    // Log activity
    await admin.from("lead_activity").insert({
      lead_id: lead.id,
      action: "created",
      details: { source: "free_scan", websiteUrl, industry, documentCount },
    });

    // Send email notification (non-blocking)
    sendLeadNotification({
      source: "free_scan",
      name: contactName,
      email,
      phone,
      organization: orgName,
      websiteUrl,
      documentCount,
      industry,
    }).catch((err) => console.error("[free-scan] Email notification failed:", err));

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
