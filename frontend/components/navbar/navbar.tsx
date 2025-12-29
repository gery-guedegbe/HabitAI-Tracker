"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LanguageSwitcherCompact } from "@/components/langage-components/LanguageSwitcherCompact";
import { ThemeSwitcherCompact } from "@/components/theme-components/ThemeSwitcherCompact";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <motion.div
              className="flex items-center gap-2 sm:gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-sm">
                H
              </div>
              <span className="font-bold text-base sm:text-lg lg:text-xl text-foreground">
                HabitAI Tracker
              </span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {/* Language & Theme Switchers */}
            <div className="flex items-center gap-1">
              <LanguageSwitcherCompact />
              <ThemeSwitcherCompact />
            </div>

            <Link href="/login">
              <motion.button
                className="bg-transparent text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm lg:text-base px-3 lg:px-4 py-2 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t("login")}
              </motion.button>
            </Link>

            <Link href="/register">
              <motion.button
                className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 lg:px-6 py-2 rounded-md text-sm lg:text-base font-medium shadow-sm hover:shadow-md transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t("getStarted")}
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-1">
            <LanguageSwitcherCompact />
            <ThemeSwitcherCompact />
            <button
              className="p-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="md:hidden overflow-hidden"
          initial={false}
          animate={{
            height: isMenuOpen ? "auto" : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="pt-4 pb-2 space-y-2">
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="block"
            >
              <motion.button
                className="w-full text-left bg-transparent text-primary-600 dark:text-primary-400 font-medium text-base px-3 py-2 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                whileTap={{ scale: 0.98 }}
              >
                {t("login")}
              </motion.button>
            </Link>

            <Link
              href="/register"
              onClick={() => setIsMenuOpen(false)}
              className="block"
            >
              <motion.button
                className="w-full text-left bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium text-base px-3 py-2 rounded-md transition-colors"
                whileTap={{ scale: 0.98 }}
              >
                {t("getStarted")}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
