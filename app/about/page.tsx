export const metadata = {
  title: "About StreamSports",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-black uppercase tracking-tight">About StreamSports</h1>
      <p className="mt-4 text-lg leading-relaxed">
        <span className="font-bold">Top Quality. Zero Compromise.</span> That&apos;s the whole
        idea behind StreamSports.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        We started with a simple frustration — premium-looking sports and streetwear always
        carried premium prices. So we built StreamSports to cut the middleman and the markup:
        first-quality gear for men and women at honest prices from ₹399 to ₹2999.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Everything we sell passes a strict quality check before it ships. No shortcuts on
        stitching, fabrics or fit. And if it&apos;s not right, our 14-day returns policy has
        your back.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { t: "34+", d: "styles across men & women" },
          { t: "4.7/5", d: "from 12,400+ customer reviews" },
          { t: "24h", d: "order dispatch time" },
        ].map((s) => (
          <div key={s.t} className="border border-line bg-tile p-5 text-center">
            <p className="text-2xl font-black">{s.t}</p>
            <p className="mt-1 text-xs text-muted">{s.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
