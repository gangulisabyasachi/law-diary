"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";
import { AnimatedThemeToggle } from "@/components/ui/animated-theme-toggle";

export function PublicNavbar() {
  const { currentUser, theme, toggleTheme, setAuthModal } = useChamber();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardHref = currentUser?.role === "admin" ? "/admin" : "/dashboard";

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "Security & Ethics", href: "/security" },
    { label: "Pricing", href: "/pricing" },
    { label: "Registrar Desk", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#3df2e0]/90 dark:bg-[#0b0f14]/90 backdrop-blur-xl border-b border-[#0b0f14]/15 dark:border-[#3df2e0]/20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Text Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-lg sm:text-xl font-cinzel font-black tracking-wider text-[#0b0f14] dark:text-[#3df2e0] group-hover:opacity-90 transition-opacity">
            Updated Law Diary
          </span>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl bg-white/60 dark:bg-[#0f151c]/80 border border-[#0b0f14]/10 dark:border-[#3df2e0]/20 shadow-xs">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-semibold transition-all ${
                  active
                    ? "bg-[#0b0f14] text-[#3df2e0] dark:bg-[#3df2e0] dark:text-[#0b0f14] shadow-xs"
                    : "text-[#0b0f14]/75 dark:text-[#3df2e0]/70 hover:text-[#0b0f14] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Animated Theme Toggle (21st.dev SolarSwitch) */}
          <AnimatedThemeToggle />

          {/* Dynamic Authenticated / Unauthenticated Action */}
          {currentUser ? (
            <Link
              href={dashboardHref}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1b1d3a] text-[#e8d5b5] hover:bg-[#25284e] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] dark:hover:bg-[#dfc8a2] font-cinzel font-bold text-xs tracking-wider transition-all shadow-md group"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <>
              <button
                onClick={() => setAuthModal("signin")}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#0f151c] hover:bg-white/80 dark:hover:bg-[#181b22] text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 font-cinzel font-semibold text-xs tracking-wider transition-all shadow-xs"
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthModal("signup")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b1d3a] text-[#e8d5b5] hover:bg-[#25284e] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] dark:hover:bg-[#dfc8a2] font-cinzel font-bold text-xs tracking-wider transition-all shadow-md"
              >
                <span>Sign Up</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white dark:bg-[#0f151c] text-[#0b0f14] dark:text-[#3df2e0] border border-[#0b0f14]/15 dark:border-[#3df2e0]/20"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#0b0f14]/10 dark:border-[#3df2e0]/15 bg-white/95 dark:bg-[#0b0f14]/95 backdrop-blur-2xl p-5 space-y-4">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold transition-colors ${
                    active
                      ? "bg-[#0b0f14] text-[#3df2e0] dark:bg-[#3df2e0] dark:text-[#0b0f14]"
                      : "text-[#0b0f14] dark:text-[#3df2e0] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#0b0f14]/10 dark:border-[#3df2e0]/15 flex items-center justify-between">
            <span className="text-xs font-cinzel font-bold text-[#0b0f14]/70 dark:text-[#3df2e0]/70">Appearance:</span>
            <AnimatedThemeToggle />
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {currentUser ? (
              <Link
                href={dashboardHref}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-[#1b1d3a] text-[#e8d5b5] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] font-cinzel font-bold text-xs text-center uppercase tracking-wider"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setAuthModal("signin"); setMobileMenuOpen(false); }}
                  className="py-2.5 rounded-xl border border-[#0b0f14]/15 dark:border-[#3df2e0]/20 text-[#0b0f14] dark:text-[#3df2e0] text-xs font-cinzel font-bold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setAuthModal("signup"); setMobileMenuOpen(false); }}
                  className="py-2.5 rounded-xl bg-[#1b1d3a] text-[#e8d5b5] dark:bg-[#e8d5b5] dark:text-[#1b1d3a] text-xs font-cinzel font-bold"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
