"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Scale, Calendar, Users, Plus, CheckCircle2, ArrowRight, CornerDownLeft } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { state, currentUser, openCase, setActivePage, openModal } = useChamber();
  const [query, setQuery] = useState("");

  // Keyboard shortcut listener for Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
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
    (u) =>
      u.role === "client" &&
      (u.name.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)))
  ).slice(0, 3);

  const actions = [
    { label: "View Daily Cause List (Hearing Board)", icon: Calendar, action: () => { setActivePage("calendar"); onClose(); } },
    { label: "Open Master Case Diary", icon: Scale, action: () => { setActivePage("cases"); onClose(); } },
    ...(currentUser?.role === "lawyer" || currentUser?.role === "associate"
      ? [
          {
            label: "File Fresh Matter (Dedicated Intake Page)",
            icon: Plus,
            action: () => {
              router.push(currentUser?.role === "admin" ? "/admin/cases/new" : "/dashboard/cases/new");
              onClose();
            },
          },
        ]
      : []),
    ...(currentUser?.role === "lawyer" || currentUser?.role === "admin"
      ? [{ label: "Review Advocate Verification Desk", icon: CheckCircle2, action: () => { setActivePage("approvals"); onClose(); } }]
      : []),
  ].filter((a) => !q || a.label.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-[#111111]/80 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-xl overflow-hidden bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/30 rounded-3xl shadow-2xl text-[#111111] dark:text-[#f3eee3] animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#111111]/15 dark:border-[#f3eee3]/20 bg-[#f3eee3]/10 dark:bg-[#111111]">
          <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0 border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] shadow-2xs">
            <Image src="/favicon.png" width={24} height={24} alt="LD" className="w-full h-full object-contain p-0.5" />
          </div>
          <Search className="w-3.5 h-3.5 text-[#111111]/60 dark:text-[#f3eee3]/60 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Case Number, Court, Bench or Client..."
            className="w-full bg-transparent text-sm text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/50 dark:placeholder:text-[#f3eee3]/40 focus:outline-none font-sans"
          />
          <kbd className="px-2 py-0.5 text-[9.5px] bg-[#111111]/10 dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/30 rounded-md text-[#111111] dark:text-[#f3eee3] font-mono">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="p-3.5 max-h-96 overflow-y-auto space-y-4 text-xs">
          {/* Quick Actions */}
          {actions.length > 0 && (
            <div>
              <p className="px-2 text-[9.5px] font-cinzel font-bold uppercase tracking-widest text-[#111111]/60 dark:text-[#f3eee3]/60 mb-1.5">
                Chamber Shortcuts
              </p>
              <div className="space-y-1">
                {actions.map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={i}
                      onClick={act.action}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl hover:bg-[#f3eee3]/15 dark:hover:bg-[#202020] text-[#111111] dark:text-[#f3eee3] transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-xl bg-[#111111] dark:bg-[#f3eee3]/15 flex items-center justify-center text-[#f3eee3]">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-sans font-medium">{act.label}</span>
                      </div>
                      <CornerDownLeft className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching Cases */}
          {matchingCases.length > 0 && (
            <div>
              <p className="px-2 text-[9.5px] font-cinzel font-bold uppercase tracking-widest text-[#111111]/60 dark:text-[#f3eee3]/60 mb-1.5">
                Matching Matters ({matchingCases.length})
              </p>
              <div className="space-y-1">
                {matchingCases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { openCase(c.id); onClose(); }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl hover:bg-[#f3eee3]/15 dark:hover:bg-[#202020] text-left transition-colors group"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#111111] dark:text-[#f3eee3]">{c.caseNo}</span>
                      </div>
                      <p className="text-xs text-[#111111] dark:text-[#f3eee3] font-medium truncate mt-0.5 font-sans">{c.title}</p>
                      <p className="text-[10.5px] text-[#111111]/60 dark:text-[#f3eee3]/60 truncate font-serif italic">{c.court}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#111111]/50 dark:text-[#f3eee3]/50 group-hover:text-[#111111] dark:group-hover:text-[#f3eee3] group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Clients */}
          {matchingClients.length > 0 && (
            <div>
              <p className="px-2 text-[9.5px] font-cinzel font-bold uppercase tracking-widest text-[#111111]/60 dark:text-[#f3eee3]/60 mb-1.5">
                Registered Clients ({matchingClients.length})
              </p>
              <div className="space-y-1">
                {matchingClients.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => { setActivePage("clients"); onClose(); }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl hover:bg-[#f3eee3]/15 dark:hover:bg-[#202020] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl bg-[#111111] dark:bg-[#f3eee3]/15 flex items-center justify-center text-[#f3eee3]">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-[#111111] dark:text-[#f3eee3] block font-sans">{u.name}</span>
                        <span className="text-[10px] text-[#111111]/60 dark:text-[#f3eee3]/60 font-mono">{u.email}</span>
                      </div>
                    </div>
                    <span className="text-[10.5px] font-semibold text-[#111111] dark:text-[#f3eee3] group-hover:underline">Inspect Briefs →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && matchingCases.length === 0 && matchingClients.length === 0 && actions.length === 0 && (
            <div className="p-8 text-center text-[#111111]/60 dark:text-[#f3eee3]/60">
              <p className="text-xs font-semibold">No court matters found matching &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
