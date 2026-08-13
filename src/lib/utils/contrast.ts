/**
 * Perhitungan rasio kontras WCAG 2.1 — Rope Access Center (RAC)
 *
 * Dipakai oleh test blocking di contrast.test.ts. Aturan ambang ada di
 * docs/DESIGN-SYSTEM.md Bab 7 dan merupakan persyaratan aksesibilitas,
 * bukan preferensi.
 *
 * Rumus: WCAG 2.1 relative luminance dan contrast ratio.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */

export type Rgb = { r: number; g: number; b: number };

/** Ambang WCAG AA (docs/DESIGN-SYSTEM.md Bab 7). */
export const WCAG_AA = {
  /** Teks normal. */
  normalText: 4.5,
  /** Teks besar: >=24px, atau >=19px bold. */
  largeText: 3,
  /** Komponen UI dan ikon. */
  uiComponent: 3,
} as const;

export function hexToRgb(hex: string): Rgb {
  const clean = hex.trim().replace(/^#/, '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`Nilai hex tidak valid: "${hex}"`);
  }

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

/** Relative luminance menurut WCAG 2.1. */
export function relativeLuminance(color: Rgb | string): number {
  const { r, g, b } = typeof color === 'string' ? hexToRgb(color) : color;

  const channel = (v: number): number => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * Rasio kontras antara dua warna. Urutan tidak berpengaruh — hasilnya sama
 * baik foreground/background ditukar atau tidak.
 */
export function contrastRatio(a: Rgb | string, b: Rgb | string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Dibulatkan 2 desimal untuk pelaporan yang mudah dibaca. */
export function contrastRatioRounded(a: Rgb | string, b: Rgb | string): number {
  return Math.round(contrastRatio(a, b) * 100) / 100;
}

export function meetsAA(
  foreground: Rgb | string,
  background: Rgb | string,
  level: keyof typeof WCAG_AA = 'normalText'
): boolean {
  return contrastRatio(foreground, background) >= WCAG_AA[level];
}
