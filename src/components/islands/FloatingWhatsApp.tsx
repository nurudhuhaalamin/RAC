/**
 * Tombol WhatsApp melayang — PLAN Bab 7.3.
 *
 * Muncul setelah scroll 30%, bisa ditutup, status tutup disimpan di
 * sessionStorage (bukan localStorage: pengunjung yang menutupnya hari ini
 * belum tentu ingin menyembunyikannya selamanya).
 *
 * Dimuat dengan `client:idle` — bukan `client:load`. Tombol ini tidak pernah
 * dibutuhkan pada paint pertama, dan halaman publik dianggarkan < 20 KB JS
 * (PLAN Bab 12.4).
 */

import { useCallback, useEffect, useState } from 'react';

const DISMISS_KEY = 'rac.wa.dismissed';
const SHOW_AFTER_RATIO = 0.3;

type Props = {
  label: string;
  dismissLabel: string;
  message: string;
  /** Nomor tujuan. Diisi dari tabel `settings` di T-310. */
  phone?: string;
};

function readDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    // Mode privasi tertentu melempar saat mengakses sessionStorage.
    // Kegagalan di sini tidak boleh menyembunyikan tombolnya.
    return false;
  }
}

export default function FloatingWhatsApp({ label, dismissLabel, message, phone }: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true); // asumsi tersembunyi sampai terbukti sebaliknya

  useEffect(() => {
    setDismissed(readDismissed());
  }, []);

  useEffect(() => {
    if (dismissed) return;

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      setVisible(window.scrollY / scrollable >= SHOW_AFTER_RATIO);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // Tidak bisa menyimpan preferensi — tombol tetap tersembunyi untuk
      // kunjungan ini, dan itu sudah cukup.
    }
  }, []);

  if (dismissed || !visible) return null;

  // TODO: nomor WhatsApp — docs/FAKTA-BISNIS.md Bab 3 (O-04).
  // Sengaja TIDAK diisi nomor contoh: nomor yang salah lebih buruk daripada
  // tautan yang jelas belum aktif.
  const href = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : '#TODO-nomor-whatsapp';

  return (
    <div className="fixed right-4 bottom-4 z-40 flex items-center gap-2 lg:hidden">
      <a
        href={href}
        className="bg-whatsapp text-brand-950 focus-visible:outline-accent-500 inline-flex min-h-14 items-center gap-2 rounded-full px-5 text-sm font-semibold shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.2.2 2.1 3.2 5.1 4.4 1.9.8 2.6.9 3.5.7.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.5-.3z" />
          <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3C4.1 15 3.7 13.5 3.7 12c0-4.6 3.7-8.3 8.3-8.3s8.3 3.7 8.3 8.3-3.7 8.2-8.3 8.2z" />
        </svg>
        {label}
      </a>

      <button
        type="button"
        onClick={dismiss}
        className="bg-brand-900 text-neutral-0 focus-visible:outline-accent-500 inline-flex h-11 w-11 items-center justify-center rounded-full shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span className="sr-only">{dismissLabel}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
