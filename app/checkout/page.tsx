"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { PaypalCheckout } from "@/components/PaypalCheckout";
import { buildUpiUri, buildAppDeepLinks, upiApps, upiConfig } from "@/lib/upi";
import type { Order } from "@/lib/store";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

function CheckoutInner() {
  const { items, clear } = useCart();
  const { currency } = useCurrency();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState(emptyForm);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "paypal">(
    currency === "INR" ? "upi" : "paypal"
  );
  const [order, setOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);
  const [payerName, setPayerName] = useState("");

  const buyNow = useMemo(() => {
    const slug = searchParams.get("item");
    const size = searchParams.get("size");
    if (!slug) return null;
    return { slug, size: size || "S" };
  }, [searchParams]);

  // Resume a pending UPI order from the order page.
  const resumeId = searchParams.get("resume");
  useEffect(() => {
    if (!resumeId) return;
    (async () => {
      try {
        const res = await fetch(`/api/orders/${resumeId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.order && data.order.status === "awaiting_payment") {
          setOrder(data.order);
          setPaymentMethod("upi");
        }
      } catch {
        /* ignore */
      }
    })();
  }, [resumeId]);

  const total = useMemo(() => {
    const subtotal = items.reduce(
      (acc, i) =>
        acc + (currency === "INR" ? i.priceInr : i.priceUsd) * i.qty,
      0
    );
    const freeThreshold = currency === "INR" ? 499 : 20;
    const flatFee = currency === "INR" ? 99 : 5;
    const shipping = subtotal >= freeThreshold ? 0 : flatFee;
    return { subtotal, shipping, total: subtotal + shipping };
  }, [items, currency]);

  if (items.length === 0 && !buyNow && !order) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-black uppercase tracking-tight">Checkout</h1>
        <p className="mt-3 text-sm text-muted">Your bag is empty.</p>
        <Link href="/men" className="btn-primary mt-8 inline-block rounded-sm px-8 py-3.5 text-xs uppercase">
          Continue shopping
        </Link>
      </div>
    );
  }

  async function placeOrder() {
    setError("");
    if (!form.name || !form.phone || !form.address || !form.city) {
      setError("Please fill in your name, phone, address and city.");
      return;
    }
    if (paymentMethod === "upi" && currency !== "INR") {
      setError("UPI is available for orders paid in INR. Switch to International (₹→$) or use PayPal.");
      return;
    }

    setBusy(true);
    try {
      const payload = {
        customer: { ...form, country: currency === "INR" ? "India" : "International" },
        currency,
        items: items.map((i) => ({
          slug: i.slug,
          size: i.size,
          qty: i.qty,
          priceInr: i.priceInr,
          priceUsd: i.priceUsd,
        })),
        subtotal: total.subtotal,
        shipping: total.shipping,
        total: total.total,
        paymentMethod,
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not place order");
      setOrder(data.order);
      if (paymentMethod === "upi") clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setBusy(false);
    }
  }

  const upiUri = order ? buildUpiUri({ amount: order.total, orderId: order.id }) : "";
  const links = order ? buildAppDeepLinks(upiUri) : null;

  async function confirmManualPayment() {
    if (!order) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payerName }),
      });
      if (!res.ok) throw new Error("Verification failed");
      setPaid(true);
      router.push(`/order/${order.id}?paid=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setBusy(false);
    }
  }

  /* ---------------- Order summary block ---------------- */
  const summary = (
    <aside className="h-fit border border-line bg-tile/50 p-6 lg:sticky lg:top-24">
      <h2 className="text-sm font-black uppercase tracking-widest">Order summary</h2>
      <ul className="mt-4 space-y-3 text-sm">
        {items.map((i) => (
          <li key={`${i.id}-${i.size}`} className="flex items-center gap-3">
            <img src={i.image} alt={i.name} className="h-14 w-11 bg-tile object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-muted">{i.name}</p>
              <p className="text-[11px] text-muted">Size {i.size} · Qty {i.qty}</p>
            </div>
            <span className="text-xs font-bold">
              {currency === "INR"
                ? `₹${(i.priceInr * i.qty).toLocaleString("en-IN")}`
                : `$${(i.priceUsd * i.qty).toFixed(2)}`}
            </span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-bold">
            {currency === "INR" ? `₹${total.subtotal.toLocaleString("en-IN")}` : `$${total.subtotal.toFixed(2)}`}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Delivery</dt>
          <dd className="font-bold">{total.shipping === 0 ? "Free" : currency === "INR" ? `₹${total.shipping}` : `$${total.shipping.toFixed(2)}`}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-base">
          <dt className="font-black uppercase">Total</dt>
          <dd className="font-black">
            {currency === "INR" ? `₹${total.total.toLocaleString("en-IN")}` : `$${total.total.toFixed(2)}`}
          </dd>
        </div>
      </dl>
    </aside>
  );

  /* ---------------- UPI payment panel ---------------- */
  if (order && paymentMethod === "upi") {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="border border-line bg-white p-6 sm:p-8">
            <h1 className="text-2xl font-black uppercase tracking-tight">Pay with UPI</h1>
            <p className="mt-1 text-sm text-muted">
              Order <span className="font-bold text-ink">{order.id}</span> ·{" "}
              <span className="font-bold text-ink">₹{order.total.toLocaleString("en-IN")}</span>
            </p>

            {paid ? (
              <div className="mt-8 text-center">
                <p className="text-4xl">✅</p>
                <p className="mt-3 font-bold">Payment verified!</p>
                <p className="text-sm text-muted">We&apos;re packing your order.</p>
                <Link href={`/order/${order.id}`} className="btn-primary mt-6 inline-block rounded-sm px-8 py-3 text-xs uppercase">
                  View order
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-6 flex justify-center">
                  <img
                    src={`/api/orders/${order.id}/qr`}
                    alt={`UPI QR code for ${order.id}`}
                    className="h-56 w-56 border border-line bg-white p-2"
                  />
                </div>
                <p className="mt-4 text-center text-xs text-muted">
                  Scan with any UPI app — payment goes to{" "}
                  <span className="font-bold text-ink">{upiConfig.vpa}</span>
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {upiApps.map((app) => {
                    const url = links ? links[app.linkKey] || links.generic : "#";
                    return (
                      <a
                        key={app.id}
                        href={url}
                        onClick={() => {}}
                        className="flex items-center justify-center gap-2 rounded-sm border border-line px-4 py-3 text-xs font-bold uppercase hover:border-black"
                      >
                        <span>{app.emoji}</span> {app.label}
                      </a>
                    );
                  })}
                </div>
                <p className="mt-3 text-center text-[11px] text-muted">
                  Tap a button to open your UPI app with the amount pre-filled.
                </p>

                <div className="mt-8 border-t border-line pt-6">
                  <label className="text-xs font-bold uppercase tracking-wide">
                    After paying, confirm here
                  </label>
                  <input
                    type="text"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    placeholder="Name used on the UPI payment (optional)"
                    className="mt-2 w-full rounded-sm border border-line px-3 py-3 text-sm outline-none focus:border-black"
                  />
                  <button
                    onClick={confirmManualPayment}
                    disabled={busy}
                    className="btn-primary mt-4 w-full rounded-sm px-6 py-4 text-xs uppercase"
                  >
                    {busy ? "Verifying…" : "I've paid — verify my order"}
                  </button>
                  {error ? <p className="mt-2 text-xs text-sale">{error}</p> : null}
                </div>
              </>
            )}
          </div>
          {summary}
        </div>
      </div>
    );
  }

  /* ---------------- PayPal panel ---------------- */
  if (order && paymentMethod === "paypal") {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="border border-line bg-white p-6 sm:p-8">
            <h1 className="text-2xl font-black uppercase tracking-tight">Pay with PayPal</h1>
            <p className="mt-1 text-sm text-muted">
              Order <span className="font-bold text-ink">{order.id}</span> ·{" "}
              <span className="font-bold text-ink">${order.total.toFixed(2)}</span>
            </p>
            <div className="mt-6">
              <PaypalCheckout
                totalUsd={order.total}
                orderId={order.id}
                onSuccess={() => router.push(`/order/${order.id}?paid=1`)}
                onError={(msg) => setError(msg)}
              />
              {error ? <p className="mt-3 text-xs text-sale">{error}</p> : null}
            </div>
          </div>
          {summary}
        </div>
      </div>
    );
  }

  /* ---------------- Address form ---------------- */
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black uppercase tracking-tight">Checkout</h1>
      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Contact */}
          <section>
            <h2 className="border-b border-line pb-2 text-sm font-black uppercase tracking-widest">
              1 · Delivery details
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name *" className="rounded-sm border border-line px-3 py-3 text-sm outline-none focus:border-black" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number *" className="rounded-sm border border-line px-3 py-3 text-sm outline-none focus:border-black" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email (for updates)" className="rounded-sm border border-line px-3 py-3 text-sm outline-none focus:border-black sm:col-span-2" />
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address *" className="rounded-sm border border-line px-3 py-3 text-sm outline-none focus:border-black sm:col-span-2" />
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City *" className="rounded-sm border border-line px-3 py-3 text-sm outline-none focus:border-black" />
              <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State" className="rounded-sm border border-line px-3 py-3 text-sm outline-none focus:border-black" />
              <input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="PIN / ZIP code" className="rounded-sm border border-line px-3 py-3 text-sm outline-none focus:border-black" />
            </div>
          </section>

          {/* Payment method */}
          <section className="mt-8">
            <h2 className="border-b border-line pb-2 text-sm font-black uppercase tracking-widest">
              2 · Payment method
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => { setPaymentMethod("upi"); setError(""); }}
                className={`rounded-sm border p-5 text-left transition ${paymentMethod === "upi" ? "border-black bg-black text-white" : "border-line hover:border-black"}`}
              >
                <p className="text-sm font-bold uppercase">UPI</p>
                <p className={`mt-1 text-xs ${paymentMethod === "upi" ? "text-white/70" : "text-muted"}`}>
                  Google Pay · PhonePe · Paytm · BHIM — instant, no fees
                </p>
              </button>
              <button
                onClick={() => { setPaymentMethod("paypal"); setError(""); }}
                className={`rounded-sm border p-5 text-left transition ${paymentMethod === "paypal" ? "border-black bg-black text-white" : "border-line hover:border-black"}`}
              >
                <p className="text-sm font-bold uppercase">PayPal</p>
                <p className={`mt-1 text-xs ${paymentMethod === "paypal" ? "text-white/70" : "text-muted"}`}>
                  Best for international orders in USD
                </p>
              </button>
            </div>
            {paymentMethod === "upi" && currency !== "INR" ? (
              <p className="mt-2 text-xs text-sale">
                UPI requires INR. Switch currency or choose PayPal.
              </p>
            ) : null}
            {paymentMethod === "paypal" && currency === "INR" ? (
              <p className="mt-2 text-xs text-muted">
                PayPal works fine for INR too — switch currency to International for USD.
              </p>
            ) : null}
          </section>

          <button
            onClick={placeOrder}
            disabled={busy}
            className="btn-primary mt-8 w-full rounded-sm px-6 py-4 text-xs uppercase sm:w-auto sm:min-w-72"
          >
            {busy ? "Placing order…" : `Place order · ${currency === "INR" ? `₹${total.total.toLocaleString("en-IN")}` : `$${total.total.toFixed(2)}`}`}
          </button>
          {error ? <p className="mt-3 text-xs text-sale">{error}</p> : null}
        </div>
        <div className="lg:col-span-1">{summary}</div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-muted">Loading checkout…</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
