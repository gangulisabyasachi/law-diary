"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { motion, AnimatePresence } from "framer-motion";
import { useChamber } from "@/context/ChamberContext";

export interface AnimatedThemeToggleProps {
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

export const AnimatedThemeToggle = ({
  className,
  style,
  showLabel = false,
}: AnimatedThemeToggleProps) => {
  const chamber = useChamberSafe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? chamber?.theme === "dark" : true;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (chamber?.toggleTheme) {
      chamber.toggleTheme(e.currentTarget);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      aria-label={isDark ? "Switch to Chiaroscuro Diurne (Light Mode)" : "Switch to Chiaroscuro Nocturne (Dark Mode)"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={cn(
        "group relative rounded-full border border-black/15 dark:border-white/20 bg-white/50 dark:bg-black/40 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer select-none shadow-xs text-inherit focus-visible:ring-1 focus-visible:ring-[#d9541e]",
        showLabel
          ? "inline-flex items-center gap-2 px-3 py-1.5 h-auto"
          : "size-9 p-0 inline-flex items-center justify-center",
        className
      )}
      style={style}
      variant="outline"
    >
      <div className="flex size-5 items-center justify-center relative">
        <ChiaroscuroDial isDark={isDark} />
      </div>

      {showLabel && (
        <span className="text-xs font-cinzel font-bold pr-1 select-none whitespace-nowrap tracking-wider min-w-[70px] text-left">
          <span
            className={cn(
              "inline-block transition-opacity duration-300",
              mounted ? "opacity-100" : "opacity-0"
            )}
          >
            {mounted ? (isDark ? "Dark Mode" : "Light Mode") : "Mode"}
          </span>
        </span>
      )}
    </Button>
  );
};

/**
 * ChiaroscuroDial
 * Bespoke bicameral dial physically mirroring the 75/25 organic curved split of the Hero.
 * Rotates on theme toggle with celestial star and solar pip accents.
 */
export const ChiaroscuroDial = ({ isDark }: { isDark: boolean }) => {
  return (
    <motion.div
      className="relative w-5 h-5 flex items-center justify-center select-none"
      animate={{
        rotate: isDark ? 0 : 180,
        scale: [1, 0.92, 1],
      }}
      transition={{
        rotate: { type: "spring", stiffness: 220, damping: 20 },
        scale: { duration: 0.35, ease: "easeInOut" },
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Organic Sculpted Chiaroscuro S-Curve mirroring the Hero curve */}
          <clipPath id="chiaroscuro-dial-slice">
            <path d="M 0 0 L 21.5 0 C 31.5 22, 21.0 52, 38.5 100 L 0 100 Z" />
          </clipPath>
          <linearGradient id="dial-seam-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d9541e" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#e5a93c" stopOpacity="1" />
            <stop offset="100%" stopColor="#d9541e" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Outer Circular Boundary with subtle border */}
        <circle
          cx="50"
          cy="50"
          r="48"
          className="fill-[#111111] dark:fill-[#151618] stroke-black/20 dark:stroke-white/25"
          strokeWidth="3"
        />

        {/* Minority Slice (organic crescent on left) */}
        <g clipPath="url(#chiaroscuro-dial-slice)">
          <circle
            cx="50"
            cy="50"
            r="48"
            className="fill-[#f3eee3]"
          />
        </g>

        {/* Gilded Organic Seam Filament */}
        <path
          d="M 21.5 0 C 31.5 22, 21.0 52, 38.5 100"
          fill="none"
          stroke="url(#dial-seam-gradient)"
          strokeWidth="2.8"
        />

        {/* Celestial Star in the dominant dark hemisphere */}
        <circle
          cx="68"
          cy="48"
          r="4"
          className="fill-[#d9541e]"
        />
        <circle
          cx="68"
          cy="48"
          r="6.5"
          className="stroke-[#d9541e]/40 fill-none"
          strokeWidth="1.2"
        />
      </svg>
    </motion.div>
  );
};

export default AnimatedThemeToggle;
