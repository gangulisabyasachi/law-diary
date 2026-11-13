"use client";

import React from "react";
import { Users, Plus, Mail, Phone, Scale, ArrowRight } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function ClientsView() {
  const { state, currentUser, openModal, openCase } = useChamber();

  if (!state || !currentUser) return null;

  const clients = state.users.filter((u) => u.role === "client");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold font-display text-slate-900">Registered Chamber Clients</h3>
          <p className="text-xs text-slate-500">Corporate entities and individual litigants</p>
        </div>

        {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
          <button
            onClick={() => openModal("add-client")}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Client</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((cl) => {
          const clientCases = state.cases.filter((c) => c.clientId === cl.id);
          const activeCases = clientCases.filter((c) => c.status !== "Disposed");

          return (
            <div
              key={cl.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/15 text-amber-700 font-bold text-xs flex items-center justify-center">
                    {cl.name
                      .replace(/^(Mr\.|Ms\.|M\/s\.)\s*/i, "")
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {clientCases.length} {clientCases.length === 1 ? "matter" : "matters"}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{cl.name}</h4>
                <p className="text-[11px] text-amber-800 font-medium">{cl.designation || "Client"}</p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{cl.email}</span>
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{cl.phone || "No phone added"}</span>
                  </p>
                </div>
              </div>

              {/* Case links */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Associated Files ({activeCases.length} active)
                </p>
                <div className="space-y-1">
                  {clientCases.slice(0, 2).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => openCase(c.id)}
                      className="w-full text-left text-[11px] font-medium text-slate-700 hover:text-amber-700 truncate flex items-center justify-between group"
                    >
                      <span className="truncate">{c.caseNo} — {c.title}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-amber-600 flex-shrink-0 ml-1" />
                    </button>
                  ))}
                  {clientCases.length === 0 && (
                    <span className="text-[11px] text-slate-400 italic">No court files assigned.</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

