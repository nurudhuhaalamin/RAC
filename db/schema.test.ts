/**
 * Test skema database — Rope Access Center (RAC)
 *
 * Yang diuji bukan "tabel terbentuk" (migration sudah membuktikan itu), melainkan
 * bahwa constraint benar-benar MENOLAK data yang salah. Skema yang menerima
 * apa saja sama saja dengan tidak punya skema.
 */

import Database from 'better-sqlite3';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const MIGRATIONS_DIR = './db/migrations';

let db: Database.Database;

/** Bangun database in-memory dari migration yang sama dengan produksi. */
function freshDb(): Database.Database {
  const d = new Database(':memory:');
  d.pragma('foreign_keys = ON');
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  for (const f of files) {
    const sql = readFileSync(join(MIGRATIONS_DIR, f), 'utf8');
    for (const stmt of sql
      .split('--> statement-breakpoint')
      .map((s) => s.trim())
      .filter(Boolean)) {
      d.exec(stmt);
    }
  }
  return d;
}

const now = Math.floor(Date.now() / 1000);

function insertCourse(slug = 'kursus-a', locale = 'id', gid = 'gid-1') {
  return db
    .prepare(
      `INSERT INTO courses (slug, locale, translation_group_id, title, scheme, certifying_body,
        status, sort_order, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)`
    )
    .run(slug, locale, gid, 'Judul', 'bnsp', 'BNSP', 'published', 0, now, now)
    .lastInsertRowid as number;
}

function insertBatch(courseId: number) {
  return db
    .prepare(
      `INSERT INTO batches (course_id, start_date, end_date, city, capacity, seats_taken,
        status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)`
    )
    .run(courseId, now, now + 86400, 'Jakarta', 12, 0, 'open', now, now).lastInsertRowid as number;
}

function insertLead(refCode = 'LEAD-20260812-AAAA', batchId: number | null = null) {
  return db
    .prepare(
      `INSERT INTO leads (ref_code, name, phone, interest_type, status, locale, batch_id,
        created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)`
    )
    .run(refCode, 'Nama', '+628110000000', 'training', 'new', 'id', batchId, now, now)
    .lastInsertRowid as number;
}

beforeEach(() => {
  db = freshDb();
});
afterEach(() => {
  db.close();
});

describe('struktur', () => {
  it('membuat seluruh tabel PLAN Bab 6.1', () => {
    const tables = (
      db
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
        .all() as Array<{ name: string }>
    ).map((r) => r.name);

    for (const t of [
      'users',
      'leads',
      'lead_activities',
      'courses',
      'batches',
      'registrations',
      'articles',
      'article_revisions',
      'categories',
      'media',
      'instructors',
      'testimonials',
      'faqs',
      'settings',
      'redirects',
      'audit_log',
    ]) {
      expect(tables, `tabel ${t} hilang`).toContain(t);
    }
  });

  it('memasang index wajib PLAN Bab 6.2 poin 3', () => {
    const idx = (
      db
        .prepare("SELECT name FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%'")
        .all() as Array<{ name: string }>
    ).map((r) => r.name);

    expect(idx).toContain('leads_created_at_idx');
    expect(idx).toContain('leads_status_idx');
    expect(idx).toContain('articles_slug_locale_idx');
    expect(idx).toContain('articles_published_at_idx');
    expect(idx).toContain('batches_start_date_idx');
  });
});

describe('constraint NOT NULL', () => {
  it('menolak lead tanpa nomor telepon', () => {
    expect(() =>
      db
        .prepare(
          `INSERT INTO leads (ref_code, name, interest_type, status, locale, created_at, updated_at)
           VALUES (?,?,?,?,?,?,?)`
        )
        .run('LEAD-X', 'Nama', 'training', 'new', 'id', now, now)
    ).toThrow(/NOT NULL/i);
  });

  it('menolak batch tanpa kapasitas', () => {
    const c = insertCourse();
    expect(() =>
      db
        .prepare(
          `INSERT INTO batches (course_id, start_date, end_date, city, status, created_at, updated_at)
           VALUES (?,?,?,?,?,?,?)`
        )
        .run(c, now, now + 1, 'Jakarta', 'open', now, now)
    ).toThrow(/NOT NULL/i);
  });
});

