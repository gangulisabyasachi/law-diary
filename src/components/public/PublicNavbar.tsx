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
    <header className="sticky top-0 z-40 bg-[#f3eee3]/90 dark:bg-[#111111]/90 backdrop-blur-xl border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-20 py-4 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center shrink-0 group">
          <span 
            className="text-[#111111] dark:text-[#f3eee3] text-2xl sm:text-[32px] font-alex-brush tracking-normal group-hover:opacity-90 transition-opacity duration-300 select-none inline-block"
            style={{ fontFamily: "'Alex Brush', cursive, sans-serif" }}
          >
            LexChron
          </span>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-white/60 dark:bg-[#181818]/80 border border-[#111111]/10 dark:border-[#f3eee3]/20 shadow-xs">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-xs font-cinzel font-semibold transition-all ${
                  active
                    ? "bg-[#d9541e] text-white shadow-xs"
                    : "text-[#111111]/75 dark:text-[#f3eee3]/70 hover:text-[#111111] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
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
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs tracking-wider transition-all shadow-md group"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <>
              <button
                onClick={() => setAuthModal("signin")}
                className="px-5 py-2 rounded-full bg-white dark:bg-[#181818] hover:bg-white/80 dark:hover:bg-[#181b22] text-[#111111] dark:text-[#f3eee3] border border-[#111111]/15 dark:border-[#f3eee3]/20 font-cinzel font-semibold text-xs tracking-wider transition-all shadow-xs"
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthModal("signup")}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm font-cinzel font-bold text-xs tracking-wider transition-all shadow-md"
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
            className="p-2 rounded-xl bg-white dark:bg-[#181818] text-[#111111] dark:text-[#f3eee3] border border-[#111111]/15 dark:border-[#f3eee3]/20"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#111111]/10 dark:border-[#f3eee3]/15 bg-white/95 dark:bg-[#111111]/95 backdrop-blur-2xl p-5 space-y-4">
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
                      ? "bg-[#d9541e] text-white"
                      : "text-[#111111] dark:text-[#f3eee3] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#111111]/10 dark:border-[#f3eee3]/15 flex items-center justify-between">
            <span className="text-xs font-cinzel font-bold text-[#111111]/70 dark:text-[#f3eee3]/70">Appearance:</span>
            <AnimatedThemeToggle />
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {currentUser ? (
              <Link
                href={dashboardHref}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-[#d9541e] text-white dark:bg-[#d9541e] dark:text-white font-cinzel font-bold text-xs text-center uppercase tracking-wider"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setAuthModal("signin"); setMobileMenuOpen(false); }}
                  className="py-2.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-xs font-cinzel font-bold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setAuthModal("signup"); setMobileMenuOpen(false); }}
                  className="py-2.5 rounded-xl bg-[#d9541e] text-white dark:bg-[#d9541e] dark:text-white text-xs font-cinzel font-bold"
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
