import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  const { lang } = useLanguage();
  if (!isOpen) return null;

  const resolvedConfirm = confirmLabel || (lang === 'fr' ? 'Confirmer' : 'Confirm');
  const resolvedCancel = cancelLabel || (lang === 'fr' ? 'Annuler' : 'Cancel');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isDestructive ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
          >
            {resolvedCancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>{resolvedConfirm}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
