"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  LogOut,
  Search,
  Command,
  Sun,
  Moon,
  Laptop,
  ShieldCheck,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";
import { CommandPalette } from "./CommandPalette";

export function Navbar() {
  const { currentUser, state, logout, theme, setTheme } = useChamber();
  const pathname = usePathname();
  const router = useRouter();
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const pendingCount = state?.approvals?.length || 0;

  // Dynamically resolve page meta from pathname
  const getPageMeta = () => {
    if (pathname.includes("/cases/")) {
      return { roman: "§", title: "Case File & Judicial Docket", subtitle: "Operative court orders, hearing timeline, CNR number & fee ledger" };
    }
    if (pathname.endsWith("/cases")) {
      return { roman: "II", title: "Case Diary (Vakalatnama Register)", subtitle: "Civil suits, arbitrations, commercial matters & writ petitions" };
    }
    if (pathname.endsWith("/calendar")) {
      return { roman: "III", title: "Chronological Cause List", subtitle: "Monthly hearing register & bench appearances" };
    }
    if (pathname.endsWith("/clients")) {
      return { roman: "IV", title: "Client Register & Briefs", subtitle: "Corporate entities, managing directors & individual litigants" };
    }
    if (pathname.endsWith("/associates")) {
      return { roman: "V", title: "Chamber Associate Roster", subtitle: "Working advocates, briefing counsel & draft submissions" };
    }
    if (pathname.endsWith("/approvals")) {
      return { roman: "VI", title: "Advocate Verification Desk", subtitle: "Junior counsel submissions awaiting Senior Counsel sign-off" };
    }
    if (pathname.endsWith("/contacts")) {
      return { roman: "VII", title: "Chamber Legal Team", subtitle: "Designated counsel, chamber clerk & office contacts" };
    }
    if (pathname.endsWith("/users") || pathname === "/admin") {
      return { roman: "VIII", title: "Chamber Administration", subtitle: "Advocate credentials, user roles & database control" };
    }
    return { roman: "I", title: "Daily Board & Cause List", subtitle: "Court listings, calling order & daily hearing schedule" };
  };

  const meta = getPageMeta();

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 shadow-xs">
        {/* Left: Page Title & Classical Roman Index */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center font-cinzel text-xs font-bold text-[#1e3a8a] dark:text-[#60a5fa] shadow-xs">
              {meta.roman}
            </span>
            <div>
              <h1 className="text-sm font-semibold font-cinzel text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
                {meta.title}
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-serif italic tracking-wide">{meta.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Center: Search / Command Bar */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={() => setIsCmdOpen(true)}
            className="flex items-center gap-3.5 px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-[#161f30] text-slate-600 dark:text-slate-400 text-xs transition-all border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 shadow-xs group"
          >
            <Search className="w-3.5 h-3.5 text-[#1e3a8a] dark:text-[#60a5fa] group-hover:scale-110 transition-transform" />
            <span className="font-sans text-[11.5px] tracking-wide">Search CNR, Case No, Bench or Client...</span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-[#1e3a8a] dark:text-[#60a5fa] font-mono font-semibold shadow-xs">
              <Command className="w-2.5 h-2.5" /> K
            </span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Switcher (System / Light / Dark) */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-[#161f30] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all shadow-xs"
              title={`Active Theme: ${theme.toUpperCase()} (Click to change)`}
            >
              {theme === "light" && <Sun className="w-4 h-4 text-amber-600" />}
              {theme === "dark" && <Moon className="w-4 h-4 text-blue-400" />}
              {theme === "system" && <Laptop className="w-4 h-4 text-[#1e3a8a] dark:text-[#60a5fa]" />}
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl py-1.5 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 text-[9.5px] uppercase font-cinzel tracking-widest text-slate-500 dark:text-slate-400">
                  Theme Appearance
                </div>
                <button
                  type="button"
                  onClick={() => { setTheme("system"); setShowThemeMenu(false); }}
                  className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                    theme === "system" ? "font-bold text-[#1e3a8a] dark:text-[#60a5fa] bg-blue-50 dark:bg-blue-950/40" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Laptop className="w-3.5 h-3.5" />
                    <span>System Sync</span>
                  </div>
                  {theme === "system" && <span className="text-[10px] text-[#1e3a8a] dark:text-[#60a5fa]">✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => { setTheme("light"); setShowThemeMenu(false); }}
                  className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                    theme === "light" ? "font-bold text-[#1e3a8a] bg-blue-50" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5" />
                    <span>Royal Navy (Light)</span>
                  </div>
                  {theme === "light" && <span className="text-[10px] text-[#1e3a8a]">✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => { setTheme("dark"); setShowThemeMenu(false); }}
                  className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                    theme === "dark" ? "font-bold text-[#60a5fa] dark:bg-blue-950/40" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Moon className="w-3.5 h-3.5" />
                    <span>Midnight Navy (Dark)</span>
                  </div>
                  {theme === "dark" && <span className="text-[10px] text-[#60a5fa]">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Chamber Vault Security Badge */}
          <div
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-sans font-medium bg-slate-50 dark:bg-[#111827] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 shadow-xs select-none"
            title="256-Bit Encrypted Judicial Chamber Vault"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#1e3a8a] dark:text-[#60a5fa]" />
            <span className="text-[11px] font-cinzel font-semibold tracking-wider text-[#1e3a8a] dark:text-[#60a5fa]">Encrypted Vault</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Verification Queue (For Senior Counsel / Admin) */}
          {(currentUser?.role === "lawyer" || currentUser?.role === "admin") && (
            <button
              onClick={() => router.push(currentUser.role === "admin" ? "/admin/approvals" : "/dashboard/approvals")}
              className="relative p-2 rounded-xl bg-slate-50 dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-[#161f30] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
              title="Advocate Verification Desk"
            >
              <Bell className="w-4 h-4 text-[#1e3a8a] dark:text-[#60a5fa]" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1e3a8a] dark:bg-[#3b82f6] text-white text-[9.5px] font-bold font-mono flex items-center justify-center shadow-xs">
                  {pendingCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="hidden md:block text-right">
              <span className="block text-xs font-semibold text-slate-900 dark:text-white leading-tight font-sans">
                {currentUser?.name || "Advocate"}
              </span>
              <span className="text-[9.5px] font-cinzel tracking-widest text-[#1e3a8a] dark:text-[#60a5fa]">
                {currentUser?.role === "lawyer" ? "SENIOR ADVOCATE" : currentUser?.role === "associate" ? "ASSOCIATE COUNSEL" : currentUser?.role === "client" ? "LITIGANT" : "REGISTRAR"}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1e3a8a] to-[#3b82f6] p-[1.5px] shadow-xs">
              <div className="w-full h-full rounded-full bg-white dark:bg-[#0f172a] flex items-center justify-center text-[11px] font-cinzel font-bold text-[#1e3a8a] dark:text-[#60a5fa]">
                {currentUser?.name?.slice(0, 2).toUpperCase() || "AM"}
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
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
