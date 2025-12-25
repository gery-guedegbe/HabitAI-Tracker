/**
 * Hook pour récupérer les statistiques des routines
 * Utilise les données du dashboard (top_activities comme routines)
 */

"use client";

import { useDashboardStats } from "./useDashboardStats";

export interface RoutinesOverview {
  active: number;
  completedToday: number;
  pending: number;
  topRoutines: Array<{
    title: string;
    frequency: number;
    completedCount: number;
  }>;
}

/**
 * Hook pour récupérer les statistiques des routines
 * @param days - Nombre de jours à analyser (défaut: 30 pour les routines)
 */
export function useRoutinesOverview(days: number = 30) {
  const { data, isLoading, error } = useDashboardStats(days);

  // Calculer les stats des routines depuis les données du dashboard
  const routinesOverview: RoutinesOverview | undefined = data
    ? {
        // Les top_activities sont considérées comme des routines actives
        active: data.top_activities.length,
        // Routines complétées aujourd'hui (basé sur les activités complétées)
        completedToday: data.top_activities.reduce(
          (sum, activity) => sum + activity.completed_count,
          0
        ),
        // Routines en attente (activités non complétées)
        pending: data.top_activities.filter(
          (activity) => activity.completed_count === 0
        ).length,
        topRoutines: data.top_activities.slice(0, 5).map((activity) => ({
          title: activity.title,
          frequency: activity.frequency,
          completedCount: activity.completed_count,
        })), // Top 5 routines
      }
    : undefined;

  return {
    data: routinesOverview,
    isLoading,
    error,
  };
}
