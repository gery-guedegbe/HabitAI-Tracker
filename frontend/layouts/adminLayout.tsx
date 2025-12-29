import type React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl w-full mx-auto p-2 md:p-4 lg:p-4">
          {children}
        </div>
      </main>
    </div>
  );
}

