/**
 * Skema database — Rope Access Center (RAC)
 *
 * Spesifikasi: docs/PLAN.md Bab 6.1 dan 6.2. Nama tabel, nama kolom, tipe, dan
 * nilai enum mengikuti spesifikasi persis — jangan diubah tanpa memperbarui PLAN.
 *
 * Aturan yang ditegakkan di sini (PLAN Bab 6.2):
 *  - Soft delete pada leads, articles, media (kolom deleted_at)
 *  - translation_group_id sama untuk pasangan ID<->EN — dasar hreflang otomatis
 *  - Index wajib pada kolom yang disebut Bab 6.2 poin 3
 *  - Semua perubahan lewat migration Drizzle, tidak ada ALTER TABLE manual
 */

import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

// ── Helper kolom yang berulang ─────────────────────────────────────────────
const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
};

/** Soft delete: baris tidak pernah benar-benar hilang (PLAN Bab 6.2 poin 2). */
const softDelete = {
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
};

// ── users ──────────────────────────────────────────────────────────────────
export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull(),
    name: text('name').notNull(),
    role: text('role', { enum: ['admin', 'editor', 'sales'] }).notNull(),
    active: integer('active', { mode: 'boolean' }).notNull().default(true),
    createdAt: timestamps.createdAt,
  },
  (t) => [uniqueIndex('users_email_idx').on(t.email)]
);

// ── leads ──────────────────────────────────────────────────────────────────
export const leads = sqliteTable(
  'leads',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    refCode: text('ref_code').notNull(),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    email: text('email'),
    company: text('company'),
    position: text('position'),
    interestType: text('interest_type', {
      enum: ['training', 'service', 'irata_waitlist'],
    }).notNull(),
    scheme: text('scheme', { enum: ['bnsp', 'tkpk', 'tkbt', 'other'] }),
    batchId: integer('batch_id').references(() => batches.id, { onDelete: 'set null' }),
    city: text('city'),
    message: text('message'),
    sourcePage: text('source_page'),
    utmSource: text('utm_source'),
    utmMedium: text('utm_medium'),
    utmCampaign: text('utm_campaign'),
    utmContent: text('utm_content'),
    referrer: text('referrer'),
    status: text('status', {
      enum: ['new', 'contacted', 'qualified', 'quoted', 'won', 'lost'],
    })
      .notNull()
      .default('new'),
    assignedTo: integer('assigned_to').references(() => users.id, { onDelete: 'set null' }),
    locale: text('locale', { enum: ['id', 'en'] })
      .notNull()
      .default('id'),
    /** SHA-256 dari IP + salt. IP mentah TIDAK PERNAH disimpan (UU PDP, PLAN Bab 13.3). */
    ipHash: text('ip_hash'),
    ...timestamps,
    ...softDelete,
  },
  (t) => [
    uniqueIndex('leads_ref_code_idx').on(t.refCode),
    index('leads_created_at_idx').on(t.createdAt),
    index('leads_status_idx').on(t.status),
    index('leads_interest_type_idx').on(t.interestType),
    index('leads_assigned_to_idx').on(t.assignedTo),
  ]
);

// ── lead_activities ────────────────────────────────────────────────────────
export const leadActivities = sqliteTable(
  'lead_activities',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    leadId: integer('lead_id')
      .notNull()
      .references(() => leads.id, { onDelete: 'cascade' }),
    userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
    type: text('type', {
      enum: ['note', 'call', 'wa', 'email', 'status_change'],
    }).notNull(),
    content: text('content'),
    createdAt: timestamps.createdAt,
  },
  (t) => [index('lead_activities_lead_id_idx').on(t.leadId)]
);

// ── courses ────────────────────────────────────────────────────────────────
export const courses = sqliteTable(
  'courses',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull(),
    locale: text('locale', { enum: ['id', 'en'] }).notNull(),
    /** UUID yang SAMA untuk pasangan ID<->EN. Dasar hreflang otomatis. */
    translationGroupId: text('translation_group_id').notNull(),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    scheme: text('scheme', { enum: ['bnsp', 'tkpk', 'tkbt', 'other'] }).notNull(),
    certifyingBody: text('certifying_body').notNull(),
    level: text('level'),
    durationDays: integer('duration_days'),
    prerequisites: text('prerequisites'),
    /** JSON terstruktur, bukan HTML. Dirender jadi daftar di halaman kursus. */
    syllabusJson: text('syllabus_json', { mode: 'json' }),
    price: integer('price'),
    priceNote: text('price_note'),
    capacityDefault: integer('capacity_default'),
    heroImageId: integer('hero_image_id').references(() => media.id, { onDelete: 'set null' }),
    status: text('status', { enum: ['draft', 'published'] })
      .notNull()
      .default('draft'),
    sortOrder: integer('sort_order').notNull().default(0),
    metaTitle: text('meta_title'),
    metaDescription: text('meta_description'),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('courses_slug_locale_idx').on(t.slug, t.locale),
    index('courses_translation_group_idx').on(t.translationGroupId),
    index('courses_status_idx').on(t.status),
  ]
);

