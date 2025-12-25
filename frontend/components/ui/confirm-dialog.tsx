"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  options: ConfirmDialogOptions | null;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  options,
}: ConfirmDialogProps) {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  if (!isOpen || !options) return null;

  const {
    title,
    message,
    confirmText,
    cancelText,
    variant = "default",
    onConfirm,
    onCancel,
  } = options;

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  // Fermer avec Escape
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Empêcher le scroll du body quand le modal est ouvert
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isDanger = variant === "danger";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 backdrop-blur-sm transition-opacity"
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <div
          className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-xl w-full max-w-md transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-start gap-3 flex-1">
              {isDanger && (
                <div className="p-2 rounded-lg bg-error-50 dark:bg-error-900/20 shrink-0">
                  <AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3
                  id="confirm-dialog-title"
                  className="text-lg font-semibold text-foreground"
                >
                  {title}
                </h3>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0 ml-2"
              aria-label={t("close")}
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            <p
              id="confirm-dialog-description"
              className="text-sm sm:text-base text-muted-foreground leading-relaxed"
            >
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-foreground bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200"
            >
              {cancelText || t("cancel")}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md ${
                isDanger
                  ? "bg-error-600 hover:bg-error-700"
                  : "bg-primary-600 hover:bg-primary-700"
              }`}
            >
              {confirmText || t("confirm")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

