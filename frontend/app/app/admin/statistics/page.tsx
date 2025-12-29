"use client";

import { useAdmin } from "@/hooks/useAdmin";
import { AdminActivityChart } from "@/components/admin/AdminActivityChart";
import { AdminTaskStats } from "@/components/admin/AdminTaskStats";
import { Loader2 } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";

export default function AdminStatisticsPage() {
  const { isAdmin, isLoading } = useAdmin();
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // useAdmin hook will redirect
  }

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="space-y-2 lg:space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          {t("statistics")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("statisticsSubtitle")}
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminActivityChart />
        <AdminTaskStats />
      </div>
    </div>
  );
}

