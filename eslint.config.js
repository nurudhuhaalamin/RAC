import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'dist/',
      '.astro/',
      '.wrangler/',
      'node_modules/',
      'db/migrations/',
      'playwright-report/',
      'test-results/',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['**/*.{ts,tsx,astro}'],
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      // CLAUDE.md: dilarang `any` — pakai `unknown` lalu persempit.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // consistent-type-imports sengaja TIDAK dipakai: aturan itu butuh info tipe
      // yang tidak diteruskan astro-eslint-parser, dan `verbatimModuleSyntax: true`
      // di tsconfig sudah menegakkan hal yang sama saat kompilasi.
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
    },
  },
  {
    files: ['**/*.tsx'],
    rules: { ...jsxA11y.flatConfigs.recommended.rules },
  },
  {
    // Skrip Node dan file konfigurasi: global Node tersedia, console diizinkan.
    files: ['scripts/**/*.mjs', '*.config.{js,mjs,ts}', 'db/**/*.ts', 'tests/**/*.ts'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-console': 'off' },
  },
  {
    // Pola standar Astro: App.Locals memperluas Runtime tanpa anggota tambahan.
    files: ['src/env.d.ts'],
    rules: { '@typescript-eslint/no-empty-object-type': 'off' },
  }
);
