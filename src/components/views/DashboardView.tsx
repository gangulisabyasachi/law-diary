"use client";

import React, { useState } from "react";
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
  Search,
  Gavel,
  ShieldAlert,
  Sparkles,
  Copy,
  Check,
  Receipt,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function DashboardView() {
  const { state, currentUser, openCase, setActivePage, openModal, addToast } = useChamber();
  const [filterCourt, setFilterCourt] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "tomorrow">("all");
  const [copiedCNR, setCopiedCNR] = useState<string | null>(null);

  if (!state || !currentUser) return null;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const tomorrowStr = new Date(now.getTime() + 86400000).toISOString().slice(0, 10);

  // Visible cases based on chamber hierarchy
  const visibleCases = state.cases.filter((c) => {
    if (currentUser.role === "client") return c.clientId === currentUser.id;
    if (currentUser.role === "associate") {
      return (
        c.associateIds.includes(currentUser.id) ||
        (c.lawyerId || "u-lawyer") === (currentUser.lawyerId || "u-lawyer")
      );
    }
    if (currentUser.role === "lawyer") return (c.lawyerId || "u-lawyer") === currentUser.id;
    return true;
  });

  const activeCases = visibleCases.filter((c) => c.status !== "Disposed");

  // Fee calculation for chamber accounting
  const totalFeeAgreed = visibleCases.reduce((acc, c) => acc + (c.feeAgreed || 0), 0);
  const totalFeeReceived = visibleCases.reduce((acc, c) => acc + (c.feeReceived || 0), 0);
  const totalFeePending = Math.max(0, totalFeeAgreed - totalFeeReceived);

  // Upcoming hearings sorted chronologically
  const upcomingHearings = visibleCases
    .flatMap((c) =>
      c.hearings
        .filter((h) => h.date >= todayStr)
        .map((h) => ({ ...h, caseItem: c }))
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  const todayHearings = upcomingHearings.filter((h) => h.date === todayStr);
  const tomorrowHearings = upcomingHearings.filter((h) => h.date === tomorrowStr);

  const filteredHearings = upcomingHearings.filter((h) => {
    // 1. Date Filter (All vs Today vs Tomorrow)
    if (dateFilter === "today" && h.date !== todayStr) return false;
    if (dateFilter === "tomorrow" && h.date !== tomorrowStr) return false;

    // 2. Court Bench Filter
    if (filterCourt === "all") return true;
    return h.caseItem.court.toLowerCase().includes(filterCourt.toLowerCase());
  });

  const myCases = state.cases.filter((c) => (c.lawyerId || "u-lawyer") === currentUser.id);
  const myCaseIds = new Set(myCases.map((c) => c.id));
  const myAssociates = state.users.filter((u) => u.role === "associate" && (u.lawyerId || "u-lawyer") === currentUser.id);
  const myAssociateIds = new Set(myAssociates.map((u) => u.id));

  const pendingApprovalsCount =
    currentUser.role === "associate"
      ? state.approvals.filter((a) => a.by === currentUser.id).length
      : currentUser.role === "lawyer"
      ? state.approvals.filter((a) => {
          const cId = a.payload?.caseId || a.payload?.case?.id;
          return myCaseIds.has(cId) || myAssociateIds.has(a.by) || a.by === currentUser.id;
        }).length
      : state.approvals.length;

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getDayMonth = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    return { day: d.getDate(), mon: d.toLocaleDateString("en-IN", { month: "short" }) };
  };

  const handleCopyCNR = (e: React.MouseEvent, cnr: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cnr);
    setCopiedCNR(cnr);
    addToast(`Copied CNR Number: ${cnr}`, "info");
    setTimeout(() => setCopiedCNR(null), 2500);
  };

  // Statutory limitation deadlines under Limitation Act, 1963
  const limitationItems = visibleCases
    .filter((c) => c.limitationDate && c.status !== "Disposed")
    .map((c) => {
      const target = new Date(c.limitationDate + "T00:00:00").getTime();
      const nowMs = new Date().getTime();
      const daysLeft = Math.ceil((target - nowMs) / (1000 * 60 * 60 * 24));
      return { caseItem: c, daysLeft, task: c.limitationTask || "Statutory Limitation Filing" };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const handlePrintCauseList = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Real Litigation Status Header Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] text-[#0f172a] dark:text-[#f8fafc] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-all">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] dark:from-[#2563eb] dark:to-[#1e3a8a] border border-[#3b82f6]/30 flex items-center justify-center text-[#fbbf24] shadow-sm flex-shrink-0">
            <Gavel className="w-5 h-5 text-[#fbbf24]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wide text-[#1e3a8a] dark:text-[#60a5fa] uppercase">
                DAILY CAUSE LIST &amp; CHAMBER CAUSE BOARD
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
              </span>
            </div>
            <p className="text-xs text-[#475569] dark:text-[#94a3b8] mt-0.5">
              Sher Shah Road (Delhi High Court) · Tis Hazari Courts · NCLT Principal Bench · Supreme Court Registry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
            <button
              onClick={() => openModal("add-case")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1e3a8a] hover:bg-[#172554] dark:bg-[#2563eb] text-white font-bold text-xs tracking-wide transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#fbbf24]" /> + File Fresh Matter
            </button>
          )}

          <button
            onClick={handlePrintCauseList}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#f8fafc] dark:bg-[#161f30] hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b] text-[#0f172a] dark:text-[#f8fafc] text-xs font-semibold tracking-wide border border-[#cbd5e1] dark:border-[#334155] transition-colors shadow-xs"
            title="Print Official Chamber Cause List"
          >
            <Printer className="w-3.5 h-3.5 text-[#1e3a8a] dark:text-[#60a5fa]" /> Print Cause List
          </button>
        </div>
      </div>

      {/* KPI Stat Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs flex items-center justify-between group hover:border-[#1e3a8a] transition-all">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] text-[#1e3a8a] dark:text-[#60a5fa] font-bold">I.</span>
              <p className="text-[10px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Vakalatnama Dossier</p>
            </div>
            <p className="text-2xl font-bold text-[#0f172a] dark:text-white">{visibleCases.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#eff6ff] dark:bg-[#1e293b] text-[#1d4ed8] dark:text-[#60a5fa] border border-[#dbeafe] dark:border-[#334155] flex items-center justify-center font-bold shadow-xs">
            <Scale className="w-4 h-4" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs flex items-center justify-between group hover:border-emerald-500 transition-all">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">II.</span>
              <p className="text-[10px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Listed on Board</p>
            </div>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{upcomingHearings.length}</p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              {todayHearings.length} Today · {tomorrowHearings.length} Tomorrow
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#14231b] text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center font-bold shadow-xs">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        {/* Metric 3: Fee Collections or Active Pleadings */}
        {currentUser.role === "lawyer" || currentUser.role === "admin" ? (
          <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs flex items-center justify-between group hover:border-[#f59e0b] transition-all">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] text-[#f59e0b] font-bold">III.</span>
                <p className="text-[10px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Fee Collections</p>
              </div>
              <p className="text-2xl font-bold text-[#0f172a] dark:text-white">
                ₹{(totalFeeReceived / 1000).toFixed(0)}k
              </p>
              <span className="text-[10px] text-[#d97706] dark:text-[#fbbf24] font-medium">
                ₹{(totalFeePending / 1000).toFixed(0)}k Pending Dues
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-[#282212] text-[#d97706] dark:text-[#fbbf24] border border-amber-200 dark:border-amber-800/40 flex items-center justify-center font-bold shadow-xs">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs flex items-center justify-between group hover:border-blue-500 transition-all">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] text-blue-600 font-bold">III.</span>
                <p className="text-[10px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Active Pleadings</p>
              </div>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{activeCases.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#152336] text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center font-bold shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Metric 4 */}
        <div
          onClick={() => (currentUser.role === "lawyer" || currentUser.role === "admin" || currentUser.role === "associate") && setActivePage("approvals")}
          className={`p-4 rounded-xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs flex items-center justify-between group transition-all ${
            pendingApprovalsCount > 0 ? "cursor-pointer hover:border-[#1e3a8a]" : ""
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] text-[#1e3a8a] dark:text-[#60a5fa] font-bold">IV.</span>
              <p className="text-[10px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">
                {currentUser.role === "associate" ? "My Submissions" : "Verification Desk"}
              </p>
            </div>
            <p className={`text-2xl font-bold ${pendingApprovalsCount > 0 ? "text-[#1e3a8a] dark:text-[#60a5fa]" : "text-[#0f172a] dark:text-white"}`}>
              {pendingApprovalsCount}
            </p>
            <span className="text-[10px] text-[#64748b] dark:text-[#94a3b8]">
              {pendingApprovalsCount > 0 ? "Action Required" : "Up to date"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#eff6ff] dark:bg-[#1e293b] text-[#1d4ed8] dark:text-[#60a5fa] border border-[#dbeafe] dark:border-[#334155] flex items-center justify-center font-bold shadow-xs">
            <FileText className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Grid: Cause List (Left 8) + Limitation Tracker (Right 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Cause List with Today & Tomorrow Tabs */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#0f172a] dark:text-white flex items-center gap-2">
                <span>Daily Cause List &amp; Calling Board</span>
              </h2>
              <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                Court Room, Item Number, Presiding Bench &amp; Purpose of Listing
              </p>
            </div>

            {/* Bench Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f1f5f9] dark:bg-[#161f30] border border-[#e2e8f0] dark:border-[#1e293b]">
              <button
                onClick={() => setFilterCourt("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterCourt === "all"
                    ? "bg-white dark:bg-[#1e293b] text-[#0f172a] dark:text-white shadow-xs"
                    : "text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a]"
                }`}
              >
                All Benches
              </button>
              <button
                onClick={() => setFilterCourt("delhi")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterCourt === "delhi"
                    ? "bg-white dark:bg-[#1e293b] text-[#0f172a] dark:text-white shadow-xs"
                    : "text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a]"
                }`}
              >
                High Court
              </button>
              <button
                onClick={() => setFilterCourt("district")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterCourt === "district"
                    ? "bg-white dark:bg-[#1e293b] text-[#0f172a] dark:text-white shadow-xs"
                    : "text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a]"
                }`}
              >
                Tis Hazari
              </button>
              <button
                onClick={() => setFilterCourt("nclt")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterCourt === "nclt"
                    ? "bg-white dark:bg-[#1e293b] text-[#0f172a] dark:text-white shadow-xs"
                    : "text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a]"
                }`}
              >
                NCLT
              </button>
            </div>
          </div>

          {/* Today / Tomorrow / All Listed View Mode Tabs (digitallawyerdiary.com signature) */}
          <div className="flex items-center gap-2 border-b border-[#e2e8f0] dark:border-[#1e293b] pb-2">
            <button
              onClick={() => setDateFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                dateFilter === "all"
                  ? "bg-[#1e3a8a] dark:bg-[#2563eb] text-white shadow-xs"
                  : "text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a]"
              }`}
            >
              All Listed Matters ({upcomingHearings.length})
            </button>
            <button
              onClick={() => setDateFilter("today")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                dateFilter === "today"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a]"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Today's Board ({todayHearings.length})</span>
            </button>
            <button
              onClick={() => setDateFilter("tomorrow")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                dateFilter === "tomorrow"
                  ? "bg-[#1e3a8a] dark:bg-[#2563eb] text-white shadow-xs"
                  : "text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a]"
              }`}
            >
              Tomorrow's Board ({tomorrowHearings.length})
            </button>
          </div>

          {/* Hearing Items List */}
          <div className="space-y-3">
            {filteredHearings.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] text-center text-[#64748b] dark:text-[#94a3b8] shadow-xs">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-[#1e3a8a] dark:text-[#60a5fa]" />
                <p className="text-sm font-bold text-[#0f172a] dark:text-white">No hearings listed under this filter.</p>
                <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mt-1">Switch to "All Listed Matters" or select another court bench above.</p>
              </div>
            ) : (
              filteredHearings.map((h, i) => {
                const dateMeta = getDayMonth(h.date);
                const isToday = h.date === todayStr;
                const isTomorrow = h.date === tomorrowStr;

                return (
                  <div
                    key={h.caseItem.id + "-" + h.date + "-" + i}
                    onClick={() => openCase(h.caseItem.id)}
                    className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-[#cbd5e1] dark:border-[#1e293b] hover:border-[#1e3a8a] dark:hover:border-[#3b82f6] transition-all cursor-pointer shadow-xs group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Date Badge */}
                      <div
                        className={`w-13 h-13 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border font-mono transition-colors shadow-xs ${
                          isToday
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : isTomorrow
                            ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                            : "bg-[#f8fafc] dark:bg-[#161f30] text-[#0f172a] dark:text-white border-[#cbd5e1] dark:border-[#334155]"
                        }`}
                      >
                        <span className="text-base font-bold leading-none">{dateMeta.day}</span>
                        <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5">{dateMeta.mon}</span>
                        {isToday && (
                          <span className="text-[7px] font-bold uppercase tracking-widest text-emerald-100 mt-0.5">
                            TODAY
                          </span>
                        )}
                        {isTomorrow && (
                          <span className="text-[7px] font-bold uppercase tracking-widest text-blue-100 mt-0.5">
                            TMRW
                          </span>
                        )}
                      </div>

                      {/* Case Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-[#1e3a8a] dark:text-[#60a5fa]">
                            {h.caseItem.caseNo}
                          </span>
                          {h.caseItem.cnr && (
                            <button
                              onClick={(e) => handleCopyCNR(e, h.caseItem.cnr!)}
                              className="inline-flex items-center gap-1 text-[10px] font-mono text-[#64748b] dark:text-[#94a3b8] bg-[#f1f5f9] dark:bg-[#161f30] hover:bg-[#e2e8f0] px-2 py-0.5 rounded border border-[#cbd5e1] dark:border-[#334155] transition-colors"
                              title="Click to copy 16-character CNR"
                            >
                              <span>CNR: {h.caseItem.cnr}</span>
                              {copiedCNR === h.caseItem.cnr ? (
                                <Check className="w-2.5 h-2.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-2.5 h-2.5 opacity-60" />
                              )}
                            </button>
                          )}
                          {h.caseItem.courtRoom && (
                            <span className="text-[10px] font-mono font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-[#282212] px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/40">
                              {h.caseItem.courtRoom}
                            </span>
                          )}
                          {h.caseItem.itemNo && (
                            <span className="text-[10px] font-mono font-bold text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-[#14231b] px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                              {h.caseItem.itemNo}
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-[#0f172a] dark:text-white mt-1 group-hover:text-[#1e3a8a] dark:group-hover:text-[#60a5fa] transition-colors">
                          {h.caseItem.title}
                        </h3>

                        <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mt-0.5">
                          {h.caseItem.court} · {h.caseItem.judge || "Hon'ble Presiding Bench"}
                        </p>

                        <div className="mt-2.5 p-2.5 rounded-lg bg-[#f8fafc] dark:bg-[#161f30] border border-[#e2e8f0] dark:border-[#1e293b] text-xs">
                          <span className="font-bold text-[#0f172a] dark:text-white text-[11px]">Purpose of Listing: </span>
                          <span className="text-[#475569] dark:text-[#94a3b8]">{h.purpose || "Regular hearing board"}</span>
                          {h.outcome && (
                            <div className="mt-1 pt-1 border-t border-[#e2e8f0] dark:border-[#1e293b] text-[11px] text-[#64748b] dark:text-[#94a3b8]">
                              <strong className="text-[#0f172a] dark:text-white">Business Recorded: </strong>{h.outcome}
                            </div>
                          )}
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-[#94a3b8] group-hover:text-[#1e3a8a] dark:group-hover:text-[#60a5fa] group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 4 Cols: Limitation Period Radar & Expedited Entries */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#0f172a] dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Limitation Period Radar</span>
            </h2>
            <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
              Statutory deadlines under The Limitation Act, 1963
            </p>
          </div>

          <div className="space-y-3">
            {limitationItems.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] text-center text-[#64748b] dark:text-[#94a3b8] shadow-xs">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
                <p className="text-xs font-semibold text-[#0f172a] dark:text-white">No statutory limitation alerts pending.</p>
              </div>
            ) : (
              limitationItems.map((item, idx) => {
                const isUrgent = item.daysLeft <= 14;
                return (
                  <div
                    key={item.caseItem.id + "-lim-" + idx}
                    onClick={() => openCase(item.caseItem.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
                      isUrgent
                        ? "bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/50 text-rose-950 dark:text-rose-200 hover:border-rose-500"
                        : "bg-white dark:bg-[#111827] border-[#cbd5e1] dark:border-[#1e293b] hover:border-[#1e3a8a]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-[#1e3a8a] dark:text-[#60a5fa]">
                        {item.caseItem.caseNo}
                      </span>
                      <span
                        className={`text-[9.5px] font-bold px-2 py-0.5 rounded ${
                          isUrgent
                            ? "bg-rose-100 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200"
                            : "bg-[#f1f5f9] dark:bg-[#161f30] text-[#0f172a] dark:text-white"
                        }`}
                      >
                        {item.daysLeft > 0 ? `${item.daysLeft} DAYS LEFT` : "LIMITATION EXPIRED"}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-[#0f172a] dark:text-white truncate">
                      {item.caseItem.title}
                    </h4>

                    <p className="text-[11px] text-[#475569] dark:text-[#94a3b8] mt-1 leading-snug">
                      {item.task}
                    </p>

                    <div className="mt-2 pt-2 border-t border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between text-[10px] font-mono text-[#64748b] dark:text-[#94a3b8]">
                      <span>Due: {formatDate(item.caseItem.limitationDate || "")}</span>
                      <span className="text-[#1e3a8a] dark:text-[#60a5fa] font-semibold">Inspect Brief →</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Expedited Entries */}
          <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#111827] border border-[#cbd5e1] dark:border-[#1e293b] space-y-2.5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">
              Expedited Court Entries
            </h3>
            <button
              onClick={() => openModal("add-hearing")}
              className="w-full py-2.5 px-3 rounded-lg bg-white dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#334155] text-[#0f172a] dark:text-white text-xs font-semibold text-left hover:border-[#1e3a8a] transition-all flex items-center justify-between shadow-xs"
            >
              <span>Record Next Date of Hearing (NDOH)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#1e3a8a] dark:text-[#60a5fa]" />
            </button>
            <button
              onClick={() => openModal("add-order")}
              className="w-full py-2.5 px-3 rounded-lg bg-white dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#334155] text-[#0f172a] dark:text-white text-xs font-semibold text-left hover:border-[#1e3a8a] transition-all flex items-center justify-between shadow-xs"
            >
              <span>Enter Verbatim Judicial Order</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#1e3a8a] dark:text-[#60a5fa]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
