"use client";

import { motion } from "motion/react";

export default function Footer() {
  return (
    <footer className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-neutral-900 text-neutral-400">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">
              H
            </div>
            <span className="font-bold text-base sm:text-lg text-white">HabitAI Tracker</span>
          </motion.div>

          <p className="text-xs sm:text-sm text-center sm:text-left">
            © {new Date().getFullYear()} HabitAI Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}