// ── batches ────────────────────────────────────────────────────────────────
export const batches = sqliteTable(
  'batches',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    courseId: integer('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
    endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
    city: text('city').notNull(),
    venueName: text('venue_name'),
    venueAddress: text('venue_address'),
    capacity: integer('capacity').notNull(),
    seatsTaken: integer('seats_taken').notNull().default(0),
    priceOverride: integer('price_override'),
    status: text('status', {
      enum: ['scheduled', 'open', 'full', 'running', 'completed', 'cancelled'],
    })
      .notNull()
      .default('scheduled'),
    notes: text('notes'),
    ...timestamps,
  },
  (t) => [
    index('batches_start_date_idx').on(t.startDate),
    index('batches_course_id_idx').on(t.courseId),
    index('batches_status_idx').on(t.status),
  ]
);

// ── registrations ──────────────────────────────────────────────────────────
export const registrations = sqliteTable(
  'registrations',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    leadId: integer('lead_id')
      .notNull()
      .references(() => leads.id, { onDelete: 'cascade' }),
    batchId: integer('batch_id')
      .notNull()
      .references(() => batches.id, { onDelete: 'cascade' }),
    status: text('status', {
      enum: ['inquiry', 'confirmed', 'paid', 'attended', 'cancelled'],
    })
      .notNull()
      .default('inquiry'),
    createdAt: timestamps.createdAt,
  },
  (t) => [
    index('registrations_batch_id_idx').on(t.batchId),
    uniqueIndex('registrations_lead_batch_idx').on(t.leadId, t.batchId),
  ]
);

// ── categories ─────────────────────────────────────────────────────────────
export const categories = sqliteTable(
  'categories',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull(),
    locale: text('locale', { enum: ['id', 'en'] }).notNull(),
    translationGroupId: text('translation_group_id').notNull(),
    name: text('name').notNull(),
    /** Wajib diisi: kategori tanpa deskripsi sendiri = thin content (PLAN Bab 9.1). */
    description: text('description'),
  },
  (t) => [uniqueIndex('categories_slug_locale_idx').on(t.slug, t.locale)]
);

// ── media ──────────────────────────────────────────────────────────────────
export const media = sqliteTable(
  'media',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    r2Key: text('r2_key').notNull(),
    filename: text('filename').notNull(),
    mime: text('mime').notNull(),
    width: integer('width').notNull(),
    height: integer('height').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    /** Alt text WAJIB di kedua bahasa sebelum media bisa dipakai (PLAN Bab 10.3). */
    altId: text('alt_id'),
    altEn: text('alt_en'),
    captionId: text('caption_id'),
    captionEn: text('caption_en'),
    credit: text('credit'),
    takenAt: integer('taken_at', { mode: 'timestamp' }),
    uploadedBy: integer('uploaded_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamps.createdAt,
    ...softDelete,
  },
  (t) => [uniqueIndex('media_r2_key_idx').on(t.r2Key)]
);

// ── articles ───────────────────────────────────────────────────────────────
export const articles = sqliteTable(
  'articles',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull(),
    locale: text('locale', { enum: ['id', 'en'] }).notNull(),
    translationGroupId: text('translation_group_id').notNull(),
    title: text('title').notNull(),
    excerpt: text('excerpt'),
    /** Sumber kebenaran isi artikel (Tiptap JSON). */
    bodyJson: text('body_json', { mode: 'json' }),
    /** Hasil render di SERVER saat simpan, di-cache. Konsisten dengan yang dilihat crawler. */
    bodyHtml: text('body_html'),
    authorId: integer('author_id').references(() => users.id, { onDelete: 'set null' }),
    /** Wajib terisi untuk artikel regulasi/K3 (PLAN Bab 9.3). */
    reviewerId: integer('reviewer_id').references(() => users.id, { onDelete: 'set null' }),
    categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
    status: text('status', {
      enum: ['draft', 'review', 'scheduled', 'published'],
    })
      .notNull()
      .default('draft'),
    publishedAt: integer('published_at', { mode: 'timestamp' }),
    readingTime: integer('reading_time'),
    wordCount: integer('word_count'),
    focusKeyword: text('focus_keyword'),
    secondaryKeywords: text('secondary_keywords'),
    metaTitle: text('meta_title'),
    metaDescription: text('meta_description'),
    ogImageId: integer('og_image_id').references(() => media.id, { onDelete: 'set null' }),
    faqJson: text('faq_json', { mode: 'json' }),
    /** 40-60 kata, wajib. Sumber blok TL;DR dan bahan kutipan AI (PLAN Bab 8.3). */
    tldr: text('tldr'),
    canonicalOverride: text('canonical_override'),
    noindex: integer('noindex', { mode: 'boolean' }).notNull().default(false),
    /** Untuk artikel regulasi: kapan terakhir fakta diverifikasi ulang. */
    lastVerifiedAt: integer('last_verified_at', { mode: 'timestamp' }),
    ...timestamps,
    ...softDelete,
  },
  (t) => [
    uniqueIndex('articles_slug_locale_idx').on(t.slug, t.locale),
    index('articles_published_at_idx').on(t.publishedAt),
    index('articles_status_idx').on(t.status),
    index('articles_translation_group_idx').on(t.translationGroupId),
    index('articles_focus_keyword_idx').on(t.focusKeyword),
  ]
);

