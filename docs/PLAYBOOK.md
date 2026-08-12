# Perintah Kerja untuk Claude Code
## Playbook Eksekusi Website Training Center Rope Access

> **Dokumen pendamping:** `docs/PLAN.md` · `docs/DESIGN-SYSTEM.md` · `docs/DECISIONS.md` · `docs/FAKTA-BISNIS.md`
> **Versi:** 1.1 — 11 Agustus 2026, direvisi 12 Agustus 2026
>
> **Perubahan v1.1:** T-100b disisipkan (produksi aset brand, prasyarat T-104) ·
> prompt **T-104** dan **T-206** diganti versi DESIGN-SYSTEM Bab 11.2–11.3 ·
> prompt **T-216** ditulis ulang sesuai ADR-002 (Cache API tidak bisa purge-by-tag) ·
> **T-102 sudah selesai** dikerjakan pada 12 Agustus 2026.

---

## Cara Memakai Dokumen Ini

Setiap tugas di bawah adalah **satu sesi Claude Code**. Jangan gabungkan dua tugas dalam satu sesi.

Format setiap tugas:

| Bagian | Arti |
|---|---|
| **Prasyarat** | Tugas yang harus selesai lebih dulu |
| **Mode** | Plan Mode atau langsung |
| **PROMPT** | Blok yang Anda salin-tempel apa adanya |
| **Cek manual** | Yang harus **Anda** periksa sendiri, bukan Claude |
| **DoD** | Definition of Done — semua harus tercentang |

### Ritual Wajib Setiap Sesi

```
SEBELUM:
  1. git checkout -b <branch sesuai tugas>
  2. Buka terminal di root repo
  3. claude --permission-mode plan   (untuk tugas ber-mode Plan)

SELAMA:
  4. Explore → Plan → tinjau rencana (Ctrl+G untuk edit) → setujui → Implement
  5. Kalau sudah mengoreksi hal yang sama 2 kali: STOP, /clear, mulai ulang
     dengan prompt yang sudah memuat pelajaran tadi

SESUDAH:
  6. Pastikan log pekerjaan tertulis
  7. Commit → push → buka PR → tinjau preview URL
  8. Merge
  9. /clear
```

### Aturan yang Tidak Boleh Dilanggar

1. **Jangan pernah** biarkan Claude Code menjalankan `wrangler deploy` atau migration `--remote`. Itu tugas Anda, manual.
2. **Jangan** minta Claude Code menulis fakta regulasi, harga, atau nomor sertifikat. Anda yang menyediakan; Claude hanya merapikan.
3. Setiap tugas harus diakhiri dengan **bukti verifikasi** (output test), bukan klaim "sudah selesai".
4. Kalau prompt di bawah menyebut nomor bab PLAN.md, **jangan hapus rujukan itu** — itu yang menjaga Claude tetap di jalur.

---

# FASE 0 — Persiapan Manual (Tanpa Claude Code)

Kerjakan sendiri. Claude Code belum berperan di sini.

> **Status per 12 Agustus 2026: dinyatakan SELESAI.** Brand, domain, akun Cloudflare beserta
> D1/KV/R2, foto asli, dan nomor lisensi sudah di tangan.
>
> **Yang tersisa:** nilai-nilainya belum tertulis di repo. Pindahkan semuanya ke
> **`docs/FAKTA-BISNIS.md`** — itu satu-satunya tempat Claude Code boleh mengambil angka, nomor,
> dan nama. Selama file itu kosong, setiap tugas berikutnya akan menghasilkan `TODO:` di mana-mana,
> dan `TODO:` yang menumpuk cenderung tidak pernah diganti.

```
[ ] Tetapkan nama perusahaan
[ ] Beli domain, pindahkan nameserver ke Cloudflare
[ ] Buat akun Cloudflare, catat Account ID
[ ] Buat repo GitHub kosong (private dulu), aktifkan branch protection di main
[ ] Aktifkan GitHub secret scanning + Dependabot
[ ] Install: Node 20+, pnpm, wrangler, gh CLI
[ ] Jalankan `wrangler login` dan `gh auth login`
[ ] Buat D1 database: `wrangler d1 create ropeaccess-db` → catat database_id
[ ] Buat KV namespace: `wrangler kv namespace create CACHE` → catat id
[ ] Buat R2 bucket: `wrangler r2 bucket create ropeaccess-media`
[ ] Daftar Turnstile, catat site key + secret key
[ ] Daftar Resend, verifikasi domain pengirim (SPF/DKIM/DMARC)
[ ] Logo + palet warna + font terpilih
[ ] SESI FOTO SELESAI
[ ] docs/KEYWORD-MAP.md terisi hasil validasi keyword
[ ] Isi jawaban O-01 sampai O-09 di PLAN.md Bab 20.2
```

**Gerbang:** jangan mulai T-101 sebelum semua kotak di atas tercentang. Terutama foto — kalau lewat, nanti Anda menumpuk halaman berisi placeholder yang tidak pernah diganti.

---

# FASE 1 — FONDASI TEKNIS

## T-101 — Scaffold Proyek

**Prasyarat:** Fase 0 selesai
**Branch:** `chore/scaffold`
**Mode:** Plan Mode

```
Baca @docs/PLAN.md Bab 4 dan Bab 5.

Inisialisasi proyek dari nol di direktori ini:

STACK (jangan menyimpang):
- Astro 6, TypeScript strict (tsconfig extends astro/tsconfigs/strict)
- Tailwind CSS v4 (konfigurasi CSS-first via @theme, BUKAN tailwind.config.js)
- Adapter @astrojs/cloudflare, mode SSR on-demand
- React 19 untuk island
- Drizzle ORM + better-sqlite3 untuk dev lokal
- Zod 4
- Vitest, Playwright, ESLint, Prettier
- pnpm sebagai package manager

BUAT struktur folder PERSIS seperti PLAN.md Bab 5, dengan file .gitkeep
di folder yang masih kosong.

BUAT juga:
- .gitignore (wajib memuat: .env, .dev.vars, node_modules, dist, .astro,
  .wrangler, *.local)
- .env.example dengan semua variabel yang dibutuhkan, nilainya kosong
- wrangler.toml dengan binding DB (D1), CACHE (KV), MEDIA (R2).
  Gunakan placeholder untuk id — saya isi manual.
- package.json dengan SEMUA script di PLAN.md Lampiran A
- README.md ringkas: cara install, cara jalankan, cara test

JANGAN buat halaman, komponen, atau konten apa pun. Hanya kerangka.
JANGAN jalankan wrangler deploy atau perintah D1 --remote.

Selesai: jalankan `pnpm install && pnpm typecheck && pnpm build`
dan tunjukkan outputnya.
```

**Cek manual:**
- Isi `wrangler.toml` dengan ID asli dari Fase 0
- Buat `.dev.vars` berisi secret lokal (Turnstile secret, Resend API key)
- Pastikan `.dev.vars` masuk `.gitignore`

**DoD:** `pnpm build` sukses · struktur folder sesuai Bab 5 · tidak ada rahasia ter-commit

---

## T-102 — Governance: CLAUDE.md, Settings, Skills, Subagent, Worklog

**Prasyarat:** ~~T-101~~ — tidak ada
**Branch:** `claude/claude-code-project-plan-319gfx`
**Mode:** Langsung
**Status:** ✅ **SELESAI — 12 Agustus 2026**

> Ini tugas paling penting di seluruh playbook. Setelah ini beres, semua sesi berikutnya berjalan jauh lebih rapi.

> **Catatan pelaksanaan.** T-102 dikerjakan **sebelum** T-101, bukan sesudah. Alasannya: seluruh
> aturan yang menjaga sesi-sesi berikutnya (CLAUDE.md, validator D-05, hook worklog, skill
> `content-writer` yang melarang mengarang fakta) justru paling dibutuhkan **saat kode mulai
> ditulis**, bukan setelahnya. Memasangnya lebih dulu berarti T-101 pun sudah berjalan di bawah
> pengawasan. Konsekuensinya `package.json` dibuat minimal di T-102 — **T-101 wajib me-*merge*
> ke dalamnya, bukan menimpanya.**
>
> Cakupan yang benar-benar dikerjakan melampaui daftar di bawah: validator `check-content.mjs`
> sudah memuat penguatan T-208 dan amandemen A-09 sejak awal, dan skill `content-writer`
> dimajukan dari T-401.

```
Baca @docs/PLAN.md Bab 16 dan Bab 17.

Buat file-file berikut PERSIS seperti template di PLAN.md:

1. CLAUDE.md di root — salin template Bab 16.3 apa adanya.
   Maksimal 150 baris. Jangan tambahkan apa pun di luar template.

2. .claude/settings.json — salin dari Bab 16.6 apa adanya.

3. .claude/skills/worklog/SKILL.md — salin dari Bab 17.2 apa adanya.

4. .claude/agents/security-reviewer.md   } salin dari Bab 16.7
   .claude/agents/seo-auditor.md         } apa adanya
   .claude/agents/content-quality-checker.md

5. scripts/check-worklog.mjs — implementasikan logika Bab 17.4:
   - Deteksi apakah ada file berubah di sesi ini (git diff --name-only)
   - Jika ya, cek docs/worklog/<YYYY-MM-DD>.md ada dan mtime-nya
     dalam 30 menit terakhir
   - Jika belum, exit code non-zero dengan pesan yang menyebutkan
     path file log dan lokasi SKILL.md

6. docs/worklog/README.md — jelaskan singkat konvensi penamaan file
   dan format entri.

7. docs/DECISIONS.md — kerangka Architecture Decision Record kosong
   dengan satu contoh entri.

8. scripts/check-content.mjs — validator aturan konten:
   - Pindai semua file di src/ dan src/content/
   - GAGAL jika menemukan string "IRATA" atau "SPRAT" di dalam konteks
     terlarang menurut PLAN.md D-05 (daftar frasa terlarang: "sertifikasi
     IRATA", "training IRATA", "IRATA Level", "pelatihan SPRAT", dan
     variasi kapitalisasinya), KECUALI file berada di daftar putih
     yang saya definisikan di scripts/content-rules.json
   - GAGAL jika ada <img> tanpa atribut alt
   - Cetak file dan nomor baris untuk setiap pelanggaran

9. scripts/content-rules.json — daftar putih awal berisi path
   halaman roadmap IRATA dan artikel komparatif.

Tambahkan script "check:content" dan "check:worklog" ke package.json.

Selesai: jalankan `pnpm check:content` (harus lulus, belum ada konten)
dan `node scripts/check-worklog.mjs` (harus memberi peringatan karena
log belum ditulis). Tunjukkan kedua output.

Terakhir: tulis entri log pekerjaan pertama sesuai SKILL.md yang baru
saja dibuat.
```

**Cek manual:**
- Buka `CLAUDE.md`, baca sendiri. Kalau ada baris yang menurut Anda tidak akan mencegah kesalahan, hapus.
- Restart Claude Code, jalankan `/context` untuk memastikan `CLAUDE.md` termuat.

**DoD:** semua file ada · hook worklog benar-benar memblokir · `pnpm check:content` jalan · log pertama tertulis

---

## T-103 — Skema Database & Migration

**Prasyarat:** T-102
**Branch:** `feat/db-schema`
**Mode:** Plan Mode

