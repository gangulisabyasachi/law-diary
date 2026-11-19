"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function DiaryHero() {
  const { currentUser, setAuthModal } = useChamber();
  const dashboardHref = currentUser?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 border-b border-[#111111]/12 dark:border-[#f3eee3]/15">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-[#d9541e]/12 via-[#f3eee3]/30 to-transparent dark:from-[#d9541e]/15 dark:via-transparent blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* ============================================================== */}
        {/* 1. KINETIC TEXT HERO (Unfolding from a Center Crease)          */}
        {/* ============================================================== */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Trust Seal Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-cinzel font-bold tracking-wider bg-white dark:bg-[#181818] text-[#111111] dark:text-[#f3eee3] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d9541e]" />
            <span>ESTABLISHED FOR SENIOR ADVOCATES &amp; PRIVATE CHAMBERS</span>
          </motion.div>

          {/* Grand Serene Headline with Staggered Kinetic Emergence */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal text-[#111111] dark:text-[#f3eee3] tracking-tight leading-[1.08]"
          >
            The Litigator&apos;s Diary,{" "}
            <span className="italic text-[#d9541e]">Unfolded</span> in Sovereign Clarity.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-[#111111]/75 dark:text-[#f3eee3]/70 font-serif italic max-w-2xl mx-auto leading-relaxed"
          >
            From weathered courtroom margins to statutory appeal radars and encrypted private chamber ledgers.
            Experience sovereign tranquility, strictly isolated for your chamber practice under BCI Rule 36.
          </motion.p>

          {/* Main Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            {currentUser ? (
              <Link
                href={dashboardHref}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] font-cinzel font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg group"
              >
                <span>Enter Sovereign Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setAuthModal("signup")}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] font-cinzel font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg group"
                >
                  <span>Sign Up as Advocate</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setAuthModal("signin")}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-[#181818] hover:bg-white/80 dark:hover:bg-[#202020] text-[#111111] dark:text-[#f3eee3] border border-[#111111]/15 dark:border-[#f3eee3]/20 font-cinzel font-semibold text-xs tracking-wider transition-all shadow-xs"
                >
                  Sign In to Chamber
                </button>
              </>
            )}
          </motion.div>
        </div>

        {/* ============================================================== */}
        {/* 2. FOUR FOUNDATIONAL PILLARS OF PRACTICE                       */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left"
        >
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs hover:border-[#d9541e] transition-colors">
            <span className="block text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">Docket</span>
            <span className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic">Chamber Case Tracking</span>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs hover:border-[#d9541e] transition-colors">
            <span className="block text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">Act 1963</span>
            <span className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic">Statutory Appeal Radar</span>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs hover:border-[#d9541e] transition-colors">
            <span className="block text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">Rule 36</span>
            <span className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic">Bar Council Compliance</span>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs hover:border-[#d9541e] transition-colors">
            <span className="block text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">Two-Man</span>
            <span className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic">Associate Verification</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default DiaryHero;
