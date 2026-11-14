"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;

      // Show button after scrolling down 280px
      if (scrollTop > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Calculate 0 to 100% progress
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // SVG circular progress metrics
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center bg-[#f3eee3]/90 dark:bg-[#181818]/90 backdrop-blur-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-lg hover:shadow-2xl text-[#111111] dark:text-[#f3eee3] group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9541e] transition-colors"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          {/* Subtle Circular Scroll Progress Ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
            viewBox="0 0 48 48"
          >
            {/* Background track */}
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="stroke-[#111111]/10 dark:stroke-[#f3eee3]/10"
              strokeWidth="2.5"
              fill="transparent"
            />
            {/* Active progress track */}
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="stroke-[#d9541e] transition-all duration-150 ease-out"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Upward Arrow Icon with smooth lift animation */}
          <ArrowUp className="w-4 h-4 text-[#d9541e] group-hover:-translate-y-0.5 transition-transform duration-200 relative z-10" />

          {/* Subtle tooltip on hover */}
          <span className="sr-only">Scroll to top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
