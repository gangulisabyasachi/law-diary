"use client";

import React, { useState } from "react";
import Image from "next/image";
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

  const pendingCount = (state?.approvals || []).filter((a) => {
    if (currentUser?.role === "admin") return false;
    if (currentUser?.role === "associate") return a.by === currentUser.id;
    if (currentUser?.role === "lawyer") {
      if (a.by === currentUser.id) return true;
      const cId = a.payload?.caseId || a.payload?.case?.id;
      if (cId && (state?.cases || []).some((c) => c.id === cId && (c.lawyerId || "u-lawyer") === currentUser.id)) return true;
      if (a.payload?.case?.lawyerId === currentUser.id) return true;
      const submitter = (state?.users || []).find((u) => u.id === a.by);
      if (submitter && (submitter.lawyerId || "u-lawyer") === currentUser.id) return true;
      if (currentUser.id === "u-lawyer" || !submitter?.lawyerId) return true;
      return false;
    }
    return false;
  }).length;

  // Determine Page Title & Subtitle from Pathname
  const getPageMeta = () => {
    if (pathname.match(/^\/admin\/chambers\/.+/)) {
      return { title: "Chamber Roster Dossier", subtitle: "Advocate practice workspace, junior roster & client retainers" };
    }
    if (pathname.startsWith("/admin/chambers")) {
      return { title: "Chamber Workspaces Directory", subtitle: "Multi-tenant practice portfolio & advocate roster" };
    }
    if (pathname.startsWith("/admin/logs")) {
      return { title: "Platform Error & Audit Logs", subtitle: "Diagnostic telemetry, exception traces & security anomaly monitoring" };
    }
    if (pathname.startsWith("/admin/system")) {
      return { title: "Platform System Health & DB", subtitle: "MongoDB Atlas cluster status & infrastructure telemetry" };
    }
    if (pathname.startsWith("/admin")) {
      return { title: "Platform Super Admin Console", subtitle: "User access control, account enable/disable & profile management" };
    }
    if (pathname.endsWith("/cases")) {
      return { title: "Case Diary (Matters)", subtitle: "Active pleadings, vakalatnamas & judicial records" };
    }
    if (pathname.endsWith("/cases/new")) {
      return { title: "File Fresh Matter", subtitle: "Court brief intake & judicial docket" };
    }
    if (pathname.includes("/cases/")) {
      return { title: "Matter Dossier & Case Details", subtitle: "Full court records, order sheets & stage history" };
    }
    if (pathname.endsWith("/calendar")) {
      return { title: "Judicial Hearing Calendar", subtitle: "Cause list schedules, court rooms & statutory dates" };
    }
    if (pathname.endsWith("/clients")) {
      return { title: "Litigant Client Register", subtitle: "Retainers, fee structures & corporate party records" };
    }
    if (pathname.endsWith("/associates")) {
      return { title: "Chamber Associate Roster", subtitle: "Assigned drafting duties, hearings & research tasks" };
    }
    if (pathname.endsWith("/approvals")) {
      return { title: "Advocate Verification Desk", subtitle: "Cause list entries, fee notes & filings awaiting sign-off" };
    }
    if (pathname.endsWith("/contacts")) {
      return { title: "Briefed Legal Advocate", subtitle: "Direct hotline to Advocate & chamber desk" };
    }
    return { title: "Daily Board & Cause List", subtitle: "Court listings, calling order & daily hearing schedule" };
  };

  const meta = getPageMeta();

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white/95 dark:bg-[#111111]/95 backdrop-blur-md border-b border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
        {/* Left: Page Title & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="md:hidden flex items-center shrink-0">
            <Image
              src="/favicon.png"
              alt="LexDaily LD Logo"
              width={34}
              height={34}
              className="w-8 h-8 rounded-xl object-contain border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs"
            />
          </div>
          <div>
            <h1 className="text-sm font-semibold font-cinzel text-[#111111] dark:text-[#f3eee3] tracking-wide flex items-center gap-2">
              {meta.title}
            </h1>
            <p className="text-[11px] text-[#111111]/70 dark:text-[#f3eee3]/60 font-serif italic tracking-wide">{meta.subtitle}</p>
          </div>
        </div>

        {/* Center: Search / Command Bar */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={() => setIsCmdOpen(true)}
            className="flex items-center gap-3.5 px-4 py-2 rounded-xl bg-white dark:bg-[#181818] hover:bg-white/80 dark:hover:bg-[#202020] text-[#111111]/70 dark:text-[#f3eee3]/60 text-xs transition-all border border-[#111111]/15 dark:border-[#f3eee3]/20 hover:border-[#111111] dark:hover:border-[#f3eee3] shadow-xs group"
          >
            <Search className="w-3.5 h-3.5 text-[#111111] dark:text-[#f3eee3] group-hover:scale-110 transition-transform" />
            <span className="font-sans text-[11.5px] tracking-wide">Search Case No, Court, Bench or Client...</span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] bg-[#111111]/5 dark:bg-[#111111] border border-[#111111]/15 dark:border-[#f3eee3]/30 text-[#111111] dark:text-[#f3eee3] font-mono font-semibold shadow-xs">
              <Command className="w-2.5 h-2.5" /> K
            </span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Animated Theme Toggle (21st.dev SolarSwitch) */}
          <AnimatedThemeToggle />

          {/* Verification Queue (Strictly For Advocate reviewing associate drafts) */}
          {currentUser?.role === "lawyer" && (
            <button
              onClick={() => router.push("/dashboard/approvals")}
              className="relative p-2 rounded-xl bg-white dark:bg-[#181818] hover:bg-white/80 dark:hover:bg-[#202020] text-[#111111] dark:text-[#f3eee3] border border-[#111111]/15 dark:border-[#f3eee3]/20 transition-colors shadow-xs"
              title="Advocate Verification Desk"
            >
              <Bell className="w-4 h-4 text-[#111111] dark:text-[#f3eee3]" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#111111] text-[#f3eee3] dark:bg-[#f3eee3] dark:text-[#111111] text-[9.5px] font-bold font-mono flex items-center justify-center shadow-xs">
                  {pendingCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#111111]/15 dark:border-[#f3eee3]/20">
            <div className="hidden md:block text-right">
              <span className="block text-xs font-bold text-[#111111] dark:text-[#f3eee3] leading-tight font-sans">
                {currentUser?.name || "Administrator"}
              </span>
              <span className="text-[9.5px] font-cinzel font-bold tracking-widest text-[#111111]/80 dark:text-[#f3eee3]">
                {currentUser?.role === "admin"
                  ? "SUPER ADMIN"
                  : currentUser?.role === "lawyer"
                  ? "ADVOCATE"
                  : currentUser?.role === "associate"
                  ? "ASSOCIATE ADVOCATE"
                  : "LITIGANT"}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#111111] via-[#f3eee3] to-[#111111] p-[1.5px] shadow-xs">
              <div className="w-full h-full rounded-full bg-white dark:bg-[#111111] flex items-center justify-center text-[11px] font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
                {currentUser?.name?.slice(0, 2).toUpperCase() || "AM"}
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-[#111111]/60 dark:text-[#f3eee3]/60 hover:text-red-500 hover:bg-red-500/10 transition-colors"
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
