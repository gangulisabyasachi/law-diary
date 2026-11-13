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
            <h3 className="text-base font-bold font-display text-[#191817]">
              {currentUser.role === "associate" ? "My Submissions in Review" : "Pending Associate Submissions"}
            </h3>
            <p className="text-xs text-[#736e65]">
              {currentUser.role === "associate"
                ? "Changes will be applied to the case record once approved by the principal advocate."
                : "Verify changes before they go on official judicial record."}
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-[#fcf5ec] text-[#7a491c] border border-[#ebd8c4]">
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
                className="p-5 rounded-xl bg-white border border-[#e6e2d8] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c5a059]" />
                    <h4 className="text-xs font-bold text-[#191817] truncate font-serif">{a.label}</h4>
                    {relatedCase && (
                      <button
                        onClick={() => openCase(relatedCase.id)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f5f3ee] text-[#805e26] border border-[#e6e2d8] hover:bg-[#eae6dd]"
                      >
                        {relatedCase.caseNo}
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-[#5e5a54] bg-[#faf8f5] p-2.5 rounded-lg border border-[#e8e4dc] font-mono text-[11px] leading-relaxed">
                    {describePayload(a)}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-[#736e65]">
                    <User className="w-3.5 h-3.5 text-[#8c877e]" />
                    <span>Submitted by <strong className="text-[#191817] font-medium">{a.byName}</strong></span>
                    <span>·</span>
                    <span className="font-mono">{new Date(a.ts).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                  </div>
                </div>

                {/* Actions for Lawyer / Admin */}
                {isLawyerOrAdmin && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleDecision(a.id, "approve")}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1b5e3a] hover:bg-[#154a2e] text-white text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleDecision(a.id, "reject")}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#fef2f2] hover:bg-[#fee2e2] text-[#991b1b] border border-[#fecaca] text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {approvals.length === 0 && (
            <div className="p-8 text-center bg-white rounded-xl border border-[#e6e2d8] text-[#736e65] text-xs">
              <CheckCircle2 className="w-7 h-7 mx-auto text-[#1b5e3a] mb-2" />
              <p className="font-semibold text-[#191817]">Approval queue is clear</p>
              <p className="text-[11px] text-[#736e65] mt-0.5">
                New associate submissions will land here for verification.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Decision Audit Trail */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold font-display text-[#191817]">Decision Audit Log</h3>
          <p className="text-xs text-[#736e65]">Historical trail of approved and rejected changes</p>
        </div>

        <div className="bg-white rounded-xl border border-[#e6e2d8] shadow-sm divide-y divide-[#f0ece4] overflow-hidden">
          {state.decided.map((d) => (
            <div key={d.id} className="p-4 flex items-center justify-between text-xs gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-[#191817] truncate font-serif">{d.label}</p>
                <p className="text-[11px] text-[#736e65] mt-0.5">
                  Submitted by {d.byName} · Decided on{" "}
                  <span className="font-mono">{new Date(d.decidedAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                </p>
              </div>

              <div>
                {d.status === "approved" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#edf6f0] text-[#1b5e3a] border border-[#cce4d4]">
                    <CheckCircle2 className="w-3 h-3" /> Approved
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]">
                    <XCircle className="w-3 h-3" /> Rejected
                  </span>
                )}
              </div>
            </div>
          ))}

          {state.decided.length === 0 && (
            <div className="p-6 text-center text-[#736e65] text-xs">
              No audit logs recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

