/**
 * Composant Skeleton pour le calendrier
 * Affiche un placeholder pendant le chargement
 */

"use client";

export function CalendarSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
          <div className="h-10 w-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Calendar Grid Skeleton */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
        {/* Weekdays Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"
            />
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {[...Array(35)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton pour les statistiques de progression
 */
export function ProgressStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800"
        >
          <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded mb-3 animate-pulse" />
          <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 rounded mb-2 animate-pulse" />
          <div className="h-3 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton pour la vue jour
 */
export function DayViewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800"
          >
            <div className="h-5 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded mb-2 animate-pulse" />
            <div className="h-4 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

