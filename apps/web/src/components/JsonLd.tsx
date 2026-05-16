'use client';

import { useEffect } from 'react';
import { localeNames } from '@/lib/i18n/config';

export default function JsonLd() {
  useEffect(() => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: 'MDS Store',
      description: 'Premium digital products for creators and professionals.',
      url: siteUrl,
      currency: 'USD',
      paymentAccepted: 'PayPal',
      priceRange: '$0.99 - $999.99',
      availableLanguage: Object.values(localeNames),
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'support@mdsstore.com',
      },
    });
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, []);

  return null;
}
