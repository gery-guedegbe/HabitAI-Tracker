"use client";

import { motion } from "motion/react";
import { PenTool, Sparkles, TrendingUp } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: PenTool,
    title: "Write or Record",
    description: "Describe your day in text or record a voice note about your activities",
    color: "bg-primary-600",
  },
  {
    number: 2,
    icon: Sparkles,
    title: "AI Extracts Tasks",
    description: "Our AI automatically identifies tasks, habits, and activities from your entry",
    color: "bg-secondary-600",
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "Track & Improve",
    description: "Monitor your progress with beautiful analytics and build lasting habits",
    color: "bg-green-600",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 px-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto px-4">
            Three simple steps to start building better habits
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <motion.div
                  className="relative mx-auto mb-4 sm:mb-6"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full ${step.color} text-white flex items-center justify-center mx-auto shadow-lg`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white border-2 border-neutral-200 flex items-center justify-center text-xs sm:text-sm md:text-base font-bold text-neutral-700"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  >
                    {step.number}
                  </motion.div>
                </motion.div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-2 sm:mb-3">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-sm mx-auto px-4">
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