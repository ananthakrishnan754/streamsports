import { NextResponse } from "next/server";
import { paypalConfigured, paypalCreateOrder } from "@/lib/paypal";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!paypalConfigured()) {
    return NextResponse.json(
      { error: "PayPal is not configured. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET." },
      { status: 400 }
    );
  }
  const body = await request.json().catch(() => ({}));
  const orderId = (body.orderId || `SS-PP-${Date.now()}`) as string;
  const totalUsd = Number(body.totalUsd);

  if (!Number.isFinite(totalUsd) || totalUsd <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  try {
    const paypalOrderId = await paypalCreateOrder({ orderId, totalUsd });
    return NextResponse.json({ paypalOrderId });
  } catch (err) {
    console.error("paypal create order error", err);
    return NextResponse.json({ error: "PayPal could not create the order" }, { status: 502 });
  }
}
