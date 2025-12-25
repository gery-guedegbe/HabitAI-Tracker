/**
 * Composant StatsCards
 * ====================
 *
 * Affiche les cartes de statistiques du dashboard.
 * Récupère les données depuis le backend et les affiche
 * de manière agréable et optimisée.
 */

"use client";

import { useDashboardStats } from "@/hooks/useDashboardStats";
import { StatCard } from "@/components/ui/stat-card";
import { CheckCircle2, Clock, Target, Flame } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Formate les minutes en heures et minutes
 */
function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Calcule la tendance pour le taux de complétion
 * (comparaison avec la période précédente - simplifié)
 */
function calculateTrend(currentRate: number):
  | {
      value: number;
      direction: "up" | "down";
    }
  | undefined {
  // Pour l'instant, on simule une tendance
  // Dans une vraie app, on comparerait avec la période précédente
  if (currentRate >= 80) {
    return { value: 5, direction: "up" };
  }
  if (currentRate >= 60) {
    return { value: 2, direction: "up" };
  }
  return undefined;
}

export function StatsCards() {
  const { language } = useLanguage();
  const { data, isLoading, error } = useDashboardStats(30);
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  // État de chargement
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 animate-pulse"
          >
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="p-6 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
        <p className="text-error-600 dark:text-error-400 font-medium">
          {t("errorLoadingStats")}
        </p>
        <p className="text-error-500 dark:text-error-500 text-sm mt-1">
          {error.message}
        </p>
      </div>
    );
  }

  // Pas de données
  if (!data) {
    return (
      <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-lg text-center">
        <p className="text-neutral-600 dark:text-neutral-400">
          {t("noDataAvailable")}
        </p>
      </div>
    );
  }

  const { stats } = data;
  const completionRate = parseFloat(stats.completion_rate.toString());
  const trend = calculateTrend(completionRate);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {/* Taux de complétion */}
      <StatCard
        title={t("completionRateTitle")}
        value={`${completionRate.toFixed(1)}%`}
        subtitle={`${stats.completed_tasks} ${t("onTasks")} ${
          stats.total_tasks
        } ${t("tasks")}`}
        icon={Target}
        trend={trend}
      />

      {/* Tâches complétées */}
      <StatCard
        title={t("tasksCompletedTitle")}
        value={stats.completed_tasks}
        subtitle={`${t("outOfTasks")} ${stats.total_tasks} ${t("tasksTotal")}`}
        icon={CheckCircle2}
      />

      {/* Temps total */}
      <StatCard
        title={t("totalTimeTitle")}
        value={formatMinutes(stats.total_minutes)}
        subtitle={t("timeSpentOnTasks")}
        icon={Clock}
      />

      {/* Streak actuel */}
      <StatCard
        title={t("currentStreakTitle")}
        value={stats.current_streak}
        subtitle={`${stats.current_streak === 1 ? t("day") : t("days")} ${t(
          "consecutiveDays"
        )}`}
        icon={Flame}
      />
    </div>
  );
}
