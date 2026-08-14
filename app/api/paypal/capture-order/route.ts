import { NextResponse } from "next/server";
import { paypalConfigured, paypalCaptureOrder } from "@/lib/paypal";
import { updateOrder } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!paypalConfigured()) {
    return NextResponse.json({ error: "PayPal is not configured" }, { status: 400 });
  }
  const body = await request.json().catch(() => ({}));
  const paypalOrderId = body.paypalOrderId as string;
  const internalOrderId = body.internalOrderId as string;

  if (!paypalOrderId) {
    return NextResponse.json({ error: "Missing paypalOrderId" }, { status: 400 });
  }

  try {
    const result = await paypalCaptureOrder(paypalOrderId);
    const order = internalOrderId
      ? updateOrder(internalOrderId, {
          status: "confirmed",
          paymentMethod: "paypal",
          paypalOrderId,
        })
      : undefined;
    return NextResponse.json({ success: true, order, capture: result });
  } catch (err) {
    console.error("paypal capture error", err);
    return NextResponse.json({ error: "PayPal capture failed" }, { status: 502 });
  }
}
