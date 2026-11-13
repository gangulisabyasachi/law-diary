"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Calendar, FileText, CheckCircle2, User, Scale, Edit } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

const STATUS_OPTIONS = ["Active", "Listed", "Reserved", "Adjourned", "Disposed"] as const;

export function Modals() {
  const { activeModal, closeModal, state, currentUser, sendOps, submitApproval, addToast } = useChamber();

  if (!activeModal || !state || !currentUser) return null;

  const { name, payload } = activeModal;
  const todayStr = new Date().toISOString().slice(0, 10);

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
      addToast("Submitted for advocate approval — it will reflect once approved.", "info");
    } else {
      const op = customOp || { type, payload: opPayload };
      await sendOps([op]);
      addToast(label + " saved successfully.", "success");
    }
    closeModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0c0e]/70">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg overflow-hidden bg-white rounded-xl shadow-2xl border border-[#e6e2d8] flex flex-col max-h-[90vh]"
        >
          {name === "add-case" && (
            <AddCaseForm
              clients={state.users.filter((u) => u.role === "client")}
              associates={state.users.filter((u) => u.role === "associate")}
              onClose={closeModal}
              onSubmit={(c: any) =>
                handleMutation("addCase", `New Case: ${c.caseNo} — ${c.title}`, { case: c })
              }
            />
          )}

          {name === "add-hearing" && (
            <AddHearingForm
              caseId={payload.caseId}
              onClose={closeModal}
              onSubmit={(h: any) =>
                handleMutation("addHearing", `Hearing on ${h.date} recorded`, {
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
                handleMutation("addOrder", `Order "${o.title}" filed`, {
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
                  `Status updated to ${data.status}`,
                  { caseId: payload.caseId, status: data.status, stage: data.stage }
                )
              }
            />
          )}

          {name === "edit-case" && (
            <EditCaseForm
              caseItem={payload.case}
              clients={state.users.filter((u) => u.role === "client")}
              associates={state.users.filter((u) => u.role === "associate")}
              onClose={closeModal}
              onSubmit={(fields: any, nextDate: any) => {
                const ops: any[] = [{ type: "updateCase", payload: { caseId: payload.case.id, fields } }];
                if (nextDate) {
                  ops.push({
                    type: "addHearing",
                    payload: {
                      caseId: payload.case.id,
                      hearing: { date: nextDate, purpose: "Hearing (set on edit)", outcome: "" },
                      by: currentUser.id,
                    },
                  });
                }
                handleMutation(
                  "compound",
                  `Case ${payload.case.caseNo} details updated`,
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
                handleMutation("addClient", `Client ${u.name} registered`, { user: u })
              }
            />
          )}

          {name === "add-associate" && (
            <AddAssociateForm
              onClose={closeModal}
              onSubmit={(u: any) =>
                handleMutation("addAssociate", `Associate ${u.name} inducted`, { user: u })
              }
            />
          )}

          {name === "add-user" && (
            <AddUserForm
              onClose={closeModal}
              onSubmit={(u: any) =>
                handleMutation("addUser", `User ${u.name} created`, { user: u })
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
  const [stage, setStage] = useState("Fresh Filing");
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
      <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <h3 className="text-base font-bold font-display">Add New Court Matter</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh] text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Case Title (Parties)</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Verma v. Kapoor Constructions Ltd."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Case Number</label>
            <input
              type="text"
              required
              value={caseNo}
              onChange={(e) => setCaseNo(e.target.value)}
              placeholder="e.g. CS(OS) 442/2026"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Date of Filing</label>
            <input
              type="date"
              required
              value={filingDate}
              onChange={(e) => setFilingDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">CNR Number</label>
            <input
              type="text"
              value={cnr}
              onChange={(e) => setCnr(e.target.value)}
              placeholder="e.g. DLHC01-002934-2024"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Court Room</label>
            <input
              type="text"
              value={courtRoom}
              onChange={(e) => setCourtRoom(e.target.value)}
              placeholder="e.g. Court 14"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Item No</label>
            <input
              type="text"
              value={itemNo}
              onChange={(e) => setItemNo(e.target.value)}
              placeholder="e.g. 09"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Limitation Deadline</label>
            <input
              type="date"
              value={limitationDate}
              onChange={(e) => setLimitationDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Limitation Task</label>
            <input
              type="text"
              value={limitationTask}
              onChange={(e) => setLimitationTask(e.target.value)}
              placeholder="e.g. File appeal u/s 37 Arbitration Act"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Court / Forum</label>
            <input
              type="text"
              required
              value={court}
              onChange={(e) => setCourt(e.target.value)}
              placeholder="e.g. Delhi High Court"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Presiding Judge</label>
            <input
              type="text"
              value={judge}
              onChange={(e) => setJudge(e.target.value)}
              placeholder="e.g. Hon'ble Justice S. Khanna"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Client</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            >
              {clients.map((cl) => (
                <option key={cl.id} value={cl.id}>
                  {cl.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Stage of Matter</label>
          <input
            type="text"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            placeholder="e.g. Evidence, Arguments, Notice"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Assign Associates (Hold Cmd/Ctrl to select multiple)
          </label>
          <select
            multiple
            value={selectedAssociates}
            onChange={(e) =>
              setSelectedAssociates(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 h-20"
          >
            {associates.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.designation || "Associate"})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Chamber Notes / Brief</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Confidential chamber summary, core exhibits..."
            rows={3}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800"
        >
          Create Case Record
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
      <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <h3 className="text-base font-bold font-display">Record Hearing Date</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Listing Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Purpose of Hearing</label>
          <input
            type="text"
            required
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Cross-examination of PW1, Final arguments"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Hearing Outcome (Optional)</label>
          <textarea
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="Leave blank if upcoming date; enter court directions if concluded..."
            rows={3}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800"
        >
          Save Hearing
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
      <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <h3 className="text-base font-bold font-display">Record Judicial Order</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Order Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Interim stay order, Order framing issues"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Date of Order</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Citation (Optional)</label>
            <input
              type="text"
              value={citation}
              onChange={(e) => setCitation(e.target.value)}
              placeholder="e.g. 2024 SCC OnLine Del 3412"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Operative Order Text</label>
          <textarea
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste operative portion of the judicial order..."
            rows={4}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 font-serif"
          />
        </div>
      </div>
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800"
        >
          File Order
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
      <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <h3 className="text-base font-bold font-display">Update Case Status</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Current Stage of Proceedings</label>
          <input
            type="text"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            placeholder="e.g. Final Arguments, Judgment Reserved"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800"
        >
          Update Status
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
      <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <h3 className="text-base font-bold font-display">Edit Case Particulars</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh] text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Case Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Court / Forum</label>
            <input
              type="text"
              required
              value={court}
              onChange={(e) => setCourt(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Presiding Judge</label>
            <input
              type="text"
              value={judge}
              onChange={(e) => setJudge(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">CNR Number</label>
            <input
              type="text"
              value={cnr}
              onChange={(e) => setCnr(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Court Room</label>
            <input
              type="text"
              value={courtRoom}
              onChange={(e) => setCourtRoom(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Item No</label>
            <input
              type="text"
              value={itemNo}
              onChange={(e) => setItemNo(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Limitation Deadline</label>
            <input
              type="date"
              value={limitationDate}
              onChange={(e) => setLimitationDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Limitation Task</label>
            <input
              type="text"
              value={limitationTask}
              onChange={(e) => setLimitationTask(e.target.value)}
              placeholder="e.g. Statutory limitation deadline"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Client</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            >
              {clients.map((cl: any) => (
                <option key={cl.id} value={cl.id}>
                  {cl.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Next Date (Quick Set)</label>
            <input
              type="date"
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Assigned Associates</label>
          <select
            multiple
            value={selectedAssociates}
            onChange={(e) =>
              setSelectedAssociates(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 h-20"
          >
            {associates.map((a: any) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Chamber Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 font-serif"
          />
        </div>
      </div>
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800"
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
  const [password, setPassword] = useState("client123");

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
      <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <h3 className="text-base font-bold font-display">Register Client</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Full Client Name / Company</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Verma or Sunrise Textiles Pvt. Ltd."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email (Portal Login)</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98110 ..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Initial Password</label>
          <input
            type="text"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>
      </div>
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800"
        >
          Register Client
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
  const [password, setPassword] = useState("assoc123");

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
      <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <h3 className="text-base font-bold font-display">Add Associate Counsel</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Associate Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Chamber Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="associate@chambers.in"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Designation</label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Senior Associate"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 ..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Initial Password</label>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>
      </div>
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800"
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
      <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <h3 className="text-base font-bold font-display">Create User Account</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="lawyer">Lawyer</option>
              <option value="associate">Associate</option>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Password</label>
          <input
            type="text"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>
      </div>
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800"
        >
          Create User
        </button>
      </div>
    </form>
  );
}
