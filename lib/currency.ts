import type { Product } from "./products";

export type Currency = "INR" | "USD";

export const currencySymbol: Record<Currency, string> = {
  INR: "₹",
  USD: "$",
};

export function formatPrice(amount: number, currency: Currency): string {
  if (currency === "USD") {
    return `$${amount.toFixed(2)}`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function productPrice(
  product: Product,
  currency: Currency
): number {
  return currency === "INR" ? product.priceInr : product.priceUsd;
}

export function productCompareAt(
  product: Product,
  currency: Currency
): number | undefined {
  return currency === "INR"
    ? product.compareAtInr
    : product.compareAtUsd;
}

export function discountPct(
  product: Product,
  currency: Currency
): number | undefined {
  const current = productPrice(product, currency);
  const compareAt = productCompareAt(product, currency);
  if (!compareAt || compareAt <= current) return undefined;
  return Math.round(((compareAt - current) / compareAt) * 100);
}

export const INR_TO_USD = 0.0122;

export function inrToUsd(inr: number): number {
  return Math.round(inr * INR_TO_USD);
}
