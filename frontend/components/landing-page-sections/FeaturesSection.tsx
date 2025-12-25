"use client";

import { BarChart3, Clock, Mic, Shield, Smartphone, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Extraction",
    description: "Simply describe your day and let AI automatically identify and extract tasks and habits for you.",
    color: "primary",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description: "Beautiful charts, heatmaps, and statistics to help you understand your progress at a glance.",
    color: "secondary",
  },
  {
    icon: Mic,
    title: "Audio & Text",
    description: "Record voice notes or write text entries. Both work seamlessly with our AI extraction.",
    color: "success",
  },
  {
    icon: Clock,
    title: "Real-Time Tracking",
    description: "Track your habits in real-time with instant updates and progress notifications.",
    color: "warning",
  },
  {
    icon: Shield,
    title: "100% Private & Secure",
    description: "Your data is encrypted and secure. We prioritize your privacy above everything else.",
    color: "error",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Beautifully designed for mobile, tablet, and desktop. Track your habits anywhere, anytime.",
    color: "primary",
  },
];

const colorClasses = {
  primary: "bg-primary-100 text-primary-600",
  secondary: "bg-secondary-100 text-secondary-600",
  success: "bg-green-100 text-green-600",
  warning: "bg-yellow-100 text-yellow-600",
  error: "bg-red-100 text-red-600",
};

export default function FeaturesSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 px-4">
            Everything You Need to Build Better Habits
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto px-4">
            Powerful features designed to help you track, analyze, and improve your daily habits
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="p-6 sm:p-8 rounded-xl border border-neutral-200 bg-white hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colorClasses[feature.color as keyof typeof colorClasses]} flex items-center justify-center mb-4`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
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