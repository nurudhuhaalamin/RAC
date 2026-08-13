/**
 * Test kontras — GERBANG BLOCKING (docs/DESIGN-SYSTEM.md Bab 7)
 *
 * Setiap pasangan teks/latar yang benar-benar dipakai di situs diuji terhadap
 * ambang WCAG AA-nya. Ini persyaratan aksesibilitas, bukan preferensi — kalau
 * test ini merah, warnanya yang diperbaiki, bukan ambangnya yang diturunkan.
 *
 * Test ini juga menjaga agar theme.css dan tokens.ts tidak pernah menyimpang.
 */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { WCAG_AA, contrastRatio, contrastRatioRounded, hexToRgb } from './contrast';
import { colors } from './tokens';

// ── Sanity: rumusnya sendiri benar ─────────────────────────────────────────
describe('perhitungan kontras', () => {
  it('hitam di atas putih = 21:1', () => {
    expect(contrastRatioRounded('#000000', '#FFFFFF')).toBe(21);
  });

  it('warna sama = 1:1', () => {
    expect(contrastRatioRounded('#E30613', '#E30613')).toBe(1);
  });

  it('urutan warna tidak berpengaruh', () => {
    const a = contrastRatio(colors.accent[500], colors.brand[900]);
    const b = contrastRatio(colors.brand[900], colors.accent[500]);
    expect(a).toBeCloseTo(b, 10);
  });

  it('menolak hex tidak valid', () => {
    expect(() => hexToRgb('bukan-hex')).toThrow(/tidak valid/i);
    expect(() => hexToRgb('#12345')).toThrow(/tidak valid/i);
  });

  it('menerima bentuk pendek 3 digit', () => {
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
  });
});

// ── Tabel pemakaian nyata (DESIGN-SYSTEM Bab 3.1 dan Bab 7) ────────────────
type Pair = {
  nama: string;
  fg: string;
  bg: string;
  level: keyof typeof WCAG_AA;
};

const pasangan: Pair[] = [
  // Latar terang
  {
    nama: 'Teks utama di latar terang (brand-900 / putih)',
    fg: colors.brand[900],
    bg: colors.surface.base,
    level: 'normalText',
  },
  {
    nama: 'Teks sekunder di latar terang (neutral-700 / putih)',
    fg: colors.neutral[700],
    bg: colors.surface.base,
    level: 'normalText',
  },
  {
    nama: 'Eyebrow kecil di latar terang (accent-500 / putih)',
    fg: colors.accent[500],
    bg: colors.surface.base,
    level: 'normalText',
  },
  {
    nama: 'Teks di atas surface-subtle (brand-900 / neutral-50)',
    fg: colors.brand[900],
    bg: colors.surface.subtle,
    level: 'normalText',
  },

  // Latar gelap
  {
    nama: 'Teks utama di latar gelap (putih / brand-900)',
    fg: colors.neutral[0],
    bg: colors.brand[900],
    level: 'normalText',
  },
  {
    nama: 'Teks sekunder di latar gelap (brand-200 / brand-900)',
    fg: colors.brand[200],
    bg: colors.brand[900],
    level: 'normalText',
  },
  {
    // ⚠️ INI ATURAN A-05. accent-500 di posisi ini GAGAL — lihat test terpisah di bawah.
    nama: 'Eyebrow kecil di latar gelap (accent-400 / brand-900)',
    fg: colors.accent[400],
    bg: colors.brand[900],
    level: 'normalText',
  },
  {
    nama: 'Teks utama di kartu gelap (putih / brand-800)',
    fg: colors.neutral[0],
    bg: colors.surface.inverse2,
    level: 'normalText',
  },
  {
    nama: 'Teks sekunder di kartu gelap (brand-200 / brand-800)',
    fg: colors.brand[200],
    bg: colors.surface.inverse2,
    level: 'normalText',
  },

  // Tombol
  {
    nama: 'Tombol primer (putih / accent-500)',
    fg: colors.neutral[0],
    bg: colors.accent[500],
    level: 'normalText',
  },
  {
    nama: 'Tombol primer hover (putih / accent-600)',
    fg: colors.neutral[0],
    bg: colors.accent[600],
    level: 'normalText',
  },
  {
    nama: 'Tombol primer active (putih / accent-700)',
    fg: colors.neutral[0],
    bg: colors.accent[700],
    level: 'normalText',
  },
  {
    nama: 'Tombol sekunder di latar terang (brand-900 / putih)',
    fg: colors.brand[900],
    bg: colors.surface.base,
    level: 'normalText',
  },

  // Teks besar
  {
    nama: 'Headline beraksen di latar gelap (accent-500 / brand-900) — TEKS BESAR',
    fg: colors.accent[500],
    bg: colors.brand[900],
    level: 'largeText',
  },
  {
    nama: 'Headline beraksen di latar terang (accent-500 / putih) — TEKS BESAR',
    fg: colors.accent[500],
    bg: colors.surface.base,
    level: 'largeText',
  },

  // Komponen UI dan ikon
  {
    nama: 'Ikon fitur (accent-500 / putih) — KOMPONEN UI',
    fg: colors.accent[500],
    bg: colors.surface.base,
    level: 'uiComponent',
  },
  {
    nama: 'Cincin fokus di latar terang (accent-500 / putih) — KOMPONEN UI',
    fg: colors.accent[500],
    bg: colors.surface.base,
    level: 'uiComponent',
  },
  {
    nama: 'Cincin fokus di latar gelap (accent-500 / brand-900) — KOMPONEN UI',
    fg: colors.accent[500],
    bg: colors.brand[900],
    level: 'uiComponent',
  },
  {
    // border-default TIDAK diuji di sini: dipakai hanya untuk pembatas dekoratif
    // dan garis kartu, yang di luar cakupan WCAG 2.1 SC 1.4.11. Batas kontrol
    // form memakai border-strong, dan ITU yang wajib >=3:1.
    nama: 'Batas kontrol form (border-strong / putih) — KOMPONEN UI',
    fg: colors.border.strong,
    bg: colors.surface.base,
    level: 'uiComponent',
  },

  // Semantik
  {
    nama: 'Pesan error (danger-text / putih)',
    fg: colors.semanticText.danger,
    bg: colors.surface.base,
    level: 'normalText',
  },
  {
    nama: 'Pesan sukses (success-text / putih)',
    fg: colors.semanticText.success,
    bg: colors.surface.base,
    level: 'normalText',
  },
  {
    nama: 'Pesan peringatan (warning-text / putih)',
    fg: colors.semanticText.warning,
    bg: colors.surface.base,
    level: 'normalText',
  },
  {
    nama: 'Pesan info (info-text / putih)',
    fg: colors.semanticText.info,
    bg: colors.surface.base,
    level: 'normalText',
  },
];

