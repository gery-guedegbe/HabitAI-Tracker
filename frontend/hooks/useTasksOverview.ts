/**
 * Hook pour récupérer les statistiques des tâches
 * Utilise les données du dashboard
 */

"use client";

import { useDashboardStats } from "./useDashboardStats";

export interface TasksOverview {
  todo: number;
  inProgress: number;
  completedToday: number;
  total: number;
}

/**
 * Hook pour récupérer les statistiques des tâches
 * @param days - Nombre de jours à analyser (défaut: 7 pour les stats récentes)
 */
export function useTasksOverview(days: number = 7) {
  const { data, isLoading, error } = useDashboardStats(days);

  // Calculer les stats des tâches depuis les données du dashboard
  const tasksOverview: TasksOverview | undefined = data
    ? {
        total: data.stats.total_tasks,
        completedToday: data.stats.completed_tasks, // Tâches complétées dans la période
        // Pour todo et inProgress, on utilise une estimation basée sur les données disponibles
        // Dans un vrai backend, on aurait un endpoint spécifique pour ces stats
        todo: Math.max(0, data.stats.total_tasks - data.stats.completed_tasks),
        inProgress: Math.floor(
          (data.stats.total_tasks - data.stats.completed_tasks) * 0.3
        ), // Estimation: 30% des tâches non complétées sont en cours
      }
    : undefined;

  return {
    data: tasksOverview,
    isLoading,
    error,
  };
}
