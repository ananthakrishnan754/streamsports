"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useEffect } from "react";
import { useState } from "react";

const options = [
  { key: "relevance", label: "Relevance" },
  { key: "price-asc", label: "Price (Low to High)" },
  { key: "price-desc", label: "Price (High to Low)" },
  { key: "rating", label: "Highest Rated" },
  { key: "newest", label: "New In" },
];

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") || "relevance";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = useCallback(
    (key: string) => {
      setOpen(false);
      const next = new URLSearchParams(searchParams.toString());
      if (key === "relevance") next.delete("sort");
      else next.set("sort", key);
      router.push(`?${next.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-sm border border-line bg-white px-3 py-2 text-xs font-bold uppercase"
      >
        Sort: <span className="text-muted">{options.find((o) => o.key === current)?.label}</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 w-56 border border-line bg-white shadow-lg">
          {options.map((o) => (
            <button
              key={o.key}
              onClick={() => choose(o.key)}
              className={`block w-full px-4 py-2.5 text-left text-xs uppercase hover:bg-tile ${
                current === o.key ? "font-bold" : ""
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
