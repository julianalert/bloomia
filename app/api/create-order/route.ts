// Called on Step 1 "Continue" — creates the order record immediately
// with just the first step's data. Returns orderId stored in sessionStorage.

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { stepData } = await req.json();

    const { data, error } = await supabase
      .from("orders")
      .insert({
        intake_data: stepData,
        status: "incomplete",
        current_step: 1,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ orderId: data.id });
  } catch (err) {
    console.error("create-order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
