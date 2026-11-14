"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building,
  User,
  Gavel,
  Scale,
  Plus,
  Send,
  MessageSquare,
  DollarSign,
  Download,
  Printer,
  ShieldCheck,
  AlertCircle,
  ShieldAlert,
  FileText,
  FileCheck,
  Edit,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function CaseDetailView({ caseId }: { caseId: string }) {
  const {
    state,
    currentUser,
    setActivePage,
    openModal,
    addToast,
    sendOps,
    submitApproval,
  } = useChamber();

  const [activeTab, setActiveTab] = useState<"hearings" | "orders" | "queries" | "billing" | "parties" | "notes">("hearings");
  const [queryText, setQueryText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [copiedCNR, setCopiedCNR] = useState<string | null>(null);

  if (!state || !currentUser) return null;

  const c = state.cases.find((item) => item.id === caseId);

  if (!c) {
    return (
      <div className="p-14 text-center bg-white dark:bg-[#181818] rounded-3xl border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
        <Scale className="w-10 h-10 mx-auto text-[#111111]/65 dark:text-[#f3eee3]/60 mb-3" />
        <h2 className="text-base font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">Court Brief Not Found</h2>
        <p className="text-xs font-serif text-[#111111]/65 dark:text-[#f3eee3]/60 mt-1">This dossier does not exist in your chamber registry.</p>
        <button
          onClick={() => setActivePage("cases")}
          className="inline-block mt-5 text-xs font-cinzel font-bold px-5 py-2.5 rounded-xl bg-[#111111] dark:bg-[#f3eee3] text-[#111111] transition-all shadow-md"
        >
          Return to Case Diary
        </button>
      </div>
    );
  }

  const client = state.users.find((u) => u.id === c.clientId);
  const leadCounsel = state.users.find((u) => u.id === c.lawyerId);
  const assignedAssociates = (c.associateIds || [])
    .map((id) => state.users.find((u) => u.id === id))
    .filter(Boolean);

  const todayStr = new Date().toISOString().slice(0, 10);
  const nextHearing = c.hearings
    ?.filter((h) => h.date >= todayStr)
    ?.sort((a, b) => a.date.localeCompare(b.date))[0];

  const formatDate = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const handleCopyCNR = (cnr: string) => {
    navigator.clipboard.writeText(cnr);
    setCopiedCNR(cnr);
    addToast(`Copied CNR Number: ${cnr}`, "info");
    setTimeout(() => setCopiedCNR(null), 2500);
  };

  const statusColor: Record<string, string> = {
    Active: "bg-[#f3eee3]/25 dark:bg-[#f3eee3]/15 text-[#111111] dark:text-[#f3eee3] border-[#111111]/50 dark:border-[#f3eee3]/40",
    Listed: "bg-white dark:bg-[#202020] text-[#111111] dark:text-[#f3eee3] border-[#111111]/15 dark:border-[#f3eee3]/20",
    Reserved: "bg-white dark:bg-[#202020] text-[#111111]/65 dark:text-[#f3eee3]/60 border-[#111111]/15 dark:border-[#f3eee3]/20",
    Adjourned: "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40",
    Disposed: "bg-white dark:bg-[#202020] text-[#111111]/65 dark:text-[#f3eee3]/60 border-[#111111]/15 dark:border-[#f3eee3]/20",
  };

  // Client Query Handler
  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;

    const newQuery = {
      id: "q-" + Date.now(),
      by: currentUser.id,
      text: queryText.trim(),
      ts: new Date().toISOString(),
    };

    const updatedQueries = [...(c.queries || []), newQuery];
    await sendOps([{ type: "updateCase", payload: { caseId: c.id, fields: { queries: updatedQueries } } }]);
    setQueryText("");
    addToast("Query submitted to chamber legal counsel.", "success");
  };

  // Counsel Reply Handler
  const handleReplySubmit = async (queryId: string) => {
    if (!replyText.trim()) return;
    setSubmittingReply(true);

    const updatedQueries = (c.queries || []).map((q) => {
      if (q.id === queryId) {
        return {
          ...q,
          reply: replyText.trim(),
          replyBy: currentUser.id,
          replyTs: new Date().toISOString(),
        };
      }
      return q;
    });

    await sendOps([{ type: "updateCase", payload: { caseId: c.id, fields: { queries: updatedQueries } } }]);
    setReplyingTo(null);
    setReplyText("");
    setSubmittingReply(false);
    addToast("Counsel legal advice recorded on brief.", "success");
  };

  // Limitation calculation
  const getLimitationNotice = () => {
    if (!c.limitationDate || c.status === "Disposed") return null;
    const target = new Date(c.limitationDate + "T00:00:00").getTime();
    const nowMs = new Date().getTime();
    const daysLeft = Math.ceil((target - nowMs) / (1000 * 60 * 60 * 24));
    return {
      daysLeft,
      date: formatDate(c.limitationDate),
      task: c.limitationTask || "Statutory Limitation Filing",
    };
  };

  const limitation = getLimitationNotice();

  return (
    <div className="space-y-7">
      {/* Back button */}
      <div>
        <button
          onClick={() => setActivePage("cases")}
          className="inline-flex items-center gap-2 text-xs font-cinzel font-semibold tracking-wider text-[#111111]/65 hover:text-[#111111] dark:hover:text-[#f3eee3] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Case Diary
        </button>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#181818] text-[#111111] dark:text-[#f3eee3] p-6 md:p-8 border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3]">
                {c.caseNo}
              </span>
              <span className={`text-[10px] font-cinzel font-bold px-2.5 py-0.5 rounded-full border ${statusColor[c.status] || "bg-slate-100"}`}>
                {c.status.toUpperCase()}
              </span>
              {c.cnr && (
                <button
                  type="button"
                  onClick={() => handleCopyCNR(c.cnr!)}
                  className="inline-flex items-center gap-1 font-mono text-[11px] bg-white dark:bg-[#202020] hover:bg-[#f3efe6] border border-[#111111]/15 dark:border-[#f3eee3]/20 px-2 py-0.5 rounded-lg text-[#111111] dark:text-[#f3eee3] transition-colors"
                  title="Copy 16-digit CNR"
                >
                  <span>CNR: {c.cnr}</span>
                  {copiedCNR === c.cnr ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 opacity-60" />}
                </button>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#111111] dark:text-[#f3eee3]">
              {c.title}
            </h1>

            <div className="flex items-center gap-4 text-xs font-serif italic text-[#111111]/65 dark:text-[#f3eee3]/60 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#111111] dark:text-[#f3eee3]" /> {c.court}
                {c.courtRoom && <span className="text-[#111111] dark:text-[#f3eee3] font-mono font-bold">({c.courtRoom})</span>}
              </span>
              {c.judge && (
                <span className="flex items-center gap-1.5">
                  <Gavel className="w-3.5 h-3.5 text-[#111111] dark:text-[#f3eee3]" /> Bench: {c.judge}
                </span>
              )}
              {c.filingDate && <span>Filed: {formatDate(c.filingDate)}</span>}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs font-cinzel font-bold text-[#111111]/65 dark:text-[#f3eee3]/60">Active Stage:</span>
              <span className="px-3 py-1 rounded-xl text-xs font-serif bg-white dark:bg-[#202020] text-[#111111] dark:text-[#f3eee3] border border-[#111111]/15 dark:border-[#f3eee3]/20">
                {c.stage}
              </span>
            </div>
          </div>

          {/* Action desk */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0">
            {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
              <>
                <button
                  onClick={() => openModal("add-hearing", { caseId: c.id })}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  <Calendar className="w-4 h-4 text-white" /> + Hearing (NDOH)
                </button>
                <button
                  onClick={() => openModal("add-order", { caseId: c.id })}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#202020] text-[#111111] dark:text-[#f3eee3] font-cinzel font-semibold text-xs hover:bg-[#f3efe6] dark:hover:bg-[#1c202a] transition-colors border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs"
                >
                  <FileText className="w-4 h-4 text-[#111111] dark:text-[#f3eee3]" /> + Court Order
                </button>
                <button
                  onClick={() => openModal("set-status", { caseId: c.id, currentStatus: c.status, currentStage: c.stage })}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#202020] text-[#111111] dark:text-[#f3eee3] font-cinzel font-semibold text-xs hover:bg-[#f3efe6] dark:hover:bg-[#1c202a] transition-colors border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#111111] dark:text-[#f3eee3]" /> Update Stage
                </button>
                <button
                  onClick={() => openModal("edit-case", { case: c })}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#202020] text-[#111111] dark:text-[#f3eee3] font-cinzel font-semibold text-xs hover:bg-[#f3efe6] dark:hover:bg-[#1c202a] transition-colors border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs"
                >
                  <Edit className="w-4 h-4 text-[#111111] dark:text-[#f3eee3]" /> Edit Brief
                </button>
              </>
            )}
          </div>
        </div>

        {/* Limitation Act 1963 Radar Box */}
        {limitation && (
          <div className="mt-6 p-4 rounded-2xl bg-[#111111]/10 dark:bg-[#f3eee3]/15 border border-[#111111]/40 dark:border-[#f3eee3]/30 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-[#111111] dark:text-[#f3eee3] mt-0.5 flex-shrink-0" />
            <div className="text-xs font-serif">
              <span className="font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
                Limitation Act 1963 Radar:{" "}
              </span>
              <span>{limitation.task} due on </span>
              <span className="text-[#111111] dark:text-[#f3eee3] font-mono font-bold">
                {limitation.date} ({limitation.daysLeft > 0 ? `${limitation.daysLeft} days remaining` : "Limitation expired"})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-[#111111]/15 dark:border-[#f3eee3]/20 gap-6 text-xs font-cinzel font-bold tracking-wider overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab("hearings")}
          className={`pb-3 transition-colors ${
            activeTab === "hearings"
              ? "text-[#111111] dark:text-[#f3eee3] border-b-2 border-[#111111] dark:border-[#f3eee3]"
              : "text-[#111111]/65 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
          }`}
        >
          Hearings Board ({(c.hearings || []).length})
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 transition-colors ${
            activeTab === "orders"
              ? "text-[#111111] dark:text-[#f3eee3] border-b-2 border-[#111111] dark:border-[#f3eee3]"
              : "text-[#111111]/65 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
          }`}
        >
          Certified Orders ({(c.orders || []).length})
        </button>

        <button
          onClick={() => setActiveTab("queries")}
          className={`pb-3 transition-colors ${
            activeTab === "queries"
              ? "text-[#111111] dark:text-[#f3eee3] border-b-2 border-[#111111] dark:border-[#f3eee3]"
              : "text-[#111111]/65 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
          }`}
        >
          Client Query Desk ({(c.queries || []).length})
        </button>

        <button
          onClick={() => setActiveTab("billing")}
          className={`pb-3 transition-colors ${
            activeTab === "billing"
              ? "text-[#111111] dark:text-[#f3eee3] border-b-2 border-[#111111] dark:border-[#f3eee3]"
              : "text-[#111111]/65 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
          }`}
        >
          Fee Ledger &amp; Receipts
        </button>

        <button
          onClick={() => setActiveTab("parties")}
          className={`pb-3 transition-colors ${
            activeTab === "parties"
              ? "text-[#111111] dark:text-[#f3eee3] border-b-2 border-[#111111] dark:border-[#f3eee3]"
              : "text-[#111111]/65 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
          }`}
        >
          Parties &amp; Associates
        </button>

        <button
          onClick={() => setActiveTab("notes")}
          className={`pb-3 transition-colors ${
            activeTab === "notes"
              ? "text-[#111111] dark:text-[#f3eee3] border-b-2 border-[#111111] dark:border-[#f3eee3]"
              : "text-[#111111]/65 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
          }`}
        >
          Chamber Notes
        </button>
      </div>

      {/* 1. Hearings Board */}
      {activeTab === "hearings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic">
              Chronological hearings record and upcoming court listings (NDOH).
            </p>
            {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
              <button
                onClick={() => openModal("add-hearing", { caseId: c.id })}
                className="text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] hover:underline"
              >
                + Record Next Date (NDOH)
              </button>
            )}
          </div>

          {(c.hearings || []).length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#181818] rounded-3xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/65 dark:text-[#f3eee3]/60 shadow-xs">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-[#111111] dark:text-[#f3eee3]" />
              <p className="font-cinzel font-bold text-sm text-[#111111] dark:text-[#f3eee3]">No hearings recorded yet.</p>
              <p className="text-xs font-serif italic mt-1">Record the first hearing date to activate this matter on the daily cause list.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {[...(c.hearings || [])]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((h, i) => {
                  const isFuture = h.date >= todayStr;
                  return (
                    <div
                      key={i}
                      className={`p-5 rounded-3xl border transition-all ${
                        isFuture
                          ? "bg-white dark:bg-[#181818] border-[#111111]/30 dark:border-[#f3eee3]/40 shadow-xs"
                          : "bg-white dark:bg-[#181818] border-[#111111]/15 dark:border-[#f3eee3]/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-bold text-[#111111] dark:text-[#f3eee3]">
                              {formatDate(h.date)}
                            </span>
                            {isFuture && (
                              <span className="text-[9.5px] font-cinzel font-bold px-2 py-0.5 rounded-full bg-[#f3eee3]/30 dark:bg-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] border border-[#111111]/50 dark:border-[#f3eee3]/40">
                                Upcoming NDOH
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                            {h.purpose}
                          </p>
                        </div>
                      </div>

                      {h.outcome && (
                        <div className="mt-3 p-3.5 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs font-serif">
                          <span className="font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] text-[11px] block mb-1">
                            Court Outcome / Business Recorded:
                          </span>
                          <p className="text-[#111111]/70 dark:text-[#f3eee3]/60 leading-relaxed whitespace-pre-wrap">{h.outcome}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* 2. Certified Orders */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic">
              Order sheets, interlocutory directions, and certified rulings.
            </p>
            {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
              <button
                onClick={() => openModal("add-order", { caseId: c.id })}
                className="text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] hover:underline"
              >
                + File Certified Order
              </button>
            )}
          </div>

          {(c.orders || []).length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#181818] rounded-3xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/65 dark:text-[#f3eee3]/60 shadow-xs">
              <FileText className="w-8 h-8 mx-auto mb-2 text-[#111111] dark:text-[#f3eee3]" />
              <p className="font-cinzel font-bold text-sm text-[#111111] dark:text-[#f3eee3]">No certified court orders filed on record.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {c.orders?.map((ord, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                        {ord.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] text-[#111111] dark:text-[#f3eee3] bg-white dark:bg-[#202020] px-2 py-0.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20">
                          {formatDate(ord.date)}
                        </span>
                        {ord.citation && (
                          <span className="font-mono text-[10px] text-[#111111]/65 dark:text-[#f3eee3]/60 bg-white dark:bg-[#202020] px-2 py-0.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20">
                            Citation: {ord.citation}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs font-serif leading-relaxed text-[#111111]/85 dark:text-[#f3eee3]/85">
                    {ord.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Client Query Desk */}
      {activeTab === "queries" && (
        <div className="space-y-5">
          {currentUser.role === "client" && (
            <form onSubmit={handleSendQuery} className="p-6 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 space-y-3.5 shadow-xs">
              <label className="block text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
                Submit Direct Query to Chamber Legal Counsel
              </label>
              <textarea
                rows={3}
                required
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Inquire regarding upcoming arguments, order status, or documents required..."
                className="w-full p-4 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#8e929f] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] font-serif"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                Dispatch Query to Counsel
              </button>
            </form>
          )}

          <div className="space-y-4">
            {(c.queries || []).length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-[#111827] rounded-3xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/65 dark:text-[#f3eee3]/60 shadow-xs">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-[#111111] dark:text-[#f3eee3]" />
                <p className="font-cinzel font-bold text-sm text-[#111111] dark:text-[#f3eee3]">No litigant inquiries on this docket.</p>
              </div>
            ) : (
              c.queries.map((q) => (
                <div
                  key={q.id}
                  className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-[#111111]/15 dark:border-[#f3eee3]/20 space-y-3.5 shadow-xs"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#111111]/65 dark:text-[#f3eee3]/60">
                    <span className="font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
                      From: {state.users.find((u) => u.id === q.by)?.name || q.by}
                    </span>
                    <span className="font-mono">{formatDate(q.ts)}</span>
                  </div>

                  <p className="text-xs text-[#111111] dark:text-[#f3eee3] font-serif leading-relaxed">
                    &ldquo;{q.text}&rdquo;
                  </p>

                  {q.reply ? (
                    <div className="mt-3 p-4 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs">
                      <span className="font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] block mb-1">
                        Counsel Advice:
                      </span>
                      <p className="text-[#111111]/85 dark:text-[#f3eee3]/85 font-serif leading-relaxed">{q.reply}</p>
                    </div>
                  ) : (
                    (currentUser.role === "lawyer" || currentUser.role === "associate") && (
                      <div className="pt-2">
                        {replyingTo === q.id ? (
                          <div className="space-y-3">
                            <textarea
                              rows={2}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type counsel response..."
                              className="w-full p-3.5 rounded-xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs text-[#111111] dark:text-[#f3eee3] font-serif"
                            />
                            <div className="flex gap-2.5">
                              <button
                                onClick={() => handleReplySubmit(q.id)}
                                disabled={submittingReply || !replyText.trim()}
                                className="px-5 py-2 rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs"
                              >
                                {submittingReply ? "Saving..." : "Send Advice"}
                              </button>
                              <button
                                onClick={() => setReplyingTo(null)}
                                className="px-4 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs font-cinzel font-semibold"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReplyingTo(q.id)}
                            className="text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] hover:underline"
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
        <div className="space-y-6">
          <p className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic">
            Case accounting ledger for Vakalatnama retainer, drafting charges, and court appearance receipts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
              <span className="text-[10px] font-cinzel font-bold text-[#111111]/65 dark:text-[#f3eee3]/60 uppercase block">
                Total Agreed Fee
              </span>
              <span className="text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] mt-1.5 block">
                ₹{(c.feeAgreed || 0).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] font-serif text-[#111111]/65 dark:text-[#f3eee3]/60">Agreed under Vakalatnama</span>
            </div>

            <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 shadow-xs">
              <span className="text-[10px] font-cinzel font-bold text-emerald-700 dark:text-emerald-400 uppercase block">
                Received &amp; Credited
              </span>
              <span className="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-300 mt-1.5 block">
                ₹{(c.feeReceived || 0).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] font-serif text-emerald-600 dark:text-emerald-400">
                {(c.feeReceipts || []).length} Verified Receipts
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
              <span className="text-[10px] font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] uppercase block">
                Outstanding Balance
              </span>
              <span className="text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] mt-1.5 block">
                ₹{Math.max(0, (c.feeAgreed || 0) - (c.feeReceived || 0)).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] font-serif text-[#111111]/65 dark:text-[#f3eee3]/60">Payable at next judicial stage</span>
            </div>
          </div>

          {/* Receipts Table */}
          <div className="rounded-3xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] overflow-hidden shadow-xs">
            <div className="p-5 border-b border-[#111111]/15 dark:border-[#f3eee3]/20 flex items-center justify-between">
              <h4 className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3]">
                Payment Receipts &amp; Disbursements
              </h4>
              <button
                onClick={() => addToast("Receipt statement exported for client record.", "success")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#202020] text-xs font-cinzel font-semibold hover:bg-[#f3efe6] transition-colors border border-[#111111]/15 dark:border-[#f3eee3]/20"
              >
                <Printer className="w-3.5 h-3.5 text-[#111111] dark:text-[#f3eee3]" /> Print Statement
              </button>
            </div>

            {(c.feeReceipts || []).length === 0 ? (
              <div className="p-10 text-center text-xs font-serif text-[#111111]/65 dark:text-[#f3eee3]/60">
                No payment receipts issued for this matter yet.
              </div>
            ) : (
              <div className="divide-y divide-[#e5dfd2] dark:divide-[#222630]">
                {c.feeReceipts?.map((rec, i) => (
                  <div key={i} className="p-5 flex items-center justify-between text-xs font-serif">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#111111] dark:text-[#f3eee3]">
                          {rec.receiptNo || `REC-${i + 1}`}
                        </span>
                        <span className="text-[10px] font-cinzel font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          {rec.mode || "Bank Transfer"}
                        </span>
                      </div>
                      <p className="text-[#111111]/85 dark:text-[#f3eee3]/85 mt-1">{rec.note || "Professional fee disbursement"}</p>
                      <span className="text-[10px] text-[#111111]/65 dark:text-[#f3eee3]/60">Issued on {formatDate(rec.date)}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                        ₹{rec.amount.toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => addToast(`Downloaded receipt slip: ${rec.receiptNo || "Receipt"}`, "info")}
                        className="block text-[11px] font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] hover:underline mt-1"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 space-y-4 shadow-xs">
            <h3 className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#111111] dark:text-[#f3eee3]">
              Client on Record (Vakalatnama)
            </h3>
            {client ? (
              <div className="space-y-1.5 font-serif">
                <p className="text-base font-bold text-[#111111] dark:text-[#f3eee3] font-sans">{client.name}</p>
                <p className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 italic">{client.designation || "Litigant"}</p>
                <p className="text-xs font-mono text-[#111111]/65 dark:text-[#f3eee3]/60 pt-1">{client.email}</p>
                {client.phone && <p className="text-xs font-mono text-[#111111]/65 dark:text-[#f3eee3]/60">{client.phone}</p>}
              </div>
            ) : (
              <p className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic">No client mapped.</p>
            )}

            {leadCounsel && (
              <div className="pt-4 border-t border-[#111111]/15 dark:border-[#f3eee3]/20">
                <span className="text-[10px] uppercase font-cinzel tracking-wider text-[#111111]/65 dark:text-[#f3eee3]/60 block">
                  Lead Arguing Counsel
                </span>
                <p className="text-xs font-bold text-[#111111] dark:text-[#f3eee3] mt-1">{leadCounsel.name}</p>
                <p className="text-[11px] font-serif italic text-[#111111]/65 dark:text-[#f3eee3]/60">{leadCounsel.designation}</p>
              </div>
            )}
          </div>

          <div className="p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 space-y-4 shadow-xs">
            <h3 className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#111111] dark:text-[#f3eee3]">
              Assigned Chamber Associates
            </h3>
            {assignedAssociates.length === 0 ? (
              <p className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic">No junior associates assigned.</p>
            ) : (
              <div className="space-y-2.5">
                {assignedAssociates.map((a: any) => (
                  <div key={a.id} className="p-4 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#111111] dark:text-[#f3eee3] font-sans">{a.name}</p>
                      <p className="text-[11px] text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic">{a.designation}</p>
                    </div>
                    <span className="text-[9.5px] font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] px-2.5 py-0.5 rounded-full bg-[#f3eee3]/25 dark:bg-[#f3eee3]/15 border border-[#111111]/50 dark:border-[#f3eee3]/40">Briefed</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Notes */}
      {activeTab === "notes" && (
        <div className="p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 space-y-4 shadow-xs">
          <h3 className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#111111] dark:text-[#f3eee3]">
            Confidential Chamber Notes &amp; Safe Custody
          </h3>
          <p className="text-xs text-[#111111]/85 dark:text-[#f3eee3]/85 leading-relaxed font-serif whitespace-pre-wrap">
            {c.notes || "No internal chamber notes filed."}
          </p>
        </div>
      )}
    </div>
  );
}
