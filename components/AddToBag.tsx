"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";

export function AddToBag({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { currency } = useCurrency();
  const [colour, setColour] = useState(product.colours[0]);
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const price = currency === "INR" ? product.priceInr : product.priceUsd;
  const compareAt =
    currency === "INR" ? product.compareAtInr : product.compareAtUsd;

  const reviewLabel = useMemo(() => {
    const r = product.rating;
    return { full: Number.isInteger(r) ? r : r.toFixed(1) };
  }, [product.rating]);

  function handleAdd() {
    if (!size) return;
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        size,
        priceInr: product.priceInr,
        priceUsd: product.priceUsd,
        image: product.image,
        emoji: product.emoji,
        brand: product.brand,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div>
      {/* Rating */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-bold">
          {reviewLabel.full} <span className="text-sale">★</span>
        </span>
        <span className="text-muted">| {product.reviews} reviews</span>
      </div>

      {/* Price */}
      <div className="mt-3 flex items-baseline gap-3">
        <span className="text-2xl font-bold">
          {currency === "INR" ? `₹${price.toLocaleString("en-IN")}` : `$${price.toFixed(2)}`}
        </span>
        {compareAt ? (
          <>
            <span className="text-lg text-muted line-through">
              {currency === "INR" ? `₹${compareAt.toLocaleString("en-IN")}` : `$${compareAt.toFixed(2)}`}
            </span>
            <span className="text-sm font-bold text-sale">
              -{Math.round(((compareAt - price) / compareAt) * 100)}%
            </span>
          </>
        ) : null}
      </div>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-asos-green">
        In stock · ships in 24h
      </p>

      {/* Colour */}
      {product.colours.length > 1 ? (
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wide">
            Colour: <span className="font-normal normal-case text-muted">{colour}</span>
          </p>
          <div className="mt-2 flex gap-2">
            {product.colours.map((c) => (
              <button
                key={c}
                onClick={() => setColour(c)}
                aria-label={c}
                className={`h-8 w-8 rounded-full border-2 ${
                  colour === c ? "border-black" : "border-line"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Size */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wide">Size</p>
          <Link href="/help" className="text-[11px] uppercase text-muted hover:underline">
            Size guide
          </Link>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`min-w-12 rounded-sm border px-3 py-2.5 text-sm font-bold transition ${
                size === s
                  ? "border-black bg-black text-white"
                  : "border-line hover:border-black"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {!size ? (
          <p className="mt-2 text-[11px] text-sale">Please select a size</p>
        ) : null}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handleAdd}
          disabled={!size}
          className="btn-primary rounded-sm px-6 py-4 text-xs uppercase"
        >
          {added ? "✓ Added to bag" : "Add to bag"}
        </button>
        <Link
          href={`/checkout?item=${product.slug}&size=${encodeURIComponent(size || product.sizes[0])}`}
          onClick={(e) => !size && e.preventDefault()}
          className={`btn-outline rounded-sm px-6 py-4 text-center text-xs uppercase ${
            !size ? "pointer-events-none opacity-40" : ""
          }`}
        >
          Buy it now
        </Link>
      </div>

      {/* Trust */}
      <ul className="mt-6 space-y-1.5 border-t border-line pt-4 text-xs text-muted">
        <li>✓ Free delivery on orders over ₹499</li>
        <li>✓ Easy 14-day returns</li>
        <li>✓ Pay with UPI, cards or PayPal</li>
      </ul>
    </div>
  );
}
