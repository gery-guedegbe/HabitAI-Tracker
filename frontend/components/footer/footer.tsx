"use client";

import { motion } from "motion/react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";

export default function Footer() {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  return (
    <footer className="py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-neutral-900 dark:bg-black text-neutral-400 dark:text-neutral-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <motion.div
            className="flex items-center gap-2 sm:gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-sm">
              H
            </div>
            <span className="font-bold text-base sm:text-lg lg:text-xl text-white dark:text-neutral-100">
              HabitAI Tracker
            </span>
          </motion.div>

          <p className="text-xs sm:text-sm lg:text-base text-center sm:text-left text-neutral-400 dark:text-neutral-500">
            © {new Date().getFullYear()} HabitAI Tracker. {t("allRightsReserved")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
