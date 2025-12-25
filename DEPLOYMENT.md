# 🚢 Guide de Déploiement

Guide pour déployer HabitAI Tracker en production.

## 📋 Prérequis

- Compte sur les plateformes de déploiement
- Base de données PostgreSQL (Render, Railway, ou similaire)
- Clés API configurées (Groq, AssemblyAI)

## 🔧 Backend

### Option 1 : Render (Recommandé)

1. **Créer un nouveau service Web** :

   - Connecter votre repo GitHub
   - Type : Web Service
   - Build Command : `cd backend && npm install`
   - Start Command : `cd backend && npm start`

2. **Configurer les variables d'environnement** :

   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (depuis votre PostgreSQL)
   - `JWT_SECRET` (générez avec `openssl rand -hex 32`)
   - `GROQ_API_KEY`
   - `ASSEMBLYAI_API_KEY`
   - `FRONTEND_URL` (URL de votre frontend déployé)
   - `API_URL` (URL de votre backend déployé)
   - `NODE_ENV=production`

3. **PostgreSQL** :
   - Créer une base de données PostgreSQL sur Render
   - Noter les credentials
   - Exécuter le schéma : `psql -h <host> -U <user> -d <dbname> -f src/config/schema/schema.sql`

### Option 2 : Railway

1. **Créer un nouveau projet** :

   - Connecter votre repo GitHub
   - Ajouter PostgreSQL
   - Ajouter un service Web

2. **Configurer** :
   - Root Directory : `backend`
   - Start Command : `npm start`
   - Variables d'environnement : Même que Render

## 🎨 Frontend

### Vercel (Recommandé pour Next.js)

1. **Créer un nouveau projet** :

   - Connecter votre repo GitHub
   - Framework Preset : Next.js
   - Root Directory : `frontend`

2. **Configurer les variables d'environnement** :

   - `NEXT_PUBLIC_API_URL` = URL de votre backend déployé (ex: https://votre-backend.onrender.com)

3. **Déployer** :
   - Vercel détecte automatiquement Next.js
   - Build et déploiement automatiques

### Alternative : Netlify

1. **Créer un nouveau site** :

   - Connecter votre repo GitHub
   - Build command : `cd frontend && npm run build`
   - Publish directory : `frontend/.next`

2. **Variables d'environnement** :
   - `NEXT_PUBLIC_API_URL` = URL de votre backend

## ✅ Checklist de déploiement

### Backend

- [ ] Base de données PostgreSQL créée et accessible
- [ ] Schéma de base de données exécuté
- [ ] Toutes les variables d'environnement configurées
- [ ] `NODE_ENV=production` défini
- [ ] `FRONTEND_URL` pointe vers le frontend déployé
- [ ] `JWT_SECRET` est sécurisé (pas dans le code)
- [ ] Test de connexion à la base de données OK
- [ ] API accessible (test avec `/api-docs`)

### Frontend

- [ ] `NEXT_PUBLIC_API_URL` pointe vers le backend déployé
- [ ] Build réussi (`npm run build`)
- [ ] Application accessible
- [ ] Authentification fonctionne
- [ ] API calls fonctionnent

## 🔍 Vérification post-déploiement

1. **Backend** :

   - Accéder à `https://votre-backend.com/api-docs` (Swagger)
   - Tester l'endpoint `/api/auth/register`

2. **Frontend** :
   - Tester l'inscription
   - Tester la connexion
   - Tester la création d'un journal
   - Vérifier les appels API dans la console navigateur

## 🐛 Dépannage

### Backend ne démarre pas

- Vérifier les logs de déploiement
- Vérifier que toutes les variables d'environnement sont définies
- Vérifier la connexion à la base de données

### Frontend ne peut pas joindre le backend

- Vérifier `NEXT_PUBLIC_API_URL` dans les variables d'environnement
- Vérifier CORS sur le backend (`FRONTEND_URL` correct)
- Vérifier que le backend est accessible publiquement

### Erreurs CORS

- Vérifier que `FRONTEND_URL` dans le backend correspond à l'URL du frontend
- Vérifier la configuration CORS dans `backend/src/server.js`
