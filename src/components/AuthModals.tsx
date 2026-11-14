"use client";

import React, { useState } from "react";
import { Scale, ArrowRight, X, CheckCircle2 } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";
import { useRouter } from "next/navigation";

export function AuthModals() {
  const { authModal, setAuthModal, login, signupLawyer, addToast } = useChamber();
  const router = useRouter();

  // Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  // Sign Up state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpBarEnrollment, setSignUpBarEnrollment] = useState("");
  const [signUpChamberName, setSignUpChamberName] = useState("");
  const [signUpCourt, setSignUpCourt] = useState("High Court of Delhi");
  const [signingUp, setSigningUp] = useState(false);

  if (!authModal) return null;

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      addToast("Please provide both email and chamber password.", "error");
      return;
    }
    setSigningIn(true);
    const success = await login(signInEmail, signInPassword);
    setSigningIn(false);
    if (success) {
      setAuthModal(null);
      addToast("Welcome back to your chamber diary.", "success");
      router.push("/dashboard");
    } else {
      addToast("Invalid credentials. Please verify your email & password.", "error");
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword || !signUpBarEnrollment) {
      addToast("Please fill in all mandatory advocate registration fields (*)", "error");
      return;
    }
    if (signUpPassword.length < 6) {
      addToast("Master password must be at least 6 characters.", "error");
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
      addToast("Chamber successfully commissioned! Welcome, Counsel.", "success");
      router.push("/dashboard");
    }
  };

  return (
    <>
      {/* 1. Modal: Universal Sign In */}
      {authModal === "signin" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f14]/60 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 sm:p-6 bg-[#3df2e0] dark:bg-[#0b0f14] border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#0b0f14] text-[#3df2e0] flex items-center justify-center shadow-xs">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0]">
                    Sign In to Chamber Diary
                  </h3>
                  <span className="text-[11px] font-serif text-[#0b0f14]/65 dark:text-[#3df2e0]/60">
                    Available for all Lawyers, Associates, Clients &amp; Registrars
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAuthModal(null)}
                className="p-1 rounded-lg text-[#0b0f14]/65 hover:text-[#0b0f14] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-7 space-y-5 flex-1">
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#0b0f14]/70 dark:text-[#3df2e0]/60 mb-1.5">
                    Chamber Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@chambers.in"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] text-xs font-mono placeholder:text-[#8e929f] focus:outline-none focus:border-[#0b0f14] dark:focus:border-[#3df2e0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#0b0f14]/70 dark:text-[#3df2e0]/60 mb-1.5">
                    Chamber Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] text-xs font-mono placeholder:text-[#8e929f] focus:outline-none focus:border-[#0b0f14] dark:focus:border-[#3df2e0]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={signingIn}
                  className="w-full py-3 rounded-2xl bg-[#1b1d3a] text-[#e8d5b5] hover:bg-[#25284e] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] dark:hover:bg-[#dfc8a2] font-cinzel font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
                >
                  <span>{signingIn ? "Verifying..." : "Sign In to Chamber"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 flex items-center justify-between text-xs font-serif">
                <span className="text-[#0b0f14]/65 dark:text-[#3df2e0]/60">
                  Are you an Advocate without a chamber yet?
                </span>
                <button
                  type="button"
                  onClick={() => setAuthModal("signup")}
                  className="font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0] hover:underline ml-2"
                >
                  Advocate Sign Up →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Advocate Sign Up */}
      {authModal === "signup" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f14]/60 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#111827] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="p-5 sm:p-6 bg-[#3df2e0] dark:bg-[#0b0f14] border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#0b0f14] text-[#3df2e0] flex items-center justify-center shadow-xs">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0]">
                      Advocate Chamber Registration
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-cinzel font-bold uppercase bg-[#0b0f14]/10 dark:bg-[#3df2e0]/15 text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/20 dark:border-[#3df2e0]/30">
                      Lawyers Only
                    </span>
                  </div>
                  <span className="text-[11px] font-serif text-[#0b0f14]/65 dark:text-[#3df2e0]/60">
                    Restricted to Advocates enrolled with Bar Council of India or State Bar Councils
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAuthModal(null)}
                className="p-1 rounded-lg text-[#0b0f14]/65 hover:text-[#0b0f14] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSignUpSubmit} className="p-6 sm:p-7 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#0b0f14]/70 dark:text-[#3df2e0]/60 mb-1.5">
                    Advocate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Adv. Vikramaditya Sen"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] text-xs focus:outline-none focus:border-[#0b0f14] dark:focus:border-[#3df2e0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#0b0f14]/70 dark:text-[#3df2e0]/60 mb-1.5">
                    Bar Council Enrolment No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={signUpBarEnrollment}
                    onChange={(e) => setSignUpBarEnrollment(e.target.value)}
                    placeholder="e.g. D/1482/2012 or MAH/1940/2016"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] text-xs font-mono focus:outline-none focus:border-[#0b0f14] dark:focus:border-[#3df2e0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#0b0f14]/70 dark:text-[#3df2e0]/60 mb-1.5">
                    Chamber / Practice Name
                  </label>
                  <input
                    type="text"
                    value={signUpChamberName}
                    onChange={(e) => setSignUpChamberName(e.target.value)}
                    placeholder="Sen Law Chambers"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] text-xs focus:outline-none focus:border-[#0b0f14] dark:focus:border-[#3df2e0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#0b0f14]/70 dark:text-[#3df2e0]/60 mb-1.5">
                    Primary Court of Practice
                  </label>
                  <select
                    value={signUpCourt}
                    onChange={(e) => setSignUpCourt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] text-xs focus:outline-none focus:border-[#0b0f14] dark:focus:border-[#3df2e0]"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#0b0f14]/70 dark:text-[#3df2e0]/60 mb-1.5">
                    Chamber Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="sen@chambers.in"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] text-xs font-mono focus:outline-none focus:border-[#0b0f14] dark:focus:border-[#3df2e0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#0b0f14]/70 dark:text-[#3df2e0]/60 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    placeholder="+91 98110 00000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] text-xs font-mono focus:outline-none focus:border-[#0b0f14] dark:focus:border-[#3df2e0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#0b0f14]/70 dark:text-[#3df2e0]/60 mb-1.5">
                  Master Password (Min 6 chars) *
                </label>
                <input
                  type="password"
                  required
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] text-xs font-mono focus:outline-none focus:border-[#0b0f14] dark:focus:border-[#3df2e0]"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-xs text-[#0b0f14]/85 dark:text-[#3df2e0]/85 font-serif flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#0b0f14] dark:text-[#3df2e0]" />
                <span>
                  I declare that I am an Advocate duly enrolled with the Bar Council, and hereby initialize an encrypted chamber workspace on Updated Law Diary.
                </span>
              </div>

              <button
                type="submit"
                disabled={signingUp}
                className="w-full py-3 rounded-2xl bg-[#1b1d3a] text-[#e8d5b5] hover:bg-[#25284e] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] dark:hover:bg-[#dfc8a2] font-cinzel font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
              >
                <span>{signingUp ? "Signing Up..." : "Sign Up"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1 font-serif">
                <button
                  type="button"
                  onClick={() => setAuthModal("signin")}
                  className="text-xs text-[#0b0f14]/65 dark:text-[#3df2e0]/60 hover:text-[#0b0f14] dark:hover:text-white"
                >
                  Already have an advocate account? <strong className="font-cinzel text-[#0b0f14] dark:text-[#3df2e0]">Sign In here</strong>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
