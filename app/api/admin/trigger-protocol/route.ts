// TEMPORARY dev route — delete before launch.
// Manually triggers protocol generation for a given order ID,
// or the most recent paid order if no ID is provided.
//
// Usage:
//   curl -X POST http://localhost:3000/api/admin/trigger-protocol \
//     -H "Content-Type: application/json" \
//     -d '{"orderId":"<uuid>"}'
//
//   curl -X POST http://localhost:3000/api/admin/trigger-protocol \
//     -H "Content-Type: application/json" \
//     -d '{}'

import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { supabase } from "@/lib/supabase";
import { generateProtocol } from "@/lib/generateProtocol";
import { deliverProtocol } from "@/lib/deliverProtocol";
import { IntakeData } from "@/types/intake";

export const runtime = "nodejs";
export const maxDuration = 120; // Claude can take a while

export async function POST(req: NextRequest) {
  // Refuse in production unless you explicitly pass the admin secret
  const secret = req.headers.get("x-admin-secret");
  if (
    process.env.NODE_ENV === "production" &&
    secret !== process.env.CRON_SECRET
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  let orderId: string | null = body.orderId ?? null;

  // If no orderId given, grab the most recent order that has an email
  if (!orderId) {
    const { data, error } = await supabase
      .from("orders")
      .select("id")
      .not("email", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "No eligible order found" }, { status: 404 });
    }
    orderId = data.id;
  }

  // Fetch the full order
  const { data: order, error } = await supabase
    .from("orders")
    .select("intake_data, email, name, status")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  console.log(`▶ Triggering protocol for order ${orderId} (${order.email})`);

  try {
    // Mark as paid so the rest of the system treats it correctly
    await supabase
      .from("orders")
      .update({ status: "paid" })
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
    return NextResponse.json({ ok: true, orderId, protocolUrl });
  } catch (err) {
    console.error(`✗ Protocol generation failed — order ${orderId}:`, err);
    await supabase
      .from("orders")
      .update({ status: "failed", error_message: String(err) })
      .eq("id", orderId);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
