"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale, CheckCircle2, Calendar, Clock, ArrowRight, AlertCircle, FileText, Plus, MessageSquare } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";
import { Case } from "@/types";

export function DashboardView() {
  const { state, currentUser, openCase, setActivePage, openModal } = useChamber();

  if (!state || !currentUser) return null;

  const todayStr = new Date().toISOString().slice(0, 10);

  // Filter cases visible to the user
  const visibleCases = state.cases.filter((c) => {
    if (currentUser.role === "client") return c.clientId === currentUser.id;
    if (currentUser.role === "associate") return c.associateIds.includes(currentUser.id);
    return true; // lawyer and admin see all
  });

  const activeCases = visibleCases.filter((c) => c.status !== "Disposed");

  // Upcoming hearings
  const upcomingHearings = visibleCases
    .flatMap((c) =>
      c.hearings
        .filter((h) => h.date >= todayStr)
        .map((h) => ({ ...h, caseItem: c }))
    )
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const pendingApprovalsCount =
    currentUser.role === "associate"
      ? state.approvals.filter((a) => a.by === currentUser.id).length
      : state.approvals.length;

  // Format date helper
  const formatDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getDayMonth = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    return { day: d.getDate(), mon: d.toLocaleDateString("en-IN", { month: "short" }) };
  };

  const statusColor: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Listed: "bg-blue-50 text-blue-700 border-blue-200",
    Reserved: "bg-purple-50 text-purple-700 border-purple-200",
    Adjourned: "bg-amber-50 text-amber-700 border-amber-200",
    Disposed: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <div className="space-y-6">
      {/* Top Banner for Associate if they have pending submissions */}
      {currentUser.role === "associate" && pendingApprovalsCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-900">
                You have {pendingApprovalsCount} submission(s) pending principal advocate approval
              </p>
              <p className="text-[11px] text-amber-700">
                Changes will reflect on the permanent court file once approved.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActivePage("approvals")}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
          >
            View Submissions
          </button>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold font-display text-slate-900">{visibleCases.length}</p>
            <p className="text-xs text-slate-500 font-medium">Total Registered Matters</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold font-display text-slate-900">{activeCases.length}</p>
            <p className="text-xs text-slate-500 font-medium">Currently Active</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold font-display text-slate-900">{upcomingHearings.length}</p>
            <p className="text-xs text-slate-500 font-medium">Upcoming Appearances</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold font-display text-slate-900">{pendingApprovalsCount}</p>
            <p className="text-xs text-slate-500 font-medium">
              {currentUser.role === "associate" ? "My Pending Reviews" : "Approval Requests"}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Grid: Recent Cases & Cause List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Cases */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900">Recent Matters in Diary</h3>
              <p className="text-xs text-slate-500">Fast access to active case files</p>
            </div>
            <div className="flex items-center gap-2">
              {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
                <button
                  onClick={() => openModal("add-case")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Case
                </button>
              )}
              <button
                onClick={() => setActivePage("cases")}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                View All
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {visibleCases.slice(0, 5).map((c) => {
              const client = state.users.find((u) => u.id === c.clientId);
              const nextHearing = c.hearings
                .filter((h) => h.date >= todayStr)
                .sort((a, b) => a.date.localeCompare(b.date))[0];

              return (
                <div
                  key={c.id}
                  onClick={() => openCase(c.id)}
                  className="p-4 hover:bg-slate-50/80 cursor-pointer transition-colors flex items-center justify-between gap-4 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                        {c.title}
                      </p>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${statusColor[c.status] || "bg-slate-100 text-slate-700"}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      <span className="font-mono text-slate-700 font-medium">{c.caseNo}</span> · {c.court} · {c.stage}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    {nextHearing ? (
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{formatDate(nextHearing.date)}</span>
                        <span className="text-[10px] text-slate-500 truncate block max-w-[140px]">{nextHearing.purpose}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No date fixed</span>
                    )}
                  </div>
                </div>
              );
            })}

            {visibleCases.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No matters found in your diary.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Cause List (Upcoming Hearings) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">Upcoming Cause List</h3>
                <p className="text-xs text-slate-500">Next court appearances</p>
              </div>
              <button
                onClick={() => setActivePage("calendar")}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800"
              >
                Calendar
              </button>
            </div>

            <div className="space-y-3">
              {upcomingHearings.map((h, i) => {
                const dm = getDayMonth(h.date);
                return (
                  <div
                    key={i}
                    onClick={() => openCase(h.caseItem.id)}
                    className="p-3 rounded-xl border border-slate-100 hover:border-amber-300 hover:bg-amber-50/20 cursor-pointer transition-all flex items-center gap-3.5 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-300 flex flex-col items-center justify-center text-center flex-shrink-0 font-display">
                      <span className="text-sm font-bold leading-tight">{dm.day}</span>
                      <span className="text-[9px] uppercase tracking-wider font-body">{dm.mon}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate group-hover:text-amber-700">
                        {h.purpose}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {h.caseItem.caseNo} — {h.caseItem.title}
                      </p>
                    </div>
                  </div>
                );
              })}

              {upcomingHearings.length === 0 && (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No upcoming hearings scheduled.
                </div>
              )}
            </div>
          </div>

          {/* Client Queries or Recent Approvals */}
          {currentUser.role === "lawyer" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-base font-bold font-display text-slate-900 mb-1">Recent Client Inquiries</h3>
              <p className="text-xs text-slate-500 mb-3">Questions sent from the client portal</p>

              <div className="space-y-2.5">
                {visibleCases
                  .flatMap((c) => c.queries.map((q) => ({ ...q, caseItem: c })))
                  .sort((a, b) => b.ts.localeCompare(a.ts))
                  .slice(0, 3)
                  .map((q, idx) => {
                    const clientUser = state.users.find((u) => u.id === q.by);
                    return (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
                          <span>{clientUser?.name || "Client"}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{q.caseItem.caseNo}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] line-clamp-2">{q.text}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

