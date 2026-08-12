#!/usr/bin/env node
/**
 * Validator aturan konten — Rope Access Center (RAC)
 *
 * Menegakkan D-05 (PLAN Bab 3), D-12, dan amandemen A-09 secara deterministik.
 * Instruksi di CLAUDE.md sifatnya anjuran dan bisa terlewat; validator ini tidak.
 *
 * Pemeriksaan:
 *   1. Entitas terbatas (IRATA, SPRAT, Petzl, IRSM, ISO 9001) di luar daftar putih
 *   2. Frasa penawaran terlarang — GAGAL bahkan di dalam daftar putih
 *   3. Nama file yang memuat entitas terbatas di public/ dan src/
 *   4. <img> tanpa atribut alt
 *
 * Keluar dengan kode 1 kalau ada pelanggaran. Dipakai sebagai langkah blocking di CI.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative, sep } from 'node:path';

const ROOT = process.cwd();
const RULES_PATH = join(ROOT, 'scripts', 'content-rules.json');

if (!existsSync(RULES_PATH)) {
  console.error(`GAGAL: scripts/content-rules.json tidak ditemukan.`);
  process.exit(1);
}

const rules = JSON.parse(readFileSync(RULES_PATH, 'utf8'));
const violations = [];

/** Normalisasi path ke bentuk POSIX supaya cocok di semua OS. */
const toPosix = (p) => p.split(sep).join('/');

/** Apakah path ini masuk daftar abaikan? */
function isIgnored(relPath) {
  return rules.ignorePaths.some(
    (ig) => relPath === ig || relPath.startsWith(`${ig}/`)
  );
}

/**
 * Apakah file ini ada di daftar putih D-05?
 * Cocok kalau path sama persis, atau berada di bawah direktori yang di-whitelist.
 */
function isWhitelisted(relPath) {
  return rules.whitelist.some(
    (w) => relPath === w.path || relPath.startsWith(`${w.path}/`)
  );
}

function walk(dir, onFile) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = toPosix(relative(ROOT, full));
    if (isIgnored(rel)) continue;
    const st = statSync(full);
    if (st.isDirectory()) walk(full, onFile);
    else onFile(full, rel);
  }
}

function report(file, line, rule, message) {
  violations.push({ file, line, rule, message });
}

// ── Pemeriksaan 3: nama file ────────────────────────────────────────────────
// Sasaran A-09 adalah ASET GAMBAR bermerek pihak lain, bukan file sumber.
// Halaman roadmap yang sah justru WAJIB bernama `rencana-irata-sprat.astro`
// (PLAN Bab 7.1) — memeriksa semua ekstensi akan menggagalkan T-208 selamanya.
function checkFilename(relPath) {
  const ext = extname(relPath).toLowerCase();
  if (!rules.imageExtensions.includes(ext)) return;
  if (isWhitelisted(relPath)) return;

  const base = relPath.split('/').pop().toLowerCase();
  for (const frag of rules.forbiddenFilenameFragments) {
    if (base.includes(frag)) {
      report(
        relPath,
        0,
        'A-09',
        `Nama file gambar memuat "${frag}". Aset bermerek pihak lain tidak boleh ada di repo — tidak ada hubungan resmi (D-12).`
      );
      return;
    }
  }
}

// ── Pemeriksaan 1 & 2: isi file ─────────────────────────────────────────────
function checkContent(relPath, text) {
  const lines = text.split('\n');
  const whitelisted = isWhitelisted(relPath);

  lines.forEach((line, i) => {
    const lineNo = i + 1;

    // 2. Frasa penawaran terlarang — berlaku di mana pun, termasuk daftar putih.
    for (const phrase of rules.forbiddenPhrases) {
      if (line.toLowerCase().includes(phrase.toLowerCase())) {
        report(
          relPath,
          lineNo,
          'D-05/D-12',
          `Frasa penawaran terlarang: "${phrase}". Dilarang di SELURUH situs, termasuk halaman yang masuk daftar putih.`
        );
      }
    }

    // 1. Entitas terbatas di luar daftar putih.
    if (!whitelisted) {
      for (const entity of rules.restrictedEntities) {
        const re = new RegExp(`\\b${entity.replace(/\s+/g, '\\s+')}\\b`, 'i');
        if (re.test(line)) {
          report(
            relPath,
            lineNo,
            'D-05',
            `Entitas terbatas "${entity}" muncul di file yang tidak masuk daftar putih. Tambahkan file ke scripts/content-rules.json HANYA kalau konteksnya benar-benar diizinkan D-05 — kalau tidak, hapus penyebutannya.`
          );
        }
      }
    }

    // 4. <img> tanpa alt.
    if (rules.checkImageAlt) {
      const imgMatches = line.match(/<img\b[^>]*>/gi) || [];
      for (const tag of imgMatches) {
        if (!/\balt\s*=/i.test(tag)) {
          report(
            relPath,
            lineNo,
            'a11y',
            `<img> tanpa atribut alt. Setiap gambar wajib punya alt, width, dan height.`
          );
        }
      }
    }
  });
}

// ── Jalankan ────────────────────────────────────────────────────────────────
let filesScanned = 0;

for (const dir of rules.scanDirs) {
  walk(join(ROOT, dir), (full, rel) => {
    filesScanned++;
    checkFilename(rel);

    const ext = extname(rel).toLowerCase();
    if (rules.imageExtensions.includes(ext) && ext !== '.svg') return; // biner, tak perlu dibaca
    if (!rules.scanExtensions.includes(ext)) return;

    let text;
    try {
      text = readFileSync(full, 'utf8');
    } catch {
      return; // file biner atau tak terbaca — nama filenya sudah dicek di atas
    }
    checkContent(rel, text);
  });
}

// ── Laporan ─────────────────────────────────────────────────────────────────
if (violations.length === 0) {
  console.log(`✅ check:content LULUS — ${filesScanned} file dipindai, 0 pelanggaran.`);
  process.exit(0);
}

console.error(`\n❌ check:content GAGAL — ${violations.length} pelanggaran di ${filesScanned} file dipindai.\n`);

const byFile = new Map();
for (const v of violations) {
  if (!byFile.has(v.file)) byFile.set(v.file, []);
  byFile.get(v.file).push(v);
}

for (const [file, vs] of byFile) {
  console.error(`  ${file}`);
  for (const v of vs) {
    const loc = v.line > 0 ? `baris ${v.line}` : 'nama file';
    console.error(`    ${loc} [${v.rule}] ${v.message}`);
  }
  console.error('');
}

console.error(
  'Aturan ini menyangkut risiko hukum dan reputasi, bukan gaya penulisan.\n' +
  'Baca docs/PLAN.md Bab 3 (D-05) dan docs/DECISIONS.md (D-12).\n' +
  'JANGAN melonggarkan scripts/content-rules.json supaya build hijau — perbaiki kontennya.\n'
);

process.exit(1);
