# Frontend - HabitAI Tracker

Interface utilisateur moderne pour le suivi d'habitudes avec Next.js 16 et React 19.

## Démarrage Rapide

### Prérequis

- Node.js 18+
- Backend démarré et accessible

### Installation

```bash
npm install
```

### Configuration

1. **Créer le fichier `.env.local`** :

Créez un fichier `.env.local` à la racine du dossier `frontend`.

2. **Configurer la variable d'environnement** :

Voir [ENV_VARIABLES.md](./ENV_VARIABLES.md) pour les détails.

**Minimum requis** :

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Important** : Le préfixe `NEXT_PUBLIC_` est obligatoire pour que la variable soit accessible côté client.

### Démarrage

```bash
# Développement
npm run dev

# Production
npm run build
npm start
```

L'application sera accessible sur `http://localhost:3000`

## Architecture

```
app/
├── app/              # Pages de l'application (dashboard, journals, etc.)
├── components/        # Composants réutilisables
├── hooks/            # Custom hooks
├── lib/              # Utilitaires (API client, auth, i18n)
└── context/          # Context providers (Theme, Language)

lib/
├── api/              # Clients API (auth, journals, tasks, etc.)
├── auth/             # Authentification (context, hooks, storage)
└── i18n/             # Internationalisation (FR/EN)
```

## Features

- **Authentification** : Register, login, password reset
- **Journaling** : Création de journaux (texte ou audio)
- **Dashboard** : Statistiques, graphiques, heatmap
- **Planner** : Calendrier interactif (mois/semaine/jour)
- **Tasks** : Gestion des tâches extraites
- **Settings** : Profil, préférences, thème, langue

## Technologies

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- React Query (TanStack Query)
- Recharts (graphiques)
- Lucide React (icônes)
- react-calendar

## Scripts

```bash
npm run dev      # Développement
npm run build    # Build production
npm start        # Démarrer en production
npm run lint     # Linter
npm run lint:fix # Fix automatique
```

## Internationalisation

L'application supporte le français et l'anglais. Les traductions sont dans `lib/i18n/i18n.ts`.

## Thème

Support du mode clair/sombre avec détection automatique de la préférence système.

## Déploiement

### Vercel (recommandé)

1. Connecter votre repo GitHub
2. Configurer les variables d'environnement :
   - `NEXT_PUBLIC_API_URL` = URL de votre backend en production
3. Déployer

### Build manuel

```bash
npm run build
# Les fichiers sont dans .next/
```
