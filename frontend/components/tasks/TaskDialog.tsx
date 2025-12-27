"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Tag as TagIcon } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { type Task, type TaskCategory, type TaskStatus } from "@/lib/api/tasks";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSave: (task: Task | Omit<Task, "id" | "created_at" | "updated_at">) => void;
}

// Les labels seront traduits dynamiquement
const getCategories = (
  t: (key: string) => string
): { value: TaskCategory; label: string }[] => [
  { value: "sport", label: t("categorySport") },
  { value: "travail", label: t("categoryWork") },
  { value: "santé", label: t("categoryHealth") },
  { value: "apprentissage", label: t("categoryLearning") },
  { value: "social", label: t("categorySocial") },
  { value: "loisir", label: t("categoryLeisure") },
  { value: "autre", label: t("categoryOther") },
];

const getStatuses = (
  t: (key: string) => string
): { value: TaskStatus; label: string }[] => [
  { value: "todo", label: t("toDo") },
  { value: "in_progress", label: t("inProgress") },
  { value: "done", label: t("done") },
];

// Simple Select component
const Select = ({
  value,
  onValueChange,
  options,
  placeholder,
  getLabel,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  getLabel: (value: string) => string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || getLabel(value) || placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full mt-1 lg:mt-2.5 flex items-center justify-between px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
      >
        <span>{displayValue}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${
                value === option.value
                  ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                  : "text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export function TaskDialog({
  open,
  onOpenChange,
  task,
  onSave,
}: TaskDialogProps) {
  const { language } = useLanguage();
  const t = (key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getTranslation(key as any, language);
  };

  const getInitialFormData = (currentTask: Task | null | undefined) => {
    if (currentTask) {
      return {
        title: currentTask.title,
        category: (currentTask.category || "autre") as TaskCategory,
        note: currentTask.note || "",
        duration_minutes: currentTask.duration_minutes || 30,
        status: currentTask.status,
        tags: currentTask.tags || [],
      };
    }
    return {
      title: "",
      category: "autre" as TaskCategory,
      note: "",
      duration_minutes: 30,
      status: "todo" as TaskStatus,
      tags: [] as string[],
    };
  };

  const [formData, setFormData] = useState(() => getInitialFormData(task));
  const [tagInput, setTagInput] = useState("");

  // Réinitialiser le formulaire quand le modal s'ouvre ou que la tâche change
  const prevOpenRef = React.useRef(open);
  const prevTaskIdRef = React.useRef(task?.id);

  React.useEffect(() => {
    if (open && (!prevOpenRef.current || prevTaskIdRef.current !== task?.id)) {
      // Utiliser setTimeout pour éviter l'erreur de setState dans useEffect
      setTimeout(() => {
        setFormData(getInitialFormData(task));
        setTagInput("");
      }, 0);
      prevOpenRef.current = open;
      prevTaskIdRef.current = task?.id;
    }

    if (!open) {
      prevOpenRef.current = false;
    }
  }, [open, task]);

  // Fermer avec Escape
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);

  // Empêcher le scroll du body
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      onSave({
        ...task,
        ...formData,
      });
    } else {
      // Pour créer une nouvelle tâche, on a besoin d'un journal_id
      // On va le passer via onSave, mais pour l'instant on utilise null
      onSave({
        ...formData,
        journal_id: null,
      } as Omit<Task, "id" | "created_at" | "updated_at">);
    }
    onOpenChange(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const categories = getCategories(t);
  const statuses = getStatuses(t);

  const getCategoryLabel = (cat: string) => {
    const category = categories.find((c) => c.value === cat);
    return category?.label || cat;
  };

  const getStatusLabel = (status: string) => {
    const statusOption = statuses.find((s) => s.value === status);
    return statusOption?.label || status;
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed w-full min-h-screen inset-0 bg-black/50 dark:bg-black/70 z-50 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl font-semibold text-foreground">
              {task ? t("editTask") : t("createTask")}
            </h2>

            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label={t("close")}
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-foreground"
                >
                  {t("taskTitle")} *
                </label>

                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder={t("taskTitlePlaceholder")}
                  required
                  className="w-full px-4 py-2 mt-1 lg:mt-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t("taskCategory")} *
                  </label>

                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        category: value as TaskCategory,
                      })
                    }
                    options={categories}
                    getLabel={getCategoryLabel}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t("taskStatus")}
                  </label>

                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value as TaskStatus,
                      })
                    }
                    options={statuses}
                    getLabel={getStatusLabel}
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label
                  htmlFor="duration"
                  className="text-sm font-medium text-foreground"
                >
                  {t("taskDuration")} ({t("min")}) *
                </label>

                <input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration_minutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration_minutes: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  required
                  className="w-full mt-1 lg:mt-2.5 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Note/Description */}
              <div className="space-y-2">
                <label
                  htmlFor="note"
                  className="text-sm font-medium text-foreground"
                >
                  {t("taskDescription")}
                </label>

                <textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  placeholder={t("taskDescriptionPlaceholder")}
                  rows={3}
                  className="w-full mt-1 lg:mt-2.5 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t("taskTags")}
                </label>

                <div className="flex gap-2 mt-1 lg:mt-2.5">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder={t("taskTagsPlaceholder")}
                    className="flex-1 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-foreground font-medium rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
                      >
                        <TagIcon className="w-3 h-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-error-600 dark:hover:text-error-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm font-medium text-foreground bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200"
              >
                {t("cancel")}
              </button>

              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                {task ? t("updateTask") : t("createTask")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
