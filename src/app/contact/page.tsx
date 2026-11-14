"use client";

import React, { useState } from "react";
import { PublicLayout } from "@/components/public/PublicLayout";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building,
  Scale,
  Sparkles,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export default function ContactPage() {
  const { addToast } = useChamber();

  const [name, setName] = useState("");
  const [chamber, setChamber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [court, setCourt] = useState("High Court of Delhi");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast("Please fill in all mandatory inquiry fields.", "error");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      addToast("Communication dispatched to Chamber Registrar.", "success");
    }, 600);
  };

  return (
    <PublicLayout>
      {/* Header Banner */}
      <section className="py-20 md:py-28 border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#3df2e0]/20 to-transparent dark:from-[#3df2e0]/10 dark:via-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-cinzel font-bold tracking-widest bg-white dark:bg-[#0f151c] text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 shadow-xs">
            <Building className="w-3.5 h-3.5" />
            <span>REGISTRAR DESK</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0] tracking-tight leading-[1.2]">
            Direct Counsel Communication &amp; Onboarding
          </h1>

          <p className="text-base sm:text-lg text-[#0b0f14]/75 dark:text-[#3df2e0]/70 font-serif italic max-w-2xl mx-auto leading-relaxed">
            Inquire regarding custom chamber deployment, historical docket migration, or associate briefing sessions.
          </p>
        </div>
      </section>

      {/* Main Contact Content */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left 5 Cols: Chamber Desk Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">
                  Chamber Administration Office
                </h3>
                <p className="text-xs font-serif italic text-[#0b0f14]/75 dark:text-[#3df2e0]/70 mt-1">
                  Dedicated assistance for practicing advocates and chamber clerks.
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-[#0b0f14]/10 dark:border-[#3df2e0]/15 text-xs font-serif">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-4 h-4 text-[#0b0f14] dark:text-[#3df2e0] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0] block">
                      Physical Chamber Desk
                    </span>
                    <p className="text-[#0b0f14]/80 dark:text-[#3df2e0]/80 mt-0.5 leading-relaxed">
                      Chamber Block, Sher Shah Road, New Delhi 110003<br />
                      (Adjacent to High Court of Delhi)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-2">
                  <Mail className="w-4 h-4 text-[#0b0f14] dark:text-[#3df2e0] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0] block">
                      Registrar Email
                    </span>
                    <p className="font-mono text-[#0b0f14] dark:text-[#3df2e0] mt-0.5">
                      registrar@updatedlawdiary.in
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-2">
                  <Phone className="w-4 h-4 text-[#0b0f14] dark:text-[#3df2e0] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0] block">
                      Counsel Hotline
                    </span>
                    <p className="font-mono text-[#0b0f14] dark:text-[#3df2e0] mt-0.5">
                      +91 98110 20002
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-2">
                  <Clock className="w-4 h-4 text-[#0b0f14] dark:text-[#3df2e0] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0] block">
                      Operating Hours
                    </span>
                    <p className="text-[#0b0f14]/80 dark:text-[#3df2e0]/80 mt-0.5">
                      Monday to Friday: 09:00 — 18:30 IST<br />
                      Aligned with High Court Sitting Hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#0b0f14]/10 dark:bg-[#3df2e0]/10 border border-[#0b0f14]/20 dark:border-[#3df2e0]/30 space-y-2">
              <span className="text-[10px] font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0] uppercase block tracking-wider">
                ADVOCATE SELF-SERVICE NOTE
              </span>
              <p className="text-xs font-serif text-[#0b0f14]/85 dark:text-[#3df2e0]/85 leading-relaxed">
                Practicing advocates can initialize a chamber workspace immediately online with their State Bar Council enrolment number without booking an appointment.
              </p>
            </div>
          </div>

          {/* Right 7 Cols: Communication Dispatch Form */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 shadow-xs">
              <h3 className="text-base font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0] mb-5">
                Dispatch Formal Communication to Registrar
              </h3>

              {submitted ? (
                <div className="p-10 text-center rounded-2xl bg-[#0b0f14]/5 dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#0b0f14] dark:text-[#3df2e0] mx-auto" />
                  <h4 className="text-base font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">
                    Communication Dispatched to Chamber Registrar
                  </h4>
                  <p className="text-xs font-serif text-[#0b0f14]/75 dark:text-[#3df2e0]/70 max-w-md mx-auto leading-relaxed">
                    Thank you, Counsel. A representative from the registrar desk will review your inquiry and connect with your chamber shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="mt-4 px-5 py-2 rounded-xl text-xs font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0] underline"
                  >
                    Send Another Communication
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-cinzel font-semibold text-[#0b0f14]/75 dark:text-[#3df2e0]/70 mb-1.5">
                        Advocate Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Adv. Rohit Singhania"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] text-xs focus:outline-none focus:border-[#0b0f14] dark:focus:border-[#3df2e0]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-cinzel font-semibold text-[#0b0f14]/75 dark:text-[#3df2e0]/70 mb-1.5">
                        Chamber / Practice Name
                      </label>
                      <input
                        type="text"
                        value={chamber}
                        onChange={(e) => setChamber(e.target.value)}
                        placeholder="Singhania Law Chambers"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] text-xs focus:outline-none focus:border-[#0b0f14] dark:focus:border-[#3df2e0]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-cinzel font-semibold text-[#0b0f14]/75 dark:text-[#3df2e0]/70 mb-1.5">
                        Chamber Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="counsel@singhania.in"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] text-xs focus:outline-none focus:border-[#0b0f14] dark:focus:border-[#3df2e0]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-cinzel font-semibold text-[#0b0f14]/75 dark:text-[#3df2e0]/70 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98110 00000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] text-xs focus:outline-none focus:border-[#0b0f14] dark:focus:border-[#3df2e0]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-cinzel font-semibold text-[#0b0f14]/75 dark:text-[#3df2e0]/70 mb-1.5">
                      Primary Court of Practice
                    </label>
                    <select
                      value={court}
                      onChange={(e) => setCourt(e.target.value)}
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

                  <div>
                    <label className="block text-xs font-cinzel font-semibold text-[#0b0f14]/75 dark:text-[#3df2e0]/70 mb-1.5">
                      Message / Special Requirements *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Inquire regarding team onboarding, historical docket migration, or enterprise law firm deployments..."
                      className="w-full p-3.5 rounded-xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-xs text-[#0b0f14] dark:text-[#3df2e0] focus:outline-none focus:border-[#0b0f14] dark:focus:border-[#3df2e0]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-2xl bg-[#1b1d3a] text-[#e8d5b5] hover:bg-[#25284e] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] dark:hover:bg-[#dfc8a2] font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? "Dispatching..." : "Send Communication"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
