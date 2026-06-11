import { NextResponse } from "next/server";
import { renderProtocolPage } from "@/lib/renderProtocol";
import { sampleIntake, sampleProtocol } from "@/lib/sampleProtocol";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Dev-only preview of the hosted protocol page using sample data.
// Lets you view /preview/protocol without Stripe, Claude, or Supabase.
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const html = renderProtocolPage(sampleIntake, sampleProtocol);
  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
