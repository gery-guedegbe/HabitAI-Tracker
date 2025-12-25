"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { ConfirmDialog, type ConfirmDialogOptions } from "@/components/ui/confirm-dialog";

interface ConfirmDialogContextType {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(
  null
);

export function ConfirmDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = useCallback(
    (dialogOptions: ConfirmDialogOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setOptions({
          ...dialogOptions,
          onConfirm: async () => {
            await dialogOptions.onConfirm();
            resolve(true);
            setIsOpen(false);
          },
          onCancel: () => {
            if (dialogOptions.onCancel) {
              dialogOptions.onCancel();
            }
            resolve(false);
            setIsOpen(false);
          },
        });
        setIsOpen(true);
        setResolvePromise(() => resolve);
      });
    },
    []
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
    }
    // Nettoyer les options après un délai pour permettre l'animation
    setTimeout(() => {
      setOptions(null);
    }, 200);
  }, [resolvePromise]);

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog isOpen={isOpen} onClose={handleClose} options={options} />
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirmDialog() {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error(
      "useConfirmDialog must be used within a ConfirmDialogProvider"
    );
  }
  return context;
}

