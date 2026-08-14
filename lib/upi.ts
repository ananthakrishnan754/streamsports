export interface UpiConfig {
  vpa: string;
  name: string;
}

export const upiConfig: UpiConfig = {
  vpa: process.env.NEXT_PUBLIC_UPI_VPA || "streamsports@okhdfcbank",
  name: process.env.NEXT_PUBLIC_UPI_NAME || "StreamSports",
};

export function buildUpiUri(opts: {
  vpa?: string;
  name?: string;
  amount: number;
  orderId: string;
  note?: string;
}): string {
  const vpa = opts.vpa || upiConfig.vpa;
  const name = opts.name || upiConfig.name;
  const params = new URLSearchParams({
    pa: vpa,
    pn: name,
    am: opts.amount.toFixed(2),
    cu: "INR",
    tr: opts.orderId,
  });
  if (opts.note) params.set("tn", opts.note);
  return `upi://pay?${params.toString()}`;
}

export interface UpiAppLinks {
  generic: string;
  gpay: string;
  phonepe: string;
  paytm: string;
  bhim: string;
}

export function buildAppDeepLinks(upiUri: string): UpiAppLinks {
  return {
    generic: upiUri,
    gpay: `tez://upi/?${upiUri.split("?")[1] || ""}`,
    phonepe: `phonepe://pay?${upiUri.split("?")[1] || ""}`,
    paytm: `paytmmp://pay?${upiUri.split("?")[1] || ""}`,
    bhim: `bhim://upi/pay?${upiUri.split("?")[1] || ""}`,
  };
}

export const upiApps = [
  { id: "generic", label: "Any UPI App", emoji: "📱", linkKey: "generic" },
  { id: "gpay", label: "Google Pay", emoji: "🔴", linkKey: "gpay" },
  { id: "phonepe", label: "PhonePe", emoji: "🟣", linkKey: "phonepe" },
  { id: "paytm", label: "Paytm", emoji: "🔵", linkKey: "paytm" },
  { id: "bhim", label: "BHIM", emoji: "🟢", linkKey: "bhim" },
] as const;
