"use client";

import React from "react";
import { PublicNavbar } from "./PublicNavbar";
import { PublicFooter } from "./PublicFooter";
import { AuthModals } from "@/components/AuthModals";
import { ToastContainer } from "@/components/ToastContainer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-[#3df2e0] dark:bg-[#0b0f14] text-[#0b0f14] dark:text-[#3df2e0] font-sans selection:bg-[#0b0f14] selection:text-[#3df2e0] dark:selection:bg-[#3df2e0] dark:selection:text-[#0b0f14] flex flex-col justify-between">
      <PublicNavbar />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
      <AuthModals />
      <ToastContainer />
    </div>
  );
}
