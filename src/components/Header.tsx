import React, { useState } from 'react';
import {
  Mail,
  ShieldCheck,
  LogOut,
  HelpCircle,
  X,
  Sparkles,
  User as UserIcon
} from 'lucide-react';
import { User } from 'firebase/auth';
import { OfficialGoogleButton } from './OfficialGoogleButton';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../i18n/LanguageContext';

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogin,
  onLogout,
  isLoggingIn = false,
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <header className="border-b border-neutral-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center shadow-xs">
              <Mail className="w-4 h-4" />
            </div>
            <a href="/" className="font-bold text-base md:text-lg text-neutral-900 dark:text-neutral-50 tracking-tight whitespace-nowrap">
              Temporary Mail
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-600 dark:text-neutral-300">
            <a href="#active-inbox" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
              {t.nav.activeInbox}
            </a>
            <a href="#seo-guide-heading" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
              {t.nav.guide}
            </a>
            <a href="#faq-section" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
              {t.nav.faq}
            </a>
          </nav>

          {/* Zone 3: Primary Action & User Status */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LanguageSelector variant="header" />

            <span className="hidden lg:inline-flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t.nav.noSignup}
            </span>

            <button
              type="button"
              onClick={() => setShowHelp(true)}
              className="p-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
              title="Comment ça marche ?"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Utilisateur'}
                      className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-700 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                      <span className="truncate max-w-[120px]">{user.displayName || 'Connecté'}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate max-w-[140px]">
                      {user.email}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <OfficialGoogleButton
                onClick={onLogin}
                disabled={isLoggingIn}
                text="Lier Gmail (Optionnel)"
              />
            )}
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-base">
                  Fonctionnement de TempMail
                </h3>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-sm text-neutral-600 dark:text-neutral-400">
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800 space-y-1">
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Renouvellement automatique
                </div>
                <p className="text-xs">
                  Activez l'interrupteur sur votre boîte. Lorsque le compte à rebours atteint zéro, la boîte est automatiquement prolongée de 10 minutes sans perte d'adresse ni de messages.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800 space-y-1">
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Intégration Gmail & Alias Réels
                </div>
                <p className="text-xs">
                  En connectant votre compte Google, vous pouvez créer des adresses comme <code className="font-mono bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 rounded text-[11px]">votre.email+temp-1234@gmail.com</code>. Tous les vrais e-mails envoyés par des services externes arriveront en temps réel dans l'application !
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800 space-y-1">
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Accès multi-boîtes instantané
                </div>
                <p className="text-xs">
                  Générez autant de boîtes de réception que nécessaire. Basculez de l'une à l'autre en un seul clic grâce au sélecteur rapide.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
