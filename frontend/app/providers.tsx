/**
 * Providers Globaux
 * ===================
 * 
 * POURQUOI ce fichier ?
 * ---------------------
 * Next.js 13+ avec App Router nécessite que les Providers
 * soient des "Client Components" (marqués avec "use client").
 * On ne peut pas mettre "use client" dans layout.tsx directement
 * si on veut garder le layout comme Server Component.
 * 
 * SOLUTION :
 * On crée un composant Providers séparé qui :
 * 1. Est un Client Component
 * 2. Enveloppe tous les Providers nécessaires
 * 3. Est importé dans layout.tsx
 * 
 * QUELS PROVIDERS ?
 * -----------------
 * 1. QueryClientProvider (React Query)
 *    - Gère le cache et les requêtes
 * 2. AuthProvider (notre context d'authentification)
 *    - Gère l'état utilisateur global
 * 
 * STRUCTURE :
 * ------------
 * QueryClientProvider
 *   AuthProvider
 *     children (Votre application)
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "../lib/auth/context";
import { ConfirmDialogProvider } from "../hooks/useConfirmDialog";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Provider principal de l'application
 * 
 * Ce composant doit envelopper toute l'application dans layout.tsx
 * 
 * POURQUOI créer QueryClient dans le composant ?
 * -----------------------------------------------
 * En créant QueryClient avec useState, on s'assure qu'il n'est
 * créé qu'une seule fois, même si le composant se re-render.
 * C'est important pour éviter de perdre le cache.
 */
export function Providers({ children }: ProvidersProps) {
  // Créer le QueryClient une seule fois
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Temps avant qu'une requête soit considérée comme "stale" (obsolète)
            staleTime: 60 * 1000, // 1 minute
            // Temps avant qu'une requête soit supprimée du cache
            gcTime: 5 * 60 * 1000, // 5 minutes (anciennement cacheTime)
            // Ne pas refetch automatiquement au focus de la fenêtre
            refetchOnWindowFocus: false,
            // Gérer les erreurs de manière globale
            retry: 1, // Réessayer 1 fois en cas d'erreur
          },
          mutations: {
            // Gérer les erreurs de mutation
            retry: 0, // Ne pas réessayer les mutations
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

/**
 * CONFIGURATION EXPLIQUÉE :
 * -------------------------
 * 
 * staleTime: 60 * 1000 (1 minute)
 *   - Pendant 1 minute, les données sont considérées comme "fraîches"
 *   - React Query ne refetch pas automatiquement
 *   - Utile pour éviter trop de requêtes
 * 
 * gcTime: 5 * 60 * 1000 (5 minutes)
 *   - Les données restent en cache 5 minutes après être devenues "stale"
 *   - Permet d'afficher les données en cache pendant le refetch
 * 
 * refetchOnWindowFocus: false
 *   - Ne pas refetch quand l'utilisateur revient sur l'onglet
 *   - Évite les requêtes inutiles
 * 
 * retry: 1 (pour queries)
 *   - Réessayer 1 fois en cas d'erreur réseau
 *   - Utile pour les connexions instables
 * 
 * retry: 0 (pour mutations)
 *   - Ne pas réessayer les mutations (login, register, etc.)
 *   - On veut que l'utilisateur voie l'erreur immédiatement
 */

