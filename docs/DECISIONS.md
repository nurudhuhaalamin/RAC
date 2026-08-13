# Register Keputusan & Architecture Decision Record
## Rope Access Center (RAC)

> **Pendamping:** `docs/PLAN.md` · `docs/PLAYBOOK.md` · `docs/DESIGN-SYSTEM.md`
> **Terakhir diperbarui:** 12 Agustus 2026

Dokumen ini punya dua bagian:

- **Bagian 1 — Keputusan bisnis & produk (D-xx).** Hasil sesi interview dan audit brand.
- **Bagian 2 — Architecture Decision Record (ADR-xxx).** Keputusan teknis, lengkap dengan
  konteks dan konsekuensinya.

**Aturan pakai:** keputusan berstatus ✅ **TUTUP** tidak boleh diperdebatkan ulang oleh Claude Code
kecuali pemilik proyek mengubahnya secara eksplisit. Keputusan berstatus 🔴 **TERBUKA** yang menandai
"memblokir T-xxx" berarti tugas itu **tidak boleh dimulai** sebelum keputusannya diambil — bukan
dimulai dengan tebakan.

---

# Bagian 1 — Keputusan Bisnis & Produk

## 1.1 Keputusan tertutup

| # | Keputusan | Nilai | Sumber |
|---|---|---|---|
| **D-01** | Prioritas bisnis | Training Center **primer**; jasa perawatan gedung sekunder | interview |
| **D-02** | Bahasa | Bilingual ID + EN sejak rilis pertama. ID di root, EN di `/en/` | interview |
| **D-03** | Alur lead | Form → **tersimpan di database** → baru diteruskan ke WhatsApp | interview |
| **D-04** | Skema sertifikasi | **BNSP** dan **Kemnaker (TKBT/TKPK)** | interview |
| **D-05** | IRATA / SPRAT | Hanya boleh tampil sebagai **"rencana/persiapan"**. Larangan lengkap di PLAN Bab 3 | interview |
| **D-06** | Jangkauan pasar | Nasional | interview |
| **D-07** | Aset brand awal | Nol — dibangun dari awal | interview |
| **D-08** | Pengelola konten | Campur: pemilik (teknis) + staf (non-teknis) | interview |
| **D-09** | Modul dashboard rilis pertama | Artikel + SEO editor, Leads + follow-up, Jadwal batch | interview |
| **D-10** | Timeline | Lengkap, waktu fleksibel — **kualitas di atas kecepatan** | interview |
| **D-11** | Standar konten | Tidak boleh thin content. Standar wajib PLAN Bab 9 | interview |
| **D-12** | Hubungan resmi dengan asosiasi/vendor | ❌ **TIDAK ADA satu pun hubungan resmi tertulis.** Kelima logo (IRATA, SPRAT, Petzl, IRSM, ISO 9001) dihapus total. Tidak ada versi grayscale, tidak ada "sedang proses", tidak ada disclaimer. Seksi diganti "Sertifikasi & Kepatuhan" (DESIGN-SYSTEM Bab 6.6) | audit brand |
| **D-14** | Font display | **Archivo Expanded** (SIL OFL, gratis), `wdth` 118. Square 721 **tidak dibeli** — lisensi desktop tidak mencakup web. Square 721 tetap hidup di dalam logo sebagai vektor, dan itu sah | audit brand |
| **D-18** | Domain | ✅ Sudah dibeli. **Nilai finalnya diisi di `docs/FAKTA-BISNIS.md`** | 12 Agu 2026 |
| **D-15** | Font isi artikel | **Inter**. Montserrat tetap untuk seluruh antarmuka, judul, dan label. Penyimpangan kecil dari brand guide yang sepadan: pembaca tidak menyadari perbedaannya, yang mereka rasakan hanya artikel lebih enak dibaca. |
| **D-17** | E-Learning | ❌ **Tidak ada.** Tidak dibuat menu, halaman, maupun klaster keyword. Menu yang menjanjikan sesuatu yang tidak ada merusak kepercayaan. |
| **D-21** | Versi stack | Versi terbaru, bukan Astro 6 → lihat **ADR-001** | 12 Agu 2026 |
| **D-22** | Urutan T-101/T-102 | T-102 (governance) dikerjakan **sebelum** T-101 (scaffold) → lihat **ADR-007** | 12 Agu 2026 |

