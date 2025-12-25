/**
 * Version compacte du ThemeSwitcher
 * Affiche uniquement l'icône avec un dropdown au clic
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

type Theme = "light" | "dark" | "system";

const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeSwitcherCompact() {
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

  // Fermer avec Escape
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

  // Icône selon le thème résolu
  const ThemeIcon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-neutral-600 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900"
        aria-label="Select theme"
        aria-expanded={isOpen}
      >
        <ThemeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {isOpen && (
        <div
          className="absolute bottom-full right-0 mb-2 w-36 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 py-1 z-50 opacity-0 animate-[fadeIn_0.15s_ease-out_forwards] origin-bottom-right"
          role="menu"
        >
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isSelected = themeOption.value === theme;
            return (
              <button
                key={themeOption.value}
                type="button"
                onClick={() => handleThemeChange(themeOption.value)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm transition-colors duration-150 ${
                  isSelected
                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                }`}
                role="menuitem"
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="flex-1 text-left">{themeOption.label}</span>
                {isSelected && (
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 dark:text-primary-400" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

