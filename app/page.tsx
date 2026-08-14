import Link from "next/link";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

const heroProducts = products.slice(0, 4);

function bestSellers(gender: "men" | "women") {
  const list = products.filter((p) => p.gender === gender);
  const fast = list.filter((p) => p.sellingFast);
  const rest = list.filter((p) => !p.sellingFast);
  return [...fast, ...rest].slice(0, 8);
}

const menTiles = [
  { label: "T-Shirts", emoji: "👕", href: "/men?category=t-shirts" },
  { label: "Hoodies", emoji: "🧥", href: "/men?category=hoodies-sweatshirts" },
  { label: "Sneakers", emoji: "👟", href: "/men?category=sneakers" },
  { label: "Caps", emoji: "🧢", href: "/men?category=accessories" },
];

const womenTiles = [
  { label: "Tops", emoji: "👚", href: "/women?category=tops" },
  { label: "Dresses", emoji: "👗", href: "/women?category=dresses" },
  { label: "Sneakers", emoji: "👟", href: "/women?category=sneakers" },
  { label: "Bags", emoji: "🎒", href: "/women?category=accessories" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
          <div className="animate-fade-in-up">
            <p className="mb-3 inline-block border border-white/30 px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
              New season · 34 styles live
            </p>
            <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
              Top Quality.
              <br />
              <span className="text-asos-green">Zero Compromise.</span>
            </h1>
            <p className="mt-4 max-w-md text-sm text-white/70 sm:text-base">
              Premium sports and streetwear for men and women. First quality at
              honest prices — from ₹399 to ₹2999.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/women" className="btn-primary rounded-sm bg-white px-8 py-3.5 text-[11px] uppercase text-black hover:bg-tile">
                Shop Women&apos;s
              </Link>
              <Link href="/men" className="btn-outline rounded-sm border-white px-8 py-3.5 text-[11px] uppercase text-white hover:bg-white hover:text-black">
                Shop Men&apos;s
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {heroProducts.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="group overflow-hidden rounded-sm bg-white/5"
              >
                <img
                  src={p.image}
                  alt={p.imageAlt}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="p-3">
                  <p className="truncate text-[11px] text-white/60">{p.name}</p>
                  <p className="text-sm font-bold">
                    {p.priceInr === Math.round(p.priceInr)
                      ? `₹${p.priceInr.toLocaleString("en-IN")}`
                      : `$${p.priceUsd.toFixed(2)}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-4 py-6 text-center sm:grid-cols-3 sm:px-6">
          {[
            { t: "Free delivery over ₹499", d: "on all Indian orders" },
            { t: "Easy 14-day returns", d: "no questions asked" },
            { t: "Quality promise", d: "first quality, always" },
          ].map((f) => (
            <div key={f.t} className="flex flex-col items-center gap-1">
              <p className="text-xs font-bold uppercase tracking-wide">{f.t}</p>
              <p className="text-[11px] text-muted">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Men's categories */}
      <section className="mx-auto max-w-[1400px] px-4 pt-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
            Men&apos;s <span className="text-asos-green">Essentials</span>
          </h2>
          <Link href="/men" className="text-xs font-bold uppercase underline hover:text-muted">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {menTiles.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="group flex flex-col items-center gap-3 bg-tile p-8 transition hover:bg-tile-deep"
            >
              <span className="text-5xl transition-transform duration-300 group-hover:scale-110">
                {t.emoji}
              </span>
              <span className="text-xs font-bold uppercase tracking-wide">{t.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Men's best sellers */}
      <section className="mx-auto max-w-[1400px] px-4 pt-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
            Men&apos;s <span className="text-asos-green">Best Sellers</span>
          </h2>
          <Link href="/men" className="text-xs font-bold uppercase underline hover:text-muted">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {bestSellers("men").map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Women's categories */}
      <section className="mx-auto max-w-[1400px] px-4 pt-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
            Women&apos;s <span className="text-asos-green">Favorites</span>
          </h2>
          <Link href="/women" className="text-xs font-bold uppercase underline hover:text-muted">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {womenTiles.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="group flex flex-col items-center gap-3 bg-tile p-8 transition hover:bg-tile-deep"
            >
              <span className="text-5xl transition-transform duration-300 group-hover:scale-110">
                {t.emoji}
              </span>
              <span className="text-xs font-bold uppercase tracking-wide">{t.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Women's best sellers */}
      <section className="mx-auto max-w-[1400px] px-4 pt-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
            Women&apos;s <span className="text-asos-green">Best Sellers</span>
          </h2>
          <Link href="/women" className="text-xs font-bold uppercase underline hover:text-muted">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {bestSellers("women").map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* App strip */}
      <section className="mx-auto max-w-[1400px] px-4 pt-16 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 bg-black px-8 py-10 text-white md:flex-row">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
              Get the StreamSports app
            </h2>
            <p className="mt-1 text-sm text-white/70">
              Exclusive app-only drops and 10% off your first order.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-sm border border-white px-6 py-3 text-[11px] font-bold uppercase hover:bg-white hover:text-black">
              App Store
            </Link>
            <Link href="/" className="rounded-sm border border-white px-6 py-3 text-[11px] font-bold uppercase hover:bg-white hover:text-black">
              Google Play
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
