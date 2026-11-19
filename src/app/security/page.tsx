"use client";

import React from "react";
import Link from "next/link";
import { PublicLayout } from "@/components/public/PublicLayout";
import Hero3 from "@/components/ui/hero-3";
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
        "LexDaily is engineered strictly as an internal administrative docket and case diary. It does not solicit clients, display advertisements, publish advocate rankings, or maintain public-facing directories. It strictly adheres to Rule 36 of Chapter II, Part VI of the Bar Council of India Rules.",
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
        "The attorney-client relationship demands complete evidentiary safe custody. LexDaily isolates each chamber's Vakalatnamas, litigant communications, and internal legal advice inside dedicated sovereign partitions.",
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
        "Chambers are never locked into proprietary infrastructure. LexDaily offers instantaneous local in-memory operation, private on-premise Docker deployment, or dedicated private MongoDB Atlas clusters hosted in Mumbai / Delhi regions.",
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
    <PublicLayout hideNavbar={true}>
      {/* Cinematic Judicial Hero */}
      <Hero3
        brandName="LexDaily"
        eyebrowText="Evidentiary & Ethical Architecture"
        headingLine1="Sovereign safe custody,"
        headingLine2="uncompromising legal privilege."
        description="Designed from inception to honor the highest ethical traditions of the Indian Legal Profession, statutory attorney-client privilege, and Bar Council of India Rule 36 standards."
        primaryCtaLabel="Review Security Standards"
        primaryCtaHref="#security-pillars"
        secondaryCtaLabel="Inquire with Registrar"
        secondaryCtaHref="/contact"
        scrollText="Review Standards"
        scrollHref="#security-pillars"
        bgImageSrc="/hero-security.jpg"
        bgLightImageSrc="/hero-security-light.jpg"
      />

      {/* Security Deep Dive Grid - Wide End of Screen */}
      <section id="security-pillars" className="w-full py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#111111]/10 dark:border-[#f3eee3]/15">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#d9541e]">
              REGULATORY STANDARDS
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
              The Security &amp; Compliance Architecture
            </h2>
          </div>
          <p className="text-sm font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/60 max-w-md">
            How we protect chamber sovereignty, professional ethics, and attorney-client privilege across all Indian jurisdictions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {securityPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-8 md:p-10 rounded-3xl bg-white/70 dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs space-y-5 hover:border-[#d9541e] dark:hover:border-[#d9541e]/70 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#111111] dark:bg-[#f3eee3]/15 text-[#f3eee3] flex items-center justify-center shadow-xs group-hover:bg-[#d9541e] transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                    {p.title}
                  </h3>
                  <p className="text-xs font-serif italic text-[#d9541e] mt-1 font-medium">
                    {p.summary}
                  </p>
                </div>
                <p className="text-sm font-serif leading-relaxed text-[#111111]/80 dark:text-[#f3eee3]/80 pt-4 border-t border-[#111111]/10 dark:border-[#f3eee3]/15">
                  {p.details}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Statutory Disclaimer & Legal Declaration - Wide End of Screen */}
      <section className="w-full py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20 bg-white/40 dark:bg-[#141414] border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div className="w-full">
          <div className="p-10 md:p-14 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 space-y-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d9541e]/10 text-[#d9541e] flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
                Official Declaration: Bar Council of India Compliance
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-serif leading-relaxed text-[#111111]/85 dark:text-[#f3eee3]/85">
              <div className="p-6 rounded-2xl bg-[#f3eee3]/30 dark:bg-[#111111]/40 border border-[#111111]/10 dark:border-[#f3eee3]/10">
                <h4 className="font-cinzel font-bold text-xs uppercase tracking-wider text-[#d9541e] mb-2">Zero Solicitation</h4>
                <p>
                  In strict compliance with the rules established by the Bar Council of India under the Advocates Act, 1961, LexDaily does not engage in any form of advertising, publicity, or solicitation of legal work.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-[#f3eee3]/30 dark:bg-[#111111]/40 border border-[#111111]/10 dark:border-[#f3eee3]/10">
                <h4 className="font-cinzel font-bold text-xs uppercase tracking-wider text-[#d9541e] mb-2">Verified Enrollment</h4>
                <p>
                  The platform is provisioned solely as an administrative diary, litigation record organizer, and cause list tracker for practicing advocates who have registered voluntarily using their official State Bar Council enrolment credentials.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-[#f3eee3]/30 dark:bg-[#111111]/40 border border-[#111111]/10 dark:border-[#f3eee3]/10">
                <h4 className="font-cinzel font-bold text-xs uppercase tracking-wider text-[#d9541e] mb-2">Vakalatnama Custody</h4>
                <p>
                  Litigants and corporate clients cannot search for or retain advocates through this platform. Client access is granted exclusively by the retained counsel of record under a duly executed Vakalatnama.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#111111]/10 dark:border-[#f3eee3]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-[#111111]/60 dark:text-[#f3eee3]/60">
              <span className="text-[#d9541e] font-semibold">Rule 36, Standards of Professional Conduct</span>
              <span>Bar Council of India · Sovereign Encrypted</span>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
