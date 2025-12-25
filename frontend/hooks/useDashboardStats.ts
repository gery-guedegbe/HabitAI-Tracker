/**
 * Hook pour récupérer les statistiques du dashboard
 * ==================================================
 *
 * Ce hook utilise React Query pour gérer la récupération
 * et le cache des statistiques du dashboard.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  type DashboardStatsResponse,
} from "../lib/api/dashboard";

/**
 * Hook pour récupérer les statistiques du dashboard
 *
 * @param days - Nombre de jours à analyser (défaut: 30)
 * @returns Les données, l'état de chargement et les erreurs
 *
 * EXEMPLE :
 * ```tsx
 * function DashboardPage() {
 *   const { data, isLoading, error } = useDashboardStats(30);
 *
 *   if (isLoading) return <div>Chargement...</div>;
 *   if (error) return <div>Erreur: {error.message}</div>;
 *
 *   return <div>Taux: {data.stats.completion_rate}%</div>;
 * }
 * ```
 */
export function useDashboardStats(days: number = 30) {
  return useQuery<DashboardStatsResponse, Error>({
    queryKey: ["dashboard", "stats", days],
    queryFn: () => getDashboardStats(days),
    staleTime: 5 * 60 * 1000, // 5 minutes - les stats ne changent pas si souvent
    gcTime: 10 * 60 * 1000, // 10 minutes en cache
    refetchOnWindowFocus: false, // Ne pas refetch automatiquement
    retry: 1, // Réessayer 1 fois en cas d'erreur
  });
}
