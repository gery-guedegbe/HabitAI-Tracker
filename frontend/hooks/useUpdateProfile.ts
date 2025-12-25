"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, type UpdateProfileData } from "@/lib/api/user";
import { useAuth } from "@/lib/auth/context";

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user, refreshUser } = useAuth();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      return updateProfile(user.id, data);
    },
    onSuccess: () => {
      // Refresh user data
      refreshUser();
      // Invalidate queries that depend on user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      console.error("Error updating profile:", error);
    },
  });
}

