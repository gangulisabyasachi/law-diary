"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  UserCheck,
  Plus,
  Trash2,
  Mail,
  Phone,
  ShieldCheck,
  Key,
  RefreshCw,
  Search,
  Filter,
  Power,
  Edit,
  Building,
  Check,
  Copy,
  Users,
  Briefcase,
  AlertTriangle,
  Lock,
  ChevronRight,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";
import { User, UserRole } from "@/types";

export function UsersView() {
  const { state, currentUser, openModal, deleteUser, toggleUserStatus, resetData, addToast } = useChamber();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");
  const [chamberFilter, setChamberFilter] = useState<string>("all");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  if (!state || !currentUser) return null;

  const users = state.users || [];
  const lawyers = users.filter((u) => u.role === "lawyer");
  const associates = users.filter((u) => u.role === "associate");
  const clients = users.filter((u) => u.role === "client");
  const disabledUsers = users.filter((u) => u.disabled || u.status === "disabled");

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role filter
      if (roleFilter !== "all" && u.role !== roleFilter) return false;

      // Status filter
      const isDisabled = Boolean(u.disabled || u.status === "disabled");
      if (statusFilter === "active" && isDisabled) return false;
      if (statusFilter === "disabled" && !isDisabled) return false;

      // Chamber filter (matches lawyerId for associates/clients or id for lawyers)
      if (chamberFilter !== "all") {
        if (u.role === "lawyer" && u.id !== chamberFilter) return false;
        if ((u.role === "associate" || u.role === "client") && (u.lawyerId || "u-lawyer") !== chamberFilter) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const cleanDigits = q.replace(/\D/g, "");
        const matchName = (u.name || "").toLowerCase().includes(q);
        const matchEmail = (u.email || "").toLowerCase().includes(q);
        const matchPhone = cleanDigits && (u.phone || "").replace(/\D/g, "").includes(cleanDigits);
        const matchId = (u.id || "").toLowerCase().includes(q);
        const matchDesignation = (u.designation || "").toLowerCase().includes(q);
        const matchCode = (u.accessCode || "").toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchId && !matchDesignation && !matchCode) {
          return false;
        }
      }

      return true;
    });
  }, [users, roleFilter, statusFilter, chamberFilter, searchQuery]);

  const handleCopyCode = (code: string, id: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
    addToast(`Passcode ${code} copied to clipboard`, "info");
  };

  const roleBadge: Record<UserRole, { bg: string; text: string; border: string; label: string }> = {
    lawyer: {
      bg: "bg-[#d9541e]/10 dark:bg-[#d9541e]/20",
      text: "text-[#d9541e] dark:text-[#ea6026]",
      border: "border-[#d9541e]/30",
      label: "Advocate",
    },
    associate: {
      bg: "bg-blue-500/10 dark:bg-blue-500/20",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-500/30",
      label: "Associate Advocate",
    },
    client: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      text: "text-emerald-800 dark:text-emerald-300",
      border: "border-emerald-500/30",
      label: "Retained Client",
    },
    admin: {
      bg: "bg-purple-500/10 dark:bg-purple-500/20",
      text: "text-purple-800 dark:text-purple-300",
      border: "border-purple-500/30",
      label: "Super Admin",
    },
  };

  return (
    <div className="space-y-6">
      {/* Platform Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-[#d9541e]/10 text-[#d9541e] dark:bg-[#d9541e]/20 dark:text-[#ea6026] border border-[#d9541e]/30">
              <ShieldCheck className="w-3 h-3" /> Root Platform Administration
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-[#111111] dark:text-[#f3eee3] tracking-wide">
            User Directory &amp; Access Control Desk
          </h2>
          <p className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic mt-0.5">
            Manage multi-chamber users, enable/disable access rights, modify credentials &amp; edit profile details.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => openModal("provision-advocate")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] text-xs font-cinzel font-bold tracking-wider transition-all shadow-md hover:scale-[1.01] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Provision Advocate Account</span>
          </button>

          <button
            onClick={() => {
              if (confirm("Restore default chamber accounts and demo database?")) {
                resetData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] text-[#111111]/70 dark:text-[#f3eee3]/70 hover:text-[#111111] dark:hover:text-white text-xs font-cinzel font-semibold transition-colors cursor-pointer"
            title="Restore default database seed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Restore Defaults</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-cinzel font-bold text-[#111111]/60 dark:text-[#f3eee3]/60 uppercase tracking-wider">
              Total Users
            </span>
            <Users className="w-4 h-4 text-[#111111]/50 dark:text-[#f3eee3]/50" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">{users.length}</p>
          <span className="text-[10px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">Across all chambers</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-cinzel font-bold text-[#d9541e] uppercase tracking-wider">
              Chambers / Lawyers
            </span>
            <Building className="w-4 h-4 text-[#d9541e]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#d9541e]">{lawyers.length}</p>
          <span className="text-[10px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">Advocates</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-cinzel font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Associates
            </span>
            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-blue-700 dark:text-blue-300">{associates.length}</p>
          <span className="text-[10px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">Briefing &amp; Juniors</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-cinzel font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Clients
            </span>
            <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-300">{clients.length}</p>
          <span className="text-[10px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">Retained Litigants</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-cinzel font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Disabled
            </span>
            <Power className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-rose-700 dark:text-rose-400">{disabledUsers.length}</p>
          <span className="text-[10px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">Revoked logins</span>
        </div>
      </div>

      {/* Control & Search Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111111]/50 dark:text-[#f3eee3]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, Email, Phone, Passcode, or ID..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#f3eee3]/20 dark:bg-[#202020] border border-[#111111]/10 dark:border-[#f3eee3]/15 text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/45 focus:outline-none focus:border-[#d9541e]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Role Filter Tabs */}
          <div className="flex items-center bg-[#f3eee3]/30 dark:bg-[#202020] p-1 rounded-2xl border border-[#111111]/10 dark:border-[#f3eee3]/10 font-cinzel text-[11px] font-semibold">
            {[
              { id: "all", label: "All" },
              { id: "lawyer", label: `Lawyers (${lawyers.length})` },
              { id: "associate", label: `Associates (${associates.length})` },
              { id: "client", label: `Clients (${clients.length})` },
              { id: "admin", label: "Admins" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id)}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  roleFilter === tab.id
                    ? "bg-[#111111] text-white dark:bg-[#f3eee3] dark:text-[#111111] shadow-xs"
                    : "text-[#111111]/70 dark:text-[#f3eee3]/70 hover:text-[#111111] dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-2xl bg-[#f3eee3]/20 dark:bg-[#202020] border border-[#111111]/10 dark:border-[#f3eee3]/15 text-xs font-cinzel font-semibold text-[#111111] dark:text-[#f3eee3] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="disabled">Disabled Only</option>
          </select>

          {/* Chamber Filter */}
          <select
            value={chamberFilter}
            onChange={(e) => setChamberFilter(e.target.value)}
            className="px-3 py-1.5 rounded-2xl bg-[#f3eee3]/20 dark:bg-[#202020] border border-[#111111]/10 dark:border-[#f3eee3]/15 text-xs font-cinzel font-semibold text-[#111111] dark:text-[#f3eee3] cursor-pointer"
          >
            <option value="all">All Chambers</option>
            {lawyers.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Master Table */}
      <div className="bg-white dark:bg-[#181818] rounded-3xl border border-[#111111]/15 dark:border-[#f3eee3]/20 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#111111]/5 dark:bg-white/5 border-b border-[#111111]/10 dark:border-[#f3eee3]/10 text-[#111111]/60 dark:text-[#f3eee3]/50 font-cinzel text-[10px] uppercase tracking-wider">
                <th className="py-4 px-5 font-semibold">User Identity</th>
                <th className="py-4 px-4 font-semibold">Platform Role</th>
                <th className="py-4 px-4 font-semibold">Designation / Chamber</th>
                <th className="py-4 px-4 font-semibold">Contact</th>
                <th className="py-4 px-4 font-semibold">Login Passcode</th>
                <th className="py-4 px-4 font-semibold text-center">Account Access</th>
                <th className="py-4 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111111]/10 dark:divide-[#f3eee3]/15">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">
                    No user accounts match the selected filters or search query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const badge = roleBadge[u.role] || roleBadge.lawyer;
                  const isDisabled = Boolean(u.disabled || u.status === "disabled");
                  const supervisingLawyer =
                    u.role === "associate" || u.role === "client"
                      ? lawyers.find((l) => l.id === (u.lawyerId || "u-lawyer"))
                      : null;

                  const initials = u.name
                    .replace(/^(Adv\.|Mr\.|Ms\.)\s*/i, "")
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "LD";

                  const passcode =
                    u.accessCode ||
                    (u.role === "client"
                      ? u.id === "u-client"
                        ? "client123"
                        : "LD" + u.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase()
                      : u.role === "associate"
                      ? "assoc123"
                      : u.role === "lawyer"
                      ? (u.id === "u-lawyer" ? "lawyer123" : "LD" + u.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase())
                      : "admin123");

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors ${
                        isDisabled ? "opacity-60 bg-rose-500/[0.03]" : ""
                      }`}
                    >
                      {/* Identity */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-cinzel font-bold text-xs shrink-0 border ${
                            u.role === "lawyer"
                              ? "bg-[#111111] text-[#f3eee3] border-[#c5a059]/40"
                              : u.role === "associate"
                              ? "bg-blue-900 text-white border-blue-400/40"
                              : u.role === "client"
                              ? "bg-emerald-900 text-white border-emerald-400/40"
                              : "bg-purple-900 text-white border-purple-400/40"
                          }`}>
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-[#111111] dark:text-[#f3eee3] font-cinzel leading-snug truncate">
                              {u.name}
                            </p>
                            <p className="text-[10px] font-mono text-[#111111]/50 dark:text-[#f3eee3]/40 truncate">
                              ID: {u.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-cinzel font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Designation / Chamber */}
                      <td className="py-4 px-4 max-w-xs">
                        <p className="text-[11px] font-serif text-[#111111]/80 dark:text-[#f3eee3]/80 truncate">
                          {u.designation || (u.role === "client" ? "Retained Litigant Client" : "—")}
                        </p>
                        {supervisingLawyer && (
                          <Link
                            href={`/admin/chambers/${supervisingLawyer.id}`}
                            className="text-[10px] font-mono text-[#d9541e] dark:text-[#ea6026] hover:underline inline-flex items-center gap-0.5 mt-0.5"
                            title={`Inspect ${supervisingLawyer.name}'s chamber roster`}
                          >
                            <span>↳ Attached: {supervisingLawyer.name}</span>
                            <ChevronRight className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <p className="font-mono text-[11px] text-[#111111] dark:text-[#f3eee3] flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-[#111111]/50 dark:text-[#f3eee3]/50 shrink-0" />
                          <span>{u.email || "—"}</span>
                        </p>
                        {u.phone && (
                          <p className="font-mono text-[10.5px] text-[#111111]/60 dark:text-[#f3eee3]/60 flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3 h-3 text-[#111111]/50 dark:text-[#f3eee3]/50 shrink-0" />
                            <span>{u.phone}</span>
                          </p>
                        )}
                      </td>

                      {/* Login Passcode */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#f3eee3]/30 dark:bg-white/5 border border-[#111111]/10 dark:border-[#f3eee3]/10 font-mono text-[11px] font-bold text-[#d9541e]">
                          <Key className="w-3 h-3 shrink-0" />
                          <span>{passcode}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(passcode, u.id)}
                            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-[#111111]/50 hover:text-[#111111] dark:text-[#f3eee3]/50 dark:hover:text-white transition-colors cursor-pointer"
                            title="Copy login passcode"
                          >
                            {copiedCodeId === u.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Account Access Toggle (Enable / Disable) */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        {u.id === currentUser.id ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                            Root Active
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleUserStatus(u.id, !isDisabled)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-cinzel font-bold tracking-wider transition-all cursor-pointer shadow-2xs ${
                              isDisabled
                                ? "bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/25"
                                : "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25"
                            }`}
                            title={isDisabled ? "Click to Activate User" : "Click to Disable User"}
                          >
                            <Power className={`w-3 h-3 ${isDisabled ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`} />
                            <span>{isDisabled ? "Disabled" : "Active"}</span>
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.role === "lawyer" && (
                            <Link
                              href={`/admin/chambers/${u.id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#d9541e]/10 hover:bg-[#d9541e]/20 border border-[#d9541e]/30 text-[11px] font-cinzel font-bold text-[#d9541e] dark:text-[#ea6026] transition-colors cursor-pointer"
                              title="Inspect complete chamber roster on a dedicated page"
                            >
                              <span>Inspect Roster</span>
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          )}

                          <button
                            type="button"
                            onClick={() => openModal("edit-user-admin", { user: u })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 hover:border-[#d9541e] text-[11px] font-cinzel font-semibold text-[#111111] dark:text-[#f3eee3] hover:text-[#d9541e] transition-colors cursor-pointer"
                            title="Edit User Profile & Credentials"
                          >
                            <Edit className="w-3 h-3 text-[#d9541e]" />
                            <span>Edit</span>
                          </button>

                          {u.id !== currentUser.id && u.id !== "u-admin" && (
                            <button
                              type="button"
                              onClick={() => {
                                if (u.role === "lawyer") {
                                  openModal("delete-chamber", { lawyer: u });
                                } else {
                                  if (confirm(`Permanently remove ${u.name} from the platform?`)) {
                                    deleteUser(u.id);
                                  }
                                }
                              }}
                              className="p-1.5 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title={u.role === "lawyer" ? "Entirely Delete this Chamber Workspace" : "Delete User"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
