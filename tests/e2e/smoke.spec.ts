import { expect, test } from '@playwright/test';

/**
 * Smoke test — kerangka halaman berjalan end-to-end.
 *
 * Suite lengkap (alur lead, filter jadwal, consent, keyboard) dibangun di
 * T-219. Yang diuji di sini hanya yang sudah benar-benar ada setelah T-105.
 */

test.describe('kerangka halaman', () => {
  test('beranda ID tayang dengan lang dan judul yang benar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'id-ID');
    await expect(page).toHaveTitle(/Rope Access Center/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('beranda EN tayang dengan lang en', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('tepat satu h1 per halaman', async ({ page }) => {
    for (const path of ['/', '/en/']) {
      await page.goto(path);
      await expect(page.locator('h1'), `${path} tidak punya tepat satu h1`).toHaveCount(1);
    }
  });

  test('skip-link adalah elemen pertama yang bisa difokus', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveAttribute('href', '#main');
  });

  test('pengalih bahasa menuju padanan yang benar', async ({ page }) => {
    await page.goto('/');
    // Slug diterjemahkan, jadi tautan EN harus /en/ — bukan /en tanpa apa-apa
    // atau path Indonesia yang diberi prefix.
    const enLink = page.locator('header a[hreflang="en"]').first();
    await expect(enLink).toHaveAttribute('href', '/en/');

    await page.goto('/en/');
    const idLink = page.locator('header a[hreflang="id"]').first();
    await expect(idLink).toHaveAttribute('href', '/');
  });

  test('footer memuat tahun berjalan, bukan tahun mati', async ({ page }) => {
    await page.goto('/');
    const year = new Date().getFullYear().toString();
    await expect(page.locator('footer')).toContainText(year);
  });

  test('setiap gambar punya alt, width, dan height', async ({ page }) => {
    await page.goto('/');
    const imgs = page.locator('img');
    const n = await imgs.count();
    for (let i = 0; i < n; i++) {
      const img = imgs.nth(i);
      await expect(img).toHaveAttribute('alt', /.*/);
      await expect(img).toHaveAttribute('width', /\d+/);
      await expect(img).toHaveAttribute('height', /\d+/);
    }
  });
});
