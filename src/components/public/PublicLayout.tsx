"use client";

import React from "react";
import { PublicNavbar } from "./PublicNavbar";
import { PublicFooter } from "./PublicFooter";
import { BroadcastBanner } from "@/components/BroadcastBanner";
import { AuthModals } from "@/components/AuthModals";
import { ToastContainer } from "@/components/ToastContainer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

interface PublicLayoutProps {
  children: React.ReactNode;
  hideNavbar?: boolean;
}

export function PublicLayout({ children, hideNavbar = false }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f3eee3] dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] font-sans selection:bg-[#111111] selection:text-[#f3eee3] dark:selection:bg-[#f3eee3] dark:selection:text-[#111111] flex flex-col justify-between">
      <BroadcastBanner />
      {!hideNavbar && <PublicNavbar />}
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
      <ScrollToTop />
      <AuthModals />
      <ToastContainer />
    </div>
  );
}
