import { useCurrency } from "@/context/CurrencyContext";
import { formatPrice } from "@/lib/currency";

export function PriceTag({
  priceInr,
  priceUsd,
  compareAtInr,
  compareAtUsd,
  size = "md",
  className = "",
}: {
  priceInr: number;
  priceUsd: number;
  compareAtInr?: number;
  compareAtUsd?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { currency } = useCurrency();
  const price = currency === "INR" ? priceInr : priceUsd;
  const compareAt = currency === "INR" ? compareAtInr : compareAtUsd;
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-2xl" };

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className={`font-bold ${sizes[size]}`}>{formatPrice(price, currency)}</span>
      {compareAt ? (
        <>
          <span className={`text-muted line-through ${size === "lg" ? "text-base" : "text-sm"}`}>
            {formatPrice(compareAt, currency)}
          </span>
          <span className="text-xs font-bold text-sale">
            -{Math.round(((compareAt - price) / compareAt) * 100)}%
          </span>
        </>
      ) : null}
    </div>
  );
}
