/**
 * Vue Jour - Liste détaillée des tâches du jour
 * Affiche toutes les tâches complétées avec détails
 */

"use client";

import { useMemo } from "react";
import { CheckCircle2, Clock, Tag, FileText } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { useCalendarTasks } from "@/hooks/useCalendarTasks";
import { DayViewSkeleton } from "./CalendarSkeleton";
import type { CalendarTask } from "@/lib/api/tasks";

interface DayViewProps {
  selectedDate: Date;
}

/**
 * Obtenir l'icône de catégorie
 */
const getCategoryIcon = (category: string | null) => {
  // Pour l'instant, on retourne une icône générique
  // Peut être amélioré avec des icônes spécifiques par catégorie
  return Tag;
};

/**
 * Obtenir la couleur de catégorie
 */
const getCategoryColor = (category: string | null): string => {
  const colors: Record<string, string> = {
    sport: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    travail: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
    santé: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    apprentissage: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    social: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300",
    loisir: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
    autre: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
  };
  return colors[category || "autre"] || colors.autre;
};

/**
 * Formater la date complète
 */
const formatFullDate = (date: Date, language: "en" | "fr"): string => {
  return date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function DayView({ selectedDate }: DayViewProps) {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  // Calculer startDate et endDate pour le jour
  const { startDate, endDate } = useMemo(() => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);
    return { startDate: start, endDate: end };
  }, [selectedDate]);

  // Récupérer les tâches
  const { data, isLoading, error } = useCalendarTasks({
    startDate,
    endDate,
    view: "day",
  });

  // Obtenir les tâches du jour
  const dayTasks = useMemo(() => {
    if (!data?.tasks_by_date) return [];

    const dateKey = selectedDate.toISOString().split("T")[0];
    const tasks = data.tasks_by_date[dateKey] || [];
    
    // Filtrer uniquement les tâches complétées
    return tasks.filter((task) => task.status === "done");
  }, [data, selectedDate]);

  // Calculer les statistiques du jour
  const dayStats = useMemo(() => {
    const totalTasks = dayTasks.length;
    const totalMinutes = dayTasks.reduce(
      (sum, task) => sum + (task.duration_minutes || 0),
      0
    );
    const categories = new Set(
      dayTasks.map((task) => task.category).filter(Boolean)
    );

    return {
      totalTasks,
      totalMinutes,
      categoriesCount: categories.size,
    };
  }, [dayTasks]);

  if (isLoading) {
    return <DayViewSkeleton />;
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header avec date */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
          {formatFullDate(selectedDate, language)}
        </h3>

        {/* Stats du jour */}
        {dayStats.totalTasks > 0 ? (
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success-600 dark:text-success-400" />
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {dayStats.totalTasks}
                </span>{" "}
                {dayStats.totalTasks === 1 ? t("task") : t("tasks")}{" "}
                {t("completed")}
              </span>
            </div>

            {dayStats.totalMinutes > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {dayStats.totalMinutes}
                  </span>{" "}
                  {t("min")}
                </span>
              </div>
            )}

            {dayStats.categoriesCount > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {dayStats.categoriesCount}
                  </span>{" "}
                  {dayStats.categoriesCount === 1
                    ? t("category")
                    : t("categories")}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-2">
            {t("noTasksCompletedToday")}
          </p>
        )}
      </div>

      {/* Liste des tâches */}
      {dayTasks.length > 0 ? (
        <div className="space-y-3">
          {dayTasks.map((task) => {
            const CategoryIcon = getCategoryIcon(task.category);
            const categoryColor = getCategoryColor(task.category);

            return (
              <div
                key={task.id}
                className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Titre */}
                    <div className="flex items-start gap-3 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-success-600 dark:text-success-400 mt-0.5 shrink-0" />
                      <h4 className="text-base font-semibold text-foreground line-clamp-2">
                        {task.title}
                      </h4>
                    </div>

                    {/* Métadonnées */}
                    <div className="flex flex-wrap items-center gap-3 ml-8">
                      {/* Catégorie */}
                      {task.category && (
                        <div
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${categoryColor}`}
                        >
                          <CategoryIcon className="w-3 h-3" />
                          <span>
                            {t(
                              `category${task.category.charAt(0).toUpperCase()}${task.category.slice(1)}` as Parameters<
                                typeof getTranslation
                              >[0]
                            )}
                          </span>
                        </div>
                      )}

                      {/* Durée */}
                      {task.duration_minutes && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>
                            {task.duration_minutes} {t("min")}
                          </span>
                        </div>
                      )}

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {task.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-neutral-100 dark:bg-neutral-800 text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                          {task.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{task.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Note */}
                    {task.note && (
                      <div className="mt-3 ml-8 flex items-start gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {task.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            {t("noTasksCompletedToday")}
          </p>
        </div>
      )}
    </div>
  );
}

