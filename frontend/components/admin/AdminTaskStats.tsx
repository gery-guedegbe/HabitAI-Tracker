"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getTaskCompletionStats,
  getCategoryDistribution,
} from "@/lib/api/admin";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";

const COLORS = ["#8b5cf6", "#f97316", "#10b981"];

export function AdminTaskStats() {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  const { data: completionStats } = useQuery({
    queryKey: ["admin", "taskCompletion"],
    queryFn: getTaskCompletionStats,
  });

  const { data: categoryStats } = useQuery({
    queryKey: ["admin", "categoryDistribution"],
    queryFn: getCategoryDistribution,
  });

  const completionData = completionStats?.data.map((item) => ({
    name: t(item.status === "done" ? "completed" : item.status),
    value: item.count,
  }));

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
        {t("taskStatistics")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completion Status */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            {t("completionStatus")}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {completionData?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            {t("categoryDistribution")}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryStats?.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

