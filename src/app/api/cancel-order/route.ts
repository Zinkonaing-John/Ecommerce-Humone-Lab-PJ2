import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  const { orderId } = await req.json();
  if (!orderId) {
    return new Response(JSON.stringify({ error: "Order ID required" }), {
      status: 400,
    });
  }
  // Update order status
  const { error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
  // Log event for admin notification
  await supabase.from("order_events").insert({
    order_id: orderId,
    event_type: "cancelled",
    event_message: `Order #${orderId} was cancelled by user.`,
  });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
