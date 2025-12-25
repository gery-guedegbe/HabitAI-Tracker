"use client";

import { Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { useRoutinesOverview } from "@/hooks/useRoutinesOverview";

const RoutinesCard = () => {
  const { language } = useLanguage();
  const { data, isLoading, error } = useRoutinesOverview(30); // 30 derniers jours
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
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
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
          <Clock className="w-5 h-5 text-error-600 dark:text-error-400" />
          <h3 className="text-base font-semibold text-error-700 dark:text-error-300">
            {t("routinesStatus")}
          </h3>
        </div>

        <p className="text-sm text-error-600 dark:text-error-400">
          {error.message || t("errorLoadingData")}
        </p>
      </div>
    );
  }

  // Pas de données
  if (!data) {
    return (
      <div className="p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />

          <h3 className="text-base font-semibold text-foreground">
            {t("routinesStatus")}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground text-center py-4">
          {t("noDataAvailable")}
        </p>
      </div>
    );
  }

  const stats = [
    {
      label: t("activeRoutines"),
      value: data.active,
      icon: TrendingUp,
      color: "text-primary-600 dark:text-primary-400",
      bgColor: "bg-primary-50 dark:bg-primary-900/30",
    },
    {
      label: t("completedToday"),
      value: data.completedToday,
      icon: CheckCircle2,
      color: "text-success-600 dark:text-success-400",
      bgColor: "bg-success-50 dark:bg-success-900/20",
    },
    {
      label: t("pending"),
      value: data.pending,
      icon: AlertCircle,
      color: "text-warning-600 dark:text-warning-400",
      bgColor: "bg-warning-50 dark:bg-warning-900/20",
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 rounded-lg bg-secondary-50 dark:bg-secondary-900/30">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-600 dark:text-secondary-400" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-foreground">
          {t("routinesStatus")}
        </h3>
      </div>

      {/* Stats */}
      <div className="space-y-3 sm:space-y-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-200"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className={`p-1.5 sm:p-2 rounded-md ${stat.bgColor} ${stat.color}`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>

                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </div>

              <span
                className={`text-sm sm:text-base font-semibold ${stat.color}`}
              >
                {stat.value}{" "}
                {stat.value === 1 ? t("routine") : t("routines")}
              </span>
            </div>
          );
        })}
      </div>

      {/* Top Routines */}
      {data.topRoutines.length > 0 && (
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {t("topRoutines")}
              </span>
            </div>

            {data.topRoutines.slice(0, 3).map((routine, index) => (
              <div
                key={routine.title}
                className="flex items-center justify-between p-2 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xs font-medium text-muted-foreground w-4">
                    {index + 1}.
                  </span>
                  <span className="text-xs sm:text-sm text-foreground truncate">
                    {routine.title}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground ml-2 shrink-0">
                  {routine.completedCount}/{routine.frequency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutinesCard;
