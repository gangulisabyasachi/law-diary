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
    <div className="min-h-screen bg-[#f3eee3] dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] font-sans selection:bg-[#111111] selection:text-[#f3eee3] dark:selection:bg-[#f3eee3] dark:selection:text-[#111111] flex flex-col justify-between">
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
