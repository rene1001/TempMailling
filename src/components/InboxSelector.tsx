import React from 'react';
import { Plus, Trash2, Mail, RefreshCw, Clock } from 'lucide-react';
import { TempInbox } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface InboxSelectorProps {
  inboxes: TempInbox[];
  activeInboxId: string;
  onSelectInbox: (id: string) => void;
  onRequestDeleteInbox: (inbox: TempInbox) => void;
  onOpenNewInboxModal: () => void;
}

export const InboxSelector: React.FC<InboxSelectorProps> = ({
  inboxes,
  activeInboxId,
  onSelectInbox,
  onRequestDeleteInbox,
  onOpenNewInboxModal,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {t.inboxSelector.title} ({inboxes.length})
          </h2>
        </div>
        <button
          type="button"
          onClick={onOpenNewInboxModal}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.inboxSelector.newInboxBtn}</span>
        </button>
      </div>

      {/* Horizontal scrollable / wrap grid of quick access inboxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {inboxes.map((inbox) => {
          const isActive = inbox.id === activeInboxId;
          const isExpired = inbox.expiresAt <= Date.now();
          const remainingMin = Math.max(0, Math.ceil((inbox.expiresAt - Date.now()) / 60000));

          return (
            <div
              key={inbox.id}
              onClick={() => onSelectInbox(inbox.id)}
              className={`group relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-md ring-2 ring-neutral-900/10 dark:ring-neutral-100/10'
                  : 'bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50/50 dark:hover:bg-neutral-850'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      isActive
                        ? 'bg-white/15 dark:bg-black/10'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-xs font-mono font-medium truncate ${
                      isActive ? 'text-white dark:text-neutral-900' : 'text-neutral-900 dark:text-neutral-100'
                    }`}
                  >
                    {inbox.address}
                  </span>
                </div>

                {/* Delete button (triggering confirmation) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestDeleteInbox(inbox);
                  }}
                  className={`p-1 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer ${
                    isActive
                      ? 'hover:bg-white/20 text-white/80 hover:text-white dark:hover:bg-black/10 dark:text-neutral-700 dark:hover:text-neutral-900'
                      : 'hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 text-neutral-400'
                  }`}
                  title={t.inboxSelector.deleteTitle}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Status footer */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <div className="flex items-center gap-1.5">
                  {inbox.autoRenew ? (
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        isActive ? 'text-emerald-300 dark:text-emerald-700' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                      title={t.card.autoRenewLabel}
                    >
                      <RefreshCw className="w-3 h-3" />
                      {t.card.autoRenewLabel}
                    </span>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-1 ${
                        isActive ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-500'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {isExpired ? t.card.badgeExpired : `${remainingMin} min`}
                    </span>
                  )}
                </div>

                {inbox.unreadCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
                    }`}
                  >
                    {inbox.unreadCount} {t.inboxSelector.unreadCount}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
