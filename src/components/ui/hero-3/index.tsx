'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChamber } from '@/context/ChamberContext';
import { AnimatedThemeToggle } from '@/components/ui/animated-theme-toggle';

export interface NavLink {
    label: string;
    href: string;
}

export interface Hero3Props {
    brandName?: string;
    navLinks?: NavLink[];
    language?: string;
    signUpLabel?: string;
    signUpHref?: string;
    onSignUpClick?: () => void;
    /** Clean editorial eyebrow text above the heading */
    eyebrowText?: string;
    /** Backward compatibility fallbacks */
    folioTitle?: string;
    badgeText?: string;
    headingLine1?: string;
    headingLine2?: string;
    description?: string;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    onPrimaryCtaClick?: () => void;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    onSecondaryCtaClick?: () => void;

    bottomTagline?: string;
    scrollText?: string;
    scrollHref?: string;
    bgImageSrc?: string;
    bgLightImageSrc?: string;
}

export default function Hero3({
    brandName = 'LexDaily',
    navLinks = [
        { label: 'Features', href: '/features' },
        { label: 'Security & Ethics', href: '/security' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Registrar Desk', href: '/contact' },
    ],
    language = 'EN',
    signUpLabel,
    signUpHref,
    onSignUpClick,
    eyebrowText = 'Sovereign Chamber Operating System',
    folioTitle,
    badgeText,
    headingLine1 = 'Building sovereign clarity',
    headingLine2 = 'into Indian litigation.',
    description = 'From automated court cause lists and 16-character CNR dockets to statutory Limitation Act radars. Engineered specifically for Senior Advocates and modern private chambers.',
    primaryCtaLabel,
    primaryCtaHref = '#features-section',
    onPrimaryCtaClick,
    secondaryCtaLabel = 'Chamber Security',
    secondaryCtaHref = '/security',
    onSecondaryCtaClick,
    bottomTagline = 'Two-Man Verification Protocol\nStrict Chamber Vault Isolation\nBar Council of India Rule 36 Compliant',
    scrollText = 'Scroll to Discover',
    scrollHref = '#features-section',
    bgImageSrc = '/hero-judicial.jpg',
    bgLightImageSrc = '/hero-judicial-light.jpg',
}: Hero3Props) {
    const { currentUser, setAuthModal } = useChamber();
    const pathname = usePathname();
    const dashboardHref = currentUser?.role === 'admin' ? '/admin' : '/dashboard';

    const defaultSignUpLabel = currentUser ? 'Dashboard' : 'Sign In';
    const resolvedSignUpLabel = signUpLabel || defaultSignUpLabel;

    const defaultPrimaryCtaLabel = currentUser ? 'Enter Dashboard' : 'Sign Up';
    const resolvedPrimaryCtaLabel = primaryCtaLabel || defaultPrimaryCtaLabel;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    /**
     * Unified Layout Renderer:
     * Guarantees that Layer 1 (Base Dominant) and Layer 2 (Clipped Slice Overlay)
     * share 100% identical structural geometry, padding, font metrics, line-heights,
     * and element dimensions, ensuring mathematically zero vertical offset (0px discrepancy).
     */
    const renderHeroLayer = (isSlice: boolean) => {
        const textBase = isSlice ? "text-[#f3eee3] dark:text-[#111111]" : "text-[#111111] dark:text-[#f3eee3]";
        const textMuted = isSlice ? "text-[#f3eee3]/75 dark:text-[#111111]/75" : "text-[#111111]/75 dark:text-[#f3eee3]/75";
        const textSubtle = isSlice ? "text-[#f3eee3]/60 dark:text-[#111111]/60" : "text-[#111111]/60 dark:text-[#f3eee3]/60";
        const pillBorder = isSlice ? "border-[#f3eee3]/20 dark:border-[#111111]/25 bg-[#181818]/60 dark:bg-white/60" : "border-[#111111]/20 dark:border-[#f3eee3]/25 bg-white/60 dark:bg-[#181818]/60";
        const navLinkColor = isSlice ? "text-[#f3eee3]/80 hover:text-[#f3eee3] dark:text-[#111111]/80 dark:hover:text-[#111111]" : "text-[#111111]/80 hover:text-[#111111] dark:text-[#f3eee3]/80 dark:hover:text-[#f3eee3]";
        const btnBorder = isSlice ? "border-[#f3eee3]/30 dark:border-[#111111]/30" : "border-[#111111]/30 dark:border-[#f3eee3]/30";
        const hrColor = isSlice ? "via-[#f3eee3]/20 dark:via-[#111111]/20" : "via-[#111111]/20 dark:via-[#f3eee3]/20";

        return (
            <div
                className={`relative flex flex-col h-full w-full ${isSlice ? "pointer-events-none select-none" : ""}`}
                aria-hidden={isSlice ? "true" : undefined}
            >
                {/* ─── Navbar ─── */}
                <nav className="w-full px-6 md:px-10 lg:px-16 py-5 md:py-6 flex items-center justify-between">
                    {/* Brand Logo & Name */}
                    {isSlice ? (
                        <div className="flex items-center shrink-0">
                            <span
                                className={`${textBase} text-2xl sm:text-[34px] font-clagista tracking-normal select-none inline-block`}
                                style={{ fontFamily: "'Clagista', cursive, sans-serif" }}
                            >
                                {brandName}
                            </span>
                        </div>
                    ) : (
                        <Link href="/" className="flex items-center shrink-0 group">
                            <span
                                className={`${textBase} text-2xl sm:text-[34px] font-clagista tracking-normal group-hover:opacity-90 transition-opacity duration-300 select-none inline-block`}
                                style={{ fontFamily: "'Clagista', cursive, sans-serif" }}
                            >
                                {brandName}
                            </span>
                        </Link>
                    )}

                    {/* Center Nav Links with Animated Expandable Underline */}
                    <div className="hidden lg:flex items-center gap-8 xl:gap-10">
                        {navLinks.map((link, idx) => {
                            const active = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                            return (
                                <div key={idx}>
                                    {isSlice ? (
                                        <span className={`text-[15px] font-cinzel font-semibold relative ${active ? "text-[#d9541e] font-bold" : navLinkColor}`}>
                                            {link.label}
                                            <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#d9541e] ${active ? "w-full" : "w-0"}`} />
                                        </span>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className={`text-[15px] font-cinzel font-semibold transition-colors duration-200 relative group ${active ? "text-[#d9541e] font-bold" : navLinkColor
                                                }`}
                                        >
                                            {link.label}
                                            <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#d9541e] transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Controls: Theme Toggle & Slide-Up Auth Button */}
                    <div className="flex items-center gap-3 md:gap-5">
                        {/* Animated Theme Toggle Housing */}
                        <div className={`p-0.5 rounded-full ${isSlice ? "bg-[#181818]/60 dark:bg-white/60 border-[#f3eee3]/20 dark:border-[#111111]/15" : "bg-white/60 dark:bg-[#181818]/60 border-[#111111]/15 dark:border-[#f3eee3]/20"} backdrop-blur-md border shadow-xs`}>
                            {isSlice ? (
                                <div className="size-9" />
                            ) : (
                                <AnimatedThemeToggle />
                            )}
                        </div>

                        {/* Sign in / Dashboard pill button */}
                        {isSlice ? (
                            <div className={`border ${btnBorder} ${textBase} rounded-full px-6 py-2 text-[14px] font-cinzel font-semibold relative overflow-hidden shadow-xs pointer-events-none`}>
                                <span className="relative z-10">
                                    {resolvedSignUpLabel}
                                </span>
                            </div>
                        ) : (
                            <motion.a
                                href={signUpHref || (currentUser ? dashboardHref : '#')}
                                onClick={(e) => {
                                    if (onSignUpClick) {
                                        e.preventDefault();
                                        onSignUpClick();
                                    } else if (!currentUser) {
                                        e.preventDefault();
                                        setAuthModal('signin');
                                    }
                                }}
                                className={`border ${btnBorder} ${textBase} rounded-full px-6 py-2 text-[14px] font-cinzel font-semibold relative overflow-hidden group cursor-pointer shadow-xs`}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <span className="absolute inset-0 bg-[#111111] dark:bg-[#f3eee3] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                <span className="relative z-10 group-hover:text-[#f3eee3] dark:group-hover:text-[#111111] transition-colors duration-300">
                                    {resolvedSignUpLabel}
                                </span>
                            </motion.a>
                        )}

                        {/* Mobile Menu Hamburger */}
                        <button
                            onClick={!isSlice ? () => setMobileMenuOpen(!mobileMenuOpen) : undefined}
                            className={`lg:hidden ${textBase} p-1.5 rounded-xl border ${btnBorder} ${isSlice ? "pointer-events-none" : "cursor-pointer"}`}
                            aria-label="Toggle navigation menu"
                            tabIndex={isSlice ? -1 : undefined}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className={`lg:hidden px-6 py-4 mx-4 rounded-2xl ${isSlice ? "bg-[#181818]/95 dark:bg-[#f3eee3]/95" : "bg-[#f3eee3]/95 dark:bg-[#181818]/95"} backdrop-blur-xl border ${btnBorder} shadow-xl flex flex-col gap-3 z-30`}>
                        {navLinks.map((link, idx) => (
                            <div key={idx}>
                                {isSlice ? (
                                    <span className={`${textBase} text-sm font-cinzel font-semibold py-1`}>{link.label}</span>
                                ) : (
                                    <Link
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`${textBase} text-sm font-cinzel font-semibold py-1 hover:text-[#d9541e]`}
                                    >
                                        {link.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ─── Main Content Area ─── */}
                <div className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-16 pb-16 md:pb-24">
                    <div className="max-w-2xl">

                        {/* Clean Editorial Eyebrow / Kicker */}
                        {(eyebrowText || folioTitle || badgeText) && (
                            <div className="mb-3.5 sm:mb-4 md:mb-5 select-none">
                                <span className="text-[11px] sm:text-[12px] md:text-[13px] font-cinzel font-semibold tracking-[0.24em] text-[#d9541e] uppercase inline-block">
                                    {eyebrowText || folioTitle || badgeText}
                                </span>
                            </div>
                        )}

                        {/* Heading — Perfectly matched native text rendering with ZERO baseline drift */}
                        <h1 className={`${textBase} text-[38px] sm:text-[50px] md:text-[58px] lg:text-[66px] font-serif font-normal leading-[1.06] tracking-tight mb-6 md:mb-8`}>
                            <span className="block">
                                {headingLine1}
                            </span>
                            <em className="block italic font-serif font-light pb-1 text-[#d9541e]">
                                {headingLine2}
                            </em>
                        </h1>

                        {/* Horizontal gradient rule */}
                        <div className={`h-px bg-gradient-to-r from-[#d9541e]/60 ${hrColor} to-transparent mb-6 md:mb-8 max-w-md`} />

                        {/* Description */}
                        <p className={`${textMuted} font-serif italic text-sm md:text-base leading-relaxed max-w-md mb-10 md:mb-12`}>
                            {description}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-5 sm:gap-7">
                            {/* Primary CTA */}
                            {isSlice ? (
                                <div className="relative rounded-full p-px overflow-hidden shadow-md pointer-events-none">
                                    <span className="relative z-10 block px-8 py-3.5 rounded-full bg-[#d9541e] text-white font-cinzel font-bold text-xs tracking-widest uppercase">
                                        {resolvedPrimaryCtaLabel}
                                    </span>
                                </div>
                            ) : (
                                <motion.a
                                    href={primaryCtaHref}
                                    onClick={(e) => {
                                        if (onPrimaryCtaClick) {
                                            e.preventDefault();
                                            onPrimaryCtaClick();
                                        } else if (!currentUser && primaryCtaHref === '#') {
                                            e.preventDefault();
                                            setAuthModal('signup');
                                        } else if (primaryCtaHref && primaryCtaHref.startsWith('#')) {
                                            e.preventDefault();
                                            const id = primaryCtaHref.slice(1);
                                            const el = document.getElementById(id);
                                            if (el) {
                                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                window.history.pushState(null, '', primaryCtaHref);
                                            } else {
                                                window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
                                            }
                                        }
                                    }}
                                    className="relative rounded-full p-px overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d9541e] via-amber-400 to-[#d9541e] [background-size:200%_100%] animate-[gradientShift_3s_linear_infinite]" />
                                    <span className="relative z-10 block px-8 py-3.5 rounded-full bg-[#d9541e] text-white font-cinzel font-bold text-xs tracking-widest uppercase group-hover:bg-[#bf4513] transition-all duration-300">
                                        {resolvedPrimaryCtaLabel}
                                    </span>
                                </motion.a>
                            )}

                            {/* Secondary CTA */}
                            {isSlice ? (
                                <div className={`flex items-center gap-2 ${textBase} text-xs font-cinzel font-bold tracking-wider uppercase pointer-events-none`}>
                                    <span>{secondaryCtaLabel}</span>
                                    <ArrowRight size={16} strokeWidth={2.5} className="text-[#d9541e]" />
                                </div>
                            ) : (
                                <motion.a
                                    href={secondaryCtaHref}
                                    onClick={(e) => {
                                        if (onSecondaryCtaClick) {
                                            e.preventDefault();
                                            onSecondaryCtaClick();
                                        } else if (secondaryCtaHref && secondaryCtaHref.startsWith('#')) {
                                            e.preventDefault();
                                            const id = secondaryCtaHref.slice(1);
                                            const el = document.getElementById(id);
                                            if (el) {
                                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                window.history.pushState(null, '', secondaryCtaHref);
                                            }
                                        }
                                    }}
                                    className={`flex items-center gap-2 ${textBase} hover:text-[#d9541e] dark:hover:text-[#d9541e] text-xs font-cinzel font-bold tracking-wider uppercase transition-colors group cursor-pointer`}
                                    whileHover={{ x: 2 }}
                                >
                                    <span>{secondaryCtaLabel}</span>
                                    <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1.5 transition-transform duration-300 text-[#d9541e]" />
                                </motion.a>
                            )}
                        </div>
                    </div>
                </div>

                {/* ─── Bottom Bar ─── */}
                <div className="w-full px-6 md:px-10 lg:px-16 pb-8 md:pb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
                    <p className={`${textSubtle} font-serif italic text-[12px] md:text-[13px] leading-relaxed whitespace-pre-line`}>
                        {bottomTagline}
                    </p>

                    {isSlice ? (
                        <div className={`flex items-center gap-2.5 ${textSubtle} text-[12px] md:text-[13px] font-cinzel font-bold tracking-wider uppercase shrink-0 pointer-events-none`}>
                            <span className={`hidden sm:block w-8 h-px ${isSlice ? "bg-[#f3eee3]/30 dark:bg-[#111111]/30" : "bg-[#111111]/30 dark:bg-[#f3eee3]/30"}`} />
                            <span>{scrollText}</span>
                            <span className="text-[#d9541e]">
                                <ArrowDown size={16} strokeWidth={2} />
                            </span>
                        </div>
                    ) : (
                        <a
                            href={scrollHref || "#features-section"}
                            onClick={(e) => {
                                const target = scrollHref || "#features-section";
                                if (target.startsWith("#")) {
                                    e.preventDefault();
                                    const id = target.slice(1);
                                    const el = document.getElementById(id);
                                    if (el) {
                                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                                        window.history.pushState(null, "", target);
                                    } else {
                                        window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
                                    }
                                }
                            }}
                            className={`flex items-center gap-2.5 ${textSubtle} hover:text-[#111111] dark:hover:text-[#f3eee3] text-[12px] md:text-[13px] font-cinzel font-bold tracking-wider uppercase transition-colors shrink-0 group cursor-pointer`}
                        >
                            <span className="hidden sm:block w-8 h-px bg-[#111111]/30 dark:bg-[#f3eee3]/30 group-hover:w-12 group-hover:bg-[#d9541e] transition-all duration-300 origin-left" />
                            <span>{scrollText}</span>
                            <span className="text-[#d9541e]">
                                <ArrowDown size={16} strokeWidth={2} />
                            </span>
                        </a>
                    )}
                </div>
            </div>
        );
    };

    return (
        <section className="relative w-full h-screen min-h-[720px] overflow-hidden bg-[#f3eee3] dark:bg-[#111111] transition-colors duration-500 group/hero">

            {/* ─── SVG ClipPath & Gradient Definitions for Responsive Chiaroscuro Curve ─── */}
            <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true" focusable="false">
                <defs>
                    {/* Sculpted Golden-Ratio Desktop Curve: elegant S-curve passing cleanly through headline */}
                    <clipPath id="chiaroscuro-curve-desktop" clipPathUnits="objectBoundingBox">
                        <path d="M 0 0 L 0.215 0 C 0.315 0.22, 0.210 0.52, 0.385 1.0 L 0 1.0 Z" />
                    </clipPath>
                    {/* Sculpted Mobile & Tablet Curve: slightly wider to comfortably frame branding */}
                    <clipPath id="chiaroscuro-curve-mobile" clipPathUnits="objectBoundingBox">
                        <path d="M 0 0 L 0.380 0 C 0.480 0.22, 0.350 0.52, 0.520 1.0 L 0 1.0 Z" />
                    </clipPath>

                    {/* Gilded Terracotta Seam Linear Gradient */}
                    <linearGradient id="chiaroscuro-seam-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d9541e" stopOpacity="0.4" />
                        <stop offset="25%" stopColor="#e5a93c" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#d9541e" stopOpacity="1" />
                        <stop offset="75%" stopColor="#e5a93c" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#d9541e" stopOpacity="0.45" />
                    </linearGradient>
                </defs>
            </svg>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* ─── BACKGROUND ARCHITECTURE (Dark Nocturne & Light Diurne) ─── */}
            {/* ═══════════════════════════════════════════════════════════ */}

            {/* Daylight Judicial Background (Light Mode) */}
            <div className="absolute inset-0 z-0 dark:opacity-0 transition-opacity duration-700 ease-in-out">
                <img
                    src={bgLightImageSrc}
                    alt="Daylight Judicial Architecture"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.endsWith('/hero-judicial.jpg')) {
                            target.src = '/hero-judicial.jpg';
                        }
                    }}
                />
            </div>

            {/* Nocturne Judicial Background (Dark Mode) */}
            <div className="absolute inset-0 z-0 opacity-0 dark:opacity-100 transition-opacity duration-700 ease-in-out">
                <img
                    src={bgImageSrc}
                    alt="Nocturne Judicial Architecture"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.endsWith('/hero-judicial.jpg')) {
                            target.src = '/hero-judicial.jpg';
                        }
                    }}
                />
            </div>

            {/* Inverted Gradient overlays for depth in Light vs Dark mode */}
            {/* Top-to-bottom atmospheric gradient */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#f3eee3]/85 via-[#f3eee3]/45 to-[#f3eee3]/95 dark:from-[#111111]/85 dark:via-[#111111]/55 dark:to-[#111111]/95 transition-colors duration-500" />
            {/* Left-to-right reading focus gradient */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#f3eee3]/80 via-transparent to-transparent dark:from-[#111111]/85 dark:via-transparent dark:to-transparent transition-colors duration-500" />

            {/* Noise texture overlay for premium tactile feel */}
            <div
                className="absolute inset-0 z-[2] opacity-[0.035] dark:opacity-[0.04] mix-blend-overlay pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '128px 128px',
                }}
            />

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* ─── LAYER 1: BASE DOMINANT INTERACTIVE LAYER ─── */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="relative z-10 h-full w-full">
                {renderHeroLayer(false)}
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* ─── LAYER 2: CHIAROSCURO MINORITY SLICE (CLIPPED OVERLAY) ─── */}
            {/* Clipped by the exact same sculpted Bézier curve.          */}
            {/* Because both layers are rendered by the unified renderer, */}
            {/* their vertical baseline is 100% identical (0px drift).    */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div
                className="chiaroscuro-slice absolute inset-0 z-20 pointer-events-none select-none overflow-hidden drop-shadow-[4px_0_20px_rgba(0,0,0,0.35)] dark:drop-shadow-[8px_0_32px_rgba(0,0,0,0.6)]"
                aria-hidden="true"
            >
                {/* Slice Background: In Dark Mode = Linen Cream; In Light Mode = Obsidian Dark */}
                <div className="absolute inset-0 bg-[#111111] dark:bg-[#f3eee3] transition-colors duration-500" />

                {/* Slice Content: 100% identical layout with inverted text colors */}
                {renderHeroLayer(true)}
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* ─── LAYER 3: AESTHETIC GILDED SEAM FILAMENT & CELESTIAL PIPS ─ */}
            {/* ═══════════════════════════════════════════════════════════ */}

            {/* Desktop Seam Artistry */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-25 hidden lg:block overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 1000 1000"
                aria-hidden="true"
            >
                {/* 1. Soft Ambient Terracotta Blur Glow */}
                <path
                    d="M 215 0 C 315 220, 210 520, 385 1000"
                    fill="none"
                    stroke="#d9541e"
                    strokeWidth="5"
                    strokeOpacity="0.32"
                    className="blur-[3px] group-hover/hero:stroke-opacity-60 transition-all duration-700"
                />

                {/* 2. Gilded & Terracotta Primary Hairline */}
                <path
                    d="M 215 0 C 315 220, 210 520, 385 1000"
                    fill="none"
                    stroke="url(#chiaroscuro-seam-gradient)"
                    strokeWidth="1.8"
                    className="group-hover/hero:stroke-[2.2] transition-all duration-500"
                />

                {/* 3. Celestial Astrolabe Diamond Pips at golden-ratio intervals */}
                <g className="transition-opacity duration-500 opacity-90 group-hover/hero:opacity-100">
                    <polygon
                        points="256,152 262,158 256,164 250,158"
                        fill="#d9541e"
                        stroke="#f3eee3"
                        strokeWidth="0.8"
                        className="drop-shadow-xs"
                    />
                    <polygon
                        points="272,396 278,402 272,408 266,402"
                        fill="#d9541e"
                        stroke="#f3eee3"
                        strokeWidth="0.8"
                        className="drop-shadow-xs"
                    />
                    <polygon
                        points="305,702 311,708 305,714 299,708"
                        fill="#d9541e"
                        stroke="#f3eee3"
                        strokeWidth="0.8"
                        className="drop-shadow-xs"
                    />
                </g>
            </svg>

            {/* Mobile Seam Artistry */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-25 block lg:hidden overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 1000 1000"
                aria-hidden="true"
            >
                <path
                    d="M 380 0 C 480 220, 350 520, 520 1000"
                    fill="none"
                    stroke="#d9541e"
                    strokeWidth="4"
                    strokeOpacity="0.30"
                    className="blur-[2px]"
                />
                <path
                    d="M 380 0 C 480 220, 350 520, 520 1000"
                    fill="none"
                    stroke="url(#chiaroscuro-seam-gradient)"
                    strokeWidth="1.6"
                />
                <g className="opacity-80">
                    <polygon points="418,152 424,158 418,164 412,158" fill="#d9541e" stroke="#f3eee3" strokeWidth="0.8" />
                    <polygon points="424,396 430,402 424,408 418,402" fill="#d9541e" stroke="#f3eee3" strokeWidth="0.8" />
                    <polygon points="446,702 452,708 446,714 440,708" fill="#d9541e" stroke="#f3eee3" strokeWidth="0.8" />
                </g>
            </svg>

            {/* CSS clip-path styles & keyframes */}
            <style jsx global>{`
                @media (min-width: 1024px) {
                    .chiaroscuro-slice {
                        clip-path: url(#chiaroscuro-curve-desktop);
                        -webkit-clip-path: url(#chiaroscuro-curve-desktop);
                    }
                }
                @media (max-width: 1023px) {
                    .chiaroscuro-slice {
                        clip-path: url(#chiaroscuro-curve-mobile);
                        -webkit-clip-path: url(#chiaroscuro-curve-mobile);
                    }
                }
                @keyframes shimmer {
                    to { transform: translateX(200%); }
                }
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
            `}</style>
        </section>
    );
}

export { Hero3 };
