/**
 * Test generator JSON-LD — Rope Access Center (RAC)
 *
 * Yang diuji terutama adalah **kasus data tidak lengkap**. Generator schema
 * hampir selalu benar untuk data lengkap; yang merusak rich result adalah
 * field kosong yang tetap dikirim sebagai `null` atau `""`, dan harga `0`
 * yang berarti "gratis".
 */

import { describe, expect, it } from 'vitest';
import {
  absoluteUrl,
  article,
  breadcrumbList,
  compact,
  contactPage,
  course,
  courseInstance,
  educationalOrganization,
  faqPage,
  graph,
  isoDate,
  isoDateOnly,
  itemList,
  localBusiness,
  organization,
  person,
  service,
  website,
  type SchemaContext,
} from './schema';

const ctx: SchemaContext = {
  site: 'https://contoh.test',
  organizationName: 'Rope Access Center',
};

describe('compact', () => {
  it('membuang undefined, null, dan string kosong', () => {
    expect(compact({ a: 'x', b: undefined, c: '', d: 0, e: false })).toEqual({
      a: 'x',
      d: 0,
      e: false,
    });
  });

  it('mempertahankan angka 0 dan boolean false', () => {
    // 0 dan false adalah NILAI, bukan ketiadaan nilai.
    expect(compact({ count: 0, verified: false })).toEqual({ count: 0, verified: false });
  });

  it('membuang objek bersarang yang jadi kosong', () => {
    expect(compact({ a: 'x', nested: { b: undefined, c: '' } })).toEqual({ a: 'x' });
  });

  it('membuang array yang jadi kosong', () => {
    expect(compact({ a: 'x', list: [undefined, ''] })).toEqual({ a: 'x' });
  });

  it('membersihkan objek di dalam array', () => {
    const out = compact({ list: [{ a: 'x', b: undefined }] });
    expect(out.list).toEqual([{ a: 'x' }]);
  });
});

describe('helper URL dan tanggal', () => {
  it('membuat URL absolut', () => {
    expect(absoluteUrl('/pelatihan/', ctx.site)).toBe('https://contoh.test/pelatihan/');
  });

  it('tanggal ISO 8601 penuh', () => {
    expect(isoDate('2026-08-12T00:00:00Z')).toBe('2026-08-12T00:00:00.000Z');
  });

  it('tanggal saja untuk CourseInstance', () => {
    expect(isoDateOnly(new Date('2026-09-01T10:00:00Z'))).toBe('2026-09-01');
  });

  it('melempar untuk tanggal tidak valid, bukan diam-diam menghasilkan NaN', () => {
    expect(() => isoDate('bukan tanggal')).toThrow(/tidak valid/i);
  });
});

describe('organization', () => {
  it('menghasilkan node minimal yang valid tanpa data opsional', () => {
    const o = organization(ctx);
    expect(o['@type']).toBe('Organization');
    expect(o.name).toBe('Rope Access Center');
    expect(o.url).toBe('https://contoh.test');
    // Tidak ada field kosong yang menyelinap masuk.
    expect(o).not.toHaveProperty('logo');
    expect(o).not.toHaveProperty('sameAs');
    expect(o).not.toHaveProperty('address');
  });

  it('menyertakan alamat hanya kalau ada isinya', () => {
    const kosong = organization(ctx, { address: {} });
    expect(kosong).not.toHaveProperty('address');

    const isi = organization(ctx, { address: { addressLocality: 'Jakarta' } });
    expect(isi.address).toMatchObject({ '@type': 'PostalAddress', addressLocality: 'Jakarta' });
  });

  it('punya @id stabil supaya node lain bisa merujuk', () => {
    expect(organization(ctx)['@id']).toBe('https://contoh.test/#organization');
  });
});

describe('website', () => {
  it('tanpa SearchAction kalau searchPath tidak diberikan', () => {
    expect(website(ctx)).not.toHaveProperty('potentialAction');
  });

  it('dengan SearchAction yang urlTemplate-nya absolut', () => {
    const w = website(ctx, { searchPath: '/cari/' });
    const action = w.potentialAction as Record<string, Record<string, string>>;
    expect(action.target?.urlTemplate).toBe('https://contoh.test/cari/?q={search_term_string}');
  });
});

