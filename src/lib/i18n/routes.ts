/**
 * Peta rute bilingual — SUMBER KEBENARAN TUNGGAL
 *
 * Setiap rute punya slug ID dan slug EN yang BERBEDA, bukan sekadar prefix.
 * Slug adalah sinyal keyword (PLAN Bab 7.1), jadi `/pelatihan/` harus menjadi
 * `/en/training/`, bukan `/en/pelatihan/`.
 *
 * File ini adalah satu-satunya sumber untuk:
 *  - hreflang di setiap halaman
 *  - pengalih bahasa di header dan drawer
 *  - breadcrumb
 *  - sitemap
 *  - halaman /peta-situs
 *
 * Menambah halaman berarti menambah entri di sini lebih dulu. Halaman yang
 * tidak terdaftar tidak akan punya padanan bahasa yang benar.
 */

export const LOCALES = ['id', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

/** Bahasa Indonesia di root, Inggris di prefix /en/ (D-02). */
export const DEFAULT_LOCALE: Locale = 'id';

export type RouteKey =
  | 'home'
  | 'training'
  | 'trainingRoadmap'
  | 'schedule'
  | 'services'
  | 'servicesWindowCleaning'
  | 'servicesSealant'
  | 'servicesFacadeInspection'
  | 'facilities'
  | 'instructors'
  | 'gallery'
  | 'articles'
  | 'about'
  | 'contact'
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'disclaimer'
  | 'cookies'
  | 'refund'
  | 'hsePolicy'
  | 'accessibility'
  | 'sitemapHtml';

type RouteDef = {
  /** Segmen path tanpa prefix locale dan tanpa garis miring di ujung. */
  readonly id: string;
  readonly en: string;
  /** Label menu per bahasa. */
  readonly label: { readonly id: string; readonly en: string };
};

/**
 * ⚠️ CATATAN D-17: "E-Learning" TIDAK ada di peta ini dan tidak boleh
 * ditambahkan. Keputusan sudah ditutup — layanan itu tidak akan dibuat.
 * Menu yang menjanjikan sesuatu yang tidak ada merusak kepercayaan.
 */
export const ROUTES: Readonly<Record<RouteKey, RouteDef>> = {
  home: { id: '', en: '', label: { id: 'Beranda', en: 'Home' } },

  training: { id: 'pelatihan', en: 'training', label: { id: 'Pelatihan', en: 'Training' } },
  trainingRoadmap: {
    id: 'pelatihan/rencana-irata-sprat',
    en: 'training/irata-sprat-roadmap',
    label: { id: 'Rencana Pengembangan', en: 'Development Roadmap' },
  },

  schedule: { id: 'jadwal', en: 'schedule', label: { id: 'Jadwal', en: 'Schedule' } },

  services: { id: 'layanan', en: 'services', label: { id: 'Layanan', en: 'Services' } },
  servicesWindowCleaning: {
    id: 'layanan/pembersihan-kaca-gedung',
    en: 'services/high-rise-window-cleaning',
    label: { id: 'Pembersihan Kaca Gedung', en: 'High-Rise Window Cleaning' },
  },
  servicesSealant: {
    id: 'layanan/sealant-kaca-gedung',
    en: 'services/facade-sealant-replacement',
    label: { id: 'Sealant Kaca Gedung', en: 'Facade Sealant Replacement' },
  },
  servicesFacadeInspection: {
    id: 'layanan/inspeksi-fasad',
    en: 'services/facade-inspection',
    label: { id: 'Inspeksi Fasad', en: 'Facade Inspection' },
  },

  facilities: { id: 'fasilitas', en: 'facilities', label: { id: 'Fasilitas', en: 'Facilities' } },
  instructors: {
    id: 'instruktur',
    en: 'instructors',
    label: { id: 'Instruktur', en: 'Instructors' },
  },
  gallery: { id: 'galeri', en: 'gallery', label: { id: 'Galeri', en: 'Gallery' } },
  articles: { id: 'artikel', en: 'articles', label: { id: 'Artikel', en: 'Articles' } },
  about: { id: 'tentang-kami', en: 'about', label: { id: 'Tentang Kami', en: 'About Us' } },
  contact: { id: 'kontak', en: 'contact', label: { id: 'Kontak', en: 'Contact' } },
  faq: { id: 'faq', en: 'faq', label: { id: 'FAQ', en: 'FAQ' } },

  // Legal (PLAN Bab 7.2)
  privacy: {
    id: 'kebijakan-privasi',
    en: 'privacy-policy',
    label: { id: 'Kebijakan Privasi', en: 'Privacy Policy' },
  },
  terms: {
    id: 'syarat-ketentuan',
    en: 'terms-of-service',
    label: { id: 'Syarat & Ketentuan', en: 'Terms of Service' },
  },
  disclaimer: { id: 'disclaimer', en: 'disclaimer', label: { id: 'Disclaimer', en: 'Disclaimer' } },
  cookies: {
    id: 'kebijakan-cookie',
    en: 'cookie-policy',
    label: { id: 'Kebijakan Cookie', en: 'Cookie Policy' },
  },
  refund: {
    id: 'kebijakan-pembatalan-refund',
    en: 'cancellation-refund-policy',
    label: { id: 'Pembatalan & Refund', en: 'Cancellation & Refund' },
  },
  hsePolicy: {
    id: 'kebijakan-k3',
    en: 'hse-policy',
    label: { id: 'Kebijakan K3', en: 'HSE Policy' },
  },
  accessibility: {
    id: 'aksesibilitas',
    en: 'accessibility',
    label: { id: 'Aksesibilitas', en: 'Accessibility' },
  },
  sitemapHtml: {
    id: 'peta-situs',
    en: 'sitemap',
    label: { id: 'Peta Situs', en: 'Sitemap' },
  },
} as const;

/** Path absolut sebuah rute pada locale tertentu, selalu diakhiri `/`. */
export function routePath(key: RouteKey, locale: Locale): string {
  const seg = ROUTES[key][locale];
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return seg === '' ? `${prefix}/` : `${prefix}/${seg}/`;
}

/** Label menu sebuah rute. */
export function routeLabel(key: RouteKey, locale: Locale): string {
  return ROUTES[key].label[locale];
}

/**
 * Locale dari sebuah URL. Prefix `/en/` (dan `/en` persis) berarti Inggris;
 * selebihnya Indonesia.
 */
export function getLocale(url: URL | string): Locale {
  const path = typeof url === 'string' ? url : url.pathname;
  return path === '/en' || path.startsWith('/en/') ? 'en' : DEFAULT_LOCALE;
}

/** Membuang prefix locale dari sebuah path, menyisakan segmen murni. */
function stripLocale(path: string): string {
  const p = path.startsWith('/en/') ? path.slice(3) : path === '/en' ? '/' : path;
  return p.replace(/^\/+/, '').replace(/\/+$/, '');
}

/** Mencari RouteKey dari sebuah path, atau null kalau tidak terdaftar. */
export function findRouteKey(path: string): RouteKey | null {
  const seg = stripLocale(path);
  const locale = getLocale(path);
  const entries = Object.entries(ROUTES) as Array<[RouteKey, RouteDef]>;

  // Cocokkan pada locale halaman itu sendiri lebih dulu, baru locale lain.
  // Tanpa ini, slug yang kebetulan sama di kedua bahasa (mis. "faq") bisa
  // menghasilkan padanan yang salah.
  const exact = entries.find(([, def]) => def[locale] === seg);
  if (exact) return exact[0];

  const other = entries.find(([, def]) => LOCALES.some((l) => def[l] === seg));
  return other ? other[0] : null;
}

export type Alternate = { locale: Locale; path: string };

/**
 * Padanan URL sebuah halaman di seluruh bahasa — dasar hreflang dan pengalih
 * bahasa.
 *
 * Untuk rute yang TIDAK terdaftar (mis. `/artikel/[slug]` yang datang dari
 * database), kembalikan `null`. Pemanggil wajib menyediakan padanannya sendiri
 * dari `translation_group_id`. Menebak dengan menambahkan prefix `/en` akan
 * menghasilkan hreflang yang menunjuk halaman 404 — lebih buruk daripada tidak
 * ada hreflang sama sekali.
 */
export function getAlternates(path: string): Alternate[] | null {
  const key = findRouteKey(path);
  if (!key) return null;
  return LOCALES.map((locale) => ({ locale, path: routePath(key, locale) }));
}

/** Padanan sebuah path di locale lain, atau beranda locale itu kalau tidak ada. */
export function localizedPath(path: string, target: Locale): string {
  const key = findRouteKey(path);
  // PLAN Bab 8.4: kalau padanan berkualitas belum ada, arahkan ke BERANDA
  // bahasa itu — bukan ke halaman setengah jadi.
  return key ? routePath(key, target) : routePath('home', target);
}

/** Seluruh rute statis, untuk sitemap dan halaman peta situs. */
export function allRouteKeys(): RouteKey[] {
  return Object.keys(ROUTES) as RouteKey[];
}

/** Menu utama — maksimal 6 item (PLAN Bab 7.3, A-04). */
export const MAIN_NAV: ReadonlyArray<{ key: RouteKey; children?: RouteKey[] }> = [
  {
    key: 'training',
    // A-04: "Sertifikasi" adalah SUBMENU Pelatihan, bukan item setara —
    // keduanya melayani intent yang sama dan akan saling mengkanibal keyword.
    children: ['trainingRoadmap'],
  },
  { key: 'schedule' },
  {
    key: 'services',
    children: ['servicesWindowCleaning', 'servicesSealant', 'servicesFacadeInspection'],
  },
  { key: 'articles' },
  { key: 'about' },
  { key: 'contact' },
] as const;

/** Kolom legal di footer. */
export const LEGAL_NAV: readonly RouteKey[] = [
  'privacy',
  'terms',
  'disclaimer',
  'cookies',
  'refund',
  'hsePolicy',
  'accessibility',
  'sitemapHtml',
] as const;
