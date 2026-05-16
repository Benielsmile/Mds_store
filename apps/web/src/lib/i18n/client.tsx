'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { Messages } from './server';

const I18nContext = createContext<Messages | null>(null);

export function I18nProvider({
  messages,
  children,
}: {
  messages: Messages;
  children: ReactNode;
}) {
  return <I18nContext.Provider value={messages}>{children}</I18nContext.Provider>;
}

export function useT() {
  const messages = useContext(I18nContext);
  if (!messages) {
    throw new Error('useT must be used within I18nProvider');
  }

  return function t(path: string, params?: Record<string, string | number>): string {
    const keys = path.split('.');
    let value: unknown = messages;
    for (const key of keys) {
      if (value == null) return path;
      value = (value as Record<string, unknown>)[key];
    }
    if (typeof value !== 'string') return path;
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
    }
    return value;
  };
}
