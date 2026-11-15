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
      <div className="min-h-screen bg-[#f3eee3] dark:bg-[#111111] flex flex-col items-center justify-center text-[#111111] dark:text-[#f3eee3]">
        <div className="w-12 h-12 rounded-2xl bg-[#111111] border border-[#f3eee3]/60 flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-6 h-6 text-[#f3eee3]" />
        </div>
        <p className="mt-4 text-xs font-cinzel font-bold tracking-widest uppercase text-[#111111] dark:text-[#f3eee3]">
          LEXCHRON
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f3eee3] dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] font-sans selection:bg-[#111111] selection:text-[#f3eee3] dark:selection:bg-[#f3eee3] dark:selection:text-[#111111]">
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
