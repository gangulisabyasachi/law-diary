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
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function CaseDetailView() {
  const { state, currentUser, selectedCaseId, setActivePage, openModal, sendOps, addToast } = useChamber();
  const [activeTab, setActiveTab] = useState<"hearings" | "orders" | "queries" | "parties" | "notes">("hearings");
  const [queryText, setQueryText] = useState("");
  const [submittingQuery, setSubmittingQuery] = useState(false);

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
    Active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    Listed: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    Reserved: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    Adjourned: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    Disposed: "bg-slate-500/15 text-slate-300 border-slate-500/30",
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

      {/* Regal Case Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 md:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                {c.caseNo}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-amber-400/80" /> {c.court}
              </span>
              <span className="text-slate-600">·</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColor[c.status] || ""}`}>
                {c.status}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold font-display text-white tracking-tight">
              {c.title}
            </h2>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 pt-1">
              <span>
                Stage: <strong className="text-slate-200">{c.stage}</strong>
              </span>
              <span>·</span>
              <span>
                Bench: <strong className="text-slate-200">{c.judge || "Not specified"}</strong>
              </span>
              <span>·</span>
              <span>
                Filed: <strong className="text-slate-200">{formatDate(c.filingDate)}</strong>
              </span>
            </div>
          </div>

          {/* Action buttons for lawyer & associate */}
          {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => openModal("add-hearing", { caseId: c.id })}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" /> Next Hearing
              </button>
              <button
                onClick={() => openModal("add-order", { caseId: c.id })}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700 transition-colors border border-slate-700"
              >
                <FileText className="w-3.5 h-3.5" /> Add Order
              </button>
              <button
                onClick={() => openModal("set-status", { caseId: c.id, currentStatus: c.status, currentStage: c.stage })}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700 transition-colors border border-slate-700"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Status
              </button>
              <button
                onClick={() => openModal("edit-case", { case: c })}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700 transition-colors border border-slate-700"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
          )}
        </div>

        {/* Judicial Seal Watermark in Background */}
        <div className="absolute right-4 -bottom-10 pointer-events-none opacity-5 text-amber-200 font-display text-[160px] font-bold select-none leading-none">
          §
        </div>
      </div>

      {/* Next Hearing Highlight Banner */}
      {nextHearing && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-950 text-amber-300 font-display flex flex-col items-center justify-center text-center shadow-md flex-shrink-0">
            <span className="text-base font-bold leading-tight">{getDayMonth(nextHearing.date).day}</span>
            <span className="text-[10px] uppercase font-body font-semibold tracking-wider">
              {getDayMonth(nextHearing.date).mon}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Next Court Listing: {formatDate(nextHearing.date)}
            </span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{nextHearing.purpose}</p>
          </div>
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("hearings")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "hearings"
              ? "border-amber-600 text-amber-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4" /> Hearings History ({c.hearings.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "orders"
              ? "border-amber-600 text-amber-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" /> Court Orders ({c.orders.length})
        </button>
        <button
          onClick={() => setActiveTab("queries")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "queries"
              ? "border-amber-600 text-amber-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Client Q&amp;A ({c.queries.length})
        </button>
        <button
          onClick={() => setActiveTab("parties")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "parties"
              ? "border-amber-600 text-amber-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <UserCheck className="w-4 h-4" /> Parties &amp; Team
        </button>
        {currentUser.role !== "client" && (
          <button
            onClick={() => setActiveTab("notes")}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "notes"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Lock className="w-4 h-4" /> Chamber Notes
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
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

