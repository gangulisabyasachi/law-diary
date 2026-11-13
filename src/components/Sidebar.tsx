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
    <aside className="w-64 bg-[#14171a] text-[#c5c8cc] flex flex-col h-screen sticky top-0 border-r border-[#252930] select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#252930] flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#20252b] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shadow-sm flex-shrink-0">
          <Scale className="w-4 h-4 text-[#c5a059]" />
        </div>
        <div>
          <h2 className="text-base font-bold font-display text-[#f5f2ec] tracking-tight leading-none">
            CounselBook
          </h2>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#c5a059] font-medium mt-1 block">
            Chamber Diary
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-mono font-medium uppercase tracking-wider text-[#6e747d] mb-2">
          Docket Desk
        </p>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id || (item.id === "cases" && activePage === "case-detail");

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-[#21262d] text-[#ffffff] border-l-2 border-[#c5a059]"
                  : "text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#1b1f24]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-[#c5a059]" : "text-[#6b7280] group-hover:text-[#9ca3af]"
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-[#c5a059] text-[#14171a]">
                  {item.badge}
                </span>
              )}

              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-[#c5a059]/70" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Database Connection Footer Card */}
      <div className="p-3 m-3 rounded-lg bg-[#1a1e23] border border-[#282d35] text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b929c] flex items-center gap-1.5">
            <Database className="w-3 h-3 text-[#c5a059]" /> Database
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              state?.dbConnected ? "bg-[#34d399]" : "bg-[#f59e0b]"
            }`}
          />
        </div>
        <p className="text-[11px] text-[#e5e7eb] font-medium truncate">
          {state?.dbConnected ? "MongoDB Atlas Active" : "Local Mode"}
        </p>
        <button
          onClick={() => setIsGuideOpen(true)}
          className="mt-2 w-full py-1 text-[10px] font-medium rounded bg-[#232830] hover:bg-[#2b313a] text-[#c5a059] border border-[#c5a059]/25 text-center transition-colors"
        >
          {state?.dbConnected ? "Connection Info" : "Setup Atlas"}
        </button>
      </div>
    </aside>
  );
}

