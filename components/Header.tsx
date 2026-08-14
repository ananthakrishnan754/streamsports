"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import type { Currency } from "@/lib/currency";

function CountrySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-[11px] uppercase tracking-wide hover:underline"
      >
        <span>You&apos;re in {currency === "INR" ? "India" : "International"}</span>
        <span className="text-white/60">|</span>
        <span className="underline">Change</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 border border-line bg-white shadow-lg">
          <p className="border-b border-line bg-tile px-4 py-2 text-[11px] font-bold uppercase tracking-wide">
            Shopping from
          </p>
          {(
            [
              { code: "INR", label: "India", sub: "₹ · UPI payments" },
              { code: "USD", label: "International", sub: "$ · PayPal" },
            ] as { code: Currency; label: string; sub: string }[]
          ).map((c) => (
            <button
              key={c.code}
              onClick={() => {
                setCurrency(c.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-tile ${
                currency === c.code ? "bg-tile font-bold" : ""
              }`}
            >
              <span>
                {c.label}
                <span className="block text-xs text-muted">{c.sub}</span>
              </span>
              {currency === c.code && <span className="text-asos-green">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const onSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    },
    [query, router]
  );

  return (
    <>
      {/* Utility bar */}
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-1.5 sm:px-6">
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-wide">
            <Link href="/" className="hover:underline">
              Download our app
            </Link>
            <Link href="/help" className="hidden hover:underline sm:inline">
              Help &amp; FAQs
            </Link>
          </div>
          <CountrySwitcher />
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 sm:px-6">
          <button
            className="lg:hidden"
            onClick={() => setMenuOpen((m) => !m)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>

          <Link href="/" className="shrink-0">
            <span className="text-2xl font-black uppercase leading-none tracking-tight sm:text-[26px]">
              Stream<span className="text-asos-green">Sports</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            <Link
              href="/women"
              className={`nav-link ${pathname.startsWith("/women") ? "active" : ""}`}
            >
              Women
            </Link>
            <Link
              href="/men"
              className={`nav-link ${pathname.startsWith("/men") ? "active" : ""}`}
            >
              Men
            </Link>
          </nav>

          <form
            onSubmit={onSearch}
            className="hidden flex-1 md:block"
            role="search"
          >
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for items and brands"
                className="w-full rounded-lg border border-line bg-tile py-2.5 pl-4 pr-11 text-sm outline-none transition focus:border-black focus:bg-white"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-ink hover:text-black"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-4 sm:gap-5">
            <Link href="/account" className="hidden items-center gap-1.5 text-[11px] font-bold uppercase sm:flex hover:underline">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Account
            </Link>
            <Link href="/saved" className="hidden items-center gap-1.5 text-[11px] font-bold uppercase sm:flex hover:underline">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 20s-7-4.5-9-9c-1-2.5 1-6 4-6 2 0 3.5 1 5 2.5C13.5 6 15 5 17 5c3 0 5 3.5 4 6-2 4.5-9 9-9 9Z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Saved
            </Link>
            <Link
              href="/bag"
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase hover:underline"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 8h12l1 13H5L6 8Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9 10V6a3 3 0 0 1 6 0v4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Bag
              <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                {count} {count === 1 ? "item" : "items"}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <div className="border-t border-line px-4 py-2 md:hidden">
          <form onSubmit={onSearch} role="search">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for items and brands"
              className="w-full rounded-lg border border-line bg-tile px-4 py-2.5 text-sm outline-none focus:border-black"
            />
          </form>
        </div>

        {menuOpen && (
          <nav className="border-t border-line px-4 py-4 lg:hidden">
            <Link
              href="/women"
              onClick={() => setMenuOpen(false)}
              className="block border-b border-line py-3 text-sm font-bold uppercase"
            >
              Women
            </Link>
            <Link
              href="/men"
              onClick={() => setMenuOpen(false)}
              className="block border-b border-line py-3 text-sm font-bold uppercase"
            >
              Men
            </Link>
            <Link href="/sale" onClick={() => setMenuOpen(false)} className="block border-b border-line py-3 text-sm font-bold uppercase text-sale">
              Sale
            </Link>
            <Link href="/help" onClick={() => setMenuOpen(false)} className="block py-3 text-sm font-bold uppercase">
              Help &amp; FAQs
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
