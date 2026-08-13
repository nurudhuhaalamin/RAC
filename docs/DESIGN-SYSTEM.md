# Design System & Implementasi Brand
## Rope Access Center (RAC)

> **Simpan sebagai:** `docs/DESIGN-SYSTEM.md`
> **Pendamping:** `docs/PLAN.md` · `docs/PLAYBOOK.md`
> **Versi:** 1.0 — 11 Agustus 2026
> **Status:** memuat 5 temuan kritis yang harus diselesaikan sebelum Fase 1

---

## 1. Aset yang Diterima

| Aset | Kondisi | Tindakan |
|---|---|---|
| Logo primer, latar terang | PNG raster | Perlu redraw vektor (SVG) |
| Logo primer, latar gelap | PNG raster | Perlu redraw vektor (SVG) |
| Ikon/favicon, versi terang | PNG raster | Perlu SVG + set favicon lengkap |
| Ikon/favicon, versi gelap | PNG raster | Perlu SVG + set favicon lengkap |
| Brand guidelines sheet | PNG, lengkap | Referensi utama, sudah memadai |
| Mockup desktop beranda | PNG | Acuan visual, **butuh koreksi** (Bab 2) |
| Mockup mobile (3 layar) | PNG | Acuan visual, **butuh koreksi** (Bab 2) |

**Nama brand terkonfirmasi:** Rope Access Center — RAC
**Tagline:** Training, Certification, & Corporate Services
**Headline hero:** "We Train. We Certify. We Deliver." / "Safe Access. Higher Standard."

Ini mengisi O-01 dan O-02 di PLAN.md Bab 20.2. Domain masih terbuka.

---

## 2. Temuan Kritis

Lima hal berikut harus diputuskan sebelum T-104 dijalankan. Nomor tiga pertama berisiko hukum atau reputasi, bukan sekadar estetika.

### 2.1 🔴 KRITIS — Mockup melanggar D-05

Seksi **"CERTIFIED & RECOGNIZED — We Work With Global Standards"** di mockup desktop dan mobile menampilkan logo:

`IRATA International` · `SPRAT` · `PETZL technical partner` · `IRSM Approved Training` · `ISO 9001:2015`

Ini melanggar D-05 di PLAN.md Bab 3 secara langsung, dan melanggarnya di **tempat paling terlihat di beranda**.

Masalahnya berlapis:

1. **IRATA dan SPRAT** — D-05 melarang penampilan logo dalam bentuk apa pun. Menampilkan logo asosiasi tanpa keanggotaan resmi adalah misrepresentasi. IRATA aktif menindak penggunaan mereknya oleh non-member.
2. **Petzl "technical partner"** — status kemitraan resmi yang hanya boleh diklaim dengan perjanjian tertulis dari Petzl.
3. **IRSM Approved Training** — sama, butuh akreditasi resmi.
4. **ISO 9001:2015** — hanya boleh ditampilkan dengan sertifikat aktif dari badan sertifikasi terakreditasi, dan biasanya wajib menyertakan nomor sertifikat serta nama badan penerbit.
5. **Seksi ini juga tidak menampilkan BNSP dan Kemnaker** — dua badan yang justru benar-benar Anda tawarkan (D-04), dan yang paling dicari pasar Indonesia.

**✅ TERPUTUSKAN (D-12): tidak ada satu pun hubungan resmi tertulis.**

Konsekuensinya mutlak: **kelima logo dihapus total.** Tidak ada versi "grayscale", tidak ada "sedang proses", tidak ada disclaimer kecil di bawahnya. Logo pihak lain yang ditampilkan tanpa perjanjian adalah misrepresentasi, dan disclaimer tidak menghapusnya.

Seksi diganti menjadi **"Sertifikasi & Kepatuhan"** — spesifikasi lengkap di Bab 6.6.

Ini juga berarti **posisi "We Work With Global Standards" gugur seluruhnya.** Positioning situs harus dibangun ulang di atas kekuatan yang nyata: BNSP dan Kemnaker. Untuk pasar Indonesia — HSE Manager, kontraktor migas, facility manager — sertifikat Kemnaker justru yang wajib secara hukum, dan itu argumen jual yang lebih kuat daripada deretan logo asing yang tidak bisa diverifikasi.

### 2.2 🔴 KRITIS — Angka statistik belum terverifikasi

Mockup menampilkan: **1.200+ Trained Professionals · 98% Certification Success Rate · 250+ Projects Completed · 10+ Years of Experience**

Pada sesi interview Anda menyatakan belum ada aset apa pun (D-07), yang mengindikasikan perusahaan baru atau baru dibranding ulang. Kalau angka-angka ini placeholder desainer dan bukan data nyata:

