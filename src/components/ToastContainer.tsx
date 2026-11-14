"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function ToastContainer() {
  const { toasts } = useChamber();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-2xl text-xs font-medium border backdrop-blur-md ${
              t.type === "success"
                ? "bg-white/95 dark:bg-[#181818]/95 text-[#111111] dark:text-[#f3eee3] border-[#111111]/20 dark:border-[#f3eee3]/40 shadow-[0_10px_40px_rgba(17,17,17,0.1)] dark:shadow-[0_10px_40px_rgba(243,238,227,0.15)]"
                : t.type === "error"
                ? "bg-white/95 dark:bg-[#181818]/95 text-[#111111] dark:text-[#f3eee3] border-rose-500/40 shadow-[0_10px_40px_rgba(17,17,17,0.1)] dark:shadow-[0_10px_40px_rgba(244,63,94,0.2)]"
                : "bg-white/95 dark:bg-[#181818]/95 text-[#111111] dark:text-[#f3eee3] border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-[0_10px_40px_rgba(17,17,17,0.1)] dark:shadow-[0_10px_40px_rgba(243,238,227,0.15)]"
            }`}
          >
            {t.type === "success" && (
              <CheckCircle2 className="w-4 h-4 text-[#111111] dark:text-[#f3eee3] flex-shrink-0" />
            )}
            {t.type === "error" && <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />}
            {t.type === "info" && (
              <Info className="w-4 h-4 text-[#111111] dark:text-[#f3eee3] flex-shrink-0" />
            )}
            <span className="leading-snug font-sans">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
