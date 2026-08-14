import { NextResponse } from "next/server";
import { createOrder, type Order, type OrderItem } from "@/lib/store";
import { getProductBySlug } from "@/lib/products";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, currency, items, subtotal, shipping, total } = body as {
      customer: Order["customer"];
      currency: "INR" | "USD";
      items: { slug: string; size: string; qty: number; priceInr: number; priceUsd: number }[];
      subtotal: number;
      shipping: number;
      total: number;
    };

    if (!customer?.name || !customer?.phone || !customer?.address) {
      return NextResponse.json(
        { error: "Missing required customer details" },
        { status: 400 }
      );
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Bag is empty" }, { status: 400 });
    }

    const orderItems: OrderItem[] = items.map((item) => {
      const product = getProductBySlug(item.slug);
      return {
        id: product?.id ?? item.slug,
        slug: item.slug,
        name: product?.name ?? item.slug,
        size: item.size,
        qty: item.qty,
        priceInr: item.priceInr,
        priceUsd: item.priceUsd,
      };
    });

    const order = createOrder({
      customer,
      currency,
      items: orderItems,
      subtotal,
      shipping,
      total,
      paymentMethod: "upi",
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("create order error", err);
    return NextResponse.json(
      { error: "Could not create order" },
      { status: 500 }
    );
  }
}
