"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Scale,
  Building,
  Calendar,
  FileText,
  Gavel,
  Clock,
  Printer,
  Copy,
  Check,
  Shield,
  ArrowLeft,
  Share2,
  ExternalLink,
} from "lucide-react";
import { AnimatedThemeToggle } from "@/components/ui/animated-theme-toggle";

export default function PublicCaseDocketPage() {
  const params = useParams();
  const caseId = (params?.id as string) || "";

  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!caseId) return;
    setLoading(true);
    fetch(`/api/public/case/${caseId}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Case docket not found or private");
        }
        return res.json();
      })
      .then((data) => {
        setCaseData(data.case);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load judicial docket");
        setLoading(false);
      });
  }, [caseId]);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    try {
      const d = new Date(iso + "T00:00:00");
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const statusColor: Record<string, string> = {
    Active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    Disposed: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    Stayed: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    Quashed: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    "Adjourned S.D.": "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-[#0d0d0d] flex items-center justify-center p-6 text-[#111111] dark:text-[#f3eee3]">
        <div className="text-center space-y-4">
          <Scale className="w-10 h-10 mx-auto text-[#d9541e] animate-pulse" />
          <h2 className="text-base font-cinzel font-bold">Retrieving Judicial Docket...</h2>
          <p className="text-xs font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">
            Connecting to chamber registry & verified court records
          </p>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-[#0d0d0d] flex items-center justify-center p-6 text-[#111111] dark:text-[#f3eee3]">
        <div className="max-w-md w-full bg-white dark:bg-[#181818] rounded-3xl p-8 border border-[#111111]/15 dark:border-[#f3eee3]/20 text-center space-y-4 shadow-lg">
          <Scale className="w-12 h-12 mx-auto text-rose-500" />
          <h2 className="text-lg font-cinzel font-bold">Judicial Record Unavailable</h2>
          <p className="text-xs font-serif text-[#111111]/70 dark:text-[#f3eee3]/70">
            {error || "The requested case docket could not be retrieved from the registry."}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#d9541e] text-white hover:bg-[#bf4513] text-xs font-cinzel font-bold transition-all shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to LexDaily</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const c = caseData;
  const types = (c.caseTypes && c.caseTypes.length > 0)
    ? c.caseTypes
    : c.caseType
    ? [c.caseType]
    : [];

  const allHearings = [...(c.hearings || [])].sort(
    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const todayStr = new Date().toISOString().slice(0, 10);
  const nextHearing = allHearings.find((h: any) => h.date >= todayStr);

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#0c0c0c] text-[#111111] dark:text-[#f3eee3] font-sans antialiased selection:bg-[#d9541e]/20">
      {/* Top Banner & Header */}
      <header className="sticky top-0 z-30 bg-[#faf8f5]/90 dark:bg-[#0c0c0c]/90 backdrop-blur-md border-b border-[#111111]/10 dark:border-[#f3eee3]/10 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] flex items-center justify-center shadow-sm p-0.5">
              <Image src="/favicon.png" width={32} height={32} alt="LexDaily Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-cinzel font-bold text-sm tracking-wider text-[#111111] dark:text-[#f3eee3]">
                LEXDAILY
              </span>
              <span className="block text-[9.5px] font-mono tracking-widest text-[#d9541e] uppercase">
                Judicial Docket Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] text-xs font-cinzel font-semibold hover:border-[#d9541e] transition-all shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#d9541e]" />
                  <span>Share Docket</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#111111] text-white dark:bg-[#f3eee3] dark:text-[#111111] text-xs font-cinzel font-semibold hover:opacity-90 transition-all shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Verification Certificate Ribbon */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 flex items-center justify-between text-xs font-serif">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span>
              <strong>Verified Chamber Record:</strong> This judicial docket is published for litigants, counsel, and authorized parties. Synchronized with official registry filings.
            </span>
          </div>
          <span className="font-mono text-[11px] hidden sm:inline text-amber-800 dark:text-amber-400">
            AUTHENTICATED DOCKET
          </span>
        </div>

        {/* Case Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161616] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-sm font-bold tracking-wider px-3 py-1 rounded-xl bg-[#111111]/5 dark:bg-white/5 border border-[#111111]/15 dark:border-[#f3eee3]/20">
              {c.caseNo}
            </span>
            {c.cnr && (
              <span className="font-mono text-xs text-[#111111]/70 dark:text-[#f3eee3]/70 px-2.5 py-1 rounded-xl bg-[#111111]/5 dark:bg-white/5 border border-[#111111]/10 dark:border-[#f3eee3]/10">
                CNR: {c.cnr}
              </span>
            )}
            <span
              className={`text-xs font-cinzel font-bold px-3 py-1 rounded-full border ${
                statusColor[c.status] || "bg-slate-100 border-slate-300"
              }`}
            >
              {c.status.toUpperCase()}
            </span>
            {types.map((t: string) => (
              <span
                key={t}
                className="text-[11px] font-cinzel font-semibold px-2.5 py-0.5 rounded-full bg-[#f3eee3]/40 dark:bg-[#201d1a] text-[#d9541e] border border-[#d9541e]/30"
              >
                {t}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] leading-snug">
            {c.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-[#111111]/10 dark:border-[#f3eee3]/10 text-xs font-serif">
            <div>
              <p className="font-cinzel text-[10px] uppercase tracking-wider text-[#111111]/50 dark:text-[#f3eee3]/50 font-bold mb-1">
                Forum / Court
              </p>
              <p className="font-semibold flex items-center gap-1.5 text-[#111111] dark:text-[#f3eee3]">
                <Building className="w-3.5 h-3.5 text-[#d9541e]" />
                {c.court} {c.courtRoom && <span className="font-mono font-bold">({c.courtRoom})</span>}
              </p>
            </div>

            <div>
              <p className="font-cinzel text-[10px] uppercase tracking-wider text-[#111111]/50 dark:text-[#f3eee3]/50 font-bold mb-1">
                Judicial Bench
              </p>
              <p className="font-semibold flex items-center gap-1.5 text-[#111111] dark:text-[#f3eee3]">
                <Gavel className="w-3.5 h-3.5 text-[#d9541e]" />
                {c.judge || "Bench not allocated"}
              </p>
            </div>

            <div>
              <p className="font-cinzel text-[10px] uppercase tracking-wider text-[#111111]/50 dark:text-[#f3eee3]/50 font-bold mb-1">
                Active Stage
              </p>
              <p className="font-semibold text-[#111111] dark:text-[#f3eee3]">
                {c.stage}
              </p>
            </div>

            {c.counselFor && (
              <div>
                <p className="font-cinzel text-[10px] uppercase tracking-wider text-[#111111]/50 dark:text-[#f3eee3]/50 font-bold mb-1">
                  Representation
                </p>
                <p className="font-semibold text-[#111111] dark:text-[#f3eee3]">
                  Advocate for {c.counselFor}
                </p>
              </div>
            )}

            {c.filingDate && (
              <div>
                <p className="font-cinzel text-[10px] uppercase tracking-wider text-[#111111]/50 dark:text-[#f3eee3]/50 font-bold mb-1">
                  Filing Date
                </p>
                <p className="font-semibold text-[#111111] dark:text-[#f3eee3]">
                  {formatDate(c.filingDate)}
                </p>
              </div>
            )}

            {c.itemNo && (
              <div>
                <p className="font-cinzel text-[10px] uppercase tracking-wider text-[#111111]/50 dark:text-[#f3eee3]/50 font-bold mb-1">
                  Cause List Item No.
                </p>
                <p className="font-semibold font-mono text-[#111111] dark:text-[#f3eee3]">
                  Item #{c.itemNo}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Next Scheduled Listing (if upcoming) */}
        {nextHearing && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#d9541e]/10 to-amber-500/10 border border-[#d9541e]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider text-[#d9541e]">
                Next Scheduled Listing
              </span>
              <h3 className="text-lg font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
                {formatDate(nextHearing.date)}
              </h3>
              <p className="text-xs font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/70">
                Purpose: <strong>{nextHearing.purpose}</strong>
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d9541e] text-white text-xs font-cinzel font-bold tracking-wide shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>Upcoming Hearing</span>
              </span>
            </div>
          </div>
        )}

        {/* Hearings Timeline */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161616] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#111111]/10 dark:border-[#f3eee3]/10 pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#d9541e]" />
              <h2 className="text-base font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
                Chronological Hearing Schedule
              </h2>
            </div>
            <span className="text-xs font-mono text-[#111111]/60 dark:text-[#f3eee3]/60">
              {allHearings.length} {allHearings.length === 1 ? "Listing" : "Listings"} on Record
            </span>
          </div>

          {allHearings.length === 0 ? (
            <p className="text-xs font-serif italic text-[#111111]/50 dark:text-[#f3eee3]/50 text-center py-6">
              No hearing dates recorded yet in this matter.
            </p>
          ) : (
            <div className="space-y-4">
              {allHearings.map((h: any, idx: number) => {
                const isPast = h.date < todayStr;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#111111]/5 dark:bg-white/5 border border-[#111111]/10 dark:border-[#f3eee3]/10 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#111111] dark:text-[#f3eee3] text-sm">
                          {formatDate(h.date)}
                        </span>
                        <span
                          className={`text-[9.5px] font-cinzel font-semibold px-2 py-0.5 rounded-full ${
                            isPast
                              ? "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                              : "bg-[#d9541e]/15 text-[#d9541e]"
                          }`}
                        >
                          {isPast ? "Concluded" : "Scheduled"}
                        </span>
                      </div>
                      <p className="font-serif font-medium text-[#111111] dark:text-[#f3eee3]">
                        Listing Purpose: <strong>{h.purpose}</strong>
                      </p>
                      {h.outcome && (
                        <p className="text-xs font-serif italic text-[#111111]/80 dark:text-[#f3eee3]/80 pt-1">
                          Daily Business / Bench Direction: &ldquo;{h.outcome}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Certified Judicial Orders */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161616] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#111111]/10 dark:border-[#f3eee3]/10 pb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#d9541e]" />
              <h2 className="text-base font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
                Certified Judicial Orders &amp; Decrees
              </h2>
            </div>
            <span className="text-xs font-mono text-[#111111]/60 dark:text-[#f3eee3]/60">
              {(c.orders || []).length} Recorded
            </span>
          </div>

          {(c.orders || []).length === 0 ? (
            <p className="text-xs font-serif italic text-[#111111]/50 dark:text-[#f3eee3]/50 text-center py-6">
              No orders entered for this matter yet.
            </p>
          ) : (
            <div className="space-y-4">
              {c.orders.map((o: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#111111]/5 dark:bg-white/5 border border-[#111111]/10 dark:border-[#f3eee3]/10 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-cinzel font-bold text-sm text-[#111111] dark:text-[#f3eee3]">
                      {o.title}
                    </h3>
                    <span className="font-mono text-xs text-[#111111]/60 dark:text-[#f3eee3]/60">
                      {formatDate(o.date)}
                    </span>
                  </div>
                  {o.citation && (
                    <p className="font-mono text-[11px] text-[#d9541e] font-semibold">
                      Citation: {o.citation}
                    </p>
                  )}
                  <p className="font-serif text-[#111111]/80 dark:text-[#f3eee3]/80 whitespace-pre-wrap leading-relaxed pt-1">
                    {o.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="pt-8 pb-12 text-center text-xs font-serif text-[#111111]/50 dark:text-[#f3eee3]/40 border-t border-[#111111]/10 dark:border-[#f3eee3]/10 space-y-3">
          <div className="flex items-center justify-center gap-2.5 print:hidden">
            <span className="font-cinzel text-[11px] font-medium text-[#111111]/55 dark:text-[#f3eee3]/55">
              Docket Illumination:
            </span>
            <AnimatedThemeToggle
              showLabel
              className="h-8 text-xs border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white/60 dark:bg-[#161616]/60 shadow-2xs"
            />
          </div>

          <p>
            Published via <strong>LexDaily</strong> — Sovereign Chamber Diary &amp; Practice Automation System.
          </p>
          <p className="font-mono text-[10px]">
            Record ID: {c.id} · Authenticated Courtroom Record
          </p>
        </footer>
      </main>

      {/* Sober Floating Theme Switcher (Docked at Bottom Right, Hidden on Print) */}
      <aside
        aria-label="Display theme switcher"
        className="fixed bottom-6 right-6 z-40 print:hidden"
      >
        <div className="flex items-center gap-2 pl-3.5 pr-1.5 py-1.5 rounded-full border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-[#faf8f5]/90 dark:bg-[#161616]/90 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/40 hover:border-[#d9541e]/50 transition-all">
          <span className="text-[10px] font-cinzel font-bold tracking-widest text-[#111111]/60 dark:text-[#f3eee3]/60 uppercase select-none">
            Reading Mode
          </span>
          <AnimatedThemeToggle
            showLabel={false}
            className="size-8 border-0 bg-transparent shadow-none hover:bg-black/5 dark:hover:bg-white/10"
          />
        </div>
      </aside>
    </div>
  );
}
