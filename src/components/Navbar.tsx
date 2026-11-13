"use client";

import React from "react";
import { Scale, Database, Bell, LogOut, Sparkles } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Chamber Dashboard", subtitle: "Overview of ongoing matters & listings" },
  cases: { title: "Case Diary", subtitle: "Registered cases, forums and bench stages" },
  calendar: { title: "Hearing Calendar", subtitle: "Cause list & court appearances schedule" },
  clients: { title: "Client Register", subtitle: "Corporate & individual clients on record" },
  associates: { title: "Associates Desk", subtitle: "Delegated work & submission status" },
  approvals: { title: "Approval Queue", subtitle: "Verification required for associate updates" },
  contacts: { title: "Chamber Contacts", subtitle: "Your designated legal defense team" },
  users: { title: "Chamber Administration", subtitle: "User credentials and database control" },
  "case-detail": { title: "Case Record", subtitle: "Hearings, orders, and confidential notes" },
};

export function Navbar() {
  const { activePage, currentUser, state, logout, setIsGuideOpen, setActivePage } = useChamber();
  const meta = PAGE_META[activePage] || { title: "CounselBook", subtitle: "Lawyers' Diary" };
  const pendingCount = state?.approvals?.length || 0;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight flex items-center gap-2">
            {meta.title}
          </h1>
          <p className="text-xs text-slate-500 font-normal">{meta.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* MongoDB Connection Status Pill */}
        <button
          onClick={() => setIsGuideOpen(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 shadow-sm ${
            state?.dbConnected
              ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
              : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 hover:border-amber-400"
          }`}
          title="Click to view MongoDB Connection Guide & Settings"
        >
          <Database className={`w-3.5 h-3.5 ${state?.dbConnected ? "text-emerald-600" : "text-amber-600"}`} />
          <span className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                state?.dbConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-ping"
              }`}
            />
            {state?.dbConnected ? "MongoDB Active" : "Local Mode · Connect Mongo"}
          </span>
        </button>

        {/* Approvals Bell (for lawyer and admin) */}
        {(currentUser?.role === "lawyer" || currentUser?.role === "admin") && (
          <button
            onClick={() => setActivePage("approvals")}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
            title="Pending Approvals"
          >
            <Bell className="w-4 h-4" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full border-2 border-white shadow-sm">
                {pendingCount}
              </span>
            )}
          </button>
        )}

        {/* User Badge */}
        {currentUser && (
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center shadow-sm">
              {currentUser.name
                .replace(/^(Adv\.|Mr\.|Ms\.)\s*/i, "")
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-amber-700 font-medium capitalize">{currentUser.role}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 ml-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

