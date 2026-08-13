import type { Dictionary } from './id';

/**
 * English dictionary.
 *
 * Typed as `Dictionary`, so a missing or misspelled key is a COMPILE ERROR
 * rather than Indonesian text silently appearing on an English page.
 *
 * PLAN Bab 8.4: no raw machine translation is ever published. Every string
 * here is written deliberately.
 */
export const en: Dictionary = {
  common: {
    skipToContent: 'Skip to content',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    homeAriaLabel: 'Rope Access Center — Home',
    languageSwitcher: 'Choose language',
    switchToIndonesian: 'Bahasa Indonesia',
    switchToEnglish: 'English',
    readMore: 'Read more',
    required: 'required',
    breadcrumb: 'Breadcrumb',
  },
  nav: {
    ctaWhatsapp: 'WhatsApp Consultation',
    company: 'Company',
    legal: 'Legal',
    contactUs: 'Contact Us',
    mainNavigation: 'Main navigation',
    footerNavigation: 'Footer navigation',
  },
  footer: {
    tagline: 'Training, Certification, & Corporate Services',
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    openingHours: 'Opening Hours',
    copyright: 'Rope Access Center. All rights reserved.',
  },
  whatsapp: {
    floatingLabel: 'Chat on WhatsApp',
    dismiss: 'Dismiss WhatsApp button',
    defaultMessage: 'Hello, I would like to ask about training at Rope Access Center.',
  },
  error: {
    notFoundTitle: 'Page not found',
    notFoundBody:
      'The page you are looking for may have moved, or the address is incorrect. Try searching, or contact us directly.',
    backHome: 'Back to home',
  },
};
