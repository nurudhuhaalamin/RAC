#!/usr/bin/env node
/**
 * Penegak log pekerjaan — Rope Access Center (RAC)
 *
 * Dijalankan oleh hook `Stop` di .claude/settings.json.
 * Logikanya (PLAN Bab 17.4):
 *   1. Ada perubahan file di sesi ini?
 *   2. Kalau ya, docs/worklog/<hari-ini>.md ada dan dimodifikasi dalam 30 menit terakhir?
 *   3. Kalau belum, blokir akhir giliran.
 *
 * Exit code 2 = memblokir dan mengirim pesan kembali ke Claude.
 * Instruksi di CLAUDE.md sifatnya anjuran dan bisa terlewat; hook bersifat deterministik.
 */

import { execSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const WINDOW_MINUTES = 30;

function todayStamp() {
  // Waktu lokal, bukan UTC — supaya nama file cocok dengan hari kerja nyata.
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function sh(cmd) {
  return execSync(cmd, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}

/**
 * Apakah ada pekerjaan di sesi ini yang perlu dicatat?
 *
 * Dua sinyal, karena satu saja tidak cukup:
 *   1. Pohon kerja kotor — ada perubahan belum di-commit.
 *   2. Ada commit baru hari ini.
 *
 * Sinyal kedua wajib ada. Tanpanya, alur normal yang justru diperintahkan
 * PLAYBOOK ("commit → push → PR → selesai") akan melewati penegakan ini
 * sepenuhnya: begitu commit dibuat, pohon kerja bersih dan hook lolos diam-diam.
 * Hook yang hanya menangkap kasus "edit lalu berhenti tanpa commit" menjaga
 * justru kasus yang paling jarang terjadi.
 */
function hasChanges() {
  try {
    if (sh('git status --porcelain').length > 0) return true;
    return sh('git log --since="12 hours ago" --oneline').length > 0;
  } catch {
    // Bukan repo git, atau git tidak tersedia. Jangan memblokir karena alasan ini.
    return false;
  }
}

const stamp = todayStamp();
const logRel = `docs/worklog/${stamp}.md`;
const logPath = join(ROOT, logRel);

if (!hasChanges()) {
  process.exit(0); // Tidak ada yang dikerjakan — tidak ada yang perlu dicatat.
}

function block(reason) {
  console.error(
    `${reason}\n\n` +
      `Tambahkan entri ke ${logRel} mengikuti format di ` +
      `.claude/skills/worklog/SKILL.md sebelum mengakhiri giliran.\n\n` +
      `Bagian "Verifikasi" harus memuat hasil nyata (perintah yang dijalankan dan ` +
      `outputnya), bukan klaim "sudah selesai". Kalau tugas gagal, tetap tulis entrinya ` +
      `dengan bagian "Masalah" yang menjelaskan sebabnya.`
  );
  process.exit(2);
}

if (!existsSync(logPath)) {
  block(
    `Log pekerjaan belum ditulis: ${logRel} tidak ada, padahal ada perubahan file di sesi ini.`
  );
}

const ageMinutes = (Date.now() - statSync(logPath).mtimeMs) / 60000;

if (ageMinutes > WINDOW_MINUTES) {
  block(
    `Log pekerjaan ${logRel} ada, tapi terakhir diubah ${Math.round(ageMinutes)} menit lalu ` +
      `(batas ${WINDOW_MINUTES} menit). Pekerjaan di sesi ini belum tercatat.`
  );
}

console.log(`✅ Log pekerjaan terkini: ${logRel}`);
process.exit(0);
