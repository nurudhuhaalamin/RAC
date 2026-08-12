#!/usr/bin/env node
/**
 * Terapkan migration Drizzle ke SQLite lokal — Rope Access Center (RAC)
 *
 * HANYA lokal. Penerapan ke production dijalankan manual oleh pemilik proyek:
 *   wrangler d1 migrations apply DB --remote
 * Perintah itu diblokir di .claude/settings.json dan TIDAK boleh dijalankan agen.
 */

import Database from 'better-sqlite3';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DB_PATH = process.env.LOCAL_DB_PATH || './local.db';
const MIGRATIONS_DIR = './db/migrations';

if (!existsSync(MIGRATIONS_DIR)) {
  console.error(`Tidak ada ${MIGRATIONS_DIR}. Jalankan \`pnpm db:generate\` dulu.`);
  process.exit(1);
}

const files = readdirSync(MIGRATIONS_DIR)
  .filter((f) => f.endsWith('.sql'))
  .sort();

if (files.length === 0) {
  console.error(`Tidak ada file .sql di ${MIGRATIONS_DIR}. Jalankan \`pnpm db:generate\` dulu.`);
  process.exit(1);
}

const db = new Database(DB_PATH);
db.pragma('foreign_keys = ON');
db.exec(`CREATE TABLE IF NOT EXISTS __migrations (name TEXT PRIMARY KEY, applied_at INTEGER)`);

const applied = new Set(
  db
    .prepare('SELECT name FROM __migrations')
    .all()
    .map((r) => r.name)
);
let count = 0;

for (const file of files) {
  if (applied.has(file)) continue;
  const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf8');
  // Drizzle memisahkan pernyataan dengan penanda ini.
  const statements = sql
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter(Boolean);
  const run = db.transaction(() => {
    for (const stmt of statements) db.exec(stmt);
    db.prepare('INSERT INTO __migrations (name, applied_at) VALUES (?, ?)').run(file, Date.now());
  });
  run();
  console.log(`  applied ${file}`);
  count++;
}

console.log(
  count === 0
    ? '✅ Database lokal sudah terkini.'
    : `✅ ${count} migration diterapkan ke ${DB_PATH}.`
);
db.close();
