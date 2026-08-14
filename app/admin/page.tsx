import Link from "next/link";
import { listOrders } from "@/lib/store";
import { OrderActions } from "@/components/OrderActions";

export const metadata = {
  title: "Admin · Orders",
};

const statusColour: Record<string, string> = {
  awaiting_payment: "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  shipped: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminPage() {
  const orders = listOrders();

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black uppercase tracking-tight">Admin · Orders</h1>
      <p className="mt-1 text-sm text-muted">
        {orders.length} order{orders.length === 1 ? "" : "s"} stored locally.
        Swap <code className="bg-tile px-1">lib/store.ts</code> for a real database before going live.
      </p>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-sm border border-dashed border-line bg-tile px-6 py-16 text-center">
          <p className="font-bold">No orders yet</p>
          <p className="mt-1 text-sm text-muted">
            Orders placed through checkout will appear here for you to verify and ship.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px] border border-line text-sm">
            <thead>
              <tr className="border-b border-line bg-tile text-left text-[11px] font-black uppercase tracking-widest">
                <th className="px-3 py-3">Order</th>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Total</th>
                <th className="px-3 py-3">Payment</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Set status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line align-top">
                  <td className="px-3 py-3">
                    <Link href={`/order/${o.id}`} className="font-bold hover:underline">
                      {o.id}
                    </Link>
                    <p className="text-[11px] text-muted">
                      {new Date(o.createdAt).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-bold">{o.customer.name}</p>
                    <p className="text-[11px] text-muted">{o.customer.phone}</p>
                    <p className="text-[11px] text-muted">
                      {o.customer.city}, {o.customer.country}
                    </p>
                  </td>
                  <td className="px-3 py-3 font-bold">
                    {o.currency === "INR"
                      ? `₹${o.total.toLocaleString("en-IN")}`
                      : `$${o.total.toFixed(2)}`}
                    <p className="font-normal text-[11px] text-muted">
                      {o.items.reduce((a, i) => a + i.qty, 0)} items
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <span className="uppercase text-[11px] font-bold">{o.paymentMethod}</span>
                    {o.upiTxnRef ? (
                      <p className="text-[11px] text-muted">ref: {o.upiTxnRef}</p>
                    ) : null}
                    {o.payerName ? (
                      <p className="text-[11px] text-muted">paid by: {o.payerName}</p>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`rounded-sm px-2 py-1 text-[11px] font-bold uppercase ${statusColour[o.status] || ""}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <OrderActions id={o.id} status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
