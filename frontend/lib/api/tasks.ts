/**
 * Fonctions API pour les Tâches
 * ===============================
 *
 * Ce fichier contient les fonctions pour récupérer et gérer
 * les tâches depuis le backend.
 */

import api from "./client";
import { type Task as JournalTask } from "./journals";

// ============= TYPES =============

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskCategory =
  | "sport"
  | "travail"
  | "santé"
  | "apprentissage"
  | "social"
  | "loisir"
  | "autre";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  title: string;
  category: TaskCategory | null;
  duration_minutes: number | null;
  tags: string[] | null;
  status: TaskStatus;
  note: string | null;
  journal_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTaskData {
  title: string;
  category?: TaskCategory;
  status?: TaskStatus;
  tags?: string[];
  duration_minutes?: number;
  note?: string;
  journal_id?: string;
}

export interface UpdateTaskData {
  title?: string;
  category?: TaskCategory;
  status?: TaskStatus;
  tags?: string[];
  duration_minutes?: number;
  note?: string;
}

export interface TasksResponse {
  tasks: Task[];
}

export interface TaskResponse {
  task: Task;
}

// ============= FONCTIONS API =============

/**
 * Récupère toutes les tâches de l'utilisateur
 * Note: Pour l'instant, on récupère via les journaux
 */
export async function getTasks(): Promise<TasksResponse> {
  // Récupérer tous les journaux avec leurs tâches
  const journalsResponse = await api.get<{
    journals: Array<{ tasks?: JournalTask[] }>;
  }>("/api/journals");

  // Extraire toutes les tâches de tous les journaux
  const allTasks: Task[] = [];
  journalsResponse.journals.forEach((journal) => {
    if (journal.tasks) {
      journal.tasks.forEach((task) => {
        allTasks.push({
          id: task.id,
          title: task.title,
          category: task.category as TaskCategory | null,
          duration_minutes: task.duration_minutes,
          tags: task.tags,
          status: task.status,
          note: task.note,
          journal_id: task.journal_id,
          created_at: task.created_at,
          updated_at: task.updated_at,
        });
      });
    }
  });

  return { tasks: allTasks };
}

/**
 * Récupère une tâche par ID
 */
export async function getTask(id: string): Promise<TaskResponse> {
  const response = await api.get<TaskResponse>(`/api/tasks/${id}`);
  return response;
}

/**
 * Crée une nouvelle tâche
 * Note: Nécessite un journal_id pour l'instant
 */
export async function createTask(
  journalId: string,
  data: CreateTaskData
): Promise<TaskResponse> {
  const response = await api.post<TaskResponse>(
    `/api/journals/${journalId}/tasks`,
    data
  );
  return response;
}

/**
 * Met à jour une tâche
 */
export async function updateTask(
  taskId: string,
  data: UpdateTaskData
): Promise<TaskResponse> {
  const response = await api.patch<TaskResponse>(`/api/tasks/${taskId}`, data);
  return response;
}

/**
 * Supprime une tâche
 */
export async function deleteTask(taskId: string): Promise<void> {
  await api.delete(`/api/tasks/${taskId}`);
}

// ============= TYPES CALENDRIER =============

export interface CalendarTask {
  id: string;
  title: string;
  category: TaskCategory | null;
  tags: string[] | null;
  status: TaskStatus;
  duration_minutes: number | null;
  note: string | null;
  created_at?: string;
  updated_at?: string;
  journal_id: string | null;
}

export interface CalendarStats {
  total_tasks: number;
  completed_tasks: number;
  completion_rate: string;
  days_with_tasks: number;
  current_streak: number;
  longest_streak: number;
}

export interface CalendarProgression {
  this_month: number;
  last_month: number;
  difference: number;
  percentage: string;
  improvement: boolean;
}

export interface CalendarResponse {
  period: {
    start_date: string;
    end_date: string;
    view: "month" | "week" | "day";
  };
  tasks_by_date: Record<string, CalendarTask[]>;
  stats: CalendarStats;
  progression: CalendarProgression;
}

// ============= FONCTIONS API CALENDRIER =============

/**
 * Récupère les tâches pour la vue calendrier
 * @param startDate - Date de début (YYYY-MM-DD)
 * @param endDate - Date de fin (YYYY-MM-DD)
 * @param view - Type de vue (month, week, day)
 */
export async function getCalendarTasks(
  startDate: string,
  endDate: string,
  view: "month" | "week" | "day" = "month"
): Promise<CalendarResponse> {
  const response = await api.get<CalendarResponse>(
    `/api/tasks/calendar?start_date=${startDate}&end_date=${endDate}&view=${view}`
  );
  return response;
}
