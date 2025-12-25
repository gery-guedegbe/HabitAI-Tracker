"use client";

import React, { useState, useRef, useEffect } from "react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";

type DateFilter = "all" | "today" | "week" | "month" | "year";
type TasksFilter = "all" | "with_tasks" | "without_tasks";

interface JournalFiltersProps {
  selectedDate: DateFilter;
  selectedTasks: TasksFilter;
  onDateChange: (date: DateFilter) => void;
  onTasksChange: (tasks: TasksFilter) => void;
}

// Simple Select component
const Select = ({
  value,
  onValueChange,
  options,
  placeholder,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
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
  const displayValue = selectedOption?.label || placeholder;

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

export function JournalFilters({
  selectedDate,
  selectedTasks,
  onDateChange,
  onTasksChange,
}: JournalFiltersProps) {
  const { language } = useLanguage();
  const t = (key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getTranslation(key as any, language);
  };

  const dateOptions: Array<{ value: DateFilter; label: string }> = [
    { value: "all", label: t("allDates") },
    { value: "today", label: t("today") },
    { value: "week", label: t("thisWeek") },
    { value: "month", label: t("thisMonth") },
    { value: "year", label: t("thisYear") },
  ];

  const tasksOptions: Array<{ value: TasksFilter; label: string }> = [
    { value: "all", label: t("allJournals") },
    { value: "with_tasks", label: t("withTasks") },
    { value: "without_tasks", label: t("withoutTasks") },
  ];

  return (
    <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t("filterByDate")}
          </label>
          <Select
            value={selectedDate}
            onValueChange={(value) => onDateChange(value as DateFilter)}
            options={dateOptions}
            placeholder={t("allDates")}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t("filterByTasks")}
          </label>
          <Select
            value={selectedTasks}
            onValueChange={(value) => onTasksChange(value as TasksFilter)}
            options={tasksOptions}
            placeholder={t("allJournals")}
          />
        </div>
      </div>
    </div>
  );
}
