# Rencana Komprehensif Pembangunan Website
## Training Center Rope Access & Jasa Perawatan Gedung

> **Status dokumen:** v1.1 — amandemen A-01…A-12 terintegrasi
> **Tanggal:** 11 Agustus 2026 · direvisi 12 Agustus 2026
> **Pemilik dokumen:** _[TODO: Nama Anda]_
> **Repo:** `nurudhuhaalamin/RAC`
> **Domain:** `_[TODO: isi di docs/FAKTA-BISNIS.md]_`
>
> **Dokumen pendamping — baca bersama:**
> `docs/PLAYBOOK.md` (47 tugas eksekusi) · `docs/DESIGN-SYSTEM.md` (sumber kebenaran visual) ·
> `docs/DECISIONS.md` (register D-01…D-20 + ADR-001…006) · `docs/FAKTA-BISNIS.md` (semua nilai faktual)
>
> **Penanda `[A-xx]`** di dalam dokumen ini menunjukkan bagian yang diamandemen oleh
> DESIGN-SYSTEM.md Bab 9. **Penanda `[ADR-xxx]`** menunjukkan koreksi teknis yang alasannya
> dicatat di DECISIONS.md. Jangan kembalikan bagian bertanda ini ke versi lamanya.

---

## Daftar Isi

