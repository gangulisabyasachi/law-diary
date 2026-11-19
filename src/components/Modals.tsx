"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Scale, FileText, CheckCircle2, AlertCircle, Search, ChevronDown, ShieldAlert } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_OPTIONS = ["Active", "Listed", "Reserved", "Adjourned", "Stayed", "Quashed", "Disposed", "Adjourned S.D."];

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
      addToast("Draft submitted to Senior Advocate verification desk.", "info");
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
              caseId={payload?.caseId}
              cases={state.cases}
              onClose={closeModal}
              onSubmit={(h: any) => {
                const targetCaseId = h.caseId || payload?.caseId;
                if (!targetCaseId) {
                  addToast("Please select a matter for this hearing entry", "error");
                  return;
                }
                handleMutation("addHearing", `Hearing Date on ${h.date} recorded`, {
                  caseId: targetCaseId,
                  hearing: { date: h.date, purpose: h.purpose, outcome: h.outcome },
                  by: currentUser.id,
                });
              }}
            />
          )}

          {name === "add-order" && (
            <AddOrderForm
              caseId={payload?.caseId}
              cases={state.cases}
              onClose={closeModal}
              onSubmit={(o: any) => {
                const targetCaseId = o.caseId || payload?.caseId;
                if (!targetCaseId) {
                  addToast("Please select a matter for this judicial order", "error");
                  return;
                }
                handleMutation("addOrder", `Court Order "${o.title}" on record`, {
                  caseId: targetCaseId,
                  order: { title: o.title, date: o.date, citation: o.citation, text: o.text },
                  by: currentUser.id,
                });
              }}
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
                      hearing: { date: nextDate, purpose: "Court Hearing", outcome: "" },
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

          {name === "edit-client" && (
            <EditClientForm
              client={payload.client}
              onClose={closeModal}
              onSubmit={(u: any) =>
                handleMutation("updateUser", `Updated Client ${u.name}`, u)
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
  const router = useRouter();
  const [applicants, setApplicants] = useState("");
  const [respondents, setRespondents] = useState("");
  const [court, setCourt] = useState("");
  const [caseNo, setCaseNo] = useState("");
  const [previousDate, setPreviousDate] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicants.trim() || !respondents.trim() || !court.trim() || !caseNo.trim() || !nextDate) return;

    const title = `${applicants.trim()} v. ${respondents.trim()}`;
    const hearings: any[] = [];
    if (previousDate) {
      hearings.push({
        id: "h-" + Date.now() + "-prev",
        date: previousDate,
        purpose: "Previous Hearing",
        outcome: "Listed / Adjourned",
      });
    }
    if (nextDate) {
      hearings.push({
        id: "h-" + Date.now() + "-next",
        date: nextDate,
        purpose: "Court Hearing",
        outcome: "",
      });
    }

    const newCase = {
      id: "c-" + Date.now(),
      caseNo: caseNo.trim(),
      title,
      court: court.trim(),
      courtRoom: "",
      itemNo: "",
      judge: "",
      clientId: clients[0]?.id || "c-client",
      associateIds: [],
      status: "Active",
      stage: previousDate ? "Ongoing Litigation" : "Fresh Matter",
      filingDate: previousDate || new Date().toISOString().slice(0, 10),
      notes: notes.trim(),
      hearings,
      orders: [],
      queries: [],
    };
    onSubmit(newCase);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="p-5 sm:p-6 bg-[#f3eee3]/10 dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-between border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div>
          <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">File Fresh Matter</h3>
          <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5">Court brief &amp; hearing docket</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push("/dashboard/cases/new");
            }}
            className="text-[11px] font-cinzel text-[#d9541e] hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            <span>Full Intake Page ↗</span>
          </button>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-[#111111]/60 hover:text-[#111111] dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh] text-xs font-serif">
        {/* 1. Name(s) of Applicant(s) */}
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
            Name(s) of the Applicant(s) *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Anand Sharma, S.K. Gupta"
            value={applicants}
            onChange={(e) => setApplicants(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/50 focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>

        {/* 2. Name(s) of Respondent(s) */}
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
            Name(s) of the Respondent(s) *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Union of India & Ors."
            value={respondents}
            onChange={(e) => setRespondents(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/50 focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>

        {/* 3. Court Name (Open free text, not a fixed list) */}
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
            Court Name *
          </label>
          <input
            type="text"
            required
            placeholder="Enter court / tribunal name (e.g. High Court, District Court, Tribunal)..."
            value={court}
            onChange={(e) => setCourt(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/50 focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>

        {/* 4. Case Number */}
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
            Case Number *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., W.P.(C) 4120/2026 or CS(COMM) 312/2026"
            value={caseNo}
            onChange={(e) => setCaseNo(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-mono text-[#111111] dark:text-[#f3eee3] placeholder:text-[#111111]/50 focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
          />
        </div>

        {/* 5. Previous Date & 6. Next Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Previous Date (Only for Old Case)
            </label>
            <input
              type="date"
              value={previousDate}
              onChange={(e) => setPreviousDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Next Date *
            </label>
            <input
              type="date"
              required
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
        </div>

        {/* 7. Chamber Notes / Brief Background */}
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
            Chamber Notes / Brief Background
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
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
          File Matter
        </button>
      </div>
    </form>
  );
}

function SearchableCaseCombobox({
  cases,
  selectedCaseId,
  onSelect,
  label = "Select Court Matter *",
}: {
  cases: any[];
  selectedCaseId: string;
  onSelect: (id: string) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCase = (cases || []).find((c) => c.id === selectedCaseId);

  const filteredCases = (cases || []).filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.caseNo || "").toLowerCase().includes(q) ||
      (c.title || "").toLowerCase().includes(q) ||
      (c.court || "").toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] flex items-center justify-between cursor-pointer hover:border-[#d9541e] transition-colors"
      >
        <span className={selectedCase ? "font-serif truncate font-semibold" : "text-[#111111]/40 dark:text-[#f3eee3]/40"}>
          {selectedCase ? `${selectedCase.caseNo} — ${selectedCase.title} (${selectedCase.court})` : "Type to search or select a matter..."}
        </span>
        <ChevronDown className="w-4 h-4 text-[#111111]/50 dark:text-[#f3eee3]/50 flex-shrink-0 ml-2" />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-[#1e1c19] rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-2xl overflow-hidden p-2">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#111111]/40 dark:text-[#f3eee3]/40" />
            <input
              type="text"
              autoFocus
              placeholder="Search by case number, title or court..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-[#f3eee3]/20 dark:bg-[#25221f] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {filteredCases.length === 0 ? (
              <p className="p-3 text-center text-xs text-[#111111]/50 dark:text-[#f3eee3]/50 font-serif italic">
                No matching court matters found
              </p>
            ) : (
              filteredCases.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onSelect(c.id);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex flex-col gap-0.5 ${
                    selectedCaseId === c.id
                      ? "bg-[#d9541e]/10 text-[#d9541e] font-bold"
                      : "hover:bg-[#f3eee3]/50 dark:hover:bg-white/5 text-[#111111] dark:text-[#f3eee3]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold">{c.caseNo}</span>
                    <span className="text-[10px] font-cinzel opacity-70">{c.court}</span>
                  </div>
                  <span className="font-serif text-[11px] truncate opacity-85">{c.title}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AddHearingForm({ caseId, cases, onClose, onSubmit }: any) {
  const [selectedCaseId, setSelectedCaseId] = useState(caseId || (cases && cases[0]?.id) || "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [purpose, setPurpose] = useState("");
  const [outcome, setOutcome] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId || !date || !purpose) return;
    onSubmit({ caseId: selectedCaseId, date, purpose: purpose.trim(), outcome: outcome.trim() });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-5 sm:p-6 bg-[#f3eee3]/10 dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-between border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div>
          <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">Record Next Date of Hearing</h3>
          <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5">Courtroom Listing & Cause Schedule</p>
        </div>
        <button type="button" onClick={onClose} className="p-1 rounded-lg text-[#111111]/60 hover:text-[#111111] dark:hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 text-xs font-serif">
        {!caseId && (
          <SearchableCaseCombobox
            cases={cases}
            selectedCaseId={selectedCaseId}
            onSelect={setSelectedCaseId}
            label="Select Court Matter *"
          />
        )}
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Next Date *</label>
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

function AddOrderForm({ caseId, cases, onClose, onSubmit }: any) {
  const [selectedCaseId, setSelectedCaseId] = useState(caseId || (cases && cases[0]?.id) || "");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [citation, setCitation] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId || !title || !date || !text) return;
    onSubmit({ caseId: selectedCaseId, title: title.trim(), date, citation: citation.trim(), text: text.trim() });
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
        {!caseId && (
          <SearchableCaseCombobox
            cases={cases}
            selectedCaseId={selectedCaseId}
            onSelect={setSelectedCaseId}
            label="Select Court Matter *"
          />
        )}
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

const STANDARD_COURT_STAGES = [
  "Fresh Filing / Admission",
  "Notice Issued / Service",
  "Pleadings / Written Statement",
  "Rejoinder & Replication",
  "Framing of Issues",
  "Plaintiff / Petitioner Evidence",
  "Defendant / Respondent Evidence",
  "Final Arguments",
  "Reserved for Judgment / Orders",
  "Compliance & Execution",
  "Disposed / Closed",
];

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
          <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5">Judicial Status &amp; Trial Milestone</p>
        </div>
        <button type="button" onClick={onClose} className="p-1 rounded-lg text-[#111111]/60 hover:text-[#111111] dark:hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 text-xs font-serif">
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Court Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
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
            required
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            placeholder="e.g. Final Arguments, Judgment Reserved, Evidence (PW-1)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
          />
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {STANDARD_COURT_STAGES.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStage(st)}
                className={`text-[10px] font-cinzel px-2.5 py-1 rounded-lg border transition-all ${
                  stage === st
                    ? "bg-[#d9541e] text-white border-[#d9541e] font-bold"
                    : "bg-white/50 dark:bg-white/5 border-[#111111]/10 dark:border-[#f3eee3]/10 text-[#111111]/70 dark:text-[#f3eee3]/70 hover:border-[#d9541e]"
                }`}
              >
                {st}
              </button>
            ))}
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
          Update Stage
        </button>
      </div>
    </form>
  );
}

function EditCaseForm({ caseItem, clients, associates, onClose, onSubmit }: any) {
  const [title, setTitle] = useState(caseItem.title || "");
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
        <div className="grid grid-cols-2 gap-3.5">
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

        {/* Statutory Limitation Period (The Limitation Act, 1963) */}
        <div className="p-3.5 rounded-2xl bg-[#f3eee3]/20 dark:bg-white/5 border border-[#111111]/10 dark:border-[#f3eee3]/10 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-cinzel font-bold text-[#d9541e]">
            <ShieldAlert className="w-4 h-4" />
            <span>Statutory Limitation Tracking (The Limitation Act, 1963)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1">
                Limitation Cutoff Date
              </label>
              <input
                type="date"
                value={limitationDate}
                onChange={(e) => setLimitationDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1">
                Pleading / Limitation Task
              </label>
              <input
                type="text"
                value={limitationTask}
                onChange={(e) => setLimitationTask(e.target.value)}
                placeholder="e.g. Replication to WS, Appeal under Sec 96 CPC"
                className="w-full px-3 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
              />
            </div>
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
    if (!name.trim() || !phone.trim()) return;
    onSubmit({
      id: "u-" + Date.now(),
      name: name.trim(),
      email: email.trim() || "",
      phone: phone.trim(),
      password: password.trim() || "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-5 sm:p-6 bg-[#f3eee3]/10 dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-between border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div>
          <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">Enroll Litigant Client</h3>
          <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5">Confidential Client Dossier & Record</p>
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
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">Phone Number *</label>
            <input
              type="tel"
              required
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile number"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Email Address <span className="font-sans font-normal text-[#111111]/45 dark:text-[#f3eee3]/45">(Optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@chambers.in (optional)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-[#f3eee3]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
            Initial Password <span className="font-sans font-normal text-[#111111]/45 dark:text-[#f3eee3]/45">(Optional)</span>
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Optional portal login key"
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

function EditClientForm({ client, onClose, onSubmit }: any) {
  const [name, setName] = useState(client?.name || "");
  const [email, setEmail] = useState(client?.email || "");
  const [phone, setPhone] = useState(client?.phone || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSetDefaultPassword = () => {
    setPassword("LD_password@1234");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    onSubmit({
      userId: client.id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-5 sm:p-6 bg-[#f3eee3]/10 dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-between border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div>
          <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
            Edit Litigant Client Details
          </h3>
          <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5">
            Modify dossier particulars, credentials &amp; contact data
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-[#111111]/60 hover:text-[#111111] dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-4 text-xs font-serif">
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
            Client Name / Entity *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Contact Phone * <span className="font-sans font-normal text-[#111111]/45 dark:text-[#f3eee3]/45">(10 digits)</span>
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile number"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
            />
          </div>

          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Email ID / Username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@chambers.in or client_username"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60">
              Reset Password <span className="font-sans font-normal text-[#111111]/45 dark:text-[#f3eee3]/45">(Leave blank to keep unchanged)</span>
            </label>
            <button
              type="button"
              onClick={handleSetDefaultPassword}
              className="text-[11px] font-mono text-[#d9541e] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              Default (LD_password@1234)
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password or click Default above"
              className="w-full px-3.5 py-2.5 pr-20 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10.5px] font-cinzel font-bold text-[#111111]/60 dark:text-[#f3eee3]/60 hover:text-[#d9541e] cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
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
          className="px-5 py-2.5 text-xs font-cinzel font-bold tracking-wider rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] transition-all shadow-md"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

function AddAssociateForm({ onClose, onSubmit }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("Associate Advocate");
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
              <option value="lawyer">Lawyer (Senior Advocate)</option>
              <option value="associate">Associate (Junior Advocate)</option>
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
