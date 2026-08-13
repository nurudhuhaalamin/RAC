/**
 * Konfigurasi situs untuk SEO — Rope Access Center (RAC)
 *
 * ⚠️ Nilai di sini yang bertanda TODO WAJIB diisi dari docs/FAKTA-BISNIS.md.
 * Jangan mengarang alamat, koordinat, nomor telepon, atau akun sosial —
 * schema LocalBusiness yang salah dikirim ke Google Business Profile dan
 * memengaruhi hasil pencarian lokal.
 */

import type { LocalBusinessInput, SchemaContext } from './schema';

export const SITE_NAME = 'Rope Access Center';
export const SITE_TAGLINE = 'Training, Certification, & Corporate Services';

/** Origin situs. Diambil dari astro.config `site`, yang membaca PUBLIC_SITE_URL. */
export function schemaContext(site: URL | string | undefined): SchemaContext {
  return {
    site: (site ? site.toString() : 'https://example.com').replace(/\/$/, ''),
    organizationName: SITE_NAME,
  };
}

/**
 * Data organisasi untuk schema.
 *
 * Seluruh field faktual masih `undefined` — BUKAN diisi contoh. Field yang
 * `undefined` dihilangkan dari JSON-LD oleh `compact()`, sehingga schema tetap
 * valid meski belum lengkap. Mengisi tebakan justru menghasilkan schema yang
 * valid tapi SALAH, dan itu jauh lebih sulit ketahuan.
 */
export const organizationData: LocalBusinessInput = {
  description: undefined, // TODO: deskripsi resmi perusahaan
  telephone: undefined, // TODO: docs/FAKTA-BISNIS.md Bab 3
  email: undefined, // TODO: docs/FAKTA-BISNIS.md Bab 3
  sameAs: undefined, // TODO: akun sosial resmi — Bab 3
  address: {
    streetAddress: undefined, // TODO: Bab 1 (O-03)
    addressLocality: undefined,
    addressRegion: undefined,
    postalCode: undefined,
    addressCountry: 'ID',
  },
  geo: undefined, // TODO: koordinat untuk LocalBusiness — Bab 1
  openingHours: undefined, // TODO: jam operasional — Bab 1
};
