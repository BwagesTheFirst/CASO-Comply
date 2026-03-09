import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  try {
    // Get the authenticated user from the session
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { companyName } = body;

    if (!companyName || typeof companyName !== "string") {
      return NextResponse.json(
        { error: "companyName is required" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const slug = slugify(companyName);
    const trialEndsAt = new Date(
      Date.now() + 14 * 24 * 60 * 60 * 1000
    ).toISOString();

    // Create the tenant
    const { data: tenant, error: tenantError } = await admin
      .from("tenants")
      .insert({
        name: companyName,
        slug,
        status: "trial",
        trial_ends_at: trialEndsAt,
      })
      .select("id")
      .single();

    if (tenantError) {
      console.error("Tenant creation failed:", tenantError);
      return NextResponse.json(
        { error: "Failed to create tenant" },
        { status: 500 }
      );
    }

    // Look up the Starter plan
    const { data: plan } = await admin
      .from("subscription_plans")
      .select("id")
      .eq("name", "Starter")
      .single();

    // Assign the plan if found
    if (plan) {
      await admin.from("tenant_subscriptions").insert({
        tenant_id: tenant.id,
        plan_id: plan.id,
        status: "trialing",
        current_period_start: new Date().toISOString(),
        current_period_end: trialEndsAt,
      });
    }

    // Create tenant_member record (owner)
    const { error: memberError } = await admin
      .from("tenant_members")
      .insert({
        tenant_id: tenant.id,
        user_id: user.id,
        role: "owner",
      });

    if (memberError) {
      console.error("Tenant member creation failed:", memberError);
    }

    // Generate API key
    const rawKey = `caso_ak_${crypto.randomBytes(20).toString("hex")}`;
    const keyHash = crypto
      .createHash("sha256")
      .update(rawKey)
      .digest("hex");
    const keyPrefix = rawKey.slice(0, 16);

    const { error: keyError } = await admin.from("api_keys").insert({
      tenant_id: tenant.id,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      name: "Default",
      is_active: true,
    });

    if (keyError) {
      console.error("API key creation failed:", keyError);
    }

    return NextResponse.json({
      tenantId: tenant.id,
      apiKey: rawKey,
    });
  } catch (err) {
    console.error("Tenant provisioning error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
