---
name: db-migration
description: Prosedur aman mengubah skema database D1 dengan Drizzle. Gunakan setiap kali menyentuh db/schema.ts, membuat migration, atau mengubah struktur tabel.
---

# Prosedur Migration Database — RAC

## Aturan mutlak

1. **JANGAN PERNAH menjalankan migration ke production.** Tidak ada
   `wrangler d1 migrations apply DB --remote`, tidak ada `wrangler d1 execute --remote`.
   Itu dijalankan manual oleh pemilik proyek. Perintahnya diblokir di `.claude/settings.json` —
   kalau terasa perlu dilonggarkan, jawabannya tidak.
2. **Semua perubahan skema lewat migration Drizzle.** Tidak ada `ALTER TABLE` manual.
3. **File di `db/migrations/` digenerate — JANGAN diedit manual.** Kalau hasilnya salah,
   perbaiki `db/schema.ts` lalu generate ulang.

## Alur yang benar

```bash
# 1. Ubah db/schema.ts
# 2. Generate migration
pnpm db:generate

# 3. BACA file migration yang dihasilkan sebelum menerapkannya.
#    Perhatikan khusus: DROP COLUMN, DROP TABLE, dan perubahan tipe —
#    SQLite menangani ini dengan membuat ulang tabel, dan data bisa hilang.

# 4. Terapkan ke lokal saja
pnpm db:migrate:local

# 5. Verifikasi
pnpm db:studio      # lihat strukturnya
pnpm test           # test skema harus lulus
```

## Aturan skema (PLAN Bab 6.2)

- **Soft delete** untuk `leads`, `articles`, `media` — kolom `deleted_at`.
  Data lead tidak pernah dihapus permanen tanpa permintaan eksplisit.
- **Index wajib:** `leads.created_at`, `leads.status`, `articles.slug + locale`,
  `articles.published_at`, `batches.start_date`.
- **`translation_group_id`** bertipe text (UUID), **sama** untuk pasangan ID↔EN.
  Inilah dasar hreflang otomatis — kalau salah, seluruh sistem bilingual ikut salah.
- `created_at` / `updated_at` dengan default timestamp.
- Foreign key dengan `onDelete` yang masuk akal:
  `leads.batch_id` → `set null` · `lead_activities.lead_id` → `cascade`.

## Data seed

- Data contoh **realistis tapi jelas fiktif**. Nama seperti "Budi Santoso", nomor telepon
  dengan awalan yang jelas contoh.
- **JANGAN PERNAH memakai data pribadi nyata** di seed — itu masuk git.
- Jangan membuat kursus IRATA/SPRAT di seed (D-05).

## Sebelum menyatakan selesai

```
[ ] Migration ada di db/migrations/ dan sudah dibaca isinya
[ ] pnpm db:migrate:local berhasil
[ ] pnpm db:seed berhasil
[ ] Test skema lulus: insert valid, constraint NOT NULL, FK cascade, soft delete
[ ] Tidak ada perintah --remote yang dijalankan
[ ] Log pekerjaan ditulis
```

## Backup & pemulihan

Dua lapis (ADR-004):

1. **D1 Time Travel** — point-in-time restore 30 hari, aktif bawaan. Ini alat pertama untuk
   `DELETE` yang salah atau migration yang merusak.
2. **Dump harian ke R2** lewat D1 REST API — salinan di luar platform.

**Backup yang belum pernah diuji restore bukan backup.** Prosedur uji ada di `docs/RUNBOOK.md`.
