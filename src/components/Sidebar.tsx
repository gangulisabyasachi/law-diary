"use client";

import React from "react";
import {
  Scale,
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  Users,
  ShieldCheck,
  CheckCircle,
  PhoneCall,
  UserCheck,
  Database,
  ChevronRight,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function Sidebar() {
  const { currentUser, activePage, setActivePage, state, setIsGuideOpen } = useChamber();

  if (!currentUser) return null;

  const role = currentUser.role;
  const pendingApprovals = state?.approvals?.length || 0;

  const NAV_ITEMS: Record<
    string,
    Array<{ id: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }>
  > = {
    lawyer: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "cases", label: "Case Diary", icon: Scale },
      { id: "calendar", label: "Hearing Calendar", icon: CalendarDays },
      { id: "clients", label: "Client Register", icon: Users },
      { id: "associates", label: "Associates", icon: Briefcase },
      { id: "approvals", label: "Approval Queue", icon: CheckCircle, badge: pendingApprovals },
    ],
    associate: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "cases", label: "Case Diary", icon: Scale },
      { id: "calendar", label: "Hearing Calendar", icon: CalendarDays },
      { id: "clients", label: "Clients", icon: Users },
      { id: "approvals", label: "My Submissions", icon: CheckCircle },
    ],
    client: [
      { id: "dashboard", label: "My Matters", icon: Scale },
      { id: "contacts", label: "Chamber Team", icon: PhoneCall },
    ],
    admin: [
      { id: "dashboard", label: "Overview", icon: LayoutDashboard },
      { id: "cases", label: "All Cases", icon: Scale },
      { id: "users", label: "User Accounts", icon: UserCheck },
      { id: "approvals", label: "Audit Log", icon: ShieldCheck },
    ],
  };

  const items = NAV_ITEMS[role] || NAV_ITEMS.lawyer;

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
          <Scale className="w-5 h-5 text-slate-950" />
        </div>
        <div>
          <h2 className="text-lg font-bold font-display text-white tracking-tight leading-none">
            CounselBook
          </h2>
          <span className="text-[10px] uppercase tracking-widest text-amber-400/90 font-semibold mt-1 block">
            Lawyers' Diary
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          Workspace
        </p>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id || (item.id === "cases" && activePage === "case-detail");

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group relative ${
                isActive
                  ? "bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-sm animate-pulse">
                  {item.badge}
                </span>
              )}

              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-amber-400/60" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Database Connection Footer Card */}
      <div className="p-3 m-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Database className="w-3 h-3 text-amber-400" /> Database
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              state?.dbConnected ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
            }`}
          />
        </div>
        <p className="text-[11px] text-slate-300 font-medium truncate">
          {state?.dbConnected ? "MongoDB Connected" : "Local Fallback Mode"}
        </p>
        <button
          onClick={() => setIsGuideOpen(true)}
          className="mt-2 w-full py-1.5 text-[11px] font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/20 text-center transition-colors"
        >
          {state?.dbConnected ? "View Mongo Details" : "Connect MongoDB Guide"}
        </button>
      </div>
    </aside>
  );
}

