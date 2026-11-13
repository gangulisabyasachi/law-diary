"use client";

import React from "react";
import { UserCheck, Plus, Trash2, Mail, Phone, ShieldCheck, Key, RefreshCw } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function UsersView() {
  const { state, currentUser, openModal, deleteUser, resetData } = useChamber();

  if (!state || !currentUser) return null;

  const users = state.users;

  const roleBadge: Record<string, string> = {
    lawyer: "bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/40",
    associate: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40",
    client: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40",
    admin: "bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/40",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold font-cinzel text-slate-900 dark:text-white">
            Chamber Account Directory &amp; User Credentials
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic mt-0.5">
            Manage authorized advocate, associate, litigant, and administrator login accounts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openModal("add-user")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-semibold tracking-wider transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Provision Account</span>
          </button>

          <button
            onClick={() => {
              if (confirm("Restore default chamber records and authorized accounts?")) {
                resetData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold tracking-wider transition-colors shadow-xs"
            title="Restore default chamber records"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Restore Defaults</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-cinzel text-[10px] uppercase tracking-wider">
              <th className="py-3.5 px-4 font-semibold">User Details</th>
              <th className="py-3.5 px-4 font-semibold">Role</th>
              <th className="py-3.5 px-4 font-semibold">Designation</th>
              <th className="py-3.5 px-4 font-semibold">Chamber Email</th>
              <th className="py-3.5 px-4 font-semibold">Phone</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 dark:text-white font-sans">{u.name}</div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{u.id}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-md text-[9.5px] font-bold uppercase border ${
                      roleBadge[u.role] || "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-serif italic">
                  {u.designation || "—"}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-900 dark:text-white">
                  {u.email}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                  {u.phone || "—"}
                </td>
                <td className="py-3.5 px-4 text-right">
                  {u.id !== currentUser.id && u.id !== "u-lawyer" && u.id !== "u-admin" && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove account for ${u.name}?`)) {
                          deleteUser(u.id);
                        }
                      }}
                      className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                      title="De-provision user account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
