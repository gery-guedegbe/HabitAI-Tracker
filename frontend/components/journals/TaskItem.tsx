"use client";

import React, { useState, useRef, useEffect } from "react";
import { Clock, Trash2, Tag as TagIcon } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { type Task } from "@/lib/api/journals";

interface TaskItemProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onStatusChange: (
    taskId: string,
    status: "todo" | "in_progress" | "done"
  ) => void;
}

// Badge component simple
const Badge = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <span
    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${className}`}
  >
    {children}
  </span>
);

// Select component simple
interface SelectOption {
  value: string;
  label: string;
}

const Select = ({
  value,
  onValueChange,
  options,
  getStatusLabel,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  getStatusLabel: (status: string) => string;
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

  const handleSelect = (newValue: string) => {
    onValueChange(newValue);
    setIsOpen(false);
  };

  // Trouver le label de la valeur sélectionnée
  const selectedOption = options.find((opt) => opt.value === value);
  const selectedLabel = selectedOption?.label || getStatusLabel(value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-40 flex items-center justify-between px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
      >
        <span>{selectedLabel}</span>
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
        <div className="absolute z-50 w-full sm:w-40 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
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

const getCategoryColor = (category: string | null) => {
  const colors: Record<string, string> = {
    sport:
      "bg-success-500/20 dark:bg-success-900/20 text-success-500 dark:text-success-700 border-success-200 dark:border-success-800",
    travail:
      "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border-primary-200 dark:border-primary-800",
    santé:
      "bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 border-error-200 dark:border-error-800",
    apprentissage:
      "bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 border-secondary-200 dark:border-secondary-800",
    social:
      "bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-400 border-warning-200 dark:border-warning-800",
    loisir:
      "bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 border-secondary-200 dark:border-secondary-800",
    autre:
      "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700",
  };
  return (
    colors[category?.toLowerCase() || ""] ||
    "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
  );
};

const getStatusLabel = (
  status: string,
  t: (key: Parameters<typeof getTranslation>[0]) => string
) => {
  if (status === "done") return t("done");
  if (status === "in_progress") return t("inProgress");
  return t("toDo");
};

export function TaskItem({ task, onDelete, onStatusChange }: TaskItemProps) {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  return (
    <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow duration-200">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-2">
              {task.title}
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              {task.category && (
                <Badge className={getCategoryColor(task.category)}>
                  {task.category}
                </Badge>
              )}
              {task.duration_minutes && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>
                    {task.duration_minutes} {t("min")}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-lg text-error-600 dark:text-error-400 hover:text-error-700 dark:hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors shrink-0"
            aria-label={t("delete")}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
              >
                <TagIcon className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Status Select */}
        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <Select
            value={task.status}
            onValueChange={(value) =>
              onStatusChange(task.id, value as "todo" | "in_progress" | "done")
            }
            getStatusLabel={(status) => getStatusLabel(status, t)}
            options={[
              { value: "todo", label: t("toDo") },
              { value: "in_progress", label: t("inProgress") },
              { value: "done", label: t("done") },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
