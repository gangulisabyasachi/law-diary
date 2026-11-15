"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthSwitch from "@/components/ui/auth-switch";
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
  const { currentUser, login, signupLawyer, theme, setTheme, addToast } = useChamber();
  const router = useRouter();
  const dashboardHref = currentUser?.role === "admin" ? "/admin" : "/dashboard";

  // Modals state: null | "signin" | "signup"
  const [authModal, setAuthModal] = useState<null | "signin" | "signup">(null);

  // Universal Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

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
      addToast("Chamber inquiry received. Registrar will contact you shortly.", "success");
    }, 600);
  };

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#f3eee3] dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] font-sans transition-colors duration-300 selection:bg-[#111111] selection:text-[#f3eee3] dark:selection:bg-[#f3eee3] dark:selection:text-[#111111]">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#f3eee3]/90 dark:bg-[#111111]/90 border-b border-[#111111]/15 dark:border-[#f3eee3]/20 transition-colors">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          {/* Pure Textual Logo: LexDaily */}
          <a href="#" className="group focus:outline-none select-none inline-flex items-center">
            <span 
              className="font-clagista text-2xl sm:text-[34px] tracking-normal text-[#111111] dark:text-[#f3eee3] group-hover:opacity-85 transition-opacity select-none inline-block pl-0.5"
              style={{ fontFamily: "'Clagista', cursive, sans-serif" }}
            >
              LexDaily
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-wide text-[#111111]/70 dark:text-[#f3eee3]/60">
            <a href="#features" className="hover:text-[#111111] dark:hover:text-[#f3eee3] transition-colors">
              Chamber Features
            </a>
            <a href="#causelist" className="hover:text-[#111111] dark:hover:text-[#f3eee3] transition-colors">
              Daily Cause List
            </a>
            <a href="#billing" className="hover:text-[#111111] dark:hover:text-[#f3eee3] transition-colors">
              Fee Ledger
            </a>
            <a href="#howitworks" className="hover:text-[#111111] dark:hover:text-[#f3eee3] transition-colors">
              Chamber Protocol
            </a>
            <a href="#pricing" className="hover:text-[#111111] dark:hover:text-[#f3eee3] transition-colors">
              Investment
            </a>
            <a href="#faq" className="hover:text-[#111111] dark:hover:text-[#f3eee3] transition-colors">
              FAQ
            </a>
            <a href="#contact" className="hover:text-[#111111] dark:hover:text-[#f3eee3] transition-colors">
              Registrar Desk
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Theme Toggle: Light Mode & Dark Mode Only */}
            <div className="flex items-center p-1 rounded-xl bg-white/90 dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-semibold transition-all flex items-center gap-1.5 ${
                  theme === "light"
                    ? "bg-[#111111] text-[#f3eee3] dark:bg-[#f3eee3] dark:text-[#111111] font-bold shadow-sm"
                    : "text-[#111111]/70 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
                }`}
                title="Light Mode"
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light Mode</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-semibold transition-all flex items-center gap-1.5 ${
                  theme === "dark"
                    ? "bg-[#111111] text-[#f3eee3] dark:bg-[#f3eee3] dark:text-[#111111] font-bold shadow-sm"
                    : "text-[#111111]/70 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
                }`}
                title="Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark Mode</span>
              </button>
            </div>

            {currentUser ? (
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs tracking-wider transition-all shadow-md group"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <>
                {/* Universal Sign In Button */}
                <button
                  onClick={() => setAuthModal("signin")}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#181818] hover:bg-white/80 dark:hover:bg-[#181b22] text-[#111111] dark:text-[#f3eee3] border border-[#111111]/15 dark:border-[#f3eee3]/20 font-cinzel font-semibold text-xs tracking-wider transition-all shadow-xs"
                >
                  Sign In
                </button>

                {/* Advocate Sign Up Button (Lawyers ONLY) */}
                <button
                  onClick={() => setAuthModal("signup")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs tracking-wider transition-all shadow-md"
                  title="Registration is strictly restricted to practicing Advocates"
                >
                  <span>Sign Up</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-28 md:pb-32 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        {/* Soft Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#f3eee3]/20 to-transparent dark:from-[#f3eee3]/15 dark:via-[#111111]/0 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center relative z-10">
          {/* Trust Seal Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-cinzel font-semibold tracking-wider bg-[#ffffff] dark:bg-[#181818] text-[#111111] dark:text-[#f3eee3] border border-[#111111]/15 dark:border-[#f3eee3]/20 mb-8 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#111111] dark:text-[#f3eee3]" />
            <span>ESTABLISHED FOR SENIOR ADVOCATES &amp; PRIVATE CHAMBERS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-medium text-[#111111] dark:text-[#f3eee3] tracking-tight leading-[1.18] max-w-4xl mx-auto">
            Serene Chamber Stewardship, Reimagined for Modern Litigation.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-[#111111]/70 dark:text-[#f3eee3]/60 font-serif italic max-w-2xl mx-auto leading-relaxed">
            Replace fragmented paper diaries and turbulent courtroom mornings with a sovereign, beautifully curated chamber operating system.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {currentUser ? (
              <Link
                href={dashboardHref}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-xl group"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setAuthModal("signup")}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-xl group"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setAuthModal("signin")}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-[#181818] hover:bg-white/80 dark:hover:bg-[#181b22] text-[#111111] dark:text-[#f3eee3] border border-[#111111]/15 dark:border-[#f3eee3]/20 font-cinzel font-semibold text-xs tracking-wider transition-all shadow-xs"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Dignified Pillar Stat Tiles */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
              <span className="block text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                16-Digit
              </span>
              <span className="text-[11px] font-cinzel tracking-wider text-[#111111]/65 dark:text-[#f3eee3]/60 block mt-1 uppercase">
                eCourts CNR Standard
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
              <span className="block text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                Today &amp; Tomorrow
              </span>
              <span className="text-[11px] font-cinzel tracking-wider text-[#111111]/65 dark:text-[#f3eee3]/60 block mt-1 uppercase">
                Cause List Calling Board
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
              <span className="block text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                Private Ledger
              </span>
              <span className="text-[11px] font-cinzel tracking-wider text-[#111111]/65 dark:text-[#f3eee3]/60 block mt-1 uppercase">
                Retainer &amp; Fee Dossier
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
              <span className="block text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                Encrypted Vault
              </span>
              <span className="text-[11px] font-cinzel tracking-wider text-[#111111]/65 dark:text-[#f3eee3]/60 block mt-1 uppercase">
                Air-Gapped Confidentiality
              </span>
            </div>
          </div>

          {/* 3. Interactive Live Digital Diary Simulator Widget */}
          <div id="causelist" className="mt-16 max-w-4xl mx-auto text-left rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-2xl overflow-hidden">
            {/* Simulator Top Header with Tabs */}
            <div className="p-4 sm:p-5 bg-white/80/80 dark:bg-[#111111]/80 border-b border-[#111111]/15 dark:border-[#f3eee3]/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111111] dark:bg-[#f3eee3] animate-pulse" />
                <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3]">
                  Chamber Cause List &amp; Diary Simulator
                </span>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-[#202020] p-1 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs">
                <button
                  type="button"
                  onClick={() => setSimulatorTab("today")}
                  className={`px-3 py-1.5 rounded-lg font-cinzel text-xs font-bold transition-all ${
                    simulatorTab === "today"
                      ? "bg-[#d9541e] text-white dark:bg-[#d9541e] dark:text-white shadow-sm"
                      : "text-[#111111]/65 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
                  }`}
                >
                  Today&apos;s Board
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatorTab("tomorrow")}
                  className={`px-3 py-1.5 rounded-lg font-cinzel text-xs font-bold transition-all ${
                    simulatorTab === "tomorrow"
                      ? "bg-[#d9541e] text-white dark:bg-[#d9541e] dark:text-white shadow-sm"
                      : "text-[#111111]/65 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
                  }`}
                >
                  Tomorrow&apos;s List
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatorTab("billing")}
                  className={`px-3 py-1.5 rounded-lg font-cinzel text-xs font-bold transition-all ${
                    simulatorTab === "billing"
                      ? "bg-[#d9541e] text-white dark:bg-[#d9541e] dark:text-white shadow-sm"
                      : "text-[#111111]/65 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
                  }`}
                >
                  Fee Ledger
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatorTab("search")}
                  className={`px-3 py-1.5 rounded-lg font-cinzel text-xs font-bold transition-all ${
                    simulatorTab === "search"
                      ? "bg-[#d9541e] text-white dark:bg-[#d9541e] dark:text-white shadow-sm"
                      : "text-[#111111]/65 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
                  }`}
                >
                  CNR Radar
                </button>
              </div>
            </div>

            {/* Simulator Content Area */}
            <div className="p-5 sm:p-7">
              {/* Tab 1: Today's Hearings */}
              {simulatorTab === "today" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#111111] dark:text-[#f3eee3]" />
                      <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3]">
                        Delhi High Court Listings (2 Matters Today)
                      </span>
                    </div>
                    <span className="text-xs font-serif italic text-[#111111]/65 dark:text-[#f3eee3]/60">
                      Court Room 05 &amp; 14 · Chief Justice Bench
                    </span>
                  </div>

                  {/* Case 1 */}
                  <div className="p-4.5 rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 hover:border-[#111111] dark:hover:border-[#f3eee3] transition-all bg-white dark:bg-[#202020]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold bg-[#111111]/10 dark:bg-[#f3eee3]/15 text-[#111111] dark:text-[#f3eee3] border border-[#111111]/20 dark:border-[#f3eee3]/30">
                            Item 18 · Court 05
                          </span>
                          <span className="font-mono text-xs font-bold text-[#111111] dark:text-[#f3eee3]">
                            W.P.(C) 4120/2024
                          </span>
                          <span className="text-[10px] text-[#111111]/65 dark:text-[#f3eee3]/60 font-mono">
                            CNR: DLHC01-008129-2024
                          </span>
                        </div>
                        <h4 className="text-sm font-serif font-bold text-[#111111] dark:text-[#f3eee3] mt-1.5">
                          AeroGlide Aviation Ltd. v. Union of India &amp; Ors.
                        </h4>
                        <p className="text-xs font-serif italic text-[#111111]/65 dark:text-[#f3eee3]/60 mt-0.5">
                          Bench: Hon&apos;ble Mr. Justice Manmohan &amp; Hon&apos;ble Ms. Justice Mini Pushkarna
                        </p>
                      </div>

                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                        <span className="text-xs font-cinzel font-bold px-2.5 py-1 rounded-lg bg-[#ffffff] dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3]">
                          Arguments Stage
                        </span>
                        <span className="text-[10.5px] font-mono text-[#111111]/65 dark:text-[#f3eee3]/60 mt-1 block">
                          Adv. R. Mukherjee (Senior)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Case 2 */}
                  <div className="p-4.5 rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 hover:border-[#111111] dark:hover:border-[#f3eee3] transition-all bg-white dark:bg-[#202020]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold bg-[#ffffff] dark:bg-[#181818] text-[#111111] dark:text-[#f3eee3] border border-[#111111]/15 dark:border-[#f3eee3]/20">
                            Item 42 · Court 14
                          </span>
                          <span className="font-mono text-xs font-bold text-[#111111] dark:text-[#f3eee3]">
                            CS (COMM) 890/2023
                          </span>
                          <span className="text-[10px] text-[#111111]/65 dark:text-[#f3eee3]/60 font-mono">
                            CNR: DLHC01-019482-2023
                          </span>
                        </div>
                        <h4 className="text-sm font-serif font-bold text-[#111111] dark:text-[#f3eee3] mt-1.5">
                          Titanium Pharma Global v. Zydus Lifesciences Ltd.
                        </h4>
                        <p className="text-xs font-serif italic text-[#111111]/65 dark:text-[#f3eee3]/60 mt-0.5">
                          Commercial Division Patent Injunction · Written Statement on Record
                        </p>
                      </div>

                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                        <span className="text-xs font-cinzel font-bold px-2.5 py-1 rounded-lg bg-[#ffffff] dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3]">
                          Framing of Issues
                        </span>
                        <span className="text-[10.5px] font-mono text-[#111111]/65 dark:text-[#f3eee3]/60 mt-1 block">
                          Assigned: Adv. Ananya Deshmukh
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Tomorrow's List */}
              {simulatorTab === "tomorrow" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#111111] dark:text-[#f3eee3]" />
                      <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3]">
                        Advance Cause List (Tomorrow&apos;s Docket)
                      </span>
                    </div>
                    <span className="text-xs font-serif italic text-[#111111]/65 dark:text-[#f3eee3]/60">
                      Supreme Court of India &amp; NCLAT
                    </span>
                  </div>

                  <div className="p-4.5 rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 hover:border-[#111111] dark:hover:border-[#f3eee3] transition-all bg-white dark:bg-[#202020]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold bg-[#111111]/10 dark:bg-[#f3eee3]/15 text-[#111111] dark:text-[#f3eee3] border border-[#111111]/20 dark:border-[#f3eee3]/30">
                            Court 02 · Item 08
                          </span>
                          <span className="font-mono text-xs font-bold text-[#111111] dark:text-[#f3eee3]">
                            SLP (C) 18492/2024
                          </span>
                        </div>
                        <h4 className="text-sm font-serif font-bold text-[#111111] dark:text-[#f3eee3] mt-1.5">
                          Apex Horizon Infra v. State of Maharashtra &amp; Ors.
                        </h4>
                        <p className="text-xs font-serif italic text-[#111111]/65 dark:text-[#f3eee3]/60 mt-0.5">
                          Supreme Court of India · Challenge against High Court Division Bench Judgment
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-cinzel font-bold px-2.5 py-1 rounded-lg bg-[#ffffff] dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3]">
                          Notice Returnable
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Fee Ledger */}
              {simulatorTab === "billing" && (
                <div id="billing" className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-[#111111] dark:text-[#f3eee3]" />
                      <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3]">
                        Chamber Retainers &amp; Disbursed Fee Notes
                      </span>
                    </div>
                    <span className="text-xs font-serif italic text-[#111111]/65 dark:text-[#f3eee3]/60">
                      Instant PDF Receipts with Judicial Letterhead
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-serif font-bold text-[#111111] dark:text-[#f3eee3]">AeroGlide Aviation Ltd.</span>
                        <span className="text-[10px] font-cinzel font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">Paid</span>
                      </div>
                      <p className="text-[11px] text-[#111111]/65 dark:text-[#f3eee3]/60 mt-1 font-serif italic">Final Arguments Appearance Fee</p>
                      <p className="text-lg font-serif font-bold text-[#111111] dark:text-[#f3eee3] mt-2">₹2,50,000</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-serif font-bold text-[#111111] dark:text-[#f3eee3]">Titanium Pharma Global</span>
                        <span className="text-[10px] font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] bg-[#111111]/10 dark:bg-[#f3eee3]/15 px-2 py-0.5 rounded-md border border-[#111111]/20 dark:border-[#f3eee3]/30">Advance Received</span>
                      </div>
                      <p className="text-[11px] text-[#111111]/65 dark:text-[#f3eee3]/60 mt-1 font-serif italic">Interim Injunction Draft &amp; Settlement</p>
                      <p className="text-lg font-serif font-bold text-[#111111] dark:text-[#f3eee3] mt-2">₹1,75,000 <span className="text-xs font-normal text-[#111111]/65 dark:text-[#f3eee3]/60">(₹75k pending)</span></p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: CNR Radar */}
              {simulatorTab === "search" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#111111] dark:text-[#f3eee3]" />
                      <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3]">
                        16-Digit CNR National Search Engine
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Try searching: DLHC01-008129-2024 or AeroGlide..."
                      className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3] font-mono shadow-xs"
                    />
                    <Search className="w-4 h-4 absolute right-4 top-3.5 text-[#111111]/65 dark:text-[#f3eee3]/60" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features Section */}
      <section id="features" className="py-20 md:py-28 max-w-6xl mx-auto px-5 sm:px-8 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#111111] dark:text-[#f3eee3]">
            PRACTICE SOVEREIGNTY
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] mt-2.5 tracking-tight">
            Crafted for Distinguished Advocates &amp; Law Chambers.
          </h2>
          <p className="text-sm font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/60 mt-3">
            Designed specifically to replace frayed paper registers, scattered cause list sheets, and manual reminders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs hover:border-[#111111] dark:hover:border-[#f3eee3] transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-white/80 dark:bg-[#202020] text-[#111111] dark:text-[#f3eee3] flex items-center justify-center font-bold text-xs mb-5 transition-transform group-hover:scale-105">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
              Chronological Case Dossiers &amp; NDOH
            </h3>
            <p className="text-xs text-[#111111]/70 dark:text-[#f3eee3]/60 font-serif leading-relaxed mt-2.5">
              Record bench, courtroom, stage, opposite party, and case numbers once. Maintain an uninterrupted audit trail of all previous orders, adjournments, and procedural stages.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs hover:border-[#111111] dark:hover:border-[#f3eee3] transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-white/80 dark:bg-[#202020] text-[#111111] dark:text-[#f3eee3] flex items-center justify-center font-bold text-xs mb-5 transition-transform group-hover:scale-105">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
              Automated Cause Lists &amp; Calling Board
            </h3>
            <p className="text-xs text-[#111111]/70 dark:text-[#f3eee3]/60 font-serif leading-relaxed mt-2.5">
              Auto-generates your Today and Tomorrow calling boards. Track item numbers, courtroom locations, and pass-overs across multiple courts before departing chambers.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs hover:border-[#111111] dark:hover:border-[#f3eee3] transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-white/80 dark:bg-[#202020] text-[#111111] dark:text-[#f3eee3] flex items-center justify-center font-bold text-xs mb-5 transition-transform group-hover:scale-105">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
              Chamber Retainers &amp; Fee Accounting
            </h3>
            <p className="text-xs text-[#111111]/70 dark:text-[#f3eee3]/60 font-serif leading-relaxed mt-2.5">
              Financial accounting built directly into every case dossier. Log retainers, advance payments, pending disbursements, and print professional fee notes.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs hover:border-[#111111] dark:hover:border-[#f3eee3] transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-white/80 dark:bg-[#202020] text-[#111111] dark:text-[#f3eee3] flex items-center justify-center font-bold text-xs mb-5 transition-transform group-hover:scale-105">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
              Senior Verification Desk &amp; Junior Briefs
            </h3>
            <p className="text-xs text-[#111111]/70 dark:text-[#f3eee3]/60 font-serif leading-relaxed mt-2.5">
              Senior Advocates delegate matters to junior associates. Juniors draft hearing notes in the courtroom for senior verification before records are permanently stamped.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs hover:border-[#111111] dark:hover:border-[#f3eee3] transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-white/80 dark:bg-[#202020] text-[#111111] dark:text-[#f3eee3] flex items-center justify-center font-bold text-xs mb-5 transition-transform group-hover:scale-105">
              <FolderLock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
              Encrypted Pleadings Vault &amp; Citations
            </h3>
            <p className="text-xs text-[#111111]/70 dark:text-[#f3eee3]/60 font-serif leading-relaxed mt-2.5">
              Securely store Vakalatnamas, plaints, evidence affidavits, and certified High Court Neutral Citations (e.g. 2026:DHC:8412) tied to each specific case.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs hover:border-[#111111] dark:hover:border-[#f3eee3] transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-white/80 dark:bg-[#202020] text-[#111111] dark:text-[#f3eee3] flex items-center justify-center font-bold text-xs mb-5 transition-transform group-hover:scale-105">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
              Multi-Device Judicial Synchronization
            </h3>
            <p className="text-xs text-[#111111]/70 dark:text-[#f3eee3]/60 font-serif leading-relaxed mt-2.5">
              Seamlessly transition between chamber desktop, iPad in conference, and mobile in court corridors without losing a single hearing note.
            </p>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="howitworks" className="py-20 md:py-28 bg-white/80/40 dark:bg-[#111111] border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#111111] dark:text-[#f3eee3]">
              CHAMBER PROTOCOL
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] mt-2.5 tracking-tight">
              From Physical Register to Digital Chamber.
            </h2>
            <p className="text-sm font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/60 mt-3">
              Modernizing your practice workflow takes less than two minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 relative">
              <span className="w-8 h-8 rounded-full bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-center font-cinzel font-bold text-xs mb-4">
                I
              </span>
              <h4 className="text-sm font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                Advocate Sign Up
              </h4>
              <p className="text-xs text-[#111111]/70 dark:text-[#f3eee3]/60 font-serif mt-2 leading-relaxed">
                Provide your State Bar Council Enrolment No. (e.g. D/1482/2012) and initialize your chamber vault.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 relative">
              <span className="w-8 h-8 rounded-full bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-center font-cinzel font-bold text-xs mb-4">
                II
              </span>
              <h4 className="text-sm font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                File Matters &amp; CNRs
              </h4>
              <p className="text-xs text-[#111111]/70 dark:text-[#f3eee3]/60 font-serif mt-2 leading-relaxed">
                Log active matters with 16-digit CNR, bench, court room, judge, and client contact details.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 relative">
              <span className="w-8 h-8 rounded-full bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-center font-cinzel font-bold text-xs mb-4">
                III
              </span>
              <h4 className="text-sm font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                Daily Cause Lists
              </h4>
              <p className="text-xs text-[#111111]/70 dark:text-[#f3eee3]/60 font-serif mt-2 leading-relaxed">
                Review automatically organized Today and Tomorrow boards on your phone before departing chambers.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 relative">
              <span className="w-8 h-8 rounded-full bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-center font-cinzel font-bold text-xs mb-4">
                IV
              </span>
              <h4 className="text-sm font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                Receipts &amp; Retainers
              </h4>
              <p className="text-xs text-[#111111]/70 dark:text-[#f3eee3]/60 font-serif mt-2 leading-relaxed">
                Log fee notes, track outstanding balances, and generate professional receipts with one tap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Transparent Pricing Plans */}
      <section id="pricing" className="py-20 md:py-28 max-w-6xl mx-auto px-5 sm:px-8 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#111111] dark:text-[#f3eee3]">
            TRANSPARENT PLANS
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] mt-2.5 tracking-tight">
            Plans for Individual Counsels &amp; Established Chambers.
          </h2>
          <p className="text-sm font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/60 mt-3">
            Begin with a full-featured complimentary tier. Upgrade only as your litigation chamber expands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan 1 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#111111]/65 dark:text-[#f3eee3]/60 block">
                Solo Practitioner
              </span>
              <h3 className="text-xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] mt-1">
                Individual Counsel
              </h3>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-3xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">₹0</span>
                <span className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60">/ complimentary</span>
              </div>
              <p className="text-xs font-serif text-[#111111]/70 dark:text-[#f3eee3]/60 mt-2 leading-relaxed">
                For solo litigators managing their personal court docket, hearings, and client records.
              </p>

              <ul className="mt-6 space-y-3.5 text-xs text-[#111111]/85 dark:text-[#f3eee3]/85 font-serif">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] dark:text-[#f3eee3] flex-shrink-0" />
                  <span>1 Advocate Account</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] dark:text-[#f3eee3] flex-shrink-0" />
                  <span>Up to 50 Active Court Matters</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] dark:text-[#f3eee3] flex-shrink-0" />
                  <span>Today &amp; Tomorrow Cause Lists</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] dark:text-[#f3eee3] flex-shrink-0" />
                  <span>Client Fee &amp; Receipt Ledger</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => currentUser ? router.push(dashboardHref) : setAuthModal("signup")}
              className="mt-8 w-full py-3 rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 font-cinzel font-bold text-xs tracking-wider text-[#111111] dark:text-[#f3eee3] hover:bg-white/80 dark:hover:bg-[#181b22] transition-all"
            >
              {currentUser ? "Open Dashboard" : "Sign Up Free"}
            </button>
          </div>

          {/* Plan 2: Chamber Pro (Highlighted) */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#181818] border-2 border-[#111111] dark:border-[#f3eee3] shadow-xl flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[9.5px] font-cinzel font-bold uppercase tracking-widest bg-[#d9541e] text-white dark:bg-[#d9541e] dark:text-white">
              Chamber Standard
            </div>

            <div>
              <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3] block">
                Chamber Practice
              </span>
              <h3 className="text-xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] mt-1">
                Chamber Pro
              </h3>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-3xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">₹1,499</span>
                <span className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60">/ monthly per chamber</span>
              </div>
              <p className="text-xs font-serif text-[#111111]/70 dark:text-[#f3eee3]/60 mt-2 leading-relaxed">
                For Senior Advocates collaborating with briefing associates, juniors, and clerks.
              </p>

              <ul className="mt-6 space-y-3.5 text-xs text-[#111111]/85 dark:text-[#f3eee3]/85 font-serif">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] dark:text-[#f3eee3] flex-shrink-0" />
                  <span><strong>Up to 5 Advocates &amp; Briefing Associates</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] dark:text-[#f3eee3] flex-shrink-0" />
                  <span><strong>Unlimited Active Matters &amp; Dossiers</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] dark:text-[#f3eee3] flex-shrink-0" />
                  <span>Senior Verification Desk</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] dark:text-[#f3eee3] flex-shrink-0" />
                  <span>Limitation Act 1963 Statutory Radar</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => currentUser ? router.push(dashboardHref) : setAuthModal("signup")}
              className="mt-8 w-full py-3 rounded-2xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs tracking-wider transition-all shadow-md"
            >
              {currentUser ? "Open Dashboard" : "Sign Up"}
            </button>
          </div>

          {/* Plan 3 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#111111]/65 dark:text-[#f3eee3]/60 block">
                Enterprise Chambers
              </span>
              <h3 className="text-xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] mt-1">
                Senior Counsel / Law Firm
              </h3>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-3xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">Custom</span>
                <span className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60">/ tailored deployment</span>
              </div>
              <p className="text-xs font-serif text-[#111111]/70 dark:text-[#f3eee3]/60 mt-2 leading-relaxed">
                For designated Senior Advocates and large litigation practices across multiple high court benches.
              </p>

              <ul className="mt-6 space-y-3.5 text-xs text-[#111111]/85 dark:text-[#f3eee3]/85 font-serif">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] dark:text-[#f3eee3] flex-shrink-0" />
                  <span>Unlimited Advocates &amp; Retained Clients</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] dark:text-[#f3eee3] flex-shrink-0" />
                  <span>Dedicated Encrypted Database Partition</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#111111] dark:text-[#f3eee3] flex-shrink-0" />
                  <span>Custom Tribunal &amp; Bench Integrations</span>
                </li>
              </ul>
            </div>

            <a
              href="#contact"
              className="mt-8 w-full py-3 rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 font-cinzel font-bold text-xs text-center text-[#111111] dark:text-[#f3eee3] hover:bg-white/80 dark:hover:bg-[#181b22] transition-all block"
            >
              Contact Registry Desk
            </a>
          </div>
        </div>
      </section>

      {/* 7. Advocate Testimonials */}
      <section className="py-20 md:py-28 bg-white/80/40 dark:bg-[#111111] border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#111111] dark:text-[#f3eee3]">
              CHAMBER TESTIMONIALS
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] mt-2.5">
              Endorsed by Practicing Counsels Nationwide.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
              <p className="text-xs font-serif leading-relaxed text-[#111111]/85 dark:text-[#f3eee3]/85 italic">
                &ldquo;For years, our clerk maintained a massive paper diary that tore and was prone to misplacement. LexDaily brought complete serenity to our morning cause list preparation.&rdquo;
              </p>
              <div className="mt-5 pt-4 border-t border-[#111111]/15 dark:border-[#f3eee3]/20 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-center font-cinzel font-bold text-xs">
                  SK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111] dark:text-[#f3eee3]">Adv. Suresh K. Grover</h4>
                  <span className="text-[10px] text-[#111111]/65 dark:text-[#f3eee3]/60 font-mono">Delhi High Court · D/892/2004</span>
                </div>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
              <p className="text-xs font-serif leading-relaxed text-[#111111]/85 dark:text-[#f3eee3]/85 italic">
                &ldquo;The two-tier verification desk is revolutionary for our chamber. Associates log verbatim courtroom outcomes, and I sign off with one tap. No more miscommunicated dates.&rdquo;
              </p>
              <div className="mt-5 pt-4 border-t border-[#111111]/15 dark:border-[#f3eee3]/20 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-center font-cinzel font-bold text-xs">
                  MN
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111] dark:text-[#f3eee3]">Adv. Manisha Nadkarni</h4>
                  <span className="text-[10px] text-[#111111]/65 dark:text-[#f3eee3]/60 font-mono">Bombay High Court · MAH/1420/2011</span>
                </div>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
              <p className="text-xs font-serif leading-relaxed text-[#111111]/85 dark:text-[#f3eee3]/85 italic">
                &ldquo;The fee ledger integrated directly into each brief eliminates uncomfortable accounting disputes. Clients inspect advance receipts transparently.&rdquo;
              </p>
              <div className="mt-5 pt-4 border-t border-[#111111]/15 dark:border-[#f3eee3]/20 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-center font-cinzel font-bold text-xs">
                  TB
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111] dark:text-[#f3eee3]">Adv. Tushar Banerjee</h4>
                  <span className="text-[10px] text-[#111111]/65 dark:text-[#f3eee3]/60 font-mono">Calcutta High Court · WB/612/2015</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions */}
      <section id="faq" className="py-20 md:py-28 max-w-4xl mx-auto px-5 sm:px-8 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div className="text-center mb-16">
          <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#111111] dark:text-[#f3eee3]">
            INQUIRIES &amp; PROTOCOL
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] mt-2.5">
            Common Questions by Practicing Counsels.
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Is chamber and client data confidential and air-gapped?",
              a: "Absolutely. LexDaily uses air-gapped, encrypted database partitioning. Opposing counsels or outside advocates cannot query, search, or view your chamber's active matters, client advice, or fee ledgers.",
            },
            {
              q: "Does LexDaily comply with Bar Council of India (BCI) Rule 36?",
              a: "Yes, strictly. LexDaily is a practice management and chamber operating system. It does not solicit clients, display advertisements, or rank advocates. Sign-up is restricted to enrolled lawyers.",
            },
            {
              q: "Can junior associates and chamber clerks submit hearing outcomes?",
              a: "Yes. In the Chamber Pro plan, junior associates log verbatim court proceedings and propose the Next Date of Hearing (NDOH). These submissions enter the Senior Advocate's Verification Desk for final sign-off.",
            },
            {
              q: "Does it support the 16-character eCourts CNR number standard?",
              a: "Yes. Every matter features full support for the 16-character Case Natural Record (e.g. DLHC01-008129-2024), enabling unified tracking across High Courts, District Courts, and Tribunals.",
            },
            {
              q: "Can I print or export my Daily Cause List as a clean PDF?",
              a: "Yes. LexDaily provides a 1-click printable cause list formatted specifically for chamber boards, court bags, and sharing with briefing counsels.",
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFaq(i)}
                className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-serif font-bold text-[#111111] dark:text-[#f3eee3]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#111111]/65 transition-transform ${
                    activeFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeFaq === i && (
                <div className="px-5 pb-5 pt-1 text-xs font-serif leading-relaxed text-[#111111]/70 dark:text-[#f3eee3]/60 border-t border-[#111111]/15 dark:border-[#f3eee3]/20">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Contact Us & Registry Concierge Desk */}
      <section id="contact" className="py-20 md:py-28 bg-[#f3eee3] dark:bg-[#111111] border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#111111] dark:text-[#f3eee3]">
              REGISTRAR PROTOCOL
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] mt-2.5">
              Contact the Chamber Registrar Desk.
            </h2>
            <p className="text-sm font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/60 mt-3">
              Reach our technical registrar for custom chamber onboarding or enterprise integration.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 5 Cols */}
            <div className="lg:col-span-5 space-y-5">
              <div className="p-7 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs space-y-5">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#111111] dark:text-[#f3eee3] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-cinzel font-bold uppercase text-[#111111] dark:text-[#f3eee3]">
                      Chamber Registry Headquarters
                    </h4>
                    <p className="text-xs font-serif text-[#111111]/70 dark:text-[#f3eee3]/60 mt-1.5 leading-relaxed">
                      Chamber Block II, Sher Shah Road / Bhagwan Das Road<br />
                      Opposite Delhi High Court &amp; Supreme Court of India<br />
                      New Delhi 110001
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#111111]/15 dark:border-[#f3eee3]/20 flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-[#111111] dark:text-[#f3eee3] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-cinzel font-bold uppercase text-[#111111] dark:text-[#f3eee3]">
                      Registrar Email
                    </h4>
                    <p className="text-xs font-mono text-[#111111] dark:text-[#f3eee3] mt-1">
                      registrar@updatedlawdiary.in
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#111111]/15 dark:border-[#f3eee3]/20 flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-[#111111] dark:text-[#f3eee3] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-cinzel font-bold uppercase text-[#111111] dark:text-[#f3eee3]">
                      Chamber Hotline
                    </h4>
                    <p className="text-xs font-mono text-[#111111] dark:text-[#f3eee3] mt-1">
                      +91 11 2338 0000
                    </p>
                    <p className="text-[11px] font-serif text-[#111111]/65 dark:text-[#f3eee3]/60 mt-0.5">
                      Mon – Sat: 08:30 AM to 08:00 PM IST
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#111111]/10 dark:bg-[#f3eee3]/15 border border-[#111111]/20 dark:border-[#f3eee3]/30">
                <span className="text-[10px] font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] uppercase block">
                  ADVOCATE ONBOARDING NOTE
                </span>
                <p className="text-xs font-serif text-[#111111]/85 dark:text-[#f3eee3]/85 mt-1.5 leading-relaxed">
                  Advocates can self-register immediately via the <strong>Sign Up</strong> portal above using their State Bar Council enrolment number.
                </p>
              </div>
            </div>

            {/* Right 7 Cols: Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="p-7 sm:p-9 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
                <h3 className="text-base font-serif font-bold text-[#111111] dark:text-[#f3eee3] mb-5">
                  Dispatch Communication to Registrar
                </h3>

                {contactSubmitted ? (
                  <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20">
                    <CheckCircle2 className="w-8 h-8 text-[#111111] dark:text-[#f3eee3] mx-auto mb-2.5" />
                    <h4 className="text-sm font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                      Communication Dispatched to Chamber Registrar
                    </h4>
                    <p className="text-xs font-serif text-[#111111]/70 dark:text-[#f3eee3]/60 mt-1.5 max-w-md mx-auto">
                      Thank you, {contactName || "Counsel"}. Our technical representative will reach out shortly.
                    </p>
                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="mt-5 text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] underline"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-cinzel font-semibold text-[#111111]/70 dark:text-[#f3eee3]/60 mb-1.5">
                          Advocate Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Adv. Rohit Singhania"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-xs focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-cinzel font-semibold text-[#111111]/70 dark:text-[#f3eee3]/60 mb-1.5">
                          Chamber / Firm Name
                        </label>
                        <input
                          type="text"
                          value={contactChamber}
                          onChange={(e) => setContactChamber(e.target.value)}
                          placeholder="Singhania Law Chambers"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-xs focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-cinzel font-semibold text-[#111111]/70 dark:text-[#f3eee3]/60 mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="counsel@singhania.in"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-xs focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-cinzel font-semibold text-[#111111]/70 dark:text-[#f3eee3]/60 mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+91 98110 00000"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-xs focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-cinzel font-semibold text-[#111111]/70 dark:text-[#f3eee3]/60 mb-1.5">
                        Primary Court of Practice
                      </label>
                      <select
                        value={contactCourt}
                        onChange={(e) => setContactCourt(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-xs focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3]"
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
                      <label className="block text-xs font-cinzel font-semibold text-[#111111]/70 dark:text-[#f3eee3]/60 mb-1.5">
                        Message
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Inquire regarding chamber onboarding, team expansion, or custom docket needs..."
                        className="w-full p-3.5 rounded-xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingContact}
                      className="w-full py-3 rounded-2xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
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
      <footer className="border-t border-[#111111]/15 dark:border-[#f3eee3]/20 bg-[#f3eee3] dark:bg-[#111111] text-[#111111]/65 dark:text-[#f3eee3]/60 py-14 text-xs font-serif">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
            <div className="space-y-3.5">
              <div className="flex items-center">
                <span 
                  className="text-2xl sm:text-3xl font-clagista tracking-normal text-[#111111] dark:text-[#f3eee3] select-none inline-block"
                  style={{ fontFamily: "'Clagista', cursive, sans-serif" }}
                >
                  LexDaily
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#111111]/70 dark:text-[#f3eee3]/60">
                Sovereign case management and digital lawyer diary operating system for Indian advocates, chambers, and retained clients.
              </p>
            </div>

            <div>
              <h4 className="font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3] mb-3.5">
                Practice Pillars
              </h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-[#111111] dark:hover:text-[#f3eee3]">Smart Case Diary</a></li>
                <li><a href="#features" className="hover:text-[#111111] dark:hover:text-[#f3eee3]">Today &amp; Tomorrow Cause List</a></li>
                <li><a href="#features" className="hover:text-[#111111] dark:hover:text-[#f3eee3]">Fee Ledger &amp; Invoicing</a></li>
                <li><a href="#features" className="hover:text-[#111111] dark:hover:text-[#f3eee3]">Junior Verification Desk</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3] mb-3.5">
                Chamber Portals
              </h4>
              <ul className="space-y-2">
                <li><button onClick={() => setAuthModal("signup")} className="hover:text-[#111111] dark:hover:text-[#f3eee3] text-left">Advocate Sign Up (Lawyers Only)</button></li>
                <li><button onClick={() => setAuthModal("signin")} className="hover:text-[#111111] dark:hover:text-[#f3eee3] text-left">Senior Counsel Sign In</button></li>
                <li><button onClick={() => setAuthModal("signin")} className="hover:text-[#111111] dark:hover:text-[#f3eee3] text-left">Associate Briefing Desk</button></li>
                <li><button onClick={() => setAuthModal("signin")} className="hover:text-[#111111] dark:hover:text-[#f3eee3] text-left">Litigant Client Access</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-cinzel font-bold uppercase tracking-wider text-[#111111] dark:text-[#f3eee3] mb-3.5">
                BCI Compliance
              </h4>
              <p className="text-xs leading-relaxed text-[#111111]/70 dark:text-[#f3eee3]/60">
                Adhering strictly to Rule 36 of Bar Council of India Standards of Professional Conduct. Provisioned solely for credentialed legal chambers and their retained clients under Vakalatnama.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono">
            <span>© 2026 LexDaily. All rights reserved.</span>
            <span>Chamber Operating System</span>
          </div>
        </div>
      </footer>

      {/* 11. Modal: Animated Chamber Auth Switch */}
      {authModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setAuthModal(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#111111]/75 backdrop-blur-md animate-in fade-in"
        >
          <AuthSwitch
            initialSignUp={authModal === "signup"}
            onClose={() => setAuthModal(null)}
            isModal={true}
          />
        </div>
      )}
    </div>
  );
}
