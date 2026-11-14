"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, CheckCircle2, AlertCircle, Copy, Check, Terminal, Cloud, Server, RefreshCw, X } from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

export function MongoGuideModal() {
  const { isGuideOpen, setIsGuideOpen, state, refreshState, addToast } = useChamber();
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"atlas" | "local" | "docker">("atlas");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ isConnected: boolean; message: string } | null>(null);

  if (!isGuideOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(id);
    addToast("Copied to clipboard!", "success");
    setTimeout(() => setCopiedTab(null), 2500);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      const data = await res.json();
      if (data.database === "connected") {
        setTestResult({ isConnected: true, message: `Connected successfully to database cluster! (${data.uri})` });
        addToast("Database cluster verified!", "success");
        await refreshState();
      } else {
        setTestResult({
          isConnected: false,
          message: data.error || "Cannot reach database cluster. Please verify credentials in .env.local",
        });
      }
    } catch (err: any) {
      setTestResult({ isConnected: false, message: err.message || "Network test failed" });
    } finally {
      setTesting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl overflow-hidden bg-white dark:bg-[#181818] text-[#111111] dark:text-[#f3eee3] rounded-3xl shadow-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-[#f3eee3]/10 dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] flex items-center justify-between border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#111111] text-[#f3eee3] dark:text-[#f3eee3] flex items-center justify-center shadow-xs">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-cinzel font-bold tracking-tight flex items-center gap-2">
                  Chamber Database Engine Status
                </h2>
                <p className="text-xs font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">
                  eCourts Judicial Synchronization &amp; Storage Engine
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsGuideOpen(false)}
              className="p-1 rounded-lg text-[#111111]/60 hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Status Banner */}
          <div className="px-6 py-3 bg-white dark:bg-[#202020] border-b border-[#111111]/15 dark:border-[#f3eee3]/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-cinzel font-semibold text-[#111111]/60 dark:text-[#f3eee3]/60">Status:</span>
              {state?.dbConnected ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Cloud Database Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-[#f3eee3]/20 dark:bg-[#f3eee3]/15 text-[#111111] dark:text-[#f3eee3] border border-[#f3eee3]/50 dark:border-[#f3eee3]/40">
                  <span className="w-2 h-2 rounded-full bg-[#111111] dark:bg-[#f3eee3] animate-pulse" />
                  Local Memory Mode
                </span>
              )}
            </div>

            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] hover:bg-[#f3efe6] dark:hover:bg-[#181b22] font-cinzel font-semibold text-xs transition-colors shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? "animate-spin text-[#111111] dark:text-[#f3eee3]" : ""}`} />
              {testing ? "Testing..." : "Test Connection"}
            </button>
          </div>

          {/* Test Result Alert */}
          {testResult && (
            <div
              className={`mx-6 mt-4 p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                testResult.isConnected
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-200"
                  : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-200"
              }`}
            >
              {testResult.isConnected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="font-bold">
                  {testResult.isConnected ? "Connection Established!" : "Connection Failed"}
                </p>
                <p className="mt-0.5 opacity-90 font-serif">{testResult.message}</p>
              </div>
            </div>
          )}

          {/* Guide Tabs */}
          <div className="flex border-b border-[#111111]/15 dark:border-[#f3eee3]/20 px-6 pt-3.5 gap-4">
            <button
              onClick={() => setActiveTab("atlas")}
              className={`pb-2.5 text-xs font-cinzel font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === "atlas"
                  ? "border-[#111111] dark:border-[#f3eee3] text-[#111111] dark:text-[#f3eee3]"
                  : "border-transparent text-[#111111]/60 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
              }`}
            >
              <Cloud className="w-4 h-4" /> Option 1: Managed Cloud
            </button>
            <button
              onClick={() => setActiveTab("local")}
              className={`pb-2.5 text-xs font-cinzel font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === "local"
                  ? "border-[#111111] dark:border-[#f3eee3] text-[#111111] dark:text-[#f3eee3]"
                  : "border-transparent text-[#111111]/60 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
              }`}
            >
              <Terminal className="w-4 h-4" /> Option 2: Local Mac
            </button>
            <button
              onClick={() => setActiveTab("docker")}
              className={`pb-2.5 text-xs font-cinzel font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === "docker"
                  ? "border-[#111111] dark:border-[#f3eee3] text-[#111111] dark:text-[#f3eee3]"
                  : "border-transparent text-[#111111]/60 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
              }`}
            >
              <Server className="w-4 h-4" /> Option 3: Docker
            </button>
          </div>

          {/* Guide Content */}
          <div className="p-6 overflow-y-auto space-y-4 text-xs font-serif">
            {activeTab === "atlas" && (
              <div className="space-y-4">
                <div className="p-3.5 bg-[#f3eee3]/15 dark:bg-[#f3eee3]/10 border border-[#f3eee3]/40 dark:border-[#f3eee3]/30 rounded-2xl text-xs text-[#111111] dark:text-[#f3eee3]">
                  <p className="font-bold font-cinzel">Recommended for Indian Chambers &amp; Cloud Sync</p>
                  <p className="mt-0.5">Cloud Database provides high-availability multi-lawyer synchronization and automated backups.</p>
                </div>

                <ol className="space-y-2.5 text-xs list-decimal list-inside text-[#555866] dark:text-[#f3eee3]/60">
                  <li className="leading-relaxed">
                    <span className="font-semibold text-[#111111] dark:text-white">Cloud Setup:</span> Deploy a managed cloud database instance.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-semibold text-[#111111] dark:text-white">Security:</span> Configure network access and chamber credentials.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-semibold text-[#111111] dark:text-white">Connection String:</span> Paste into <code className="bg-white dark:bg-[#202020] border border-[#111111]/15 dark:border-[#f3eee3]/20 px-1 py-0.5 rounded text-[#111111] dark:text-white font-mono">.env.local</code>.
                  </li>
                </ol>

                <div className="relative group bg-[#111111] text-[#f5f3ef] p-4 rounded-2xl text-xs font-mono border border-[#222630]">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        "MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/updated_law_diary?retryWrites=true&w=majority",
                        "atlas_uri"
                      )
                    }
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#161820] hover:bg-[#222630] text-[#f3eee3] dark:text-[#f3eee3] transition-colors"
                  >
                    {copiedTab === "atlas_uri" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre className="overflow-x-auto whitespace-pre-wrap pr-10">
                    MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.abcde.mongodb.net/updated_law_diary?retryWrites=true&amp;w=majority
                  </pre>
                </div>
              </div>
            )}

            {activeTab === "local" && (
              <div className="space-y-3">
                <p className="text-xs text-[#555866] dark:text-[#f3eee3]/60">
                  Run database service natively on macOS using Homebrew:
                </p>
                <div className="relative bg-[#111111] text-[#f5f3ef] p-3.5 rounded-2xl text-xs font-mono border border-[#222630]">
                  <button
                    onClick={() => copyToClipboard("brew tap mongodb/brew && brew install mongodb-community@7.0", "brew_install")}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-[#161820] text-[#f3eee3] dark:text-[#f3eee3]"
                  >
                    {copiedTab === "brew_install" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre className="pr-8">brew tap mongodb/brew &amp;&amp; brew install mongodb-community@7.0</pre>
                </div>
              </div>
            )}

            {activeTab === "docker" && (
              <div className="space-y-3">
                <p className="text-xs text-[#555866] dark:text-[#f3eee3]/60">
                  Run containerized database via Docker:
                </p>
                <div className="relative bg-[#111111] text-[#f5f3ef] p-3.5 rounded-2xl text-xs font-mono border border-[#222630]">
                  <button
                    onClick={() =>
                      copyToClipboard("docker run -d -p 27017:27017 --name updated-law-diary-mongo mongo:latest", "docker_cmd")
                    }
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-[#161820] text-[#f3eee3] dark:text-[#f3eee3]"
                  >
                    {copiedTab === "docker_cmd" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre className="pr-8">docker run -d -p 27017:27017 --name updated-law-diary-mongo mongo:latest</pre>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 bg-[#f3eee3]/10 dark:bg-[#111111] border-t border-[#111111]/15 dark:border-[#f3eee3]/20 flex items-center justify-between">
            <span className="text-xs font-cinzel text-[#111111]/60 dark:text-[#f3eee3]/60">
              Indian Court Matters &amp; Chamber Roster
            </span>
            <button
              onClick={() => setIsGuideOpen(false)}
              className="px-5 py-2.5 text-xs font-cinzel font-bold tracking-wider rounded-xl bg-[#d9541e] text-white hover:bg-[#bf4513] dark:bg-[#d9541e] dark:text-white dark:hover:bg-[#ea6026] shadow-sm transition-all shadow-md"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
