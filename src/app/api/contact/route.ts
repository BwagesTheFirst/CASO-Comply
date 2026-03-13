import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendLeadNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, organization, helpWith, message } = body;

    // Validate required fields
    if (!name || !email || !organization || !helpWith || !message) {
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
        name,
        email,
        phone: phone || null,
        organization,
        source: "contact",
        status: "new",
        metadata: { helpWith, message },
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("[contact] Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save submission" },
        { status: 500 }
      );
    }

    // Log activity
    await admin.from("lead_activity").insert({
      lead_id: lead.id,
      action: "created",
      details: { source: "contact", helpWith },
    });

    // Send email notification (non-blocking)
    sendLeadNotification({
      source: "contact",
      name,
      email,
      phone,
      organization,
      helpWith,
      message,
    }).catch((err) => console.error("[contact] Email notification failed:", err));

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
