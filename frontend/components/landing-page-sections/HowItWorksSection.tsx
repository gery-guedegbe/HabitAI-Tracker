"use client";

import { motion } from "motion/react";
import { PenTool, Sparkles, TrendingUp } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";

const getSteps = (t: (key: string) => string) => [
  {
    number: 1,
    icon: PenTool,
    title: t("step1Title"),
    description: t("step1Desc"),
    color: "bg-primary-600 dark:bg-primary-500",
  },
  {
    number: 2,
    icon: Sparkles,
    title: t("step2Title"),
    description: t("step2Desc"),
    color: "bg-secondary-600 dark:bg-secondary-500",
  },
  {
    number: 3,
    icon: TrendingUp,
    title: t("step3Title"),
    description: t("step3Desc"),
    color: "bg-green-600 dark:bg-green-500",
  },
];

export default function HowItWorksSection() {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  const steps = getSteps(t as (key: string) => string);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-3 sm:mb-4 md:mb-6 px-4 text-balance">
            {t("howItWorksTitle")}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4 text-balance">
            {t("howItWorksSubtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <motion.div
                  className="relative mx-auto mb-4 sm:mb-6 lg:mb-8"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full ${step.color} text-white flex items-center justify-center mx-auto shadow-lg dark:shadow-xl`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-xs sm:text-sm md:text-base lg:text-lg font-bold text-neutral-700 dark:text-neutral-300 shadow-sm"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  >
                    {step.number}
                  </motion.div>
                </motion.div>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2 sm:mb-3 md:mb-4">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-sm mx-auto px-4">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
