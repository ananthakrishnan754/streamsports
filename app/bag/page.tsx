"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";

export default function BagPage() {
  const { items, count, updateQty, removeItem } = useCart();
  const { currency } = useCurrency();

  const subtotal = items.reduce(
    (acc, i) => acc + (currency === "INR" ? i.priceInr : i.priceUsd) * i.qty,
    0
  );
  const freeShipThreshold = currency === "INR" ? 499 : 20;
  const remaining = Math.max(0, freeShipThreshold - subtotal);
  const progress = Math.min(100, (subtotal / freeShipThreshold) * 100);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-black uppercase tracking-tight">Your bag</h1>
        <p className="mt-3 text-sm text-muted">Your bag is empty. Let&apos;s fix that.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/women" className="btn-primary rounded-sm px-8 py-3.5 text-xs uppercase">Shop Women&apos;s</Link>
          <Link href="/men" className="btn-outline rounded-sm px-8 py-3.5 text-xs uppercase">Shop Men&apos;s</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black uppercase tracking-tight">
        Your bag · <span className="text-muted">{count} {count === 1 ? "item" : "items"}</span>
      </h1>

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          {/* Delivery progress */}
          <div className="mb-6 border border-line bg-tile px-4 py-3">
            <p className="text-xs font-bold uppercase">
              {remaining > 0 ? (
                <>
                  Add {currency === "INR" ? `₹${remaining.toLocaleString("en-IN")}` : `$${remaining.toFixed(2)}`} for
                  free delivery
                </>
              ) : (
                "You've unlocked free delivery!"
              )}
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-tile-deep">
              <div
                className="h-full rounded-full bg-asos-green transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {items.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex gap-4 border-b border-line py-5"
            >
              <Link href={`/product/${item.slug}`} className="shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="aspect-[3/4] w-24 bg-tile object-cover sm:w-28"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link
                  href={`/product/${item.slug}`}
                  className="text-sm text-muted hover:text-ink hover:underline"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-xs uppercase text-muted">
                  {item.brand} · Size {item.size}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.id, item.size, item.qty - 1)}
                    className="h-8 w-8 rounded-sm border border-line font-bold hover:border-black"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.size, item.qty + 1)}
                    className="h-8 w-8 rounded-sm border border-line font-bold hover:border-black"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id, item.size)}
                  className="mt-3 self-start text-xs uppercase text-muted hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="text-right text-sm font-bold">
                {currency === "INR"
                  ? `₹${(item.priceInr * item.qty).toLocaleString("en-IN")}`
                  : `$${(item.priceUsd * item.qty).toFixed(2)}`}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="h-fit border border-line bg-tile/50 p-6 lg:sticky lg:top-24">
          <h2 className="text-sm font-black uppercase tracking-widest">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-bold">
                {currency === "INR" ? `₹${subtotal.toLocaleString("en-IN")}` : `$${subtotal.toFixed(2)}`}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="font-bold">{remaining === 0 ? "Free" : "Calculated at checkout"}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <dt className="font-black uppercase">Total</dt>
              <dd className="font-black">
                {currency === "INR" ? `₹${subtotal.toLocaleString("en-IN")}` : `$${subtotal.toFixed(2)}`}
              </dd>
            </div>
          </dl>
          <Link
            href="/checkout"
            className="btn-primary mt-6 block rounded-sm px-6 py-4 text-center text-xs uppercase"
          >
            Checkout securely
          </Link>
          <p className="mt-3 text-center text-[11px] text-muted">
            UPI · Cards · PayPal — 100% secure
          </p>
        </aside>
      </div>
    </div>
  );
}
