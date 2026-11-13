"use client";

import React from "react";
import { Briefcase, Plus, Mail, Phone, Scale, CheckCircle2, Clock } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function AssociatesView() {
  const { state, currentUser, openModal, openCase } = useChamber();

  if (!state || !currentUser) return null;

  const associates = state.users.filter((u) => u.role === "associate");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold font-display text-slate-900">Chamber Legal Associates</h3>
          <p className="text-xs text-slate-500">Junior advocates, legal researchers and working counsel</p>
        </div>

        {currentUser.role === "lawyer" && (
          <button
            onClick={() => openModal("add-associate")}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Associate</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {associates.map((assoc) => {
          const assignedCases = state.cases.filter((c) => c.associateIds.includes(assoc.id));
          const pendingSubmissions = state.approvals.filter((a) => a.by === assoc.id).length;

          return (
            <div
              key={assoc.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center">
                    {assoc.name
                      .replace(/^(Adv\.|Mr\.|Ms\.)\s*/i, "")
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  {pendingSubmissions > 0 ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {pendingSubmissions} in review
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Queue clear
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900">{assoc.name}</h4>
                <p className="text-[11px] text-amber-800 font-medium">{assoc.designation || "Associate Counsel"}</p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{assoc.email}</span>
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{assoc.phone || "+91 (Chamber Desk)"}</span>
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Assigned files:</span>
                <span className="font-bold text-slate-900">{assignedCases.length} matters</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

