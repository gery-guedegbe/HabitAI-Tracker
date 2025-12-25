"use client";

// Badge component simple
const Badge = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <span
    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${className}`}
  >
    {children}
  </span>
);
import { Clock, Tag, ListChecks } from "lucide-react";
import Link from "next/link";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { useUpcomingTasks } from "@/hooks/useUpcomingTasks";

// Couleurs par catégorie (cohérentes avec le design)
const categoryColors: Record<string, string> = {
  Sport: "bg-success-500",
  Work: "bg-primary-600",
  Health: "bg-error-500",
  Learning: "bg-secondary-500",
  Social: "bg-warning-500",
  Leisure: "bg-secondary-500",
  Other: "bg-neutral-500",
};

// Couleurs de priorité
const priorityColors: Record<string, string> = {
  low: "text-neutral-500 dark:text-neutral-400",
  medium: "text-primary-600 dark:text-primary-400",
  high: "text-warning-600 dark:text-warning-400",
  urgent: "text-error-600 dark:text-error-400",
};

// Labels de priorité (peuvent être traduits si nécessaire)
const getPriorityLabel = (priority: string): string => {
  return priority;
};

export function UpcomingTasks() {
  const { language } = useLanguage();
  const { data, isLoading, error } = useUpcomingTasks(5);
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  // État de chargement
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-32"></div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800"
            >
              <div className="w-1 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <ListChecks className="w-5 h-5 text-error-600 dark:text-error-400" />
          <h3 className="text-base font-semibold text-error-700 dark:text-error-300">
            {t("upcomingTasks")}
          </h3>
        </div>
        <p className="text-sm text-error-600 dark:text-error-400">
          {error.message || t("errorLoadingData")}
        </p>
      </div>
    );
  }

  // Pas de données
  if (!data || data.length === 0) {
    return (
      <div className="p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30">
            <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-foreground">
              {t("upcomingTasks")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("yourNextTasks")}
            </p>
          </div>
        </div>
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            {t("noDataAvailable")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30">
          <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground">
            {t("upcomingTasks")}
          </h3>
          <p className="text-xs text-muted-foreground">{t("yourNextTasks")}</p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {data.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-200"
          >
            <div
              className={`w-1 h-12 rounded-full ${
                categoryColors[task.category] || categoryColors.Other
              } shrink-0`}
            />

            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm line-clamp-1">
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                {task.duration && (
                  <>
                    <Clock className="w-3 h-3" />
                    {task.duration} {t("min")}
                    <span>•</span>
                  </>
                )}
                <span className={priorityColors[task.priority]}>
                  {getPriorityLabel(task.priority)}
                </span>
                {task.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <Tag className="w-3 h-3" />
                    {task.tags[0]}
                  </>
                )}
              </div>
            </div>

            <Badge className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
              {task.category}
            </Badge>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <Link
        href="/app/tasks"
        className="block mt-4 text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 font-medium transition-colors"
      >
        {t("viewAllTasks")} →
      </Link>
    </div>
  );
}