## 1.2 Keputusan terbuka — memblokir tugas

| # | Pertanyaan | Memblokir | Kenapa tidak boleh ditebak |
|---|---|---|---|
| 🔴 **D-13** | Mana dari empat angka mockup yang **nyata**: 1.200+ peserta terlatih · 98% tingkat kelulusan · 250+ proyek selesai · 10+ tahun pengalaman? | **T-206** | Sebagian nyata, sebagian karangan — dan dari luar tidak ada cara membedakan. Kalau satu terbukti salah saat diaudit klien korporat, **tiga sisanya ikut runtuh, termasuk yang benar**. Isi lembar verifikasi di `docs/FAKTA-BISNIS.md`. Aturannya: sebuah angka boleh tayang **hanya jika** dokumen pendukungnya bisa ditunjukkan dalam 5 menit. |
| 🔴 **D-16** | Favicon: **monogram "R"** untuk ukuran ≤32px, atau wordmark **RAC** apa adanya? | **T-100b** | Wordmark tiga huruf **tidak akan terbaca di 16×16 px** — tab browser tampil sebagai gumpalan. Rekomendasi: monogram untuk ≤32px, wordmark penuh untuk ≥48px. |
| 🔴 **D-19** | RAC adalah **LSP terlisensi BNSP sendiri**, atau bermitra dengan LSP lain? | **T-206**, **T-207** | Menentukan sah atau tidaknya klaim **"We Certify"** di hero. Kalau bermitra, kalimatnya harus berubah — menyatakan menerbitkan sertifikat padahal hanya memfasilitasi uji kompetensi adalah misrepresentasi. |
| 🔴 **D-20** | Nomor lisensi PJK3/K3 Kemnaker sudah terbit? Nomor berapa? | seksi Sertifikasi (DESIGN-SYSTEM Bab 6.6) | Kalau belum, **seksi itu jangan ditayangkan sama sekali**. Seksi kosong lebih baik daripada seksi berisi klaim tanpa nomor — pembaca korporat justru mencari nomornya. |

## 1.3 Keputusan operasional yang masih terbuka

| # | Keputusan | Batas waktu |
|---|---|---|
| O-03 | Alamat kantor & area latihan (untuk `LocalBusiness` + Google Business Profile) | Fase 1 |
| O-04 | Nomor WhatsApp per divisi — minimal dua: training dan jasa | Fase 1 |
| O-05 | Analitik: GA4 saja, Cloudflare saja, atau keduanya | Fase 2 |
| O-06 | Tampilkan harga di situs atau tidak (naikkan kualitas lead, turunkan jumlahnya) | Fase 2 |
| O-07 | Alamat email untuk permintaan hak subjek data UU PDP | Fase 2 |
| O-08 | Siapa peninjau ahli untuk konten K3 — harus orang bersertifikat dengan nama yang bisa dicantumkan | Fase 4 |
| O-09 | Anggaran alat SEO (Ahrefs/Semrush) untuk validasi keyword | Fase 0 |

**O-01** (nama & domain) dan **O-02** (warna aksen) sudah ✅ **TUTUP** — lihat A-01 dan A-02.

## 1.4 Amandemen dari audit brand (A-01…A-12)

Sudah diintegrasikan ke `docs/PLAN.md` dan ditandai `[A-xx]` di dalamnya.

