"use client";

import React from "react";
import { CalendarDays, Scale, Clock, ArrowRight, Building, Gavel } from "lucide-react";
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
        <h3 className="text-sm font-bold font-cinzel text-slate-900 dark:text-white flex items-center gap-2">
          <span>{title}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-serif italic">({list.length} Listings)</span>
        </h3>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-200 dark:divide-slate-800 overflow-hidden">
          {list.map((h, i) => {
            const dm = getDayMonth(h.date);
            const isToday = h.date === todayStr;

            return (
              <div
                key={i}
                onClick={() => openCase(h.caseItem.id)}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-center flex-shrink-0 font-mono border ${
                      isToday
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : isUpcoming
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <span className="text-base font-bold font-cinzel leading-tight">{dm.day}</span>
                    <span className="text-[8.5px] uppercase font-bold">{dm.mon}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate font-sans">
                        {h.purpose || "Hearing"}
                      </p>
                      <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
                        [{h.caseItem.caseNo}]
                      </span>
                      {h.caseItem.courtRoom && (
                        <span className="text-[10px] font-mono text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                          {h.caseItem.courtRoom}
                        </span>
                      )}
                      {h.caseItem.itemNo && (
                        <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
                          {h.caseItem.itemNo}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-serif italic">
                      {h.caseItem.title} · {h.caseItem.court}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                    {formatDate(h.date)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold font-cinzel text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Chamber Hearing Register</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic mt-0.5">
            Chronological cause list appearances across High Court, District Courts &amp; Tribunals
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {renderGroup(upcoming, "Upcoming Listed Matters", true)}
        {renderGroup(past, "Past Court Appearances & Transcripts", false)}

        {allHearings.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Scale className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-semibold font-cinzel text-slate-900 dark:text-white">No hearings on chamber register.</p>
          </div>
        )}
      </div>
    </div>
  );
}
