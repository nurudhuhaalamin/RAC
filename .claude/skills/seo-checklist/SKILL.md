---
name: seo-checklist
description: Checklist SEO teknis yang wajib dipenuhi setiap halaman publik baru di situs RAC. Gunakan saat membuat atau mengubah halaman publik, komponen SEO, schema JSON-LD, sitemap, atau hreflang.
---

# Checklist SEO Teknis — RAC

Rujukan lengkap: `docs/PLAN.md` Bab 8.2 dan Bab 19.

## Wajib di setiap halaman publik

```
[ ] <title> unik, 50–60 karakter
[ ] <meta name="description"> unik, 140–160 karakter
[ ] <link rel="canonical"> absolut (bukan relatif)
[ ] hreflang untuk id, en, DAN x-default (x-default → versi ID)
[ ] Open Graph lengkap: type, title, description, image, url, locale, site_name
[ ] Twitter Card summary_large_image
[ ] Tepat SATU <h1>; hierarki heading tidak melompat (h2 → h4 dilarang)
[ ] Breadcrumb visual + schema BreadcrumbList (kecuali beranda)
[ ] JSON-LD sesuai jenis halaman, digabung sebagai array @graph dalam satu <script>
[ ] Semua <img> punya alt, width, height
[ ] Minimal 3 internal link keluar
[ ] Ditambahkan ke sitemap yang sesuai
[ ] Versi EN ada, atau ketiadaannya tercatat sengaja (PLAN Bab 8.4)
```

## Peta schema per jenis halaman

| Halaman | Schema |
|---|---|
| Semua | `Organization` + `WebSite` (dengan `SearchAction`) |
| Beranda | `EducationalOrganization`, `LocalBusiness` |
| Halaman kursus | `Course` + array `hasCourseInstance` |
| Halaman jadwal | `ItemList` berisi `CourseInstance` |
| Halaman layanan | `Service` dengan `areaServed` |
| Artikel | `Article` + `Person` (penulis) + `BreadcrumbList` |
| Profil instruktur | `Person` dengan `hasCredential` |
| FAQ | `FAQPage` |
| Kontak | `ContactPage` + `LocalBusiness` |

**`Course` + `CourseInstance` adalah keunggulan kompetitif terbesar proyek ini** — inilah yang
membuat kursus muncul di Google dengan tanggal, lokasi, dan harga langsung di hasil pencarian.
Sangat sedikit training center Indonesia menerapkannya dengan benar.

Aturannya: **digenerate otomatis dari database.** Schema yang ditulis manual akan basi dalam
hitungan minggu, dan schema basi lebih merugikan daripada tidak ada schema.

## Aturan penulisan schema

- Semua generator menerima **data terstruktur**, bukan string HTML
- Tanggal format **ISO 8601**
- URL **selalu absolut**
- Field opsional **dihilangkan** kalau kosong — jangan diisi `null` atau string kosong
- Jangan pernah membuat schema `Course` untuk IRATA/SPRAT (D-05)

## GEO — agar dikutip AI

1. `robots.txt` **mengizinkan** crawler AI: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
   Claude-SearchBot, PerplexityBot, Google-Extended, Bingbot, Applebot-Extended.
   Anda ingin dikutip, bukan disembunyikan.
2. Pola **answer-first** di setiap subjudul.
3. Blok **TL;DR** 40–60 kata di setiap artikel.
4. Struktur yang mudah diekstrak: tabel, daftar bernomor, FAQ berschema.
5. Entitas disebut eksplisit dan konsisten.
6. **HTML bersih, konten tidak bergantung JavaScript.** Tidak ada teks penting yang hanya
   muncul setelah JS jalan. Konten accordion **tetap ada di DOM** meski tertutup secara visual.

`llms.txt` tetap dibuat, tapi **jangan menaruh harapan visibilitas padanya** — riset per 2026
menunjukkan file itu nyaris tidak pernah diambil crawler AI, dan Google menyatakan tidak
berpengaruh pada ranking maupun AI Overviews.

## Jebakan yang sering terjadi

- **Pengalih bahasa yang sekadar menambah `/en`.** Slug diterjemahkan (`/pelatihan/` →
  `/en/training/`), jadi harus lewat `getAlternates()` dari `src/lib/i18n/routes.ts`.
- **Halaman kategori tanpa deskripsi sendiri** — itu thin content.
- **Kanibalisasi keyword**: dua halaman menargetkan focus keyword yang sama. Cek peta keyword.
- **Versi `.md` artikel tanpa `X-Robots-Tag: noindex`** — akan jadi duplikat konten.
- **Halaman `noindex` atau `/dev/` bocor ke sitemap.**