- Ini iklan yang menyesatkan menurut UU Perlindungan Konsumen
- Ini racun bagi E-E-A-T — Google menilai konten YMYL berdasarkan akurasi yang bisa diverifikasi
- Ini risiko reputasi terbesar di industri keselamatan: klien korporat akan memverifikasi, dan kalau tidak cocok, kepercayaan hilang permanen

**⚠️ TERPUTUSKAN SEBAGIAN (D-13): sebagian nyata, sebagian karangan.**

Ini kondisi paling berisiko dari ketiga kemungkinan. Angka yang seluruhnya karangan mudah dibuang; angka campuran membuat **seluruh empat klaim jadi tidak bisa dipercaya**, karena dari luar tidak ada cara membedakan mana yang mana. Kalau satu terbukti salah saat diaudit klien korporat, tiga sisanya ikut runtuh — termasuk yang benar.

**Aturan yang dikunci:** sebuah angka boleh tayang **hanya jika** Anda bisa menunjukkan dokumen pendukungnya dalam 5 menit bila diminta klien. Kalau tidak, angka itu tidak tayang. Tidak ada kategori "kira-kira segitu".

**Lembar verifikasi — isi sebelum T-206:**

| Klaim di mockup | Status | Bukti pendukung | Boleh tayang? |
|---|---|---|---|
| 1.200+ peserta terlatih | ☐ nyata ☐ karangan | daftar hadir / sertifikat terbit | |
| 98% tingkat kelulusan | ☐ nyata ☐ karangan | rekap hasil uji kompetensi | |
| 250+ proyek selesai | ☐ nyata ☐ karangan | daftar kontrak / berita acara | |
| 10+ tahun pengalaman | ☐ nyata ☐ karangan | akta pendirian / rekam jejak personel | |

Catatan soal "10+ tahun": kalau yang dimaksud adalah pengalaman **personel**, bukan usia perusahaan, tulis apa adanya — "Instruktur dengan pengalaman lapangan 10+ tahun". Itu benar dan tetap kuat. Yang bermasalah hanya kalau perusahaan baru berdiri dan diklaim berumur 10 tahun.

**Pengganti untuk slot yang gugur** — pilih dari daftar ini, semuanya bisa diverifikasi tanpa rekam jejak panjang:

`Instruktur Bersertifikat Kemnaker` · `Rasio Instruktur 1:6` · `Area Latihan Ketinggian 12 m` · `Kurikulum Sesuai Permenaker 9/2016` · `Peralatan Bersertifikat CE/EN` · `Inspeksi APD Berkala`

Fakta spesifik yang benar lebih meyakinkan HSE Manager daripada angka bulat yang mencurigakan. Bilah statistik boleh berisi 4 item campuran: yang lolos verifikasi tetap dipakai, sisanya diisi dari daftar pengganti.

### 2.3 🟠 PENTING — Navigasi mockup melemahkan strategi SEO

Menu mockup: `HOME · ABOUT US · TRAINING · CERTIFICATION · SERVICES · CONTACT`

Dua halaman terpenting untuk strategi di PLAN.md Bab 8 **tidak ada di menu utama**:

| Hilang | Kenapa penting |
|---|---|
| **Jadwal** | Sumber rich result `CourseInstance` — keunggulan kompetitif terbesar di Bab 8.2. Di mockup hanya ada di footer sebagai "Training Schedule". |
| **Artikel** | Seluruh Klaster A informasional dan Klaster C (regulasi) bermuara ke sini. Di mockup hanya ada di footer sebagai "News & Articles". |

Sementara **"Certification"** sebagai item menu terpisah menduplikasi "Training" — keduanya melayani intent yang sama dan akan saling mengkanibal keyword.

**Rekomendasi menu (tetap 6 item):**

```
PELATIHAN ▾   JADWAL   LAYANAN ▾   ARTIKEL   TENTANG   KONTAK   [Konsultasi WhatsApp]
```

Sertifikasi menjadi submenu di bawah Pelatihan (BNSP · TKPK · TKBT · Rencana IRATA/SPRAT), bukan item setara.

### 2.4 🟠 PENTING — Lisensi font

Brand guide menetapkan **Square 721 Extended Bold** (Bitstream) sebagai font headline. Ini font komersial; lisensi desktop **tidak** mencakup penggunaan web. Lisensi webfont harus dibeli terpisah dan biasanya berbasis pageview.

Font sekunder **Montserrat** aman — lisensi SIL Open Font, gratis untuk web, wajib di-self-host sesuai Bab 12.3.

**✅ TERPUTUSKAN (D-14): pakai Archivo Expanded (SIL OFL, gratis).** Square 721 tidak dibeli. Detail penyetelan di Bab 4.2.

Konsekuensi: **logo tetap memakai bentuk huruf Square 721** karena sudah menjadi vektor — itu tidak melanggar lisensi, karena logo adalah karya turunan statis, bukan penggunaan font. Yang berubah hanya heading di halaman. Perlu dicek visual berdampingan agar wordmark dan H1 tidak terlihat bertabrakan.

