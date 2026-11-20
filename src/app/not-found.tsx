"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LandingNotFound } from "@/components/views/LandingNotFound";
import { DashboardNotFound } from "@/components/views/DashboardNotFound";

export default function NotFound() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if the missing route was under dashboard or admin domain
  const isDashboardRoute =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/admin") ||
    (typeof window !== "undefined" &&
      (window.location.pathname.startsWith("/dashboard") || window.location.pathname.startsWith("/admin")));

  if (mounted && isDashboardRoute) {
    return (
      <div className="min-h-screen bg-[#f3eee3] dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] p-4 sm:p-8 flex items-center justify-center">
        <DashboardNotFound />
      </div>
    );
  }

  return <LandingNotFound />;
}
