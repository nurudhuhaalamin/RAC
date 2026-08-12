# Rope Access Center (RAC) — Website Training Center & Jasa Perawatan Gedung

Baca **hanya bagian yang relevan** dengan tugas — jangan muat seluruhnya:

- `docs/PLAN.md` — rencana induk, rujuk per bab
- `docs/PLAYBOOK.md` — prompt per tugas (T-1xx…T-4xx)
- `docs/DESIGN-SYSTEM.md` — sumber kebenaran warna, tipografi, komponen
- `docs/DECISIONS.md` — kenapa sesuatu diputuskan begitu (D-xx, ADR-xxx)

**Semua nilai faktual — angka, nomor, harga, nama:** @docs/FAKTA-BISNIS.md

> Empat file pertama sengaja **tidak** memakai `@`. Sintaks `@` meng-*import* isi file ke
> konteks setiap sesi; keempatnya berjumlah ~4.800 baris dan akan menghabiskan puluhan ribu
> token sebelum pekerjaan dimulai — persis anti-pola di PLAN Bab 16.5, yang membuat aturan
> penting tenggelam. Hanya FAKTA-BISNIS.md yang di-import, karena kecil dan justru harus
> selalu ada untuk mencegah pengarangan fakta.

## Perintah

- `pnpm dev` — server pengembangan
- `pnpm typecheck` — TypeScript (WAJIB lolos sebelum commit)
- `pnpm test` — unit test Vitest
- `pnpm test:e2e` — Playwright
- `pnpm build` — build produksi
- `pnpm check:content` — validator aturan konten (D-05, alt text, nama file)
- `pnpm db:generate` — generate migration Drizzle
- `pnpm db:migrate:local` — terapkan migration ke D1 lokal

## Aturan yang TIDAK BOLEH dilanggar

1. JANGAN PERNAH menjalankan migration ke database production, dan jangan
   pernah `wrangler deploy`. Hanya lokal. Deploy adalah keputusan manusia.
2. JANGAN PERNAH commit `.env`, `.dev.vars`, atau nilai rahasia apa pun.
3. **JANGAN PERNAH mengarang angka, nomor lisensi, harga, nama instruktur,
   tanggal, atau testimoni.** Semua nilai faktual datang dari
   @docs/FAKTA-BISNIS.md. Kalau belum ada di sana, tulis `TODO: <nama nilai>`.
   Angka bulat yang terdengar wajar adalah karangan paling berbahaya —
   tidak memicu kecurigaan sampai klien korporat memverifikasinya.
4. IRATA dan SPRAT hanya boleh muncul sebagai "rencana/persiapan".
   Dilarang: logo, penawaran layanan, harga, jadwal, schema `Course`,
   halaman pendaftaran. Lihat PLAN.md Bab 3 (D-05).
   Berlaku sama untuk **Petzl, IRSM, dan ISO 9001** — tidak ada satu pun
   hubungan resmi tertulis (D-12).
5. Setiap endpoint API WAJIB memvalidasi input dengan Zod di sisi server.
   Jangan pernah percaya validasi klien.
6. Setiap query database lewat Drizzle. Dilarang merangkai SQL dari string.
7. Setiap `<img>` WAJIB punya `alt`, `width`, dan `height`.
8. Rute `/admin/*` dan `/api/*` WAJIB `private, no-store`. Tidak pernah di-cache.
9. Setiap halaman publik WAJIB punya title, description, canonical, hreflang.
10. Teks merah kecil di latar gelap WAJIB `accent-400`, bukan `accent-500`
    (`#E30613` di atas navy hanya 3,51:1 — gagal WCAG AA). Lihat A-05.

## Gaya kode

- TypeScript strict. Dilarang `any` — pakai `unknown` lalu persempit.
- Warna/spasi/font HANYA lewat token Tailwind dari `src/styles/theme.css`.
  Dilarang nilai arbitrer seperti `text-[#123456]` atau `p-[13px]`.
  Butuh nilai baru? Tambahkan tokennya, jangan menulis nilai mentah.
- Token warna disalin **persis** dari DESIGN-SYSTEM.md Bab 3. Jangan mengarang
  skala warna sendiri dari nilai hex brand guide.
- Komponen React hanya untuk island interaktif. Selebihnya `.astro`.
- Nama file: PascalCase untuk komponen, kebab-case untuk rute.
- Teks yang terlihat pengguna melalui helper i18n. Dilarang string hardcode.
- Titik sentuh minimal 44×44 px. Cincin fokus tidak boleh dihapus.

## Alur kerja

- Plan mode dulu untuk perubahan multi-file. Wajib untuk: migration database,
  autentikasi, halaman sensitif SEO, konfigurasi produksi.
- Satu tugas koheren per sesi. Selesai → `/clear`. Jangan menumpuk.
- Kalau sudah mengoreksi hal yang sama 2 kali: berhenti, `/clear`, mulai ulang
  dengan prompt yang memuat pelajaran dari kegagalan tadi.
- Setelah menulis kode: jalankan typecheck, test, dan build. Perbaiki kegagalan.
- **Tunjukkan output test sebagai bukti. Jangan menyatakan "sudah selesai"
  tanpa memperlihatkan hasilnya.** Kalau ada yang gagal, katakan gagal.
- Jangan menonaktifkan test atau menurunkan ambang supaya lulus. Laporkan.
- Setelah tugas selesai: TULIS LOG PEKERJAAN — skill `worklog`
- Commit atomik, format Conventional Commits.

## Batas peran

Claude Code menulis kode, struktur, dan kejelasan bahasa.
Claude Code **bukan** sumber fakta untuk: regulasi Indonesia, nomor pasal,
harga, prosedur keselamatan, atau data lapangan perusahaan.
Setiap klaim faktual harus tertelusur ke `docs/FAKTA-BISNIS.md` atau sumber
resmi yang ditautkan. Kalau tidak ada sumbernya, tandai `[SUMBER?]`.
Lihat skill `content-writer`.

## Bahasa

- Kode, komentar, nama variabel: Inggris.
- Teks antarmuka pengguna: Indonesia (dengan padanan EN via i18n).
- Antarmuka dashboard: **seluruhnya Bahasa Indonesia** — penggunanya staf
  non-teknis. Pesan error menjelaskan CARA MEMPERBAIKI, bukan hanya apa yang salah.
- Percakapan dengan saya: Indonesia.
- Log pekerjaan: Indonesia.
