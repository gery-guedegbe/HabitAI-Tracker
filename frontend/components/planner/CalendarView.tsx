/**
 * Composant principal pour la vue calendrier
 * Affiche les tâches par date avec indicateurs visuels
 */

"use client";

import { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { useCalendarTasks } from "@/hooks/useCalendarTasks";
import { CalendarSkeleton } from "./CalendarSkeleton";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import { MotivationalMessage } from "./MotivationalMessage";
import type { CalendarTask } from "@/lib/api/tasks";

type View = "month" | "week" | "day";

interface CalendarViewProps {
  initialView?: View;
}

/**
 * Fonction pour obtenir la couleur selon le nombre de tâches
 */
const getTaskCountColor = (
  count: number,
  isDark: boolean
): { bg: string; text: string; border: string } => {
  if (count === 0) {
    return {
      bg: "bg-neutral-100 dark:bg-neutral-800",
      text: "text-neutral-400 dark:text-neutral-500",
      border: "border-neutral-200 dark:border-neutral-700",
    };
  }
  if (count <= 2) {
    return {
      bg: "bg-primary-200 dark:bg-primary-900/40",
      text: "text-primary-700 dark:text-primary-300",
      border: "border-primary-300 dark:border-primary-800",
    };
  }
  if (count <= 4) {
    return {
      bg: "bg-primary-400 dark:bg-primary-700",
      text: "text-white",
      border: "border-primary-500 dark:border-primary-600",
    };
  }
  if (count <= 6) {
    return {
      bg: "bg-primary-600 dark:bg-primary-500",
      text: "text-white",
      border: "border-primary-700 dark:border-primary-400",
    };
  }
  return {
    bg: "bg-primary-700 dark:bg-primary-400",
    text: "text-white",
    border: "border-primary-800 dark:border-primary-300",
  };
};

export function CalendarView({ initialView = "month" }: CalendarViewProps) {
  const { language } = useLanguage();
  const [view, setView] = useState<View>(initialView);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  // Calculer les dates de début et fin selon la vue
  const { startDate, endDate } = useMemo(() => {
    const date = selectedDate;
    let start: Date;
    let end: Date;

    switch (view) {
      case "month":
        start = new Date(date.getFullYear(), date.getMonth(), 1);
        end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        break;
      case "week":
        const dayOfWeek = date.getDay();
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Lundi
        start = new Date(date.setDate(diff));
        end = new Date(start);
        end.setDate(end.getDate() + 6); // Dimanche
        break;
      case "day":
        start = new Date(date);
        end = new Date(date);
        break;
      default:
        start = new Date(date.getFullYear(), date.getMonth(), 1);
        end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }

    return { startDate: start, endDate: end };
  }, [view, selectedDate]);

  // Récupérer les tâches
  const { data, isLoading, error } = useCalendarTasks({
    startDate,
    endDate,
    view,
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

  // Fonction pour obtenir le nombre de tâches complétées pour une date
  const getTaskCountForDate = (date: Date): number => {
    const dateKey = date.toISOString().split("T")[0];
    const tasks = tasksByDate.get(dateKey) || [];
    return tasks.filter((task) => task.status === "done").length;
  };

  // Fonction pour formater la date en clé
  const formatDateKey = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  // Tile content pour react-calendar
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const taskCount = getTaskCountForDate(date);
    if (taskCount === 0) return null;

    const colors = getTaskCountColor(taskCount, false);
    return (
      <div className="mt-1 flex items-center justify-center">
        <div
          className={`w-4 lg:w-6 h-4 lg:h-6 rounded-full ${colors.bg} ${colors.text} ${colors.border} border-2 flex items-center justify-center text-xs font-bold`}
        >
          {taskCount}
        </div>
      </div>
    );
  };

  // Tile className pour react-calendar
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return "";

    const taskCount = getTaskCountForDate(date);
    const isToday = formatDateKey(date) === formatDateKey(new Date());
    const colors = getTaskCountColor(taskCount, false);

    let classes = "";
    if (isToday) {
      classes += "ring-2 ring-primary-500 dark:ring-primary-400 ";
    }
    if (taskCount > 0) {
      classes += `${colors.bg} ${colors.text} `;
    }

    return classes.trim();
  };

  if (isLoading) {
    return <CalendarSkeleton />;
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

  // Message motivant (seulement pour vue mois)
  const showMotivationalMessage = view === "month" && data;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* View Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("month")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              view === "month"
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            {t("monthView")}
          </button>

          <button
            onClick={() => setView("week")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              view === "week"
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            {t("weekView")}
          </button>

          <button
            onClick={() => setView("day")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              view === "day"
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            {t("dayView")}
          </button>
        </div>
      </div>

      {/* Message motivant (uniquement pour vue mois) */}
      {showMotivationalMessage && (
        <div className="animate-[fadeIn_0.3s_ease-out]">
          <MotivationalMessage
            stats={data.stats}
            progression={data.progression}
          />
        </div>
      )}

      {/* Contenu selon la vue */}
      <div className="animate-[fadeIn_0.3s_ease-out]">
        {view === "month" && (
          <div className="w-full bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
            <Calendar
              onChange={(value) => {
                if (value instanceof Date) {
                  setSelectedDate(value);
                } else if (Array.isArray(value) && value[0] instanceof Date) {
                  setSelectedDate(value[0]);
                }
              }}
              value={selectedDate}
              tileContent={tileContent}
              tileClassName={tileClassName}
              locale={language === "fr" ? "fr-FR" : "en-US"}
              className="w-full react-calendar-full-width"
              prevLabel={<ChevronLeft className="w-5 h-5" />}
              nextLabel={<ChevronRight className="w-5 h-5" />}
            />
          </div>
        )}

        {view === "week" && (
          <WeekView
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        )}

        {view === "day" && <DayView selectedDate={selectedDate} />}
      </div>
    </div>
  );
}
