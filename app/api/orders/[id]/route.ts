import { NextResponse } from "next/server";
import { getOrder, updateOrder, type Order } from "@/lib/store";
import { paypalConfigured, paypalCaptureOrder } from "@/lib/paypal";

export const runtime = "nodejs";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ order });
}

// Manual verification: customer paid via UPI QR/deep link and confirms.
export async function POST(request: Request, { params }: Ctx) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const updated = updateOrder(id, {
    status: "confirmed",
    payerName: body.payerName || order.payerName,
    upiTxnRef: body.upiTxnRef || order.upiTxnRef,
  });

  return NextResponse.json({ order: updated });
}

// Admin status update.
export async function PATCH(request: Request, { params }: Ctx) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  const body = await request.json().catch(() => ({}));
  const status = body.status as Order["status"];
  if (!status) {
    return NextResponse.json({ error: "Missing status" }, { status: 400 });
  }
  const updated = updateOrder(id, { status });
  return NextResponse.json({ order: updated });
}

// PayPal capture (server-side, keeps client secret safe).
export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (!paypalConfigured()) {
    return NextResponse.json(
      { error: "PayPal is not configured" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const paypalOrderId = body.paypalOrderId as string;
  if (!paypalOrderId) {
    return NextResponse.json({ error: "Missing paypalOrderId" }, { status: 400 });
  }

  const result = await paypalCaptureOrder(paypalOrderId);
  const updated = updateOrder(id, {
    status: "confirmed",
    paymentMethod: "paypal",
    paypalOrderId,
  });
  return NextResponse.json({ order: updated, capture: result });
}
