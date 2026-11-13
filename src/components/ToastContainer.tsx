"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function ToastContainer() {
  const { toasts } = useChamber();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-xs font-medium border backdrop-blur-md ${
              t.type === "success"
                ? "bg-slate-900/95 text-white border-emerald-500/40"
                : t.type === "error"
                ? "bg-slate-900/95 text-white border-rose-500/40"
                : "bg-slate-900/95 text-white border-amber-500/40"
            }`}
          >
            {t.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
            {t.type === "error" && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
            {t.type === "info" && <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />}
            <span className="leading-snug">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

