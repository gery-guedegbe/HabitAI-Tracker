"use client";

import React from "react";
import { Calendar, FileText, Trash2, Eye, Clock } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { type Journal } from "@/lib/api/journals";

interface JournalCardProps {
  journal: Journal;
  onView: (journal: Journal) => void;
  onDelete: (journalId: string) => void;
  isDeleting?: boolean;
}

export function JournalCard({
  journal,
  onView,
  onDelete,
  isDeleting = false,
}: JournalCardProps) {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "short",
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
  const previewText = journal.raw_text.slice(0, 150);
  const hasMoreText = journal.raw_text.length > 150;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <p className="text-sm font-medium text-foreground">
                {formatDate(journal.journal_date)}
              </p>
            </div>
            {journal.created_at && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{formatTime(journal.created_at)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => onView(journal)}
              className="p-2 rounded-lg text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              aria-label={t("viewDetails")}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(journal.id)}
              disabled={isDeleting}
              className="p-2 rounded-lg text-error-600 dark:text-error-400 hover:text-error-700 dark:hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors disabled:opacity-50"
              aria-label={t("delete")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="px-4 sm:px-6 py-4">
        <div className="space-y-3">
          {/* Text Preview */}
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-foreground line-clamp-3 flex-1">
              {previewText}
              {hasMoreText && "..."}
            </p>
          </div>

          {/* Tasks Count */}
          {tasksCount > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-medium text-muted-foreground">
                {tasksCount} {tasksCount === 1 ? t("task") : t("tasks")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

