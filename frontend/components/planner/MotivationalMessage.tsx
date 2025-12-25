/**
 * Composant pour afficher des messages motivants personnalisés
 * Messages aléatoires basés sur les statistiques de l'utilisateur
 */

"use client";

import { useMemo } from "react";
import { Sparkles, TrendingUp, Flame, Target } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import type { CalendarStats, CalendarProgression } from "@/lib/api/tasks";

interface MotivationalMessageProps {
  stats: CalendarStats;
  progression: CalendarProgression;
}

/**
 * Générer un message motivant basé sur les statistiques
 */
const generateMessage = (
  stats: CalendarStats,
  progression: CalendarProgression,
  language: "en" | "fr"
): { message: string; icon: typeof Sparkles; color: string } => {
  const messages: Array<{
    condition: (stats: CalendarStats, progression: CalendarProgression) => boolean;
    message: { en: (stats: CalendarStats, progression: CalendarProgression) => string; fr: (stats: CalendarStats, progression: CalendarProgression) => string };
    icon: typeof Sparkles;
    color: string;
  }> = [
    // Messages basés sur le streak
    {
      condition: (s) => s.current_streak >= 7,
      message: {
        en: (s) => `🔥 Amazing! You've maintained a ${s.current_streak}-day streak! Consistency is your superpower.`,
        fr: (s) => `🔥 Incroyable ! Vous maintenez une série de ${s.current_streak} jours ! La constance est votre super-pouvoir.`,
      },
      icon: Flame,
      color: "text-warning-600 dark:text-warning-400",
    },
    {
      condition: (s) => s.current_streak >= 3 && s.current_streak < 7,
      message: {
        en: (s) => `Great momentum! ${s.current_streak} days in a row. Keep building that habit!`,
        fr: (s) => `Excellent élan ! ${s.current_streak} jours d'affilée. Continuez à construire cette habitude !`,
      },
      icon: TrendingUp,
      color: "text-success-600 dark:text-success-400",
    },

    // Messages basés sur la progression
    {
      condition: (_, p) => p.improvement && p.difference >= 10,
      message: {
        en: (_, p) => `🚀 Outstanding progress! You've completed ${p.difference} more tasks this month. The cumulative effect is real!`,
        fr: (_, p) => `🚀 Progrès exceptionnel ! Vous avez complété ${p.difference} tâches de plus ce mois. L'effet cumulé est réel !`,
      },
      icon: TrendingUp,
      color: "text-success-600 dark:text-success-400",
    },
    {
      condition: (_, p) => p.improvement && p.difference >= 5,
      message: {
        en: (_, p) => `Excellent work! You're doing ${p.difference} more tasks than last month. Every effort counts!`,
        fr: (_, p) => `Excellent travail ! Vous faites ${p.difference} tâches de plus que le mois dernier. Chaque effort compte !`,
      },
      icon: Target,
      color: "text-primary-600 dark:text-primary-400",
    },
    {
      condition: (_, p) => p.improvement && p.difference > 0,
      message: {
        en: (_, p) => `Keep it up! You're improving. ${p.difference} more tasks this month shows your dedication.`,
        fr: (_, p) => `Continuez ! Vous progressez. ${p.difference} tâches de plus ce mois montre votre dévouement.`,
      },
      icon: Sparkles,
      color: "text-primary-600 dark:text-primary-400",
    },

    // Messages basés sur le nombre de tâches complétées
    {
      condition: (s) => s.completed_tasks >= 50,
      message: {
        en: (s) => `Incredible! ${s.completed_tasks} tasks completed. Your consistency is building something amazing.`,
        fr: (s) => `Incroyable ! ${s.completed_tasks} tâches complétées. Votre constance construit quelque chose d'extraordinaire.`,
      },
      icon: Sparkles,
      color: "text-primary-600 dark:text-primary-400",
    },
    {
      condition: (s) => s.completed_tasks >= 30 && s.completed_tasks < 50,
      message: {
        en: (s) => `Impressive! ${s.completed_tasks} tasks completed. You're making real progress!`,
        fr: (s) => `Impressionnant ! ${s.completed_tasks} tâches complétées. Vous faites de vrais progrès !`,
      },
      icon: Target,
      color: "text-primary-600 dark:text-primary-400",
    },
    {
      condition: (s) => s.completed_tasks >= 20 && s.completed_tasks < 30,
      message: {
        en: (s) => `Great job! ${s.completed_tasks} tasks completed. Every small step adds up to big results.`,
        fr: (s) => `Bon travail ! ${s.completed_tasks} tâches complétées. Chaque petit pas s'additionne pour de grands résultats.`,
      },
      icon: TrendingUp,
      color: "text-success-600 dark:text-success-400",
    },

    // Messages basés sur les jours actifs
    {
      condition: (s) => s.days_with_tasks >= 20,
      message: {
        en: (s) => `Consistency is key! You've been active ${s.days_with_tasks} days. This is how habits are built!`,
        fr: (s) => `La constance est la clé ! Vous avez été actif ${s.days_with_tasks} jours. C'est ainsi que les habitudes se construisent !`,
      },
      icon: Flame,
      color: "text-warning-600 dark:text-warning-400",
    },
    {
      condition: (s) => s.days_with_tasks >= 15 && s.days_with_tasks < 20,
      message: {
        en: (s) => `Well done! ${s.days_with_tasks} active days. You're building momentum!`,
        fr: (s) => `Bien joué ! ${s.days_with_tasks} jours actifs. Vous prenez de l'élan !`,
      },
      icon: TrendingUp,
      color: "text-success-600 dark:text-success-400",
    },

    // Message par défaut (effet cumulé)
    {
      condition: () => true,
      message: {
        en: () => `Remember: Even 20-30 minutes a day, done consistently, creates extraordinary results over time. You're building something meaningful.`,
        fr: () => `Rappelez-vous : Même 20-30 minutes par jour, faites de manière constante, créent des résultats extraordinaires avec le temps. Vous construisez quelque chose de significatif.`,
      },
      icon: Sparkles,
      color: "text-primary-600 dark:text-primary-400",
    },
  ];

  // Trouver le premier message dont la condition est vraie
  const selected = messages.find((m) => m.condition(stats, progression));

  if (!selected) {
    // Fallback (ne devrait jamais arriver)
    return {
      message: language === "fr"
        ? "Continuez vos efforts !"
        : "Keep up the great work!",
      icon: Sparkles,
      color: "text-primary-600 dark:text-primary-400",
    };
  }

  return {
    message: selected.message[language](stats, progression),
    icon: selected.icon,
    color: selected.color,
  };
};

export function MotivationalMessage({
  stats,
  progression,
}: MotivationalMessageProps) {
  const { language } = useLanguage();

  const { message, icon: Icon, color } = useMemo(
    () => generateMessage(stats, progression, language),
    [stats, progression, language]
  );

  return (
    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-white dark:bg-neutral-900 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
