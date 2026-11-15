"use client";

import React, { useState } from "react";
import { PublicLayout } from "@/components/public/PublicLayout";
import Hero3 from "@/components/ui/hero-3";
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
    <PublicLayout hideNavbar={true}>
      {/* Cinematic Judicial Hero */}
      <Hero3
        brandName="LexDaily"
        badgeText="✦  Direct Chamber Registrar Desk"
        headingLine1="Direct counsel communication"
        headingLine2="and chamber onboarding."
        description="Connect directly with the Chamber Administration Office for bespoke on-premise deployments, historical register migration, or team orientation across Indian jurisdictions."
        primaryCtaLabel="Dispatch Communication"
        primaryCtaHref="#contact-form"
        secondaryCtaLabel="Call Counsel Hotline"
        secondaryCtaHref="tel:+919811020002"
        bottomTagline={"Chamber Block, Sher Shah Road, New Delhi 110003\nAdjacent to High Court of Delhi\nImmediate Advocate Self-Service Available"}
        scrollText="Open Dispatch"
        scrollHref="#contact-form"
        bgImageSrc="/hero-contact.jpg"
      />

      {/* Main Contact Content - Wide End of Screen */}
      <section id="contact-form" className="w-full py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left 5 Cols: Chamber Desk Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-white/70 dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                  Chamber Administration Office
                </h3>
                <p className="text-xs font-serif italic text-[#111111]/75 dark:text-[#f3eee3]/70 mt-1">
                  Dedicated assistance for practicing advocates and chamber clerks.
                </p>
              </div>

              <div className="space-y-5 pt-4 border-t border-[#111111]/10 dark:border-[#f3eee3]/15 text-sm font-serif">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#d9541e]/10 text-[#d9541e] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-cinzel font-bold text-xs text-[#111111] dark:text-[#f3eee3] block">
                      Physical Chamber Desk
                    </span>
                    <p className="text-[#111111]/80 dark:text-[#f3eee3]/80 mt-0.5 leading-relaxed text-xs">
                      Chamber Block, Sher Shah Road, New Delhi 110003<br />
                      (Adjacent to High Court of Delhi)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-2">
                  <div className="w-9 h-9 rounded-xl bg-[#d9541e]/10 text-[#d9541e] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-cinzel font-bold text-xs text-[#111111] dark:text-[#f3eee3] block">
                      Registrar Email
                    </span>
                    <p className="font-mono text-xs text-[#111111] dark:text-[#f3eee3] mt-0.5">
                      registrar@updatedlawdiary.in
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-2">
                  <div className="w-9 h-9 rounded-xl bg-[#d9541e]/10 text-[#d9541e] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-cinzel font-bold text-xs text-[#111111] dark:text-[#f3eee3] block">
                      Counsel Hotline
                    </span>
                    <p className="font-mono text-xs text-[#111111] dark:text-[#f3eee3] mt-0.5">
                      +91 98110 20002
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-2">
                  <div className="w-9 h-9 rounded-xl bg-[#d9541e]/10 text-[#d9541e] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-cinzel font-bold text-xs text-[#111111] dark:text-[#f3eee3] block">
                      Operating Hours
                    </span>
                    <p className="text-[#111111]/80 dark:text-[#f3eee3]/80 mt-0.5 text-xs">
                      Monday to Friday: 09:00 — 18:30 IST<br />
                      Aligned with High Court Sitting Hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#d9541e]/5 dark:bg-[#d9541e]/10 border border-[#d9541e]/20 space-y-2">
              <span className="text-[10px] font-cinzel font-bold text-[#d9541e] uppercase block tracking-wider">
                ADVOCATE SELF-SERVICE NOTE
              </span>
              <p className="text-xs font-serif text-[#111111]/85 dark:text-[#f3eee3]/85 leading-relaxed">
                Practicing advocates can initialize a chamber workspace immediately online with their State Bar Council enrolment number without booking an appointment.
              </p>
            </div>
          </div>

          {/* Right 7 Cols: Communication Dispatch Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
              <h3 className="text-xl font-serif font-bold text-[#111111] dark:text-[#f3eee3] mb-6">
                Dispatch Formal Communication to Registrar
              </h3>

              {submitted ? (
                <div className="p-12 text-center rounded-2xl bg-[#111111]/5 dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-[#d9541e] mx-auto" />
                  <h4 className="text-lg font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                    Communication Dispatched to Chamber Registrar
                  </h4>
                  <p className="text-sm font-serif text-[#111111]/75 dark:text-[#f3eee3]/70 max-w-md mx-auto leading-relaxed">
                    Thank you, Counsel. A representative from the registrar desk will review your inquiry and connect with your chamber shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="mt-4 px-6 py-2.5 rounded-full text-xs font-cinzel font-bold text-white bg-[#d9541e] hover:bg-[#bf4513] transition-colors"
                  >
                    Send Another Communication
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-cinzel font-semibold text-[#111111]/75 dark:text-[#f3eee3]/70 mb-2">
                        Advocate Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Adv. Rohit Singhania"
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-sm focus:outline-none focus:border-[#d9541e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-cinzel font-semibold text-[#111111]/75 dark:text-[#f3eee3]/70 mb-2">
                        Chamber / Practice Name
                      </label>
                      <input
                        type="text"
                        value={chamber}
                        onChange={(e) => setChamber(e.target.value)}
                        placeholder="Singhania Law Chambers"
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-sm focus:outline-none focus:border-[#d9541e]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-cinzel font-semibold text-[#111111]/75 dark:text-[#f3eee3]/70 mb-2">
                        Chamber Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="counsel@singhania.in"
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-sm focus:outline-none focus:border-[#d9541e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-cinzel font-semibold text-[#111111]/75 dark:text-[#f3eee3]/70 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98110 00000"
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-sm focus:outline-none focus:border-[#d9541e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-cinzel font-semibold text-[#111111]/75 dark:text-[#f3eee3]/70 mb-2">
                      Primary Court of Practice
                    </label>
                    <select
                      value={court}
                      onChange={(e) => setCourt(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-sm focus:outline-none focus:border-[#d9541e]"
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
                    <label className="block text-xs font-cinzel font-semibold text-[#111111]/75 dark:text-[#f3eee3]/70 mb-2">
                      Message / Special Requirements *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Inquire regarding team onboarding, historical docket migration, or enterprise law firm deployments..."
                      className="w-full p-4 rounded-2xl bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-sm text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#d9541e]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-full bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
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
