/**
 * Helper metadata — Rope Access Center (RAC)
 *
 * Ambang panjang dari PLAN Bab 8.2 dan Bab 19:
 *   title       50–60 karakter
 *   description 140–160 karakter
 *
 * Di development, pelanggaran diperingatkan di console supaya ketahuan saat
 * menulis. Di production teksnya dipangkas — halaman tetap tayang, tapi
 * peringatannya sudah muncul jauh sebelum itu.
 */

export const TITLE_MIN = 50;
export const TITLE_MAX = 60;
export const DESCRIPTION_MIN = 140;
export const DESCRIPTION_MAX = 160;

export type MetaIssue = {
  field: 'title' | 'description';
  actual: number;
  min: number;
  max: number;
  message: string;
};

/** Memeriksa panjang tanpa mengubah apa pun. Dipakai test dan panel SEO. */
export function checkMetaLength(title: string, description: string): MetaIssue[] {
  const issues: MetaIssue[] = [];

  if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
    issues.push({
      field: 'title',
      actual: title.length,
      min: TITLE_MIN,
      max: TITLE_MAX,
      message: `Title ${title.length} karakter; target ${TITLE_MIN}–${TITLE_MAX}.`,
    });
  }

  if (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX) {
    issues.push({
      field: 'description',
      actual: description.length,
      min: DESCRIPTION_MIN,
      max: DESCRIPTION_MAX,
      message: `Description ${description.length} karakter; target ${DESCRIPTION_MIN}–${DESCRIPTION_MAX}.`,
    });
  }

  return issues;
}

/**
 * Memangkas di batas KATA, bukan di tengah kata, dan menutup dengan elipsis.
 * Memotong di tengah kata menghasilkan cuplikan yang terlihat rusak di hasil
 * pencarian.
 */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(' ');
  const base = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${base.replace(/[.,;:\s]+$/, '')}…`;
}

export function truncateTitle(title: string): string {
  return truncate(title, TITLE_MAX);
}

export function truncateDescription(description: string): string {
  return truncate(description, DESCRIPTION_MAX);
}

/** Memperingatkan di console saat development. Tidak melempar. */
export function warnMetaIssues(pathname: string, title: string, description: string): void {
  if (!import.meta.env?.DEV) return;
  for (const issue of checkMetaLength(title, description)) {
    console.warn(`[seo] ${pathname}: ${issue.message}`);
  }
}
