"use client";

import type React from "react";
import type { Language } from "@/lib/i18n/i18n";
import { createContext, useContext, useState, useEffect } from "react";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Toujours initialiser avec "en" côté serveur pour éviter les différences d'hydratation
  const [language, setLanguageState] = useState<Language>("en");

  // Charger la langue depuis localStorage après le montage (côté client uniquement)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("habitai-language") as Language;
    if (stored && (stored === "en" || stored === "fr")) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("habitai-language", lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
