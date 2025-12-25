"use client";

import Link from "next/link";
import { Clock, TrendingUp, Clock as ClockIcon } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { useActiveRoutines } from "@/hooks/useActiveRoutines";

export function ActiveRoutines() {
  const { language } = useLanguage();
  const { data, isLoading, error } = useActiveRoutines(3);
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
              className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800"
            >
              <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
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
          <ClockIcon className="w-5 h-5 text-error-600 dark:text-error-400" />

          <h3 className="text-base font-semibold text-error-700 dark:text-error-300">
            {t("activeRoutinesTitle")}
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
          <div className="p-2 rounded-lg bg-secondary-50 dark:bg-secondary-900/30">
            <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-600 dark:text-secondary-400" />
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-semibold text-foreground">
              {t("activeRoutinesTitle")}
            </h3>

            <p className="text-xs text-muted-foreground">
              {t("yourDailyRoutines")}
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
        <div className="p-2 rounded-lg bg-secondary-50 dark:bg-secondary-900/30">
          <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-600 dark:text-secondary-400" />
        </div>

        <div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground">
            {t("activeRoutinesTitle")}
          </h3>

          <p className="text-xs text-muted-foreground">
            {t("yourDailyRoutines")}
          </p>
        </div>
      </div>

      {/* Routines List */}
      <div className="space-y-3">
        {data.map((routine) => (
          <div
            key={routine.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-2xl shrink-0">
              {routine.emoji}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm line-clamp-1">
                {routine.name}
              </p>

              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {routine.duration} {t("min")}
                <span>•</span>
                {routine.taskCount}{" "}
                {routine.taskCount === 1 ? t("task") : t("tasks")}
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs shrink-0">
              <TrendingUp className="w-3 h-3 text-success-600 dark:text-success-400" />
              <span className="font-semibold text-success-600 dark:text-success-400">
                {routine.streak} {routine.streak === 1 ? t("day") : t("days")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <Link
        href="/app/routines"
        className="block mt-4 text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 font-medium transition-colors"
      >
        {t("viewAllRoutines")} →
      </Link>
    </div>
  );
}
