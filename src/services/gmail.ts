import { TempEmailMessage } from '../types';

/**
 * Extract verification code from email subject or body text
 */
export function extractVerificationCode(text: string): string | undefined {
  if (!text) return undefined;

  // Patterns for codes: "code: 123456", "verification code is 482910", "OTP: 9384", "Pin: 39485"
  const keywordMatch = text.match(/(?:code|otp|pin|vérification|activation|secret)[\s:=-]+([0-9]{4,8}|[A-Z0-9]{4,8})\b/i);
  if (keywordMatch && keywordMatch[1]) {
    return keywordMatch[1];
  }

  // Standalone 6-digit code
  const sixDigitMatch = text.match(/\b([0-9]{6})\b/);
  if (sixDigitMatch && sixDigitMatch[1]) {
    return sixDigitMatch[1];
  }

  // Standalone 4 or 5-digit code if flanked by spaces/dashes
  const fourDigitMatch = text.match(/\b([0-9]{4,5})\b/);
  if (fourDigitMatch && fourDigitMatch[1]) {
    return fourDigitMatch[1];
  }

  return undefined;
}

/**
 * Base64url decoder
 */
function decodeBase64Url(data: string): string {
  try {
    const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
    const binStr = atob(base64);
    // Decode UTF-8 bytes properly
    const bytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      bytes[i] = binStr.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch (err) {
    try {
      return atob(data.replace(/-/g, '+').replace(/_/g, '/'));
    } catch {
      return '';
    }
  }
}

/**
 * Recursively find body parts from Gmail message payload
 */
function extractBodyParts(payload: any): { text: string; html?: string } {
  let text = '';
  let html = '';

  if (!payload) return { text, html };

  if (payload.mimeType === 'text/plain' && payload.body?.data) {
    text = decodeBase64Url(payload.body.data);
  } else if (payload.mimeType === 'text/html' && payload.body?.data) {
    html = decodeBase64Url(payload.body.data);
  }

  if (payload.parts && Array.isArray(payload.parts)) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data && !text) {
        text = decodeBase64Url(part.body.data);
      } else if (part.mimeType === 'text/html' && part.body?.data && !html) {
        html = decodeBase64Url(part.body.data);
      } else if (part.parts) {
        const sub = extractBodyParts(part);
        if (sub.text && !text) text = sub.text;
        if (sub.html && !html) html = sub.html;
      }
    }
  }

  if (!text && html) {
    // Basic fallback text from html
    const div = document.createElement('div');
    div.innerHTML = html;
    text = div.textContent || div.innerText || '';
  }

  return { text, html };
}

/**
 * Fetch messages from Gmail for an active address or alias
 */
export async function fetchGmailMessagesForInbox(
  accessToken: string,
  inboxAddress: string
): Promise<TempEmailMessage[]> {
  try {
    // Search query: exact recipient or delivered-to matching
    const q = `to:"${inboxAddress}" OR deliveredto:"${inboxAddress}" OR "${inboxAddress}"`;
    const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(
      q
    )}&maxResults=20`;

    const res = await fetch(listUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('AUTH_EXPIRED');
      }
      console.warn('Gmail list failed:', res.statusText);
      return [];
    }

    const listData = await res.json();
    if (!listData.messages || !Array.isArray(listData.messages)) {
      return [];
    }

    // Fetch details for up to 10 messages
    const messagePromises = listData.messages.slice(0, 10).map(async (item: { id: string }) => {
      try {
        const detailRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=full`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!detailRes.ok) return null;
        const msg = await detailRes.json();

        const headers = msg.payload?.headers || [];
        const fromHeader = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Inconnu';
        const subjectHeader = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(Sans objet)';
        const dateHeader = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value;

        // Parse sender name and email
        const senderMatch = fromHeader.match(/^(.*?)\s*<(.+?)>$/);
        const senderName = senderMatch ? senderMatch[1].replace(/"/g, '').trim() : undefined;
        const senderEmail = senderMatch ? senderMatch[2].trim() : fromHeader;

        const { text, html } = extractBodyParts(msg.payload);
        const snippet = msg.snippet || text.slice(0, 120);
        const verificationCode = extractVerificationCode(`${subjectHeader} ${snippet} ${text}`);
        const receivedAt = dateHeader ? new Date(dateHeader).getTime() : parseInt(msg.internalDate || Date.now(), 10);
        const isRead = !msg.labelIds?.includes('UNREAD');

        const messageItem: TempEmailMessage = {
          id: msg.id,
          inboxAddress,
          sender: senderEmail,
          senderName: senderName || senderEmail.split('@')[0],
          subject: subjectHeader,
          snippet,
          bodyText: text || snippet,
          bodyHtml: html,
          receivedAt: isNaN(receivedAt) ? Date.now() : receivedAt,
          isRead,
          verificationCode,
          isGmailReal: true,
        };

        return messageItem;
      } catch (e) {
        console.error('Error fetching message detail', item.id, e);
        return null;
      }
    });

    const messages = (await Promise.all(messagePromises)).filter(Boolean) as TempEmailMessage[];
    // Sort descending by receivedAt
    return messages.sort((a, b) => b.receivedAt - a.receivedAt);
  } catch (error) {
    console.error('Failed to query Gmail:', error);
    throw error;
  }
}

/**
 * Trash a Gmail message (requires user confirmation before invocation!)
 */
export async function trashGmailMessage(accessToken: string, messageId: string): Promise<boolean> {
  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return res.ok;
}

/**
 * Mark a message as read in Gmail
 */
export async function markGmailMessageAsRead(accessToken: string, messageId: string): Promise<void> {
  try {
    await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        removeLabelIds: ['UNREAD'],
      }),
    });
  } catch (e) {
    console.error('Failed to mark read', e);
  }
}
