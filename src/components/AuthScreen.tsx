"use client";

import React, { useState } from "react";
import {
  Scale,
  ShieldCheck,
  User,
  ArrowRight,
  Building,
  Database,
  Briefcase,
  Zap,
  Sun,
  Moon,
  Laptop,
  Award,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

interface RoleOption {
  id: "lawyer" | "associate" | "client" | "admin";
  roman: string;
  tag: string;
  title: string;
  name: string;
  email: string;
  pass: string;
  scope: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function AuthScreen() {
  const { login, setIsGuideOpen, state, theme, setTheme } = useChamber();
  const [email, setEmail] = useState("lawyer@chambers.in");
  const [password, setPassword] = useState("lawyer123");
  const [submitting, setSubmitting] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState<"lawyer" | "associate" | "client" | "admin">("lawyer");

  const ROLES: RoleOption[] = [
    {
      id: "lawyer",
      roman: "I",
      tag: "SENIOR ADVOCATE & PRINCIPAL COUNSEL",
      title: "Adv. Arjun Mehta",
      name: "Senior Counsel (D/1482/2012)",
      email: "lawyer@chambers.in",
      pass: "lawyer123",
      scope: "Full Chamber Command, High Court Daily Board, Bench Appearances & Verification Sanction",
      icon: Scale,
    },
    {
      id: "associate",
      roman: "II",
      tag: "ASSOCIATE ADVOCATE / BRIEFING COUNSEL",
      title: "Priya Sharma",
      name: "Senior Associate Counsel",
      email: "associate@chambers.in",
      pass: "assoc123",
      scope: "Assigned Roster Matters, Daily Order Transcription & Submissions to Senior Counsel",
      icon: Briefcase,
    },
    {
      id: "client",
      roman: "III",
      tag: "LITIGANT CLIENT PORTAL",
      title: "Rahul Verma",
      name: "Managing Director, Verma Infra LLP",
      email: "client@chambers.in",
      pass: "client123",
      scope: "Transparent Case Docket, Next Date of Hearing (NDOH), Certified Orders & Direct Inquiries",
      icon: User,
    },
    {
      id: "admin",
      roman: "IV",
      tag: "CHAMBER REGISTRAR & ADMINISTRATOR",
      title: "Devika Nair",
      name: "Chamber Registrar & Office Manager",
      email: "admin@chambers.in",
      pass: "admin123",
      scope: "Chamber Roster, Advocate Provisioning, Audit Trail & Database Health",
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
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Left 6 Columns: Bespoke Chamber Heritage & Chronicle */}
      <div className="lg:col-span-6 p-8 md:p-14 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 relative bg-slate-100/60 dark:bg-slate-900/80">
        {/* Top Header: Brand Seal & Theme Controls */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 border border-blue-500/40 flex items-center justify-center text-white shadow-md flex-shrink-0 relative">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold font-cinzel tracking-wider text-slate-900 dark:text-white block leading-tight">
                CounselBook
              </span>
              <span className="text-[10px] font-cinzel uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400 font-semibold">
                Advocates' Chamber Case Diary · Est. 2012
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <div className="flex items-center p-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  theme === "light" ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-400 hover:text-slate-700"
                }`}
                title="Light Mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  theme === "dark" ? "bg-blue-950/60 text-blue-400 font-bold" : "text-slate-400 hover:text-white"
                }`}
                title="Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  theme === "system" ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold" : "text-slate-400"
                }`}
                title="System Mode"
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
            </div>

            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 shadow-xs select-none"
              title="256-Bit Encrypted Chamber Network"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Encrypted Vault</span>
            </div>
          </div>
        </div>

        {/* Narrative / Judicial Chamber Heritage */}
        <div className="relative z-10 my-10 lg:my-0 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 mb-5 shadow-xs">
            <Building className="w-3.5 h-3.5" />
            <span>High Court of Delhi · Supreme Court of India · NCLT Principal Bench</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold font-cinzel text-slate-900 dark:text-white tracking-wide leading-tight">
            CounselBook · Advocates' Chamber Diary.
          </h1>

          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-serif italic text-base">
            "Fiat justitia ruat caelum" — A bespoke legal chamber docket engineered for Senior Counsel and junior associates.
            Integrates official 16-character CNR tracking, High Court daily cause lists, court hall calling sequences, and statutory limitation monitoring under the Limitation Act, 1963.
          </p>

          <div className="mt-8 space-y-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 backdrop-blur-xs">
              <span className="text-blue-600 dark:text-blue-400 font-cinzel text-xs font-bold leading-none mt-0.5">I.</span>
              <span>
                <strong className="text-slate-900 dark:text-white font-semibold font-sans">Advocate Verification Desk:</strong> Junior associates
                draft daily court proceedings, cross-examination records and interim orders, which route to Senior Counsel's desk for sanction before updating records.
              </span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 backdrop-blur-xs">
              <span className="text-blue-600 dark:text-blue-400 font-cinzel text-xs font-bold leading-none mt-0.5">II.</span>
              <span>
                <strong className="text-slate-900 dark:text-white font-semibold font-sans">eCourts CNR &amp; Cause Lists:</strong> 16-character
                Case Natural Record numbers across Delhi High Court, Tis Hazari, and NCLT with Court Room and Item No tracking.
              </span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 backdrop-blur-xs">
              <span className="text-blue-600 dark:text-blue-400 font-cinzel text-xs font-bold leading-none mt-0.5">III.</span>
              <span>
                <strong className="text-slate-900 dark:text-white font-semibold font-sans">Litigant Client Transparency:</strong> Litigants
                track their Next Date of Hearing (NDOH), download certified court orders, and engage in direct communication with counsel.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="relative z-10 text-[10.5px] text-slate-400 dark:text-slate-500 font-cinzel tracking-widest pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span>BAR COUNCIL OF DELHI ENROLMENT NO. D/1482/2012</span>
          <span>HILARY SESSION MMXXVI</span>
        </div>
      </div>

      {/* Right 6 Columns: 4 Bespoke Chamber Portals */}
      <div className="lg:col-span-6 p-6 md:p-10 lg:p-12 flex flex-col justify-center bg-slate-50 dark:bg-slate-950 overflow-y-auto">
        <div className="w-full max-w-lg mx-auto space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400">
                Privileged Access
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent" />
            </div>
            <h2 className="text-2xl font-bold font-cinzel text-slate-900 dark:text-white tracking-wide">
              Sign In to Chambers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic mt-1">
              Select one of the four judicial personas below for 1-click instant verification:
            </p>
          </div>

          {/* 4 Role Selector Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleSelectRole(role)}
                className={`py-2 text-center rounded-lg text-[10px] font-semibold tracking-wider transition-all ${
                  activeRoleTab === role.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {role.roman}. {role.id.toUpperCase()}
              </button>
            ))}
          </div>

          {/* 4 Luxury Role Credential Cards */}
          <div className="space-y-3">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = activeRoleTab === role.id;

              return (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-white dark:bg-slate-900 border-blue-600 dark:border-blue-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-blue-500/30"
                      : "bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                            : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] font-semibold tracking-wider text-blue-700 dark:text-blue-300 uppercase bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                            {role.tag}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{role.title}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">({role.name})</span>
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                          {role.scope}
                        </p>

                        <div className="flex items-center gap-2.5 mt-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          <span>Email: <strong className="text-slate-900 dark:text-slate-200 font-semibold">{role.email}</strong></span>
                          <span>·</span>
                          <span>Password: <strong className="text-slate-900 dark:text-slate-200 font-semibold">{role.pass}</strong></span>
                        </div>

                        {role.id === "lawyer" && (
                          <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEmail("lawyer@chambers.in");
                                setPassword("lawyer123");
                                setActiveRoleTab("lawyer");
                              }}
                              className={`px-2 py-0.5 rounded text-[9.5px] font-semibold transition-colors ${
                                email === "lawyer@chambers.in"
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900"
                              }`}
                            >
                              Chamber I (Arjun Mehta)
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEmail("sen@chambers.in");
                                setPassword("sen123");
                                setActiveRoleTab("lawyer");
                              }}
                              className={`px-2 py-0.5 rounded text-[9.5px] font-semibold transition-colors ${
                                email === "sen@chambers.in"
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900"
                              }`}
                            >
                              Chamber II (Rajeshwari Sen)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Instant Access Action Button */}
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={(e) => handleInstantLogin(e, role)}
                      className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[10px] tracking-wider transition-all shadow-sm disabled:opacity-50"
                      title={`Instant 1-Click Verification as ${role.title}`}
                    >
                      <Zap className="w-3 h-3 fill-current text-white" />
                      <span>Instant</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct Credential Form */}
          <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Active Dossier Credentials ({activeRoleTab.toUpperCase()})
              </span>
              <span className="text-[9.5px] font-mono text-blue-600 dark:text-blue-400">Ready for Authorization</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10.5px] font-medium text-slate-600 dark:text-slate-400 mb-1 font-sans">
                  Chamber Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono transition-colors focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-medium text-slate-600 dark:text-slate-400 mb-1 font-sans">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono transition-colors focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              <span>{submitting ? "Authenticating..." : `Enter Chamber as ${activeRoleTab.toUpperCase()}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
