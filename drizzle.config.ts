import { defineConfig } from 'drizzle-kit';

// Migration HANYA ke lokal. Penerapan ke production dijalankan manual oleh
// pemilik proyek (CLAUDE.md aturan 1, PLAN Bab 6.2).
export default defineConfig({
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'sqlite',
  dbCredentials: { url: './local.db' },
  verbose: true,
  strict: true,
});
