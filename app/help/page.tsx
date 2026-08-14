export const metadata = {
  title: "Help & FAQs",
};

const faqs = [
  {
    q: "Which payment methods do you accept?",
    a: "In India we accept UPI (Google Pay, PhonePe, Paytm, BHIM) and all major cards via our UPI flow. International orders can be paid with PayPal.",
  },
  {
    q: "How does UPI payment work?",
    a: "At checkout you'll get a QR code and one-tap buttons for your UPI app. Once you've paid, tap “I've paid — verify my order” and we'll confirm it manually within business hours.",
  },
  {
    q: "Do you deliver internationally?",
    a: "Yes. Switch to International at the top of the page to see prices in USD and pay with PayPal. Standard shipping takes 7–14 business days.",
  },
  {
    q: "What are delivery times in India?",
    a: "Metro cities: 2–4 business days. Rest of India: 4–7 business days. Orders ship within 24 hours.",
  },
  {
    q: "Can I return items?",
    a: "Yes — you have 14 days to return any unworn item with tags intact for a full refund.",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-black uppercase tracking-tight">Help &amp; FAQs</h1>
      <p className="mt-2 text-sm text-muted">
        Everything you need to know about ordering, paying and returns at StreamSports.
      </p>
      <div className="mt-8 space-y-4">
        {faqs.map((f) => (
          <div key={f.q} className="border border-line bg-white p-5">
            <h2 className="text-sm font-black uppercase tracking-wide">{f.q}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink">{f.a}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-sm bg-black p-6 text-white">
        <h2 className="text-sm font-black uppercase tracking-widest">Still stuck?</h2>
        <p className="mt-1 text-sm text-white/70">
          Email us at <a href="mailto:help@streamsports.example" className="underline">help@streamsports.example</a>{" "}
          or WhatsApp +91 90000 00000 — we reply within a few hours.
        </p>
      </div>
    </div>
  );
}
