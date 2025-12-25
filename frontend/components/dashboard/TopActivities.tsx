"use client";

import { TrendingUp } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { useTopActivities } from "@/hooks/useTopActivities";

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

const TopActivities = () => {
  const { language } = useLanguage();
  const { data, isLoading, error } = useTopActivities(5, 30);
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
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
              </div>
              <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
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
          <TrendingUp className="w-5 h-5 text-error-600 dark:text-error-400" />
          <h3 className="text-base font-semibold text-error-700 dark:text-error-300">
            {t("topActivities")}
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
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-foreground">
              {t("topActivities")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("topActivitiesDescription")}
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
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground">
            {t("topActivities")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("topActivitiesDescription")}
          </p>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {data.map((activity) => (
          <div
            key={activity.name}
            className="flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-foreground text-sm">
                  {activity.name}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {activity.count} {t("times")}
                  </span>
                  <Badge className="text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                    {activity.percentage}%
                  </Badge>
                </div>
              </div>
              <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 dark:bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: `${activity.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopActivities;