```
Baca @docs/PLAN.md Bab 6 seluruhnya.

Implementasikan skema Drizzle lengkap di db/schema.ts. Semua tabel di
Bab 6.1 PERSIS seperti spesifikasi — nama tabel, nama kolom, tipe, dan
nilai enum jangan diubah.

Wajib:
- Semua index di Bab 6.2 poin 3
- Kolom deleted_at untuk soft delete di leads, articles, media
- translation_group_id bertipe text (UUID) di courses, articles, categories
- created_at / updated_at dengan default timestamp
- Foreign key dengan onDelete yang masuk akal (leads.batch_id → set null,
  lead_activities.lead_id → cascade)

Buat migration awal dengan `pnpm db:generate`.
Buat db/seed/ berisi data contoh realistis: 3 kursus (BNSP, TKPK 1, TKBT 1),
5 batch, 2 instruktur, 3 artikel dummy, 5 leads dummy.
JANGAN pakai data pribadi nyata di seed.

Tulis test Vitest di db/schema.test.ts yang memverifikasi:
- Setiap tabel menerima insert valid
- Constraint NOT NULL bekerja
- Foreign key cascade bekerja
- Soft delete tidak menghapus baris

Jalankan `pnpm db:migrate:local && pnpm db:seed && pnpm test`
dan tunjukkan output.

JANGAN jalankan migration ke remote.
```

**Cek manual:** buka `pnpm db:studio`, lihat tabel terbentuk benar.

**DoD:** semua test lulus · migration ada di `db/migrations/` · seed jalan

---

## T-100b — Produksi Aset Brand

**Prasyarat:** tidak ada
**Mode:** **Manual atau oleh desainer — BUKAN Claude Code**
**Memblokir:** T-104

> Disisipkan dari DESIGN-SYSTEM.md Bab 11.1. File brand yang ada masih raster hasil generasi,
> dengan artefak pada figur pemanjat dan tepi huruf. Semua perlu digambar ulang sebagai vektor
> sebelum dipakai di web.

```
[ ] Redraw seluruh logo sebagai SVG (DESIGN-SYSTEM Bab 5.1):
    logo-primary-light/dark, logo-horizontal-light/dark,
    logo-mono-white/black, icon.svg
[ ] Optimasi SVG (hapus metadata, gabungkan path, target < 8 KB per file)
[ ] Produksi set favicon lengkap (DESIGN-SYSTEM Bab 5.2)
[ ] Putuskan D-16 (monogram "R" untuk ukuran <=32px, atau wordmark RAC apa adanya).
    Wordmark tiga huruf TIDAK akan terbaca di 16x16 px — rekomendasi: monogram.
[ ] Templat kartu OG 1200x630
[ ] Unduh Archivo (variable) + Montserrat, subset Latin + Latin Extended,
    konversi ke WOFF2, simpan di public/fonts/ (DESIGN-SYSTEM Bab 4.4)
[ ] Sesi foto profesional (PLAN Bab 11.4)
```

**DoD:** semua SVG < 8 KB · set favicon lengkap · font WOFF2 ter-subset · D-16 diputuskan

---

## T-104 — Design Token & Komponen UI Primitif

**Prasyarat:** T-103, **T-100b**
**Branch:** `feat/design-system`
**Mode:** Langsung

```
Baca @docs/DESIGN-SYSTEM.md Bab 3 dan Bab 4.

Salin blok @theme di Bab 3 PERSIS APA ADANYA ke src/styles/theme.css.
Jangan mengubah, menambah, atau menghapus satu token pun.
JANGAN mengarang skala warna sendiri dari nilai hex brand guide —
skalanya sudah dihitung.

Tambahkan skala tipografi Bab 4.1.

Font display: Archivo Expanded (variable, self-hosted), dengan
  font-variation-settings "wdth" 118 sesuai Bab 4.2
Font body: Montserrat, self-hosted dari public/fonts/
Font reading: [ISI HASIL D-15 — cek docs/DECISIONS.md dulu.
  Kalau D-15 masih terbuka, BERHENTI dan tanyakan, jangan pilih sendiri]

JANGAN memuat font apa pun dari Google Fonts CDN. Semua self-hosted.

Implementasikan SELURUH tabel aturan pemakaian warna di Bab 3.1 sebagai
varian komponen. Perhatikan khusus:
- Varian eyebrow HARUS punya dua bentuk: eyebrow-on-light (accent-500)
  dan eyebrow-on-dark (accent-400). Ini persyaratan aksesibilitas
  di Bab 2.5, bukan preferensi. Merah brand di atas navy hanya 3,51:1.
- Warna error memakai --color-danger, BUKAN accent-500. Dua merah
  berbeda makna di satu halaman membingungkan.

Tulis test yang memverifikasi rasio kontras setiap pasangan
teks/latar di tabel Bab 7 memenuhi ambangnya. Gunakan pustaka
perhitungan kontras WCAG. Test ini blocking.

Buat src/styles/global.css: reset, base style, gaya fokus terlihat,
dukungan prefers-reduced-motion.

Buat komponen primitif di src/components/ui/ (semua .astro kecuali
disebut lain):
- Button.astro — varian: primary, secondary, ghost, whatsapp;
  ukuran: sm, md, lg; dukung render sebagai <a> atau <button>
- Card.astro
- Badge.astro — varian status
- Input.astro, Textarea.astro, Select.astro — dengan label,
  pesan error, aria-describedby
- Container.astro — pembungkus lebar maksimum
- Section.astro — pembungkus spasi vertikal
- Heading.astro — level 1-6 dengan ukuran yang bisa dipisah dari level

ATURAN: dilarang nilai arbitrer Tailwind seperti text-[#123456] atau
p-[13px]. Semua lewat token. Kalau butuh nilai baru, tambahkan tokennya
di theme.css.

Semua titik sentuh minimal 44x44px. Kontras teks minimal 4.5:1.

Buat halaman /dev/kitchen-sink (hanya untuk development, beri noindex)
yang menampilkan semua varian setiap komponen.

Selesai: jalankan test kontras dan TUNJUKKAN TABEL HASILNYA.
Lalu `pnpm build`, screenshot /dev/kitchen-sink, dan bandingkan
apakah semua varian terender.
```

**Cek manual:**
- Buka `/dev/kitchen-sink` di browser, uji navigasi keyboard (Tab), cek indikator fokus terlihat jelas.
- **Kalibrasi `wdth` Archivo berdampingan dengan wordmark logo.** Nilai 118 adalah titik awal, bukan hasil akhir — sandingkan H1 halaman dengan logo di header dan pastikan keduanya tidak terlihat bertabrakan. Setelah cocok, **kunci angkanya sebagai token** dan jangan diubah per komponen.

**DoD:** tidak ada nilai arbitrer Tailwind di seluruh `src/` · semua varian terender · test kontras lulus untuk seluruh tabel DESIGN-SYSTEM Bab 7 · `wdth` terkalibrasi dan terkunci

---

## T-105 — i18n, Layout, Header, Footer

**Prasyarat:** T-104
**Branch:** `feat/layout-i18n`
**Mode:** Plan Mode

```
Baca @docs/PLAN.md Bab 7 dan Bab 8.4.

1. Sistem i18n di src/lib/i18n/:
   - Locale: 'id' (default, di root) dan 'en' (prefix /en/)
   - Kamus terpisah per locale, bertipe ketat: kunci yang hilang
     di salah satu locale harus jadi error TypeScript
   - Helper: t(key), getLocale(url), localizedPath(path, locale),
     getAlternates(currentPath)
   - Peta slug: setiap rute punya slug ID dan slug EN berbeda
     (lihat tabel Bab 7.1). Simpan sebagai konstanta terpusat
     di src/lib/i18n/routes.ts — ini sumber kebenaran tunggal
     untuk hreflang dan pengalih bahasa.

2. src/layouts/BaseLayout.astro:
   - Menerima props SEO bertipe (title, description, canonical,
     ogImage, noindex) — komponen SeoHead akan dipasang di T-201,
     untuk sekarang sediakan slot-nya
   - lang dan dir sesuai locale
   - Skip-to-content link
   - Slot untuk header, main, footer

3. src/components/layout/Header.astro:
   - Logo, menu maksimal 6 item (Bab 7.3), CTA "Konsultasi WhatsApp"
   - Menu mobile: drawer, terkunci fokus, bisa ditutup dengan Esc
   - Pengalih bahasa yang menuju URL padanan yang BENAR
     (pakai getAlternates, bukan sekadar menambah prefix /en)

4. src/components/layout/Footer.astro:
   - Kolom: Pelatihan, Layanan, Perusahaan, Legal
   - Kontak, alamat, jam operasional (dari konstanta sementara)
   - Pengalih bahasa

5. src/components/islands/FloatingWhatsApp.tsx (React island):
   - Muncul setelah scroll 30%, bisa ditutup, status tutup
     disimpan di sessionStorage
   - client:idle

Buat halaman placeholder untuk / dan /en/ yang memakai BaseLayout.

Selesai: `pnpm typecheck && pnpm build`. Uji manual pengalih bahasa
dari kedua halaman dan tunjukkan hasilnya.
```

**Cek manual:** uji drawer mobile dengan keyboard saja. Uji pengalih bahasa di 3 halaman berbeda.

**DoD:** pengalih bahasa mengarah ke slug padanan yang benar · menu mobile aksesibel keyboard · typecheck bersih

---

## T-106 — CI/CD & Deploy Pertama

**Prasyarat:** T-105
**Branch:** `chore/cicd`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 4.1 dan Bab 12.4.

1. .github/workflows/ci.yml — jalan di setiap PR:
   - Setup Node 20 + pnpm dengan cache
   - pnpm install --frozen-lockfile
   - pnpm lint
   - pnpm typecheck
   - pnpm test
   - pnpm check:content
   - pnpm build
   - Semua langkah harus gagal-cepat

2. .github/workflows/deploy.yml — jalan saat push ke main:
   - Semua langkah ci.yml
   - Deploy ke Cloudflare Workers via wrangler-action
   - Pakai secret CLOUDFLARE_API_TOKEN dan CLOUDFLARE_ACCOUNT_ID

3. .github/workflows/preview.yml — deploy preview untuk setiap PR,
   dan komentari PR dengan URL preview-nya.

4. Konfigurasi Lighthouse CI dengan anggaran performa PLAN.md Bab 12.4.
   Jalankan pada PR, tapi untuk sekarang set sebagai warning saja,
   bukan blocking. Saya akan naikkan jadi blocking di T-219.

JANGAN jalankan deploy dari sesi ini. Saya yang akan trigger
pertama kali lewat push.

Selesai: tunjukkan isi ketiga file workflow dan jelaskan
secret apa saja yang harus saya set di GitHub.
```

**Cek manual:**
- Set GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- Push ke main, pastikan deploy sukses
- Buka domain, pastikan halaman placeholder tayang

**DoD:** CI hijau di PR · deploy otomatis jalan · preview URL muncul di komentar PR

---

# FASE 2 — SITUS PUBLIK

## T-201 — Inti SEO: SeoHead & Generator Schema

**Prasyarat:** T-106
**Branch:** `feat/seo-core`
**Mode:** Plan Mode

> Tugas paling bernilai di seluruh proyek. Kerjakan dengan teliti.

```
Baca @docs/PLAN.md Bab 8.2 seluruhnya.

1. src/components/seo/SeoHead.astro — props bertipe ketat, merender:
   - <title> dan meta description
   - canonical absolut
   - hreflang untuk id, en, dan x-default (x-default → versi ID)
   - Open Graph lengkap (type, title, description, image, url, locale,
     site_name)
   - Twitter Card summary_large_image
   - meta robots (noindex bila diminta)
   - Slot untuk JSON-LD

