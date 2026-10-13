import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const STORAGE_KEY = 'tempmail_cookie_consent_v1';

interface CookieBannerProps {
  onOpenPrivacyPolicy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacyPolicy }) => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [adsAllowed, setAdsAllowed] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (status: 'all' | 'essential' | 'custom') => {
    try {
      const payload = {
        status,
        analytics: status === 'all' || (status === 'custom' && analyticsAllowed),
        ads: status === 'all' || (status === 'custom' && adsAllowed),
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 shadow-2xl animate-fade-in"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-amber-500" />
            <h3 id="cookie-banner-title" className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {t.cookies.title}
            </h3>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {t.cookies.description}{' '}
            <button
              onClick={onOpenPrivacyPolicy}
              className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 cursor-pointer"
            >
              {t.cookies.learnMore}
            </button>
            .
          </p>

          {showPreferences && (
            <div className="pt-3 space-y-2 border-t border-neutral-150 dark:border-neutral-800 text-xs">
              <label className="flex items-center justify-between gap-3 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60">
                <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                  {t.cookies.essentialLabel}
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">{t.cookies.essentialRequired}</span>
              </label>

              <label className="flex items-center justify-between gap-3 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 cursor-pointer">
                <span className="text-neutral-700 dark:text-neutral-300">
                  {t.cookies.analyticsLabel}
                </span>
                <input
                  type="checkbox"
                  checked={analyticsAllowed}
                  onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between gap-3 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 cursor-pointer">
                <span className="text-neutral-700 dark:text-neutral-300">
                  {t.cookies.adsLabel}
                </span>
                <input
                  type="checkbox"
                  checked={adsAllowed}
                  onChange={(e) => setAdsAllowed(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 justify-end">
          {!showPreferences ? (
            <>
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="px-3 py-2 text-xs font-medium rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                {t.cookies.customize}
              </button>
              <button
                type="button"
                onClick={() => saveConsent('essential')}
                className="px-3.5 py-2 text-xs font-medium rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                {t.cookies.reject}
              </button>
              <button
                type="button"
                onClick={() => saveConsent('all')}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 shadow-xs transition-colors cursor-pointer"
              >
                {t.cookies.acceptAll}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="px-3 py-2 text-xs font-medium rounded-xl text-neutral-500 hover:text-neutral-700 cursor-pointer"
              >
                {t.cookies.back}
              </button>
              <button
                type="button"
                onClick={() => saveConsent('custom')}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                {t.cookies.save}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
