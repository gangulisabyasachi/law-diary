"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Scale, ShieldCheck, CheckCircle2, User, KeyRound, Database, ArrowRight, Sparkles } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function AuthScreen() {
  const { login, setIsGuideOpen, state } = useChamber();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const DEMO_ACCOUNTS = [
    { label: "Principal Counsel", role: "lawyer", email: "lawyer@chambers.in", pass: "lawyer123", icon: Scale },
    { label: "Junior Associate", role: "associate", email: "associate@chambers.in", pass: "assoc123", icon: User },
    { label: "Client Portal", role: "client", email: "client@chambers.in", pass: "client123", icon: User },
    { label: "Chamber Admin", role: "admin", email: "admin@chambers.in", pass: "admin123", icon: ShieldCheck },
  ];

  const handleDemoSelect = (accountEmail: string, pass: string) => {
    setEmail(accountEmail);
    setPassword(pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    await login(email, password);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-950 font-body">
      {/* Left Column: Oxblood / Midnight Heritage Hero */}
      <div className="lg:col-span-7 relative p-8 md:p-14 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <Scale className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-xl font-bold font-display text-white tracking-tight">
                CounselBook
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-widest text-amber-400">
                Advocates' Chamber Management
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsGuideOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900/90 text-amber-300 border border-amber-500/30 hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>MongoDB: {state?.dbConnected ? "Connected" : "Setup Guide"}</span>
          </button>
        </div>

        {/* Hero Tagline */}
        <div className="relative z-10 my-12 lg:my-0 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> High Courts · Supreme Court · Tribunals
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight leading-[1.08]">
              The diary behind every <span className="italic text-amber-300 font-normal">victory</span>.
            </h1>
            <p className="mt-5 text-sm md:text-base text-slate-300 font-light leading-relaxed">
              A bespoke digital chamber for legal practitioners. Connect your case diaries, cause lists,
              judicial orders, and junior associate approvals seamlessly with MongoDB.
            </p>
          </motion.div>

          {/* Value Props */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 space-y-3.5 text-xs text-slate-300"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-white">Strict Legal Hierarchy:</strong> Principal advocate approval
                workflow for all associate hearings, filings, and status changes.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-white">Full MongoDB Architecture:</strong> Mongoose schemas for
                Users, Cases, Hearings, Orders, Approvals, and Decisions.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-white">Client Portal:</strong> Real-time transparent visibility into
                listings and orders with bilateral query messaging.
              </span>
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-4 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-between">
          <span>CounselBook v2.0 · React &amp; Next.js</span>
          <button
            onClick={() => setIsGuideOpen(true)}
            className="text-amber-400 hover:text-amber-300 underline font-medium"
          >
            How to Connect MongoDB
          </button>
        </div>
      </div>

      {/* Right Column: Clean Authentication Desk */}
      <div className="lg:col-span-5 p-8 md:p-14 flex flex-col justify-center bg-slate-900/50 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-display text-white tracking-tight">
              Sign in to Chamber
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select a demo role below or enter your chamber credentials.
            </p>
          </div>

          {/* Quick Demo Role Selector */}
          <div className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-2.5">
              1-Click Demo Accounts:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => {
                const Icon = acc.icon;
                const isSelected = email === acc.email;
                return (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleDemoSelect(acc.email, acc.pass)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs font-medium border transition-all ${
                      isSelected
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm"
                        : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="truncate">{acc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Chamber Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lawyer@chambers.in"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Access Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <span>{submitting ? "Verifying..." : "Enter Chamber"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-slate-800 text-center">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-xs text-amber-400/90 hover:text-amber-300 font-medium inline-flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Step-by-step MongoDB Connection Instructions</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

