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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#0b0f14]/10 dark:border-[#3df2e0]/10">
          <div>
            <h3 className="text-lg font-bold font-cinzel text-[#0b0f14] dark:text-[#3df2e0] flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#0b0f14] dark:text-[#3df2e0]" />
              <span>
                {currentUser.role === "associate" ? "My Draft Submissions in Review" : "Advocate Verification Desk (Pending Review)"}
              </span>
            </h3>
            <p className="text-xs text-[#0b0f14]/60 dark:text-[#3df2e0]/50 font-serif italic mt-0.5">
              {currentUser.role === "associate"
                ? "Your draft hearing outcomes and orders will be applied to the judicial docket once signed off by Senior Counsel."
                : "Verify and sanction junior associate draft entries before they alter official High Court and District Court records."}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0b0f14]/10 dark:bg-[#3df2e0]/15 text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/40 dark:border-[#3df2e0]/30 self-start sm:self-auto">
            {approvals.length} Pending Sign-off
          </span>
        </div>

        <div className="space-y-3.5">
          {approvals.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-center shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-[#0b0f14] dark:text-[#3df2e0]" />
              <p className="text-sm font-semibold font-cinzel text-[#0b0f14] dark:text-[#3df2e0]">Verification desk is completely clear.</p>
              <p className="text-xs text-[#0b0f14]/50 dark:text-[#3df2e0]/50 font-serif italic mt-1">All junior associate drafts have been reviewed and sanctioned.</p>
            </div>
          ) : (
            approvals.map((a) => {
              const caseId = a.payload?.caseId || a.payload?.case?.id;
              const relatedCase = caseId ? state.cases.find((c) => c.id === caseId) : null;
              const isProcessing = decidingId === a.id;

              return (
                <div
                  key={a.id}
                  className="p-6 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all"
                >
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-2 h-2 rounded-full bg-[#0b0f14] dark:bg-[#3df2e0] animate-pulse" />
                      <h4 className="text-sm font-bold text-[#0b0f14] dark:text-[#3df2e0] font-cinzel">{a.label}</h4>
                      {relatedCase && (
                        <button
                          onClick={() => openCase(relatedCase.id)}
                          className="text-[10px] font-mono px-2.5 py-0.5 rounded-lg bg-[#0b0f14]/5 dark:bg-white/5 text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 hover:border-[#0b0f14] dark:hover:border-[#3df2e0]"
                        >
                          {relatedCase.caseNo}
                        </button>
                      )}
                    </div>

                    <p className="p-3.5 rounded-2xl bg-[#0b0f14]/5 dark:bg-white/5 border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 font-mono text-xs leading-relaxed text-[#0b0f14]/80 dark:text-[#3df2e0]/80">
                      {describePayload(a)}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-[#0b0f14]/60 dark:text-[#3df2e0]/50">
                      <User className="w-3.5 h-3.5 text-[#0b0f14] dark:text-[#3df2e0]" />
                      <span>Drafted by <strong className="text-[#0b0f14] dark:text-[#3df2e0] font-medium">{a.byName}</strong></span>
                      <span>·</span>
                      <span>{new Date(a.ts).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                    </div>
                  </div>

                  {isLawyerOrAdmin && (
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <button
                        onClick={() => handleDecision(a.id, "approve")}
                        disabled={isProcessing}
                        className="px-5 py-2.5 rounded-2xl bg-[#1b1d3a] text-[#e8d5b5] hover:bg-[#25284e] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] dark:hover:bg-[#dfc8a2] text-xs font-bold tracking-wide flex items-center gap-2 transition-all shadow-md hover:scale-[1.01] disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        <span>Sanction &amp; Commit</span>
                      </button>
                      <button
                        onClick={() => handleDecision(a.id, "reject")}
                        disabled={isProcessing}
                        className="px-4 py-2.5 rounded-2xl border border-rose-300 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
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
        <h3 className="text-base font-bold font-cinzel text-[#0b0f14] dark:text-[#3df2e0]">
          Verification Log &amp; Sanctioned Submissions
        </h3>

        <div className="bg-white dark:bg-[#0f151c] rounded-3xl border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 divide-y divide-[#0b0f14]/10 dark:divide-[#3df2e0]/15 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          {decided.length === 0 ? (
            <p className="p-8 text-center text-xs text-[#0b0f14]/50 dark:text-[#3df2e0]/40 font-serif italic">
              No historical decisions recorded on this chamber ledger yet.
            </p>
          ) : (
            decided.map((d) => (
              <div key={d.id} className="p-4 sm:p-5 flex items-center justify-between text-xs hover:bg-white/60 dark:hover:bg-white/[0.03] transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        d.status === "approved" ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    <p className="font-semibold text-[#0b0f14] dark:text-[#3df2e0] truncate font-sans">{d.label}</p>
                    <span
                      className={`text-[9.5px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        d.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/20"
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#0b0f14]/60 dark:text-[#3df2e0]/50 mt-1 font-serif italic">
                    Drafted by {d.byName} · Reviewed by {state.users.find((u) => u.id === d.decidedBy)?.name || "Senior Counsel"}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-[#0b0f14]/50 dark:text-[#3df2e0]/40 flex-shrink-0 ml-4">
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
