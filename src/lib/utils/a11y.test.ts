import { describe, expect, it } from 'vitest';
import { fieldDescribedBy } from './a11y';

describe('fieldDescribedBy', () => {
  it('mengembalikan undefined kalau tidak ada yang dirujuk', () => {
    // undefined, bukan string kosong — supaya atribut tidak dirender sama sekali.
    expect(fieldDescribedBy('nama')).toBeUndefined();
    expect(fieldDescribedBy('nama', {})).toBeUndefined();
    expect(fieldDescribedBy('nama', { description: false, error: false })).toBeUndefined();
  });

  it('merujuk id deskripsi yang sama dengan yang dirender FormField', () => {
    expect(fieldDescribedBy('wa', { description: true })).toBe('wa-desc');
  });

  it('merujuk id error yang sama dengan yang dirender FormField', () => {
    expect(fieldDescribedBy('wa', { error: true })).toBe('wa-error');
  });

  it('menggabungkan keduanya dengan spasi, deskripsi lebih dulu', () => {
    expect(fieldDescribedBy('wa', { description: true, error: true })).toBe('wa-desc wa-error');
  });
});
