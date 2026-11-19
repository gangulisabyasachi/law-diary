"use client";

import React from "react";
import { Users, Plus, Mail, Phone, Scale, ArrowRight, Building, Edit3 } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function ClientsView() {
  const { state, currentUser, openModal, openCase } = useChamber();

  if (!state || !currentUser) return null;

  const myCases = state.cases.filter((c) => (c.lawyerId || "u-lawyer") === currentUser.id);
  const myClientIds = new Set(myCases.map((c) => c.clientId));

  const clients = state.users.filter((u) => {
    if (u.role !== "client") return false;
    if (currentUser.role === "lawyer") {
      return (u.lawyerId || "u-lawyer") === currentUser.id || myClientIds.has(u.id);
    }
    if (currentUser.role === "associate") {
      const supervisingLawyerId = currentUser.lawyerId || "u-lawyer";
      return (u.lawyerId || "u-lawyer") === supervisingLawyerId || myClientIds.has(u.id);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
        <div>
          <h3 className="text-lg font-bold font-cinzel text-[#111111] dark:text-[#f3eee3] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#111111] dark:text-[#f3eee3]" />
            <span>Registered Chamber Clients (Litigants on Record)</span>
          </h3>
          <p className="text-xs text-[#111111]/60 dark:text-[#f3eee3]/50 font-serif italic mt-0.5">
            Corporate entities, managing directors, and individual petitioners/respondents.
          </p>
        </div>

        {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
          <button
            onClick={() => openModal("add-client")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm text-xs font-bold font-sans tracking-wide transition-all shadow-md hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Client Brief</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clients.map((cl) => {
          const clientCases = state.cases.filter((c) => c.clientId === cl.id);

          return (
            <div
              key={cl.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col justify-between hover:border-[#111111] dark:hover:border-[#f3eee3]/50 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#111111]/5 dark:bg-white/5 border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] font-bold text-xs flex items-center justify-center font-mono">
                    {cl.name
                      .replace(/^(Mr\.|Ms\.|M\/s\.)\s*/i, "")
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#111111]/5 dark:bg-white/5 text-[#111111] dark:text-[#f3eee3] border border-[#111111]/15 dark:border-[#f3eee3]/20">
                      {clientCases.length} {clientCases.length === 1 ? "Matter" : "Matters"}
                    </span>
                    {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
                      <button
                        onClick={() => openModal("edit-client", { client: cl })}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#111111]/15 dark:border-[#f3eee3]/20 hover:border-[#d9541e] text-[10.5px] font-cinzel font-semibold text-[#111111] dark:text-[#f3eee3] transition-all hover:text-[#d9541e] cursor-pointer"
                        title={currentUser.role === "associate" ? "Edit Client (Submits for Senior Advocate approval)" : "Edit Client Details & Password"}
                      >
                        <Edit3 className="w-3 h-3 text-[#d9541e]" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </div>

                <h4 className="text-base font-bold text-[#111111] dark:text-[#f3eee3] font-cinzel">{cl.name}</h4>
                <p className="text-xs text-[#111111]/70 dark:text-[#f3eee3] font-medium font-serif italic mt-0.5">
                  {cl.designation || "Litigant Client"}
                </p>

                <div className="mt-4 space-y-2 text-xs text-[#111111]/70 dark:text-[#f3eee3]/70">
                  <p className="flex items-center gap-2 truncate font-mono text-[11px]">
                    <Mail className="w-3.5 h-3.5 text-[#111111]/60 dark:text-[#f3eee3] flex-shrink-0" />
                    <span>{cl.email}</span>
                  </p>
                  <p className="flex items-center gap-2 font-mono text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-[#111111]/60 dark:text-[#f3eee3] flex-shrink-0" />
                    <span>{cl.phone || "—"}</span>
                  </p>
                </div>
              </div>

              {/* Matters Briefed */}
              <div className="mt-6 pt-4 border-t border-[#111111]/10 dark:border-[#f3eee3]/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/50 dark:text-[#f3eee3]/40 mb-2.5 font-cinzel">
                  Retained Matters ({clientCases.length})
                </p>
                {clientCases.length === 0 ? (
                  <p className="text-xs text-[#111111]/40 dark:text-[#f3eee3]/40 italic font-serif">No Vakalatnama registered.</p>
                ) : (
                  <div className="space-y-2">
                    {clientCases.slice(0, 3).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => openCase(c.id)}
                        className="w-full text-left text-xs font-medium text-[#111111]/80 dark:text-[#f3eee3]/80 hover:text-[#111111] dark:hover:text-[#f3eee3] truncate flex items-center justify-between group/link py-1 font-sans transition-colors"
                      >
                        <span className="truncate">
                          <strong className="font-mono text-[#111111] dark:text-[#f3eee3] mr-1.5">{c.caseNo}</strong>
                          <span className="font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/60">{c.title}</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#111111]/40 dark:text-[#f3eee3]/40 group-hover/link:text-[#111111] dark:group-hover/link:text-[#f3eee3] flex-shrink-0 ml-1 group-hover/link:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                    {clientCases.length > 3 && (
                      <p className="text-[10px] text-[#111111]/50 dark:text-[#f3eee3]/40 font-serif italic pt-1">
                        +{clientCases.length - 3} additional matters on file
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {clients.length === 0 && (
          <div className="col-span-full p-16 text-center bg-white dark:bg-[#181818] rounded-3xl border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            <Users className="w-10 h-10 mx-auto mb-3 text-[#111111]/40 dark:text-[#f3eee3]/60" />
            <p className="text-sm font-semibold font-cinzel text-[#111111] dark:text-[#f3eee3]">No enrolled clients in chamber registry.</p>
            <p className="text-xs text-[#111111]/50 dark:text-[#f3eee3]/50 font-serif italic mt-1">Enroll your clients to give them secure access to case tracking.</p>
          </div>
        )}
      </div>
    </div>
  );
}
