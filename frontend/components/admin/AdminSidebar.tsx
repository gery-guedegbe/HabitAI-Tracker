"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/lib/auth/context";
import { getTranslation } from "@/lib/i18n/i18n";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { LanguageSwitcherCompact } from "../langage-components/LanguageSwitcherCompact";
import { ThemeSwitcherCompact } from "../theme-components/ThemeSwitcherCompact";

const getAdminNavigation = (t: (key: string) => string) => [
  { name: t("adminDashboard"), href: "/app/admin", icon: LayoutDashboard },
  { name: t("userManagement"), href: "/app/admin/users", icon: Users },
  { name: t("statistics"), href: "/app/admin/statistics", icon: BarChart3 },
  { name: t("adminSettings"), href: "/app/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language } = useLanguage();
  const { user, logout } = useAuth();
  const confirmDialog = useConfirmDialog();

  const t = (key: Parameters<typeof getTranslation>[0]) =>
    getTranslation(key, language);

  const navigation = getAdminNavigation(t as (key: string) => string);

  const handleLogout = async () => {
    const confirmed = await confirmDialog.confirm({
      title: t("logoutConfirmation"),
      message: t("logoutConfirmationMessage"),
      variant: "danger",
      confirmText: t("logout"),
      cancelText: t("cancel"),
      onConfirm: async () => {
        logout();
        router.push("/login");
      },
    });
  };

  // Initiales de l'utilisateur
  const getUserInitials = () => {
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "A";
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="fixed top-3 left-3 z-50 md:hidden p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all duration-200"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
        ) : (
          <Menu className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
        )}
      </button>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/50 dark:bg-black/70 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-40 w-64 sm:w-72 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:sticky md:top-0 md:h-screen
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo - Admin */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-neutral-200 dark:border-neutral-800">
            <Link
              href="/app/admin"
              className="flex items-center gap-2 sm:gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg text-foreground leading-tight">
                  Admin Panel
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                  HabitAI Tracker
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation - Admin */}
          <nav className="flex-1 px-2 sm:px-3 py-3 sm:py-4 space-y-0.5 sm:space-y-1 overflow-y-auto scrollbar-hide">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium
                    transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm"
                        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-foreground"
                    }
                  `}
                >
                  <item.icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                      isActive
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-neutral-500 dark:text-neutral-400 group-hover:text-foreground"
                    }`}
                  />
                  <span className="flex-1 truncate">{item.name}</span>
                  {isActive && (
                    <div className="w-1 h-4 sm:h-5 rounded-full bg-primary-600 dark:bg-primary-400 shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section - Compact et moderne */}
          <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            {/* Switchers compacts */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {t("settings")}
              </span>

              <div className="flex items-center gap-1">
                <LanguageSwitcherCompact />
                <ThemeSwitcherCompact />
              </div>
            </div>

            {/* User info - Compact */}
            {user && (
              <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-sm shrink-0">
                  {getUserInitials()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                    {user.username || "Admin"}
                  </p>

                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* Logout button - Compact */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 sm:gap-2.5 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-error-600 dark:hover:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors duration-200 group"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="flex-1 text-left">{t("logout")}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

