import React, { useState } from 'react';
import { X, Plus, Sparkles, RefreshCw } from 'lucide-react';
import { AVAILABLE_DOMAINS } from '../services/tempMailGenerator';
import { useLanguage } from '../i18n/LanguageContext';

interface NewInboxModalProps {
  isOpen: boolean;
  gmailUserEmail?: string;
  onClose: () => void;
  onCreate: (address: string, isGmailAlias: boolean, autoRenew: boolean, durationMinutes: number, label?: string) => void;
}

export const NewInboxModal: React.FC<NewInboxModalProps> = ({
  isOpen,
  gmailUserEmail,
  onClose,
  onCreate,
}) => {
  const { lang } = useLanguage();
  const isFrench = lang === 'fr';

  const [mode, setMode] = useState<'random' | 'custom'>('random');
  const [customPrefix, setCustomPrefix] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(AVAILABLE_DOMAINS[0]);
  const [useGmail, setUseGmail] = useState(Boolean(gmailUserEmail));
  const [autoRenew, setAutoRenew] = useState(true);
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [label, setLabel] = useState('');

  if (!isOpen) return null;

  const userBase = gmailUserEmail ? gmailUserEmail.split('@')[0] : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalAddress = '';
    const isGmailAlias = useGmail && Boolean(gmailUserEmail);

    if (isGmailAlias) {
      const cleanPrefix = (customPrefix.trim() || `temp-${Math.floor(1000 + Math.random() * 9000)}`)
        .replace(/[^a-zA-Z0-9_-]/g, '');
      finalAddress = `${userBase}+${cleanPrefix}@gmail.com`;
    } else {
      if (mode === 'custom' && customPrefix.trim()) {
        const clean = customPrefix.trim().toLowerCase().replace(/[^a-zA-Z0-9._-]/g, '');
        finalAddress = `${clean}@${selectedDomain}`;
      } else {
        const randNum = Math.floor(1000 + Math.random() * 9000);
        finalAddress = `drop-${randNum}@${selectedDomain}`;
      }
    }

    onCreate(finalAddress, isGmailAlias, autoRenew, durationMinutes, label.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-base">
                {isFrench ? 'Nouvelle boîte de réception' : 'New Temporary Inbox'}
              </h3>
              <p className="text-xs text-neutral-500">
                {isFrench ? 'Créer une adresse jetable dédiée' : 'Create a dedicated disposable address'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {gmailUserEmail && (
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-neutral-200 dark:border-neutral-700/60">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {isFrench ? 'Utiliser un alias Gmail réel' : 'Use a verified Gmail alias'}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {userBase}+[tag]@gmail.com
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={useGmail}
                  onChange={(e) => setUseGmail(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-300"
                />
              </label>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setMode('random')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'random'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isFrench ? 'Aléatoire rapide' : 'Fast Random'}
            </button>
            <button
              type="button"
              onClick={() => setMode('custom')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'custom'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              {isFrench ? 'Personnalisé' : 'Custom Prefix'}
            </button>
          </div>

          {mode === 'custom' && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                {useGmail && gmailUserEmail
                  ? (isFrench ? "Tag d'alias Gmail (+tag)" : 'Gmail alias tag (+tag)')
                  : (isFrench ? "Préfixe de l'adresse" : 'Address prefix')}
              </label>
              <div className="flex items-center gap-2">
                {useGmail && gmailUserEmail ? (
                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                    {userBase}+
                  </span>
                ) : null}
                <input
                  type="text"
                  value={customPrefix}
                  onChange={(e) => setCustomPrefix(e.target.value)}
                  placeholder={useGmail ? 'e.g. signup, test, newsletter' : 'e.g. test, contact, shop'}
                  className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400"
                />
                {!useGmail && (
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="px-2.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-800 dark:text-neutral-200"
                  >
                    {AVAILABLE_DOMAINS.map((dom) => (
                      <option key={dom} value={dom}>
                        @{dom}
                      </option>
                    ))}
                  </select>
                )}
                {useGmail && gmailUserEmail && (
                  <span className="text-xs font-mono text-neutral-500">@gmail.com</span>
                )}
              </div>
            </div>
          )}

          {/* Label / purpose */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
              {isFrench ? 'Nom / Étiquette (optionnel)' : 'Label / Purpose (Optional)'}
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={isFrench ? 'ex: Inscription Spotify, Test API...' : 'e.g. Spotify signup, API test, Forum...'}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-neutral-400"
            />
          </div>

          {/* Duration selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
              {isFrench ? 'Durée initiale' : 'Initial Duration'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 30, 60].map((min) => (
                <button
                  type="button"
                  key={min}
                  onClick={() => setDurationMinutes(min)}
                  className={`py-1.5 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                    durationMinutes === min
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-transparent shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {min} min
                </button>
              ))}
            </div>
          </div>

          {/* Auto Renew Switch */}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <RefreshCw className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {isFrench ? 'Renouvellement automatique' : 'Continuous Auto-Renewal'}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {isFrench
                      ? `Prolonge automatiquement la boîte de ${durationMinutes} min à expiration`
                      : `Automatically extends timer by ${durationMinutes} min before expiry`}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-500 border-neutral-300"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
            >
              {isFrench ? 'Annuler' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 rounded-xl transition-all shadow-xs cursor-pointer active:scale-98"
            >
              {isFrench ? 'Créer la boîte' : 'Create Inbox'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
