"use client";

import type React from "react";

import { useState } from "react";
import { useChangePassword } from "../../lib/auth/hooks";
import { useAuth } from "../../lib/auth/context";
import Link from "next/link";

const SettingsPage = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState("");

  // Utiliser le hook useChangePassword de React Query
  const { mutate: changePassword, isPending } = useChangePassword();

  // Rediriger vers login si non authentifié
  if (!isLoading && !isAuthenticated) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <div className="text-lg font-medium text-foreground">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Protection contre les double submits
    if (isPending) return;

    setErrors({});
    setSuccessMessage("");

    // Validation côté client
    const newErrors: {
      oldPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!oldPassword) {
      newErrors.oldPassword = "Current password is required";
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
    changePassword(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          // Réinitialiser le formulaire
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setErrors({});
          setSuccessMessage("Password changed successfully!");

          // Effacer le message de succès après 5 secondes
          setTimeout(() => {
            setSuccessMessage("");
          }, 5000);
        },
        onError: (error: Error) => {
          // Gérer les erreurs du backend
          // Le backend peut retourner des erreurs comme :
          // - "Incorrect old password" (401)
          // - "Missing fields" (400)
          if (
            error.message.toLowerCase().includes("old") ||
            error.message.toLowerCase().includes("incorrect")
          ) {
            setErrors({ oldPassword: error.message });
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
      {/* Header */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/app/dashboard"
          className="text-primary-600 hover:text-primary-700 font-medium text-sm mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manage your account settings
        </p>
      </div>

      {/* Settings Card */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-neutral-200 p-4 lg:p-8">
        {/* User Info */}
        <div className="mb-6 pb-6 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Account Information
          </h2>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Username:</span>{" "}
              <span className="font-medium">{user?.username}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Email:</span>{" "}
              <span className="font-medium">{user?.email}</span>
            </p>
          </div>
        </div>

        {/* Change Password Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Change Password
          </h2>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-md bg-success-50 border border-success-200 text-success-700 text-sm">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2 lg:space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="oldPassword"
                className="text-sm font-medium text-foreground block"
              >
                Current Password
              </label>

              <input
                id="oldPassword"
                type="password"
                placeholder="Enter your current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={`w-full px-2 lg:px-4 py-1 lg:py-2 rounded-md border text-sm ${
                  errors.oldPassword
                    ? "border-error-500 focus:ring-2 focus:ring-error-500 focus:border-error-500"
                    : "border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                } outline-none transition-colors text-foreground placeholder:text-neutral-400 bg-white`}
              />
              {errors.oldPassword && (
                <p className="text-xs text-error-600 mt-0.5">
                  {errors.oldPassword}
                </p>
              )}
            </div>

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
              disabled={isPending}
              className="w-full cursor-pointer text-sm bg-primary-600 hover:bg-primary-700 text-white font-medium px-2 lg:px-4 py-1 lg:py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.98] mt-4"
            >
              {isPending ? "Changing password..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

