"use client";

import type React from "react";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "../../lib/auth/hooks";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    token?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState("");

  // Utiliser le hook useResetPassword de React Query
  const { mutate: resetPassword, isPending } = useResetPassword();

  // Récupérer le token depuis l'URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setErrors({ token: "Reset token is missing from the URL" });
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Protection contre les double submits
    if (isPending) return;

    setErrors({});
    setSuccessMessage("");

    // Validation côté client
    const newErrors: {
      token?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!token) {
      newErrors.token = "Reset token is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Appeler la mutation React Query
    resetPassword(
      { token, newPassword },
      {
        onSuccess: () => {
          setSuccessMessage(
            "Password reset successfully! Redirecting to login..."
          );
        },
        onError: (error: Error) => {
          // Gérer les erreurs du backend
          // Le backend peut retourner des erreurs comme :
          // - "Token expired or invalid" (400)
          // - "Missing fields" (400)
          if (
            error.message.toLowerCase().includes("token") ||
            error.message.toLowerCase().includes("expired") ||
            error.message.toLowerCase().includes("invalid")
          ) {
            setErrors({ token: error.message });
          } else if (error.message.toLowerCase().includes("missing")) {
            setErrors({ newPassword: error.message });
          } else {
            setErrors({ newPassword: error.message });
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

      {/* Reset Password Card */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-neutral-200 p-4 lg:p-8">
        {/* Header */}
        <div className="space-y-2 mb-4 lg:mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-center text-foreground">
            Reset Password
          </h1>

          <p className="text-sm text-center text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-md bg-success-50 border border-success-200 text-success-700 text-sm">
            {successMessage}
          </div>
        )}

        {/* Error Message for Token */}
        {errors.token && (
          <div className="mb-4 p-3 rounded-md bg-error-50 border border-error-200 text-error-700 text-sm">
            {errors.token}
            <div className="mt-2">
              <Link
                href="/forgot-password"
                className="text-error-600 hover:text-error-700 hover:underline font-medium text-sm"
              >
                Request a new reset link
              </Link>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2 lg:space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="newPassword"
              className="text-sm font-medium text-foreground block"
            >
              New Password
            </label>

            <input
              id="newPassword"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-2 lg:px-4 py-1 lg:py-2 rounded-md border text-sm ${
                errors.newPassword
                  ? "border-error-500 focus:ring-2 focus:ring-error-500 focus:border-error-500"
                  : "border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              } outline-none transition-colors text-foreground placeholder:text-neutral-400 bg-white`}
            />
            {errors.newPassword && (
              <p className="text-xs text-error-600 mt-0.5">
                {errors.newPassword}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-foreground block"
            >
              Confirm New Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
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
            disabled={isPending || !token}
            className="w-full cursor-pointer text-sm bg-primary-600 hover:bg-primary-700 text-white font-medium px-2 lg:px-4 py-1 lg:py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            {isPending ? "Resetting password..." : "Reset Password"}
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
}

const ResetPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-50 to-primary-100">
          <div className="text-center">
            <div className="text-lg font-medium text-foreground">
              Loading...
            </div>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;

