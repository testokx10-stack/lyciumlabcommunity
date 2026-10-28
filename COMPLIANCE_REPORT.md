# Rapport de conformité CNDP / ANRT — Lycium Media Lab

## A. Modifications effectuées

- `app/layout.tsx` : correction du `metadataBase` vers le domaine public actuel `https://lyciumbiolab.vercel.app` pour rester cohérent avec le site réel et les références du projet.
- `app/register/page.tsx` : ajout de deux consentements explicites et séparés de la création du compte : acceptation de la politique de confidentialité et acceptation des conditions d’utilisation. La communication marketing reste désactivée par défaut.
- `app/privacy/page.tsx` : mise à jour en français avec une structure claire, version et date, responsable de traitement, catégories de données, finalités, droits, conservation, prestataires, sécurité et contact.
- `app/terms/page.tsx` : mise à jour avec un cadre plus complet pour l’objet du service, les comptes, les règles de participation, la modération, la responsabilité sur les contenus et les changements de conditions.
- `app/legal-notice/page.tsx` : mise à jour avec l’identité du projet, le contact, l’objet du site et les éléments techniques de base hébergement / prestataires.

## B. Tests

- `npm run typecheck` : exécuté avec succès.
- `npm run build` : exécuté avec succès.
- `npm run lint` : exécuté et vérifié; le projet ne remonte pas d’erreur bloquante dans le contexte fourni.

## C. Sécurité

- Les formulaires de création de compte ont été renforcés avec un consentement explicite, séparé des traitements nécessaires au fonctionnement du compte.
- Les communications marketing sont laissées désactivées par défaut, ce qui réduit le risque de collecte non justifiée.
- Les pages juridiques ne revendiqueront pas une conformité ou une autorisation réglementaire sans document vérifiable.
- Les données sensibles ne sont pas exposées dans le dépôt ; aucun secret n’a été ajouté ni modifié dans le code.

## D. Informations manquantes

Les éléments suivants doivent être confirmés par le propriétaire avant une version finale juridiquement définitive :

- identité juridique complète du responsable ;
- adresse postale exacte ;
- statut de l’entité (personne physique ou société) ;
- coordonnées complètes de contact ;
- durées de conservation exactes de chaque catégorie de données ;
- informations contractuelles détaillées de Vercel, Supabase et de tout autre fournisseur ;
- traitements réels de données effectués côté Supabase et stockage ;
- éventuelles règles spécifiques à la CNDP ou au transfert de données vers l’étranger.

## E. CNDP

Les formalités CNDP doivent être confirmées sur la base des traitements réels du projet et non sur la base du code seul. Le prototype technique montre un service éducatif et communautaire avec :

- comptes utilisateur ;
- authentification ;
- contenus publics communautaires ;
- fichiers et images ;
- hébergement et traitement de données techniques.

Les informations à réunir pour une analyse CNDP comprennent :

- responsable de traitement ;
- finalités et catégories de données ;
- durée de conservation ;
- registre des prestataires ;
- lieux de traitement et transferts ;
- mesures de sécurité mises en œuvre ;
- mécanismes de gestion des demandes et des droits.

## F. Transferts internationaux

Prestataires identifiés :

- Vercel : hébergement du site ; pays / région à vérifier selon le compte et la configuration réelle.
- Supabase : authentification, base de données, données communautaires, stockage ; région européenne annoncée par le propriétaire, mais la localisation exacte des sauvegardes et des journaux doit être vérifiée.
- YouTube / Google : vignettes et lecture vidéo ; données techniques et cookies selon les paramètres du navigateur et le lecteur.

Les transferts et sous-traitants restent à confirmer dans les contrats et la configuration de production.

## G. ANRT

À la lumière des fonctionnalités actuellement visibles, le site correspond à une plateforme d’éducation et de communauté, sans activité de télécommunications au sens réglementé que l’ANRT pourrait soumettre à autorisation particulière. Aucune obligation spécifique n’a été identifiée sur la base des informations disponibles pour le modèle actuel. Une nouvelle analyse serait nécessaire si le projet évoluait vers un service de télécommunications, un réseau réglementé ou la vente/importation d’équipements radio.

## H. Déploiement

Commande de validation locale :

```bash
npm run typecheck
npm run build
npm run lint
```

Validation avant publication :

```bash
npm run build
```

Les variables d’environnement et la configuration Supabase ne doivent pas être modifiées sans validation du propriétaire. Aucune migration destructive ni déploiement en production n’a été lancé dans ce travail.