describe('course + courseInstance — sumber rich result utama', () => {
  const base = {
    name: 'Sertifikasi BNSP Rope Access',
    description: 'Sertifikat kompetensi melalui LSP terlisensi BNSP.',
    url: '/pelatihan/sertifikasi-bnsp-rope-access/',
  };

  it('menyertakan provider dan URL absolut', () => {
    const c = course(ctx, { ...base, providerName: 'BNSP' });
    expect(c['@type']).toBe('Course');
    expect(c.url).toBe('https://contoh.test/pelatihan/sertifikasi-bnsp-rope-access/');
    expect(c.provider).toMatchObject({ '@type': 'Organization', name: 'BNSP' });
  });

  it('provider jatuh ke nama organisasi kalau tidak disebut', () => {
    expect(course(ctx, base).provider).toMatchObject({ name: 'Rope Access Center' });
  });

  it('MENGHILANGKAN offers kalau harga belum ditetapkan', () => {
    // Harga 0 di schema berarti GRATIS. Kursus yang harganya belum ditetapkan
    // tidak boleh diiklankan sebagai gratis di hasil pencarian Google.
    expect(course(ctx, base)).not.toHaveProperty('offers');
    expect(course(ctx, { ...base, price: 0 })).not.toHaveProperty('offers');
  });

  it('menyertakan offers kalau harga nyata', () => {
    const c = course(ctx, { ...base, price: 5_000_000 });
    expect(c.offers).toMatchObject({ price: 5_000_000, priceCurrency: 'IDR' });
  });

  it('menghasilkan hasCourseInstance dari daftar batch', () => {
    const c = course(ctx, {
      ...base,
      instances: [
        { startDate: '2026-09-01', endDate: '2026-09-05', city: 'Jakarta' },
        { startDate: '2026-10-01', endDate: '2026-10-05', city: 'Surabaya' },
      ],
    });
    const inst = c.hasCourseInstance as Array<Record<string, unknown>>;
    expect(inst).toHaveLength(2);
    expect(inst[0]).toMatchObject({
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      startDate: '2026-09-01',
      endDate: '2026-09-05',
    });
  });

  it('CourseInstance memuat lokasi dengan negara Indonesia', () => {
    const i = courseInstance(ctx, {
      startDate: '2026-09-01',
      endDate: '2026-09-05',
      city: 'Balikpapan',
      venueName: 'Area Latihan RAC',
    });
    expect(i.location).toMatchObject({
      '@type': 'Place',
      name: 'Area Latihan RAC',
      address: { addressLocality: 'Balikpapan', addressCountry: 'ID' },
    });
  });

  it('CourseInstance tanpa venue tetap valid — hanya kota', () => {
    const i = courseInstance(ctx, {
      startDate: '2026-09-01',
      endDate: '2026-09-05',
      city: 'Jakarta',
    });
    const loc = i.location as Record<string, unknown>;
    expect(loc).not.toHaveProperty('name');
    expect(loc.address).toMatchObject({ addressLocality: 'Jakarta' });
  });

  it('tanggal selalu format YYYY-MM-DD, bukan ISO penuh', () => {
    const i = courseInstance(ctx, {
      startDate: new Date('2026-09-01T08:00:00Z'),
      endDate: new Date('2026-09-05T17:00:00Z'),
      city: 'Jakarta',
    });
    expect(i.startDate).toBe('2026-09-01');
    expect(i.endDate).toBe('2026-09-05');
  });
});

describe('service', () => {
  it('areaServed default Indonesia (D-06 nasional)', () => {
    const s = service(ctx, {
      name: 'Pembersihan Kaca Gedung',
      description: 'Layanan pembersihan fasad dengan metode akses tali.',
      url: '/layanan/pembersihan-kaca-gedung/',
    });
    expect(s.areaServed).toMatchObject({ '@type': 'Country', name: 'Indonesia' });
    expect(s.provider).toMatchObject({ '@id': 'https://contoh.test/#organization' });
  });

  it('menghilangkan hasOfferCatalog kalau daftarnya kosong', () => {
    const s = service(ctx, {
      name: 'X',
      description: 'Y',
      url: '/layanan/x/',
      offerCatalog: [],
    });
    expect(s).not.toHaveProperty('hasOfferCatalog');
  });
});

describe('person — E-E-A-T', () => {
  it('menghasilkan hasCredential per sertifikasi', () => {
    const p = person(ctx, {
      name: 'Nama Instruktur',
      credentials: [
        {
          name: 'TKPK 3',
          issuedBy: 'Kemnaker RI',
          identifier: 'NOMOR-CONTOH',
          validUntil: '2028-01-01',
        },
      ],
    });
    const creds = p.hasCredential as Array<Record<string, unknown>>;
    expect(creds).toHaveLength(1);
    expect(creds[0]).toMatchObject({
      '@type': 'EducationalOccupationalCredential',
      name: 'TKPK 3',
      identifier: 'NOMOR-CONTOH',
      validUntil: '2028-01-01',
      recognizedBy: { '@type': 'Organization', name: 'Kemnaker RI' },
    });
  });

  it('kredensial tanpa nomor tetap valid — nomornya hilang, bukan null', () => {
    const p = person(ctx, { name: 'X', credentials: [{ name: 'TKBT 1' }] });
    const creds = p.hasCredential as Array<Record<string, unknown>>;
    expect(creds[0]).not.toHaveProperty('identifier');
    expect(creds[0]).not.toHaveProperty('recognizedBy');
  });

  it('tanpa kredensial, field-nya hilang seluruhnya', () => {
    expect(person(ctx, { name: 'X' })).not.toHaveProperty('hasCredential');
  });
});

