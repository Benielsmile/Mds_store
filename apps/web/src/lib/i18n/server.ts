import 'server-only';
import { cookies } from 'next/headers';
import { locales, defaultLocale, type Locale } from './config';

import en from '../../messages/en.json';
import es from '../../messages/es.json';
import fr from '../../messages/fr.json';
import de from '../../messages/de.json';
import pt from '../../messages/pt.json';
import ja from '../../messages/ja.json';
import zh from '../../messages/zh.json';

// Allow dynamic i18n message access at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Messages = Record<string, any>;

const allMessages: Record<string, Messages> = {
  en: en as Messages, es: es as Messages, fr: fr as Messages,
  de: de as Messages, pt: pt as Messages, ja: ja as Messages, zh: zh as Messages,
};

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value;
  if (locale && (locales as readonly string[]).includes(locale)) {
    return locale as Locale;
  }
  return defaultLocale;
}

export async function getMessages(): Promise<Messages> {
  const locale = await getLocale();
  return allMessages[locale] || allMessages[defaultLocale];
}
