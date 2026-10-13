import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  KeyRound,
  ChevronDown,
  HelpCircle,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const SeoContent: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const { t } = useLanguage();

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqItems = t.faq && t.faq.length > 0 ? t.faq : [];

  return (
    <section aria-labelledby="seo-guide-heading" className="w-full max-w-5xl mx-auto space-y-12 py-8">
      {/* Editorial Hero / Why use Temp Mail */}
      <article className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-6">
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.guide.pill}</span>
          </div>
          <h2 id="seo-guide-heading" className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            {t.guide.title}
          </h2>
          <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
            {t.guide.subtitle}
          </p>
        </header>

        {/* 3 Core pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-850/60 border border-neutral-200/60 dark:border-neutral-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {t.guide.pillar1Title}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t.guide.pillar1Desc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-850/60 border border-neutral-200/60 dark:border-neutral-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {t.guide.pillar2Title}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t.guide.pillar2Desc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-850/60 border border-neutral-200/60 dark:border-neutral-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {t.guide.pillar3Title}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t.guide.pillar3Desc}
            </p>
          </div>
        </div>
      </article>

      {/* Practical Use Cases */}
      <article className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-5">
        <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-neutral-100">
          {t.guide.casesTitle}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
            <FileCheck2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-neutral-900 dark:text-neutral-100 font-semibold block mb-0.5">
                {t.guide.case1Title}
              </strong>
              {t.guide.case1Desc}
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
            <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-neutral-900 dark:text-neutral-100 font-semibold block mb-0.5">
                {t.guide.case2Title}
              </strong>
              {t.guide.case2Desc}
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
            <FileCheck2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-neutral-900 dark:text-neutral-100 font-semibold block mb-0.5">
                {t.guide.case3Title}
              </strong>
              {t.guide.case3Desc}
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
            <FileCheck2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-neutral-900 dark:text-neutral-100 font-semibold block mb-0.5">
                {t.guide.case4Title}
              </strong>
              {t.guide.case4Desc}
            </div>
          </div>
        </div>
      </article>

      {/* Accordion FAQ for Organic Search and User Confidence */}
      <article id="faq-section" className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-6">
        <header className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-neutral-100">
            {t.guide.faqTitle}
          </h3>
        </header>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {faqItems.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-3.5 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs md:text-sm font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="pt-2.5 pr-6 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
};
