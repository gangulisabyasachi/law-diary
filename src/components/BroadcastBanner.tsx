"use client";

import React, { useState } from "react";
import { Radio, X } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function BroadcastBanner() {
  const { state } = useChamber();
  const [dismissed, setDismissed] = useState(false);

  const broadcast = state?.broadcast;
  const message =
    broadcast?.message?.trim() ||
    "Scheduled platform maintenance window: System remaining online with full database replication.";
  const isActive = broadcast ? broadcast.active : true;

  if (!isActive || dismissed) {
    return null;
  }

  return (
    <aside
      role="alert"
      aria-label="Platform Advisory Notice"
      className="relative z-50 w-full bg-gradient-to-r from-[#141210] via-[#1c1714] to-[#141210] text-[#f3eee3] border-b border-[#d9541e]/35 shadow-lg shadow-black/30 backdrop-blur-2xl transition-all duration-300 overflow-hidden"
    >
      {/* Top and Bottom Radiant Luxury Hairlines */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d9541e]/70 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/35 to-transparent" />

      {/* Atmospheric Radial Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_140%_at_50%_-30%,rgba(217,84,30,0.22),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs relative z-10">
        {/* Advisory Content */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Animated Terracotta Beacon */}
          <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-[#d9541e]/20 border border-[#d9541e]/45 shrink-0 shadow-inner">
            <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-[#d9541e] opacity-75" />
            <Radio className="w-3 h-3 text-[#ea6026] relative z-10" />
          </div>

          {/* Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-cinzel font-bold tracking-[0.16em] uppercase bg-gradient-to-r from-[#d9541e]/30 to-amber-600/25 text-[#ea6026] dark:text-[#f08552] border border-[#d9541e]/40 shrink-0 shadow-2xs">
            Platform Advisory
          </span>

          {/* Message Text */}
          <p className="font-serif text-[#f3eee3]/95 text-[12px] sm:text-[12.5px] font-medium tracking-wide truncate leading-tight">
            {message}
          </p>
        </div>

        {/* Right Dismiss Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg text-[#f3eee3]/50 hover:text-[#f3eee3] hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            title="Dismiss Platform Advisory for this session"
            aria-label="Dismiss broadcast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
