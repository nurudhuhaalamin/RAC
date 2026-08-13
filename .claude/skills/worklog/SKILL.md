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

### Catatan tentang baris Commit

Sebuah entri log **tidak bisa memuat hash commit yang memuat entri itu sendiri** — menuliskan
hash lalu meng-`amend` akan mengubah hashnya lagi, dan begitu seterusnya.

Dua cara yang benar, pilih salah satu:

- **Tulis pesan commit-nya saja**, tanpa hash. `git log` sudah memetakan pesan ke hash.
- **Isi hash di entri berikutnya**, merujuk ke commit sebelumnya yang sudah final.

Jangan pernah menuliskan hash hasil tebakan atau hash yang belum final. Log ini jejak audit —
rujukan yang menunjuk commit tidak ada lebih buruk daripada tidak ada rujukan sama sekali.

### Kalau sesi melewati tengah malam

Hook `check-worklog` memakai **tanggal hari ini**, sehingga sesi panjang yang menyeberangi
tengah malam akan diblokir meski log kemarin sudah lengkap.

Yang benar dilakukan: **buat file hari ini**, isi dengan ringkasan sesi dan penunjuk ke file
kemarin. **Jangan memindahkan entri lama** — entri yang sudah ter-commit bersama kodenya
kehilangan kaitannya kalau dipindah. Biarkan setiap entri di file tempat ia ditulis.

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
