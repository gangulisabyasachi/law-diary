"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export interface CinematicThemeSwitcherProps {
  className?: string;
  style?: React.CSSProperties;
  showLabel?: boolean;
}

function useChamberSafe() {
  try {
    return useChamber();
  } catch {
    return null;
  }
}

export function CinematicThemeSwitcher({
  className = "",
  style,
  showLabel = true,
}: CinematicThemeSwitcherProps) {
  const chamber = useChamberSafe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dark = mounted ? chamber?.theme === "dark" : true;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (chamber?.toggleTheme) {
      chamber.toggleTheme(e.currentTarget);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      aria-label={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`group relative inline-flex items-center gap-2.5 rounded-full p-[1.5px] transition-all duration-500 cursor-pointer select-none focus:outline-none shadow-md ${
        dark
          ? "bg-gradient-to-r from-[#3df2e0]/60 via-[#1b1d3a] to-[#3df2e0]/40 shadow-[0_0_16px_rgba(61,242,224,0.25)]"
          : "bg-gradient-to-r from-amber-400/80 via-orange-400/70 to-yellow-500/80 shadow-[0_0_16px_rgba(245,158,11,0.3)]"
      } ${className}`}
      style={style}
    >
      {/* Inner Pill Body */}
      <div
        className={`flex items-center gap-2 rounded-full px-3 py-1.5 backdrop-blur-xl transition-colors duration-500 ${
          dark
            ? "bg-[#0b0f14]/90 text-[#3df2e0]"
            : "bg-white/90 text-[#0b0f14]"
        }`}
      >
        {/* Animated Icon Container */}
        <div className="relative flex size-6 items-center justify-center overflow-hidden rounded-full">
          <AnimatePresence mode="wait" initial={false}>
            {!mounted ? (
              <div className="size-4 rounded-full bg-current/20 animate-pulse" />
            ) : dark ? (
              <motion.div
                key="moon"
                initial={{ y: -16, opacity: 0, rotate: -45, scale: 0.6 }}
                animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
                exit={{ y: 16, opacity: 0, rotate: 45, scale: 0.6 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-center justify-center text-[#3df2e0]"
              >
                <Moon className="size-4 fill-[#3df2e0]/20 stroke-[1.8]" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ y: -16, opacity: 0, rotate: 45, scale: 0.6 }}
                animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
                exit={{ y: 16, opacity: 0, rotate: -45, scale: 0.6 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-center justify-center text-amber-500"
              >
                <Sun className="size-4 fill-amber-400/30 stroke-[1.8] animate-[spin_16s_linear_infinite]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mode Label with Mounted Guard to Prevent Reload Flash */}
        {showLabel && (
          <span className="text-xs font-cinzel font-bold pr-1 select-none whitespace-nowrap tracking-wider min-w-[70px] text-left">
            <span
              className={`inline-block transition-opacity duration-300 ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
            >
              {mounted ? (dark ? "Dark Mode" : "Light Mode") : "Mode"}
            </span>
          </span>
        )}
      </div>
    </motion.button>
  );
}

export default CinematicThemeSwitcher;
