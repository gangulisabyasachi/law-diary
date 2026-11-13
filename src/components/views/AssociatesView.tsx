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
          <h3 className="text-base font-bold font-display text-[#191817]">Chamber Legal Associates</h3>
          <p className="text-xs text-[#736e65]">Junior advocates, legal researchers and working counsel</p>
        </div>

        {currentUser.role === "lawyer" && (
          <button
            onClick={() => openModal("add-associate")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#14171a] text-white text-xs font-semibold hover:bg-[#252930] transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#c5a059]" />
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
              className="p-5 rounded-xl bg-white border border-[#e6e2d8] shadow-sm flex flex-col justify-between hover:border-[#cfc9be] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-full bg-[#14171a] text-[#c5a059] font-bold text-xs flex items-center justify-center font-mono">
                    {assoc.name
                      .replace(/^(Adv\.|Mr\.|Ms\.)\s*/i, "")
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  {pendingSubmissions > 0 ? (
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#fcf5ec] text-[#7a491c] border border-[#ebd8c4] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#7a491c]" /> {pendingSubmissions} in review
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#edf6f0] text-[#1b5e3a] border border-[#cce4d4] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#1b5e3a]" /> Queue clear
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-[#191817] font-serif">{assoc.name}</h4>
                <p className="text-[11px] text-[#805e26] font-medium font-serif">{assoc.designation || "Associate Counsel"}</p>

                <div className="mt-4 space-y-1.5 text-xs text-[#736e65]">
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#8c877e] flex-shrink-0" />
                    <span>{assoc.email}</span>
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <Phone className="w-3.5 h-3.5 text-[#8c877e] flex-shrink-0" />
                    <span>{assoc.phone || "+91 (Chamber Desk)"}</span>
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#f0ece4] flex items-center justify-between text-xs">
                <span className="text-[#736e65] font-serif">Assigned briefs:</span>
                <span className="font-bold text-[#191817] font-mono">{assignedCases.length} matters</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

