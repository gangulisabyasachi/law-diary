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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-base font-bold font-cinzel text-slate-900 dark:text-white">
          Retained Legal Counsel &amp; Chamber Contacts
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic mt-0.5">
          Direct communication channels with your designated Senior Advocate, Briefing Associates, and Chamber Registrar.
        </p>
      </div>

      {/* Senior Counsel Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-500/30 text-blue-400 font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold block">
              Lead Arguing Counsel &amp; Senior Advocate
            </span>
            <h4 className="text-lg font-bold font-cinzel text-slate-900 dark:text-white mt-0.5">{lawyer.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic">{lawyer.designation}</p>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span>Email: <strong className="text-slate-900 dark:text-white font-mono">{lawyer.email}</strong></span>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span>Direct Phone: <strong className="text-slate-900 dark:text-white font-mono">{lawyer.phone || "+91 98110 20002"}</strong></span>
          </p>
        </div>
      </div>

      {/* Briefing Associates */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Assigned Briefing Associates &amp; Junior Counsel
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {associates.map((a) => (
            <div key={a.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white font-sans">{a.name}</span>
                <span className="text-[9.5px] text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">Associate</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-serif italic">{a.designation || "Briefing Advocate"}</p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-1">
                <p>Email: {a.email}</p>
                <p>Phone: {a.phone || "—"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chamber Registrar Notice */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <p className="text-slate-900 dark:text-white font-semibold font-cinzel text-xs tracking-wider">
            Chamber Registrar &amp; Registry Desk
          </p>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-serif leading-relaxed">
          For urgent listing mentions, pass-over requests, or certified true copies, contact Chamber Registrar: <strong className="text-slate-900 dark:text-white font-sans">{admin?.name || "Devika Nair"}</strong> ({admin?.phone || "+91 98110 20001"}).
        </p>
      </div>
    </div>
  );
}
