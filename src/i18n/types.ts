export type SupportedLanguage = 'en' | 'fr' | 'es' | 'de' | 'pt' | 'it' | 'ar';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
];

export interface SeoMeta {
  title: string;
  description: string;
  keywords: string;
  heroTitle: string;
  heroSubtitle: string;
  badgeActive: string;
}

export interface FaqTranslation {
  question: string;
  answer: string;
}

export interface TranslationDictionary {
  seo: SeoMeta;
  nav: {
    activeInbox: string;
    guide: string;
    faq: string;
    noSignup: string;
  };
  card: {
    badgeExpired: string;
    badgeActive: string;
    badgeGmail: string;
    badgeMxActive: string;
    badgeMxConnecting: string;
    timeRemaining: string;
    add10Min: string;
    tempAddressLabel: string;
    copy: string;
    copied: string;
    changeAddress: string;
    registering: string;
    qrCodeTitle: string;
    refresh: string;
    autoRenewLabel: string;
    autoRenewDesc: string;
    manualAdd: string;
    generateNew: string;
    simulateTest: string;
  };
  inboxSelector: {
    title: string;
    subtitle: string;
    newInboxBtn: string;
    currentBadge: string;
    aliasBadge: string;
    deleteTitle: string;
    unreadCount: string;
  };
  list: {
    title: string;
    totalCount: string;
    unreadFilter: string;
    codesFilter: string;
    allFilter: string;
    emptyTitle: string;
    emptyDesc: string;
    waitingPrompt: string;
    otpCode: string;
    copyOtp: string;
    copiedOtp: string;
    gmailRealBadge: string;
  };
  detail: {
    from: string;
    to: string;
    receivedAt: string;
    detectedCode: string;
    copyCode: string;
    tabPreview: string;
    tabText: string;
    deleteMsg: string;
    gmailVerified: string;
  };
  guide: {
    pill: string;
    title: string;
    subtitle: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    casesTitle: string;
    case1Title: string;
    case1Desc: string;
    case2Title: string;
    case2Desc: string;
    case3Title: string;
    case3Desc: string;
    case4Title: string;
    case4Desc: string;
    faqTitle: string;
  };
  faq: FaqTranslation[];
  footer: {
    description: string;
    antiSpam: string;
    gdprCompliant: string;
    free: string;
    legalTitle: string;
    privacyLink: string;
    termsLink: string;
    cookiesLink: string;
    aboutTitle: string;
    aboutLink: string;
    contactLink: string;
    faqLink: string;
    copyright: string;
    complianceNotice: string;
  };
  cookies: {
    title: string;
    description: string;
    learnMore: string;
    essentialLabel: string;
    essentialRequired: string;
    analyticsLabel: string;
    adsLabel: string;
    customize: string;
    reject: string;
    acceptAll: string;
    back: string;
    save: string;
  };
  toasts: {
    addressCopied: string;
    inboxCreated: string;
    newVerifiedAddress: string;
    newEmailsReceived: string;
    inboxExtended: string;
    autoRenewOn: string;
    autoRenewOff: string;
  };
}
