"use client";

import React from "react";
import { UserCheck, Plus, Trash2, Mail, Phone, ShieldCheck, Key, RefreshCw } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function UsersView() {
  const { state, currentUser, openModal, deleteUser, resetData } = useChamber();

  if (!state || !currentUser) return null;

  const users = state.users;

  const roleBadge: Record<string, string> = {
    lawyer: "bg-[#0b0f14]/10 dark:bg-[#3df2e0]/15 text-[#0b0f14] dark:text-[#3df2e0] border-[#0b0f14]/40 dark:border-[#3df2e0]/30",
    associate: "bg-[#0b0f14]/5 dark:bg-white/5 text-[#0b0f14] dark:text-[#3df2e0] border-[#0b0f14]/15 dark:border-[#3df2e0]/20",
    client: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20",
    admin: "bg-purple-500/10 text-purple-800 dark:text-purple-300 border-purple-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#0b0f14]/10 dark:border-[#3df2e0]/10">
        <div>
          <h3 className="text-lg font-bold font-cinzel text-[#0b0f14] dark:text-[#3df2e0] flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#0b0f14] dark:text-[#3df2e0]" />
            <span>Chamber Account Directory &amp; User Credentials</span>
          </h3>
          <p className="text-xs text-[#0b0f14]/60 dark:text-[#3df2e0]/50 font-serif italic mt-0.5">
            Manage authorized advocate, associate, litigant, and administrator login accounts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openModal("add-user")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1b1d3a] text-[#e8d5b5] hover:bg-[#25284e] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] dark:hover:bg-[#dfc8a2] text-xs font-bold font-sans tracking-wide transition-all shadow-md hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4" />
            <span>Provision Account</span>
          </button>

          <button
            onClick={() => {
              if (confirm("Restore default chamber records and authorized accounts?")) {
                resetData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 bg-[#0b0f14]/5 dark:bg-white/5 text-[#0b0f14]/70 dark:text-[#3df2e0]/70 hover:bg-[#0b0f14]/10 dark:hover:bg-white/10 text-xs font-semibold tracking-wider transition-colors"
            title="Restore default chamber records"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#0b0f14] dark:text-[#3df2e0]" />
            <span className="hidden sm:inline">Restore Defaults</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f151c] rounded-3xl border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#0b0f14]/5 dark:bg-white/5 border-b border-[#0b0f14]/10 dark:border-[#3df2e0]/10 text-[#0b0f14]/60 dark:text-[#3df2e0]/50 font-cinzel text-[10px] uppercase tracking-wider">
              <th className="py-4 px-5 font-semibold">User Details</th>
              <th className="py-4 px-5 font-semibold">Role</th>
              <th className="py-4 px-5 font-semibold">Designation</th>
              <th className="py-4 px-5 font-semibold">Chamber Email</th>
              <th className="py-4 px-5 font-semibold">Phone</th>
              <th className="py-4 px-5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0b0f14]/10 dark:divide-[#3df2e0]/15">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/60 dark:hover:bg-white/[0.03] transition-colors">
                <td className="py-4 px-5">
                  <div className="font-bold text-[#0b0f14] dark:text-[#3df2e0] font-cinzel">{u.name}</div>
                  <div className="text-[10px] font-mono text-[#0b0f14]/50 dark:text-[#3df2e0]/40">{u.id}</div>
                </td>
                <td className="py-4 px-5">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-bold uppercase border ${
                      roleBadge[u.role] || "bg-[#0b0f14]/5 text-[#0b0f14]"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-4 px-5 text-[#0b0f14]/70 dark:text-[#3df2e0]/60 font-serif italic">
                  {u.designation || "—"}
                </td>
                <td className="py-4 px-5 font-mono text-[#0b0f14] dark:text-[#3df2e0]">
                  {u.email}
                </td>
                <td className="py-4 px-5 font-mono text-[#0b0f14]/60 dark:text-[#3df2e0]/50">
                  {u.phone || "—"}
                </td>
                <td className="py-4 px-5 text-right">
                  {u.id !== currentUser.id && u.id !== "u-lawyer" && u.id !== "u-admin" && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove account for ${u.name}?`)) {
                          deleteUser(u.id);
                        }
                      }}
                      className="text-rose-600 hover:text-rose-700 p-2 rounded-xl hover:bg-rose-500/10 transition-colors"
                      title="De-provision user account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
