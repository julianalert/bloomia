import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { waitUntil } from "@vercel/functions";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { generateProtocol } from "@/lib/generateProtocol";
import { deliverProtocol } from "@/lib/deliverProtocol";
import { IntakeData } from "@/types/intake";
import Stripe from "stripe";

export const runtime = "nodejs";

async function processOrder(orderId: string, stripeSessionId: string) {
  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select("intake_data, email, name")
      .eq("id", orderId)
      .single();

    if (error || !order) throw new Error("Order not found");

    await supabase
      .from("orders")
      .update({ status: "paid", stripe_session_id: stripeSessionId })
      .eq("id", orderId);

    const protocol = await generateProtocol(order.intake_data as IntakeData);

    const accessToken = randomBytes(24).toString("base64url");

    await supabase
      .from("orders")
      .update({ status: "delivered", protocol_data: protocol, access_token: accessToken })
      .eq("id", orderId);

    const protocolUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/protocol/${accessToken}`;
    await deliverProtocol(protocolUrl, order.email, order.name);

    console.log(`✓ Protocol delivered — order ${orderId} — ${protocolUrl}`);
  } catch (err) {
    console.error(`✗ Protocol generation failed — order ${orderId}:`, err);
    await supabase
      .from("orders")
      .update({ status: "failed", error_message: String(err) })
      .eq("id", orderId);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;

    if (!orderId) {
      console.error("No order_id in session metadata");
      return NextResponse.json({ received: true });
    }

    // Acknowledge Stripe immediately — generation runs in the background
    // with no timeout pressure regardless of how long Claude takes.
    waitUntil(processOrder(orderId, session.id));
  }

  return NextResponse.json({ received: true });
}
