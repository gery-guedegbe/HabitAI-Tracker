"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listUsers, deactivateUser, deleteUser } from "@/lib/api/user";
import { getUserActivityStats } from "@/lib/api/admin";
import {
  Users,
  Search,
  MoreVertical,
  Trash2,
  UserX,
  Mail,
  Calendar,
  BookOpen,
  ListChecks,
  CheckCircle,
} from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

export function AdminUserManagement() {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);
  const confirmDialog = useConfirmDialog();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => listUsers(100, 0),
  });

  const { data: activityData } = useQuery({
    queryKey: ["admin", "userActivity"],
    queryFn: () => getUserActivityStats(100),
  });

  // Merge users with activity data
  const users = usersData?.data.map((user) => {
    const activity = activityData?.data.find((a) => String(a.id) === String(user.id));
    return {
      ...user,
      journalCount: activity?.journalCount ?? 0,
      taskCount: activity?.taskCount ?? 0,
      completedTasks: activity?.completedTasks ?? 0,
    };
  });

  const filteredUsers = users?.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deactivateMutation = useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "userActivity"] });
    },
  });

  const handleDeactivate = async (userId: string, username: string) => {
    const confirmed = await confirmDialog.confirm({
      title: t("deactivateUser"),
      message: t("deactivateUserConfirmation").replace("{username}", username),
      variant: "danger",
      confirmText: t("deactivate"),
      cancelText: t("cancel"),
      onConfirm: async () => {
        await deactivateMutation.mutateAsync(userId);
      },
    });
  };

  const handleDelete = async (userId: string, username: string) => {
    const confirmed = await confirmDialog.confirm({
      title: t("deleteUser"),
      message: t("deleteUserConfirmation").replace("{username}", username),
      variant: "danger",
      confirmText: t("delete"),
      cancelText: t("cancel"),
      onConfirm: async () => {
        await deleteMutation.mutateAsync(userId);
      },
    });
  };

  if (usersLoading) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4" />
          <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-neutral-200 dark:bg-neutral-700 rounded"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t("userManagement")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("totalUsers")}: {users?.length ?? 0}
          </p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("searchUsers")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                {t("user")}
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                {t("email")}
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                {t("joined")}
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                {t("activity")}
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.map((user) => (
              <tr
                key={user.id}
                className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                      {user.username?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {user.username ?? t("unknown")}
                      </p>
                      {user.role === "admin" && (
                        <span className="text-xs text-primary-600 dark:text-primary-400">
                          {t("admin")}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {user.journalCount ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ListChecks className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {user.taskCount ?? 0}
                      </span>
                    </div>
                    {user.completedTasks > 0 && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-green-600 dark:text-green-400">
                          {user.completedTasks}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    {user.role !== "admin" && (
                      <>
                        <button
                          onClick={() =>
                            handleDeactivate(String(user.id), user.username ?? "")
                          }
                          disabled={
                            deactivateMutation.isPending ||
                            deleteMutation.isPending
                          }
                          className="p-2 rounded-lg hover:bg-error-50 dark:hover:bg-error-900/20 text-error-600 dark:text-error-400 transition-colors"
                          title={t("deactivateUser")}
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(String(user.id), user.username ?? "")
                          }
                          disabled={
                            deactivateMutation.isPending ||
                            deleteMutation.isPending
                          }
                          className="p-2 rounded-lg hover:bg-error-50 dark:hover:bg-error-900/20 text-error-600 dark:text-error-400 transition-colors"
                          title={t("deleteUser")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t("noUsersFound")}
          </div>
        )}
      </div>
    </div>
  );
}

