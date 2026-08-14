import { NextResponse } from "next/server";
import { getOrder } from "@/lib/store";
import { generateUPIQRSvg } from "upipay/qr";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.currency !== "INR") {
    return NextResponse.json({ error: "QR only available for INR orders" }, { status: 400 });
  }

  const svg = await generateUPIQRSvg({
    vpa: process.env.NEXT_PUBLIC_UPI_VPA || "streamsports@okhdfcbank",
    name: process.env.NEXT_PUBLIC_UPI_NAME || "StreamSports",
    amount: order.total,
    orderId: order.id,
  });

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-store",
    },
  });
}
