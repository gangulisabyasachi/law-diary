"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Scale, Search, Plus, Download, Clock, ArrowRight, User } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function CasesView() {
  const { state, currentUser, openCase, openModal, addToast } = useChamber();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  if (!state || !currentUser) return null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const pendingCaseIds = new Set(
    state.approvals
      .map((a) => a.payload?.caseId || a.payload?.case?.id)
      .filter(Boolean)
  );

  const visibleCases = state.cases.filter((c) => {
    if (currentUser.role === "client") return c.clientId === currentUser.id;
    if (currentUser.role === "associate") return c.associateIds.includes(currentUser.id);
    return true;
  });

  const filteredCases = visibleCases.filter((c) => {
    const matchesFilter = filter === "all" || c.status === filter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.caseNo.toLowerCase().includes(q) ||
      c.court.toLowerCase().includes(q) ||
      c.stage.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.cases, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CounselBook-Cases-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast("Diary records exported to JSON", "success");
  };

  const statusColor: Record<string, string> = {
    Active: "bg-[#edf6f0] text-[#1b5e3a] border-[#cce4d4]",
    Listed: "bg-[#edf3f8] text-[#1c4d75] border-[#caddee]",
    Reserved: "bg-[#f5f2eb] text-[#5c4932] border-[#ded7c8]",
    Adjourned: "bg-[#fcf5ec] text-[#7a491c] border-[#ebd8c4]",
    Disposed: "bg-[#f3f2ef] text-[#5c5852] border-[#dcd9d4]",
  };

  const tabs = ["all", "Active", "Listed", "Reserved", "Adjourned", "Disposed"];

  return (
    <div className="space-y-5">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c877e]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by case number, title, court or stage..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#e6e2d8] bg-white text-xs text-[#191817] placeholder:text-[#8c877e] focus:outline-none focus:border-[#b89552]"
          />
        </div>

        <div className="flex items-center gap-2">
          {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
            <button
              onClick={() => openModal("add-case")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#14171a] text-white text-xs font-semibold hover:bg-[#252930] transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Add Case</span>
            </button>
          )}

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#e6e2d8] bg-white text-[#5c5852] hover:bg-[#f5f3ee] text-xs font-medium transition-colors"
            title="Export cases to JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#8c877e]" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              filter === t
                ? "bg-[#14171a] text-white"
                : "bg-white text-[#635f59] hover:bg-[#f5f3ee] border border-[#e6e2d8]"
            }`}
          >
            {t === "all" ? "All Matters" : t}
          </button>
        ))}
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl border border-[#e6e2d8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fbfaf8] border-b border-[#e6e2d8] text-[10px] font-mono uppercase tracking-wider text-[#736e65]">
                <th className="py-3 px-4">Case Title &amp; Forum</th>
                <th className="py-3 px-4">Case No.</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Next Hearing</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ece4] text-xs">
              {filteredCases.map((c) => {
                const client = state.users.find((u) => u.id === c.clientId);
                const nextHearing = c.hearings
                  .filter((h) => h.date >= todayStr)
                  .sort((a, b) => a.date.localeCompare(b.date))[0];
                const hasPending = pendingCaseIds.has(c.id);

                return (
                  <tr
                    key={c.id}
                    onClick={() => openCase(c.id)}
                    className="hover:bg-[#faf8f4] cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-[#191817] group-hover:text-[#805e26] transition-colors">
                          {c.title}
                        </span>
                        {hasPending && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#fcf5ec] text-[#7a491c] border border-[#ebd8c4]">
                            <Clock className="w-3 h-3" /> In Review
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#635f59] mt-0.5 font-serif">
                        {c.court} · Stage: <span className="text-[#191817] font-medium">{c.stage}</span>
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-[#191817] whitespace-nowrap">
                      {c.caseNo}
                    </td>

                    <td className="py-3.5 px-4 text-[#5c5852] whitespace-nowrap font-serif">
                      {client ? client.name : "—"}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {nextHearing ? (
                        <div>
                          <span className="font-semibold text-[#191817] block">{formatDate(nextHearing.date)}</span>
                          <span className="text-[10px] text-[#635f59] truncate block max-w-[150px] font-serif">
                            {nextHearing.purpose}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#8c877e] italic">No date</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColor[c.status] || "bg-stone-100 text-stone-700"}`}>
                        {c.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#805e26] group-hover:text-[#5c431b] transition-colors">
                        Open File <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Scale className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No matching cases found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search or status filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

