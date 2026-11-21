import { useSettings, type Language } from '@/store/settings';
import { en, type TranslationKey } from './en';
import { hi } from './hi';
import { te } from './te';

const STRINGS: Record<Language, Record<TranslationKey, string>> = { en, hi, te };

// Used for dates, e.g. weekday and month names.
export const LOCALES: Record<Language, string> = { en: 'en-IN', hi: 'hi-IN', te: 'te-IN' };

// The names shown in the language picker, each in its own language.
export const LANGUAGE_NAMES: Record<Language, string> = { en: 'English', hi: 'हिन्दी', te: 'తెలుగు' };

type Values = Record<string, string | number>;

// translate('hi', 'rx.daysLeft', { count: 3 }) -> "3 दिन बाकी"
export function translate(language: Language, key: TranslationKey, values?: Values): string {
  const text = STRINGS[language][key];
  return text.replace(/\{(\w+)\}/g, (match, name: string) => String(values?.[name] ?? match));
}

// For components: re-renders when the language changes.
//   const t = useT();
//   <AppText>{t('bookings.title')}</AppText>
export function useT() {
  const language = useSettings((s) => s.language);
  return (key: TranslationKey, values?: Values) => translate(language, key, values);
}

// For code outside components (date formatting, notifications).
export function t(key: TranslationKey, values?: Values): string {
  return translate(useSettings.getState().language, key, values);
}

export function currentLocale(): string {
  return LOCALES[useSettings.getState().language];
}

export type { TranslationKey };
