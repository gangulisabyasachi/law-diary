"use client";

import React from "react";
import { UserCheck, Plus, Trash2, RotateCcw, ShieldCheck } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function UsersView() {
  const { state, currentUser, openModal, deleteUser, resetData, addToast } = useChamber();

  if (!state || !currentUser || currentUser.role !== "admin") return null;

  const roleBadge: Record<string, string> = {
    lawyer: "bg-amber-100 text-amber-900 border-amber-300",
    associate: "bg-blue-100 text-blue-900 border-blue-300",
    client: "bg-emerald-100 text-emerald-900 border-emerald-300",
    admin: "bg-rose-100 text-rose-900 border-rose-300",
  };

  const handleReset = async () => {
    if (confirm("Reset all chamber data and return to clean seed state?")) {
      await resetData();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (id === currentUser.id) {
      addToast("Cannot delete your own admin account.", "error");
      return;
    }
    if (confirm(`Are you sure you want to remove user "${name}"?`)) {
      await deleteUser(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold font-display text-slate-900">User Management</h3>
          <p className="text-xs text-slate-500">Chamber accounts, credentials, and access control</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal("add-user")}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add User</span>
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors shadow-sm"
            title="Reset database to seeded demo state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Name &amp; Designation</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {state.users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4">
                  <span className="font-bold text-slate-900 block">{u.name}</span>
                  <span className="text-[11px] text-slate-400">{u.designation || "—"}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${roleBadge[u.role] || ""}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-600">{u.email}</td>
                <td className="py-3.5 px-4 text-slate-500">{u.phone || "—"}</td>
                <td className="py-3.5 px-4 text-right">
                  {u.id !== currentUser.id && (
                    <button
                      onClick={() => handleDelete(u.id, u.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete User"
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

