# Guide de Configuration - Backend

## Configuration Manuelle Requise

### 1. Variables d'environnement (.env)

Créez un fichier `.env` à la racine du dossier `backend` :

```env
# ============================================
# SERVEUR
# ============================================
PORT=5000

# ============================================
# BASE DE DONNÉES PostgreSQL
# ============================================
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_postgres
DB_NAME=habitai_tracker_db

# ============================================
# JWT (Authentification)
# ============================================
# Générez une clé secrète aléatoire (ex: openssl rand -hex 32)
JWT_SECRET=votre-clé-secrète-très-longue-et-aléatoire-changez-moi
JWT_EXPIRES=7d

# ============================================
# API KEYS (Optionnel pour MVP)
# ============================================
# Groq API (GRATUIT) - https://console.groq.com
# Créez un compte gratuit et récupérez votre clé API
GROQ_API_KEY=votre-groq-api-key

# AssemblyAI (Optionnel - pour transcription audio, recommandé)
# https://www.assemblyai.com/app/account
TRANSCRIPTION_PROVIDER=assemblyai
ASSEMBLYAI_API_KEY=votre-assemblyai-api-key

# ============================================
# FRONTEND (CORS)
# ============================================
FRONTEND_URL=http://localhost:3000

# ============================================
# API URL (Swagger)
# ============================================
API_URL=http://localhost:5000

# ============================================
# EMAIL (Optionnel - pour reset password)
# ============================================
# Resend API - https://resend.com
RESEND_API_KEY=votre-resend-api-key
RESEND_FROM_EMAIL=noreply@votredomaine.com
```

### 2. Base de données PostgreSQL

#### Option A : Script automatique

```bash
npm run init-db
```

#### Option B : Manuellement

1. **Créer la base de données** :

```sql
CREATE DATABASE habitai_tracker_db;
```

2. **Exécuter le schéma SQL** :

```bash
psql -U postgres -d habitai_tracker_db -f src/config/schema/schema.sql
```

Ou via psql :

```sql
\c habitai_tracker_db
\i src/config/schema/schema.sql
```

### 3. Clé API Groq (Recommandé pour MVP)

1. Allez sur https://console.groq.com
2. Créez un compte gratuit
3. Générez une clé API
4. Ajoutez-la dans votre `.env` comme `GROQ_API_KEY`

**Note** : Sans cette clé, le serveur démarrera mais l'extraction IA ne fonctionnera pas. Vous pourrez toujours créer des journaux et ajouter des tâches manuellement.

### 4. Clé JWT Secrète

Générez une clé secrète sécurisée :

**Linux/Mac** :

```bash
openssl rand -hex 32
```

**Windows PowerShell** :

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Ou utilisez un générateur en ligne : https://randomkeygen.com/

## Vérification

Une fois configuré, lancez le serveur :

```bash
npm run dev
```

Vous devriez voir :

```
 PostgreSQL connected
 Server running on port 5000
 Swagger docs: http://localhost:5000/api-docs
 Health check: http://localhost:5000/api/health
```

## Dépannage

### Erreur : "PostgreSQL connection error"

- Vérifiez que PostgreSQL est démarré
- Vérifiez les credentials dans `.env`
- Testez la connexion : `psql -U postgres -h localhost`

### Erreur : "GROQ_API_KEY is missing"

- Le serveur démarre quand même
- L'extraction IA ne fonctionnera pas
- Ajoutez la clé dans `.env` ou créez des tâches manuellement

### Erreur : "database does not exist"

- Exécutez `npm run init-db`
- Ou créez la base manuellement

## Notes

- **MVP** : Vous pouvez démarrer sans `GROQ_API_KEY` et ajouter les tâches manuellement
- **Production** : Toutes les variables doivent être configurées
- **Sécurité** : Ne commitez jamais le fichier `.env` (déjà dans .gitignore)
