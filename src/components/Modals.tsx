"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Scale, FileText, CheckCircle2, AlertCircle, Search, ChevronDown, ShieldAlert, Copy, Check, UserCheck, Power, Lock, RefreshCw, Key, ShieldCheck, AlertTriangle, Trash2, Eye, EyeOff } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_OPTIONS = ["Active", "Listed", "Reserved", "Adjourned", "Stayed", "Quashed", "Disposed", "Adjourned S.D."];

export function Modals() {
  const { activeModal, closeModal, state, currentUser, sendOps, submitApproval, addToast, deleteChamber } = useChamber();

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
      const ok = await submitApproval(approvalItem);
      if (ok) {
        closeModal();
      }
    } else {
      const op = customOp || { type, payload: opPayload };
      await sendOps([op]);
      addToast(label + " recorded successfully on judicial docket.", "success");
      closeModal();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full ${
            name === "provision-advocate" || name === "add-user" ? "max-w-2xl" : "max-w-lg"
          } overflow-hidden bg-white dark:bg-[#181818] text-[#111111] dark:text-[#f3eee3] rounded-3xl shadow-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 flex flex-col max-h-[90vh]`}
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
                  user: { ...u, lawyerId: payload?.lawyerId || chamberLawyerId },
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
                  user: { ...u, lawyerId: payload?.lawyerId || chamberLawyerId },
                })
              }
            />
          )}

          {name === "edit-associate" && (
            <EditAssociateForm
              associate={payload.associate}
              onClose={closeModal}
              onSubmit={(u: any) =>
                handleMutation("updateUser", `Updated Associate ${u.name}`, u)
              }
            />
          )}

          {(name === "provision-advocate" || name === "add-user") && (
            <ProvisionAdvocateForm
              onClose={closeModal}
              onSubmit={(formData: any) =>
                handleMutation(
                  "provisionAdvocate",
                  `Advocate ${formData.name} Account & Chamber Workspace Commissioned`,
                  formData
                )
              }
            />
          )}

          {name === "edit-user-admin" && (
            <EditUserAdminForm
              user={payload?.user}
              lawyers={(state?.users || []).filter((u) => u.role === "lawyer")}
              onClose={closeModal}
              onSubmit={(updates: any) =>
                handleMutation("adminUpdateUser", `User ${updates.name || payload?.user?.name} Profile Updated`, {
                  userId: payload.user.id,
                  ...updates,
                })
              }
            />
          )}

          {name === "delete-chamber" && (
            <DeleteChamberConfirmModal
              lawyer={payload?.lawyer}
              onClose={closeModal}
              onConfirm={async () => {
                if (payload?.onConfirm) {
                  await payload.onConfirm();
                } else if (payload?.lawyer?.id) {
                  await deleteChamber(payload.lawyer.id);
                }
              }}
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

function formatAadhaar(val: string): string {
  const digits = (val || "").replace(/\D/g, "").slice(0, 12);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function AddClientForm({ onClose, onSubmit }: any) {
  const [aadhaar, setAadhaar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [matchedClient, setMatchedClient] = useState<any>(null);
  const [aadhaarError, setAadhaarError] = useState("");

  const triggerAadhaarLookup = async (rawAadhaar: string) => {
    const cleanDigits = (rawAadhaar || "").replace(/\D/g, "").slice(0, 12);
    if (cleanDigits.length !== 12) {
      setMatchedClient(null);
      return;
    }
    setIsLookingUp(true);
    try {
      const res = await fetch(`/api/clients/lookup?aadhaar=${cleanDigits}`);
      const data = await res.json();
      if (data?.client) {
        setMatchedClient(data.client);
        if (data.client.name) setName(data.client.name);
        if (data.client.phone) setPhone(data.client.phone);
        if (data.client.email) setEmail(data.client.email);
        setAadhaarError("");
      } else {
        setMatchedClient(null);
      }
    } catch (err) {
      console.warn("Aadhaar lookup error:", err);
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaar(e.target.value);
    setAadhaar(formatted);
    const clean = formatted.replace(/\D/g, "");
    if (clean.length === 12) {
      triggerAadhaarLookup(clean);
      setAadhaarError("");
    } else {
      if (matchedClient) setMatchedClient(null);
      if (clean.length > 0 && clean.length < 12) {
        setAadhaarError("Aadhaar number must be exactly 12 digits");
      } else {
        setAadhaarError("");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAadhaar = aadhaar.replace(/\D/g, "").slice(0, 12);
    if (!cleanAadhaar || cleanAadhaar.length !== 12) {
      setAadhaarError("Aadhaar number is super mandatory. Please enter exactly 12 digits.");
      return;
    }
    if (!name.trim()) return;

    onSubmit({
      id: matchedClient?.id || "u-" + Date.now(),
      name: name.trim(),
      aadhaarNumber: cleanAadhaar,
      email: email.trim() || "",
      phone: phone.trim() || "",
      password: password.trim() || "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-5 sm:p-6 bg-[#f3eee3]/10 dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-between border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div>
          <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">Enroll Litigant Client</h3>
          <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5">Confidential Client Dossier & Universal Cross-Chamber Record</p>
        </div>
        <button type="button" onClick={onClose} className="p-1 rounded-lg text-[#111111]/60 hover:text-[#111111] dark:hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 space-y-4 text-xs font-serif">
        {/* Super Mandatory Aadhaar Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-cinzel font-semibold text-[#111111] dark:text-[#f3eee3]">
              Aadhaar Number <span className="text-[#d9541e] font-bold">* (Super Mandatory)</span>
            </label>
            <span className="text-[10px] text-[#d9541e] font-serif italic">
              12-Digit Litigant Unique Key
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              required
              autoFocus
              maxLength={14}
              value={aadhaar}
              onChange={handleAadhaarChange}
              onBlur={() => {
                const clean = aadhaar.replace(/\D/g, "").slice(0, 12);
                if (clean.length === 12) triggerAadhaarLookup(clean);
              }}
              placeholder="XXXX XXXX XXXX"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d9541e]/50 dark:border-[#d9541e]/60 bg-white dark:bg-[#202020] text-xs font-mono font-bold tracking-widest text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e]"
            />
            {isLookingUp && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-amber-600 dark:text-amber-400 font-serif italic animate-pulse">
                Checking registry...
              </div>
            )}
          </div>
          {aadhaarError && (
            <p className="text-[10.5px] text-rose-600 dark:text-rose-400 mt-1 font-serif">
              {aadhaarError}
            </p>
          )}
          {matchedClient && (
            <div className="mt-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-900 dark:text-emerald-200 font-serif">
              <div className="flex items-center gap-1.5 font-bold font-cinzel text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Existing Litigant Profile Detected across Chambers</span>
              </div>
              <p className="text-[10.5px] mt-1">
                Found litigant <strong>{matchedClient.name}</strong> linked to this Aadhaar ID. Particulars autofilled automatically. Their single universal login passcode will link all chamber matters.
              </p>
            </div>
          )}
        </div>

        {/* Mandatory Name */}
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
            Client Name / Corporate Entity <span className="text-[#d9541e]">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Verma or Sunrise Textiles Pvt. Ltd."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
          />
        </div>

        {/* Recommended Mobile & Optional Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Mobile Number <span className="font-sans font-normal text-[#111111]/60 dark:text-[#f3eee3]/60">(Recommended)</span>
            </label>
            <input
              type="tel"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile number"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
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
            placeholder="Optional portal login key (auto-generated if left blank)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-mono text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
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
  const [aadhaar, setAadhaar] = useState(formatAadhaar(client?.aadhaarNumber || ""));
  const [name, setName] = useState(client?.name || "");
  const [email, setEmail] = useState(client?.email || "");
  const [phone, setPhone] = useState(client?.phone || "");
  const [copiedPass, setCopiedPass] = useState(false);

  const clientPermanentPassword = client.accessCode || (client.id === "u-client" ? "client123" : "LD" + client.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase());

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(clientPermanentPassword);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const cleanAadhaar = aadhaar.replace(/\D/g, "").slice(0, 12);
    onSubmit({
      userId: client.id,
      name: name.trim(),
      aadhaarNumber: cleanAadhaar,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
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
        {/* Aadhaar Number */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-cinzel font-semibold text-[#111111] dark:text-[#f3eee3]">
              Aadhaar Number <span className="text-[#d9541e] font-bold">* (Super Mandatory)</span>
            </label>
            <span className="text-[10px] text-[#d9541e] font-serif italic">
              12-Digit Litigant Unique Key
            </span>
          </div>
          <input
            type="text"
            required
            maxLength={14}
            value={aadhaar}
            onChange={(e) => setAadhaar(formatAadhaar(e.target.value))}
            placeholder="XXXX XXXX XXXX"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#d9541e]/50 dark:border-[#d9541e]/60 bg-white dark:bg-[#202020] text-xs font-mono font-bold tracking-widest text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
          />
        </div>

        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
            Client Name / Entity <span className="text-[#d9541e]">*</span>
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
              Contact Phone <span className="font-sans font-normal text-[#111111]/45 dark:text-[#f3eee3]/45">(Recommended)</span>
            </label>
            <input
              type="tel"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile number"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
            />
          </div>

          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Email ID <span className="font-sans font-normal text-[#111111]/45 dark:text-[#f3eee3]/45">(Optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@chambers.in (optional)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-serif text-amber-900 dark:text-amber-300">
          <strong>Portal Login Requirement:</strong> A valid email ID is mandatory when editing a client profile so the litigant can authenticate and log into their LexDaily client portal.
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60">
              Permanent Litigant Access Password
            </label>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-serif italic">
              System-Generated · Immutable
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-[#111111]/5 dark:bg-[#181818] font-mono font-bold text-xs tracking-wider text-[#111111] dark:text-[#f3eee3] flex items-center justify-between">
              <span>{clientPermanentPassword}</span>
              <span className="text-[10px] font-sans font-normal text-[#111111]/50 dark:text-[#f3eee3]/50">Universal Passcode</span>
            </div>
            <button
              type="button"
              onClick={handleCopyPassword}
              className="px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] hover:border-[#d9541e] hover:text-[#d9541e] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Copy password to clipboard"
            >
              {copiedPass ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[10.5px] font-serif italic text-[#111111]/50 dark:text-[#f3eee3]/50 mt-1.5">
            This password is auto-generated and immutable across all chambers. Litigants use their email and this permanent password to log into their unified portal.
          </p>
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

function EditAssociateForm({ associate, onClose, onSubmit }: any) {
  const [name, setName] = useState(associate?.name || "");
  const [designation, setDesignation] = useState(associate?.designation || "Associate Advocate");
  const [email, setEmail] = useState(associate?.email || "");
  const [phone, setPhone] = useState(associate?.phone || "");
  const [password, setPassword] = useState(associate?.accessCode || (associate?.id === "u-assoc" ? "assoc123" : "assoc123"));
  const [showPassword, setShowPassword] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password || "assoc123");
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const handleSetDefaultPassword = () => {
    setPassword("assoc123");
  };

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "Assoc@";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(code);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSubmit({
      userId: associate.id,
      name: name.trim(),
      designation: designation.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: password.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-5 sm:p-6 bg-[#f3eee3]/10 dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-between border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div>
          <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
            Edit Associate Advocate Profile
          </h3>
          <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5">
            Modify chamber credentials, phone, email &amp; login password
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-[#111111]/60 hover:text-[#111111] dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-4 text-xs font-serif overflow-y-auto max-h-[70vh]">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
            Associate Full Name <span className="text-[#d9541e]">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Adv. Priya Sharma"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
          />
        </div>

        {/* Designation & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Chamber Designation
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Senior Associate Advocate"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
            />
          </div>

          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Contact Phone <span className="font-sans font-normal text-[#111111]/45 dark:text-[#f3eee3]/45">(10 digits)</span>
            </label>
            <input
              type="tel"
              maxLength={15}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98110 20003"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
            Chamber Email <span className="text-[#d9541e]">*</span> <span className="font-sans font-normal text-[#111111]/45 dark:text-[#f3eee3]/45">(Mandatory for Login)</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="associate@chambers.in"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
          />
        </div>

        {/* Password Management */}
        <div className="pt-2 border-t border-[#111111]/10 dark:border-[#f3eee3]/10">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60">
              Chamber Login Password
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSetDefaultPassword}
                className="text-[10.5px] font-mono text-[#d9541e] hover:underline cursor-pointer font-bold"
                title="Reset to standard assoc123"
              >
                Default (assoc123)
              </button>
              <span className="text-[#111111]/30 dark:text-[#f3eee3]/30">·</span>
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="text-[10.5px] font-mono text-[#d9541e] hover:underline cursor-pointer font-bold"
                title="Generate secure memorable password"
              >
                Generate
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-3.5 py-2.5 pr-14 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-mono font-bold tracking-wider text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-cinzel font-bold text-[#111111]/60 dark:text-[#f3eee3]/60 hover:text-[#d9541e] cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyPassword}
              className="px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] hover:border-[#d9541e] hover:text-[#d9541e] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Copy password to clipboard"
            >
              {copiedPass ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[10.5px] font-serif italic text-[#111111]/50 dark:text-[#f3eee3]/50 mt-1.5">
            The associate can use this email and password to access cause lists, draft hearing outcomes, and research chamber briefs.
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-5 bg-[#f3eee3]/10 dark:bg-[#111111] border-t border-[#111111]/15 dark:border-[#f3eee3]/20 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-xs font-cinzel font-semibold rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/60 dark:text-[#f3eee3]/60 hover:bg-[#f3efe6] dark:hover:bg-[#161820] transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-xs font-cinzel font-bold tracking-wider rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] transition-all shadow-md cursor-pointer"
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

function ProvisionAdvocateForm({ onClose, onSubmit }: any) {
  const { addToast } = useChamber();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [barEnrollment, setBarEnrollment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
  };

  // Password criteria check
  const passCriteria = {
    length: password.length >= 8,
    upperLower: /[A-Z]/.test(password) && /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password),
  };

  const isPasswordSafe =
    passCriteria.length &&
    passCriteria.upperLower &&
    passCriteria.number &&
    passCriteria.special;

  const confirmTouched = confirmPassword.length > 0;
  const passwordsMatch = confirmTouched && confirmPassword === password;
  const passwordsMismatch = confirmTouched && confirmPassword !== password;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast("Advocate Full Name is required", "error");
      return;
    }
    if (!email.trim()) {
      addToast("Chamber Email is required", "error");
      return;
    }
    if (!phone.trim()) {
      addToast("Official Mobile / Chamber Phone is required", "error");
      return;
    }
    const cleanDigits = phone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      addToast("Please provide a valid 10-digit mobile / chamber phone number", "error");
      return;
    }
    if (!password) {
      addToast("Password is required", "error");
      return;
    }
    if (!isPasswordSafe) {
      addToast("Password must meet all 4 security criteria (8+ chars, upper/lower, number, special symbol)", "error");
      return;
    }
    if (password !== confirmPassword) {
      addToast("Passwords do not match", "error");
      return;
    }

    const cleanName = name.trim();
    const finalChamberName = `Chambers of ${cleanName.toLowerCase().startsWith("adv") ? cleanName : `Adv. ${cleanName}`}`;

    onSubmit({
      name: cleanName,
      email: email.trim().toLowerCase(),
      password,
      phone: phone.trim(),
      barEnrollment: barEnrollment.trim() || undefined,
      chamberName: finalChamberName,
      primaryCourt: "High Court of Delhi",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-[#f3eee3]/10 dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-between border-b border-[#111111]/15 dark:border-[#f3eee3]/20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#d9541e]/15 text-[#d9541e] dark:text-[#ea6026] border border-[#d9541e]/25">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
                Provision Advocate Account
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#d9541e]/15 text-[#d9541e] dark:text-[#ea6026] border border-[#d9541e]/30">
                Advocate
              </span>
            </div>
            <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5">
              Commission new advocate practice workspace &amp; judicial docket
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl text-[#111111]/50 hover:text-[#111111] dark:text-[#f3eee3]/50 dark:hover:text-white hover:bg-[#111111]/5 dark:hover:bg-[#f3eee3]/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body / Scrollable Form */}
      <div className="p-6 space-y-5 text-xs font-serif overflow-y-auto flex-1">
        {/* Policy Advisory */}
        <div className="p-3.5 rounded-2xl bg-[#d9541e]/5 dark:bg-[#d9541e]/10 border border-[#d9541e]/20 text-[11.5px] text-[#111111]/80 dark:text-[#f3eee3]/80 leading-relaxed flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#d9541e] shrink-0 mt-0.5" />
          <span>
            <strong>Chamber Provisioning Policy:</strong> You are creating a dedicated Advocate Chamber Workspace. All registration fields match public sign-up standards. Associate junior advocates and litigant clients can be added after chamber activation.
          </span>
        </div>

        {/* Section 1: Advocate Identity */}
        <div className="space-y-3.5">
          <h4 className="text-[11px] font-cinzel font-bold uppercase tracking-wider text-[#d9541e] flex items-center gap-2">
            <span>1. Advocate Identity &amp; Bar Credentials</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
                Advocate Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Adv. Debanjan Roy"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e]"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
                Chamber Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adv.roy@chambers.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
                Bar Council Enrollment No.
              </label>
              <input
                type="text"
                value={barEnrollment}
                onChange={(e) => setBarEnrollment(e.target.value)}
                placeholder="e.g. D/1842/2016"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e]"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
                Official Mobile / Chamber Phone *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98110 33001"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Credentials */}
        <div className="space-y-3.5 pt-2 border-t border-[#111111]/10 dark:border-[#f3eee3]/10">
          <h4 className="text-[11px] font-cinzel font-bold uppercase tracking-wider text-[#d9541e] flex items-center gap-2">
            <span>2. Initial Access Password</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 chars with upper, number, symbol"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-mono text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#111111]/40 hover:text-[#111111] dark:text-[#f3eee3]/40 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border bg-white dark:bg-[#202020] text-xs font-mono text-[#111111] dark:text-[#f3eee3] focus:outline-none transition-colors ${
                    passwordsMatch
                      ? "border-emerald-500 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                      : passwordsMismatch
                      ? "border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500"
                      : "border-[#111111]/15 dark:border-[#f3eee3]/20 focus:border-[#d9541e] focus:ring-1 focus:ring-[#d9541e]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#111111]/40 hover:text-[#111111] dark:text-[#f3eee3]/40 dark:hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordsMismatch && (
                <p className="text-[10px] text-rose-500 mt-1">Passwords do not match</p>
              )}
              {passwordsMatch && (
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Passwords match
                </p>
              )}
            </div>
          </div>

          {/* Security Criteria Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className={`p-2 rounded-lg border text-[11px] font-sans flex items-center gap-1.5 ${
              passCriteria.length
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
                : "bg-[#111111]/5 dark:bg-[#f3eee3]/5 border-[#111111]/10 dark:border-[#f3eee3]/10 text-[#111111]/60 dark:text-[#f3eee3]/60"
            }`}>
              <Check className={`w-3.5 h-3.5 ${passCriteria.length ? "text-emerald-600 dark:text-emerald-400" : "opacity-30"}`} />
              <span>8+ Characters</span>
            </div>

            <div className={`p-2 rounded-lg border text-[11px] font-sans flex items-center gap-1.5 ${
              passCriteria.upperLower
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
                : "bg-[#111111]/5 dark:bg-[#f3eee3]/5 border-[#111111]/10 dark:border-[#f3eee3]/10 text-[#111111]/60 dark:text-[#f3eee3]/60"
            }`}>
              <Check className={`w-3.5 h-3.5 ${passCriteria.upperLower ? "text-emerald-600 dark:text-emerald-400" : "opacity-30"}`} />
              <span>Upper &amp; Lower</span>
            </div>

            <div className={`p-2 rounded-lg border text-[11px] font-sans flex items-center gap-1.5 ${
              passCriteria.number
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
                : "bg-[#111111]/5 dark:bg-[#f3eee3]/5 border-[#111111]/10 dark:border-[#f3eee3]/10 text-[#111111]/60 dark:text-[#f3eee3]/60"
            }`}>
              <Check className={`w-3.5 h-3.5 ${passCriteria.number ? "text-emerald-600 dark:text-emerald-400" : "opacity-30"}`} />
              <span>Number (0-9)</span>
            </div>

            <div className={`p-2 rounded-lg border text-[11px] font-sans flex items-center gap-1.5 ${
              passCriteria.special
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
                : "bg-[#111111]/5 dark:bg-[#f3eee3]/5 border-[#111111]/10 dark:border-[#f3eee3]/10 text-[#111111]/60 dark:text-[#f3eee3]/60"
            }`}>
              <Check className={`w-3.5 h-3.5 ${passCriteria.special ? "text-emerald-600 dark:text-emerald-400" : "opacity-30"}`} />
              <span>Special (!@#$)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 sm:p-5 bg-[#f3eee3]/10 dark:bg-[#111111] border-t border-[#111111]/15 dark:border-[#f3eee3]/20 flex items-center justify-between gap-3 shrink-0">
        <div className="text-[11px] text-[#111111]/60 dark:text-[#f3eee3]/60 hidden sm:block">
          Creates advocate account &amp; commissions initial judicial docket
        </div>
        <div className="flex items-center gap-2.5 ml-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-cinzel font-semibold rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/60 dark:text-[#f3eee3]/60 hover:bg-[#f3efe6] dark:hover:bg-[#161820] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || !email.trim() || !isPasswordSafe || !passwordsMatch}
            className="px-5 py-2.5 text-xs font-cinzel font-bold tracking-wider rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Commission &amp; Provision Advocate
          </button>
        </div>
      </div>
    </form>
  );
}

function EditUserAdminForm({ user, lawyers = [], onClose, onSubmit }: any) {
  const [aadhaar, setAadhaar] = useState(formatAadhaar(user?.aadhaarNumber || ""));
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [role, setRole] = useState(user?.role || "lawyer");
  const [designation, setDesignation] = useState(user?.designation || "");
  const [lawyerId, setLawyerId] = useState(user?.lawyerId || "");
  const [disabled, setDisabled] = useState(Boolean(user?.disabled || user?.status === "disabled"));
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleGenerateCode = () => {
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let code = "LD";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(code);
    setShowPassword(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      designation: designation.trim(),
      lawyerId: (role === "associate" || role === "client") ? lawyerId : "",
      disabled,
      status: disabled ? "disabled" : "active",
      ...(role === "client" ? { aadhaarNumber: aadhaar.replace(/\D/g, "") } : {}),
      ...(newPassword.trim() ? { password: newPassword.trim() } : {}),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-h-[85vh] flex flex-col">
      <div className="p-5 sm:p-6 bg-[#f3eee3]/10 dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-between border-b border-[#111111]/15 dark:border-[#f3eee3]/20 shrink-0">
        <div>
          <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#d9541e]" />
            <span>Edit User Profile &amp; Platform Access</span>
          </h3>
          <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5">
            Admin console: manage profile details, credentials &amp; active status
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-[#111111]/60 hover:text-[#111111] dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-4 text-xs font-serif overflow-y-auto flex-1">
        {/* Enable / Disable Account Status Banner */}
        <div className={`p-4 rounded-2xl border transition-colors ${
          disabled
            ? "bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200"
            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Power className={`w-4 h-4 ${disabled ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`} />
              <div>
                <p className="font-cinzel font-bold text-xs">
                  Account Status: {disabled ? "Disabled / Revoked" : "Active & Permitted"}
                </p>
                <p className="text-[11px] font-serif opacity-80 mt-0.5">
                  {disabled
                    ? "Login is revoked. This user cannot authenticate into the platform."
                    : "Account in good standing. Full authorized portal access is granted."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDisabled(!disabled)}
              className={`px-3 py-1.5 rounded-xl font-cinzel font-bold text-[11px] transition-all cursor-pointer shadow-xs ${
                disabled
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-rose-600 hover:bg-rose-700 text-white"
              }`}
            >
              {disabled ? "Activate Account" : "Disable Account"}
            </button>
          </div>
        </div>

        {/* Name & Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Full Legal / Chamber Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3]"
            />
          </div>
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Platform Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3]"
            >
              <option value="lawyer">Lawyer (Advocate / Chamber Head)</option>
              <option value="associate">Associate Advocate (Briefing Counsel)</option>
              <option value="client">Litigant (Client)</option>
              <option value="admin">Site Admin</option>
            </select>
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Contact / Login Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. advocate@chambers.in"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-mono text-[#111111] dark:text-[#f3eee3]"
            />
          </div>
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98110 ..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-mono text-[#111111] dark:text-[#f3eee3]"
            />
          </div>
        </div>

        {/* Aadhaar Number (For clients) */}
        {role === "client" && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-cinzel font-semibold text-[#111111] dark:text-[#f3eee3]">
                Aadhaar Number <span className="text-[#d9541e] font-bold">* (Super Mandatory)</span>
              </label>
              <span className="text-[10px] text-[#d9541e] font-serif italic">
                12-Digit Litigant Unique Key
              </span>
            </div>
            <input
              type="text"
              maxLength={14}
              value={aadhaar}
              onChange={(e) => setAadhaar(formatAadhaar(e.target.value))}
              placeholder="XXXX XXXX XXXX"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d9541e]/50 dark:border-[#d9541e]/60 bg-white dark:bg-[#202020] text-xs font-mono font-bold tracking-widest text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
            />
          </div>
        )}

        {/* Designation */}
        <div>
          <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
            Designation / Bar Council Enrolment Particulars
          </label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="e.g. Advocate (D/1482/2012) · High Court of Delhi"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3]"
          />
        </div>

        {/* Assigned Chamber (For associates & clients) */}
        {(role === "associate" || role === "client") && (
          <div>
            <label className="block text-xs font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1.5">
              Attached Chamber (Supervising Advocate)
            </label>
            <select
              value={lawyerId}
              onChange={(e) => setLawyerId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3]"
            >
              <option value="">No specific chamber attached (General)</option>
              {lawyers.map((l: any) => (
                <option key={l.id} value={l.id}>
                  {l.name} {l.designation ? `(${l.designation})` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Reset Password / Access Code */}
        <div className="p-4 rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-[#f3eee3]/20 dark:bg-white/5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-cinzel font-bold text-xs text-[#111111] dark:text-[#f3eee3]">
              <Key className="w-3.5 h-3.5 text-[#d9541e]" />
              <span>Reset Password / Access Code</span>
            </div>
            <button
              type="button"
              onClick={handleGenerateCode}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-[#d9541e] hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Generate Alphanumeric</span>
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep existing password / code"
              className="w-full px-3.5 py-2.5 pr-20 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] text-xs font-mono text-[#111111] dark:text-[#f3eee3]"
            />
            {newPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#111111]/60 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            )}
          </div>
          <p className="text-[10.5px] font-serif italic text-[#111111]/55 dark:text-[#f3eee3]/55">
            Universal access codes allow associates &amp; clients to log in without complex credentials.
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-5 bg-[#f3eee3]/10 dark:bg-[#111111] border-t border-[#111111]/15 dark:border-[#f3eee3]/20 flex justify-end gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-xs font-cinzel font-semibold rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/60 dark:text-[#f3eee3]/60 hover:bg-[#f3efe6] dark:hover:bg-[#161820] transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 text-xs font-cinzel font-bold tracking-wider rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm transition-all shadow-md cursor-pointer"
        >
          Save User Profile
        </button>
      </div>
    </form>
  );
}

function DeleteChamberConfirmModal({
  lawyer,
  onClose,
  onConfirm,
}: {
  lawyer: any;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const { state } = useChamber();
  const [isDeleting, setIsDeleting] = useState(false);

  const chamberId = lawyer?.id;
  const associates = (state?.users || []).filter((u) => u.role === "associate" && (u.lawyerId || "u-lawyer") === chamberId);
  const clients = (state?.users || []).filter((u) => u.role === "client" && (u.lawyerId || "u-lawyer") === chamberId);
  const cases = (state?.cases || []).filter((c) => (c.lawyerId || "u-lawyer") === chamberId);

  const handlePurge = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
    onClose();
  };

  return (
    <div className="p-6 sm:p-7 space-y-5 text-xs font-serif">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 border border-rose-500/20">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-mono uppercase font-bold bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/25">
            Irreversible Multi-Tenant Purge
          </span>
          <h3 className="text-base font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
            Delete Entire Chamber Workspace
          </h3>
          <p className="text-[11.5px] text-[#111111]/70 dark:text-[#f3eee3]/70 font-serif leading-relaxed">
            You are about to permanently delete the entire practice workspace of{" "}
            <strong className="text-rose-700 dark:text-rose-400 font-sans">{lawyer?.name}</strong>.
          </p>
        </div>
      </div>

      {/* Breakdown Box */}
      <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 space-y-2.5">
        <span className="text-[10px] font-mono uppercase text-rose-800 dark:text-rose-300 font-bold block">
          Entities that will be permanently destroyed:
        </span>
        <ul className="space-y-1.5 text-xs text-rose-900/80 dark:text-rose-300/80 font-sans">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            <span><strong>1</strong> Advocate Account ({lawyer?.name} - {lawyer?.email})</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            <span><strong>{associates.length}</strong> Junior Associate accounts attached to this chamber</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            <span><strong>{clients.length}</strong> Retained Litigant client accounts and portal accesses</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            <span><strong>{cases.length}</strong> Registered Court Matters, pleadings, hearings, and order sheets</span>
          </li>
        </ul>
      </div>

      <div className="p-3 rounded-xl bg-[#111111]/5 dark:bg-white/5 border border-[#111111]/10 dark:border-[#f3eee3]/10 text-[11px] text-[#111111]/60 dark:text-[#f3eee3]/60 italic">
        All associated login credentials will be immediately revoked and purged from the database. This action cannot be reversed.
      </div>

      {/* Buttons */}
      <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#111111]/10 dark:border-[#f3eee3]/10">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="px-4 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs font-cinzel font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handlePurge}
          disabled={isDeleting}
          className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-cinzel font-bold hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
        >
          {isDeleting ? (
            <span>Purging Chamber...</span>
          ) : (
            <>
              <Trash2 className="w-3.5 h-3.5" />
              <span>Confirm &amp; Delete Entire Chamber</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
