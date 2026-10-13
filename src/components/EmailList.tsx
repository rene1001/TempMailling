import React, { useState } from 'react';
import {
  Inbox,
  KeyRound,
  Check,
  Copy,
  Mail,
  ChevronRight
} from 'lucide-react';
import { TempEmailMessage } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { useLanguage } from '../i18n/LanguageContext';

interface EmailListProps {
  messages: TempEmailMessage[];
  selectedMessageId: string | null;
  onSelectMessage: (message: TempEmailMessage) => void;
  isLoading?: boolean;
}

export const EmailList: React.FC<EmailListProps> = ({
  messages,
  selectedMessageId,
  onSelectMessage,
  isLoading = false,
}) => {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'unread' | 'codes'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    await copyToClipboard(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'unread') return !msg.isRead;
    if (filter === 'codes') return Boolean(msg.verificationCode);
    return true;
  });

  const formatRelativeTime = (timestamp: number) => {
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 60) return lang === 'fr' ? "À l'instant" : "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return new Date(timestamp).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-4">
      {/* Header with filter tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>{t.list.title}</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-medium">
              {messages.length}
            </span>
          </h3>
        </div>

        {messages.length > 0 && (
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {t.list.allFilter}
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === 'unread'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {t.list.unreadFilter} ({messages.filter((m) => !m.isRead).length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('codes')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === 'codes'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {t.list.codesFilter}
            </button>
          </div>
        )}
      </div>

      {/* Messages list */}
      {filteredMessages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 p-12 text-center space-y-3 bg-neutral-50/50 dark:bg-neutral-900/40">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
            <Inbox className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              {messages.length === 0 ? t.list.emptyTitle : t.list.emptyDesc}
            </h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {messages.length === 0
                ? t.list.emptyDesc
                : t.list.emptyTitle}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMessages.map((msg) => {
            const isSelected = msg.id === selectedMessageId;

            return (
              <div
                key={msg.id}
                onClick={() => onSelectMessage(msg)}
                className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-50/80 dark:bg-neutral-850 shadow-sm'
                    : msg.isRead
                    ? 'border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                    : 'border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Unread indicator */}
                  <div className="pt-1 shrink-0">
                    {!msg.isRead ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 block shadow-xs" />
                    ) : (
                      <Mail className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs truncate ${!msg.isRead ? 'font-bold text-neutral-900 dark:text-neutral-50' : 'font-medium text-neutral-700 dark:text-neutral-300'}`}>
                        {msg.senderName || msg.sender}
                      </span>
                      <span className="text-[11px] text-neutral-400 shrink-0">
                        • {formatRelativeTime(msg.receivedAt)}
                      </span>
                    </div>

                    <h4 className={`text-sm truncate ${!msg.isRead ? 'font-semibold text-neutral-900 dark:text-neutral-100' : 'text-neutral-800 dark:text-neutral-200'}`}>
                      {msg.subject || '(No subject)'}
                    </h4>

                    <p className="text-xs text-neutral-500 line-clamp-1">
                      {msg.snippet}
                    </p>
                  </div>
                </div>

                {/* Right side: Verification code highlight badge & Arrow */}
                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  {msg.verificationCode && (
                    <button
                      type="button"
                      onClick={(e) => handleCopyCode(e, msg.verificationCode!)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors font-mono font-semibold text-xs cursor-pointer shadow-xs"
                      title={t.list.copyOtp}
                    >
                      <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                      <span>{msg.verificationCode}</span>
                      {copiedCode === msg.verificationCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-blue-500" />
                      )}
                    </button>
                  )}

                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 hidden md:block" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
