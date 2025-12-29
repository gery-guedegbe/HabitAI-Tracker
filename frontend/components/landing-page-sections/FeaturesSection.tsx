"use client";

import { BarChart3, Clock, Mic, Shield, Smartphone, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";

const getFeatures = (t: (key: string) => string) => [
  {
    icon: Sparkles,
    title: t("featureAIExtraction"),
    description: t("featureAIExtractionDesc"),
    color: "primary",
  },
  {
    icon: BarChart3,
    title: t("featureAnalytics"),
    description: t("featureAnalyticsDesc"),
    color: "secondary",
  },
  {
    icon: Mic,
    title: t("featureAudioText"),
    description: t("featureAudioTextDesc"),
    color: "success",
  },
  {
    icon: Clock,
    title: t("featureRealTime"),
    description: t("featureRealTimeDesc"),
    color: "warning",
  },
  {
    icon: Shield,
    title: t("featureSecure"),
    description: t("featureSecureDesc"),
    color: "error",
  },
  {
    icon: Smartphone,
    title: t("featureMobile"),
    description: t("featureMobileDesc"),
    color: "primary",
  },
];

const colorClasses = {
  primary:
    "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400",
  secondary:
    "bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400",
  success:
    "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  warning:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  error: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
};

export default function FeaturesSection() {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  const features = getFeatures(t as (key: string) => string);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-3 sm:mb-4 md:mb-6 px-4 text-balance">
            {t("featuresTitle")}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4 text-balance">
            {t("featuresSubtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="p-6 sm:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/50 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg ${colorClasses[feature.color as keyof typeof colorClasses]} flex items-center justify-center mb-4 sm:mb-6`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                </motion.div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
