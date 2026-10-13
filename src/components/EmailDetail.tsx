import React, { useState } from 'react';
import {
  X,
  Trash2,
  KeyRound,
  Check,
  Copy,
  Calendar,
  User,
  Mail,
  Code,
  FileText
} from 'lucide-react';
import { TempEmailMessage } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { useLanguage } from '../i18n/LanguageContext';

interface EmailDetailProps {
  message: TempEmailMessage | null;
  onClose: () => void;
  onRequestDelete: (message: TempEmailMessage) => void;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({
  message,
  onClose,
  onRequestDelete,
}) => {
  const { t, lang } = useLanguage();
  const [copiedCode, setCopiedCode] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'text'>('preview');

  if (!message) return null;

  const handleCopyCode = async () => {
    if (!message.verificationCode) return;
    await copyToClipboard(message.verificationCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const formattedDate = new Date(message.receivedAt).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="p-4 sm:p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              <Mail className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono text-neutral-500 truncate">
              {message.inboxAddress}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onRequestDelete(message)}
              className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
              title={t.detail.deleteMsg}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content scroll area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Email Subject & Metadata */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
              {message.subject || '(No subject)'}
            </h2>

            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {message.senderName || t.detail.from}
                </span>
                <span className="text-neutral-500 font-mono truncate">&lt;{message.sender}&gt;</span>
              </div>

              <div className="flex items-center gap-2 text-neutral-500">
                <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Verification Code Spotlight Card */}
          {message.verificationCode && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                    {t.detail.detectedCode}
                  </div>
                  <div className="text-xl sm:text-2xl font-mono font-bold tracking-widest text-neutral-900 dark:text-neutral-50">
                    {message.verificationCode}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>{t.card.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white" />
                    <span>{t.detail.copyCode}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* View toggle (HTML vs Text) */}
          {message.bodyHtml && (
            <div className="flex items-center justify-end gap-1 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'preview'
                    ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>{t.detail.tabPreview}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('text')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'text'
                    ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t.detail.tabText}</span>
              </button>
            </div>
          )}

          {/* Email Body */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 bg-white dark:bg-neutral-900/60 overflow-hidden">
            {viewMode === 'preview' && message.bodyHtml ? (
              <div
                className="prose dark:prose-invert max-w-none text-sm text-neutral-800 dark:text-neutral-200 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: message.bodyHtml }}
              />
            ) : (
              <pre className="whitespace-pre-wrap font-sans text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-normal">
                {message.bodyText || message.snippet}
              </pre>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
