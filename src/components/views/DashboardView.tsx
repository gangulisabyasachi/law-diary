"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Scale,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  AlertTriangle,
  FileText,
  Plus,
  Building,
  Printer,
  Sparkles,
  Search,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function DashboardView() {
  const { state, currentUser, openCase, setActivePage, openModal } = useChamber();
  const [filterCause, setFilterCause] = useState<"all" | "urgent" | "regular">("all");

  if (!state || !currentUser) return null;

  const todayStr = new Date().toISOString().slice(0, 10);

  // Visible cases
  const visibleCases = state.cases.filter((c) => {
    if (currentUser.role === "client") return c.clientId === currentUser.id;
    if (currentUser.role === "associate") return c.associateIds.includes(currentUser.id);
    return true;
  });

  const activeCases = visibleCases.filter((c) => c.status !== "Disposed");

  // Upcoming hearings
  const upcomingHearings = visibleCases
    .flatMap((c) =>
      c.hearings
        .filter((h) => h.date >= todayStr)
        .map((h) => ({ ...h, caseItem: c }))
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  const pendingApprovalsCount =
    currentUser.role === "associate"
      ? state.approvals.filter((a) => a.by === currentUser.id).length
      : state.approvals.length;

  // Format date helper
  const formatDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getDayMonth = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    return { day: d.getDate(), mon: d.toLocaleDateString("en-IN", { month: "short" }) };
  };

  // Statutory limitation deadlines
  const limitationItems = visibleCases
    .filter((c) => c.limitationDate && c.status !== "Disposed")
    .map((c) => {
      const target = new Date(c.limitationDate + "T00:00:00").getTime();
      const now = new Date().getTime();
      const daysLeft = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
      return { caseItem: c, daysLeft, task: c.limitationTask || "Statutory deadline" };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const statusColor: Record<string, string> = {
    Active: "bg-[#edf6f0] text-[#1b5e3a] border-[#cce4d4]",
    Listed: "bg-[#edf3f8] text-[#1c4d75] border-[#caddee]",
    Reserved: "bg-[#f5f2eb] text-[#5c4932] border-[#ded7c8]",
    Adjourned: "bg-[#fcf5ec] text-[#7a491c] border-[#ebd8c4]",
    Disposed: "bg-[#f3f2ef] text-[#5c5852] border-[#dcd9d4]",
  };

  const handlePrintCauseList = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Real Litigation Status Header Bar */}
      <div className="p-4 rounded-xl bg-[#14171a] border border-[#252930] text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#20252b] text-[#c5a059] flex items-center justify-center font-bold border border-[#c5a059]/30">
            <Building className="w-5 h-5 text-[#c5a059]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono tracking-wider text-[#c5a059]">
                DAILY CAUSE LIST ACTIVE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
              <span className="text-[10px] text-[#9ca3af] font-mono">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
              </span>
            </div>
            <p className="text-xs text-[#d1d5db] mt-0.5 font-serif">
              High Court of Delhi · National Company Law Tribunal · District Benches
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
            <button
              onClick={() => openModal("add-case")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c5a059] text-[#14171a] font-bold text-xs hover:bg-[#d4b067] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> + New Brief
            </button>
          )}

          <button
            onClick={handlePrintCauseList}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22262d] hover:bg-[#2b313a] text-[#e5e7eb] text-xs font-medium border border-[#343a45] transition-colors"
            title="Print-Ready Cause List"
          >
            <Printer className="w-3.5 h-3.5 text-[#9ca3af]" /> Print Roster
          </button>
        </div>
      </div>

      {/* KPI Stat Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-[#e6e2d8] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold font-display text-[#191817]">{visibleCases.length}</p>
            <p className="text-[10px] font-mono font-medium text-[#736e65] uppercase tracking-wider mt-0.5">Total Briefs</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#f5f3ee] text-[#5c5852] flex items-center justify-center font-bold">
            <Scale className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e6e2d8] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold font-display text-[#1b5e3a]">{activeCases.length}</p>
            <p className="text-[10px] font-mono font-medium text-[#736e65] uppercase tracking-wider mt-0.5">Active Matters</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#edf6f0] text-[#1b5e3a] flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e6e2d8] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold font-display text-[#805e26]">{upcomingHearings.length}</p>
            <p className="text-[10px] font-mono font-medium text-[#736e65] uppercase tracking-wider mt-0.5">Upcoming Dates</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#fdf8f0] text-[#805e26] flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e6e2d8] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold font-display text-[#991b1b]">{pendingApprovalsCount}</p>
            <p className="text-[10px] font-mono font-medium text-[#736e65] uppercase tracking-wider mt-0.5">
              {currentUser.role === "associate" ? "Awaiting Review" : "Pending Sign-off"}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#fef2f2] text-[#991b1b] flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Grid: Active Docket + Statutory Limitation Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Cause List & Docket Records */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-[#e6e2d8] shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#e6e2d8] flex items-center justify-between bg-[#fbfaf8]">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#805e26]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#191817] font-display">
                  Active Chamber Matters
                </h3>
              </div>
              <button
                onClick={() => setActivePage("cases")}
                className="text-xs font-semibold text-[#805e26] hover:text-[#5c431b] flex items-center gap-1"
              >
                All Matters <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-[#f0ece4] overflow-x-auto text-xs">
              {visibleCases.slice(0, 6).map((c) => {
                const nextHearing = c.hearings
                  .filter((h) => h.date >= todayStr)
                  .sort((a, b) => a.date.localeCompare(b.date))[0];

                return (
                  <div
                    key={c.id}
                    onClick={() => openCase(c.id)}
                    className="p-4 hover:bg-[#faf8f5] cursor-pointer transition-colors flex items-center justify-between gap-4 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-[#805e26] bg-[#fbf6ee] px-2 py-0.5 rounded border border-[#ecdac2]">
                          {c.caseNo}
                        </span>
                        <p className="font-bold text-[#191817] group-hover:text-[#805e26] transition-colors truncate font-serif">
                          {c.title}
                        </p>
                      </div>
                      <p className="text-[11px] text-[#635f59] mt-1 flex items-center gap-2">
                        <span>{c.court}</span>
                        <span>·</span>
                        <span>Stage: <strong className="text-[#191817]">{c.stage}</strong></span>
                        {c.courtRoom && (
                          <>
                            <span>·</span>
                            <span className="text-[#635f59] font-mono">[{c.courtRoom}]</span>
                          </>
                        )}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColor[c.status] || ""}`}>
                        {c.status}
                      </span>
                      {nextHearing && (
                        <p className="text-[11px] font-semibold text-[#191817] mt-1">
                          Next: {formatDate(nextHearing.date)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Statutory Limitation Radar & Cause List Snippet */}
        <div className="lg:col-span-4 space-y-6">
          {/* Statutory Limitation Radar */}
          <div className="bg-white rounded-xl border border-[#e6e2d8] shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#991b1b]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#191817] font-display">
                  Limitation Radar
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#736e65]">Statutory Deadlines</span>
            </div>

            <div className="space-y-2.5">
              {limitationItems.slice(0, 4).map((item, idx) => {
                const isUrgent = item.daysLeft <= 14;
                return (
                  <div
                    key={idx}
                    onClick={() => openCase(item.caseItem.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isUrgent
                        ? "bg-[#fdf6f6] border-[#f2d8d8] hover:bg-[#fbf0f0]"
                        : "bg-[#faf8f5] border-[#e6e2d8] hover:bg-[#f5f2ec]"
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="font-mono text-[11px] text-[#191817]">{item.caseItem.caseNo}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                          isUrgent ? "bg-[#991b1b] text-white" : "bg-[#edeae2] text-[#423e38]"
                        }`}
                      >
                        {item.daysLeft > 0 ? `${item.daysLeft}d left` : "Overdue"}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5e5a54] mt-1 line-clamp-2 leading-relaxed font-serif">
                      {item.task}
                    </p>
                  </div>
                );
              })}

              {limitationItems.length === 0 && (
                <p className="text-xs text-[#8c877e] italic p-3 text-center">
                  No limitation deadlines recorded.
                </p>
              )}
            </div>
          </div>

          {/* Next Cause List Item */}
          <div className="bg-white rounded-xl border border-[#e6e2d8] shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1c4d75]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#191817] font-display">
                  Daily Cause List
                </h4>
              </div>
              <button
                onClick={() => setActivePage("calendar")}
                className="text-[11px] font-semibold text-[#1c4d75] hover:underline"
              >
                Full Calendar
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingHearings.slice(0, 3).map((h, idx) => {
                const dm = getDayMonth(h.date);
                return (
                  <div
                    key={idx}
                    onClick={() => openCase(h.caseItem.id)}
                    className="p-3 rounded-lg border border-[#e6e2d8] hover:border-[#cfc9be] hover:bg-[#faf8f5] cursor-pointer transition-colors flex items-center gap-3 text-xs"
                  >
                    <div className="w-9 h-9 rounded bg-[#14171a] text-[#c5a059] flex flex-col items-center justify-center font-display flex-shrink-0">
                      <span className="text-xs font-bold leading-tight">{dm.day}</span>
                      <span className="text-[9px] uppercase font-mono font-medium">{dm.mon}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[#191817] truncate font-serif">{h.purpose}</p>
                      <p className="text-[11px] text-[#635f59] truncate font-mono">
                        {h.caseItem.caseNo} · {h.caseItem.court}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
