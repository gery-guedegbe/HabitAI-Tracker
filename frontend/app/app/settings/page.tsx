"use client";

import { useState } from "react";
import { User, Settings as SettingsIcon } from "lucide-react";
import { getTranslation } from "@/lib/i18n/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { PreferencesSettings } from "@/components/settings/PreferencesSettings";

type Tab = "account" | "preferences";

export default function SettingsPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("account");

  const t = (key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getTranslation(key as any, language);
  };

  const tabs: Array<{ id: Tab; label: string; icon: typeof User }> = [
    { id: "account", label: t("account"), icon: User },
    { id: "preferences", label: t("preferences"), icon: SettingsIcon },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {t("settings")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t("manageAccountAndPreferences")}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium border-b-2 transition-colors duration-200 whitespace-nowrap
                  ${
                    isActive
                      ? "border-primary-500 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-neutral-300 dark:hover:border-neutral-700"
                  }
                `}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6 sm:mt-8">
        {activeTab === "account" && <AccountSettings />}
        {activeTab === "preferences" && <PreferencesSettings />}
      </div>
    </div>
  );
}
