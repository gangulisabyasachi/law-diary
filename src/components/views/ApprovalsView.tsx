"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Clock, Check, X, ShieldAlert, ArrowRight, User, FileCheck, Gavel } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function ApprovalsView() {
  const { state, currentUser, decideApproval, openCase } = useChamber();
  const [decidingId, setDecidingId] = useState<string | null>(null);

  if (!state || !currentUser) return null;

  const isLawyerOrAdmin = currentUser.role === "lawyer" || currentUser.role === "admin";

  const myCases = state.cases.filter((c) => (c.lawyerId || "u-lawyer") === currentUser.id);
  const myCaseIds = new Set(myCases.map((c) => c.id));
  const myAssociates = state.users.filter((u) => u.role === "associate" && (u.lawyerId || "u-lawyer") === currentUser.id);
  const myAssociateIds = new Set(myAssociates.map((u) => u.id));

  const approvals = currentUser.role === "associate"
    ? state.approvals.filter((a) => a.by === currentUser.id)
    : currentUser.role === "lawyer"
    ? state.approvals.filter((a) => {
        const cId = a.payload?.caseId || a.payload?.case?.id;
        return myCaseIds.has(cId) || myAssociateIds.has(a.by) || a.by === currentUser.id;
      })
    : state.approvals;

  const decided = currentUser.role === "associate"
    ? state.decided.filter((d) => d.by === currentUser.id)
    : currentUser.role === "lawyer"
    ? state.decided.filter((d) => {
        const cId = d.payload?.caseId || d.payload?.case?.id;
        return myCaseIds.has(cId) || myAssociateIds.has(d.by) || d.by === currentUser.id;
      })
    : state.decided;

  const handleDecision = async (id: string, decision: "approve" | "reject") => {
    setDecidingId(id);
    await decideApproval(id, decision);
    setDecidingId(null);
  };

  const describePayload = (a: any) => {
    const p = a.payload || {};
    if (a.type === "compound") {
      return (p.ops || []).map((op: any) => op.type).join(", ");
    }
    if (a.type === "addHearing") {
      return `Date: ${p.hearing?.date} · Purpose: ${p.hearing?.purpose}${p.hearing?.outcome ? ` — ${p.hearing.outcome}` : ""}`;
    }
    if (a.type === "addOrder") {
      return `Court Order: "${p.order?.title}" dated ${p.order?.date}`;
    }
    if (a.type === "setStatus") {
      return `Stage Transition: ${p.status}${p.stage ? ` (${p.stage})` : ""}`;
    }
    if (a.type === "addCase") {
      return `Fresh Filing: ${p.case?.caseNo} — ${p.case?.title}`;
    }
    return JSON.stringify(p);
  };

  return (
    <div className="space-y-8">
      {/* Pending Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-cinzel text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>
                {currentUser.role === "associate" ? "My Draft Submissions in Review" : "Advocate Verification Desk (Pending Review)"}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic mt-0.5">
              {currentUser.role === "associate"
                ? "Your draft hearing outcomes and orders will be applied to the judicial docket once signed off by Senior Counsel."
                : "Verify and sanction junior associate draft entries before they alter official High Court and District Court records."}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {approvals.length} Pending Sign-off
          </span>
        </div>

        <div className="space-y-3.5">
          {approvals.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 shadow-sm">
              <CheckCircle2 className="w-7 h-7 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm font-semibold font-cinzel text-slate-900 dark:text-white">Verification desk is completely clear.</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic mt-0.5">All junior associate drafts have been reviewed and sanctioned.</p>
            </div>
          ) : (
            approvals.map((a) => {
              const caseId = a.payload?.caseId || a.payload?.case?.id;
              const relatedCase = caseId ? state.cases.find((c) => c.id === caseId) : null;
              const isProcessing = decidingId === a.id;

              return (
                <div
                  key={a.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate font-sans">{a.label}</h4>
                      {relatedCase && (
                        <button
                          onClick={() => openCase(relatedCase.id)}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:border-blue-500"
                        >
                          {relatedCase.caseNo}
                        </button>
                      )}
                    </div>

                    <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                      {describePayload(a)}
                    </p>

                    <div className="flex items-center gap-2 text-[10.5px] text-slate-500 dark:text-slate-400">
                      <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Drafted by <strong className="text-slate-900 dark:text-white font-medium">{a.byName}</strong></span>
                      <span>·</span>
                      <span>{new Date(a.ts).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                    </div>
                  </div>

                  {isLawyerOrAdmin && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleDecision(a.id, "approve")}
                        disabled={isProcessing}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Sanction &amp; Commit</span>
                      </button>
                      <button
                        onClick={() => handleDecision(a.id, "reject")}
                        disabled={isProcessing}
                        className="px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject Draft</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Decisions History Audit Log */}
      <div className="space-y-4">
        <h3 className="text-base font-bold font-cinzel text-slate-900 dark:text-white">
          Verification Log &amp; Sanctioned Submissions
        </h3>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800 overflow-hidden shadow-sm">
          {decided.length === 0 ? (
            <p className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 font-serif italic">
              No historical decisions recorded on this chamber ledger yet.
            </p>
          ) : (
            decided.map((d) => (
              <div key={d.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        d.status === "approved" ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    <p className="font-semibold text-slate-900 dark:text-white truncate font-sans">{d.label}</p>
                    <span
                      className={`text-[9.5px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        d.status === "approved"
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                          : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40"
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-serif italic">
                    Drafted by {d.byName} · Reviewed by {state.users.find((u) => u.id === d.decidedBy)?.name || "Senior Counsel"}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex-shrink-0 ml-4">
                  {new Date(d.decidedAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
