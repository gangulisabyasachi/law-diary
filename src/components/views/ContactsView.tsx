"use client";

import React from "react";
import { Scale, Mail, Phone, Building, UserCheck, ShieldCheck } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function ContactsView() {
  const { state, currentUser } = useChamber();

  if (!state || !currentUser) return null;

  const retainedLawyerId =
    currentUser.lawyerId ||
    state.cases.find((c) => c.clientId === currentUser.id)?.lawyerId ||
    state.cases[0]?.lawyerId;

  const lawyer =
    state.users.find((u) => u.id === retainedLawyerId) ||
    state.users.find((u) => u.role === "lawyer") || {
      name: "Adv. Arjun Mehta",
      email: "lawyer@chambers.in",
      phone: "+91 98110 20002",
      designation: "Senior Counsel & Principal Advocate (D/1482/2012)",
    };

  const associates = state.users.filter(
    (u) => u.role === "associate" && (!retainedLawyerId || (u.lawyerId || "u-lawyer") === (retainedLawyerId || "u-lawyer"))
  );
  const admin = state.users.find((u) => u.role === "admin");

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-2 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
        <h3 className="text-lg font-bold font-cinzel text-[#111111] dark:text-[#f3eee3] flex items-center gap-2">
          <Scale className="w-5 h-5 text-[#111111] dark:text-[#f3eee3]" />
          <span>Retained Legal Counsel &amp; Chamber Contacts</span>
        </h3>
        <p className="text-xs text-[#111111]/60 dark:text-[#f3eee3]/50 font-serif italic mt-0.5">
          Direct communication channels with your designated Senior Advocate, Briefing Associates, and Chamber Registrar.
        </p>
      </div>

      {/* Senior Counsel Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-[#111111] dark:hover:border-[#f3eee3]/50 transition-all">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#111111] dark:bg-[#f3eee3] text-[#f3eee3] dark:text-[#111111] font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-md shadow-[#f3eee3]/20 dark:shadow-[#f3eee3]/20">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#111111]/70 dark:text-[#f3eee3] font-bold font-cinzel block">
              Lead Arguing Counsel &amp; Senior Advocate
            </span>
            <h4 className="text-xl font-bold font-cinzel text-[#111111] dark:text-[#f3eee3] mt-0.5">{lawyer.name}</h4>
            <p className="text-xs text-[#111111]/60 dark:text-[#f3eee3]/50 font-serif italic mt-0.5">{lawyer.designation}</p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs text-[#111111]/80 dark:text-[#f3eee3]/80 sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0 border-[#111111]/10 dark:border-[#f3eee3]/10">
          <p className="flex sm:justify-end items-center gap-2">
            <Mail className="w-4 h-4 text-[#111111] dark:text-[#f3eee3] flex-shrink-0" />
            <span>Email: <strong className="text-[#111111] dark:text-[#f3eee3] font-mono">{lawyer.email}</strong></span>
          </p>
          <p className="flex sm:justify-end items-center gap-2">
            <Phone className="w-4 h-4 text-[#111111] dark:text-[#f3eee3] flex-shrink-0" />
            <span>Direct Phone: <strong className="text-[#111111] dark:text-[#f3eee3] font-mono">{lawyer.phone || "+91 98110 20002"}</strong></span>
          </p>
        </div>
      </div>

      {/* Briefing Associates */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#111111]/60 dark:text-[#f3eee3]/50 font-cinzel">
          Assigned Briefing Associates &amp; Junior Counsel
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {associates.map((a) => (
            <div
              key={a.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] space-y-2.5 hover:border-[#111111] dark:hover:border-[#f3eee3]/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#111111] dark:text-[#f3eee3] font-cinzel">{a.name}</span>
                <span className="text-[10px] font-bold text-[#111111] dark:text-[#f3eee3] px-2.5 py-0.5 rounded-full bg-[#111111]/10 dark:bg-[#f3eee3]/15 border border-[#111111]/40 dark:border-[#f3eee3]/30">
                  Associate
                </span>
              </div>
              <p className="text-xs text-[#111111]/60 dark:text-[#f3eee3]/50 font-serif italic">{a.designation || "Briefing Advocate"}</p>
              <div className="pt-2.5 border-t border-[#111111]/10 dark:border-[#f3eee3]/10 text-xs font-mono text-[#111111]/70 dark:text-[#f3eee3]/70 space-y-1">
                <p>Email: {a.email}</p>
                <p>Phone: {a.phone || "—"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chamber Registrar Notice */}
      <div className="p-6 rounded-3xl bg-[#111111]/5 dark:bg-white/5 border border-[#111111]/15 dark:border-[#f3eee3]/20 space-y-2 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Building className="w-4 h-4 text-[#111111] dark:text-[#f3eee3]" />
          <p className="text-[#111111] dark:text-[#f3eee3] font-bold font-cinzel text-xs tracking-wider">
            Chamber Registrar &amp; Registry Desk
          </p>
        </div>
        <p className="text-xs text-[#111111]/70 dark:text-[#f3eee3]/70 font-serif leading-relaxed">
          For urgent listing mentions, pass-over requests, or certified true copies, contact Chamber Registrar: <strong className="text-[#111111] dark:text-[#f3eee3] font-sans">{admin?.name || "Devika Nair"}</strong> ({admin?.phone || "+91 98110 20001"}).
        </p>
      </div>
    </div>
  );
}
