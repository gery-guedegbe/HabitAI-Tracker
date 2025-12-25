/**
 * Fonctions API pour le Dashboard
 * =================================
 *
 * Ce fichier contient les fonctions pour récupérer les statistiques
 * et données du dashboard depuis le backend.
 */

import api from "./client";

// ============= TYPES =============

/**
 * Statistiques principales du dashboard
 */
export interface DashboardStats {
  total_tasks: number;
  completed_tasks: number;
  completion_rate: number;
  total_minutes: number;
  current_streak: number;
}

/**
 * Statistiques par catégorie
 */
export interface CategoryStats {
  category: string;
  total: number;
  completed: number;
}

/**
 * Activité quotidienne
 */
export interface DailyActivity {
  date: string;
  total_tasks: number;
  completed_tasks: number;
}

/**
 * Top activité
 */
export interface TopActivity {
  title: string;
  frequency: number;
  completed_count: number;
}

/**
 * Réponse complète de l'API dashboard/stats
 */
export interface DashboardStatsResponse {
  period_days: number;
  stats: DashboardStats;
  by_category: CategoryStats[];
  daily_activity: DailyActivity[];
  top_activities: TopActivity[];
}

// ============= FONCTIONS API =============

/**
 * Récupère les statistiques du dashboard
 *
 * @param days - Nombre de jours à analyser (défaut: 30)
 * @returns Les statistiques complètes du dashboard
 * @throws Error si la requête échoue
 *
 * EXEMPLE :
 * ```ts
 * try {
 *   const stats = await getDashboardStats(30);
 *   console.log('Taux de complétion:', stats.stats.completion_rate);
 * } catch (error) {
 *   console.error('Erreur:', error.message);
 * }
 * ```
 */
export async function getDashboardStats(
  days: number = 30
): Promise<DashboardStatsResponse> {
  const response = await api.get<DashboardStatsResponse>(
    `/api/dashboard/stats?days=${days}`
  );
  return response;
}
