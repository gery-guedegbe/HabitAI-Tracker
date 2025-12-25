# Démarrage Rapide - Backend

## Configuration minimale pour démarrer

### 1. Créer le fichier `.env`

```bash
cd backend
cp .env.example .env
```

### 2. Éditer `.env` avec les valeurs minimales

**OBLIGATOIRE** :

```env
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_NAME=habitai_tracker_db

# JWT (générez avec: openssl rand -hex 32)
JWT_SECRET=votre-clé-secrète-minimum-32-caractères

# Frontend
FRONTEND_URL=http://localhost:3000
```

**OPTIONNEL** (pour MVP) :

```env
# L'extraction IA ne fonctionnera pas sans cette clé
# Mais vous pouvez créer des tâches manuellement
GROQ_API_KEY=votre-clé-groq
```

### 3. Créer la base de données

```bash
# Option 1: Script automatique
npm run init-db

# Option 2: Manuellement
createdb habitai_tracker_db
psql -U postgres -d habitai_tracker_db -f src/config/schema/schema.sql
```

### 4. Démarrer le serveur

```bash
npm run dev
```

## Vérification

Si tout est OK, vous verrez :

```
 PostgreSQL connected
 Server running on port 5000
 Swagger docs: http://localhost:5000/api-docs
```

## Si erreur GROQ_API_KEY

Le serveur **démarre quand même** ! L'extraction IA ne fonctionnera simplement pas.
Vous pouvez :

- Créer des journaux manuellement
- Ajouter des tâches manuellement
- Obtenir une clé Groq gratuite plus tard

## Obtenir une clé Groq (gratuit)

1. Allez sur https://console.groq.com
2. Créez un compte (gratuit)
3. Générez une clé API
4. Ajoutez-la dans `.env` comme `GROQ_API_KEY=...`
5. Redémarrez le serveur
