"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function CaseDetailView() {
  const { state, currentUser, selectedCaseId, setActivePage, openModal, sendOps, addToast } = useChamber();
  const [activeTab, setActiveTab] = useState<"hearings" | "orders" | "queries" | "parties" | "notes">("hearings");
  const [queryText, setQueryText] = useState("");
  const [submittingQuery, setSubmittingQuery] = useState(false);
  const [copiedCnr, setCopiedCnr] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  if (!state || !currentUser || !selectedCaseId) return null;

  const c = state.cases.find((item) => item.id === selectedCaseId);
  if (!c) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm font-semibold text-slate-700">Case file not found.</p>
        <button
          onClick={() => setActivePage("cases")}
          className="mt-3 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900 text-white"
        >
          Return to Case Diary
        </button>
      </div>
    );
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const client = state.users.find((u) => u.id === c.clientId);
  const assignedAssociates = c.associateIds
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

  const getDayMonth = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    return { day: d.getDate(), mon: d.toLocaleDateString("en-IN", { month: "short" }) };
  };

  const statusColor: Record<string, string> = {
    Active: "bg-[#edf6f0] text-[#1b5e3a] border-[#cce4d4]",
    Listed: "bg-[#edf3f8] text-[#1c4d75] border-[#caddee]",
    Reserved: "bg-[#f5f2eb] text-[#5c4932] border-[#ded7c8]",
    Adjourned: "bg-[#fcf5ec] text-[#7a491c] border-[#ebd8c4]",
    Disposed: "bg-[#f3f2ef] text-[#5c5852] border-[#dcd9d4]",
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
      addToast("Inquiry recorded on case file.", "success");
    }
    setSubmittingQuery(false);
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    addToast(`${label} copied to clipboard`, "success");
  };

  const handleReplySubmit = async (queryId: string) => {
    if (!replyText.trim()) return;
    setSubmittingReply(true);
    const success = await sendOps([
      {
        type: "replyQuery",
        payload: { caseId: c.id, queryId, reply: replyText.trim() },
      },
    ]);
    if (success) {
      setReplyingTo(null);
      setReplyText("");
      addToast("Chamber reply sent to client.", "success");
    }
    setSubmittingReply(false);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => setActivePage("cases")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Case Diary
        </button>
      </div>

      {/* Chamber Case Header */}
      <div className="rounded-xl bg-[#14171a] text-white p-6 md:p-7 border border-[#252930]">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#c5a059]">
                {c.caseNo}
              </span>
              {c.cnr && (
                <>
                  <span className="text-[#4b5563]">·</span>
                  <button
                    onClick={() => {
                      copyText(c.cnr!, "CNR Number");
                      setCopiedCnr(true);
                      setTimeout(() => setCopiedCnr(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 font-mono text-[11px] bg-[#1d2228] hover:bg-[#252b33] border border-[#303742] px-2 py-0.5 rounded text-[#c5a059] transition-colors"
                    title="Click to copy CNR"
                  >
                    <span>CNR: {c.cnr}</span>
                    {copiedCnr ? <Check className="w-3 h-3 text-[#34d399]" /> : <Copy className="w-3 h-3 text-[#9ca3af]" />}
                  </button>
                </>
              )}
              <span className="text-[#4b5563]">·</span>
              <span className="text-xs text-[#d1d5db] flex items-center gap-1 font-serif">
                <Building className="w-3.5 h-3.5 text-[#c5a059]" /> {c.court}
                {c.courtRoom && <span className="text-[#c5a059] font-mono font-medium">({c.courtRoom})</span>}
                {c.itemNo && <span className="text-[#e5e7eb] font-mono font-bold">Item #{c.itemNo}</span>}
              </span>
              <span className="text-[#4b5563]">·</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColor[c.status] || ""}`}>
                {c.status}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold font-display text-white tracking-tight">
              {c.title}
            </h2>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#9ca3af] pt-1 font-serif">
              <span>
                Stage: <strong className="text-white font-medium">{c.stage}</strong>
              </span>
              <span>·</span>
              <span>
                Bench: <strong className="text-white font-medium">{c.judge || "Not specified"}</strong>
              </span>
              <span>·</span>
              <span>
                Filed: <strong className="text-white font-medium">{formatDate(c.filingDate)}</strong>
              </span>
            </div>
          </div>

          {/* Action buttons for lawyer & associate */}
          {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => openModal("add-hearing", { caseId: c.id })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c5a059] text-[#14171a] font-bold text-xs hover:bg-[#d4b067] transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" /> Next Hearing
              </button>
              <button
                onClick={() => openModal("add-order", { caseId: c.id })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22262d] text-[#e5e7eb] font-medium text-xs hover:bg-[#2b313a] transition-colors border border-[#343a45]"
              >
                <FileText className="w-3.5 h-3.5" /> Add Order
              </button>
              <button
                onClick={() => openModal("set-status", { caseId: c.id, currentStatus: c.status, currentStage: c.stage })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22262d] text-[#e5e7eb] font-medium text-xs hover:bg-[#2b313a] transition-colors border border-[#343a45]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Status
              </button>
              <button
                onClick={() => openModal("edit-case", { case: c })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22262d] text-[#e5e7eb] font-medium text-xs hover:bg-[#2b313a] transition-colors border border-[#343a45]"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Statutory Limitation Period Radar */}
      {c.limitationDate && (
        <div className="p-4 rounded-xl bg-[#fdf6f6] border border-[#f2d8d8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#991b1b] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#991b1b]">
                  Limitation Period Radar
                </span>
                <span className="text-[11px] font-semibold text-[#736e65]">
                  (Expiry: {formatDate(c.limitationDate)})
                </span>
              </div>
              <p className="text-xs font-bold text-[#191817] mt-0.5 font-serif">
                {c.limitationTask || "Statutory limitation compliance / filing milestone"}
              </p>
            </div>
          </div>
          <div>
            {(() => {
              const diffTime = new Date(c.limitationDate).getTime() - new Date().getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isExpired = diffDays < 0;
              return (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-mono font-bold ${
                    isExpired
                      ? "bg-[#991b1b] text-white"
                      : diffDays <= 7
                      ? "bg-[#991b1b] text-white"
                      : "bg-[#fcf5ec] text-[#7a491c] border border-[#ebd8c4]"
                  }`}
                >
                  {isExpired ? "Limitation Expired" : `${diffDays} days remaining`}
                </span>
              );
            })()}
          </div>
        </div>
      )}

      {/* Next Hearing Highlight Banner */}
      {nextHearing && (
        <div className="p-4 rounded-xl bg-[#faf8f4] border border-[#e6e2d8] flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-[#14171a] text-[#c5a059] font-display flex flex-col items-center justify-center text-center flex-shrink-0">
            <span className="text-sm font-bold leading-tight">{getDayMonth(nextHearing.date).day}</span>
            <span className="text-[9px] uppercase font-mono font-medium">
              {getDayMonth(nextHearing.date).mon}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#805e26]">
              Next Court Listing: {formatDate(nextHearing.date)}
            </span>
            <p className="text-xs font-bold text-[#191817] mt-0.5 font-serif">{nextHearing.purpose}</p>
          </div>
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex border-b border-[#e6e2d8] gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("hearings")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "hearings"
              ? "border-[#805e26] text-[#805e26]"
              : "border-transparent text-[#736e65] hover:text-[#191817]"
          }`}
        >
          <Calendar className="w-4 h-4" /> Hearings History ({c.hearings.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "orders"
              ? "border-[#805e26] text-[#805e26]"
              : "border-transparent text-[#736e65] hover:text-[#191817]"
          }`}
        >
          <FileText className="w-4 h-4" /> Court Orders ({c.orders.length})
        </button>
        <button
          onClick={() => setActiveTab("queries")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "queries"
              ? "border-[#805e26] text-[#805e26]"
              : "border-transparent text-[#736e65] hover:text-[#191817]"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Client Q&amp;A ({c.queries.length})
        </button>
        <button
          onClick={() => setActiveTab("parties")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "parties"
              ? "border-[#805e26] text-[#805e26]"
              : "border-transparent text-[#736e65] hover:text-[#191817]"
          }`}
        >
          <UserCheck className="w-4 h-4" /> Parties &amp; Team
        </button>
        {currentUser.role !== "client" && (
          <button
            onClick={() => setActiveTab("notes")}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "notes"
                ? "border-[#805e26] text-[#805e26]"
                : "border-transparent text-[#736e65] hover:text-[#191817]"
            }`}
          >
            <Lock className="w-4 h-4" /> Chamber Notes
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-[#e6e2d8] shadow-sm p-6">
        {/* Hearings Timeline */}
        {activeTab === "hearings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-slate-900">Cause List &amp; Proceedings Timeline</h3>
              {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
                <button
                  onClick={() => openModal("add-hearing", { caseId: c.id })}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
                >
                  + Add Date
                </button>
              )}
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {sortedHearings.map((h, idx) => {
                const isUpcoming = h.date >= todayStr;
                return (
                  <div key={idx} className="relative group">
                    <div
                      className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 bg-white ${
                        isUpcoming ? "border-amber-500 bg-amber-400" : "border-slate-400"
                      }`}
                    />
                    <div className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {formatDate(h.date)}{" "}
                          {isUpcoming && (
                            <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                              Upcoming
                            </span>
                          )}
                        </span>
                        {h.by && (
                          <span className="text-[10px] text-slate-400">
                            Recorded by: {state.users.find((u) => u.id === h.by)?.name || h.by}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-800 mt-1">{h.purpose}</p>
                      {h.outcome && (
                        <p className="text-xs text-slate-600 mt-1.5 bg-white p-2.5 rounded-lg border border-slate-100">
                          <strong>Outcome:</strong> {h.outcome}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {sortedHearings.length === 0 && (
                <p className="text-xs text-slate-400 italic">No hearings entered yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Orders Record */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-slate-900">Judicial Orders on Record</h3>
              {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
                <button
                  onClick={() => openModal("add-order", { caseId: c.id })}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
                >
                  + Add Order
                </button>
              )}
            </div>

            <div className="space-y-3">
              {c.orders.map((o, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{o.title}</h4>
                    <span className="text-[11px] font-medium text-slate-500">{formatDate(o.date)}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-2 whitespace-pre-wrap leading-relaxed font-serif">
                    {o.text}
                  </p>
                  {o.citation && (
                    <div className="mt-2.5 flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-800 font-semibold">
                        <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                        <span>Citation: {o.citation}</span>
                      </div>
                      <button
                        onClick={() => copyText(o.citation!, "Citation")}
                        className="text-[10px] font-semibold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy Citation
                      </button>
                    </div>
                  )}
                  {o.addedBy && (
                    <p className="text-[10px] text-slate-400 mt-2">
                      Entered by: {state.users.find((u) => u.id === o.addedBy)?.name || o.addedBy}
                    </p>
                  )}
                </div>
              ))}

              {c.orders.length === 0 && (
                <p className="text-xs text-slate-400 italic">No court orders recorded on this file.</p>
              )}
            </div>
          </div>
        )}

        {/* Client Queries */}
        {activeTab === "queries" && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold font-display text-slate-900">Client Inquiries &amp; Legal Counsel Q&amp;A</h3>

            <div className="space-y-3">
              {c.queries.map((q) => {
                const author = state.users.find((u) => u.id === q.by);
                return (
                  <div key={q.id} className="p-4 rounded-xl border-l-4 border-l-amber-500 bg-amber-50/30 border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                      <span>{author?.name || "Client"}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {new Date(q.ts).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1.5">{q.text}</p>

                    {q.reply && (
                      <div className="mt-3 p-3 rounded-lg bg-white border border-amber-200/80">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                          <CornerDownRight className="w-3 h-3 text-amber-600" /> Chamber Response:
                        </div>
                        <p className="text-xs text-slate-800 mt-1 font-serif">{q.reply}</p>
                      </div>
                    )}

                    {/* Reply button for lawyer or associate */}
                    {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
                      <div className="mt-2 text-right">
                        {replyingTo === q.id ? (
                          <div className="mt-2 space-y-2 text-left bg-white p-3 rounded-xl border border-slate-200">
                            <label className="block text-[11px] font-semibold text-slate-700">Chamber Response to Client:</label>
                            <textarea
                              rows={2}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type advice or confirmation here..."
                              className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 font-serif"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                disabled={submittingReply || !replyText.trim()}
                                onClick={() => handleReplySubmit(q.id)}
                                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg disabled:opacity-50"
                              >
                                {submittingReply ? "Submitting..." : "Send Reply"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setReplyingTo(q.id);
                              setReplyText(q.reply || "");
                            }}
                            className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1"
                          >
                            <CornerDownRight className="w-3 h-3" /> {q.reply ? "Edit Reply" : "Reply to Client"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {c.queries.length === 0 && (
                <p className="text-xs text-slate-400 italic">No messages or client inquiries on this file.</p>
              )}
            </div>

            {/* Post Query Box */}
            <form onSubmit={handleSendQuery} className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {currentUser.role === "client" ? "Send a Question to Your Legal Team" : "Add File Note / Inquiry Reply"}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Type inquiry here..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={submittingQuery || !queryText.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Parties & Team */}
        {activeTab === "parties" && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold font-display text-slate-900">Representation Particulars</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Representing Client</span>
                <p className="text-sm font-bold text-slate-900 mt-1">{client?.name || "Unassigned"}</p>
                <p className="text-xs text-slate-600 mt-0.5">{client?.email}</p>
                <p className="text-xs text-slate-500">{client?.phone || "No phone recorded"}</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Chamber Associates</span>
                <div className="mt-2 space-y-1.5">
                  {assignedAssociates.map((a: any) => (
                    <div key={a.id} className="text-xs text-slate-800 font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{a.name}</span>
                      <span className="text-[10px] text-slate-400">({a.designation || "Associate"})</span>
                    </div>
                  ))}
                  {assignedAssociates.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No junior associates assigned.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confidential Notes */}
        {activeTab === "notes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" /> Confidential Chamber Brief &amp; Strategy
              </h3>
              {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
                <button
                  onClick={() => openModal("edit-case", { case: c })}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Edit Notes
                </button>
              )}
            </div>

            <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/60 text-xs text-slate-800 leading-relaxed font-serif">
              {c.notes ? c.notes : <span className="italic text-slate-400">No chamber notes filed on this matter.</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

