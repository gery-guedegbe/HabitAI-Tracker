"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Clock,
  Tag as TagIcon,
} from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import type { Task, TaskStatus, TaskCategory } from "@/lib/api/tasks";
import { useJournals } from "@/hooks/useJournals";

// TaskMenu component
function TaskMenu({
  task,
  onEdit,
  onStatusChange,
  onDelete,
  t,
}: {
  task: Task;
  onEdit: () => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: () => void;
  t: (key: Parameters<typeof getTranslation>[0]) => string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        aria-label="Task menu"
      >
        <MoreVertical className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              {t("edit")}
            </button>

            <button
              onClick={() => {
                onStatusChange(task.id, "todo");
                setIsOpen(false);
              }}
              disabled={task.status === "todo"}
              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("markAsToDo")}
            </button>

            <button
              onClick={() => {
                onStatusChange(task.id, "in_progress");
                setIsOpen(false);
              }}
              disabled={task.status === "in_progress"}
              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("markAsInProgress")}
            </button>

            <button
              onClick={() => {
                onStatusChange(task.id, "done");
                setIsOpen(false);
              }}
              disabled={task.status === "done"}
              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("markAsDone")}
            </button>

            <div className="border-t border-neutral-200 dark:border-neutral-700 my-1"></div>

            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-error-600 dark:text-error-500 hover:bg-error-500/30 dark:hover:bg-error-900/20 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {t("delete")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const getCategoryColor = (category: TaskCategory | null) => {
  const colors: Record<string, string> = {
    sport:
      "bg-success-500/30 dark:bg-success-900/20 text-success-700 dark:text-success-500 border-success-200 dark:border-success-800",
    travail:
      "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border-primary-200 dark:border-primary-800",
    santé:
      "bg-error-500/30 dark:bg-error-900/20 text-error-700 dark:text-error-500 border-error-200 dark:border-error-800",
    apprentissage:
      "bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 border-secondary-200 dark:border-secondary-800",
    social:
      "bg-warning-500/30 dark:bg-warning-900/20 text-warning-700 dark:text-warning-500 border-warning-200 dark:border-warning-800",
    loisir:
      "bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 border-secondary-200 dark:border-secondary-800",
    autre:
      "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700",
  };
  return (
    colors[category || ""] ||
    "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
  );
};

const getCategoryLabel = (
  category: TaskCategory | null,
  language: "en" | "fr"
) => {
  if (!category) return "";
  const labels: Record<string, Record<"en" | "fr", string>> = {
    sport: { en: "Sport", fr: "Sport" },
    travail: { en: "Work", fr: "Travail" },
    santé: { en: "Health", fr: "Santé" },
    apprentissage: { en: "Learning", fr: "Apprentissage" },
    social: { en: "Social", fr: "Social" },
    loisir: { en: "Leisure", fr: "Loisir" },
    autre: { en: "Other", fr: "Autre" },
  };
  return labels[category]?.[language] || category;
};

const getStatusColor = (status: TaskStatus) => {
  const colors: Record<TaskStatus, string> = {
    todo: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
    in_progress:
      "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400",
    done: "bg-success-500/30 dark:bg-success-900/20 text-success-700 dark:text-success-500",
  };
  return colors[status];
};

export default function TasksPage() {
  const { language } = useLanguage();
  const { data, isLoading, error } = useTasks();
  const { data: journalsData } = useJournals();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const confirmDialog = useConfirmDialog();

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | "all">(
    "all"
  );
  const [selectedCategory, setSelectedCategory] = useState<
    TaskCategory | "all"
  >("all");
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  // Trouver le premier journal pour créer des tâches standalone
  const defaultJournalId =
    journalsData?.journals && journalsData.journals.length > 0
      ? journalsData.journals[0].id
      : null;

  const handleCreateTask = async () => {
    if (!defaultJournalId) {
      alert(
        language === "fr"
          ? "Aucun journal disponible. Veuillez créer un journal d'abord."
          : "No journal available. Please create a journal first."
      );
      return;
    }

    try {
      // Pour l'instant, on ne peut pas créer de tâche sans journal
      // On devrait créer un journal minimal ou avoir un endpoint dédié
      // Pour l'instant, on affiche juste un message
      console.log(
        "Task creation requires a journal. Journal ID:",
        defaultJournalId
      );
      // TODO: Implémenter la création via l'API
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTaskMutation.mutateAsync({
        taskId: updatedTask.id,
        data: {
          title: updatedTask.title,
          category: updatedTask.category || undefined,
          status: updatedTask.status,
          tags: updatedTask.tags || undefined,
          duration_minutes: updatedTask.duration_minutes || undefined,
          note: updatedTask.note || undefined,
        },
      });
      setEditingTask(null);
      setTaskDialogOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
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

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await updateTaskMutation.mutateAsync({
        taskId,
        data: { status },
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const filteredTasks =
    data?.tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.note?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === "all" || task.status === selectedStatus;
      const matchesCategory =
        selectedCategory === "all" || task.category === selectedCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    }) || [];

  const getStatusLabel = (status: TaskStatus) => {
    if (status === "done") return t("done");
    if (status === "in_progress") return t("inProgress");
    return t("toDo");
  };

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {t("tasksTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("tasksSubtitle")}</p>
      </div>

      {/* Actions bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("searchTasks")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
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

          <button
            onClick={() => {
              setEditingTask(null);
              setTaskDialogOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            {t("newTask")}
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <TaskFilters
          selectedStatus={selectedStatus}
          selectedCategory={selectedCategory}
          onStatusChange={setSelectedStatus}
          onCategoryChange={setSelectedCategory}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 animate-pulse"
            >
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-6 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
          <p className="text-error-600 dark:text-error-400 font-medium">
            {t("errorLoadingData")}
          </p>
          <p className="text-error-500 dark:text-error-500 text-sm mt-1">
            {error.message}
          </p>
        </div>
      )}

      {/* Task count */}
      {!isLoading && !error && (
        <div className="text-sm text-muted-foreground">
          {filteredTasks.length}{" "}
          {filteredTasks.length === 1 ? t("task") : t("tasks")}
        </div>
      )}

      {/* Tasks grid */}
      {!isLoading && !error && filteredTasks.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
                    {task.title}
                  </h3>

                  {task.category && (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs rounded-md border ${getCategoryColor(
                        task.category
                      )}`}
                    >
                      {getCategoryLabel(task.category, language)}
                    </span>
                  )}
                </div>

                <TaskMenu
                  task={task}
                  onEdit={() => handleEditClick(task)}
                  onStatusChange={handleStatusChange}
                  onDelete={() => handleDeleteTask(task.id)}
                  t={t}
                />
              </div>

              {task.note && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {task.note}
                </p>
              )}

              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`px-2 py-1 text-xs rounded-md ${getStatusColor(
                    task.status
                  )}`}
                >
                  {getStatusLabel(task.status)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {task.duration_minutes || 0} {t("min")}
                </div>

                {task.tags && task.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <TagIcon className="w-3 h-3" />
                    {task.tags.length}
                  </div>
                )}
              </div>

              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {task.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}

                  {task.tags.length > 3 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      +{task.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{t("noTasksFound")}</p>
          <button
            onClick={() => {
              setEditingTask(null);
              setTaskDialogOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md mx-auto"
          >
            <Plus className="w-4 h-4" />
            {t("createFirstTask")}
          </button>
        </div>
      )}

      {/* Task Dialog */}
      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        task={editingTask}
        onSave={(taskData) => {
          if (editingTask) {
            handleUpdateTask(taskData as Task);
          } else {
            handleCreateTask();
          }
        }}
      />
    </div>
  );
}
