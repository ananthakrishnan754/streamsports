import Link from "next/link";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const metadata = {
  title: "Search",
};

export default async function SearchPage({
  searchParams,
}: PageProps<"/search">) {
  const sp = await searchParams;
  const q = (typeof sp.q === "string" ? sp.q : "").trim().toLowerCase();
  const results = q
    ? products.filter((p) =>
        `${p.name} ${p.brand} ${p.subcategory} ${p.category}`
          .toLowerCase()
          .includes(q)
      )
    : [];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black uppercase tracking-tight">
        Search{q ? ` · “${q}”` : ""}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {q
          ? `${results.length} ${results.length === 1 ? "result" : "results"} found`
          : "Type a search above to find products."}
      </p>

      {results.length === 0 && q ? (
        <div className="mt-10 rounded-sm border border-dashed border-line bg-tile px-6 py-16 text-center">
          <p className="font-bold">No matches for “{q}”</p>
          <p className="mt-1 text-sm text-muted">Try “t-shirt”, “hoodie” or “sneakers”.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/men" className="btn-primary rounded-sm px-6 py-3 text-xs uppercase">Shop Men&apos;s</Link>
            <Link href="/women" className="btn-outline rounded-sm px-6 py-3 text-xs uppercase">Shop Women&apos;s</Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
