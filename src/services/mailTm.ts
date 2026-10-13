import { TempEmailMessage } from '../types';
import { extractVerificationCode } from './gmail';

const BASE_URL = '/api/mailtm';

export interface MailTmAccountResult {
  address: string;
  token: string;
  accountId: string;
}

/**
 * Fetch available active domains from mail.tm
 */
export async function getMailTmDomains(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/domains`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return ['maxxspace.com'];
    const data = await res.json();
    const members = data['hydra:member'] || [];
    const activeDomains = members
      .filter((d: any) => d.isActive)
      .map((d: any) => d.domain);

    // Prioritize .com domains
    const comDomains = activeDomains.filter((d: string) => d.endsWith('.com'));
    if (comDomains.length > 0) return comDomains;
    return activeDomains.length > 0 ? activeDomains : ['maxxspace.com'];
  } catch (err) {
    console.warn('Failed to fetch mail.tm domains, using fallback', err);
    return ['maxxspace.com'];
  }
}

// In-memory pre-warmed account pool for instant 0ms address switching
let prewarmedAccount: MailTmAccountResult | null = null;
let isPrewarming = false;

/**
 * Direct fast account creation on mail.tm server
 */
export async function directCreateMailTmAccount(
  desiredPrefix?: string,
  chosenDomain?: string
): Promise<MailTmAccountResult | null> {
  try {
    const domain = chosenDomain || 'maxxspace.com';
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const cleanPrefix = desiredPrefix
      ? desiredPrefix.toLowerCase().replace(/[^a-z0-9._-]/g, '')
      : `usr-${Date.now().toString(36)}-${randSuffix}`;

    const address = `${cleanPrefix}@${domain}`;
    const password = 'Password123!';

    // 1. Direct account creation
    const createRes = await fetch(`${BASE_URL}/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ address, password }),
    });

    if (createRes.ok) {
      const accountData = await createRes.json();
      const tokenRes = await fetch(`${BASE_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ address, password }),
      });
      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        return {
          address,
          token: tokenData.token,
          accountId: accountData.id,
        };
      }
    }

    // If custom address already existed (422), attempt immediate login
    if (createRes.status === 422) {
      const tokenRes = await fetch(`${BASE_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ address, password }),
      });
      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        return {
          address,
          token: tokenData.token,
          accountId: tokenData.id,
        };
      }
    }

    // Fallback guaranteed unique creation
    const fallbackAddress = `usr-${Date.now().toString(36)}-${Math.floor(1000 + Math.random() * 9000)}@${domain}`;
    const fallbackRes = await fetch(`${BASE_URL}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ address: fallbackAddress, password }),
    });
    if (fallbackRes.ok) {
      const fbData = await fallbackRes.json();
      const tokenRes = await fetch(`${BASE_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ address: fallbackAddress, password }),
      });
      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        return {
          address: fallbackAddress,
          token: tokenData.token,
          accountId: fbData.id,
        };
      }
    }

    return null;
  } catch (error) {
    console.warn('Direct mail.tm creation error:', error);
    return null;
  }
}

/**
 * Pre-warm the next account in the background so switching is instant
 */
export async function prewarmNextAccount(): Promise<void> {
  if (prewarmedAccount || isPrewarming) return;
  isPrewarming = true;
  try {
    const acct = await directCreateMailTmAccount();
    if (acct) {
      prewarmedAccount = acct;
    }
  } catch (err) {
    console.warn('Pre-warming failed', err);
  } finally {
    isPrewarming = false;
  }
}

/**
 * Create or acquire a verified live account instantly
 */
export async function createMailTmAccount(
  desiredPrefix?: string,
  chosenDomain?: string
): Promise<MailTmAccountResult | null> {
  // If no custom prefix requested and a pre-warmed account is ready, return it INSTANTLY (0ms)
  if (!desiredPrefix && !chosenDomain && prewarmedAccount) {
    const ready = prewarmedAccount;
    prewarmedAccount = null;
    // Immediately pre-warm the next one in the background
    setTimeout(prewarmNextAccount, 300);
    return ready;
  }

  // Otherwise, create directly at maximum speed
  const fresh = await directCreateMailTmAccount(desiredPrefix, chosenDomain);
  // Pre-warm the next one for future switches
  setTimeout(prewarmNextAccount, 300);
  return fresh;
}

/**
 * Fetch real messages received at this mail.tm address
 */
export async function fetchMailTmMessages(
  token: string,
  inboxAddress: string
): Promise<TempEmailMessage[]> {
  try {
    const listRes = await fetch(`${BASE_URL}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!listRes.ok) return [];

    const listData = await listRes.json();
    const members = Array.isArray(listData)
      ? listData
      : Array.isArray(listData['hydra:member'])
      ? listData['hydra:member']
      : [];

    if (members.length === 0) return [];

    // Fetch details for up to 15 recent messages
    const detailPromises = members.slice(0, 15).map(async (item: any) => {
      try {
        const detailRes = await fetch(`${BASE_URL}/messages/${item.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        let detail = item;
        if (detailRes.ok) {
          detail = await detailRes.json();
        }

        const fromAddress = detail.from?.address || item.from?.address || 'inconnu';
        const fromName = detail.from?.name || item.from?.name || fromAddress.split('@')[0];
        const subject = detail.subject || item.subject || '(Sans objet)';
        const text = detail.text || detail.intro || item.intro || '';
        const htmlArray = Array.isArray(detail.html) ? detail.html : [detail.html];
        const html = htmlArray.filter(Boolean).join('\n') || undefined;
        const receivedAt = detail.createdAt ? new Date(detail.createdAt).getTime() : Date.now();
        const verificationCode = extractVerificationCode(`${subject} ${text} ${detail.intro || ''}`);

        const msg: TempEmailMessage = {
          id: `mtm_${detail.id}`,
          inboxAddress,
          sender: fromAddress,
          senderName: fromName,
          subject,
          snippet: detail.intro || text.slice(0, 120),
          bodyText: text,
          bodyHtml: html,
          receivedAt,
          isRead: detail.seen || false,
          verificationCode,
          isGmailReal: false,
        };
        return msg;
      } catch (e) {
        return null;
      }
    });

    const messages = (await Promise.all(detailPromises)).filter(Boolean) as TempEmailMessage[];
    return messages.sort((a, b) => b.receivedAt - a.receivedAt);
  } catch (err) {
    console.warn('Mail.tm fetch messages error:', err);
    return [];
  }
}

/**
 * Delete a message from mail.tm
 */
export async function deleteMailTmMessage(token: string, messageId: string): Promise<boolean> {
  try {
    const cleanId = messageId.replace('mtm_', '');
    const res = await fetch(`${BASE_URL}/messages/${cleanId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
