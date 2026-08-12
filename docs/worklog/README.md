# Log Pekerjaan

Satu file per hari kerja, format nama: **`YYYY-MM-DD.md`** (mis. `2026-08-12.md`).
Satu file bisa memuat beberapa entri kalau ada beberapa tugas di hari yang sama.

Format entri: `.claude/skills/worklog/SKILL.md`. Ditulis dalam **Bahasa Indonesia**.

## Kenapa ini ada

1. **Jejak audit** — apa yang berubah, kapan, dan kenapa.
2. **Transfer konteks** — sesi besok membaca log kemarin tanpa perlu dijelaskan ulang.
   Inilah yang membuat `/clear` antar-tugas tidak menghilangkan apa pun yang penting.
3. **Manajemen risiko** — masalah dan asumsi tercatat, bukan menguap bersama konteks.

## Aturan

- **Kalau tugas gagal atau ditinggalkan, entrinya tetap ditulis** — dengan bagian "Masalah"
  yang menjelaskan sebabnya. Kegagalan lebih berharga dicatat daripada keberhasilan: itulah
  yang mencegah sesi berikutnya mengulang jalan buntu yang sama.
- **Bagian "Verifikasi" memuat hasil nyata, bukan klaim.** Tulis "14 lulus, 0 gagal",
  bukan "test lulus".
- **JANGAN PERNAH** menulis nilai rahasia, kredensial, atau data pribadi nyata di log.
- Maksimal 25 baris per entri. Log yang bertele-tele tidak dibaca.

## Penegakan

Hook `Stop` di `.claude/settings.json` menjalankan `scripts/check-worklog.mjs` di akhir setiap
giliran. Kalau ada file berubah tapi log hari ini belum ditulis (atau belum disentuh dalam 30
menit terakhir), hook **memblokir** akhir giliran.

Instruksi di `CLAUDE.md` sifatnya anjuran dan bisa terlewat. Hook bersifat deterministik.

## Rekap mingguan

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
