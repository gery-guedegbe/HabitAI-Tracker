/**
 * Hook pour récupérer les tâches à venir
 * Utilise les données du dashboard (top_activities comme tâches récurrentes)
 */

"use client";

import { useDashboardStats } from "./useDashboardStats";

export interface UpcomingTask {
  id: string;
  title: string;
  category: string;
  duration: number | null;
  priority: "low" | "medium" | "high" | "urgent";
  tags: string[];
  status: "todo" | "in_progress" | "done";
}

/**
 * Hook pour récupérer les tâches à venir formatées
 * @param limit - Nombre de tâches à retourner (défaut: 5)
 */
export function useUpcomingTasks(limit: number = 5) {
  const { data, isLoading, error } = useDashboardStats(7); // 7 derniers jours

  // Formater les top_activities en tâches à venir
  const upcomingTasks: UpcomingTask[] | undefined = data
    ? data.top_activities
        .filter((activity) => activity.completed_count < activity.frequency) // Seulement les tâches non complétées
        .slice(0, limit)
        .map((activity, index) => {
          // Déterminer la priorité basée sur la fréquence
          let priority: "low" | "medium" | "high" | "urgent" = "medium";
          if (activity.frequency >= 5) priority = "high";
          else if (activity.frequency >= 3) priority = "medium";
          else priority = "low";

          // Déterminer le statut basé sur le ratio de complétion
          let status: "todo" | "in_progress" | "done" = "todo";
          const completionRatio = activity.completed_count / activity.frequency;
          if (completionRatio === 1) status = "done";
          else if (completionRatio > 0) status = "in_progress";

          return {
            id: `task-${index}`,
            title: activity.title,
            category: "Other", // Par défaut, peut être amélioré avec une catégorisation
            duration: null, // Pas disponible dans les données actuelles
            priority,
            tags: [],
            status,
          };
        })
    : undefined;

  return {
    data: upcomingTasks,
    isLoading,
    error,
  };
}

