// Server-only PayPal REST helpers. Requires PAYPAL_CLIENT_ID + PAYPAL_CLIENT_SECRET.

const base = process.env.PAYPAL_ENV === "production"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

export function paypalConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID &&
      process.env.PAYPAL_CLIENT_SECRET
  );
}

interface PaypalCreateOrderResponse {
  id: string;
}
interface PaypalCaptureResponse {
  purchase_units?: { reference_id?: string }[];
}

async function paypalFetch<T>(path: string, body?: unknown): Promise<T> {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${base}${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal API ${res.status}: ${text}`);
  }
  return res.json();
}

export async function paypalCreateOrder(opts: {
  orderId: string;
  totalUsd: number;
}): Promise<string> {
  const order = await paypalFetch<PaypalCreateOrderResponse>("/v2/checkout/orders", {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: opts.orderId,
        amount: {
          currency_code: "USD",
          value: opts.totalUsd.toFixed(2),
        },
        description: `StreamSports order ${opts.orderId}`,
      },
    ],
  });
  return order.id;
}

export async function paypalCaptureOrder(paypalOrderId: string): Promise<{ reference_id?: string }> {
  const capture = await paypalFetch<PaypalCaptureResponse>(
    `/v2/checkout/orders/${paypalOrderId}/capture`,
    {}
  );
  const unit = capture?.purchase_units?.[0];
  return { reference_id: unit?.reference_id };
}