1. [Cara Menggunakan Dokumen Ini](#1-cara-menggunakan-dokumen-ini)
2. [Glosarium Istilah](#2-glosarium-istilah)
3. [Keputusan yang Sudah Dikunci](#3-keputusan-yang-sudah-dikunci)
4. [Arsitektur & Stack Teknologi](#4-arsitektur--stack-teknologi)
5. [Struktur Repositori](#5-struktur-repositori)
6. [Skema Database](#6-skema-database)
7. [Peta Situs & Struktur Informasi](#7-peta-situs--struktur-informasi)
8. [Strategi Konten, SEO & GEO](#8-strategi-konten-seo--geo)
9. [Standar Anti Thin-Content](#9-standar-anti-thin-content)
10. [Dashboard Admin](#10-dashboard-admin)
11. [Sistem Desain](#11-sistem-desain)
12. [Optimasi Performa: Cache, Gambar, Aset](#12-optimasi-performa-cache-gambar-aset)
13. [Keamanan](#13-keamanan)
14. [Integrasi Pihak Ketiga](#14-integrasi-pihak-ketiga)
15. [Halaman Pendukung & Legal](#15-halaman-pendukung--legal)
16. [Cara Bekerja dengan Claude Code](#16-cara-bekerja-dengan-claude-code)
17. [Sistem Log Pekerjaan](#17-sistem-log-pekerjaan)
18. [Roadmap Eksekusi per Fase](#18-roadmap-eksekusi-per-fase)
19. [Definition of Done & QA Checklist](#19-definition-of-done--qa-checklist)
20. [Risiko & Keputusan yang Masih Terbuka](#20-risiko--keputusan-yang-masih-terbuka)

---

## 1. Cara Menggunakan Dokumen Ini

Dokumen ini punya dua pembaca: **Anda** dan **Claude Code**.

| Bagian | Untuk siapa | Kapan dibaca |
|---|---|---|
| Bab 2–3 | Anda + staf | Sekali di awal, rujuk saat bingung istilah |
| Bab 4–6 | Claude Code | Setiap kali menyentuh arsitektur atau database |
| Bab 7–9 | Anda + penulis konten | Setiap kali menulis artikel |
| Bab 10–15 | Claude Code | Saat mengerjakan fitur terkait |
| Bab 16–17 | Anda | **Baca paling teliti.** Ini yang menentukan hasil Claude Code bagus atau ngaco |
| Bab 18–19 | Semua | Panduan eksekusi harian |

**Simpan file ini di repo sebagai `docs/PLAN.md`.** Jangan taruh isinya di `CLAUDE.md` — terlalu panjang, justru akan membuat Claude Code mengabaikan instruksi penting (penjelasan di Bab 16).

Dokumen ini **hidup**. Setiap keputusan yang berubah harus di-update di sini, di-commit, dan disebut di log pekerjaan.

---

## 2. Glosarium Istilah

### 2.1 Istilah Teknis Web

| Istilah | Penjelasan singkat |
|---|---|
| **Astro** | Framework website yang mengubah kode jadi HTML statis. Cepat karena hampir tidak mengirim JavaScript ke browser pengunjung. |
| **TypeScript (TS)** | JavaScript dengan pengecekan tipe data. Kesalahan ketahuan saat menulis kode, bukan saat pengunjung sudah membuka situs. |
| **Tailwind CSS** | Cara menulis styling langsung di HTML lewat kelas-kelas kecil (`p-4`, `text-lg`). Lebih cepat dan konsisten daripada menulis file CSS terpisah. |
| **SSR** (Server-Side Rendering) | Halaman dirakit di server setiap kali diminta. Dipakai untuk halaman yang isinya berubah-ubah (dashboard, hasil pencarian). |
| **SSG** (Static Site Generation) | Halaman dirakit sekali saat build, lalu disajikan sebagai file HTML jadi. Paling cepat. |
| **Island Architecture** | Konsep khas Astro: halaman pada dasarnya HTML statis, hanya bagian tertentu (misal form, filter) yang "hidup" dengan JavaScript. |
| **Cloudflare Workers** | Server yang menjalankan kode Anda di 300+ kota di dunia, dekat dengan pengunjung. Bukan satu server di satu lokasi. |
| **D1** | Database SQL milik Cloudflare (berbasis SQLite). Gratis untuk skala kecil-menengah. |
| **R2** | Penyimpanan file (gambar, video, PDF) milik Cloudflare. Tanpa biaya bandwidth keluar. |
| **KV** | Penyimpanan key-value Cloudflare. Untuk data kecil yang sering dibaca (setting situs, feature flag). |
| **Drizzle ORM** | Perantara antara kode TypeScript dan database. Query database ditulis seperti kode biasa, dengan pengecekan tipe. |
| **Zod** | Pustaka validasi. Memastikan data yang masuk (dari form, dari API) bentuknya benar sebelum diproses. |
| **Migration** | File berisi perubahan struktur database (tambah tabel, tambah kolom). Berurutan dan tercatat, supaya database dev dan production selalu sinkron. |
| **Wrangler** | Alat baris perintah untuk mengelola dan men-deploy semua layanan Cloudflare. |
| **CI/CD** | Otomatisasi: kode di-push ke GitHub → otomatis dites → otomatis di-deploy. |
| **Preview deployment** | URL sementara untuk setiap perubahan, supaya bisa dicek sebelum masuk ke situs asli. |
| **Environment variable** | Nilai rahasia/konfigurasi (API key, nomor WA) yang disimpan di luar kode, tidak ikut masuk GitHub. |
| **Rate limiting** | Pembatasan jumlah permintaan per waktu. Mencegah form dibanjiri bot. |
| **Cache** | Simpanan sementara hasil halaman/gambar supaya permintaan berikutnya tidak perlu dihitung ulang. |
| **Cache purge / invalidation** | Menghapus cache lama supaya pengunjung melihat versi terbaru setelah konten di-update. |
| **CDN** | Jaringan server global yang menyimpan salinan situs Anda. Cloudflare adalah CDN. |
| **Lighthouse** | Alat Google untuk mengukur kecepatan, aksesibilitas, dan SEO teknis halaman. |
| **Core Web Vitals** | Tiga metrik pengalaman pengguna yang dipakai Google sebagai faktor ranking. Lihat 2.2. |

### 2.2 Istilah SEO & AI Search

| Istilah | Penjelasan singkat |
|---|---|
| **SEO** | Optimasi agar situs muncul tinggi di hasil pencarian Google. |
| **GEO / AEO** | *Generative Engine Optimization* / *Answer Engine Optimization*. Optimasi agar situs Anda **dikutip** oleh ChatGPT, Claude, Perplexity, Gemini, dan AI Overviews Google. |
| **Keyword** | Kata/frasa yang diketik orang di mesin pencari. |
| **Search intent** | Maksud di balik pencarian. "apa itu rope access" = ingin tahu. "biaya training rope access" = siap beli. Halaman harus cocok dengan maksudnya. |
| **Klaster keyword** | Kumpulan keyword bertema sama yang dilayani oleh satu halaman pilar + beberapa artikel pendukung. |
| **Pillar page** | Halaman utama sebuah topik besar, yang menautkan ke artikel-artikel turunannya. |
| **Internal linking** | Tautan antar halaman di dalam situs sendiri. Menyebarkan otoritas dan membantu Google memahami struktur. |
| **Backlink** | Tautan dari situs lain ke situs Anda. Sinyal kepercayaan terkuat di SEO. |
| **E-E-A-T** | *Experience, Expertise, Authoritativeness, Trustworthiness*. Kerangka penilaian kualitas Google. Untuk bisnis K3 dan sertifikasi, ini kritis — ini kategori YMYL. |
| **YMYL** | *Your Money or Your Life*. Topik yang bisa memengaruhi keselamatan/keuangan orang. Google menuntut standar akurasi lebih tinggi. Pelatihan keselamatan kerja masuk kategori ini. |
| **Thin content** | Halaman berisi sedikit nilai unik — hasil salin-tempel, template diulang, atau tulisan AI mentah tanpa data asli. Berisiko kena penalti. |
| **Schema.org / structured data** | Kode tersembunyi di halaman yang menjelaskan isi halaman ke mesin ("ini kursus", "ini jadwal", "ini organisasi"). Sumber rich result. |
| **JSON-LD** | Format penulisan schema yang direkomendasikan Google. |
| **Rich result** | Tampilan hasil pencarian yang diperkaya — bintang rating, tanggal kursus, FAQ yang bisa dibuka. |
| **Meta title / meta description** | Judul dan deskripsi yang muncul di hasil pencarian Google. |
| **Canonical URL** | Penanda "ini versi resmi halaman ini", mencegah masalah duplikat konten. |
| **Hreflang** | Penanda bahasa/wilayah, memberitahu Google mana versi ID dan mana versi EN. |
| **Sitemap** | Daftar semua URL situs dalam format XML, untuk disetor ke Google. |
| **robots.txt** | File yang mengatur bot mana boleh merayapi bagian mana. |
| **Crawl budget** | Jumlah halaman yang mau dirayapi Google dalam periode tertentu. Jangan diboroskan pada halaman sampah. |
| **Answer-first** | Gaya penulisan yang menjawab langsung di 2–3 kalimat pertama, baru elaborasi. Format yang paling sering dikutip AI. |
| **CTR** | *Click-Through Rate*. Persentase orang yang mengklik setelah melihat hasil pencarian Anda. |
| **CWV: LCP** | *Largest Contentful Paint*. Berapa lama elemen terbesar muncul. Target < 2,5 detik. |
| **CWV: INP** | *Interaction to Next Paint*. Seberapa responsif situs saat diklik. Target < 200 ms. |
| **CWV: CLS** | *Cumulative Layout Shift*. Seberapa banyak layout "loncat" saat memuat. Target < 0,1. |

### 2.3 Istilah Industri Rope Access & K3

| Istilah | Penjelasan singkat |
|---|---|
| **Rope Access** | Metode kerja pada ketinggian menggunakan tali sebagai akses utama, dengan sistem dua tali (kerja + backup). Alternatif gondola/perancah. |
| **TKPK** | Tenaga Kerja pada Ketinggian — kualifikasi Kemnaker untuk pekerja ketinggian dengan **akses tali**. Bertingkat 1–3. |
| **TKBT** | Tenaga Kerja Bangunan Tinggi — kualifikasi Kemnaker untuk bekerja di ketinggian **tanpa** akses tali. Bertingkat 1–2. |
| **Permenaker 9/2016** | Peraturan Menteri Ketenagakerjaan tentang K3 dalam Pekerjaan pada Ketinggian. Dasar hukum TKBT/TKPK. |
| **Kemnaker** | Kementerian Ketenagakerjaan RI. Penerbit lisensi K3 dan sertifikat TKBT/TKPK. |
| **BNSP** | Badan Nasional Sertifikasi Profesi. Menerbitkan sertifikat kompetensi lewat LSP. |
| **LSP** | Lembaga Sertifikasi Profesi. Lembaga berlisensi BNSP yang melakukan uji kompetensi. |
| **SKKNI** | Standar Kompetensi Kerja Nasional Indonesia. Acuan unit kompetensi yang diuji. |
| **IRATA** | *Industrial Rope Access Trade Association* — asosiasi rope access berbasis Inggris, standar paling diakui secara internasional. Level 1, 2, 3. |
| **SPRAT** | *Society of Professional Rope Access Technicians* — padanan IRATA berbasis Amerika. |
| **Level 1 / 2 / 3** | Jenjang teknisi rope access. L1 teknisi, L2 dapat melakukan rigging & rescue, L3 supervisor. |
| **Rigging** | Pemasangan sistem tali, anchor, dan peralatan. |
| **Anchor point** | Titik jangkar tempat tali diikat. Harus terverifikasi kekuatannya. |
| **APD** | Alat Pelindung Diri (harness, helm, sarung tangan, dll). |
| **Rescue plan** | Rencana penyelamatan wajib sebelum pekerjaan ketinggian dimulai. |
| **Sealant kaca** | Bahan penyekat sambungan kaca fasad. Perlu penggantian berkala untuk mencegah kebocoran. |
| **Fasad** | Selubung/kulit luar bangunan. |
| **Facility Manager (FM)** | Pengelola gedung — pembeli utama untuk lini jasa perawatan. |
| **HSE** | *Health, Safety, Environment*. Departemen yang biasanya jadi pengambil keputusan pelatihan. |

---

## 3. Keputusan yang Sudah Dikunci

Hasil sesi interview. Semua hal di bawah ini **jangan diperdebatkan ulang** oleh Claude Code kecuali Anda ubah secara eksplisit.

| # | Keputusan | Nilai |
|---|---|---|
| D-01 | Prioritas bisnis | **Training Center** primer; jasa perawatan gedung sekunder |
| D-02 | Bahasa | **Bilingual ID + EN sejak rilis pertama** |
| D-03 | Alur lead | Form di situs → **tersimpan di database** → diteruskan ke WhatsApp |
| D-04 | Skema sertifikasi ditawarkan | **BNSP** dan **Kemnaker (TKBT/TKPK)** |
| D-05 | IRATA / SPRAT | **Hanya boleh ditampilkan sebagai "rencana/persiapan"** — tidak boleh diklaim sebagai layanan aktif |
| D-06 | Jangkauan pasar | **Nasional** |
| D-07 | Aset brand | **Nol** — nama, logo, domain, foto, video semua dibangun dari awal |
| D-08 | Pengelola konten | **Campur**: Anda (teknis) + staf (non-teknis) |
| D-09 | Modul dashboard rilis pertama | Artikel + SEO editor, Leads + follow-up, Jadwal batch |
| D-10 | Timeline | **Lengkap, waktu fleksibel** — kualitas di atas kecepatan |
| D-11 | Standar konten | **Tidak boleh thin content.** Standar wajib di Bab 9 |

### D-05: Aturan wajib IRATA/SPRAT

Ini bukan sekadar isu SEO — ini risiko hukum dan reputasi.

**BOLEH:**
- Halaman berjudul "Rencana Pengembangan: Jalur IRATA & SPRAT"
- Artikel edukatif: "Perbedaan IRATA, SPRAT, BNSP, dan Kemnaker"
- Kalimat: "Kami sedang dalam proses persiapan menjadi *training member* IRATA."
- Form "beritahu saya saat program IRATA dibuka" (sekaligus penangkap lead)

**DILARANG KERAS:**
- Menampilkan logo IRATA atau SPRAT di mana pun
- Kata "bersertifikat IRATA", "training IRATA", "IRATA Level 1" dalam konteks penawaran layanan
- Mencantumkan IRATA di halaman daftar layanan atau harga
- Schema `Course` untuk program IRATA/SPRAT
- Halaman pendaftaran atau jadwal batch IRATA

**Perluasan D-12 `[A-06]` — berlaku sama untuk empat pihak lain.**

Sesi audit brand memastikan **tidak ada satu pun hubungan resmi tertulis** dengan pihak mana pun.
Karena itu larangan yang sama berlaku penuh untuk:

| Pihak | Kenapa dilarang |
|---|---|
| **Petzl** | Status "technical partner" hanya boleh diklaim dengan perjanjian tertulis dari Petzl |
| **IRSM** | "Approved Training" butuh akreditasi resmi |
| **ISO 9001:2015** | Hanya boleh ditampilkan dengan sertifikat aktif dari badan terakreditasi, dan wajib menyertakan nomor sertifikat + nama badan penerbit |

Mockup awal menampilkan kelima logo (IRATA, SPRAT, Petzl, IRSM, ISO) di seksi
"CERTIFIED & RECOGNIZED" — di tempat paling terlihat di beranda. **Seksi itu dibatalkan seluruhnya.**
Tidak ada versi grayscale, tidak ada "sedang proses", tidak ada disclaimer kecil di bawahnya —
disclaimer tidak menghapus misrepresentasi. Penggantinya: seksi "Sertifikasi Resmi" berisi BNSP,
Kemnaker, dan legalitas perusahaan dengan nomor yang **bisa diverifikasi**
(spesifikasi: DESIGN-SYSTEM Bab 6.6).

Kalau nomor lisensi belum terbit, **jangan tayangkan seksi itu sama sekali.** Seksi kosong lebih baik
daripada seksi berisi klaim tanpa nomor — pembaca korporat justru mencari nomornya.

**Penegakan teknis:** aturan ini masuk `CLAUDE.md` **dan** dipasang sebagai hook Claude Code + test otomatis yang memindai seluruh konten (Bab 16.6). `[A-09]` Validator `check:content` juga **menggagalkan build** kalau menemukan file gambar bernama mengandung `irata`, `sprat`, `petzl`, `irsm`, atau `iso9001` di `public/` maupun `src/`.

---

## 4. Arsitektur & Stack Teknologi

### 4.1 Ringkasan Pilihan

| Layer | Teknologi | Alasan singkat |
|---|---|---|
| Framework | **Astro 7** `[ADR-001]` | Static-first, island architecture, adapter Cloudflare native |
| Bahasa | **TypeScript (strict)** | Kesalahan ketahuan sebelum deploy — penting saat sebagian kode ditulis AI |
| Styling | **Tailwind CSS v4** | Config CSS-first, design token terpusat, bundle kecil |
| UI Islands | **React 19** | Hanya untuk dashboard, form, filter |
| Validasi | **Zod 4** | Satu skema dipakai untuk form, API, dan database |
| Hosting | **Cloudflare Workers** | SSR + static dalam satu deployment, global, murah |
| Database | **D1 + Drizzle ORM** | Serverless SQLite, type-safe, migration terkelola |
| File/Media | **R2 + Cloudflare Images** | Auto-format, auto-resize, tanpa biaya egress |
| Cache | **Cache API + KV** | Kontrol penuh, purge selektif saat publish |
| Auth admin | **Cloudflare Access (Zero Trust)** | Login email OTP, nol kode auth untuk dirawat sendiri |
| Email | **Resend** | Notifikasi lead ke tim sales |
| Anti-bot | **Cloudflare Turnstile** | Gratis, tanpa CAPTCHA menyiksa |
| Rich text | **Tiptap** | Editor artikel untuk staf non-teknis |
| Testing | **Vitest + Playwright** | Unit + end-to-end. Wajib — ini "alat verifikasi" untuk Claude Code |
| CI/CD | **GitHub Actions + Wrangler** | Push `main` = production, PR = preview URL |
| Package manager | **pnpm** | Cepat, hemat disk |

#### Versi yang dikunci `[ADR-001]`

Draft v1.0 menulis "Astro 6". Saat repo ini dibuat (12 Agustus 2026), Astro sudah di **7.2.1** —
memulai proyek baru di major version yang sudah tertinggal berarti utang migrasi sejak hari pertama.
Versi berikut adalah acuan saat scaffold (T-101). Verifikasi ulang dengan `npm view <paket> version`
sebelum T-101 dijalankan, dan **perbarui tabel ini** kalau sudah bergeser — jangan pakai angka dari ingatan.

| Paket | Versi acuan |
|---|---|
| `astro` | 7.2.1 |
| `@astrojs/cloudflare` | 14.2.1 |
| `@astrojs/react` | 6.0.2 |
| `react` / `react-dom` | 19.2.8 |
| `tailwindcss` | 4.3.3 |
| `zod` | 4.4.3 |
| `drizzle-orm` | 0.45.2 |
| `wrangler` | 4.122.0 |
| `@tiptap/core` | 3.30.0 |
| Node.js | 22 LTS |

### 4.2 Menjawab Pertanyaan "Astro atau TypeScript?"

Ini bukan pilihan salah satu. **Astro adalah framework, TypeScript adalah bahasa.** Kita pakai keduanya: Astro sebagai kerangka situs, TypeScript sebagai bahasa yang menulis isinya.

**Kenapa Astro, bukan Next.js atau Nuxt?**

| Kriteria | Astro | Next.js |
|---|---|---|
| JS dikirim ke browser (halaman publik) | ~0 KB | 80–150 KB baseline |
| Core Web Vitals default | Nyaris sempurna tanpa usaha | Perlu tuning serius |
| Kesesuaian untuk situs konten + SEO | Dirancang persis untuk ini | Dirancang untuk aplikasi |
| Cloudflare Workers | Adapter resmi, mulus | Bisa, tapi lebih banyak gesekan |
| Kurva belajar | Rendah | Sedang |

Situs ini 90% halaman konten dan 10% dashboard. Astro menang telak untuk profil itu, dan dashboard tetap bisa React lewat island.

### 4.3 Menjawab Pertanyaan "Tailwind atau apa?"

**Tailwind CSS v4**, dengan aturan disiplin:

1. Semua warna, ukuran font, spasi, radius didefinisikan sebagai **token** di `src/styles/theme.css` menggunakan direktif `@theme`.
2. Komponen tidak boleh memakai nilai mentah (`text-[#1a2b3c]`). Wajib token (`text-brand-900`).
3. Kelas utility yang berulang > 3 kali diekstrak jadi komponen Astro, bukan `@apply`.

Alasan aturan ini: saat Claude Code menulis komponen, tanpa token ia akan mengarang warna sendiri, dan dalam sebulan Anda punya 14 varian abu-abu.

### 4.4 Monorepo atau Repo Tunggal?

**Repo tunggal.** Turborepo/pnpm workspace adalah overhead yang tidak dibayar untuk satu situs. Struktur folder yang bersih sudah cukup. Pecah jadi packages hanya jika muncul brand kedua yang berbagi design system.

### 4.5 Diagram Alur Sistem

```
Pengunjung
    │
    ▼
Cloudflare Edge (CDN + WAF + Bot Management)
    │
    ├─ Halaman publik ────► Cache HIT ──► HTML langsung (< 50 ms)
    │                        Cache MISS ─► Worker ─► D1 ─► render ─► simpan cache
    │
    ├─ /admin/* ──────────► Cloudflare Access (auth) ─► Worker (SSR, no-cache) ─► D1
    │
    ├─ /api/leads (POST) ─► Turnstile ─► Rate limit ─► Zod ─► D1 INSERT
    │                                                          ├─► Resend (email tim)
    │                                                          └─► redirect wa.me
    │
    └─ /images/* ─────────► Cloudflare Images ─► R2
```

### 4.6 Estimasi Biaya Bulanan

| Item | Biaya |
|---|---|
| Cloudflare Workers Paid | $5 |
| D1 | $0 (dalam kuota gratis untuk skala ini) |
| R2 | ~$0,20 |
| Cloudflare Images | ~$5 (100rb gambar tersimpan) |
| Cloudflare Access | $0 (gratis s/d 50 pengguna) |
| Resend | $0 (3.000 email/bulan gratis) |
| Domain `.co.id` atau `.com` | ~Rp 200rb–500rb/tahun |
| **Total** | **± Rp 170rb/bulan** |

Biaya infrastruktur bukan variabel signifikan. Yang mahal adalah **waktu produksi konten dan foto** — itulah yang harus dianggarkan serius.

---

## 5. Struktur Repositori

```
repo-root/
├── CLAUDE.md                     # Instruksi permanen untuk Claude Code (< 150 baris)
├── README.md                     # Cara setup & jalankan
├── .gitignore
├── .env.example                  # Template variabel; .env asli TIDAK di-commit
├── astro.config.mjs
├── wrangler.toml                 # Konfigurasi Cloudflare
├── drizzle.config.ts
├── package.json
├── tsconfig.json
│
├── .claude/
│   ├── settings.json             # Permission, hooks, default plan mode
│   ├── skills/
│   │   ├── worklog/SKILL.md      # Aturan penulisan log pekerjaan
│   │   ├── seo-checklist/SKILL.md
│   │   ├── content-writer/SKILL.md
│   │   └── db-migration/SKILL.md
│   └── agents/
│       ├── security-reviewer.md
│       ├── seo-auditor.md
│       └── content-quality-checker.md
│
├── .github/workflows/
│   ├── ci.yml                    # Lint, typecheck, test, build pada setiap PR
│   └── deploy.yml                # Deploy ke production pada merge ke main
│
├── docs/
│   ├── PLAN.md                   # ← DOKUMEN INI
│   ├── DECISIONS.md              # Architecture Decision Record
│   ├── CONTENT-BRIEF-TEMPLATE.md
│   ├── KEYWORD-MAP.md
│   ├── RUNBOOK.md                # Prosedur darurat: rollback, restore DB
│   └── worklog/
│       ├── README.md
│       └── 2026-08-11.md         # Satu file per hari kerja
│
├── db/
│   ├── schema.ts                 # Definisi tabel Drizzle
│   ├── migrations/               # Digenerate, JANGAN diedit manual
│   └── seed/                     # Data contoh untuk development
│
├── public/
│   ├── robots.txt
│   ├── favicon.svg
│   └── fonts/
│
└── src/
    ├── components/
    │   ├── ui/                   # Button, Card, Input — primitif
    │   ├── layout/               # Header, Footer, Nav
    │   ├── sections/             # Hero, CourseGrid, Testimonials
    │   ├── seo/                  # SeoHead, SchemaOrg, Breadcrumbs
    │   └── islands/              # Komponen React: LeadForm, BatchFilter, dsb.
    ├── layouts/
    │   ├── BaseLayout.astro
    │   ├── ArticleLayout.astro
    │   └── AdminLayout.astro
    ├── pages/
    │   ├── index.astro           # Beranda ID
    │   ├── [...slug].astro       # Router konten dinamis
    │   ├── en/                   # Semua halaman versi EN
    │   ├── admin/                # Dashboard (SSR, dilindungi Access)
    │   ├── api/                  # Endpoint: leads, artikel, upload, revalidate
    │   ├── sitemap-[type].xml.ts
    │   └── rss.xml.ts
    ├── lib/
    │   ├── db/                   # Klien Drizzle + query
    │   ├── seo/                  # Generator schema, meta, hreflang
    │   ├── cache/                # Helper cache & purge
    │   ├── i18n/                 # Kamus & helper bahasa
    │   ├── validation/           # Skema Zod
    │   └── utils/
    ├── content/                  # Halaman statis (MDX) yang jarang berubah
    └── styles/
        ├── global.css
        └── theme.css             # Token Tailwind v4
```

---

## 6. Skema Database

### 6.1 Tabel Inti

```
users
  id, email, name, role(admin|editor|sales), active, created_at

leads
  id, ref_code(unik, untuk rujukan WA), name, phone, email,
  company, position, interest_type(training|service|irata_waitlist),
  scheme(bnsp|tkpk|tkbt|other), batch_id, city, message,
  source_page, utm_source, utm_medium, utm_campaign, utm_content,
  referrer, status(new|contacted|qualified|quoted|won|lost),
  assigned_to, locale, ip_hash, created_at, updated_at

lead_activities
  id, lead_id, user_id, type(note|call|wa|email|status_change),
  content, created_at

courses
  id, slug, locale, translation_group_id, title, subtitle,
  scheme, certifying_body, level, duration_days, prerequisites,
  syllabus_json, price, price_note, capacity_default,
  hero_image_id, status(draft|published), sort_order,
  meta_title, meta_description, created_at, updated_at

batches
  id, course_id, start_date, end_date, city, venue_name,
  venue_address, capacity, seats_taken, price_override,
  status(scheduled|open|full|running|completed|cancelled), notes

registrations
  id, lead_id, batch_id, status(inquiry|confirmed|paid|attended|cancelled),
  created_at

articles
  id, slug, locale, translation_group_id, title, excerpt,
  body_json (Tiptap), body_html (hasil render, di-cache),
  author_id, reviewer_id, category_id, status(draft|review|scheduled|published),
  published_at, updated_at, reading_time, word_count,
  focus_keyword, secondary_keywords, meta_title, meta_description,
  og_image_id, faq_json, tldr, canonical_override, noindex

article_revisions
  id, article_id, body_json, changed_by, change_note, created_at

categories
  id, slug, locale, translation_group_id, name, description

media
  id, r2_key, filename, mime, width, height, size_bytes,
  alt_id, alt_en, caption_id, caption_en,
  credit, taken_at, uploaded_by, created_at

instructors
  id, name, slug, photo_id, bio_id, bio_en, certifications_json,
  years_experience, linkedin, status, sort_order

testimonials
  id, author_name, author_role, company, content_id, content_en,
  photo_id, rating, course_id, verified, status, created_at

faqs
  id, question_id, question_en, answer_id, answer_en,
  category, page_scope, sort_order

settings
  key, value_json, updated_by, updated_at
  # nomor WA per divisi, jam operasional, teks banner, dsb.

redirects
  id, from_path, to_path, status_code(301|302), hits, created_at

audit_log
  id, user_id, action, entity_type, entity_id, diff_json, ip_hash, created_at
```

### 6.2 Aturan Wajib Database

1. **Semua perubahan skema lewat migration Drizzle.** Tidak ada `ALTER TABLE` manual di production.
2. **Soft delete** untuk `leads`, `articles`, `media` (kolom `deleted_at`). Data lead tidak pernah dihapus permanen tanpa permintaan eksplisit.
3. **Index wajib** pada: `leads.created_at`, `leads.status`, `articles.slug + locale`, `articles.published_at`, `batches.start_date`.
4. **`translation_group_id`** adalah UUID yang sama untuk pasangan ID↔EN. Inilah dasar hreflang otomatis.
5. **Backup harian** D1 ke R2 via Cron Trigger, retensi 30 hari. `[ADR-004]` Worker **tidak bisa
   menjalankan `wrangler`** — ekspor dilakukan lewat **D1 REST API** (`/export`) dengan API token
   di Cloudflare Secrets. Catatan: D1 **Time Travel** sudah memberi point-in-time restore 30 hari
   secara bawaan; dump ke R2 tetap dibuat sebagai salinan **di luar platform**, bukan sebagai
   satu-satunya jaring pengaman. Backup yang belum pernah diuji restore bukan backup.

### 6.3 Alur Form → WhatsApp (Detail Kritis)

```
1. Pengguna mengisi form (nama, WA, minat, kota, pesan)
2. Frontend: validasi Zod di sisi klien + widget Turnstile
3. POST /api/leads
4. Server:
   a. Verifikasi token Turnstile ke API Cloudflare
   b. Cek rate limit (maks 3 submit / IP / jam) `[ADR-003]`
   c. Validasi ulang dengan Zod (JANGAN percaya sisi klien)
   d. Normalisasi nomor telepon ke format +62
   e. Generate ref_code, contoh: LEAD-20260811-A7K2
   f. INSERT ke tabel leads (INI TERJADI SEBELUM REDIRECT)
   g. Kirim email notifikasi via Resend ke sales (async, kegagalan tidak memblokir)
   h. Kembalikan { ok: true, waUrl, refCode }
5. Frontend: tampilkan konfirmasi + tombol "Lanjut ke WhatsApp"
6. Klik → wa.me/62xxx?text=<pesan terisi termasuk ref_code>
```

**Kenapa simpan dulu, baru redirect?** Kalau langsung redirect ke WhatsApp, Anda kehilangan setiap orang yang berubah pikiran di detik terakhir, ganti HP, atau tidak punya WhatsApp di desktop. Berdasarkan pola umum, itu bisa 30–40% dari lead. Dengan alur ini, datanya sudah aman di database apa pun yang terjadi berikutnya.

**Nomor WA tujuan** diambil dari tabel `settings`, dirutekan berdasarkan `interest_type` (training → sales training, service → sales jasa). Diubah lewat dashboard, tidak perlu deploy ulang.

**Catatan rate limit `[ADR-003]`.** KV bersifat *eventually consistent* — penghitung yang ditulis di
satu lokasi belum tentu terbaca di lokasi lain dalam hitungan detik. Artinya "maks 3 per jam" yang
diimplementasikan murni di KV adalah **perkiraan**, bukan jaminan; penyerang terdistribusi bisa
menembus beberapa kali lipat. Karena itu lapisannya dua:

1. **Lapisan utama — Cloudflare Rate Limiting (WAF)** di depan `POST /api/leads`. Ditegakkan di edge
   sebelum Worker jalan, konsisten secara global, dan dikonfigurasi di dashboard Cloudflare (dicatat
   di `docs/RUNBOOK.md`).
2. **Lapisan kedua — penghitung KV** di dalam Worker. Menangkap penyalahgunaan kasar dan memberi
   pesan yang ramah dalam Bahasa Indonesia, tapi **tidak diandalkan sebagai kontrol keamanan**.

Turnstile tetap gerbang pertama. Jangan mengganti KV dengan Durable Object hanya demi ketepatan
angka — biayanya tidak sepadan untuk form kontak.

---

## 7. Peta Situs & Struktur Informasi

### 7.1 Struktur URL

Bahasa Indonesia di root, Inggris di prefix `/en/`. Slug diterjemahkan (bukan sekadar prefix) karena slug adalah sinyal keyword.

```
BAHASA INDONESIA                        BAHASA INGGRIS
─────────────────────────────────────────────────────────────────
/                                       /en/
/pelatihan/                             /en/training/
/pelatihan/sertifikasi-bnsp-rope-access /en/training/bnsp-rope-access-certification
/pelatihan/tkpk-1/  /tkpk-2/  /tkpk-3/  /en/training/tkpk-1/ ...
/pelatihan/tkbt-1/  /tkbt-2/            /en/training/tkbt-1/ ...
/pelatihan/rencana-irata-sprat          /en/training/irata-sprat-roadmap
/jadwal/                                /en/schedule/
/jadwal/[slug-batch]                    /en/schedule/[batch-slug]
/layanan/                               /en/services/
/layanan/pembersihan-kaca-gedung        /en/services/high-rise-window-cleaning
/layanan/sealant-kaca-gedung            /en/services/facade-sealant-replacement
/layanan/inspeksi-fasad                 /en/services/facade-inspection
/fasilitas/                             /en/facilities/
/instruktur/                            /en/instructors/
/instruktur/[nama]                      /en/instructors/[name]
/galeri/                                /en/gallery/
/artikel/                               /en/articles/
/artikel/kategori/[slug]                /en/articles/category/[slug]
/artikel/[slug]                         /en/articles/[slug]
/tentang-kami/                          /en/about/
/kontak/                                /en/contact/
/faq/                                   /en/faq/
```

### 7.2 Halaman Pendukung & Legal

```
/kebijakan-privasi                      /en/privacy-policy
/syarat-ketentuan                       /en/terms-of-service
/disclaimer                             /en/disclaimer
/kebijakan-cookie                       /en/cookie-policy
/kebijakan-pembatalan-refund            /en/cancellation-refund-policy
/kebijakan-k3                           /en/hse-policy
/aksesibilitas                          /en/accessibility
/peta-situs                             /en/sitemap          (HTML, untuk manusia)
/404                                    /en/404
```

Detail isi masing-masing ada di [Bab 15](#15-halaman-pendukung--legal).

### 7.3 Prinsip Navigasi

- **Menu utama maksimal 6 item.** Training Center dulu (D-01): Pelatihan · Jadwal · Layanan · Artikel · Tentang · Kontak.
  `[A-04]` **"Certification" BUKAN item menu tersendiri** — ia jadi submenu di bawah Pelatihan
  (BNSP · TKPK · TKBT · Rencana IRATA/SPRAT). Alasannya di DESIGN-SYSTEM Bab 2.3: "Training" dan
  "Certification" melayani intent yang sama dan akan saling mengkanibal keyword. Mockup awal
  memakai menu `HOME · ABOUT US · TRAINING · CERTIFICATION · SERVICES · CONTACT` — menu itu
  **tidak dipakai**, karena membuang dua halaman terpenting (Jadwal dan Artikel) ke footer.
  `[A-08]` Header desktop **dan** drawer mobile wajib memuat pengalih bahasa, bukan hanya footer.
- **CTA utama di header:** "Konsultasi WhatsApp" — kontras, selalu terlihat.
- **Tombol WA melayang** di mobile, muncul setelah scroll 30%, dapat ditutup.
- **Breadcrumb** di semua halaman kecuali beranda. Sertai schema `BreadcrumbList`.
- **Footer** memuat: kolom pelatihan, kolom layanan, kontak + alamat + peta, tautan legal, penukar bahasa.

---

## 8. Strategi Konten, SEO & GEO

### 8.1 Arsitektur Klaster Keyword

Tiga klaster, masing-masing punya halaman pilar dan artikel pendukung yang saling menaut.

#### Klaster A — Pelatihan & Sertifikasi (PRIORITAS UTAMA)

**Pilar:** `/pelatihan/`

| Tipe | Keyword target |
|---|---|
| Transaksional | pelatihan rope access · sertifikasi rope access · training rope access · sertifikat BNSP rope access · pelatihan TKPK · sertifikasi TKBT · biaya pelatihan rope access · jadwal training rope access |
| Informasional | apa itu rope access · perbedaan TKPK dan TKBT · syarat ikut pelatihan rope access · berapa lama sertifikat TKPK berlaku · isi materi pelatihan rope access · alat yang dibawa saat training rope access |
| Karier | gaji teknisi rope access · prospek karier rope access · cara jadi teknisi rope access · lowongan rope access butuh sertifikat apa |
| Komparatif | perbedaan IRATA SPRAT BNSP Kemnaker · sertifikat mana yang diakui perusahaan migas · rope access vs gondola |

#### Klaster B — Jasa Perawatan Gedung (SEKUNDER)

**Pilar:** `/layanan/`

| Tipe | Keyword target |
|---|---|
| Transaksional | jasa pembersihan kaca gedung tinggi · jasa sealant kaca gedung · kontraktor rope access · jasa perawatan fasad gedung · biaya pembersihan kaca gedung per m2 |
| Informasional | penyebab kebocoran kaca gedung · kapan sealant fasad harus diganti · berapa kali setahun kaca gedung dibersihkan · rope access vs gondola untuk perawatan gedung |

#### Klaster C — Kepatuhan K3 & Regulasi (PEMBANGUN OTORITAS)

**Pilar:** artikel panjang tentang Permenaker 9/2016

| Tipe | Keyword target |
|---|---|
| Regulasi | Permenaker 9 tahun 2016 · kewajiban sertifikasi pekerja ketinggian · sanksi tidak punya sertifikat TKPK · dokumen K3 pekerjaan ketinggian |
| Praktik | prosedur rescue plan pekerjaan ketinggian · JSA pekerjaan ketinggian · inspeksi APD ketinggian |

Klaster C tidak langsung menjual, tapi menarik HSE Manager — yaitu orang yang menandatangani pembelian pelatihan. Ini juga klaster yang paling mungkin dikutip AI.

> **Wajib:** semua angka volume pencarian harus divalidasi dengan Ahrefs / Semrush / Google Keyword Planner **sebelum** peta keyword dikunci. Jangan menulis 40 artikel berdasarkan dugaan. Hasil validasi masuk ke `docs/KEYWORD-MAP.md`.

### 8.2 Implementasi SEO Teknis

**Setiap halaman wajib punya:**
- `<title>` unik, 50–60 karakter
- `<meta name="description">` unik, 140–160 karakter
- `<link rel="canonical">` absolut
- `hreflang` untuk ID, EN, dan `x-default` (→ ID)
- Open Graph + Twitter Card lengkap
- Tepat satu `<h1>`; hierarki heading tidak melompat
- Breadcrumb + schema `BreadcrumbList`
- JSON-LD sesuai jenis halaman

**Peta Schema.org:**

| Halaman | Schema |
|---|---|
| Semua | `Organization` + `WebSite` (dengan `SearchAction`) |
| Beranda | `EducationalOrganization`, `LocalBusiness` |
| Halaman kursus | `Course` + array `hasCourseInstance` |
| Halaman jadwal | Kumpulan `CourseInstance` |
| Halaman layanan | `Service` dengan `areaServed` |
| Artikel | `Article` + `Person` (penulis) + `BreadcrumbList` |
| Profil instruktur | `Person` dengan `hasCredential` |
| FAQ | `FAQPage` |
| Kontak | `ContactPage` + `LocalBusiness` |

**`Course` + `CourseInstance` adalah senjata terbesar Anda.** Ini yang membuat kursus Anda muncul di Google dengan tanggal, lokasi, dan harga langsung di hasil pencarian. Sangat sedikit training center Indonesia yang menerapkannya dengan benar. Schema ini **digenerate otomatis dari database** — kalau ditulis manual, cepat basi.

**Sitemap:** dipecah per jenis dan per bahasa, diindeks oleh `sitemap-index.xml`. Digenerate dari database saat build dan saat publish.

### 8.3 GEO — Agar AI Search Memahami Situs Anda

**Realitas terlebih dahulu:** riset per 2026 menunjukkan `llms.txt` nyaris tidak pernah diambil oleh crawler AI. Google menyatakan file itu tidak berpengaruh sama sekali pada ranking maupun AI Overviews, dan tidak ada penyedia AI besar yang berkomitmen membacanya di sistem produksi. Studi lalu lintas bot menemukan hanya ratusan permintaan `llms.txt` dari ratusan juta kunjungan bot AI.

**Kesimpulan:** tetap buat `llms.txt` — biayanya satu jam kerja dan berguna sebagai infrastruktur agen ke depan — tapi **jangan menaruh harapan visibilitas AI padanya.** Yang benar-benar bekerja adalah enam hal berikut.

**1. Izinkan crawler AI di `robots.txt`.**
Anda ingin dikutip, bukan disembunyikan. Izinkan: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-SearchBot`, `PerplexityBot`, `Google-Extended`, `Bingbot`, `Applebot-Extended`. Blokir hanya scraper komersial yang tidak memberi rujukan balik.

**2. Tulis dengan pola answer-first.**
Setiap artikel dan setiap subjudul dibuka dengan jawaban langsung dalam 2–3 kalimat, baru penjelasan. Model bahasa mengutip potongan yang berdiri sendiri. Paragraf pembuka bertele-tele tidak akan pernah dikutip.

**3. Sediakan blok `TL;DR` di awal setiap artikel.**
40–60 kata, satu paragraf, memuat entitas utama (nama sertifikasi, nomor regulasi, angka kunci). Simpan di kolom `articles.tldr`, render sebagai blok visual + masuk ke schema.

**4. Perbanyak struktur yang mudah diekstrak.**
Tabel perbandingan, daftar bernomor, blok definisi, FAQ dengan schema. Format inilah yang paling sering diangkat AI karena batasnya jelas.

**5. Sebutkan entitas secara eksplisit dan konsisten.**
Tulis "Permenaker No. 9 Tahun 2016", bukan "peraturan tersebut". Tulis "Badan Nasional Sertifikasi Profesi (BNSP)" pada penyebutan pertama di setiap artikel. AI menghubungkan fakta lewat entitas bernama, bukan kata ganti.

**6. HTML bersih, konten tidak bergantung JavaScript.**
Ini otomatis didapat dari Astro. Tidak ada teks penting yang hanya muncul setelah JS jalan. Tidak ada konten kunci di dalam accordion yang tertutup di DOM.

**Tambahan:** sediakan versi Markdown mentah tiap artikel di `/artikel/[slug].md`. Murah dibuat, sangat ramah diproses agen, dan **wajib diberi `noindex`** agar tidak menjadi duplikat konten.

### 8.4 Strategi Bilingual — Penilaian Jujur

Volume pencarian berbahasa Inggris untuk rope access training di Indonesia tipis. Jangan memposisikan EN sebagai mesin trafik.

**Posisi EN yang benar:** lapisan kredibilitas untuk facility manager multinasional, kontraktor migas/EPC asing, klien korporat yang prosedur pengadaannya berbahasa Inggris, dan calon peserta internasional.

**Aturan cakupan:**

| Konten | Wajib EN? |
|---|---|
| Beranda, Pelatihan, Layanan, Tentang, Kontak, Fasilitas, Instruktur | Ya |
| Halaman legal | Ya |
| Halaman jadwal | Ya |
| Artikel klaster C (regulasi/kepatuhan) | Ya |
| Artikel klaster A informasional | Pilihan, ~30% |
| Artikel karier lokal (gaji, lowongan) | Tidak — audiensnya berbahasa Indonesia |

**Larangan keras:** tidak ada terjemahan mesin mentah yang dipublikasikan. Halaman EN yang kaku justru merusak kredibilitas yang ingin dibangun. Kalau belum ada versi EN berkualitas, tampilkan pengalih bahasa yang mengarah ke beranda EN, bukan halaman setengah jadi.

---

## 9. Standar Anti Thin-Content

Ini persyaratan D-11. Konten yang tidak lolos standar ini **tidak boleh dipublikasikan**, tanpa pengecualian.

### 9.1 Definisi

Thin content bukan soal jumlah kata. Artikel 3.000 kata bisa tetap thin. Thin content adalah **konten tanpa nilai unik yang tidak bisa didapat pengguna dari tempat lain**.

Bentuk yang paling sering muncul dan harus dihindari:
- Tulisan AI mentah yang mendaur ulang informasi umum
- Halaman kota yang isinya sama persis, hanya nama kota diganti
- Halaman yang menggabungkan potongan artikel lain tanpa analisis
- Halaman kategori atau tag tanpa deskripsi tersendiri
- Artikel yang seluruh isinya sudah ada di halaman lain di situs yang sama (kanibalisasi)

### 9.2 Aturan Wajib per Artikel

Setiap artikel **harus memuat minimal tiga** dari elemen berikut, dan disebutkan di brief:

| # | Elemen nilai unik |
|---|---|
| 1 | Foto atau video asli dari kegiatan/fasilitas Anda (bukan stok) |
| 2 | Kutipan langsung dari instruktur bersertifikat, dengan nama dan kredensial |
| 3 | Data lapangan Anda sendiri (jumlah peserta lulus, tingkat kelulusan, temuan inspeksi umum) |
| 4 | Rujukan regulasi spesifik dengan nomor pasal dan tautan sumber resmi |
| 5 | Studi kasus dari proyek nyata (boleh dianonimkan) |
| 6 | Tabel perbandingan atau kalkulator yang dibuat sendiri |
| 7 | Checklist/template yang dapat diunduh |
| 8 | Diagram atau ilustrasi orisinal |

### 9.3 Ambang Kuantitatif

| Metrik | Minimum |
|---|---|
| Panjang artikel pilar | 1.500 kata |
| Panjang artikel pendukung | 800 kata |
| Elemen nilai unik | 3 |
| Gambar orisinal | 2 |
| Internal link keluar | 3 |
| Tautan sumber eksternal berwibawa | 2 |
| Blok TL;DR | Wajib |
| Butir FAQ | 3 |
| Nama penulis + kredensial | Wajib |
| Peninjau (untuk konten K3/regulasi) | Wajib |

### 9.4 Alur Kerja Produksi Konten

```
1. RISET     → Validasi keyword, analisis 5 hasil teratas, temukan celah
2. BRIEF     → Isi docs/CONTENT-BRIEF-TEMPLATE.md; tentukan 3 elemen unik
3. KUMPULKAN → Foto, kutipan instruktur, data — SEBELUM menulis
4. DRAFT     → Boleh dibantu AI, TAPI hanya sebagai kerangka + polesan bahasa
5. INJEKSI   → Masukkan elemen unik. Ini bagian yang tidak boleh dikerjakan AI
6. TINJAU    → Ahli K3/instruktur memverifikasi akurasi teknis
7. SEO       → Cek lewat panel SEO dashboard; skor harus hijau
8. QA        → Subagent content-quality-checker menjalankan pemeriksaan Bab 9.5
9. TERBIT    → Cache di-purge, sitemap di-regenerate, submit ke Search Console
10. TINJAU ULANG → Evaluasi setelah 90 hari; perbarui atau gabungkan yang buruk
```

**Aturan yang tidak bisa ditawar:** AI boleh menyusun struktur dan merapikan bahasa. AI **tidak boleh** menjadi sumber fakta tentang regulasi Indonesia, harga, atau prosedur keselamatan. Setiap klaim faktual harus tertelusur ke sumber resmi atau ke pengetahuan internal tim Anda.

### 9.5 Gerbang Otomatis Sebelum Publish

Dashboard memblokir tombol Publish jika:
- Jumlah kata di bawah ambang
- TL;DR kosong
- Kurang dari 3 internal link
- Ada gambar tanpa alt text
- Focus keyword kosong, atau sudah dipakai artikel lain (kanibalisasi)
- Meta title/description kosong atau melebihi batas panjang
- Butir FAQ kurang dari 3
- Checkbox "elemen unik" terisi kurang dari 3
- Konten menyebut IRATA/SPRAT di luar konteks yang diizinkan (D-05)

### 9.6 Halaman Kota — Aturan Khusus

Halaman kota (`/pelatihan/jakarta`, dst.) berpotensi trafik besar sekaligus berpotensi penalti terbesar.

**Tidak dikerjakan sebelum Fase 5.** Saat dikerjakan, setiap halaman kota wajib punya:
- Foto batch nyata yang pernah berjalan di kota itu
- Data batch aktual yang pernah/akan diselenggarakan di sana
- Konteks industri lokal spesifik (Jakarta: perkantoran; Balikpapan: migas; Surabaya: manufaktur)
- Testimoni dari peserta asal kota tersebut
- Info venue dan akses transportasi nyata

**Kalau lima syarat itu tidak terpenuhi, jangan buat halamannya.** Lebih baik punya 3 halaman kota bagus daripada 25 halaman template.

---

## 10. Dashboard Admin

### 10.1 Akses & Peran

| Peran | Hak akses |
|---|---|
| **Admin** (Anda) | Semua modul, pengaturan, pengguna, redirect, audit log |
| **Editor** | Artikel, media, FAQ, testimoni, instruktur. Tidak bisa lihat leads |
| **Sales** | Leads dan aktivitas follow-up. Jadwal batch (baca saja). Tidak bisa edit konten |

Autentikasi melalui **Cloudflare Access** — staf login dengan kode sekali pakai yang dikirim ke email. Tidak ada password yang Anda simpan, tidak ada sistem reset password yang harus dirawat, tidak ada risiko kebocoran kredensial dari kode Anda sendiri.

### 10.2 Modul Rilis Pertama (D-09)

**A. Editor Artikel + Panel SEO**

- Editor Tiptap: heading, tebal/miring, daftar, tabel, gambar, kutipan, blok kode, blok callout, blok FAQ
- **Tampilan berdampingan ID | EN** dengan penanda status terjemahan
- **Panel SEO langsung** di sidebar kanan:
  - Preview hasil Google (mobile & desktop)
  - Penghitung panjang title/description dengan indikator warna
  - Kerapatan focus keyword + peringatan keyword stuffing
  - Penghitung internal link & external link
  - Cek alt text semua gambar
  - Jumlah kata vs ambang minimum
  - Cek kanibalisasi keyword terhadap artikel lain
  - Checklist elemen nilai unik (Bab 9.2)
  - Preview kartu Open Graph
  - Preview JSON-LD yang akan digenerate
  - **Skor kesiapan publish** — tombol Publish nonaktif sampai hijau
- Draft · Review · Terjadwal · Terbit
- Riwayat revisi dengan diff dan tombol pulihkan
- Pencarian dan sisip internal link tanpa keluar dari editor

**B. Leads & Follow-up**

- Tabel dengan filter: status, jenis minat, tanggal, sumber, penerima tugas, kota
- Tampilan Kanban per status (drag untuk memindahkan)
- Halaman detail: seluruh isi form, halaman asal, data UTM, seluruh riwayat aktivitas
- Tombol **"Chat via WhatsApp"** yang membuka WA dengan template pesan sesuai jenis minat
- Catatan follow-up dengan cap waktu dan nama pengguna
- Penugasan ke anggota sales
- Ekspor CSV dengan filter
- Widget ringkasan: lead hari ini, minggu ini, rasio konversi, sumber teratas

**C. Jadwal Batch**

- CRUD kursus dan batch
- Kalender bulanan
- Kuota otomatis berkurang saat pendaftaran masuk
- Sekali publish → langsung muncul di halaman jadwal publik + schema `CourseInstance` ter-update
- Status: terjadwal · dibuka · penuh · berjalan · selesai · dibatalkan
- Duplikasi batch untuk membuat jadwal berulang

### 10.3 Modul Fase Berikutnya

- **Media Library**: upload ke R2, alt text ID+EN **wajib** sebelum bisa dipakai, pencarian, penggantian
- **Instruktur, Testimoni, FAQ**: CRUD sederhana
- **Pengaturan**: nomor WA per divisi, jam operasional, teks banner pengumuman, kode integrasi pihak ketiga
- **Redirect**: kelola 301/302 tanpa deploy
- **Analitik**: halaman teratas, sumber lead, ringkasan Search Console lewat API
- **Audit Log**: siapa mengubah apa dan kapan

### 10.4 Prinsip UX Dashboard

Sebagian pengguna adalah staf non-teknis (D-08). Konsekuensinya:

- Bahasa antarmuka **Bahasa Indonesia**, bukan jargon Inggris
- Pesan error menjelaskan **cara memperbaiki**, bukan hanya apa yang salah
- Aksi destruktif butuh konfirmasi dan bisa dibatalkan (soft delete)
- Simpan otomatis setiap 30 detik, dengan indikator "tersimpan"
- Tidak ada input Markdown mentah, tidak ada input HTML mentah
- Setiap kolom rumit punya ikon tooltip berisi penjelasan singkat + tautan ke glosarium

---

## 11. Sistem Desain

> ⚠️ **Bab ini sudah digantikan sebagian.** `docs/DESIGN-SYSTEM.md` adalah **sumber kebenaran tunggal**
> untuk warna, tipografi, dan spesifikasi komponen. Bab 11 di sini hanya menyimpan prinsip yang masih
> berlaku. Kalau keduanya berbeda, **DESIGN-SYSTEM.md yang menang.**

### 11.1 Arah Visual

Bisnis ini menjual **kepercayaan pada keselamatan**. Desain harus terasa tegas dan profesional, bukan playful.

- **Palet `[A-02]`:** dasar **navy `#0D1B2A`**; aksen **merah `#E30613`**; charcoal `#222529`; netral abu-abu untuk teks.
  Draft v1.0 menyebut "safety orange atau hi-vis yellow" — itu **gugur**. Aksen sudah dikunci merah oleh brand guide RAC.
  Ini sekaligus menutup O-02 di Bab 20.2.
- **Tipografi `[A-10]`:** display **Archivo Expanded** (variable, `wdth` 118, SIL OFL) — bukan Bricolage/Space Grotesk,
  dan bukan Square 721 (font komersial; lisensi desktop tidak mencakup web, dan tidak dibeli — D-14).
  Square 721 tetap hidup **hanya di dalam logo** sebagai vektor, dan itu tidak melanggar lisensi.
  Body UI **Montserrat** (SIL OFL, self-host). Font isi artikel menunggu **D-15** — jangan diputuskan sendiri.
- **Fotografi:** dokumentasi asli, kontras tinggi, banyak ruang negatif, gestur kerja nyata
- **Motif grafis:** garis vertikal, simpul tali, atau elemen carabiner sebagai pembatas seksi
- **Gerak:** halus dan sedikit. Hormati `prefers-reduced-motion`

**Positioning `[A-11]`.** Situs **tidak** dibangun di atas posisi "we work with global standards".
Tidak ada satu pun hubungan resmi dengan IRATA, SPRAT, Petzl, IRSM, atau badan ISO (D-12), sehingga
posisi itu tidak bisa dipertahankan. Positioning yang dipakai adalah **kepatuhan regulasi Indonesia**:
sertifikat BNSP dan Kemnaker yang **diwajibkan hukum**. Untuk HSE Manager, kontraktor migas, dan
facility manager di Indonesia, itu argumen jual yang lebih kuat daripada deretan logo asing yang
tidak bisa diverifikasi. Copywriting beranda, Tentang Kami, dan seluruh halaman pelatihan mengikuti
posisi ini.

### 11.2 Token Desain `[A-03]`

**Blok `@theme` lengkap ada di `docs/DESIGN-SYSTEM.md` Bab 3.** Salin dari sana **persis apa adanya**
ke `src/styles/theme.css` — jangan mengubah, menambah, atau menghapus satu token pun, dan jangan
mengarang skala warna sendiri dari nilai hex brand guide.

Cakupan token yang harus ada:

```
Warna    : brand-50 … brand-950, accent-50 … accent-900, neutral-*,
           success, warning, danger, surface-*, border-*
Font     : --font-display, --font-body, --font-reading
Skala    : text-xs … text-6xl (base = 17px, minimum body mobile)
Spasi    : skala 4px
Radius   : sm, md, lg, full
Bayangan : sm, md, lg
Breakpoint: sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536
```

Tabel **aturan pemakaian warna** (konteks → token) ada di DESIGN-SYSTEM Bab 3.1 dan wajib
diimplementasikan seluruhnya sebagai varian komponen, bukan diterapkan ad-hoc per halaman.

### 11.3 Responsif & Aksesibilitas

- **Mobile-first.** Trafik Indonesia untuk kueri seperti ini didominasi ponsel
- Titik sentuh minimal 44×44 px
- Kontras teks minimal WCAG AA (4.5:1)
- `[A-05]` **Teks merah berukuran kecil di latar gelap WAJIB memakai `accent-400` (`#F45E5E`), bukan
  `accent-500`.** Merah brand `#E30613` di atas navy `#0D1B2A` hanya mencapai **3,51:1** — lolos untuk
  teks besar, **gagal AA untuk teks normal**. Ini menyangkut eyebrow dan label kecil, elemen yang
  banyak dipakai di mockup. Headline besar boleh tetap `accent-500`. Tabel kontras lengkap:
  DESIGN-SYSTEM Bab 2.5 dan Bab 7. Aturan ini persyaratan aksesibilitas, bukan preferensi.
- `[A-08]` Teks Indonesia rata-rata **15–20% lebih panjang** dari Inggris. Uji menu, tombol, dan judul
  kartu dengan teks **ID** terpanjang, bukan EN. Breakpoint 1024–1280px paling rawan meluber.
  Tombol tidak boleh punya lebar tetap — pakai padding, bukan `width`.
- Semua elemen interaktif dapat diakses keyboard, dengan indikator fokus terlihat
- HTML semantik: `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`
- Form: `<label>` benar, `aria-describedby` untuk pesan error, `aria-live` untuk status kirim
- Uji di lebar 320 px (batas bawah), 375, 768, 1024, 1440

### 11.4 Catatan Jujur tentang Aset Visual

D-07 mencatat: belum ada foto atau video sama sekali. **Ini penghambat terbesar proyek ini, bukan kode.**

Situs rope access hidup dari dokumentasi asli — area latihan, peserta di ketinggian, instruktur, peralatan. Foto stok akan langsung terbaca palsu oleh calon peserta maupun facility manager, dan sekaligus melemahkan E-E-A-T di mata Google.

Anggarkan sesi foto profesional setengah hari, minimal menghasilkan:
- 10 foto area latihan / fasilitas
- 15 foto kegiatan pelatihan (peserta di tali, instruktur mengajar, briefing)
- 8 foto peralatan dan APD
- 5 potret instruktur, latar konsisten
- 10 foto pekerjaan lapangan (pembersihan kaca, aplikasi sealant)
- 1 video profil 60 detik, 3 klip pendek 15 detik untuk hero

Sesi ini akan lebih menentukan konversi daripada seluruh optimasi teknis di dokumen ini digabung.

---

## 12. Optimasi Performa: Cache, Gambar, Aset

### 12.1 Strategi Cache Berlapis

| Lapis | Isi | TTL | Cara invalidasi |
|---|---|---|---|
| **Browser** | Aset ber-hash (JS, CSS, font) | 1 tahun, `immutable` | Hash berubah otomatis saat build |
| **Browser** | Dokumen HTML | `no-cache` + ETag | Validasi ulang tiap kunjungan |
| **Cloudflare Edge** | Halaman publik | 1 jam, `stale-while-revalidate` 24 jam | Purge by tag saat publish |
| **Cloudflare Edge** | Gambar | 1 tahun | URL ber-versi |
| **KV** | Setting situs, navigasi | 5 menit | Purge saat setting disimpan |
| **Memori Worker** | Hasil query panas | Seumur isolate | Otomatis |

**Cache tagging `[ADR-002]`:** setiap halaman diberi tag (`article:123`, `course:5`, `global`). Saat sebuah artikel diterbitkan, hanya tag terkait yang di-purge — bukan seluruh situs. Halaman lain tetap panas.

> 🔴 **Koreksi arsitektur — baca sebelum mengerjakan T-216.**
>
> Draft v1.0 mengasumsikan purge-by-tag bisa dibangun di atas **Cache API** Workers. **Tidak bisa.**
> Dua batasan yang tidak bisa dilewati:
>
> 1. **Cache API bersifat per-colo.** `caches.default.delete(url)` hanya menghapus salinan di pusat
>    data yang sedang melayani permintaan itu — bukan di 300+ kota lain. Purge yang terasa berhasil
>    di lokal akan menyisakan konten basi di mayoritas dunia.
> 2. **Purge berbasis *Cache Tag* adalah fitur Enterprise.** Header `Cache-Tag` dan purge-by-tag lewat
>    API tidak tersedia di paket Workers Paid $5 yang dianggarkan di Bab 4.6.
>
> **Arsitektur pengganti — inilah yang diimplementasikan:**
>
> | Lapis | Peran |
> |---|---|
> | **KV sebagai penyimpan HTML terender** | KV bersifat **global**. Halaman publik dirender lalu disimpan di KV dengan kunci `page:<locale>:<path>`. Ini yang jadi "cache" sesungguhnya. |
> | **Indeks tag di KV** | Kunci `tag:<nama-tag>` menyimpan daftar kunci halaman yang memakai tag itu. `purgeByTag('article:123')` = baca indeks → hapus setiap kunci halaman → hapus indeks. Global, tepat sasaran, dan berjalan di paket $5. |
> | **Edge (Cache API / CDN)** | TTL **pendek**: `s-maxage=60, stale-while-revalidate=86400`. Tidak diandalkan untuk purge — dibiarkan kedaluwarsa sendiri dalam 60 detik. Pengunjung tetap dapat respons instan lewat `stale-while-revalidate`. |
>
> Konsekuensi yang diterima: setelah publish, ada jendela **maksimal 60 detik** di mana sebagian
> pengunjung masih melihat versi lama dari edge. Untuk situs konten, itu tidak berarti apa-apa —
> jauh lebih murah daripada langganan Enterprise, dan jauh lebih benar daripada purge per-colo yang
> menyisakan konten basi berhari-hari.
>
> Batas mutlak tidak berubah: `/admin/*` dan `/api/*` **tidak pernah** masuk KV maupun edge cache.

**Aturan tanpa kecuali:** rute `/admin/*` dan `/api/*` **tidak pernah** di-cache. Header `Cache-Control: private, no-store`.

### 12.2 Optimasi Gambar

- Semua gambar melalui **Cloudflare Images**: konversi otomatis ke AVIF/WebP sesuai dukungan browser
- `srcset` responsif: 400 / 800 / 1200 / 1600 px
- `loading="lazy"` untuk semua gambar di bawah lipatan; `fetchpriority="high"` untuk gambar hero
- `width` dan `height` **wajib** ada di setiap `<img>` — mencegah CLS
- Placeholder blur (LQIP) untuk hero
- Alt text ID+EN wajib di tingkat database, bukan opsional
- Ukuran sumber maksimal 5 MB; upload lebih besar ditolak dengan pesan jelas

### 12.3 Aset Lain

- **Font:** self-hosted (bukan Google Fonts CDN — lebih cepat dan lebih ramah privasi), format WOFF2, subset Latin + Latin Extended, `font-display: swap`, preload font hero
- **JavaScript:** hanya lewat island Astro. Halaman publik target < 20 KB JS. Dashboard boleh lebih berat, tapi harus code-split per rute
- **CSS:** Tailwind memangkas kelas tak terpakai; CSS kritis di-inline oleh Astro
- **Video:** Cloudflare Stream atau R2 dengan poster image; jangan pernah autoplay dengan suara

### 12.4 Anggaran Performa

Wajib diuji di CI. Build gagal kalau **kolom "Batas gagal"** terlampaui. `[ADR-005]`

**Cara menegakkan, supaya gerbangnya bermakna:**

- Kolom **Target** = ambisi. Dilaporkan sebagai **peringatan**, tidak memblokir merge.
- Kolom **Batas gagal** = gerbang **blocking**. Ini satu-satunya yang menggagalkan CI.
- Lighthouse dijalankan **3× per URL, diambil median**. Skor Lighthouse di runner CI bervariasi
  ±5 poin antar-run karena beban mesin, bukan karena kode berubah. Gerbang `Performance > 95`
  pada satu kali run akan sering merah tanpa ada regresi apa pun — dan gerbang yang sering merah
  palsu akan diabaikan orang, lalu berhenti melindungi apa pun.
- Kalau anggaran benar-benar tidak terpenuhi: **laporkan halaman dan metriknya. JANGAN turunkan
  ambangnya supaya lulus.**

| Metrik | Target | Batas gagal |
|---|---|---|
| LCP (mobile 4G) | < 2,0 s | 2,5 s |
| INP | < 150 ms | 200 ms |
| CLS | < 0,05 | 0,1 |
| Lighthouse Performance | > 95 | 90 |
| Lighthouse Accessibility | 100 | 95 |
| Lighthouse SEO | 100 | 100 |
| Total transfer halaman (beranda) | < 500 KB | 800 KB |
| JS halaman publik | < 20 KB | 50 KB |

### 12.5 Cloudflare Cron Triggers

| Jadwal | Tugas |
|---|---|
| Harian 02:00 WIB | Backup D1 ke R2 lewat **D1 REST API export** `[ADR-004]` — bukan `wrangler` |
| Harian 03:00 WIB | Regenerasi sitemap |
| Harian 07:00 WIB | Ringkasan lead kemarin via email |
| Mingguan Senin 06:00 | Laporan performa & posisi keyword |
| Tiap jam | Update status batch (dibuka → berjalan → selesai) |

---

## 13. Keamanan

### 13.1 Lapisan Perlindungan

| Lapis | Kontrol |
|---|---|
| **Jaringan** | Cloudflare WAF (ruleset terkelola), proteksi DDoS, Bot Management |
| **Transport** | HTTPS wajib, HSTS `max-age=31536000; includeSubDomains; preload`, TLS 1.3 |
| **Header** | CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` |
| **Autentikasi** | Cloudflare Access untuk `/admin/*`. Tidak ada password yang Anda kelola sendiri |
| **Otorisasi** | Pemeriksaan peran di setiap handler API, bukan hanya di UI |
| **Input** | Validasi Zod di sisi server pada setiap endpoint, tanpa kecuali |
| **Database** | Query berparameter via Drizzle. Tidak pernah ada SQL yang dirangkai dari string |
| **Form** | Turnstile + rate limit + honeypot field |
| **Upload** | Whitelist tipe MIME, batas ukuran, nama file diacak, disajikan dari domain terpisah |
| **Rahasia** | Cloudflare Secrets. `.env` masuk `.gitignore`. Pemindai rahasia aktif di GitHub |
| **Audit** | Semua aksi admin tercatat di `audit_log` |

### 13.2 Content Security Policy

Mulai dari kebijakan ketat, longgarkan hanya jika terbukti perlu:

```
default-src 'self';
script-src 'self' 'nonce-{random}' https://challenges.cloudflare.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https://imagedelivery.net;
font-src 'self';
connect-src 'self' https://challenges.cloudflare.com;
frame-src https://challenges.cloudflare.com;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests;
```

Terapkan dulu dengan `Content-Security-Policy-Report-Only` selama satu minggu, kumpulkan laporan pelanggaran, baru aktifkan penuh.

### 13.3 Perlindungan Data Pribadi

Tabel `leads` berisi data pribadi (nama, nomor telepon, email). Indonesia memiliki **UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)**, dengan kewajiban yang berlaku penuh sejak Oktober 2024.

Kewajiban praktis:
- **Dasar pemrosesan:** persetujuan eksplisit. Checkbox tidak boleh tercentang otomatis
- **Pemberitahuan:** teks singkat di dekat form + tautan ke Kebijakan Privasi
- **Minimalisasi data:** jangan minta data yang tidak dipakai. Tanggal lahir tidak perlu di form kontak
- **Retensi:** tetapkan periode (saran: 24 bulan sejak kontak terakhir), lalu anonimkan otomatis
- **Hak subjek data:** sediakan alamat email untuk permintaan akses/koreksi/hapus, dan prosedur internalnya di `docs/RUNBOOK.md`
- **IP address:** simpan sebagai hash, bukan nilai mentah
- **Ekspor:** ekspor CSV tercatat di audit log

> Dokumen ini bukan nasihat hukum. Sebelum rilis, mintalah penasihat hukum meninjau Kebijakan Privasi dan alur persetujuan Anda.

### 13.4 Praktik Aman Saat Memakai Claude Code

- **Jangan pernah** menaruh kredensial produksi di dalam kode atau di prompt
- Kunci `.env`, `.dev.vars`, dan `wrangler.toml` (jika memuat ID akun) dari pembacaan agen lewat permission rules
- Claude Code hanya berkerja pada database **development**. Migration ke production dijalankan oleh Anda secara manual
- Aktifkan pemindai rahasia GitHub dan Dependabot
- Setiap PR yang menyentuh autentikasi, endpoint API, atau upload wajib melewati subagent `security-reviewer`

---

## 14. Integrasi Pihak Ketiga

### 14.1 Daftar Integrasi & Urutan Pemasangan

| Alat | Fungsi | Kapan dipasang | Biaya |
|---|---|---|---|
| **Google Search Console** | Data kueri, indeksasi, masalah teknis | Hari pertama domain aktif | Gratis |
| **Bing Webmaster Tools** | Indeksasi Bing — **penting**, karena ChatGPT memakai indeks Bing | Bersamaan GSC | Gratis |
| **Cloudflare Web Analytics** | Analitik dasar tanpa cookie | Bersamaan launch | Gratis |
| **Google Analytics 4** | Analisis perilaku mendalam | Setelah launch | Gratis |
| **Google Tag Manager** | Pengelola tag terpusat | Bersamaan GA4 | Gratis |
| **Google Business Profile** | SEO lokal, muncul di Maps | Setelah alamat kantor pasti | Gratis |
| **Resend** | Email notifikasi lead | Fase 2 | Gratis s/d 3.000/bln |
| **Meta Pixel** | Retargeting iklan | Hanya jika beriklan | Gratis |
| **Sentry** | Pelacakan error produksi | Fase 4 | Gratis (tier hobi) |

### 14.2 Persiapan Teknis (Dibangun Sejak Awal)

Semuanya disiapkan di Fase 1–2 supaya pemasangan nanti tinggal menempel ID, tanpa mengubah kode:

1. **Blok verifikasi situs.** Kolom di tabel `settings` untuk meta verification GSC dan Bing, dirender di `<head>` bila terisi.
2. **Loader skrip berbasis consent.** GA4/GTM hanya dimuat setelah pengunjung menyetujui cookie analitik. Wajib untuk kepatuhan UU PDP.
3. **Lapisan event terstandar.** Definisikan event sejak awal: `lead_form_view`, `lead_form_submit`, `wa_click`, `batch_view`, `course_view`, `article_read_75`, `download_checklist`. Kirim ke `dataLayer`.
4. **Penangkap UTM.** Parameter UTM ditangkap saat kunjungan pertama, disimpan di `sessionStorage`, dan ikut terkirim saat form dikirim — sehingga tercatat permanen di tabel `leads`.
5. **Endpoint verifikasi.** `/api/health` untuk uptime monitoring.
6. **Banner consent cookie.** Tiga pilihan: Terima Semua · Hanya Esensial · Atur. Preferensi tersimpan 12 bulan.

### 14.3 Checklist Pasca-Launch

```
[ ] Verifikasi domain di Google Search Console (metode DNS)
[ ] Submit sitemap-index.xml ke GSC
[ ] Verifikasi di Bing Webmaster Tools + submit sitemap
[ ] Uji semua schema di Rich Results Test Google
[ ] Uji semua schema di Schema Markup Validator
[ ] Cek hreflang lewat laporan Internasional di GSC
[ ] Pasang Cloudflare Web Analytics
[ ] Pasang GA4 via GTM dengan gerbang consent
[ ] Uji seluruh event GA4 lewat mode DebugView
[ ] Buat & verifikasi Google Business Profile
[ ] Submit ke direktori industri yang relevan
[ ] Uji semua tautan WhatsApp di Android dan iOS
[ ] Uji pengiriman form di 4 browser × 2 sistem operasi
[ ] Verifikasi email Resend masuk inbox, bukan spam (cek SPF/DKIM/DMARC)
[ ] Jalankan Lighthouse di 10 halaman kunci
[ ] Uji dengan pembaca layar (NVDA atau VoiceOver)
[ ] Konfirmasi backup D1 berjalan
[ ] Uji prosedur rollback di lingkungan staging
```

---

## 15. Halaman Pendukung & Legal

### 15.1 Kebijakan Privasi

Wajib memuat, dalam bahasa yang dapat dipahami orang awam:
- Identitas dan kontak pengendali data (nama PT, alamat, email)
- Jenis data yang dikumpulkan: identitas (nama, telepon, email, perusahaan), teknis (IP ter-hash, user agent), perilaku (halaman dikunjungi, sumber)
- Tujuan pemrosesan: menanggapi permintaan, mengelola pendaftaran, mengirim informasi jadwal
- Dasar hukum: persetujuan
- Pihak ketiga yang menerima data: Cloudflare (hosting), Resend (email), Google (analitik), WhatsApp/Meta (komunikasi)
- Transfer data ke luar negeri dan pengamanannya
- Periode retensi
- Hak subjek data menurut UU PDP: akses, koreksi, penghapusan, penarikan persetujuan, keberatan
- Cara menggunakan hak tersebut (email khusus + estimasi waktu tanggapan)
- Kebijakan cookie (atau tautan ke halaman terpisah)
- Tanggal berlaku dan riwayat perubahan

### 15.2 Syarat & Ketentuan

- Ruang lingkup layanan pelatihan dan jasa
- Prosedur pendaftaran dan konfirmasi
- Ketentuan pembayaran
- Kewajiban peserta: kondisi kesehatan, kelengkapan APD, kepatuhan aturan keselamatan
- Persyaratan usia dan kesehatan minimum
- Ketentuan penerbitan sertifikat dan masa berlaku
- Hak kekayaan intelektual atas materi pelatihan
- Batasan tanggung jawab
- Force majeure
- Penyelesaian sengketa dan yurisdiksi

### 15.3 Disclaimer

- Informasi di situs bersifat umum dan tidak menggantikan pelatihan formal
- Konten K3 tidak menggantikan penilaian risiko lapangan
- Rujukan regulasi mengacu pada versi terkini yang diketahui; pembaca wajib memverifikasi ke sumber resmi
- Kelulusan pelatihan tidak menjamin memperoleh pekerjaan
- Harga dapat berubah tanpa pemberitahuan
- **Pernyataan status IRATA/SPRAT (D-05):** menegaskan bahwa program IRATA/SPRAT masih dalam tahap persiapan dan belum ditawarkan
- Tautan eksternal bukan bentuk dukungan

### 15.4 Kebijakan Cookie

Tabel per kategori: esensial, analitik, pemasaran. Untuk setiap cookie: nama, tujuan, masa berlaku, pihak pengelola. Sertakan tombol untuk mengubah preferensi consent.

### 15.5 Kebijakan Pembatalan & Refund

Bagian yang paling sering ditanyakan dan paling sering memicu sengketa. Harus eksplisit:
- Tenggat pembatalan oleh peserta dan persentase pengembalian
- Ketentuan pemindahan ke batch lain
- Kebijakan bila pelatihan dibatalkan oleh penyelenggara
- Kebijakan bila peserta tidak hadir
- Ketentuan mengulang ujian
- Prosedur dan lama proses pengembalian dana

### 15.6 Kebijakan K3 (HSE Policy)

Halaman ini punya nilai SEO dan kepercayaan yang tinggi untuk audiens korporat. Muat: komitmen keselamatan, standar yang diacu, rasio instruktur–peserta, prosedur inspeksi peralatan, prosedur tanggap darurat, dan catatan rekam jejak keselamatan.

### 15.7 Halaman 404 & Aksesibilitas

**404:** jangan buntu. Sertakan kotak pencarian, tautan ke halaman terpopuler, dan tombol WhatsApp. Catat semua 404 ke tabel `redirects` untuk ditinjau bulanan.

**Pernyataan Aksesibilitas:** tingkat kepatuhan yang dituju (WCAG 2.1 AA), keterbatasan yang diketahui, dan kontak untuk melaporkan hambatan.

---

## 16. Cara Bekerja dengan Claude Code

Ini bab yang Anda minta secara khusus. Isinya berbasis dokumentasi resmi Claude Code dan pola yang terbukti dipakai tim produksi.

### 16.1 Kenapa Claude Code Bisa Ngaco — Satu Sebab Utama

Hampir semua kegagalan berakar pada satu hal: **jendela konteks penuh, dan performa menurun seiring terisinya konteks.**

Jendela konteks memuat seluruh percakapan — setiap pesan, setiap file yang dibaca, setiap keluaran perintah. Satu sesi debugging bisa menghabiskan puluhan ribu token. Ketika konteks hampir penuh, Claude mulai "melupakan" instruksi awal dan lebih sering keliru.

Semua praktik di bawah ini pada dasarnya adalah cara melindungi konteks.

### 16.2 Tujuh Aturan Wajib

**Aturan 1 — Selalu mulai dengan Plan Mode untuk pekerjaan non-trivial.**

Alur empat fase yang direkomendasikan dokumentasi resmi:

```
1. EXPLORE   Tekan Shift+Tab sampai status bar menunjukkan "⏸ plan mode on"
             (atau jalankan: claude --permission-mode plan)
             "Baca src/lib/db dan db/schema.ts. Jelaskan bagaimana artikel
              disimpan dan bagaimana kaitannya dengan tabel terjemahan."

2. PLAN      "Saya mau menambahkan penjadwalan artikel. File apa saja yang
              berubah? Apa risikonya? Buat rencana."
             Tekan Ctrl+G untuk membuka rencana di editor teks dan mengeditnya
             langsung sebelum disetujui.

3. IMPLEMENT Setujui rencana atau tekan Shift+Tab untuk keluar dari plan mode.
             "Implementasikan sesuai rencana. Tulis test untuk logika
              penjadwalan, jalankan test suite, perbaiki kegagalan."

4. COMMIT    "Commit dengan pesan deskriptif dan buka PR."
```

Lewati plan mode hanya jika Anda bisa menjelaskan perubahannya dalam satu kalimat (perbaiki typo, ganti nama variabel). Untuk migrasi database, autentikasi, halaman sensitif SEO, dan konfigurasi produksi — **selalu** pakai plan mode.

**Aturan 2 — Beri Claude cara memverifikasi pekerjaannya sendiri.**

Ini pembeda terbesar antara sesi yang harus Anda awasi terus dan sesi yang bisa Anda tinggal.

Claude berhenti ketika pekerjaan *terlihat* selesai. Tanpa pemeriksaan yang bisa dijalankan, "terlihat selesai" adalah satu-satunya sinyal yang tersedia, dan Andalah yang menjadi loop verifikasinya. Beri sesuatu yang menghasilkan lulus/gagal, dan loop itu menutup sendiri.

Untuk proyek ini, alat verifikasinya:
```bash
pnpm typecheck        # TypeScript strict
pnpm lint             # ESLint + Prettier
pnpm test             # Vitest unit test
pnpm test:e2e         # Playwright end-to-end
pnpm build            # Build gagal = ada yang salah
pnpm lighthouse       # Anggaran performa
pnpm check:content    # Aturan konten kustom (D-05, thin content)
```

Selalu tutup prompt dengan: *"jalankan `pnpm typecheck && pnpm test && pnpm build`, perbaiki kegagalan, dan tunjukkan outputnya."*

Minta Claude **menunjukkan bukti**, bukan mengklaim berhasil — output test, perintah yang dijalankan dan hasilnya, atau screenshot.

**Aturan 3 — `/clear` antar tugas yang tidak berkaitan.**

Pola kegagalan paling umum adalah "sesi bak cuci piring": mulai satu tugas, tanya hal lain, balik lagi ke tugas pertama, dan konteks penuh informasi tak relevan.

Kebiasaan yang benar: satu sesi = satu tugas koheren. Selesai → `/clear`.

**Aturan 4 — Setelah dua koreksi gagal, berhenti dan mulai ulang.**

Kalau Anda sudah mengoreksi hal yang sama lebih dari dua kali dalam satu sesi, konteksnya sudah tercemar pendekatan-pendekatan yang gagal. Jalankan `/clear` dan tulis prompt awal baru yang memuat pelajaran dari kegagalan tadi. Sesi bersih dengan prompt lebih baik hampir selalu mengalahkan sesi panjang penuh koreksi.

**Aturan 5 — Gunakan subagent untuk investigasi.**

Ketika Claude meneliti basis kode, ia membaca banyak file, dan semuanya memakan konteks Anda. Subagent berjalan di jendela konteks terpisah dan hanya melaporkan ringkasannya.

```
"Gunakan subagent untuk menyelidiki bagaimana schema.org digenerate
 di seluruh basis kode, dan apakah ada helper yang bisa saya pakai ulang."
```

**Aturan 6 — Tambahkan langkah tinjauan adversarial sebelum menganggap selesai.**

Peninjau yang berjalan di konteks subagent baru hanya melihat diff dan kriteria yang Anda berikan, bukan alasan yang menghasilkan perubahan itu — sehingga ia menilai hasilnya secara mandiri.

```
"Gunakan subagent untuk meninjau diff form lead terhadap docs/PLAN.md
 Bab 6.3. Periksa setiap persyaratan sudah diimplementasikan, kasus tepi
 sudah ada testnya, dan tidak ada yang berubah di luar cakupan.
 Laporkan celah, bukan preferensi gaya."
```

Catatan penting: peninjau yang diminta mencari celah biasanya akan melaporkan sesuatu, bahkan saat pekerjaannya sudah benar. Mengejar setiap temuan menghasilkan over-engineering. Minta peninjau hanya menandai celah yang memengaruhi kebenaran atau persyaratan tertulis; sisanya perlakukan sebagai opsional.

**Aturan 7 — Biarkan Claude mewawancarai Anda untuk fitur besar.**

Untuk fitur besar, mulailah dengan prompt minimal dan minta Claude mewawancarai Anda menggunakan tool `AskUserQuestion`. Claude akan menanyakan hal-hal yang belum Anda pikirkan: implementasi teknis, UI/UX, kasus tepi, dan trade-off. Setelah spesifikasi lengkap, mulai sesi baru untuk mengeksekusinya — sesi baru punya konteks bersih yang sepenuhnya fokus pada implementasi.

### 16.3 Template `CLAUDE.md`

File ini dibaca di awal **setiap** percakapan. Jaga tetap pendek — target di bawah 150 baris. Aturan penyaringnya: *"Kalau baris ini dihapus, apakah Claude akan membuat kesalahan?"* Kalau tidak, hapus.

File `CLAUDE.md` yang terlalu panjang membuat Claude mengabaikan sebagian instruksi karena aturan penting tenggelam dalam kebisingan.

```markdown
# Website Training Center Rope Access

Rencana lengkap: @docs/PLAN.md — baca bagian yang relevan sebelum mengerjakan fitur.
Keputusan arsitektur: @docs/DECISIONS.md

## Perintah
- `pnpm dev` — server pengembangan
- `pnpm typecheck` — TypeScript (WAJIB lolos sebelum commit)
- `pnpm test` — unit test Vitest
- `pnpm test:e2e` — Playwright
- `pnpm build` — build produksi
- `pnpm check:content` — validator aturan konten
- `pnpm db:generate` — generate migration Drizzle
- `pnpm db:migrate:local` — terapkan migration ke D1 lokal

## Aturan yang TIDAK BOLEH dilanggar

1. JANGAN PERNAH menjalankan migration ke database production. Hanya lokal.
2. JANGAN PERNAH commit .env, .dev.vars, atau nilai rahasia apa pun.
3. IRATA dan SPRAT hanya boleh muncul sebagai "rencana/persiapan".
   Dilarang: logo, penawaran layanan, halaman harga, schema Course,
   halaman pendaftaran. Lihat PLAN.md Bab 3, D-05.
   Berlaku sama untuk Petzl, IRSM, dan ISO 9001 (D-12).
4. JANGAN PERNAH mengarang angka, nomor lisensi, harga, nama instruktur,
   atau testimoni. Semua nilai faktual datang dari @docs/FAKTA-BISNIS.md.
   Kalau belum ada di sana, tulis "TODO:" — jangan diisi perkiraan.
5. Setiap endpoint API WAJIB memvalidasi input dengan Zod di sisi server.
6. Setiap query database lewat Drizzle. Dilarang merangkai SQL dari string.
7. Setiap <img> WAJIB punya alt, width, dan height.
8. Rute /admin/* dan /api/* WAJIB no-cache.
9. Setiap halaman publik WAJIB punya title, description, canonical, hreflang.

## Gaya kode
- TypeScript strict. Dilarang `any` — pakai `unknown` lalu persempit.
- Warna/spasi/font HANYA lewat token Tailwind. Dilarang nilai arbitrer
  seperti text-[#123456].
- Komponen React hanya untuk island interaktif. Halaman lain pakai .astro.
- Nama file: PascalCase untuk komponen, kebab-case untuk rute.
- Teks yang terlihat pengguna melalui helper i18n. Dilarang string hardcode.

## Alur kerja
- Plan mode dulu untuk perubahan multi-file.
- Setelah menulis kode: jalankan typecheck, test, dan build. Perbaiki kegagalan.
- Tunjukkan output test sebagai bukti, jangan hanya menyatakan berhasil.
- Setelah tugas selesai: TULIS LOG PEKERJAAN. Lihat @.claude/skills/worklog/SKILL.md
- Commit atomik. Format Conventional Commits.

## Bahasa
- Kode, komentar, nama variabel: Inggris.
- Teks antarmuka pengguna: Indonesia (dengan padanan EN via i18n).
- Percakapan dengan saya: Indonesia.
```

### 16.4 Perpustakaan Prompt per Fase

Salin, sesuaikan, tempel. Perhatikan polanya: **cakupan spesifik + rujukan file + kriteria verifikasi**.

**Menyiapkan proyek**
```
Baca @docs/PLAN.md Bab 4 dan 5.

Inisialisasi proyek Astro 6 dengan TypeScript strict, Tailwind CSS v4,
dan adapter Cloudflare Workers. Buat struktur folder persis seperti Bab 5.
Siapkan Drizzle dengan D1, Vitest, Playwright, ESLint, dan Prettier.

JANGAN buat halaman atau komponen apa pun. Hanya kerangka.
Selesai: jalankan `pnpm build` dan tunjukkan output.
```

**Membuat skema database**
```
Baca @docs/PLAN.md Bab 6.

Implementasikan skema Drizzle lengkap di db/schema.ts persis seperti
spesifikasi, termasuk semua index di Bab 6.2. Buat migration awal.

Tulis test Vitest yang memverifikasi setiap tabel dapat menerima insert
dan constraint bekerja. Jalankan test dan tunjukkan output.
```

**Membangun endpoint lead**
```
Baca @docs/PLAN.md Bab 6.3 dan Bab 13.

Implementasikan POST /api/leads mengikuti alur 6 langkah persis seperti
Bab 6.3. Wajib ada: verifikasi Turnstile, rate limit 3/IP/jam, validasi
Zod sisi server, normalisasi nomor telepon ke format +62, generate ref_code,
insert ke D1 SEBELUM mengembalikan respons, dan notifikasi Resend
yang kegagalannya tidak memblokir.

Tulis test untuk: happy path, Turnstile gagal, rate limit terlampaui,
nomor telepon tidak valid, Resend gagal (harus tetap mengembalikan sukses).

Jalankan `pnpm test` dan tunjukkan output.
Setelah itu, gunakan subagent security-reviewer untuk meninjau endpoint ini.
```

**Membangun komponen SEO**
```
Baca @docs/PLAN.md Bab 8.2.

Buat komponen <SeoHead> di src/components/seo/ yang menerima props
bertipe dan merender: title, description, canonical, hreflang (ID/EN/x-default),
Open Graph, Twitter Card, dan JSON-LD sesuai pageType.

Buat generator schema terpisah di src/lib/seo/schema.ts untuk setiap jenis
di tabel Bab 8.2.

Tulis test yang memvalidasi JSON-LD keluaran terhadap tipe schema.org
yang diharapkan. Jalankan test dan tunjukkan output.
```

**Debugging**
```
Form lead gagal di Safari iOS tapi berhasil di Chrome. Gejala:
tombol submit tidak merespons.

Periksa src/components/islands/LeadForm.tsx dan integrasi Turnstile.
Tulis dulu test yang mereproduksi masalah, baru perbaiki.
Tangani akar masalahnya, jangan menekan gejalanya.
```

**Tinjauan sebelum merge**
```
Gunakan subagent untuk meninjau seluruh diff di branch ini terhadap
@docs/PLAN.md Bab 9 dan Bab 13.

Periksa: setiap persyaratan terimplementasi, kasus tepi punya test,
tidak ada rahasia yang ter-commit, tidak ada perubahan di luar cakupan tugas.

Laporkan hanya celah yang memengaruhi kebenaran atau persyaratan tertulis.
Abaikan preferensi gaya.
```

### 16.5 Anti-Pola yang Harus Dihindari

| Anti-pola | Kenapa gagal | Perbaikan |
|---|---|---|
| "Buatkan saya website training center" | Terlalu luas, Claude mengarang seluruh arsitektur | Pecah per fase, rujuk PLAN.md |
| Menempel seluruh PLAN.md ke `CLAUDE.md` | Memakan konteks setiap sesi, aturan penting tenggelam | `CLAUDE.md` pendek + `@docs/PLAN.md` |
| Satu sesi untuk 5 fitur berbeda | Konteks penuh, kualitas anjlok di fitur ke-3 | `/clear` antar fitur |
| "Bagus, sekarang tambahkan X" berulang 20 kali | Konteks akumulatif tanpa verifikasi | Commit + `/clear` tiap fitur selesai |
| Menerima kode tanpa menjalankan test | Kode plausibel yang tidak menangani kasus tepi | Selalu minta bukti output |
| "Investigasi codebase ini" tanpa cakupan | Membaca ratusan file, konteks habis | Persempit atau pakai subagent |
| Membiarkan Claude menyentuh DB production | Risiko kehilangan data permanen | Blokir lewat permission rules |
| Meminta Claude menulis fakta regulasi | Bisa mengarang nomor pasal | Sumber fakta dari Anda; Claude hanya merapikan |

### 16.6 Konfigurasi `.claude/settings.json`

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm run *)",
      "Bash(pnpm test*)",
      "Bash(git status)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(gh pr *)"
    ],
    "deny": [
      "Read(.env)",
      "Read(.dev.vars)",
      "Read(**/*.pem)",
      "Bash(wrangler d1 execute * --remote*)",
      "Bash(wrangler deploy*)",
      "Bash(rm -rf*)",
      "Bash(curl*)"
    ]
    // `[ADR-006]` — file nyata di .claude/settings.json BERBEDA sedikit dari
    // blok ini. Dua koreksi:
    //  1. deny "Bash(curl*)" memblokir total, termasuk pengujian Turnstile
    //     dan Resend yang justru DIMINTA oleh PLAYBOOK T-203 dan T-204.
    //     Yang dipakai: deny dipersempit ke curl yang menembak domain
    //     produksi dan API Cloudflare; curl ke localhost tetap diizinkan.
    //  2. "Bash(gh pr *)" tidak berlaku di sesi Claude Code web — di sana
    //     operasi GitHub lewat MCP. Allow memuat keduanya.
    // Yang TIDAK berubah dan tidak boleh dilonggarkan: wrangler deploy,
    // wrangler d1 --remote, Read(.env), Read(.dev.vars).
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "pnpm lint:staged" }]
      }
    ],
    "Stop": [
      {
        "hooks": [{ "type": "command", "command": "node scripts/check-worklog.mjs" }]
      }
    ]
  }
}
```

Dua hal penting di sini:

1. **`wrangler deploy` dan perintah D1 `--remote` diblokir.** Deploy ke production adalah keputusan Anda, bukan keputusan agen.
2. **Hook `Stop`** memverifikasi log pekerjaan sudah ditulis sebelum giliran berakhir. Instruksi di `CLAUDE.md` sifatnya anjuran; hook sifatnya deterministik dan dijamin berjalan.

### 16.7 Subagent Kustom

**`.claude/agents/security-reviewer.md`**
```markdown
---
name: security-reviewer
description: Meninjau kode untuk kerentanan keamanan
tools: Read, Grep, Glob, Bash
model: opus
---
Anda insinyur keamanan senior. Tinjau kode terhadap:
- Injeksi (SQL, XSS, command injection)
- Kelemahan autentikasi dan otorisasi
- Rahasia atau kredensial yang ter-hardcode
- Validasi input yang hilang di sisi server
- Kepatuhan terhadap docs/PLAN.md Bab 13

Berikan rujukan baris spesifik dan usulan perbaikan.
Laporkan hanya masalah nyata, bukan preferensi gaya.
```

**`.claude/agents/seo-auditor.md`**
```markdown
---
name: seo-auditor
description: Mengaudit halaman terhadap persyaratan SEO teknis
tools: Read, Grep, Glob, Bash
---
Audit halaman terhadap docs/PLAN.md Bab 8.2. Verifikasi:
- Tepat satu h1, hierarki heading tidak melompat
- Title unik 50-60 karakter, description 140-160
- Canonical dan hreflang ada dan benar
- JSON-LD ada dan sesuai jenis halaman
- Semua img punya alt, width, height
- Ada internal link keluar
Laporkan pelanggaran dengan file dan baris.
```

**`.claude/agents/content-quality-checker.md`**
```markdown
---
name: content-quality-checker
description: Memeriksa artikel terhadap standar anti thin-content
tools: Read, Grep, Glob
---
Periksa artikel terhadap docs/PLAN.md Bab 9. Verifikasi ambang kuantitatif
Bab 9.3 dan minimal 3 elemen nilai unik Bab 9.2.
Periksa juga kepatuhan D-05 soal IRATA/SPRAT.
Laporkan LULUS atau GAGAL dengan alasan spesifik.
```

### 16.8 Ritme Kerja Harian

```
PAGI
  1. Buka PLAN.md, pilih SATU tugas dari fase saat ini
  2. Buat branch: git checkout -b feat/nama-tugas
  3. claude --permission-mode plan
  4. Explore → Plan → tinjau rencana (Ctrl+G untuk edit) → setujui

SIANG
  5. Implementasi
  6. Verifikasi: typecheck + test + build
  7. Subagent review kalau menyentuh keamanan/SEO/konten
  8. Perbaiki temuan

SORE
  9. Tulis log pekerjaan
  10. Commit + push + buka PR
  11. Tinjau preview deployment
  12. Merge kalau lolos
  13. /clear
```

Satu tugas koheren per sesi. Jangan menumpuk.

---

## 17. Sistem Log Pekerjaan

### 17.1 Tujuan

Anda meminta Claude Code mencatat pekerjaannya. Log ini berfungsi tiga hal sekaligus:

1. **Jejak audit** — apa yang berubah, kapan, dan kenapa
2. **Transfer konteks** — sesi besok bisa membaca log kemarin tanpa Anda menjelaskan ulang
3. **Manajemen risiko** — masalah dan asumsi tercatat, bukan menguap bersama konteks yang di-clear

### 17.2 Skill Log Pekerjaan

**`.claude/skills/worklog/SKILL.md`**

```markdown
---
name: worklog
description: Menulis log pekerjaan setelah setiap tugas selesai
---

# Aturan Log Pekerjaan

Setelah SETIAP tugas selesai, tambahkan entri ke docs/worklog/YYYY-MM-DD.md
(buat file baru jika belum ada, memakai tanggal hari ini).

Gunakan format persis di bawah ini. Ringkas — maksimal 25 baris per entri.

## Format

### [HH:MM] <Judul tugas>

**Tujuan:** Satu kalimat tentang apa yang ingin dicapai.

**Yang dikerjakan:**
- Poin-poin perubahan nyata

**File berubah:**
- `path/ke/file.ts` — apa yang berubah

**Keputusan teknis:**
- Keputusan yang diambil dan alasannya. Tulis "tidak ada" jika memang tidak ada.

**Verifikasi:**
- Perintah yang dijalankan dan hasilnya (lulus/gagal)

**Masalah / catatan:**
- Hal yang tidak berjalan mulus, atau asumsi yang diambil
- Utang teknis yang sengaja ditinggalkan

**Berikutnya:**
- Langkah lanjutan yang logis, jika ada

**Commit:** `<hash pendek>` — `<pesan commit>`

---

## Aturan tambahan

- JANGAN PERNAH menulis nilai rahasia, kredensial, atau data pribadi nyata di log.
- Jika tugas gagal atau ditinggalkan, tetap tulis entrinya dengan
  bagian "Masalah" yang menjelaskan sebabnya. Kegagalan lebih berharga
  dicatat daripada keberhasilan.
- Jika sebuah keputusan mengubah arsitektur, catat juga di docs/DECISIONS.md
  dan rujuk dari sini.
- Log ditulis dalam Bahasa Indonesia.
```

### 17.3 Contoh Entri

```markdown
# Log Pekerjaan — 11 Agustus 2026

### [09:15] Implementasi endpoint POST /api/leads

**Tujuan:** Membuat form kontak menyimpan lead ke D1 sebelum
mengarahkan ke WhatsApp.

**Yang dikerjakan:**
- Endpoint dengan verifikasi Turnstile, rate limit, dan validasi Zod
- Normalisasi nomor telepon ke format +62
- Generator ref_code dengan format LEAD-YYYYMMDD-XXXX
- Notifikasi Resend yang tidak memblokir respons

**File berubah:**
- `src/pages/api/leads.ts` — endpoint baru
- `src/lib/validation/lead.ts` — skema Zod
- `src/lib/utils/phone.ts` — normalisasi nomor
- `db/schema.ts` — tambah kolom ref_code + index

**Keputusan teknis:**
- Rate limit memakai KV, bukan D1. Alasan: KV lebih cepat untuk
  operasi baca-tulis sering dan datanya tidak perlu awet.
- Kegagalan Resend di-log tapi tidak mengembalikan error ke pengguna.
  Alasan: kehilangan email notifikasi jauh lebih murah daripada
  kehilangan lead.

**Verifikasi:**
- `pnpm test` → 14 lulus, 0 gagal
- `pnpm typecheck` → bersih
- `pnpm build` → sukses
- Subagent security-reviewer → 1 temuan, sudah diperbaiki
  (IP sebelumnya disimpan mentah, kini di-hash)

**Masalah / catatan:**
- Normalisasi nomor belum menangani format +62 dengan spasi berlebih.
  Ditambahkan ke daftar tunggu.
- Kunci rate limit memakai IP; pengguna di balik NAT kantor yang sama
  bisa saling memblokir. Diterima untuk sekarang, tinjau ulang
  kalau ada laporan.

**Berikutnya:**
- Bangun komponen island LeadForm yang memanggil endpoint ini

**Commit:** `a3f8b21` — `feat(api): add lead capture endpoint with turnstile`
```

### 17.4 Penegakan Otomatis

**`scripts/check-worklog.mjs`** dijalankan oleh hook `Stop`:

```
1. Cek apakah ada perubahan file dalam sesi ini (git diff)
2. Jika ya, cek apakah docs/worklog/<hari-ini>.md ada dan
   dimodifikasi dalam 30 menit terakhir
3. Jika belum, blokir akhir giliran dan cetak:
   "Log pekerjaan belum ditulis. Tambahkan entri ke docs/worklog/<tanggal>.md
    mengikuti .claude/skills/worklog/SKILL.md"
```

Instruksi di `CLAUDE.md` sifatnya anjuran dan bisa terlewat. Hook bersifat deterministik dan menjamin log benar-benar ditulis.

### 17.5 Rekap Mingguan

Setiap Jumat, jalankan satu prompt:

```
Baca semua file docs/worklog/ dari 7 hari terakhir.
Tulis ringkasan ke docs/worklog/weekly/YYYY-Www.md berisi:
- Yang selesai
- Keputusan teknis yang diambil
- Utang teknis yang menumpuk
- Hambatan yang berulang
- Rekomendasi fokus minggu depan
```

---

## 18. Roadmap Eksekusi per Fase

Waktu fleksibel (D-10). Estimasi mengasumsikan kerja paruh waktu; sesuaikan dengan ritme Anda.

### Fase 0 — Fondasi Bisnis & Brand (± 2 minggu)

Ini fase non-teknis, dan **jangan dilewati.**

```
[ ] Tetapkan nama perusahaan
[ ] Cek ketersediaan domain (.co.id lebih kuat untuk pasar Indonesia)
[ ] Beli domain, arahkan nameserver ke Cloudflare
[ ] Desain logo (primer, sekunder, ikon, versi monokrom)
[ ] Tetapkan palet warna dan pasangan font
[ ] Tulis positioning statement dan value proposition
[ ] Kumpulkan semua fakta bisnis nyata:
    [ ] Nomor lisensi Kemnaker (jika sudah ada)
    [ ] Status akreditasi LSP/BNSP
    [ ] Daftar instruktur + kredensial + nomor sertifikat
    [ ] Daftar peralatan dan area latihan
    [ ] Struktur harga sebenarnya
    [ ] Kebijakan pembatalan dan refund sebenarnya
[ ] SESI FOTO PROFESIONAL (lihat Bab 11.4)
[ ] Validasi keyword → isi docs/KEYWORD-MAP.md
[ ] Analisis 5 kompetitor teratas: struktur, konten, celah
[ ] Buat brief untuk 15 artikel pertama
```

**Gerbang keluar:** domain aktif, aset brand siap, foto tersedia, peta keyword tervalidasi.

### Fase 1 — Fondasi Teknis (± 1 minggu)

```
[ ] Buat repo GitHub, atur branch protection di main
[ ] Inisialisasi Astro 6 + TS strict + Tailwind v4 + adapter Cloudflare
[ ] Buat CLAUDE.md, .claude/settings.json, skill, subagent
[ ] Salin PLAN.md ini ke docs/PLAN.md
[ ] Siapkan sistem log pekerjaan + hook penegak
[ ] Definisikan token desain di theme.css
[ ] Bangun komponen UI primitif (Button, Card, Input, Badge)
[ ] Bangun BaseLayout + Header + Footer + pengalih bahasa
[ ] Siapkan i18n
[ ] Buat skema D1 + migration awal + data seed
[ ] Siapkan Vitest, Playwright, ESLint, Prettier
[ ] Siapkan GitHub Actions: lint, typecheck, test, build
[ ] Siapkan deploy Cloudflare + preview URL untuk PR
[ ] Verifikasi halaman "hello world" tayang di domain
```

**Gerbang keluar:** push ke main men-deploy otomatis; semua pemeriksaan hijau.

### Fase 2 — Situs Publik (± 4–5 minggu)

```
[ ] Komponen SeoHead + semua generator schema
[ ] Sistem sitemap (per jenis, per bahasa, terindeks)
[ ] robots.txt dengan izin crawler AI (Bab 8.3)
[ ] llms.txt (prioritas rendah, tapi buat sekalian)
[ ] Beranda ID + EN
[ ] Halaman pilar Pelatihan + halaman kursus BNSP/TKPK/TKBT
[ ] Halaman rencana IRATA/SPRAT (patuhi D-05 secara ketat)
[ ] Halaman jadwal dengan filter
[ ] Halaman pilar Layanan + 3 halaman layanan
[ ] Halaman Fasilitas
[ ] Halaman Instruktur + profil individual
[ ] Galeri
[ ] Daftar artikel + kategori + template artikel
[ ] Tentang Kami
[ ] Kontak + peta + form
[ ] FAQ dengan schema
[ ] SEMUA halaman legal (Bab 15)
[ ] Halaman 404
[ ] Endpoint /api/leads (Bab 6.3)
[ ] Komponen island LeadForm + Turnstile
[ ] Tombol WA melayang
[ ] Banner consent cookie + loader skrip berbasis consent
[ ] Penangkap UTM
[ ] Test E2E Playwright untuk alur lead
[ ] Audit Lighthouse pada semua template halaman
```

**Gerbang keluar:** semua anggaran performa Bab 12.4 terpenuhi; alur lead bekerja end-to-end.

### Fase 3 — Dashboard (± 4 minggu)

```
[ ] Cloudflare Access untuk /admin/*
[ ] Middleware peran + pemeriksaan di setiap handler API
[ ] AdminLayout + navigasi + dasbor ringkasan
[ ] Editor artikel Tiptap
[ ] Panel SEO langsung dengan semua pemeriksaan Bab 10.2A
[ ] Editor terjemahan berdampingan
[ ] Riwayat revisi dengan diff dan pemulihan
[ ] Gerbang publish (Bab 9.5)
[ ] Cache purge otomatis + regenerasi sitemap saat publish
[ ] Modul leads: tabel, kanban, detail, aktivitas, tombol WA, ekspor
[ ] Modul jadwal batch + kalender
[ ] Media library dengan alt text wajib
[ ] Modul pengaturan
[ ] Audit log
[ ] Cron: backup, sitemap, ringkasan lead harian
[ ] Test E2E untuk alur kerja dashboard
[ ] Tulis panduan pengguna untuk staf (docs/PANDUAN-DASHBOARD.md)
[ ] Sesi pelatihan staf
```

**Gerbang keluar:** staf non-teknis berhasil menerbitkan artikel tanpa bantuan Anda.

### Fase 4 — Konten & Peluncuran (± 3–4 minggu)

```
[ ] Tulis 15 artikel awal mengikuti standar Bab 9
[ ] Tinjauan ahli untuk semua konten regulasi/K3
[ ] Terjemahkan halaman inti + artikel klaster C ke EN
[ ] Isi data instruktur, testimoni, FAQ, galeri
[ ] Buat jadwal batch 6 bulan ke depan
[ ] Audit internal linking (setiap artikel ≥ 3 tautan keluar)
[ ] Jalankan seluruh checklist Bab 14.3
[ ] Uji lintas browser dan lintas perangkat
[ ] Audit aksesibilitas dengan pembaca layar
[ ] Tinjauan keamanan menyeluruh
[ ] Uji prosedur rollback
[ ] LUNCURKAN
[ ] Pantau ketat 72 jam pertama
```

### Fase 5 — Pertumbuhan (berkelanjutan)

```
Bulanan:
[ ] 4-8 artikel baru sesuai peta keyword
[ ] Tinjau Search Console: kueri baru, halaman turun, masalah teknis
[ ] Tinjau log 404, buat redirect jika perlu
[ ] Perbarui jadwal batch
[ ] Kumpulkan testimoni baru

Kuartalan:
[ ] Refresh konten: perbarui artikel yang menurun
[ ] Gabungkan atau hapus artikel berkinerja buruk
[ ] Audit backlink dan kampanye outreach
[ ] Analisis rasio konversi lead per sumber
[ ] Audit performa dan keamanan

Setelah ada bukti trafik:
[ ] Halaman kota — HANYA jika lolos 5 syarat Bab 9.6
[ ] Kalkulator/alat interaktif (magnet backlink)
[ ] Studi kasus dari proyek nyata
[ ] Halaman komparatif menargetkan keyword "vs"
[ ] Tinjau ulang cakupan EN berdasarkan data nyata
```

---

## 19. Definition of Done & QA Checklist

Sebuah tugas dianggap selesai **hanya jika** semua kotak di bawah tercentang.

### Untuk Setiap Perubahan Kode
```
[ ] pnpm typecheck lolos
[ ] pnpm lint lolos
[ ] pnpm test lolos
[ ] pnpm build sukses
[ ] Test baru ditulis untuk logika baru
[ ] Tidak ada rahasia dalam diff
[ ] [A-12] Setiap klaim numerik yang ditambahkan punya dokumen pendukung
    yang bisa ditunjukkan dalam 5 menit. Kalau tidak ada, angka tidak tayang.
[ ] [A-09] pnpm check:content lolos (D-05, alt text, nama file terlarang)
[ ] Log pekerjaan ditulis
[ ] Commit mengikuti Conventional Commits
[ ] Preview deployment ditinjau secara visual
```

### Untuk Setiap Halaman Publik Baru
```
[ ] Title unik 50-60 karakter, description 140-160
[ ] Canonical benar
[ ] Hreflang lengkap (ID, EN, x-default)
[ ] Tepat satu h1, hierarki heading rapi
[ ] JSON-LD sesuai dan lolos Rich Results Test
[ ] Semua gambar punya alt, width, height
[ ] Breadcrumb ada
[ ] Internal link keluar minimal 3
[ ] Diuji di lebar 320, 375, 768, 1024, 1440 px
[ ] Lighthouse: Performance > 95, A11y 100, SEO 100
[ ] Dapat dinavigasi keyboard dengan fokus terlihat
[ ] Ditambahkan ke sitemap
[ ] Versi EN ada (atau tercatat sengaja tidak ada)
```

### Untuk Setiap Artikel
```
[ ] Lolos seluruh ambang Bab 9.3
[ ] Minimal 3 elemen nilai unik Bab 9.2 hadir dan terdokumentasi
[ ] Blok TL;DR ada
[ ] Setiap subjudul mengikuti pola answer-first
[ ] Minimal 3 butir FAQ dengan schema
[ ] Klaim faktual bersumber dan tertaut
[ ] Ditinjau ahli jika menyangkut regulasi/K3
[ ] Focus keyword tidak berbenturan dengan artikel lain
[ ] Penulis dan kredensial tercantum
[ ] Patuh D-05 (IRATA/SPRAT)
[ ] Subagent content-quality-checker melaporkan LULUS
```

---

## 20. Risiko & Keputusan yang Masih Terbuka

### 20.1 Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| **Tidak ada aset visual** | Tinggi | Sesi foto di Fase 0 adalah prasyarat, bukan opsional |
| **Klaim IRATA/SPRAT terlanjur muncul** | Tinggi | D-05 + hook + test otomatis + tinjauan manual pra-launch |
| **Konten AI mentah memicu penalti** | Tinggi | Standar Bab 9 + gerbang publish + tinjauan ahli |
| **Beban pemeliharaan bilingual** | Sedang | Cakupan EN dibatasi (Bab 8.4); jangan terjemahkan semua |
| **Konteks Claude Code membengkak** | Sedang | Disiplin Bab 16; satu tugas per sesi |
| **Konten regulasi menjadi usang** | Sedang | Tinjauan kuartalan; kolom "terakhir diverifikasi" per artikel regulasi |
| **Staf menerbitkan konten buruk** | Sedang | Gerbang publish otomatis + alur status Review |
| **Kehilangan data lead** | Tinggi | Backup harian ke R2 + soft delete + audit log |
| **Kanibalisasi keyword** | Rendah | Peta keyword sebagai sumber kebenaran + cek otomatis di editor |

### 20.2 Keputusan yang Perlu Anda Ambil

| # | Keputusan | Catatan | Batas waktu |
|---|---|---|---|
| O-01 | ✅ **TUTUP** `[A-01]` — **Rope Access Center (RAC)**. Domain sudah dibeli; nilai finalnya diisi di `docs/FAKTA-BISNIS.md` | — | selesai |
| O-02 | ✅ **TUTUP** `[A-02]` — aksen **merah `#E30613`**. Bukan safety orange, bukan hi-vis yellow | — | selesai |
| O-03 | Alamat kantor & area latihan | Diperlukan untuk `LocalBusiness` dan Google Business Profile | Fase 0 |
| O-04 | Nomor WhatsApp per divisi | Minimal dua: training dan jasa | Fase 1 |
| O-05 | Analitik: GA4 saja, Cloudflare saja, atau keduanya | Cloudflare cukup untuk trafik; GA4 perlu untuk analisis konversi | Fase 2 |
| O-06 | Tampilkan harga di situs atau tidak | Menampilkan harga menaikkan kualitas lead tapi menurunkan jumlahnya | Fase 2 |
| O-07 | Alamat email untuk permintaan hak subjek data (UU PDP) | Wajib ada di Kebijakan Privasi | Fase 2 |
| O-08 | Siapa peninjau ahli untuk konten K3 | Harus orang bersertifikat dengan nama yang bisa dicantumkan | Fase 4 |
| O-09 | Anggaran alat SEO (Ahrefs/Semrush) | Diperlukan untuk validasi keyword yang serius | Fase 0 |

---

## Lampiran A — Perintah Cepat

```bash
# Pengembangan
pnpm dev                      # Server pengembangan
pnpm build                    # Build produksi
pnpm preview                  # Pratinjau build lokal

# Kualitas
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm lighthouse
pnpm check:content

# Database
pnpm db:generate              # Generate migration dari perubahan schema.ts
pnpm db:migrate:local         # Terapkan ke D1 lokal
pnpm db:studio                # GUI database
pnpm db:seed                  # Isi data contoh

# Deploy (JALANKAN MANUAL — bukan oleh agen)
wrangler deploy
wrangler d1 migrations apply DB --remote
```

## Lampiran B — Referensi

**Teknis**
- Astro — https://docs.astro.build
- Cloudflare Workers — https://developers.cloudflare.com/workers
- Cloudflare D1 — https://developers.cloudflare.com/d1
- Drizzle ORM — https://orm.drizzle.team
- Tailwind CSS — https://tailwindcss.com/docs
- Zod — https://zod.dev

**Claude Code**
- Praktik terbaik — https://code.claude.com/docs/en/best-practices
- CLAUDE.md — https://code.claude.com/docs/en/memory
- Subagent — https://code.claude.com/docs/en/sub-agents
- Hooks — https://code.claude.com/docs/en/hooks-guide
- Skills — https://code.claude.com/docs/en/skills

**SEO**
- Google Search Central — https://developers.google.com/search/docs
- Schema.org Course — https://schema.org/Course
- Rich Results Test — https://search.google.com/test/rich-results
- Schema Validator — https://validator.schema.org

**Regulasi**
- Permenaker No. 9 Tahun 2016 — sumber resmi JDIH Kemnaker
- UU No. 27 Tahun 2022 (PDP) — sumber resmi JDIH
- BNSP — https://bnsp.go.id

---

## Riwayat Revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | 11 Agustus 2026 | Draft awal setelah sesi interview |
| 1.1 | 12 Agustus 2026 | Amandemen A-01…A-12 dari DESIGN-SYSTEM.md diintegrasikan (aksen merah, token dari DESIGN-SYSTEM Bab 3, Archivo Expanded, submenu sertifikasi, aturan kontras `accent-400`, positioning kepatuhan Indonesia, aturan klaim numerik). Enam koreksi teknis ditambahkan sebagai ADR-001…006: versi stack aktual, arsitektur cache KV menggantikan purge-by-tag Cache API, rate limit dua lapis, backup lewat D1 REST API, gerbang Lighthouse median-of-3, dan penyempitan deny rule. O-01 dan O-02 ditutup. |
