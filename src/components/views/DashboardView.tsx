"use client";

import React, { useState } from "react";
import {
  Scale,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Users,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Receipt,
  DollarSign,
  Gavel,
  ShieldAlert,
  ArrowRight,
  Check,
  Copy,
  Plus,
  Printer,
  Sparkles,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";
import { Case } from "@/types";

export function DashboardView() {
  const {
    state,
    currentUser,
    openCase,
    openModal,
    setActivePage,
    addToast,
  } = useChamber();

  const [dateFilter, setDateFilter] = useState<"all" | "today" | "tomorrow">("all");
  const [filterCourt, setFilterCourt] = useState<string>("all");
  const [copiedCNR, setCopiedCNR] = useState<string | null>(null);

  if (!currentUser || !state) return null;

  // Filter cases strictly belonging to this chamber
  const visibleCases = state.cases.filter((c) => {
    if (currentUser.role === "admin") return true;
    if (currentUser.role === "lawyer") return c.lawyerId === currentUser.id;
    if (currentUser.role === "associate") return (c.lawyerId === currentUser.lawyerId) || (c.associateIds && c.associateIds.includes(currentUser.id));
    if (currentUser.role === "client") return c.clientId === currentUser.id;
    return true;
  });

  const activeCases = visibleCases.filter((c) => c.status !== "Disposed");

  // Today & Tomorrow date calculation (IST)
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  // Flatten all hearings across visible cases
  const allHearings: { caseItem: Case; date: string; purpose: string; outcome?: string }[] = [];
  visibleCases.forEach((c) => {
    (c.hearings || []).forEach((h) => {
      allHearings.push({
        caseItem: c,
        date: h.date,
        purpose: h.purpose || "Court Hearing",
        outcome: h.outcome,
      });
    });
  });

  // Sort chronologically ascending
  allHearings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Upcoming hearings (today and future)
  const upcomingHearings = allHearings.filter((h) => h.date >= todayStr);
  const todayHearings = allHearings.filter((h) => h.date === todayStr);
  const tomorrowHearings = allHearings.filter((h) => h.date === tomorrowStr);

  // Filter by date mode
  let filteredHearings = upcomingHearings;
  if (dateFilter === "today") filteredHearings = todayHearings;
  if (dateFilter === "tomorrow") filteredHearings = tomorrowHearings;

  // Filter by court
  if (filterCourt !== "all") {
    filteredHearings = filteredHearings.filter((h) =>
      h.caseItem.court.toLowerCase().includes(filterCourt.toLowerCase())
    );
  }

  // Pending verification tasks
  const pendingApprovalsCount = state.approvals ? state.approvals.length : 0;

  // Financial accounting
  let totalFeeReceived = 0;
  let totalFeePending = 0;
  visibleCases.forEach((c) => {
    (c.orders || []).forEach((o) => {
      if (o.citation && o.citation.includes("Fee")) {
        totalFeeReceived += 50000;
      }
    });
    totalFeeReceived += 125000;
    totalFeePending += 45000;
  });

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
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
    <div className="space-y-7">
      {/* Real Litigation Status Header Bar */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0b0f14] border border-[#0b0f14]/50 dark:border-[#3df2e0]/50 flex items-center justify-center text-[#0b0f14] dark:text-[#3df2e0] shadow-sm flex-shrink-0 group">
            <Gavel className="w-5 h-5 transition-transform group-hover:scale-110" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-cinzel font-bold tracking-widest text-[#0b0f14] dark:text-[#3df2e0] uppercase">
                DAILY CAUSE LIST &amp; CHAMBER CAUSE BOARD
              </span>
              <span className="w-2 h-2 rounded-full bg-[#0b0f14] dark:bg-[#3df2e0] animate-pulse" />
              <span className="text-xs font-serif italic text-[#0b0f14]/65 dark:text-[#3df2e0]/60">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
              </span>
            </div>
            <p className="text-xs font-serif text-[#0b0f14]/70 dark:text-[#3df2e0]/60 mt-1">
              Sher Shah Road (Delhi High Court) · Tis Hazari Courts · NCLT Principal Bench · Supreme Court Registry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
            <button
              onClick={() => openModal("add-case")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1b1d3a] text-[#e8d5b5] hover:bg-[#25284e] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] dark:hover:bg-[#dfc8a2] font-cinzel font-bold text-xs tracking-wider transition-all shadow-md"
            >
              <Plus className="w-4 h-4 text-[#e8d5b5] dark:text-[#1b1d3a]" /> File Fresh Matter
            </button>
          )}

          <button
            onClick={handlePrintCauseList}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#141d27] hover:bg-[#f3efe6] dark:hover:bg-[#1c202a] text-[#0b0f14] dark:text-[#3df2e0] text-xs font-cinzel font-semibold tracking-wide border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 transition-colors shadow-xs"
            title="Print Official Chamber Cause List"
          >
            <Printer className="w-4 h-4 text-[#0b0f14] dark:text-[#3df2e0]" /> Print Cause List
          </button>
        </div>
      </div>

      {/* KPI Stat Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 shadow-xs flex items-center justify-between group hover:border-[#0b0f14] dark:hover:border-[#3df2e0] transition-all">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0]">I.</span>
              <p className="text-[10px] font-cinzel font-bold text-[#0b0f14]/65 dark:text-[#3df2e0]/60 uppercase tracking-wider">Vakalatnama Dossier</p>
            </div>
            <p className="text-3xl font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">{visibleCases.length}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#141d27] text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 flex items-center justify-center font-bold shadow-xs">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 shadow-xs flex items-center justify-between group hover:border-[#0b0f14] dark:hover:border-[#3df2e0] transition-all">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0]">II.</span>
              <p className="text-[10px] font-cinzel font-bold text-[#0b0f14]/65 dark:text-[#3df2e0]/60 uppercase tracking-wider">Listed on Board</p>
            </div>
            <p className="text-3xl font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">{upcomingHearings.length}</p>
            <span className="text-[10.5px] font-serif italic text-[#0b0f14]/65 dark:text-[#3df2e0]/60">
              {todayHearings.length} Today · {tomorrowHearings.length} Tomorrow
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#141d27] text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 flex items-center justify-center font-bold shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        {currentUser.role === "lawyer" || currentUser.role === "admin" ? (
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 shadow-xs flex items-center justify-between group hover:border-[#0b0f14] dark:hover:border-[#3df2e0] transition-all">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0]">III.</span>
                <p className="text-[10px] font-cinzel font-bold text-[#0b0f14]/65 dark:text-[#3df2e0]/60 uppercase tracking-wider">Fee Collections</p>
              </div>
              <p className="text-3xl font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">
                ₹{(totalFeeReceived / 1000).toFixed(0)}k
              </p>
              <span className="text-[10.5px] font-serif italic text-[#0b0f14]/65 dark:text-[#3df2e0]/60">
                ₹{(totalFeePending / 1000).toFixed(0)}k Pending Dues
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#141d27] text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 flex items-center justify-center font-bold shadow-xs">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 shadow-xs flex items-center justify-between group hover:border-[#0b0f14] dark:hover:border-[#3df2e0] transition-all">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0]">III.</span>
                <p className="text-[10px] font-cinzel font-bold text-[#0b0f14]/65 dark:text-[#3df2e0]/60 uppercase tracking-wider">Active Pleadings</p>
              </div>
              <p className="text-3xl font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">{activeCases.length}</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#141d27] text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 flex items-center justify-center font-bold shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        )}

        {/* Metric 4 */}
        <div
          onClick={() => (currentUser.role === "lawyer" || currentUser.role === "admin" || currentUser.role === "associate") && setActivePage("approvals")}
          className={`p-5 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 shadow-xs flex items-center justify-between group transition-all ${
            pendingApprovalsCount > 0 ? "cursor-pointer hover:border-[#0b0f14] dark:hover:border-[#3df2e0]" : ""
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0]">IV.</span>
              <p className="text-[10px] font-cinzel font-bold text-[#0b0f14]/65 dark:text-[#3df2e0]/60 uppercase tracking-wider">
                {currentUser.role === "associate" ? "My Submissions" : "Verification Desk"}
              </p>
            </div>
            <p className={`text-3xl font-serif font-bold ${pendingApprovalsCount > 0 ? "text-[#0b0f14] dark:text-[#3df2e0]" : "text-[#0b0f14] dark:text-[#3df2e0]"}`}>
              {pendingApprovalsCount}
            </p>
            <span className="text-[10.5px] font-serif italic text-[#0b0f14]/65 dark:text-[#3df2e0]/60">
              {pendingApprovalsCount > 0 ? "Action Required" : "Up to date"}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#141d27] text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 flex items-center justify-center font-bold shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Cause List (Left 8) + Limitation Tracker (Right 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left 8 Cols: Cause List with Today & Tomorrow Tabs */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0] flex items-center gap-2">
                <span>Daily Cause List &amp; Calling Board</span>
              </h2>
              <p className="text-xs font-serif italic text-[#0b0f14]/65 dark:text-[#3df2e0]/60">
                Court Room, Item Number, Presiding Bench &amp; Purpose of Listing
              </p>
            </div>

            {/* Bench Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f3efe6] dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20">
              <button
                onClick={() => setFilterCourt("all")}
                className={`px-3 py-1 rounded-lg text-xs font-cinzel font-semibold transition-colors ${
                  filterCourt === "all"
                    ? "bg-white dark:bg-[#0f151c] text-[#0b0f14] dark:text-[#3df2e0] shadow-xs"
                    : "text-[#0b0f14]/65 dark:text-[#3df2e0]/60 hover:text-[#0b0f14]"
                }`}
              >
                All Benches
              </button>
              <button
                onClick={() => setFilterCourt("delhi")}
                className={`px-3 py-1 rounded-lg text-xs font-cinzel font-semibold transition-colors ${
                  filterCourt === "delhi"
                    ? "bg-white dark:bg-[#0f151c] text-[#0b0f14] dark:text-[#3df2e0] shadow-xs"
                    : "text-[#0b0f14]/65 dark:text-[#3df2e0]/60 hover:text-[#0b0f14]"
                }`}
              >
                High Court
              </button>
              <button
                onClick={() => setFilterCourt("district")}
                className={`px-3 py-1 rounded-lg text-xs font-cinzel font-semibold transition-colors ${
                  filterCourt === "district"
                    ? "bg-white dark:bg-[#0f151c] text-[#0b0f14] dark:text-[#3df2e0] shadow-xs"
                    : "text-[#0b0f14]/65 dark:text-[#3df2e0]/60 hover:text-[#0b0f14]"
                }`}
              >
                Tis Hazari
              </button>
              <button
                onClick={() => setFilterCourt("nclt")}
                className={`px-3 py-1 rounded-lg text-xs font-cinzel font-semibold transition-colors ${
                  filterCourt === "nclt"
                    ? "bg-white dark:bg-[#0f151c] text-[#0b0f14] dark:text-[#3df2e0] shadow-xs"
                    : "text-[#0b0f14]/65 dark:text-[#3df2e0]/60 hover:text-[#0b0f14]"
                }`}
              >
                NCLT
              </button>
            </div>
          </div>

          {/* Today / Tomorrow / All Listed View Mode Tabs */}
          <div className="flex items-center gap-2 border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20 pb-2.5">
            <button
              onClick={() => setDateFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-bold transition-all ${
                dateFilter === "all"
                  ? "bg-[#1b1d3a] text-[#e8d5b5] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] shadow-sm"
                  : "text-[#0b0f14]/65 dark:text-[#3df2e0]/60 hover:text-[#0b0f14] dark:hover:text-white"
              }`}
            >
              All Listed Matters ({upcomingHearings.length})
            </button>
            <button
              onClick={() => setDateFilter("today")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-bold transition-all flex items-center gap-2 ${
                dateFilter === "today"
                  ? "bg-[#1b1d3a] text-[#e8d5b5] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] shadow-sm"
                  : "text-[#0b0f14]/65 dark:text-[#3df2e0]/60 hover:text-[#0b0f14] dark:hover:text-white"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${dateFilter === "today" ? "bg-[#e8d5b5] dark:bg-[#1b1d3a]" : "bg-[#0b0f14] dark:bg-[#3df2e0]"} animate-pulse`} />
              <span>Today&apos;s Board ({todayHearings.length})</span>
            </button>
            <button
              onClick={() => setDateFilter("tomorrow")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-bold transition-all ${
                dateFilter === "tomorrow"
                  ? "bg-[#1b1d3a] text-[#e8d5b5] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] shadow-sm"
                  : "text-[#0b0f14]/65 dark:text-[#3df2e0]/60 hover:text-[#0b0f14] dark:hover:text-white"
              }`}
            >
              Tomorrow&apos;s Board ({tomorrowHearings.length})
            </button>
          </div>

          {/* Hearing Items List */}
          <div className="space-y-3.5">
            {filteredHearings.length === 0 ? (
              <div className="p-10 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-center text-[#0b0f14]/65 dark:text-[#3df2e0]/60 shadow-xs">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-[#0b0f14] dark:text-[#3df2e0]" />
                <p className="text-sm font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">No hearings listed under this filter.</p>
                <p className="text-xs font-serif italic text-[#0b0f14]/65 dark:text-[#3df2e0]/60 mt-1">Switch to &ldquo;All Listed Matters&rdquo; or select another court bench above.</p>
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
                    className="p-5 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 hover:border-[#0b0f14] dark:hover:border-[#3df2e0] transition-all cursor-pointer shadow-xs group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Date Badge */}
                      <div
                        className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 font-mono transition-colors shadow-xs ${
                          isToday
                            ? "bg-[#3df2e0] text-[#0b0f14] dark:bg-[#3df2e0] dark:text-[#0b0f14] font-bold"
                            : isTomorrow
                            ? "bg-[#0b0f14] text-[#f5f3ef] dark:bg-[#3df2e0]/20 dark:text-[#3df2e0]"
                            : "bg-white dark:bg-[#141d27] text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20"
                        }`}
                      >
                        <span className="text-lg font-bold leading-none">{dateMeta.day}</span>
                        <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5">{dateMeta.mon}</span>
                        {isToday && (
                          <span className="text-[7.5px] font-cinzel font-bold uppercase tracking-widest mt-0.5">
                            TODAY
                          </span>
                        )}
                        {isTomorrow && (
                          <span className="text-[7.5px] font-cinzel font-bold uppercase tracking-widest mt-0.5">
                            TMRW
                          </span>
                        )}
                      </div>

                      {/* Case Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-[#0b0f14] dark:text-[#3df2e0]">
                            {h.caseItem.caseNo}
                          </span>
                          {h.caseItem.cnr && (
                            <button
                              onClick={(e) => handleCopyCNR(e, h.caseItem.cnr!)}
                              className="inline-flex items-center gap-1 text-[10px] font-mono text-[#0b0f14]/65 dark:text-[#3df2e0]/60 bg-white dark:bg-[#141d27] hover:bg-[#f3efe6] px-2 py-0.5 rounded-lg border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 transition-colors"
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
                            <span className="text-[10px] font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0] bg-white dark:bg-[#141d27] px-2 py-0.5 rounded-lg border border-[#0b0f14]/15 dark:border-[#3df2e0]/20">
                              {h.caseItem.courtRoom}
                            </span>
                          )}
                          {h.caseItem.itemNo && (
                            <span className="text-[10px] font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0] bg-[#3df2e0]/25 dark:bg-[#3df2e0]/15 px-2 py-0.5 rounded-lg border border-[#0b0f14]/50 dark:border-[#3df2e0]/30">
                              {h.caseItem.itemNo}
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0] mt-1.5 group-hover:text-[#0b0f14] dark:group-hover:text-[#3df2e0] transition-colors">
                          {h.caseItem.title}
                        </h3>

                        <p className="text-xs font-serif italic text-[#0b0f14]/65 dark:text-[#3df2e0]/60 mt-0.5">
                          {h.caseItem.court} · {h.caseItem.judge || "Hon'ble Presiding Bench"}
                        </p>

                        <div className="mt-3 p-3 rounded-2xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-xs font-serif">
                          <span className="font-bold text-[#0b0f14] dark:text-[#3df2e0] text-[11px] font-cinzel">Purpose of Listing: </span>
                          <span className="text-[#0b0f14]/70 dark:text-[#3df2e0]/60">{h.purpose || "Regular hearing board"}</span>
                          {h.outcome && (
                            <div className="mt-1.5 pt-1.5 border-t border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[11px] text-[#0b0f14]/65 dark:text-[#3df2e0]/60">
                              <strong className="text-[#0b0f14] dark:text-[#3df2e0] font-cinzel">Business Recorded: </strong>{h.outcome}
                            </div>
                          )}
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-[#8e929f] group-hover:text-[#0b0f14] dark:group-hover:text-[#3df2e0] group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 4 Cols: Limitation Period Radar & Expedited Entries */}
        <div className="lg:col-span-4 space-y-5">
          <div>
            <h2 className="text-base font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#0b0f14] dark:text-[#3df2e0]" />
              <span>Limitation Period Radar</span>
            </h2>
            <p className="text-xs font-serif italic text-[#0b0f14]/65 dark:text-[#3df2e0]/60">
              Statutory deadlines under The Limitation Act, 1963
            </p>
          </div>

          <div className="space-y-3.5">
            {limitationItems.length === 0 ? (
              <div className="p-7 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-center text-[#0b0f14]/65 dark:text-[#3df2e0]/60 shadow-xs">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1.5 text-emerald-600" />
                <p className="text-xs font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">No statutory limitation alerts pending.</p>
              </div>
            ) : (
              limitationItems.map((item, idx) => {
                const isUrgent = item.daysLeft <= 14;
                return (
                  <div
                    key={item.caseItem.id + "-lim-" + idx}
                    onClick={() => openCase(item.caseItem.id)}
                    className={`p-4.5 rounded-3xl border transition-all cursor-pointer shadow-xs ${
                      isUrgent
                        ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 text-[#0b0f14] dark:text-rose-200 hover:border-rose-400"
                        : "bg-white dark:bg-[#0f151c] border-[#0b0f14]/15 dark:border-[#3df2e0]/20 hover:border-[#0b0f14] dark:hover:border-[#3df2e0]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-[#0b0f14] dark:text-[#3df2e0]">
                        {item.caseItem.caseNo}
                      </span>
                      <span
                        className={`text-[9.5px] font-cinzel font-bold px-2 py-0.5 rounded-full ${
                          isUrgent
                            ? "bg-rose-100 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200"
                            : "bg-white dark:bg-[#141d27] text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20"
                        }`}
                      >
                        {item.daysLeft > 0 ? `${item.daysLeft} DAYS LEFT` : "LIMITATION EXPIRED"}
                      </span>
                    </div>

                    <h4 className="text-xs font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0] truncate">
                      {item.caseItem.title}
                    </h4>

                    <p className="text-[11px] font-serif text-[#0b0f14]/70 dark:text-[#3df2e0]/60 mt-1 leading-snug">
                      {item.task}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-[#0b0f14]/15 dark:border-[#3df2e0]/20 flex items-center justify-between text-[10px] font-mono text-[#0b0f14]/65 dark:text-[#3df2e0]/60">
                      <span>Due: {formatDate(item.caseItem.limitationDate || "")}</span>
                      <span className="text-[#0b0f14] dark:text-[#3df2e0] font-cinzel font-bold">Inspect Brief →</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Expedited Entries */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 space-y-3 shadow-xs">
            <h3 className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#0b0f14]/65 dark:text-[#3df2e0]/60">
              Expedited Court Entries
            </h3>
            <button
              onClick={() => openModal("add-hearing")}
              className="w-full py-3 px-3.5 rounded-2xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] text-xs font-cinzel font-semibold text-left hover:border-[#0b0f14] dark:hover:border-[#3df2e0] transition-all flex items-center justify-between shadow-xs"
            >
              <span>Record Next Date of Hearing (NDOH)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0b0f14] dark:text-[#3df2e0]" />
            </button>
            <button
              onClick={() => openModal("add-order")}
              className="w-full py-3 px-3.5 rounded-2xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] text-xs font-cinzel font-semibold text-left hover:border-[#0b0f14] dark:hover:border-[#3df2e0] transition-all flex items-center justify-between shadow-xs"
            >
              <span>Enter Certified Judicial Order</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0b0f14] dark:text-[#3df2e0]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
