import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const metadata = {
  title: "Sale",
};

export default function SalePage() {
  const sale = products.filter((p) => p.compareAtInr);
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <div className="rounded-sm bg-sale px-6 py-8 text-white">
        <h1 className="text-3xl font-black uppercase tracking-tight">The Sale</h1>
        <p className="mt-1 text-sm text-white/80">
          Marked-down styles while they last.
        </p>
      </div>
      {sale.length === 0 ? (
        <p className="mt-10 text-sm text-muted">No discounted styles right now.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {sale.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
