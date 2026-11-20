/** Colour maths for deriving a full theme from the handful of config colours. */

interface Rgb {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function parseHex(hex: string): Rgb {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return {
    r: Number.isNaN(r) ? 0 : r,
    g: Number.isNaN(g) ? 0 : g,
    b: Number.isNaN(b) ? 0 : b,
    a,
  };
}

function toHexByte(n: number): string {
  return Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0');
}

function toHex({ r, g, b }: Rgb): string {
  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
}

/** Hex colour with an alpha channel, e.g. withAlpha('#0F766E', 0.12). */
export function withAlpha(hex: string, alpha: number): string {
  const c = parseHex(hex);
  return `${toHex(c)}${toHexByte(alpha * 255)}`;
}

/** Linear mix: t = 0 → a, t = 1 → b. */
export function mix(a: string, b: string, t: number): string {
  const ca = parseHex(a);
  const cb = parseHex(b);
  return toHex({
    r: ca.r + (cb.r - ca.r) * t,
    g: ca.g + (cb.g - ca.g) * t,
    b: ca.b + (cb.b - ca.b) * t,
    a: 1,
  });
}

function channel(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function luminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio, 1 – 21. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export function isDarkColor(hex: string): boolean {
  return luminance(hex) < 0.4;
}

/** Pick whichever candidate reads best on `bg`. */
export function readableOn(bg: string, ...candidates: string[]): string {
  let best = candidates[0] ?? bg;
  let bestRatio = 0;
  for (const c of candidates) {
    const r = contrastRatio(c, bg);
    if (r > bestRatio) {
      best = c;
      bestRatio = r;
    }
  }
  return best;
}
