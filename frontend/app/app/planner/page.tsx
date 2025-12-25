/**
 * Page Planner - Vue calendrier de progression
 * Affiche les tâches réalisées dans un calendrier pour montrer l'évolution
 */

"use client";

import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { CalendarView } from "@/components/planner/CalendarView";
import { ProgressStats } from "@/components/planner/ProgressStats";
import { useCalendarTasks } from "@/hooks/useCalendarTasks";
import { useMemo } from "react";

export default function PlannerPage() {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  // Date actuelle pour récupérer les stats du mois
  const today = new Date();
  const { startDate, endDate } = useMemo(() => {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return { startDate: start, endDate: end };
  }, [today]);

  // Récupérer les données pour les stats
  const { data, isLoading } = useCalendarTasks({
    startDate,
    endDate,
    view: "month",
  });

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="space-y-2 lg:space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {t("planner")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t("plannerDescription")}
        </p>
      </div>

      {/* Progress Stats */}
      {data && (
        <ProgressStats
          stats={data.stats}
          progression={data.progression}
          isLoading={isLoading}
        />
      )}

      {/* Calendar View */}
      <CalendarView initialView="month" />
    </div>
  );
}

