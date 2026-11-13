"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Scale, ShieldCheck, User, KeyRound, ArrowRight, Building, CheckCircle2, Database } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function AuthScreen() {
  const { login, setIsGuideOpen, state } = useChamber();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const DEMO_ROSTER = [
    {
      title: "Principal Advocate",
      name: "Adv. Arjun Mehta",
      email: "lawyer@chambers.in",
      pass: "lawyer123",
      role: "lawyer",
      badge: "Full Chamber Control & Verification Desk",
      icon: Scale,
    },
    {
      title: "Senior Associate",
      name: "Priya Sharma",
      email: "associate@chambers.in",
      pass: "assoc123",
      role: "associate",
      badge: "Drafts Hearings & Orders (Requires Approval)",
      icon: User,
    },
    {
      title: "Client Portal",
      name: "Rahul Verma",
      email: "client@chambers.in",
      pass: "client123",
      role: "client",
      badge: "Transparent Docket, Orders & Direct Counsel Q&A",
      icon: User,
    },
    {
      title: "Chamber Administrator",
      name: "Devika Nair",
      email: "admin@chambers.in",
      pass: "admin123",
      role: "admin",
      badge: "User Account Provisioning & Audit Trail",
      icon: ShieldCheck,
    },
  ];

  const handleSelectRole = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    await login(email, password);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-[#121518] text-[#e5e7eb] font-body">
      {/* Left 7 Columns: Organic Chamber Heritage Desk */}
      <div className="lg:col-span-7 p-8 md:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#262a31] relative bg-[#121518]">
        {/* Brand */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1e232a] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] font-bold shadow-sm">
              <Scale className="w-5 h-5 text-[#c5a059]" />
            </div>
            <div>
              <span className="text-xl font-bold font-display tracking-tight text-[#f9f8f6] block leading-tight">
                CounselBook
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c5a059]">
                Chamber Case Diary &amp; Docket System
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsGuideOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-mono font-medium bg-[#1e232a] text-[#c5a059] border border-[#c5a059]/30 hover:bg-[#252b33] transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>MongoDB: {state?.dbConnected ? "Atlas Connected" : "Local Mode"}</span>
          </button>
        </div>

        {/* Narrative / Information Architecture */}
        <div className="relative z-10 my-10 lg:my-0 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-mono font-semibold bg-[#1f242b] text-[#c5a059] border border-[#c5a059]/20 mb-5">
            <Building className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Delhi High Court · National Company Law Tribunal · District Benches</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold font-display text-[#f9f8f6] tracking-tight leading-tight">
            Advocates' Chamber Case Diary &amp; Cause List.
          </h1>

          <p className="mt-4 text-sm text-[#9ca3af] leading-relaxed font-serif">
            A bespoke litigation system for advocates, junior associates, and clients.
            Built with strict legal hierarchy: junior associate drafts, hearing dates, and court orders
            require principal advocate sign-off before being formally entered into the chamber docket.
          </p>

          <div className="mt-8 space-y-3.5 text-xs text-[#d1d5db]">
            <div className="flex items-start gap-3">
              <span className="text-[#c5a059] font-mono text-sm leading-none mt-0.5">§</span>
              <span>
                <strong className="text-white font-semibold">Associate Verification Workflow:</strong> Junior associates
                draft hearings and orders, while changes route to the advocate's verification desk for one-click sign-off.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#c5a059] font-mono text-sm leading-none mt-0.5">§</span>
              <span>
                <strong className="text-white font-semibold">Live Docket &amp; Statutory Deadlines:</strong> Track daily courtrooms,
                item numbers, and statutory limitation periods under the Limitation Act.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#c5a059] font-mono text-sm leading-none mt-0.5">§</span>
              <span>
                <strong className="text-white font-semibold">Client Transparency Portal:</strong> Litigants view their active
                suits, next court appearances, operative orders, and directly communicate with counsel.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom meta */}
        <div className="relative z-10 text-[11px] text-[#6b7280] font-mono pt-4 border-t border-[#262a31] flex items-center justify-between">
          <span>CounselBook Legal Console</span>
          <span>Hilary Session 2026</span>
        </div>
      </div>

      {/* Right 5 Columns: Authentication Desk */}
      <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-center bg-[#171a1f]">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-display text-[#f9f8f6] tracking-tight">
              Sign In to Chambers
            </h2>
            <p className="text-xs text-[#9ca3af] mt-1">
              Select one of the 4 chamber roles below or enter your credentials.
            </p>
          </div>

          {/* 4 Login Role Cards */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#c5a059] font-mono">
              Chamber Logins (1-Click Fill):
            </p>
            <div className="space-y-2">
              {DEMO_ROSTER.map((item) => {
                const Icon = item.icon;
                const isSelected = email === item.email;
                return (
                  <button
                    key={item.email}
                    type="button"
                    onClick={() => handleSelectRole(item.email, item.pass)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors flex items-center justify-between group ${
                      isSelected
                        ? "bg-[#232932] border-[#c5a059] text-white"
                        : "bg-[#1d2127] border-[#2c313a] text-[#d1d5db] hover:border-[#3d434f] hover:bg-[#22272f]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded bg-[#16191e] border border-[#2e343e] flex items-center justify-center text-[#c5a059] flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{item.title}</span>
                          <span className="text-[10px] font-mono text-[#9ca3af]">({item.name})</span>
                        </div>
                        <p className="text-[10px] text-[#9ca3af] truncate">{item.badge}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#c5a059] opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      Select
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#d1d5db] mb-1">
                Chamber Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lawyer@chambers.in"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#121518] border border-[#2d323c] text-white text-xs placeholder:text-[#6b7280] focus:outline-none focus:border-[#c5a059] font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#d1d5db] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#121518] border border-[#2d323c] text-white text-xs placeholder:text-[#6b7280] focus:outline-none focus:border-[#c5a059] font-mono transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-lg bg-[#c5a059] hover:bg-[#d4b067] text-[#121518] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <span>{submitting ? "Authenticating..." : "Access Chamber Desk"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
