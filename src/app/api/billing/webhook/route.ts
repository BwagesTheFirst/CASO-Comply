import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  try {
    switch (event.type) {
      // ------------------------------------------------------------------
      // Checkout completed — activate subscription
      // ------------------------------------------------------------------
      case "checkout.session.completed": {
        const session = event.data.object;
        const tenantId = session.metadata?.tenant_id;

        if (!tenantId) {
          console.warn("checkout.session.completed: no tenant_id in metadata");
          break;
        }

        // Resolve plan_id from the subscription's price
        let planId: string | null = null;
        if (session.subscription) {
          const subscription = await getStripe().subscriptions.retrieve(
            session.subscription as string
          );
          const priceId = subscription.items.data[0]?.price?.id;

          if (priceId) {
            const { data: plan } = await admin
              .from("subscription_plans")
              .select("id")
              .eq("stripe_price_id", priceId)
              .single();

            planId = plan?.id ?? null;
          }
        }

        await admin
          .from("tenants")
          .update({
            stripe_subscription_id: session.subscription as string,
            ...(planId ? { plan_id: planId } : {}),
            status: "active",
          })
          .eq("id", tenantId);

        break;
      }

      // ------------------------------------------------------------------
      // Invoice paid — ensure active
      // ------------------------------------------------------------------
      case "invoice.paid": {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;

        if (customerId) {
          await admin
            .from("tenants")
            .update({ status: "active" })
            .eq("stripe_customer_id", customerId);
        }
        break;
      }

      // ------------------------------------------------------------------
      // Payment failed — suspend
      // ------------------------------------------------------------------
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;

        if (customerId) {
          await admin
            .from("tenants")
            .update({ status: "suspended" })
            .eq("stripe_customer_id", customerId);
        }
        break;
      }

      // ------------------------------------------------------------------
      // Subscription deleted — cancel
      // ------------------------------------------------------------------
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        if (customerId) {
          await admin
            .from("tenants")
            .update({ status: "cancelled" })
            .eq("stripe_customer_id", customerId);
        }
        break;
      }

      default:
        // Unhandled event type — acknowledge silently
        break;
    }
  } catch (err) {
    console.error(`Error handling ${event.type}:`, err);
    // Still return 200 to prevent Stripe retries for processing errors
  }

  return NextResponse.json({ received: true });
}
