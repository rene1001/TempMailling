import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { SupportedLanguage } from '../i18n/types';

interface LanguageSelectorProps {
  variant?: 'header' | 'footer';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const { lang, setLang, currentLangInfo, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (code: SupportedLanguage) => {
    setLang(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Sélectionner la langue / Select language"
        className={`inline-flex items-center gap-1.5 rounded-xl font-medium transition-colors cursor-pointer select-none ${
          variant === 'header'
            ? 'px-2.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-750'
            : 'px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850'
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
        <span className="text-base leading-none">{currentLangInfo.flag}</span>
        <span className="hidden sm:inline-block font-semibold uppercase tracking-wider text-[11px]">
          {currentLangInfo.code}
        </span>
        <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mb-2 sm:mb-0 sm:mt-2 w-48 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl py-1.5 z-50 animate-fade-in"
        >
          <div className="px-3 py-1.5 border-b border-neutral-100 dark:border-neutral-800 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            Language / Région
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {languages.map((l) => {
              const isSelected = l.code === lang;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleSelect(l.code)}
                  role="menuitem"
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{l.flag}</span>
                    <span className="text-left font-medium">{l.nativeName}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
