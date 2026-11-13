"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChamber } from "@/context/ChamberContext";
import { LandingPage } from "@/components/LandingPage";
import { Modals } from "@/components/Modals";
import { ToastContainer } from "@/components/ToastContainer";
import Link from "next/link";
import { ArrowRight, Scale, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const { currentUser, loading } = useChamber();
  const router = useRouter();

  // If user is already authenticated and visits home page, provide seamless continuation
  useEffect(() => {
    // We keep home page accessible, but if user explicitly logs in, routing happens via login()
  }, [currentUser, router]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-[#0f172a] dark:text-[#f8fafc] font-sans selection:bg-blue-500/20 selection:text-blue-900 dark:selection:text-blue-200">
      {/* Top Banner if already authenticated */}
      {currentUser && !loading && (
        <div className="bg-gradient-to-r from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] text-white px-4 py-2.5 text-xs flex items-center justify-between sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2 max-w-2xl truncate">
            {currentUser.role === "admin" ? (
              <ShieldCheck className="w-4 h-4 text-blue-200 flex-shrink-0" />
            ) : (
              <Scale className="w-4 h-4 text-blue-200 flex-shrink-0" />
            )}
            <span className="truncate">
              Signed in as <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
            </span>
          </div>

          <Link
            href={currentUser.role === "admin" ? "/admin" : "/dashboard"}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold transition-colors flex-shrink-0"
          >
            <span>Open {currentUser.role === "admin" ? "Admin Console" : "Chamber Dashboard"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Main Home Landing Page */}
      <LandingPage />

      {/* Global Modals & Notifications */}
      <Modals />
      <ToastContainer />
    </div>
  );
}
