/**
 * Vue Semaine - Timeline avec barres de progression
 * Affiche les 7 jours de la semaine avec barres proportionnelles au nombre de tâches
 */

"use client";

import { useMemo } from "react";
import { Calendar, TrendingUp } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { useCalendarTasks } from "@/hooks/useCalendarTasks";
import { CalendarSkeleton } from "./CalendarSkeleton";
import type { CalendarTask } from "@/lib/api/tasks";

interface WeekViewProps {
  selectedDate: Date;
  onDateSelect?: (date: Date) => void;
}

/**
 * Obtenir les dates de la semaine (lundi à dimanche)
 */
const getWeekDates = (date: Date): Date[] => {
  const dayOfWeek = date.getDay();
  const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Lundi
  const monday = new Date(date.setDate(diff));
  
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    weekDates.push(day);
  }
  return weekDates;
};

/**
 * Formater le nom du jour
 */
const formatDayName = (date: Date, language: "en" | "fr"): string => {
  return date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
    weekday: "short",
  });
};

/**
 * Formater la date (jour + mois)
 */
const formatDate = (date: Date, language: "en" | "fr"): string => {
  return date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "short",
  });
};

/**
 * Obtenir la couleur selon le nombre de tâches
 */
const getBarColor = (count: number, isDark: boolean): string => {
  if (count === 0) return "bg-neutral-200 dark:bg-neutral-700";
  if (count <= 2) return "bg-primary-300 dark:bg-primary-800";
  if (count <= 4) return "bg-primary-500 dark:bg-primary-600";
  if (count <= 6) return "bg-primary-600 dark:bg-primary-500";
  return "bg-primary-700 dark:bg-primary-400";
};

export function WeekView({ selectedDate, onDateSelect }: WeekViewProps) {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  // Calculer les dates de la semaine
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  // Calculer startDate et endDate pour la semaine
  const { startDate, endDate } = useMemo(() => {
    if (weekDates.length === 0) {
      const today = new Date();
      return { startDate: today, endDate: today };
    }
    const start = new Date(weekDates[0]);
    start.setHours(0, 0, 0, 0);
    const end = new Date(weekDates[6]);
    end.setHours(23, 59, 59, 999);
    return { startDate: start, endDate: end };
  }, [weekDates]);

  // Récupérer les tâches
  const { data, isLoading, error } = useCalendarTasks({
    startDate,
    endDate,
    view: "week",
  });

  // Créer un map des tâches par date
  const tasksByDate = useMemo(() => {
    if (!data?.tasks_by_date) return new Map<string, CalendarTask[]>();

    const map = new Map<string, CalendarTask[]>();
    Object.entries(data.tasks_by_date).forEach(([date, tasks]) => {
      map.set(date, tasks);
    });
    return map;
  }, [data]);

  // Obtenir le nombre de tâches complétées pour une date
  const getTaskCount = (date: Date): number => {
    const dateKey = date.toISOString().split("T")[0];
    const tasks = tasksByDate.get(dateKey) || [];
    return tasks.filter((task) => task.status === "done").length;
  };

  // Calculer le maximum pour normaliser les barres
  const maxTasks = useMemo(() => {
    const counts = weekDates.map((date) => getTaskCount(date));
    return Math.max(...counts, 1); // Au moins 1 pour éviter division par 0
  }, [weekDates, tasksByDate]);

  // Vérifier si c'est aujourd'hui
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
        <div className="space-y-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
              <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
        <p className="text-error-600 dark:text-error-400 text-sm">
          {error.message || t("errorLoadingData")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h3 className="text-lg font-semibold text-foreground">
          {t("weekView")}
        </h3>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {weekDates.map((date, index) => {
          const taskCount = getTaskCount(date);
          const percentage = (taskCount / maxTasks) * 100;
          const isCurrentDay = isToday(date);
          const dateKey = date.toISOString().split("T")[0];

          return (
            <div
              key={dateKey}
              className={`group cursor-pointer transition-all duration-200 ${
                isCurrentDay
                  ? "bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 border border-primary-200 dark:border-primary-800"
                  : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-lg p-3"
              }`}
              onClick={() => onDateSelect?.(date)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isCurrentDay
                        ? "bg-primary-600 dark:bg-primary-500 text-white"
                        : "bg-neutral-100 dark:bg-neutral-800 text-foreground"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {formatDayName(date, language)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(date, language)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {taskCount > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="w-3 h-3 text-success-600 dark:text-success-400" />
                      <span className="font-medium text-foreground">
                        {taskCount}
                      </span>
                      <span>
                        {taskCount === 1 ? t("task") : t("tasks")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Barre de progression */}
              <div className="relative w-full h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getBarColor(
                    taskCount,
                    false
                  )} rounded-full transition-all duration-500 ease-out ${
                    taskCount > 0 ? "shadow-sm" : ""
                  }`}
                  style={{ width: `${percentage}%` }}
                />
                {taskCount === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-600">
                      {t("noTasks")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

