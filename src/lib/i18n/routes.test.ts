/**
 * Test peta rute — Rope Access Center (RAC)
 *
 * `routes.ts` adalah sumber kebenaran tunggal untuk hreflang, pengalih bahasa,
 * breadcrumb, dan sitemap. Kalau ia salah, SELURUH sistem bilingual ikut salah,
 * dan salahnya tidak terlihat sampai Google melaporkannya berminggu-minggu
 * kemudian. Karena itu test di sini lebih rinci daripada tampak perlu.
 */

import { describe, expect, it } from 'vitest';
import {
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
  type RouteKey,
} from './routes';

describe('getLocale', () => {
  it.each([
    ['/', 'id'],
    ['/pelatihan/', 'id'],
    ['/jadwal/', 'id'],
    ['/en', 'en'],
    ['/en/', 'en'],
    ['/en/training/', 'en'],
  ])('%s -> %s', (path, expected) => {
    expect(getLocale(path)).toBe(expected);
  });

  it('tidak salah mengira path yang KEBETULAN diawali "en"', () => {
    // `/energi/` bukan bahasa Inggris. Pengecekan naif `startsWith('/en')`
    // akan salah di sini.
    expect(getLocale('/energi/')).toBe('id');
    expect(getLocale('/entah/')).toBe('id');
  });

  it('menerima objek URL', () => {
    expect(getLocale(new URL('https://contoh.test/en/training/'))).toBe('en');
    expect(getLocale(new URL('https://contoh.test/pelatihan/'))).toBe('id');
  });
});