### 2.5 🟡 PERLU KOREKSI — Kontras merah di atas navy

`#E30613` di atas `#0D1B2A` menghasilkan rasio kontras **3,51:1**.

| Penggunaan | Rasio | WCAG AA |
|---|---|---|
| Merah di atas navy, teks besar (≥24px, atau ≥19px bold) | 3,51:1 | ✅ Lolos |
| Merah di atas navy, teks normal | 3,51:1 | ❌ **Gagal** |
| Merah di atas putih, teks normal | 4,87:1 | ✅ Lolos |
| Putih di atas navy | 17,1:1 | ✅ Sangat baik |
| Putih di atas merah (tombol) | 4,87:1 | ✅ Lolos |

Di mockup, teks eyebrow kecil **"SAFE ACCESS. HIGHER STANDARD."** dan **"READY TO TAKE YOUR TEAM TO THE NEXT LEVEL?"** memakai merah kecil di atas navy — keduanya gagal AA.

**Perbaikan:** untuk teks merah berukuran kecil di atas latar gelap, gunakan `accent-400` (`#F45E5E`) yang menghasilkan **5,58:1**. Secara visual masih terbaca merah, tapi lolos AA. Aturan ini dikunci sebagai token di Bab 3.

Headline besar "WE TRAIN. WE CERTIFY. WE DELIVER." boleh tetap `#E30613` karena masuk kategori teks besar.

---

## 3. Token Warna

Untuk `src/styles/theme.css`, format Tailwind CSS v4.

```css
@theme {
  /* ── BRAND: Navy ───────────────────────────── */
  --color-brand-50:  #F2F5F8;
  --color-brand-100: #E2E8EF;
  --color-brand-200: #C5D0DE;
  --color-brand-300: #9AACC2;
  --color-brand-400: #6B82A0;
  --color-brand-500: #47607F;
  --color-brand-600: #2F4763;
  --color-brand-700: #1E3350;
  --color-brand-800: #14243B;
  --color-brand-900: #0D1B2A;  /* NAVY — warna brand utama */
  --color-brand-950: #070E17;

  /* ── ACCENT: Red ───────────────────────────── */
  --color-accent-50:  #FEF2F2;
  --color-accent-100: #FEE2E2;
  --color-accent-200: #FDC9C9;
  --color-accent-300: #FA9C9C;
  --color-accent-400: #F45E5E;  /* teks merah kecil di latar GELAP */
  --color-accent-500: #E30613;  /* RED — warna brand utama */
  --color-accent-600: #C4050F;  /* hover tombol */
  --color-accent-700: #A2040D;  /* active tombol */
  --color-accent-800: #7E030A;
  --color-accent-900: #5C0207;

  /* ── NEUTRAL (dari brand guide) ────────────── */
  --color-neutral-0:   #FFFFFF;
  --color-neutral-50:  #F2F4F7;
  --color-neutral-200: #D1D5DB;
  --color-neutral-400: #9CA3AF;
  --color-neutral-600: #6B7177;
  --color-neutral-700: #4B4F56;
  --color-neutral-900: #222529;  /* CHARCOAL */

  /* ── SEMANTIK ──────────────────────────────── */
  --color-success: #16A34A;
  --color-warning: #D97706;
  --color-danger:  #DC2626;   /* JANGAN pakai accent-500 untuk error —
                                  akan tertukar dengan CTA */
  --color-info:    #2563EB;

  /* ── PERMUKAAN ─────────────────────────────── */
  --color-surface-base:     #FFFFFF;
  --color-surface-subtle:   #F2F4F7;
  --color-surface-inverse:  #0D1B2A;
  --color-surface-inverse-2:#14243B;  /* kartu di atas latar navy */
  --color-border-default:   #D1D5DB;
  --color-border-inverse:   #1E3350;
}
```

### 3.1 Aturan Pemakaian Warna

| Konteks | Token |
|---|---|
| Latar halaman | `surface-base` |
| Latar seksi selang-seling | `surface-subtle` |
| Latar seksi gelap (hero, CTA band, footer) | `brand-900` |
| Kartu di atas latar gelap | `brand-800` |
| Teks utama di latar terang | `brand-900` |
| Teks sekunder di latar terang | `neutral-700` |
| Teks utama di latar gelap | `neutral-0` |
| Teks sekunder di latar gelap | `brand-200` |
| Eyebrow/label kecil di latar terang | `accent-500` |
| Eyebrow/label kecil di latar gelap | `accent-400` ⚠️ |
| Headline besar beraksen | `accent-500` (kedua latar) |
| Tombol primer | latar `accent-500`, teks putih, hover `accent-600` |
| Tombol sekunder di latar gelap | garis `neutral-0`, teks putih |
| Tombol sekunder di latar terang | garis `brand-900`, teks `brand-900` |
| Garis bawah judul seksi | `accent-500`, tinggi 3px, lebar 48px |
| Ikon fitur | `accent-500` |
| Cincin fokus | `accent-500`, offset 2px, tebal 2px |

