import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/store";

const steps = ["awaiting_payment", "confirmed", "shipped"];

function stepIndex(status: string): number {
  if (status === "cancelled") return -1;
  const i = steps.indexOf(status);
  return i === -1 ? 0 : i;
}

export default async function OrderPage({
  params,
  searchParams,
}: PageProps<"/order/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const order = getOrder(id);
  if (!order) notFound();

  const paid = sp.paid === "1";
  const idx = stepIndex(order.status);
  const fmt = (n: number) =>
    order.currency === "INR" ? `₹${n.toLocaleString("en-IN")}` : `$${n.toFixed(2)}`;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black uppercase tracking-tight">Order {order.id}</h1>
      <p className="mt-1 text-sm text-muted">
        Placed {new Date(order.createdAt).toLocaleString()}
      </p>

      {paid ? (
        <div className="mt-6 border border-asos-green bg-asos-green/10 px-5 py-4">
          <p className="font-bold text-asos-green">
            ✓ Payment confirmed — thank you!
          </p>
          <p className="mt-0.5 text-sm text-ink">
            We&apos;ve received your {order.paymentMethod === "paypal" ? "PayPal" : "UPI"} payment of{" "}
            {fmt(order.total)}. We&apos;ll pack and ship your order within 24 hours.
          </p>
        </div>
      ) : null}

      {/* Status tracker */}
      <div className="mt-8 border border-line bg-tile/50 p-6">
        <h2 className="text-sm font-black uppercase tracking-widest">Status</h2>
        <div className="mt-4 flex items-center">
          {idx >= 0 ? (
            steps.map((s, i) => (
              <div key={s} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      i <= idx ? "bg-black text-white" : "bg-white text-muted border border-line"
                    }`}
                  >
                    {i < idx ? "✓" : i + 1}
                  </span>
                  <span className="mt-1.5 text-[10px] font-bold uppercase">
                    {s === "awaiting_payment" ? "Ordered" : s}
                  </span>
                </div>
                {i < steps.length - 1 ? (
                  <div className={`mx-2 h-0.5 flex-1 ${i < idx ? "bg-black" : "bg-line"}`} />
                ) : null}
              </div>
            ))
          ) : (
            <p className="text-sm font-bold text-sale">This order was cancelled.</p>
          )}
        </div>
        <p className="mt-4 text-xs text-muted">
          Awaiting payment? Use the button below to pay or re-check your payment.
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {/* Items */}
        <div>
          <h2 className="border-b border-line pb-2 text-sm font-black uppercase tracking-widest">
            Items ({order.items.reduce((a, i) => a + i.qty, 0)})
          </h2>
          <ul className="mt-4 space-y-3">
            {order.items.map((i) => (
              <li key={`${i.id}-${i.size}`} className="flex justify-between gap-3">
                <div>
                  <Link href={`/product/${i.slug}`} className="text-sm text-muted hover:underline">
                    {i.name}
                  </Link>
                  <p className="text-xs text-muted">Size {i.size} · Qty {i.qty}</p>
                </div>
                <span className="text-sm font-bold">
                  {fmt((order.currency === "INR" ? i.priceInr : i.priceUsd) * i.qty)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-bold">{fmt(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd className="font-bold">{order.shipping === 0 ? "Free" : fmt(order.shipping)}</dd></div>
            <div className="flex justify-between text-base"><dt className="font-black uppercase">Total</dt><dd className="font-black">{fmt(order.total)}</dd></div>
          </dl>
        </div>

        {/* Delivery + pay */}
        <div>
          <h2 className="border-b border-line pb-2 text-sm font-black uppercase tracking-widest">
            Delivery to
          </h2>
          <p className="mt-4 text-sm leading-relaxed">
            <span className="font-bold">{order.customer.name}</span>
            <br />
            {order.customer.address}
            <br />
            {order.customer.city}
            {order.customer.state ? `, ${order.customer.state}` : ""}{" "}
            {order.customer.pincode}
            <br />
            {order.customer.country}
            <br />
            <span className="text-muted">{order.customer.phone}</span>
          </p>

          {order.status === "awaiting_payment" && order.currency === "INR" ? (
            <div className="mt-6 border-t border-line pt-5">
              <h3 className="text-sm font-black uppercase tracking-widest">Not paid yet?</h3>
              <Link
                href={`/checkout?resume=${order.id}`}
                className="btn-primary mt-4 block rounded-sm px-6 py-3.5 text-center text-xs uppercase"
              >
                Continue to UPI payment
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