describe('routePath', () => {
  it('beranda ID di root, beranda EN di /en/', () => {
    expect(routePath('home', 'id')).toBe('/');
    expect(routePath('home', 'en')).toBe('/en/');
  });

  it('menerjemahkan slug, bukan sekadar menambah prefix', () => {
    expect(routePath('training', 'id')).toBe('/pelatihan/');
    expect(routePath('training', 'en')).toBe('/en/training/');
    expect(routePath('schedule', 'id')).toBe('/jadwal/');
    expect(routePath('schedule', 'en')).toBe('/en/schedule/');
  });

  it('menangani rute bersarang', () => {
    expect(routePath('servicesSealant', 'id')).toBe('/layanan/sealant-kaca-gedung/');
    expect(routePath('servicesSealant', 'en')).toBe('/en/services/facade-sealant-replacement/');
  });

  it('setiap path diakhiri garis miring dan diawali garis miring', () => {
    for (const key of allRouteKeys()) {
      for (const locale of LOCALES) {
        const p = routePath(key, locale);
        expect(p.startsWith('/'), `${key}/${locale} tidak diawali /`).toBe(true);
        expect(p.endsWith('/'), `${key}/${locale} tidak diakhiri /`).toBe(true);
        expect(p, `${key}/${locale} punya garis miring ganda`).not.toMatch(/\/\//);
      }
    }
  });
});

describe('getAlternates — dasar hreflang', () => {
  it('mengembalikan kedua bahasa dengan path yang benar', () => {
    const alt = getAlternates('/pelatihan/');
    expect(alt).toEqual([
      { locale: 'id', path: '/pelatihan/' },
      { locale: 'en', path: '/en/training/' },
    ]);
  });

  it('konsisten dari arah mana pun', () => {
    expect(getAlternates('/en/training/')).toEqual(getAlternates('/pelatihan/'));
  });

  it('bekerja tanpa garis miring di ujung', () => {
    expect(getAlternates('/pelatihan')).toEqual(getAlternates('/pelatihan/'));
  });

  it('mengembalikan null untuk rute dinamis yang tidak terdaftar', () => {
    // Halaman dari database (artikel, kursus, batch) TIDAK boleh ditebak.
    // Menebak dengan menambahkan /en menghasilkan hreflang yang menunjuk 404 —
    // lebih buruk daripada tidak ada hreflang sama sekali.
    expect(getAlternates('/artikel/apa-itu-rope-access/')).toBeNull();
    expect(getAlternates('/jadwal/batch-jakarta-september/')).toBeNull();
  });
});

describe('findRouteKey', () => {
  it('menemukan kunci dari kedua bahasa', () => {
    expect(findRouteKey('/pelatihan/')).toBe('training');
    expect(findRouteKey('/en/training/')).toBe('training');
  });

  it('memilih rute pada locale halaman itu sendiri saat slug identik', () => {
    // `faq` punya slug SAMA di kedua bahasa. Tanpa penanganan khusus,
    // pencocokan bisa jatuh ke entri yang salah.
    expect(findRouteKey('/faq/')).toBe('faq');
    expect(findRouteKey('/en/faq/')).toBe('faq');
  });

  it('mengembalikan null untuk path tak dikenal', () => {
    expect(findRouteKey('/tidak-ada/')).toBeNull();
  });
});

describe('localizedPath — pengalih bahasa', () => {
  it('mengarah ke padanan yang benar', () => {
    expect(localizedPath('/pelatihan/', 'en')).toBe('/en/training/');
    expect(localizedPath('/en/services/facade-inspection/', 'id')).toBe('/layanan/inspeksi-fasad/');
  });

  it('mengarah ke BERANDA bahasa itu kalau padanan tidak ada', () => {
    // PLAN Bab 8.4: jangan pernah mengarahkan ke halaman setengah jadi.
    expect(localizedPath('/artikel/gaji-teknisi-rope-access/', 'en')).toBe('/en/');
    expect(localizedPath('/en/articles/some-slug/', 'id')).toBe('/');
  });
});

describe('integritas peta rute', () => {
  it('tidak ada slug duplikat dalam satu bahasa', () => {
    for (const locale of LOCALES) {
      const slugs = allRouteKeys().map((k) => ROUTES[k][locale]);
      const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
      expect(dupes, `slug duplikat di locale ${locale}: ${dupes.join(', ')}`).toEqual([]);
    }
  });

  it('setiap rute punya slug dan label di KEDUA bahasa', () => {
    for (const key of allRouteKeys()) {
      for (const locale of LOCALES) {
        expect(ROUTES[key][locale], `${key}.${locale} tidak terdefinisi`).toBeTypeOf('string');
        expect(routeLabel(key, locale).length, `label ${key}.${locale} kosong`).toBeGreaterThan(0);
      }
    }
  });

  it('slug tidak diawali atau diakhiri garis miring', () => {
    for (const key of allRouteKeys()) {
      for (const locale of LOCALES) {
        const seg = ROUTES[key][locale];
        expect(seg.startsWith('/'), `${key}.${locale} diawali /`).toBe(false);
        expect(seg.endsWith('/'), `${key}.${locale} diakhiri /`).toBe(false);
      }
    }
  });

  it('hanya beranda yang punya slug kosong', () => {
    const kosong = allRouteKeys().filter((k) => ROUTES[k].id === '' || ROUTES[k].en === '');
    expect(kosong).toEqual(['home']);
  });
});

describe('MAIN_NAV — PLAN Bab 7.3 dan A-04', () => {
  it('maksimal 6 item', () => {
    expect(MAIN_NAV.length).toBeLessThanOrEqual(6);
  });

  it('urutannya menempatkan Pelatihan lebih dulu (D-01: training center primer)', () => {
    expect(MAIN_NAV[0]?.key).toBe('training');
  });

  it('memuat Jadwal dan Artikel di menu utama, bukan hanya di footer', () => {
    // DESIGN-SYSTEM Bab 2.3: keduanya hilang dari menu mockup, padahal Jadwal
    // adalah sumber rich result CourseInstance dan Artikel adalah muara
    // seluruh klaster konten.
    const keys = MAIN_NAV.map((i) => i.key);
    expect(keys).toContain('schedule');
    expect(keys).toContain('articles');
  });

  it('A-04: sertifikasi BUKAN item menu setara', () => {
    const keys = MAIN_NAV.map((i) => i.key) as string[];
    expect(keys).not.toContain('certification');
  });

  it('D-17: tidak ada E-Learning di mana pun', () => {
    const semua = JSON.stringify({ ROUTES, MAIN_NAV, LEGAL_NAV }).toLowerCase();
    expect(semua).not.toContain('e-learning');
    expect(semua).not.toContain('elearning');
  });

  it('setiap item menu menunjuk rute yang benar-benar ada', () => {
    const valid = new Set<string>(allRouteKeys());
    for (const item of MAIN_NAV) {
      expect(valid.has(item.key), `${item.key} tidak ada di ROUTES`).toBe(true);
      for (const child of item.children ?? []) {
        expect(valid.has(child), `${child} tidak ada di ROUTES`).toBe(true);
      }
    }
  });
});

describe('LEGAL_NAV', () => {
  it('memuat seluruh halaman legal PLAN Bab 7.2', () => {
    const wajib: RouteKey[] = [
      'privacy',
      'terms',
      'disclaimer',
      'cookies',
      'refund',
      'hsePolicy',
      'accessibility',
      'sitemapHtml',
    ];
    for (const k of wajib) expect(LEGAL_NAV).toContain(k);
  });
});

describe('konstanta', () => {
  it('Indonesia adalah bahasa default (D-02)', () => {
    expect(DEFAULT_LOCALE).toBe('id');
  });
});
