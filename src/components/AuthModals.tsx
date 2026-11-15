"use client";

import React, { useEffect } from "react";
import { useChamber } from "@/context/ChamberContext";
import AuthSwitch from "@/components/ui/auth-switch";

export function AuthModals() {
  const { authModal, setAuthModal } = useChamber();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && authModal) {
        setAuthModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [authModal, setAuthModal]);

  if (!authModal) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setAuthModal(null);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#111111]/75 backdrop-blur-md transition-all duration-300 animate-in fade-in"
    >
      <AuthSwitch
        initialSignUp={authModal === "signup"}
        onClose={() => setAuthModal(null)}
        isModal={true}
      />
    </div>
  );
}
