"use client";

import { useQuery } from "@tanstack/react-query";
import { getGlobalStats } from "@/lib/api/admin";
import { Users, BookOpen, ListChecks, TrendingUp, Activity, FileText } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";

export function AdminStatsCards() {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "globalStats"],
    queryFn: getGlobalStats,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 animate-pulse"
          >
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-2" />
            <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: t("totalUsers"),
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: t("activeUsers"),
      value: stats.activeUsers,
      icon: Activity,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      subtitle: t("last30Days"),
    },
    {
      title: t("totalJournals"),
      value: stats.totalJournals,
      icon: BookOpen,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: t("totalTasks"),
      value: stats.totalTasks,
      icon: ListChecks,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      title: t("completedTasks"),
      value: stats.completedTasks,
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      title: t("newUsersThisMonth"),
      value: stats.newUsersThisMonth,
      icon: Users,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      title: t("journalsThisMonth"),
      value: stats.journalsThisMonth,
      icon: FileText,
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
    {
      title: t("tasksThisMonth"),
      value: stats.tasksThisMonth,
      icon: ListChecks,
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {card.title}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  {card.value.toLocaleString()}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.subtitle}
                  </p>
                )}
              </div>
              <div
                className={`${card.bgColor} ${card.color} p-3 rounded-lg shrink-0`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

