"use client";

import { Calendar } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { useActivityHeatmap } from "@/hooks/useActivityHeatmap";

const getColorForCount = (count: number): string => {
  if (count === 0) return "bg-neutral-100 dark:bg-neutral-800";
  if (count <= 2) return "bg-primary-200 dark:bg-primary-900/40";
  if (count <= 4) return "bg-primary-400 dark:bg-primary-700";
  return "bg-primary-600 dark:bg-primary-500";
};

const ActivityHeatmap = () => {
  const { language } = useLanguage();
  const { data, isLoading, error } = useActivityHeatmap(30);
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  // État de chargement
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-40"></div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-10 gap-2">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-md bg-neutral-200 dark:bg-neutral-700"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-error-600 dark:text-error-400" />

          <h3 className="text-base font-semibold text-error-700 dark:text-error-300">
            {t("activityHeatmap")}
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
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-semibold text-foreground">
              {t("activityHeatmap")}
            </h3>

            <p className="text-xs text-muted-foreground">
              {t("activityHeatmapDescription")}
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
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
        </div>

        <div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground">
            {t("activityHeatmap")}
          </h3>

          <p className="text-xs text-muted-foreground">
            {t("activityHeatmapDescription")}
          </p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="space-y-4">
        <div className="grid grid-cols-10 gap-2">
          {data.map((item) => {
            const date = new Date(item.date);
            const formattedDate = date.toLocaleDateString(language, {
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={item.day}
                className={`aspect-square rounded-md ${getColorForCount(
                  item.count
                )} transition-all hover:scale-110 cursor-pointer border border-transparent hover:border-primary-300 dark:hover:border-primary-700`}
                title={`${formattedDate}: ${item.count} ${
                  item.count === 1 ? t("task") : t("tasks")
                }`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <span>{t("less")}</span>
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-neutral-100 dark:bg-neutral-800" />
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-primary-200 dark:bg-primary-900/40" />
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-primary-400 dark:bg-primary-700" />
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-primary-600 dark:bg-primary-500" />
          <span>{t("more")}</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
