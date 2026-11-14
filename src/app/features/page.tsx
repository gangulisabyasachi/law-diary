"use client";

import React from "react";
import Link from "next/link";
import { PublicLayout } from "@/components/public/PublicLayout";
import {
  Calendar,
  Scale,
  ShieldCheck,
  Clock,
  FileText,
  Users,
  CheckCircle2,
  ArrowRight,
  Gavel,
  Building,
  DollarSign,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export default function FeaturesPage() {
  const { currentUser, setAuthModal } = useChamber();
  const dashboardHref = currentUser?.role === "admin" ? "/admin" : "/dashboard";

  const coreFeatures = [
    {
      icon: Calendar,
      title: "Daily Cause List Synchronization",
      tagline: "Never miss a court call, item number, or bench listing.",
      description:
        "Automatically aggregates daily courtroom listings across High Courts, District Courts, and Tribunals. View calling orders, item numbers, court rooms, and presiding benches filtered for Today, Tomorrow, or entire statutory terms.",
      bullets: [
        "1-Click Printable Cause List for court bags and briefing folders",
        "Filtered court views: Delhi High Court, Tis Hazari, NCLT Principal Bench",
        "Chronological listing boards with Next Date of Hearing (NDOH) radar",
      ],
    },
    {
      icon: Scale,
      title: "16-Character National CNR Tracking",
      tagline: "Unified case identification across all Indian forums.",
      description:
        "Full support for Case Natural Records (e.g. DLHC01-008129-2024). Easily track matters as they move from lower courts through High Court appeals and Supreme Court Special Leave Petitions (SLPs).",
      bullets: [
        "Instant clipboard copy and lookup with zero formatting friction",
        "Complete historical record of orders, hearings, and bench changes",
        "Direct association with Vakalatnamas, arguing counsels, and briefing associates",
      ],
    },
    {
      icon: Clock,
      title: "Limitation Act 1963 Statutory Radar",
      tagline: "Proactive statutory alert desk for appeals, reviews, and revisions.",
      description:
        "Statutory limitation periods under the Limitation Act 1963 are computed automatically from certified order dates. Proactively flags upcoming filing deadlines (30-day High Court appeals, 90-day Supreme Court SLPs, 30-day review petitions) before rights are extinguished.",
      bullets: [
        "Categorized urgency levels: Active, Critical Window, and Condonation Required",
        "Detailed statutory computation based on Section 5 condonation rules",
        "Automatic notifications delivered directly to the Senior Advocate desk",
      ],
    },
    {
      icon: FileCheck,
      title: "Senior Counsel Verification Desk",
      tagline: "Two-man rule for junior associate drafting and court submissions.",
      description:
        "Junior and briefing associates can prepare hearing notes, draft order summaries, and propose next dates. Every entry is placed on the Senior Advocate's verification desk for sign-off and approval before it alters the official chamber docket.",
      bullets: [
        "Prevents unvetted court notes or inaccurate business records from entering the master register",
        "Real-time pending queue with 1-click 'Sanction & Commit' or 'Reject Draft'",
        "Complete audit trail showing which associate drafted and which counsel signed off",
      ],
    },
    {
      icon: FileText,
      title: "Certified Judicial Orders & Interlocutory Record",
      tagline: "Organized judicial rulings with neutral citation indexing.",
      description:
        "Maintain clean, verified order sheets, interlocutory directions, and certified judgments mapped to each individual case dossier. Includes citation tags for neutral citations, DHC citations, and SCC references.",
      bullets: [
        "Searchable operative directions and verbatim rulings per docket",
        "Clean chronological timeline of orders from filing to final judgment",
        "Exportable order registers for client records and court submissions",
      ],
    },
    {
      icon: DollarSign,
      title: "Chamber Accounting & Client Fee Receipts",
      tagline: "Transparent retainer management, fee disbursements, and formal slips.",
      description:
        "Track appearance fees, conference charges, and drafting disbursements per matter. Generate formal payment receipt slips for corporate litigants and individual petitioners with proper GST and professional disclosure.",
      bullets: [
        "Payment mode records: NEFT, RTGS, Cheque, and Bank Transfer",
        "Exportable client fee statements and balance ledgers",
        "Discreet, dignified client portal view for transparent updates",
      ],
    },
  ];

  const protocolSteps = [
    {
      step: "01",
      title: "Advocate Sign Up",
      description: "Provide your Bar Council enrolment number and initialize your encrypted chamber workspace in under 60 seconds.",
    },
    {
      step: "02",
      title: "Docket Enrollment",
      description: "Log active matters with 16-character CNR, case title, presiding bench, court room, and client Vakalatnama.",
    },
    {
      step: "03",
      title: "Daily Listing & Hearing Board",
      description: "Review your Daily Cause List every morning, check calling order, and record hearing outcomes and next dates (NDOH).",
    },
    {
      step: "04",
      title: "Senior Verification & Custody",
      description: "Senior Counsel sanctions junior drafts, certified orders are committed to safe custody, and dockets remain spotless.",
    },
  ];

  return (
    <PublicLayout>
      {/* Header Banner */}
      <section className="py-20 md:py-28 border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#3df2e0]/20 to-transparent dark:from-[#3df2e0]/10 dark:via-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-cinzel font-bold tracking-widest bg-white dark:bg-[#0f151c] text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 shadow-xs">
            <span>CHAMBER OPERATING SYSTEM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0] tracking-tight leading-[1.2]">
            Engineered for Modern Litigation, Crafted with Classical Dignity.
          </h1>

          <p className="text-base sm:text-lg text-[#0b0f14]/75 dark:text-[#3df2e0]/70 font-serif italic max-w-2xl mx-auto leading-relaxed">
            Every feature in Updated Law Diary is purpose-built to address the demanding daily realities of practicing advocates, arguing seniors, and courtroom clerks.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {currentUser ? (
              <Link
                href={dashboardHref}
                className="px-7 py-3 rounded-2xl bg-[#1b1d3a] text-[#e8d5b5] hover:bg-[#25284e] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] dark:hover:bg-[#dfc8a2] font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={() => setAuthModal("signup")}
                className="px-7 py-3 rounded-2xl bg-[#1b1d3a] text-[#e8d5b5] hover:bg-[#25284e] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] dark:hover:bg-[#dfc8a2] font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Sign Up (Lawyers Only)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-2xl bg-white dark:bg-[#0f151c] text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 font-cinzel font-semibold text-xs tracking-wider hover:bg-white/80 dark:hover:bg-[#141d27] transition-all shadow-xs"
            >
              View Chamber Retainer Tiers
            </Link>
          </div>
        </div>
      </section>

      {/* Main 6 Features Grid */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-5 sm:px-8 border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#0b0f14] dark:text-[#3df2e0]">
            PRACTICE PILLARS
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">
            Six Pillars of High Court &amp; Tribunal Management
          </h2>
          <p className="text-sm font-serif italic text-[#0b0f14]/70 dark:text-[#3df2e0]/60">
            A comprehensive overview of our sovereign courtroom management capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {coreFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 shadow-xs hover:border-[#0b0f14] dark:hover:border-[#3df2e0]/50 transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#0b0f14] dark:bg-[#3df2e0]/15 text-[#3df2e0] flex items-center justify-center shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">
                      {feat.title}
                    </h3>
                    <p className="text-xs font-serif italic text-[#0b0f14]/75 dark:text-[#3df2e0]/70 mt-1">
                      {feat.tagline}
                    </p>
                  </div>
                  <p className="text-xs font-serif leading-relaxed text-[#0b0f14]/80 dark:text-[#3df2e0]/80">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#0b0f14]/10 dark:border-[#3df2e0]/15 space-y-2">
                  {feat.bullets.map((bullet, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-serif text-[#0b0f14]/80 dark:text-[#3df2e0]/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0b0f14] dark:text-[#3df2e0] flex-shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4-Step Chamber Operating Protocol */}
      <section className="py-20 md:py-28 bg-white/60 dark:bg-[#080c10] border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#0b0f14] dark:text-[#3df2e0]">
              WORKFLOW INTEGRATION
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">
              The Four-Step Chamber Protocol
            </h2>
            <p className="text-sm font-serif italic text-[#0b0f14]/70 dark:text-[#3df2e0]/60">
              How distinguished counsels transition from disorganized paper registers to a sovereign digital chamber.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {protocolSteps.map((step, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 space-y-3 relative group hover:border-[#0b0f14] dark:hover:border-[#3df2e0]/40 transition-all shadow-xs"
              >
                <span className="w-9 h-9 rounded-xl bg-[#0b0f14] text-[#3df2e0] flex items-center justify-center font-mono font-bold text-xs">
                  {step.step}
                </span>
                <h4 className="text-base font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">
                  {step.title}
                </h4>
                <p className="text-xs font-serif leading-relaxed text-[#0b0f14]/75 dark:text-[#3df2e0]/70">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">
                Ready to modernize your chamber records?
              </h3>
              <p className="text-xs font-serif text-[#0b0f14]/70 dark:text-[#3df2e0]/60">
                Commission your chamber workspace in under two minutes with your Bar Council enrolment.
              </p>
            </div>
            <button
              onClick={() => setAuthModal("signup")}
              className="px-6 py-3 rounded-2xl bg-[#1b1d3a] text-[#e8d5b5] hover:bg-[#25284e] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] dark:hover:bg-[#dfc8a2] font-cinzel font-bold text-xs tracking-wider transition-all shadow-md flex-shrink-0"
            >
              Sign Up (Lawyers Only)
            </button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