**Larangan:**
- Merah untuk pesan error (pakai `danger`). Dua merah berbeda makna di satu halaman membingungkan.
- Merah sebagai latar blok besar. Merah adalah aksen, bukan latar.
- Gradien apa pun pada logo (dilarang eksplisit di brand guide).

---

## 4. Tipografi

### 4.1 Skala

```css
@theme {
  --font-display: "Archivo Expanded", "Archivo", system-ui, sans-serif;
  --font-body:    "Montserrat", system-ui, sans-serif;
  --font-reading: "Inter", system-ui, sans-serif;  /* isi artikel — lihat 4.3 */

  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1.0625rem; /* 17px — minimum body mobile per PLAN Bab 12 */
  --text-lg:   1.25rem;
  --text-xl:   1.5rem;
  --text-2xl:  1.875rem;
  --text-3xl:  2.25rem;
  --text-4xl:  3rem;
  --text-5xl:  3.75rem;
  --text-6xl:  4.5rem;
}
```

| Elemen | Font | Ukuran | Style |
|---|---|---|---|
| Hero headline | display | 4xl → 6xl | uppercase, tracking-tight, leading-none |
| H1 halaman | display | 3xl → 4xl | uppercase |
| H2 seksi | display | 2xl → 3xl | uppercase, garis aksen di bawah |
| H3 | display | xl | uppercase |
| Eyebrow / label | body | xs | uppercase, tracking-widest (0.15em), bold |
| Body UI | body | base | leading-relaxed |
| Isi artikel | reading | base–lg | leading-1.7, maks 68 karakter |
| Tombol | body | sm | uppercase, tracking-wide, semibold |
| Angka statistik | display | 4xl | tabular-nums |
| Caption / meta | body | sm | `neutral-600` |

### 4.2 Substitusi Square 721 — ✅ ARCHIVO EXPANDED (final)

| Kandidat | Kecocokan | Catatan |
|---|---|---|
| **Archivo (Expanded)** ★ rekomendasi | Sangat tinggi | Variable font dengan sumbu lebar. Grotesk persegi yang bisa disetel hingga sangat lebar. Gratis, SIL OFL, tersedia di Google Fonts. Bisa dicocokkan sangat dekat dengan Square 721 Extended Bold. |
| Saira | Tinggi | Punya varian lebar, karakter teknis |
| Chakra Petch | Sedang | Lebih futuristik, kurang korporat |
| Rajdhani | Sedang | Terlalu condensed, arah berlawanan |
| Orbitron / Michroma | Rendah | Terlalu sci-fi untuk industri keselamatan |

**Penyetelan Archivo yang dikunci:**

```css
.font-display {
  font-family: "Archivo Expanded", "Archivo", system-ui, sans-serif;
  font-variation-settings: "wdth" 118;  /* mendekati Extended */
  font-weight: 700;
  letter-spacing: -0.01em;
  text-transform: uppercase;
}
```

Gunakan file variable (`archivo-var.woff2`) supaya sumbu lebar bisa disetel tanpa memuat banyak file. Nilai `wdth` 118 adalah titik awal — kalibrasi visual berdampingan dengan wordmark logo, lalu kunci angkanya sebagai token dan jangan diubah per komponen.

### 4.3 Catatan Jujur tentang Montserrat

Montserrat sangat baik untuk UI, judul pendek, dan label. Untuk **artikel 1.500+ kata**, Montserrat melelahkan dibaca: lebar huruf yang seragam dan aperture tertutup memperlambat pembacaan panjang.

Rekomendasi: pakai Montserrat untuk seluruh antarmuka, dan **Inter khusus untuk isi artikel**. Pembaca tidak akan menyadari perbedaannya; yang mereka rasakan hanya artikel lebih enak dibaca. Ini penyimpangan kecil dari brand guide yang sepadan.

Kalau Anda ingin konsistensi mutlak, Montserrat tetap bisa dipakai untuk artikel — naikkan `line-height` ke 1,8 dan turunkan lebar baca ke 62 karakter.

**Keputusan:** Bab 10, D-15.

### 4.4 Self-Hosting Font

```
public/fonts/
  montserrat-400.woff2   montserrat-500.woff2
  montserrat-600.woff2   montserrat-700.woff2
  inter-400.woff2        inter-600.woff2
  archivo-var.woff2      (atau file Square 721 berlisensi)
```

- Subset: Latin + Latin Extended
- `font-display: swap`
- Preload hanya font display bobot hero dan Montserrat 400
- Hapus semua referensi Google Fonts CDN (PLAN Bab 12.3)

---

## 5. Logo & Aset

### 5.1 Yang Harus Diproduksi

