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

export interface ListUsersResponse {
  data: User[];
}

/**
 * List all users (admin only)
 */
export async function listUsers(
  limit?: number,
  offset?: number
): Promise<ListUsersResponse> {
  const params: { limit?: number; offset?: number } = {};
  if (limit !== undefined) params.limit = limit;
  if (offset !== undefined) params.offset = offset;
  const response = await api.get<ListUsersResponse>("/api/users", { params });
  return response;
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

/**
 * Deactivate a user (admin only)
 */
export async function deactivateUser(userId: string | number): Promise<{ ok: boolean }> {
  const response = await api.post<{ ok: boolean }>(
    `/api/users/${userId}/deactivate`
  );
  return response;
}

/**
 * Delete a user (admin only)
 */
export async function deleteUser(userId: string | number): Promise<{ ok: boolean }> {
  const response = await api.delete<{ ok: boolean }>(
    `/api/users/${userId}`
  );
  return response;
}

