/**
 * Hook pour récupérer les données de heatmap d'activité
 * Utilise les données du dashboard
 */

"use client";

import { useDashboardStats } from "./useDashboardStats";

export interface HeatmapData {
  day: number;
  date: string;
  count: number;
}

/**
 * Hook pour récupérer les données de heatmap formatées
 * @param days - Nombre de jours à analyser (défaut: 30)
 */
export function useActivityHeatmap(days: number = 30) {
  const { data, isLoading, error } = useDashboardStats(days);

  // Formater les daily_activity pour le heatmap
  const heatmapData: HeatmapData[] | undefined = data
    ? data.daily_activity
        .slice(-days) // Prendre les derniers jours
        .map((item, index) => ({
          day: index,
          date: item.date,
          count: item.completed_tasks, // Utiliser les tâches complétées comme count
        }))
    : undefined;

  return {
    data: heatmapData,
    isLoading,
    error,
  };
}