| Kode | Amandemen | Terintegrasi di PLAN Bab |
|---|---|---|
| A-01 | Nama brand: **Rope Access Center (RAC)**. Menutup O-01 | 20.2 |
| A-02 | Aksen: **merah `#E30613`** — bukan safety orange, bukan hi-vis yellow. Menutup O-02 | 11.1, 20.2 |
| A-03 | Token warna PLAN Bab 11.2 **digantikan seluruhnya** oleh DESIGN-SYSTEM Bab 3 | 11.2 |
| A-04 | Menu: Pelatihan · Jadwal · Layanan · Artikel · Tentang · Kontak. **"Certification" jadi submenu Pelatihan**, bukan item setara | 7.3 |
| A-05 | Teks merah kecil di latar gelap **wajib `accent-400`** (`#F45E5E`) — `accent-500` hanya 3,51:1 | 11.3 |
| A-06 | Seksi "Certified & Recognized" **dibatalkan seluruhnya**. Diganti "Sertifikasi Resmi": BNSP, Kemnaker, legalitas perusahaan dengan nomor yang dapat diverifikasi | 3 (D-05) |
| A-07 | Font isi artikel boleh berbeda dari font UI (menunggu D-15) | 11.1 |
| A-08 | Header **dan** drawer mobile wajib memuat pengalih bahasa | 7.3, 11.3 |
| A-09 | Validator `check:content` diperluas: gagalkan build kalau ada file gambar bernama mengandung `irata`, `sprat`, `petzl`, `irsm`, `iso9001` | 3, 19 |
| A-10 | Font display: **Archivo Expanded**, `wdth` 118 | 11.1 |
| A-11 | Positioning bergeser dari "global standards" ke **kepatuhan regulasi Indonesia** | 11.1 |
| A-12 | Setiap klaim numerik wajib punya dokumen pendukung yang bisa ditunjukkan dalam 5 menit | 19 |
| A-13 | Token turunan aksesibilitas: `success-text`, `warning-text`, `border-strong`, tint badge, warna WhatsApp. Palet Bab 3 tidak diubah — lihat ADR-008 | 11.3 |

---

# Bagian 2 — Architecture Decision Record

Format: **Konteks** (apa yang memaksa keputusan) → **Keputusan** → **Konsekuensi** (termasuk yang merugikan).

---

## ADR-001 — Pakai versi stack terbaru, bukan Astro 6

**Tanggal:** 12 Agustus 2026 · **Status:** diterima

### Konteks
PLAN v1.0 Bab 4.1 mengunci "Astro 6" dan "Zod 4". Saat repo dibuat, registry npm menunjukkan
Astro sudah di **7.2.1**. Dokumen ditulis 11 Agustus; selisihnya kecil, tapi selisih **major version**.

### Keputusan
Pakai versi terbaru saat scaffold. Acuan tercatat di PLAN Bab 4.1 dan **diverifikasi ulang dengan
`npm view <paket> version` sebelum T-101 dijalankan** — bukan disalin dari ingatan model, yang punya
batas pengetahuan dan akan salah untuk rilis baru.

| Paket | Versi acuan (12 Agu 2026) |
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

### Konsekuensi
- **Positif:** tidak ada utang migrasi sejak hari pertama; dokumentasi dan contoh yang ditemukan
  online akan cocok dengan kode.
- **Negatif:** ekosistem plugin di major version terbaru kadang tertinggal beberapa minggu. Kalau
  sebuah integrasi ternyata belum kompatibel, **catat di sini** dan turunkan versi hanya paket itu —
  jangan menurunkan seluruh stack.
- Tabel versi ini **wajib diperbarui** kalau scaffold ternyata memakai angka lain, supaya sesi
  berikutnya tidak "memperbaiki" ke versi yang salah.

---

## ADR-002 — Cache halaman di KV, bukan purge-by-tag di Cache API

**Tanggal:** 12 Agustus 2026 · **Status:** diterima · **Menggantikan:** desain T-216 v1.0

