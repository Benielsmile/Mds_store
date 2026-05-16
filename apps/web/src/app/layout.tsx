import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { ThemeProvider } from '@/lib/theme-context';
import { I18nProvider } from '@/lib/i18n/client';
import { getLocale, getMessages } from '@/lib/i18n/server';
import { locales } from '@/lib/i18n/config';
import LayoutClient from '@/components/LayoutClient';
import JsonLd from '@/components/JsonLd';

const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: {
      default: 'MDS Store — Premium Digital Products',
      template: '%s — MDS Store',
    },
    description:
      'Discover and download high-quality digital products curated for creators and professionals. Instant delivery, secure PayPal checkout.',
    keywords: [
      'digital products',
      'premium templates',
      'creator tools',
      'digital downloads',
      'MDS Store',
    ],
    authors: [{ name: 'MDS Store' }],
    creator: 'MDS Store',
    publisher: 'MDS Store',
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : `${locale}_${locale.toUpperCase()}`,
      siteName: 'MDS Store',
      title: 'MDS Store — Premium Digital Products',
      description:
        'Discover and download high-quality digital products curated for creators and professionals.',
      url: siteUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'MDS Store — Premium Digital Products',
      description:
        'Discover and download high-quality digital products curated for creators and professionals.',
    },
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteUrl}`]),
      ),
      canonical: siteUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={FONTS_URL} rel="stylesheet" />
      </head>
      <body className="font-sans antialiased theme-transition" suppressHydrationWarning>
        <ThemeProvider>
          <I18nProvider messages={messages}>
            <CartProvider>
              <LayoutClient>
                <JsonLd />
                {children}
              </LayoutClient>
            </CartProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
