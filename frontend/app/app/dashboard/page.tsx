"use client";

import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { StatsCards } from "@/components/dashboard/StatsCards";
import TasksCard from "@/components/dashboard/TasksCard";
import RoutinesCard from "@/components/dashboard/RoutinesCard";
import ActivityChart from "@/components/dashboard/ActivityChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { ActiveRoutines } from "@/components/dashboard/ActiveRoutines";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import TopActivities from "@/components/dashboard/TopActivities";

const DashboardPage = () => {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="space-y-2 lg:space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          {t("dashboardTitle")}
        </h1>

        <p className="text-sm text-muted-foreground">
          {t("dashboardSubtitle")}
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TasksCard />
        <RoutinesCard />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart />
        <CategoryChart />
      </div>

      {/* Upcoming Tasks & Active Routines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingTasks />
        <ActiveRoutines />
      </div>

      {/* Heatmap */}
      <ActivityHeatmap />

      {/* Top Activities */}
      <TopActivities />
    </div>
  );
};

export default DashboardPage;
