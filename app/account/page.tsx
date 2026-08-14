export const metadata = {
  title: "My Account",
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
      <h1 className="text-3xl font-black uppercase tracking-tight">My Account</h1>
      <p className="mt-3 text-sm text-muted">
        Accounts are coming soon. Right now you can shop as a guest — your order status is
        tracked with your order number.
      </p>
      <div className="mt-8 rounded-sm bg-tile p-6 text-left">
        <p className="text-xs font-bold uppercase tracking-widest">Find your order</p>
        <p className="mt-2 text-sm text-muted">
          Check your order status anytime at <span className="font-bold text-ink">/order/&lt;ORDER-ID&gt;</span>,
          using the order number you received at checkout.
        </p>
      </div>
    </div>
  );
}
