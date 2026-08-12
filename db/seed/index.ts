/**
 * Data seed untuk pengembangan — Rope Access Center (RAC)
 *
 * ⚠️ SELURUH ISI FILE INI FIKTIF dan hanya untuk pengembangan lokal.
 *
 * Aturan yang ditegakkan (CLAUDE.md aturan 3, PLAN Bab 6.2):
 *  - JANGAN PERNAH memakai data pribadi nyata di sini — file ini masuk git
 *  - Nama, telepon, dan perusahaan sengaja dibuat jelas contoh
 *  - Harga dan durasi adalah ANGKA CONTOH, bukan harga sebenarnya.
 *    Harga sungguhan diisi lewat dashboard dari docs/FAKTA-BISNIS.md
 *  - Hanya skema BNSP dan Kemnaker (TKPK/TKBT) yang boleh muncul di tabel courses.
 *    Asosiasi internasional yang dibatasi D-05 tidak boleh dibuatkan entri kursus,
 *    harga, jadwal, maupun schema Course. Lihat docs/PLAN.md Bab 3.
 */

import Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';

const DB_PATH = process.env.LOCAL_DB_PATH || './local.db';
const db = new Database(DB_PATH);
db.pragma('foreign_keys = ON');

const now = Math.floor(Date.now() / 1000);
const day = 86_400;

function reset() {
  const tables = [
    'course_instructors',
    'registrations',
    'lead_activities',
    'article_revisions',
    'batches',
    'articles',
    'leads',
    'courses',
    'categories',
    'instructors',
    'testimonials',
    'faqs',
    'redirects',
    'audit_log',
    'settings',
    'media',
    'users',
  ];
  for (const t of tables) db.prepare(`DELETE FROM ${t}`).run();
}

// ── users ──────────────────────────────────────────────────────────────────
function seedUsers() {
  const stmt = db.prepare(
    'INSERT INTO users (email, name, role, active, created_at) VALUES (?, ?, ?, ?, ?)'
  );
  stmt.run('admin@contoh.test', 'Admin Contoh', 'admin', 1, now);
  stmt.run('editor@contoh.test', 'Editor Contoh', 'editor', 1, now);
  stmt.run('sales@contoh.test', 'Sales Contoh', 'sales', 1, now);
}

