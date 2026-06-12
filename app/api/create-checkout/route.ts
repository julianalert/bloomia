// Called when user clicks "Complete my order" on /order.
// By this point the full intake is already in Supabase.

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    const { data: order, error } = await supabase
      .from("orders")
      .select("email, name")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Personalized Menopause Management Protocol",
              description:
                "Your 20+ page personalized protocol — delivered to your inbox within 24 hours.",
            },
            unit_amount: 100, // $1.00 — test only, revert to 2700 before launch
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: order.email ?? undefined,
      metadata: { order_id: orderId },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order?id=${orderId}`,
    });

    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id, status: "pending" })
      .eq("id", orderId);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("create-checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