### Konteks
PLAN Bab 12.1 merancang sistem *cache tagging*: setiap halaman diberi tag, dan saat sebuah artikel
diterbitkan hanya tag terkait yang di-purge. Rancangan awal membangunnya di atas **Cache API**
Workers, dengan daftar kunci di KV untuk memetakan tag ke URL.

Rancangan itu tidak bisa bekerja, karena dua batasan platform:

1. **Cache API bersifat per-colo.** `caches.default.delete(url)` hanya menghapus salinan di pusat
   data yang melayani permintaan itu. Cloudflare punya 300+ lokasi. Purge yang tampak berhasil saat
   diuji akan menyisakan konten basi di mayoritas dunia — dan **gagalnya tidak terlihat** dari lokasi
   pengembang. Ini jenis bug paling mahal: yang lolos semua pengujian lokal.
2. **Purge berbasis header `Cache-Tag` adalah fitur Enterprise.** Tidak tersedia di paket Workers
   Paid $5 yang dianggarkan di PLAN Bab 4.6.

### Keputusan
Balik peran: **KV menjadi penyimpan cache sesungguhnya, edge hanya lapisan tipis berumur pendek.**

| Lapis | Peran |
|---|---|
| **KV** | Menyimpan HTML terender: `page:<locale>:<path>`. KV bersifat **global** — inilah yang membuat purge benar-benar berlaku di semua lokasi. |
| **Indeks tag di KV** | `tag:<nama>` berisi daftar kunci halaman. `purgeByTag()` = baca indeks → hapus tiap kunci halaman → hapus indeks. |
| **Edge** | `s-maxage=60, stale-while-revalidate=86400`. Tidak pernah di-purge; dibiarkan kedaluwarsa sendiri. |

### Konsekuensi
- **Positif:** purge benar-benar global dan tepat sasaran, berjalan di paket $5, dan tidak bergantung
  pada perilaku yang tidak dijamin.
- **Negatif — diterima:** jendela **maksimal 60 detik** setelah publish di mana sebagian pengunjung
  masih melihat versi lama dari edge. Untuk situs konten, ini tidak berarti apa-apa.
- **Negatif:** baca KV menambah latensi ~5–10 ms dibanding cache hit di edge. Ditutupi oleh
  `stale-while-revalidate`, sehingga pengunjung tetap mendapat respons instan.
- Indeks tag bisa membesar. Kalau melewati batas ukuran nilai KV, pecah jadi `tag:<nama>:<n>`.
- **Larangan:** jangan memakai `caches.default` untuk purge. Kalau terasa perlu, baca ulang ADR ini.

---

## ADR-003 — Rate limit dua lapis: WAF utama, KV sekunder

**Tanggal:** 12 Agustus 2026 · **Status:** diterima

### Konteks
PLAN Bab 6.3 menetapkan rate limit "maks 3 submit per IP per jam" pada `POST /api/leads`,
diimplementasikan dengan penghitung di KV. Masalahnya, **KV bersifat *eventually consistent***:
penghitung yang ditulis di satu lokasi belum tentu terbaca di lokasi lain dalam hitungan detik.
Angka "3" karena itu adalah perkiraan, bukan jaminan — penyerang terdistribusi bisa menembus
beberapa kali lipat sebelum penghitung menyatu.

### Keputusan
Dua lapis, dengan peran yang jelas berbeda:

1. **Lapisan utama — Cloudflare Rate Limiting (WAF)** di depan `POST /api/leads`. Ditegakkan di edge
   sebelum Worker jalan, konsisten global. Dikonfigurasi lewat dashboard Cloudflare, prosedurnya
   di `docs/RUNBOOK.md`.
2. **Lapisan kedua — penghitung KV** di dalam Worker. Menangkap penyalahgunaan kasar dan memberi
   pesan 429 yang ramah dalam Bahasa Indonesia. **Tidak diandalkan sebagai kontrol keamanan.**

