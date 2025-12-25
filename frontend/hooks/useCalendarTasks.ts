/**
 * Hook React Query pour récupérer les tâches du calendrier
 * Gère le cache et le refetch automatique
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getCalendarTasks, type CalendarResponse } from "@/lib/api/tasks";

export interface UseCalendarTasksParams {
  startDate: Date;
  endDate: Date;
  view?: "month" | "week" | "day";
  enabled?: boolean;
}

/**
 * Hook pour récupérer les tâches du calendrier
 * @param startDate - Date de début
 * @param endDate - Date de fin
 * @param view - Type de vue (month, week, day)
 * @param enabled - Activer/désactiver la requête
 */
export function useCalendarTasks({
  startDate,
  endDate,
  view = "month",
  enabled = true,
}: UseCalendarTasksParams) {
  // Formater les dates en YYYY-MM-DD
  const startDateStr = startDate.toISOString().split("T")[0];
  const endDateStr = endDate.toISOString().split("T")[0];

  return useQuery<CalendarResponse>({
    queryKey: ["calendar-tasks", startDateStr, endDateStr, view],
    queryFn: () => getCalendarTasks(startDateStr, endDateStr, view),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (anciennement cacheTime)
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

