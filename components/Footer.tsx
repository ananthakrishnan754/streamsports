import Link from "next/link";

const helpLinks = ["Help", "Track order", "Delivery & returns", "Sitemap"];
const aboutLinks = ["About us", "Careers at StreamSports", "Our quality promise", "Contact us"];
const moreLinks = ["Mobile and StreamSports apps", "Gift vouchers", "Black Friday deals", "Student discount"];

const payments = ["UPI", "VISA", "Mastercard", "PayPal", "American Express"];

export function Footer() {
  return (
    <footer className="mt-16 bg-tile">
      {/* Social + payments */}
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            {["Facebook", "Instagram", "Snapchat", "YouTube", "X"].map((s) => (
              <a
                key={s}
                href="#"
                aria-label={s}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white text-xs font-bold uppercase hover:bg-ink"
              >
                {s[0]}
              </a>
            ))}
          </div>
          <ul className="flex flex-wrap items-center gap-4 text-[11px] font-bold uppercase tracking-wide text-muted">
            {payments.map((p) => (
              <li key={p} className="border border-line bg-white px-3 py-1.5">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Trust row */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-10 gap-y-4 px-4 py-6 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black uppercase leading-none">StreamSports</span>
            <div>
              <div className="text-sm">4.7 / 5 — 12,400+ reviews</div>
              <div className="text-xs text-muted">First quality. Honest prices.</div>
            </div>
          </div>
          <Link
            href="/"
            className="btn-primary rounded-sm px-6 py-2.5 text-[11px] uppercase"
          >
            Download the app
          </Link>
        </div>
      </div>

      {/* Link columns */}
      <div className="border-b border-line">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest">Help &amp; Information</h3>
            <ul className="space-y-2.5 text-sm text-ink">
              {helpLinks.map((l) => (
                <li key={l}>
                  <Link href="/help" className="hover:underline">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest">About StreamSports</h3>
            <ul className="space-y-2.5 text-sm text-ink">
              {aboutLinks.map((l) => (
                <li key={l}>
                  <Link href="/about" className="hover:underline">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest">More From StreamSports</h3>
            <ul className="space-y-2.5 text-sm text-ink">
              {moreLinks.map((l) => (
                <li key={l}>
                  <Link href="/" className="hover:underline">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest">Shopping with us</h3>
            <ul className="space-y-2.5 text-sm text-ink">
              <li><Link href="/help" className="hover:underline">Delivery to India</Link></li>
              <li><Link href="/help" className="hover:underline">Worldwide delivery</Link></li>
              <li><Link href="/help" className="hover:underline">Easy 14-day returns</Link></li>
              <li><Link href="/help" className="hover:underline">Secure payments</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted sm:flex-row sm:px-6">
        <p>© 2026 StreamSports. Top Quality. Zero Compromise.</p>
        <ul className="flex items-center gap-3">
          <li><Link href="/" className="hover:underline">Privacy &amp; Cookies</Link></li>
          <li>|</li>
          <li><Link href="/" className="hover:underline">Ts&amp;Cs</Link></li>
          <li>|</li>
          <li><Link href="/" className="hover:underline">Accessibility</Link></li>
        </ul>
      </div>
    </footer>
  );
}