// ── article_revisions ──────────────────────────────────────────────────────
export const articleRevisions = sqliteTable(
  'article_revisions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    articleId: integer('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    bodyJson: text('body_json', { mode: 'json' }),
    changedBy: integer('changed_by').references(() => users.id, { onDelete: 'set null' }),
    changeNote: text('change_note'),
    createdAt: timestamps.createdAt,
  },
  (t) => [index('article_revisions_article_id_idx').on(t.articleId)]
);

// ── instructors ────────────────────────────────────────────────────────────
export const instructors = sqliteTable(
  'instructors',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    photoId: integer('photo_id').references(() => media.id, { onDelete: 'set null' }),
    bioId: text('bio_id'),
    bioEn: text('bio_en'),
    /** Array sertifikasi: { name, issuer, number, validUntil }. Sumber schema hasCredential. */
    certificationsJson: text('certifications_json', { mode: 'json' }),
    yearsExperience: integer('years_experience'),
    linkedin: text('linkedin'),
    status: text('status', { enum: ['draft', 'published'] })
      .notNull()
      .default('draft'),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [uniqueIndex('instructors_slug_idx').on(t.slug)]
);

// ── testimonials ───────────────────────────────────────────────────────────
export const testimonials = sqliteTable('testimonials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role'),
  company: text('company'),
  contentId: text('content_id'),
  contentEn: text('content_en'),
  photoId: integer('photo_id').references(() => media.id, { onDelete: 'set null' }),
  rating: real('rating'),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'set null' }),
  /** Hanya tayang kalau TRUE: bukti izin tertulis ada (DESIGN-SYSTEM Bab 6.8). */
  verified: integer('verified', { mode: 'boolean' }).notNull().default(false),
  status: text('status', { enum: ['draft', 'published'] })
    .notNull()
    .default('draft'),
  createdAt: timestamps.createdAt,
});

// ── faqs ───────────────────────────────────────────────────────────────────
export const faqs = sqliteTable(
  'faqs',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    questionId: text('question_id').notNull(),
    questionEn: text('question_en'),
    answerId: text('answer_id').notNull(),
    answerEn: text('answer_en'),
    category: text('category'),
    /** Halaman mana yang menampilkan FAQ ini: 'home', 'training', 'course:5', dll. */
    pageScope: text('page_scope'),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('faqs_page_scope_idx').on(t.pageScope)]
);

// ── settings ───────────────────────────────────────────────────────────────
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  valueJson: text('value_json', { mode: 'json' }),
  updatedBy: integer('updated_by').references(() => users.id, { onDelete: 'set null' }),
  updatedAt: timestamps.updatedAt,
});

// ── redirects ──────────────────────────────────────────────────────────────
export const redirects = sqliteTable(
  'redirects',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    fromPath: text('from_path').notNull(),
    /** NULL = antrean 404 yang belum ditangani (PLAN Bab 15.7). */
    toPath: text('to_path'),
    statusCode: integer('status_code').notNull().default(301),
    hits: integer('hits').notNull().default(0),
    createdAt: timestamps.createdAt,
  },
  (t) => [uniqueIndex('redirects_from_path_idx').on(t.fromPath)]
);

// ── audit_log ──────────────────────────────────────────────────────────────
export const auditLog = sqliteTable(
  'audit_log',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    entityType: text('entity_type'),
    entityId: integer('entity_id'),
    diffJson: text('diff_json', { mode: 'json' }),
    ipHash: text('ip_hash'),
    createdAt: timestamps.createdAt,
  },
  (t) => [
    index('audit_log_user_id_idx').on(t.userId),
    index('audit_log_created_at_idx').on(t.createdAt),
    index('audit_log_entity_idx').on(t.entityType, t.entityId),
  ]
);

// ── article_instructors (relasi banyak-ke-banyak untuk kredit penulis ahli) ──
export const courseInstructors = sqliteTable(
  'course_instructors',
  {
    courseId: integer('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    instructorId: integer('instructor_id')
      .notNull()
      .references(() => instructors.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.courseId, t.instructorId] })]
);

// ── Tipe turunan ───────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type Batch = typeof batches.$inferSelect;
export type NewBatch = typeof batches.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Media = typeof media.$inferSelect;
export type Instructor = typeof instructors.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type Redirect = typeof redirects.$inferSelect;
