"use client";

import { Moon, Sun, Monitor, Globe } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/context/ThemeContext";

export function PreferencesSettings() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const t = (key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getTranslation(key as any, language);
  };

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
          {t("appearance")}
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("theme")}
            </label>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                  theme === "light"
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-sm"
                    : "border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
                aria-label={t("lightTheme")}
              >
                <Sun
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    theme === "light"
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-muted-foreground"
                  }`}
                />
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  {t("light")}
                </span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                  theme === "dark"
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-sm"
                    : "border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
                aria-label={t("darkTheme")}
              >
                <Moon
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    theme === "dark"
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-muted-foreground"
                  }`}
                />
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  {t("dark")}
                </span>
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                  theme === "system"
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-sm"
                    : "border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
                aria-label={t("systemTheme")}
              >
                <Monitor
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    theme === "system"
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-muted-foreground"
                  }`}
                />
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  {t("system")}
                </span>
              </button>
            </div>
            {theme === "system" && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                {t("currentTheme")}:{" "}
                {resolvedTheme === "dark" ? t("dark") : t("light")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          {t("language")}
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="language-select"
              className="text-sm font-medium text-foreground"
            >
              {t("selectLanguage")}
            </label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => setLanguage("en")}
                className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                  language === "en"
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-sm"
                    : "border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
                aria-label="English"
              >
                <span
                  className={`text-base sm:text-lg font-semibold ${
                    language === "en"
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-muted-foreground"
                  }`}
                >
                  🇬🇧
                </span>
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  English
                </span>
              </button>
              <button
                onClick={() => setLanguage("fr")}
                className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                  language === "fr"
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-sm"
                    : "border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
                aria-label="Français"
              >
                <span
                  className={`text-base sm:text-lg font-semibold ${
                    language === "fr"
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-muted-foreground"
                  }`}
                >
                  🇫🇷
                </span>
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  Français
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
