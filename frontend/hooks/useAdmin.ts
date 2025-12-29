"use client";

import { useAuth } from "@/lib/auth/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook to check if user is admin
 * Redirects to dashboard if not admin
 */
export function useAdmin() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/app/dashboard");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  return {
    isAdmin: isAdmin ?? false,
    isLoading,
    user,
  };
}

