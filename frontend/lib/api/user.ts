/**
 * API functions for user profile management
 */

import api from "./client";
import { User } from "./auth";

export interface UpdateProfileData {
  username?: string;
  email?: string;
}

export interface UpdateProfileResponse {
  user: User;
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string | number,
  data: UpdateProfileData
): Promise<UpdateProfileResponse> {
  const response = await api.patch<UpdateProfileResponse>(
    `/api/users/${userId}`,
    data
  );
  return response;
}

