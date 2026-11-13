"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Clock, Check, X, ShieldAlert, ArrowRight, User } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function ApprovalsView() {
  const { state, currentUser, decideApproval, openCase } = useChamber();
  const [decidingId, setDecidingId] = useState<string | null>(null);

  if (!state || !currentUser) return null;

  const isLawyerOrAdmin = currentUser.role === "lawyer" || currentUser.role === "admin";
  const approvals = currentUser.role === "associate"
    ? state.approvals.filter((a) => a.by === currentUser.id)
    : state.approvals;

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
      return `Order Title: "${p.order?.title}" dated ${p.order?.date}`;
    }
    if (a.type === "setStatus") {
      return `New Status: ${p.status}${p.stage ? ` (Stage: ${p.stage})` : ""}`;
    }
    if (a.type === "addCase") {
      return `New Suit: ${p.case?.caseNo} — ${p.case?.title}`;
    }
    return JSON.stringify(p);
  };

  return (
    <div className="space-y-8">
      {/* Pending Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900">
              {currentUser.role === "associate" ? "My Submissions in Review" : "Pending Associate Submissions"}
            </h3>
            <p className="text-xs text-slate-500">
              {currentUser.role === "associate"
                ? "Changes will be applied to the case record once approved by the principal advocate."
                : "Verify changes before they go on official judicial record."}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            {approvals.length} pending
          </span>
        </div>

        <div className="space-y-3">
          {approvals.map((a) => {
            const caseId = a.payload?.caseId || a.payload?.case?.id;
            const relatedCase = caseId ? state.cases.find((c) => c.id === caseId) : null;
            const isProcessing = decidingId === a.id;

            return (
              <div
                key={a.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-300 transition-all"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <h4 className="text-xs font-bold text-slate-900 truncate">{a.label}</h4>
                    {relatedCase && (
                      <button
                        onClick={() => openCase(relatedCase.id)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-amber-800 hover:bg-slate-200"
                      >
                        {relatedCase.caseNo}
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono text-[11px]">
                    {describePayload(a)}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Submitted by <strong className="text-slate-700">{a.byName}</strong></span>
                    <span>·</span>
                    <span>{new Date(a.ts).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                  </div>
                </div>

                {/* Actions for Lawyer / Admin */}
                {isLawyerOrAdmin && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleDecision(a.id, "approve")}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleDecision(a.id, "reject")}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {approvals.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
              <p className="font-semibold text-slate-700">Approval queue is clear</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                New associate submissions will land here for verification.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Decision Audit Trail */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold font-display text-slate-900">Decision Audit Log</h3>
          <p className="text-xs text-slate-500">Historical trail of approved and rejected changes</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {state.decided.map((d) => (
            <div key={d.id} className="p-4 flex items-center justify-between text-xs gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">{d.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Submitted by {d.byName} · Decided on{" "}
                  {new Date(d.decidedAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                </p>
              </div>

              <div>
                {d.status === "approved" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3" /> Approved
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                    <XCircle className="w-3 h-3" /> Rejected
                  </span>
                )}
              </div>
            </div>
          ))}

          {state.decided.length === 0 && (
            <div className="p-6 text-center text-slate-400 text-xs">
              No audit logs recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

