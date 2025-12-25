/**
 * Hook pour récupérer les routines actives
 * Utilise les données du dashboard (top_activities comme routines)
 */

"use client";

import { useDashboardStats } from "./useDashboardStats";

export interface ActiveRoutine {
  id: string;
  name: string;
  timeOfDay: "morning" | "afternoon" | "evening";
  duration: number;
  taskCount: number;
  streak: number;
  emoji: string;
}

// Emojis par moment de la journée
const timeOfDayEmojis: Record<string, string> = {
  morning: "🌅",
  afternoon: "☀️",
  evening: "🌆",
  default: "⭐",
};

/**
 * Hook pour récupérer les routines actives formatées
 * @param limit - Nombre de routines à retourner (défaut: 3)
 */
export function useActiveRoutines(limit: number = 3) {
  const { data, isLoading, error } = useDashboardStats(30); // 30 derniers jours

  // Formater les top_activities en routines actives
  const activeRoutines: ActiveRoutine[] | undefined = data
    ? data.top_activities
        .slice(0, limit)
        .map((activity, index) => {
          // Déterminer le moment de la journée basé sur l'index (simplifié)
          const timeOfDayOptions: ("morning" | "afternoon" | "evening")[] = [
            "morning",
            "afternoon",
            "evening",
          ];
          const timeOfDay =
            timeOfDayOptions[index % timeOfDayOptions.length] || "morning";

          // Calculer le streak basé sur la fréquence (simplifié)
          const streak = Math.min(activity.frequency, 30);

          return {
            id: `routine-${index}`,
            name: activity.title,
            timeOfDay,
            duration: 60, // Durée par défaut, peut être amélioré
            taskCount: activity.frequency,
            streak,
            emoji: timeOfDayEmojis[timeOfDay] || timeOfDayEmojis.default,
          };
        })
    : undefined;

  return {
    data: activeRoutines,
    isLoading,
    error,
  };
}

