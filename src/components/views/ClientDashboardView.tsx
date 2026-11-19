"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Scale,
  Gavel,
  Calendar,
  Clock,
  MessageSquare,
  Send,
  User,
  Building,
  Phone,
  Mail,
  ChevronRight,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  FileText,
  Filter,
  Plus,
  X,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";
import { Case } from "@/types";

export function ClientDashboardView() {
  const { state, currentUser, sendOps, openCase, addToast } = useChamber();

  const [selectedLawyerFilter, setSelectedLawyerFilter] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"cases" | "queries">("cases");

  // Raise Query Modal State
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [queryCaseId, setQueryCaseId] = useState<string>("");
  const [queryText, setQueryText] = useState<string>("");
  const [submittingQuery, setSubmittingQuery] = useState(false);

  // Copy passcode feedback
  const [copiedPass, setCopiedPass] = useState(false);

  if (!currentUser || !state) return null;

  // Filter cases strictly belonging to this litigant
  const myCases = state.cases.filter((c) => c.clientId === currentUser.id);

  // Group lawyers handling this litigant's matters
  const retainedLawyerIds = Array.from(new Set(myCases.map((c) => c.lawyerId || "u-lawyer")));
  const retainedLawyers = state.users.filter(
    (u) => u.role === "lawyer" && retainedLawyerIds.includes(u.id)
  );

  // Apply filters
  const filteredCases = myCases.filter((c) => {
    if (selectedLawyerFilter !== "all" && (c.lawyerId || "u-lawyer") !== selectedLawyerFilter) {
      return false;
    }
    if (selectedStatusFilter === "active" && c.status === "Disposed") return false;
    if (selectedStatusFilter === "disposed" && c.status !== "Disposed") return false;
    return true;
  });

  // Collect all queries across my cases
  const allMyQueries: { query: any; caseItem: Case }[] = [];
  myCases.forEach((c) => {
    (c.queries || []).forEach((q) => {
      allMyQueries.push({ query: q, caseItem: c });
    });
  });
  allMyQueries.sort((a, b) => new Date(b.query.ts).getTime() - new Date(a.query.ts).getTime());

  const answeredQueriesCount = allMyQueries.filter((item) => item.query.answered).length;
  const pendingQueriesCount = allMyQueries.filter((item) => !item.query.answered).length;

  // Next upcoming court hearing
  const todayStr = new Date().toISOString().slice(0, 10);
  const upcomingHearings: { date: string; purpose: string; caseItem: Case }[] = [];
  myCases.forEach((c) => {
    (c.hearings || []).forEach((h) => {
      if (h.date >= todayStr) {
        upcomingHearings.push({ date: h.date, purpose: h.purpose, caseItem: c });
      }
    });
  });
  upcomingHearings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextHearing = upcomingHearings[0] || null;

  const handleCopyPasscode = () => {
    if (currentUser.accessCode) {
      navigator.clipboard.writeText(currentUser.accessCode);
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
      addToast("Universal litigant passcode copied to clipboard", "success");
    }
  };

  const handleOpenQueryModal = (targetCaseId?: string) => {
    setQueryCaseId(targetCaseId || myCases[0]?.id || "");
    setQueryText("");
    setShowQueryModal(true);
  };

  const handleSubmitNewQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryCaseId || !queryText.trim()) {
      addToast("Please choose a case matter and write your legal question.", "error");
      return;
    }

    setSubmittingQuery(true);
    const newQueryObj = {
      id: "q-" + Date.now(),
      by: currentUser.id,
      text: queryText.trim(),
      ts: new Date().toISOString(),
    };

    const targetCase = myCases.find((c) => c.id === queryCaseId);
    if (!targetCase) {
      setSubmittingQuery(false);
      return;
    }

    const updatedQueries = [...(targetCase.queries || []), newQueryObj];
    await sendOps([
      {
        type: "updateCase",
        payload: {
          caseId: targetCase.id,
          fields: { queries: updatedQueries },
        },
      },
    ]);

    setSubmittingQuery(false);
    setShowQueryModal(false);
    setQueryText("");
    addToast("Your query has been submitted to your retained chamber advocate.", "success");
    setActiveTab("queries");
  };

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso.includes("T") ? iso : iso + "T00:00:00");
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const calculateDaysRemaining = (isoDate: string) => {
    if (!isoDate) return "";
    const target = new Date(isoDate + "T00:00:00").getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Hearing Today";
    if (diff === 1) return "Tomorrow";
    if (diff > 1) return `In ${diff} days`;
    return "Concluded";
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Litigant Portal Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b1917] via-[#24211e] to-[#121110] text-[#f3eee3] p-6 sm:p-8 border border-white/10 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <Scale className="w-64 h-64 text-[#f3eee3]" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#ea6026] text-[11px] font-cinzel font-bold border border-white/15">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Litigant Dossier · LexDaily Central Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm font-serif text-[#f3eee3]/75 leading-relaxed">
              This is your dedicated client judicial portal. All court cases filed on your behalf or against you across all retained advocate chambers appear below in real-time.
            </p>
          </div>

          {/* Litigant Credentials Quick Desk */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md flex flex-col gap-2.5 min-w-[280px]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#f3eee3]/60 font-cinzel">Litigant ID:</span>
              <span className="font-mono font-bold text-white text-xs">{currentUser.id}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10">
              <span className="text-[#f3eee3]/60 font-cinzel">Permanent Passcode:</span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-[#ea6026] text-xs">
                <span>{currentUser.accessCode || "LD••••••••"}</span>
                {currentUser.accessCode && (
                  <button
                    onClick={handleCopyPasscode}
                    className="p-1 hover:text-white transition-colors cursor-pointer"
                    title="Copy permanent client passcode"
                  >
                    {copiedPass ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>

            <p className="text-[10px] font-serif text-[#f3eee3]/50 italic pt-1">
              Immutable universal credentials valid across all advocate portals.
            </p>
          </div>
        </div>
      </div>

      {/* Key Metric Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#d9541e]/10 text-[#d9541e] flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10.5px] font-cinzel font-bold text-[#111111]/60 dark:text-[#f3eee3]/60 block uppercase tracking-wider">
              Court Cases
            </span>
            <span className="text-xl font-bold font-mono text-[#111111] dark:text-[#f3eee3]">
              {myCases.length}
            </span>
            <span className="text-[11px] text-[#111111]/50 dark:text-[#f3eee3]/50 font-serif italic block truncate">
              Across {retainedLawyers.length || 1} Chamber(s)
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10.5px] font-cinzel font-bold text-[#111111]/60 dark:text-[#f3eee3]/60 block uppercase tracking-wider">
              Retained Counsel
            </span>
            <span className="text-xl font-bold font-mono text-[#111111] dark:text-[#f3eee3]">
              {retainedLawyers.length}
            </span>
            <span className="text-[11px] text-[#111111]/50 dark:text-[#f3eee3]/50 font-serif italic block truncate">
              {retainedLawyers.map((l) => l.name).join(", ") || "Briefed Counsel"}
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10.5px] font-cinzel font-bold text-[#111111]/60 dark:text-[#f3eee3]/60 block uppercase tracking-wider">
              Next Hearing Date
            </span>
            <span className="text-sm font-bold font-mono text-[#111111] dark:text-[#f3eee3] block truncate">
              {nextHearing ? formatDate(nextHearing.date) : "None Scheduled"}
            </span>
            <span className="text-[11px] text-[#d9541e] font-serif font-bold block truncate">
              {nextHearing ? calculateDaysRemaining(nextHearing.date) : "Docket clear"}
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10.5px] font-cinzel font-bold text-[#111111]/60 dark:text-[#f3eee3]/60 block uppercase tracking-wider">
              Advocate Advice
            </span>
            <span className="text-xl font-bold font-mono text-[#111111] dark:text-[#f3eee3]">
              {answeredQueriesCount}
            </span>
            <span className="text-[11px] text-[#111111]/50 dark:text-[#f3eee3]/50 font-serif italic block truncate">
              {pendingQueriesCount > 0 ? `${pendingQueriesCount} awaiting reply` : "All queries answered"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#111111]/15 dark:border-[#f3eee3]/20 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("cases")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-cinzel font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "cases"
                ? "bg-[#111111] text-[#f3eee3] dark:bg-[#f3eee3] dark:text-[#111111] shadow-sm"
                : "border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/70 dark:text-[#f3eee3]/70 hover:bg-[#f3eee3]/30"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>My Court Cases ({myCases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("queries")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-cinzel font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "queries"
                ? "bg-[#111111] text-[#f3eee3] dark:bg-[#f3eee3] dark:text-[#111111] shadow-sm"
                : "border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/70 dark:text-[#f3eee3]/70 hover:bg-[#f3eee3]/30"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Counsel Queries &amp; Advice ({allMyQueries.length})</span>
          </button>
        </div>

        <button
          onClick={() => handleOpenQueryModal()}
          className="px-5 py-2.5 rounded-2xl bg-[#d9541e] hover:bg-[#ba4212] text-white text-xs font-cinzel font-bold tracking-wide shadow-md transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ask Chamber Advocate a Query</span>
        </button>
      </div>

      {/* TAB 1: CASES SECTION */}
      {activeTab === "cases" && (
        <div className="space-y-6">
          {/* Chamber / Lawyer Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#f3eee3]/40 dark:bg-[#1a1816] border border-[#111111]/10 dark:border-[#f3eee3]/15 text-xs font-serif">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-cinzel font-bold text-[#111111]/70 dark:text-[#f3eee3]/70 flex items-center gap-1.5 mr-1">
                <Filter className="w-3.5 h-3.5 text-[#d9541e]" />
                <span>Retained Chambers:</span>
              </span>

              <button
                onClick={() => setSelectedLawyerFilter("all")}
                className={`px-3 py-1.5 rounded-xl font-cinzel font-semibold text-[11px] transition-all cursor-pointer ${
                  selectedLawyerFilter === "all"
                    ? "bg-[#111111] text-white dark:bg-[#f3eee3] dark:text-[#111111] font-bold"
                    : "bg-white dark:bg-[#222] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/80 dark:text-[#f3eee3]/80"
                }`}
              >
                All Chambers ({myCases.length})
              </button>

              {retainedLawyers.map((lawyer) => {
                const count = myCases.filter((c) => (c.lawyerId || "u-lawyer") === lawyer.id).length;
                return (
                  <button
                    key={lawyer.id}
                    onClick={() => setSelectedLawyerFilter(lawyer.id)}
                    className={`px-3 py-1.5 rounded-xl font-cinzel font-semibold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedLawyerFilter === lawyer.id
                        ? "bg-[#111111] text-white dark:bg-[#f3eee3] dark:text-[#111111] font-bold"
                        : "bg-white dark:bg-[#222] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/80 dark:text-[#f3eee3]/80"
                    }`}
                  >
                    <span>{lawyer.name}</span>
                    <span className="text-[10px] opacity-70 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedStatusFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-cinzel ${
                  selectedStatusFilter === "all" ? "text-[#d9541e] font-bold underline" : "text-[#111111]/60 dark:text-[#f3eee3]/60"
                }`}
              >
                All
              </button>
              <span>·</span>
              <button
                onClick={() => setSelectedStatusFilter("active")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-cinzel ${
                  selectedStatusFilter === "active" ? "text-[#d9541e] font-bold underline" : "text-[#111111]/60 dark:text-[#f3eee3]/60"
                }`}
              >
                Active Only
              </button>
              <span>·</span>
              <button
                onClick={() => setSelectedStatusFilter("disposed")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-cinzel ${
                  selectedStatusFilter === "disposed" ? "text-[#d9541e] font-bold underline" : "text-[#111111]/60 dark:text-[#f3eee3]/60"
                }`}
              >
                Disposed
              </button>
            </div>
          </div>

          {/* Cases Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCases.map((c) => {
              const advocate = state.users.find((u) => u.id === (c.lawyerId || "u-lawyer"));
              const nextCaseHearing = (c.hearings || []).find((h) => h.date >= todayStr);
              const caseQueries = c.queries || [];

              return (
                <div
                  key={c.id}
                  className="rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 p-6 flex flex-col justify-between shadow-xs hover:border-[#d9541e]/50 transition-all group"
                >
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-mono font-bold text-xs text-[#d9541e] block">
                          {c.caseNo}
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {(c.caseTypes && c.caseTypes.length > 0 ? c.caseTypes : [c.caseType || "Civil Matter"]).map((ct) => (
                            <span
                              key={ct}
                              className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-[#111111]/5 dark:bg-[#f3eee3]/10 text-[#111111]/80 dark:text-[#f3eee3]/80 border border-[#111111]/10 dark:border-[#f3eee3]/15 font-semibold"
                            >
                              {ct}
                            </span>
                          ))}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-cinzel font-bold uppercase px-3 py-1 rounded-full border shrink-0 ${
                          c.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20"
                            : c.status === "Listed"
                            ? "bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-500/20"
                            : c.status === "Reserved"
                            ? "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20"
                            : "bg-neutral-500/10 text-neutral-800 dark:text-neutral-300 border-neutral-500/20"
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-base font-serif font-bold text-[#111111] dark:text-[#f3eee3] leading-snug group-hover:text-[#d9541e] transition-colors">
                        {c.title}
                      </h3>
                      {c.stage && (
                        <p className="text-xs font-serif text-[#111111]/60 dark:text-[#f3eee3]/60 italic mt-1">
                          Stage: {c.stage}
                        </p>
                      )}
                    </div>

                    {/* Presiding Forum Info */}
                    <div className="p-3.5 rounded-2xl bg-[#f3eee3]/30 dark:bg-[#202020] border border-[#111111]/10 dark:border-[#f3eee3]/10 space-y-1.5 text-xs font-serif">
                      <div className="flex items-center justify-between">
                        <span className="text-[#111111]/60 dark:text-[#f3eee3]/60 text-[11px]">Court Forum:</span>
                        <span className="font-bold text-[#111111] dark:text-[#f3eee3] text-right truncate max-w-[240px]">
                          {c.court}
                        </span>
                      </div>
                      {c.courtRoom && (
                        <div className="flex items-center justify-between">
                          <span className="text-[#111111]/60 dark:text-[#f3eee3]/60 text-[11px]">Bench / Room:</span>
                          <span className="font-mono text-[#111111] dark:text-[#f3eee3]">
                            {c.courtRoom} {c.itemNo ? `· ${c.itemNo}` : ""}
                          </span>
                        </div>
                      )}
                      {c.judge && (
                        <div className="flex items-center justify-between">
                          <span className="text-[#111111]/60 dark:text-[#f3eee3]/60 text-[11px]">Presiding Judge:</span>
                          <span className="font-serif italic text-[#111111]/80 dark:text-[#f3eee3]/80 truncate max-w-[240px]">
                            {c.judge}
                          </span>
                        </div>
                      )}
                      {c.opponentName && (
                        <div className="flex items-center justify-between pt-1 border-t border-[#111111]/10 dark:border-[#f3eee3]/10">
                          <span className="text-[#111111]/60 dark:text-[#f3eee3]/60 text-[11px]">Opposing Party:</span>
                          <span className="font-semibold text-[#111111] dark:text-[#f3eee3] truncate max-w-[240px]">
                            {c.opponentName}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Retained Advocate & Chamber Identification */}
                    <div className="p-3.5 rounded-2xl bg-[#faf8f5] dark:bg-[#1a1816] border border-[#111111]/12 dark:border-[#f3eee3]/15 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#111111] text-[#f3eee3] dark:bg-white dark:text-[#111111] font-cinzel font-bold text-xs flex items-center justify-center shrink-0">
                          {advocate?.name
                            ? advocate.name.replace(/^Adv\.?\s*/i, "").split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
                            : "ADV"}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-cinzel text-[#d9541e] font-bold block uppercase tracking-wider">
                            Retained Legal Counsel
                          </span>
                          <p className="font-serif font-bold text-xs text-[#111111] dark:text-[#f3eee3] truncate">
                            {advocate?.name || "Senior Chamber Advocate"}
                          </p>
                          <p className="text-[10.5px] text-[#111111]/60 dark:text-[#f3eee3]/60 font-serif italic truncate">
                            {advocate?.designation || "Advocate on Record"}
                          </p>
                        </div>
                      </div>

                      {advocate?.phone && (
                        <a
                          href={`tel:${advocate.phone}`}
                          title={`Call ${advocate.name}`}
                          className="p-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 hover:border-[#d9541e] hover:text-[#d9541e] text-[#111111]/70 dark:text-[#f3eee3]/70 transition-colors shrink-0"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {/* Next Date Alert Banner */}
                    {nextCaseHearing && (
                      <div className="p-3 rounded-2xl bg-[#d9541e]/10 border border-[#d9541e]/20 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#d9541e]" />
                          <div>
                            <span className="text-[10px] font-cinzel font-bold text-[#d9541e] uppercase block">
                              Upcoming Court Listing
                            </span>
                            <span className="font-mono font-bold text-[#111111] dark:text-[#f3eee3]">
                              {formatDate(nextCaseHearing.date)}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10.5px] font-serif font-bold px-2.5 py-0.5 rounded-md bg-white dark:bg-[#181818] text-[#d9541e] border border-[#d9541e]/30">
                          {calculateDaysRemaining(nextCaseHearing.date)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-6 pt-4 border-t border-[#111111]/10 dark:border-[#f3eee3]/10 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleOpenQueryModal(c.id)}
                      className="px-3.5 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 hover:border-[#d9541e] hover:text-[#d9541e] text-xs font-cinzel font-semibold text-[#111111] dark:text-[#f3eee3] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#d9541e]" />
                      <span>Ask Counsel</span>
                    </button>

                    <button
                      onClick={() => openCase(c.id)}
                      className="px-4 py-2 rounded-xl bg-[#111111] text-white hover:bg-neutral-800 dark:bg-[#f3eee3] dark:text-[#111111] dark:hover:bg-white text-xs font-cinzel font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Open Docket</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredCases.length === 0 && (
              <div className="col-span-full p-16 text-center bg-white dark:bg-[#181818] rounded-3xl border border-[#111111]/15 dark:border-[#f3eee3]/20">
                <Scale className="w-10 h-10 mx-auto mb-3 text-[#111111]/30 dark:text-[#f3eee3]/40" />
                <h4 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
                  No court cases found under current filter.
                </h4>
                <p className="text-xs text-[#111111]/50 dark:text-[#f3eee3]/50 font-serif italic mt-1">
                  Try switching the chamber selector above to &ldquo;All Chambers&rdquo;.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: QUERIES & ADVICE SECTION */}
      {activeTab === "queries" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
            <div>
              <h3 className="text-base font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#d9541e]" />
                <span>Counsel Legal Advice &amp; Case Inquiries</span>
              </h3>
              <p className="text-xs text-[#111111]/60 dark:text-[#f3eee3]/50 font-serif italic mt-0.5">
                Questions asked to your retained advocates and official counsel responses.
              </p>
            </div>

            <button
              onClick={() => handleOpenQueryModal()}
              className="px-4 py-2 rounded-xl bg-[#d9541e] text-white text-xs font-cinzel font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ask New Question</span>
            </button>
          </div>

          <div className="space-y-4">
            {allMyQueries.map(({ query: q, caseItem: c }) => {
              const advocate = state.users.find((u) => u.id === (c.lawyerId || "u-lawyer"));
              return (
                <div
                  key={q.id}
                  className="p-6 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#111111]/10 dark:border-[#f3eee3]/10 text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#d9541e] mr-2">{c.caseNo}</span>
                      <span className="font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/70">{c.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-[11px] text-[#111111]/50 dark:text-[#f3eee3]/50">
                        Chamber: {advocate?.name || "Retained Counsel"}
                      </span>
                      <span
                        className={`text-[9.5px] font-cinzel font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                          q.answered
                            ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20"
                        }`}
                      >
                        {q.answered ? "Advice Rendered" : "Awaiting Counsel"}
                      </span>
                    </div>
                  </div>

                  {/* Litigant's Query */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-cinzel font-bold text-[#111111]/50 dark:text-[#f3eee3]/50 uppercase tracking-wider block">
                      Your Question ({formatDate(q.ts)}):
                    </span>
                    <p className="text-xs text-[#111111] dark:text-[#f3eee3] font-serif leading-relaxed italic bg-[#f3eee3]/30 dark:bg-[#202020] p-3.5 rounded-2xl border border-[#111111]/10 dark:border-[#f3eee3]/10">
                      &ldquo;{q.text}&rdquo;
                    </p>
                  </div>

                  {/* Advocate's Legal Advice */}
                  {q.reply ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-cinzel font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                          <Gavel className="w-3.5 h-3.5" />
                          <span>Advocate Legal Guidance:</span>
                        </span>
                        {q.replyTs && (
                          <span className="text-[10px] font-mono text-[#111111]/50 dark:text-[#f3eee3]/50">
                            {formatDate(q.replyTs)}
                          </span>
                        )}
                      </div>
                      <p className="text-[#111111] dark:text-[#f3eee3] font-serif leading-relaxed">
                        {q.reply}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11.5px] font-serif text-amber-900 dark:text-amber-200 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Your legal query has been sent to the advocate. Once verified by counsel, their advice will be displayed here.
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {allMyQueries.length === 0 && (
              <div className="p-16 text-center bg-white dark:bg-[#181818] rounded-3xl border border-[#111111]/15 dark:border-[#f3eee3]/20">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 text-[#111111]/30 dark:text-[#f3eee3]/40" />
                <h4 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
                  No queries submitted yet.
                </h4>
                <p className="text-xs text-[#111111]/50 dark:text-[#f3eee3]/50 font-serif italic mt-1">
                  Have a question about your upcoming court date or legal strategy? Click &ldquo;Ask Chamber Advocate a Query&rdquo; above.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RAISE QUERY MODAL */}
      {showQueryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/75 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#d9541e]/15 text-[#d9541e] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
                    Submit Legal Query to Advocate
                  </h3>
                  <p className="text-[10.5px] font-serif italic text-[#111111]/55 dark:text-[#f3eee3]/55">
                    Direct communication with your retained chamber counsel
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQueryModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewQuery} className="space-y-4 text-xs font-serif">
              <div>
                <label className="block text-[11px] font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1.5">
                  Select Court Matter <span className="text-[#d9541e]">*</span>
                </label>
                <select
                  required
                  value={queryCaseId}
                  onChange={(e) => setQueryCaseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-serif text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
                >
                  {myCases.map((c) => {
                    const lawyer = state.users.find((u) => u.id === (c.lawyerId || "u-lawyer"));
                    return (
                      <option key={c.id} value={c.id}>
                        {c.caseNo} — {c.title} ({lawyer?.name || "Chamber"})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-cinzel font-semibold text-[#111111]/80 dark:text-[#f3eee3]/80 mb-1.5">
                  Your Legal Question or Requirement <span className="text-[#d9541e]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="e.g. Do I need to be physically present in Court on the next date? What documents should I carry for the hearing?"
                  className="w-full p-3.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] font-serif focus:outline-none focus:border-[#d9541e]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#f3eee3]/40 dark:bg-[#202020] border border-[#111111]/10 dark:border-[#f3eee3]/10 text-[10.5px] font-serif text-[#111111]/60 dark:text-[#f3eee3]/60 italic">
                Your question will be delivered to the Senior Advocate handling your brief. Any reply prepared by an associate advocate requires senior counsel approval before being published here.
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-[#111111]/10 dark:border-[#f3eee3]/10">
                <button
                  type="button"
                  onClick={() => setShowQueryModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs font-cinzel hover:bg-[#f3eee3]/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingQuery || !queryText.trim()}
                  className="px-5 py-2 rounded-xl bg-[#d9541e] hover:bg-[#ba4212] text-white text-xs font-cinzel font-bold shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingQuery ? "Transmitting..." : "Send to Counsel"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
