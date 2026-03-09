import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse body
    const { planId } = await req.json();
    if (!planId) {
      return NextResponse.json(
        { error: "Missing planId" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // 3. Look up the plan to get stripe_price_id
    const { data: plan, error: planError } = await admin
      .from("subscription_plans")
      .select("id, name, stripe_price_id")
      .eq("id", planId)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    if (!plan.stripe_price_id) {
      return NextResponse.json(
        { error: "Plan has no Stripe price configured" },
        { status: 400 }
      );
    }

    // 4. Get tenant for this user
    const { data: membership } = await admin
      .from("tenant_members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .single();

    if (!membership) {
      return NextResponse.json(
        { error: "No tenant found for user" },
        { status: 404 }
      );
    }

    const { data: tenant } = await admin
      .from("tenants")
      .select("id, stripe_customer_id, billing_email, name")
      .eq("id", membership.tenant_id)
      .single();

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    // 5. Create or reuse Stripe customer
    let stripeCustomerId = tenant.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await getStripe().customers.create({
        email: tenant.billing_email || user.email,
        name: tenant.name,
        metadata: { tenant_id: tenant.id },
      });
      stripeCustomerId = customer.id;

      // Save to tenant
      await admin
        .from("tenants")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", tenant.id);
    }

    // 6. Create Checkout Session
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
      success_url: `${origin}/dashboard/billing?success=true`,
      cancel_url: `${origin}/dashboard/billing?cancelled=true`,
      metadata: { tenant_id: tenant.id },
      subscription_data: {
        metadata: { tenant_id: tenant.id },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Create checkout error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
