"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Scale,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Sparkles,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function PublicFooter() {
  const { currentUser, setAuthModal, addToast } = useChamber();
  const [gazetteEmail, setGazetteEmail] = useState("");
  const [gazetteSubscribed, setGazetteSubscribed] = useState(false);

  const handleGazetteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gazetteEmail || !gazetteEmail.includes("@")) {
      addToast("Please provide a valid advocate email address.", "error");
      return;
    }
    setGazetteSubscribed(true);
    addToast("Chamber enrolled in Statutory Limitation Gazette.", "success");
  };

  return (
    <footer className="relative w-full bg-[#f3eee3] dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] border-t border-[#111111]/15 dark:border-[#f3eee3]/20 pt-20 md:pt-28 pb-12 transition-colors overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-gradient-to-b from-[#d9541e]/10 via-[#d9541e]/5 to-transparent blur-3xl rounded-full pointer-events-none" />

      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-20 space-y-20 relative z-10">

        {/* ─── 1. Grand Pre-Footer Commissioning Card ─── */}
        <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 bg-white/70 dark:bg-[#161616] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xl overflow-hidden group">
          {/* Subtle noise and background grid lines */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#d9541e]/5 via-transparent to-[#d9541e]/5 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#d9541e]/15 to-transparent rounded-bl-full pointer-events-none blur-2xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-cinzel font-bold tracking-widest text-[#d9541e] border border-[#d9541e]/30 bg-[#d9541e]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d9541e] animate-pulse" />
                <span>CHAMBER COMMISSIONING</span>
              </div>
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] tracking-tight leading-[1.15]">
                Commission your sovereign chamber docket in under two minutes.
              </h3>
              <p className="text-sm sm:text-base font-serif italic text-[#111111]/75 dark:text-[#f3eee3]/70 leading-relaxed">
                Purpose-built for High Court Senior Advocates, Arguing Counsels, and Briefing Associates. Instant voluntary enrolment with your official State Bar Council credentials.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              {currentUser ? (
                <Link
                  href={currentUser.role === "admin" ? "/admin" : "/dashboard"}
                  className="px-8 py-4 rounded-full bg-[#d9541e] text-white hover:bg-[#bf4513] shadow-md hover:shadow-xl font-cinzel font-bold text-xs tracking-widest uppercase transition-all duration-300 text-center inline-flex items-center justify-center gap-2 group/btn"
                >
                  <span>Open Chamber Dashboard</span>
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>
              ) : (
                <button
                  onClick={() => setAuthModal("signup")}
                  className="px-8 py-4 rounded-full bg-[#d9541e] text-white hover:bg-[#bf4513] shadow-md hover:shadow-xl font-cinzel font-bold text-xs tracking-widest uppercase transition-all duration-300 text-center inline-flex items-center justify-center gap-2 group/btn"
                >
                  <span>Sign Up</span>
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              )}
              <Link
                href="/contact"
                className="px-7 py-4 rounded-full bg-white dark:bg-[#202020] text-[#111111] dark:text-[#f3eee3] border border-[#111111]/20 dark:border-[#f3eee3]/25 font-cinzel font-bold text-xs tracking-wider hover:bg-[#f3eee3]/50 dark:hover:bg-[#252525] transition-all text-center shadow-xs"
              >
                Inquire with Registrar Desk
              </Link>
            </div>
          </div>
        </div>

        {/* ─── 2. Main 5-Column Navigation Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10 pt-4">

          {/* Col 1: Brand & Chamber Identity (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center group">
              <span 
                className="text-3xl sm:text-4xl font-clagista tracking-normal text-[#111111] dark:text-[#f3eee3] select-none inline-block"
                style={{ fontFamily: "'Clagista', cursive, sans-serif" }}
              >
                LexDaily
              </span>
            </Link>

            <p className="text-xs sm:text-sm font-serif italic text-[#111111]/75 dark:text-[#f3eee3]/70 leading-relaxed max-w-sm">
              A private, sovereign practice management system built specifically for Senior Advocates, Chamber Counsels, and Briefing Associates across the Supreme Court, High Courts, and Tribunals of India.
            </p>

            {/* Live Operational Status Node */}
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-[#181818]/60 border border-[#111111]/10 dark:border-[#f3eee3]/15 space-y-2">
              <div className="flex items-center gap-2.5 text-xs font-mono text-[#111111]/75 dark:text-[#f3eee3]/75">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">All India Benches Operational</span>
              </div>
              <p className="text-[11px] font-mono text-[#111111]/60 dark:text-[#f3eee3]/60 leading-tight">
                Sher Shah Road · Supreme Court · Delhi High Court Dockets Active
              </p>
            </div>

            {/* Chamber Gazette / Regulatory Circular Subscription */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[11px] font-cinzel font-bold uppercase tracking-wider text-[#d9541e] block">
                Statutory Limitation Gazette
              </span>
              <p className="text-xs font-serif text-[#111111]/70 dark:text-[#f3eee3]/65">
                Receive weekly High Court roster circulars, statutory limitation updates, and chamber briefings.
              </p>

              {gazetteSubscribed ? (
                <div className="p-3 rounded-xl bg-[#d9541e]/10 border border-[#d9541e]/30 flex items-center gap-2 text-xs font-serif text-[#d9541e]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Chamber enrolled for official gazette dispatches.</span>
                </div>
              ) : (
                <form onSubmit={handleGazetteSubmit} className="flex items-center gap-2">
                  <input
                    type="email"
                    required
                    value={gazetteEmail}
                    onChange={(e) => setGazetteEmail(e.target.value)}
                    placeholder="counsel@chamber.in"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-xs placeholder:text-[#111111]/40 dark:placeholder:text-[#f3eee3]/40 focus:outline-none focus:border-[#d9541e]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] transition-colors font-cinzel font-bold text-xs shrink-0 flex items-center gap-1.5"
                    aria-label="Subscribe to statutory gazette"
                  >
                    <span>Enroll</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Chamber Practice Suite (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-cinzel font-bold text-xs uppercase tracking-widest text-[#d9541e] flex items-center gap-1.5">
              <span>Chamber Suite</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-serif">
              <li>
                <Link href="/features" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Daily Cause List Synchronization
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  16-Character CNR Docket
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Limitation Act 1963 Radar
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Senior Verification Desk
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Printable Court Bag Cause List
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Certified Judicial Orders
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Four-Step Chamber Protocol
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Sovereignty & Ethics (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-cinzel font-bold text-xs uppercase tracking-widest text-[#d9541e] flex items-center gap-1.5">
              <span>Ethics &amp; Custody</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-serif">
              <li>
                <Link href="/security" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Bar Council Rule 36 Charter
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Sections 126 &amp; 129 Privilege
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  256-Bit Cryptographic Vault
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Multi-Tenant Tenant Isolation
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Tamper-Evident Audit Trail
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Database Sovereignty Options
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Official BCI Declaration
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Chamber Retainers (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-cinzel font-bold text-xs uppercase tracking-widest text-[#d9541e] flex items-center gap-1.5">
              <span>Retainers &amp; Tiers</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-serif">
              <li>
                <Link href="/pricing" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Solo Advocate (Free Forever)
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Chamber Pro (₹1,499/mo)
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Enterprise Law Firm Deployments
                </Link>
              </li>
              <li>
                <Link href="/pricing#pricing-tiers" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Compare Practice Capabilities
                </Link>
              </li>
              <li>
                <Link href="/pricing#pricing-faqs" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Frequently Answered Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  Historical Docket Migration
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-[#111111]/80 hover:text-[#d9541e] dark:text-[#f3eee3]/80 dark:hover:text-[#d9541e] transition-colors block py-0.5">
                  GST Invoices &amp; Chamber Retainers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Registrar Desk & Direct Access (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-cinzel font-bold text-xs uppercase tracking-widest text-[#d9541e] flex items-center gap-1.5">
              <span>Registrar Desk</span>
            </h4>
            <div className="space-y-3 text-xs font-serif text-[#111111]/80 dark:text-[#f3eee3]/80">
              <div className="space-y-1">
                <span className="font-cinzel font-bold text-[11px] text-[#111111] dark:text-[#f3eee3] block">
                  Chamber Physical Office:
                </span>
                <p className="text-[11px] leading-relaxed text-[#111111]/70 dark:text-[#f3eee3]/65">
                  Chamber Block, Sher Shah Road, New Delhi 110003<br />
                  (Adjacent to High Court of Delhi)
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="font-cinzel font-bold text-[11px] text-[#111111] dark:text-[#f3eee3] block">
                  Counsel Hotline:
                </span>
                <a href="tel:+919811020002" className="font-mono text-[11px] text-[#d9541e] hover:underline block">
                  +91 98110 20002
                </a>
              </div>

              <div className="space-y-1 pt-1">
                <span className="font-cinzel font-bold text-[11px] text-[#111111] dark:text-[#f3eee3] block">
                  Registrar Email:
                </span>
                <a href="mailto:registrar@updatedlawdiary.in" className="font-mono text-[11px] text-[#111111]/80 dark:text-[#f3eee3]/80 hover:underline block">
                  registrar@updatedlawdiary.in
                </a>
              </div>

              <div className="space-y-1 pt-1">
                <span className="font-cinzel font-bold text-[11px] text-[#111111] dark:text-[#f3eee3] block">
                  Sitting Hours:
                </span>
                <span className="text-[11px] font-mono text-[#111111]/60 dark:text-[#f3eee3]/60 block">
                  Mon — Fri: 09:00 — 18:30 IST
                </span>
              </div>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-cinzel font-bold text-[#d9541e] hover:underline"
                >
                  <span>Dispatch Communication</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ─── 3. Full-Bleed End-to-End Watermark Background at Bottom of Footer ─── */}
      <div 
        className="w-full overflow-hidden select-none pointer-events-none pt-4 sm:pt-8 pb-0 mt-2 mb-0 flex justify-center items-center"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 420 116"
          className="w-full h-auto select-none pointer-events-none block"
          aria-label="LexDaily"
        >
          <g transform="scale(1, 1.48)">
            <text
              x="50%"
              y="75"
              textAnchor="middle"
              className="font-mogina uppercase fill-[#111111]/[0.045] dark:fill-[#f3eee3]/[0.045] transition-colors"
              fontSize="100"
              style={{
                fontFamily: "'Mogina', var(--font-serif), Georgia, serif",
              }}
            >
              LEXDAILY
            </text>
          </g>
        </svg>
      </div>

      {/* ─── 4. Bottom Legal Strip & Back to Top ─── */}
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">
        <div className="pt-8 border-t border-[#111111]/10 dark:border-[#f3eee3]/15 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-[#111111]/60 dark:text-[#f3eee3]/60">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span>© 2026 LexDaily</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/security" className="hover:text-[#d9541e] transition-colors">
              Data Sovereignty
            </Link>
            <Link href="/security" className="hover:text-[#d9541e] transition-colors">
              Bar Council Charter
            </Link>
            <Link href="/contact" className="hover:text-[#d9541e] transition-colors">
              Registrar Desk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
