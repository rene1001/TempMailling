export interface TempEmailMessage {
  id: string;
  inboxAddress: string;
  sender: string;
  senderName?: string;
  subject: string;
  snippet: string;
  bodyText: string;
  bodyHtml?: string;
  receivedAt: number; // timestamp ms
  isRead: boolean;
  verificationCode?: string;
  isGmailReal?: boolean;
}

export interface TempInbox {
  id: string;
  address: string;
  label?: string;
  createdAt: number;
  expiresAt: number;
  autoRenew: boolean;
  renewalDurationMinutes: number; // default 10
  isGmailAlias: boolean;
  unreadCount: number;
  mailTmToken?: string;
  mailTmAccountId?: string;
}

export interface UserProfile {
  email: string;
  displayName: string | null;
  photoURL: string | null;
}
