"use client";

import React, { useState } from "react";
import { Scale, Database, Bell, LogOut, Search, Command } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";
import { CommandPalette } from "./CommandPalette";

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Chamber Dashboard", subtitle: "Court listings, daily cause lists, and filings" },
  cases: { title: "Case Diary", subtitle: "Matters registered across High Courts, NCLT & District Benches" },
  calendar: { title: "Hearing Calendar", subtitle: "Chronological cause list & appearance roster" },
  clients: { title: "Client Register", subtitle: "Corporate entities and individual litigants" },
  associates: { title: "Associate Roster", subtitle: "Working advocates & pending draft submissions" },
  approvals: { title: "Advocate Verification Desk", subtitle: "Associate mutations requiring principal review" },
  contacts: { title: "Chamber Contacts", subtitle: "Your designated legal counsel & associates" },
  users: { title: "Chamber Administration", subtitle: "System credentials & database control" },
  "case-detail": { title: "Case File", subtitle: "Orders, hearings timeline, and confidential briefs" },
};

export function Navbar() {
  const { activePage, currentUser, state, logout, setIsGuideOpen, setActivePage } = useChamber();
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  const meta = PAGE_META[activePage] || { title: "CounselBook", subtitle: "Advocates' Chamber" };
  const pendingCount = state?.approvals?.length || 0;

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 bg-white border-b border-[#e6e2d8]">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-base font-bold font-display text-[#191817] tracking-tight flex items-center gap-2">
              {meta.title}
            </h1>
            <p className="text-[11px] text-[#635f59] font-normal">{meta.subtitle}</p>
          </div>
        </div>

        {/* Center: Command Palette Trigger */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => setIsCmdOpen(true)}
            className="flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-[#f5f3ee] hover:bg-[#eae6dd] text-[#5c5852] text-xs transition-colors border border-[#e2ded5]"
          >
            <Search className="w-3.5 h-3.5 text-[#8c877e]" />
            <span className="text-[#5c5852] font-medium">Quick search or command...</span>
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-white border border-[#dedad0] text-[#635f59] font-mono shadow-sm">
              <Command className="w-2.5 h-2.5" /> K
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* MongoDB Connection Status Pill */}
          <button
            onClick={() => setIsGuideOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              state?.dbConnected
                ? "bg-[#f0f6f2] text-[#1c5c36] border-[#cee2d3] hover:bg-[#e6f2e9]"
                : "bg-[#fdf8f0] text-[#7a491c] border-[#ebdcc9] hover:bg-[#f8eedc]"
            }`}
            title="MongoDB Connection Inspector"
          >
            <Database className={`w-3.5 h-3.5 ${state?.dbConnected ? "text-[#1c5c36]" : "text-[#7a491c]"}`} />
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  state?.dbConnected ? "bg-[#1c5c36]" : "bg-[#7a491c]"
                }`}
              />
              {state?.dbConnected ? "MongoDB Atlas" : "Local Mode"}
            </span>
          </button>

          {/* Approvals Bell */}
          {(currentUser?.role === "lawyer" || currentUser?.role === "admin") && (
            <button
              onClick={() => setActivePage("approvals")}
              className="relative p-2 rounded-lg text-[#5c5852] hover:text-[#191817] hover:bg-[#f5f3ee] transition-colors border border-[#e6e2d8]"
              title="Verification Queue"
            >
              <Bell className="w-4 h-4" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-bold text-white bg-[#991b1b] rounded-full border-2 border-white">
                  {pendingCount}
                </span>
              )}
            </button>
          )}

          {/* User Badge */}
          {currentUser && (
            <div className="flex items-center gap-2.5 pl-3 border-l border-[#e6e2d8]">
              <div className="w-8 h-8 rounded-full bg-[#14171a] text-[#c5a059] font-bold text-xs flex items-center justify-center border border-[#c5a059]/30">
                {currentUser.name
                  .replace(/^(Adv\.|Mr\.|Ms\.)\s*/i, "")
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-[#191817] leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-[#805e26] font-medium capitalize">{currentUser.role}</p>
              </div>
              <button
                onClick={logout}
                className="p-1.5 ml-1 text-[#8c877e] hover:text-[#991b1b] hover:bg-[#fef2f2] rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
    </>
  );
}
