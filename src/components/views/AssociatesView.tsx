"use client";

import React from "react";
import { Briefcase, Plus, Mail, Phone, Scale, ArrowRight, UserCheck } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function AssociatesView() {
  const { state, currentUser, openModal, openCase } = useChamber();

  if (!state || !currentUser) return null;

  const myCases = state.cases.filter((c) => (c.lawyerId || "u-lawyer") === currentUser.id);
  const myAssociateIds = new Set(myCases.flatMap((c) => c.associateIds || []));

  const associates = state.users.filter((u) => {
    if (u.role !== "associate") return false;
    if (currentUser.role === "lawyer") {
      return (u.lawyerId || "u-lawyer") === currentUser.id || myAssociateIds.has(u.id);
    }
    if (currentUser.role === "associate") {
      const supervisingLawyerId = currentUser.lawyerId || "u-lawyer";
      return (u.lawyerId || "u-lawyer") === supervisingLawyerId;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold font-cinzel text-slate-900 dark:text-white">
            Chamber Associate Roster &amp; Briefing Counsel
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic mt-0.5">
            Junior and Senior Associates assigned to High Court, District Court &amp; Tribunal dockets.
          </p>
        </div>

        {(currentUser.role === "lawyer" || currentUser.role === "admin") && (
          <button
            onClick={() => openModal("add-associate")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-semibold tracking-wider transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Induct Associate Counsel</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {associates.map((assoc) => {
          const assignedCases = state.cases.filter((c) => c.associateIds.includes(assoc.id));
          const pendingDrafts = state.approvals.filter((a) => a.by === assoc.id).length;

          return (
            <div
              key={assoc.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-500 dark:hover:border-blue-600 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center font-mono">
                    {assoc.name
                      .replace(/^(Adv\.|Mr\.|Ms\.)\s*/i, "")
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {pendingDrafts > 0 && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-800/40">
                        {pendingDrafts} in Review
                      </span>
                    )}
                    <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {assignedCases.length} Matters
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-sans">{assoc.name}</h4>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium font-serif italic mt-0.5">{assoc.designation || "Associate Advocate"}</p>

                <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                  <p className="flex items-center gap-2 truncate font-mono text-[11px]">
                    <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span>{assoc.email}</span>
                  </p>
                  <p className="flex items-center gap-2 font-mono text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span>{assoc.phone || "—"}</span>
                  </p>
                </div>
              </div>

              {/* Assigned Matters */}
              <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
                  Assigned Dockets ({assignedCases.length})
                </p>
                {assignedCases.length === 0 ? (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic font-serif">No court matters assigned yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {assignedCases.slice(0, 3).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => openCase(c.id)}
                        className="w-full text-left text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 truncate flex items-center justify-between group py-1 font-sans"
                      >
                        <span className="truncate">
                          <strong className="font-mono text-blue-600 dark:text-blue-400">{c.caseNo}</strong> — {c.title}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0 ml-1" />
                      </button>
                    ))}
                    {assignedCases.length > 3 && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-serif italic">
                        +{assignedCases.length - 3} additional briefs
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
