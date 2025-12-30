/**
 * API functions for admin dashboard
 */

import api from "./client";

export interface GlobalStats {
  totalUsers: number;
  activeUsers: number;
  totalJournals: number;
  totalTasks: number;
  completedTasks: number;
  newUsersThisMonth: number;
  journalsThisMonth: number;
  tasksThisMonth: number;
}

export interface UserActivity {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  lastLogin: string | null;
  journalCount: number;
  taskCount: number;
  completedTasks: number;
}

export interface ActivityOverTime {
  date: string;
  count: number;
  type: "journal" | "task";
}

export interface TaskCompletion {
  status: string;
  count: number;
}

export interface CategoryDistribution {
  category: string;
  count: number;
}

/**
 * Get global statistics (admin only)
 */
export async function getGlobalStats(): Promise<GlobalStats> {
  const response = await api.get<GlobalStats>("/api/admin/stats");
  return response;
}

/**
 * Get user activity statistics (admin only)
 */
export async function getUserActivityStats(
  limit?: number
): Promise<{ data: UserActivity[] }> {
  const queryParams = limit ? `?limit=${limit}` : "";
  const response = await api.get<{ data: UserActivity[] }>(
    `/api/admin/users/activity${queryParams}`
  );
  return response;
}

/**
 * Get activity over time (admin only)
 */
export async function getActivityOverTime(
  days?: number
): Promise<{ data: ActivityOverTime[] }> {
  const queryParams = days ? `?days=${days}` : "";
  const response = await api.get<{ data: ActivityOverTime[] }>(
    `/api/admin/activity/time${queryParams}`
  );
  return response;
}

/**
 * Get task completion statistics (admin only)
 */
export async function getTaskCompletionStats(): Promise<{
  data: TaskCompletion[];
}> {
  const response = await api.get<{ data: TaskCompletion[] }>(
    "/api/admin/tasks/completion"
  );
  return response;
}

/**
 * Get category distribution (admin only)
 */
export async function getCategoryDistribution(): Promise<{
  data: CategoryDistribution[];
}> {
  const response = await api.get<{ data: CategoryDistribution[] }>(
    "/api/admin/tasks/categories"
  );
  return response;
}

