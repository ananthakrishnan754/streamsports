"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { formatPrice as fmt } from "@/lib/currency";
import type { Currency } from "@/lib/currency";
import { createLocalStorageState } from "@/lib/localStorageState";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const currencyStore = createLocalStorageState<Currency | null>(
  "ss-currency",
  null
);

export function CurrencyProvider({
  children,
  initialCurrency,
}: {
  children: ReactNode;
  initialCurrency: Currency;
}) {
  const stored = currencyStore.useValue();

  const value = useMemo<CurrencyContextValue>(() => {
    const currency: Currency = stored ?? initialCurrency;
    return {
      currency,
      setCurrency: (c) => currencyStore.setValue(c),
      formatPrice: (amount) => fmt(amount, currency),
    };
  }, [stored, initialCurrency]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
