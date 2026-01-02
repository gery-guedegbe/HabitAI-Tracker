"use client";

import type React from "react";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRegister } from "../../lib/auth/hooks";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  // Utiliser le hook useRegister de React Query
  const { mutate: register, isPending } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Protection contre les double submits
    if (isPending) return;

    setErrors({});

    // Validation côté client
    const newErrors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!username)
      newErrors.username = t("usernameRequired") || "Username is required";
    if (!email) newErrors.email = t("emailRequired") || "Email is required";
    if (!password)
      newErrors.password = t("passwordRequired") || "Password is required";
    else if (password.length < 8)
      newErrors.password =
        t("passwordMinLength") || "Password must be at least 8 characters";
    if (!confirmPassword)
      newErrors.confirmPassword =
        t("confirmPasswordRequired") || "Please confirm your password";
    else if (password !== confirmPassword)
      newErrors.confirmPassword =
        t("passwordsDoNotMatch") || "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Appeler la mutation React Query
    register(
      { username, email, password },
      {
        onError: (error: Error) => {
          // Gérer les erreurs du backend
          if (error.message.toLowerCase().includes("email")) {
            setErrors({ email: error.message });
          } else if (error.message.toLowerCase().includes("username")) {
            setErrors({ username: error.message });
          } else {
            // Erreur générale
            setErrors({ email: error.message });
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-primary-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 transition-colors duration-300">
      {/* Logo */}
      <div className="flex justify-center mb-6 sm:mb-8 md:mb-10">
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shadow-sm">
            H
          </div>
          <span className="font-bold text-lg sm:text-xl md:text-2xl text-foreground">
            HabitAI Tracker
          </span>
        </Link>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-4 sm:p-6 md:p-8 transition-colors duration-300">
        {/* Header */}
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-foreground">
            {t("createAccount") || "Create an account"}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-center text-muted-foreground">
            {t("registerSubtitle") || "Enter your information to get started"}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-3 sm:space-y-4 md:space-y-5"
        >
          <div className="space-y-1.5 sm:space-y-2">
            <label
              htmlFor="username"
              className="text-xs sm:text-sm font-medium text-foreground block"
            >
              {t("username") || "Username"}
            </label>

            <input
              id="username"
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-3 sm:px-2.5 py-2 sm:py-1.5 md:py-3 rounded-lg border text-sm ${
                errors.username
                  ? "border-red-500 dark:border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  : "border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
              } outline-none transition-colors text-foreground placeholder:text-neutral-400 dark:placeholder:text-neutral-500 bg-white dark:bg-neutral-900`}
            />
            {errors.username && (
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.username}
              </p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label
              htmlFor="email"
              className="text-xs sm:text-sm font-medium text-foreground block"
            >
              {t("email") || "Email"}
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 sm:px-2.5 py-2 sm:py-1.5 md:py-3 rounded-lg border text-sm ${
                errors.email
                  ? "border-red-500 dark:border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  : "border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
              } outline-none transition-colors text-foreground placeholder:text-neutral-400 dark:placeholder:text-neutral-500 bg-white dark:bg-neutral-900`}
            />

            {errors.email && (
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label
              htmlFor="password"
              className="text-xs sm:text-sm font-medium text-foreground block"
            >
              {t("password") || "Password"}
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="........."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 sm:px-2.5 py-2 sm:py-1.5 md:py-3 pr-10 rounded-lg border text-sm ${
                  errors.password
                    ? "border-red-500 dark:border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    : "border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
                } outline-none transition-colors text-foreground placeholder:text-neutral-400 dark:placeholder:text-neutral-500 bg-white dark:bg-neutral-900`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-xs sm:text-sm font-medium text-foreground block"
            >
              {t("confirmPassword") || "Confirm Password"}
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="........."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 sm:px-2.5 py-2 sm:py-1.5 md:py-3 pr-10 rounded-lg border text-sm ${
                  errors.confirmPassword
                    ? "border-red-500 dark:border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    : "border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
                } outline-none transition-colors text-foreground placeholder:text-neutral-400 dark:placeholder:text-neutral-500 bg-white dark:bg-neutral-900`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors focus:outline-none"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full cursor-pointer text-sm sm:text-base bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            {isPending
              ? t("creatingAccount") || "Creating account..."
              : t("signUp") || "Sign up"}
          </button>
        </form>

        {/* Sign in link */}
        <div className="mt-4 sm:mt-6 md:mt-8">
          <p className="text-xs sm:text-sm md:text-base text-center text-muted-foreground">
            {t("alreadyHaveAccount") || "Already have an account?"}{" "}
            <Link
              href="/login"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline font-medium transition-colors"
            >
              {t("signIn") || "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
