# Backend - HabitAI Tracker

API REST pour le suivi d'habitudes avec extraction automatique de tâches par IA.

## Démarrage Rapide

### Prérequis

- Node.js 18+
- PostgreSQL 14+
- Compte Groq API (gratuit) - https://console.groq.com

### Installation

```bash
npm install
```

### Configuration

1. **Créer le fichier `.env`** :

```bash
cp .env.example .env
```

2. **Configurer les variables d'environnement** :

Créez un fichier `.env` et configurez les variables. Voir [ENV_VARIABLES.md](./ENV_VARIABLES.md) pour la liste complète.

**Minimum requis** :

- `DB_*` - Configuration PostgreSQL
- `JWT_SECRET` - Clé secrète JWT (générez avec `openssl rand -hex 32`)
- `FRONTEND_URL` - URL du frontend (pour CORS)

**Recommandé** :

- `GROQ_API_KEY` - Pour extraction IA (gratuit)
- `ASSEMBLYAI_API_KEY` - Pour transcription audio

3. **Initialiser la base de données** :

```bash
npm run init-db
```

Ou manuellement :

```bash
createdb habitai_tracker_db
psql -U postgres -d habitai_tracker_db -f src/config/schema/schema.sql
```

### Démarrage

```bash
# Développement
npm run dev

# Production
npm start
```

Le serveur démarre sur `http://localhost:5000`

## Documentation API

Une fois le serveur démarré, accédez à la documentation Swagger :

```
http://localhost:5000/api-docs
```

## Architecture

```
src/
├── config/          # Configuration (DB, Swagger)
├── controllers/     # Logique métier
├── middlewares/     # Middlewares (auth, error)
├── models/          # Accès DB (requêtes SQL)
├── routes/          # Définition des routes
├── services/        # Services (AI, auth, user)
└── utils/          # Utilitaires (validators, email)
```

## Endpoints Principaux

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `POST /api/journals` - Créer un journal (texte)
- `POST /api/journals/audio` - Créer un journal (audio)
- `GET /api/journals` - Liste des journaux
- `GET /api/tasks/calendar` - Tâches pour le planner
- `GET /api/dashboard/stats` - Statistiques dashboard

## Sécurité

- JWT pour l'authentification
- Bcrypt pour le hashage des mots de passe
- Helmet pour les headers HTTP sécurisés
- Rate limiting (100 req/15min)
- CORS configuré
- Validation des données (Joi)
- Requêtes SQL paramétrées

## Technologies

- Express.js 5
- PostgreSQL
- Groq API (Llama 3.1 70B)
- AssemblyAI (transcription audio)
- JWT
- Swagger
- Joi (validation)

## Notes

- Le serveur peut démarrer sans `GROQ_API_KEY`, mais l'extraction IA ne fonctionnera pas
- Sans clé IA, vous pouvez toujours créer des journaux et ajouter des tâches manuellement
