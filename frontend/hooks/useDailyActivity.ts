/**
 * Hook pour récupérer les données d'activité quotidienne
 * Utilise les données du dashboard
 */

"use client";

import { useDashboardStats } from "./useDashboardStats";

export interface DailyActivityData {
  day: string;
  date: string;
  total: number;
  completed: number;
}

/**
 * Hook pour récupérer les données d'activité quotidienne formatées pour les graphiques
 * @param days - Nombre de jours à analyser (défaut: 7)
 */
export function useDailyActivity(days: number = 7) {
  const { data, isLoading, error } = useDashboardStats(days);

  // Formater les données pour le graphique
  const activityData: DailyActivityData[] | undefined = data
    ? data.daily_activity
        .slice(-7) // Prendre les 7 derniers jours
        .map((item) => {
          const date = new Date(item.date);
          const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
          return {
            day: dayName,
            date: item.date,
            total: item.total_tasks,
            completed: item.completed_tasks,
          };
        })
    : undefined;

  return {
    data: activityData,
    isLoading,
    error,
  };
}

