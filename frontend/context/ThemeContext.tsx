"use client";

import type React from "react";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useMemo,
  startTransition,
} from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  // Toujours initialiser avec defaultTheme côté serveur pour éviter les différences d'hydratation
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  // État pour forcer le recalcul lors des changements de préférence système
  const [systemPreference, setSystemPreference] = useState<"light" | "dark">(
    "light"
  );

  // Charger le thème depuis localStorage après le montage (côté client uniquement)
  // Utiliser useLayoutEffect pour éviter le flash de contenu incorrect
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (
      stored &&
      (stored === "light" || stored === "dark" || stored === "system")
    ) {
      startTransition(() => {
        setThemeState(stored);
      });
    }
    // Définir la préférence système initiale
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    startTransition(() => {
      setSystemPreference(mediaQuery.matches ? "dark" : "light");
    });
  }, [storageKey]);

  // Calculer le thème résolu avec useMemo pour éviter les rendus en cascade
  const resolvedTheme = useMemo<"light" | "dark">(() => {
    if (theme === "system") {
      return systemPreference;
    }
    return theme;
  }, [theme, systemPreference]);

  // Appliquer le thème au DOM
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  // Écouter les changements de préférence système si le thème est "system"
  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setSystemPreference(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
