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
      c.court.toLowerCase().includes(q) ||
      (c.judge && c.judge.toLowerCase().includes(q))
  ).slice(0, 5);

  const matchingClients = state.users.filter(
    (u) => u.role === "client" && (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  ).slice(0, 3);

  const actions = [
    { label: "View Hearing Calendar (Cause List)", icon: Calendar, action: () => { setActivePage("calendar"); onClose(); } },
    { label: "Open Case Diary", icon: Scale, action: () => { setActivePage("cases"); onClose(); } },
    ...(currentUser?.role === "lawyer" || currentUser?.role === "associate"
      ? [{ label: "File New Matter / Case", icon: Plus, action: () => { openModal("add-case"); onClose(); } }]
      : []),
    ...(currentUser?.role === "lawyer" || currentUser?.role === "admin"
      ? [{ label: "Review Pending Approvals", icon: CheckCircle2, action: () => { setActivePage("approvals"); onClose(); } }]
      : []),
  ].filter((a) => !q || a.label.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-[#0d0f12]/70">
      <div className="relative w-full max-w-xl overflow-hidden bg-[#14171a] border border-[#2b303a] rounded-xl shadow-2xl text-[#d1d5db]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#252930] bg-[#121518]">
          <Search className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a case number, party, court, judge, or command..."
            className="w-full bg-transparent text-sm text-white placeholder:text-[#6b7280] focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] bg-[#1e2228] border border-[#2d333e] rounded text-[#9ca3af] font-mono">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-4 text-xs">
          {/* Quick Actions */}
          {actions.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-mono font-medium uppercase tracking-wider text-[#6b7280] mb-1.5">
                Chamber Shortcuts
              </p>
              <div className="space-y-1">
                {actions.map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={i}
                      onClick={act.action}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#1f242b] text-left text-[#d1d5db] hover:text-white transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>{act.label}</span>
                      </div>
                      <CornerDownLeft className="w-3.5 h-3.5 text-[#4b5563] group-hover:text-[#9ca3af]" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cases */}
          {matchingCases.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-mono font-medium uppercase tracking-wider text-[#6b7280] mb-1.5">
                Court Matters
              </p>
              <div className="space-y-1">
                {matchingCases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { openCase(c.id); onClose(); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#1f242b] text-left text-[#d1d5db] hover:text-white transition-colors group"
                  >
                    <div>
                      <span className="font-mono text-[#c5a059] font-bold mr-2">{c.caseNo}</span>
                      <span className="text-white font-serif">{c.title}</span>
                      <p className="text-[11px] text-[#9ca3af] mt-0.5 font-serif">{c.court} · {c.stage}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#4b5563] group-hover:text-[#c5a059]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clients */}
          {matchingClients.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-mono font-medium uppercase tracking-wider text-[#6b7280] mb-1.5">
                Client Records
              </p>
              <div className="space-y-1">
                {matchingClients.map((cl) => (
                  <button
                    key={cl.id}
                    onClick={() => { setActivePage("clients"); onClose(); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#1f242b] text-left text-[#d1d5db] hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#8c877e]" />
                      <span className="text-white font-medium font-serif">{cl.name}</span>
                      <span className="text-[11px] text-[#6b7280] font-mono">({cl.email})</span>
                    </div>
                    <span className="text-[10px] text-[#c5a059] font-mono">View Client</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {actions.length === 0 && matchingCases.length === 0 && matchingClients.length === 0 && (
            <div className="p-8 text-center text-[#6b7280] text-xs">
              No matching court files or commands found for "{query}".
            </div>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="p-2.5 px-4 bg-[#121518] border-t border-[#252930] flex items-center justify-between text-[11px] text-[#6b7280]">
          <span>Navigate with mouse or keyboard</span>
          <div className="flex items-center gap-2">
            <span>Press <kbd className="px-1 py-0.5 bg-[#1e2228] border border-[#2d333e] rounded text-[#d1d5db] font-mono">Esc</kbd> to exit</span>
          </div>
        </div>
      </div>
    </div>
  );
}

