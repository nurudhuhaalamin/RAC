/**
 * Kamus Bahasa Indonesia — bahasa sumber.
 *
 * Ini acuan tipe: kamus EN wajib memuat SETIAP kunci di sini, kalau tidak
 * TypeScript akan menolak. Lihat `en.ts`.
 */
export const id = {
  common: {
    skipToContent: 'Lewati ke konten',
    menu: 'Menu',
    openMenu: 'Buka menu',
    closeMenu: 'Tutup menu',
    homeAriaLabel: 'Rope Access Center — Beranda',
    languageSwitcher: 'Pilih bahasa',
    switchToIndonesian: 'Bahasa Indonesia',
    switchToEnglish: 'English',
    readMore: 'Selengkapnya',
    required: 'wajib diisi',
    breadcrumb: 'Remah roti',
  },
  nav: {
    ctaWhatsapp: 'Konsultasi WhatsApp',
    company: 'Perusahaan',
    legal: 'Legal',
    contactUs: 'Hubungi Kami',
    mainNavigation: 'Navigasi utama',
    footerNavigation: 'Navigasi footer',
  },
  footer: {
    tagline: 'Training, Certification, & Corporate Services',
    address: 'Alamat',
    phone: 'Telepon',
    email: 'Email',
    openingHours: 'Jam Operasional',
    copyright: 'Rope Access Center. Seluruh hak cipta dilindungi.',
  },
  whatsapp: {
    floatingLabel: 'Konsultasi via WhatsApp',
    dismiss: 'Tutup tombol WhatsApp',
    defaultMessage: 'Halo, saya ingin bertanya tentang pelatihan di Rope Access Center.',
  },
  error: {
    notFoundTitle: 'Halaman tidak ditemukan',
    notFoundBody:
      'Halaman yang Anda cari mungkin sudah dipindahkan atau alamatnya keliru. Coba cari, atau langsung hubungi kami.',
    backHome: 'Kembali ke beranda',
  },
} as const;

/**
 * Bentuk kamus, dengan literal dilebarkan menjadi `string`.
 *
 * `as const` di atas menjaga objek ID tetap immutable, tapi juga membuat setiap
 * nilainya bertipe literal — tanpa pelebaran ini, kamus EN tidak akan pernah
 * bisa memuat teks yang berbeda dari teks Indonesianya.
 */
type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

export type Dictionary = Widen<typeof id>;
