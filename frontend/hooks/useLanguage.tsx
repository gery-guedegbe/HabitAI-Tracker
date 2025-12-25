"use client";

import type React from "react";
import type { Language } from "@/lib/i18n/i18n";
import { createContext, useContext, useState } from "react";

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
  // Utiliser une fonction d'initialisation lazy pour éviter les rendus en cascade
  const [language, setLanguageState] = useState<Language>(() => {
    // Vérifier si on est côté client (localStorage n'existe pas côté serveur)
    if (typeof window === "undefined") {
      return "en";
    }
    const stored = localStorage.getItem("habitai-language") as Language;
    if (stored && (stored === "en" || stored === "fr")) {
      return stored;
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("habitai-language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
