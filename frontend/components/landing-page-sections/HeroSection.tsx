"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Button from "@/components/ui/button";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";

export default function HeroSection() {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  return (
    <section className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{t("heroBadge")}</span>
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 sm:mb-6 md:mb-8 text-balance leading-tight px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t("heroTitle")}
          <br />
          <span className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">
            {t("heroTitleHighlight")}
          </span>
        </motion.h1>

        <motion.p
          className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto text-balance leading-relaxed px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t("heroDescription")}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5"
            >
              {t("startForFree")}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5"
          >
            {t("learnMore")}
          </Button>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 max-w-5xl mx-auto px-2 sm:px-4 lg:px-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative w-full aspect-video bg-neutral-50 dark:bg-neutral-900 rounded-lg overflow-hidden">
            <Image
              src="/habit_ai_dashboard_screen_shoot.png"
              alt={t("heroImageAlt")}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
