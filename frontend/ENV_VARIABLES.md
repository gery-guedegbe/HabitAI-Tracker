# Variables d'environnement - Frontend

Créez un fichier `.env.local` à la racine du dossier `frontend` avec la variable suivante :

## Obligatoire

```env
# URL du backend
# En développement : http://localhost:5000
# En production : https://votre-backend.com
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Notes

- Le préfixe `NEXT_PUBLIC_` est obligatoire pour que la variable soit accessible côté client
- En production, remplacez par l'URL de votre backend déployé