Turnstile tetap gerbang pertama sebelum keduanya.

### Konsekuensi
- **Positif:** perlindungan nyata ada di lapisan yang memang konsisten; pesan ramah tetap ada.
- **Negatif:** konfigurasi WAF hidup di dashboard Cloudflare, **di luar version control**. Karena itu
  wajib didokumentasikan di RUNBOOK — kalau tidak, ia akan hilang saat akun dipindah atau orang berganti.
- **Ditolak:** Durable Object untuk penghitung yang benar-benar tepat. Biayanya tidak sepadan untuk
  form kontak; kompleksitasnya nyata, manfaatnya marginal di atas WAF.
- Konsekuensi yang sudah ada sejak awal dan tetap diterima: pengguna di balik NAT kantor yang sama
  berbagi IP dan bisa saling memblokir. Tinjau ulang kalau ada laporan nyata.

---

## ADR-004 — Backup D1 lewat REST API, dan Time Travel sebagai lapis pertama

**Tanggal:** 12 Agustus 2026 · **Status:** diterima

### Konteks
PLAN Bab 12.5 menjadwalkan Cron Trigger harian 02:00 WIB untuk backup D1 ke R2, dengan langkah
"ekspor seluruh tabel sebagai SQL". Rancangannya mengasumsikan `wrangler d1 export` bisa dipanggil.
**Worker tidak bisa menjalankan `wrangler`** — wrangler adalah CLI Node.js, bukan sesuatu yang hidup
di dalam runtime Workers.

### Keputusan
1. **Lapis pertama — D1 Time Travel.** Sudah aktif secara bawaan dan memberi point-in-time restore
   sampai 30 hari tanpa kode apa pun. Untuk mayoritas skenario pemulihan (salah `DELETE`, migration
   yang merusak), inilah alat yang dipakai.
2. **Lapis kedua — dump ke R2** lewat **D1 REST API** (`/export`) dengan API token di Cloudflare
   Secrets, dipanggil dari Cron Trigger. Retensi 30 hari. Email dikirim **kalau gagal**, bukan kalau sukses.

### Konsekuensi
- **Positif:** salinan berada **di luar platform**, sehingga selamat dari skenario yang Time Travel
  tidak lindungi — akun tersuspensi, kredensial dicuri, database sengaja dihapus.
- **Negatif:** butuh API token bernilai tinggi tersimpan di Secrets. Lingkupkan seketat mungkin
  (hanya D1 Read pada satu database), dan **jangan pernah** masuk ke `.env` yang ter-commit.
- **Wajib:** uji restore setidaknya sekali sebelum launch, dan catat hasilnya di RUNBOOK.
  **Backup yang belum pernah diuji restore bukan backup** — ia hanya file yang menenangkan perasaan.

---

## ADR-005 — Gerbang Lighthouse memakai median 3 run dan batas gagal, bukan target

**Tanggal:** 12 Agustus 2026 · **Status:** diterima

### Konteks
PLAN Bab 12.4 mendaftar dua kolom, "Target" dan "Batas gagal", lalu menyatakan "build gagal kalau
terlampaui" tanpa menyebut kolom mana yang mengikat. PLAYBOOK T-219 meminta gerbang blocking.

Skor Lighthouse di runner CI bervariasi sekitar ±5 poin antar-run karena beban mesin bersama, bukan
karena kode berubah. Gerbang `Performance > 95` pada satu kali run akan sering merah tanpa regresi
apa pun. Dan gerbang yang sering merah palsu akan diabaikan orang — lalu berhenti melindungi apa pun.

### Keputusan
- Jalankan Lighthouse **3× per URL, ambil median**.
- **Blocking** hanya pada kolom **"Batas gagal"** (LCP 2,5 s · INP 200 ms · CLS 0,1 · Perf 90 ·
  A11y 95 · SEO 100 · transfer 800 KB · JS 50 KB).
