/**
 * Hook pour récupérer les statistiques par catégorie
 * Utilise les données du dashboard
 */

"use client";

import { useDashboardStats } from "./useDashboardStats";

export interface CategoryChartData {
  category: string;
  total: number;
  completed: number;
  fill: string;
}

// Couleurs pour les catégories
const categoryColors: Record<string, string> = {
  sport: "hsl(var(--success-500))",
  travail: "hsl(var(--primary-600))",
  santé: "hsl(var(--error-500))",
  apprentissage: "hsl(var(--secondary-500))",
  social: "hsl(var(--warning-500))",
  loisir: "hsl(var(--secondary-500))",
  autre: "hsl(var(--neutral-500))",
};

// Traduction des catégories
const categoryLabels: Record<string, { en: string; fr: string }> = {
  sport: { en: "Sport", fr: "Sport" },
  travail: { en: "Work", fr: "Travail" },
  santé: { en: "Health", fr: "Santé" },
  apprentissage: { en: "Learning", fr: "Apprentissage" },
  social: { en: "Social", fr: "Social" },
  loisir: { en: "Leisure", fr: "Loisir" },
  autre: { en: "Other", fr: "Autre" },
};

/**
 * Hook pour récupérer les statistiques par catégorie formatées pour les graphiques
 * @param days - Nombre de jours à analyser (défaut: 30)
 * @param language - Langue pour les labels (défaut: "en")
 */
export function useCategoryStats(days: number = 30, language: "en" | "fr" = "en") {
  const { data, isLoading, error } = useDashboardStats(days);

  // Formater les données pour le graphique
  const categoryData: CategoryChartData[] | undefined = data
    ? data.by_category
        .slice(0, 6) // Top 6 catégories
        .map((item) => {
          const categoryKey = item.category.toLowerCase();
          const label = categoryLabels[categoryKey]?.[language] || item.category;
          return {
            category: label,
            total: item.total,
            completed: item.completed,
            fill: categoryColors[categoryKey] || categoryColors.autre,
          };
        })
    : undefined;

  return {
    data: categoryData,
    isLoading,
    error,
  };
}

