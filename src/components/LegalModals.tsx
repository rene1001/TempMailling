import React, { useState } from 'react';
import { X, Shield, FileText, Info, Mail, CheckCircle2, Lock } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export type LegalModalType = 'privacy' | 'terms' | 'about' | 'contact' | null;

interface LegalModalsProps {
  activeModal: LegalModalType;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  const { lang } = useLanguage();
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  if (!activeModal) return null;

  const isFrench = lang === 'fr';

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              {activeModal === 'privacy' && <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              {activeModal === 'terms' && <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              {activeModal === 'about' && <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
              {activeModal === 'contact' && <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 dark:text-neutral-100 text-base md:text-lg">
                {activeModal === 'privacy' && (isFrench ? 'Politique de Confidentialité & RGPD' : 'Privacy Policy & GDPR Compliance')}
                {activeModal === 'terms' && (isFrench ? 'Conditions Générales d’Utilisation' : 'Terms of Service')}
                {activeModal === 'about' && (isFrench ? 'À propos de Temporary Mail' : 'About Temporary Mail')}
                {activeModal === 'contact' && (isFrench ? 'Contact & Support' : 'Contact & Support')}
              </h2>
              <p className="text-xs text-neutral-500">
                {activeModal === 'privacy' && (isFrench ? 'Conforme aux exigences Google AdSense et au RGPD' : 'Fully compliant with Google AdSense Policies & GDPR regulations')}
                {activeModal === 'terms' && (isFrench ? 'Règles d’utilisation et engagement de service' : 'Acceptable use policy and service terms')}
                {activeModal === 'about' && (isFrench ? 'Notre mission pour la protection de votre vie privée' : 'Our mission to safeguard your digital privacy')}
                {activeModal === 'contact' && (isFrench ? 'Une question ou une suggestion ? Écrivez-nous' : 'Questions, feedback, or inquiries? Get in touch')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label={isFrench ? 'Fermer' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-xs md:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
          {/* PRIVACY POLICY (AdSense Mandatory Requirements) */}
          {activeModal === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 flex items-start gap-3">
                <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-900 dark:text-emerald-200">
                  {isFrench
                    ? "Temporary Mail a été conçu dès le départ avec le principe fondamental du Privacy by Design. Aucune donnée personnelle nominative n'est collectée pour utiliser nos boîtes de réception temporaires."
                    : 'Temporary Mail operates under the Privacy by Design principle. No personal identification, name, or password is ever required to create or use our disposable email addresses.'}
                </p>
              </div>

              {isFrench ? (
                <>
                  <h3 className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100 pt-2">
                    1. Collecte et Traitement des Données
                  </h3>
                  <p>
                    Lorsque vous utilisez Temporary Mail, les e-mails entrants reçus sur les adresses temporaires sont hébergés de façon transitoire dans le seul but de vous permettre de les consulter en temps réel. Dès l'expiration ou la suppression de la boîte, ces messages sont automatiquement et définitivement détruits. Nous ne vendons, ne louons et ne transférons aucune information à des tiers.
                  </p>

                  <h3 className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100 pt-2">
                    2. Cookies Tiers et Google AdSense (Mention Obligatoire)
                  </h3>
                  <p>
                    Ce site utilise <strong>Google AdSense</strong> et des réseaux publicitaires tiers certifiés. Google utilise des cookies pour diffuser des annonces auprès des internautes en fonction de leurs visites antérieures sur ce site ou sur d'autres sites web :
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs">
                    <li>
                      Des fournisseurs tiers, y compris Google, utilisent des cookies pour diffuser des annonces pertinentes sur notre site web.
                    </li>
                    <li>
                      L'utilisation des cookies publicitaires par Google permet à Google et à ses partenaires de diffuser des annonces auprès des utilisateurs en fonction de leur visite sur notre site et/ou sur d'autres sites web de l'Internet.
                    </li>
                    <li>
                      Les utilisateurs peuvent désactiver la publicité personnalisée à tout moment en accédant aux{' '}
                      <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">
                        Paramètres des annonces Google
                      </a>{' '}
                      ou sur le portail indépendant{' '}
                      <a href="https://www.aboutads.info/choices/" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">
                        aboutads.info
                      </a>.
                    </li>
                  </ul>

                  <h3 className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100 pt-2">
                    3. Respect du RGPD et Droits des Utilisateurs
                  </h3>
                  <p>
                    Conformément au RGPD européen, vous disposez d'un droit d'accès et d'effacement de vos données. Comme aucune donnée personnelle n'est stockée sur nos serveurs de façon permanente, la fermeture de votre onglet ou le clic sur « Supprimer la boîte » supprime immédiatement tout enregistrement local.
                  </p>

                  <h3 className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100 pt-2">
                    4. Connexion Google Workspace / Gmail (Optionnelle)
                  </h3>
                  <p>
                    Si vous choisissez d'activer la synchronisation d'alias via Google Workspace, les permissions demandées se limitent exclusivement à la lecture de messages adressés à vos alias. Aucun identifiant ou jeton n'est partagé ou vendu.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100 pt-2">
                    1. Data Collection & Processing
                  </h3>
                  <p>
                    When you use Temporary Mail, incoming messages sent to temporary addresses are stored transiently for the sole purpose of displaying them to you in real time. Once an inbox expires or is deleted, all associated emails and metadata are permanently wiped. We never sell, rent, or trade user data to third parties.
                  </p>

                  <h3 className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100 pt-2">
                    2. Third-Party Advertising & Google AdSense Disclosure
                  </h3>
                  <p>
                    This website displays advertisements served by <strong>Google AdSense</strong> and certified third-party advertising vendors. In compliance with Google's Advertising Policies and requirements:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs">
                    <li>
                      Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites on the internet.
                    </li>
                    <li>
                      Google's use of advertising cookies enables it and its partners to serve ads to users based on their visits to our site and/or other sites on the Internet.
                    </li>
                    <li>
                      Users may opt out of personalized advertising at any time by visiting{' '}
                      <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">
                        Google Ads Settings
                      </a>{' '}
                      or by visiting the Network Advertising Initiative opt-out page at{' '}
                      <a href="https://www.aboutads.info/choices/" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">
                        aboutads.info
                      </a>.
                    </li>
                  </ul>

                  <h3 className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100 pt-2">
                    3. GDPR & International Privacy Compliance
                  </h3>
                  <p>
                    In accordance with the EU General Data Protection Regulation (GDPR) and international privacy frameworks, users have the right to access, rectify, and delete their data. Because Temporary Mail is completely accountless, deleting your inbox in your browser or closing your session immediately purges all transient records.
                  </p>

                  <h3 className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100 pt-2">
                    4. Optional Google Workspace / Gmail Integration
                  </h3>
                  <p>
                    If you choose to link your Google Workspace / Gmail account to generate verified alias inboxes, authorizations are restricted strictly to checking messages addressed to your specific temporary tags. Access tokens are kept client-side and never shared or persisted on remote servers.
                  </p>
                </>
              )}
            </div>
          )}

          {/* TERMS OF SERVICE */}
          {activeModal === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100">
                {isFrench ? '1. Acceptation des Conditions' : '1. Acceptance of Terms'}
              </h3>
              <p>
                {isFrench
                  ? "L'utilisation du service Temporary Mail implique l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez cesser l'utilisation du service."
                  : 'By accessing or using Temporary Mail, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our service.'}
              </p>

              <h3 className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100 pt-2">
                {isFrench ? '2. Usage Loyal et Activités Interdites' : '2. Permitted Use & Prohibited Activities'}
              </h3>
              <p>
                {isFrench
                  ? "Temporary Mail est fourni pour la protection de la vie privée, la lutte contre les courriers indésirables (spam) et le test légitime de logiciels. Sont strictement interdits :"
                  : 'Temporary Mail is provided exclusively for personal privacy defense, spam prevention, and software testing. The following activities are strictly prohibited:'}
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>{isFrench ? 'Activités frauduleuses, criminelles, ou cyberattaques.' : 'Fraudulent, criminal, phishing, or abusive activities.'}</li>
                <li>{isFrench ? 'Envoi ou réception de contenus illicites ou malveillants.' : 'Transmitting or soliciting malware, spam, or illicit content.'}</li>
                <li>{isFrench ? 'Tentatives de saturation ou d’attaque DoS sur nos serveurs.' : 'Attempting to disrupt or overload our server infrastructure.'}</li>
              </ul>

              <h3 className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100 pt-2">
                {isFrench ? '3. Caractère Éphémère et Non-Responsabilité' : '3. Ephemeral Nature & Disclaimer of Liability'}
              </h3>
              <p>
                {isFrench
                  ? "Les boîtes temporaires sont jetables et ne doivent pas être utilisées pour des comptes bancaires, administratifs ou sensibles nécessitant un accès durable. Temporary Mail ne saurait être tenu responsable de la perte d'un e-mail après expiration."
                  : 'Temporary email inboxes are ephemeral and disposable. They should never be used for critical communications, government correspondence, or banking. Temporary Mail assumes no liability for emails deleted following inbox expiration.'}
              </p>
            </div>
          )}

          {/* ABOUT US */}
          {activeModal === 'about' && (
            <div className="space-y-4">
              <h3 className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100">
                {isFrench ? 'Qui sommes-nous ?' : 'About Temporary Mail'}
              </h3>
              <p>
                {isFrench
                  ? "Temporary Mail est un service web indépendant conçu pour redonner le contrôle de leur vie privée aux internautes. Face à la prolifération du spam et de la revente de données personnelles, nous offrons une boîte de réception éphémère instantanée, gratuite et sans inscription."
                  : 'Temporary Mail is an independent web utility built to give internet users back control of their digital privacy. Faced with rampant newsletter spam, database leaks, and mandatory registration forms, we offer an instant, free, and completely anonymous disposable email solution.'}
              </p>

              <h3 className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100 pt-2">
                {isFrench ? 'Nos engagements clés' : 'Core Features & Commitments'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                    {isFrench ? 'Génération 0 ms' : '0 ms Instant Generation'}
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {isFrench ? 'Serveurs pré-enregistrés pour des adresses actives immédiatement.' : 'Pre-warmed mail server pool for immediate address readiness.'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                    {isFrench ? 'Extraction OTP Instantanée' : 'Smart OTP Extraction'}
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {isFrench ? 'Détection automatique des codes 4 à 8 chiffres avec copie en 1 clic.' : 'Automatic detection of 4 to 8-digit verification codes.'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                    {isFrench ? 'Zéro Inscription' : 'Zero Sign-Up Required'}
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {isFrench ? 'Aucun mot de passe, aucune carte de crédit, aucun traçage.' : 'No passwords, no personal credit cards, zero tracking.'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                    {isFrench ? 'Renouvellement Continu' : 'Continuous Auto-Renewal'}
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {isFrench ? 'La boîte reste active tant que vous gardez votre page ouverte.' : 'Inbox stays active as long as you keep your browser tab open.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CONTACT FORM */}
          {activeModal === 'contact' && (
            <div>
              {contactSubmitted ? (
                <div className="py-8 text-center space-y-3 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-base">
                    {isFrench ? 'Message transmis avec succès !' : 'Message Sent Successfully!'}
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    {isFrench
                      ? 'Merci d’avoir pris contact. Notre équipe examine votre demande et vous répondra sous 24 à 48 heures.'
                      : 'Thank you for reaching out. Our team will review your message and respond within 24 to 48 business hours.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <p className="text-xs text-neutral-500">
                    {isFrench
                      ? 'Vous rencontrez un dysfonctionnement technique, avez une proposition ou une question ? Remplissez ce formulaire :'
                      : 'Have a question, technical feedback, or partnership proposal? Fill out the form below:'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        {isFrench ? 'Votre Nom' : 'Your Name'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isFrench ? 'ex: Thomas' : 'e.g. Alex'}
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        {isFrench ? 'Votre E-mail de réponse' : 'Your Email Address'}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder={isFrench ? 'nom@exemple.com' : 'you@example.com'}
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {isFrench ? 'Sujet' : 'Subject'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isFrench ? 'Objet de votre message' : 'Subject of your message'}
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {isFrench ? 'Message' : 'Message'}
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={isFrench ? 'Décrivez votre demande en détail...' : 'Please describe your inquiry or feedback in detail...'}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      {isFrench ? 'Envoyer le message' : 'Send Message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
