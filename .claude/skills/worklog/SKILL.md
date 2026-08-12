---
name: worklog
description: Menulis log pekerjaan setelah setiap tugas selesai. Gunakan setiap kali sebuah tugas dinyatakan selesai, sebelum mengakhiri giliran, dan sebelum commit.
---

# Aturan Log Pekerjaan

Setelah **SETIAP** tugas selesai, tambahkan entri ke `docs/worklog/YYYY-MM-DD.md`
(buat file baru kalau belum ada, memakai tanggal hari ini).

Gunakan format persis di bawah. Ringkas — **maksimal 25 baris per entri**.
Log yang bertele-tele tidak akan dibaca, dan log yang tidak dibaca tidak berguna.

## Format

```markdown
### [HH:MM] <Judul tugas>

**Tujuan:** Satu kalimat tentang apa yang ingin dicapai.

**Yang dikerjakan:**
- Poin-poin perubahan nyata

**File berubah:**
- `path/ke/file.ts` — apa yang berubah

**Keputusan teknis:**
- Keputusan yang diambil dan alasannya. Tulis "tidak ada" kalau memang tidak ada.

**Verifikasi:**
- Perintah yang dijalankan dan hasilnya (lulus/gagal, dengan angka)

**Masalah / catatan:**
- Hal yang tidak berjalan mulus, atau asumsi yang diambil
- Utang teknis yang sengaja ditinggalkan

**Berikutnya:**
- Langkah lanjutan yang logis, kalau ada

**Commit:** `<hash pendek>` — `<pesan commit>`
```

## Aturan tambahan

- **JANGAN PERNAH** menulis nilai rahasia, kredensial, atau data pribadi nyata di log.
- **Kalau tugas gagal atau ditinggalkan, tetap tulis entrinya**, dengan bagian "Masalah"
  yang menjelaskan sebabnya. Kegagalan lebih berharga dicatat daripada keberhasilan —
  itulah yang mencegah sesi berikutnya mengulang jalan buntu yang sama.
- **Bagian "Verifikasi" harus memuat hasil nyata, bukan klaim.** Tulis "14 lulus, 0 gagal",
  bukan "test lulus". Kalau ada yang gagal, tulis gagal.
- Kalau sebuah keputusan mengubah arsitektur, catat juga di `docs/DECISIONS.md` sebagai ADR
  dan rujuk dari sini.
- Log ditulis dalam **Bahasa Indonesia**.

## Kenapa ini ada

Log melayani tiga hal sekaligus:

1. **Jejak audit** — apa yang berubah, kapan, dan kenapa.
2. **Transfer konteks** — sesi besok membaca log kemarin tanpa perlu dijelaskan ulang.
   Ini yang membuat `/clear` antar-tugas tidak menghilangkan apa pun yang penting.
3. **Manajemen risiko** — masalah dan asumsi tercatat, bukan menguap bersama konteks.
