import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { generateProtocol } from "@/lib/generateProtocol";
import { deliverProtocol } from "@/lib/deliverProtocol";
import { IntakeData } from "@/types/intake";
import Stripe from "stripe";

export const runtime = "nodejs";

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

    try {
      // 1. Fetch the full intake data — already complete from progressive saves
      const { data: order, error } = await supabase
        .from("orders")
        .select("intake_data, email, name")
        .eq("id", orderId)
        .single();

      if (error || !order) throw new Error("Order not found");

      // 2. Mark as paid
      await supabase
        .from("orders")
        .update({ status: "paid", stripe_session_id: session.id })
        .eq("id", orderId);

      // 3. Generate protocol via Claude
      const protocol = await generateProtocol(order.intake_data as IntakeData);

      // 4. Create a secret token for the hosted protocol page and persist it
      //    along with the generated protocol. The page renders live from this.
      const accessToken = randomBytes(24).toString("base64url");

      await supabase
        .from("orders")
        .update({ status: "delivered", protocol_data: protocol, access_token: accessToken })
        .eq("id", orderId);

      // 5. Email a short note with a link to the user's protocol page
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

  return NextResponse.json({ received: true });
}
