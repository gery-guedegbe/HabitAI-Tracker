"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Loader2,
  ArrowLeft,
  Sparkles,
  Upload,
  Square,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { useCreateJournal, useProcessAudioJournal } from "@/hooks/useJournals";
import { TaskItem } from "@/components/journals/TaskItem";
import { type Task } from "@/lib/api/journals";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

export default function CreateJournalPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [journalText, setJournalText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createJournalMutation = useCreateJournal(false); // Pas de redirection automatique
  const processAudioMutation = useProcessAudioJournal(false); // Pas de redirection automatique
  const confirmDialog = useConfirmDialog();

  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  // Timer pour l'enregistrement
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // Nettoyer l'URL audio quand on change
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setError(null);
    } catch (err) {
      setError(t("microphonePermissionDenied"));
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAnalyze = async () => {
    if (!journalText.trim()) {
      setError(t("journalTextRequired"));
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setExtractedTasks([]);

    try {
      const response = await createJournalMutation.mutateAsync({
        raw_text: journalText.trim(),
        journal_date: new Date().toISOString().split("T")[0],
      });

      // Afficher les tâches extraites
      if (response.tasks && response.tasks.length > 0) {
        setExtractedTasks(response.tasks);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorCreatingJournal"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRecordedAudioSubmit = async () => {
    if (!audioBlob) {
      setError(t("noAudioRecorded"));
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setExtractedTasks([]);

    try {
      // Convertir le Blob en File
      const audioFile = new File([audioBlob], "recording.webm", {
        type: "audio/webm",
      });

      const response = await processAudioMutation.mutateAsync(audioFile);

      // Afficher les tâches extraites
      if (response.tasks && response.tasks.length > 0) {
        setExtractedTasks(response.tasks);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorProcessingAudio"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAudioFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      setError(t("audioFileRequired"));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(t("audioFileTooLarge"));
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setExtractedTasks([]);

    try {
      const response = await processAudioMutation.mutateAsync(file);

      // Afficher les tâches extraites
      if (response.tasks && response.tasks.length > 0) {
        setExtractedTasks(response.tasks);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorProcessingAudio"));
    } finally {
      setIsAnalyzing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const confirmed = await confirmDialog.confirm({
      title: t("deleteTask"),
      message: t("deleteTaskConfirmation"),
      variant: "danger",
      confirmText: t("delete"),
      cancelText: t("cancel"),
      onConfirm: () => {
        setExtractedTasks(extractedTasks.filter((task) => task.id !== taskId));
      },
    });
  };

  const handleStatusChange = (
    taskId: string,
    status: "todo" | "in_progress" | "done"
  ) => {
    setExtractedTasks(
      extractedTasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      )
    );
  };

  const handleSaveJournal = async () => {
    if (extractedTasks.length === 0) {
      // Si pas de tâches, rediriger vers la liste
      router.push("/app/journals");
      return;
    }

    // Le journal est déjà créé, on redirige vers la liste
    router.push("/app/journals");
  };

  const isProcessing =
    isAnalyzing ||
    createJournalMutation.isPending ||
    processAudioMutation.isPending;

  return (
    <div className="space-y-6 p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t("newJournal")}
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            {t("createJournalDescription")}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
          <p className="text-error-600 dark:text-error-400 text-sm">{error}</p>
        </div>
      )}

      {/* Journal Form */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="journal"
              className="text-sm font-medium text-foreground"
            >
              {t("describeYourDay")}
            </label>
            <textarea
              id="journal"
              rows={8}
              placeholder={t("journalPlaceholder")}
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              disabled={isProcessing || isRecording}
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!journalText.trim() || isProcessing || isRecording}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{t("analyzing")}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t("analyzeMyDay")}</span>
                </>
              )}
            </button>

            <div className="flex gap-3">
              {/* Record Audio Button */}
              {!isRecording && !audioBlob && (
                <button
                  onClick={startRecording}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-4 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  <Mic className="w-4 h-4" />
                  <span>{t("recordAudio")}</span>
                </button>
              )}

              {/* Stop Recording Button */}
              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-2 lg:px-4 py-1.5 lg:py-3 text-sm bg-error-600 hover:bg-error-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <Square className="w-4 h-4" />
                  <span>{formatTime(recordingTime)}</span>
                </button>
              )}

              {/* Upload Audio File Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing || isRecording}
                className="flex items-center gap-2 px-2 lg:px-4 py-1.5 lg:py-3 text-sm bg-neutral-600 hover:bg-neutral-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <Upload className="w-4 h-4" />
                <span>{t("uploadAudio")}</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleAudioFileUpload}
                disabled={isProcessing || isRecording}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recorded Audio Preview */}
      {audioBlob && !isRecording && (
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary-50 dark:bg-secondary-900/30">
                <Mic className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              </div>

              <div>
                <p className="text-sm font-medium text-foreground">
                  {t("audioRecorded")}
                </p>

                <p className="text-xs text-muted-foreground">
                  {formatTime(recordingTime)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {audioUrl && <audio src={audioUrl} controls className="h-10" />}
              <button
                onClick={handleRecordedAudioSubmit}
                disabled={isProcessing}
                className="flex items-center gap-2 px-2 lg:px-4 py-1.5 lg:py-3 text-sm bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t("processing")}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t("analyzeAudio")}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setAudioBlob(null);
                  setAudioUrl(null);
                  setRecordingTime(0);
                  if (audioUrl) {
                    URL.revokeObjectURL(audioUrl);
                  }
                }}
                className="px-2 lg:px-4 py-1.5 lg:py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && extractedTasks.length === 0 && (
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400 animate-pulse" />
            </div>

            <p className="text-lg font-medium text-foreground">
              {t("analyzingJournal")}
            </p>

            <p className="text-sm text-muted-foreground">
              {t("aiExtractingTasks")}
            </p>
          </div>
        </div>
      )}

      {/* Extracted Tasks */}
      {extractedTasks.length > 0 && !isAnalyzing && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {t("extractedTasks")} ({extractedTasks.length})
            </h2>

            <div className="flex items-center gap-1.5 lg:gap-3">
              <div className="px-3 py-1 rounded-full bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 text-sm font-medium border border-success-200 dark:border-success-800">
                {extractedTasks.length} {t("tasksCreatedAutomatically")}
              </div>

              <button
                onClick={handleSaveJournal}
                className="px-2 lg:px-4 py-1.5 lg:py-3 text-sm bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                {t("saveJournal")}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {extractedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
