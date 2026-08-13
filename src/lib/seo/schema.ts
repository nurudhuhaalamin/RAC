/**
 * Generator JSON-LD — Rope Access Center (RAC)
 *
 * Spesifikasi: docs/PLAN.md Bab 8.2.
 *
 * Aturan yang ditegakkan di seluruh file ini:
 *  - Generator menerima DATA TERSTRUKTUR, bukan string HTML
 *  - Tanggal selalu ISO 8601
 *  - URL selalu absolut
 *  - Field opsional DIHILANGKAN kalau kosong — jangan diisi null atau ""
 *  - Output digabung sebagai array @graph dalam SATU <script>
 *
 * `Course` + `hasCourseInstance` adalah sumber rich result utama proyek ini.
 * Digenerate dari database, tidak pernah ditulis manual — schema yang ditulis
 * manual basi dalam hitungan minggu, dan schema basi lebih merugikan daripada
 * tidak ada schema.
 *
 * ⚠️ D-05: schema `Course` hanya boleh dibuat untuk skema BNSP dan Kemnaker.
 * Asosiasi internasional yang dibatasi D-05 tidak boleh punya entri kursus,
 * harga, jadwal, maupun schema `Course`. Lihat docs/PLAN.md Bab 3.
 */

export type JsonLdValue =
  string | number | boolean | JsonLdObject | Array<JsonLdValue | undefined | null>;

export interface JsonLdObject {
  [key: string]: JsonLdValue | undefined | null;
}

/**
 * Membuang field yang kosong secara rekursif.
 *
 * Google memperlakukan `"field": null` dan `"field": ""` sebagai data yang ada
 * tapi tidak valid, bukan sebagai data yang tidak ada. Menghilangkannya sama
 * sekali jauh lebih aman daripada mengirim nilai kosong.
 */
export function compact<T extends JsonLdObject>(obj: T): T {
  const out: JsonLdObject = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) {
      const arr = value
        .filter((v) => v !== undefined && v !== null && v !== '')
        .map((v) => (typeof v === 'object' && !Array.isArray(v) ? compact(v as JsonLdObject) : v));
      if (arr.length > 0) out[key] = arr as JsonLdValue;
      continue;
    }
    if (typeof value === 'object') {
      const nested = compact(value as JsonLdObject);
      if (Object.keys(nested).length > 0) out[key] = nested;
      continue;
    }
    out[key] = value;
  }
  return out as T;
}

/** URL absolut dari path relatif. Melempar kalau `site` bukan URL absolut. */
export function absoluteUrl(path: string, site: string): string {
  return new URL(path, site).href;
}

/** Tanggal ke ISO 8601. Menerima Date atau string yang bisa di-parse. */
export function isoDate(value: Date | string): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) throw new Error(`Tanggal tidak valid: ${String(value)}`);
  return d.toISOString();
}

/** Tanggal saja (YYYY-MM-DD) — dipakai `startDate` CourseInstance. */
export function isoDateOnly(value: Date | string): string {
  return isoDate(value).slice(0, 10);
}

// ── Konteks bersama ────────────────────────────────────────────────────────

export type SchemaContext = {
  /** Origin absolut situs, mis. https://contoh.co.id */
  site: string;
  /** Nama organisasi yang ditampilkan. */
  organizationName: string;
};

const ORG_ID = '#organization';
const SITE_ID = '#website';

/** @id stabil supaya node bisa saling merujuk di dalam @graph. */
function nodeId(site: string, fragment: string): string {
  return `${site.replace(/\/$/, '')}/${fragment}`;
}

// ── Organization ───────────────────────────────────────────────────────────

export type OrganizationInput = {
  logoUrl?: string;
  description?: string;
  /** Profil sosial resmi. Kosongkan kalau belum ada — jangan diisi tebakan. */
  sameAs?: string[];
  telephone?: string;
  email?: string;
  address?: PostalAddressInput;
};

