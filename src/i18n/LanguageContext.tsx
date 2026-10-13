import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SupportedLanguage, LanguageInfo, TranslationDictionary, SUPPORTED_LANGUAGES } from './types';
import { TRANSLATIONS } from './translations';
import { detectUserLanguage, persistUserLanguage } from './detectLocale';

interface LanguageContextType {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  t: TranslationDictionary;
  currentLangInfo: LanguageInfo;
  languages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLanguage>(() => detectUserLanguage());

  const currentLangInfo = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];
  }, [lang]);

  const t = useMemo(() => {
    return TRANSLATIONS[lang] || TRANSLATIONS.en;
  }, [lang]);

  const setLang = (newLang: SupportedLanguage) => {
    setLangState(newLang);
    persistUserLanguage(newLang);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLang);
      window.history.replaceState({}, '', url.toString());
    } catch {}
  };

  // Sync HTML document language, direction, title, and SEO meta tags
  useEffect(() => {
    try {
      document.documentElement.lang = lang;
      document.documentElement.dir = currentLangInfo.dir;

      // Update document title dynamically for international SEO
      document.title = t.seo.title;

      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', t.seo.description);
      }

      // Update OpenGraph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', t.seo.title);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', t.seo.description);

      // Update Twitter tags
      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', t.seo.title);

      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', t.seo.description);
    } catch (e) {
      console.warn('SEO meta update error:', e);
    }
  }, [lang, currentLangInfo, t]);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t,
        currentLangInfo,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
