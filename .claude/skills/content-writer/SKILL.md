---
name: content-writer
description: Aturan penulisan konten untuk situs RAC — pola answer-first, blok TL;DR, penyebutan entitas, dan batas tegas antara merapikan bahasa versus mengarang fakta. Gunakan setiap kali menulis atau menyunting artikel, deskripsi kursus, halaman layanan, atau teks apa pun yang dibaca pengunjung.
---

# Aturan Penulisan Konten — RAC

## Batas peran — baca ini dulu

**Tugas Claude:** struktur, kejelasan, konsistensi istilah, kepatuhan SEO, dan perapian bahasa.

**Claude BUKAN sumber fakta untuk:**

- Regulasi Indonesia, nomor pasal, isi Permenaker, masa berlaku sertifikat
- Harga, durasi kursus, kuota, kebijakan refund
- Nomor lisensi, nomor sertifikat, nama badan penerbit
- Data lapangan perusahaan: jumlah peserta, tingkat kelulusan, jumlah proyek
- Pengalaman, testimoni, atau studi kasus

Ini bukan kehati-hatian berlebihan. Pelatihan keselamatan kerja adalah kategori **YMYL** —
Google menilai akurasinya lebih ketat, dan klien korporat **akan** memverifikasi.

### Yang harus dilakukan saat sebuah fakta tidak tersedia

1. Cek `docs/FAKTA-BISNIS.md` dulu. Itu sumber kebenaran tunggal.
2. Kalau tidak ada di sana: tulis **`TODO: <nama nilai>`** atau **`[SUMBER?]`**.
3. **Jangan** mengisi perkiraan. Jangan mengambil dari mockup. Jangan menyimpulkan dari
   konteks. Jangan menulis angka yang "terlihat masuk akal".

> Angka bulat yang terdengar wajar adalah bentuk karangan paling berbahaya, karena tidak
> memicu kecurigaan siapa pun sampai ada yang memverifikasinya. Saat itu terjadi, bukan
> hanya angka itu yang runtuh — **semua angka lain di halaman yang sama ikut kehilangan
> kepercayaan, termasuk yang benar.**

**Dilarang keras:** menulis pengalaman, data lapangan, atau kredensial seolah-olah milik
perusahaan. Itu harus datang dari pemilik proyek.

---

## Aturan wajib per artikel

### 1. Pola answer-first di setiap subjudul

Setiap artikel dan setiap subjudul dibuka dengan **jawaban langsung dalam 2–3 kalimat**,
baru penjelasan. Paragraf pembuka bertele-tele tidak akan pernah dikutip AI, dan pembaca
yang mencari jawaban akan pergi.

❌ *"Dalam dunia kerja di ketinggian, terdapat berbagai macam sertifikasi yang perlu dipahami..."*
✅ *"TKPK dan TKBT sama-sama sertifikat Kemnaker, tapi TKPK untuk pekerjaan dengan akses tali dan TKBT untuk tanpa akses tali. TKPK berjenjang 1–3, TKBT berjenjang 1–2."*

### 2. Blok TL;DR wajib

**40–60 kata, satu paragraf**, di paling atas. Memuat entitas utama: nama sertifikasi,
nomor regulasi, angka kunci. Disimpan di kolom `articles.tldr`, dirender sebagai blok
visual, dan masuk ke schema.

### 3. Sebut entitas secara eksplisit dan konsisten

AI dan mesin pencari menghubungkan fakta lewat **entitas bernama**, bukan kata ganti.

- ✅ "Permenaker No. 9 Tahun 2016" — ❌ "peraturan tersebut"
- ✅ "Badan Nasional Sertifikasi Profesi (BNSP)" pada penyebutan pertama di **setiap** artikel
- ✅ "rope access" — ❌ "rope-access" (konsisten, tanpa tanda hubung)

### 4. Perbanyak struktur yang mudah diekstrak

Tabel perbandingan, daftar bernomor, blok definisi, FAQ dengan schema. Format inilah yang
paling sering diangkat AI karena batasnya jelas.

### 5. Ambang kuantitatif (PLAN Bab 9.3)

| Metrik | Minimum |
|---|---|
| Artikel pilar | 1.500 kata |
| Artikel pendukung | 800 kata |
| Elemen nilai unik | 3 |
| Gambar orisinal | 2 |
| Internal link keluar | 3 |
| Sumber eksternal berwibawa | 2 |
| Butir FAQ | 3 |
| Blok TL;DR | wajib |
| Nama penulis + kredensial | wajib |
| Peninjau (konten K3/regulasi) | wajib |

### 6. Elemen nilai unik — minimal 3 per artikel

Panjang bukan ukuran kualitas. Artikel 3.000 kata bisa tetap *thin* kalau tidak memberi apa
pun yang tidak bisa didapat di tempat lain. Minimal **tiga** dari:

1. Foto/video asli kegiatan atau fasilitas (bukan stok)
2. Kutipan langsung instruktur bersertifikat, dengan nama dan kredensial
3. Data lapangan sendiri
4. Rujukan regulasi spesifik dengan nomor pasal dan tautan sumber resmi
5. Studi kasus proyek nyata (boleh dianonimkan)
6. Tabel perbandingan atau kalkulator buatan sendiri
7. Checklist/template yang dapat diunduh
8. Diagram atau ilustrasi orisinal

**Elemen 1, 2, 3, dan 5 tidak bisa dikerjakan Claude** — harus datang dari pemilik proyek.

---

## Kepatuhan D-05 dan D-12

**BOLEH:** artikel edukatif netral yang membandingkan IRATA, SPRAT, BNSP, dan Kemnaker.
Halaman berjudul "Rencana Pengembangan: Jalur IRATA & SPRAT". Kalimat "sedang dalam proses
persiapan menjadi *training member* IRATA."

**DILARANG KERAS di seluruh situs:**

- Logo IRATA, SPRAT, Petzl, IRSM, atau ISO dalam bentuk apa pun
- Frasa "sertifikasi IRATA", "training IRATA", "pelatihan IRATA", "IRATA Level 1/2/3"
  sebagai penawaran layanan
- Harga, jadwal, tombol daftar, atau schema `Course` untuk IRATA/SPRAT
- Menyebut IRATA/SPRAT di menu utama atau halaman daftar layanan
- Klaim afiliasi, kemitraan, atau akreditasi dengan Petzl, IRSM, atau ISO 9001

Validator `pnpm check:content` menegakkan ini. **Kalau validator gagal, jangan longgarkan
daftar putihnya — perbaiki kontennya.**

---

## Positioning (A-11)

Keunggulan utama RAC adalah **sertifikat yang diwajibkan hukum Indonesia** — BNSP dan
Kemnaker — bukan pengakuan internasional. Untuk HSE Manager, kontraktor migas, dan facility
manager di Indonesia, kepatuhan regulasi adalah argumen jual yang lebih kuat daripada
deretan logo asing yang tidak bisa diverifikasi.

Jangan menulis copy yang menyiratkan pengakuan global.

## Nada per audiens

| Halaman | Audiens | Fokus |
|---|---|---|
| Pelatihan, artikel karier | Calon peserta | karier, prospek, syarat, biaya |
| Layanan | Facility Manager, Building Owner | risiko, kepatuhan, kelangsungan operasi gedung |
| Artikel regulasi (Klaster C) | HSE Manager | kewajiban hukum, sanksi, prosedur |

Halaman layanan **bukan** tentang karier. Halaman pelatihan **bukan** tentang manajemen gedung.
