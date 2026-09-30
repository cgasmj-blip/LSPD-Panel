# LSPD Panel

Panel indépendant pour le **Los Santos Police Department**, dérivé de la structure du projet EMS mais maintenu dans un dépôt séparé.

## Modules prévus

- unités en service
- recherche citoyens
- rapports d'intervention
- véhicules
- mandats et signalements
- agenda
- historique
- effectifs
- gestion

## Développement

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Le projet est configuré pour être publié sur GitHub Pages sous `/LSPD-Panel/`.
## Authentification et rôle développeur

Le panel prévoit un rôle applicatif permanent `developer`, distinct des grades LSPD.

- Le rôle `developer` dispose des droits d'administration du panel.
- L'autorisation doit être vérifiée côté serveur/Supabase après authentification Discord, jamais uniquement dans le frontend.
- Les identifiants Discord autorisés doivent être stockés dans la configuration sécurisée / base de données et ne doivent pas être publiés dans le dépôt.
- Ce rôle n'est pas affecté par les changements de grade ou d'unité LSPD.