File yang ada masih raster hasil generasi, dengan artefak pada figur pemanjat dan tepi huruf. Semua perlu **digambar ulang sebagai vektor** sebelum dipakai di web.

```
public/brand/
  logo-primary-light.svg      Wordmark penuh + tagline, untuk latar terang
  logo-primary-dark.svg       Wordmark penuh + tagline, untuk latar gelap
  logo-horizontal-light.svg   Tanpa tagline, untuk header
  logo-horizontal-dark.svg    Tanpa tagline, untuk header gelap
  logo-mono-white.svg         Satu warna putih (untuk foto/overlay)
  logo-mono-black.svg         Satu warna hitam (untuk faks/dokumen)
  icon.svg                    Ikon RAC saja
```

### 5.2 Set Favicon & PWA

```
public/
  favicon.ico              16, 32, 48 px multi-resolusi
  favicon.svg              SVG adaptif, dengan prefers-color-scheme
  apple-touch-icon.png     180×180
  icon-192.png             192×192
  icon-512.png             512×512
  icon-maskable-512.png    512×512 dengan safe zone 40%
  og-default.png           1200×630 — kartu Open Graph bawaan
  site.webmanifest
```

**Masalah yang perlu diantisipasi:** wordmark "RAC" tiga huruf akan **tidak terbaca di 16×16 px**. Tab browser akan tampil sebagai gumpalan.

Dua opsi:
- **A.** Monogram "R" tunggal dengan potongan diagonal merah untuk ukuran ≤32px, wordmark RAC penuh untuk ≥48px. Ini pendekatan standar.
- **B.** Terima keterbacaan rendah di favicon. Banyak brand melakukannya; dampaknya kecil tapi nyata.

Rekomendasi: opsi A.

### 5.3 Aturan Pemakaian Logo (dari brand guide + tambahan web)

- Clear space minimal setinggi huruf "A" pada wordmark, di semua sisi
- Lebar minimum: 120px untuk versi penuh, 32px untuk ikon
- Dilarang: meregangkan, memiringkan, mengubah warna, menambah bayangan atau efek
- Di header: `logo-horizontal-dark.svg` (versi putih) karena header berlatar navy
- Logo di header **wajib** dibungkus `<a>` ke beranda, dengan `aria-label="Rope Access Center — Beranda"`
- Logo adalah SVG inline atau `<img>` dengan `width`/`height` eksplisit — jangan background-image (masalah CLS dan aksesibilitas)

### 5.4 Kartu Open Graph

Templat 1200×630: latar `brand-900`, logo putih kiri atas, judul halaman `font-display` putih, garis aksen merah, tagline di bawah. Digenerate otomatis per artikel (PLAN Bab 8.2) memakai templat ini.

---

## 6. Spesifikasi Komponen dari Mockup

Diterjemahkan dari mockup menjadi kontrak implementasi. Angka spasi memakai skala 4px.

### 6.1 Header

- Tinggi 80px desktop, 64px mobile
- Latar `brand-900`; saat scroll > 100px, tambahkan bayangan dan turunkan tinggi ke 64px
- Logo kiri, menu tengah-kanan, tombol CTA merah paling kanan
- Item menu aktif: garis bawah merah 2px
- Dropdown pada Pelatihan dan Layanan: buka pada hover **dan** fokus keyboard, tutup dengan Esc
- Mobile: hamburger → drawer layar penuh dari kanan, fokus terkunci di dalam drawer, tombol tutup jelas
- Drawer memuat: menu utama, CTA, logo, tautan sosial, blok kontak (persis seperti mockup mobile ketiga — bagus, pertahankan)

### 6.2 Hero

- Latar: foto pekerja rope access, overlay gradien navy dari kiri (opasitas 90% → 40%)
- Eyebrow merah `accent-400` uppercase kecil
- Headline tiga baris, kata beraksen merah `accent-500`
- Subheadline `brand-200`
- Dua tombol: primer merah terisi, sekunder garis putih
- Gambar hero: `fetchpriority="high"`, preload, `width`/`height` eksplisit, LQIP blur
- Tinggi: `min-height: 640px` desktop, `auto` mobile — jangan `100vh` (bermasalah dengan bilah alamat mobile)

### 6.3 Bilah Statistik

- Kartu `brand-800` yang tumpang tindih batas bawah hero (offset -64px)
- Empat kolom desktop, dua kolom mobile
- Ikon merah garis, angka `font-display` besar, label kecil `brand-200`
- Pembatas vertikal `border-inverse`
- ⚠️ **Isi hanya dari angka yang lolos lembar verifikasi Bab 2.2.** Slot yang gugur diisi dari daftar pengganti, bukan dikosongkan atau dikira-kira. Claude Code dilarang mengarang angka apa pun di seksi ini.

### 6.4 Kartu Layanan Inti

