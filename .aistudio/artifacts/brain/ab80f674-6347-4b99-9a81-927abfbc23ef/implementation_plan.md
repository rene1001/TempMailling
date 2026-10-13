# Intégration de la Marque & Domaine tempmailling.com

Déploiement et harmonisation de l'identité de marque officielle autour du nom de domaine choisi **tempmailling.com**, optimisé pour l'indexation internationale, la captation de trafic organique et l'approbation du compte Google AdSense.

## User Review & Critical Decisions

> [!IMPORTANT]
> Décisions validées lors de la phase de cadrage :
> - **Nom de domaine officiel retenu** : `tempmailling.com` (TLD `.com` international de premier niveau).
> - **Positionnement de marque** : Moderne, épuré, mémorable et axé sur la productivité et la vie privée.
> - **Audience ciblée** : Trafic mondial avec support multilingue et optimisation bilingue (Français & Anglais) pour maximiser les revenus publicitaires AdSense (CPC élevé).
> - **Gouvernance AdSense** : Intégration du domaine dans les mentions légales, la politique de confidentialité, le fichier `ads.txt` et les balises canoniques.

---

## 1. Overview & Core Concept

- **Proposition de valeur** : **TempMailling.com** offre un service de messagerie temporaire, jetable et sans traçage, doté d'une génération instantanée (0 ms), d'un renouvellement automatique continu et d'une extraction intelligente des codes de confirmation (OTP).
- **Public cible** : Internautes soucieux de leur vie privée, développeurs testant des flux d'authentification, utilisateurs s'inscrivant ponctuellement à des services en ligne pour éviter le spam.
- **Objectif SEO & Monétisation** : Positionner **tempmailling.com** sur les requêtes à fort volume de recherche (*temp mail*, *disposable email*, *email temporaire*, *fake mail generator*) tout en répondant à 100% des critères d'admissibilité du programme Google AdSense.

---

## 2. User Experience & Visual Design

### Contrat de Barre Supérieure (Top Bar Contract)
Respect strict du contrat 3 zones de la charte de conception :
- **Zone 1 (Marque)** : Wordmark unique `TempMailling.com` typographié avec netteté, sans sous-titre ni puce de statut encombrante.
- **Zone 2 (Navigation)** : Liens épurés en une seule ligne (`Fonctionnalités`, `Sécurité & RGPD`, `FAQ`, `Contact`).
- **Zone 3 (Action principale)** : Bouton d'action pour la synchronisation Google Workspace / Gmail ou basculement de thème.

### Identité Visuelle & Typographie
- **Palette chromatique (Règle 60-30-10)** :
  - *60% Fond dominant* : Blanc pur / ardoise sombre obsidienne (`#090A0F`).
  - *30% Surfaces structurelles* : Cartes délimitées par des bordures ultra-fines (`1px border-neutral-200/80` et `border-neutral-800`), sans empilement de cartes dans des cartes.
  - *10% Accent d'action* : Bleu cobalt moderne (`#2563EB`) et émeraude (`#10B981`) pour les validations et le statut du serveur MX.
- **Typographie** : Famille géométrique contemporaine (`Plus Jakarta Sans` / `Inter`), chiffres tabulaires (`tabular-nums`) pour le compte à rebours d'expiration et police monospace épurée pour les adresses et codes OTP.

---

## 3. Key Product Decisions & Trade-Offs

### Décision 1 : Harmonisation Globale du Nom de Domaine
- **Approche retenue** : Intégrer `tempmailling.com` dans tous les points de contact de l'application :
  - Balises `<title>`, `<meta name="description">`, `og:site_name`, `og:url` et `twitter:domain`.
  - Balisage Schema.org `WebApplication` et `FAQPage` avec l'URL canonique `https://tempmailling.com/`.
  - Textes d'en-tête, pied de page et mentions légales de l'application.
- **Bénéfice** : Cohérence parfaite du signal de marque envoyé aux moteurs de recherche (Google, Bing) et aux réviseurs de Google AdSense.

### Décision 2 : Support AdSense & Fichier de Vérification
- **Approche retenue** : Préparation de l'emplacement pour le fichier standard `ads.txt` et balisage des conteneurs publicitaires avec les attributs conformes (`data-ad-client="ca-pub-..."`).
- **Bénéfice** : Validation sans friction lors de la soumission du domaine dans la console AdSense de l'utilisateur.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DOMAINE : tempmailling.com                      │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│    SEO & HEAD    │    │      APPLICATION    │    │   CONFORMITÉ ADS    │
│  - Meta Title    │    │  - Top Bar Wordmark │    │  - Emplacement ads  │
│  - Schema.org LD │───▶│  - Boîte Jetable    │◀───│  - CMP Cookie RGPD  │
│  - Canonical URL │    │  - Guide Éditorial  │    │  - Privacy / CGU    │
│  - OpenGraph Card│    │  - FAQ Accordéon    │    │  - Page Contact     │
└──────────────────┘    └─────────────────────┘    └─────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        INFRASTRUCTURE EN ARRIÈRE-PLAN                  │
│  - Proxy Serveur Mail (/api/mailtm)                                    │
│  - Pool de boîtes pré-enregistrées en 0 ms                             │
│  - API Google Workspace Gmail (OAuth client optionnel)                 │
└────────────────────────────────────────────────────────────────────────┘
```

### Étapes d'exécution prévues :
1. **Actualisation des métadonnées HTML & SEO** : Remplacement des libellés dans `index.html` avec `tempmailling.com` (titre, description, balise canonique, `og:url`, `og:title`, Schema.org `@id` et `url`).
2. **Actualisation de l'en-tête et du pied de page** : Affichage du wordmark officiel `TempMailling.com` dans `Header.tsx` et `Footer.tsx`.
3. **Mise à jour des documents légaux** : Mention du nom officiel de domaine `tempmailling.com` dans la politique de confidentialité, les CGU et les mentions d'édition.
4. **Validation de build et compilation** : Exécution de `compile_applet` pour garantir l'absence de régression.
