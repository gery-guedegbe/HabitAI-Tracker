# HabitAI Tracker

Application fullstack moderne pour le suivi d'habitudes avec extraction automatique de tâches par IA depuis texte libre ou audio.

## Concept

Décrivez simplement votre journée (texte ou audio), l'IA extrait automatiquement vos tâches et habitudes, et vous visualisez votre progression sur un dashboard interactif.

**Workflow** : Journal libre → Extraction IA → Visualisation progression

## Architecture

- **Backend** : Node.js + Express + PostgreSQL + Groq API (IA)
- **Frontend** : Next.js 16 + React 19 + TypeScript + Tailwind CSS

## Démarrage Rapide

### Prérequis

- Node.js 18+
- PostgreSQL 14+
- Compte Groq API (gratuit) - https://console.groq.com

### Installation

```bash
# 1. Cloner le projet
git clone <repo-url>
cd habitai-tracker

# 2. Backend
cd backend
npm install
# Créer .env (voir backend/ENV_VARIABLES.md)
npm run init-db
npm run dev

# 3. Frontend (dans un autre terminal)
cd frontend
npm install
# Créer .env.local avec NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Fonctionnalités

- Authentification (register, login, JWT)
- Journaling (texte libre ou audio)
- Extraction automatique de tâches par IA (Groq Llama 3.1)
- Transcription audio (AssemblyAI)
- Dashboard avec statistiques et graphiques
- Planner visuel (calendrier mois/semaine/jour)
- Messages motivants personnalisés
- Dark/Light mode + FR/EN

## Documentation

- **API** : http://localhost:5000/api-docs (Swagger)
- **Backend** : Voir [backend/README.md](./backend/README.md)
- **Frontend** : Voir [frontend/README.md](./frontend/README.md)

## Variables d'environnement

### Backend

Voir [backend/ENV_VARIABLES.md](./backend/ENV_VARIABLES.md) pour la liste complète.

**Obligatoires** :

- `DB_*` - Configuration PostgreSQL
- `JWT_SECRET` - Clé secrète JWT

**Recommandées** :

- `GROQ_API_KEY` - Pour extraction IA (gratuit)
- `ASSEMBLYAI_API_KEY` - Pour transcription audio

### Frontend

Voir [frontend/ENV_VARIABLES.md](./frontend/ENV_VARIABLES.md) pour les détails.

**Obligatoire** :

- `NEXT_PUBLIC_API_URL` - URL du backend (ex: http://localhost:5000)

## Déploiement

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour le guide complet de déploiement.

**Résumé** :

- **Backend** : Render ou Railway (Node.js + PostgreSQL)
- **Frontend** : Vercel (Next.js)
- **Variables** : Configurer toutes les variables d'environnement en production

## Licence

MIT License
