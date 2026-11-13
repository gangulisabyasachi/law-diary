"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Scale,
  Calendar,
  FileText,
  Clock,
  ArrowLeft,
  Plus,
  Edit,
  UserCheck,
  Send,
  MessageSquare,
  Lock,
  Building,
  Gavel,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Bookmark,
  CornerDownRight,
  ShieldAlert,
  Receipt,
  Printer,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function CaseDetailView({ caseId }: { caseId?: string }) {
  const { state, currentUser, selectedCaseId, openModal, sendOps, addToast } = useChamber();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"hearings" | "orders" | "queries" | "billing" | "parties" | "notes">("hearings");
  const [queryText, setQueryText] = useState("");
  const [submittingQuery, setSubmittingQuery] = useState(false);
  const [copiedCnr, setCopiedCnr] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const targetId = caseId || selectedCaseId;
  const backHref = currentUser?.role === "admin" ? "/admin/cases" : "/dashboard/cases";

  if (!state || !currentUser) return null;

  const c = state.cases.find((item) => item.id === targetId);
  if (!c) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <Scale className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="text-sm font-semibold font-cinzel text-slate-900 dark:text-white">Case brief not found in register.</p>
        <p className="text-xs text-slate-500 mt-1">This brief may belong to another chamber or was removed.</p>
        <Link
          href={backHref}
          className="inline-block mt-4 text-xs font-semibold px-4 py-2 rounded-xl bg-[#1e3a8a] text-white hover:bg-[#1d4ed8] transition-colors"
        >
          Return to Case Register
        </Link>
      </div>
    );
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const client = state.users.find((u) => u.id === c.clientId);
  const leadCounsel = state.users.find((u) => u.id === (c.lawyerId || "u-lawyer"));
  const assignedAssociates = (c.associateIds || [])
    .map((id) => state.users.find((u) => u.id === id))
    .filter(Boolean);

  const nextHearing = c.hearings
    .filter((h) => h.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const sortedHearings = [...c.hearings].sort((a, b) => b.date.localeCompare(a.date));

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const statusColor: Record<string, string> = {
    Active: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40",
    Listed: "bg-blue-50 dark:bg-blue-950/40 text-[#1e3a8a] dark:text-[#93c5fd] border-blue-200 dark:border-blue-800/40",
    Reserved: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    Adjourned: "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40",
    Disposed: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  };

  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;

    setSubmittingQuery(true);
    const newQuery = {
      id: "q-" + Date.now(),
      by: currentUser.id,
      text: queryText.trim(),
      ts: new Date().toISOString(),
      answered: false,
    };

    const success = await sendOps([{ type: "addQuery", payload: { caseId: c.id, query: newQuery } }]);
    if (success) {
      setQueryText("");
      addToast("Inquiry recorded on case brief.", "success");
    }
    setSubmittingQuery(false);
  };

  const handleReplySubmit = async (queryId: string) => {
    if (!replyText.trim()) return;
    setSubmittingReply(true);

    const updatedQueries = c.queries.map((q) => {
      if (q.id === queryId) {
        return {
          ...q,
          reply: replyText.trim(),
          answered: true,
          replyTs: new Date().toISOString(),
          replyBy: currentUser.id,
        };
      }
      return q;
    });

    const success = await sendOps([{ type: "updateQueries", payload: { caseId: c.id, queries: updatedQueries } }]);
    if (success) {
      setReplyingTo(null);
      setReplyText("");
      addToast("Counsel response dispatched to client.", "success");
    }
    setSubmittingReply(false);
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    addToast(`Copied ${label}`, "info");
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-500 hover:text-[#1e3a8a] dark:hover:text-[#60a5fa] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Case Register
        </Link>
      </div>

      {/* Chamber Case Header */}
      <div className="rounded-2xl bg-white dark:bg-[#111827] text-slate-900 dark:text-white p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1e3a8a] dark:text-[#60a5fa]">
                {c.caseNo}
              </span>
              {c.cnr && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <button
                    onClick={() => {
                      copyText(c.cnr!, "CNR Number");
                      setCopiedCnr(true);
                      setTimeout(() => setCopiedCnr(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 font-mono text-[11px] bg-slate-50 dark:bg-[#161f30] hover:bg-slate-100 dark:hover:bg-[#1e293b] border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-md text-[#1e3a8a] dark:text-[#60a5fa] transition-colors"
                    title="Click to copy 16-character CNR"
                  >
                    <span>CNR: {c.cnr}</span>
                    {copiedCnr ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  </button>
                </>
              )}
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 font-serif">
                <Building className="w-3.5 h-3.5 text-[#1e3a8a] dark:text-[#60a5fa]" /> {c.court}
                {c.courtRoom && <span className="text-[#1e3a8a] dark:text-[#60a5fa] font-mono font-medium">({c.courtRoom})</span>}
                {c.itemNo && <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">Item {c.itemNo}</span>}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-cinzel font-bold border ${statusColor[c.status] || ""}`}>
                {c.status.toUpperCase()}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold font-cinzel text-slate-900 dark:text-white tracking-wide">
              {c.title}
            </h2>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>
                Stage: <strong className="text-slate-900 dark:text-white font-medium">{c.stage}</strong>
              </span>
              <span>·</span>
              <span>
                Presiding Bench: <strong className="text-slate-900 dark:text-white font-medium">{c.judge || "Hon'ble Court"}</strong>
              </span>
              <span>·</span>
              <span>
                Filing Date: <strong className="text-slate-900 dark:text-white font-medium">{formatDate(c.filingDate)}</strong>
              </span>
            </div>
          </div>

          {/* Action buttons */}
          {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => openModal("add-hearing", { caseId: c.id })}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] hover:from-[#1d4ed8] hover:to-[#1e3a8a] text-white font-cinzel font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5" /> + Record NDOH
              </button>
              <button
                onClick={() => openModal("add-order", { caseId: c.id })}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#161f30] text-slate-800 dark:text-white font-cinzel font-semibold text-xs hover:bg-slate-100 dark:hover:bg-[#1e293b] transition-colors border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-[#1e3a8a] dark:text-[#60a5fa]" /> + Court Order
              </button>
              <button
                onClick={() => openModal("set-status", { caseId: c.id, currentStatus: c.status, currentStage: c.stage })}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#161f30] text-slate-800 dark:text-white font-cinzel font-semibold text-xs hover:bg-slate-100 dark:hover:bg-[#1e293b] transition-colors border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1e3a8a] dark:text-[#60a5fa]" /> Update Stage
              </button>
              <button
                onClick={() => openModal("edit-case", { case: c })}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#161f30] text-slate-800 dark:text-white font-cinzel font-semibold text-xs hover:bg-slate-100 dark:hover:bg-[#1e293b] transition-colors border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                <Edit className="w-3.5 h-3.5 text-[#1e3a8a] dark:text-[#60a5fa]" /> Edit
              </button>
            </div>
          )}
        </div>

        {/* Limitation Tracker Banner (Limitation Act, 1963) */}
        {c.limitationDate && (
          <div className="mt-5 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-[#1e3a8a] dark:text-[#60a5fa] mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0 text-xs">
              <span className="font-semibold font-cinzel text-[#1e3a8a] dark:text-[#60a5fa]">
                Statutory Limitation Deadline:{" "}
              </span>
              <span className="text-[#1e3a8a] dark:text-[#60a5fa] font-mono font-bold">
                {formatDate(c.limitationDate)}
              </span>
              <span className="text-slate-600 dark:text-slate-400 font-serif italic"> — {c.limitationTask}</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-5 overflow-x-auto">
        <button
          onClick={() => setActiveTab("hearings")}
          className={`pb-3 text-xs font-cinzel font-semibold tracking-wider flex items-center gap-2 whitespace-nowrap transition-colors relative ${
            activeTab === "hearings"
              ? "text-[#1e3a8a] dark:text-[#60a5fa] border-b-2 border-[#1e3a8a] dark:border-[#3b82f6]"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Hearing Timeline ({c.hearings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 text-xs font-cinzel font-semibold tracking-wider flex items-center gap-2 whitespace-nowrap transition-colors relative ${
            activeTab === "orders"
              ? "text-[#1e3a8a] dark:text-[#60a5fa] border-b-2 border-[#1e3a8a] dark:border-[#3b82f6]"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Court Orders on Record ({c.orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("queries")}
          className={`pb-3 text-xs font-cinzel font-semibold tracking-wider flex items-center gap-2 whitespace-nowrap transition-colors relative ${
            activeTab === "queries"
              ? "text-[#1e3a8a] dark:text-[#60a5fa] border-b-2 border-[#1e3a8a] dark:border-[#3b82f6]"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Client Inquiries ({c.queries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("billing")}
          className={`pb-3 text-xs font-cinzel font-semibold tracking-wider flex items-center gap-2 whitespace-nowrap transition-colors relative ${
            activeTab === "billing"
              ? "text-[#1e3a8a] dark:text-[#60a5fa] border-b-2 border-[#1e3a8a] dark:border-[#3b82f6]"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Fee Ledger &amp; Invoices</span>
        </button>

        <button
          onClick={() => setActiveTab("parties")}
          className={`pb-3 text-xs font-cinzel font-semibold tracking-wider flex items-center gap-2 whitespace-nowrap transition-colors relative ${
            activeTab === "parties"
              ? "text-[#1e3a8a] dark:text-[#60a5fa] border-b-2 border-[#1e3a8a] dark:border-[#3b82f6]"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Vakalatnama &amp; Counsel Roster</span>
        </button>

        <button
          onClick={() => setActiveTab("notes")}
          className={`pb-3 text-xs font-cinzel font-semibold tracking-wider flex items-center gap-2 whitespace-nowrap transition-colors relative ${
            activeTab === "notes"
              ? "text-[#1e3a8a] dark:text-[#60a5fa] border-b-2 border-[#1e3a8a] dark:border-[#3b82f6]"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Registry &amp; Brief Notes</span>
        </button>
      </div>

      {/* Tab Panels */}
      {/* 1. Hearings Timeline */}
      {activeTab === "hearings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic">
              Chronological record of court appearances, examination of witnesses, and daily proceedings.
            </p>
            {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
              <button
                onClick={() => openModal("add-hearing", { caseId: c.id })}
                className="text-xs font-cinzel font-bold text-[#1e3a8a] dark:text-[#60a5fa] hover:underline"
              >
                + Record Hearing Outcome
              </button>
            )}
          </div>

          <div className="space-y-3.5">
            {sortedHearings.length === 0 ? (
              <div className="p-10 text-center bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 shadow-xs">
                No hearing proceedings logged yet.
              </div>
            ) : (
              sortedHearings.map((h, i) => {
                const isUpcoming = h.date >= todayStr;
                return (
                  <div
                    key={i}
                    className={`p-5 rounded-2xl border transition-all ${
                      isUpcoming
                        ? "bg-white dark:bg-[#111827] border-blue-300 dark:border-blue-900/60 shadow-xs"
                        : "bg-slate-50 dark:bg-[#111827] border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {formatDate(h.date)}
                        </span>
                        {isUpcoming && (
                          <span className="text-[9.5px] font-cinzel font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#1e3a8a] dark:text-[#93c5fd] border border-blue-200 dark:border-blue-800/50">
                            NEXT HEARING (NDOH)
                          </span>
                        )}
                      </div>
                      {h.by && (
                        <span className="text-[11px] text-slate-500 font-serif italic">
                          Appeared: {state.users.find((u) => u.id === h.by)?.name || h.by}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-xs">
                      <strong className="text-slate-900 dark:text-white font-cinzel">Purpose: </strong>
                      <span className="text-slate-600 dark:text-slate-400 font-serif">{h.purpose || "General hearing"}</span>
                    </div>

                    {h.outcome && (
                      <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-[#161f30] border border-slate-200 dark:border-slate-800 text-xs">
                        <strong className="text-slate-900 dark:text-white font-cinzel">Business Recorded / Daily Order: </strong>
                        <span className="text-slate-600 dark:text-slate-400 font-serif">{h.outcome}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 2. Certified Orders */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic">
              Verbatim operative court orders, interim injunctions &amp; final judicial decrees.
            </p>
            {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
              <button
                onClick={() => openModal("add-order", { caseId: c.id })}
                className="text-xs font-cinzel font-bold text-[#1e3a8a] dark:text-[#60a5fa] hover:underline"
              >
                + Enter Court Order
              </button>
            )}
          </div>

          <div className="space-y-3.5">
            {c.orders.length === 0 ? (
              <div className="p-10 text-center bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 shadow-xs">
                No court orders entered on record yet.
              </div>
            ) : (
              c.orders.map((o, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {formatDate(o.date)}
                      </span>
                      {o.citation && (
                        <span className="font-mono text-[10px] text-[#1e3a8a] dark:text-[#93c5fd] bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800/50">
                          {o.citation}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-cinzel uppercase tracking-wider">
                      Certified Copy On Record
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-cinzel">
                    {o.title}
                  </h3>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161f30] border border-slate-200 dark:border-slate-800 text-xs font-serif leading-relaxed text-slate-700 dark:text-slate-300">
                    {o.text}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. Client Inquiries */}
      {activeTab === "queries" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic">
            Direct privileged bilateral communication between client and chamber counsel.
          </p>

          {/* New query form for Client */}
          {currentUser.role === "client" && (
            <form onSubmit={handleSendQuery} className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <label className="block text-xs font-semibold font-cinzel tracking-wider text-slate-900 dark:text-white">
                Submit Inquiry to Chamber Counsel
              </label>
              <textarea
                rows={3}
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Ask about court appearance, document requirements, or case progress..."
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#161f30] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1e3a8a] font-serif"
              />
              <button
                type="submit"
                disabled={submittingQuery || !queryText.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] text-white font-cinzel font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-xs"
              >
                {submittingQuery ? "Transmitting..." : "Send to Counsel Desk"}
              </button>
            </form>
          )}

          <div className="space-y-3.5">
            {c.queries.length === 0 ? (
              <div className="p-10 text-center bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 shadow-xs">
                No client inquiries recorded on this brief.
              </div>
            ) : (
              c.queries.map((q) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-900 dark:text-white font-cinzel">
                      From: {state.users.find((u) => u.id === q.by)?.name || q.by}
                    </span>
                    <span>{formatDate(q.ts)}</span>
                  </div>

                  <p className="text-xs text-slate-900 dark:text-white font-serif">
                    "{q.text}"
                  </p>

                  {q.reply ? (
                    <div className="mt-2.5 p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs">
                      <span className="font-bold font-cinzel text-emerald-900 dark:text-emerald-200 block mb-1">
                        Counsel Advice:
                      </span>
                      <p className="text-emerald-800 dark:text-emerald-300 font-serif leading-relaxed">{q.reply}</p>
                    </div>
                  ) : (
                    (currentUser.role === "lawyer" || currentUser.role === "associate") && (
                      <div className="pt-2">
                        {replyingTo === q.id ? (
                          <div className="space-y-2.5">
                            <textarea
                              rows={2}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type counsel response..."
                              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#161f30] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-serif"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReplySubmit(q.id)}
                                disabled={submittingReply || !replyText.trim()}
                                className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-cinzel font-bold text-xs"
                              >
                                {submittingReply ? "Saving..." : "Send Advice"}
                              </button>
                              <button
                                onClick={() => setReplyingTo(null)}
                                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-cinzel font-semibold"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReplyingTo(q.id)}
                            className="text-xs font-cinzel font-bold text-[#1e3a8a] dark:text-[#60a5fa] hover:underline"
                          >
                            Reply as Chamber Counsel →
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. Client Fee & Invoicing Ledger */}
      {activeTab === "billing" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic">
              Case accounting ledger for Vakalatnama retainer, drafting charges, and court appearance receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Total Agreed Fee
              </span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1 block">
                ₹{(c.feeAgreed || 0).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-slate-500">Agreed under Vakalatnama</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 shadow-xs">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase block">
                Received &amp; Credited
              </span>
              <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1 block">
                ₹{(c.feeReceived || 0).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                {(c.feeReceipts || []).length} Verified Receipts
              </span>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 shadow-xs">
              <span className="text-[10px] font-bold text-[#1e3a8a] dark:text-[#60a5fa] uppercase block">
                Outstanding Balance
              </span>
              <span className="text-2xl font-bold text-[#1e3a8a] dark:text-[#93c5fd] mt-1 block">
                ₹{Math.max(0, (c.feeAgreed || 0) - (c.feeReceived || 0)).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-slate-500">Payable at next judicial stage</span>
            </div>
          </div>

          {/* Receipts Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase text-slate-900 dark:text-white font-cinzel">
                Payment Receipts &amp; Disbursements
              </h4>
              <button
                onClick={() => addToast("Receipt statement exported for client record.", "success")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#161f30] text-xs font-semibold hover:bg-slate-100 dark:hover:bg-[#1e293b] transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-[#1e3a8a] dark:text-[#60a5fa]" /> Print Statement
              </button>
            </div>

            {(c.feeReceipts || []).length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No payment receipts issued for this matter yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {c.feeReceipts?.map((rec, i) => (
                  <div key={i} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#1e3a8a] dark:text-[#60a5fa]">
                          {rec.receiptNo || `REC-${i + 1}`}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          {rec.mode || "Bank Transfer"}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1">{rec.note || "Professional fee disbursement"}</p>
                      <span className="text-[10px] text-slate-500">Issued on {formatDate(rec.date)}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        ₹{rec.amount.toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => addToast(`Downloaded receipt slip: ${rec.receiptNo || "Receipt"}`, "info")}
                        className="block text-[11px] font-semibold text-[#1e3a8a] dark:text-[#60a5fa] hover:underline mt-1"
                      >
                        Receipt Slip →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Parties & Vakalatnama */}
      {activeTab === "parties" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-xs">
            <h3 className="text-xs font-bold font-cinzel uppercase tracking-widest text-[#1e3a8a] dark:text-[#60a5fa]">
              Client on Record (Vakalatnama)
            </h3>
            {client ? (
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-slate-900 dark:text-white font-sans">{client.name}</p>
                <p className="text-xs text-slate-500 font-serif italic">{client.designation || "Litigant"}</p>
                <p className="text-xs font-mono text-slate-500 pt-1">{client.email}</p>
                {client.phone && <p className="text-xs font-mono text-slate-500">{client.phone}</p>}
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-serif italic">No client mapped.</p>
            )}

            {leadCounsel && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-cinzel tracking-wider text-slate-500 block">
                  Lead Arguing Counsel
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{leadCounsel.name}</p>
                <p className="text-[11px] text-slate-500">{leadCounsel.designation}</p>
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-xs">
            <h3 className="text-xs font-bold font-cinzel uppercase tracking-widest text-[#1e3a8a] dark:text-[#60a5fa]">
              Assigned Chamber Associates
            </h3>
            {assignedAssociates.length === 0 ? (
              <p className="text-xs text-slate-500 font-serif italic">No junior associates assigned.</p>
            ) : (
              <div className="space-y-2">
                {assignedAssociates.map((a: any) => (
                  <div key={a.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#161f30] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white font-sans">{a.name}</p>
                      <p className="text-[11px] text-slate-500 font-serif italic">{a.designation}</p>
                    </div>
                    <span className="text-[9.5px] font-cinzel text-[#1e3a8a] dark:text-[#60a5fa] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/50">Briefed</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Notes */}
      {activeTab === "notes" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-xs">
          <h3 className="text-xs font-bold font-cinzel uppercase tracking-widest text-[#1e3a8a] dark:text-[#60a5fa]">
            Confidential Chamber Notes &amp; Safe Custody
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-serif whitespace-pre-wrap">
            {c.notes || "No internal chamber notes filed."}
          </p>
        </div>
      )}
    </div>
  );
}
