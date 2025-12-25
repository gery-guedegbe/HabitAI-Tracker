/**
 * Hook pour récupérer et gérer les tâches
 * Utilise React Query pour gérer le cache et les mutations
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  type Task,
  type CreateTaskData,
  type UpdateTaskData,
} from "../lib/api/tasks";

/**
 * Hook pour récupérer toutes les tâches
 */
export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

/**
 * Hook pour récupérer une tâche par ID
 */
export function useTask(id: string) {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => getTask(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

/**
 * Hook pour créer une tâche
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ journalId, data }: { journalId: string; data: CreateTaskData }) =>
      createTask(journalId, data),
    onSuccess: () => {
      // Invalider le cache des tâches et des journaux
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });
}

/**
 * Hook pour mettre à jour une tâche
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskData }) =>
      updateTask(taskId, data),
    onSuccess: () => {
      // Invalider le cache des tâches et des journaux
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });
}

/**
 * Hook pour supprimer une tâche
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      // Invalider le cache des tâches et des journaux
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });
}

