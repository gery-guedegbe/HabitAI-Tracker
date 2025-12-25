"use client";

import React, { useEffect, useRef } from "react";
import { X, Calendar, FileText, Clock } from "lucide-react";
import { createPortal } from "react-dom";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { TaskItem } from "./TaskItem";
import { type Journal } from "@/lib/api/journals";

interface JournalDetailsModalProps {
  journal: Journal | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (
    taskId: string,
    status: "todo" | "in_progress" | "done"
  ) => void;
}

export function JournalDetailsModal({
  journal,
  isOpen,
  onClose,
  onDeleteTask,
  onStatusChange,
}: JournalDetailsModalProps) {
  const { language } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  // Gestion du focus et du scroll
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
      document.body.style.overflow = "hidden";
    } else {
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !journal) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(language === "fr" ? "fr-FR" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const tasksCount = journal.tasks?.length || 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-neutral-900/50 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
      aria-labelledby="journal-details-title"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 transform transition-all duration-300 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div className="flex-1 min-w-0">
            <h2
              id="journal-details-title"
              className="text-xl sm:text-2xl font-semibold text-foreground mb-2"
            >
              {t("journalDetails")}
            </h2>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(journal.journal_date)}</span>
              </div>
              {journal.created_at && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(journal.created_at)}</span>
                </div>
              )}
              {tasksCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>
                    {tasksCount} {tasksCount === 1 ? t("task") : t("tasks")}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0 ml-4"
            aria-label={t("close")}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* Journal Text */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                {t("journalContent")}
              </h3>
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                {journal.raw_text}
              </p>
            </div>

            {/* Tasks */}
            {tasksCount > 0 && (
              <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {t("extractedTasks")} ({tasksCount})
                </h3>
                <div className="space-y-3">
                  {journal.tasks?.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onDelete={onDeleteTask}
                      onStatusChange={onStatusChange}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

