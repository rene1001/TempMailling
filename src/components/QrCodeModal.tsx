import React from 'react';
import { X, Copy, Check, Mail } from 'lucide-react';

import { copyToClipboard } from '../utils/clipboard';

interface QrCodeModalProps {
  isOpen: boolean;
  address: string;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  address,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=mailto:${encodeURIComponent(
    address
  )}`;

  const handleCopy = async () => {
    await copyToClipboard(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 text-center">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-neutral-500" />
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Scanner l'adresse
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center p-4 bg-white rounded-2xl border border-neutral-150 shadow-inner">
          <img
            src={qrUrl}
            alt={`QR code pour ${address}`}
            width={240}
            height={240}
            className="w-52 h-52 object-contain rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Scannez pour ouvrir l'application mail de votre smartphone avec cette adresse temporaire.
          </p>
          <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-mono text-xs text-neutral-800 dark:text-neutral-200 break-all select-all flex items-center justify-between gap-2">
            <span>{address}</span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors text-neutral-600 dark:text-neutral-300"
              title="Copier l'adresse"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};