export type PostalAddressInput = {
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
};

/**
 * Mengembalikan `undefined` kalau tidak ada satu pun field alamat yang terisi.
 *
 * `compact()` saja tidak cukup di sini: `@type` selalu ada, sehingga objek
 * `{ '@type': 'PostalAddress' }` terlihat "tidak kosong" dan lolos. Node
 * alamat tanpa alamat adalah data tak berguna yang dikirim ke Google.
 */
function postalAddress(a: PostalAddressInput): JsonLdObject | undefined {
  const fields = compact({ ...a });
  if (Object.keys(fields).length === 0) return undefined;
  return { '@type': 'PostalAddress', ...fields };
}

export function organization(ctx: SchemaContext, input: OrganizationInput = {}): JsonLdObject {
  return compact({
    '@type': 'Organization',
    '@id': nodeId(ctx.site, ORG_ID),
    name: ctx.organizationName,
    url: ctx.site,
    logo: input.logoUrl,
    description: input.description,
    sameAs: input.sameAs,
    telephone: input.telephone,
    email: input.email,
    address: input.address ? postalAddress(input.address) : undefined,
  });
}

// ── WebSite (dengan SearchAction) ──────────────────────────────────────────

export function website(ctx: SchemaContext, opts: { searchPath?: string } = {}): JsonLdObject {
  return compact({
    '@type': 'WebSite',
    '@id': nodeId(ctx.site, SITE_ID),
    name: ctx.organizationName,
    url: ctx.site,
    publisher: { '@id': nodeId(ctx.site, ORG_ID) },
    potentialAction: opts.searchPath
      ? {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: absoluteUrl(`${opts.searchPath}?q={search_term_string}`, ctx.site),
          },
          'query-input': 'required name=search_term_string',
        }
      : undefined,
  });
}

// ── EducationalOrganization ────────────────────────────────────────────────

export function educationalOrganization(
  ctx: SchemaContext,
  input: OrganizationInput = {}
): JsonLdObject {
  return compact({
    '@type': 'EducationalOrganization',
    '@id': nodeId(ctx.site, '#educational-organization'),
    name: ctx.organizationName,
    url: ctx.site,
    logo: input.logoUrl,
    description: input.description,
    sameAs: input.sameAs,
    telephone: input.telephone,
    address: input.address ? postalAddress(input.address) : undefined,
  });
}

// ── LocalBusiness ──────────────────────────────────────────────────────────

export type OpeningHours = {
  /** mis. ['Monday','Tuesday'] */
  dayOfWeek: string[];
  /** 'HH:MM' 24 jam */
  opens: string;
  closes: string;
};

export type LocalBusinessInput = OrganizationInput & {
  geo?: { latitude: number; longitude: number };
  openingHours?: OpeningHours[];
  priceRange?: string;
};

export function localBusiness(ctx: SchemaContext, input: LocalBusinessInput = {}): JsonLdObject {
  return compact({
    '@type': 'LocalBusiness',
    '@id': nodeId(ctx.site, '#local-business'),
    name: ctx.organizationName,
    url: ctx.site,
    image: input.logoUrl,
    description: input.description,
    telephone: input.telephone,
    email: input.email,
    priceRange: input.priceRange,
    address: input.address ? postalAddress(input.address) : undefined,
    geo: input.geo
      ? {
          '@type': 'GeoCoordinates',
          latitude: input.geo.latitude,
          longitude: input.geo.longitude,
        }
      : undefined,
    openingHoursSpecification: input.openingHours?.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.dayOfWeek,
      opens: h.opens,
      closes: h.closes,
    })),
  });
}

// ── Course + CourseInstance ────────────────────────────────────────────────

