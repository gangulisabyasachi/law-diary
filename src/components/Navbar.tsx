"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Command,
  LogOut,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";
import { CommandPalette } from "./CommandPalette";
import { AnimatedThemeToggle } from "@/components/ui/animated-theme-toggle";

export function Navbar() {
  const {
    currentUser,
    state,
    theme,
    toggleTheme,
    logout,
  } = useChamber();

  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const pendingCount = state?.approvals?.length || 0;

  // Determine Roman Numeral & Title from Pathname
  const getPageMeta = () => {
    if (pathname.endsWith("/cases")) {
      return { roman: "II", title: "Case Diary (Matters)", subtitle: "Active pleadings, vakalatnamas & judicial records" };
    }
    if (pathname.includes("/cases/")) {
      return { roman: "III", title: "Matter Dossier & Case Details", subtitle: "Full court records, order sheets & stage history" };
    }
    if (pathname.endsWith("/calendar")) {
      return { roman: "IV", title: "Judicial Hearing Calendar", subtitle: "Cause list schedules, court rooms & statutory dates" };
    }
    if (pathname.endsWith("/clients")) {
      return { roman: "V", title: "Litigant Client Register", subtitle: "Retainers, fee structures & corporate party records" };
    }
    if (pathname.endsWith("/associates")) {
      return { roman: "VI", title: "Chamber Associate Roster", subtitle: "Assigned drafting duties, hearings & research tasks" };
    }
    if (pathname.endsWith("/approvals")) {
      return { roman: "VII", title: "Senior Advocate Verification Desk", subtitle: "Cause list entries, fee notes & filings awaiting sign-off" };
    }
    if (pathname.endsWith("/contacts")) {
      return { roman: "IV", title: "Briefed Legal Counsel", subtitle: "Direct hotline to Senior Advocate & chamber desk" };
    }
    if (pathname.endsWith("/users") || pathname === "/admin") {
      return { roman: "VIII", title: "Chamber Administration", subtitle: "Advocate credentials, user roles & database control" };
    }
    return { roman: "I", title: "Daily Board & Cause List", subtitle: "Court listings, calling order & daily hearing schedule" };
  };

  const meta = getPageMeta();

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white/95 dark:bg-[#0b0f14]/95 backdrop-blur-md border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20 shadow-xs">
        {/* Left: Page Title & Classical Roman Index */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-[#0b0f14] dark:bg-[#3df2e0]/15 border border-[#0b0f14] dark:border-[#3df2e0]/40 flex items-center justify-center font-cinzel text-xs font-bold text-[#3df2e0] shadow-xs">
              {meta.roman}
            </span>
            <div>
              <h1 className="text-sm font-semibold font-cinzel text-[#0b0f14] dark:text-[#3df2e0] tracking-wide flex items-center gap-2">
                {meta.title}
              </h1>
              <p className="text-[11px] text-[#0b0f14]/70 dark:text-[#3df2e0]/60 font-serif italic tracking-wide">{meta.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Center: Search / Command Bar */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={() => setIsCmdOpen(true)}
            className="flex items-center gap-3.5 px-4 py-2 rounded-xl bg-white dark:bg-[#0f151c] hover:bg-white/80 dark:hover:bg-[#141d27] text-[#0b0f14]/70 dark:text-[#3df2e0]/60 text-xs transition-all border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 hover:border-[#0b0f14] dark:hover:border-[#3df2e0] shadow-xs group"
          >
            <Search className="w-3.5 h-3.5 text-[#0b0f14] dark:text-[#3df2e0] group-hover:scale-110 transition-transform" />
            <span className="font-sans text-[11.5px] tracking-wide">Search CNR, Case No, Bench or Client...</span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] bg-[#0b0f14]/5 dark:bg-[#0b0f14] border border-[#0b0f14]/15 dark:border-[#3df2e0]/30 text-[#0b0f14] dark:text-[#3df2e0] font-mono font-semibold shadow-xs">
              <Command className="w-2.5 h-2.5" /> K
            </span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Animated Theme Toggle (21st.dev SolarSwitch) */}
          <AnimatedThemeToggle />

          {/* Verification Queue (For Senior Counsel / Admin) */}
          {(currentUser?.role === "lawyer" || currentUser?.role === "admin") && (
            <button
              onClick={() => router.push(currentUser.role === "admin" ? "/admin/approvals" : "/dashboard/approvals")}
              className="relative p-2 rounded-xl bg-white dark:bg-[#0f151c] hover:bg-white/80 dark:hover:bg-[#141d27] text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 transition-colors shadow-xs"
              title="Advocate Verification Desk"
            >
              <Bell className="w-4 h-4 text-[#0b0f14] dark:text-[#3df2e0]" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0b0f14] text-[#3df2e0] dark:bg-[#3df2e0] dark:text-[#0b0f14] text-[9.5px] font-bold font-mono flex items-center justify-center shadow-xs">
                  {pendingCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#0b0f14]/15 dark:border-[#3df2e0]/20">
            <div className="hidden md:block text-right">
              <span className="block text-xs font-bold text-[#0b0f14] dark:text-[#3df2e0] leading-tight font-sans">
                {currentUser?.name || "Advocate"}
              </span>
              <span className="text-[9.5px] font-cinzel font-bold tracking-widest text-[#0b0f14]/80 dark:text-[#3df2e0]">
                {currentUser?.role === "lawyer" ? "SENIOR ADVOCATE" : currentUser?.role === "associate" ? "ASSOCIATE COUNSEL" : currentUser?.role === "client" ? "LITIGANT" : "REGISTRAR"}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0b0f14] via-[#3df2e0] to-[#0b0f14] p-[1.5px] shadow-xs">
              <div className="w-full h-full rounded-full bg-white dark:bg-[#0b0f14] flex items-center justify-center text-[11px] font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0]">
                {currentUser?.name?.slice(0, 2).toUpperCase() || "AM"}
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-[#0b0f14]/60 dark:text-[#3df2e0]/60 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Sign Out of Chambers"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
    </>
  );
}
