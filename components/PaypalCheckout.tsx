"use client";

import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";

export function PaypalCheckout({
  totalUsd,
  orderId,
  onSuccess,
  onError,
}: {
  totalUsd: number;
  orderId: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="rounded-sm border border-dashed border-line bg-tile px-4 py-6 text-center text-sm text-muted">
        <p className="font-bold text-ink">PayPal isn&apos;t configured yet</p>
        <p className="mt-1 text-xs">
          Add <code className="bg-white px-1">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> to
          enable express checkout with PayPal.
        </p>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical", shape: "rect", label: "paypal" }}
        createOrder={async () => {
          const res = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, totalUsd }),
          });
          if (!res.ok) throw new Error("Could not create PayPal order");
          const data = await res.json();
          return data.paypalOrderId as string;
        }}
        onApprove={async (data) => {
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paypalOrderId: data.orderID,
              internalOrderId: orderId,
            }),
          });
          if (!res.ok) throw new Error("PayPal capture failed");
          onSuccess();
        }}
        onError={(err) => onError(String(err))}
      />
    </PayPalScriptProvider>
  );
}
