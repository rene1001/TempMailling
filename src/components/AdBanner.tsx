import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface AdBannerProps {
  format?: 'horizontal' | 'rectangle' | 'in-feed';
  className?: string;
  adSlot?: string;
  adClient?: string;
}

const AD_LABELS: Record<string, { label: string; placeholderTitle: string; placeholderDesc: string }> = {
  en: {
    label: 'Advertisement',
    placeholderTitle: 'Reserved Ad Space (Google AdSense)',
    placeholderDesc: 'Responsive format • Fully compliant with Google AdSense program policies',
  },
  fr: {
    label: 'Publicité',
    placeholderTitle: 'Espace Publicitaire Réservé (Google AdSense)',
    placeholderDesc: 'Format responsive optimisé • Conforme aux règles du programme Google AdSense',
  },
  es: {
    label: 'Publicidad',
    placeholderTitle: 'Espacio Publicitario Reservado (Google AdSense)',
    placeholderDesc: 'Formato adaptativo • Conforme a las políticas de Google AdSense',
  },
  de: {
    label: 'Werbung',
    placeholderTitle: 'Reservierter Anzeigenbereich (Google AdSense)',
    placeholderDesc: 'Responsives Format • Entspricht den Richtlinien von Google AdSense',
  },
  pt: {
    label: 'Publicidade',
    placeholderTitle: 'Espaço Publicitário Reservado (Google AdSense)',
    placeholderDesc: 'Formato responsivo • Em conformidade com as políticas do Google AdSense',
  },
  it: {
    label: 'Pubblicità',
    placeholderTitle: 'Spazio Pubblicitario Riservato (Google AdSense)',
    placeholderDesc: 'Formato reattivo • Conforme alle norme del programma Google AdSense',
  },
  ar: {
    label: 'إعلان',
    placeholderTitle: 'مساحة إعلانية مخصصة (Google AdSense)',
    placeholderDesc: 'تنسيق متجاوب • متوافق تماماً مع سياسات برنامج Google AdSense',
  },
};

/**
 * Google AdSense Compliant Ad Container
 * Strictly follows AdSense program policies:
 * - Allowed label only: "Advertisement" / "Publicité" (Never "Links", "Resources", or "Partners")
 * - Generous margins to completely prevent accidental clicks
 * - No deceptive styling (distinct background and clear visual boundary)
 * - Auto-responsive container
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  format = 'horizontal',
  className = '',
  adSlot,
  adClient,
}) => {
  const { lang } = useLanguage();
  const strings = AD_LABELS[lang] || AD_LABELS.en;

  return (
    <aside
      aria-label={strings.label}
      className={`my-8 mx-auto w-full max-w-4xl text-center select-none ${className}`}
    >
      {/* Required regulatory label for AdSense policy compliance */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400 dark:text-neutral-500">
          {strings.label}
        </span>
      </div>

      <div
        className={`w-full mx-auto rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 flex flex-col items-center justify-center p-4 transition-colors ${
          format === 'horizontal'
            ? 'min-h-[90px] max-h-[120px]'
            : format === 'rectangle'
            ? 'min-h-[250px] max-w-[336px]'
            : 'min-h-[100px]'
        }`}
      >
        {adClient && adSlot ? (
          // Active AdSense script tag placeholder when credentials are provided
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          // Compliant informative slot container prior to AdSense live tags
          <div className="flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 py-3 px-4">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {strings.placeholderTitle}
            </span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">
              {strings.placeholderDesc}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