- Kolom **"Target"** dilaporkan sebagai **peringatan** di komentar PR — terlihat, tapi tidak memblokir.
- Test aksesibilitas **axe-core tetap blocking penuh**: hasilnya deterministik, tidak ada variansi
  yang perlu ditoleransi.

### Konsekuensi
- **Positif:** gerbang yang merah berarti benar-benar ada masalah, sehingga tetap dipercaya.
- **Negatif:** regresi kecil antara Target dan Batas gagal bisa lolos merge. Ditutupi oleh laporan
  peringatan yang tetap terlihat di PR, dan oleh audit Lighthouse berkala di Fase 5.
- **Larangan mutlak:** kalau anggaran tidak terpenuhi, **jangan turunkan ambangnya supaya lulus.**
  Laporkan halaman dan metriknya.

---

## ADR-006 — Penyempitan deny rule pada `.claude/settings.json`

**Tanggal:** 12 Agustus 2026 · **Status:** diterima

### Konteks
Template `.claude/settings.json` di PLAN Bab 16.6 memuat `deny: ["Bash(curl*)"]`. Aturan itu
memblokir **semua** pemakaian curl — termasuk pengujian yang justru diperintahkan oleh playbook
itu sendiri (T-203: "kirim satu lead sungguhan lewat `curl`"). Aturan yang membuat pekerjaan resmi
mustahil akan dilonggarkan sembarangan saat mendesak, dan pelonggaran terburu-buru biasanya lebih
lebar dari yang diperlukan.

Selain itu `allow: ["Bash(gh pr *)"]` hanya relevan di terminal lokal; sesi Claude Code di web
memakai GitHub lewat MCP.

### Keputusan
- `curl` ke **localhost dan 127.0.0.1 diizinkan** (pengujian endpoint lokal).
- `curl` ke domain produksi, API Cloudflare, dan endpoint bertoken tetap **ditolak**.
- `allow` memuat padanan MCP GitHub, di samping `gh` untuk sesi terminal.

**Tidak berubah dan tidak boleh dilonggarkan:** `Bash(wrangler deploy*)`,
`Bash(wrangler d1 execute * --remote*)`, `Read(.env)`, `Read(.dev.vars)`, `Read(**/*.pem)`.
Deploy ke production adalah keputusan manusia, bukan keputusan agen.

### Konsekuensi
- **Positif:** aturan tetap ketat di tempat yang penting, dan cukup longgar untuk tidak memancing
  pelonggaran darurat.
- **Negatif:** pencocokan pola pada string perintah bisa dielakkan oleh perintah yang disusun kreatif.
  Ini lapisan kenyamanan, **bukan sandbox keamanan** — pengamanan sesungguhnya ada pada tidak adanya
  kredensial produksi di lingkungan pengembangan.

---

## ADR-007 — T-102 dikerjakan sebelum T-101

**Tanggal:** 12 Agustus 2026 · **Status:** diterima

### Konteks
PLAYBOOK v1.0 mengurutkan T-101 (scaffold Astro) → T-102 (governance: CLAUDE.md, validator D-05,
hook worklog, subagent). Urutan itu berarti scaffold — tugas pertama yang menulis kode nyata —
berjalan **tanpa** satu pun aturan yang terpasang.

### Keputusan
Kerjakan T-102 lebih dulu, di repo yang masih kosong. Konsekuensi teknisnya: `package.json` dibuat
minimal (hanya `"type": "module"` + script `check:content` dan `check:worklog`) supaya validator
bisa jalan sebelum ada Astro.

### Konsekuensi
- **Positif:** setiap sesi berikutnya, termasuk T-101, berjalan di bawah CLAUDE.md, validator D-05,
  dan skill `content-writer` yang melarang mengarang fakta.
