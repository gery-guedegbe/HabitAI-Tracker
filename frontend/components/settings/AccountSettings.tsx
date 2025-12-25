"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/lib/auth/context";
import { useChangePassword } from "@/lib/auth/hooks";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";

export function AccountSettings() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const changePasswordMutation = useChangePassword();
  const updateProfileMutation = useUpdateProfile();

  const t = (key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getTranslation(key as any, language);
  };

  // Profile state
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveProfile = async () => {
    setProfileError(null);
    setProfileSuccess(false);

    if (!username.trim()) {
      setProfileError(t("usernameRequired"));
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setProfileError(t("emailInvalid"));
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        username: username.trim(),
        email: email.trim(),
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (error) {
      setProfileError(
        error instanceof Error ? error.message : t("errorUpdatingProfile")
      );
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t("allFieldsRequired"));
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(t("passwordTooShort"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t("passwordsDoNotMatch"));
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : t("errorChangingPassword")
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
          {t("profileInformation")}
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-foreground"
            >
              {t("username")}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={updateProfileMutation.isPending}
              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              placeholder={t("enterUsername")}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={updateProfileMutation.isPending}
              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              placeholder={t("enterEmail")}
            />
          </div>

          {profileError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
              <AlertCircle className="w-4 h-4 text-error-600 dark:text-error-400 shrink-0" />
              <p className="text-sm text-error-600 dark:text-error-400">
                {profileError}
              </p>
            </div>
          )}

          {profileSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
              <CheckCircle className="w-4 h-4 text-success-600 dark:text-success-400 shrink-0" />
              <p className="text-sm text-success-600 dark:text-success-400">
                {t("profileUpdatedSuccessfully")}
              </p>
            </div>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={updateProfileMutation.isPending}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md text-sm sm:text-base"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t("saving")}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{t("saveChanges")}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
          {t("changePassword")}
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="current-password"
              className="text-sm font-medium text-foreground"
            >
              {t("currentPassword")}
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={changePasswordMutation.isPending}
              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              placeholder={t("enterCurrentPassword")}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="new-password"
              className="text-sm font-medium text-foreground"
            >
              {t("newPassword")}
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={changePasswordMutation.isPending}
              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              placeholder={t("enterNewPassword")}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="text-sm font-medium text-foreground"
            >
              {t("confirmNewPassword")}
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={changePasswordMutation.isPending}
              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              placeholder={t("confirmNewPassword")}
            />
          </div>

          {passwordError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
              <AlertCircle className="w-4 h-4 text-error-600 dark:text-error-400 shrink-0" />
              <p className="text-sm text-error-600 dark:text-error-400">
                {passwordError}
              </p>
            </div>
          )}

          {passwordSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
              <CheckCircle className="w-4 h-4 text-success-600 dark:text-success-400 shrink-0" />
              <p className="text-sm text-success-600 dark:text-success-400">
                {t("passwordUpdatedSuccessfully")}
              </p>
            </div>
          )}

          <button
            onClick={handleChangePassword}
            disabled={changePasswordMutation.isPending}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md text-sm sm:text-base"
          >
            {changePasswordMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t("updating")}</span>
              </>
            ) : (
              <span>{t("updatePassword")}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
