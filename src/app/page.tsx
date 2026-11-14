"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicLayout } from "@/components/public/PublicLayout";
import { DiaryHero } from "@/components/home/DiaryHero";
import {
  Scale,
  Calendar,
  Clock,
  FileCheck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export default function HomePage() {
  const { currentUser, setAuthModal } = useChamber();
  const dashboardHref = currentUser?.role === "admin" ? "/admin" : "/dashboard";

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
      {/* 1. Kinetic Living Folio Hero */}
      <DiaryHero />

      {/* 2. Four Core Practice Pillars Overview */}
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
