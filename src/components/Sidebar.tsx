"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
  LogOut,
  AlertOctagon,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function Sidebar() {
  const { currentUser, state, logout } = useChamber();
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (!currentUser) return null;

  const role = currentUser.role;
  const pendingApprovals = (state?.approvals || []).filter((a) => {
    if (currentUser?.role === "admin") return true;
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
      { id: "approvals", label: "My Draft Submissions", href: "/dashboard/approvals", icon: FileCheck, badge: pendingApprovals },
    ],
    client: [
      { id: "dashboard", label: "My Court Matters", href: "/dashboard", icon: Scale, section: "LITIGANT PORTAL" },
      { id: "contacts", label: "Briefed Legal Advocate", href: "/dashboard/contacts", icon: PhoneCall },
    ],
    admin: [
      { id: "users", label: "User Directory & Access", href: "/admin", icon: Users, section: "PLATFORM CONTROL" },
      { id: "chambers", label: "Chamber Workspaces", href: "/admin/chambers", icon: Briefcase },
      { id: "system", label: "System Health & Cloud DB", href: "/admin/system", icon: ShieldCheck },
      { id: "logs", label: "Platform Error & Audit Logs", href: "/admin/logs", icon: AlertOctagon },
    ],
  };

  const items = NAV_ITEMS[role] || NAV_ITEMS.lawyer;

  const chamberTitle =
    currentUser.role === "lawyer"
      ? (currentUser.name.toLowerCase().startsWith("adv") ? `Chambers of ${currentUser.name}` : `Chambers of Adv. ${currentUser.name}`)
      : currentUser.role === "admin"
      ? "LexDaily Master Platform"
      : currentUser.role === "client"
      ? "LexDaily Litigant Portal"
      : (() => {
          const supLawyer = state?.users?.find(
            (u) => u.role === "lawyer" && (u.id === currentUser.lawyerId || state.cases.some((c) => c.lawyerId === u.id))
          );
          return supLawyer ? `Chambers of ${supLawyer.name}` : `LexDaily Chambers`;
        })();

  return (
    <aside className="w-64 bg-white dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex flex-col h-screen sticky top-0 border-r border-[#111111]/15 dark:border-[#f3eee3]/20 select-none transition-colors duration-200 shadow-xs">
      {/* Sophisticated Chamber Crest Header */}
      <div className="p-4 sm:p-5 border-b border-[#111111]/15 dark:border-[#f3eee3]/20 flex items-center gap-3 bg-[#f3eee3]/10 dark:bg-[#181818] backdrop-blur-md">
        <div className="w-10 h-10 rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/25 bg-white dark:bg-[#181818] flex items-center justify-center shadow-sm flex-shrink-0 relative overflow-hidden group">
          <Image
            src="/favicon.png"
            alt="LexDaily LD Logo"
            width={40}
            height={40}
            className="w-full h-full object-contain p-0.5 transition-transform group-hover:scale-105"
            priority
          />
        </div>
        <div className="min-w-0">
          <h2 className="text-xs font-semibold font-cinzel text-[#111111] dark:text-[#f3eee3] tracking-wider leading-tight truncate">
            {chamberTitle}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9.5px] uppercase font-cinzel tracking-widest text-[#111111]/80 dark:text-[#f3eee3]/90 font-bold truncate">
              {currentUser.role === "admin"
                ? "Platform Administration"
                : currentUser.role === "client"
                ? "Litigant Dossier"
                : "Chamber Diary"}
            </span>
            <span className="text-[9.5px] font-mono font-semibold text-[#111111]/60 dark:text-[#f3eee3]/60">
              · {currentYear}
            </span>
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

      {/* Platform Advisory Notice (Left Navbar - above the bottom-left credential medallion) */}
      {(state?.broadcast?.active !== false) && (
        <div className="relative mx-3 mb-1.5 rounded-2xl p-2.5 bg-gradient-to-br from-[#faf8f5] via-[#f7f2ea] to-[#eee6d8] dark:from-[#1c1a17] dark:via-[#161412] dark:to-[#100f0e] border border-[#d9541e]/25 dark:border-[#d9541e]/30 shadow-xs overflow-hidden group">
          {/* Subtle Luxury Top Hairline Accent */}
          <div className="absolute top-0 left-3 right-3 h-[1.5px] bg-gradient-to-r from-transparent via-[#d9541e]/50 dark:via-[#ea6026]/60 to-transparent" />

          <div className="flex items-center justify-between gap-1.5 pb-1.5 mb-1.5 border-b border-[#111111]/8 dark:border-[#f3eee3]/10">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d9541e] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d9541e]" />
              </span>
              <span className="text-[9px] font-cinzel font-bold tracking-[0.14em] text-[#d9541e] dark:text-[#ea6026] uppercase truncate">
                Platform Advisory
              </span>
            </div>

            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              Online
            </span>
          </div>

          <p className="text-[10.5px] font-serif leading-relaxed text-[#111111]/85 dark:text-[#f3eee3]/85 line-clamp-3">
            {state?.broadcast?.message || "Scheduled platform maintenance window: System remaining online with full database replication."}
          </p>
        </div>
      )}

      {/* Sovereign Advocate Credential Medallion */}
      <div className="relative m-3 rounded-2xl p-3 bg-gradient-to-b from-[#faf8f5] via-[#f5f0e8] to-[#eee7dc] dark:from-[#1c1a17] dark:via-[#161412] dark:to-[#100f0e] border border-[#111111]/12 dark:border-[#f3eee3]/15 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
        {/* Subtle Luxury Top Hairline Accent */}
        <div className="absolute top-0 left-3 right-3 h-[1.5px] bg-gradient-to-r from-transparent via-[#d9541e]/40 dark:via-[#ea6026]/50 to-transparent" />

        {/* Header: Verified Chamber Roll / Litigant Status + Refined Single-Line Pill */}
        <div className="flex items-center justify-between gap-1.5 pb-2 mb-2 border-b border-[#111111]/8 dark:border-[#f3eee3]/10">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0 ring-2 ring-emerald-500/20" />
            <span className="text-[9px] font-cinzel font-bold tracking-[0.14em] text-[#111111]/70 dark:text-[#f3eee3]/70 uppercase truncate">
              {role === "client" ? "RETAINED LITIGANT" : role === "admin" ? "SUPER ADMIN CONSOLE" : "BAR COUNCIL ROLL"}
            </span>
          </div>

          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[8.5px] font-cinzel font-bold tracking-wider uppercase whitespace-nowrap shrink-0 bg-[#d9541e]/10 text-[#d9541e] dark:bg-[#d9541e]/20 dark:text-[#ea6026] border border-[#d9541e]/25 shadow-2xs">
            {role === "lawyer"
              ? "Advocate"
              : role === "associate"
              ? "Associate Advocate"
              : role === "client"
              ? "Litigant Client"
              : "Super Admin"}
          </span>
        </div>

        {/* Identity: Bespoke Seal Medallion + Elegant Serif Name */}
        <div className="flex items-center gap-2.5">
          {/* Monogram Seal Medallion */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1a1715] via-[#2a2420] to-[#12100e] dark:from-[#24201c] dark:to-[#12100e] text-[#f3eee3] border border-[#c5a059]/40 dark:border-[#c5a059]/30 flex items-center justify-center font-cinzel font-bold text-xs shrink-0 shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform duration-200">
            <div className="absolute inset-0 bg-radial from-[#c5a059]/15 to-transparent pointer-events-none" />
            <span className="relative z-10 tracking-wider">
              {currentUser.name
                .replace(/^Adv\.?\s*/i, "")
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "SA"}
            </span>
          </div>

          {/* Advocate / Client Name & Designation */}
          <div className="min-w-0 flex-1">
            <p className="font-serif font-bold text-xs text-[#111111] dark:text-[#f3eee3] leading-snug tracking-tight truncate">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-[#111111]/60 dark:text-[#f3eee3]/60 font-serif italic truncate mt-0.5">
              {role === "lawyer"
                ? (currentUser.designation || "Advocate & Chamber Head")
                : role === "associate"
                ? (currentUser.designation || "Briefing & Arguing Counsel")
                : role === "client"
                ? (currentUser.phone ? `Mob: ${currentUser.phone}` : "Retained Litigant Dossier")
                : (currentUser.designation || "Platform Super Administrator")}
            </p>
          </div>
        </div>

        {/* Footer Meta & Sign Out */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#111111]/8 dark:border-[#f3eee3]/10 text-[9px]">
          <span className="inline-flex items-center gap-1 font-mono text-[#111111]/50 dark:text-[#f3eee3]/50 truncate">
            <ShieldCheck className="w-3 h-3 text-[#d9541e] shrink-0" />
            <span className="truncate">
              {role === "client" ? "Vakalatnama Protected" : role === "admin" ? "Root System Clearance" : "Rule 36 BCI Verified"}
            </span>
          </span>

          <button
            type="button"
            onClick={logout}
            title="Sign out of chamber"
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[#111111]/50 hover:text-rose-600 dark:text-[#f3eee3]/50 dark:hover:text-rose-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
          >
            <span className="text-[8.5px] font-cinzel font-semibold">Exit</span>
            <LogOut className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
}
