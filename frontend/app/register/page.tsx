"use client";

import type React from "react";

import Link from "next/link";
import { useState } from "react";
import { useRegister } from "../../lib/auth/hooks";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

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

    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Appeler la mutation React Query
    // Le hook gère automatiquement :
    // - L'appel API
    // - La redirection vers /login après succès
    register(
      { username, email, password },
      {
        onError: (error: Error) => {
          // Gérer les erreurs du backend
          // Le backend peut retourner des erreurs comme :
          // - "Email already in use" (409)
          // - "Email and password required" (400)
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

      {/* Register Card */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-neutral-200 p-4 lg:p-8">
        {/* Header */}
        <div className="space-y-2 mb-4 lg:mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-center text-foreground">
            Create an account
          </h1>

          <p className="text-sm text-center text-muted-foreground">
            Enter your information to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2 lg:space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-foreground block"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-2 lg:px-4 py-1 lg:py-2 rounded-md border text-sm ${
                errors.username
                  ? "border-error-500 focus:ring-2 focus:ring-error-500 focus:border-error-500"
                  : "border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              } outline-none transition-colors text-foreground placeholder:text-neutral-400 bg-white`}
            />
            {errors.username && (
              <p className="text-xs text-error-600 mt-0.5">
                {errors.username}
              </p>
            )}
          </div>

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
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground block"
            >
              Password
            </label>

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
              <p className="text-xs text-error-600 mt-0.5">
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-foreground block"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="........."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-2 lg:px-4 py-1 lg:py-2 rounded-md border text-sm ${
                errors.confirmPassword
                  ? "border-error-500 focus:ring-2 focus:ring-error-500 focus:border-error-500"
                  : "border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              } outline-none transition-colors text-foreground placeholder:text-neutral-400 bg-white`}
            />

            {errors.confirmPassword && (
              <p className="text-xs text-error-600 mt-0.5">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full cursor-pointer text-sm bg-primary-600 hover:bg-primary-700 text-white font-medium px-2 lg:px-4 py-1 lg:py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            {isPending ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {/* Sign in link */}
        <div className="mt-4 lg:mt-6">
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
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

export default RegisterPage;