2. src/lib/seo/schema.ts — generator terpisah, masing-masing bertipe,
   untuk SETIAP jenis di tabel Bab 8.2:
   organization, website, educationalOrganization, localBusiness,
   course (dengan hasCourseInstance), courseInstance, service,
   article, person, faqPage, breadcrumbList, contactPage

   Aturan:
   - Semua generator menerima data terstruktur, BUKAN string HTML
   - Tanggal format ISO 8601
   - URL selalu absolut
   - Field opsional dihilangkan kalau kosong, jangan diisi null
   - Output digabung sebagai array @graph dalam satu <script>

3. src/components/seo/Breadcrumbs.astro — visual + schema sekaligus,
   sumbernya dari routes.ts

4. src/lib/seo/meta.ts — helper: truncate title ke 60 karakter,
   description ke 160, dengan peringatan di console saat development
   kalau terlampaui

Tulis test Vitest yang memvalidasi output setiap generator terhadap
bentuk schema.org yang diharapkan, termasuk kasus data tidak lengkap.

Selesai: `pnpm test` dan tunjukkan output.
Lalu gunakan subagent seo-auditor untuk meninjau implementasi ini
terhadap PLAN.md Bab 8.2.
```

**Cek manual:** setelah ada halaman nyata, tempel URL ke Rich Results Test Google dan Schema Markup Validator.

**DoD:** semua generator ada test-nya · hreflang benar · subagent tidak melaporkan celah

---

## T-202 — Sitemap, robots.txt, llms.txt

**Prasyarat:** T-201
**Branch:** `feat/sitemap-robots`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 8.2 (bagian sitemap) dan Bab 8.3.

1. Sitemap digenerate dari database dan routes.ts, dipecah:
   - /sitemap-index.xml (indeks)
   - /sitemap-pages.xml, /sitemap-courses.xml, /sitemap-articles.xml,
     /sitemap-batches.xml
   - Setiap entri memuat xhtml:link alternate untuk hreflang
   - lastmod dari kolom updated_at
   - Halaman noindex dan halaman dev DIKECUALIKAN

2. public/robots.txt:
   - Izinkan crawler AI berikut secara eksplisit:
     GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot,
     PerplexityBot, Google-Extended, Bingbot, Applebot-Extended
   - Disallow: /admin/, /api/, /dev/
   - Tunjuk ke /sitemap-index.xml

3. /llms.txt — digenerate, format Markdown sesuai konvensi:
   nama organisasi, deskripsi singkat, lalu daftar tertaut halaman
   penting per kategori.
   CATATAN: ini prioritas rendah menurut Bab 8.3. Buat sederhana,
   jangan buat /llms-full.txt dan jangan buat salinan Markdown
   per halaman di tugas ini.

4. /rss.xml untuk artikel, per locale.

Tulis test yang memverifikasi sitemap XML valid dan memuat
alternate hreflang.

Selesai: `pnpm build && pnpm test`, tunjukkan output, dan tampilkan
isi sitemap-index.xml yang dihasilkan.
```

**DoD:** sitemap valid XML · robots.txt mengizinkan crawler AI · halaman noindex tidak masuk sitemap

---

## T-203 — Endpoint Lead

**Prasyarat:** T-103
**Branch:** `feat/api-leads`
**Mode:** Plan Mode

```
Baca @docs/PLAN.md Bab 6.3 dan Bab 13 seluruhnya.

Implementasikan POST /api/leads mengikuti alur 6 langkah Bab 6.3
PERSIS berurutan.

Rincian wajib:
- Verifikasi token Turnstile ke siteverify Cloudflare. Gagal → 400.
- Rate limit memakai KV: maksimal 3 submit per IP per jam.
  Kunci: hash dari IP. Terlampaui → 429 dengan pesan ramah bahasa Indonesia.
- Honeypot field tersembunyi; kalau terisi, kembalikan 200 palsu
  tanpa menyimpan apa pun.
- Validasi Zod di SISI SERVER. Jangan percaya klien.
  Skema di src/lib/validation/lead.ts, dipakai bersama oleh klien
  dan server.
- Normalisasi nomor telepon Indonesia ke +62 di src/lib/utils/phone.ts:
  tangani 08xx, 8xx, +62, 62, spasi, tanda hubung, tanda kurung.
  Tolak nomor yang panjangnya tidak masuk akal.
- ref_code format LEAD-YYYYMMDD-XXXX (4 karakter alfanumerik acak,
  hindari karakter ambigu seperti 0/O dan 1/I).
- Simpan ip_hash (SHA-256 + salt dari env), BUKAN IP mentah.
- INSERT ke D1 SEBELUM mengembalikan respons.
- Kirim notifikasi Resend ke email sales. Kegagalan Resend DI-LOG
  tapi TIDAK memblokir dan TIDAK mengubah respons sukses.
- Nomor WhatsApp tujuan diambil dari tabel settings, dirutekan
  berdasarkan interest_type.
- Bangun waUrl dengan pesan terisi yang memuat ref_code.
- Respons: { ok: true, refCode, waUrl }

Test wajib (Vitest):
- Happy path menyimpan baris dan mengembalikan waUrl benar
- Turnstile gagal → 400, tidak ada baris tersimpan
- Rate limit terlampaui → 429
- Honeypot terisi → 200 tanpa baris tersimpan
- Nomor telepon tidak valid → 400 dengan pesan field spesifik
- Normalisasi telepon: minimal 8 variasi format input
- Resend gagal → tetap 200 dan baris tetap tersimpan
- IP tersimpan sebagai hash, bukan nilai mentah

Selesai: `pnpm test` dan tunjukkan output.
Lalu gunakan subagent security-reviewer untuk meninjau endpoint ini
terhadap PLAN.md Bab 13. Perbaiki temuan yang memengaruhi kebenaran
atau keamanan; abaikan preferensi gaya.
```

**Cek manual:** kirim satu lead sungguhan lewat `curl`, cek barisnya masuk di `db:studio`, cek email notifikasi masuk **inbox**, bukan spam.

**DoD:** semua test lulus · subagent bersih · data tersimpan sebelum redirect

---

## T-204 — LeadForm Island + Alur WhatsApp

**Prasyarat:** T-203, T-104
**Branch:** `feat/lead-form`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 6.3 dan Bab 11.3.

Buat src/components/islands/LeadForm.tsx (React, client:visible).

Props: variant ('training' | 'service' | 'irata_waitlist'),
batchId opsional, judul dan teks tombol yang bisa dikustomisasi.

Field: nama, nomor WhatsApp, email, perusahaan (opsional),
jabatan (opsional), kota, skema yang diminati (hanya untuk variant
training), pesan, checkbox persetujuan data pribadi.

Wajib:
- Skema Zod yang SAMA dengan sisi server (impor, jangan duplikasi)
- Validasi saat blur, bukan saat setiap ketikan
- Widget Turnstile
- Field honeypot tersembunyi (aria-hidden, tabindex -1)
- Status loading pada tombol, tombol nonaktif saat mengirim
- Setelah sukses: tampilkan kartu konfirmasi berisi ref_code
  dan tombol besar "Lanjut ke WhatsApp" — JANGAN redirect otomatis
- Penanganan error: pesan Bahasa Indonesia yang menjelaskan cara
  memperbaiki, bukan kode error
- Checkbox persetujuan TIDAK BOLEH tercentang otomatis (Bab 13.3)
- Teks persetujuan menautkan ke /kebijakan-privasi
- aria-live untuk status kirim, aria-describedby untuk error per field
- Semua teks lewat i18n

Kirim juga data UTM yang tersimpan di sessionStorage (helper akan
dibuat di T-205; untuk sekarang baca dengan aman kalau ada).

Tulis test Playwright: isi form → submit → konfirmasi muncul →
tautan WA memuat ref_code yang benar.

Selesai: `pnpm test:e2e` dan tunjukkan output.
```

**Cek manual:** uji di **Safari iOS dan Chrome Android sungguhan**, bukan hanya emulator. Tautan `wa.me` berperilaku berbeda di tiap platform.

**DoD:** E2E lulus · checkbox consent tidak pre-checked · tautan WA benar di Android dan iOS

---

## T-205 — UTM, Consent Cookie, Loader Analitik

**Prasyarat:** T-204
**Branch:** `feat/consent-analytics`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 13.3 dan Bab 14.2.

1. src/lib/utils/utm.ts:
   - Tangkap utm_source, utm_medium, utm_campaign, utm_content,
     utm_term, gclid, fbclid, dan document.referrer pada kunjungan PERTAMA
   - Simpan di sessionStorage; kunjungan berikutnya TIDAK menimpa
   - Helper getAttribution() untuk dipakai LeadForm

2. src/components/islands/CookieConsent.tsx:
   - Tiga tombol: Terima Semua, Hanya Esensial, Atur
   - "Atur" membuka panel per kategori: esensial (terkunci),
     analitik, pemasaran
   - Preferensi disimpan di cookie 12 bulan
   - Banner tidak boleh menutupi konten utama atau memicu CLS —
     gunakan posisi fixed dengan tinggi yang tercadang
   - Bisa dibuka ulang dari tautan di footer

3. src/lib/analytics/loader.ts:
   - GA4 dan GTM HANYA dimuat setelah consent analitik diberikan
   - Cloudflare Web Analytics boleh dimuat tanpa consent
     (tanpa cookie), tapi tetap sediakan flag untuk mematikannya
   - ID diambil dari tabel settings, bukan hardcode

4. src/lib/analytics/events.ts — definisikan event standar Bab 14.2 poin 3:
   lead_form_view, lead_form_submit, wa_click, batch_view, course_view,
   article_read_75, download_checklist
   Fungsi track() yang aman dipanggil meski consent belum diberikan
   (tidak error, hanya tidak mengirim).

5. Pasang track() di titik-titik yang relevan pada LeadForm
   dan FloatingWhatsApp.

Test: verifikasi tidak ada permintaan jaringan ke Google sebelum
consent diberikan.

Selesai: `pnpm test && pnpm build`, tunjukkan output.
```

**Cek manual:** buka DevTools → Network, muat situs, pastikan **nol** permintaan ke domain Google sebelum menekan Terima.

**DoD:** tidak ada skrip analitik sebelum consent · UTM tertangkap dan ikut terkirim ke `/api/leads` · banner tidak memicu CLS

---

## T-206 — Beranda

**Prasyarat:** T-201, T-204
**Branch:** `feat/homepage`
**Mode:** Plan Mode

