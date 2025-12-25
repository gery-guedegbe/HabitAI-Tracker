/**
 * Fonctions API d'Authentification
 * =================================
 *
 * POURQUOI ce fichier ?
 * ---------------------
 * On sépare les fonctions API par domaine (auth, users, journals, etc.)
 * Cela permet de :
 * 1. Organiser le code par fonctionnalité
 * 2. Faciliter la maintenance
 * 3. Réutiliser ces fonctions dans différents composants
 *
 * TYPES :
 * -------
 * On définit les types TypeScript pour les données d'entrée et de sortie.
 * Cela nous donne :
 * - L'autocomplétion dans l'IDE
 * - La détection d'erreurs avant l'exécution
 * - Une documentation claire de ce que chaque fonction attend/reçoit
 *
 * UTILISATION :
 * -------------
 * import { login, register, getMe } from '@/lib/api/auth';
 *
 * const result = await login({ email: 'user@example.com', password: 'pass' });
 * console.log(result.token); // Le token JWT
 * console.log(result.user);  // Les infos utilisateur
 */

import api from "./client";
import { setToken } from "../auth/storage";

// ============= TYPES =============

/**
 * Données nécessaires pour l'inscription
 */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

/**
 * Données nécessaires pour la connexion
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Structure de l'utilisateur retournée par l'API
 */
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at?: string;
}

/**
 * Réponse de l'API lors de la connexion
 */
export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Réponse de l'API lors de l'inscription
 */
export interface RegisterResponse {
  user: User;
}

/**
 * Données nécessaires pour changer le mot de passe
 */
export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

/**
 * Réponse de l'API lors du changement de mot de passe
 */
export interface ChangePasswordResponse {
  message: string;
}

/**
 * Données nécessaires pour demander la réinitialisation du mot de passe
 */
export interface ForgotPasswordData {
  email: string;
}

/**
 * Réponse de l'API lors de la demande de réinitialisation
 */
export interface ForgotPasswordResponse {
  message: string;
}

/**
 * Données nécessaires pour réinitialiser le mot de passe avec un token
 */
export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

/**
 * Réponse de l'API lors de la réinitialisation du mot de passe
 */
export interface ResetPasswordResponse {
  message: string;
}

// ============= FONCTIONS API =============

/**
 * Inscription d'un nouvel utilisateur
 *
 * @param data - Données d'inscription (username, email, password)
 * @returns Les informations de l'utilisateur créé
 * @throws Error si l'inscription échoue (email déjà utilisé, etc.)
 *
 * EXEMPLE :
 * ```ts
 * try {
 *   const result = await register({
 *     username: 'johndoe',
 *     email: 'john@example.com',
 *     password: 'securePassword123'
 *   });
 *   console.log('Utilisateur créé:', result.user);
 * } catch (error) {
 *   console.error('Erreur:', error.message);
 * }
 * ```
 */
export async function register(data: RegisterData): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>("/api/auth/register", data);
  return response;
}

/**
 * Connexion d'un utilisateur
 *
 * @param data - Données de connexion (email, password)
 * @returns Le token JWT et les informations utilisateur
 * @throws Error si les identifiants sont incorrects
 *
 * NOTE IMPORTANTE :
 * Cette fonction stocke automatiquement le token dans localStorage.
 * Vous n'avez pas besoin de le faire manuellement après l'appel.
 *
 * EXEMPLE :
 * ```ts
 * try {
 *   const result = await login({
 *     email: 'john@example.com',
 *     password: 'securePassword123'
 *   });
 *   // Le token est déjà stocké automatiquement !
 *   console.log('Connecté:', result.user);
 * } catch (error) {
 *   console.error('Erreur:', error.message);
 * }
 * ```
 */
export async function login(data: LoginData): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/api/auth/login", data);

  // Stocker automatiquement le token
  // C'est ici qu'on fait le lien entre l'API et le stockage
  setToken(response.token);

  return response;
}

/**
 * Récupère les informations de l'utilisateur connecté
 *
 * @returns Les informations de l'utilisateur actuel
 * @throws Error si l'utilisateur n'est pas authentifié (401)
 *
 * EXEMPLE :
 * ```ts
 * try {
 *   const user = await getMe();
 *   console.log('Utilisateur connecté:', user);
 * } catch (error) {
 *   // Token invalide ou expiré
 *   console.error('Non authentifié');
 * }
 * ```
 */
export async function getMe(): Promise<User> {
  const response = await api.get<User>("/api/auth/me");
  return response;
}

/**
 * Change le mot de passe de l'utilisateur connecté
 *
 * @param data - Données de changement de mot de passe (oldPassword, newPassword)
 * @returns Message de confirmation
 * @throws Error si l'ancien mot de passe est incorrect ou si les champs sont manquants
 *
 * EXEMPLE :
 * ```ts
 * try {
 *   const result = await changePassword({
 *     oldPassword: 'ancienMotDePasse',
 *     newPassword: 'nouveauMotDePasse123'
 *   });
 *   console.log('Mot de passe changé:', result.message);
 * } catch (error) {
 *   console.error('Erreur:', error.message);
 * }
 * ```
 */
export async function changePassword(
  data: ChangePasswordData
): Promise<ChangePasswordResponse> {
  const response = await api.patch<ChangePasswordResponse>(
    "/api/auth/change-password",
    data
  );
  return response;
}

/**
 * Demande de réinitialisation du mot de passe
 *
 * @param data - Email de l'utilisateur
 * @returns Message de confirmation
 * @throws Error si l'email n'existe pas ou est manquant
 *
 * EXEMPLE :
 * ```ts
 * try {
 *   const result = await forgotPassword({
 *     email: 'user@example.com'
 *   });
 *   console.log('Email envoyé:', result.message);
 * } catch (error) {
 *   console.error('Erreur:', error.message);
 * }
 * ```
 */
export async function forgotPassword(
  data: ForgotPasswordData
): Promise<ForgotPasswordResponse> {
  const response = await api.post<ForgotPasswordResponse>(
    "/api/auth/forgot-password",
    data
  );
  return response;
}

/**
 * Réinitialise le mot de passe avec un token
 *
 * @param data - Token de réinitialisation et nouveau mot de passe
 * @returns Message de confirmation
 * @throws Error si le token est invalide ou expiré
 *
 * EXEMPLE :
 * ```ts
 * try {
 *   const result = await resetPassword({
 *     token: 'token-from-email',
 *     newPassword: 'nouveauMotDePasse123'
 *   });
 *   console.log('Mot de passe réinitialisé:', result.message);
 * } catch (error) {
 *   console.error('Erreur:', error.message);
 * }
 * ```
 */
export async function resetPassword(
  data: ResetPasswordData
): Promise<ResetPasswordResponse> {
  const response = await api.post<ResetPasswordResponse>(
    "/api/auth/reset-password",
    data
  );
  return response;
}
