/**
 * Client API Centralisé
 * ====================
 *
 * POURQUOI ce fichier ?
 * ---------------------
 * Au lieu de faire des fetch() partout dans le code, on centralise
 * toutes les requêtes HTTP ici. Cela permet de :
 * 1. Gérer les erreurs de manière cohérente
 * 2. Ajouter automatiquement le token JWT à chaque requête
 * 3. Avoir une URL de base configurée une seule fois
 * 4. Gérer les erreurs réseau de manière uniforme
 *
 * COMMENT ça marche ?
 * -------------------
 * 1. On définit l'URL de base du backend (API_BASE_URL)
 * 2. On crée une fonction `apiClient` qui fait les requêtes
 * 3. Cette fonction ajoute automatiquement :
 *    - Le header "Content-Type: application/json"
 *    - Le token JWT s'il existe (depuis localStorage)
 * 4. On gère les erreurs HTTP (401, 404, 500, etc.)
 *
 * UTILISATION :
 * -------------
 * import apiClient from '@/lib/api/client';
 *
 * const data = await apiClient.get('/api/auth/me');
 * const result = await apiClient.post('/api/auth/login', { email, password });
 */

// URL de base du backend
// En développement : http://localhost:PORT
// En production : votre URL de production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Type pour les options de requête
interface RequestOptions extends RequestInit {
  // On peut ajouter des options personnalisées ici si besoin
}

// Import des fonctions de stockage
import { getToken, removeToken } from "../auth/storage";

/**
 * Client API principal
 *
 * Cette fonction fait toutes les requêtes HTTP vers le backend.
 * Elle gère automatiquement :
 * - L'ajout du token JWT dans les headers
 * - La gestion des erreurs
 * - La conversion JSON
 */
async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  // 1. Construire l'URL complète
  const url = `${API_BASE_URL}${endpoint}`;

  // 2. Récupérer le token si disponible
  const token = getToken();

  // 3. Préparer les headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers, // Permet de surcharger les headers si besoin
  };

  // 4. Ajouter le token JWT si disponible
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // 5. Préparer la configuration de la requête
  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    // 6. Faire la requête
    const response = await fetch(url, config);

    // 7. Gérer les erreurs HTTP
    if (!response.ok) {
      // Si 401 (Unauthorized), le token est invalide ou expiré
      if (response.status === 401) {
        removeToken();
        // Optionnel : rediriger vers /login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      // Essayer de parser le message d'erreur du backend
      let errorMessage = "Une erreur est survenue";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Si le backend ne renvoie pas de JSON, utiliser le status
        errorMessage = `Erreur ${response.status}: ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    // 8. Parser la réponse JSON
    // Si la réponse est vide (204 No Content), retourner null
    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return null as T;
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    // 9. Gérer les erreurs réseau (pas de connexion, timeout, etc.)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Impossible de se connecter au serveur. Vérifiez votre connexion."
      );
    }

    // Propager l'erreur (elle contient déjà le message)
    throw error;
  }
}

/**
 * Méthodes HTTP simplifiées
 *
 * Au lieu d'appeler apiClient('/endpoint', { method: 'GET' }),
 * on peut faire apiClient.get('/endpoint')
 */
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};

// Export par défaut pour compatibilité
export default api;
