/**
 * Hook pour récupérer les top activités
 * Utilise les données du dashboard
 */

"use client";

import { useDashboardStats } from "./useDashboardStats";

export interface TopActivityData {
  name: string;
  count: number;
  percentage: number;
}

/**
 * Hook pour récupérer les top activités formatées
 * @param limit - Nombre d'activités à retourner (défaut: 5)
 * @param days - Nombre de jours à analyser (défaut: 30)
 */
export function useTopActivities(limit: number = 5, days: number = 30) {
  const { data, isLoading, error } = useDashboardStats(days);

  // Formater les top_activities
  const topActivities: TopActivityData[] | undefined = data
    ? data.top_activities
        .slice(0, limit)
        .map((activity) => {
          // Calculer le pourcentage basé sur la fréquence maximale
          const maxFrequency = data.top_activities[0]?.frequency || 1;
          const percentage = Math.round(
            (activity.frequency / maxFrequency) * 100
          );

          return {
            name: activity.title,
            count: activity.frequency,
            percentage,
          };
        })
    : undefined;

  return {
    data: topActivities,
    isLoading,
    error,
  };
}

