"use client";

import React from "react";
import { PhoneCall, Mail, Phone, Scale, User, ShieldCheck } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function ContactsView() {
  const { state, currentUser } = useChamber();

  if (!state || !currentUser) return null;

  const lawyer = state.users.find((u) => u.role === "lawyer");
  const associates = state.users.filter((u) => u.role === "associate");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold font-display text-slate-900">Your Chamber Legal Team</h3>
        <p className="text-xs text-slate-500">Principal counsel and working associates handling your briefs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Principal Counsel Card */}
        {lawyer && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white shadow-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                  Principal Advocate
                </span>
                <Scale className="w-5 h-5 text-amber-400" />
              </div>

              <h4 className="text-xl font-bold font-display text-white">{lawyer.name}</h4>
              <p className="text-xs text-amber-300 font-medium mt-0.5">{lawyer.designation || "Senior Counsel"}</p>

              <div className="mt-6 space-y-2 text-xs text-slate-300">
                <p className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>{lawyer.email}</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>{lawyer.phone || "+91 98110 20002"}</span>
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-400">
              Chambers located at New Delhi · Available for court consultations
            </div>
          </div>
        )}

        {/* Working Associates */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h4 className="text-sm font-bold font-display text-slate-900">Working Associates</h4>
          <div className="space-y-3">
            {associates.map((a) => (
              <div key={a.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{a.name}</h5>
                  <p className="text-[11px] text-amber-700 font-medium">{a.designation || "Associate Counsel"}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{a.email}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-700 block">{a.phone || "Chamber Desk"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

