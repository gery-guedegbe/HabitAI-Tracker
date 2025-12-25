"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 border-b border-neutral-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <Link href="/" className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">
              H
            </div>
            <span className="font-bold text-base sm:text-lg text-foreground">
              HabitAI Tracker
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <motion.button
                className="bg-transparent text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base px-3 py-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            </Link>
            <Link href="/register">
              <motion.button
                className="bg-primary-600 text-white px-4 sm:px-6 py-2 rounded-md text-sm sm:text-base font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-neutral-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </Link>

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
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              <motion.button
                className="w-full text-left bg-transparent text-primary-600 font-medium text-base px-3 py-2 rounded-md hover:bg-primary-50"
                whileTap={{ scale: 0.98 }}
              >
                Login
              </motion.button>
            </Link>
            <Link href="/register" onClick={() => setIsMenuOpen(false)}>
              <motion.button
                className="w-full text-left bg-primary-600 text-white font-medium text-base px-3 py-2 rounded-md"
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
