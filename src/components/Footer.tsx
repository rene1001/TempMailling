import React from 'react';
import { Mail, Shield, Lock, Cookie, Heart } from 'lucide-react';
import { LegalModalType } from './LegalModals';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface FooterProps {
  onOpenModal: (type: LegalModalType) => void;
  onOpenCookieBanner: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModal, onOpenCookieBanner }) => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-850 mt-16 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-sm">
                <Mail className="w-4 h-4" />
              </div>
              <span className="font-bold text-neutral-900 dark:text-neutral-100 text-base">
                Temporary Mail
              </span>
            </div>
            <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
              {t.footer.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
              <span className="inline-flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                {t.footer.antiSpam}
              </span>
              <span className="inline-flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-blue-500" />
                {t.footer.gdprCompliant}
              </span>
              <span className="inline-flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-red-500" />
                {t.footer.free}
              </span>
            </div>

            <div className="pt-2">
              <LanguageSelector variant="footer" />
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              {t.footer.legalTitle}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('privacy')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  {t.footer.privacyLink}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('terms')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  {t.footer.termsLink}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenCookieBanner}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  <Cookie className="w-3 h-3 text-amber-500" />
                  {t.footer.cookiesLink}
                </button>
              </li>
            </ul>
          </div>

          {/* About & Support */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              {t.footer.aboutTitle}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('about')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  {t.footer.aboutLink}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('contact')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  {t.footer.contactLink}
                </button>
              </li>
              <li>
                <a
                  href="#faq-section"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left block"
                >
                  {t.footer.faqLink}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} Temporary Mail. {t.footer.copyright}</p>
          <p className="text-[11px] text-neutral-400 text-center sm:text-right">
            {t.footer.complianceNotice}
          </p>
        </div>
      </div>
    </footer>
  );
};
