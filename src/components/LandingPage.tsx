"use client";

import React, { useState } from "react";
import {
  Scale,
  ShieldCheck,
  Building,
  ArrowRight,
  Gavel,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  Lock,
  Users,
  Briefcase,
  User,
  Zap,
  ChevronRight,
  Award,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  BookOpen,
  Check,
  X,
  Mail,
  Phone,
  MapPin,
  Send,
  HelpCircle,
  ExternalLink,
  AlertCircle,
  Receipt,
  Search,
  FolderLock,
  Smartphone,
  ChevronDown,
  Printer,
  Copy,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function LandingPage() {
  const { login, signupLawyer, theme, setTheme, addToast } = useChamber();

  // Modals state: null | "signin" | "signup"
  const [authModal, setAuthModal] = useState<null | "signin" | "signup">(null);

  // Universal Sign In state
  const [signInEmail, setSignInEmail] = useState("lawyer@chambers.in");
  const [signInPassword, setSignInPassword] = useState("lawyer123");
  const [signingIn, setSigningIn] = useState(false);
  const [selectedSignInRole, setSelectedSignInRole] = useState<"lawyer" | "associate" | "client" | "admin">("lawyer");

  // Lawyer Sign Up state (Lawyers ONLY)
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpBarEnrollment, setSignUpBarEnrollment] = useState("");
  const [signUpChamberName, setSignUpChamberName] = useState("");
  const [signUpCourt, setSignUpCourt] = useState("High Court of Delhi");
  const [signingUp, setSigningUp] = useState(false);

  // Contact Us state
  const [contactName, setContactName] = useState("");
  const [contactChamber, setContactChamber] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactCourt, setContactCourt] = useState("High Court of Delhi");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [submittingContact, setSubmittingContact] = useState(false);

  // Interactive Live Simulator tab: "today" | "tomorrow" | "billing" | "search"
  const [simulatorTab, setSimulatorTab] = useState<"today" | "tomorrow" | "billing" | "search">("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const ROLES = [
    {
      id: "lawyer" as const,
      tag: "ADVOCATE (CHAMBER I)",
      title: "Adv. Arjun Mehta",
      designation: "Senior Counsel (D/1482/2012)",
      email: "lawyer@chambers.in",
      pass: "lawyer123",
      headline: "Full Chamber Command & Cause List Calling Board",
      scope: "Oversee active Vakalatnamas, High Court cause lists, court hall appearances, and sanction junior drafts at the Verification Desk.",
      icon: Scale,
    },
    {
      id: "lawyer" as const,
      tag: "ADVOCATE (CHAMBER II)",
      title: "Adv. Rajeshwari Sen",
      designation: "Senior Advocate (D/2104/2015)",
      email: "sen@chambers.in",
      pass: "sen123",
      headline: "Dedicated Chamber Portfolio & Docket",
      scope: "Manage Chamber II's isolated matters, Court Room 05 cause list, and dedicated briefing associate roster.",
      icon: Scale,
    },
    {
      id: "associate" as const,
      tag: "ASSOCIATE ADVOCATE / BRIEFING COUNSEL",
      title: "Priya Sharma",
      designation: "Senior Associate Counsel",
      email: "associate@chambers.in",
      pass: "assoc123",
      headline: "Court Room Call-Overs & Draft Submissions",
      scope: "Attend daily bench call-overs, record verbatim court proceedings, and submit draft hearing updates for Senior Counsel sign-off.",
      icon: Briefcase,
    },
    {
      id: "client" as const,
      tag: "LITIGANT CLIENT PORTAL",
      title: "Rahul Verma",
      designation: "Managing Director, Verma Infra LLP",
      email: "client@chambers.in",
      pass: "client123",
      headline: "Transparent Case Docket & Counsel Advice",
      scope: "Track Next Date of Hearing (NDOH), read verbatim certified judicial orders, and submit direct inquiries to briefed counsel.",
      icon: User,
    },
    {
      id: "admin" as const,
      tag: "CHAMBER REGISTRAR & ADMINISTRATOR",
      title: "Devika Nair",
      designation: "Chamber Registrar & Practice Manager",
      email: "admin@chambers.in",
      pass: "admin123",
      headline: "Chamber Roster, Audit Trail & Security",
      scope: "Provision advocate credentials, manage multi-lawyer roster, monitor chamber dockets, and audit tamper-proof decision records.",
      icon: ShieldCheck,
    },
  ];

  const handleSelectRole = (r: (typeof ROLES)[0]) => {
    setSelectedSignInRole(r.id);
    setSignInEmail(r.email);
    setSignInPassword(r.pass);
  };

  const handleInstantLogin = async (r: (typeof ROLES)[0]) => {
    handleSelectRole(r);
    setSigningIn(true);
    await login(r.email, r.pass);
    setSigningIn(false);
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) return;
    setSigningIn(true);
    await login(signInEmail, signInPassword);
    setSigningIn(false);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword || !signUpBarEnrollment) {
      addToast("Please fill all required advocate registration fields", "error");
      return;
    }
    setSigningUp(true);
    const success = await signupLawyer({
      name: signUpName,
      email: signUpEmail,
      password: signUpPassword,
      phone: signUpPhone,
      barEnrollment: signUpBarEnrollment,
      chamberName: signUpChamberName,
      primaryCourt: signUpCourt,
    });
    setSigningUp(false);
    if (success) {
      setAuthModal(null);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingContact(true);
    setTimeout(() => {
      setSubmittingContact(false);
      setContactSubmitted(true);
      addToast("Inquiry recorded. The Registrar Desk will reach out within 2 hours.", "success");
    }, 600);
  };

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-[#0f172a] dark:text-[#f8fafc] font-sans transition-colors duration-200 selection:bg-[#1e3a8a]/20 selection:text-[#0f172a] dark:selection:text-white">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-[#111827]/95 border-b border-[#e2e8f0] dark:border-[#1e293b] shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo & Brand Identity (Digital Lawyer Diary / CounselBook) */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] dark:from-[#2563eb] dark:to-[#1e3a8a] border border-[#3b82f6]/30 flex items-center justify-center text-[#f59e0b] shadow-sm flex-shrink-0">
              <Scale className="w-5 h-5 text-[#f59e0b]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-[#0f172a] dark:text-white leading-tight">
                  CounselBook
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#eff6ff] dark:bg-[#1e293b] text-[#1d4ed8] dark:text-[#60a5fa] border border-[#dbeafe] dark:border-[#334155]">
                  Digital Lawyer Diary
                </span>
              </div>
              <span className="text-[10px] text-[#64748b] dark:text-[#94a3b8] block font-medium">
                Sovereign Advocate Diary &amp; Chamber OS
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#475569] dark:text-[#94a3b8]">
            <a href="#features" className="hover:text-[#1e3a8a] dark:hover:text-[#38bdf8] transition-colors">
              Features
            </a>
            <a href="#causelist" className="hover:text-[#1e3a8a] dark:hover:text-[#38bdf8] transition-colors">
              Daily Cause List
            </a>
            <a href="#billing" className="hover:text-[#1e3a8a] dark:hover:text-[#38bdf8] transition-colors">
              Fee Ledger
            </a>
            <a href="#howitworks" className="hover:text-[#1e3a8a] dark:hover:text-[#38bdf8] transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-[#1e3a8a] dark:hover:text-[#38bdf8] transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-[#1e3a8a] dark:hover:text-[#38bdf8] transition-colors">
              FAQ
            </a>
            <a href="#contact" className="hover:text-[#1e3a8a] dark:hover:text-[#38bdf8] transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Pill */}
            <div className="flex items-center p-0.5 rounded-lg bg-[#f1f5f9] dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155]">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  theme === "light" ? "bg-white text-[#1e3a8a] font-bold shadow-xs" : "text-[#64748b] hover:text-[#0f172a]"
                }`}
                title="Light Mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  theme === "dark" ? "bg-[#0f172a] text-[#fbbf24] font-bold shadow-xs" : "text-[#64748b] hover:text-white"
                }`}
                title="Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  theme === "system" ? "bg-white dark:bg-[#0f172a] text-[#1e3a8a] dark:text-[#38bdf8] font-bold shadow-xs" : "text-[#64748b]"
                }`}
                title="Follow System Setting"
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Universal Sign In Button (Available for all 4 roles) */}
            <button
              onClick={() => setAuthModal("signin")}
              className="px-3.5 py-2 rounded-lg bg-white dark:bg-[#1e293b] hover:bg-[#f1f5f9] dark:hover:bg-[#334155] text-[#0f172a] dark:text-[#f8fafc] border border-[#cbd5e1] dark:border-[#334155] font-semibold text-xs tracking-wide transition-all shadow-xs"
            >
              Sign In
            </button>

            {/* Advocate Sign Up Button (Lawyers ONLY) */}
            <button
              onClick={() => setAuthModal("signup")}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-[#1e3a8a] hover:bg-[#172554] dark:bg-[#2563eb] dark:hover:bg-[#1d4ed8] text-white font-bold text-xs tracking-wide transition-all shadow-sm"
              title="Registration is strictly restricted to practicing Advocates"
            >
              <Scale className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>Register as Lawyer <span className="text-[10px] font-normal opacity-90 hidden sm:inline">(Free)</span></span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#e2e8f0] dark:border-[#1e293b]">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-tr from-[#1e3a8a]/10 via-[#3b82f6]/5 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#eff6ff] dark:bg-[#1e293b] text-[#1d4ed8] dark:text-[#60a5fa] border border-[#bfdbfe] dark:border-[#334155] mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>REPLACING MANUAL PAPER REGISTERS &amp; CHAOTIC CAUSE LISTS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#0f172a] dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            The Smart Digital Diary for Modern Lawyers &amp; Chambers.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base md:text-lg text-[#475569] dark:text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            Manage your daily court cases, next hearing dates (NDOH), courtroom cause lists, client billing ledgers, and associate delegations in one unified, secure platform.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => setAuthModal("signup")}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] dark:bg-[#2563eb] dark:hover:bg-[#1d4ed8] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-md group"
            >
              <Scale className="w-4 h-4 text-[#fbbf24]" />
              <span>Register Chamber (Lawyers Only)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setAuthModal("signin")}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-[#1e293b] hover:bg-[#f1f5f9] dark:hover:bg-[#334155] text-[#0f172a] dark:text-white border border-[#cbd5e1] dark:border-[#334155] font-semibold text-xs tracking-wide transition-all shadow-sm"
            >
              Universal Sign In (All 4 Personas)
            </button>
          </div>

          {/* Feature Highlights Badges */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs">
              <span className="block text-xl md:text-2xl font-bold text-[#1e3a8a] dark:text-[#60a5fa]">
                16-Digit
              </span>
              <span className="text-[11px] font-medium text-[#64748b] dark:text-[#94a3b8] block mt-0.5">
                eCourts CNR Standard
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs">
              <span className="block text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                Today &amp; Tomorrow
              </span>
              <span className="text-[11px] font-medium text-[#64748b] dark:text-[#94a3b8] block mt-0.5">
                Cause List Calling Board
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs">
              <span className="block text-xl md:text-2xl font-bold text-[#f59e0b]">
                Client Ledger
              </span>
              <span className="text-[11px] font-medium text-[#64748b] dark:text-[#94a3b8] block mt-0.5">
                Fee &amp; Invoicing Tracker
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs">
              <span className="block text-xl md:text-2xl font-bold text-[#0f172a] dark:text-white">
                100% Secure
              </span>
              <span className="text-[11px] font-medium text-[#64748b] dark:text-[#94a3b8] block mt-0.5">
                Encrypted Chamber Vault
              </span>
            </div>
          </div>

          {/* 3. Interactive Live Digital Diary Simulator Widget (The hallmark of digitallawyerdiary.com) */}
          <div className="mt-14 max-w-4xl mx-auto text-left rounded-2xl bg-white dark:bg-[#111827] border border-[#cbd5e1] dark:border-[#1e293b] shadow-xl overflow-hidden">
            {/* Simulator Top Header with Tabs */}
            <div className="p-3 sm:p-4 bg-[#f1f5f9] dark:bg-[#0f172a] border-b border-[#e2e8f0] dark:border-[#1e293b] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-[#0f172a] dark:text-white ml-2">
                  CounselBook Live Chamber Docket Preview
                </span>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 bg-white dark:bg-[#1e293b] p-1 rounded-lg border border-[#cbd5e1] dark:border-[#334155] text-xs">
                <button
                  type="button"
                  onClick={() => setSimulatorTab("today")}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    simulatorTab === "today"
                      ? "bg-[#1e3a8a] text-white shadow-xs"
                      : "text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a]"
                  }`}
                >
                  Today's Hearings
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatorTab("tomorrow")}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    simulatorTab === "tomorrow"
                      ? "bg-[#1e3a8a] text-white shadow-xs"
                      : "text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a]"
                  }`}
                >
                  Tomorrow's Board
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatorTab("billing")}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    simulatorTab === "billing"
                      ? "bg-[#1e3a8a] text-white shadow-xs"
                      : "text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a]"
                  }`}
                >
                  Fee Ledger
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatorTab("search")}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    simulatorTab === "search"
                      ? "bg-[#1e3a8a] text-white shadow-xs"
                      : "text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a]"
                  }`}
                >
                  CNR Search
                </button>
              </div>
            </div>

            {/* Simulator Content Area */}
            <div className="p-4 sm:p-6">
              {/* Tab 1: Today's Hearings */}
              {simulatorTab === "today" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] dark:border-[#1e293b]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#1e3a8a] dark:text-[#60a5fa]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0f172a] dark:text-white">
                        Today's Court Board (2 Matters Listed)
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <span className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                      Delhi High Court &amp; District Courts
                    </span>
                  </div>

                  {/* Case 1 Listed Today */}
                  <div className="p-4 rounded-xl border border-[#cbd5e1] dark:border-[#1e293b] hover:border-[#1e3a8a] transition-all bg-[#f8fafc] dark:bg-[#161f30]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]">
                            Item No. 18
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            Court Room 14
                          </span>
                          <span className="font-mono text-xs font-bold text-[#0f172a] dark:text-white">
                            CS(OS) 442/2024
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#0f172a] dark:text-white mt-1.5">
                          Rahul Verma v. Kapoor Constructions Pvt. Ltd. &amp; Ors.
                        </h4>
                        <p className="text-xs text-[#475569] dark:text-[#94a3b8] mt-0.5">
                          High Court of Delhi · Hon'ble Mr. Justice S. Khanna
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="inline-block px-2 py-1 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          PW-1 Cross-Examination
                        </span>
                        <span className="text-[11px] font-mono text-[#64748b] dark:text-[#94a3b8] block mt-1">
                          CNR: DLHC01-004421-2024
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Case 2 Listed Today */}
                  <div className="p-4 rounded-xl border border-[#cbd5e1] dark:border-[#1e293b] hover:border-[#1e3a8a] transition-all bg-[#f8fafc] dark:bg-[#161f30]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]">
                            Item No. 07
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            Court Room 09
                          </span>
                          <span className="font-mono text-xs font-bold text-[#0f172a] dark:text-white">
                            W.P.(C) 8920/2024
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#0f172a] dark:text-white mt-1.5">
                          Arora &amp; Ors. v. Delhi Development Authority (DDA)
                        </h4>
                        <p className="text-xs text-[#475569] dark:text-[#94a3b8] mt-0.5">
                          High Court of Delhi · Hon'ble Mr. Justice D.K. Sharma
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="inline-block px-2 py-1 rounded text-[11px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                          Interim Stay Motion
                        </span>
                        <span className="text-[11px] font-mono text-[#64748b] dark:text-[#94a3b8] block mt-1">
                          CNR: DLHC01-008920-2024
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Tomorrow's Board */}
              {simulatorTab === "tomorrow" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] dark:border-[#1e293b]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#1e3a8a] dark:text-[#60a5fa]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0f172a] dark:text-white">
                        Advance Board for Tomorrow (1 Matter Listed)
                      </span>
                    </div>
                    <span className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                      Commercial Division
                    </span>
                  </div>

                  <div className="p-4 rounded-xl border border-[#cbd5e1] dark:border-[#1e293b] hover:border-[#1e3a8a] transition-all bg-[#f8fafc] dark:bg-[#161f30]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]">
                            Item No. 04
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            Court Room 22
                          </span>
                          <span className="font-mono text-xs font-bold text-[#0f172a] dark:text-white">
                            ARB.P. 118/2025
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#0f172a] dark:text-white mt-1.5">
                          Sunrise Textiles Pvt. Ltd. v. Meridian Global Exports LLP
                        </h4>
                        <p className="text-xs text-[#475569] dark:text-[#94a3b8] mt-0.5">
                          Commercial Arbitration · Hon'ble Mr. Justice R. Menon
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="inline-block px-2 py-1 rounded text-[11px] font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                          Section 11 Sole Arbitrator
                        </span>
                        <span className="text-[11px] font-mono text-[#64748b] dark:text-[#94a3b8] block mt-1">
                          CNR: DLHC01-001180-2025
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Client Fee Ledger */}
              {simulatorTab === "billing" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] dark:border-[#1e293b]">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0f172a] dark:text-white">
                        Case-Linked Fee &amp; Invoicing Ledger
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹75,000 Outstanding Dues
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#eff6ff] dark:bg-[#1e293b] border border-[#bfdbfe] dark:border-[#334155]">
                      <span className="text-[10px] font-semibold text-[#1e3a8a] dark:text-[#60a5fa] block uppercase">
                        Agreed Retainer
                      </span>
                      <span className="text-xl font-bold text-[#0f172a] dark:text-white mt-0.5 block">
                        ₹2,50,000
                      </span>
                      <span className="text-[10px] text-[#64748b] dark:text-[#94a3b8]">Under Vakalatnama</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-[#14231b] border border-emerald-200 dark:border-emerald-800/40">
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 block uppercase">
                        Received to Date
                      </span>
                      <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-0.5 block">
                        ₹1,75,000
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">2 Verified Receipts</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-[#282212] border border-amber-200 dark:border-amber-800/40">
                      <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-400 block uppercase">
                        Balance Payable
                      </span>
                      <span className="text-xl font-bold text-amber-800 dark:text-amber-300 mt-0.5 block">
                        ₹75,000
                      </span>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400">Due at Evidence Stage</span>
                    </div>
                  </div>

                  {/* Sample Receipt Row */}
                  <div className="p-3 rounded-lg bg-[#f8fafc] dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#1e293b] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-mono font-bold text-[#0f172a] dark:text-white">REC-2026-0042</span>
                        <span className="text-[#64748b] dark:text-[#94a3b8] ml-2">Retainer upon Vakalatnama</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#0f172a] dark:text-white">₹1,00,000</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Paid via NEFT
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: CNR Quick Search */}
              {simulatorTab === "search" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] dark:border-[#1e293b]">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#1e3a8a] dark:text-[#60a5fa]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0f172a] dark:text-white">
                        Smart 16-Digit CNR Instant Search
                      </span>
                    </div>
                    <span className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                      Millisecond Retrieval
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search by 16-Digit CNR (e.g. DLHC01-004421-2024)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] dark:border-[#334155] bg-[#f8fafc] dark:bg-[#161f30] text-xs font-mono text-[#0f172a] dark:text-white focus:outline-none focus:border-[#1e3a8a]"
                      />
                    </div>
                    <button
                      onClick={() => setSearchQuery("DLHC01-004421-2024")}
                      className="px-3 py-2 rounded-xl bg-[#eff6ff] text-[#1d4ed8] text-xs font-semibold border border-[#bfdbfe]"
                    >
                      Fill Sample
                    </button>
                  </div>

                  {searchQuery ? (
                    <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-[#14231b]">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block uppercase">
                        ✓ Case Record Matched
                      </span>
                      <h4 className="text-sm font-bold text-[#0f172a] dark:text-white mt-1">
                        CS(OS) 442/2024 · Rahul Verma v. Kapoor Constructions Pvt. Ltd.
                      </h4>
                      <p className="text-xs text-[#475569] dark:text-[#94a3b8] mt-0.5">
                        Court Room 14 · Next Hearing: Today · Stage: Plaintiff Evidence
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-[#64748b] dark:text-[#94a3b8] border border-dashed border-[#cbd5e1] dark:border-[#334155] rounded-xl">
                      Type any CNR, party name, or court number to test instant live search.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Simulator Bottom Bar */}
            <div className="p-3 bg-[#f8fafc] dark:bg-[#0f172a] border-t border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between text-xs">
              <span className="text-[#64748b] dark:text-[#94a3b8]">
                Ready to digitize your paper diary?
              </span>
              <button
                onClick={() => setAuthModal("signup")}
                className="font-bold text-[#1e3a8a] dark:text-[#60a5fa] hover:underline"
              >
                Register Your Chamber Free →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features Section (The 6 Pillars from digitallawyerdiary.com) */}
      <section id="features" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 border-b border-[#e2e8f0] dark:border-[#1e293b]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a] dark:text-[#60a5fa]">
            PRACTICE FEATURES
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f172a] dark:text-white mt-2 tracking-tight">
            Everything Your Law Chamber Needs to Operate Seamlessly.
          </h2>
          <p className="text-sm text-[#475569] dark:text-[#94a3b8] mt-3">
            Designed specifically to replace physical notebooks, paper cause lists, and scattered Excel sheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs hover:border-[#1e3a8a] dark:hover:border-[#38bdf8] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#eff6ff] dark:bg-[#1e293b] text-[#1d4ed8] dark:text-[#60a5fa] flex items-center justify-center font-bold text-xs mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0f172a] dark:text-white">
              Smart Case Diary &amp; Lifecycle History
            </h3>
            <p className="text-xs text-[#475569] dark:text-[#94a3b8] leading-relaxed mt-2.5">
              Record court, judge, stage, client, opposite party, and case number once. Maintain a complete chronological audit trail of all previous orders, adjournments, and procedural stages.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs hover:border-[#1e3a8a] dark:hover:border-[#38bdf8] transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#14231b] text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0f172a] dark:text-white">
              Daily Cause Lists &amp; Hearing Reminders
            </h3>
            <p className="text-xs text-[#475569] dark:text-[#94a3b8] leading-relaxed mt-2.5">
              Auto-generates your "Today" and "Tomorrow" boards. Track Item Numbers, Court Rooms, and pass-overs across multiple courts so no matter is missed before leaving chambers.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs hover:border-[#1e3a8a] dark:hover:border-[#38bdf8] transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-[#282212] text-amber-800 dark:text-amber-400 flex items-center justify-center font-bold text-xs mb-4">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0f172a] dark:text-white">
              Client Fee &amp; Invoicing Ledger
            </h3>
            <p className="text-xs text-[#475569] dark:text-[#94a3b8] leading-relaxed mt-2.5">
              Financial accounting built directly into every case file. Log agreed retainers, advance payments, pending balances, and generate instant printable fee receipts.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs hover:border-[#1e3a8a] dark:hover:border-[#38bdf8] transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-[#20182b] text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold text-xs mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0f172a] dark:text-white">
              Chamber &amp; Junior Collaboration
            </h3>
            <p className="text-xs text-[#475569] dark:text-[#94a3b8] leading-relaxed mt-2.5">
              Senior Advocates delegate cases to junior associates and clerks. Juniors submit hearing notes for Senior verification before the record is locked.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs hover:border-[#1e3a8a] dark:hover:border-[#38bdf8] transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#152336] text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-xs mb-4">
              <FolderLock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0f172a] dark:text-white">
              Document Locker &amp; Citations
            </h3>
            <p className="text-xs text-[#475569] dark:text-[#94a3b8] leading-relaxed mt-2.5">
              Store scanned Vakalatnamas, plaints, evidence affidavits, and certified High Court Neutral Citations (e.g. <code>2026:DHC:8412</code>) linked directly to the case.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs hover:border-[#1e3a8a] dark:hover:border-[#38bdf8] transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-[#142323] text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold text-xs mb-4">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0f172a] dark:text-white">
              Courtroom Ready &amp; Multi-Device Sync
            </h3>
            <p className="text-xs text-[#475569] dark:text-[#94a3b8] leading-relaxed mt-2.5">
              Access your chamber diary from your phone, iPad, or office desktop. Responsive, lightning-fast, and designed to work smoothly inside court corridors.
            </p>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section (4 Steps) */}
      <section id="howitworks" className="py-16 md:py-24 bg-white dark:bg-[#0f172a] border-b border-[#e2e8f0] dark:border-[#1e293b]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a] dark:text-[#60a5fa]">
              SIMPLE ONBOARDING
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f172a] dark:text-white mt-2 tracking-tight">
              How Digital Lawyer Diary Works.
            </h2>
            <p className="text-sm text-[#475569] dark:text-[#94a3b8] mt-3">
              Transitioning from a traditional paper register to a digital chamber takes less than 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#f8fafc] dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] relative">
              <span className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs mb-4">
                1
              </span>
              <h4 className="text-sm font-bold text-[#0f172a] dark:text-white">
                Register Chamber
              </h4>
              <p className="text-xs text-[#475569] dark:text-[#94a3b8] mt-2 leading-relaxed">
                Enter your State Bar Council Enrolment No. (e.g. D/1482/2012) and initialize your encrypted chamber vault.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8fafc] dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] relative">
              <span className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs mb-4">
                2
              </span>
              <h4 className="text-sm font-bold text-[#0f172a] dark:text-white">
                Log Cases &amp; CNRs
              </h4>
              <p className="text-xs text-[#475569] dark:text-[#94a3b8] mt-2 leading-relaxed">
                Add your active court matters with 16-digit CNR, bench, court room, judge, and client contact details.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8fafc] dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] relative">
              <span className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs mb-4">
                3
              </span>
              <h4 className="text-sm font-bold text-[#0f172a] dark:text-white">
                Track Cause Lists
              </h4>
              <p className="text-xs text-[#475569] dark:text-[#94a3b8] mt-2 leading-relaxed">
                View automatically grouped "Today" and "Tomorrow" cause lists on your phone before heading to court.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8fafc] dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] relative">
              <span className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs mb-4">
                4
              </span>
              <h4 className="text-sm font-bold text-[#0f172a] dark:text-white">
                Issue Receipts &amp; Fees
              </h4>
              <p className="text-xs text-[#475569] dark:text-[#94a3b8] mt-2 leading-relaxed">
                Record fee payments, track pending client balances, and generate professional receipts in one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Transparent Pricing Plans (matching digitallawyerdiary.com structure) */}
      <section id="pricing" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 border-b border-[#e2e8f0] dark:border-[#1e293b]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a] dark:text-[#60a5fa]">
            TRANSPARENT PLANS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f172a] dark:text-white mt-2 tracking-tight">
            Plans for Solo Advocates and Growing Chambers.
          </h2>
          <p className="text-sm text-[#475569] dark:text-[#94a3b8] mt-3">
            Get started completely free. Upgrade only when you expand your chamber team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan 1: Solo Advocate */}
          <div className="p-7 rounded-2xl bg-white dark:bg-[#111827] border border-[#cbd5e1] dark:border-[#1e293b] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-[#64748b] dark:text-[#94a3b8] tracking-wider block">
                Solo Practitioner
              </span>
              <h3 className="text-xl font-bold text-[#0f172a] dark:text-white mt-1">
                Individual Advocate
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#0f172a] dark:text-white">₹0</span>
                <span className="text-xs text-[#64748b] dark:text-[#94a3b8]">/ free forever</span>
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94a3b8] mt-2">
                Ideal for individual litigators managing their own daily diary and client docket.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-[#334155] dark:text-[#cbd5e1]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>1 Advocate Account</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Up to 50 Active Matters</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Daily Cause List (Today &amp; Tomorrow)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Client Fee &amp; Receipt Ledger</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Mobile &amp; Web Synchronization</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setAuthModal("signup")}
              className="mt-8 w-full py-2.5 rounded-xl border border-[#cbd5e1] dark:border-[#334155] font-bold text-xs text-[#0f172a] dark:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b] transition-all"
            >
              Get Started Free
            </button>
          </div>

          {/* Plan 2: Chamber Pro (Highlighted) */}
          <div className="p-7 rounded-2xl bg-white dark:bg-[#111827] border-2 border-[#1e3a8a] dark:border-[#3b82f6] shadow-lg flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold bg-[#1e3a8a] text-white uppercase tracking-wider">
              Most Popular for Chambers
            </div>

            <div>
              <span className="text-xs font-bold uppercase text-[#1e3a8a] dark:text-[#60a5fa] tracking-wider block">
                Multi-User Firm
              </span>
              <h3 className="text-xl font-bold text-[#0f172a] dark:text-white mt-1">
                Chamber Pro
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#0f172a] dark:text-white">₹1,499</span>
                <span className="text-xs text-[#64748b] dark:text-[#94a3b8]">/ month per chamber</span>
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94a3b8] mt-2">
                For Senior Advocates working with associates, juniors, and chamber clerks.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-[#334155] dark:text-[#cbd5e1]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Up to 5 Advocates &amp; Briefing Associates</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Unlimited Active Case Dockets</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Two-Tier Senior Verification Desk</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Limitation Act 1963 Statutory Radar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Litigant Client Read-Only Portal</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>10 GB Encrypted Document Vault</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setAuthModal("signup")}
              className="mt-8 w-full py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] dark:bg-[#2563eb] dark:hover:bg-[#1d4ed8] text-white font-bold text-xs tracking-wide transition-all shadow-md"
            >
              Start Free Chamber Trial
            </button>
          </div>

          {/* Plan 3: Law Firm / Senior Counsel */}
          <div className="p-7 rounded-2xl bg-white dark:bg-[#111827] border border-[#cbd5e1] dark:border-[#1e293b] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-[#64748b] dark:text-[#94a3b8] tracking-wider block">
                Enterprise Practice
              </span>
              <h3 className="text-xl font-bold text-[#0f172a] dark:text-white mt-1">
                Senior Counsel / Firm
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#0f172a] dark:text-white">Custom</span>
                <span className="text-xs text-[#64748b] dark:text-[#94a3b8]">/ tailored pricing</span>
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94a3b8] mt-2">
                For designated Senior Advocates and large litigation firms with multiple benches.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-[#334155] dark:text-[#cbd5e1]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Unlimited Advocates &amp; Retained Clients</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Dedicated Encrypted Database Partition</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Custom Tribunal &amp; Bench Integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Priority 24/7 Chamber Registrar Desk</span>
                </li>
              </ul>
            </div>

            <a
              href="#contact"
              className="mt-8 w-full py-2.5 rounded-xl border border-[#cbd5e1] dark:border-[#334155] font-bold text-xs text-center text-[#0f172a] dark:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b] transition-all block"
            >
              Contact Registry Desk
            </a>
          </div>
        </div>
      </section>

      {/* 7. Advocate Testimonials */}
      <section className="py-16 bg-[#f1f5f9] dark:bg-[#0f172a] border-b border-[#e2e8f0] dark:border-[#1e293b]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a] dark:text-[#60a5fa]">
              TESTIMONIALS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white mt-1">
              Trusted by Advocates Across High Courts &amp; District Courts.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs">
              <p className="text-xs text-[#334155] dark:text-[#cbd5e1] leading-relaxed italic">
                "For years, my clerk maintained a massive paper diary that tore and went missing before vacations. CounselBook replaced all of that. Having Today and Tomorrow's cause list on my phone in court is invaluable."
              </p>
              <div className="mt-4 pt-4 border-t border-[#e2e8f0] dark:border-[#1e293b] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs">
                  SK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0f172a] dark:text-white">Adv. Suresh K. Grover</h4>
                  <span className="text-[10px] text-[#64748b] dark:text-[#94a3b8]">Delhi High Court (D/892/2004)</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs">
              <p className="text-xs text-[#334155] dark:text-[#cbd5e1] leading-relaxed italic">
                "The two-tier verification desk is revolutionary for my chamber. My juniors draft the hearing outcome right from the courtroom, and I sign off on it with one tap. No more mixed-up dates."
              </p>
              <div className="mt-4 pt-4 border-t border-[#e2e8f0] dark:border-[#1e293b] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                  MN
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0f172a] dark:text-white">Adv. Manisha Nadkarni</h4>
                  <span className="text-[10px] text-[#64748b] dark:text-[#94a3b8]">Bombay High Court (MAH/1420/2011)</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1e293b] shadow-xs">
              <p className="text-xs text-[#334155] dark:text-[#cbd5e1] leading-relaxed italic">
                "The fee ledger alongside the case brief prevents awkward billing disputes. Clients see their advance payments and receipts transparently, which preserves professional trust."
              </p>
              <div className="mt-4 pt-4 border-t border-[#e2e8f0] dark:border-[#1e293b] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#d97706] text-white flex items-center justify-center font-bold text-xs">
                  TB
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0f172a] dark:text-white">Adv. Tushar Banerjee</h4>
                  <span className="text-[10px] text-[#64748b] dark:text-[#94a3b8]">Calcutta High Court (WB/612/2015)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions (FAQ) Section */}
      <section id="faq" className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 border-b border-[#e2e8f0] dark:border-[#1e293b]">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a] dark:text-[#60a5fa]">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white mt-1">
            Common Inquiries by Practicing Advocates.
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Is my chamber and client data confidential?",
              a: "Absolutely. CounselBook uses air-gapped, encrypted database partitioning. Opposing counsels or outside advocates cannot query, search, or view your chamber's active matters, client advice, or fee ledgers.",
            },
            {
              q: "Does CounselBook comply with Bar Council of India (BCI) Rule 36?",
              a: "Yes, strictly. CounselBook is a practice management and chamber operating system. It does not solicit clients, display advertisements, or rank advocates. Sign-up is restricted to enrolled lawyers.",
            },
            {
              q: "Can my junior associates and chamber clerk update hearing dates?",
              a: "Yes. In the Chamber Pro plan, junior associates can log verbatim court proceedings and propose the Next Date of Hearing (NDOH). These submissions enter the Senior Advocate's Verification Desk for final sign-off.",
            },
            {
              q: "Does it support the 16-character eCourts CNR number format?",
              a: "Yes. Every matter features full support for the 16-character Case Natural Record (e.g. DLHC01-004421-2024), enabling unified tracking across High Courts, District Courts, and Tribunals.",
            },
            {
              q: "Can I print or export my Daily Cause List as a PDF?",
              a: "Yes. CounselBook provides a 1-click printable cause list formatted specifically for chamber boards, court bags, and sharing with briefing counsels.",
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#cbd5e1] dark:border-[#1e293b] bg-white dark:bg-[#111827] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFaq(i)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-[#0f172a] dark:text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#64748b] transition-transform ${
                    activeFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeFaq === i && (
                <div className="px-4 pb-4 pt-1 text-xs text-[#475569] dark:text-[#94a3b8] leading-relaxed border-t border-[#e2e8f0] dark:border-[#1e293b]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Contact Us & Registry Concierge Desk */}
      <section id="contact" className="py-16 md:py-24 bg-[#f8fafc] dark:bg-[#0b0f19] border-b border-[#e2e8f0] dark:border-[#1e293b]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a] dark:text-[#60a5fa]">
              COMMUNICATION &amp; SUPPORT
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white mt-1">
              Contact the Chamber Registrar Desk.
            </h2>
            <p className="text-sm text-[#475569] dark:text-[#94a3b8] mt-2">
              Reach our technical team for custom chamber onboarding or integration inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 5 Cols: Contact Information */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#cbd5e1] dark:border-[#1e293b] shadow-xs space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#1e3a8a] dark:text-[#60a5fa] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase text-[#0f172a] dark:text-white">
                      Chamber Registry Headquarters
                    </h4>
                    <p className="text-xs text-[#475569] dark:text-[#94a3b8] mt-1 leading-relaxed">
                      Chamber Block II, Sher Shah Road / Bhagwan Das Road<br />
                      Opposite Delhi High Court &amp; Supreme Court of India<br />
                      New Delhi 110001
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e2e8f0] dark:border-[#1e293b] flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#1e3a8a] dark:text-[#60a5fa] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase text-[#0f172a] dark:text-white">
                      Registrar Email
                    </h4>
                    <p className="text-xs font-mono text-[#1e3a8a] dark:text-[#60a5fa] mt-1">
                      registrar@counselbook.in
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e2e8f0] dark:border-[#1e293b] flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#1e3a8a] dark:text-[#60a5fa] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase text-[#0f172a] dark:text-white">
                      Chamber Helpdesk Line
                    </h4>
                    <p className="text-xs font-mono text-[#0f172a] dark:text-white mt-1">
                      +91 11 2338 0000
                    </p>
                    <p className="text-[11px] text-[#64748b] dark:text-[#94a3b8]">
                      Mon – Sat: 08:30 AM to 08:00 PM IST
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 dark:bg-[#152336] border border-blue-200 dark:border-blue-800/40">
                <span className="text-[10px] font-bold text-[#1e3a8a] dark:text-[#60a5fa] uppercase block">
                  ADVOCATE ONBOARDING NOTE
                </span>
                <p className="text-xs text-[#334155] dark:text-[#cbd5e1] mt-1 leading-relaxed">
                  Advocates can self-register immediately via the <strong>Register as Lawyer</strong> portal above using their State Bar Council enrolment number.
                </p>
              </div>
            </div>

            {/* Right 7 Cols: Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111827] border border-[#cbd5e1] dark:border-[#1e293b] shadow-xs">
                <h3 className="text-base font-bold text-[#0f172a] dark:text-white mb-4">
                  Send Inquiry to Registrar Desk
                </h3>

                {contactSubmitted ? (
                  <div className="p-6 text-center rounded-xl bg-emerald-50 dark:bg-[#14231b] border border-emerald-200 dark:border-emerald-800/40">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-[#0f172a] dark:text-white">
                      Inquiry Dispatched to Chamber Registrar
                    </h4>
                    <p className="text-xs text-[#475569] dark:text-[#94a3b8] mt-1 max-w-md mx-auto">
                      Thank you, {contactName || "Counsel"}. Our technical representative will reach out shortly.
                    </p>
                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="mt-4 text-xs font-bold text-[#1e3a8a] dark:text-[#60a5fa] underline"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-[#475569] dark:text-[#94a3b8] mb-1">
                          Advocate Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Adv. Rohit Singhania"
                          className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#334155] text-[#0f172a] dark:text-white text-xs focus:outline-none focus:border-[#1e3a8a]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#475569] dark:text-[#94a3b8] mb-1">
                          Chamber / Firm Name
                        </label>
                        <input
                          type="text"
                          value={contactChamber}
                          onChange={(e) => setContactChamber(e.target.value)}
                          placeholder="Singhania Law Chambers"
                          className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#334155] text-[#0f172a] dark:text-white text-xs focus:outline-none focus:border-[#1e3a8a]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-[#475569] dark:text-[#94a3b8] mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="counsel@singhania.in"
                          className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#334155] text-[#0f172a] dark:text-white text-xs focus:outline-none focus:border-[#1e3a8a]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#475569] dark:text-[#94a3b8] mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+91 98110 00000"
                          className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#334155] text-[#0f172a] dark:text-white text-xs focus:outline-none focus:border-[#1e3a8a]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#475569] dark:text-[#94a3b8] mb-1">
                        Primary Court of Practice
                      </label>
                      <select
                        value={contactCourt}
                        onChange={(e) => setContactCourt(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#334155] text-[#0f172a] dark:text-white text-xs focus:outline-none focus:border-[#1e3a8a]"
                      >
                        <option value="High Court of Delhi">High Court of Delhi</option>
                        <option value="Supreme Court of India">Supreme Court of India</option>
                        <option value="Bombay High Court">Bombay High Court</option>
                        <option value="Calcutta High Court">Calcutta High Court</option>
                        <option value="NCLT / NCLAT">NCLT / NCLAT</option>
                        <option value="District & Sessions Courts">District &amp; Sessions Courts</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#475569] dark:text-[#94a3b8] mb-1">
                        Message
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Inquire regarding chamber onboarding, team expansion, or custom docket needs..."
                        className="w-full p-3 rounded-xl bg-[#f8fafc] dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#334155] text-xs text-[#0f172a] dark:text-white focus:outline-none focus:border-[#1e3a8a]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingContact}
                      className="w-full py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] dark:bg-[#2563eb] text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingContact ? "Dispatching..." : "Send Communication"}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Clean Legal Footer */}
      <footer className="border-t border-[#e2e8f0] dark:border-[#1e293b] bg-white dark:bg-[#0a0e1a] text-[#64748b] dark:text-[#94a3b8] py-12 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#e2e8f0] dark:border-[#1e293b]">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1e3a8a] flex items-center justify-center text-[#fbbf24]">
                  <Scale className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold tracking-tight text-[#0f172a] dark:text-white">
                  CounselBook
                </span>
              </div>
              <p className="text-xs leading-relaxed">
                The smart case management and digital lawyer diary operating system for Indian advocates, chambers, and retained clients.
              </p>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider text-[#0f172a] dark:text-white mb-3">
                Features
              </h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-[#1e3a8a] dark:hover:text-[#38bdf8]">Smart Case Diary</a></li>
                <li><a href="#features" className="hover:text-[#1e3a8a] dark:hover:text-[#38bdf8]">Today &amp; Tomorrow Cause List</a></li>
                <li><a href="#features" className="hover:text-[#1e3a8a] dark:hover:text-[#38bdf8]">Client Fee &amp; Billing Ledger</a></li>
                <li><a href="#features" className="hover:text-[#1e3a8a] dark:hover:text-[#38bdf8]">Junior Verification Desk</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider text-[#0f172a] dark:text-white mb-3">
                Chamber Portals
              </h4>
              <ul className="space-y-2">
                <li><button onClick={() => setAuthModal("signup")} className="hover:text-[#1e3a8a] dark:hover:text-[#38bdf8] text-left">Advocate Sign Up (Lawyers Only)</button></li>
                <li><button onClick={() => setAuthModal("signin")} className="hover:text-[#1e3a8a] dark:hover:text-[#38bdf8] text-left">Senior Counsel Sign In</button></li>
                <li><button onClick={() => setAuthModal("signin")} className="hover:text-[#1e3a8a] dark:hover:text-[#38bdf8] text-left">Associate Briefing Desk</button></li>
                <li><button onClick={() => setAuthModal("signin")} className="hover:text-[#1e3a8a] dark:hover:text-[#38bdf8] text-left">Litigant Client Access</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider text-[#0f172a] dark:text-white mb-3">
                BCI Compliance
              </h4>
              <p className="text-xs leading-relaxed">
                Adhering strictly to Rule 36 of Bar Council of India Standards of Professional Conduct. Provisioned solely for credentialed legal chambers and their retained clients under Vakalatnama.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <span>© 2026 CounselBook Sovereign Technologies. All rights reserved.</span>
            <span>Digital Lawyer Diary &amp; Chamber Operating System</span>
          </div>
        </div>
      </footer>

      {/* 11. Modal A: Universal Sign In (Available for ALL: Lawyer, Associate, Client, Admin) */}
      {authModal === "signin" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#111827] border border-[#cbd5e1] dark:border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-[#f8fafc] dark:bg-[#0f172a] border-b border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1e3a8a] text-[#fbbf24] flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0f172a] dark:text-white">
                    Sign In to Chamber Diary
                  </h3>
                  <span className="text-[11px] text-[#64748b] dark:text-[#94a3b8]">
                    Available for all Lawyers, Associates, Clients &amp; Registrars
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAuthModal(null)}
                className="p-1 rounded-lg text-[#64748b] hover:text-[#0f172a] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {/* 4 Role Selector Tabs for 1-Click Instant Demo Entry */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8] block mb-2">
                  1-Click Instant Persona Sign-In:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.email}
                      type="button"
                      onClick={() => handleInstantLogin(r)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        signInEmail === r.email
                          ? "bg-[#eff6ff] dark:bg-[#1e293b] border-[#1e3a8a] dark:border-[#3b82f6] text-[#0f172a] dark:text-white"
                          : "bg-[#f8fafc] dark:bg-[#161f30] border-[#cbd5e1] dark:border-[#334155] hover:border-[#1e3a8a]"
                      }`}
                    >
                      <span className="text-[10px] font-bold text-[#1e3a8a] dark:text-[#60a5fa] block uppercase">
                        {r.id}
                      </span>
                      <span className="text-xs font-bold text-[#0f172a] dark:text-white block truncate mt-0.5">
                        {r.title}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#1d4ed8] dark:text-[#60a5fa] mt-2 font-semibold">
                        <Zap className="w-2.5 h-2.5 fill-current" /> Instant Entry
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Or Enter Custom Credentials Form */}
              <div className="pt-3 border-t border-[#e2e8f0] dark:border-[#1e293b]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8] block mb-3">
                  Or Sign In with Email &amp; Password
                </span>
                <form onSubmit={handleSignInSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] dark:text-[#94a3b8] mb-1">
                      Chamber Email
                    </label>
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#334155] text-[#0f172a] dark:text-white text-xs font-mono focus:outline-none focus:border-[#1e3a8a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#475569] dark:text-[#94a3b8] mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#334155] text-[#0f172a] dark:text-white text-xs font-mono focus:outline-none focus:border-[#1e3a8a]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={signingIn}
                    className="w-full py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] dark:bg-[#2563eb] text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
                  >
                    <span>{signingIn ? "Verifying..." : "Sign In to Chamber Diary"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Note for Lawyers looking for signup */}
              <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#161f30] border border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between text-xs">
                <span className="text-[#64748b] dark:text-[#94a3b8]">
                  Are you an Advocate without a chamber yet?
                </span>
                <button
                  type="button"
                  onClick={() => setAuthModal("signup")}
                  className="font-bold text-[#1e3a8a] dark:text-[#60a5fa] hover:underline ml-2"
                >
                  Advocate Sign Up →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12. Modal B: Advocate Sign Up (Strictly LAWYERS ONLY) */}
      {authModal === "signup" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/70 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#111827] border border-[#cbd5e1] dark:border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header with Lawyers Only Pill */}
            <div className="p-4 sm:p-5 bg-[#eff6ff] dark:bg-[#0f172a] border-b border-[#bfdbfe] dark:border-[#1e293b] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center shadow-xs">
                  <Scale className="w-5 h-5 text-[#fbbf24]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#0f172a] dark:text-white">
                      Advocate Chamber Registration
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#1e3a8a] text-white">
                      Lawyers Only
                    </span>
                  </div>
                  <span className="text-[11px] text-[#1d4ed8] dark:text-[#60a5fa]">
                    Restricted to Advocates enrolled with Bar Council of India or State Bar Councils
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAuthModal(null)}
                className="p-1 rounded-lg text-[#64748b] hover:text-[#0f172a] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSignUpSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-[#94a3b8] mb-1">
                    Advocate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Adv. Vikramaditya Sen"
                    className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#334155] text-[#0f172a] dark:text-white text-xs focus:outline-none focus:border-[#1e3a8a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-[#94a3b8] mb-1">
                    Bar Council Enrolment No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={signUpBarEnrollment}
                    onChange={(e) => setSignUpBarEnrollment(e.target.value)}
                    placeholder="e.g. D/1482/2012 or MAH/1940/2016"
                    className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#334155] text-[#0f172a] dark:text-white text-xs font-mono focus:outline-none focus:border-[#1e3a8a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-[#94a3b8] mb-1">
                    Chamber / Practice Name
                  </label>
                  <input
                    type="text"
                    value={signUpChamberName}
                    onChange={(e) => setSignUpChamberName(e.target.value)}
                    placeholder="Sen Law Chambers"
                    className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#334155] text-[#0f172a] dark:text-white text-xs focus:outline-none focus:border-[#1e3a8a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-[#94a3b8] mb-1">
                    Primary Court of Practice
                  </label>
                  <select
                    value={signUpCourt}
                    onChange={(e) => setSignUpCourt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#334155] text-[#0f172a] dark:text-white text-xs focus:outline-none focus:border-[#1e3a8a]"
                  >
                    <option value="High Court of Delhi">High Court of Delhi</option>
                    <option value="Supreme Court of India">Supreme Court of India</option>
                    <option value="Bombay High Court">Bombay High Court</option>
                    <option value="Calcutta High Court">Calcutta High Court</option>
                    <option value="NCLT / NCLAT">NCLT / NCLAT</option>
                    <option value="District & Sessions Courts">District &amp; Sessions Courts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-[#94a3b8] mb-1">
                    Chamber Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="sen@chambers.in"
                    className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#334155] text-[#0f172a] dark:text-white text-xs font-mono focus:outline-none focus:border-[#1e3a8a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] dark:text-[#94a3b8] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    placeholder="+91 98110 00000"
                    className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#334155] text-[#0f172a] dark:text-white text-xs font-mono focus:outline-none focus:border-[#1e3a8a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] dark:text-[#94a3b8] mb-1">
                  Master Password (Min 6 chars) *
                </label>
                <input
                  type="password"
                  required
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#161f30] border border-[#cbd5e1] dark:border-[#334155] text-[#0f172a] dark:text-white text-xs font-mono focus:outline-none focus:border-[#1e3a8a]"
                />
              </div>

              {/* Declaration */}
              <div className="p-3 rounded-xl bg-[#eff6ff] dark:bg-[#161f30] border border-[#bfdbfe] dark:border-[#334155] text-xs text-[#1e3a8a] dark:text-[#60a5fa] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
                <span>
                  I declare that I am an Advocate duly enrolled with the Bar Council, and hereby initialize an encrypted chamber workspace on CounselBook.
                </span>
              </div>

              <button
                type="submit"
                disabled={signingUp}
                className="w-full py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] dark:bg-[#2563eb] text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
              >
                <span>{signingUp ? "Enrolling Advocate & Provisioning Chamber..." : "Enroll Chamber as Senior Advocate"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setAuthModal("signin")}
                  className="text-xs text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white"
                >
                  Already have an advocate account? <strong className="text-[#1e3a8a] dark:text-[#60a5fa]">Sign In here</strong>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
