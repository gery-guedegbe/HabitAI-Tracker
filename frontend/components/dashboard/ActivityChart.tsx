"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useDailyActivity } from "@/hooks/useDailyActivity";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";

// Composant personnalisé pour le tooltip
const CustomTooltip = ({
  active,
  payload,
  t,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      day: string;
      completed: number;
      total: number;
    };
  }>;
  t: (key: Parameters<typeof getTranslation>[0]) => string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-foreground mb-2">
          {payload[0].payload.day}
        </p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary-600"></div>
            <span className="text-xs text-muted-foreground">
              {t("completed")}:
            </span>
            <span className="text-xs font-semibold text-foreground">
              {payload[0].value}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neutral-400"></div>
            <span className="text-xs text-muted-foreground">{t("total")}:</span>
            <span className="text-xs font-semibold text-foreground">
              {payload[1]?.value || 0}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ActivityChart = () => {
  const { language } = useLanguage();
  const { data, isLoading, error } = useDailyActivity(7);
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
        <div className="h-[300px] bg-neutral-200 dark:bg-neutral-700 rounded"></div>
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
            {t("dailyActivity")}
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
              {t("dailyActivity")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("taskCompletionLast7Days")}
            </p>
          </div>
        </div>
        <div className="h-[300px] flex items-center justify-center">
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
            {t("dailyActivity")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("taskCompletionLast7Days")}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--neutral-200))"
              className="dark:stroke-neutral-700"
            />
            <XAxis
              dataKey="day"
              stroke="hsl(var(--neutral-500))"
              className="dark:stroke-neutral-400"
              fontSize={12}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              stroke="hsl(var(--neutral-500))"
              className="dark:stroke-neutral-400"
              fontSize={12}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip content={<CustomTooltip t={t} />} />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="completed"
              name={t("completed")}
              stroke="hsl(var(--primary-600))"
              strokeWidth={2.5}
              dot={{ fill: "hsl(var(--primary-600))", r: 4 }}
              activeDot={{ r: 6 }}
              className="dark:stroke-primary-400"
            />
            <Line
              type="monotone"
              dataKey="total"
              name={t("total")}
              stroke="hsl(var(--neutral-400))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "hsl(var(--neutral-400))", r: 3 }}
              className="dark:stroke-neutral-500"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;
