"use client";

import React, { useState } from "react";
import { X, Scale, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_OPTIONS = ["Active", "Disposed", "Stayed", "Quashed", "Adjourned S.D."];

export function Modals() {
  const { activeModal, closeModal, state, currentUser, sendOps, submitApproval, addToast } = useChamber();

  if (!activeModal || !state || !currentUser) return null;

  const { name, payload } = activeModal;
  const chamberLawyerId = currentUser.role === "lawyer" ? currentUser.id : (currentUser.lawyerId || "u-lawyer");

  // Common routing: If user is associate -> submit to approval queue; if lawyer/admin -> applyOp immediately
  const handleMutation = async (type: string, label: string, opPayload: any, customOp?: any) => {
    if (currentUser.role === "associate") {
      const approvalItem = {
        id: "a-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        by: currentUser.id,
        byName: currentUser.name,
        ts: new Date().toISOString(),
        type,
        label,
        payload: opPayload,
      };
      await submitApproval(approvalItem);
      addToast("Draft submitted to Senior Counsel verification desk.", "info");
    } else {
      const op = customOp || { type, payload: opPayload };
      await sendOps([op]);
      addToast(label + " recorded successfully on judicial docket.", "success");
    }
    closeModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg overflow-hidden bg-white dark:bg-[#181818] text-[#111111] dark:text-[#f3eee3] rounded-3xl shadow-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 flex flex-col max-h-[90vh]"
        >
          {name === "add-case" && (
            <AddCaseForm
              clients={state.users.filter(
                (u) => u.role === "client" && (currentUser.role === "admin" || (u.lawyerId || "u-lawyer") === chamberLawyerId)
              )}
              associates={state.users.filter(
                (u) => u.role === "associate" && (currentUser.role === "admin" || (u.lawyerId || "u-lawyer") === chamberLawyerId)
              )}
              onClose={closeModal}
              onSubmit={(c: any) =>
                handleMutation("addCase", `Fresh Suit: ${c.caseNo} — ${c.title}`, {
                  case: { ...c, lawyerId: chamberLawyerId },
                })
              }
            />
          )}

          {name === "add-hearing" && (
            <AddHearingForm
              caseId={payload.caseId}
              onClose={closeModal}
              onSubmit={(h: any) =>
                handleMutation("addHearing", `Hearing Date (NDOH) on ${h.date} recorded`, {
                  caseId: payload.caseId,
                  hearing: h,
                  by: currentUser.id,
                })
              }
            />
          )}

          {name === "add-order" && (
            <AddOrderForm
              caseId={payload.caseId}
              onClose={closeModal}
              onSubmit={(o: any) =>
                handleMutation("addOrder", `Court Order "${o.title}" on record`, {
                  caseId: payload.caseId,
                  order: o,
                  by: currentUser.id,
                })
              }
            />
          )}

          {name === "set-status" && (
            <SetStatusForm
              caseId={payload.caseId}
              currentStatus={payload.currentStatus}
              currentStage={payload.currentStage}
              onClose={closeModal}
              onSubmit={(data: any) =>
                handleMutation(
                  "setStatus",
                  `Stage updated to ${data.status} (${data.stage})`,
                  { caseId: payload.caseId, status: data.status, stage: data.stage }
                )
              }
            />
          )}

          {name === "edit-case" && (
            <EditCaseForm
              caseItem={payload.case}
              clients={state.users.filter(
                (u) => u.role === "client" && (currentUser.role === "admin" || (u.lawyerId || "u-lawyer") === chamberLawyerId)
              )}
              associates={state.users.filter(
                (u) => u.role === "associate" && (currentUser.role === "admin" || (u.lawyerId || "u-lawyer") === chamberLawyerId)
              )}
              onClose={closeModal}
              onSubmit={(fields: any, nextDate: string | null) => {
                const ops: any[] = [{ type: "updateCase", payload: { caseId: payload.case.id, fields } }];
                if (nextDate) {
                  ops.push({
                    type: "addHearing",
                    payload: {
                      caseId: payload.case.id,
                      hearing: { date: nextDate, purpose: "Court Hearing (NDOH)", outcome: "" },
                      by: currentUser.id,
                    },
                  });
                }
                handleMutation(
                  "compound",
                  `Brief ${payload.case.caseNo} details updated`,
                  { caseId: payload.case.id, ops },
                  ops.length === 1 ? ops[0] : undefined
                );
              }}
            />
          )}

          {name === "add-client" && (
            <AddClientForm
              onClose={closeModal}
              onSubmit={(u: any) =>
                handleMutation("addClient", `Client ${u.name} enrolled`, {
                  user: { ...u, lawyerId: chamberLawyerId },
                })
              }
            />
          )}

          {name === "add-associate" && (
            <AddAssociateForm
              onClose={closeModal}
              onSubmit={(u: any) =>
                handleMutation("addAssociate", `Associate ${u.name} inducted`, {
                  user: { ...u, lawyerId: chamberLawyerId },
                })
              }
            />
          )}

          {name === "add-user" && (
            <AddUserForm
              onClose={closeModal}
              onSubmit={(u: any) =>
                handleMutation("addUser", `User ${u.name} provisioned`, { user: u })
              }
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ================= Sub-Forms ================= */

function AddCaseForm({
  clients,
  associates,
  onClose,
  onSubmit,
}: {
  clients: any[];
  associates: any[];
  onClose: () => void;
  onSubmit: (c: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [caseNo, setCaseNo] = useState("");
  const [cnr, setCnr] = useState("");
  const [filingDate, setFilingDate] = useState(new Date().toISOString().slice(0, 10));
  const [court, setCourt] = useState("");
  const [courtRoom, setCourtRoom] = useState("");
  const [itemNo, setItemNo] = useState("");
  const [judge, setJudge] = useState("");
  const [clientId, setClientId] = useState(clients[0]?.id || "");
  const [status, setStatus] = useState("Active");
  const [stage, setStage] = useState("Fresh Filing (Registry Scrutiny)");
  const [limitationDate, setLimitationDate] = useState("");
  const [limitationTask, setLimitationTask] = useState("");
  const [selectedAssociates, setSelectedAssociates] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !caseNo || !court || !clientId) return;

    const newCase = {
      id: "c-" + Date.now(),
      caseNo: caseNo.trim(),
      cnr: cnr.trim(),
      title: title.trim(),
      court: court.trim(),
      courtRoom: courtRoom.trim(),
      itemNo: itemNo.trim(),
      judge: judge.trim(),
      clientId,
      associateIds: selectedAssociates,
      status,
      stage: stage.trim() || "Fresh Filing",
      filingDate,
      limitationDate: limitationDate.trim(),
      limitationTask: limitationTask.trim(),
      notes: notes.trim(),
      hearings: [],
      orders: [],
      queries: [],
    };
    onSubmit(newCase);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="p-5 sm:p-6 bg-[#f3eee3]/10 dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-between border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div>
          <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">Register Fresh Court Brief</h3>
          <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5">High Court / District Courts / Tribunal</p>
        </div>
        <button type="button" onClick={onClose} className="p-1 rounded-lg text-[#111111]/60 hover:text-[#111111] dark:hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh] text-xs font-serif">
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
            Matter Caption / Case Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Anand Sharma v. Union of India & Ors."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/50 focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Case Number *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. W.P.(C) 4120/2024"
              value={caseNo}
              onChange={(e) => setCaseNo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-mono text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/50 focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Filing Date
            </label>
            <input
              type="date"
              value={filingDate}
              onChange={(e) => setFilingDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3.5">
          <div className="col-span-2">
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Court / Forum *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. High Court of Delhi"
              value={court}
              onChange={(e) => setCourt(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/50 focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Court Room
            </label>
            <input
              type="text"
              placeholder="e.g. 05"
              value={courtRoom}
              onChange={(e) => setCourtRoom(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/50 focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Item No. on Board
            </label>
            <input
              type="text"
              placeholder="e.g. 18"
              value={itemNo}
              onChange={(e) => setItemNo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-mono text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/50 focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              CNR Number (16-char)
            </label>
            <input
              type="text"
              placeholder="e.g. DLHC01-008129-2024"
              value={cnr}
              onChange={(e) => setCnr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-mono text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/50 focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
            Presiding Judge / Bench
          </label>
          <input
            type="text"
            placeholder="e.g. Hon'ble Mr. Justice Manmohan"
            value={judge}
            onChange={(e) => setJudge(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/50 focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>

        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
            Retaining Litigant Client *
          </label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Current Stage
            </label>
            <input
              type="text"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              placeholder="e.g. Notice Issued"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/50 focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
            Chamber Notes / Brief Background
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Key arguments, limitation alerts, or interim relief sought..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/50 focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>
      </div>

      <div className="p-4 sm:p-5 bg-[#f3eee3]/10 dark:bg-[#111111] border-t border-[#111111]/15 dark:border-[#f3eee3]/20 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-xs font-cinzel font-semibold rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/60 dark:text-[#f3eee3]/60 hover:bg-[#f3efe6] dark:hover:bg-[#161820] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-xs font-cinzel font-bold tracking-wider rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm transition-all shadow-md"
        >
          Register Case Brief
        </button>
      </div>
    </form>
  );
}

function AddHearingForm({ caseId, onClose, onSubmit }: any) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [purpose, setPurpose] = useState("");
  const [outcome, setOutcome] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !purpose) return;
    onSubmit({ date, purpose: purpose.trim(), outcome: outcome.trim() });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-5 sm:p-6 bg-[#f3eee3]/10 dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-between border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div>
          <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">Record Next Date of Hearing (NDOH)</h3>
          <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5">Courtroom Listing & Cause Schedule</p>
        </div>
        <button type="button" onClick={onClose} className="p-1 rounded-lg text-[#111111]/60 hover:text-[#111111] dark:hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 text-xs font-serif">
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Listing Date (NDOH) *</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Purpose of Listing *</label>
          <input
            type="text"
            required
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Cross-examination of PW-1, Hearing on Interim Injunction"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/50 focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Business Recorded / Daily Order (Optional)</label>
          <textarea
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="Leave blank for future date; enter bench directions if hearing concluded..."
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/50 focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>
      </div>
      <div className="p-4 sm:p-5 bg-[#f3eee3]/10 dark:bg-[#111111] border-t border-[#111111]/15 dark:border-[#f3eee3]/20 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-xs font-cinzel font-semibold rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/60 dark:text-[#f3eee3]/60 hover:bg-[#f3efe6] dark:hover:bg-[#161820] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-xs font-cinzel font-bold tracking-wider rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm transition-all shadow-md"
        >
          Save Hearing Entry
        </button>
      </div>
    </form>
  );
}

function AddOrderForm({ caseId, onClose, onSubmit }: any) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [citation, setCitation] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !text) return;
    onSubmit({ title: title.trim(), date, citation: citation.trim(), text: text.trim() });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-5 sm:p-6 bg-[#f3eee3]/10 dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-between border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div>
          <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">Record Certified Court Order</h3>
          <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5">Judicial Directions & Precedent Citations</p>
        </div>
        <button type="button" onClick={onClose} className="p-1 rounded-lg text-[#111111]/60 hover:text-[#111111] dark:hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 text-xs font-serif">
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Order Title &amp; Description *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Order on Ad-Interim Status Quo, Notice Issued"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Date of Order *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Citation (e.g. DHC Neutral)</label>
            <input
              type="text"
              value={citation}
              onChange={(e) => setCitation(e.target.value)}
              placeholder="e.g. 2026:DHC:8412"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-mono text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Operative Directions / Verbatim Paragraph *</label>
          <textarea
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Issue notice returnable on... Parties to maintain status quo..."
            rows={4}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] font-serif focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>
      </div>
      <div className="p-4 sm:p-5 bg-[#f3eee3]/10 dark:bg-[#111111] border-t border-[#111111]/15 dark:border-[#f3eee3]/20 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-xs font-cinzel font-semibold rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/60 dark:text-[#f3eee3]/60 hover:bg-[#f3efe6] dark:hover:bg-[#161820] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-xs font-cinzel font-bold tracking-wider rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm transition-all shadow-md"
        >
          File Order on Record
        </button>
      </div>
    </form>
  );
}

function SetStatusForm({ caseId, currentStatus, currentStage, onClose, onSubmit }: any) {
  const [status, setStatus] = useState(currentStatus || "Active");
  const [stage, setStage] = useState(currentStage || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ status, stage: stage.trim() });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-5 sm:p-6 bg-[#f3eee3]/10 dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-between border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div>
          <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">Update Court Proceeding Stage</h3>
          <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5">Judicial Status & Trial Milestone</p>
        </div>
        <button type="button" onClick={onClose} className="p-1 rounded-lg text-[#111111]/60 hover:text-[#111111] dark:hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 text-xs font-serif">
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Current Judicial Stage</label>
          <input
            type="text"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            placeholder="e.g. Final Arguments, Judgment Reserved, Evidence (PW-1)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>
      </div>
      <div className="p-4 sm:p-5 bg-[#f3eee3]/10 dark:bg-[#111111] border-t border-[#111111]/15 dark:border-[#f3eee3]/20 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-xs font-cinzel font-semibold rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/60 dark:text-[#f3eee3]/60 hover:bg-[#f3efe6] dark:hover:bg-[#161820] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-xs font-cinzel font-bold tracking-wider rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm transition-all shadow-md"
        >
          Update Stage
        </button>
      </div>
    </form>
  );
}

function EditCaseForm({ caseItem, clients, associates, onClose, onSubmit }: any) {
  const [title, setTitle] = useState(caseItem.title || "");
  const [cnr, setCnr] = useState(caseItem.cnr || "");
  const [court, setCourt] = useState(caseItem.court || "");
  const [courtRoom, setCourtRoom] = useState(caseItem.courtRoom || "");
  const [itemNo, setItemNo] = useState(caseItem.itemNo || "");
  const [judge, setJudge] = useState(caseItem.judge || "");
  const [clientId, setClientId] = useState(caseItem.clientId || "");
  const [selectedAssociates, setSelectedAssociates] = useState<string[]>(caseItem.associateIds || []);
  const [limitationDate, setLimitationDate] = useState(caseItem.limitationDate || "");
  const [limitationTask, setLimitationTask] = useState(caseItem.limitationTask || "");
  const [nextDate, setNextDate] = useState("");
  const [notes, setNotes] = useState(caseItem.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields = {
      title: title.trim(),
      cnr: cnr.trim(),
      court: court.trim(),
      courtRoom: courtRoom.trim(),
      itemNo: itemNo.trim(),
      judge: judge.trim(),
      clientId,
      associateIds: selectedAssociates,
      limitationDate: limitationDate.trim(),
      limitationTask: limitationTask.trim(),
      notes: notes.trim(),
    };
    onSubmit(fields, nextDate || null);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="p-5 sm:p-6 bg-[#f3eee3]/10 dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-between border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div>
          <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">Edit Case Brief Particulars</h3>
          <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5">{caseItem.caseNo}</p>
        </div>
        <button type="button" onClick={onClose} className="p-1 rounded-lg text-[#111111]/60 hover:text-[#111111] dark:hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh] text-xs font-serif">
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Case Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Court / Forum *</label>
            <input
              type="text"
              required
              value={court}
              onChange={(e) => setCourt(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Presiding Judge</label>
            <input
              type="text"
              value={judge}
              onChange={(e) => setJudge(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">CNR Number</label>
            <input
              type="text"
              value={cnr}
              onChange={(e) => setCnr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-mono text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Court Room</label>
            <input
              type="text"
              value={courtRoom}
              onChange={(e) => setCourtRoom(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Item No</label>
            <input
              type="text"
              value={itemNo}
              onChange={(e) => setItemNo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-mono text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Chamber Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] font-serif focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>
      </div>
      <div className="p-4 sm:p-5 bg-[#f3eee3]/10 dark:bg-[#111111] border-t border-[#111111]/15 dark:border-[#f3eee3]/20 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-xs font-cinzel font-semibold rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/60 dark:text-[#f3eee3]/60 hover:bg-[#f3efe6] dark:hover:bg-[#161820] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-xs font-cinzel font-bold tracking-wider rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm transition-all shadow-md"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

function AddClientForm({ onClose, onSubmit }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    onSubmit({
      id: "u-" + Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-5 sm:p-6 bg-[#f3eee3]/10 dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-between border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div>
          <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">Enroll Litigant Client</h3>
          <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5">Confidential Client Dossier & Portal Access</p>
        </div>
        <button type="button" onClick={onClose} className="p-1 rounded-lg text-[#111111]/60 hover:text-[#111111] dark:hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 text-xs font-serif">
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Client Name / Corporate Entity *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Verma or Sunrise Textiles Pvt. Ltd."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Email (Portal Access) *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@chambers.in"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98110 ..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Initial Password</label>
          <input
            type="text"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-mono text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>
      </div>
      <div className="p-4 sm:p-5 bg-[#f3eee3]/10 dark:bg-[#111111] border-t border-[#111111]/15 dark:border-[#f3eee3]/20 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-xs font-cinzel font-semibold rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/60 dark:text-[#f3eee3]/60 hover:bg-[#f3efe6] dark:hover:bg-[#161820] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-xs font-cinzel font-bold tracking-wider rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm transition-all shadow-md"
        >
          Enroll Client
        </button>
      </div>
    </form>
  );
}

function AddAssociateForm({ onClose, onSubmit }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("Associate Counsel");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    onSubmit({
      id: "u-" + Date.now(),
      name: name.trim(),
      email: email.trim(),
      designation: designation.trim(),
      phone: phone.trim(),
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-5 sm:p-6 bg-[#f3eee3]/10 dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-between border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div>
          <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">Induct Associate Advocate</h3>
          <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5">Chamber Delegation & Verification Access</p>
        </div>
        <button type="button" onClick={onClose} className="p-1 rounded-lg text-[#111111]/60 hover:text-[#111111] dark:hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 text-xs font-serif">
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Associate Full Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Chamber Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="associate@chambers.in"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Designation</label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Senior Associate"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 ..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Password</label>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-mono text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-5 bg-[#f3eee3]/10 dark:bg-[#111111] border-t border-[#111111]/15 dark:border-[#f3eee3]/20 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-xs font-cinzel font-semibold rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/60 dark:text-[#f3eee3]/60 hover:bg-[#f3efe6] dark:hover:bg-[#161820] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-xs font-cinzel font-bold tracking-wider rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm transition-all shadow-md"
        >
          Induct Associate
        </button>
      </div>
    </form>
  );
}

function AddUserForm({ onClose, onSubmit }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("lawyer");
  const [password, setPassword] = useState("welcome123");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    onSubmit({
      id: "u-" + Date.now(),
      name: name.trim(),
      email: email.trim(),
      role,
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-5 sm:p-6 bg-[#f3eee3]/10 dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-between border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div>
          <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">Provision Chamber Account</h3>
          <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5">Platform Registrar Administration</p>
        </div>
        <button type="button" onClick={onClose} className="p-1 rounded-lg text-[#111111]/60 hover:text-[#111111] dark:hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 text-xs font-serif">
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Full Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Chamber Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Chamber Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            >
              <option value="lawyer">Lawyer (Senior Counsel)</option>
              <option value="associate">Associate (Junior Counsel)</option>
              <option value="client">Client (Litigant)</option>
              <option value="admin">Site Admin (Registrar)</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Initial Password</label>
          <input
            type="text"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-mono text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>
      </div>
      <div className="p-4 sm:p-5 bg-[#f3eee3]/10 dark:bg-[#111111] border-t border-[#111111]/15 dark:border-[#f3eee3]/20 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-xs font-cinzel font-semibold rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/60 dark:text-[#f3eee3]/60 hover:bg-[#f3efe6] dark:hover:bg-[#161820] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-xs font-cinzel font-bold tracking-wider rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm transition-all shadow-md"
        >
          Provision User
        </button>
      </div>
    </form>
  );
}
