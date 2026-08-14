import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByCategory } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { AddToBag } from "@/components/AddToBag";

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getProductsByCategory(
    product.gender,
    product.category,
    product.subcategory
  )
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6">
      {/* Breadcrumbs */}
      <nav className="py-3 text-[11px] uppercase tracking-wide text-muted">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/${product.gender}`} className="hover:underline">
          {product.gender === "men" ? "Men" : "Women"}
        </Link>
        <span className="mx-1.5">/</span>
        <Link
          href={`/${product.gender}?category=${product.subcategory}`}
          className="hover:underline"
        >
          {product.subcategory.replace(/-/g, " ")}
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          {(product.image2 ? [product.image2, product.image] : [product.image]).map(
            (img, i) => (
              <img
                key={img}
                src={img}
                alt={i === 0 && product.image2 ? `${product.imageAlt} (view 2)` : product.imageAlt}
                className={`bg-tile object-cover ${
                  product.image2
                    ? "aspect-square w-full sm:aspect-[3/4] sm:w-[calc(100%-5rem)]"
                    : "aspect-[3/4] w-full"
                }`}
              />
            )
          )}
        </div>

        {/* Details */}
        <div className="lg:pl-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
            {product.brand}
          </p>
          <h1 className="mt-1 text-2xl font-black uppercase leading-tight tracking-tight sm:text-3xl">
            {product.name}
          </h1>
          <AddToBag product={product} />

          {/* Description */}
          <div className="mt-8 border-t border-line pt-5">
            <h2 className="text-xs font-bold uppercase tracking-widest">Details</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink">
              {product.description}
            </p>
            <p className="mt-3 text-xs text-muted">
              <span className="font-bold text-ink">Composition:</span>{" "}
              {product.composition}
            </p>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-black uppercase tracking-tight">
            You might <span className="text-asos-green">also like</span>
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
