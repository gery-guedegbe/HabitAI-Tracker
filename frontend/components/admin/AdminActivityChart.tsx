"use client";

import { useQuery } from "@tanstack/react-query";
import { getActivityOverTime } from "@/lib/api/admin";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";

export function AdminActivityChart() {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "activityOverTime"],
    queryFn: () => getActivityOverTime(30),
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 animate-pulse">
        <div className="h-64 bg-neutral-200 dark:bg-neutral-700 rounded" />
      </div>
    );
  }

  // Transform data for chart
  const chartData = data?.data.reduce((acc: any, item) => {
    const date = item.date;
    const existing = acc.find((d: any) => d.date === date);
    if (existing) {
      existing[item.type] = item.count;
    } else {
      acc.push({
        date: new Date(date).toLocaleDateString("fr-FR", {
          month: "short",
          day: "numeric",
        }),
        journal: item.type === "journal" ? item.count : 0,
        task: item.type === "task" ? item.count : 0,
      });
    }
    return acc;
  }, []);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
        {t("activityOverTime")}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="journal"
            stroke="#8b5cf6"
            name={t("journals")}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="task"
            stroke="#f97316"
            name={t("tasks")}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

