"use client";

import React from "react";
import Image from "next/image";
import { CalendarDays, Scale, ArrowRight, Building, Gavel } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function CalendarView() {
  const { state, currentUser, openCase } = useChamber();

  if (!state || !currentUser) return null;

  const todayStr = new Date().toISOString().slice(0, 10);

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

  const allHearings = visibleCases
    .flatMap((c) => c.hearings.map((h) => ({ ...h, caseItem: c })))
    .sort((a, b) => a.date.localeCompare(b.date));

  const upcoming = allHearings.filter((h) => h.date >= todayStr);
  const past = allHearings.filter((h) => h.date < todayStr).reverse().slice(0, 30);

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", weekday: "short" });
  };

  const getDayMonth = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    return { day: d.getDate(), mon: d.toLocaleDateString("en-IN", { month: "short" }) };
  };

  const renderGroup = (list: typeof allHearings, title: string, isUpcoming = false) => {
    if (list.length === 0) return null;

    return (
      <div className="space-y-3">
        <h3 className="text-sm font-bold font-cinzel text-[#111111] dark:text-[#f3eee3] flex items-center gap-2">
          <span>{title}</span>
          <span className="text-xs text-[#111111]/60 dark:text-[#f3eee3]/50 font-serif italic">
            ({list.length} Listings)
          </span>
        </h3>

        <div className="bg-white dark:bg-[#181818] rounded-3xl border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] divide-y divide-[#111111]/10 dark:divide-[#f3eee3]/15 overflow-hidden">
          {list.map((h, i) => {
            const dm = getDayMonth(h.date);
            const isToday = h.date === todayStr;

            return (
              <div
                key={i}
                onClick={() => openCase(h.caseItem.id)}
                className="p-4 sm:p-5 hover:bg-white/60 dark:hover:bg-white/[0.03] cursor-pointer transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-center flex-shrink-0 font-mono border transition-all ${
                      isToday
                        ? "bg-[#111111] dark:bg-[#f3eee3] text-[#f3eee3] dark:text-[#111111] border-[#111111] dark:border-[#f3eee3] shadow-md shadow-[#f3eee3]/20 dark:shadow-[#f3eee3]/20 font-bold"
                        : isUpcoming
                        ? "bg-[#111111]/10 dark:bg-[#f3eee3]/15 text-[#111111] dark:text-[#f3eee3] border-[#111111]/30 dark:border-[#f3eee3]/30"
                        : "bg-[#111111]/5 dark:bg-white/5 text-[#111111]/60 dark:text-[#f3eee3]/50 border-[#111111]/15 dark:border-[#f3eee3]/20"
                    }`}
                  >
                    <span className="text-base font-bold font-cinzel leading-tight">{dm.day}</span>
                    <span className="text-[8.5px] uppercase font-bold tracking-wider">{dm.mon}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs sm:text-sm font-bold text-[#111111] dark:text-[#f3eee3] group-hover:text-[#111111] dark:group-hover:text-[#f3eee3] transition-colors truncate font-sans">
                        {h.purpose || "Hearing"}
                      </p>
                      <span className="text-[11px] font-mono text-[#111111]/80 dark:text-[#f3eee3] font-semibold bg-[#111111]/5 dark:bg-[#f3eee3]/10 px-2 py-0.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20">
                        {h.caseItem.caseNo}
                      </span>
                      {h.caseItem.courtRoom && (
                        <span className="text-[10px] font-mono text-[#111111]/70 dark:text-[#f3eee3]/80 bg-[#111111]/5 dark:bg-white/5 px-2 py-0.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20 flex items-center gap-1">
                          <Building className="w-2.5 h-2.5" />
                          {h.caseItem.courtRoom}
                        </span>
                      )}
                      {h.caseItem.itemNo && (
                        <span className="text-[10px] font-mono font-bold text-white bg-[#d9541e] px-2 py-0.5 rounded-lg border border-[#d9541e]">
                          {h.caseItem.itemNo}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-[#111111]/60 dark:text-[#f3eee3]/60 truncate mt-1 font-serif italic">
                      {h.caseItem.title} · {h.caseItem.court}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-[#111111]/50 dark:text-[#f3eee3]/50 font-mono hidden sm:inline">
                    {formatDate(h.date)}
                  </span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#111111]/5 dark:bg-white/5 group-hover:bg-[#f3eee3] dark:group-hover:bg-[#f3eee3] group-hover:text-[#111111] text-[#111111]/60 dark:text-[#f3eee3]/60 transition-all">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
        <div>
          <h2 className="text-lg font-bold font-cinzel text-[#111111] dark:text-[#f3eee3] flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#111111] dark:text-[#f3eee3]" />
            <span>Chamber Hearing Register</span>
          </h2>
          <p className="text-xs text-[#111111]/60 dark:text-[#f3eee3]/50 font-serif italic mt-0.5">
            Chronological cause list appearances across High Court, District Courts &amp; Tribunals
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {renderGroup(upcoming, "Upcoming Listed Matters", true)}
        {renderGroup(past, "Past Court Appearances & Transcripts", false)}

        {allHearings.length === 0 && (
          <div className="p-16 text-center bg-white dark:bg-[#181818] rounded-3xl border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl overflow-hidden border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] p-2 shadow-2xs opacity-75">
              <Image src="/favicon.png" width={48} height={48} alt="LD" className="w-full h-full object-contain" />
            </div>
            <p className="text-sm font-semibold font-cinzel text-[#111111] dark:text-[#f3eee3]">No hearings on chamber register.</p>
            <p className="text-xs text-[#111111]/50 dark:text-[#f3eee3]/50 font-serif italic mt-1">Matters listed in cause lists will appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
}
