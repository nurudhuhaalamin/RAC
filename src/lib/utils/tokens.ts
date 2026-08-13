/**
 * Nilai token warna dalam TypeScript — Rope Access Center (RAC)
 *
 * Sumber kebenaran tetap `src/styles/theme.css` (disalin dari
 * docs/DESIGN-SYSTEM.md Bab 3). File ini hanya cermin untuk keperluan test
 * kontras, karena test tidak bisa membaca custom property CSS.
 *
 * ⚠️ Kalau theme.css berubah, file ini WAJIB ikut berubah. Test
 * `tokens.test.ts` memverifikasi keduanya tidak pernah menyimpang.
 */

export const colors = {
  brand: {
    50: '#F2F5F8',
    100: '#E2E8EF',
    200: '#C5D0DE',
    300: '#9AACC2',
    400: '#6B82A0',
    500: '#47607F',
    600: '#2F4763',
    700: '#1E3350',
    800: '#14243B',
    900: '#0D1B2A',
    950: '#070E17',
  },
  accent: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FDC9C9',
    300: '#FA9C9C',
    400: '#F45E5E',
    500: '#E30613',
    600: '#C4050F',
    700: '#A2040D',
    800: '#7E030A',
    900: '#5C0207',
  },
  neutral: {
    0: '#FFFFFF',
    50: '#F2F4F7',
    200: '#D1D5DB',
    400: '#9CA3AF',
    600: '#6B7177',
    700: '#4B4F56',
    900: '#222529',
  },
  semantic: {
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
    info: '#2563EB',
  },
  surface: {
    base: '#FFFFFF',
    subtle: '#F2F4F7',
    inverse: '#0D1B2A',
    inverse2: '#14243B',
  },
  border: {
    /** Dekoratif saja: pembatas dan garis kartu. Di luar cakupan WCAG 1.4.11. */
    default: '#D1D5DB',
    /** Batas kontrol form — WAJIB terlihat untuk mengenali kontrolnya (A-13). */
    strong: '#7C838C',
    inverse: '#1E3350',
  },
  /** Turunan aksesibilitas (A-13) — dipakai untuk TEKS, bukan isian. */
  semanticText: {
    success: '#15803D',
    warning: '#B45309',
    danger: '#DC2626',
    info: '#2563EB',
  },
} as const;
