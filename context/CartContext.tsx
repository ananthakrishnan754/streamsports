"use client";

import { createContext, useContext, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { createLocalStorageState } from "@/lib/localStorageState";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  size: string;
  qty: number;
  priceInr: number;
  priceUsd: number;
  image: string;
  emoji: string;
  brand: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string, size: string) => void;
  updateQty: (id: string, size: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const cartStore = createLocalStorageState<CartItem[]>("ss-bag", []);

export function CartProvider({ children }: { children: ReactNode }) {
  const items = cartStore.useValue();

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    cartStore.setValue((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [{ ...item, qty }, ...prev];
    });
  }, []);

  const removeItem = useCallback((id: string, size: string) => {
    cartStore.setValue((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  }, []);

  const updateQty = useCallback((id: string, size: string, qty: number) => {
    cartStore.setValue((prev) =>
      prev
        .map((i) => (i.id === id && i.size === size ? { ...i, qty: Math.max(1, qty) } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const clear = useCallback(() => cartStore.setValue([]), []);

  const count = useMemo(() => items.reduce((acc, i) => acc + i.qty, 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({ items, count, addItem, removeItem, updateQty, clear }),
    [items, count, addItem, removeItem, updateQty, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
