"use client";

import React, { useState, useEffect } from "react";
import { Search, Scale, Calendar, Users, CheckCircle2, FileText, Plus, X, ArrowRight, CornerDownLeft } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { state, openCase, setActivePage, openModal, currentUser } = useChamber();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !state) return null;

  const q = query.toLowerCase().trim();

  // Search results
  const matchingCases = state.cases.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.caseNo.toLowerCase().includes(q) ||
      (c.cnr && c.cnr.toLowerCase().includes(q)) ||
      c.court.toLowerCase().includes(q) ||
      (c.judge && c.judge.toLowerCase().includes(q))
  ).slice(0, 5);

  const matchingClients = state.users.filter(
    (u) => u.role === "client" && (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  ).slice(0, 3);

  const actions = [
    { label: "View Daily Cause List (Hearing Board)", icon: Calendar, action: () => { setActivePage("calendar"); onClose(); } },
    { label: "Open Master Case Diary", icon: Scale, action: () => { setActivePage("cases"); onClose(); } },
    ...(currentUser?.role === "lawyer" || currentUser?.role === "associate"
      ? [{ label: "File Fresh Matter (New Brief)", icon: Plus, action: () => { openModal("add-case"); onClose(); } }]
      : []),
    ...(currentUser?.role === "lawyer" || currentUser?.role === "admin"
      ? [{ label: "Review Advocate Verification Desk", icon: CheckCircle2, action: () => { setActivePage("approvals"); onClose(); } }]
      : []),
  ].filter((a) => !q || a.label.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl text-slate-900 dark:text-slate-100">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <Search className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type CNR number, case title, court, judge, or command..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none font-sans"
          />
          <kbd className="px-1.5 py-0.5 text-[9.5px] bg-slate-200/60 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-4 text-xs">
          {/* Quick Actions */}
          {actions.length > 0 && (
            <div>
              <p className="px-2 text-[9.5px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">
                Chamber Shortcuts
              </p>
              <div className="space-y-1">
                {actions.map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={i}
                      onClick={act.action}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-sans font-medium">{act.label}</span>
                      </div>
                      <CornerDownLeft className="w-3.5 h-3.5 opacity-40" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching Cases */}
          {matchingCases.length > 0 && (
            <div>
              <p className="px-2 text-[9.5px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">
                Matching Court Matters ({matchingCases.length})
              </p>
              <div className="space-y-1">
                {matchingCases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { openCase(c.id); onClose(); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors group"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{c.caseNo}</span>
                        {c.cnr && <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">({c.cnr})</span>}
                      </div>
                      <p className="text-xs text-slate-900 dark:text-white truncate mt-0.5 font-sans">{c.title}</p>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate font-serif italic">{c.court}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Clients */}
          {matchingClients.length > 0 && (
            <div>
              <p className="px-2 text-[9.5px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">
                Registered Clients ({matchingClients.length})
              </p>
              <div className="space-y-1">
                {matchingClients.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => { setActivePage("clients"); onClose(); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block font-sans">{u.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{u.email}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">Inspect Briefs →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && matchingCases.length === 0 && matchingClients.length === 0 && actions.length === 0 && (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500">
              <p className="text-xs font-semibold">No records found matching "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
