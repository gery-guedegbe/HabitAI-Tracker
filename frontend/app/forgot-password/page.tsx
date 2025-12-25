"use client";

import type React from "react";

import Link from "next/link";
import { useState } from "react";
import { useForgotPassword } from "../../lib/auth/hooks";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  // Utiliser le hook useForgotPassword de React Query
  const { mutate: sendResetEmail, isPending } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Protection contre les double submits
    if (isPending) return;

    setErrors({});
    setSuccessMessage("");

    // Validation côté client
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    // Appeler la mutation React Query
    sendResetEmail(
      { email },
      {
        onSuccess: () => {
          setSuccessMessage(
            "If an account exists with this email, you will receive a password reset link."
          );
          setEmail("");
        },
        onError: (error: Error) => {
          // Même si l'email n'existe pas, on affiche le même message
          // pour ne pas révéler si un email existe dans la base
          setSuccessMessage(
            "If an account exists with this email, you will receive a password reset link."
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-linear-to-br from-primary-50 to-primary-100">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
            H
          </div>
          <span className="font-bold text-xl text-foreground">
            HabitAI Tracker
          </span>
        </Link>
      </div>

      {/* Forgot Password Card */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-neutral-200 p-4 lg:p-8">
        {/* Header */}
        <div className="space-y-2 mb-4 lg:mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-center text-foreground">
            Forgot Password?
          </h1>

          <p className="text-sm text-center text-muted-foreground">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-md bg-success-50 border border-success-200 text-success-700 text-sm">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2 lg:space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground block"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-2 lg:px-4 py-1 lg:py-2 rounded-md border text-sm ${
                errors.email
                  ? "border-error-500 focus:ring-2 focus:ring-error-500 focus:border-error-500"
                  : "border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              } outline-none transition-colors text-foreground placeholder:text-neutral-400 bg-white`}
            />
            {errors.email && (
              <p className="text-xs text-error-600 mt-0.5">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full cursor-pointer text-sm bg-primary-600 hover:bg-primary-700 text-white font-medium px-2 lg:px-4 py-1 lg:py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to login link */}
        <div className="mt-4 lg:mt-6">
          <p className="text-sm text-center text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 hover:underline font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

