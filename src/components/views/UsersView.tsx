"use client";

import React from "react";
import { UserCheck, Plus, Trash2, Mail, Phone, ShieldCheck, Key, RefreshCw } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function UsersView() {
  const { state, currentUser, openModal, deleteUser, resetData } = useChamber();

  if (!state || !currentUser) return null;

  const users = state.users;

  const roleBadge: Record<string, string> = {
    lawyer: "bg-[#111111]/10 dark:bg-[#f3eee3]/15 text-[#111111] dark:text-[#f3eee3] border-[#111111]/40 dark:border-[#f3eee3]/30",
    associate: "bg-[#111111]/5 dark:bg-white/5 text-[#111111] dark:text-[#f3eee3] border-[#111111]/15 dark:border-[#f3eee3]/20",
    client: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20",
    admin: "bg-purple-500/10 text-purple-800 dark:text-purple-300 border-purple-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
        <div>
          <h3 className="text-lg font-bold font-cinzel text-[#111111] dark:text-[#f3eee3] flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#111111] dark:text-[#f3eee3]" />
            <span>Chamber Account Directory &amp; User Credentials</span>
          </h3>
          <p className="text-xs text-[#111111]/60 dark:text-[#f3eee3]/50 font-serif italic mt-0.5">
            Manage authorized advocate, associate, litigant, and administrator login accounts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openModal("add-user")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm text-xs font-bold font-sans tracking-wide transition-all shadow-md hover:scale-[1.01]"
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-[#111111]/5 dark:bg-white/5 text-[#111111]/70 dark:text-[#f3eee3]/70 hover:bg-[#111111]/10 dark:hover:bg-white/10 text-xs font-semibold tracking-wider transition-colors"
            title="Restore default chamber records"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#111111] dark:text-[#f3eee3]" />
            <span className="hidden sm:inline">Restore Defaults</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#181818] rounded-3xl border border-[#111111]/15 dark:border-[#f3eee3]/20 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#111111]/5 dark:bg-white/5 border-b border-[#111111]/10 dark:border-[#f3eee3]/10 text-[#111111]/60 dark:text-[#f3eee3]/50 font-cinzel text-[10px] uppercase tracking-wider">
              <th className="py-4 px-5 font-semibold">User Details</th>
              <th className="py-4 px-5 font-semibold">Role</th>
              <th className="py-4 px-5 font-semibold">Designation</th>
              <th className="py-4 px-5 font-semibold">Chamber Email</th>
              <th className="py-4 px-5 font-semibold">Phone</th>
              <th className="py-4 px-5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111111]/10 dark:divide-[#f3eee3]/15">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/60 dark:hover:bg-white/[0.03] transition-colors">
                <td className="py-4 px-5">
                  <div className="font-bold text-[#111111] dark:text-[#f3eee3] font-cinzel">{u.name}</div>
                  <div className="text-[10px] font-mono text-[#111111]/50 dark:text-[#f3eee3]/40">{u.id}</div>
                </td>
                <td className="py-4 px-5">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-bold uppercase border ${
                      roleBadge[u.role] || "bg-[#111111]/5 text-[#111111]"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-4 px-5 text-[#111111]/70 dark:text-[#f3eee3]/60 font-serif italic">
                  {u.designation || "—"}
                </td>
                <td className="py-4 px-5 font-mono text-[#111111] dark:text-[#f3eee3]">
                  {u.email}
                </td>
                <td className="py-4 px-5 font-mono text-[#111111]/60 dark:text-[#f3eee3]/50">
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
