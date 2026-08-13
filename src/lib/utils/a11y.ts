/**
 * Helper aksesibilitas — Rope Access Center (RAC)
 */

/**
 * Menyusun nilai `aria-describedby` untuk sebuah field form.
 *
 * Astro tidak mendukung render-prop, sehingga `FormField.astro` tidak bisa
 * meneruskan nilai ini ke kontrol di dalam slot-nya. Pemanggil memakai helper
 * ini supaya id yang dirujuk selalu cocok dengan id yang benar-benar dirender
 * FormField (`${id}-desc` dan `${id}-error`).
 *
 * Mengembalikan `undefined` — bukan string kosong — kalau tidak ada yang
 * dirujuk, supaya atribut tidak ikut dirender sama sekali.
 */
export function fieldDescribedBy(
  id: string,
  opts: { description?: boolean; error?: boolean } = {}
): string | undefined {
  const ids = [opts.description ? `${id}-desc` : null, opts.error ? `${id}-error` : null].filter(
    (v): v is string => v !== null
  );
  return ids.length > 0 ? ids.join(' ') : undefined;
}
