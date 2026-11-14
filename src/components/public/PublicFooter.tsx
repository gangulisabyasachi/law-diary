"use client";

import React from "react";
import Link from "next/link";
import { Scale, ArrowUpRight } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function PublicFooter() {
  const { setAuthModal } = useChamber();

  return (
    <footer className="bg-white/80 dark:bg-[#070a0e] text-[#0b0f14] dark:text-[#3df2e0] border-t border-[#0b0f14]/15 dark:border-[#3df2e0]/20 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-xl font-cinzel font-black tracking-wider text-[#0b0f14] dark:text-[#3df2e0]">
                Updated Law Diary
              </span>
            </Link>
            <p className="text-xs font-serif italic text-[#0b0f14]/75 dark:text-[#3df2e0]/70 max-w-sm leading-relaxed">
              A private, sovereign practice management system built specifically for Senior Advocates, Chamber Counsels, and Briefing Associates across the Supreme Court, High Courts, and Tribunals of India.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#0b0f14]/60 dark:text-[#3df2e0]/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sher Shah Road &amp; High Court Registers Operational</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3.5">
            <h4 className="font-cinzel font-bold text-xs uppercase tracking-widest text-[#0b0f14] dark:text-[#3df2e0]">
              Chamber Suite
            </h4>
            <ul className="space-y-2 text-xs font-serif">
              <li>
                <Link href="/" className="hover:underline text-[#0b0f14]/80 dark:text-[#3df2e0]/80 hover:text-[#0b0f14] dark:hover:text-white transition-colors">
                  Overview &amp; Simulator
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:underline text-[#0b0f14]/80 dark:text-[#3df2e0]/80 hover:text-[#0b0f14] dark:hover:text-white transition-colors">
                  Daily Cause List &amp; CNR
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:underline text-[#0b0f14]/80 dark:text-[#3df2e0]/80 hover:text-[#0b0f14] dark:hover:text-white transition-colors">
                  Limitation Act 1963 Radar
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:underline text-[#0b0f14]/80 dark:text-[#3df2e0]/80 hover:text-[#0b0f14] dark:hover:text-white transition-colors">
                  Associate Verification Desk
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:underline text-[#0b0f14]/80 dark:text-[#3df2e0]/80 hover:text-[#0b0f14] dark:hover:text-white transition-colors">
                  Chamber Retainer Tiers
                </Link>
              </li>
            </ul>
          </div>

          {/* Access Desk */}
          <div className="space-y-3.5">
            <h4 className="font-cinzel font-bold text-xs uppercase tracking-widest text-[#0b0f14] dark:text-[#3df2e0]">
              Access &amp; Onboarding
            </h4>
            <ul className="space-y-2 text-xs font-serif">
              <li>
                <button onClick={() => setAuthModal("signup")} className="hover:underline text-[#0b0f14]/80 dark:text-[#3df2e0]/80 hover:text-[#0b0f14] dark:hover:text-white text-left">
                  Advocate Sign Up (Lawyers Only)
                </button>
              </li>
              <li>
                <button onClick={() => setAuthModal("signin")} className="hover:underline text-[#0b0f14]/80 dark:text-[#3df2e0]/80 hover:text-[#0b0f14] dark:hover:text-white text-left">
                  Senior Counsel Sign In
                </button>
              </li>
              <li>
                <button onClick={() => setAuthModal("signin")} className="hover:underline text-[#0b0f14]/80 dark:text-[#3df2e0]/80 hover:text-[#0b0f14] dark:hover:text-white text-left">
                  Associate Briefing Desk
                </button>
              </li>
              <li>
                <button onClick={() => setAuthModal("signin")} className="hover:underline text-[#0b0f14]/80 dark:text-[#3df2e0]/80 hover:text-[#0b0f14] dark:hover:text-white text-left">
                  Litigant Client Access
                </button>
              </li>
              <li>
                <Link href="/contact" className="hover:underline text-[#0b0f14]/80 dark:text-[#3df2e0]/80 hover:text-[#0b0f14] dark:hover:text-white inline-flex items-center gap-1">
                  Registrar Hotline <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* BCI Regulatory Compliance */}
          <div className="space-y-3.5">
            <h4 className="font-cinzel font-bold text-xs uppercase tracking-widest text-[#0b0f14] dark:text-[#3df2e0]">
              BCI Compliance &amp; Safe Custody
            </h4>
            <p className="text-xs leading-relaxed font-serif text-[#0b0f14]/70 dark:text-[#3df2e0]/65">
              Adhering strictly to Rule 36 of Bar Council of India Standards of Professional Conduct. Updated Law Diary does not solicit clients or advertise services; it operates strictly as an encrypted docket register for authorized chamber personnel and retainers under Vakalatnama.
            </p>
            <div className="pt-1">
              <Link href="/security" className="text-xs font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0] hover:underline inline-flex items-center gap-1">
                Read Security &amp; Compliance Whitepaper →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-[#0b0f14]/10 dark:border-[#3df2e0]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#0b0f14]/60 dark:text-[#3df2e0]/60">
          <span>© 2026 Updated Law Diary Technologies. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/security" className="hover:underline">Data Sovereignty</Link>
            <Link href="/contact" className="hover:underline">Registrar Desk</Link>
            <span>v2.4 Judicial Production</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
