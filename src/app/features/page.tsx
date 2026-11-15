"use client";

import React from "react";
import Link from "next/link";
import { PublicLayout } from "@/components/public/PublicLayout";
import Hero3 from "@/components/ui/hero-3";
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
    <PublicLayout hideNavbar={true}>
      {/* Cinematic Judicial Hero */}
      <Hero3
        brandName="LexChron"
        badgeText="✦  Chamber Practice Architecture"
        headingLine1="Engineered for litigation,"
        headingLine2="crafted with classical dignity."
        description="Every module in LexChron is purpose-built to address the demanding daily realities of practicing advocates, arguing seniors, and courtroom clerks across all Indian jurisdictions."
        primaryCtaLabel="Explore Practice Pillars"
        primaryCtaHref="#features-grid"
        secondaryCtaLabel="View Retainer Tiers"
        secondaryCtaHref="/pricing"
        bottomTagline={"16-Character National CNR Tracking\nAutomated Daily Cause List Generation\nTwo-Man Senior Verification Protocol"}
        scrollText="Explore Pillars"
        scrollHref="#features-grid"
        bgImageSrc="/hero-features.jpg"
      />

      {/* Main 6 Features Grid - Wide End of Screen */}
      <section id="features-grid" className="w-full py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#111111]/10 dark:border-[#f3eee3]/15">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#d9541e]">
              PRACTICE PILLARS
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
              Six Pillars of High Court &amp; Tribunal Management
            </h2>
          </div>
          <p className="text-sm font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/60 max-w-md">
            A comprehensive overview of our sovereign courtroom management capabilities engineered exclusively for Indian litigation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {coreFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-8 md:p-10 rounded-3xl bg-white/70 dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs hover:border-[#d9541e] dark:hover:border-[#d9541e]/70 transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#111111] dark:bg-[#f3eee3]/15 text-[#f3eee3] flex items-center justify-center shadow-xs group-hover:bg-[#d9541e] transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                      {feat.title}
                    </h3>
                    <p className="text-xs font-serif italic text-[#d9541e] mt-1 font-medium">
                      {feat.tagline}
                    </p>
                  </div>
                  <p className="text-sm font-serif leading-relaxed text-[#111111]/80 dark:text-[#f3eee3]/80">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#111111]/10 dark:border-[#f3eee3]/15 space-y-2.5">
                  {feat.bullets.map((bullet, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs font-serif text-[#111111]/80 dark:text-[#f3eee3]/80">
                      <CheckCircle2 className="w-4 h-4 text-[#d9541e] flex-shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4-Step Chamber Operating Protocol - Wide End of Screen */}
      <section className="w-full py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20 bg-white/40 dark:bg-[#141414] border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div className="w-full space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#111111]/10 dark:border-[#f3eee3]/15">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#d9541e]">
                WORKFLOW INTEGRATION
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                The Four-Step Chamber Protocol
              </h2>
            </div>
            <p className="text-sm font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/60 max-w-md">
              How distinguished counsels transition from disorganized paper registers to a sovereign digital chamber.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {protocolSteps.map((step, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 space-y-4 relative group hover:border-[#d9541e] dark:hover:border-[#d9541e]/60 transition-all shadow-xs"
              >
                <span className="w-10 h-10 rounded-xl bg-[#111111] dark:bg-[#f3eee3]/15 text-[#f3eee3] flex items-center justify-center font-mono font-bold text-xs group-hover:bg-[#d9541e] group-hover:text-white transition-colors">
                  {step.step}
                </span>
                <h4 className="text-lg font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                  {step.title}
                </h4>
                <p className="text-xs font-serif leading-relaxed text-[#111111]/75 dark:text-[#f3eee3]/70">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="p-10 md:p-14 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="space-y-2 max-w-2xl">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                Ready to modernize your chamber records?
              </h3>
              <p className="text-sm font-serif text-[#111111]/70 dark:text-[#f3eee3]/60">
                Commission your chamber workspace in under two minutes with your Bar Council enrolment.
              </p>
            </div>
            <button
              onClick={() => setAuthModal("signup")}
              className="px-8 py-3.5 rounded-full bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs tracking-wider transition-all shadow-md flex-shrink-0"
            >
              Sign Up (Lawyers Only)
            </button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
