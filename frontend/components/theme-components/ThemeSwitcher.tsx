"use client";

import { useState, useRef, useEffect } from "react";
import { Moon, Sun, Monitor, ChevronDown, Check } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

type Theme = "light" | "dark" | "system";

const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown quand on clique en dehors
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

  // Fermer le dropdown avec la touche Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium text-foreground bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 active:scale-[0.98]"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select theme"
      >
        <div className="relative h-3.5 w-3.5 sm:h-4 sm:w-4">
          <Sun
            className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-600 dark:text-neutral-400 absolute transition-all duration-300 ${
              resolvedTheme === "dark"
                ? "rotate-90 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }`}
          />
          <Moon
            className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-600 dark:text-neutral-400 absolute transition-all duration-300 ${
              resolvedTheme === "dark"
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-0 opacity-0"
            }`}
          />
        </div>
        <span className="font-semibold text-neutral-700 dark:text-neutral-300 capitalize hidden sm:inline">
          {theme === "system" ? "System" : theme}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-600 dark:text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 py-1 z-50 opacity-0 animate-[fadeIn_0.15s_ease-out_forwards] origin-top-right"
          role="menu"
          aria-orientation="vertical"
        >
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isSelected = themeOption.value === theme;
            return (
              <button
                key={themeOption.value}
                type="button"
                onClick={() => handleThemeChange(themeOption.value)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${
                  isSelected
                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                }`}
                role="menuitem"
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{themeOption.label}</span>
                {isSelected && <Check className="h-4 w-4 text-primary-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
