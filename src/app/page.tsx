"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicLayout } from "@/components/public/PublicLayout";
import Hero3 from "@/components/ui/hero-3";
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

  const chamberNavLinks = [
    { label: "Features", href: "/features" },
    { label: "Security & Ethics", href: "/security" },
    { label: "Pricing", href: "/pricing" },
    { label: "Registrar Desk", href: "/contact" },
  ];

  return (
    <PublicLayout hideNavbar={true}>
      {/* 1. Cinematic Luxury Hero (Hero3) with LexDaily Context */}
      <Hero3
        brandName="LexDaily"
        navLinks={chamberNavLinks}
        signUpLabel={currentUser ? "Dashboard" : "Sign In"}
        signUpHref={currentUser ? dashboardHref : "#"}
        onSignUpClick={() => {
          if (!currentUser) setAuthModal("signin");
        }}
        eyebrowText="Sovereign Chamber Operating System"
        headingLine1="Building sovereign clarity"
        headingLine2="into Indian litigation."
        description="From automated court cause lists and 16-character CNR dockets to statutory Limitation Act radars. Engineered specifically for Senior Advocates and modern private chambers."
        primaryCtaLabel={currentUser ? "Enter Dashboard" : "Sign Up"}
        primaryCtaHref={currentUser ? dashboardHref : "#"}
        onPrimaryCtaClick={() => {
          if (!currentUser) setAuthModal("signup");
        }}
        secondaryCtaLabel="Chamber Security"
        secondaryCtaHref="/security"
        scrollText="Scroll to Discover"
        bgImageSrc="/hero-judicial.jpg"
        bgLightImageSrc="/hero-judicial-light.jpg"
      />

      {/* 2. Four Core Practice Pillars Overview — Wide End-of-Screen Panoramic Layout */}
      <section id="features-section" className="relative w-full py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20 border-b border-[#111111]/15 dark:border-[#f3eee3]/20 bg-[#f3eee3]/40 dark:bg-[#111111]/40">
        {/* Top & Bottom Accent Hairline Grid */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#111111]/10 dark:border-[#f3eee3]/15">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-cinzel font-bold tracking-widest text-[#d9541e] border border-[#d9541e]/30 bg-[#d9541e]/10">
              PRACTICE ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#111111] dark:text-[#f3eee3] tracking-tight">
              Sovereign Infrastructure for the Modern Bar
            </h2>
          </div>
          <p className="text-sm font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/65 max-w-md md:text-right">
            Engineered exclusively to eliminate courtroom friction, missed limitation windows, and unauthorized junior entries.
          </p>
        </div>

        {/* 4-Column Full-Width Panoramic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {corePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={idx}
                href={pillar.link}
                className="relative p-8 rounded-3xl bg-white/80 dark:bg-[#181818]/80 backdrop-blur-md border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs hover:shadow-xl hover:border-[#d9541e] dark:hover:border-[#d9541e] transition-all group flex flex-col justify-between overflow-hidden"
              >
                {/* Top Subtle Amber/Terracotta Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d9541e]/40 to-transparent group-hover:via-[#d9541e] transition-all" />

                <div className="space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#d9541e]/15 text-[#d9541e] flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#d9541e] block tracking-wider uppercase mb-1">
                      Module 0{idx + 1}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] group-hover:text-[#d9541e] transition-colors leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-serif leading-relaxed text-[#111111]/75 dark:text-[#f3eee3]/70 mt-3">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#111111]/10 dark:border-[#f3eee3]/15 flex items-center justify-between text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
                  <span>Explore Module</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#d9541e]" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Ethics, Compliance & Security Spotlight — Panoramic Cinematic Banner */}
      <section className="relative w-full py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20 border-b border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white/70 dark:bg-[#141416]/90 overflow-hidden">
        {/* Subtle Decorative Hairline Frame in Corner */}
        <div className="absolute top-6 right-6 md:top-8 md:right-10 w-12 h-12 pointer-events-none hidden md:block">
          <span className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-[#d9541e]/40 to-transparent" />
          <span className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-[#d9541e]/40 to-transparent" />
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-cinzel font-bold tracking-wider bg-[#d9541e]/15 text-[#d9541e] border border-[#d9541e]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>BAR COUNCIL OF INDIA RULE 36 ENCRYPTED</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#111111] dark:text-[#f3eee3] tracking-tight leading-[1.12]">
              Zero Commercial Solicitation. <br className="hidden sm:block" />
              <span className="italic text-[#d9541e]">Absolute</span> Sovereign Safe Custody.
            </h2>
            <p className="text-sm sm:text-base font-serif italic text-[#111111]/75 dark:text-[#f3eee3]/70 leading-relaxed max-w-2xl">
              Operating strictly under the Standards of Professional Conduct. All briefs, vakalatnamas, orders, and fee records remain cryptographically isolated within your private chamber vault. Zero client directory exposure, zero public matter leakage.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-[#111111]/70 dark:text-[#f3eee3]/70">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Isolated Cryptographic Tenants</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Two-Man Senior Verification Required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>eCourts CIS 3.2 Compatible</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0 w-full lg:w-auto">
            <Link
              href="/security"
              className="px-8 py-4 rounded-full bg-[#d9541e] text-white hover:bg-[#bf4513] dark:hover:bg-[#ea6026] font-cinzel font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all group"
            >
              <span>Security Whitepaper</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-white dark:bg-[#181818] text-[#111111] dark:text-[#f3eee3] hover:bg-black/5 dark:hover:bg-white/5 border border-[#111111]/15 dark:border-[#f3eee3]/20 font-cinzel font-semibold text-xs tracking-wider flex items-center justify-center transition-all shadow-xs"
            >
              Contact Chamber Registrar
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Bottom Onboarding Call to Action — Full-Bleed Grand Statement */}
      <section className="relative w-full py-28 md:py-36 px-6 md:px-10 lg:px-16 xl:px-20 text-center space-y-8 bg-[#f3eee3] dark:bg-[#111111] overflow-hidden">
        {/* Soft Ambient Radial Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#d9541e]/10 via-[#d9541e]/5 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#d9541e] block">
            THE DIGITAL FOLIO FOR SOVEREIGN CHAMBERS
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal text-[#111111] dark:text-[#f3eee3] tracking-tight leading-[1.08]">
            Initialize Your Encrypted Chamber Docket.
          </h2>
          <p className="text-base sm:text-lg font-serif italic text-[#111111]/75 dark:text-[#f3eee3]/70 max-w-2xl mx-auto leading-relaxed">
            Join practicing advocates across Delhi, Mumbai, Calcutta, and Supreme Court registries modernizing their litigation practices today.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            {currentUser ? (
              <Link
                href={dashboardHref}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#d9541e] text-white hover:bg-[#bf4513] dark:hover:bg-[#ea6026] font-cinzel font-bold text-xs tracking-widest uppercase transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-3 group"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <button
                onClick={() => setAuthModal("signup")}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#d9541e] text-white hover:bg-[#bf4513] dark:hover:bg-[#ea6026] font-cinzel font-bold text-xs tracking-widest uppercase transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-3 group"
              >
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            <Link
              href="/contact"
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-white dark:bg-[#181818] text-[#111111] dark:text-[#f3eee3] border border-[#111111]/15 dark:border-[#f3eee3]/20 font-cinzel font-semibold text-xs tracking-wider transition-all shadow-xs hover:bg-black/5 dark:hover:bg-white/5"
            >
              Request Chamber Consultation
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
