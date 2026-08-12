# Runbook Operasional
## Rope Access Center (RAC)

> **Status:** kerangka — diisi seiring infrastruktur dibangun
> **Dibuat:** 12 Agustus 2026

Dokumen ini untuk dibaca **saat sedang panik**. Karena itu: langkah bernomor, perintah bisa
disalin apa adanya, dan tidak ada penjelasan panjang di jalur kritis.

Beberapa prosedur di sini menyangkut konfigurasi yang hidup di **dashboard Cloudflare**, di luar
version control. Itu justru alasan utama file ini ada — konfigurasi yang tidak tercatat akan
hilang saat akun berpindah tangan atau orangnya berganti.

---

## 1. Rollback Deploy

**Kapan:** situs rusak setelah deploy, dan penyebabnya belum jelas.
**Prinsip:** pulihkan dulu, cari sebabnya kemudian.

```
[ ] TODO: isi setelah T-106 (CI/CD) selesai
```

Rencana: rollback lewat Cloudflare Workers deployments (`wrangler rollback`) atau redeploy
commit sebelumnya lewat GitHub Actions. Catat perintah persisnya setelah diuji sungguhan.

---

## 2. Restore Database

Dua lapis, sesuai **ADR-004**. Pakai lapis pertama dulu.

### 2.1 D1 Time Travel — pemulihan cepat (≤ 30 hari)

Untuk `DELETE` yang salah, migration yang merusak, atau kerusakan data apa pun dalam 30 hari.
Tidak butuh file backup apa pun.

```
[ ] TODO: isi perintah persisnya setelah T-103, dan UJI SUNGGUHAN di database lokal/staging
```

### 2.2 Restore dari dump R2

Untuk skenario yang Time Travel tidak lindungi: akun tersuspensi, kredensial dicuri, database
sengaja dihapus.

```
[ ] TODO: isi setelah T-311 (cron backup) selesai
```

> ⚠️ **Backup yang belum pernah diuji restore bukan backup.** Uji restore minimal sekali sebelum
> launch, dan catat hasilnya di tabel bawah. Ulangi setiap kuartal.

| Tanggal uji restore | Hasil | Catatan |
|---|---|---|
| — | belum pernah | wajib sebelum launch (T-402) |

---

## 3. Konfigurasi Cloudflare (di luar version control)

### 3.1 Rate Limiting untuk `/api/leads` — ADR-003

Lapisan utama perlindungan form lead. Penghitung KV di dalam Worker hanya lapisan kedua dan
**tidak diandalkan sebagai kontrol keamanan** (KV eventually consistent).

```
[ ] TODO: dokumentasikan setelah dikonfigurasi
    - Path yang dilindungi : POST /api/leads
    - Ambang               : TODO:
    - Periode              : TODO:
    - Aksi                 : TODO: (block / managed challenge)
```

### 3.2 Cloudflare Access untuk `/admin/*`

```
[ ] TODO: isi setelah T-301
```

Rencana: Access Application pada path `/admin/*`, kebijakan berbasis email OTP, daftar email
staf disinkronkan dengan tabel `users`. **Menonaktifkan pengguna di tabel `users` harus langsung
memutus akses** — verifikasi ini saat T-301.

### 3.3 Bindings & Secrets

```
[ ] TODO: daftar binding (DB, CACHE, MEDIA) dan nama secret — BUKAN nilainya
```

---

## 4. Permintaan Hak Subjek Data (UU PDP)

**Dasar hukum:** UU No. 27 Tahun 2022, berlaku penuh sejak Oktober 2024.
**Email penerima:** `TODO:` (O-07, isi di `docs/FAKTA-BISNIS.md`)

Prosedur saat ada permintaan masuk:

```
[ ] 1. Verifikasi identitas pemohon. Jangan pernah mengirim data pribadi ke pihak
       yang belum terverifikasi — itu justru pelanggaran baru.
[ ] 2. Tentukan jenis permintaan: akses / koreksi / penghapusan / penarikan
       persetujuan / keberatan
[ ] 3. Cari seluruh data pemohon: tabel leads, lead_activities, registrations
[ ] 4. AKSES     → ekspor sebagai CSV/PDF, catat di audit_log
       KOREKSI   → perbarui, catat di audit_log
       PENGHAPUSAN → anonimkan (bukan hard delete — leads memakai soft delete),
                     catat di audit_log
[ ] 5. Tanggapi dalam TODO: hari (tetapkan dan cantumkan di Kebijakan Privasi)
[ ] 6. Arsipkan korespondensi
```

**Retensi otomatis:** lead tanpa aktivitas selama 24 bulan dianonimkan oleh cron bulanan (T-311).

---

## 5. Insiden Keamanan

```
[ ] 1. Nilai cakupan: data apa, berapa banyak, sejak kapan
[ ] 2. Hentikan kebocoran (cabut token, nonaktifkan endpoint, aktifkan WAF rule)
[ ] 3. Rotasi SEMUA secret yang mungkin terpapar
[ ] 4. Catat kronologi — waktu, temuan, tindakan
[ ] 5. Kalau menyangkut data pribadi: kewajiban notifikasi UU PDP berlaku.
       Hubungi penasihat hukum.
[ ] 6. Post-mortem tertulis, tanpa mencari kambing hitam. Catat perbaikan
       sistemiknya sebagai ADR kalau mengubah arsitektur.
```

---

## 6. Kontak Darurat

| Peran | Nama | Kontak |
|---|---|---|
| Pemilik proyek / admin teknis | `TODO:` | `TODO:` |
| Penasihat hukum | `TODO:` | `TODO:` |
| Peninjau ahli K3 (O-08) | `TODO:` | `TODO:` |
| Registrar domain | `TODO:` | `TODO:` |
