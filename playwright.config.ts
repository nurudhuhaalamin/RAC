import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

/**
 * Sebagian lingkungan kontainer sudah menyediakan Chromium di jalur tetap dan
 * memblokir unduhan browser. Kalau binary itu ada, pakai; kalau tidak, biarkan
 * Playwright memakai instalasinya sendiri — yang terjadi di runner CI.
 *
 * Tanpa penanganan ini, versi @playwright/test yang tidak sama dengan build
 * browser yang tersedia akan gagal dengan "Executable doesn't exist".
 */
const PREINSTALLED_CHROMIUM = '/opt/pw-browsers/chromium';
const executablePath = existsSync(PREINSTALLED_CHROMIUM) ? PREINSTALLED_CHROMIUM : undefined;

// Port `wrangler dev`. E2E dijalankan terhadap runtime Workers yang
// SESUNGGUHNYA, bukan dev server Vite — cara ini menangkap masalah tingkat
// adapter (binding, header, SSR) yang disembunyikan dev server.
const PORT = 8788;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], launchOptions: { executablePath } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], launchOptions: { executablePath } },
    },
  ],
  webServer: {
    command: `pnpm build && pnpm preview`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
