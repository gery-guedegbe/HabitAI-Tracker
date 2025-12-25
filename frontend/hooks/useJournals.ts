/**
 * Hook pour récupérer les journaux
 * Utilise React Query pour gérer le cache et les mutations
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getJournals,
  updateTask,
  deleteTask,
  deleteJournal,
  type Journal,
  type Task,
  type UpdateTaskData,
} from "../lib/api/journals";

/**
 * Hook pour récupérer tous les journaux
 */
export function useJournals() {
  return useQuery({
    queryKey: ["journals"],
    queryFn: getJournals,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
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
      // Invalider le cache des journaux pour rafraîchir les données
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
      // Invalider le cache des journaux pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });
}

/**
 * Hook pour supprimer un journal
 */
export function useDeleteJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJournal,
    onSuccess: () => {
      // Invalider le cache des journaux pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });
}

import {
  createJournal,
  processAudioJournal,
  type CreateJournalData,
  type ProcessAudioJournalResponse,
} from "../lib/api/journals";
import { useRouter } from "next/navigation";

/**
 * Hook pour créer un journal depuis du texte
 * @param autoRedirect - Si true, redirige automatiquement vers /app/journals après succès (défaut: true)
 */
export function useCreateJournal(autoRedirect: boolean = true) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateJournalData) => createJournal(data),
    onSuccess: () => {
      // Invalider le cache des journaux pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      // Rediriger vers la liste des journaux si demandé
      if (autoRedirect) {
        router.push("/app/journals");
      }
    },
  });
}

/**
 * Hook pour créer un journal depuis un fichier audio
 * @param autoRedirect - Si true, redirige automatiquement vers /app/journals après succès (défaut: true)
 */
export function useProcessAudioJournal(autoRedirect: boolean = true) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (audioFile: File) => processAudioJournal(audioFile),
    onSuccess: () => {
      // Invalider le cache des journaux pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      // Rediriger vers la liste des journaux si demandé
      if (autoRedirect) {
        router.push("/app/journals");
      }
    },
  });
}

