import React from "react";

export default function LogoIcon({ className = "size-8 text-current" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Central Judicial Spindle */}
      <line x1="16" y1="5" x2="16" y2="26" strokeWidth="2.2" />
      {/* Balanced Crossbar */}
      <path d="M7 10 L16 8 L25 10" strokeWidth="2.2" />
      {/* Left Pan Strings & Basin */}
      <line x1="7" y1="10" x2="4" y2="17" strokeWidth="1.5" />
      <line x1="7" y1="10" x2="10" y2="17" strokeWidth="1.5" />
      <path d="M3 17 Q 7 21 11 17" strokeWidth="2" fill="none" />
      {/* Right Pan Strings & Basin */}
      <line x1="25" y1="10" x2="22" y2="17" strokeWidth="1.5" />
      <line x1="25" y1="10" x2="28" y2="17" strokeWidth="1.5" />
      <path d="M21 17 Q 25 21 29 17" strokeWidth="2" fill="none" />
      {/* Heavy Pedestal Base */}
      <line x1="10" y1="26" x2="22" y2="26" strokeWidth="2.5" />
      {/* Apex Sphere */}
      <circle cx="16" cy="4.5" r="1.5" fill="currentColor" />
    </svg>
  );
}
