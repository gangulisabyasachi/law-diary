"use client";

import React, { useState } from "react";
import { Scale, Search, Plus, Download, Clock, ArrowRight, User, Copy, Check, Building, Gavel } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function CasesView() {
  const { state, currentUser, openCase, openModal, addToast } = useChamber();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [copiedCNR, setCopiedCNR] = useState<string | null>(null);

  if (!state || !currentUser) return null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const pendingCaseIds = new Set(
    state.approvals
      .map((a) => a.payload?.caseId || a.payload?.case?.id)
      .filter(Boolean)
  );

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

  const filteredCases = visibleCases.filter((c) => {
    const matchesFilter = filter === "all" || c.status === filter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.caseNo.toLowerCase().includes(q) ||
      (c.cnr && c.cnr.toLowerCase().includes(q)) ||
      c.court.toLowerCase().includes(q) ||
      c.stage.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const handleCopyCNR = (e: React.MouseEvent, cnr: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cnr);
    setCopiedCNR(cnr);
    addToast(`Copied CNR Number: ${cnr}`, "info");
    setTimeout(() => setCopiedCNR(null), 2500);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(visibleCases, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CounselBook-Cases-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast("Chamber Vakalatnama diary exported to JSON", "success");
  };

  const statusColor: Record<string, string> = {
    Active: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40",
    Listed: "bg-blue-50 dark:bg-blue-950/40 text-[#1e3a8a] dark:text-[#93c5fd] border-blue-200 dark:border-blue-800/40",
    Reserved: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    Adjourned: "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40",
    Disposed: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  };

  const tabs = [
    { id: "all", label: "All Registered Matters" },
    { id: "Active", label: "Active Evidence & Arguments" },
    { id: "Listed", label: "Notice Returnable" },
    { id: "Reserved", label: "Judgment Reserved" },
    { id: "Disposed", label: "Decreed / Consent Orders" },
  ];

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search CNR number, case title, court, or stage..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1e3a8a] dark:focus:border-[#3b82f6] shadow-xs transition-colors"
          />
        </div>

        <div className="flex items-center gap-2.5">
          {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
            <button
              onClick={() => openModal("add-case")}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] hover:from-[#1d4ed8] hover:to-[#1e3a8a] text-white text-xs font-cinzel font-bold tracking-wider transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ File Fresh Matter</span>
            </button>
          )}

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#161f30] text-xs font-cinzel font-semibold tracking-wider transition-colors shadow-xs"
            title="Export master case register to JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#1e3a8a] dark:text-[#60a5fa]" />
            <span className="hidden sm:inline">Export Register</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((t) => {
          const isActive = filter === t.id;
          const count = t.id === "all" ? visibleCases.length : visibleCases.filter((c) => c.status === t.id).length;

          return (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-cinzel font-semibold tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-[#1e3a8a] text-white dark:bg-[#2563eb] shadow-xs"
                  : "bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
              }`}
            >
              <span>{t.label}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono ${isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Indian Court Matters Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-cinzel text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Case No &amp; CNR</th>
                <th className="py-3.5 px-4 font-semibold">Parties (Cause Title)</th>
                <th className="py-3.5 px-4 font-semibold">Court &amp; Presiding Bench</th>
                <th className="py-3.5 px-4 font-semibold">Current Stage</th>
                <th className="py-3.5 px-4 font-semibold">Next Date (NDOH)</th>
                <th className="py-3.5 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-slate-400">
                    <Scale className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="font-semibold font-cinzel text-sm text-slate-800 dark:text-slate-200">No registered court matters found.</p>
                    <p className="text-xs text-slate-500 font-serif italic mt-1">Try modifying your search or filter criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => {
                  const nextH = c.hearings.filter((h) => h.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date))[0];
                  const hasPending = pendingCaseIds.has(c.id);

                  return (
                    <tr
                      key={c.id}
                      onClick={() => openCase(c.id)}
                      className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer group"
                    >
                      {/* Case No & CNR */}
                      <td className="py-4 px-4">
                        <div className="font-mono font-bold text-slate-900 dark:text-white group-hover:text-[#1e3a8a] dark:group-hover:text-[#60a5fa] transition-colors">
                          {c.caseNo}
                        </div>
                        {c.cnr && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                              {c.cnr}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyCNR(e, c.cnr || "")}
                              className="text-[#1e3a8a] dark:text-[#60a5fa] hover:opacity-80 p-0.5 rounded"
                              title="Copy 16-digit CNR Number"
                            >
                              {copiedCNR === c.cnr ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3 text-slate-400" />
                              )}
                            </button>
                          </div>
                        )}
                        {hasPending && (
                          <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800/40">
                            Drafts Pending Review
                          </span>
                        )}
                      </td>

                      {/* Title */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="font-semibold text-xs text-slate-900 dark:text-white truncate font-sans">
                          {c.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5 font-serif italic">
                          Filed: {formatDate(c.filingDate)}
                        </div>
                      </td>

                      {/* Court & Bench */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="text-xs text-slate-900 dark:text-white truncate font-sans">
                          {c.court}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5 font-serif italic">
                          {c.judge || "Hon'ble Bench"} {c.courtRoom ? `· ${c.courtRoom}` : ""}
                        </div>
                      </td>

                      {/* Stage */}
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {c.stage}
                        </span>
                      </td>

                      {/* Next Date of Hearing (NDOH) */}
                      <td className="py-4 px-4">
                        {nextH ? (
                          <div>
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                              {formatDate(nextH.date)}
                            </span>
                            {c.itemNo && (
                              <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                                Item {c.itemNo}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-bold font-cinzel border ${
                            statusColor[c.status] || "bg-slate-100 text-slate-800 border-slate-200"
                          }`}
                        >
                          {c.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
