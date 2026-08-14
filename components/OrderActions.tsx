"use client";

import { useState } from "react";

const statuses = ["awaiting_payment", "confirmed", "shipped", "cancelled"] as const;

export function OrderActions({ id, status }: { id: string; status: string }) {
  const [current, setCurrent] = useState(status);
  const [busy, setBusy] = useState(false);

  async function setStatus(next: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("update failed");
      setCurrent(next);
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      {statuses.map((s) => (
        <button
          key={s}
          onClick={() => setStatus(s)}
          disabled={busy || current === s}
          className={`rounded-sm border px-2.5 py-1 text-[11px] font-bold uppercase transition ${
            current === s
              ? "border-black bg-black text-white"
              : "border-line hover:border-black"
          }`}
        >
          {s === "awaiting_payment" ? "pending" : s}
        </button>
      ))}
    </div>
  );
}