export type CourseInstanceInput = {
  startDate: Date | string;
  endDate: Date | string;
  /** Kota penyelenggaraan. */
  city: string;
  venueName?: string;
  venueAddress?: string;
  /** Harga dalam rupiah. Hilangkan kalau belum ditetapkan — JANGAN isi 0. */
  price?: number;
  url?: string;
  /** mis. 'P5D' (ISO 8601 duration) */
  courseWorkload?: string;
};

export type CourseInput = {
  name: string;
  description: string;
  url: string;
  /** Badan penerbit sertifikat, mis. 'BNSP' atau 'Kemnaker RI'. */
  providerName?: string;
  educationalCredentialAwarded?: string;
  /** ISO 8601 duration, mis. 'P5D'. */
  timeRequired?: string;
  price?: number;
  instances?: CourseInstanceInput[];
};

const CURRENCY = 'IDR';

export function courseInstance(ctx: SchemaContext, input: CourseInstanceInput): JsonLdObject {
  return compact({
    '@type': 'CourseInstance',
    courseMode: 'onsite',
    startDate: isoDateOnly(input.startDate),
    endDate: isoDateOnly(input.endDate),
    courseWorkload: input.courseWorkload,
    url: input.url ? absoluteUrl(input.url, ctx.site) : undefined,
    location: compact({
      '@type': 'Place',
      name: input.venueName,
      address: compact({
        '@type': 'PostalAddress',
        streetAddress: input.venueAddress,
        addressLocality: input.city,
        addressCountry: 'ID',
      }),
    }),
    offers:
      input.price !== undefined && input.price > 0
        ? {
            '@type': 'Offer',
            price: input.price,
            priceCurrency: CURRENCY,
            availability: 'https://schema.org/InStock',
          }
        : undefined,
  });
}

export function course(ctx: SchemaContext, input: CourseInput): JsonLdObject {
  return compact({
    '@type': 'Course',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url, ctx.site),
    provider: compact({
      '@type': 'Organization',
      name: input.providerName ?? ctx.organizationName,
    }),
    educationalCredentialAwarded: input.educationalCredentialAwarded,
    timeRequired: input.timeRequired,
    // Google mewajibkan `offers` ATAU `hasCourseInstance` untuk rich result
    // kursus. Harga yang belum ditetapkan dihilangkan, bukan diisi 0 —
    // harga 0 berarti "gratis", dan itu klaim yang salah.
    offers:
      input.price !== undefined && input.price > 0
        ? { '@type': 'Offer', price: input.price, priceCurrency: CURRENCY }
        : undefined,
    hasCourseInstance: input.instances?.map((i) => courseInstance(ctx, i)),
  });
}

// ── Service ────────────────────────────────────────────────────────────────

export type ServiceInput = {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
  /** Default: Indonesia (D-06 jangkauan nasional). */
  areaServed?: string;
  offerCatalog?: Array<{ name: string; url?: string }>;
};

export function service(ctx: SchemaContext, input: ServiceInput): JsonLdObject {
  return compact({
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url, ctx.site),
    serviceType: input.serviceType,
    provider: { '@id': nodeId(ctx.site, ORG_ID) },
    areaServed: { '@type': 'Country', name: input.areaServed ?? 'Indonesia' },
    hasOfferCatalog: input.offerCatalog?.length
      ? {
          '@type': 'OfferCatalog',
          name: input.name,
          itemListElement: input.offerCatalog.map((o) => ({
            '@type': 'Offer',
            itemOffered: compact({
              '@type': 'Service',
              name: o.name,
              url: o.url ? absoluteUrl(o.url, ctx.site) : undefined,
            }),
          })),
        }
      : undefined,
  });
}

// ── Person (instruktur / penulis) ──────────────────────────────────────────

export type CredentialInput = {
  name: string;
  issuedBy?: string;
  identifier?: string;
  validUntil?: Date | string;
};

export type PersonInput = {
  name: string;
  url?: string;
  jobTitle?: string;
  description?: string;
  imageUrl?: string;
  sameAs?: string[];
  credentials?: CredentialInput[];
};

