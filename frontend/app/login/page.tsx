"use client";

import type React from "react";

import Link from "next/link";
import { useState } from "react";
import { useLogin } from "../../lib/auth/hooks";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  // Utiliser le hook useLogin de React Query
  // Ce hook gère automatiquement :
  // - Le loading state (isPending)
  // - Les erreurs (error)
  // - La redirection après succès
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Protection contre les double submits
    if (isPending) return;

    setErrors({});

    // Validation côté client
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Appeler la mutation React Query
    // Le hook gère automatiquement :
    // - L'appel API
    // - Le stockage du token
    // - La mise à jour du context
    // - La redirection vers /app/dashboard
    login(
      { email, password },
      {
        onError: (error: Error) => {
          // Gérer les erreurs du backend
          // Le backend peut retourner des erreurs comme :
          // - "Invalid credentials" (401)
          // - "Email and password required" (400)
          setErrors({
            email: error.message.includes("email") ? error.message : undefined,
            password:
              error.message.includes("password") ||
              error.message.includes("credentials")
                ? error.message
                : undefined,
          });
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

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-neutral-200 p-4 lg:p-8">
        {/* Header */}
        <div className="space-y-2 mb-4 lg:mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-center text-foreground">
            Welcome back
          </h1>

          <p className="text-sm text-center text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground block"
              >
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-xs text-primary-600 hover:text-primary-700 hover:underline font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <input
              id="password"
              type="password"
              placeholder="........."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-2 lg:px-4 py-1 lg:py-2 rounded-md border text-sm ${
                errors.password
                  ? "border-error-500 focus:ring-2 focus:ring-error-500 focus:border-error-500"
                  : "border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              } outline-none transition-colors text-foreground placeholder:text-neutral-400 bg-white`}
            />
            {errors.password && (
              <p className="text-xs text-error-600 mt-0.5">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full cursor-pointer text-sm bg-primary-600 hover:bg-primary-700 text-white font-medium px-2 lg:px-4 py-1 lg:py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Sign up link */}
        <div className="mt-4 lg:mt-6">
          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary-600 hover:text-primary-700 hover:underline font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