- Empat kartu, grid 4 kolom → 2 kolom tablet → 2 kolom mobile (mockup mobile memakai 2 kolom, pertahankan)
- Latar putih, `border-default`, radius `md`
- Hover: naik 4px, bayangan `lg`, garis atas merah 3px muncul
- Ikon garis merah 40px, judul uppercase `font-display`, deskripsi, tautan "Selengkapnya →"
- Seluruh kartu bisa diklik, tapi tautan tetap ada sebagai elemen fokus keyboard

### 6.5 Blok Tentang (split)

- Kiri: gambar penuh tinggi; kanan: konten. Balik urutan di mobile (gambar dulu)
- Eyebrow merah, judul dua baris, paragraf, tiga fitur beikon, tombol
- Grid 50/50 desktop, tumpuk di bawah 1024px

### 6.6 Seksi Sertifikasi

**Spesifikasi final pasca D-12.** Seksi lama dibatalkan seluruhnya.

- Eyebrow: "SERTIFIKASI RESMI"
- Judul: "Diakui Secara Hukum di Indonesia"
- Tiga kartu, bukan deretan logo:

| Kartu | Isi |
|---|---|
| **BNSP** | Logo BNSP, "Sertifikat Kompetensi melalui LSP terlisensi", nomor LSP dan masa berlaku |
| **Kemnaker RI** | Logo Kemnaker, "Sertifikat TKPK & TKBT sesuai Permenaker No. 9 Tahun 2016", nomor lisensi PJK3 |
| **Legalitas Perusahaan** | Nomor NIB, nomor lisensi K3, status badan hukum |

- Setiap nomor ditampilkan sebagai teks yang bisa dicari, bukan gambar
- Kalimat penutup: "Seluruh nomor lisensi dapat diverifikasi. Lihat halaman Tentang Kami untuk dokumen lengkap." → tautan internal
- Layout: 3 kolom desktop, tumpuk di mobile

**Dilarang di seksi ini dan di seluruh situs:**
logo atau nama IRATA, SPRAT, Petzl, IRSM, ISO 9001 dalam konteks apa pun yang menyiratkan afiliasi, kemitraan, akreditasi, atau sertifikasi. Rujukan edukatif di artikel komparatif tetap boleh, sesuai daftar putih D-05.

**Kalau nomor lisensi belum terbit,** jangan tayangkan seksi ini sama sekali. Seksi kosong lebih baik daripada seksi berisi klaim tanpa nomor — pembaca korporat justru mencari nomornya.

### 6.7 Bilah CTA

- Latar `brand-900` dengan foto samar beropasitas rendah
- Eyebrow `accent-400`, judul dua baris putih, tombol merah kanan
- Tumpuk vertikal di mobile

### 6.8 Testimoni

- Kartu putih, tanda kutip besar `neutral-200`, isi, foto + nama + jabatan
- Carousel dengan titik indikator, geser di mobile
- ⚠️ Hanya tampilkan testimoni nyata dengan izin tertulis. Testimoni karangan lebih berbahaya daripada tidak ada testimoni.

### 6.9 Footer

- Latar `brand-900`
- Kolom: brand + tagline + sosial · Perusahaan · Pelatihan · Layanan · Kontak
- Kontak dengan ikon: telepon, email, alamat
- Bilah bawah: hak cipta **dengan tahun dinamis** (mockup menulis 2024 — akan basi), Kebijakan Privasi, Syarat & Ketentuan, Peta Situs
- ⚠️ Tambahkan pengalih bahasa (mockup belum punya, padahal D-02 bilingual)
- ⚠️ Tambahkan Disclaimer dan Kebijakan Cookie ke bilah bawah (PLAN Bab 7.2)

---

## 7. Aksesibilitas — Aturan Terkunci

| Aturan | Nilai |
|---|---|
| Kontras teks normal | ≥ 4,5:1 |
| Kontras teks besar (≥24px atau ≥19px bold) | ≥ 3:1 |
| Kontras komponen UI dan ikon | ≥ 3:1 |
| Titik sentuh | ≥ 44×44 px |
| Cincin fokus | `accent-500`, 2px, offset 2px, **tidak boleh dihapus** |
| Teks merah kecil di latar gelap | wajib `accent-400` |
| Gerak | hormati `prefers-reduced-motion` |
| Drawer/modal | fokus terkunci, Esc menutup, kembalikan fokus ke pemicu |
| Gambar hero | `alt` deskriptif, bukan "hero image" |
| Logo | `aria-label`, bukan `alt=""` |

Diuji otomatis dengan axe-core sebagai gerbang blocking di CI (PLAYBOOK T-219).

---

## 8. Bilingual — Dampak pada Desain

Mockup seluruhnya berbahasa Inggris, sedangkan D-02 menetapkan Indonesia sebagai bahasa utama (root) dan Inggris sebagai `/en/`.

Konsekuensi desain yang harus diantisipasi:

