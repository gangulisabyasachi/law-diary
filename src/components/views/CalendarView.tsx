"use client";

import React from "react";
import { CalendarDays, Scale, Clock, ArrowRight } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function CalendarView() {
  const { state, currentUser, openCase } = useChamber();

  if (!state || !currentUser) return null;

  const todayStr = new Date().toISOString().slice(0, 10);

  const visibleCases = state.cases.filter((c) => {
    if (currentUser.role === "client") return c.clientId === currentUser.id;
    if (currentUser.role === "associate") return c.associateIds.includes(currentUser.id);
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
        <h3 className="text-sm font-bold font-display text-[#191817] flex items-center gap-2">
          {title} <span className="text-xs text-[#736e65] font-normal font-mono">({list.length})</span>
        </h3>

        <div className="bg-white rounded-xl border border-[#e6e2d8] shadow-sm divide-y divide-[#f0ece4] overflow-hidden">
          {list.map((h, i) => {
            const dm = getDayMonth(h.date);
            return (
              <div
                key={i}
                onClick={() => openCase(h.caseItem.id)}
                className="p-4 hover:bg-[#faf8f4] cursor-pointer transition-colors flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center text-center flex-shrink-0 font-display ${
                      isUpcoming ? "bg-[#14171a] text-[#c5a059]" : "bg-[#f0ede6] text-[#5c5852]"
                    }`}
                  >
                    <span className="text-sm font-bold leading-tight">{dm.day}</span>
                    <span className="text-[9px] uppercase font-mono font-medium">{dm.mon}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-[#191817] group-hover:text-[#805e26] transition-colors truncate font-serif">
                        {h.purpose}
                      </p>
                      <span className="text-[11px] font-mono text-[#736e65] font-medium">
                        [{h.caseItem.caseNo}]
                      </span>
                    </div>
                    <p className="text-[11px] text-[#635f59] truncate mt-0.5 font-serif">
                      {h.caseItem.title} · {h.caseItem.court}
                    </p>
                    {h.outcome && (
                      <p className="text-[11px] text-[#1b5e3a] font-medium mt-1 truncate font-serif">
                        Outcome: {h.outcome}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-semibold text-[#191817] block">{formatDate(h.date)}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#805e26] group-hover:text-[#5c431b] transition-colors mt-0.5">
                    Case File <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {renderGroup(upcoming, "Upcoming Court Listings", true)}
      {renderGroup(past, "Past Appearances & Completed Dates", false)}

      {allHearings.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No hearings on file.</p>
          <p className="text-xs text-slate-400 mt-1">
            Dates added to cases will populate this cause list automatically.
          </p>
        </div>
      )}
    </div>
  );
}

