"use client";

import React, { useState, useRef, useEffect } from "react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { type TaskStatus, type TaskCategory } from "@/lib/api/tasks";

interface TaskFiltersProps {
  selectedStatus: TaskStatus | "all";
  selectedCategory: TaskCategory | "all";
  onStatusChange: (status: TaskStatus | "all") => void;
  onCategoryChange: (category: TaskCategory | "all") => void;
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
        className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
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
          <button
            type="button"
            onClick={() => {
              onValueChange("all");
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${
              value === "all"
                ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                : "text-foreground"
            }`}
          >
            {placeholder}
          </button>
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

export function TaskFilters({
  selectedStatus,
  selectedCategory,
  onStatusChange,
  onCategoryChange,
}: TaskFiltersProps) {
  const { language } = useLanguage();
  const t = (key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getTranslation(key as any, language);
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

  return (
    <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t("taskStatus")}
          </label>
          <Select
            value={selectedStatus}
            onValueChange={(value) =>
              onStatusChange(value as TaskStatus | "all")
            }
            options={statuses}
            placeholder={t("allStatuses")}
            getLabel={getStatusLabel}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t("taskCategory")}
          </label>
          <Select
            value={selectedCategory}
            onValueChange={(value) =>
              onCategoryChange(value as TaskCategory | "all")
            }
            options={categories}
            placeholder={t("allCategories")}
            getLabel={getCategoryLabel}
          />
        </div>
      </div>
    </div>
  );
}
