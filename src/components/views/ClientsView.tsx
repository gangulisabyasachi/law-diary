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
          <h3 className="text-base font-bold font-display text-[#191817]">Registered Chamber Clients</h3>
          <p className="text-xs text-[#736e65]">Corporate entities and individual litigants</p>
        </div>

        {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
          <button
            onClick={() => openModal("add-client")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#14171a] text-white text-xs font-semibold hover:bg-[#252930] transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#c5a059]" />
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
              className="p-5 rounded-xl bg-white border border-[#e6e2d8] shadow-sm flex flex-col justify-between hover:border-[#cfc9be] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-full bg-[#f5f3ee] border border-[#e6e2d8] text-[#805e26] font-bold text-xs flex items-center justify-center font-mono">
                    {cl.name
                      .replace(/^(Mr\.|Ms\.|M\/s\.)\s*/i, "")
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f5f3ee] text-[#5e5a54] border border-[#e6e2d8]">
                    {clientCases.length} {clientCases.length === 1 ? "matter" : "matters"}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#191817] font-serif">{cl.name}</h4>
                <p className="text-[11px] text-[#805e26] font-medium font-serif">{cl.designation || "Client"}</p>

                <div className="mt-4 space-y-1.5 text-xs text-[#736e65]">
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#8c877e] flex-shrink-0" />
                    <span>{cl.email}</span>
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <Phone className="w-3.5 h-3.5 text-[#8c877e] flex-shrink-0" />
                    <span>{cl.phone || "No phone added"}</span>
                  </p>
                </div>
              </div>

              {/* Case links */}
              <div className="mt-5 pt-3 border-t border-[#f0ece4]">
                <p className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#736e65] mb-1.5">
                  Associated Files ({activeCases.length} active)
                </p>
                <div className="space-y-1">
                  {clientCases.slice(0, 2).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => openCase(c.id)}
                      className="w-full text-left text-[11px] font-medium text-[#5c5852] hover:text-[#191817] truncate flex items-center justify-between group py-1"
                    >
                      <span className="truncate font-serif"><strong className="font-mono text-[#805e26]">{c.caseNo}</strong> — {c.title}</span>
                      <ArrowRight className="w-3 h-3 text-[#8c877e] group-hover:text-[#805e26] flex-shrink-0 ml-1" />
                    </button>
                  ))}
                  {clientCases.length === 0 && (
                    <span className="text-[11px] text-[#8c877e] italic">No court files assigned.</span>
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

