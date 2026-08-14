"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCurrency } from "@/context/CurrencyContext";
import { productPrice, productCompareAt, discountPct } from "@/lib/currency";

function SaveButton() {
  const [saved, setSaved] = useState(false);
  return (
    <button
      aria-label={saved ? "Remove from saved" : "Save for later"}
      onClick={(e) => {
        e.preventDefault();
        setSaved((s) => !s);
      }}
      className={`absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 shadow-sm transition ${
        saved ? "text-sale" : "text-ink"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"}>
        <path d="M12 20s-7-4.5-9-9c-1-2.5 1-6 4-6 2 0 3.5 1 5 2.5C13.5 6 15 5 17 5c3 0 5 3.5 4 6-2 4.5-9 9-9 9Z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  );
}

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { currency } = useCurrency();
  const price = productPrice(product, currency);
  const compareAt = productCompareAt(product, currency);
  const pct = discountPct(product, currency);
  const moreColours = (product.colours?.length ?? 1) > 1;

  return (
    <div className="group relative flex flex-col">
      <SaveButton />
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden bg-tile"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <img
            src={product.image}
            alt={product.imageAlt}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover"
          />
          {product.image2 ? (
            <img
              src={product.image2}
              alt={`${product.imageAlt} — alternate view`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          ) : null}
        </div>

        {pct ? (
          <span className="absolute left-2 top-2 z-10 bg-sale px-1.5 py-0.5 text-[11px] font-bold text-white">
            -{pct}%
          </span>
        ) : null}
        {product.newIn && !pct ? (
          <span className="absolute left-2 top-2 z-10 bg-black px-1.5 py-0.5 text-[11px] font-bold text-white">
            NEW IN
          </span>
        ) : null}

        <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full bg-black/85 p-2 text-center text-[11px] font-bold uppercase tracking-wide text-white transition-transform duration-200 group-hover:translate-y-0">
          Quick add
        </div>
      </Link>

      <div className="mt-2 flex-1">
        <Link
          href={`/product/${product.slug}`}
          className="block text-[13px] leading-snug text-muted hover:text-ink hover:underline"
        >
          {product.name}
        </Link>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-[15px] font-bold">
            {currency === "INR" ? `₹${price.toLocaleString("en-IN")}` : `$${price.toFixed(2)}`}
          </span>
          {compareAt ? (
            <>
              <span className="text-xs text-muted line-through">
                {currency === "INR" ? `₹${compareAt.toLocaleString("en-IN")}` : `$${compareAt.toFixed(2)}`}
              </span>
              <span className="text-xs font-bold text-sale">-{pct}%</span>
            </>
          ) : null}
        </div>
        {product.sellingFast ? (
          <p className="mt-0.5 text-xs font-bold uppercase text-asos-green">
            Selling fast
          </p>
        ) : null}
        {moreColours ? (
          <p className="mt-0.5 text-xs text-muted">
            +{product.colours!.length - 1} more {product.colours!.length - 1 === 1 ? "colour" : "colours"}
          </p>
        ) : null}
      </div>
    </div>
  );
}
