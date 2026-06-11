import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { renderProtocolPage } from "@/lib/renderProtocol";
import { IntakeData } from "@/types/intake";
import { ProtocolData } from "@/types/protocol";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function notice(title: string, body: string, status: number): Response {
  return htmlResponse(
    `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} — Bloomia</title>
    <style>
      body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
        background:#F2EBE1; color:#2C2228; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
      .box { max-width:460px; text-align:center; padding:40px 32px; }
      h1 { font-size:24px; font-weight:600; margin:0 0 12px; color:#1C1418; }
      p { font-size:15px; line-height:1.6; color:#4A3E44; margin:0; }
    </style></head>
    <body><div class="box"><h1>${title}</h1><p>${body}</p></div></body></html>`,
    status
  );
}

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const token = params.token;

  if (!token) {
    return notice("Not found", "This protocol link is invalid.", 404);
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("intake_data, protocol_data, status")
    .eq("access_token", token)
    .single();

  if (error || !order) {
    return notice(
      "Protocol not found",
      "We couldn't find a protocol for this link. Please check the link in your email, or contact support.",
      404
    );
  }

  if (!order.protocol_data) {
    return notice(
      "Your protocol is on its way",
      "Your protocol is still being generated. Please check back shortly — you'll also receive an email once it's ready.",
      200
    );
  }

  try {
    const html = renderProtocolPage(
      order.intake_data as IntakeData,
      order.protocol_data as ProtocolData
    );
    return htmlResponse(html);
  } catch (err) {
    console.error("protocol render error:", err);
    return notice(
      "Something went wrong",
      "We had trouble displaying your protocol. Please contact support and we'll sort it out right away.",
      500
    );
  }
}
