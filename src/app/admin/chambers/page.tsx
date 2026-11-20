"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Search,
  Filter,
  ShieldCheck,
  Building,
  Key,
  Copy,
  Check,
  Power,
  Edit,
  Trash2,
  ChevronRight,
  UserCheck,
  UserX,
  Plus,
  Scale,
  Phone,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";
import { User } from "@/types";

export default function AdminChambersPage() {
  const { state, currentUser, openModal, toggleUserStatus, addToast } = useChamber();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  if (!state || !currentUser) return null;

  const users = state.users || [];
  const lawyers = users.filter((u) => u.role === "lawyer");
  const associates = users.filter((u) => u.role === "associate");
  const clients = users.filter((u) => u.role === "client");
  const cases = state.cases || [];

  // Filtered Chambers List
  const filteredChambers = useMemo(() => {
    return lawyers.filter((lawyer) => {
      const isDisabled = Boolean(lawyer.disabled || lawyer.status === "disabled");
      if (statusFilter === "active" && isDisabled) return false;
      if (statusFilter === "disabled" && !isDisabled) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const cleanDigits = q.replace(/\D/g, "");
        const matchName = (lawyer.name || "").toLowerCase().includes(q);
        const matchEmail = (lawyer.email || "").toLowerCase().includes(q);
        const matchPhone = cleanDigits && (lawyer.phone || "").replace(/\D/g, "").includes(cleanDigits);
        const matchDesignation = (lawyer.designation || "").toLowerCase().includes(q);
        const matchCode = (lawyer.accessCode || "").toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchDesignation && !matchCode) {
          return false;
        }
      }

      return true;
    });
  }, [lawyers, statusFilter, searchQuery]);

  const handleCopyCode = (code: string, id: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
    addToast(`Passcode ${code} copied to clipboard`, "info");
  };


  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase font-bold bg-[#d9541e]/15 text-[#d9541e] dark:text-[#ea6026] border border-[#d9541e]/20">
              Multi-Tenant Architecture
            </span>
            <span className="text-xs text-[#111111]/40 dark:text-[#f3eee3]/40">•</span>
            <span className="text-xs text-[#111111]/60 dark:text-[#f3eee3]/60 font-serif">
              Chamber Scoping &amp; Isolation
            </span>
          </div>
          <h2 className="text-2xl font-bold font-cinzel text-[#111111] dark:text-[#f3eee3] tracking-tight">
            Chamber Workspaces Directory
          </h2>
          <p className="text-xs text-[#111111]/70 dark:text-[#f3eee3]/70 font-serif italic mt-0.5">
            Supervise advocate practices, associated junior counsels, client retainers, and chamber workspace boundaries.
          </p>
        </div>

        <button
          onClick={() => openModal("provision-advocate")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] text-xs font-cinzel font-bold tracking-wider transition-all shadow-md hover:scale-[1.01] cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Advocate Account</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#111111]/60 dark:text-[#f3eee3]/60">
              Total Chambers
            </span>
            <Building className="w-4 h-4 text-[#d9541e]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
              {lawyers.length}
            </span>
            <span className="text-[11px] font-serif text-[#111111]/50 dark:text-[#f3eee3]/50">
              Advocate Practices
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#111111]/60 dark:text-[#f3eee3]/60">
              Active Chambers
            </span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-cinzel text-emerald-600 dark:text-emerald-400">
              {lawyers.filter((l) => !l.disabled && l.status !== "disabled").length}
            </span>
            <span className="text-[11px] font-serif text-[#111111]/50 dark:text-[#f3eee3]/50">
              Live &amp; Operational
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#111111]/60 dark:text-[#f3eee3]/60">
              Chamber Associates
            </span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
              {associates.length}
            </span>
            <span className="text-[11px] font-serif text-[#111111]/50 dark:text-[#f3eee3]/50">
              Junior Advocates
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#111111]/60 dark:text-[#f3eee3]/60">
              Client Retainers
            </span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
              {clients.length}
            </span>
            <span className="text-[11px] font-serif text-[#111111]/50 dark:text-[#f3eee3]/50">
              Enrolled Litigants
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111111]/40 dark:text-[#f3eee3]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by advocate name, chamber email, bar designation, or phone..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-[#f3eee3]/30 dark:bg-[#202020] text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/40 dark:placeholder:text-[#f3eee3]/40 focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#111111]/40 dark:text-[#f3eee3]/40" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-[#f3eee3]/30 dark:bg-[#202020] text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3]"
          >
            <option value="all">All Chamber Statuses</option>
            <option value="active">Active Only</option>
            <option value="disabled">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Chamber Directory Cards */}
      <div className="space-y-4">
        {filteredChambers.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15">
            <Building className="w-10 h-10 mx-auto text-[#111111]/30 dark:text-[#f3eee3]/30 mb-3" />
            <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
              No Chambers Found
            </h3>
            <p className="text-xs font-serif text-[#111111]/60 dark:text-[#f3eee3]/60 mt-1 max-w-sm mx-auto">
              No advocate chambers match your search criteria. Try modifying your filters or onboard a new chamber.
            </p>
          </div>
        ) : (
          filteredChambers.map((lawyer) => {
            const isDisabled = Boolean(lawyer.disabled || lawyer.status === "disabled");
            const chamberAssociates = associates.filter((a) => (a.lawyerId || "u-lawyer") === lawyer.id);
            const chamberClients = clients.filter((c) => (c.lawyerId || "u-lawyer") === lawyer.id);
            const chamberCases = cases.filter((c) => (c.lawyerId || "u-lawyer") === lawyer.id);

            return (
              <div
                key={lawyer.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isDisabled
                    ? "bg-rose-50/30 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/30 opacity-80"
                    : "bg-white dark:bg-[#181818] border-[#111111]/15 dark:border-[#f3eee3]/15 shadow-sm hover:border-[#111111]/30 dark:hover:border-[#f3eee3]/30"
                }`}
              >
                {/* Chamber Head Row */}
                <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left: Advocate Info */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-cinzel font-bold text-sm flex-shrink-0 shadow-inner ${
                        isDisabled
                          ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300"
                          : "bg-[#111111] text-[#f3eee3] dark:bg-[#f3eee3] dark:text-[#111111]"
                      }`}
                    >
                      {lawyer.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
                          {lawyer.name.toLowerCase().startsWith("adv") ? lawyer.name : `Adv. ${lawyer.name}`}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
                            isDisabled
                              ? "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                          }`}
                        >
                          {isDisabled ? "Chamber Suspended" : "Chamber Active"}
                        </span>
                      </div>

                      <p className="text-xs font-serif text-[#111111]/70 dark:text-[#f3eee3]/70">
                        {lawyer.designation || "Advocate & Chamber Head"}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#111111]/60 dark:text-[#f3eee3]/60 font-serif pt-1">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#111111]/40 dark:text-[#f3eee3]/40" />
                          <span className="font-mono text-[11px]">{lawyer.email}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#111111]/40 dark:text-[#f3eee3]/40" />
                          <span>{lawyer.phone || "—"}</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-[#111111]/40 dark:text-[#f3eee3]/40" />
                          <span className="text-[11px] font-mono bg-[#111111]/5 dark:bg-[#f3eee3]/10 px-2 py-0.5 rounded border border-[#111111]/10 dark:border-[#f3eee3]/10">
                            {lawyer.accessCode || "—"}
                          </span>
                          {lawyer.accessCode && (
                            <button
                              onClick={() => handleCopyCode(lawyer.accessCode!, lawyer.id)}
                              title="Copy chamber access passcode"
                              className="p-1 rounded hover:bg-[#111111]/10 dark:hover:bg-white/10 transition-colors"
                            >
                              {copiedCodeId === lawyer.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3 text-[#111111]/50 dark:text-[#f3eee3]/50" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Chamber Metrics Strip */}
                  <div className="flex items-center gap-6 py-2 px-4 rounded-xl bg-[#f3eee3]/50 dark:bg-[#202020] border border-[#111111]/10 dark:border-[#f3eee3]/10">
                    <div className="text-center">
                      <span className="text-[10px] font-mono uppercase text-[#111111]/50 dark:text-[#f3eee3]/50 block">
                        Associates
                      </span>
                      <span className="text-base font-bold font-cinzel text-blue-600 dark:text-blue-400">
                        {chamberAssociates.length}
                      </span>
                    </div>
                    <div className="w-[1px] h-6 bg-[#111111]/10 dark:bg-[#f3eee3]/10" />
                    <div className="text-center">
                      <span className="text-[10px] font-mono uppercase text-[#111111]/50 dark:text-[#f3eee3]/50 block">
                        Clients
                      </span>
                      <span className="text-base font-bold font-cinzel text-purple-600 dark:text-purple-400">
                        {chamberClients.length}
                      </span>
                    </div>
                    <div className="w-[1px] h-6 bg-[#111111]/10 dark:bg-[#f3eee3]/10" />
                    <div className="text-center">
                      <span className="text-[10px] font-mono uppercase text-[#111111]/50 dark:text-[#f3eee3]/50 block">
                        Dockets
                      </span>
                      <span className="text-base font-bold font-cinzel text-[#d9541e] dark:text-[#ea6026]">
                        {chamberCases.length}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Enable / Disable Chamber Switch */}
                    <button
                      onClick={() => toggleUserStatus(lawyer.id, !isDisabled)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-cinzel font-bold border transition-colors ${
                        isDisabled
                          ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
                          : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-900 hover:bg-rose-100"
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{isDisabled ? "Activate Chamber" : "Suspend Chamber"}</span>
                    </button>

                    {/* Edit Chamber Button */}
                    <button
                      onClick={() => openModal("edit-user-admin", { user: lawyer })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-cinzel font-bold bg-[#111111]/5 dark:bg-[#f3eee3]/10 text-[#111111] dark:text-[#f3eee3] border border-[#111111]/15 dark:border-[#f3eee3]/20 hover:bg-[#111111]/10 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>

                    {/* Inspect Dedicated Roster Page */}
                    <Link
                      href={`/admin/chambers/${lawyer.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-bold bg-[#111111] dark:bg-[#f3eee3] text-[#f3eee3] dark:text-[#111111] hover:opacity-90 transition-opacity shadow-sm"
                    >
                      <span>Inspect Roster</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    {/* Delete Entire Chamber Button */}
                    <button
                      type="button"
                      onClick={() => openModal("delete-chamber", { lawyer })}
                      className="p-1.5 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                      title="Entirely Delete this Chamber"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
