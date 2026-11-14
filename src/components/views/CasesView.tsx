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
    downloadAnchor.setAttribute("download", `UpdatedLawDiary-Cases-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast("Chamber Vakalatnama diary exported to JSON", "success");
  };

  const statusColor: Record<string, string> = {
    Active: "bg-[#3df2e0]/25 dark:bg-[#3df2e0]/15 text-[#0b0f14] dark:text-[#3df2e0] border-[#0b0f14]/50 dark:border-[#3df2e0]/40",
    Listed: "bg-white dark:bg-[#141d27] text-[#0b0f14] dark:text-[#3df2e0] border-[#0b0f14]/15 dark:border-[#3df2e0]/20",
    Reserved: "bg-white dark:bg-[#141d27] text-[#0b0f14]/65 dark:text-[#3df2e0]/60 border-[#0b0f14]/15 dark:border-[#3df2e0]/20",
    Adjourned: "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40",
    Disposed: "bg-white dark:bg-[#141d27] text-[#0b0f14]/65 dark:text-[#3df2e0]/60 border-[#0b0f14]/15 dark:border-[#3df2e0]/20",
  };

  const tabs = [
    { id: "all", label: "All Registered Matters" },
    { id: "Active", label: "Active Arguments & Evidence" },
    { id: "Listed", label: "Notice Returnable" },
    { id: "Reserved", label: "Judgment Reserved" },
    { id: "Disposed", label: "Disposed / Decreed" },
  ];

  return (
    <div className="space-y-7">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0b0f14]/65 dark:text-[#3df2e0]/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by CNR, Case Number, Court, Bench or Stage..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 bg-white dark:bg-[#0f151c] text-xs text-[#0b0f14] dark:text-[#3df2e0] placeholder:text-[#8e929f] focus:outline-none focus:border-[#0b0f14] dark:focus:border-[#3df2e0] shadow-xs transition-colors font-sans"
          />
        </div>

        <div className="flex items-center gap-3">
          {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
            <button
              onClick={() => openModal("add-case")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1b1d3a] text-[#e8d5b5] hover:bg-[#25284e] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] dark:hover:bg-[#dfc8a2] text-xs font-cinzel font-bold tracking-wider transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>File Fresh Matter</span>
            </button>
          )}

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 bg-white dark:bg-[#0f151c] text-[#0b0f14] dark:text-[#3df2e0] hover:bg-white dark:hover:bg-[#161820] text-xs font-cinzel font-semibold tracking-wider transition-colors shadow-xs"
            title="Export master case register to JSON"
          >
            <Download className="w-4 h-4 text-[#0b0f14] dark:text-[#3df2e0]" />
            <span className="hidden sm:inline">Export Register</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20">
        {tabs.map((t) => {
          const isActive = filter === t.id;
          const count = t.id === "all" ? visibleCases.length : visibleCases.filter((c) => c.status === t.id).length;

          return (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-[#1b1d3a] text-[#e8d5b5] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] shadow-sm"
                  : "bg-white dark:bg-[#0f151c] text-[#0b0f14]/65 dark:text-[#3df2e0]/60 hover:text-[#0b0f14] dark:hover:text-white border border-[#0b0f14]/15 dark:border-[#3df2e0]/20"
              }`}
            >
              <span>{t.label}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono ${isActive ? "bg-[#e8d5b5]/20 text-[#e8d5b5] dark:bg-[#1b1d3a]/20 dark:text-[#1b1d3a]" : "bg-white dark:bg-[#141d27] text-[#0b0f14]/65 dark:text-[#3df2e0]/60"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Indian Court Matters Table */}
      <div className="rounded-3xl border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 bg-white dark:bg-[#0f151c] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white dark:bg-[#0b0f14] border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14]/65 dark:text-[#3df2e0]/60 font-cinzel text-[10px] uppercase tracking-wider">
                <th className="py-4 px-5 font-bold">Case No &amp; CNR</th>
                <th className="py-4 px-5 font-bold">Parties (Cause Title)</th>
                <th className="py-4 px-5 font-bold">Court &amp; Presiding Bench</th>
                <th className="py-4 px-5 font-bold">Current Stage</th>
                <th className="py-4 px-5 font-bold">Next Date (NDOH)</th>
                <th className="py-4 px-5 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5dfd2] dark:divide-[#222630]">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#0b0f14]/65 dark:text-[#3df2e0]/60">
                    <Scale className="w-8 h-8 mx-auto mb-2 text-[#0b0f14] dark:text-[#3df2e0]" />
                    <p className="font-bold font-cinzel text-sm text-[#0b0f14] dark:text-[#3df2e0]">No registered court matters found.</p>
                    <p className="text-xs font-serif italic text-[#0b0f14]/65 dark:text-[#3df2e0]/60 mt-1">Try modifying your search or filter criteria.</p>
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
                      className="hover:bg-white/80 dark:hover:bg-[#161820]/80 transition-colors cursor-pointer group"
                    >
                      {/* Case No & CNR */}
                      <td className="py-4 px-5">
                        <div className="font-mono font-bold text-[#0b0f14] dark:text-[#3df2e0] group-hover:text-[#0b0f14] dark:group-hover:text-[#3df2e0] transition-colors">
                          {c.caseNo}
                        </div>
                        {c.cnr && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="font-mono text-[10px] text-[#0b0f14]/65 dark:text-[#3df2e0]/60">
                              {c.cnr}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyCNR(e, c.cnr || "")}
                              className="text-[#0b0f14] dark:text-[#3df2e0] hover:opacity-80 p-0.5 rounded"
                              title="Copy 16-digit CNR Number"
                            >
                              {copiedCNR === c.cnr ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3 opacity-60" />
                              )}
                            </button>
                          </div>
                        )}
                        {hasPending && (
                          <span className="inline-block mt-1.5 text-[9px] font-cinzel font-bold px-2 py-0.5 rounded-full bg-[#3df2e0]/30 dark:bg-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/50 dark:border-[#3df2e0]/40">
                            Drafts Pending Review
                          </span>
                        )}
                      </td>

                      {/* Title */}
                      <td className="py-4 px-5 max-w-xs">
                        <div className="font-serif font-bold text-xs text-[#0b0f14] dark:text-[#3df2e0] truncate">
                          {c.title}
                        </div>
                        <div className="text-[11px] text-[#0b0f14]/65 dark:text-[#3df2e0]/60 truncate mt-0.5 font-serif italic">
                          Filed: {formatDate(c.filingDate)}
                        </div>
                      </td>

                      {/* Court & Bench */}
                      <td className="py-4 px-5 max-w-xs">
                        <div className="text-xs font-serif text-[#0b0f14] dark:text-[#3df2e0] truncate">
                          {c.court}
                        </div>
                        <div className="text-[11px] text-[#0b0f14]/65 dark:text-[#3df2e0]/60 truncate mt-0.5 font-serif italic">
                          {c.judge || "Hon'ble Bench"} {c.courtRoom ? `· ${c.courtRoom}` : ""}
                        </div>
                      </td>

                      {/* Stage */}
                      <td className="py-4 px-5">
                        <span className="inline-block px-3 py-1 rounded-xl text-[11px] font-serif bg-white dark:bg-[#141d27] text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20">
                          {c.stage}
                        </span>
                      </td>

                      {/* Next Date of Hearing (NDOH) */}
                      <td className="py-4 px-5">
                        {nextH ? (
                          <div>
                            <span className="font-mono text-xs font-bold text-[#0b0f14] dark:text-[#3df2e0]">
                              {formatDate(nextH.date)}
                            </span>
                            {c.itemNo && (
                              <div className="text-[10px] font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0] mt-0.5">
                                Item {c.itemNo}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-[#0b0f14]/65 dark:text-[#3df2e0]/60">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[9.5px] font-bold font-cinzel border ${
                            statusColor[c.status] || "bg-white text-[#0b0f14] border-[#0b0f14]/15"
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
