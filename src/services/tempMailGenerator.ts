import { TempEmailMessage, TempInbox } from '../types';

const RANDOM_ADJECTIVES = ['swift', 'silent', 'amber', 'cyber', 'polar', 'shadow', 'zenith', 'pulse', 'cosmic', 'drift'];
const RANDOM_NOUNS = ['fox', 'hawk', 'spark', 'echo', 'node', 'wave', 'cloud', 'vault', 'pixel', 'byte'];

export const AVAILABLE_DOMAINS = [
  'maxxspace.com',
];

/**
 * Generate a random temporary email address
 */
export function generateRandomAddress(gmailBase?: string): string {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const randAdj = RANDOM_ADJECTIVES[Math.floor(Math.random() * RANDOM_ADJECTIVES.length)];
  const randNoun = RANDOM_NOUNS[Math.floor(Math.random() * RANDOM_NOUNS.length)];
  const code = `${randAdj}-${randNoun}-${randNum}`;

  if (gmailBase && gmailBase.includes('@gmail.com')) {
    const userPart = gmailBase.split('@')[0];
    return `${userPart}+temp-${randNum}@gmail.com`;
  }

  const domain = AVAILABLE_DOMAINS[Math.floor(Math.random() * AVAILABLE_DOMAINS.length)];
  return `${code}@${domain}`;
}

/**
 * Create a new TempInbox object
 */
export function createInbox(
  address: string,
  isGmailAlias: boolean = false,
  autoRenew: boolean = true,
  durationMinutes: number = 10,
  label?: string
): TempInbox {
  const now = Date.now();
  return {
    id: `inbox_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    address,
    label: label || (isGmailAlias ? 'Alias Gmail' : 'Boîte Jetable'),
    createdAt: now,
    expiresAt: now + durationMinutes * 60 * 1000,
    autoRenew,
    renewalDurationMinutes: durationMinutes,
    isGmailAlias,
    unreadCount: 0,
  };
}

/**
 * Generate a realistic sample/test incoming email
 */
export function generateSampleEmail(inboxAddress: string): TempEmailMessage {
  const now = Date.now();
  const templates = [
    {
      senderName: 'Vérification Sécurité',
      sender: 'no-reply@security-auth.net',
      subject: 'Votre code de vérification à 6 chiffres',
      code: `${Math.floor(100000 + Math.random() * 900000)}`,
      bodyGenerator: (code: string) => `Bonjour,

Voici le code de confirmation temporaire demandé pour votre compte :

🔑 CODE : ${code}

Ce code est valable pendant 10 minutes. Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce message.

Cordialement,
L'équipe de Sécurité`,
    },
    {
      senderName: 'Service Inscription',
      sender: 'welcome@service-verify.com',
      subject: 'Bienvenue ! Confirmez votre adresse e-mail',
      code: `${Math.floor(100000 + Math.random() * 900000)}`,
      bodyGenerator: (code: string) => `Merci d'avoir créé un compte !

Pour finaliser votre inscription, veuillez renseigner le code d'activation ci-dessous dans l'application :

👉 ${code}

Votre boîte de réception temporaire ${inboxAddress} est actuellement active.

À très bientôt !`,
    },
    {
      senderName: 'Plateforme Web',
      sender: 'support@cloudaccess.io',
      subject: 'Code d\'accès à usage unique (OTP)',
      code: `${Math.floor(100000 + Math.random() * 900000)}`,
      bodyGenerator: (code: string) => `Bonjour,

Votre mot de passe à usage unique (OTP) pour vous connecter :

[ ${code} ]

Ne partagez jamais ce code avec quiconque.`,
    },
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];
  const bodyText = template.bodyGenerator(template.code);

  return {
    id: `msg_${now}_${Math.random().toString(36).slice(2, 7)}`,
    inboxAddress,
    sender: template.sender,
    senderName: template.senderName,
    subject: template.subject,
    snippet: bodyText.slice(0, 100).replace(/\n/g, ' '),
    bodyText,
    bodyHtml: `<div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
      <h2 style="font-size: 18px; color: #0f172a; margin-bottom: 12px;">${template.subject}</h2>
      <p style="white-space: pre-wrap; font-size: 14px; color: #334155;">${bodyText.replace(template.code, `<strong style="font-size: 20px; color: #2563eb; letter-spacing: 2px; padding: 4px 8px; background: #eff6ff; border-radius: 6px; display: inline-block;">${template.code}</strong>`)}</p>
    </div>`,
    receivedAt: now,
    isRead: false,
    verificationCode: template.code,
    isGmailReal: false,
  };
}
