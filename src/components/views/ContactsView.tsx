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
        <h3 className="text-base font-bold font-display text-[#191817]">Your Chamber Legal Team</h3>
        <p className="text-xs text-[#736e65]">Principal counsel and working associates handling your briefs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Principal Counsel Card */}
        {lawyer && (
          <div className="p-6 rounded-xl bg-[#14171a] text-white border border-[#252930] flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#c5a059] bg-[#20252b] px-2.5 py-1 rounded border border-[#c5a059]/30">
                  Principal Advocate
                </span>
                <Scale className="w-5 h-5 text-[#c5a059]" />
              </div>

              <h4 className="text-xl font-bold font-display text-white">{lawyer.name}</h4>
              <p className="text-xs text-[#c5a059] font-medium mt-0.5 font-serif">{lawyer.designation || "Senior Counsel"}</p>

              <div className="mt-6 space-y-2 text-xs text-[#d1d5db]">
                <p className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#c5a059]" />
                  <span>{lawyer.email}</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#c5a059]" />
                  <span>{lawyer.phone || "+91 98110 20002"}</span>
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#262a31] text-xs text-[#9ca3af] font-serif">
              Chambers located at New Delhi · Available for court consultations
            </div>
          </div>
        )}

        {/* Working Associates */}
        <div className="bg-white rounded-xl border border-[#e6e2d8] shadow-sm p-6 space-y-4">
          <h4 className="text-sm font-bold font-display text-[#191817]">Working Associates</h4>
          <div className="space-y-3">
            {associates.map((a) => (
              <div key={a.id} className="p-4 rounded-lg bg-[#faf8f5] border border-[#e8e4dc] flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#191817] font-serif">{a.name}</h5>
                  <p className="text-[11px] text-[#805e26] font-medium font-serif">{a.designation || "Associate Counsel"}</p>
                  <p className="text-[11px] text-[#736e65] mt-1">{a.email}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-[#191817] block font-mono">{a.phone || "Chamber Desk"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

