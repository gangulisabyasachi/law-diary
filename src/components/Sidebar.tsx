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
      ? "Updated Law Diary Registrar Desk"
      : (() => {
          const supLawyer = state?.users?.find(
            (u) => u.role === "lawyer" && (u.id === currentUser.lawyerId || state.cases.some((c) => c.lawyerId === u.id))
          );
          return supLawyer ? `Chambers of ${supLawyer.name}` : `Updated Law Diary Chambers`;
        })();

  return (
    <aside className="w-64 bg-white dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex flex-col h-screen sticky top-0 border-r border-[#111111]/15 dark:border-[#f3eee3]/20 select-none transition-colors duration-200 shadow-xs">
      {/* Sophisticated Chamber Crest Header */}
      <div className="p-4 sm:p-5 border-b border-[#111111]/15 dark:border-[#f3eee3]/20 flex items-center gap-3 bg-[#f3eee3]/10 dark:bg-[#181818] backdrop-blur-md">
        <div className="w-10 h-10 rounded-2xl bg-[#111111] border border-[#f3eee3]/50 flex items-center justify-center text-[#f3eee3] shadow-md flex-shrink-0 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#f3eee3]/10 opacity-60" />
          <Scale className="w-5 h-5 text-[#f3eee3] relative z-10 transition-transform group-hover:scale-110" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xs font-semibold font-cinzel text-[#111111] dark:text-[#f3eee3] tracking-wider leading-tight truncate">
            {chamberTitle}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9.5px] uppercase font-cinzel tracking-widest text-[#111111]/80 dark:text-[#f3eee3]/90 font-bold truncate">
              {currentUser.role === "admin" ? "Master Register" : "Chamber Diary"}
            </span>
            <span className="text-[9px] font-mono text-[#111111]/60 dark:text-[#f3eee3]/60">· MMXII</span>
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
                <p className={`px-3 text-[9.5px] font-cinzel font-bold uppercase tracking-[0.16em] text-[#111111] dark:text-[#f3eee3] ${idx > 0 ? "pt-5" : "pt-1"} pb-1.5 opacity-90`}>
                  {item.section}
                </p>
              )}

              <Link
                href={item.href}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group ${
                  isActive
                    ? "bg-[#d9541e]/10 text-[#d9541e] dark:text-[#d9541e] border-l-[3px] border-[#d9541e] font-bold shadow-xs"
                    : "text-[#111111]/70 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-[#f3eee3] hover:bg-[#111111]/5 dark:hover:bg-[#202020]"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? "text-[#d9541e]" : "text-[#111111]/50 dark:text-[#f3eee3]/50 group-hover:text-[#111111] dark:group-hover:text-[#f3eee3]"
                    }`}
                  />
                  <span className="truncate tracking-wide">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold font-mono bg-[#d9541e] text-white">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#111111] dark:text-[#f3eee3]" />
                  )}
                </div>
              </Link>
            </React.Fragment>
          );
        })}
      </nav>

      {/* User Status / Chamber Clerk Desk */}
      <div className="p-3.5 m-3 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9.5px] font-cinzel uppercase tracking-widest text-[#111111]/60 dark:text-[#f3eee3]/60">
            Credentialed User
          </span>
          <span className="text-[9px] font-cinzel px-2 py-0.5 rounded-full bg-[#111111] text-[#f3eee3] dark:bg-[#f3eee3]/20 dark:text-[#f3eee3] font-bold border border-[#111111] dark:border-[#f3eee3]/40">
            {role.toUpperCase()}
          </span>
        </div>
        <p className="font-bold text-[#111111] dark:text-[#f3eee3] truncate font-sans text-xs">
          {currentUser.name}
        </p>
        <p className="text-[11px] text-[#111111]/70 dark:text-[#f3eee3]/60 truncate font-serif italic">
          {currentUser.designation || "Counsel"}
        </p>
      </div>
    </aside>
  );
}
