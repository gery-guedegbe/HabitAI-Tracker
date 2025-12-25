# Variables d'environnement - Backend

Créez un fichier `.env` à la racine du dossier `backend` avec les variables suivantes :

## Obligatoires

```env
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_NAME=habitai_tracker_db

# JWT (générez avec: openssl rand -hex 32)
JWT_SECRET=votre-clé-secrète-minimum-32-caractères
JWT_EXPIRES=7d

# Frontend (pour CORS)
FRONTEND_URL=http://localhost:3000
```

## Optionnelles (recommandées)

```env
# Extraction IA (gratuit sur https://console.groq.com)
GROQ_API_KEY=votre-groq-api-key

# Transcription audio
TRANSCRIPTION_PROVIDER=assemblyai
ASSEMBLYAI_API_KEY=votre-assemblyai-api-key

# Email (pour reset password)
RESEND_API_KEY=votre-resend-api-key
RESEND_FROM_EMAIL=noreply@votredomaine.com

# Serveur
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000
```

## Notes

- Le serveur peut démarrer sans `GROQ_API_KEY`, mais l'extraction IA ne fonctionnera pas
- Sans clé IA, vous pouvez toujours créer des journaux et ajouter des tâches manuellement