// ── courses (3 kursus, pasangan ID + EN) ───────────────────────────────────
function seedCourses() {
  const stmt = db.prepare(`
    INSERT INTO courses (slug, locale, translation_group_id, title, subtitle, scheme,
      certifying_body, level, duration_days, prerequisites, syllabus_json, price,
      price_note, capacity_default, status, sort_order, meta_title, meta_description,
      created_at, updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);

  const defs = [
    {
      gid: randomUUID(),
      id: {
        slug: 'sertifikasi-bnsp-rope-access',
        title: 'Sertifikasi BNSP Rope Access',
        subtitle: 'Sertifikat kompetensi melalui LSP terlisensi BNSP',
        prereq: 'Usia minimal 18 tahun, sehat jasmani, tidak takut ketinggian',
      },
      en: {
        slug: 'bnsp-rope-access-certification',
        title: 'BNSP Rope Access Certification',
        subtitle: 'Competency certificate through a BNSP-licensed LSP',
        prereq: 'Minimum age 18, physically fit, no fear of heights',
      },
      scheme: 'bnsp',
      body: 'BNSP',
      level: null,
      days: 5,
      syllabus: [
        { module: 'Dasar K3 pekerjaan ketinggian', hours: 4 },
        { module: 'Peralatan dan inspeksi APD', hours: 6 },
        { module: 'Teknik akses tali dasar', hours: 12 },
        { module: 'Rescue dan tanggap darurat', hours: 8 },
        { module: 'Uji kompetensi', hours: 8 },
      ],
      price: 0,
      sort: 1,
    },
    {
      gid: randomUUID(),
      id: {
        slug: 'tkpk-1',
        title: 'TKPK 1 — Tenaga Kerja pada Ketinggian Tingkat 1',
        subtitle: 'Sertifikat Kemnaker sesuai Permenaker No. 9 Tahun 2016',
        prereq: 'Usia minimal 18 tahun, surat keterangan sehat',
      },
      en: {
        slug: 'tkpk-1',
        title: 'TKPK 1 — Rope Access Worker Level 1',
        subtitle: 'Kemnaker certificate under Permenaker No. 9 of 2016',
        prereq: 'Minimum age 18, medical fitness certificate',
      },
      scheme: 'tkpk',
      body: 'Kemnaker RI',
      level: '1',
      days: 4,
      syllabus: [
        { module: 'Peraturan perundangan K3 ketinggian', hours: 4 },
        { module: 'Identifikasi bahaya dan penilaian risiko', hours: 4 },
        { module: 'Teknik bekerja dengan akses tali', hours: 12 },
        { module: 'Praktik dan evaluasi', hours: 8 },
      ],
      price: 0,
      sort: 2,
    },
    {
      gid: randomUUID(),
      id: {
        slug: 'tkbt-1',
        title: 'TKBT 1 — Tenaga Kerja Bangunan Tinggi Tingkat 1',
        subtitle: 'Sertifikat Kemnaker untuk ketinggian tanpa akses tali',
        prereq: 'Usia minimal 18 tahun, surat keterangan sehat',
      },
      en: {
        slug: 'tkbt-1',
        title: 'TKBT 1 — High-Rise Building Worker Level 1',
        subtitle: 'Kemnaker certificate for work at height without rope access',
        prereq: 'Minimum age 18, medical fitness certificate',
      },
      scheme: 'tkbt',
      body: 'Kemnaker RI',
      level: '1',
      days: 3,
      syllabus: [
        { module: 'Dasar hukum dan kewajiban K3', hours: 4 },
        { module: 'Alat pelindung diri dan perancah', hours: 6 },
        { module: 'Praktik kerja aman di ketinggian', hours: 8 },
        { module: 'Evaluasi', hours: 4 },
      ],
      price: 0,
      sort: 3,
    },
  ];

  for (const c of defs) {
    for (const loc of ['id', 'en'] as const) {
      const v = c[loc];
      stmt.run(
        v.slug,
        loc,
        c.gid,
        v.title,
        v.subtitle,
        c.scheme,
        c.body,
        c.level,
        c.days,
        v.prereq,
        JSON.stringify(c.syllabus),
        c.price, // 0 = TODO: harga sebenarnya belum ditetapkan (docs/FAKTA-BISNIS.md Bab 5)
        'TODO: harga',
        12,
        'published',
        c.sort,
        v.title,
        v.subtitle,
        now,
        now
      );
    }
  }
}

// ── batches (5 batch mendatang) ────────────────────────────────────────────
function seedBatches() {
  const idCourses = db
    .prepare("SELECT id, slug FROM courses WHERE locale = 'id' ORDER BY sort_order")
    .all() as Array<{ id: number; slug: string }>;

  const stmt = db.prepare(`
    INSERT INTO batches (course_id, start_date, end_date, city, venue_name, venue_address,
      capacity, seats_taken, status, created_at, updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
  `);

  const plan = [
    { ci: 0, inDays: 14, len: 5, city: 'Jakarta', taken: 4, status: 'open' },
    { ci: 1, inDays: 21, len: 4, city: 'Jakarta', taken: 10, status: 'open' },
    { ci: 2, inDays: 28, len: 3, city: 'Surabaya', taken: 2, status: 'open' },
    { ci: 0, inDays: 45, len: 5, city: 'Balikpapan', taken: 12, status: 'full' },
    { ci: 1, inDays: 60, len: 4, city: 'Jakarta', taken: 0, status: 'scheduled' },
  ];

  for (const p of plan) {
    const course = idCourses[p.ci];
    if (!course) continue;
    stmt.run(
      course.id,
      now + p.inDays * day,
      now + (p.inDays + p.len) * day,
      p.city,
      'TODO: nama venue',
      'TODO: alamat venue',
      12,
      p.taken,
      p.status,
      now,
      now
    );
  }
}

// ── categories + articles ──────────────────────────────────────────────────
function seedContent() {
  const catStmt = db.prepare(
    'INSERT INTO categories (slug, locale, translation_group_id, name, description) VALUES (?,?,?,?,?)'
  );
  const catGid = randomUUID();
  catStmt.run(
    'regulasi-k3',
    'id',
    catGid,
    'Regulasi K3',
    'Pembahasan peraturan keselamatan kerja pada ketinggian di Indonesia, termasuk kewajiban sertifikasi dan dokumen yang harus disiapkan perusahaan.'
  );
  catStmt.run(
    'hse-regulation',
    'en',
    catGid,
    'HSE Regulation',
    'Indonesian work-at-height safety regulations, certification obligations, and the documents companies must prepare.'
  );

  const catId = (db.prepare("SELECT id FROM categories WHERE locale='id'").get() as { id: number })
    .id;
  const authorId = (db.prepare("SELECT id FROM users WHERE role='editor'").get() as { id: number })
    .id;

  const artStmt = db.prepare(`
    INSERT INTO articles (slug, locale, translation_group_id, title, excerpt, body_html,
      author_id, category_id, status, published_at, reading_time, word_count,
      focus_keyword, meta_title, meta_description, tldr, noindex, created_at, updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);

  const arts = [
    {
      slug: 'apa-itu-rope-access',
      title: 'Apa Itu Rope Access dan Kapan Metode Ini Dipakai',
      kw: 'apa itu rope access',
      tldr: 'Rope access adalah metode bekerja pada ketinggian memakai dua tali — tali kerja dan tali backup. Di Indonesia, pekerjanya wajib bersertifikat sesuai Permenaker No. 9 Tahun 2016.',
    },
    {
      slug: 'perbedaan-tkpk-dan-tkbt',
      title: 'Perbedaan TKPK dan TKBT: Mana yang Anda Butuhkan',
      kw: 'perbedaan tkpk dan tkbt',
      tldr: 'TKPK untuk pekerjaan ketinggian dengan akses tali dan berjenjang 1–3. TKBT untuk ketinggian tanpa akses tali dan berjenjang 1–2. Keduanya diterbitkan Kemnaker RI.',
    },
    {
      slug: 'permenaker-9-2016-kewajiban-perusahaan',
      title: 'Permenaker No. 9 Tahun 2016: Kewajiban Perusahaan',
      kw: 'permenaker 9 tahun 2016',
      tldr: 'Permenaker No. 9 Tahun 2016 mewajibkan perusahaan memastikan pekerja ketinggian bersertifikat, menyiapkan rencana penyelamatan, dan melakukan inspeksi alat pelindung diri secara berkala.',
    },
  ];

  for (const a of arts) {
    artStmt.run(
      a.slug,
      'id',
      randomUUID(),
      a.title,
      'TODO: excerpt',
      '<p>TODO: isi artikel. Konten sungguhan ditulis mengikuti standar PLAN Bab 9.</p>',
      authorId,
      catId,
      'published',
      now - 7 * day,
      5,
      900,
      a.kw,
      a.title,
      'TODO: meta description',
      a.tldr,
      0,
      now,
      now
    );
  }
}

// ── leads (5 lead contoh) ──────────────────────────────────────────────────
function seedLeads() {
  const stmt = db.prepare(`
    INSERT INTO leads (ref_code, name, phone, email, company, interest_type, scheme,
      city, message, source_page, status, locale, ip_hash, created_at, updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);

  const rows = [
    ['LEAD-20260801-A7K2', 'Contoh Satu', '+6281100000001', 'training', 'bnsp', 'new'],
    ['LEAD-20260802-B3M9', 'Contoh Dua', '+6281100000002', 'training', 'tkpk', 'contacted'],
    ['LEAD-20260803-C8N4', 'Contoh Tiga', '+6281100000003', 'service', null, 'qualified'],
    ['LEAD-20260804-D2P7', 'Contoh Empat', '+6281100000004', 'irata_waitlist', null, 'new'],
    ['LEAD-20260805-E5R1', 'Contoh Lima', '+6281100000005', 'training', 'tkbt', 'won'],
  ] as const;

  rows.forEach((r, i) => {
    stmt.run(
      r[0],
      r[1],
      r[2],
      `contoh${i + 1}@contoh.test`,
      'PT Contoh Indonesia',
      r[3],
      r[4],
      'Jakarta',
      'Pesan contoh untuk pengembangan.',
      '/pelatihan/',
      r[5],
      'id',
      'hash-contoh-bukan-ip-nyata',
      now - (5 - i) * day,
      now - (5 - i) * day
    );
  });
}

// ── settings ───────────────────────────────────────────────────────────────
function seedSettings() {
  const stmt = db.prepare('INSERT INTO settings (key, value_json, updated_at) VALUES (?,?,?)');
  // Nomor WA sengaja TODO: diisi dari docs/FAKTA-BISNIS.md Bab 3, bukan dikarang.
  stmt.run('whatsapp_training', JSON.stringify({ number: 'TODO', label: 'Sales Training' }), now);
  stmt.run('whatsapp_service', JSON.stringify({ number: 'TODO', label: 'Sales Jasa' }), now);
  stmt.run(
    'office_hours',
    JSON.stringify({ weekday: 'TODO', saturday: 'TODO', sunday: 'Tutup' }),
    now
  );
}

// ── Jalankan ───────────────────────────────────────────────────────────────
const run = db.transaction(() => {
  reset();
  seedUsers();
  seedCourses();
  seedBatches();
  seedContent();
  seedLeads();
  seedSettings();
});

run();

const counts = ['users', 'courses', 'batches', 'categories', 'articles', 'leads', 'settings'].map(
  (t) => `${t}=${(db.prepare(`SELECT COUNT(*) c FROM ${t}`).get() as { c: number }).c}`
);

console.log(`✅ Seed selesai (${DB_PATH}): ${counts.join(', ')}`);
console.log('   Seluruh isi fiktif. Harga dan nomor WA sengaja TODO.');
db.close();
