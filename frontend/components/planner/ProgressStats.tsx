/**
 * Composant pour afficher les statistiques de progression
 * Montre les efforts réalisés pour renforcer la confiance
 */

"use client";

import { TrendingUp, TrendingDown, Calendar, Flame, Target } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import type { CalendarStats, CalendarProgression } from "@/lib/api/tasks";

interface ProgressStatsProps {
  stats: CalendarStats;
  progression: CalendarProgression;
  isLoading?: boolean;
}

export function ProgressStats({
  stats,
  progression,
  isLoading = false,
}: ProgressStatsProps) {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 animate-pulse"
          >
            <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded mb-3" />
            <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 rounded mb-2" />
            <div className="h-3 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const statsCards = [
    {
      label: t("tasksThisMonth"),
      value: progression.this_month,
      subtitle: progression.improvement
        ? `+${progression.difference} ${t("vsLastMonth")}`
        : `${progression.difference} ${t("vsLastMonth")}`,
      icon: Target,
      color: "text-primary-600 dark:text-primary-400",
      bgColor: "bg-primary-50 dark:bg-primary-900/30",
      trend: progression.improvement ? (
        <TrendingUp className="w-4 h-4 text-success-600 dark:text-success-400" />
      ) : (
        <TrendingDown className="w-4 h-4 text-error-600 dark:text-error-400" />
      ),
    },
    {
      label: t("activeDays"),
      value: stats.days_with_tasks,
      subtitle: `${t("daysWithCompletedTasks")}`,
      icon: Calendar,
      color: "text-secondary-600 dark:text-secondary-400",
      bgColor: "bg-secondary-50 dark:bg-secondary-900/30",
    },
    {
      label: t("currentStreak"),
      value: stats.current_streak,
      subtitle: `${stats.current_streak === 1 ? t("day") : t("days")} ${t("consecutive")}`,
      icon: Flame,
      color: "text-warning-600 dark:text-warning-400",
      bgColor: "bg-warning-50 dark:bg-warning-900/30",
      pulse: stats.current_streak > 0,
    },
    {
      label: t("completedTasks"),
      value: stats.completed_tasks,
      subtitle: `${stats.completion_rate}% ${t("completionRate")}`,
      icon: Target,
      color: "text-success-600 dark:text-success-400",
      bgColor: "bg-success-50 dark:bg-success-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 ${
              card.pulse ? "animate-pulse" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              {card.trend && <div>{card.trend}</div>}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {card.label}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {card.value}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

