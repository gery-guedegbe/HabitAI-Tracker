"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { AppLayout } from "@/layouts/layout";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Si on est sur une route admin, ne pas appliquer le layout normal
  // Le layout admin sera appliqué par /app/app/admin/layout.tsx
  if (pathname?.startsWith("/app/admin")) {
    return <>{children}</>;
  }

  return <AppLayout>{children}</AppLayout>;
}
