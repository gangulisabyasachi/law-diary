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
    /** Small pill badge text above the heading */
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
}

export default function Hero3({
    brandName = 'Updated Law Diary',
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
    badgeText = '✦  Sovereign Chamber Operating System',
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
}: Hero3Props) {
    const { currentUser, setAuthModal } = useChamber();
    const pathname = usePathname();
    const dashboardHref = currentUser?.role === 'admin' ? '/admin' : '/dashboard';

    const defaultSignUpLabel = currentUser ? 'Dashboard' : 'Sign In';
    const resolvedSignUpLabel = signUpLabel || defaultSignUpLabel;

    const defaultPrimaryCtaLabel = currentUser ? 'Enter Dashboard' : 'Sign Up';
    const resolvedPrimaryCtaLabel = primaryCtaLabel || defaultPrimaryCtaLabel;

    const line1Words = headingLine1.split(' ');
    const line2Words = headingLine2.split(' ');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <section className="relative w-full h-screen min-h-[720px] overflow-hidden bg-[#f3eee3] dark:bg-[#111111] transition-colors duration-500">

            {/* Background Image — cinematic zoom */}
            <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <img
                    src={bgImageSrc}
                    alt="Neoclassical Judicial Colonnade"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.endsWith('/hero-judicial.jpg')) {
                            target.src = '/hero-judicial.jpg';
                        }
                    }}
                />
            </motion.div>

            {/* Inverted Gradient overlays for depth in Light vs Dark mode */}
            {/* Top-to-bottom atmospheric gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#f3eee3]/85 via-[#f3eee3]/50 to-[#f3eee3]/95 dark:from-[#111111]/85 dark:via-[#111111]/55 dark:to-[#111111]/95 transition-colors duration-500" />
            {/* Left-to-right reading focus gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#f3eee3]/80 via-transparent to-transparent dark:from-[#111111]/85 dark:via-transparent dark:to-transparent transition-colors duration-500" />

            {/* Noise texture overlay for premium tactile feel */}
            <div
                className="absolute inset-0 opacity-[0.035] dark:opacity-[0.04] mix-blend-overlay pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '128px 128px',
                }}
            />

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col h-full w-full">

                {/* ─── Navbar ─── */}
                <motion.nav
                    className="w-full px-6 md:px-10 lg:px-16 py-5 md:py-6 flex items-center justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                >
                    {/* Brand Logo & Name */}
                    <Link href="/" className="flex items-center shrink-0 group">
                        <span 
                            className="text-[#111111] dark:text-[#f3eee3] text-2xl sm:text-[30px] font-signature tracking-normal group-hover:opacity-90 transition-opacity duration-300 select-none inline-block"
                            style={{ fontFamily: "'Photograph Signature', 'PhotographSignature', cursive" }}
                        >
                            {brandName}
                        </span>
                    </Link>

                    {/* Center Nav Links with Animated Expandable Underline */}
                    <div className="hidden lg:flex items-center gap-8 xl:gap-10">
                        {navLinks.map((link, idx) => {
                            const active = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.08 }}
                                >
                                    <Link
                                        href={link.href}
                                        className={`text-[15px] font-cinzel font-semibold transition-colors duration-200 relative group ${
                                            active
                                                ? "text-[#d9541e] font-bold"
                                                : "text-[#111111]/80 hover:text-[#111111] dark:text-[#f3eee3]/80 dark:hover:text-[#f3eee3]"
                                        }`}
                                    >
                                        {link.label}
                                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#d9541e] transition-all duration-300 ${
                                            active ? "w-full" : "w-0 group-hover:w-full"
                                        }`} />
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Right Controls: Theme Toggle & Slide-Up Auth Button */}
                    <div className="flex items-center gap-3 md:gap-5">
                        {/* Animated Theme Toggle (SolarSwitch with View Transition wave) */}
                        <div className="p-0.5 rounded-full bg-white/60 dark:bg-[#181818]/60 backdrop-blur-md border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
                            <AnimatedThemeToggle />
                        </div>

                        {/* Sign in / Dashboard pill button with slide-up invert hover */}
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
                            className="border border-[#111111]/30 dark:border-[#f3eee3]/30 text-[#111111] dark:text-[#f3eee3] rounded-full px-6 py-2 text-[14px] font-cinzel font-semibold relative overflow-hidden group cursor-pointer shadow-xs"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <span className="absolute inset-0 bg-[#111111] dark:bg-[#f3eee3] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            <span className="relative z-10 group-hover:text-[#f3eee3] dark:group-hover:text-[#111111] transition-colors duration-300">
                                {resolvedSignUpLabel}
                            </span>
                        </motion.a>

                        {/* Mobile Menu Hamburger */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden text-[#111111] dark:text-[#f3eee3] p-1.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20"
                            aria-label="Toggle navigation menu"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                    </div>
                </motion.nav>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:hidden px-6 py-4 mx-4 rounded-2xl bg-[#f3eee3]/95 dark:bg-[#181818]/95 backdrop-blur-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xl flex flex-col gap-3 z-30"
                    >
                        {navLinks.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-[#111111] dark:text-[#f3eee3] text-sm font-cinzel font-semibold py-1 hover:text-[#d9541e]"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </motion.div>
                )}

                {/* ─── Main Content Area ─── */}
                <div className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-16 pb-16 md:pb-24">
                    <div className="max-w-2xl">

                            {/* Badge pill with shimmering light sweep */}
                            <motion.div
                                className="inline-flex items-center gap-2 mb-8 md:mb-10"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.5 }}
                            >
                                <span className="relative inline-flex items-center px-4 py-1.5 rounded-full text-[12px] md:text-[13px] font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] border border-[#111111]/20 dark:border-[#f3eee3]/25 bg-white/60 dark:bg-[#181818]/60 backdrop-blur-md overflow-hidden shadow-xs">
                                    {/* Shimmer sweep */}
                                    <span className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-[#d9541e]/25 to-transparent" />
                                    <span className="relative">{badgeText}</span>
                                </span>
                            </motion.div>

                            {/* Heading — word-by-word staggered kinetic reveal */}
                            <h1 className="text-[#111111] dark:text-[#f3eee3] text-[38px] sm:text-[50px] md:text-[58px] lg:text-[66px] font-serif font-normal leading-[1.06] tracking-tight mb-6 md:mb-8">
                                <span className="block overflow-hidden">
                                    {line1Words.map((word, i) => (
                                        <motion.span
                                            key={i}
                                            className="inline-block mr-[0.3em]"
                                            initial={{ y: '110%', opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                duration: 0.8,
                                                delay: 0.7 + i * 0.1,
                                                ease: [0.33, 1, 0.68, 1],
                                            }}
                                        >
                                            {word}
                                        </motion.span>
                                    ))}
                                </span>
                                <em className="block overflow-hidden italic font-serif font-light pb-1 text-[#d9541e]">
                                    {line2Words.map((word, i) => (
                                        <motion.span
                                            key={i}
                                            className="inline-block mr-[0.3em]"
                                            initial={{ y: '110%', opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                duration: 0.8,
                                                delay: 1.0 + i * 0.1,
                                                ease: [0.33, 1, 0.68, 1],
                                            }}
                                        >
                                            {word}
                                        </motion.span>
                                    ))}
                                </em>
                            </h1>

                            {/* Animated horizontal gradient rule */}
                            <motion.div
                                className="h-px bg-gradient-to-r from-[#d9541e]/60 via-[#111111]/20 dark:via-[#f3eee3]/20 to-transparent mb-6 md:mb-8 max-w-md"
                                initial={{ scaleX: 0, originX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1.2, delay: 1.3, ease: [0.33, 1, 0.68, 1] }}
                            />

                            {/* Description */}
                            <motion.p
                                className="text-[#111111]/75 dark:text-[#f3eee3]/75 font-serif italic text-sm md:text-base leading-relaxed max-w-md mb-10 md:mb-12"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.9, delay: 1.4, ease: 'easeOut' }}
                            >
                                {description}
                            </motion.p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap items-center gap-5 sm:gap-7">
                                {/* Primary CTA — animated shifting gradient border pill in Terracotta (#d9541e) */}
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
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, delay: 1.6 }}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    {/* Animated gradient border */}
                                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d9541e] via-amber-400 to-[#d9541e] [background-size:200%_100%] animate-[gradientShift_3s_linear_infinite]" />
                                    <span className="relative z-10 block px-8 py-3.5 rounded-full bg-[#d9541e] text-white font-cinzel font-bold text-xs tracking-widest uppercase group-hover:bg-[#bf4513] transition-all duration-300">
                                        {resolvedPrimaryCtaLabel}
                                    </span>
                                </motion.a>

                                {/* Secondary CTA with translating arrow on hover */}
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
                                    className="flex items-center gap-2 text-[#111111] dark:text-[#f3eee3] hover:text-[#d9541e] dark:hover:text-[#d9541e] text-xs font-cinzel font-bold tracking-wider uppercase transition-colors group cursor-pointer"
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.7, delay: 1.8 }}
                                >
                                    <span>{secondaryCtaLabel}</span>
                                    <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1.5 transition-transform duration-300 text-[#d9541e]" />
                                </motion.a>
                            </div>
                    </div>
                </div>

                {/* ─── Bottom Bar ─── */}
                <div className="w-full px-6 md:px-10 lg:px-16 pb-8 md:pb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">

                    <motion.p
                        className="text-[#111111]/60 dark:text-[#f3eee3]/60 font-serif italic text-[12px] md:text-[13px] leading-relaxed whitespace-pre-line"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 2 }}
                    >
                        {bottomTagline}
                    </motion.p>

                    <motion.a
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
                        className="flex items-center gap-2.5 text-[#111111]/60 hover:text-[#111111] dark:text-[#f3eee3]/60 dark:hover:text-[#f3eee3] text-[12px] md:text-[13px] font-cinzel font-bold tracking-wider uppercase transition-colors shrink-0 group cursor-pointer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 2.2 }}
                    >
                        {/* Animated expanding line before text */}
                        <motion.span
                            className="hidden sm:block w-8 h-px bg-[#111111]/30 dark:bg-[#f3eee3]/30 group-hover:w-12 group-hover:bg-[#d9541e] transition-all duration-300 origin-left"
                        />
                        <span>{scrollText}</span>
                        <motion.span
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                            className="text-[#d9541e]"
                        >
                            <ArrowDown size={16} strokeWidth={2} />
                        </motion.span>
                    </motion.a>
                </div>

            </div>

            {/* CSS keyframes injected inline */}
            <style>{`
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