describe('kontras WCAG AA — seluruh pasangan yang dipakai', () => {
  it.each(pasangan)('$nama', ({ fg, bg, level }) => {
    const ratio = contrastRatioRounded(fg, bg);
    const ambang = WCAG_AA[level];
    expect(
      ratio,
      `${fg} di atas ${bg} = ${ratio}:1, butuh minimal ${ambang}:1`
    ).toBeGreaterThanOrEqual(ambang);
  });
});

// ── A-05: aturan yang melahirkan token accent-400 ──────────────────────────
describe('A-05 — teks merah kecil di latar gelap', () => {
  it('accent-500 di atas navy GAGAL untuk teks normal — inilah alasan accent-400 ada', () => {
    const ratio = contrastRatio(colors.accent[500], colors.brand[900]);
    expect(ratio).toBeLessThan(WCAG_AA.normalText);
  });

  it('accent-500 di atas navy LOLOS untuk teks besar', () => {
    const ratio = contrastRatio(colors.accent[500], colors.brand[900]);
    expect(ratio).toBeGreaterThanOrEqual(WCAG_AA.largeText);
  });

  it('accent-400 di atas navy LOLOS untuk teks normal', () => {
    const ratio = contrastRatio(colors.accent[400], colors.brand[900]);
    expect(ratio).toBeGreaterThanOrEqual(WCAG_AA.normalText);
  });
});

// ── A-13: token Bab 3 yang TIDAK boleh dipakai sebagai teks ───────────────
describe('A-13 — token semantik asli tidak memenuhi ambang teks', () => {
  it('success #16A34A gagal untuk teks normal — inilah alasan success-text ada', () => {
    expect(contrastRatio(colors.semantic.success, colors.surface.base)).toBeLessThan(
      WCAG_AA.normalText
    );
  });

  it('warning #D97706 gagal untuk teks normal — inilah alasan warning-text ada', () => {
    expect(contrastRatio(colors.semantic.warning, colors.surface.base)).toBeLessThan(
      WCAG_AA.normalText
    );
  });

  it('border-default gagal untuk batas kontrol — inilah alasan border-strong ada', () => {
    expect(contrastRatio(colors.border.default, colors.surface.base)).toBeLessThan(
      WCAG_AA.uiComponent
    );
  });
});

// ── Konsistensi theme.css <-> tokens.ts ────────────────────────────────────
describe('tokens.ts tidak menyimpang dari theme.css', () => {
  const themeCss = readFileSync('src/styles/theme.css', 'utf8');

  const semua: Array<[string, string]> = [
    ...Object.entries(colors.brand).map(([k, v]) => [`--color-brand-${k}`, v] as [string, string]),
    ...Object.entries(colors.accent).map(
      ([k, v]) => [`--color-accent-${k}`, v] as [string, string]
    ),
    ...Object.entries(colors.neutral).map(
      ([k, v]) => [`--color-neutral-${k}`, v] as [string, string]
    ),
  ];

  it.each(semua)('%s = %s di theme.css', (varName, hex) => {
    const re = new RegExp(`${varName}\\s*:\\s*(#[0-9a-fA-F]{3,8})`);
    const match = themeCss.match(re);
    expect(match, `${varName} tidak ditemukan di theme.css`).not.toBeNull();
    expect(match?.[1]?.toLowerCase()).toBe(hex.toLowerCase());
  });
});

// ── Laporan tabel: dicetak supaya bisa dibaca manusia di output CI ─────────
describe('laporan', () => {
  it('mencetak tabel kontras', () => {
    const rows = pasangan.map((p) => ({
      Pasangan: p.nama,
      Rasio: `${contrastRatioRounded(p.fg, p.bg)}:1`,
      Ambang: `${WCAG_AA[p.level]}:1`,
      Status: contrastRatio(p.fg, p.bg) >= WCAG_AA[p.level] ? 'LULUS' : 'GAGAL',
    }));
    // eslint-disable-next-line no-console
    console.table(rows);
    expect(rows.every((r) => r.Status === 'LULUS')).toBe(true);
  });
});
