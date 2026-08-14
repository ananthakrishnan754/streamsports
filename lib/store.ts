import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

export interface OrderItem {
  id: string;
  slug: string;
  name: string;
  size: string;
  qty: number;
  priceInr: number;
  priceUsd: number;
}

export type OrderStatus = "pending" | "awaiting_payment" | "paid" | "confirmed" | "shipped" | "cancelled";

export interface Order {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  currency: "INR" | "USD";
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "upi" | "paypal" | "none";
  status: OrderStatus;
  payerName?: string;
  upiTxnRef?: string;
  paypalOrderId?: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

let cache: Order[] | null = null;

function ensureFile(): void {
  if (!existsSync(DATA_DIR)) {
    try {
      mkdirSync(DATA_DIR, { recursive: true });
    } catch {
      /* read-only filesystem — fall back to memory */
    }
  }
  if (!existsSync(ORDERS_FILE)) {
    try {
      writeFileSync(ORDERS_FILE, "[]", "utf8");
    } catch {
      /* memory only */
    }
  }
}

function readOrders(): Order[] {
  if (cache) return cache;
  try {
    ensureFile();
    if (existsSync(ORDERS_FILE)) {
      cache = JSON.parse(readFileSync(ORDERS_FILE, "utf8")) as Order[];
    }
  } catch {
    cache = [];
  }
  return cache ?? [];
}

function writeOrders(orders: Order[]): void {
  cache = orders;
  try {
    ensureFile();
    writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
  } catch {
    /* memory only */
  }
}

export function generateOrderId(): string {
  return `SS${Date.now().toString(36).toUpperCase()}${Math.floor(
    Math.random() * 1000
  )
    .toString()
    .padStart(3, "0")}`;
}

export function createOrder(input: Omit<Order, "id" | "createdAt" | "status">): Order {
  const order: Order = {
    ...input,
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    status: "awaiting_payment",
  };
  const orders = readOrders();
  orders.unshift(order);
  writeOrders(orders);
  return order;
}

export function getOrder(id: string): Order | undefined {
  return readOrders().find((o) => o.id === id);
}

export function listOrders(): Order[] {
  return readOrders();
}

export function updateOrder(id: string, patch: Partial<Order>): Order | undefined {
  const orders = readOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return undefined;
  orders[index] = { ...orders[index], ...patch };
  writeOrders(orders);
  return orders[index];
}
