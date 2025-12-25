/**
 * Loading component pour la page Planner
 * Utilisé par Next.js pour afficher un skeleton pendant le chargement
 */

import { CalendarSkeleton, ProgressStatsSkeleton } from "@/components/planner/CalendarSkeleton";

export default function PlannerLoading() {
  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-6">
      {/* Header Skeleton */}
      <div className="space-y-2 lg:space-y-4">
        <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
        <div className="h-4 w-96 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
      </div>

      {/* Progress Stats Skeleton */}
      <ProgressStatsSkeleton />

      {/* Calendar Skeleton */}
      <CalendarSkeleton />
    </div>
  );
}

