"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  ChevronRight,
  Gavel,
  FileCheck,
  Award,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function Sidebar() {
  const { currentUser, state } = useChamber();
  const pathname = usePathname();

  if (!currentUser) return null;

  const role = currentUser.role;
  const pendingApprovals = state?.approvals?.length || 0;

  interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    section?: string;
  }

  const NAV_ITEMS: Record<string, NavItem[]> = {
    lawyer: [
      { id: "dashboard", label: "Daily Board (Cause List)", href: "/dashboard", icon: LayoutDashboard, section: "COURT PROCEEDINGS" },
      { id: "cases", label: "Case Diary (Matters)", href: "/dashboard/cases", icon: Scale },
      { id: "calendar", label: "Hearing Calendar", href: "/dashboard/calendar", icon: CalendarDays },
      { id: "clients", label: "Client Register", href: "/dashboard/clients", icon: Users, section: "CHAMBER MANAGEMENT" },
      { id: "associates", label: "Associate Roster", href: "/dashboard/associates", icon: Briefcase },
      { id: "approvals", label: "Verification Desk", href: "/dashboard/approvals", icon: FileCheck, badge: pendingApprovals },
    ],
    associate: [
      { id: "dashboard", label: "Daily Cause List", href: "/dashboard", icon: LayoutDashboard, section: "COURT PROCEEDINGS" },
      { id: "cases", label: "Assigned Matters", href: "/dashboard/cases", icon: Scale },
      { id: "calendar", label: "Hearing Calendar", href: "/dashboard/calendar", icon: CalendarDays },
      { id: "clients", label: "Client Briefs", href: "/dashboard/clients", icon: Users, section: "CHAMBER WORKFLOW" },
      { id: "approvals", label: "My Draft Submissions", href: "/dashboard/approvals", icon: FileCheck },
    ],
    client: [
      { id: "dashboard", label: "My Court Matters", href: "/dashboard", icon: Scale, section: "LITIGANT PORTAL" },
      { id: "contacts", label: "Briefed Legal Counsel", href: "/dashboard/contacts", icon: PhoneCall },
    ],
    admin: [
      { id: "dashboard", label: "Chamber Overview", href: "/admin", icon: LayoutDashboard, section: "REGISTRAR DESK" },
      { id: "cases", label: "Master Case Register", href: "/admin/cases", icon: Scale },
      { id: "users", label: "User Accounts & Roster", href: "/admin/users", icon: UserCheck },
      { id: "approvals", label: "Decision Audit Trail", href: "/admin/approvals", icon: ShieldCheck },
    ],
  };

  const items = NAV_ITEMS[role] || NAV_ITEMS.lawyer;

  const chamberTitle =
    currentUser.role === "lawyer"
      ? (currentUser.name.toLowerCase().startsWith("adv") ? `Chambers of ${currentUser.name}` : `Chambers of Adv. ${currentUser.name}`)
      : currentUser.role === "admin"
      ? "CounselBook Registrar Desk"
      : (() => {
          const supLawyer = state?.users?.find(
            (u) => u.role === "lawyer" && (u.id === currentUser.lawyerId || state.cases.some((c) => c.lawyerId === u.id))
          );
          return supLawyer ? `Chambers of ${supLawyer.name}` : `CounselBook Chambers`;
        })();

  return (
    <aside className="w-64 bg-white dark:bg-[#0b0f19] text-slate-600 dark:text-slate-400 flex flex-col h-screen sticky top-0 border-r border-slate-200 dark:border-slate-800 select-none transition-colors duration-200 shadow-xs">
      {/* Sophisticated Chamber Crest Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/80 dark:bg-[#0f172a]/80 backdrop-blur-md">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#1e3a8a] border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-md flex-shrink-0 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/10 opacity-60" />
          <Scale className="w-5 h-5 text-blue-400 relative z-10 transition-transform group-hover:scale-110" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xs font-semibold font-cinzel text-slate-900 dark:text-white tracking-wider leading-tight truncate">
            {chamberTitle}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9.5px] uppercase font-cinzel tracking-widest text-[#1d4ed8] dark:text-[#60a5fa] font-semibold truncate">
              {currentUser.role === "admin" ? "Master Register" : "High Court Diary"}
            </span>
            <span className="text-[9px] font-mono text-slate-500 dark:text-slate-500">· MMXII</span>
          </div>
        </div>
      </div>

      {/* Navigation Desk */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <React.Fragment key={item.id}>
              {item.section && (
                <p className={`px-3 text-[9.5px] font-cinzel font-semibold uppercase tracking-[0.16em] text-[#1e3a8a] dark:text-[#60a5fa] ${idx > 0 ? "pt-5" : "pt-1"} pb-1.5 opacity-90`}>
                  {item.section}
                </p>
              )}

              <Link
                href={item.href}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 border-l-[3px] border-[#1e3a8a] dark:border-[#3b82f6] font-semibold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? "text-[#1d4ed8] dark:text-[#60a5fa]" : "text-slate-400 group-hover:text-[#1d4ed8] dark:group-hover:text-[#60a5fa]"
                    }`}
                  />
                  <span className="truncate tracking-wide">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold font-mono bg-blue-100 dark:bg-blue-950/60 text-[#1e3a8a] dark:text-[#93c5fd] border border-blue-200 dark:border-blue-800/50">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#1d4ed8] dark:text-[#60a5fa]" />
                  )}
                </div>
              </Link>
            </React.Fragment>
          );
        })}
      </nav>

      {/* User Status / Chamber Clerk Desk */}
      <div className="p-3.5 m-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-xs shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9.5px] font-cinzel uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Credentialed User
          </span>
          <span className="text-[9px] font-cinzel px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#1d4ed8] dark:text-[#60a5fa] font-semibold border border-blue-200 dark:border-blue-800/50">
            {role.toUpperCase()}
          </span>
        </div>
        <p className="font-semibold text-slate-900 dark:text-white truncate font-sans text-xs">
          {currentUser.name}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-serif italic">
          {currentUser.designation || "Counsel"}
        </p>
      </div>
    </aside>
  );
}
