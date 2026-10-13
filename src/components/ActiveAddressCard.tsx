import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  QrCode,
  RefreshCw,
  PlusCircle,
  Clock,
  Sparkles,
  Send,
  ShieldCheck,
  AlertCircle,
  Shuffle
} from 'lucide-react';
import { TempInbox } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { useLanguage } from '../i18n/LanguageContext';

interface ActiveAddressCardProps {
  inbox: TempInbox;
  onCopyAddress: (address: string) => void;
  onToggleAutoRenew: (inboxId: string) => void;
  onExtend10Min: (inboxId: string) => void;
  onOpenQrCode: () => void;
  onGenerateNewRandom: () => void;
  onSimulateIncomingEmail: () => void;
  onManualRefresh: () => void;
  isRefreshing?: boolean;
  isGenerating?: boolean;
}

export const ActiveAddressCard: React.FC<ActiveAddressCardProps> = ({
  inbox,
  onCopyAddress,
  onToggleAutoRenew,
  onExtend10Min,
  onOpenQrCode,
  onGenerateNewRandom,
  onSimulateIncomingEmail,
  onManualRefresh,
  isRefreshing = false,
  isGenerating = false,
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [timeLeftMs, setTimeLeftMs] = useState<number>(Math.max(0, inbox.expiresAt - Date.now()));

  // Local ticker for the countdown display
  useEffect(() => {
    const updateCountdown = () => {
      setTimeLeftMs(Math.max(0, inbox.expiresAt - Date.now()));
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [inbox.expiresAt]);

  const handleCopy = async () => {
    await copyToClipboard(inbox.address);
    onCopyAddress(inbox.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const minutes = Math.floor(timeLeftMs / 60000);
  const seconds = Math.floor((timeLeftMs % 60000) / 1000);
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isExpired = timeLeftMs <= 0;
  const totalDurationMs = inbox.renewalDurationMinutes * 60 * 1000;
  const progressRatio = Math.min(1, Math.max(0, timeLeftMs / totalDurationMs));

  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all">
      {/* Subtle top progress bar */}
      <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            isExpired
              ? 'bg-red-500'
              : timeLeftMs < 120000
              ? 'bg-amber-500'
              : 'bg-emerald-500 dark:bg-emerald-400'
          }`}
          style={{ width: `${isExpired ? 100 : progressRatio * 100}%` }}
        />
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Top meta row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium">
              <span className={`w-2 h-2 rounded-full ${isExpired ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
              {isExpired ? t.card.badgeExpired : t.card.badgeActive}
            </span>

            {inbox.isGmailAlias ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.card.badgeGmail}
              </span>
            ) : inbox.mailTmToken ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium text-[11px] border border-emerald-200/60 dark:border-emerald-850">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t.card.badgeMxActive}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium text-[11px] border border-amber-200/60 dark:border-amber-850">
                <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                {t.card.badgeMxConnecting}
              </span>
            )}

            {inbox.label && (
              <span className="text-neutral-500 truncate max-w-[150px]">
                {inbox.label}
              </span>
            )}
          </div>

          {/* Expiration timer display */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs font-semibold ${
                isExpired
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                  : timeLeftMs < 120000
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isExpired ? `00:00 (${t.card.badgeExpired})` : formattedTime}</span>
            </div>

            <button
              onClick={() => onExtend10Min(inbox.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer"
              title={t.card.add10Min}
            >
              <PlusCircle className="w-3.5 h-3.5 text-neutral-500" />
              {t.card.add10Min}
            </button>
          </div>
        </div>

        {/* Central Address Display */}
        <div className="space-y-2">
          <label className="text-xs font-medium tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
            {t.card.tempAddressLabel}
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 md:p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750">
            <div className="font-mono text-base md:text-lg lg:text-xl font-semibold text-neutral-900 dark:text-neutral-50 select-all break-all sm:truncate">
              {inbox.address}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap justify-end">
              <button
                type="button"
                onClick={handleCopy}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all shadow-xs cursor-pointer active:scale-95 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 text-white'
                }`}
                title={t.card.copy}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t.card.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{t.card.copy}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onGenerateNewRandom}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 text-neutral-800 dark:text-neutral-100 text-xs md:text-sm font-medium transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-60"
                title={t.card.changeAddress}
              >
                <Shuffle className={`w-4 h-4 text-blue-600 dark:text-blue-400 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? t.card.registering : t.card.changeAddress}</span>
              </button>

              <button
                type="button"
                onClick={onOpenQrCode}
                className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title={t.card.qrCodeTitle}
              >
                <QrCode className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onManualRefresh}
                className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title={t.card.refresh}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Feature: Renouvellement automatique Toggle & Actions Bar */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Automatic renewal toggle option */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={inbox.autoRenew}
              onClick={() => onToggleAutoRenew(inbox.id)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                inbox.autoRenew ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  inbox.autoRenew ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>

            <div className="cursor-pointer" onClick={() => onToggleAutoRenew(inbox.id)}>
              <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <span>{t.card.autoRenewLabel}</span>
                {inbox.autoRenew ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {t.card.badgeActive}
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-medium tracking-wider px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                    {t.card.badgeExpired}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500">
                {inbox.autoRenew
                  ? `${t.card.autoRenewDesc} (${inbox.renewalDurationMinutes} min)`
                  : t.card.timeRemaining}
              </p>
            </div>
          </div>

          {/* Quick simulation / action tools */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={onSimulateIncomingEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 transition-colors cursor-pointer"
              title={t.card.simulateTest}
            >
              <Send className="w-3.5 h-3.5 text-blue-500" />
              <span>{t.card.simulateTest}</span>
            </button>

            <button
              type="button"
              onClick={onGenerateNewRandom}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer"
              title={t.card.generateNew}
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
              <span>{t.card.generateNew}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
