"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicLayout } from "@/components/public/PublicLayout";
import {
  Scale,
  ArrowRight,
  Compass,
  ShieldCheck,
  Calendar,
  Clock,
  FileCheck,
  Home,
  LogIn,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function LandingNotFound() {
  const router = useRouter();
  const { currentUser, setAuthModal } = useChamber();
  const dashboardHref = currentUser?.role === "admin" ? "/admin" : "/dashboard";

  const pillars = [
    {
      icon: Calendar,
      title: "Daily Cause List",
      desc: "Courtroom numbers, calling order & bench composition.",
      href: "/features",
    },
    {
      icon: Scale,
      title: "Active Matters",
      desc: "Single-click case search across Indian jurisdictions.",
      href: "/features",
    },
    {
      icon: Clock,
      title: "Statutory Radar",
      desc: "Limitation Act 1963 countdowns from certified order dates.",
      href: "/features",
    },
    {
      icon: ShieldCheck,
      title: "Security & Ethics",
      desc: "Strict chamber isolation compliant with Rule 36 BCI.",
      href: "/security",
    },
  ];

  return (
    <PublicLayout hideNavbar={false}>
      <div className="relative min-h-[calc(100vh-140px)] flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 py-16 overflow-hidden">
        {/* Subtle Atmospheric Watermark & Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[160px] sm:text-[240px] md:text-[340px] font-cinzel font-black tracking-widest text-[#111111]/[0.03] dark:text-[#f3eee3]/[0.03] leading-none">
            404
          </span>
        </div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(217,84,30,0.12),transparent_70%)] pointer-events-none" />

        {/* Central Editorial Container */}
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d9541e]/10 text-[#d9541e] dark:bg-[#d9541e]/20 dark:text-[#ea6026] border border-[#d9541e]/30 text-xs font-mono font-bold tracking-widest uppercase shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d9541e] animate-ping" />
            <span>Citation Index Miss · Code 404</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#111111] dark:text-[#f3eee3] tracking-tight leading-[1.12]">
            The requested page is{" "}
            <em className="italic text-[#d9541e] font-serif font-light block sm:inline">
              untraced in public records.
            </em>
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#111111]/70 dark:text-[#f3eee3]/70 font-serif leading-relaxed max-w-lg mx-auto">
            The legal docket, publication, or registry URL you requested cannot be located in the national archives. It may have been archived, updated, or restricted to authorized chamber sessions.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#d9541e] hover:bg-[#bf4513] text-white text-xs font-cinzel font-bold tracking-wider transition-all shadow-md hover:scale-[1.01] cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Return to Platform Home</span>
            </Link>

            {currentUser ? (
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-xs font-cinzel font-bold tracking-wider hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-all shadow-sm"
              >
                <span>Enter Chamber Workspace</span>
                <ArrowRight className="w-4 h-4 text-[#d9541e]" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModal("signin")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-xs font-cinzel font-bold tracking-wider hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-all shadow-sm cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#d9541e]" />
                <span>Advocate &amp; Litigant Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Directory Navigator Cards */}
        <div className="relative z-10 max-w-4xl w-full mx-auto mt-16 pt-10 border-t border-[#111111]/10 dark:border-[#f3eee3]/10">
          <p className="text-[10px] font-cinzel font-bold uppercase tracking-[0.2em] text-[#111111]/50 dark:text-[#f3eee3]/50 text-center mb-6">
            Recommended Chamber Portals &amp; Public Desks
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.title}
                  href={p.href}
                  className="p-4 rounded-2xl bg-white/70 dark:bg-[#181818]/70 border border-[#111111]/10 dark:border-[#f3eee3]/10 hover:border-[#d9541e]/50 hover:shadow-md transition-all group backdrop-blur-xs"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-xl bg-[#d9541e]/10 text-[#d9541e] group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
                      {p.title}
                    </span>
                  </div>
                  <p className="text-[11px] font-serif text-[#111111]/65 dark:text-[#f3eee3]/65 leading-relaxed">
                    {p.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