describe('article', () => {
  const base = {
    headline: 'Perbedaan TKPK dan TKBT',
    description: 'Penjelasan perbedaan dua skema sertifikasi Kemnaker.',
    url: '/artikel/perbedaan-tkpk-dan-tkbt/',
    datePublished: '2026-08-01T00:00:00Z',
  };

  it('memuat tanggal ISO dan mainEntityOfPage absolut', () => {
    const a = article(ctx, base);
    expect(a.datePublished).toBe('2026-08-01T00:00:00.000Z');
    expect(a.mainEntityOfPage).toBe('https://contoh.test/artikel/perbedaan-tkpk-dan-tkbt/');
  });

  it('menghilangkan reviewedBy kalau peninjau belum diisi', () => {
    // Ketiadaan peninjau harus TERLIHAT saat audit konten K3, bukan tersamar
    // sebagai field kosong.
    expect(article(ctx, base)).not.toHaveProperty('reviewedBy');
  });

  it('menyertakan reviewedBy untuk konten regulasi', () => {
    const a = article(ctx, { ...base, reviewedBy: { name: 'Ahli K3' } });
    expect(a.reviewedBy).toMatchObject({ '@type': 'Person', name: 'Ahli K3' });
  });

  it('dateModified hilang kalau belum pernah diperbarui', () => {
    expect(article(ctx, base)).not.toHaveProperty('dateModified');
  });
});

describe('faqPage', () => {
  it('memetakan setiap butir jadi Question + acceptedAnswer', () => {
    const f = faqPage([{ question: 'Apa itu TKPK?', answer: 'Sertifikat Kemnaker.' }]);
    const items = f.mainEntity as Array<Record<string, unknown>>;
    expect(items[0]).toMatchObject({
      '@type': 'Question',
      name: 'Apa itu TKPK?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sertifikat Kemnaker.' },
    });
  });
});

describe('breadcrumbList', () => {
  it('memberi position mulai dari 1 dan item absolut', () => {
    const b = breadcrumbList(ctx, [
      { name: 'Beranda', path: '/' },
      { name: 'Pelatihan', path: '/pelatihan/' },
    ]);
    const items = b.itemListElement as Array<Record<string, unknown>>;
    expect(items[0]).toMatchObject({ position: 1, item: 'https://contoh.test/' });
    expect(items[1]).toMatchObject({ position: 2, item: 'https://contoh.test/pelatihan/' });
  });
});

describe('contactPage dan itemList', () => {
  it('contactPage merujuk organisasi lewat @id', () => {
    const c = contactPage(ctx, '/kontak/');
    expect(c.url).toBe('https://contoh.test/kontak/');
    expect(c.about).toMatchObject({ '@id': 'https://contoh.test/#organization' });
  });

  it('itemList memberi position berurutan', () => {
    const l = itemList([{ '@type': 'CourseInstance' }, { '@type': 'CourseInstance' }]);
    const items = l.itemListElement as Array<Record<string, unknown>>;
    expect(items.map((i) => i.position)).toEqual([1, 2]);
  });
});

describe('graph', () => {
  it('menggabungkan node jadi satu dokumen @context + @graph', () => {
    const json = JSON.parse(graph([organization(ctx), website(ctx)])) as Record<string, unknown>;
    expect(json['@context']).toBe('https://schema.org');
    expect(json['@graph']).toHaveLength(2);
  });

  it('membuang node kosong tanpa meninggalkan lubang di array', () => {
    const json = JSON.parse(graph([organization(ctx), undefined, null])) as Record<string, unknown>;
    expect(json['@graph']).toHaveLength(1);
  });

  it('menghasilkan JSON yang valid dan bisa di-parse ulang', () => {
    const out = graph([
      organization(ctx),
      educationalOrganization(ctx),
      localBusiness(ctx, { geo: { latitude: -6.2, longitude: 106.8 } }),
    ]);
    expect(() => JSON.parse(out)).not.toThrow();
    expect(out).not.toContain('undefined');
    expect(out).not.toContain('null');
  });
});
