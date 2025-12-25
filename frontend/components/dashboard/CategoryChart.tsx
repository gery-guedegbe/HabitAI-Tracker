"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useCategoryStats } from "@/hooks/useCategoryStats";
import { getTranslation } from "@/lib/i18n/i18n";

// Composant personnalisé pour le tooltip
const CustomTooltip = ({
  active,
  payload,
  t,
}: {
  active?: boolean;
  payload?: Array<{
    payload: {
      category: string;
      total: number;
      completed: number;
    };
  }>;
  t: (key: Parameters<typeof getTranslation>[0]) => string;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-foreground mb-2">
          {data.category}
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">{t("total")}:</span>
            <span className="text-xs font-semibold text-foreground">
              {data.total}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">
              {t("completed")}:
            </span>
            <span className="text-xs font-semibold text-success-600 dark:text-success-400">
              {data.completed}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-neutral-200 dark:border-neutral-700">
            <span className="text-xs text-muted-foreground">{t("pending")}:</span>
            <span className="text-xs font-semibold text-warning-600 dark:text-warning-400">
              {data.total - data.completed}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CategoryChart = () => {
  const { language } = useLanguage();
  const { data, isLoading, error } = useCategoryStats(30, language);
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  // État de chargement
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-40"></div>
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
          <PieChartIcon className="w-5 h-5 text-error-600 dark:text-error-400" />
          <h3 className="text-base font-semibold text-error-700 dark:text-error-300">
            {t("categoryDistribution")}
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
            <PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-600 dark:text-secondary-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-foreground">
              {t("categoryDistribution")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("tasksByCategory")}
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
        <div className="p-2 rounded-lg bg-secondary-50 dark:bg-secondary-900/30">
          <PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-600 dark:text-secondary-400" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground">
            {t("categoryDistribution")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("tasksByCategory")}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--neutral-200))"
              className="dark:stroke-neutral-700"
            />
            <XAxis
              dataKey="category"
              stroke="hsl(var(--neutral-500))"
              className="dark:stroke-neutral-400"
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              stroke="hsl(var(--neutral-500))"
              className="dark:stroke-neutral-400"
              fontSize={12}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip content={<CustomTooltip t={t} />} />
            <Bar dataKey="total" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-wrap gap-3 text-xs">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: item.fill }}
              ></div>
              <span className="text-muted-foreground">
                {item.category}: {item.total}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
