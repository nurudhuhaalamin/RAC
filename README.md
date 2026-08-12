# Rope Access Center (RAC)

Website training center rope access & jasa perawatan gedung.
**Training, Certification, & Corporate Services.**

> **Status:** Fase 1 — fondasi teknis. Dokumen dan governance sudah terpasang (T-102);
> scaffold aplikasi belum (T-101).

---

## Mulai dari mana

| Kalau Anda ingin… | Baca |
|---|---|
| Memahami keseluruhan proyek | [`docs/PLAN.md`](docs/PLAN.md) |
| Mengerjakan satu tugas | [`docs/PLAYBOOK.md`](docs/PLAYBOOK.md) — 47 tugas, satu sesi per tugas |
| Menyentuh warna, font, atau komponen | [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) — sumber kebenaran visual |
| Tahu kenapa sesuatu diputuskan begitu | [`docs/DECISIONS.md`](docs/DECISIONS.md) |
| **Menulis angka, nomor, harga, atau nama** | [`docs/FAKTA-BISNIS.md`](docs/FAKTA-BISNIS.md) — **satu-satunya sumber** |
| Menangani insiden atau memulihkan data | [`docs/RUNBOOK.md`](docs/RUNBOOK.md) |

## Stack

Astro 7 · TypeScript strict · Tailwind CSS v4 · React 19 (island) · Zod 4 ·
Cloudflare Workers + D1 + KV + R2 · Drizzle ORM · Vitest + Playwright · pnpm

Versi persis dan alasannya: [`docs/DECISIONS.md` ADR-001](docs/DECISIONS.md).

## Perintah

```bash
# Sudah bisa dijalankan sekarang
pnpm check:content      # validator D-05, alt text, nama file terlarang
pnpm check:worklog      # penegak log pekerjaan

# Tersedia setelah T-101 (scaffold)
pnpm dev                # server pengembangan
pnpm typecheck          # TypeScript
pnpm test               # unit test
pnpm test:e2e           # Playwright
pnpm build              # build produksi
pnpm db:generate        # generate migration Drizzle
pnpm db:migrate:local   # terapkan migration ke D1 lokal
```

## Setup pengembangan

```bash
pnpm install
cp .env.example .dev.vars   # lalu isi nilainya — .dev.vars TIDAK di-commit
```

## Aturan yang tidak bisa ditawar

1. **Jangan pernah** deploy atau menjalankan migration ke production dari sesi agen.
   Itu keputusan manusia, dijalankan manual.
2. **Jangan pernah** mengarang angka, nomor lisensi, harga, atau nama.
   Semua dari `docs/FAKTA-BISNIS.md`; kalau belum ada, tulis `TODO:`.
3. **IRATA, SPRAT, Petzl, IRSM, ISO 9001** hanya boleh muncul dalam konteks yang
   diizinkan D-05. Tidak ada satu pun hubungan resmi tertulis (D-12).
   Ditegakkan otomatis oleh `pnpm check:content`.

Aturan lengkap untuk sesi Claude Code: [`CLAUDE.md`](CLAUDE.md).

## Lisensi

Proprietary. Hak cipta Rope Access Center.
