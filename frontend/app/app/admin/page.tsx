"use client";

import { useAdmin } from "@/hooks/useAdmin";
import { AdminStatsCards } from "@/components/admin/AdminStatsCards";
import { Loader2 } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import Link from "next/link";
import { ArrowRight, Users, BarChart3 } from "lucide-react";

export default function AdminDashboardPage() {
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
          {t("adminDashboard")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("adminDashboardSubtitle")}
        </p>
      </div>

      {/* Quick Stats Cards */}
      <AdminStatsCards />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {/* User Management Card */}
        <Link
          href="/app/admin/users"
          className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 hover:shadow-lg transition-all duration-200 group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t("userManagement")}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {t("userManagementDescription")}
              </p>
              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:gap-3 transition-all">
                <span>{t("manageUsers")}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>

        {/* Statistics Card */}
        <Link
          href="/app/admin/statistics"
          className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 hover:shadow-lg transition-all duration-200 group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t("statistics")}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {t("statisticsDescription")}
              </p>
              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:gap-3 transition-all">
                <span>{t("viewStatistics")}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
