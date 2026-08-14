const PALETTES = [
  ["#f0f0f0", "#e2e2e2"],
  ["#f6f3ef", "#e9e2d8"],
  ["#eef2f6", "#dce4ec"],
  ["#f3f1ee", "#e4dfd7"],
  ["#eef7f5", "#dcecea"],
  ["#f7f0f2", "#e8d8de"],
];

export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function placeholderSvg(opts: {
  emoji: string;
  label: string;
  bg: string[];
  dark?: boolean;
  size?: number;
}): string {
  const [c1, c2] = opts.bg;
  const size = opts.size ?? 750;
  const textColor = opts.dark ? "#ffffff" : "#1a1a1a";
  const subColor = opts.dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.35)";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.round(
    size * 1.33
  )}" viewBox="0 0 ${size} ${Math.round(size * 1.33)}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="${size * 0.85}" cy="${size * 0.12}" r="${size * 0.28}" fill="#ffffff" opacity="0.25"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-size="${size * 0.42}">${opts.emoji}</text>
  <text x="${size * 0.05}" y="${size * 0.96}" font-family="Arial, sans-serif" font-size="${size * 0.045}" font-weight="700" letter-spacing="2" fill="${textColor}">${opts.label.toUpperCase()}</text>
  <text x="${size * 0.05}" y="${size * 1.02}" font-family="Arial, sans-serif" font-size="${size * 0.03}" fill="${subColor}">StreamSports</text>
</svg>`;
}

let idx = 0;

export function makePlaceholder(
  emoji: string,
  label: string,
  variation = 0
): string {
  const palette = PALETTES[(idx++ + variation) % PALETTES.length];
  return svgToDataUri(placeholderSvg({ emoji, label, bg: palette }));
}
