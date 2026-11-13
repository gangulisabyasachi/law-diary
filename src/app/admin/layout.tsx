"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChamber } from "@/context/ChamberContext";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { Modals } from "@/components/Modals";
import { ToastContainer } from "@/components/ToastContainer";
import { ShieldCheck } from "lucide-react";

export default function AdminLayout({
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
      } else if (currentUser.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] flex flex-col items-center justify-center text-[#0f172a] dark:text-[#f8fafc]">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#1e3a8a] border border-blue-500/40 flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-6 h-6 text-blue-400" />
        </div>
        <p className="mt-4 text-xs font-cinzel font-bold tracking-widest uppercase text-[#1e3a8a] dark:text-[#60a5fa]">
          CounselBook Platform Registrar Console
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#0b0f19] text-[#0f172a] dark:text-[#f8fafc] font-sans selection:bg-blue-500/20 selection:text-blue-900 dark:selection:text-blue-200 transition-colors duration-200">
      {/* Admin Sidebar */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-5 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Modals & Toasts */}
      <Modals />
      <ToastContainer />
    </div>
  );
}

