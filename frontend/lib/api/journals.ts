/**
 * Fonctions API pour les Journaux
 * =================================
 *
 * Ce fichier contient les fonctions pour récupérer et gérer
 * les journaux et leurs tâches depuis le backend.
 */

import api from "./client";
import { getToken } from "../auth/storage";

// ============= TYPES =============

export interface Task {
  id: string;
  title: string;
  category: string | null;
  duration_minutes: number | null;
  tags: string[] | null;
  status: "todo" | "in_progress" | "done";
  note: string | null;
  journal_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Journal {
  id: string;
  raw_text: string;
  journal_date: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
  tasks?: Task[];
}

export interface JournalsResponse {
  journals: Journal[];
}

export interface JournalResponse {
  journal: Journal;
}

export interface UpdateTaskData {
  title?: string;
  category?: string;
  status?: "todo" | "in_progress" | "done";
  tags?: string[];
  duration_minutes?: number;
  note?: string;
}

export interface UpdateTaskResponse {
  task: Task;
}

// ============= FONCTIONS API =============

/**
 * Récupère tous les journaux de l'utilisateur avec leurs tâches
 */
export async function getJournals(): Promise<JournalsResponse> {
  const response = await api.get<JournalsResponse>("/api/journals");
  return response;
}

/**
 * Récupère un journal par ID avec ses tâches
 */
export async function getJournal(id: string): Promise<JournalResponse> {
  const response = await api.get<JournalResponse>(`/api/journals/${id}`);
  return response;
}

/**
 * Met à jour une tâche
 */
export async function updateTask(
  taskId: string,
  data: UpdateTaskData
): Promise<UpdateTaskResponse> {
  const response = await api.patch<UpdateTaskResponse>(
    `/api/tasks/${taskId}`,
    data
  );
  return response;
}

/**
 * Supprime une tâche
 */
export async function deleteTask(taskId: string): Promise<void> {
  await api.delete(`/api/tasks/${taskId}`);
}

/**
 * Supprime un journal
 */
export async function deleteJournal(journalId: string): Promise<void> {
  await api.delete(`/api/journals/${journalId}`);
}

export interface CreateJournalData {
  raw_text: string;
  journal_date?: string;
}

export interface CreateJournalResponse {
  journal: Journal;
  tasks: Task[];
  ai_summary?: string | null;
}

/**
 * Crée un nouveau journal avec extraction IA
 */
export async function createJournal(
  data: CreateJournalData
): Promise<CreateJournalResponse> {
  const response = await api.post<CreateJournalResponse>(
    "/api/journals",
    data
  );
  return response;
}

export interface ProcessAudioJournalResponse {
  journal: Journal;
  tasks: Task[];
  transcribed_text: string;
  ai_summary?: string | null;
}

/**
 * Crée un journal depuis un fichier audio
 */
export async function processAudioJournal(
  audioFile: File
): Promise<ProcessAudioJournalResponse> {
  const formData = new FormData();
  formData.append("audio", audioFile);

  // Utiliser fetch directement car api.post ne gère pas FormData correctement
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/api/journals/audio`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // Ne pas mettre Content-Type, le navigateur le fera automatiquement avec la boundary
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Une erreur est survenue";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = `Erreur ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

