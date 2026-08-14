import Link from "next/link";
import {
  getProductsByCategory,
  type Gender,
} from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { SortSelect } from "@/components/SortSelect";

function resolveCategoryFilter(gender: Gender, key: string) {
  if (!key || key === "all") return { category: undefined, subcategory: undefined };
  const hasSub = getProductsByCategory(gender).some((p) => p.subcategory === key);
  if (hasSub) return { category: undefined, subcategory: key };
  return { category: key, subcategory: undefined };
}

export function ListingPage({
  gender,
  title,
  categories,
  activeKey,
  searchParams,
}: {
  gender: Gender;
  title: string;
  categories: { key: string; label: string }[];
  activeKey: string;
  searchParams: URLSearchParams;
}) {
  const { category, subcategory } = resolveCategoryFilter(gender, activeKey);
  let list = getProductsByCategory(gender, category, subcategory);
  const sort = searchParams.get("sort") || "relevance";

  switch (sort) {
    case "price-asc":
      list = [...list].sort(
        (a, b) => a.priceInr - b.priceInr || a.priceUsd - b.priceUsd
      );
      break;
    case "price-desc":
      list = [...list].sort(
        (a, b) => b.priceInr - a.priceInr || b.priceUsd - a.priceUsd
      );
      break;
    case "rating":
      list = [...list].sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      list = [...list].sort((a, b) => Number(b.newIn ?? false) - Number(a.newIn ?? false));
      break;
    default:
      break;
  }

  const totalStyles = getProductsByCategory(gender).length;
  const activeLabel =
    categories.find((c) => c.key === activeKey)?.label || "All";

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      {/* Breadcrumbs */}
      <nav className="py-3 text-[11px] uppercase tracking-wide text-muted">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/${gender}`} className="hover:underline">{title}</Link>
        {activeKey !== "all" ? (
          <>
            <span className="mx-1.5">/</span>
            <span className="text-ink">{activeLabel}</span>
          </>
        ) : null}
      </nav>

      {/* Category carousel */}
      <div className="-mx-4 overflow-x-auto border-b border-line sm:-mx-6">
        <div className="flex min-w-max gap-2 px-4 py-3 sm:px-6">
          {categories.map((c) => (
            <Link
              key={c.key}
              href={`/${gender}${c.key === "all" ? "" : `?category=${c.key}`}`}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold uppercase transition ${
                c.key === activeKey
                  ? "border-black bg-black text-white"
                  : "border-line bg-white hover:border-black"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Heading + toolbar */}
      <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
            {activeKey === "all" ? `${title}'s` : activeLabel}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {list.length} {list.length === 1 ? "style" : "styles"} found · {totalStyles} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SortSelect />
          <div className="hidden items-center gap-1 text-muted sm:flex">
            {[2, 3, 4].map((n) => (
              <span key={n} className="cursor-pointer px-1 hover:text-ink">
                ▦
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {list.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-bold">No styles found</p>
          <p className="mt-1 text-sm text-muted">Try a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
