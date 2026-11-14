"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChamber } from "@/context/ChamberContext";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { Modals } from "@/components/Modals";
import { ToastContainer } from "@/components/ToastContainer";
import { Scale } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, loading } = useChamber();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push("/");
      } else if (currentUser.role === "admin") {
        router.push("/admin");
      }
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#3df2e0] dark:bg-[#0b0f14] flex flex-col items-center justify-center text-[#0b0f14] dark:text-[#3df2e0]">
        <div className="w-12 h-12 rounded-2xl bg-[#0b0f14] border border-[#3df2e0]/60 flex items-center justify-center shadow-lg">
          <Scale className="w-6 h-6 text-[#3df2e0]" />
        </div>
        <p className="mt-4 text-xs font-cinzel font-bold tracking-widest uppercase text-[#0b0f14] dark:text-[#3df2e0]">
          UPDATED LAW DIARY
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#3df2e0] dark:bg-[#0b0f14] text-[#0b0f14] dark:text-[#3df2e0] font-sans selection:bg-[#0b0f14] selection:text-[#3df2e0] dark:selection:bg-[#3df2e0] dark:selection:text-[#0b0f14]">
      {/* Chamber Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-5 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <Modals />
      <ToastContainer />
    </div>
  );
}
