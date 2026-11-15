"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicLayout } from "@/components/public/PublicLayout";
import Hero3 from "@/components/ui/hero-3";
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
    <PublicLayout hideNavbar={true}>
      {/* Cinematic Judicial Hero */}
      <Hero3
        brandName="LexDaily"
        badgeText="✦  Transparent Chamber Retainers"
        headingLine1="Transparent chamber retainers,"
        headingLine2="sovereign peace of mind."
        description="Choose the subscription tier tailored to your chamber size. No per-case fees, no hidden surcharges, and total data sovereignty across all High Court benches."
        primaryCtaLabel="Compare Retainer Tiers"
        primaryCtaHref="#pricing-tiers"
        secondaryCtaLabel="Read Frequently Answered Questions"
        secondaryCtaHref="#pricing-faqs"
        bottomTagline={"Solo Advocate Free Forever\nChamber Pro for Teams\nDedicated Enterprise Private Deployments"}
        scrollText="Compare Tiers"
        scrollHref="#pricing-tiers"
        bgImageSrc="/hero-pricing.jpg"
        bgLightImageSrc="/hero-pricing-light.jpg"
      />

      {/* 3 Pricing Cards - Wide End of Screen */}
      <section id="pricing-tiers" className="w-full py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#111111]/10 dark:border-[#f3eee3]/15">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#d9541e]">
              CHAMBER PACKAGES
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
              Sovereign Subscription Tiers
            </h2>
          </div>
          <p className="text-sm font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/60 max-w-md">
            All tiers include 16-character National CNR tracking, cause list generation, and BCI Rule 36 encryption.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`p-8 sm:p-10 md:p-12 rounded-3xl flex flex-col justify-between transition-all relative ${
                p.highlight
                  ? "bg-white dark:bg-[#181818] border-2 border-[#d9541e] shadow-xl shadow-[#d9541e]/5"
                  : "bg-white/70 dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs hover:border-[#111111] dark:hover:border-[#f3eee3]/40"
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-widest bg-[#d9541e] text-white shadow-xs">
                  {p.badge}
                </div>
              )}

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                    {p.name}
                  </h3>
                  <p className="text-xs font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/60 mt-1.5">
                    {p.tagline}
                  </p>
                </div>

                <div className="flex items-baseline gap-2 pb-6 border-b border-[#111111]/10 dark:border-[#f3eee3]/15">
                  <span className="text-4xl sm:text-5xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
                    {p.price}
                  </span>
                  <span className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif">
                    {p.period}
                  </span>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider text-[#d9541e] block">
                    Included Capabilities
                  </span>
                  <ul className="space-y-3 text-xs sm:text-sm font-serif text-[#111111]/85 dark:text-[#f3eee3]/85">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-[#d9541e] flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {p.notIncluded.length > 0 && (
                    <div className="pt-4 border-t border-[#111111]/5 dark:border-[#f3eee3]/10 opacity-50">
                      <ul className="space-y-2.5 text-xs font-serif text-[#111111]/60 dark:text-[#f3eee3]/50 line-through">
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

              <div className="pt-8 mt-8 border-t border-[#111111]/10 dark:border-[#f3eee3]/15">
                {p.isCustom ? (
                  <Link
                    href="/contact"
                    className="w-full py-3.5 rounded-full bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 font-cinzel font-bold text-xs tracking-wider text-[#111111] dark:text-[#f3eee3] hover:bg-[#f3efe6] dark:hover:bg-[#1a232f] transition-all flex items-center justify-center gap-2"
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
                    className={`w-full py-3.5 rounded-full font-cinzel font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                      p.highlight
                        ? "bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm"
                        : "bg-[#111111] text-[#f3eee3] dark:bg-[#f3eee3] dark:text-[#111111] hover:opacity-90"
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

      {/* Feature Comparison Matrix - Wide End of Screen */}
      <section className="w-full py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#111111]/10 dark:border-[#f3eee3]/15">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#d9541e]">
              DETAILED SPECIFICATIONS
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
              Compare Chamber Capabilities
            </h2>
          </div>
          <p className="text-sm font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/60 max-w-md">
            A granular comparison of capabilities across practice tiers.
          </p>
        </div>

        <div className="rounded-3xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-serif">
              <thead>
                <tr className="border-b border-[#111111]/15 dark:border-[#f3eee3]/20 bg-[#111111]/5 dark:bg-[#111111]">
                  <th className="p-5 sm:p-6 font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">Feature</th>
                  <th className="p-5 sm:p-6 font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">Solo</th>
                  <th className="p-5 sm:p-6 font-cinzel font-bold text-[#d9541e] bg-[#d9541e]/5">Chamber Pro</th>
                  <th className="p-5 sm:p-6 font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111111]/10 dark:divide-[#f3eee3]/15">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-5 sm:p-6 font-semibold text-[#111111] dark:text-[#f3eee3]">{row.feature}</td>
                    <td className="p-5 sm:p-6 text-[#111111]/80 dark:text-[#f3eee3]/80">
                      {typeof row.solo === "boolean" ? (
                        row.solo ? <Check className="w-4 h-4 text-[#d9541e]" /> : <X className="w-4 h-4 opacity-30" />
                      ) : (
                        row.solo
                      )}
                    </td>
                    <td className="p-5 sm:p-6 font-semibold text-[#111111] dark:text-[#f3eee3] bg-[#d9541e]/5">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? <Check className="w-4 h-4 text-[#d9541e]" /> : <X className="w-4 h-4 opacity-30" />
                      ) : (
                        row.pro
                      )}
                    </td>
                    <td className="p-5 sm:p-6 text-[#111111]/80 dark:text-[#f3eee3]/80">
                      {typeof row.enterprise === "boolean" ? (
                        row.enterprise ? <Check className="w-4 h-4 text-[#d9541e]" /> : <X className="w-4 h-4 opacity-30" />
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

      {/* FAQ Section - Wide End of Screen */}
      <section id="pricing-faqs" className="w-full py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20 bg-white/40 dark:bg-[#141414]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#111111]/10 dark:border-[#f3eee3]/15">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#d9541e]">
              TRANSPARENCY &amp; TRUST
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
              Frequently Answered Questions
            </h2>
          </div>
          <p className="text-sm font-serif italic text-[#111111]/70 dark:text-[#f3eee3]/60 max-w-md">
            Everything counsels ask about confidentiality, migrations, and billing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-3xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] overflow-hidden p-2"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between text-base sm:text-lg font-serif font-bold text-[#111111] dark:text-[#f3eee3]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#d9541e] transition-transform flex-shrink-0 ml-4 ${
                    activeFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeFaq === i && (
                <div className="px-6 pb-6 pt-2 text-sm font-serif leading-relaxed text-[#111111]/75 dark:text-[#f3eee3]/70 border-t border-[#111111]/10 dark:border-[#f3eee3]/15">
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