```
Baca @docs/PLAN.md Bab 7.3, Bab 8.2, Bab 11.

Bangun beranda versi ID dan EN.

Struktur seksi (urutan ini disengaja — training dulu, sesuai D-01):
1. Hero — judul yang memuat proposisi nilai + dua CTA
   (Lihat Jadwal Pelatihan / Konsultasi WhatsApp) + gambar atau video
2. Sinyal kepercayaan — badge sertifikasi (HANYA BNSP dan Kemnaker,
   PATUHI D-05), jumlah alumni, tahun pengalaman
3. Program pelatihan — grid kartu kursus, diambil dari database
4. Batch terdekat — 3 batch berikutnya dari database, dengan CTA
5. Kenapa memilih kami — 4 poin pembeda
6. Jasa perawatan gedung — seksi ringkas dengan tautan ke pilar layanan
7. Testimoni — dari database
8. Artikel terbaru — 3 artikel
9. FAQ ringkas — 5 pertanyaan, dengan schema FAQPage
10. CTA akhir dengan LeadForm variant training

Schema: Organization, WebSite dengan SearchAction,
EducationalOrganization, LocalBusiness, FAQPage.

Aturan performa:
- Gambar hero: fetchpriority="high", preload, width dan height eksplisit
- Semua gambar lain: loading="lazy"
- Seksi di bawah lipatan tidak boleh memuat JS kecuali benar-benar
  interaktif

Semua teks lewat i18n. JANGAN hardcode string apa pun.
Untuk teks yang belum saya tetapkan, pakai placeholder yang jelas
diawali "TODO:" supaya mudah saya cari.

Struktur seksi mengikuti @docs/DESIGN-SYSTEM.md Bab 6, dengan
PENGECUALIAN WAJIB berikut:

- Seksi bilah statistik: isi HANYA dengan angka yang lolos lembar
  verifikasi di @docs/FAKTA-BISNIS.md. JANGAN mengarang, dan JANGAN
  memakai angka dari mockup (1.200+ peserta, 98% kelulusan,
  250+ proyek, 10+ tahun) — keempatnya belum terverifikasi (D-13).
  Slot yang gugur diisi dari daftar pengganti DESIGN-SYSTEM Bab 2.2
  (Instruktur Bersertifikat Kemnaker, Rasio Instruktur 1:6,
  Area Latihan Ketinggian 12 m, Kurikulum Sesuai Permenaker 9/2016,
  Peralatan Bersertifikat CE/EN, Inspeksi APD Berkala) —
  bukan dikosongkan, bukan dikira-kira.
- Seksi sertifikasi: JANGAN buat seksi "Certified & Recognized" dengan
  logo IRATA, SPRAT, Petzl, IRSM, atau ISO. Buat seksi "Sertifikasi &
  Kepatuhan" sesuai DESIGN-SYSTEM Bab 6.6, isi hanya BNSP, Kemnaker,
  dan legalitas perusahaan. Ini penerapan D-05 dan D-12, PLAN Bab 3.
  Kalau nomor lisensi belum ada di FAKTA-BISNIS.md, JANGAN tayangkan
  seksi ini sama sekali.
- Testimoni: hanya render dari database. Jangan buat testimoni contoh
  yang terlihat nyata; kalau butuh placeholder, tulis jelas
  "TODO: testimoni".
- Tahun hak cipta di footer harus dinamis, bukan angka mati.
- Header dan drawer mobile wajib memuat pengalih bahasa.
- Nada copywriting mengikuti A-11: keunggulan utama adalah sertifikat
  yang DIWAJIBKAN HUKUM INDONESIA, bukan pengakuan internasional.

Selesai: `pnpm build && pnpm check:content`, jalankan Lighthouse pada
beranda, tunjukkan skor. Target Bab 12.4.
Lalu gunakan subagent seo-auditor untuk meninjau halaman ini.
```

**Cek manual:** ganti semua `TODO:` dengan teks final. Uji di lebar 320 px. **Baca sendiri setiap angka yang tayang di bilah statistik** dan pastikan Anda bisa menunjukkan dokumen pendukungnya dalam 5 menit (A-12).

**DoD:** Lighthouse Perf > 95, A11y 100, SEO 100 · schema lolos Rich Results Test · nol string hardcode

---

## T-207 — Pilar Pelatihan & Halaman Kursus

**Prasyarat:** T-206
**Branch:** `feat/training-pages`
**Mode:** Plan Mode

```
Baca @docs/PLAN.md Bab 7.1, Bab 8.1 Klaster A, Bab 8.2.

1. /pelatihan/ dan /en/training/ — halaman pilar:
   - Penjelasan ringkas rope access dan jalur sertifikasi Indonesia
   - Tabel perbandingan skema: BNSP vs Kemnaker TKPK vs Kemnaker TKBT
     (kolom: penerbit, dasar hukum, jenjang, masa berlaku, cocok untuk siapa)
   - Grid semua kursus dari database
   - Tautan ke halaman roadmap IRATA/SPRAT (dibuat di T-208)
   - FAQ dengan schema
   - LeadForm

2. Template halaman kursus /pelatihan/[slug] — digenerate dari
   database courses:
   - Hero: nama kursus, badan sertifikasi, durasi, harga
   - Untuk siapa kursus ini
   - Prasyarat
   - Silabus (dari syllabus_json, render sebagai daftar terstruktur)
   - Apa yang didapat peserta
   - Batch mendatang untuk kursus ini, dari database
   - Instruktur pengampu
   - FAQ spesifik kursus
   - LeadForm dengan course_id terisi otomatis
   - Kursus terkait

Schema per halaman kursus: Course dengan array hasCourseInstance
yang digenerate dari batches. Ini WAJIB benar — ini sumber rich result
utama proyek ini. Sertakan: name, description, provider,
educationalCredentialAwarded, courseMode, timeRequired, offers,
dan setiap CourseInstance dengan startDate, endDate, location, dan
courseWorkload.

PATUHI D-05: dilarang membuat entri kursus IRATA/SPRAT,
dilarang schema Course untuk IRATA/SPRAT.

Selesai: `pnpm build && pnpm check:content`.
Tunjukkan JSON-LD yang dihasilkan untuk satu halaman kursus.
Lalu gunakan subagent seo-auditor.
```

**Cek manual:** tempel JSON-LD ke Rich Results Test, pastikan Google mengenali sebagai Course dengan instance.

**DoD:** `check:content` lulus · schema Course valid dengan instance · tidak ada kursus IRATA/SPRAT di database

---

## T-208 — Halaman Roadmap IRATA/SPRAT + Penjaga D-05

**Prasyarat:** T-207
**Branch:** `feat/irata-roadmap`
**Mode:** Langsung

> Tugas kecil tapi berisiko hukum tertinggi. Baca hasilnya sendiri, kata per kata.

```
Baca @docs/PLAN.md Bab 3 bagian D-05 seluruhnya. Patuhi secara harfiah.

Buat /pelatihan/rencana-irata-sprat dan /en/training/irata-sprat-roadmap.

Halaman ini BUKAN halaman layanan. Ini halaman informasi dan
penangkap lead.

Isi yang diizinkan:
- Penjelasan apa itu IRATA dan SPRAT dan kenapa relevan
- Tabel perbandingan IRATA vs SPRAT vs BNSP vs Kemnaker
  (edukatif, netral, tidak menawarkan)
- Pernyataan status yang JELAS bahwa program ini masih dalam
  tahap persiapan dan BELUM ditawarkan
- LeadForm variant irata_waitlist dengan judul
  "Beritahu saya saat program dibuka"

DILARANG KERAS di halaman ini dan di seluruh situs:
- Logo IRATA atau SPRAT dalam bentuk apa pun
- Frasa "sertifikasi IRATA", "training IRATA", "pelatihan IRATA",
  "IRATA Level 1/2/3" sebagai penawaran
- Harga, jadwal, tombol daftar, atau schema Course untuk IRATA/SPRAT
- Menyebut IRATA/SPRAT di menu utama atau halaman daftar layanan

Tambahkan halaman ini ke daftar putih di scripts/content-rules.json.

Perkuat scripts/check-content.mjs:
- Tambahkan pemeriksaan: file mana pun DI LUAR daftar putih yang memuat
  "IRATA" atau "SPRAT" → GAGAL
- Tambahkan pemeriksaan: bahkan DI DALAM daftar putih, frasa penawaran
  terlarang di atas → GAGAL
- Tambahkan pemeriksaan: tidak ada file gambar dengan nama memuat
  "irata" atau "sprat" di public/ atau src/

Tulis test Vitest untuk check-content.mjs sendiri: berikan contoh
konten yang melanggar dan pastikan validator menangkapnya.

Jadikan `pnpm check:content` sebagai langkah BLOCKING di ci.yml.

Selesai: jalankan `pnpm test && pnpm check:content`, tunjukkan output.
```

**Cek manual:** **Anda baca sendiri seluruh teks halaman ini.** Jangan delegasikan. Satu kalimat ambigu di sini bisa jadi masalah hukum.

**DoD:** `check:content` blocking di CI · test validator lulus · Anda sudah membaca teks final

---

## T-209 — Halaman Jadwal Batch

**Prasyarat:** T-207
**Branch:** `feat/schedule`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 7.1 dan Bab 8.2.

/jadwal/ dan /en/schedule/:
- Daftar batch mendatang dari database, urut tanggal mulai
- Filter (island React): skema, kota, bulan, status
  Filter mengubah URL query param supaya bisa di-bookmark dan
  di-share. Halaman tetap terender server-side — filter bekerja
  tanpa JS sebagai fallback link biasa.
- Setiap kartu batch: nama kursus, tanggal, kota, venue, sisa kuota,
  harga, tombol daftar
- Indikator kuota: "Sisa 3 kursi" saat kurang dari 5, "Penuh" saat 0
- Empty state yang bermanfaat: kalau tidak ada batch cocok,
  tawarkan LeadForm "beritahu saya saat ada jadwal baru"

/jadwal/[slug-batch] — halaman detail per batch:
- Semua detail batch + venue + peta + info transportasi
- LeadForm dengan batch_id terisi otomatis
- Schema CourseInstance lengkap

Schema halaman daftar: ItemList berisi CourseInstance.

Aturan: halaman ini kontennya sering berubah. Set cache TTL lebih
pendek (15 menit) dan beri cache tag 'batches' supaya bisa di-purge
saat dashboard mengubah jadwal.

Selesai: `pnpm build && pnpm test`. Tunjukkan output dan
JSON-LD satu halaman batch.
```

**DoD:** filter bekerja tanpa JS · kuota akurat · schema CourseInstance valid

---

## T-210 — Halaman Layanan

**Prasyarat:** T-206
**Branch:** `feat/services`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 7.1 dan Bab 8.1 Klaster B.

1. /layanan/ dan /en/services/ — pilar:
   - Ringkasan kapabilitas
   - Grid 3 layanan
   - Kenapa rope access dibanding gondola (tabel perbandingan:
     biaya, waktu setup, fleksibilitas, dampak ke penghuni gedung)
   - Proses kerja: survei → penawaran → JSA & rescue plan →
     pelaksanaan → laporan
   - Komitmen K3
   - LeadForm variant service

2. Tiga halaman layanan:
   /layanan/pembersihan-kaca-gedung
   /layanan/sealant-kaca-gedung
   /layanan/inspeksi-fasad
   Masing-masing: masalah yang diselesaikan, metode kerja, standar
   keselamatan, deliverable yang klien terima, FAQ, LeadForm

Schema: Service dengan provider, areaServed (Indonesia),
serviceType, dan hasOfferCatalog.

Nada tulisan berbeda dari halaman pelatihan: audiensnya Facility
Manager dan Building Owner, bukan calon peserta. Fokus pada risiko,
kepatuhan, dan kelangsungan operasi gedung — bukan karier.

Selesai: `pnpm build`, subagent seo-auditor, tunjukkan hasil.
```

**DoD:** schema Service valid · nada sesuai audiens B2B · Lighthouse lulus

---

## T-211 — Fasilitas, Instruktur, Galeri

**Prasyarat:** T-206
**Branch:** `feat/trust-pages`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 7.1 dan Bab 11.4.

1. /fasilitas/ — area latihan, peralatan, rasio instruktur-peserta,
   standar inspeksi alat. Galeri foto fasilitas.

2. /instruktur/ — grid profil dari database.
   /instruktur/[slug] — profil individual: foto, bio, sertifikasi
   dengan nomor dan penerbit, pengalaman, kursus yang diampu.
   Schema Person dengan hasCredential untuk setiap sertifikasi.
   Ini komponen E-E-A-T terpenting di situs — buat detail dan kredibel.

3. /galeri/ — grid masonry, filter per kategori (pelatihan, proyek,
   fasilitas), lightbox aksesibel keyboard.
   Semua gambar dari tabel media dengan alt text dari database.
   Lazy load agresif, tidak boleh ada CLS.

