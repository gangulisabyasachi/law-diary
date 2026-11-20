"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Users,
  Scale,
  Power,
  Edit,
  Trash2,
  Mail,
  Phone,
  Key,
  Copy,
  Check,
  Plus,
  ShieldCheck,
  Building,
  UserCheck,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";
import { User, Case } from "@/types";

export default function ChamberDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { state, currentUser, openModal, toggleUserStatus, deleteUser, deleteChamber, addToast } = useChamber();
  const [activeTab, setActiveTab] = useState<"associates" | "clients" | "dockets">("associates");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  if (!state || !currentUser) return null;

  const users = state.users || [];
  const cases = state.cases || [];

  // Find the target Advocate
  const lawyer = users.find((u) => u.id === params.id && u.role === "lawyer");

  if (!lawyer) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-12">
        <Link
          href="/admin/chambers"
          className="inline-flex items-center gap-2 text-xs font-cinzel font-bold text-[#111111]/70 dark:text-[#f3eee3]/70 hover:text-[#d9541e] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Chambers Directory</span>
        </Link>

        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15 shadow-sm">
          <Building className="w-12 h-12 mx-auto text-[#111111]/30 dark:text-[#f3eee3]/30 mb-3" />
          <h2 className="text-base font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
            Chamber Workspace Not Found
          </h2>
          <p className="text-xs font-serif text-[#111111]/60 dark:text-[#f3eee3]/60 mt-1 max-w-md mx-auto">
            The requested advocate chamber record could not be found or has been removed from the platform.
          </p>
          <div className="mt-6">
            <Link
              href="/admin/chambers"
              className="px-5 py-2.5 rounded-xl bg-[#111111] dark:bg-[#f3eee3] text-[#f3eee3] dark:text-[#111111] text-xs font-cinzel font-bold tracking-wider"
            >
              Return to Chambers Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isLawyerDisabled = Boolean(lawyer.disabled || lawyer.status === "disabled");
  const chamberAssociates = users.filter((u) => u.role === "associate" && (u.lawyerId || "u-lawyer") === lawyer.id);
  const chamberClients = users.filter((u) => u.role === "client" && (u.lawyerId || "u-lawyer") === lawyer.id);
  const chamberCases = cases.filter((c) => (c.lawyerId || "u-lawyer") === lawyer.id);

  const handleCopyCode = (code: string, id: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
    addToast(`Passcode ${code} copied to clipboard`, "info");
  };

  const lawyerInitials = lawyer.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
        <div className="flex items-center gap-2 text-xs font-serif text-[#111111]/60 dark:text-[#f3eee3]/60">
          <Link
            href="/admin/chambers"
            className="inline-flex items-center gap-1.5 font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] hover:text-[#d9541e] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Chambers Directory</span>
          </Link>
          <span>/</span>
          <span className="truncate max-w-[200px] sm:max-w-none text-[#d9541e] dark:text-[#ea6026] font-medium">
            {lawyer.name.toLowerCase().startsWith("adv") ? lawyer.name : `Adv. ${lawyer.name}`}
          </span>
        </div>

        <Link
          href="/admin"
          className="text-xs font-cinzel font-bold text-[#111111]/70 dark:text-[#f3eee3]/70 hover:text-[#111111] dark:hover:text-white transition-colors"
        >
          All Users Table →
        </Link>
      </div>

      {/* Advocate Dossier Hero Card */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border shadow-sm transition-all ${
          isLawyerDisabled
            ? "bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30"
            : "bg-white dark:bg-[#181818] border-[#111111]/15 dark:border-[#f3eee3]/15"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Monogram and Advocate Details */}
          <div className="flex items-start gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center font-cinzel font-bold text-lg flex-shrink-0 shadow-inner ${
                isLawyerDisabled
                  ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300"
                  : "bg-[#111111] text-[#f3eee3] dark:bg-[#f3eee3] dark:text-[#111111]"
              }`}
            >
              {lawyerInitials}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase font-bold bg-[#d9541e]/15 text-[#d9541e] dark:text-[#ea6026] border border-[#d9541e]/20">
                  Chamber Head
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
                    isLawyerDisabled
                      ? "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
                      : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                  }`}
                >
                  {isLawyerDisabled ? "Chamber Suspended" : "Chamber Active"}
                </span>
              </div>

              <h1 className="text-2xl font-bold font-cinzel text-[#111111] dark:text-[#f3eee3] tracking-tight">
                {lawyer.name.toLowerCase().startsWith("adv") ? lawyer.name : `Adv. ${lawyer.name}`}
              </h1>

              <p className="text-xs font-serif text-[#111111]/70 dark:text-[#f3eee3]/70">
                {lawyer.designation || "Advocate & Lead Arguing Counsel"}
              </p>

              {/* Contact & Passcode Chips */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-serif text-[#111111]/70 dark:text-[#f3eee3]/70 pt-1.5">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#111111]/40 dark:text-[#f3eee3]/40" />
                  <span className="font-mono text-[11.5px]">{lawyer.email}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#111111]/40 dark:text-[#f3eee3]/40" />
                  <span>{lawyer.phone || "No phone listed"}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#111111]/40 dark:text-[#f3eee3]/40" />
                  <span className="text-[11px] font-mono font-bold bg-[#111111]/5 dark:bg-[#f3eee3]/10 px-2 py-0.5 rounded border border-[#111111]/10 dark:border-[#f3eee3]/10 text-[#d9541e]">
                    {lawyer.accessCode || "—"}
                  </span>
                  {lawyer.accessCode && (
                    <button
                      onClick={() => handleCopyCode(lawyer.accessCode!, lawyer.id)}
                      title="Copy chamber login passcode"
                      className="p-1 rounded hover:bg-[#111111]/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
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

          {/* Right: Quick Super Admin Controls */}
          <div className="flex items-center gap-2.5 flex-wrap pt-2 lg:pt-0 border-t lg:border-t-0 border-[#111111]/10 dark:border-[#f3eee3]/10">
            <button
              onClick={() => toggleUserStatus(lawyer.id, !isLawyerDisabled)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-cinzel font-bold border transition-colors cursor-pointer shadow-2xs ${
                isLawyerDisabled
                  ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-900 hover:bg-rose-100"
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isLawyerDisabled ? "Activate Chamber Access" : "Suspend Chamber Access"}</span>
            </button>

            <button
              onClick={() => openModal("edit-user-admin", { user: lawyer })}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-cinzel font-bold bg-[#111111]/5 dark:bg-[#f3eee3]/10 text-[#111111] dark:text-[#f3eee3] border border-[#111111]/15 dark:border-[#f3eee3]/20 hover:bg-[#111111]/10 transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5 text-[#d9541e]" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={() =>
                openModal("delete-chamber", {
                  lawyer,
                  onConfirm: async () => {
                    await deleteChamber(lawyer.id);
                    router.push("/admin/chambers");
                  },
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-cinzel font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 border border-rose-300 dark:border-rose-900/40 transition-colors cursor-pointer"
              title="Delete Entire Chamber"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Chamber</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Volume Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#111111]/60 dark:text-[#f3eee3]/60">
              Junior Associates
            </span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-cinzel text-blue-600 dark:text-blue-400">
              {chamberAssociates.length}
            </span>
            <span className="text-[11px] font-serif text-[#111111]/50 dark:text-[#f3eee3]/50">
              Assigned Juniors
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#111111]/60 dark:text-[#f3eee3]/60">
              Retained Litigants
            </span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-cinzel text-purple-600 dark:text-purple-400">
              {chamberClients.length}
            </span>
            <span className="text-[11px] font-serif text-[#111111]/50 dark:text-[#f3eee3]/50">
              Active Retainers
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#111111]/60 dark:text-[#f3eee3]/60">
              Chamber Dockets
            </span>
            <Scale className="w-4 h-4 text-[#d9541e]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-cinzel text-[#d9541e] dark:text-[#ea6026]">
              {chamberCases.length}
            </span>
            <span className="text-[11px] font-serif text-[#111111]/50 dark:text-[#f3eee3]/50">
              Registered Matters
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#111111]/60 dark:text-[#f3eee3]/60">
              Workspace Isolation
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold font-cinzel text-emerald-600 dark:text-emerald-400">
              Strictly Scoped
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Roster Tabs */}
      <div className="space-y-6">
        {/* Tab Headers */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#111111]/15 dark:border-[#f3eee3]/15 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("associates")}
              className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold transition-all cursor-pointer ${
                activeTab === "associates"
                  ? "bg-[#111111] dark:bg-[#f3eee3] text-[#f3eee3] dark:text-[#111111] shadow-xs"
                  : "text-[#111111]/60 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
              }`}
            >
              Junior Associates ({chamberAssociates.length})
            </button>

            <button
              onClick={() => setActiveTab("clients")}
              className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold transition-all cursor-pointer ${
                activeTab === "clients"
                  ? "bg-[#111111] dark:bg-[#f3eee3] text-[#f3eee3] dark:text-[#111111] shadow-xs"
                  : "text-[#111111]/60 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
              }`}
            >
              Retained Litigants ({chamberClients.length})
            </button>

            <button
              onClick={() => setActiveTab("dockets")}
              className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold transition-all cursor-pointer ${
                activeTab === "dockets"
                  ? "bg-[#111111] dark:bg-[#f3eee3] text-[#f3eee3] dark:text-[#111111] shadow-xs"
                  : "text-[#111111]/60 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
              }`}
            >
              Chamber Dockets ({chamberCases.length})
            </button>
          </div>

          {activeTab === "associates" && (
            <button
              onClick={() => openModal("add-associate", { lawyerId: lawyer.id })}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#d9541e] text-white text-xs font-cinzel font-bold hover:bg-[#bf4513] transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Onboard Associate</span>
            </button>
          )}

          {activeTab === "clients" && (
            <button
              onClick={() => openModal("add-client", { lawyerId: lawyer.id })}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#d9541e] text-white text-xs font-cinzel font-bold hover:bg-[#bf4513] transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll Litigant</span>
            </button>
          )}
        </div>

        {/* Tab 1: Associates Content */}
        {activeTab === "associates" && (
          <div className="space-y-4">
            {chamberAssociates.length === 0 ? (
              <div className="p-10 text-center rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15">
                <Briefcase className="w-10 h-10 mx-auto text-[#111111]/30 dark:text-[#f3eee3]/30 mb-2.5" />
                <h3 className="text-sm font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
                  No Associates Enrolled
                </h3>
                <p className="text-xs font-serif text-[#111111]/60 dark:text-[#f3eee3]/60 mt-1 max-w-sm mx-auto">
                  This Advocate currently has no junior briefing advocates assigned to their chamber.
                </p>
                <button
                  onClick={() => openModal("add-associate", { lawyerId: lawyer.id })}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#111111] dark:bg-[#f3eee3] text-[#f3eee3] dark:text-[#111111] text-xs font-cinzel font-bold"
                >
                  Onboard First Associate
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/15 overflow-hidden bg-white dark:bg-[#181818] shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#111111]/10 dark:border-[#f3eee3]/10 bg-[#f3eee3]/50 dark:bg-[#202020] text-[#111111]/70 dark:text-[#f3eee3]/70 font-cinzel font-bold text-[10.5px] uppercase tracking-wider">
                        <th className="py-3 px-4">Associate Advocate</th>
                        <th className="py-3 px-4">Contact Info</th>
                        <th className="py-3 px-4">Chamber Passcode</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#111111]/5 dark:divide-[#f3eee3]/5 font-serif">
                      {chamberAssociates.map((assoc) => {
                        const isAssocDisabled = Boolean(assoc.disabled || assoc.status === "disabled");
                        return (
                          <tr
                            key={assoc.id}
                            className={`hover:bg-[#f3eee3]/30 dark:hover:bg-white/5 transition-colors ${
                              isAssocDisabled ? "opacity-60 bg-rose-50/20 dark:bg-rose-950/10" : ""
                            }`}
                          >
                            <td className="py-3.5 px-4">
                              <span className="font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] block text-xs">
                                {assoc.name}
                              </span>
                              <span className="text-[10.5px] text-[#111111]/60 dark:text-[#f3eee3]/60 italic">
                                {assoc.designation || "Junior Advocate"}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 font-mono text-[11px] text-[#111111]/80 dark:text-[#f3eee3]/80">
                              <p className="flex items-center gap-1.5">
                                <Mail className="w-3 h-3 text-[#111111]/40" />
                                <span>{assoc.email}</span>
                              </p>
                              {assoc.phone && (
                                <p className="flex items-center gap-1.5 mt-0.5 text-[10.5px]">
                                  <Phone className="w-3 h-3 text-[#111111]/40" />
                                  <span>{assoc.phone}</span>
                                </p>
                              )}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#d9541e] bg-[#111111]/5 dark:bg-[#f3eee3]/10 px-2.5 py-1 rounded-xl">
                                <span>{assoc.accessCode || "—"}</span>
                                {assoc.accessCode && (
                                  <button
                                    onClick={() => handleCopyCode(assoc.accessCode!, assoc.id)}
                                    className="p-0.5 hover:text-[#111111] dark:hover:text-white"
                                  >
                                    {copiedCodeId === assoc.id ? (
                                      <Check className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3 h-3 text-[#111111]/40" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => toggleUserStatus(assoc.id, !isAssocDisabled)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-cinzel font-bold cursor-pointer ${
                                  isAssocDisabled
                                    ? "bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/25"
                                    : "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25"
                                }`}
                              >
                                <Power className="w-3 h-3" />
                                <span>{isAssocDisabled ? "Disabled" : "Active"}</span>
                              </button>
                            </td>

                            <td className="py-3.5 px-5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => openModal("edit-user-admin", { user: assoc })}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 hover:border-[#d9541e] text-[11px] font-cinzel font-semibold hover:text-[#d9541e] transition-colors cursor-pointer"
                                >
                                  <Edit className="w-3 h-3 text-[#d9541e]" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Remove associate ${assoc.name} from this chamber?`)) {
                                      deleteUser(assoc.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                  title="Remove Associate"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Clients Content */}
        {activeTab === "clients" && (
          <div className="space-y-4">
            {chamberClients.length === 0 ? (
              <div className="p-10 text-center rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15">
                <Users className="w-10 h-10 mx-auto text-[#111111]/30 dark:text-[#f3eee3]/30 mb-2.5" />
                <h3 className="text-sm font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
                  No Retained Litigants
                </h3>
                <p className="text-xs font-serif text-[#111111]/60 dark:text-[#f3eee3]/60 mt-1 max-w-sm mx-auto">
                  No litigant clients are currently enrolled under this chamber retainer.
                </p>
                <button
                  onClick={() => openModal("add-client", { lawyerId: lawyer.id })}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#111111] dark:bg-[#f3eee3] text-[#f3eee3] dark:text-[#111111] text-xs font-cinzel font-bold"
                >
                  Enroll First Litigant
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/15 overflow-hidden bg-white dark:bg-[#181818] shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#111111]/10 dark:border-[#f3eee3]/10 bg-[#f3eee3]/50 dark:bg-[#202020] text-[#111111]/70 dark:text-[#f3eee3]/70 font-cinzel font-bold text-[10.5px] uppercase tracking-wider">
                        <th className="py-3 px-4">Litigant Client</th>
                        <th className="py-3 px-4">Contact Info</th>
                        <th className="py-3 px-4">Client Portal Passcode</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#111111]/5 dark:divide-[#f3eee3]/5 font-serif">
                      {chamberClients.map((cl) => {
                        const isClDisabled = Boolean(cl.disabled || cl.status === "disabled");
                        return (
                          <tr
                            key={cl.id}
                            className={`hover:bg-[#f3eee3]/30 dark:hover:bg-white/5 transition-colors ${
                              isClDisabled ? "opacity-60 bg-rose-50/20 dark:bg-rose-950/10" : ""
                            }`}
                          >
                            <td className="py-3.5 px-4">
                              <span className="font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] block text-xs">
                                {cl.name}
                              </span>
                              <span className="text-[10.5px] text-[#111111]/60 dark:text-[#f3eee3]/60 italic">
                                {cl.designation || "Litigant Party"}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 font-mono text-[11px] text-[#111111]/80 dark:text-[#f3eee3]/80">
                              <p className="flex items-center gap-1.5">
                                <Mail className="w-3 h-3 text-[#111111]/40" />
                                <span>{cl.email}</span>
                              </p>
                              {cl.phone && (
                                <p className="flex items-center gap-1.5 mt-0.5 text-[10.5px]">
                                  <Phone className="w-3 h-3 text-[#111111]/40" />
                                  <span>{cl.phone}</span>
                                </p>
                              )}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#d9541e] bg-[#111111]/5 dark:bg-[#f3eee3]/10 px-2.5 py-1 rounded-xl">
                                <span>{cl.accessCode || "—"}</span>
                                {cl.accessCode && (
                                  <button
                                    onClick={() => handleCopyCode(cl.accessCode!, cl.id)}
                                    className="p-0.5 hover:text-[#111111] dark:hover:text-white"
                                  >
                                    {copiedCodeId === cl.id ? (
                                      <Check className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3 h-3 text-[#111111]/40" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => toggleUserStatus(cl.id, !isClDisabled)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-cinzel font-bold cursor-pointer ${
                                  isClDisabled
                                    ? "bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/25"
                                    : "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25"
                                }`}
                              >
                                <Power className="w-3 h-3" />
                                <span>{isClDisabled ? "Disabled" : "Active"}</span>
                              </button>
                            </td>

                            <td className="py-3.5 px-5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => openModal("edit-user-admin", { user: cl })}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 hover:border-[#d9541e] text-[11px] font-cinzel font-semibold hover:text-[#d9541e] transition-colors cursor-pointer"
                                >
                                  <Edit className="w-3 h-3 text-[#d9541e]" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Remove client ${cl.name} from this chamber?`)) {
                                      deleteUser(cl.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                  title="Remove Client"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Chamber Dockets Caseload Overview */}
        {activeTab === "dockets" && (
          <div className="space-y-4">
            {chamberCases.length === 0 ? (
              <div className="p-10 text-center rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15">
                <Scale className="w-10 h-10 mx-auto text-[#111111]/30 dark:text-[#f3eee3]/30 mb-2.5" />
                <h3 className="text-sm font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
                  No Matters Filed
                </h3>
                <p className="text-xs font-serif text-[#111111]/60 dark:text-[#f3eee3]/60 mt-1 max-w-sm mx-auto">
                  No judicial matters or court proceedings have been filed in this chamber workspace yet.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/15 overflow-hidden bg-white dark:bg-[#181818] shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#111111]/10 dark:border-[#f3eee3]/10 bg-[#f3eee3]/50 dark:bg-[#202020] text-[#111111]/70 dark:text-[#f3eee3]/70 font-cinzel font-bold text-[10.5px] uppercase tracking-wider">
                        <th className="py-3 px-4">Court Matter</th>
                        <th className="py-3 px-4">Forum &amp; Bench</th>
                        <th className="py-3 px-4">Case Number</th>
                        <th className="py-3 px-4">Next Hearing Date</th>
                        <th className="py-3 px-4 text-center">Stage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#111111]/5 dark:divide-[#f3eee3]/5 font-serif">
                      {chamberCases.map((c) => {
                        const nextHearing = c.hearings && c.hearings[c.hearings.length - 1];
                        return (
                          <tr key={c.id} className="hover:bg-[#f3eee3]/30 dark:hover:bg-white/5 transition-colors">
                            <td className="py-3.5 px-4 max-w-xs">
                              <span className="font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] block text-xs truncate">
                                {c.title}
                              </span>
                              <span className="text-[10.5px] text-[#111111]/60 dark:text-[#f3eee3]/60 italic truncate block">
                                {c.opponentName ? `vs ${c.opponentName}` : (c.caseType || "Judicial Proceeding")}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 font-mono text-[11px] text-[#111111]/80 dark:text-[#f3eee3]/80">
                              <span>{c.court || "High Court of Delhi"}</span>
                            </td>

                            <td className="py-3.5 px-4 font-mono text-[11px] font-semibold text-[#d9541e] dark:text-[#ea6026]">
                              <span>{c.caseNo || c.id}</span>
                            </td>

                            <td className="py-3.5 px-4 text-[11px]">
                              {nextHearing ? (
                                <span className="font-mono">{nextHearing.date}</span>
                              ) : (
                                <span className="text-[#111111]/40 italic">Not scheduled</span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#111111]/5 dark:bg-[#f3eee3]/10 text-[#111111] dark:text-[#f3eee3] border border-[#111111]/10">
                                {c.stage || c.status || "Pending"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Danger Zone: Permanent Chamber Purge */}
      <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs font-bold font-cinzel uppercase tracking-wider">
              Danger Zone: Purge &amp; Delete Entire Chamber Workspace
            </h3>
          </div>
          <p className="text-xs font-serif text-rose-900/70 dark:text-rose-300/70 max-w-xl">
            Permanently delete this Advocate practice. This will revoke access for all {chamberAssociates.length} attached junior associates, all {chamberClients.length} retained litigant clients, and delete all {chamberCases.length} registered court dockets.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            openModal("delete-chamber", {
              lawyer,
              onConfirm: async () => {
                await deleteChamber(lawyer.id);
                router.push("/admin/chambers");
              },
            })
          }
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-cinzel font-bold hover:bg-rose-700 transition-colors shadow-sm cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Entire Chamber</span>
        </button>
      </div>
    </div>
  );
}