- **Negatif — perlu perhatian di T-101:** `pnpm create astro` cenderung **menimpa** `package.json`
  yang sudah ada. T-101 wajib **me-*merge***, dan memverifikasi bahwa script `check:content` serta
  `check:worklog` masih ada setelah scaffold selesai. Ini dicatat sebagai peringatan eksplisit di
  prompt T-101.
- Skill `content-writer` dimajukan dari T-401 ke T-102 dengan alasan yang sama: memasangnya di Fase 4
  berarti seluruh Fase 2 ditulis tanpa pengaman itu.

---

## ADR-008 — Token turunan aksesibilitas, bukan mengubah palet

**Tanggal:** 12 Agustus 2026 · **Status:** diterima

### Konteks
Test kontras blocking yang ditulis di T-104 menemukan tiga token DESIGN-SYSTEM Bab 3 tidak
memenuhi ambang WCAG AA untuk sebagian pemakaiannya:

| Token | Rasio di putih | Ambang | Pemakaian yang gagal |
|---|---|---|---|
| `success` `#16A34A` | 3,30:1 | 4,5:1 | teks normal |
| `warning` `#D97706` | 3,19:1 | 4,5:1 | teks normal |
| `border-default` `#D1D5DB` | 1,47:1 | 3:1 | batas kontrol form |

Prompt T-104 memerintahkan menyalin blok `@theme` Bab 3 **persis apa adanya**. Prompt yang sama
juga menetapkan test kontras sebagai **blocking**. Kedua perintah bertabrakan.

### Keputusan
**Palet Bab 3 tidak diubah satu nilai pun.** Nilai aslinya tetap sah dan tetap dipakai untuk
isian badge, latar, dan ikon berukuran besar — konteks yang tidak terikat ambang 4,5:1.

Ditambahkan token **turunan** untuk konteks yang terikat: `success-text` `#15803D`,
`warning-text` `#B45309`, `border-strong` `#7C838C`, plus tint latar badge dan warna merek
WhatsApp yang sebelumnya ditulis sebagai nilai arbitrer.

`border-default` sengaja **tidak** dipaksa ke 3:1: WCAG 2.1 SC 1.4.11 mengatur informasi visual
yang **diperlukan untuk mengenali komponen dan statusnya**. Pembatas dekoratif dan garis kartu
tidak termasuk; batas kontrol form termasuk. Memaksa semua garis ke 3:1 akan membuat setiap
kartu tampak berkotak tebal tanpa manfaat aksesibilitas apa pun.

### Konsekuensi
- **Positif:** ambang tidak diturunkan, palet brand tetap utuh, dan setiap pemakaian punya token
  yang benar. Pilihan yang salah jadi lebih sulit dilakukan daripada pilihan yang benar.
- **Negatif:** jumlah token bertambah, dan pemakainya harus tahu kapan memakai `success` versus
  `success-text`. Dimitigasi lewat komentar di `theme.css` dan varian komponen `Badge` yang
  sudah memasangkan keduanya dengan benar — pemakai komponen tidak perlu memilih sendiri.
- Kalau brand guide kelak memperbarui warna semantik, **nilai Bab 3 yang diperbarui**, dan token
  turunan dihitung ulang dari situ. Jangan membalik arahnya.

---

## Templat ADR baru

Salin blok ini saat menambah keputusan arsitektur.

```markdown
## ADR-00X — <judul keputusan dalam satu frasa>

**Tanggal:** <tanggal> · **Status:** diusulkan | diterima | digantikan oleh ADR-00Y

### Konteks
Apa yang memaksa keputusan ini diambil. Batasan nyata, bukan preferensi.

### Keputusan
Apa yang diputuskan, cukup spesifik untuk dieksekusi tanpa bertanya lagi.

### Konsekuensi
Positif DAN negatif. ADR tanpa konsekuensi negatif biasanya belum dipikirkan tuntas.
Sebutkan juga alternatif yang ditolak dan alasannya.
```