Aturan: JANGAN pakai foto stok, JANGAN generate gambar placeholder
yang terlihat seperti foto asli. Kalau foto belum tersedia, pakai
placeholder abu-abu bertuliskan "TODO: foto [deskripsi]" yang
jelas-jelas bukan foto.

Selesai: `pnpm build && pnpm lighthouse`. Tunjukkan skor galeri
khususnya CLS.
```

**DoD:** CLS < 0,05 di galeri · schema Person dengan credential · tidak ada foto stok

---

## T-212 — Sistem Artikel

**Prasyarat:** T-201
**Branch:** `feat/articles`
**Mode:** Plan Mode

```
Baca @docs/PLAN.md Bab 8.3, Bab 9, dan Bab 6.1 (tabel articles).

1. /artikel/ — daftar berpaginasi, dari database, dengan
   kartu: gambar, kategori, judul, excerpt, waktu baca, tanggal

2. /artikel/kategori/[slug] — daftar per kategori, dengan
   deskripsi kategori sendiri (BUKAN halaman kosong berisi
   daftar saja — itu thin content)

3. /artikel/[slug] — template artikel:
   - Breadcrumb
   - Judul, penulis dengan kredensial, tanggal terbit,
     tanggal diperbarui, waktu baca
   - Untuk artikel regulasi/K3: baris "Ditinjau oleh [nama]"
     dan "Terakhir diverifikasi [tanggal]"
   - BLOK TL;DR di paling atas, gaya visual berbeda (Bab 8.3 poin 3)
   - Daftar isi otomatis dari heading, sticky di desktop
   - Isi artikel dari body_html
   - Blok FAQ dengan schema FAQPage
   - Bagian penulis
   - Artikel terkait
   - CTA LeadForm di akhir

4. Renderer body_json Tiptap → HTML aman:
   dukung heading, paragraf, daftar, tabel, gambar, kutipan,
   blok callout, blok FAQ, blok perbandingan.
   Sanitasi HTML. Tambahkan id otomatis ke setiap heading untuk anchor.

5. /artikel/[slug].md — versi Markdown mentah.
   WAJIB dikirim dengan header X-Robots-Tag: noindex
   (Bab 8.3, mencegah duplikat konten).

6. Schema: Article + Person penulis + BreadcrumbList + FAQPage.

Aturan tipografi: lebar baca maksimal 68 karakter, ukuran font
body minimal 17px di mobile, jarak antarbaris 1.7.

Selesai: `pnpm build && pnpm test`. Tunjukkan output dan
verifikasi header noindex pada versi .md.
```

**DoD:** versi `.md` ber-noindex · TL;DR terender · schema Article valid · lebar baca nyaman

---

## T-213 — Tentang, Kontak, FAQ

**Prasyarat:** T-206
**Branch:** `feat/company-pages`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 7.1 dan Bab 7.2.

1. /tentang-kami/ — cerita perusahaan, legalitas (nomor lisensi
   Kemnaker, status LSP), komitmen K3, tim, nilai.
   Ini halaman E-E-A-T. Cantumkan fakta yang bisa diverifikasi.
   Pakai placeholder "TODO:" untuk data yang belum saya berikan.

2. /kontak/ — alamat lengkap, peta tersemat (lazy load, jangan
   memuat iframe Google Maps sebelum diklik — itu merusak
   performa dan privasi), telepon, email, jam operasional,
   nomor WA per divisi, LeadForm.
   Schema ContactPage + LocalBusiness dengan openingHoursSpecification
   dan geo.

3. /faq/ — FAQ lengkap dari database, dikelompokkan per kategori,
   accordion. PENTING: konten accordion harus tetap ada di DOM
   dan terbaca crawler meski tertutup secara visual (Bab 8.3 poin 6).
   Schema FAQPage.

Selesai: `pnpm build`, subagent seo-auditor.
```

**DoD:** peta lazy-load · konten FAQ ada di DOM saat tertutup · schema LocalBusiness lengkap

---

## T-214 — Halaman Legal

**Prasyarat:** T-205
**Branch:** `feat/legal-pages`
**Mode:** Langsung

> Claude Code menyusun kerangka. **Isi finalnya harus ditinjau penasihat hukum.**

```
Baca @docs/PLAN.md Bab 15 seluruhnya dan Bab 13.3.

Buat SEMUA halaman legal di Bab 7.2, versi ID dan EN:
kebijakan-privasi, syarat-ketentuan, disclaimer, kebijakan-cookie,
kebijakan-pembatalan-refund, kebijakan-k3, aksesibilitas, peta-situs.

Untuk setiap halaman, susun kerangka lengkap dengan SEMUA poin
yang disebut di Bab 15, memakai bahasa yang dapat dipahami orang awam.

Kebijakan Privasi harus mencerminkan alur data NYATA di sistem ini:
Cloudflare (hosting dan analitik), Resend (email), Google
(analitik, kalau consent diberikan), WhatsApp/Meta (komunikasi
lanjutan). Rujuk UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.

Disclaimer WAJIB memuat pernyataan status IRATA/SPRAT sesuai D-05.

Tandai dengan jelas setiap tempat yang butuh data spesifik saya
(nama PT, alamat, email DPO, periode retensi, persentase refund)
memakai penanda "TODO:".

Tambahkan komponen kecil yang menampilkan "Terakhir diperbarui:
[tanggal]" di setiap halaman legal.

Halaman /peta-situs (HTML untuk manusia) digenerate otomatis
dari routes.ts dan database.

Selesai: `pnpm build`. Daftarkan semua penanda TODO yang Anda buat,
kelompokkan per halaman, supaya saya bisa mengisinya sekaligus.
```

**Cek manual:** isi semua `TODO:`, lalu **kirim ke penasihat hukum** sebelum launch.

**DoD:** semua halaman ada · daftar TODO terkumpul · disclaimer memuat pernyataan D-05

---

## T-215 — 404, Redirect, Error Handling

**Prasyarat:** T-103
**Branch:** `feat/error-handling`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 15.7 dan Bab 6.1 (tabel redirects).

1. Halaman 404 per locale: kotak pencarian, tautan ke halaman
   terpopuler, tombol WhatsApp. Jangan buntu.

2. Middleware redirect: cek tabel redirects sebelum mengembalikan 404.
   Kalau ada kecocokan, kembalikan 301/302 sesuai kolom status_code
   dan naikkan penghitung hits.

3. Log setiap 404 ke tabel redirects dengan to_path null, supaya
   muncul di dashboard sebagai antrean untuk ditinjau.
   Jangan log 404 dari bot yang jelas atau path sampah umum
   (/wp-admin, /.env, dsb) — buat daftar abaikan.

4. Halaman error 500 yang ramah, tanpa membocorkan detail teknis.

5. Integrasikan Sentry (opsional, di balik env var) untuk error
   sisi server.

Test: 404 terender benar, redirect bekerja, penghitung hits naik.

Selesai: `pnpm test && pnpm build`, tunjukkan output.
```

**DoD:** 404 tidak buntu · redirect dari database bekerja · 404 sampah tidak membanjiri tabel

---

## T-216 — Lapisan Cache & Purge

**Prasyarat:** T-209, T-212
**Branch:** `feat/caching`
**Mode:** Plan Mode

> ⚠️ **Prompt ini ditulis ulang di v1.1.** Versi lama membangun `purgeByTag` di atas **Cache API** —
> itu tidak bisa bekerja. Cache API bersifat **per-colo** (`delete()` hanya menghapus di satu pusat
> data, bukan 300+), dan purge berbasis *Cache Tag* adalah fitur **Enterprise**, tidak tersedia di
> paket Workers Paid $5 yang dianggarkan. Baca ADR-002 di `docs/DECISIONS.md` sebelum mulai.

```
Baca @docs/PLAN.md Bab 12.1 seluruhnya, termasuk blok koreksi ADR-002,
dan @docs/DECISIONS.md ADR-002.

PENTING — batasan platform yang menentukan desain:
- Cache API Workers bersifat PER-COLO. caches.default.delete(url) TIDAK
  menghapus salinan di pusat data lain. Jangan bangun purge di atasnya.
- Header Cache-Tag dan purge-by-tag lewat API adalah fitur Enterprise.
  Kita di paket Workers Paid. Jangan pakai.
- KV bersifat GLOBAL. Itulah kenapa KV yang jadi penyimpan cache,
  bukan Cache API.

Implementasikan:

1. src/lib/cache/ — helper di atas KV:
   - pageKey(locale, path) -> 'page:<locale>:<path>'
   - getCachedPage(locale, path) -> { html, renderedAt } | null
   - putCachedPage(locale, path, html, tags[]) — simpan HTML,
     LALU tambahkan pageKey ke setiap indeks 'tag:<nama>'
   - purgeByTag(tag) — baca indeks 'tag:<nama>', hapus setiap kunci
     halaman di dalamnya, lalu hapus indeksnya sendiri
   - purgeByTags(tags[]) — batch, dedup kunci sebelum menghapus

   Indeks tag disimpan sebagai JSON array di KV. Kalau daftarnya
   melebihi batas ukuran nilai KV, pecah jadi 'tag:<nama>:<n>'.

2. Sistem cache tag — setiap halaman publik diberi tag saat dirender:
   'global', 'article:<id>', 'course:<id>', 'batch:<id>',
   'articles-list', 'batches-list'
   Saat sebuah entitas dipublikasikan atau diubah, HANYA tag terkait
   yang di-purge.

