"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicLayout } from "@/components/public/PublicLayout";
import {
  Scale,
  Calendar,
  Clock,
  FileCheck,
  FileText,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Building,
  Gavel,
  CheckCircle2,
  DollarSign,
  Printer,
  Copy,
  Check,
  Search,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export default function HomePage() {
  const { currentUser, setAuthModal } = useChamber();
  const dashboardHref = currentUser?.role === "admin" ? "/admin" : "/dashboard";

  // Simulator Active Tab state
  const [simTab, setSimTab] = useState<"today" | "tomorrow" | "billing" | "search">("today");
  const [copiedCNR, setCopiedCNR] = useState<string | null>(null);

  const handleCopyCNR = (cnr: string) => {
    navigator.clipboard?.writeText(cnr);
    setCopiedCNR(cnr);
    setTimeout(() => setCopiedCNR(null), 1800);
  };

  const corePillars = [
    {
      icon: Calendar,
      title: "Daily Cause List Synchronization",
      description: "Calling orders, courtroom numbers, item numbers, and presiding benches aggregated every morning for High Court & Tribunals.",
      link: "/features",
    },
    {
      icon: Scale,
      title: "16-Character National CNR Tracking",
      description: "Direct tracking across all Indian jurisdictions with single-click clipboard copy and unified docket progression.",
      link: "/features",
    },
    {
      icon: Clock,
      title: "Limitation Act 1963 Statutory Radar",
      description: "Automatic statutory countdowns from certified order dates for High Court appeals, reviews, and Supreme Court SLPs.",
      link: "/features",
    },
    {
      icon: FileCheck,
      title: "Senior Counsel Verification Desk",
      tagline: "Two-man sign-off rule",
      description: "Sanction junior associate draft entries and hearing outcomes before they alter official judicial chamber records.",
      link: "/features",
    },
  ];

  return (
    <PublicLayout>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-28 md:pb-32 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        {/* Soft Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#f3eee3]/20 to-transparent dark:from-[#f3eee3]/15 dark:via-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center relative z-10 space-y-7">
          {/* Trust Seal Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-cinzel font-semibold tracking-wider bg-white dark:bg-[#181818] text-[#111111] dark:text-[#f3eee3] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#111111] dark:text-[#f3eee3]" />
            <span>ESTABLISHED FOR SENIOR ADVOCATES &amp; PRIVATE CHAMBERS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-medium text-[#111111] dark:text-[#f3eee3] tracking-tight leading-[1.18] max-w-4xl mx-auto">
            Serene Chamber Stewardship, Reimagined for Modern Litigation.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#111111]/70 dark:text-[#f3eee3]/65 font-serif italic max-w-2xl mx-auto leading-relaxed">
            Replace fragmented paper diaries and turbulent courtroom mornings with a sovereign, beautifully curated chamber operating system.
          </p>

          {/* Call to Actions */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            {currentUser ? (
              <Link
                href={dashboardHref}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-xl group"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setAuthModal("signup")}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-xl group"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setAuthModal("signin")}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-[#181818] hover:bg-white/80 dark:hover:bg-[#181b22] text-[#111111] dark:text-[#f3eee3] border border-[#111111]/15 dark:border-[#f3eee3]/20 font-cinzel font-semibold text-xs tracking-wider transition-all shadow-xs"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Dignified Pillar Stat Tiles */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
              <span className="block text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">16-Char</span>
              <span className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic">National CNR Support</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
              <span className="block text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">Act 1963</span>
              <span className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic">Statutory Appeal Radar</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
              <span className="block text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">Rule 36</span>
              <span className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic">Bar Council Compliance</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
              <span className="block text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">Two-Man</span>
              <span className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic">Associate Verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Cause List Simulator */}
      <section className="py-20 md:py-28 max-w-6xl mx-auto px-5 sm:px-8 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#111111] dark:text-[#f3eee3]">
            CHAMBER WORKSPACE PREVIEW
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
            The Litigator&apos;s Daily Control Board
          </h2>
          <p className="text-xs sm:text-sm font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/60">
            Interactive simulation of calling order, court rooms, item numbers, and NDOH listings.
          </p>
        </div>

        {/* Simulator Frame */}
        <div className="rounded-3xl border border-[#111111]/15 dark:border-[#f3eee3]/25 bg-white dark:bg-[#181818] overflow-hidden shadow-xl">
          {/* Top Simulator Header */}
          <div className="p-4 sm:p-5 bg-white dark:bg-[#111111] border-b border-[#111111]/15 dark:border-[#f3eee3]/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#111111] dark:bg-[#f3eee3]/15 flex items-center justify-center text-[#f3eee3]">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] block leading-tight">
                  Chambers of Adv. Arjun Mehta
                </span>
                <span className="text-[10px] font-mono text-[#111111]/60 dark:text-[#f3eee3]/60">
                  Senior Counsel · Delhi High Court Board
                </span>
              </div>
            </div>

            {/* Simulator Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs font-cinzel font-semibold">
              <button
                onClick={() => setSimTab("today")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  simTab === "today"
                    ? "bg-[#d9541e] text-white dark:bg-[#d9541e] dark:text-white shadow-xs"
                    : "text-[#111111]/65 dark:text-[#f3eee3]/60"
                }`}
              >
                Today&apos;s Board (3)
              </button>
              <button
                onClick={() => setSimTab("tomorrow")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  simTab === "tomorrow"
                    ? "bg-[#d9541e] text-white dark:bg-[#d9541e] dark:text-white shadow-xs"
                    : "text-[#111111]/65 dark:text-[#f3eee3]/60"
                }`}
              >
                Tomorrow (2)
              </button>
              <button
                onClick={() => setSimTab("billing")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  simTab === "billing"
                    ? "bg-[#d9541e] text-white dark:bg-[#d9541e] dark:text-white shadow-xs"
                    : "text-[#111111]/65 dark:text-[#f3eee3]/60"
                }`}
              >
                Fee Ledger
              </button>
            </div>
          </div>

          {/* Simulator Body */}
          <div className="p-6 sm:p-8 overflow-x-auto text-xs font-serif">
            {simTab === "today" && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-sm text-[#111111] dark:text-[#f3eee3]">
                        WP(C) 4120/2024
                      </span>
                      <button
                        onClick={() => handleCopyCNR("DLHC01-008129-2024")}
                        className="inline-flex items-center gap-1 font-mono text-[10px] bg-white dark:bg-[#181818] px-2 py-0.5 rounded-lg border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3]"
                      >
                        <span>CNR: DLHC01-008129-2024</span>
                        {copiedCNR === "DLHC01-008129-2024" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 opacity-60" />}
                      </button>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-cinzel font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200">
                        Item #14
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#111111] dark:text-[#f3eee3]">
                      Tata Sons Pvt Ltd vs Union of India &amp; Ors
                    </h4>
                    <p className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 italic">
                      High Court of Delhi · Court Room 24 · Hon&apos;ble Rajiv Shakdher, J.
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-1">
                    <span className="text-xs font-cinzel font-bold text-emerald-700 dark:text-emerald-400 block">
                      Arguments in Progress
                    </span>
                    <span className="text-[10px] text-[#111111]/60 dark:text-[#f3eee3]/50 font-mono">
                      NDOH: 28 Nov 2024
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-sm text-[#111111] dark:text-[#f3eee3]">
                        ARB.P. 882/2023
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-cinzel font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200">
                        Item #3
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#111111] dark:text-[#f3eee3]">
                      L&amp;T Infrastructure vs Delhi Metro Rail Corp
                    </h4>
                    <p className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 italic">
                      High Court of Delhi · Court Room 3 · Hon&apos;ble Rekha Palli, J.
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-1">
                    <span className="text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] block">
                      Section 11 Appointment
                    </span>
                    <span className="text-[10px] text-[#111111]/60 dark:text-[#f3eee3]/50 font-mono">
                      NDOH: 05 Dec 2024
                    </span>
                  </div>
                </div>
              </div>
            )}

            {simTab === "tomorrow" && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#111111] dark:text-[#f3eee3]">
                        CP(IB) 112/2024
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-cinzel font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200">
                        Item #21
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#111111] dark:text-[#f3eee3]">
                      State Bank of India vs Jindal Steel &amp; Power
                    </h4>
                    <p className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 italic">
                      NCLT Principal Bench · Court Room 1 · Hon&apos;ble President Bench
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-cinzel font-bold text-amber-700 dark:text-amber-400 block">
                      Section 7 Admission
                    </span>
                  </div>
                </div>
              </div>
            )}

            {simTab === "billing" && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-[#111111] dark:text-[#f3eee3]">REC-2024-089</span>
                    <p className="text-xs text-[#111111]/80 dark:text-[#f3eee3]/80">Senior Counsel Senior Argument Fee (WP 4120/2024)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-emerald-700 dark:text-emerald-400">₹2,50,000</span>
                    <span className="text-[10px] text-[#111111]/60 dark:text-[#f3eee3]/50 block">Bank Transfer (NEFT)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Four Core Practice Pillars Overview */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-5 sm:px-8 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#111111] dark:text-[#f3eee3]">
            PRACTICE ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
            Everything Required to Steer a Sovereign Chamber
          </h2>
          <p className="text-sm font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/60">
            Click into our dedicated guides to explore each module in depth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {corePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={idx}
                href={pillar.link}
                className="p-8 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs hover:border-[#111111] dark:hover:border-[#f3eee3]/50 transition-all group space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#111111] dark:bg-[#f3eee3]/15 text-[#f3eee3] flex items-center justify-center shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] group-hover:underline">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-serif leading-relaxed text-[#111111]/75 dark:text-[#f3eee3]/70 mt-2">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#111111]/10 dark:border-[#f3eee3]/15 flex items-center justify-between text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
                  <span>Explore Feature Details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Ethics, Compliance & Security Spotlight */}
      <section className="py-20 md:py-28 bg-white/60 dark:bg-[#181818] border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-cinzel font-bold tracking-wider bg-[#f3eee3]/20 dark:bg-[#f3eee3]/15 text-[#111111] dark:text-[#f3eee3] border border-[#111111]/20 dark:border-[#f3eee3]/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>BAR COUNCIL OF INDIA COMPLIANT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                Zero Commercial Solicitation. Absolute Sovereign Safe Custody.
              </h2>
              <p className="text-xs sm:text-sm font-serif italic text-[#111111]/75 dark:text-[#f3eee3]/70 leading-relaxed">
                Operating strictly under Rule 36 of the Bar Council of India Standards of Professional Conduct. All briefs, orders, and fee records remain encrypted within your chamber vault.
              </p>
            </div>

            <Link
              href="/security"
              className="px-6 py-3.5 rounded-2xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs tracking-wider flex items-center gap-2 flex-shrink-0 shadow-md"
            >
              <span>Security Whitepaper</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Bottom Onboarding Call to Action */}
      <section className="py-20 md:py-28 max-w-5xl mx-auto px-5 sm:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] tracking-tight">
          Initialize Your Encrypted Chamber Docket.
        </h2>
        <p className="text-sm sm:text-base font-serif italic text-[#111111]/75 dark:text-[#f3eee3]/70 max-w-xl mx-auto leading-relaxed">
          Join practicing advocates across Delhi, Mumbai, Calcutta, and Supreme Court dockets modernizing their practices today.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          {currentUser ? (
            <Link
              href={dashboardHref}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs tracking-widest uppercase transition-all shadow-md inline-flex items-center justify-center gap-2"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={() => setAuthModal("signup")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs tracking-widest uppercase transition-all shadow-md inline-flex items-center justify-center gap-2"
            >
              <span>Sign Up as Advocate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <Link
            href="/contact"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-[#181818] text-[#111111] dark:text-[#f3eee3] border border-[#111111]/15 dark:border-[#f3eee3]/20 font-cinzel font-semibold text-xs tracking-wider transition-all shadow-xs"
          >
            Contact Chamber Registrar
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
