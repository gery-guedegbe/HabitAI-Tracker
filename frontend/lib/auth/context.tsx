/**
 * Context d'Authentification
 * ===========================
 * 
 * POURQUOI un Context React ?
 * ---------------------------
 * Le Context React permet de partager l'état d'authentification
 * entre TOUS les composants de l'application sans avoir à passer
 * des props à chaque niveau (prop drilling).
 * 
 * AVANT (sans Context) :
 * ```tsx
 * <App>
 *   <Header user={user} />
 *   <Dashboard user={user} />
 *   <Profile user={user} />
 * </App>
 * ```
 * 
 * APRÈS (avec Context) :
 * ```tsx
 * <AuthProvider>
 *   <App>
 *     <Header />  // Accède à user via useAuth()
 *     <Dashboard /> // Accède à user via useAuth()
 *     <Profile />  // Accède à user via useAuth()
 *   </App>
 * </AuthProvider>
 * ```
 * 
 * COMMENT ça marche ?
 * -------------------
 * 1. Le Provider stocke l'état (user, isLoading, etc.)
 * 2. Tous les composants enfants peuvent accéder à cet état
 * 3. Quand on se connecte/déconnecte, l'état se met à jour partout
 * 
 * UTILISATION :
 * -------------
 * // Dans un composant :
 * import { useAuth } from '@/lib/auth/context';
 * 
 * function MyComponent() {
 *   const { user, isLoading, isAuthenticated } = useAuth();
 *   
 *   if (isLoading) return <div>Chargement...</div>;
 *   if (!isAuthenticated) return <div>Non connecté</div>;
 *   
 *   return <div>Bonjour {user.username}!</div>;
 * }
 */

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../api/auth";
import { getMe } from "../api/auth";
import { getToken, removeToken } from "./storage";

// ============= TYPES =============

interface AuthContextType {
  // État
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// ============= CONTEXT =============

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============= PROVIDER =============

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provider d'authentification
 * 
 * Ce composant doit envelopper toute l'application pour que
 * tous les composants puissent accéder à l'état d'authentification.
 * 
 * FONCTIONNALITÉS :
 * 1. Vérifie au chargement si un token existe
 * 2. Si oui, récupère les infos utilisateur
 * 3. Met à jour l'état global
 * 4. Fournit des fonctions pour login/logout
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // État local
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculer si l'utilisateur est authentifié
  const isAuthenticated = user !== null;

  /**
   * Fonction pour se connecter
   * Appelée après un login réussi
   */
  const login = (userData: User) => {
    setUser(userData);
  };

  /**
   * Fonction pour se déconnecter
   * Supprime le token et réinitialise l'état
   */
  const logout = () => {
    removeToken();
    setUser(null);
  };

  /**
   * Rafraîchit les informations utilisateur
   * Utile après une mise à jour du profil
   */
  const refreshUser = async () => {
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (error) {
      // Si erreur (token invalide), déconnecter
      logout();
    }
  };

  /**
   * Effet au montage du composant
   * Vérifie si l'utilisateur est déjà connecté
   */
  useEffect(() => {
    async function checkAuth() {
      // Vérifier si un token existe
      const token = getToken();

      if (!token) {
        // Pas de token = pas connecté
        setIsLoading(false);
        return;
      }

      // Token présent, récupérer les infos utilisateur
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        // Token invalide ou expiré
        // Le client API a déjà supprimé le token
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []); // Exécuté une seule fois au montage

  // Valeur du context
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============= HOOK =============

/**
 * Hook pour accéder au context d'authentification
 * 
 * @returns L'état et les fonctions d'authentification
 * @throws Error si utilisé en dehors d'un AuthProvider
 * 
 * EXEMPLE :
 * ```tsx
 * function MyComponent() {
 *   const { user, logout } = useAuth();
 *   
 *   return (
 *     <div>
 *       <p>Bonjour {user?.username}</p>
 *       <button onClick={logout}>Déconnexion</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }

  return context;
}

