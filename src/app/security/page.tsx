"use client";

import React from "react";
import Link from "next/link";
import { PublicLayout } from "@/components/public/PublicLayout";
import {
  ShieldCheck,
  Lock,
  Scale,
  FileCheck,
  EyeOff,
  Database,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Award,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export default function SecurityPage() {
  const { currentUser, setAuthModal } = useChamber();
  const dashboardHref = currentUser?.role === "admin" ? "/admin" : "/dashboard";

  const securityPillars = [
    {
      icon: Scale,
      title: "Strict Bar Council Rule 36 Compliance",
      summary: "Zero solicitation, zero public directories, zero commercial ranking.",
      details:
        "Updated Law Diary is engineered strictly as an internal administrative docket and case diary. It does not solicit clients, display advertisements, publish advocate rankings, or maintain public-facing directories. It strictly adheres to Rule 36 of Chapter II, Part VI of the Bar Council of India Rules.",
    },
    {
      icon: Lock,
      title: "256-Bit Cryptographic Vault",
      summary: "Military-grade encryption for court briefs, notes, and strategy.",
      details:
        "All confidential pleadings, private chamber notes, and fee structures are protected with AES-256 encryption at rest and TLS 1.3 in transit. Briefs remain inaccessible to external platforms, automated scrapers, or unauthorized third parties.",
    },
    {
      icon: FileCheck,
      title: "Legal Professional Privilege Safeguards",
      summary: "Compliant with Section 126 & 129 of Indian Evidence Act / BSA 2023.",
      details:
        "The attorney-client relationship demands complete evidentiary safe custody. Updated Law Diary isolates each chamber's Vakalatnamas, litigant communications, and internal legal advice inside dedicated sovereign partitions.",
    },
    {
      icon: EyeOff,
      title: "Multi-Tenant Role-Based Access Control",
      summary: "Strict isolation across Advocate, Associate, Litigant & Registrar.",
      details:
        "Briefing Associates only see matters assigned to them. Clients only access their individual cases and fee receipts under Vakalatnama. Senior Advocates maintain total sovereign sign-off authority across all chamber records.",
    },
    {
      icon: Database,
      title: "Database Sovereignty & Local Mode",
      summary: "Run seamlessly in local memory or your own dedicated cloud cluster.",
      details:
        "Chambers are never locked into proprietary infrastructure. Updated Law Diary offers instantaneous local in-memory operation, private on-premise Docker deployment, or dedicated private MongoDB Atlas clusters hosted in Mumbai / Delhi regions.",
    },
    {
      icon: ShieldCheck,
      title: "Tamper-Evident Chamber Audit Trail",
      summary: "Immutable log of all filings, order edits, and stage transitions.",
      details:
        "Every change to a matter's Next Date of Hearing (NDOH), order transcript, or fee disbursement is cryptographically recorded with advocate timestamp, user role, and audit snapshot for total evidentiary accountability.",
    },
  ];

  return (
    <PublicLayout>
      {/* Hero Banner */}
      <section className="py-20 md:py-28 border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#3df2e0]/20 to-transparent dark:from-[#3df2e0]/10 dark:via-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-cinzel font-bold tracking-widest bg-white dark:bg-[#0f151c] text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 shadow-xs">
            <Award className="w-3.5 h-3.5" />
            <span>ETHICS &amp; REGULATORY INTEGRITY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0] tracking-tight leading-[1.2]">
            Sovereign Safe Custody, Uncompromising Legal Privilege.
          </h1>

          <p className="text-base sm:text-lg text-[#0b0f14]/75 dark:text-[#3df2e0]/70 font-serif italic max-w-2xl mx-auto leading-relaxed">
            Designed from inception to honor the highest ethical traditions of the Indian Legal Profession and statutory standards of confidentiality.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {currentUser ? (
              <Link
                href={dashboardHref}
                className="px-7 py-3 rounded-2xl bg-[#1b1d3a] text-[#e8d5b5] hover:bg-[#25284e] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] dark:hover:bg-[#dfc8a2] font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={() => setAuthModal("signup")}
                className="px-7 py-3 rounded-2xl bg-[#1b1d3a] text-[#e8d5b5] hover:bg-[#25284e] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] dark:hover:bg-[#dfc8a2] font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Sign Up (Lawyers Only)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <Link
              href="/contact"
              className="px-6 py-3 rounded-2xl bg-white dark:bg-[#0f151c] text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 font-cinzel font-semibold text-xs tracking-wider hover:bg-white/80 dark:hover:bg-[#141d27] transition-all shadow-xs"
            >
              Inquire with Chamber Registrar
            </Link>
          </div>
        </div>
      </section>

      {/* Security Deep Dive Grid */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-5 sm:px-8 border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#0b0f14] dark:text-[#3df2e0]">
            REGULATORY STANDARDS
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">
            The Security &amp; Compliance Architecture
          </h2>
          <p className="text-sm font-serif italic text-[#0b0f14]/70 dark:text-[#3df2e0]/60">
            How we protect chamber sovereignty, professional ethics, and attorney-client privilege.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {securityPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 shadow-xs space-y-4 hover:border-[#0b0f14] dark:hover:border-[#3df2e0]/50 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0b0f14] dark:bg-[#3df2e0]/15 text-[#3df2e0] flex items-center justify-center shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">
                    {p.title}
                  </h3>
                  <p className="text-xs font-serif italic text-[#0b0f14]/75 dark:text-[#3df2e0]/70 mt-1">
                    {p.summary}
                  </p>
                </div>
                <p className="text-xs font-serif leading-relaxed text-[#0b0f14]/80 dark:text-[#3df2e0]/80 pt-2 border-t border-[#0b0f14]/10 dark:border-[#3df2e0]/15">
                  {p.details}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Statutory Disclaimer & Legal Declaration */}
      <section className="py-20 md:py-28 bg-white/60 dark:bg-[#080c10] border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-[#0b0f14] dark:text-[#3df2e0]" />
              <h3 className="text-lg font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0]">
                Official Declaration: Bar Council of India Compliance
              </h3>
            </div>

            <div className="space-y-4 text-xs font-serif leading-relaxed text-[#0b0f14]/85 dark:text-[#3df2e0]/85">
              <p>
                In strict compliance with the rules established by the Bar Council of India under the Advocates Act, 1961, Updated Law Diary does not engage in any form of advertising, publicity, or solicitation of legal work.
              </p>
              <p>
                The platform is provisioned solely as an administrative diary, litigation record organizer, and cause list tracker for practicing advocates who have registered voluntarily using their official State Bar Council enrolment credentials.
              </p>
              <p>
                Litigants and corporate clients cannot search for or retain advocates through this platform. Client access is granted exclusively by the retained counsel of record under a duly executed Vakalatnama.
              </p>
            </div>

            <div className="pt-4 border-t border-[#0b0f14]/10 dark:border-[#3df2e0]/15 flex items-center justify-between text-xs font-mono text-[#0b0f14]/60 dark:text-[#3df2e0]/60">
              <span>Rule 36, Standards of Professional Conduct</span>
              <span>Bar Council of India</span>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
