"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building,
  User,
  Users,
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
  Trash2,
  Share2,
  ExternalLink,
  UploadCloud,
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

  const [activeTab, setActiveTab] = useState<"hearings" | "orders" | "queries" | "billing" | "parties" | "documents" | "notes">("hearings");
  const isLawyerOrAssociate = currentUser?.role === "lawyer" || currentUser?.role === "associate" || currentUser?.role === "admin";
  const [queryText, setQueryText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingCase, setDeletingCase] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Fee receipt state
  const [showAddReceipt, setShowAddReceipt] = useState(false);
  const [receiptNo, setReceiptNo] = useState("");
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().slice(0, 10));
  const [receiptAmount, setReceiptAmount] = useState("");
  const [receiptMode, setReceiptMode] = useState("Bank Transfer (NEFT/RTGS/IMPS)");
  const [receiptNote, setReceiptNote] = useState("");
  const [savingReceipt, setSavingReceipt] = useState(false);

  // Parties state
  const [showEditParties, setShowEditParties] = useState(false);
  const [partyOpponentName, setPartyOpponentName] = useState("");
  const [partyOpponentLawyer, setPartyOpponentLawyer] = useState("");
  const [partyCounselFor, setPartyCounselFor] = useState("");
  const [savingParties, setSavingParties] = useState(false);

  // Document upload ref & state
  const docInputRef = useRef<HTMLInputElement>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Chamber note state
  const [newNoteText, setNewNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  if (!state || !currentUser) return null;

  const c = state.cases.find((item) => item.id === caseId);

  if (!c) {
    return (
      <div className="p-14 text-center bg-white dark:bg-[#181818] rounded-3xl border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
        <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl overflow-hidden border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] p-1.5 shadow-2xs opacity-75">
          <Image src="/favicon.png" width={48} height={48} alt="LD" className="w-full h-full object-contain" />
        </div>
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
    addToast("Query submitted to chamber legal advocate.", "success");
  };

  // Counsel Reply Handler
  const handleReplySubmit = async (queryId: string) => {
    if (!replyText.trim()) return;
    setSubmittingReply(true);

    if (currentUser.role === "associate") {
      // Submits for Senior Advocate verification and sanction
      await submitApproval({
        id: "a-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        by: currentUser.id,
        byName: currentUser.name,
        ts: new Date().toISOString(),
        type: "replyQuery",
        label: `Associate Counsel Legal Advice for Case ${c.caseNo}`,
        payload: {
          caseId: c.id,
          queryId,
          reply: replyText.trim(),
          replyBy: currentUser.id,
        },
      });
      setReplyingTo(null);
      setReplyText("");
      setSubmittingReply(false);
      return;
    }

    // Senior Advocate / Admin applies directly
    await sendOps([
      {
        type: "replyQuery",
        payload: {
          caseId: c.id,
          queryId,
          reply: replyText.trim(),
          replyBy: currentUser.id,
        },
      },
    ]);
    setReplyingTo(null);
    setReplyText("");
    setSubmittingReply(false);
    addToast("Advocate legal advice recorded and delivered to litigant.", "success");
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

  const handleSharePublicLink = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/share/case/${c.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedShareLink(true);
      addToast("Public judicial docket link copied to clipboard!", "success");
      setTimeout(() => setCopiedShareLink(false), 3000);
    }
  };

  const handleDeleteCase = async () => {
    if (currentUser.role !== "lawyer" && currentUser.role !== "admin") {
      addToast("Only Senior Advocates (Lawyers) have clearance to delete case files", "error");
      return;
    }
    setDeletingCase(true);
    const success = await sendOps([{ type: "deleteCase", payload: { caseId: c.id } }]);
    setDeletingCase(false);
    setShowDeleteConfirm(false);
    if (success) {
      addToast(`Case ${c.caseNo} permanently removed from chamber registry`, "info");
      setActivePage("cases");
    }
  };

  const handleAddFeeReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(receiptAmount);
    if (isNaN(amt) || amt <= 0) {
      addToast("Please enter a valid receipt amount", "error");
      return;
    }
    setSavingReceipt(true);
    const newReceipt = {
      receiptNo: receiptNo.trim() || `REC-${Date.now().toString(36).toUpperCase()}`,
      date: receiptDate || new Date().toISOString().slice(0, 10),
      amount: amt,
      mode: receiptMode,
      note: receiptNote.trim() || "Professional Fee Credit",
    };
    const updatedReceipts = [...(c.feeReceipts || []), newReceipt];
    const newTotalReceived = (c.feeReceived || 0) + amt;

    const success = await sendOps([
      {
        type: "updateCase",
        payload: {
          caseId: c.id,
          fields: {
            feeReceipts: updatedReceipts,
            feeReceived: newTotalReceived,
          },
        },
      },
    ]);
    setSavingReceipt(false);
    if (success) {
      addToast(`Fee receipt of ₹${amt.toLocaleString("en-IN")} recorded on ledger`, "success");
      setShowAddReceipt(false);
      setReceiptAmount("");
      setReceiptNote("");
      setReceiptNo("");
    }
  };

  const handleSaveParties = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingParties(true);
    const success = await sendOps([
      {
        type: "updateCase",
        payload: {
          caseId: c.id,
          fields: {
            opponentName: partyOpponentName.trim(),
            opponentLawyer: partyOpponentLawyer.trim(),
            counselFor: partyCounselFor.trim(),
          },
        },
      },
    ]);
    setSavingParties(false);
    if (success) {
      addToast("Party and counsel representation updated", "success");
      setShowEditParties(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      addToast("File size exceeds 25 MB limit", "error");
      return;
    }

    setUploadingDoc(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const newAtt = {
        id: "att-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        name: file.name,
        size: file.size,
        type: file.type || "application/pdf",
        uploadedAt: new Date().toISOString(),
        dataUrl,
      };
      const updatedAttachments = [...(c.attachments || []), newAtt];
      const success = await sendOps([
        {
          type: "updateCase",
          payload: {
            caseId: c.id,
            fields: { attachments: updatedAttachments },
          },
        },
      ]);
      setUploadingDoc(false);
      if (docInputRef.current) docInputRef.current.value = "";
      if (success) {
        addToast(`Document "${file.name}" uploaded to case dossier`, "success");
      }
    };
    reader.onerror = () => {
      setUploadingDoc(false);
      addToast("Failed to read file", "error");
    };
    reader.readAsDataURL(file);
  };

  const handleAddChamberNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setSavingNote(true);
    const nowStr = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const nowTime = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const noteEntry = `[${nowStr}, ${nowTime} · ${currentUser.name} (${currentUser.role})]:\n${newNoteText.trim()}`;
    const updatedNotes = c.notes ? `${c.notes}\n\n---\n\n${noteEntry}` : noteEntry;

    const success = await sendOps([
      {
        type: "updateCase",
        payload: {
          caseId: c.id,
          fields: { notes: updatedNotes },
        },
      },
    ]);
    setSavingNote(false);
    if (success) {
      addToast(`Chamber note for ${nowStr} recorded on brief`, "success");
      setNewNoteText("");
    }
  };

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
              {((c.caseTypes && c.caseTypes.length > 0)
                ? c.caseTypes
                : c.caseType
                ? c.caseType.split(",").map((s: string) => s.trim()).filter(Boolean)
                : []
              ).map((ct: string) => (
                <span
                  key={ct}
                  className="text-[10px] font-cinzel font-semibold px-2.5 py-0.5 rounded-full bg-[#f3eee3]/50 dark:bg-[#25221f] text-[#d9541e] border border-[#d9541e]/30"
                >
                  {ct}
                </span>
              ))}
              {c.counselFor && (
                <span className="text-[10px] font-cinzel font-semibold px-2.5 py-0.5 rounded-full bg-[#f3eee3]/50 dark:bg-[#25221f] text-[#111111]/70 dark:text-[#f3eee3]/70 border border-[#111111]/15 dark:border-[#f3eee3]/20">
                  Advocate For: {c.counselFor}
                </span>
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
                  <Calendar className="w-4 h-4 text-white" /> + Next Date
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

            {/* Public Docket Share (Restricted to Chamber Advocates & Admins) */}
            {isLawyerOrAssociate && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSharePublicLink}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#202020] text-[#111111] dark:text-[#f3eee3] font-cinzel font-semibold text-xs hover:border-[#d9541e] transition-colors border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs cursor-pointer"
                  title="Copy public link to view case docket without signing in"
                >
                  {copiedShareLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-[#d9541e]" />
                      <span>Public Share</span>
                    </>
                  )}
                </button>
                <a
                  href={`/share/case/${c.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white dark:bg-[#202020] text-[#111111]/70 dark:text-[#f3eee3]/70 hover:text-[#d9541e] border border-[#111111]/15 dark:border-[#f3eee3]/20 flex items-center justify-center shadow-xs transition-colors"
                  title="Open public docket in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Delete Case Option — STRICTLY for Senior Advocates (Lawyer login) */}
            {(currentUser.role === "lawyer" || currentUser.role === "admin") && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-400 font-cinzel font-semibold text-xs transition-colors border border-rose-200 dark:border-rose-900/40 shadow-xs"
                title="Permanently remove case from chamber records (Lawyer only)"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>Delete Case</span>
              </button>
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
          onClick={() => setActiveTab("documents")}
          className={`pb-3 transition-colors ${
            activeTab === "documents"
              ? "text-[#111111] dark:text-[#f3eee3] border-b-2 border-[#111111] dark:border-[#f3eee3]"
              : "text-[#111111]/65 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
          }`}
        >
          Dossier Documents ({(c.attachments || []).length})
        </button>

        {isLawyerOrAssociate && (
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
        )}
      </div>

      {/* 1. Hearings Board */}
      {activeTab === "hearings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic">
              Chronological hearings record and upcoming court listings.
            </p>
            {(currentUser.role === "lawyer" || currentUser.role === "associate") && (
              <button
                onClick={() => openModal("add-hearing", { caseId: c.id })}
                className="text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] hover:underline"
              >
                + Record Next Date
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
                                Upcoming Date
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
                Submit Direct Query to Chamber Legal Advocate
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
                Dispatch Query to Advocate
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
                        Advocate Advice:
                      </span>
                      <p className="text-[#111111]/85 dark:text-[#f3eee3]/85 font-serif leading-relaxed">{q.reply}</p>
                      {q.replyTs && (
                        <span className="text-[10px] text-[#111111]/45 dark:text-[#f3eee3]/45 font-mono block mt-2">
                          Delivered {formatDate(q.replyTs)}
                        </span>
                      )}
                    </div>
                  ) : (() => {
                    const pendingDraft = state.approvals?.find(
                      (a) => a.type === "replyQuery" && a.payload?.queryId === q.id
                    );
                    if (pendingDraft) {
                      return (
                        <div className="mt-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-900 dark:text-amber-200 font-serif">
                          <div className="flex items-center gap-2 font-cinzel font-bold text-[11px] mb-1">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Associate Draft Awaiting Senior Advocate Approval</span>
                          </div>
                          <p className="italic">&ldquo;{pendingDraft.payload?.reply}&rdquo;</p>
                          <p className="text-[10px] text-amber-700/80 dark:text-amber-300/80 mt-1.5">
                            Drafted by {pendingDraft.byName}. Will be dispatched to litigant once sanctioned by Senior Advocate.
                          </p>
                        </div>
                      );
                    }
                    return (
                      (currentUser.role === "lawyer" || currentUser.role === "associate") && (
                        <div className="pt-2">
                          {replyingTo === q.id ? (
                            <div className="space-y-3">
                              <textarea
                                rows={2}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={
                                  currentUser.role === "associate"
                                    ? "Draft legal advice (will be submitted to Senior Advocate for sign-off)..."
                                    : "Type advocate legal advice to client..."
                                }
                                className="w-full p-3.5 rounded-xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs text-[#111111] dark:text-[#f3eee3] font-serif"
                              />
                              <div className="flex gap-2.5">
                                <button
                                  onClick={() => handleReplySubmit(q.id)}
                                  disabled={submittingReply || !replyText.trim()}
                                  className="px-5 py-2 rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs cursor-pointer"
                                >
                                  {submittingReply
                                    ? "Saving..."
                                    : currentUser.role === "associate"
                                    ? "Submit for Senior Advocate Approval"
                                    : "Send Advice to Litigant"}
                                </button>
                                <button
                                  onClick={() => setReplyingTo(null)}
                                  className="px-4 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs font-cinzel font-semibold cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setReplyingTo(q.id)}
                              className="text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] hover:underline cursor-pointer"
                            >
                              {currentUser.role === "associate"
                                ? "Draft Reply for Advocate Approval →"
                                : "Reply as Chamber Advocate →"}
                            </button>
                          )}
                        </div>
                      )
                    );
                  })()}
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
            <div className="p-5 border-b border-[#111111]/15 dark:border-[#f3eee3]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h4 className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3]">
                Payment Receipts &amp; Disbursements
              </h4>
              <div className="flex items-center gap-2">
                {isLawyerOrAssociate && (
                  <button
                    type="button"
                    onClick={() => {
                      setReceiptNo(`REC-${Date.now().toString(36).toUpperCase()}`);
                      setShowAddReceipt(!showAddReceipt);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d9541e] text-white text-xs font-cinzel font-bold hover:bg-[#bf4513] transition-colors shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddReceipt ? "Cancel" : "Add Fee Entry"}</span>
                  </button>
                )}
                <button
                  onClick={() => addToast("Receipt statement exported for client record.", "success")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#202020] text-xs font-cinzel font-semibold hover:bg-[#f3efe6] transition-colors border border-[#111111]/15 dark:border-[#f3eee3]/20 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#111111] dark:text-[#f3eee3]" /> Print Statement
                </button>
              </div>
            </div>

            {/* Inline Add Fee Entry Form (Restricted to Chamber Advocates & Admins) */}
            {isLawyerOrAssociate && showAddReceipt && (
              <form onSubmit={handleAddFeeReceipt} className="p-5 bg-[#f3eee3]/20 dark:bg-[#202020] border-b border-[#111111]/10 dark:border-[#f3eee3]/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-cinzel font-bold text-[#d9541e]">Record New Payment / Fee Receipt</h5>
                  <span className="text-[10px] font-mono text-[#111111]/50 dark:text-[#f3eee3]/50">Direct Ledger Credit</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-serif">
                  <div>
                    <label className="block text-[11px] font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1">Receipt No</label>
                    <input
                      type="text"
                      required
                      value={receiptNo}
                      onChange={(e) => setReceiptNo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] text-xs text-[#111111] dark:text-[#f3eee3] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1">Receipt Date</label>
                    <input
                      type="date"
                      required
                      value={receiptDate}
                      onChange={(e) => setReceiptDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] text-xs text-[#111111] dark:text-[#f3eee3]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1">Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 50000"
                      value={receiptAmount}
                      onChange={(e) => setReceiptAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] text-xs text-[#111111] dark:text-[#f3eee3] font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1">Payment Mode</label>
                    <select
                      value={receiptMode}
                      onChange={(e) => setReceiptMode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] text-xs text-[#111111] dark:text-[#f3eee3]"
                    >
                      <option value="Bank Transfer (NEFT/RTGS/IMPS)">Bank Transfer (NEFT/RTGS/IMPS)</option>
                      <option value="UPI / QR">UPI / QR</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Cash">Cash</option>
                      <option value="Demand Draft">Demand Draft</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1">Disbursement Note / Head of Fee</label>
                  <input
                    type="text"
                    placeholder="e.g. 50% Advance Vakalatnama Retainer, Senior Counsel appearance charge..."
                    value={receiptNote}
                    onChange={(e) => setReceiptNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] text-xs text-[#111111] dark:text-[#f3eee3]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddReceipt(false)}
                    className="px-3.5 py-1.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs font-cinzel hover:bg-[#f3eee3]/40"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingReceipt}
                    className="px-4 py-1.5 rounded-xl bg-[#d9541e] text-white text-xs font-cinzel font-bold hover:bg-[#bf4513] transition-all shadow-sm disabled:opacity-50"
                  >
                    {savingReceipt ? "Saving Entry..." : "Save Receipt to Ledger"}
                  </button>
                </div>
              </form>
            )}

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
                      {/* Receipt slip download commented out for now:
                      <button
                        onClick={() => addToast(`Downloaded receipt slip: ${rec.receiptNo || "Receipt"}`, "info")}
                        className="block text-[11px] font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] hover:underline mt-1"
                      >
                        Receipt Slip →
                      </button>
                      */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Parties & Representation */}
      {activeTab === "parties" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 space-y-4 shadow-xs">
            <h3 className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#111111] dark:text-[#f3eee3]">
              Client on Record (Vakalatnama)
            </h3>
            {client ? (
              <div className="space-y-1.5 font-serif">
                <p className="text-base font-bold text-[#111111] dark:text-[#f3eee3] font-sans">{client.name}</p>
                <p className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 italic">{client.designation || "Litigant Client"}</p>
                <p className="text-xs font-mono text-[#111111]/65 dark:text-[#f3eee3]/60 pt-1">{client.email || "No email on record"}</p>
                {client.phone && <p className="text-xs font-mono text-[#111111]/65 dark:text-[#f3eee3]/60">{client.phone}</p>}
              </div>
            ) : (
              <p className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic">No client mapped.</p>
            )}

            <div className="pt-4 border-t border-[#111111]/15 dark:border-[#f3eee3]/20">
              <span className="text-[10px] uppercase font-cinzel tracking-wider text-[#111111]/65 dark:text-[#f3eee3]/60 block">
                Chamber Representation
              </span>
              <p className="text-xs font-bold text-[#111111] dark:text-[#f3eee3] mt-1">
                {c.counselFor ? `Advocate for ${c.counselFor}` : "Advocate on Record"}
              </p>
              {leadCounsel && (
                <p className="text-[11px] font-serif italic text-[#111111]/65 dark:text-[#f3eee3]/60">
                  {leadCounsel.name} ({leadCounsel.designation})
                </p>
              )}
            </div>
          </div>

          {/* Opposing Parties & Counsel */}
          <div className="p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#111111] dark:text-[#f3eee3]">
                Parties to Suit &amp; Opposing Counsel
              </h3>
              {isLawyerOrAssociate && (
                <button
                  type="button"
                  onClick={() => {
                    setPartyOpponentName(c.opponentName || "");
                    setPartyOpponentLawyer(c.opponentLawyer || "");
                    setPartyCounselFor(c.counselFor || "");
                    setShowEditParties(!showEditParties);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[11px] font-cinzel font-bold hover:border-[#d9541e] text-[#d9541e] transition-colors cursor-pointer"
                >
                  <Edit className="w-3 h-3" />
                  <span>{showEditParties ? "Cancel" : "Add / Edit Parties"}</span>
                </button>
              )}
            </div>

            {isLawyerOrAssociate && showEditParties ? (
              <form onSubmit={handleSaveParties} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1">
                    Opposing Party / Accused / Respondent
                  </label>
                  <input
                    type="text"
                    value={partyOpponentName}
                    onChange={(e) => setPartyOpponentName(e.target.value)}
                    placeholder="e.g. State of NCT of Delhi or Anand Mohan"
                    className="w-full px-3 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1">
                    Opposing Counsel / Advocate on Record
                  </label>
                  <input
                    type="text"
                    value={partyOpponentLawyer}
                    onChange={(e) => setPartyOpponentLawyer(e.target.value)}
                    placeholder="e.g. Adv. R.K. Jain or Standing Counsel"
                    className="w-full px-3 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-cinzel font-semibold text-[#555866] dark:text-[#f3eee3]/60 mb-1">
                    Chamber Represents (Advocate For)
                  </label>
                  <input
                    type="text"
                    value={partyCounselFor}
                    onChange={(e) => setPartyCounselFor(e.target.value)}
                    placeholder="e.g. Petitioner / Plaintiff / Defendant No. 1"
                    className="w-full px-3 py-2 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs text-[#111111] dark:text-[#f3eee3]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditParties(false)}
                    className="px-3 py-1.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs font-cinzel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingParties}
                    className="px-4 py-1.5 rounded-xl bg-[#d9541e] text-white text-xs font-cinzel font-bold hover:bg-[#bf4513] transition-all shadow-sm"
                  >
                    {savingParties ? "Saving..." : "Save Parties"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 font-serif text-xs">
                <div className="p-3.5 rounded-2xl bg-[#f3eee3]/20 dark:bg-white/5 border border-[#111111]/10 dark:border-[#f3eee3]/10 space-y-1">
                  <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider text-[#111111]/60 dark:text-[#f3eee3]/60">
                    Opposing Party (Respondent / Defendant)
                  </span>
                  <p className="font-bold text-[#111111] dark:text-[#f3eee3] text-sm">
                    {c.opponentName || "No opposing party recorded."}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f3eee3]/20 dark:bg-white/5 border border-[#111111]/10 dark:border-[#f3eee3]/10 space-y-1">
                  <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider text-[#111111]/60 dark:text-[#f3eee3]/60">
                    Opposing Counsel / Special Public Prosecutor
                  </span>
                  <p className="font-semibold text-[#111111] dark:text-[#f3eee3]">
                    {c.opponentLawyer || "No opposing counsel recorded."}
                  </p>
                </div>
              </div>
            )}

            {/* Associate allocation per case commented out per user instruction:
            {assignedAssociates.length > 0 && (
              <div className="pt-3 border-t border-[#111111]/15 dark:border-[#f3eee3]/20">
                <h4 className="text-[10px] font-cinzel font-bold uppercase">Assigned Chamber Associates</h4>
                {assignedAssociates.map((a: any) => (
                  <p key={a.id}>{a.name}</p>
                ))}
              </div>
            )}
            */}
          </div>
        </div>
      )}

      {/* 6. Dossier Documents / Attachments */}
      {activeTab === "documents" && (
        <div className="p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
            <div>
              <h3 className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#111111] dark:text-[#f3eee3]">
                Pleadings &amp; Judicial Attachments
              </h3>
              <p className="text-[11px] font-serif italic text-[#111111]/55 dark:text-[#f3eee3]/55">
                Cloud-persisted case dossier files, Vakalatnama, petitions &amp; orders
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold text-[#111111]/60 dark:text-[#f3eee3]/60">
                {(c.attachments || []).length} File(s)
              </span>
              {isLawyerOrAssociate && (
                <>
                  <input
                    type="file"
                    ref={docInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  />
                  <button
                    type="button"
                    disabled={uploadingDoc}
                    onClick={() => docInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#d9541e] hover:bg-[#bf4513] text-white text-xs font-cinzel font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{uploadingDoc ? "Uploading..." : "+ Add New Document"}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {(c.attachments || []).length === 0 ? (
            <div className="p-8 text-center text-xs font-serif text-[#111111]/65 dark:text-[#f3eee3]/60 italic bg-[#f3eee3]/10 dark:bg-white/2 rounded-2xl border border-dashed border-[#111111]/15 dark:border-[#f3eee3]/15">
              {isLawyerOrAssociate
                ? 'No electronic attachments filed with this docket yet. Click "+ Add New Document" above to attach petitions, vakalatnamas, or trial evidence.'
                : "No electronic court documents or certified copies attached to this brief by chamber counsel yet."}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {c.attachments?.map((file) => (
                <div
                  key={file.id}
                  className="p-3.5 rounded-2xl border border-[#111111]/10 dark:border-[#f3eee3]/15 bg-[#f3eee3]/20 dark:bg-[#202020] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#d9541e]/15 text-[#d9541e] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-serif font-bold text-[#111111] dark:text-[#f3eee3] truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] font-mono text-[#111111]/50 dark:text-[#f3eee3]/50">
                        {(file.size / 1024).toFixed(1)} KB · {formatDate(file.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  {file.dataUrl ? (
                    <a
                      href={file.dataUrl}
                      download={file.name}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#d9541e] text-white text-[10.5px] font-cinzel font-bold hover:bg-[#bf4513] transition-colors shrink-0 cursor-pointer shadow-2xs"
                      title="Download file from cloud database"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                  ) : (
                    <span className="text-[10px] font-cinzel text-[#111111]/50 dark:text-[#f3eee3]/50">
                      On Record
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. Chamber Notes Timeline (Privileged & Confidential — Strictly Advocate & Associate Access) */}
      {activeTab === "notes" && isLawyerOrAssociate && (
        <div className="p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
            <div>
              <h3 className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#111111] dark:text-[#f3eee3]">
                Confidential Chamber Notes &amp; Safe Custody
              </h3>
              <p className="text-[11px] font-serif italic text-[#111111]/55 dark:text-[#f3eee3]/55">
                Privileged work product, trial preparation memos &amp; chronological legal observations
              </p>
            </div>
            <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider text-[#d9541e]">
              Privileged &amp; Confidential
            </span>
          </div>

          {/* New Dated Note Entry Form */}
          <form onSubmit={handleAddChamberNote} className="p-4 rounded-2xl bg-[#f3eee3]/20 dark:bg-white/5 border border-[#111111]/10 dark:border-[#f3eee3]/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
                Add Dated Chamber Note
              </span>
              <span className="text-[10px] font-mono text-[#d9541e] font-semibold">
                Today: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <textarea
              rows={3}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Record conference minutes, strategy discussion, witness notes, or hearing debrief for today..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#202020] text-xs font-serif text-[#111111] dark:text-[#f3eee3] placeholder:italic placeholder:text-[#111111]/40 focus:outline-none focus:ring-1 focus:ring-[#d9541e]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingNote || !newNoteText.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d9541e] hover:bg-[#bf4513] text-white text-xs font-cinzel font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{savingNote ? "Recording Note..." : "+ Add Dated Note"}</span>
              </button>
            </div>
          </form>

          {/* Historical Dated Notes Timeline */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-cinzel font-bold uppercase tracking-wider text-[#111111]/70 dark:text-[#f3eee3]/70">
              Chronological Notes History
            </h4>

            {!c.notes || c.notes.trim().length === 0 ? (
              <div className="p-6 text-center text-xs font-serif text-[#111111]/60 dark:text-[#f3eee3]/60 italic bg-[#f3eee3]/10 dark:bg-white/2 rounded-2xl border border-dashed border-[#111111]/15 dark:border-[#f3eee3]/15">
                No chamber notes recorded on this brief yet. Add your first dated note above.
              </div>
            ) : (
              <div className="space-y-3">
                {c.notes
                  .split(/\n\s*---\s*\n/)
                  .map((entry) => entry.trim())
                  .filter(Boolean)
                  .map((entry, idx) => {
                    // Try parsing header [Date, Time · Author]: content
                    const match = entry.match(/^\[(.*?)\]:\s*\n?([\s\S]*)$/);
                    const header = match ? match[1] : null;
                    const body = match ? match[2] : entry;

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-[#111111]/10 dark:border-[#f3eee3]/15 bg-white dark:bg-[#202020] space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-[#111111]/8 dark:border-[#f3eee3]/8">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-cinzel font-bold text-[#d9541e]">
                            <Clock className="w-3.5 h-3.5" />
                            {header || `Dated Entry #${idx + 1}`}
                          </span>
                          <span className="text-[10px] font-mono text-[#111111]/45 dark:text-[#f3eee3]/45">
                            Note ID #{idx + 1}
                          </span>
                        </div>
                        <p className="text-xs text-[#111111]/85 dark:text-[#f3eee3]/85 leading-relaxed font-serif whitespace-pre-wrap">
                          {body}
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Senior Advocate Delete Case Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#181818] rounded-3xl border border-[#111111]/20 dark:border-[#f3eee3]/20 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-cinzel font-bold text-base text-[#111111] dark:text-[#f3eee3]">
                  Delete Case Record?
                </h3>
                <p className="text-[11px] font-mono text-[#111111]/60 dark:text-[#f3eee3]/60">
                  {c.caseNo}
                </p>
              </div>
            </div>

            <p className="text-xs font-serif text-[#111111]/80 dark:text-[#f3eee3]/80 leading-relaxed">
              Are you sure you want to permanently delete <strong>{c.title}</strong> from the chamber database? All associated hearings, orders, and docket notes will be permanently erased.
            </p>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-serif text-amber-900 dark:text-amber-300">
              <strong>Advocate Clearance:</strong> This action is strictly restricted to Senior Advocates (Lawyers) and cannot be reversed.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-xs font-cinzel font-semibold rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 hover:bg-[#f3eee3]/30 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingCase}
                onClick={handleDeleteCase}
                className="px-5 py-2 text-xs font-cinzel font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-md disabled:opacity-50"
              >
                {deletingCase ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
