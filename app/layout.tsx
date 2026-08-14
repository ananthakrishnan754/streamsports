import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { Currency } from "@/lib/currency";

export const metadata: Metadata = {
  title: {
    default: "STREAMSPORTS | Online Shopping for Top-Quality Gear",
    template: "%s | STREAMSPORTS",
  },
  description:
    "StreamSports — top-quality sports, streetwear and lifestyle gear for men and women. First quality, honest prices.",
};

async function detectCurrency(): Promise<Currency> {
  try {
    const h = await headers();
    const country =
      h.get("x-vercel-ip-country") ||
      h.get("cf-ipcountry") ||
      h.get("x-country-code") ||
      "";
    if (country && country.toLowerCase() === "in") return "INR";
    const acceptLang = h.get("accept-language") || "";
    if (/^in|en-IN|hi/i.test(acceptLang)) return "INR";
  } catch {
    /* headers unavailable */
  }
  return "INR";
}

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const initialCurrency = await detectCurrency();
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-white text-ink">
        <CurrencyProvider initialCurrency={initialCurrency}>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
