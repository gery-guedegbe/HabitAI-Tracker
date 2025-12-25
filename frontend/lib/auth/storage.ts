/**
 * Gestion du Stockage du Token
 * =============================
 *
 * POURQUOI ce fichier ?
 * ---------------------
 * On centralise la gestion du token JWT ici pour :
 * 1. Avoir un seul endroit où on gère le stockage
 * 2. Faciliter les changements futurs (passer à httpOnly cookies par exemple)
 * 3. Gérer les cas edge (SSR, localStorage non disponible)
 *
 * SÉCURITÉ :
 * ----------
 * ⚠️ IMPORTANT : Stocker le token dans localStorage n'est PAS la méthode
 * la plus sécurisée. En production, on devrait utiliser httpOnly cookies.
 * Mais pour commencer, localStorage est plus simple à implémenter.
 *
 * Pourquoi localStorage n'est pas idéal ?
 * - Vulnérable aux attaques XSS (si du code malveillant s'exécute)
 * - Accessible via JavaScript
 *
 * Pourquoi httpOnly cookies seraient mieux ?
 * - Non accessibles via JavaScript
 * - Envoyés automatiquement par le navigateur
 * - Protection contre XSS
 *
 * UTILISATION :
 * -------------
 * import { setToken, getToken, removeToken } from '@/lib/auth/storage';
 *
 * setToken('mon-token-jwt');
 * const token = getToken();
 * removeToken();
 */

const TOKEN_KEY = "auth_token";

/**
 * Stocke le token JWT dans localStorage
 *
 * @param token - Le token JWT à stocker
 */
export function setToken(token: string): void {
  if (typeof window === "undefined") {
    // SSR : on ne peut pas accéder à localStorage côté serveur
    return;
  }

  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    // Si localStorage n'est pas disponible (mode privé, quota dépassé, etc.)
    console.error("Impossible de stocker le token:", error);
  }
}

/**
 * Récupère le token JWT depuis localStorage
 *
 * @returns Le token JWT ou null si absent
 */
export function getToken(): string | null {
  if (typeof window === "undefined") {
    // SSR : localStorage n'existe pas côté serveur
    return null;
  }

  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Impossible de récupérer le token:", error);
    return null;
  }
}

/**
 * Supprime le token JWT de localStorage
 *
 * Utilisé lors de la déconnexion
 */
export function removeToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Impossible de supprimer le token:", error);
  }
}

/**
 * Vérifie si un token existe
 *
 * @returns true si un token est présent, false sinon
 */
export function hasToken(): boolean {
  return getToken() !== null;
}