1. **Teks Indonesia rata-rata 15–20% lebih panjang** dari Inggris. Menu, tombol, dan judul kartu harus diuji dengan teks ID terpanjang, bukan EN.
   - "TRAINING" → "PELATIHAN" (+2 karakter)
   - "GET IN TOUCH" → "KONSULTASI WHATSAPP" (+7 karakter)
   - "Certification Success Rate" → "Tingkat Kelulusan Sertifikasi" (+4)
2. **Menu 6 item dalam bahasa Indonesia** bisa melebihi lebar di layar 1024–1280px. Uji breakpoint ini secara khusus; siapkan menu ringkas untuk rentang itu.
3. **Pengalih bahasa** wajib ada di header (desktop) dan drawer (mobile), bukan hanya footer.
4. Tombol tidak boleh punya lebar tetap — pakai padding, bukan `width`.

---

## 9. Amandemen terhadap PLAN.md

Tambahkan ke `docs/DECISIONS.md` dan perbarui bagian terkait di PLAN.md.

| Kode | Amandemen |
|---|---|
| **A-01** | Nama brand: Rope Access Center (RAC). Mengisi O-01 (domain masih terbuka). |
| **A-02** | Warna aksen: **merah `#E30613`**, bukan safety orange atau hi-vis yellow. Mengisi O-02. PLAN Bab 11.1 diperbarui. |
| **A-03** | Token warna PLAN Bab 11.2 digantikan seluruhnya oleh Bab 3 dokumen ini. |
| **A-04** | Menu utama PLAN Bab 7.3 diperbarui: Pelatihan · Jadwal · Layanan · Artikel · Tentang · Kontak. "Certification" menjadi submenu Pelatihan. |
| **A-05** | Aturan kontras baru: teks merah kecil di latar gelap wajib `accent-400`. Ditambahkan ke PLAN Bab 11.3. |
| **A-06** | Seksi "Certified & Recognized" pada mockup **dibatalkan seluruhnya**. Diganti "Sertifikasi Resmi" berisi BNSP, Kemnaker, dan legalitas perusahaan dengan nomor yang dapat diverifikasi (Bab 6.6). |
| **A-10** | Font display: **Archivo Expanded**, `wdth` 118. Square 721 hanya hidup di dalam logo sebagai vektor. |
| **A-11** | Positioning situs bergeser dari "global standards" ke **kepatuhan regulasi Indonesia**. Copywriting beranda, Tentang, dan halaman pelatihan disesuaikan: keunggulan utama adalah sertifikat yang diwajibkan hukum Indonesia, bukan pengakuan internasional. |
| **A-12** | Setiap klaim numerik di situs wajib punya dokumen pendukung yang bisa ditunjukkan dalam 5 menit. Ditambahkan sebagai butir wajib di checklist QA PLAN Bab 19. |
| **A-07** | Font isi artikel boleh berbeda dari font UI (tunggu D-15). |
| **A-08** | Header dan drawer mobile wajib memuat pengalih bahasa. |
| **A-13** | **Tiga token Bab 3 tidak memenuhi WCAG AA untuk sebagian pemakaian** — ditemukan test kontras blocking T-104. `success #16A34A` = 3,30:1 dan `warning #D97706` = 3,19:1 gagal sebagai **teks** (butuh 4,5:1); `border-default #D1D5DB` = 1,47:1 gagal sebagai **batas kontrol form** (butuh 3:1, WCAG 2.1 SC 1.4.11). Palet Bab 3 **tidak diubah** — nilainya tetap sah untuk isian, badge, dan ikon besar. Ditambahkan token turunan: `success-text #15803D` (5,02:1), `warning-text #B45309` (5,02:1), `border-strong #7C838C` (3,83:1), plus tint latar badge dan warna merek WhatsApp. `border-default` tetap dipakai untuk pembatas dekoratif dan garis kartu, yang di luar cakupan 1.4.11. |
| **A-09** | Validator `check:content` diperluas: gagalkan build kalau menemukan file gambar bernama mengandung `irata`, `sprat`, `petzl`, `irsm`, atau `iso9001` di `public/` maupun `src/`. |

---

## 10. Keputusan yang Diminta

