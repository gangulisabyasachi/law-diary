"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicLayout } from "@/components/public/PublicLayout";
import {
  Check,
  X,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const { currentUser, setAuthModal } = useChamber();
  const router = useRouter();
  const dashboardHref = currentUser?.role === "admin" ? "/admin" : "/dashboard";

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const plans = [
    {
      name: "Solo Practitioner",
      tagline: "Essential chamber management for individual practicing advocates.",
      price: "₹0",
      period: "free forever",
      cta: "Sign Up Free",
      highlight: false,
      features: [
        "Up to 25 Active Matters & Dossiers",
        "National 16-Character CNR Support",
        "Daily Board & Cause List Generation",
        "1-Click Printable Cause List",
        "Client Record & Vakalatnama Tracking",
        "Local In-Memory Mode Support",
      ],
      notIncluded: [
        "Junior Associate Accounts",
        "Senior Verification Desk",
        "Limitation Act 1963 Radar",
        "Dedicated Database Clusters",
      ],
    },
    {
      name: "Chamber Pro",
      tagline: "For Senior Advocates collaborating with briefing associates and juniors.",
      price: "₹1,499",
      period: "/ month per chamber",
      cta: "Sign Up",
      highlight: true,
      badge: "Chamber Standard",
      features: [
        "Unlimited Active Matters & Dossiers",
        "Up to 5 Advocates & Briefing Associates",
        "Senior Counsel Verification Desk",
        "Limitation Act 1963 Statutory Radar",
        "Certified Judicial Orders & Citations",
        "Litigant Fee Accounting & Receipts",
        "Client Query & Advice Desk",
        "MongoDB Atlas Dedicated Cloud Support",
      ],
      notIncluded: [
        "Multi-Branch Law Firm Federation",
        "Custom On-Premise Air-Gapped Deployment",
      ],
    },
    {
      name: "Enterprise Chambers",
      tagline: "Full-scale deployment for prominent senior counsels and multi-advocate law firms.",
      price: "Custom",
      period: "/ tailored deployment",
      cta: "Inquire with Registrar",
      isCustom: true,
      highlight: false,
      features: [
        "Unlimited Advocates, Associates & Clerks",
        "Unlimited Case Dossiers & Historical Archives",
        "Custom On-Premise or Private Cloud Deployment",
        "Multi-City High Court Benches Support",
        "Priority 24/7 Chamber Technical Liaison",
        "Complete Historical Paper Register Migration",
        "Dedicated Data Custody & Security SLA",
      ],
      notIncluded: [],
    },
  ];

  const comparisonRows = [
    { feature: "Active Matter Capacity", solo: "25 Matters", pro: "Unlimited", enterprise: "Unlimited" },
    { feature: "National 16-Character CNR Support", solo: true, pro: true, enterprise: true },
    { feature: "Daily Cause List Generator", solo: true, pro: true, enterprise: true },
    { feature: "Printable Court Bag Cause List", solo: true, pro: true, enterprise: true },
    { feature: "Associate & Junior Seats", solo: "1 Counsel", pro: "Up to 5", enterprise: "Unlimited" },
    { feature: "Senior Advocate Verification Desk", solo: false, pro: true, enterprise: true },
    { feature: "Limitation Act 1963 Radar", solo: false, pro: true, enterprise: true },
    { feature: "Certified Court Orders & Citations", solo: "Basic", pro: "Advanced", enterprise: "Custom Repository" },
    { feature: "Client Fee Ledgers & Receipts", solo: false, pro: true, enterprise: true },
    { feature: "Litigant Direct Query Desk", solo: false, pro: true, enterprise: true },
    { feature: "Database Sovereignty", solo: "Local Mode", pro: "MongoDB Atlas Cloud", enterprise: "Private VPC / On-Prem" },
    { feature: "Chamber Onboarding & Migration", solo: "Self-Guided", pro: "Assisted", enterprise: "Dedicated Engineer" },
  ];

  const faqs = [
    {
      q: "Can I try Chamber Pro before committing?",
      a: "Yes. Every newly provisioned chamber receives full complimentary access to explore all features, associate delegation, and cause list tools.",
    },
    {
      q: "Is there any setup fee or hidden cost?",
      a: "None. All pricing is straightforward and transparent. There are no per-case charges, court-appearance surcharges, or hidden filing fees.",
    },
    {
      q: "What payment methods are supported for Chamber Retainers?",
      a: "We support NEFT, RTGS, UPI, Corporate Credit Cards, and direct net banking with official GST tax invoices provided for chamber business accounts.",
    },
    {
      q: "Can we migrate our existing paper registers or spreadsheets?",
      a: "Yes. Our platform provides automated JSON export/import and our technical team assists Enterprise chambers with structured docket migration.",
    },
  ];

  return (
    <PublicLayout>
      {/* Header Banner */}
      <section className="py-20 md:py-28 border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#3df2e0]/20 to-transparent dark:from-[#3df2e0]/10 dark:via-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-cinzel font-bold tracking-widest bg-white dark:bg-[#0f151c] text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 shadow-xs">
            <span>CHAMBER RETAINER TIERS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0] tracking-tight leading-[1.2]">
            Transparent Retainers, Sovereign Peace of Mind.
          </h1>

          <p className="text-base sm:text-lg text-[#0b0f14]/75 dark:text-[#3df2e0]/70 font-serif italic max-w-2xl mx-auto leading-relaxed">
            Choose the subscription tier tailored to your chamber size. No per-case fees, no hidden surcharges, and total data sovereignty.
          </p>
        </div>
      </section>

      {/* 3 Pricing Cards */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-5 sm:px-8 border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`p-8 sm:p-9 rounded-3xl flex flex-col justify-between transition-all relative ${
                p.highlight
                  ? "bg-white dark:bg-[#0f151c] border-2 border-[#0b0f14] dark:border-[#3df2e0] shadow-xl shadow-black/5 dark:shadow-[#3df2e0]/5"
                  : "bg-white dark:bg-[#0f151c] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 shadow-xs"
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-widest bg-[#1b1d3a] text-[#e8d5b5] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] shadow-xs">
                  {p.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">
                    {p.name}
                  </h3>
                  <p className="text-xs font-serif italic text-[#0b0f14]/70 dark:text-[#3df2e0]/60 mt-1">
                    {p.tagline}
                  </p>
                </div>

                <div className="flex items-baseline gap-1.5 pb-6 border-b border-[#0b0f14]/10 dark:border-[#3df2e0]/15">
                  <span className="text-4xl font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">
                    {p.price}
                  </span>
                  <span className="text-xs text-[#0b0f14]/65 dark:text-[#3df2e0]/60 font-serif">
                    {p.period}
                  </span>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider text-[#0b0f14]/60 dark:text-[#3df2e0]/60 block">
                    Included Capabilities
                  </span>
                  <ul className="space-y-2.5 text-xs font-serif text-[#0b0f14]/85 dark:text-[#3df2e0]/85">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#0b0f14] dark:text-[#3df2e0] flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {p.notIncluded.length > 0 && (
                    <div className="pt-3 opacity-60">
                      <ul className="space-y-2 text-xs font-serif text-[#0b0f14]/60 dark:text-[#3df2e0]/50 line-through">
                        {p.notIncluded.map((f, i) => (
                          <li key={i} className="flex items-center gap-2.5">
                            <X className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-[#0b0f14]/10 dark:border-[#3df2e0]/15">
                {p.isCustom ? (
                  <Link
                    href="/contact"
                    className="w-full py-3 rounded-2xl bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 font-cinzel font-bold text-xs tracking-wider text-[#0b0f14] dark:text-[#3df2e0] hover:bg-[#f3efe6] dark:hover:bg-[#1a232f] transition-all flex items-center justify-center gap-2"
                  >
                    <span>{p.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      if (currentUser) {
                        router.push(dashboardHref);
                      } else {
                        setAuthModal("signup");
                      }
                    }}
                    className={`w-full py-3 rounded-2xl font-cinzel font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                      p.highlight
                        ? "bg-[#1b1d3a] text-[#e8d5b5] hover:bg-[#25284e] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] dark:hover:bg-[#dfc8a2]"
                        : "bg-white dark:bg-[#141d27] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] hover:bg-[#f3efe6]"
                    }`}
                  >
                    <span>{currentUser ? "Open Dashboard" : p.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="py-20 md:py-28 max-w-6xl mx-auto px-5 sm:px-8 border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#0b0f14] dark:text-[#3df2e0]">
            DETAILED SPECIFICATIONS
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">
            Compare Chamber Capabilities
          </h2>
          <p className="text-sm font-serif italic text-[#0b0f14]/70 dark:text-[#3df2e0]/60">
            A granular comparison of capabilities across practice tiers.
          </p>
        </div>

        <div className="rounded-3xl border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 bg-white dark:bg-[#0f151c] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-serif">
              <thead>
                <tr className="border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20 bg-[#0b0f14]/5 dark:bg-[#0b0f14]">
                  <th className="p-4 sm:p-5 font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0]">Feature</th>
                  <th className="p-4 sm:p-5 font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0]">Solo</th>
                  <th className="p-4 sm:p-5 font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0] bg-[#3df2e0]/10 dark:bg-[#3df2e0]/10">Chamber Pro</th>
                  <th className="p-4 sm:p-5 font-cinzel font-bold text-[#0b0f14] dark:text-[#3df2e0]">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0b0f14]/10 dark:divide-[#3df2e0]/15">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-[#0b0f14] dark:text-[#3df2e0]">{row.feature}</td>
                    <td className="p-4 sm:p-5 text-[#0b0f14]/80 dark:text-[#3df2e0]/80">
                      {typeof row.solo === "boolean" ? (
                        row.solo ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <X className="w-4 h-4 opacity-30" />
                      ) : (
                        row.solo
                      )}
                    </td>
                    <td className="p-4 sm:p-5 font-semibold text-[#0b0f14] dark:text-[#3df2e0] bg-[#3df2e0]/10 dark:bg-[#3df2e0]/10">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <X className="w-4 h-4 opacity-30" />
                      ) : (
                        row.pro
                      )}
                    </td>
                    <td className="p-4 sm:p-5 text-[#0b0f14]/80 dark:text-[#3df2e0]/80">
                      {typeof row.enterprise === "boolean" ? (
                        row.enterprise ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <X className="w-4 h-4 opacity-30" />
                      ) : (
                        row.enterprise
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 max-w-4xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#0b0f14] dark:text-[#3df2e0]">
            TRANSPARENCY &amp; TRUST
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]">
            Frequently Answered Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 bg-white dark:bg-[#0f151c] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-serif font-bold text-[#0b0f14] dark:text-[#3df2e0]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#0b0f14]/65 dark:text-[#3df2e0]/60 transition-transform ${
                    activeFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeFaq === i && (
                <div className="px-5 pb-5 pt-1 text-xs font-serif leading-relaxed text-[#0b0f14]/75 dark:text-[#3df2e0]/70 border-t border-[#0b0f14]/15 dark:border-[#3df2e0]/20">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
