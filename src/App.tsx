import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
} from './services/auth';
import {
  fetchGmailMessagesForInbox,
  trashGmailMessage,
  markGmailMessageAsRead,
} from './services/gmail';
import {
  generateRandomAddress,
  createInbox,
  generateSampleEmail,
} from './services/tempMailGenerator';
import {
  createMailTmAccount,
  fetchMailTmMessages,
  deleteMailTmMessage,
  prewarmNextAccount,
} from './services/mailTm';
import { TempEmailMessage, TempInbox } from './types';
import { Header } from './components/Header';
import { ActiveAddressCard } from './components/ActiveAddressCard';
import { InboxSelector } from './components/InboxSelector';
import { EmailList } from './components/EmailList';
import { EmailDetail } from './components/EmailDetail';
import { NewInboxModal } from './components/NewInboxModal';
import { QrCodeModal } from './components/QrCodeModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { AdBanner } from './components/AdBanner';
import { SeoContent } from './components/SeoContent';
import { Footer } from './components/Footer';
import { LegalModals, LegalModalType } from './components/LegalModals';
import { CookieBanner } from './components/CookieBanner';
import { Bell, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from './i18n/LanguageContext';

const STORAGE_KEY_INBOXES = 'tempmail_inboxes_v4';
const STORAGE_KEY_ACTIVE = 'tempmail_active_id_v4';
const STORAGE_KEY_MESSAGES = 'tempmail_messages_v4';

export default function App() {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [inboxes, setInboxes] = useState<TempInbox[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_INBOXES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((inbox: TempInbox) => {
            if (!inbox.isGmailAlias && !inbox.address.endsWith('@maxxspace.com')) {
              const userPart = inbox.address.split('@')[0];
              return {
                ...inbox,
                address: `${userPart}@maxxspace.com`,
                mailTmToken: undefined,
              };
            }
            return inbox;
          });
        }
      }
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    const initial = createInbox('usr-' + Math.floor(1000 + Math.random() * 9000) + '@maxxspace.com', false, true, 10);
    return [initial];
  });

  const [activeInboxId, setActiveInboxId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTIVE);
      if (stored && inboxes.some((i) => i.id === stored)) return stored;
    } catch {}
    return inboxes[0]?.id || '';
  });

  const [messages, setMessages] = useState<TempEmailMessage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    const initialAddress = inboxes[0]?.address || 'usr-2567@maxxspace.com';
    const welcomeMsg: TempEmailMessage = {
      id: `welcome_${Date.now()}`,
      inboxAddress: initialAddress,
      sender: 'welcome@temporary-mail.org',
      senderName: 'Temporary Mail',
      subject: 'Your temporary inbox is ready (Test code: 749201)',
      snippet: 'Welcome! Your disposable inbox is operational and ready to receive live incoming emails.',
      bodyText: `Hello,\n\nYour temporary inbox ${initialAddress} is now active and ready.\n\n🔑 Test verification code: 749201\n\nYou can copy this code with 1 click or test receiving real emails sent from any external email service.\n\nEnjoy!`,
      bodyHtml: `<div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <h2 style="font-size: 18px; color: #0f172a; margin-bottom: 12px;">Welcome to Temporary Mail!</h2>
        <p>Your temporary inbox <strong style="color: #2563eb;">${initialAddress}</strong> is active and ready to receive incoming emails live.</p>
        <div style="margin: 20px 0; padding: 16px; background: #eff6ff; border-radius: 12px; border: 1px solid #bfdbfe;">
          <div style="font-size: 12px; color: #1d4ed8; font-weight: 600; text-transform: uppercase;">Extracted verification code:</div>
          <div style="font-size: 26px; font-family: monospace; font-weight: bold; color: #1e40af; letter-spacing: 3px;">749201</div>
        </div>
        <p style="font-size: 13px; color: #64748b;">Tip: Click "Test an email" to generate sample OTP emails or send a real email from Gmail/Outlook.</p>
      </div>`,
      receivedAt: Date.now(),
      isRead: false,
      verificationCode: '749201',
      isGmailReal: false,
    };
    return [welcomeMsg];
  });

  // UI state
  const [selectedMessage, setSelectedMessage] = useState<TempEmailMessage | null>(null);
  const [isNewInboxModalOpen, setIsNewInboxModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGeneratingNew, setIsGeneratingNew] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);
  const [cookieBannerKey, setCookieBannerKey] = useState(0);

  // Confirmation modal state for destructive operations
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const activeInbox = inboxes.find((i) => i.id === activeInboxId) || inboxes[0];

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  }, []);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INBOXES, JSON.stringify(inboxes));
    } catch {}
  }, [inboxes]);

  useEffect(() => {
    try {
      if (activeInboxId) {
        localStorage.setItem(STORAGE_KEY_ACTIVE, activeInboxId);
      }
    } catch {}
  }, [activeInboxId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Ensure active non-gmail inbox has an active mail.tm live account token
  useEffect(() => {
    if (activeInbox && !activeInbox.isGmailAlias && !activeInbox.mailTmToken) {
      const prefix = activeInbox.address.split('@')[0];
      const domain = activeInbox.address.split('@')[1];
      createMailTmAccount(prefix, domain).then((result) => {
        if (result) {
          setInboxes((prev) =>
            prev.map((i) =>
              i.id === activeInbox.id
                ? {
                    ...i,
                    address: result.address,
                    mailTmToken: result.token,
                    mailTmAccountId: result.accountId,
                  }
                : i
            )
          );
        }
      });
    }
  }, [activeInbox?.id]);

  // Pre-warm the next inbox in the background so switching is instant
  useEffect(() => {
    prewarmNextAccount();
  }, []);

  // Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (authenticatedUser) => {
        setUser(authenticatedUser);
      },
      () => {
        setUser(null);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  // When user signs in, optionally generate their first Gmail alias if none exists
  useEffect(() => {
    if (user && user.email) {
      setInboxes((current) => {
        const hasGmailAlias = current.some((i) => i.isGmailAlias);
        if (!hasGmailAlias) {
          const newAliasAddress = generateRandomAddress(user.email!);
          const newInbox = createInbox(newAliasAddress, true, true, 10, 'Mon Alias Gmail');
          showToast(`Nouvel alias Gmail prêt : ${newAliasAddress}`);
          setActiveInboxId(newInbox.id);
          return [newInbox, ...current];
        }
        return current;
      });
    }
  }, [user, showToast]);

  // Auto-renewal background interval (checks every 1.5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setInboxes((prev) =>
        prev.map((inbox) => {
          if (inbox.autoRenew && inbox.expiresAt <= now) {
            const addedMs = inbox.renewalDurationMinutes * 60 * 1000;
            const newExpiry = now + addedMs;
            showToast(`Boîte ${inbox.address.split('@')[0]} automatiquement renouvelée (+${inbox.renewalDurationMinutes} min) !`);
            return {
              ...inbox,
              expiresAt: newExpiry,
            };
          }
          return inbox;
        })
      );
    }, 1500);

    return () => clearInterval(timer);
  }, [showToast]);

  // Fetch messages from Gmail and/or Mail.tm for active inbox
  const fetchMessages = useCallback(async () => {
    if (!activeInbox) return;
    setIsRefreshing(true);

    try {
      // 1. Gmail real messages
      const token = await getAccessToken();
      if (token && activeInbox.isGmailAlias) {
        const gmailMessages = await fetchGmailMessagesForInbox(token, activeInbox.address);
        if (gmailMessages.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newOnes = gmailMessages.filter((m) => !existingIds.has(m.id));
            if (newOnes.length > 0) {
              showToast(`${newOnes.length} nouveau(x) courriel(s) reçu(s) sur Gmail !`);
            }
            const updated = [
              ...newOnes,
              ...prev.map((p) => {
                const refreshed = gmailMessages.find((g) => g.id === p.id);
                return refreshed ? { ...p, isRead: refreshed.isRead } : p;
              }),
            ];
            return updated;
          });
        }
      }

      // 2. Real Mail.tm live server messages
      if (activeInbox.mailTmToken) {
        const liveMessages = await fetchMailTmMessages(activeInbox.mailTmToken, activeInbox.address);
        if (liveMessages.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newOnes = liveMessages.filter((m) => !existingIds.has(m.id));
            if (newOnes.length > 0) {
              showToast(`${newOnes.length} nouveau(x) courriel(s) en direct reçus !`);
              setInboxes((currentInboxes) =>
                currentInboxes.map((i) =>
                  i.id === activeInbox.id
                    ? { ...i, unreadCount: i.unreadCount + newOnes.length }
                    : i
                )
              );
            }
            const updated = [
              ...newOnes,
              ...prev.map((p) => {
                const refreshed = liveMessages.find((g) => g.id === p.id);
                return refreshed ? { ...p, isRead: refreshed.isRead } : p;
              }),
            ];
            return updated;
          });
        }
      }
    } catch (err: any) {
      if (err?.message === 'AUTH_EXPIRED') {
        showToast('Session Google expirée, veuillez vous reconnecter.');
        setUser(null);
      } else {
        console.warn('Fetch error:', err);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [activeInbox, showToast]);

  // Auto poll emails every 4 seconds
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Handlers
  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        showToast('Connecté avec succès à Gmail !');
      }
    } catch (err: any) {
      showToast('Connexion annulée.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    showToast('Signed out from Google.');
  };

  const handleToggleAutoRenew = (inboxId: string) => {
    setInboxes((prev) =>
      prev.map((i) => {
        if (i.id === inboxId) {
          const nextState = !i.autoRenew;
          showToast(
            nextState
              ? t.toasts.autoRenewOn
              : t.toasts.autoRenewOff
          );
          return { ...i, autoRenew: nextState };
        }
        return i;
      })
    );
  };

  const handleExtend10Min = (inboxId: string) => {
    setInboxes((prev) =>
      prev.map((i) => {
        if (i.id === inboxId) {
          const base = Math.max(Date.now(), i.expiresAt);
          const newExpiry = base + 10 * 60 * 1000;
          showToast(t.toasts.inboxExtended);
          return { ...i, expiresAt: newExpiry };
        }
        return i;
      })
    );
  };

  const handleGenerateNewRandom = async () => {
    setIsGeneratingNew(true);
    try {
      if (user?.email) {
        const address = generateRandomAddress(user.email);
        const newInbox = createInbox(address, true, true, 10);
        setInboxes((prev) => [newInbox, ...prev]);
        setActiveInboxId(newInbox.id);
        showToast(t.toasts.inboxCreated);
        return;
      }

      // Generate live, verified address on mail.tm server
      const liveAcct = await createMailTmAccount();
      if (liveAcct) {
        const newInbox: TempInbox = {
          ...createInbox(liveAcct.address, false, true, 10),
          mailTmToken: liveAcct.token,
          mailTmAccountId: liveAcct.accountId,
        };
        setInboxes((prev) => [newInbox, ...prev]);
        setActiveInboxId(newInbox.id);
        showToast(`${t.toasts.newVerifiedAddress} ${liveAcct.address}`);
      } else {
        showToast('Connection to mail server failed, please retry.');
      }
    } finally {
      setIsGeneratingNew(false);
    }
  };

  const handleSimulateIncomingEmail = () => {
    if (!activeInbox) return;
    const sampleMsg = generateSampleEmail(activeInbox.address);
    setMessages((prev) => [sampleMsg, ...prev]);

    // Update unread count for inbox
    setInboxes((prev) =>
      prev.map((i) =>
        i.id === activeInbox.id ? { ...i, unreadCount: i.unreadCount + 1 } : i
      )
    );

    showToast(`Test reçu : code de vérification envoyé par "${sampleMsg.senderName}" !`);
  };

  const handleCreateInbox = async (
    address: string,
    isGmailAlias: boolean,
    autoRenew: boolean,
    durationMinutes: number,
    label?: string
  ) => {
    const newInbox = createInbox(address, isGmailAlias, autoRenew, durationMinutes, label);

    if (!isGmailAlias) {
      const prefix = address.split('@')[0];
      const domain = address.split('@')[1];
      const liveAcct = await createMailTmAccount(prefix, domain);
      if (liveAcct) {
        newInbox.address = liveAcct.address;
        newInbox.mailTmToken = liveAcct.token;
        newInbox.mailTmAccountId = liveAcct.accountId;
      }
    }

    setInboxes((prev) => [newInbox, ...prev]);
    setActiveInboxId(newInbox.id);
    showToast(`Boîte "${newInbox.address}" créée et active !`);
  };

  // User Confirmation for Destructive Operations (MANDATORY per Workspace skill)
  const handleRequestDeleteInbox = (inboxToDelete: TempInbox) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Supprimer cette boîte de réception ?',
      message: `Êtes-vous sûr de vouloir supprimer définitivement la boîte "${inboxToDelete.address}" ? Tous les messages associés seront retirés de votre affichage. Cette action est irréversible.`,
      onConfirm: () => {
        setInboxes((prev) => {
          const filtered = prev.filter((i) => i.id !== inboxToDelete.id);
          if (filtered.length === 0) {
            const fallback = createInbox('usr-' + Math.floor(1000 + Math.random() * 9000) + '@maxxspace.com', false, true, 10);
            setActiveInboxId(fallback.id);
            return [fallback];
          }
          if (activeInboxId === inboxToDelete.id) {
            setActiveInboxId(filtered[0].id);
          }
          return filtered;
        });
        setConfirmDialog((c) => ({ ...c, isOpen: false }));
        showToast('Boîte supprimée.');
      },
    });
  };

  const handleRequestDeleteMessage = (messageToDelete: TempEmailMessage) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Supprimer ce courriel ?',
      message: messageToDelete.isGmailReal
        ? `Êtes-vous sûr de vouloir déplacer ce message de "${messageToDelete.sender}" vers la corbeille Gmail ? Cette opération modifiera vos données Gmail.`
        : `Êtes-vous sûr de vouloir supprimer ce message de "${messageToDelete.sender}" ? Cette action est irréversible.`,
      onConfirm: async () => {
        if (messageToDelete.isGmailReal) {
          try {
            const token = await getAccessToken();
            if (token) {
              await trashGmailMessage(token, messageToDelete.id);
            }
          } catch (e) {
            console.error('Failed to trash Gmail message', e);
          }
        } else if (messageToDelete.id.startsWith('mtm_') && activeInbox?.mailTmToken) {
          try {
            await deleteMailTmMessage(activeInbox.mailTmToken, messageToDelete.id);
          } catch (e) {
            console.warn('MailTm delete error', e);
          }
        }
        setMessages((prev) => prev.filter((m) => m.id !== messageToDelete.id));
        if (selectedMessage?.id === messageToDelete.id) {
          setSelectedMessage(null);
        }
        setConfirmDialog((c) => ({ ...c, isOpen: false }));
        showToast('Message supprimé.');
      },
    });
  };

  const handleSelectMessage = async (msg: TempEmailMessage) => {
    // Mark as read
    if (!msg.isRead) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
      );
      if (msg.isGmailReal) {
        try {
          const token = await getAccessToken();
          if (token) {
            await markGmailMessageAsRead(token, msg.id);
          }
        } catch (e) {
          console.error('Mark read error', e);
        }
      }
    }
    setSelectedMessage(msg);
  };

  const activeMessages = messages.filter(
    (m) => activeInbox && m.inboxAddress.toLowerCase() === activeInbox.address.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-neutral-100/50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xl border border-neutral-700/50 dark:border-neutral-200 text-xs font-medium animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Minimal Header */}
      <Header
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Intro banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {t.seo.heroTitle}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              {t.seo.heroSubtitle}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.seo.badgeActive}</span>
          </div>
        </div>

        {/* Top AdSense Compliant Banner Slot */}
        <AdBanner format="horizontal" />

        {/* Active Address Showcase with Auto-Renewal */}
        {activeInbox && (
          <div id="active-inbox">
            <ActiveAddressCard
              inbox={activeInbox}
              onCopyAddress={(addr) => showToast(`${t.toasts.addressCopied} (${addr})`)}
              onToggleAutoRenew={handleToggleAutoRenew}
              onExtend10Min={handleExtend10Min}
              onOpenQrCode={() => setIsQrModalOpen(true)}
              onGenerateNewRandom={handleGenerateNewRandom}
              onSimulateIncomingEmail={handleSimulateIncomingEmail}
              onManualRefresh={fetchMessages}
              isRefreshing={isRefreshing}
              isGenerating={isGeneratingNew}
            />
          </div>
        )}

        {/* Quick Access to Generated Inboxes */}
        <InboxSelector
          inboxes={inboxes}
          activeInboxId={activeInboxId}
          onSelectInbox={(id) => {
            setActiveInboxId(id);
            setSelectedMessage(null);
          }}
          onRequestDeleteInbox={handleRequestDeleteInbox}
          onOpenNewInboxModal={() => setIsNewInboxModalOpen(true)}
        />

        {/* Received Emails Feed for Active Inbox */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 shadow-xs">
          <EmailList
            messages={activeMessages}
            selectedMessageId={selectedMessage?.id || null}
            onSelectMessage={handleSelectMessage}
            isLoading={isRefreshing}
          />
        </div>

        {/* Middle In-Feed AdSense Compliant Slot */}
        <AdBanner format="in-feed" />

        {/* Comprehensive SEO Content & Educational FAQ for Organic Search & AdSense Compliance */}
        <SeoContent />
      </main>

      {/* Complete Footer with Legal & Cookie Links */}
      <Footer
        onOpenModal={(type) => setLegalModal(type)}
        onOpenCookieBanner={() => setCookieBannerKey((k) => k + 1)}
      />

      {/* Modals */}
      <NewInboxModal
        isOpen={isNewInboxModalOpen}
        gmailUserEmail={user?.email || undefined}
        onClose={() => setIsNewInboxModalOpen(false)}
        onCreate={handleCreateInbox}
      />

      {activeInbox && (
        <QrCodeModal
          isOpen={isQrModalOpen}
          address={activeInbox.address}
          onClose={() => setIsQrModalOpen(false)}
        />
      )}

      <EmailDetail
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onRequestDelete={handleRequestDeleteMessage}
      />

      {/* Mandatory User Confirmation Dialog */}
      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((c) => ({ ...c, isOpen: false }))}
      />

      {/* Legal & Policy Modals (Privacy, Terms, About, Contact) */}
      <LegalModals
        activeModal={legalModal}
        onClose={() => setLegalModal(null)}
      />

      {/* GDPR / AdSense Cookie Consent Banner */}
      <CookieBanner
        key={cookieBannerKey}
        onOpenPrivacyPolicy={() => setLegalModal('privacy')}
      />
    </div>
  );
}
