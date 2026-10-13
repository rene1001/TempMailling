import { SupportedLanguage } from './types';

const STORAGE_KEY = 'tempmail_user_lang';
const VALID_LANGS: SupportedLanguage[] = ['en', 'fr', 'es', 'de', 'pt', 'it', 'ar'];

/**
 * Language Detection:
 * English is the primary default language.
 * 1. Checks explicit URL override (?lang=es or #lang=es)
 * 2. Checks user's explicitly saved preference in localStorage
 * 3. Defaults strictly to 'en' (English)
 */
export function detectUserLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en';

  // 1. URL search param or hash
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang')?.toLowerCase();
    if (langParam && VALID_LANGS.includes(langParam as SupportedLanguage)) {
      return langParam as SupportedLanguage;
    }
  } catch {}

  // 2. Local storage preference (if user explicitly selected a language before)
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && VALID_LANGS.includes(saved as SupportedLanguage)) {
      return saved as SupportedLanguage;
    }
  } catch {}

  // 3. Strict default: English
  return 'en';
}

export function persistUserLanguage(lang: SupportedLanguage): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {}
}
