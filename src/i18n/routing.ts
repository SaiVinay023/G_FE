import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'de', 'es', 'it', 'nl'];
export const defaultLocale = 'en';
export const langaugeSwitcherOptions = [
  {
    langauge: 'English',
    flag: '🇺🇸',
    locale: 'en',
  },
  {
    langauge: 'German',
    flag: '🇩🇪',
    locale: 'de',
  },
  {
    langauge: 'Italian',
    flag: '🇮🇹',
    locale: 'it',
  },
  {
    langauge: 'Spanish',
    flag: '🇪🇸',
    locale: 'es',
  },
  {
    langauge: 'Dutch',
    flag: '🇳🇱',
    locale: 'nl',
  },
];

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
