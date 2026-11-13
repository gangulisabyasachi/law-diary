"use client";

import React from "react";
import { UserCheck, Plus, Trash2, RotateCcw, ShieldCheck } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function UsersView() {
  const { state, currentUser, openModal, deleteUser, resetData, addToast } = useChamber();

  if (!state || !currentUser || currentUser.role !== "admin") return null;

  const roleBadge: Record<string, string> = {
    lawyer: "bg-[#fcf5ec] text-[#7a491c] border-[#ebd8c4]",
    associate: "bg-[#edf3f8] text-[#1c4d75] border-[#caddee]",
    client: "bg-[#edf6f0] text-[#1b5e3a] border-[#cce4d4]",
    admin: "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]",
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
          <h3 className="text-base font-bold font-display text-[#191817]">User Management</h3>
          <p className="text-xs text-[#736e65]">Chamber accounts, credentials, and access control</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal("add-user")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#14171a] text-white text-xs font-semibold hover:bg-[#252930] transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Add User</span>
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#fecaca] text-[#991b1b] hover:bg-[#fef2f2] text-xs font-semibold transition-colors"
            title="Reset database to seeded demo state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e6e2d8] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fbfaf8] border-b border-[#e6e2d8] text-[10px] font-mono uppercase tracking-wider text-[#736e65]">
              <th className="py-3 px-4">Name &amp; Designation</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ece4] text-xs">
            {state.users.map((u) => (
              <tr key={u.id} className="hover:bg-[#faf8f5] transition-colors">
                <td className="py-3.5 px-4">
                  <span className="font-bold text-[#191817] font-serif block">{u.name}</span>
                  <span className="text-[11px] text-[#736e65] font-serif">{u.designation || "—"}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border capitalize ${roleBadge[u.role] || ""}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-[#5e5a54]">{u.email}</td>
                <td className="py-3.5 px-4 text-[#736e65] font-mono">{u.phone || "—"}</td>
                <td className="py-3.5 px-4 text-right">
                  {u.id !== currentUser.id && (
                    <button
                      onClick={() => handleDelete(u.id, u.name)}
                      className="p-1.5 rounded-lg text-[#8c877e] hover:text-[#991b1b] hover:bg-[#fef2f2] transition-colors"
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