export function person(ctx: SchemaContext, input: PersonInput): JsonLdObject {
  return compact({
    '@type': 'Person',
    name: input.name,
    url: input.url ? absoluteUrl(input.url, ctx.site) : undefined,
    jobTitle: input.jobTitle,
    description: input.description,
    image: input.imageUrl,
    sameAs: input.sameAs,
    worksFor: { '@id': nodeId(ctx.site, ORG_ID) },
    // E-E-A-T: kredensial yang bisa diverifikasi jauh lebih bernilai daripada
    // bio yang mengesankan (PLAN Bab 10 / DESIGN-SYSTEM).
    hasCredential: input.credentials?.map((c) =>
      compact({
        '@type': 'EducationalOccupationalCredential',
        name: c.name,
        credentialCategory: 'certification',
        identifier: c.identifier,
        validUntil: c.validUntil ? isoDateOnly(c.validUntil) : undefined,
        recognizedBy: c.issuedBy ? { '@type': 'Organization', name: c.issuedBy } : undefined,
      })
    ),
  });
}

// ── Article ────────────────────────────────────────────────────────────────

export type ArticleInput = {
  headline: string;
  description: string;
  url: string;
  datePublished: Date | string;
  dateModified?: Date | string;
  imageUrl?: string;
  author?: PersonInput;
  reviewedBy?: PersonInput;
  wordCount?: number;
  inLanguage?: string;
  section?: string;
};

export function article(ctx: SchemaContext, input: ArticleInput): JsonLdObject {
  return compact({
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: absoluteUrl(input.url, ctx.site),
    mainEntityOfPage: absoluteUrl(input.url, ctx.site),
    datePublished: isoDate(input.datePublished),
    dateModified: input.dateModified ? isoDate(input.dateModified) : undefined,
    image: input.imageUrl,
    wordCount: input.wordCount,
    inLanguage: input.inLanguage,
    articleSection: input.section,
    author: input.author ? person(ctx, input.author) : undefined,
    // Konten K3/regulasi WAJIB punya peninjau (PLAN Bab 9.3). Kalau kosong,
    // field ini hilang — dan ketiadaannya terlihat saat audit.
    reviewedBy: input.reviewedBy ? person(ctx, input.reviewedBy) : undefined,
    publisher: { '@id': nodeId(ctx.site, ORG_ID) },
  });
}

// ── FAQPage ────────────────────────────────────────────────────────────────

export type FaqItem = { question: string; answer: string };

export function faqPage(items: FaqItem[]): JsonLdObject {
  return compact({
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  });
}

// ── BreadcrumbList ─────────────────────────────────────────────────────────

export type Crumb = { name: string; path: string };

export function breadcrumbList(ctx: SchemaContext, crumbs: Crumb[]): JsonLdObject {
  return compact({
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path, ctx.site),
    })),
  });
}

// ── ContactPage ────────────────────────────────────────────────────────────

export function contactPage(ctx: SchemaContext, url: string): JsonLdObject {
  return compact({
    '@type': 'ContactPage',
    url: absoluteUrl(url, ctx.site),
    about: { '@id': nodeId(ctx.site, ORG_ID) },
  });
}

// ── ItemList (halaman daftar: jadwal, artikel) ─────────────────────────────

export function itemList(items: JsonLdObject[]): JsonLdObject {
  return compact({
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item,
    })),
  });
}

// ── Penggabung @graph ──────────────────────────────────────────────────────

/**
 * Menggabungkan seluruh node jadi SATU dokumen JSON-LD.
 *
 * Satu `<script>` berisi `@graph`, bukan beberapa `<script>` terpisah: node
 * bisa saling merujuk lewat `@id`, dan Google memprosesnya sebagai satu
 * kesatuan.
 */
export function graph(nodes: Array<JsonLdObject | undefined | null>): string {
  const clean = nodes.filter((n): n is JsonLdObject => Boolean(n));
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': clean });
}
