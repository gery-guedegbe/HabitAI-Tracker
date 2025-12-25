"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Button from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-100 text-primary-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>AI-Powered Habit Tracking</span>
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 sm:mb-6 text-balance leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Track Your Habits
          <br />
          <span className="bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            With AI Intelligence
          </span>
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl text-neutral-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-balance leading-relaxed px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Write or record your day, and let AI automatically extract your tasks and habits. Track your progress with
          beautiful analytics and insights.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2">
              Start For Free
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Learn More
          </Button>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className="mt-8 sm:mt-12 md:mt-16 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 max-w-5xl mx-auto px-4 sm:px-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Image
            src="/modern-habit-tracking-dashboard-with-charts.jpg"
            alt="HabitAI Dashboard"
            width={1280}
            height={720}
            className="w-full h-auto"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
          />
        </motion.div>
      </div>
    </section>
  );
}