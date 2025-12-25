# 🔐 Guide d'Authentification - HabitAI Tracker

Ce document explique comment fonctionne le système d'authentification et comment l'utiliser.

## Table des matières

1. [Architecture](#architecture)
2. [Configuration](#configuration)
3. [Utilisation](#utilisation)
4. [Flux d'authentification](#flux-dauthentification)
5. [Sécurité](#sécurité)

---

## Architecture

### Structure des fichiers

```
frontend/
├── lib/
│   ├── api/
│   │   ├── client.ts      # Client HTTP centralisé
│   │   └── auth.ts         # Fonctions API d'authentification
│   └── auth/
│       ├── storage.ts      # Gestion du token (localStorage)
│       ├── context.tsx     # Context React pour l'état auth
│       └── hooks.ts        # Hooks personnalisés (useLogin, useRegister)
├── app/
│   ├── providers.tsx       # Provider React Query + Auth
│   ├── layout.tsx         # Intègre le Provider
│   ├── login/
│   │   └── page.tsx       # Page de connexion
│   └── register/
│       └── page.tsx       # Page d'inscription
```

### Flux de données

```
┌─────────────┐
│  Composant  │
│  (LoginPage)│
└──────┬──────┘
       │
       │ useLogin()
       ▼
┌─────────────┐
│   Hooks     │
│  (hooks.ts) │
└──────┬──────┘
       │
       │ React Query Mutation
       ▼
┌─────────────┐
│  API Client │
│ (client.ts) │
└──────┬──────┘
       │
       │ fetch() + Token
       ▼
┌─────────────┐
│   Backend   │
│   (Express) │
└──────┬──────┘
       │
       │ Token JWT
       ▼
┌─────────────┐
│   Storage   │
│ (storage.ts)│
└──────┬──────┘
       │
       │ Mise à jour
       ▼
┌─────────────┐
│   Context   │
│ (context.tsx)│
└─────────────┘
```

---

## Configuration

### 1. URL du Backend

Par défaut, le client API utilise `http://localhost:5000`.

Pour changer l'URL, créez un fichier `.env.local` dans le dossier `frontend/` :

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Important** : Le préfixe `NEXT_PUBLIC_` est obligatoire pour que la variable soit accessible côté client.

### 2. Port du Backend

Le backend utilise le port `5000` par défaut. Si vous utilisez un autre port, mettez à jour `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:VOTRE_PORT
```

---

## Utilisation

### Dans un composant

#### 1. Utiliser l'état d'authentification

```tsx
"use client";

import { useAuth } from "@/lib/auth/context";

function MyComponent() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>;
  }

  return (
    <div>
      <p>Bonjour {user?.username}!</p>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
```

#### 2. Faire une requête authentifiée

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/client";

function Dashboard() {
  // Le token est automatiquement ajouté par le client API
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get("/api/dashboard/stats"),
  });

  if (isLoading) return <div>Chargement...</div>;

  return <div>{/* Afficher les données */}</div>;
}
```

#### 3. Utiliser les hooks de login/register

Les pages `login/page.tsx` et `register/page.tsx` montrent des exemples complets.

---

## Flux d'authentification

### Connexion (Login)

1. **Utilisateur remplit le formulaire** → `LoginPage`
2. **Validation côté client** → Vérifie que les champs sont remplis
3. **Appel à `useLogin()`** → Hook React Query
4. **Mutation React Query** → Appelle `login()` depuis `lib/api/auth.ts`
5. **Client API** → Fait `POST /api/auth/login` avec email/password
6. **Backend** → Vérifie les identifiants, retourne un token JWT
7. **Stockage** → Token sauvegardé dans `localStorage` via `storage.ts`
8. **Context** → Mise à jour de l'état utilisateur via `AuthProvider`
9. **Redirection** → Automatique vers `/app/dashboard`

### Inscription (Register)

1. **Utilisateur remplit le formulaire** → `RegisterPage`
2. **Validation côté client** → Vérifie tous les champs + correspondance des mots de passe
3. **Appel à `useRegister()`** → Hook React Query
4. **Mutation React Query** → Appelle `register()` depuis `lib/api/auth.ts`
5. **Client API** → Fait `POST /api/auth/register` avec username/email/password
6. **Backend** → Crée l'utilisateur, retourne les infos utilisateur
7. **Redirection** → Automatique vers `/login` (l'utilisateur doit se connecter)

### Vérification au chargement

1. **Au montage de l'app** → `AuthProvider` vérifie si un token existe
2. **Si token présent** → Appelle `GET /api/auth/me` pour récupérer les infos utilisateur
3. **Si succès** → Met à jour le context avec les infos utilisateur
4. **Si échec (401)** → Supprime le token et déconnecte l'utilisateur

### Requêtes authentifiées

1. **Composant fait une requête** → `api.get("/api/endpoint")`
2. **Client API** → Récupère le token depuis `localStorage`
3. **Ajout du header** → `Authorization: Bearer <token>`
4. **Backend** → Vérifie le token via `authMiddleware`
5. **Si token invalide (401)** → Client API supprime le token et redirige vers `/login`

---

## Sécurité

### Points importants

#### Ce qui est sécurisé

1. **Token JWT** : Le backend signe les tokens avec une clé secrète
2. **HTTPS en production** : Les tokens sont transmis de manière sécurisée
3. **Validation côté serveur** : Le backend valide toujours les données
4. **Expiration des tokens** : Les tokens expirent après 7 jours (configurable)
5. **Déconnexion automatique** : Si le token est invalide, l'utilisateur est déconnecté

#### Limitations actuelles

1. **localStorage** : Le token est stocké dans `localStorage`, ce qui est vulnérable aux attaques XSS

   - **Solution future** : Utiliser httpOnly cookies (nécessite des modifications backend)

2. **Pas de refresh token** : Si le token expire, l'utilisateur doit se reconnecter
   - **Solution future** : Implémenter un système de refresh token

### Bonnes pratiques

1. **Ne jamais exposer le token** : Ne pas le logger ou l'afficher dans la console
2. **HTTPS en production** : Toujours utiliser HTTPS pour transmettre les tokens
3. **Validation côté serveur** : Ne jamais faire confiance aux données client
4. **Gestion des erreurs** : Toujours gérer les erreurs 401 (non autorisé)

---

## 🐛 Dépannage

### Le token n'est pas envoyé

**Problème** : Les requêtes retournent 401 même après connexion.

**Solutions** :

1. Vérifier que le token est bien stocké : `localStorage.getItem('auth_token')`
2. Vérifier que le client API récupère bien le token dans `lib/api/client.ts`
3. Vérifier que le header `Authorization` est bien ajouté

### Redirection infinie

**Problème** : L'application redirige en boucle entre `/login` et `/dashboard`.

**Solutions** :

1. Vérifier que le `AuthProvider` ne fait pas de requête en boucle
2. Vérifier que le token n'est pas supprimé automatiquement
3. Vérifier les erreurs dans la console du navigateur

### Erreur CORS

**Problème** : `Access-Control-Allow-Origin` error.

**Solutions** :

1. Vérifier que le backend autorise les requêtes depuis `http://localhost:3000`
2. Vérifier la configuration CORS dans `backend/src/server.js`

---

## Ressources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Next.js App Router](https://nextjs.org/docs/app)
- [JWT Authentication](https://jwt.io/introduction)

---

## Checklist de déploiement

Avant de déployer en production :

- [ ] Configurer `NEXT_PUBLIC_API_URL` avec l'URL de production
- [ ] Vérifier que le backend utilise HTTPS
- [ ] Vérifier que CORS est configuré correctement
- [ ] Tester le flux complet de login/register
- [ ] Tester la déconnexion
- [ ] Tester l'expiration du token
- [ ] Vérifier que les erreurs sont bien gérées

---

**Dernière mise à jour** : 2024