describe('unique constraint', () => {
  it('menolak ref_code lead yang duplikat', () => {
    insertLead('LEAD-DUP');
    expect(() => insertLead('LEAD-DUP')).toThrow(/UNIQUE/i);
  });

  it('mengizinkan slug sama di locale berbeda, menolak di locale sama', () => {
    insertCourse('tkpk-1', 'id', 'g1');
    expect(() => insertCourse('tkpk-1', 'en', 'g1')).not.toThrow();
    expect(() => insertCourse('tkpk-1', 'id', 'g2')).toThrow(/UNIQUE/i);
  });
});

describe('foreign key', () => {
  it('cascade menghapus lead_activities saat lead dihapus', () => {
    const leadId = insertLead();
    db.prepare(
      'INSERT INTO lead_activities (lead_id, type, content, created_at) VALUES (?,?,?,?)'
    ).run(leadId, 'note', 'catatan', now);
    expect((db.prepare('SELECT COUNT(*) c FROM lead_activities').get() as { c: number }).c).toBe(1);

    db.prepare('DELETE FROM leads WHERE id = ?').run(leadId);
    expect((db.prepare('SELECT COUNT(*) c FROM lead_activities').get() as { c: number }).c).toBe(0);
  });

  it('set null pada leads.batch_id saat batch dihapus — lead TIDAK ikut hilang', () => {
    const courseId = insertCourse();
    const batchId = insertBatch(courseId);
    const leadId = insertLead('LEAD-FK', batchId);

    db.prepare('DELETE FROM batches WHERE id = ?').run(batchId);

    const lead = db.prepare('SELECT batch_id FROM leads WHERE id = ?').get(leadId) as {
      batch_id: number | null;
    };
    expect(lead).toBeDefined();
    expect(lead.batch_id).toBeNull();
  });

  it('menolak batch yang menunjuk kursus tidak ada', () => {
    expect(() => insertBatch(9999)).toThrow(/FOREIGN KEY/i);
  });
});

describe('soft delete', () => {
  it('deleted_at pada leads tidak menghapus baris', () => {
    const id = insertLead('LEAD-SOFT');
    db.prepare('UPDATE leads SET deleted_at = ? WHERE id = ?').run(now, id);

    const row = db.prepare('SELECT id, deleted_at FROM leads WHERE id = ?').get(id) as
      { id: number; deleted_at: number | null } | undefined;

    expect(row).toBeDefined();
    expect(row?.deleted_at).toBe(now);
    expect((db.prepare('SELECT COUNT(*) c FROM leads').get() as { c: number }).c).toBe(1);
  });

  it('articles dan media juga punya kolom deleted_at', () => {
    for (const table of ['articles', 'media']) {
      const cols = (db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>).map(
        (c) => c.name
      );
      expect(cols, `${table} tidak punya deleted_at`).toContain('deleted_at');
    }
  });
});

describe('translation_group_id — dasar hreflang', () => {
  it('menyatukan pasangan ID dan EN dengan id yang sama', () => {
    const gid = 'grup-terjemahan-1';
    insertCourse('sertifikasi-bnsp', 'id', gid);
    insertCourse('bnsp-certification', 'en', gid);

    const pair = db
      .prepare('SELECT locale, slug FROM courses WHERE translation_group_id = ? ORDER BY locale')
      .all(gid) as Array<{ locale: string; slug: string }>;

    expect(pair).toHaveLength(2);
    expect(pair.map((p) => p.locale)).toEqual(['en', 'id']);
    // Slug BERBEDA per bahasa — slug adalah sinyal keyword (PLAN Bab 7.1).
    expect(pair[0]?.slug).not.toBe(pair[1]?.slug);
  });
});

describe('nilai default', () => {
  it('lead baru berstatus new dan locale id', () => {
    const id = db
      .prepare(
        `INSERT INTO leads (ref_code, name, phone, interest_type, created_at, updated_at)
         VALUES (?,?,?,?,?,?)`
      )
      .run('LEAD-DEF', 'Nama', '+628110000000', 'training', now, now).lastInsertRowid as number;

    const row = db.prepare('SELECT status, locale FROM leads WHERE id = ?').get(id) as {
      status: string;
      locale: string;
    };
    expect(row.status).toBe('new');
    expect(row.locale).toBe('id');
  });

  it('testimoni baru TIDAK terverifikasi — harus eksplisit diizinkan', () => {
    const id = db
      .prepare('INSERT INTO testimonials (author_name, created_at) VALUES (?,?)')
      .run('Nama', now).lastInsertRowid as number;

    const row = db.prepare('SELECT verified, status FROM testimonials WHERE id = ?').get(id) as {
      verified: number;
      status: string;
    };
    expect(row.verified).toBe(0);
    expect(row.status).toBe('draft');
  });
});
