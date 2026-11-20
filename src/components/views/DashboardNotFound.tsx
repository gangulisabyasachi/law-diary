"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scale,
  Briefcase,
  LayoutDashboard,
  Search,
  ArrowRight,
  RotateCcw,
  AlertOctagon,
  ShieldAlert,
  FileQuestion,
  HelpCircle,
  Home,
  ChevronRight,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function DashboardNotFound() {
  const router = useRouter();
  const { currentUser } = useChamber();

  const isAdmin = currentUser?.role === "admin";
  const isLawyer = currentUser?.role === "lawyer";
  const isAssociate = currentUser?.role === "associate";
  const isClient = currentUser?.role === "client";

  const mainDashboardHref = isAdmin ? "/admin" : "/dashboard";
  const mattersHref = isAdmin ? "/admin/chambers" : isClient ? "/dashboard" : "/dashboard/cases";
  const mattersLabel = isAdmin ? "Chamber Workspaces" : isClient ? "My Court Matters" : "Case Diary (Matters)";

  return (
    <div className="space-y-6 pb-12 font-sans max-w-4xl mx-auto pt-4">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-[11px] font-mono text-[#111111]/50 dark:text-[#f3eee3]/50">
        <Link href={mainDashboardHref} className="hover:text-[#d9541e] transition-colors">
          {isAdmin ? "Admin Console" : "Chamber Dashboard"}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#111111]/70 dark:text-[#f3eee3]/70">Judicial Registry</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#d9541e] font-bold">Docket Exception (404)</span>
      </div>

      {/* Main Container Card */}
      <div className="relative rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 p-6 sm:p-10 shadow-sm overflow-hidden">
        {/* Subtle Background Watermark */}
        <div className="absolute right-4 bottom-2 pointer-events-none select-none text-[140px] sm:text-[200px] font-cinzel font-black tracking-widest text-[#111111]/[0.025] dark:text-[#f3eee3]/[0.025] leading-none">
          404
        </div>
        <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#d9541e]/50 dark:via-[#ea6026]/60 to-transparent" />

        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
              <FileQuestion className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-mono font-bold uppercase tracking-wider bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/25">
                  Chamber Registry Exception · 404
                </span>
                <span className="text-xs text-[#111111]/40 dark:text-[#f3eee3]/40">•</span>
                <span className="text-xs text-[#111111]/60 dark:text-[#f3eee3]/60 font-serif">
                  Cause List Index Miss
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-[#111111] dark:text-[#f3eee3] tracking-tight">
                Matter Docket Not Listed on Board
              </h2>
              <p className="text-xs sm:text-sm text-[#111111]/70 dark:text-[#f3eee3]/70 font-serif italic max-w-xl">
                The judicial record, cause list entry, or chamber workspace view you attempted to access cannot be located in the current judicial roll.
              </p>
            </div>
          </div>

          {/* Diagnostic Metadata Panel */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#faf8f5] dark:bg-[#202020] border border-[#111111]/10 dark:border-[#f3eee3]/10 space-y-3 font-serif">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#111111]/60 dark:text-[#f3eee3]/60 pb-2 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
              <span className="font-bold text-[#d9541e] uppercase tracking-wider">Docket Diagnostic Trace</span>
              <span>Rule 36 BCI Security Perimeter</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10.5px] font-cinzel text-[#111111]/50 dark:text-[#f3eee3]/50 block">Exception Code:</span>
                <span className="font-mono font-semibold text-[#111111] dark:text-[#f3eee3]">ERR_DOCKET_INDEX_404</span>
              </div>
              <div>
                <span className="text-[10.5px] font-cinzel text-[#111111]/50 dark:text-[#f3eee3]/50 block">Chamber Privacy:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Enforced (Active)</span>
              </div>
              <div>
                <span className="text-[10.5px] font-cinzel text-[#111111]/50 dark:text-[#f3eee3]/50 block">Session Identity:</span>
                <span className="font-mono text-[#111111] dark:text-[#f3eee3] truncate block">
                  {currentUser?.name || "Anonymous Counsel"} ({currentUser?.role?.toUpperCase() || "GUEST"})
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={mainDashboardHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d9541e] hover:bg-[#bf4513] text-white text-xs font-cinzel font-bold tracking-wider transition-all shadow-md cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{isAdmin ? "Return to Super Admin Console" : "Return to Daily Cause List"}</span>
            </Link>

            <Link
              href={mattersHref}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#1e1e1e] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-all shadow-xs"
            >
              <Briefcase className="w-4 h-4 text-[#d9541e]" />
              <span>{mattersLabel}</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin/logs"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#1e1e1e] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs font-cinzel font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-all shadow-xs"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Inspect Error &amp; Audit Logs</span>
              </Link>
            )}

            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-cinzel font-semibold text-[#111111]/70 dark:text-[#f3eee3]/70 hover:text-[#111111] dark:hover:text-white transition-colors ml-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Previous Page</span>
            </button>
          </div>
        </div>
      </div>

      {/* Advisory Guidance Box */}
      <div className="p-5 rounded-2xl bg-white/60 dark:bg-[#181818]/60 border border-[#111111]/10 dark:border-[#f3eee3]/10 text-xs font-serif text-[#111111]/70 dark:text-[#f3eee3]/70 space-y-2">
        <h4 className="font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] flex items-center gap-2 text-xs">
          <HelpCircle className="w-3.5 h-3.5 text-[#d9541e]" />
          <span>Why is this judicial matter not displayed?</span>
        </h4>
        <ul className="list-disc list-inside space-y-1 text-[11.5px] leading-relaxed text-[#111111]/60 dark:text-[#f3eee3]/60 pl-1">
          <li><strong>Cross-Chamber Scoping:</strong> Rule 36 BCI strictly prevents access to dockets instituted under other advocates.</li>
          <li><strong>Pending Verification:</strong> Fresh associate drafts require Advocate verification desk sign-off before entering the official cause list.</li>
          <li><strong>Typographical Check:</strong> Verify the case CNR or matter ID in your briefing folio.</li>
        </ul>
      </div>
    </div>
  );
}
