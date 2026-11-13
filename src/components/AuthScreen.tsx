"use client";

import React, { useState } from "react";
import {
  Scale,
  ShieldCheck,
  User,
  KeyRound,
  ArrowRight,
  Building,
  CheckCircle2,
  Database,
  Briefcase,
  Zap,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

interface RoleOption {
  id: "lawyer" | "associate" | "client" | "admin";
  tag: string;
  title: string;
  name: string;
  email: string;
  pass: string;
  scope: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function AuthScreen() {
  const { login, setIsGuideOpen, state } = useChamber();
  const [email, setEmail] = useState("lawyer@chambers.in");
  const [password, setPassword] = useState("lawyer123");
  const [submitting, setSubmitting] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState<"lawyer" | "associate" | "client" | "admin">("lawyer");

  const ROLES: RoleOption[] = [
    {
      id: "lawyer",
      tag: "1. LAWYER",
      title: "Principal Advocate",
      name: "Adv. Arjun Mehta",
      email: "lawyer@chambers.in",
      pass: "lawyer123",
      scope: "Full Chamber Control, Daily Cause Lists & Verification Desk",
      icon: Scale,
    },
    {
      id: "associate",
      tag: "2. ASSOCIATE",
      title: "Junior Associate",
      name: "Priya Sharma",
      email: "associate@chambers.in",
      pass: "assoc123",
      scope: "Assigned Matters, Hearing Prep & Draft Orders (Requires Sign-off)",
      icon: Briefcase,
    },
    {
      id: "client",
      tag: "3. CLIENT",
      title: "Litigant Client",
      name: "Rahul Verma",
      email: "client@chambers.in",
      pass: "client123",
      scope: "Transparent Case Docket, Court Orders & Bilateral Counsel Q&A",
      icon: User,
    },
    {
      id: "admin",
      tag: "4. SITE ADMIN",
      title: "Chamber & Site Admin",
      name: "Devika Nair",
      email: "admin@chambers.in",
      pass: "admin123",
      scope: "Chamber Roster, User Accounts & Master Audit Logs",
      icon: ShieldCheck,
    },
  ];

  const handleSelectRole = (role: RoleOption) => {
    setActiveRoleTab(role.id);
    setEmail(role.email);
    setPassword(role.pass);
  };

  const handleInstantLogin = async (e: React.MouseEvent, role: RoleOption) => {
    e.stopPropagation();
    handleSelectRole(role);
    setSubmitting(true);
    await login(role.email, role.pass);
    setSubmitting(false);
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
      {/* Left 6 Columns: Organic Chamber Heritage Desk */}
      <div className="lg:col-span-6 p-8 md:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#262a31] relative bg-[#121518]">
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
            <span>MongoDB: {state?.dbConnected ? "Atlas Cloud" : "Local Mode"}</span>
          </button>
        </div>

        {/* Information Architecture */}
        <div className="relative z-10 my-8 lg:my-0 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-mono font-semibold bg-[#1f242b] text-[#c5a059] border border-[#c5a059]/20 mb-5">
            <Building className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Delhi High Court · National Company Law Tribunal · District Benches</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold font-display text-[#f9f8f6] tracking-tight leading-tight">
            Advocates' Chamber Case Diary &amp; Cause List.
          </h1>

          <p className="mt-4 text-sm text-[#9ca3af] leading-relaxed font-serif">
            A bespoke litigation system configured for 4 distinct chamber roles:
            <strong className="text-[#f9f8f6]"> Lawyer</strong>,
            <strong className="text-[#f9f8f6]"> Associate</strong>,
            <strong className="text-[#f9f8f6]"> Client</strong>, and
            <strong className="text-[#f9f8f6]"> Site Admin</strong>.
          </p>

          <div className="mt-8 space-y-3.5 text-xs text-[#d1d5db]">
            <div className="flex items-start gap-3">
              <span className="text-[#c5a059] font-mono text-sm leading-none mt-0.5">§</span>
              <span>
                <strong className="text-white font-semibold">1. Lawyer (Principal Advocate):</strong> Full authority
                over all chamber matters, cause lists, final order citations, and the junior associate verification queue.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#c5a059] font-mono text-sm leading-none mt-0.5">§</span>
              <span>
                <strong className="text-white font-semibold">2. Associate (Junior Advocate):</strong> Assigned cases,
                hearing date tracking, and draft order submissions routed to principal sign-off.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#c5a059] font-mono text-sm leading-none mt-0.5">§</span>
              <span>
                <strong className="text-white font-semibold">3. Client (Litigant Portal):</strong> Clean, transparent
                view of suit progress, upcoming court appearances, operative orders, and bilateral counsel messages.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#c5a059] font-mono text-sm leading-none mt-0.5">§</span>
              <span>
                <strong className="text-white font-semibold">4. Site Admin (Chamber Administrator):</strong> Chamber
                roster control, credential provisioning, database health, and tamper-proof decision audit logs.
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

      {/* Right 6 Columns: 4 Role Logins Desk */}
      <div className="lg:col-span-6 p-6 md:p-10 flex flex-col justify-center bg-[#171a1f] overflow-y-auto">
        <div className="w-full max-w-lg mx-auto space-y-5">
          <div>
            <h2 className="text-2xl font-bold font-display text-[#f9f8f6] tracking-tight">
              Select Chamber Login
            </h2>
            <p className="text-xs text-[#9ca3af] mt-1">
              Choose from the 4 pre-configured logins below for instant 1-click access:
            </p>
          </div>

          {/* 4 Quick Role Pills Header */}
          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-lg bg-[#121518] border border-[#262a31]">
            {ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleSelectRole(role)}
                className={`py-1.5 text-center rounded text-[11px] font-mono font-semibold transition-all ${
                  activeRoleTab === role.id
                    ? "bg-[#c5a059] text-[#121518] shadow-sm"
                    : "text-[#9ca3af] hover:text-white"
                }`}
              >
                {role.id.toUpperCase()}
              </button>
            ))}
          </div>

          {/* 4 Login Cards */}
          <div className="space-y-2.5">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = activeRoleTab === role.id;

              return (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role)}
                  className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-[#20252e] border-[#c5a059] text-white shadow-sm ring-1 ring-[#c5a059]/30"
                      : "bg-[#1a1e24] border-[#2a303a] text-[#d1d5db] hover:border-[#3e4654] hover:bg-[#1e232b]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-[#14171a] border-[#c5a059] text-[#c5a059]"
                            : "bg-[#14171a] border-[#2e343e] text-[#9ca3af]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-[#c5a059] uppercase bg-[#14171a] px-1.5 py-0.5 rounded border border-[#c5a059]/30">
                            {role.tag}
                          </span>
                          <span className="text-xs font-bold text-white">{role.title}</span>
                          <span className="text-[11px] text-[#9ca3af]">({role.name})</span>
                        </div>

                        <p className="text-[11px] text-[#9ca3af] mt-1 leading-snug">
                          {role.scope}
                        </p>

                        <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-[#8b929e]">
                          <span>Email: <strong className="text-[#d1d5db]">{role.email}</strong></span>
                          <span>·</span>
                          <span>Password: <strong className="text-[#d1d5db]">{role.pass}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Instant Login Button */}
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={(e) => handleInstantLogin(e, role)}
                      className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#c5a059] hover:bg-[#d4b067] text-[#121518] font-bold text-[11px] tracking-wide transition-all shadow-sm disabled:opacity-50"
                      title={`Instantly sign in as ${role.title}`}
                    >
                      <Zap className="w-3 h-3 fill-current" />
                      <span>Login</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct Submit Form */}
          <form onSubmit={handleSubmit} className="p-4 rounded-lg bg-[#14171a] border border-[#262a31] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9ca3af]">
                Active Credentials ({activeRoleTab.toUpperCase()})
              </span>
              <span className="text-[10px] font-mono text-[#c5a059]">Auto-filled from selection</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#9ca3af] mb-1">
                  Chamber Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-[#1a1e24] border border-[#2d323c] text-white text-xs placeholder:text-[#6b7280] focus:outline-none focus:border-[#c5a059] font-mono transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#9ca3af] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-[#1a1e24] border border-[#2d323c] text-white text-xs placeholder:text-[#6b7280] focus:outline-none focus:border-[#c5a059] font-mono transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-md bg-[#c5a059] hover:bg-[#d4b067] text-[#121518] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-1"
            >
              <span>{submitting ? "Signing in..." : `Sign In as ${activeRoleTab.toUpperCase()}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
