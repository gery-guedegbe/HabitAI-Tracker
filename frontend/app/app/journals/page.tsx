"use client";

import React, { useState, useMemo } from "react";
import { PlusCircle, Search, Filter, BookOpen } from "lucide-react";
import Link from "next/link";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import {
  useJournals,
  useUpdateTask,
  useDeleteTask,
  useDeleteJournal,
} from "@/hooks/useJournals";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { JournalCard } from "@/components/journals/JournalCard";
import { JournalDetailsModal } from "@/components/journals/JournalDetailsModal";
import { JournalFilters } from "@/components/journals/JournalFilters";
import { type Journal } from "@/lib/api/journals";

type DateFilter = "all" | "today" | "week" | "month" | "year";
type TasksFilter = "all" | "with_tasks" | "without_tasks";

export default function JournalsPage() {
  const { language } = useLanguage();
  const { data, isLoading, error } = useJournals();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const deleteJournalMutation = useDeleteJournal();
  const confirmDialog = useConfirmDialog();

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateFilter>("all");
  const [selectedTasks, setSelectedTasks] = useState<TasksFilter>("all");
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const t = (key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getTranslation(key as any, language);
  };

  const handleViewJournal = (journal: Journal) => {
    setSelectedJournal(journal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJournal(null);
  };

  const handleDeleteJournal = async (journalId: string) => {
    await confirmDialog.confirm({
      title: t("deleteJournal"),
      message: t("deleteJournalConfirmation"),
      variant: "danger",
      confirmText: t("delete"),
      cancelText: t("cancel"),
      onConfirm: async () => {
        await deleteJournalMutation.mutateAsync(journalId);
      },
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    await confirmDialog.confirm({
      title: t("deleteTask"),
      message: t("deleteTaskConfirmation"),
      variant: "danger",
      confirmText: t("delete"),
      cancelText: t("cancel"),
      onConfirm: async () => {
        await deleteTaskMutation.mutateAsync(taskId);
      },
    });
  };

  const handleStatusChange = async (
    taskId: string,
    status: "todo" | "in_progress" | "done"
  ) => {
    try {
      await updateTaskMutation.mutateAsync({
        taskId,
        data: { status },
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Filtrage des journaux
  const filteredJournals = useMemo(() => {
    const journals = data?.journals || [];
    if (journals.length === 0) return [];

    let filtered = journals;

    // Recherche par texte
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (journal) =>
          journal.raw_text.toLowerCase().includes(query) ||
          journal.tasks?.some((task) =>
            task.title.toLowerCase().includes(query)
          )
      );
    }

    // Filtre par date
    if (selectedDate !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter((journal) => {
        const journalDate = new Date(journal.journal_date);
        switch (selectedDate) {
          case "today":
            return journalDate >= today;
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return journalDate >= weekAgo;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return journalDate >= monthAgo;
          case "year":
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return journalDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    // Filtre par tâches
    if (selectedTasks !== "all") {
      filtered = filtered.filter((journal) => {
        const tasksCount = journal.tasks?.length || 0;
        if (selectedTasks === "with_tasks") {
          return tasksCount > 0;
        } else if (selectedTasks === "without_tasks") {
          return tasksCount === 0;
        }
        return true;
      });
    }

    // Trier par date (plus récent en premier)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.journal_date).getTime();
      const dateB = new Date(b.journal_date).getTime();
      return dateB - dateA;
    });
  }, [data, searchQuery, selectedDate, selectedTasks]);

  // État de chargement
  if (isLoading) {
    return (
      <div className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32 animate-pulse"></div>
          </div>
          <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 animate-pulse"
            >
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32 mb-3"></div>
              <div className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded mb-3"></div>
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="p-4 lg:p-6">
        <div className="p-6 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
          <p className="text-error-600 dark:text-error-400 font-medium">
            {t("errorLoadingData")}
          </p>

          <p className="text-error-500 dark:text-error-500 text-sm mt-1">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  const journals = data?.journals || [];

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t("myJournals")}
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            {filteredJournals.length}{" "}
            {filteredJournals.length === 1 ? t("journal") : t("journals")}
            {filteredJournals.length !== journals.length &&
              ` / ${journals.length} ${t("total")}`}
          </p>
        </div>

        <Link href="/app/journal">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
            <PlusCircle className="w-4 h-4" />
            {t("newJournal")}
          </button>
        </Link>
      </div>

      {/* Actions bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <input
            type="text"
            placeholder={t("searchJournals")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            showFilters
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
              : "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-700"
          }`}
        >
          <Filter className="w-4 h-4" />
          {t("filters")}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <JournalFilters
          selectedDate={selectedDate}
          selectedTasks={selectedTasks}
          onDateChange={setSelectedDate}
          onTasksChange={setSelectedTasks}
        />
      )}

      {/* Journals List */}
      {filteredJournals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJournals.map((journal) => (
            <JournalCard
              key={journal.id}
              journal={journal}
              onView={handleViewJournal}
              onDelete={handleDeleteJournal}
              isDeleting={deleteJournalMutation.isPending}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 sm:p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery ||
                selectedDate !== "all" ||
                selectedTasks !== "all"
                  ? t("noJournalsFound")
                  : t("noJournalsYet")}
              </h3>

              <p className="text-muted-foreground mb-6">
                {searchQuery ||
                selectedDate !== "all" ||
                selectedTasks !== "all"
                  ? t("tryDifferentFilters")
                  : t("startTrackingHabits")}
              </p>

              {(searchQuery ||
                selectedDate !== "all" ||
                selectedTasks !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDate("all");
                    setSelectedTasks("all");
                  }}
                  className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  {t("clearFilters")}
                </button>
              )}

              {!searchQuery &&
                selectedDate === "all" &&
                selectedTasks === "all" && (
                  <Link href="/app/journal">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md mx-auto">
                      <PlusCircle className="w-4 h-4" />
                      {t("createFirstJournal")}
                    </button>
                  </Link>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Journal Details Modal */}
      <JournalDetailsModal
        journal={selectedJournal}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDeleteTask={handleDeleteTask}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