| # | Pertanyaan | Kenapa mendesak |
|---|---|---|
| **D-12** | ✅ **TUTUP** — tidak ada hubungan resmi. Kelima logo dihapus total; seksi diganti sesuai Bab 6.6. | — |
| **D-13** | ⚠️ **SEBAGIAN** — isi lembar verifikasi di Bab 2.2. Angka tanpa dokumen pendukung tidak tayang. | Blokir untuk T-206 |
| **D-14** | ✅ **TUTUP** — Archivo Expanded, `wdth` 118. Square 721 tidak dibeli. | — |
| **D-15** | ✅ **TUTUP** — **Inter** untuk isi artikel. Montserrat tetap untuk seluruh antarmuka, judul, dan label. | — |
| **D-16** | Favicon: monogram "R" untuk ukuran kecil, atau tetap wordmark RAC? | Blokir untuk produksi aset |
| **D-17** | ✅ **TUTUP** — **tidak ada.** Tidak dibuat menu, halaman, maupun klaster keyword. Footer mockup diabaikan di titik ini. | — |
| **D-18** | Domain final (mockup menyebut `ropeaccesscenter.com`) — sudah dibeli? | Blokir untuk Fase 0 |
| **D-19** | Apakah RAC adalah LSP terlisensi BNSP sendiri, atau bermitra dengan LSP lain? | Menentukan sah tidaknya klaim "We Certify" di hero. Blokir untuk T-206 |
| **D-20** | Nomor lisensi PJK3/K3 Kemnaker sudah terbit? Nomor berapa? | Blokir untuk seksi Bab 6.6 |

---

## 11. Tambahan untuk PLAYBOOK

### 11.1 Tugas Baru: T-100b — Produksi Aset Brand

**Dikerjakan manual atau oleh desainer, bukan Claude Code.** Prasyarat T-104.

```
[ ] Redraw seluruh logo sebagai SVG (Bab 5.1)
[ ] Optimasi SVG (hapus metadata, gabungkan path, target < 8 KB per file)
[ ] Produksi set favicon lengkap (Bab 5.2)
[ ] Putuskan D-16, produksi monogram jika opsi A
[ ] Templat kartu OG 1200×630
[ ] Unduh dan subset font, konversi ke WOFF2 (Bab 4.4)
[ ] Kalau D-14 = beli lisensi: selesaikan pembelian, simpan bukti lisensi
    di docs/licenses/
[ ] Sesi foto (PLAN Bab 11.4) — masih belum selesai
```

### 11.2 Revisi Prompt T-104

Ganti bagian warna dan font pada prompt T-104 di PLAYBOOK dengan:

```
Baca @docs/DESIGN-SYSTEM.md Bab 3 dan Bab 4.

Salin blok @theme di Bab 3 PERSIS APA ADANYA ke src/styles/theme.css.
Jangan mengubah, menambah, atau menghapus satu token pun.

Tambahkan skala tipografi Bab 4.1.

Font display: Archivo Expanded (variable, self-hosted), dengan
  font-variation-settings "wdth" 118 sesuai Bab 4.2
Font body: Montserrat, self-hosted dari public/fonts/
Font reading: [ISI HASIL D-15]

JANGAN memuat font apa pun dari Google Fonts CDN. Semua self-hosted.

Implementasikan SELURUH tabel aturan pemakaian warna di Bab 3.1 sebagai
varian komponen. Perhatikan khusus:
- Varian eyebrow HARUS punya dua bentuk: eyebrow-on-light (accent-500)
  dan eyebrow-on-dark (accent-400). Ini persyaratan aksesibilitas
  di Bab 2.5, bukan preferensi.
- Warna error memakai --color-danger, BUKAN accent-500.

Tulis test yang memverifikasi rasio kontras setiap pasangan
teks/latar di tabel Bab 7 memenuhi ambangnya. Gunakan pustaka
perhitungan kontras WCAG. Test ini blocking.

Selesai: jalankan test dan tunjukkan tabel hasil kontras.
```

### 11.3 Revisi Prompt T-206 (Beranda)

Tambahkan di akhir prompt T-206:

```
Struktur seksi mengikuti @docs/DESIGN-SYSTEM.md Bab 6, dengan
PENGECUALIAN WAJIB berikut:

- Seksi 2 (bilah statistik): isi HANYA dengan angka yang saya berikan
  secara eksplisit. JANGAN mengarang atau memakai angka dari mockup.
  Kalau saya belum memberikan, pakai placeholder "TODO: statistik".
- Seksi sertifikasi: JANGAN buat seksi "Certified & Recognized" dengan
  logo IRATA, SPRAT, Petzl, IRSM, atau ISO. Buat seksi "Sertifikasi &
  Kepatuhan" sesuai Bab 6.6, isi hanya badan yang saya sebutkan.
  Ini penerapan D-05, PLAN Bab 3.
- Testimoni: hanya render dari database. Jangan buat testimoni contoh
  yang terlihat nyata; kalau butuh placeholder, tulis jelas
  "TODO: testimoni".
- Tahun hak cipta di footer harus dinamis.
- Header dan drawer mobile wajib memuat pengalih bahasa.
```

---

## Riwayat Revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | 11 Agustus 2026 | Audit aset brand, token, spesifikasi komponen, 5 temuan kritis |
| 1.1 | 12 Agustus 2026 | A-13 ditambahkan: tiga token Bab 3 gagal WCAG AA untuk sebagian pemakaian, ditemukan test kontras blocking T-104. Token turunan ditambahkan tanpa mengubah palet. D-15 (Inter) dan D-17 (tanpa E-Learning) ditutup. |
