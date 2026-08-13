/**
 * Helper i18n — Rope Access Center (RAC)
 *
 * Aturan: SETIAP teks yang terlihat pengguna melewati helper ini.
 * Dilarang string hardcode di komponen (CLAUDE.md).
 *
 * Pemakaian di komponen:
 *   const d = getDictionary(locale);
 *   <span>{d.nav.ctaWhatsapp}</span>
 *
 * Akses langsung seperti ini sudah type-safe penuh: salah ketik kunci jadi
 * error TypeScript. Tidak dipakai helper `t('nav.ctaWhatsapp')` berbasis
 * string bertitik, karena tipe rekursif untuk memvalidasinya membuat compiler
 * bekerja jauh lebih berat tanpa menambah keamanan apa pun.
 */

import { en } from './dictionaries/en';
import { id, type Dictionary } from './dictionaries/id';
import { DEFAULT_LOCALE, type Locale } from './routes';

const dictionaries: Readonly<Record<Locale, Dictionary>> = { id, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Locale yang valid, atau default kalau nilainya bukan locale yang dikenal. */
export function coerceLocale(value: string | undefined | null): Locale {
  return value === 'en' || value === 'id' ? value : DEFAULT_LOCALE;
}

/** Kode bahasa untuk atribut `lang` dan `hreflang`. */
export function htmlLang(locale: Locale): string {
  return locale === 'id' ? 'id-ID' : 'en';
}

export {
  DEFAULT_LOCALE,
  LEGAL_NAV,
  LOCALES,
  MAIN_NAV,
  ROUTES,
  allRouteKeys,
  findRouteKey,
  getAlternates,
  getLocale,
  localizedPath,
  routeLabel,
  routePath,
  type Alternate,
  type Locale,
  type RouteKey,
} from './routes';
export type { Dictionary };
