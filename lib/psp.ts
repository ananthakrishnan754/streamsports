// Optional PSP integration via the `upipay` SDK (PhonePe/Paytm Business APIs).
//
// Day one: this store runs a "manual verify" UPI flow (QR + deep links) that
// needs no merchant account. To enable AUTOMATED payment verification, set
// the credentials below and add your merchant account's webhook URL:
//
//   https://<your-domain>/api/webhooks/upi
//
// Config reference: node_modules/upipay/dist/index.d.ts

export function pspConfigured(): boolean {
  return Boolean(
    process.env.UPI_PHONEPE_MERCHANT_ID ||
      process.env.UPI_PAYTM_MERCHANT_ID
  );
}

function pspCredentials(): Record<string, string> {
  if (process.env.UPI_PAYTM_MERCHANT_ID) {
    const creds: Record<string, string> = {
      merchantId: process.env.UPI_PAYTM_MERCHANT_ID,
      merchantKey: process.env.UPI_PAYTM_MERCHANT_KEY || "",
    };
    if (process.env.UPI_PAYTM_WEBSITE) {
      creds.website = process.env.UPI_PAYTM_WEBSITE;
    }
    return creds;
  }
  return {
    merchantId: process.env.UPI_PHONEPE_MERCHANT_ID || "",
    saltKey: process.env.UPI_PHONEPE_SALT_KEY || "",
    saltIndex: process.env.UPI_PHONEPE_SALT_INDEX || "",
  };
}

async function buildClient() {
  const { UPIPay, rupeesToPaise } = await import("upipay");
  const provider = process.env.UPI_PAYTM_MERCHANT_ID ? "paytm" : "phonepe";
  const client = new UPIPay({
    provider,
    environment: process.env.UPI_ENV === "production" ? "production" : "sandbox",
    credentials: pspCredentials(),
  });
  return { client, rupeesToPaise };
}

export async function createPSPPayment(opts: {
  orderId: string;
  amountInr: number;
  customerPhone: string;
  callbackUrl: string;
  redirectUrl: string;
}): Promise<{ status: "ok" } | { status: "not_configured" }> {
  if (!pspConfigured()) return { status: "not_configured" };

  const { client, rupeesToPaise } = await buildClient();
  const payment = await client.createPayment({
    orderId: opts.orderId,
    amount: rupeesToPaise(opts.amountInr),
    customerPhone: opts.customerPhone,
    callbackUrl: opts.callbackUrl,
    redirectUrl: opts.redirectUrl,
    customerName: "StreamSports",
  });

  console.log(`[psp] created payment for ${opts.orderId}`, payment);
  return { status: "ok" };
}

export async function verifyPSPPayment(opts: {
  orderId: string;
}): Promise<"SUCCESS" | "PENDING" | "FAILED"> {
  const { client } = await buildClient();
  const status = await client.checkStatus(opts.orderId);
  return status.status as "SUCCESS" | "PENDING" | "FAILED";
}
