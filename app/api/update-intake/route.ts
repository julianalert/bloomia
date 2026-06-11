// Called on every step "Continue" after Step 1.
// Merges the new step's data into the existing order record.

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(req: NextRequest) {
  try {
    const { orderId, stepData, currentStep } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const { error } = await supabase.rpc("merge_intake_data", {
      p_order_id: orderId,
      p_partial: stepData,
      p_step: currentStep,
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("update-intake error:", err);
    return NextResponse.json({ error: "Failed to update intake" }, { status: 500 });
  }
}