3. Header cache per jenis rute:
   - Halaman publik: 's-maxage=60, stale-while-revalidate=86400'
     TTL edge sengaja PENDEK. Edge tidak di-purge — dibiarkan
     kedaluwarsa sendiri. Kebenaran datang dari KV.
   - Aset ber-hash: 'max-age=31536000, immutable'
   - Dokumen HTML di browser: 'no-cache' + ETag
   - MUTLAK: /admin/* dan /api/* -> 'private, no-store'.
     Tulis test yang memverifikasi ini dan jadikan BLOCKING di CI.

4. Endpoint internal POST /api/revalidate — dilindungi (hanya bisa
   dipanggil dari dashboard dengan otorisasi), menerima daftar tag.

Test wajib:
- /admin/* dan /api/* tidak pernah punya header cache publik
- purgeByTag menghapus TEPAT kunci halaman bertag itu, dan tidak
  menyentuh halaman lain — buktikan dengan tiga halaman, dua tag
- purgeByTag pada tag yang tidak ada tidak melempar error
- Indeks tag tidak menumpuk duplikat saat halaman sama di-cache dua kali
- Halaman yang di-cache mengembalikan konten sama pada permintaan kedua

JANGAN memakai caches.default untuk purge. Kalau Anda merasa perlu,
berhenti dan baca ulang ADR-002.

Selesai: `pnpm test`, tunjukkan output.
```

**Cek manual:** setelah deploy, terbitkan satu artikel dan **cek dari dua jaringan berbeda** (misal WiFi dan data seluler) bahwa perubahan muncul dalam waktu < 60 detik di keduanya. Inilah yang membuktikan purge benar-benar global, dan inilah tepatnya yang gagal pada desain lama.

**DoD:** test no-cache untuk admin/api blocking di CI · purge selektif terbukti lewat test · nol pemakaian `caches.default` untuk purge · jendela basi maksimal 60 detik terverifikasi dari dua jaringan

---

## T-217 — Pipeline Gambar

**Prasyarat:** T-211
**Branch:** `feat/images`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 12.2.

1. Komponen src/components/ui/Image.astro yang membungkus
   Cloudflare Images:
   - Props: mediaId (dari tabel media), alt, sizes, priority
   - Generate srcset 400/800/1200/1600
   - Format otomatis AVIF/WebP
   - width dan height SELALU ada (dari kolom media) — mencegah CLS
   - loading="lazy" default, "eager" + fetchpriority="high"
     kalau priority true
   - Placeholder blur LQIP untuk gambar priority

2. Aturan yang ditegakkan: dilarang memakai <img> mentah
   di seluruh src/. Tambahkan aturan ESLint kustom atau
   pemeriksaan di check-content.mjs yang menggagalkan build
   kalau menemukannya.

3. Helper upload di src/lib/media/ untuk dipakai dashboard nanti:
   validasi MIME, batas 5MB, nama file diacak, ekstraksi dimensi,
   simpan ke R2, catat ke tabel media.

4. Font: self-host di public/fonts/, WOFF2, subset Latin +
   Latin Extended, preload font display, font-display: swap.
   Hapus semua referensi ke Google Fonts CDN.

Test: komponen Image selalu menghasilkan width, height, dan alt.
Build gagal kalau ada <img> mentah.

Selesai: `pnpm build && pnpm lighthouse`, tunjukkan skor
dan bandingkan CLS sebelum-sesudah.
```

**DoD:** nol `<img>` mentah · CLS < 0,05 · font self-hosted

---

## T-218 — Header Keamanan & CSP

**Prasyarat:** T-205
**Branch:** `feat/security-headers`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 13.1 dan Bab 13.2.

1. Middleware yang memasang semua header Bab 13.1:
   HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
   Permissions-Policy.

2. CSP persis seperti Bab 13.2, dengan nonce yang digenerate
   per permintaan untuk skrip inline.
   MULAI dengan Content-Security-Policy-Report-Only.
   Tambahkan report-uri ke endpoint /api/csp-report yang mencatat
   pelanggaran ke log (bukan ke database, supaya tidak bisa dibanjiri).

3. Audit seluruh kode: hapus semua skrip inline yang tidak bernonce,
   hapus semua style inline yang tidak perlu.

4. Endpoint /api/health untuk uptime monitoring.

Test: verifikasi semua header ada di respons halaman publik.

Selesai: `pnpm test && pnpm build`.
Lalu gunakan subagent security-reviewer untuk audit menyeluruh
terhadap PLAN.md Bab 13. Laporkan temuan.
```

**Cek manual:** biarkan Report-Only selama seminggu, kumpulkan laporan pelanggaran, baru aktifkan penuh.

**DoD:** semua header terpasang · CSP Report-Only aktif · subagent security bersih

---

## T-219 — E2E, Anggaran Performa, Gerbang CI

**Prasyarat:** semua tugas Fase 2
**Branch:** `test/e2e-budgets`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 12.4 dan Bab 19.

1. Suite Playwright lengkap:
   - Alur lead end-to-end untuk ketiga variant
   - Navigasi: setiap halaman utama termuat, status 200
   - Pengalih bahasa dari 5 halaman berbeda menuju padanan benar
   - Filter jadwal bekerja dengan dan tanpa JS
   - Banner consent: tidak ada skrip Google sebelum diterima
   - Navigasi keyboard: menu, form, lightbox galeri
   - Halaman 404 dan redirect

2. Lighthouse CI dengan anggaran Bab 12.4, dijalankan pada
   10 URL kunci. UBAH DARI WARNING MENJADI BLOCKING.

3. Test aksesibilitas otomatis dengan axe-core pada semua
   template halaman. Blocking.

4. Tambahkan ke ci.yml: pnpm test:e2e, lighthouse, a11y.

5. Buat docs/QA-CHECKLIST.md dari Bab 19 sebagai checklist
   Markdown yang bisa dicentang.

Selesai: jalankan seluruh suite dan tunjukkan output lengkap.
Kalau ada anggaran yang tidak terpenuhi, laporkan halaman mana
dan metrik mana — JANGAN turunkan ambangnya untuk membuat lulus.
```

**DoD:** semua anggaran terpenuhi tanpa menurunkan ambang · CI blocking aktif · suite E2E hijau

---

# FASE 3 — DASHBOARD

## T-301 — Autentikasi & Otorisasi

**Prasyarat:** T-219
**Branch:** `feat/admin-auth`
**Mode:** Plan Mode

```
Baca @docs/PLAN.md Bab 10.1 dan Bab 13.

1. Konfigurasi Cloudflare Access untuk /admin/*.
   Tulis instruksi setup di docs/RUNBOOK.md — saya yang akan
   mengkonfigurasi di dashboard Cloudflare.

2. Middleware verifikasi JWT Access:
   - Validasi token dari header Cf-Access-Jwt-Assertion
   - Verifikasi signature terhadap JWKS Cloudflare
   - Ekstrak email, cocokkan dengan tabel users
   - Kalau email tidak ada di tabel users atau active=false → 403
   - Sisipkan user ke context

3. Helper otorisasi requireRole(role):
   - Dipanggil di SETIAP handler API admin, bukan hanya di UI
   - Peran: admin, editor, sales sesuai matriks Bab 10.1

4. Middleware audit: setiap mutasi admin dicatat ke audit_log
   (user, aksi, entitas, diff, ip_hash, waktu).

Test wajib:
- Permintaan tanpa token → 403
- Token valid tapi email tidak terdaftar → 403
- Editor mengakses endpoint leads → 403
- Sales mengakses endpoint artikel POST → 403
- Setiap mutasi menghasilkan baris audit_log

Selesai: `pnpm test`, tunjukkan output.
Lalu subagent security-reviewer khusus untuk lapisan auth ini.
```

**Cek manual:** konfigurasikan Cloudflare Access, tambahkan email Anda dan staf ke tabel `users`, uji login sungguhan.

**DoD:** otorisasi dicek di server per handler · semua test peran lulus · audit log jalan

---

## T-302 — AdminLayout & Beranda Dashboard

**Prasyarat:** T-301
**Branch:** `feat/admin-shell`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 10.4.

1. src/layouts/AdminLayout.astro:
   - Sidebar navigasi yang menampilkan HANYA modul sesuai peran
   - Header: nama pengguna, peran, tautan ke situs publik, logout
   - Responsif: sidebar jadi drawer di mobile
   - no-cache, noindex

2. /admin/ — beranda dashboard:
   - Kartu ringkasan: lead hari ini, lead minggu ini, artikel draft,
     artikel terjadwal, batch mendatang, kuota hampir penuh
   - Daftar 10 lead terbaru dengan tautan cepat
   - Antrean tugas: artikel menunggu review, 404 belum ditangani

3. Komponen admin di src/components/admin/:
   DataTable (sortir, filter, paginasi), StatusBadge, ConfirmDialog,
   Toast, EmptyState, FormField

ATURAN UX (Bab 10.4) — ini untuk staf non-teknis:
- SELURUH antarmuka Bahasa Indonesia
- Pesan error menjelaskan CARA MEMPERBAIKI, bukan hanya apa yang salah
- Aksi destruktif butuh konfirmasi ketik-untuk-konfirmasi
- Setiap kolom teknis punya tooltip penjelasan

Selesai: `pnpm build && pnpm test:e2e`, tunjukkan output.
```

**Cek manual:** minta satu staf non-teknis membukanya dan katakan apa yang membingungkan. Catat dan perbaiki.

**DoD:** menu sesuai peran · seluruh UI Bahasa Indonesia · staf bisa menavigasi tanpa dijelaskan

---

## T-303 — Editor Artikel Tiptap

**Prasyarat:** T-302
**Branch:** `feat/article-editor`
**Mode:** Plan Mode

```
Baca @docs/PLAN.md Bab 10.2 bagian A.

Editor artikel di /admin/artikel/[id] — React island.

Extension Tiptap: heading (h2-h4 saja, h1 dari judul), bold, italic,
bulletList, orderedList, link, image (dari media library), blockquote,
table, codeBlock, horizontalRule.

Node kustom:
- Callout (varian: info, peringatan, tips)
- FaqBlock (pasangan pertanyaan-jawaban, masuk ke schema)
- ComparisonTable
- TldrBlock (satu per artikel, dipaksa di posisi paling atas)

Wajib:
- Simpan otomatis setiap 30 detik ke draft, dengan indikator
  "Tersimpan HH:MM"
- DILARANG input Markdown mentah atau HTML mentah (Bab 10.4)
- Sisip internal link: pencarian artikel/halaman dalam modal,
  tanpa keluar dari editor
- Sisip gambar dari media library, alt text WAJIB diisi
  sebelum bisa disisipkan
- Toolbar sticky
- Hitung kata dan waktu baca real-time
- Ctrl+S menyimpan

Simpan body_json (Tiptap JSON) dan body_html (hasil render, di-cache).
Render HTML di SERVER saat simpan, bukan di klien — supaya konsisten
dengan yang dilihat crawler.

Selesai: `pnpm test:e2e` dengan skenario: buat artikel, sisipkan
setiap jenis node, simpan, muat ulang, verifikasi isi utuh.
```

**DoD:** semua node kustom tersimpan dan termuat utuh · autosave jalan · tidak ada input HTML mentah

---

## T-304 — Panel SEO & Gerbang Publish

**Prasyarat:** T-303
**Branch:** `feat/seo-panel`
**Mode:** Plan Mode

> Ini yang menegakkan D-11 anti thin-content. Kerjakan lengkap, jangan disederhanakan.

```
Baca @docs/PLAN.md Bab 9 seluruhnya dan Bab 10.2 bagian A.

Panel SEO di sidebar kanan editor, memuat SEMUA pemeriksaan berikut,
masing-masing dengan indikator merah/kuning/hijau:

1. Preview hasil Google (mobile dan desktop)
2. Panjang meta title (target 50-60) dan description (140-160)
3. Focus keyword: kerapatan + peringatan keyword stuffing
4. Cek kanibalisasi: apakah focus_keyword sudah dipakai artikel lain
   yang terbit — tampilkan artikel mana
5. Jumlah internal link keluar (minimal 3)
6. Jumlah tautan eksternal berwibawa (minimal 2)
7. Semua gambar punya alt text
8. Jumlah kata vs ambang Bab 9.3 (pilar 1500, pendukung 800)
9. Blok TL;DR ada dan 40-60 kata
10. Jumlah butir FAQ (minimal 3)
11. Jumlah gambar orisinal (minimal 2)
12. Checklist 8 elemen nilai unik Bab 9.2 — pengguna mencentang
    manual, minimal 3 harus tercentang, dan wajib mengisi keterangan
    singkat untuk setiap yang dicentang
13. Preview kartu Open Graph
14. Preview JSON-LD yang akan digenerate
15. Untuk artikel kategori regulasi/K3: field peninjau WAJIB terisi

GERBANG PUBLISH (Bab 9.5):
Tombol Publish NONAKTIF sampai semua pemeriksaan hijau.
Tampilkan daftar apa yang masih kurang, dalam bahasa yang jelas,
dengan tautan langsung ke bagian yang perlu diperbaiki.

Tambahan gerbang: jalankan pemeriksaan D-05 pada isi artikel.
Kalau memuat frasa IRATA/SPRAT terlarang → blokir dengan pesan
yang merujuk aturan.

Skor kesiapan publish ditampilkan sebagai persentase di atas panel.

Tulis test untuk SETIAP pemeriksaan: beri konten yang melanggar,
pastikan pemeriksaan menangkapnya dan tombol Publish nonaktif.

Selesai: `pnpm test` dan tunjukkan output lengkap.
```

**Cek manual:** coba sendiri terbitkan artikel buruk. Kalau lolos, gerbangnya bocor.

**DoD:** semua 15 pemeriksaan ada test-nya · artikel buruk tidak bisa terbit · pemeriksaan D-05 aktif

---

## T-305 — Revisi & Editor Terjemahan

**Prasyarat:** T-303
**Branch:** `feat/revisions-i18n-editor`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 6.1 (article_revisions) dan Bab 8.4.

1. Riwayat revisi:
   - Snapshot body_json setiap kali publish, dengan catatan perubahan
   - Daftar revisi dengan waktu, pengguna, catatan
   - Tampilan diff antar revisi (level teks, mudah dibaca orang awam)
   - Tombol pulihkan dengan konfirmasi

2. Editor terjemahan berdampingan:
   - Dua kolom: ID | EN, terhubung lewat translation_group_id
   - Status terjemahan: belum ada / draft / selaras / kedaluwarsa
     (kedaluwarsa = versi sumber berubah setelah terjemahan dibuat)
   - Tombol "buat versi EN" yang membuat artikel pasangan dengan
     translation_group_id sama
   - Peringatan visual kalau versi sumber lebih baru

3. PENTING (Bab 8.4): JANGAN buat fitur terjemahan otomatis
   satu-klik yang langsung mengisi konten. Itu akan menghasilkan
   terjemahan mesin mentah yang dipublikasikan.
   Yang boleh: tombol yang membuat KERANGKA kosong dengan struktur
   heading sama, untuk diisi manusia.

Test: revisi tersimpan, diff akurat, pulihkan bekerja,
status kedaluwarsa terdeteksi benar.

Selesai: `pnpm test`, tunjukkan output.
```

**DoD:** diff terbaca orang awam · status terjemahan akurat · tidak ada auto-translate

---

## T-306 — Pipeline Publish

**Prasyarat:** T-304, T-216
**Branch:** `feat/publish-pipeline`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 12.1 dan Bab 8.2.

Saat artikel/kursus/batch dipublikasikan atau diubah, jalankan
berurutan dan atomik:

1. Validasi ulang gerbang publish di SERVER (jangan percaya UI)
2. Render body_json → body_html, simpan
3. Hitung ulang word_count dan reading_time
4. Simpan revisi
5. Set published_at kalau publish pertama
6. Purge cache tag terkait via /api/revalidate
7. Regenerasi sitemap yang terpengaruh
8. Catat ke audit_log
9. Kembalikan hasil ke UI dengan tautan preview

Kalau ada langkah gagal, rollback status ke sebelumnya dan
tampilkan error yang jelas. Jangan tinggalkan status setengah jadi.

Fitur terjadwal: artikel dengan status 'scheduled' dan published_at
di masa depan diterbitkan oleh Cron Trigger tiap 15 menit.

Test: publish memicu purge tag yang benar, sitemap ter-update,
kegagalan memicu rollback.

Selesai: `pnpm test`, tunjukkan output.
```

**DoD:** validasi gerbang diulang di server · purge tepat sasaran · rollback bekerja saat gagal

---

## T-307 — Modul Leads

**Prasyarat:** T-302
**Branch:** `feat/admin-leads`
**Mode:** Plan Mode

```
Baca @docs/PLAN.md Bab 10.2 bagian B.

1. /admin/leads — tabel:
   - Kolom: tanggal, nama, telepon, minat, skema, kota, sumber,
     status, penerima tugas
   - Filter: status, jenis minat, rentang tanggal, sumber, UTM,
     penerima tugas, kota
   - Pencarian: nama, telepon, email, perusahaan, ref_code
   - Urutan dan paginasi sisi server
   - Aksi massal: ubah status, tugaskan

2. Tampilan Kanban per status, drag untuk memindahkan.
   Perpindahan otomatis mencatat lead_activity tipe status_change.

3. /admin/leads/[id] — detail:
   - Seluruh isi form
   - Halaman asal, referrer, seluruh data UTM
   - Linimasa aktivitas lengkap
   - Form tambah catatan
   - TOMBOL "Chat via WhatsApp": buka wa.me dengan template pesan
     sesuai interest_type, template disimpan di tabel settings
     sehingga bisa diubah tanpa deploy.
     Klik tombol otomatis mencatat lead_activity tipe wa.
   - Ubah status dan penerima tugas

4. Ekspor CSV menghormati filter aktif. Ekspor dicatat di audit_log
   (Bab 13.3).

5. Widget statistik: lead per hari 30 hari terakhir, per sumber,
   per jenis minat, rasio konversi per status.

AKSES: hanya peran admin dan sales. Editor → 403.

Test: filter akurat, kanban memindahkan status dan mencatat aktivitas,
ekspor menghormati filter, editor tidak bisa mengakses.

Selesai: `pnpm test && pnpm test:e2e`, tunjukkan output.
```

**DoD:** editor tidak bisa akses · tombol WA mencatat aktivitas · ekspor tercatat di audit log

---

## T-308 — Modul Jadwal Batch

**Prasyarat:** T-302
**Branch:** `feat/admin-batches`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 10.2 bagian C.

1. /admin/kursus — CRUD kursus. Editor silabus terstruktur
   (bukan textarea bebas) yang menghasilkan syllabus_json rapi.

2. /admin/jadwal — CRUD batch:
   - Tampilan tabel dan tampilan kalender bulanan
   - Buat batch: pilih kursus, tanggal, kota, venue, kuota, harga
   - Duplikat batch untuk membuat jadwal berulang
   - Batch massal: buat N batch dengan interval mingguan/bulanan

3. Manajemen kuota:
   - seats_taken naik otomatis saat registrasi dikonfirmasi
   - Status otomatis: penuh saat seats_taken = capacity
   - Peringatan visual saat sisa kuota < 20%

4. Publish batch → purge tag 'batches' dan 'batches-list',
   regenerasi sitemap-batches.xml, perbarui schema CourseInstance
   di halaman kursus terkait.

5. Cron tiap jam: perbarui status berdasarkan tanggal
   (dibuka → berjalan saat start_date, berjalan → selesai
   saat end_date lewat).

Test: kuota akurat, status transisi benar, purge terpicu.

Selesai: `pnpm test`, tunjukkan output.
```

**DoD:** kuota tidak pernah negatif atau melebihi kapasitas · publish memicu purge · cron status bekerja

---

## T-309 — Media Library

**Prasyarat:** T-217, T-302
**Branch:** `feat/media-library`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 10.3 dan Bab 12.2.

/admin/media:
- Upload drag-and-drop, banyak file sekaligus, indikator progres
- Validasi: whitelist MIME (jpeg, png, webp, avif, pdf, mp4),
  maksimal 5MB, nama file diacak
- ALT TEXT ID DAN EN WAJIB diisi sebelum media bisa dipakai
  di mana pun. Media tanpa alt text ditandai merah dan tidak
  muncul di pemilih gambar editor.
- Caption dan kredit opsional
- Pencarian per nama file, alt text, tanggal
- Grid dengan preview, detail: dimensi, ukuran, dipakai di mana
- Ganti file tanpa mengubah id (supaya referensi tidak putus)
- Hapus: soft delete, dan PERINGATAN kalau media sedang dipakai,
  sebutkan di halaman mana

Test: upload berhasil masuk R2 dan tabel media, media tanpa alt
tidak muncul di pemilih, hapus memperingatkan kalau dipakai.

Selesai: `pnpm test`, tunjukkan output.
```

**DoD:** alt text benar-benar wajib · media terpakai tidak bisa dihapus diam-diam · dimensi terekstrak otomatis

---

## T-310 — Pengaturan, Redirect, Audit Log

**Prasyarat:** T-302
**Branch:** `feat/admin-settings`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 10.3, Bab 14.2, Bab 15.7.

1. /admin/pengaturan:
   - Nomor WhatsApp per divisi + template pesan per interest_type
   - Jam operasional, alamat, kontak
   - Banner pengumuman situs (aktif/nonaktif, teks ID+EN, tautan)
   - ID integrasi: GA4, GTM, verifikasi GSC, verifikasi Bing,
     Cloudflare Web Analytics token
   - Email penerima notifikasi lead
   Semua perubahan langsung berlaku (purge KV), tanpa deploy.

2. /admin/redirect:
   - Tabel redirect dengan penghitung hits
   - ANTREAN 404: path yang menghasilkan 404 tapi belum punya
     redirect, urut frekuensi. Satu klik untuk membuat redirect.
   - Impor CSV massal

3. /admin/audit — tampilan read-only audit_log dengan filter
   pengguna, aksi, entitas, rentang tanggal. Hanya peran admin.

4. /admin/pengguna — CRUD pengguna dan peran. Hanya peran admin.
   Menonaktifkan pengguna langsung memutus aksesnya.

Test: perubahan setting langsung berlaku tanpa deploy, redirect
dari antrean 404 bekerja, non-admin tidak bisa akses audit.

Selesai: `pnpm test`, tunjukkan output.
```

**DoD:** nomor WA bisa diubah tanpa deploy · antrean 404 berfungsi · audit terbatas admin

---

## T-311 — Cron Jobs

**Prasyarat:** T-306, T-308
**Branch:** `feat/cron`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 12.5 dan Bab 6.2 poin 5.

Implementasikan SEMUA Cron Trigger di tabel Bab 12.5:

1. Harian 02:00 WIB — backup D1 ke R2:
   - Ekspor seluruh tabel sebagai SQL
   - Simpan ke R2 dengan nama bertanggal
   - Retensi 30 hari, hapus yang lebih tua
   - Kirim email kalau backup GAGAL (bukan kalau sukses)

2. Harian 03:00 WIB — regenerasi seluruh sitemap

3. Harian 07:00 WIB — ringkasan lead kemarin via Resend:
   jumlah lead, per sumber, per jenis minat, daftar lead yang
   belum di-follow-up lebih dari 24 jam

4. Mingguan Senin 06:00 — laporan performa:
   halaman teratas, lead per sumber, artikel terbit minggu lalu

5. Tiap jam — perbarui status batch berdasarkan tanggal

6. Tiap 15 menit — terbitkan artikel terjadwal yang sudah waktunya

7. Bulanan — anonimkan lead yang tidak ada aktivitas selama
   24 bulan (Bab 13.3 retensi data)

Setiap cron harus idempoten dan mencatat hasil.
Kegagalan cron mengirim peringatan, bukan diam.

Test: setiap fungsi cron bisa dipanggil manual dan menghasilkan
efek yang benar. Uji idempotensi dengan memanggil dua kali.

Selesai: `pnpm test`, tunjukkan output.
Tulis instruksi konfigurasi cron di wrangler.toml, tapi JANGAN deploy.
```

**Cek manual:** setelah deploy, picu backup manual dan **verifikasi file benar-benar ada di R2 dan bisa di-restore**. Backup yang belum pernah diuji restore bukan backup.

**DoD:** semua cron idempoten · kegagalan memicu peringatan · restore sudah diuji

---

## T-312 — E2E Dashboard & Panduan Staf

**Prasyarat:** semua tugas Fase 3
**Branch:** `docs/staff-guide`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 10.4 dan Bab 19.

1. Suite E2E Playwright untuk dashboard:
   - Login sebagai tiap peran, verifikasi menu yang terlihat
   - Alur lengkap: buat artikel → isi semua field → gerbang publish
     memblokir → perbaiki → publish → muncul di situs publik
   - Alur lead: submit dari situs publik → muncul di dashboard →
     ubah status → catat aktivitas → ekspor
   - Alur batch: buat → publish → muncul di halaman jadwal publik
   - Upload media → alt wajib → sisipkan ke artikel

2. docs/PANDUAN-DASHBOARD.md — panduan untuk staf non-teknis,
   Bahasa Indonesia sederhana, dengan tangkapan layar:
   - Cara login
   - Cara menulis artikel yang lolos gerbang publish
   - Penjelasan setiap pemeriksaan SEO dan cara memperbaikinya
   - Cara menangani lead baru
   - Cara menambah jadwal batch
   - Cara upload gambar dan menulis alt text yang baik
   - Apa yang TIDAK boleh dilakukan (menyebut IRATA/SPRAT sebagai
     penawaran, memublikasikan tanpa peninjau untuk konten K3,
     pakai foto stok)
   - Ke mana bertanya kalau bingung

Selesai: `pnpm test:e2e`, tunjukkan output lengkap.
```

**Cek manual:** duduk bersama staf, minta mereka menerbitkan satu artikel sungguhan sambil hanya memakai panduan. Catat setiap kali mereka bertanya — itu daftar perbaikan Anda.

**DoD:** staf berhasil menerbitkan tanpa bantuan Anda · semua alur E2E hijau

---

# FASE 4 — KONTEN & PELUNCURAN

## T-401 — Persiapan Operasi Konten

**Prasyarat:** T-312
**Branch:** `docs/content-ops`
**Mode:** Langsung

```
Baca @docs/PLAN.md Bab 9 dan Bab 8.1.

Buat perangkat kerja konten:

1. docs/CONTENT-BRIEF-TEMPLATE.md — template brief memuat:
   focus keyword, keyword sekunder, search intent, tipe halaman,
   audiens, 5 hasil teratas dan celahnya, sudut pandang unik kita,
   3 elemen nilai unik yang akan dipakai, kerangka heading,
   internal link yang direncanakan, sumber eksternal,
   siapa penulis, siapa peninjau

2. docs/KEYWORD-MAP.md — struktur tabel: keyword, klaster, volume,
   kesulitan, intent, halaman target, status, tanggal terbit.
   Isi dengan struktur klaster Bab 8.1; angka volume saya isi
   dari hasil riset alat SEO.

3. ~~.claude/skills/content-writer/SKILL.md~~ — ✅ **SUDAH DIBUAT DI T-102.**
   Skill ini dimajukan dari Fase 4 ke Fase 1: ia yang melarang Claude
   menjadi sumber fakta regulasi, dan menundanya sampai Fase 4 berarti
   seluruh Fase 2 ditulis tanpa pengaman itu. Di tugas ini cukup
   **tinjau ulang** isinya terhadap pengalaman nyata Fase 2–3 dan
   perbaiki kalau ada celah. Isi yang sudah terpasang:
   - WAJIB pola answer-first di setiap subjudul
   - WAJIB blok TL;DR 40-60 kata
   - WAJIB sebut entitas eksplisit ("Permenaker No. 9 Tahun 2016",
     bukan "peraturan tersebut")
   - DILARANG mengarang fakta regulasi, angka, harga, nomor sertifikat
   - DILARANG menulis pengalaman atau data lapangan seolah-olah milik
     perusahaan — itu harus datang dari saya
   - Tugas Claude: struktur, kejelasan, konsistensi istilah,
     kepatuhan SEO. BUKAN sumber fakta.
   - Setiap klaim faktual harus ditandai [SUMBER?] kalau tidak
     saya sediakan

4. docs/GAYA-BAHASA.md — panduan gaya: sapaan, tingkat formalitas,
   penulisan istilah teknis dan singkatan, konsistensi
   ("rope access" bukan "rope-access"), format angka dan tanggal.

Selesai: tunjukkan isi keempat file.
```

**DoD:** skill content-writer melarang mengarang fakta · brief template lengkap · panduan gaya jelas

---

## T-402 — Audit Pra-Peluncuran

**Prasyarat:** konten 15 artikel selesai, semua TODO terisi
**Branch:** `chore/pre-launch-audit`
**Mode:** Plan Mode

```
Baca @docs/PLAN.md Bab 14.3 dan Bab 19 seluruhnya.

Lakukan audit pra-peluncuran menyeluruh. Untuk SETIAP item,
laporkan LULUS atau GAGAL dengan bukti.

1. Pindai seluruh repo untuk penanda "TODO:" yang tersisa.
   Daftarkan semuanya per file.
2. Jalankan pnpm check:content — laporkan hasil.
3. Verifikasi kepatuhan D-05 secara manual: cari "IRATA" dan
   "SPRAT" di SELURUH repo termasuk nama file, alt text di database,
   dan konten artikel. Laporkan setiap kemunculan dan konteksnya.
4. Verifikasi setiap halaman publik punya title, description,
   canonical, hreflang unik. Daftarkan yang duplikat atau kosong.
5. Verifikasi setiap gambar punya alt text di kedua bahasa.
6. Jalankan Lighthouse pada 15 URL kunci, laporkan skor tabel.
7. Jalankan axe-core pada semua template, laporkan pelanggaran.
8. Verifikasi semua halaman legal ada di kedua bahasa dan
   tidak memuat TODO.
9. Verifikasi tidak ada rahasia di repo (pindai pola API key).
10. Verifikasi /admin dan /api tidak ter-cache dan noindex.
11. Verifikasi sitemap tidak memuat halaman noindex atau /dev/.
12. Verifikasi robots.txt mengizinkan crawler AI yang dimaksud.
13. Daftarkan semua tautan internal yang rusak.
14. Daftarkan semua tautan eksternal yang mati.

Gunakan subagent untuk poin 3, 9, dan 13 supaya tidak membebani
konteks utama.

Keluarkan laporan sebagai docs/PRE-LAUNCH-AUDIT.md dengan
status per item dan daftar tindakan yang harus saya kerjakan.
JANGAN perbaiki apa pun di sesi ini — hanya laporkan.
```

**Cek manual (hanya Anda yang bisa):**
- Baca ulang seluruh halaman legal
- Baca ulang halaman roadmap IRATA/SPRAT kata per kata
- Verifikasi setiap nomor lisensi, nama instruktur, dan nomor sertifikat yang tercantum
- Konfirmasi penasihat hukum sudah meninjau Kebijakan Privasi dan S&K
- Uji seluruh alur di HP Android dan iPhone sungguhan
- Uji restore backup

**DoD:** laporan audit lengkap · nol TODO tersisa · nol pelanggaran D-05 · tinjauan hukum selesai

---

## T-403 — Peluncuran

**Mode:** Manual — **Anda yang mengerjakan, bukan Claude Code**

```
[ ] Merge semua PR yang tertunda
[ ] Jalankan migration ke production: wrangler d1 migrations apply DB --remote
[ ] Deploy: wrangler deploy
[ ] Verifikasi situs tayang di domain final
[ ] Aktifkan CSP penuh (dari Report-Only), setelah seminggu observasi
[ ] Verifikasi domain di Google Search Console (metode DNS)
[ ] Submit sitemap-index.xml
[ ] Verifikasi di Bing Webmaster Tools + submit sitemap
[ ] Buat dan verifikasi Google Business Profile
[ ] Uji 10 URL di Rich Results Test
[ ] Aktifkan Cloudflare Web Analytics
[ ] Uji GA4 di DebugView
[ ] Kirim satu lead uji, verifikasi seluruh rantai:
    database → email → WhatsApp
[ ] Picu backup manual, verifikasi file di R2
[ ] Pantau ketat 72 jam: error rate, Core Web Vitals lapangan,
    laporan CSP, lead masuk
```

---

# Lampiran A — Prompt Pemulihan Saat Claude Code Ngaco

Salin sesuai situasi.

**Claude mengubah hal di luar cakupan**
```
Anda mengubah file di luar cakupan tugas ini. Kembalikan semua
perubahan di [daftar file] ke kondisi semula. Kerjakan HANYA
apa yang saya minta di prompt awal. Tunjukkan git diff setelah
dikembalikan.
```

**Claude mengarang API atau pustaka**
```
Berhenti. Anda memakai [nama API/pustaka] yang saya tidak yakin ada.
Verifikasi dulu: baca package.json dan node_modules, atau baca
dokumentasi resminya. Kalau tidak ada, katakan tidak ada dan
usulkan alternatif dari dependensi yang SUDAH terpasang.
Jangan menambah dependensi baru tanpa persetujuan saya.
```

**Claude mengklaim selesai tanpa bukti**
```
Jangan katakan sudah selesai. Jalankan pnpm typecheck && pnpm test
&& pnpm build dan tempelkan output mentahnya ke sini. Kalau ada
yang gagal, perbaiki akar masalahnya, jangan menonaktifkan test
atau menekan error.
```

**Claude terjebak mengulang pendekatan yang gagal**
```
/clear
```
lalu mulai sesi baru:
```
Konteks: saya sedang mengerjakan [tugas]. Pendekatan [X] sudah
dicoba dan gagal karena [alasan]. Pendekatan [Y] juga gagal karena
[alasan].

Baca @docs/PLAN.md Bab [N] dan file [daftar file].
Usulkan pendekatan berbeda dalam plan mode dulu.
Jangan ulangi pendekatan X atau Y.
```

**Claude membuat kode terlalu rumit**
```
Implementasi ini terlalu rumit untuk masalahnya. Sederhanakan:
hapus abstraksi yang hanya punya satu pemakai, hapus penanganan
kasus yang tidak mungkin terjadi, hapus opsi konfigurasi yang
tidak saya minta. Target: kode yang bisa saya baca dan pahami
dalam 5 menit.
```

**Claude melanggar D-05**
```
STOP. Anda melanggar aturan D-05 di PLAN.md Bab 3. Baca ulang
bagian itu seluruhnya. Hapus setiap kemunculan IRATA/SPRAT yang
tidak sesuai konteks yang diizinkan, lalu jalankan pnpm check:content
dan tunjukkan output.
```

---

# Lampiran B — Urutan Ringkas

```
FASE 0  Manual: brand, domain, akun, foto, riset keyword     ✅ SELESAI
        → pindahkan nilainya ke docs/FAKTA-BISNIS.md
        T-100b produksi aset brand (manual/desainer) — memblokir T-104
FASE 1  T-102 governance ✅ SELESAI 12 Agu → T-101 scaffold → T-103 database
        → T-104 design system → T-105 layout+i18n → T-106 CI/CD
FASE 2  T-201 SEO core → T-202 sitemap → T-203 API lead
        → T-204 form → T-205 consent → T-206 beranda
        → T-207 pelatihan → T-208 IRATA guard → T-209 jadwal
        → T-210 layanan → T-211 trust pages → T-212 artikel
        → T-213 company → T-214 legal → T-215 error
        → T-216 cache → T-217 gambar → T-218 keamanan → T-219 QA
FASE 3  T-301 auth → T-302 shell → T-303 editor → T-304 SEO panel
        → T-305 revisi → T-306 publish → T-307 leads → T-308 batch
        → T-309 media → T-310 settings → T-311 cron → T-312 panduan
FASE 4  T-401 content ops → T-402 audit → T-403 launch
```

**Tugas dengan risiko tertinggi — kerjakan saat Anda segar dan punya waktu penuh:**
T-102 (governance), T-201 (SEO core), T-203 (API lead), T-208 (D-05), T-301 (auth), T-304 (gerbang publish).

---

## Riwayat Revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | 11 Agustus 2026 | Playbook awal berdasarkan PLAN.md v1.0 |
| 1.1 | 12 Agustus 2026 | T-102 dieksekusi (dimajukan sebelum T-101) · T-100b disisipkan sebagai prasyarat T-104 · prompt T-104 dan T-206 diganti versi DESIGN-SYSTEM Bab 11.2–11.3 · prompt T-216 ditulis ulang sesuai ADR-002 · skill `content-writer` dimajukan dari T-401 · Fase 0 ditandai selesai |
