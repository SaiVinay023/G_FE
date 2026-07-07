import { deDE, enUS, esES, itIT, nlNL } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';

import { locales } from '../../i18n/routing';
import { ThemeRegistry } from '../../theme';
import { StoreProvider } from '../StoreProvider';
import SupabaseProvider from '../SupabaseProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Project',
  description: 'Building software to manage the modern automotive workshop',
  icons: {
    icon: [{ url: '/favicon.ico' }],
  },
};

export default async function Layout({ children, params }: { children: ReactNode; params: { locale: string } }) {
  const { locale } = await params;
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  setRequestLocale(locale);
  const localization: Record<string, typeof enUS> = {
    en: enUS,
    de: deDE,
    it: itIT,
    es: esES,
    nl: nlNL,
  };

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Toaster position="bottom-center" />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClerkProvider
            appearance={{
              layout: {
                termsPageUrl: 'https://www.project.com/terms-conditions/',
                privacyPageUrl: 'https://www.project.com/privacy-policy/',
                socialButtonsVariant: 'iconButton',
              },
            }}
            localization={localization[locale] ?? enUS}
          >
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <StoreProvider>
                  <SupabaseProvider>
                    <ThemeRegistry>{children}</ThemeRegistry>
                  </SupabaseProvider>
              </StoreProvider>
            </AppRouterCacheProvider>
          </ClerkProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
