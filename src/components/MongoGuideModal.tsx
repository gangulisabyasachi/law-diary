"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, CheckCircle2, AlertCircle, Copy, Check, Terminal, Cloud, Server, ExternalLink, RefreshCw, X } from "lucide-react";
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
        setTestResult({ isConnected: true, message: `Connected successfully to MongoDB! (${data.uri})` });
        addToast("MongoDB connection verified!", "success");
        await refreshState();
      } else {
        setTestResult({
          isConnected: false,
          message: data.error || "Cannot reach MongoDB. Please check if your server is running and URI is correct.",
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090d14]/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl overflow-hidden bg-white dark:bg-[#151921] text-[#15181c] dark:text-[#f3f5f8] rounded-xl shadow-2xl border border-[#e7e2d7] dark:border-[#262e3b] flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between border-b border-blue-800/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-800/60 border border-blue-400/40 text-blue-300 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold font-display tracking-tight text-white flex items-center gap-2">
                  Chamber Database Engine Status
                </h2>
                <p className="text-xs text-blue-200">
                  eCourts Synchronization &amp; Storage Engine
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsGuideOpen(false)}
              className="w-8 h-8 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Status Banner */}
          <div className="px-6 py-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Status:</span>
              {state?.dbConnected ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Cloud Storage Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-800/40">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Local In-Memory Mode
                </span>
              )}
            </div>

            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? "animate-spin text-blue-600" : ""}`} />
              {testing ? "Testing..." : "Test Connection"}
            </button>
          </div>

          {/* Test Result Alert */}
          {testResult && (
            <div
              className={`mx-6 mt-4 p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
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
                <p className="font-semibold">
                  {testResult.isConnected ? "Connection Established!" : "Connection Failed"}
                </p>
                <p className="mt-0.5 opacity-90">{testResult.message}</p>
              </div>
            </div>
          )}

          {/* Guide Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-3 gap-4">
            <button
              onClick={() => setActiveTab("atlas")}
              className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === "atlas"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Cloud className="w-4 h-4" /> Option 1: Managed Cloud
            </button>
            <button
              onClick={() => setActiveTab("local")}
              className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === "local"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Terminal className="w-4 h-4" /> Option 2: Local Mac
            </button>
            <button
              onClick={() => setActiveTab("docker")}
              className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === "docker"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Server className="w-4 h-4" /> Option 3: Docker
            </button>
          </div>

          {/* Guide Content */}
          <div className="p-6 overflow-y-auto space-y-4 text-xs">
            {activeTab === "atlas" && (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 rounded-xl text-xs text-blue-900 dark:text-blue-200">
                  <p className="font-semibold">Recommended for Indian Chambers &amp; Cloud Sync</p>
                  <p className="mt-0.5">Cloud Database provides high-availability multi-lawyer synchronization and automated backups.</p>
                </div>

                <ol className="space-y-2.5 text-xs list-decimal list-inside text-slate-600 dark:text-slate-400">
                  <li className="leading-relaxed">
                    <span className="font-semibold text-slate-900 dark:text-white">Cloud Setup:</span> Deploy a managed cloud database instance.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-semibold text-slate-900 dark:text-white">Security:</span> Configure network access and chamber credentials.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-semibold text-slate-900 dark:text-white">Connection String:</span> Paste into <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-900 dark:text-white font-mono">.env.local</code>.
                  </li>
                </ol>

                <div className="relative group bg-slate-900 text-white p-3.5 rounded-xl text-xs font-mono border border-slate-800">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        "MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/counselbook?retryWrites=true&w=majority",
                        "atlas_uri"
                      )
                    }
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition-colors"
                  >
                    {copiedTab === "atlas_uri" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre className="overflow-x-auto whitespace-pre-wrap">
                    MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.abcde.mongodb.net/counselbook?retryWrites=true&amp;w=majority
                  </pre>
                </div>
              </div>
            )}

            {activeTab === "local" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Run database service natively on macOS using Homebrew:
                </p>
                <div className="relative bg-slate-900 text-white p-3 rounded-xl text-xs font-mono border border-slate-800">
                  <button
                    onClick={() => copyToClipboard("brew tap mongodb/brew && brew install mongodb-community@7.0", "brew_install")}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 text-blue-400"
                  >
                    {copiedTab === "brew_install" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre>brew tap mongodb/brew && brew install mongodb-community@7.0</pre>
                </div>
              </div>
            )}

            {activeTab === "docker" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Run containerized database via Docker:
                </p>
                <div className="relative bg-slate-900 text-white p-3.5 rounded-xl text-xs font-mono border border-slate-800">
                  <button
                    onClick={() =>
                      copyToClipboard("docker run -d -p 27017:27017 --name counselbook-mongo mongo:latest", "docker_cmd")
                    }
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 text-blue-400"
                  >
                    {copiedTab === "docker_cmd" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre>docker run -d -p 27017:27017 --name counselbook-mongo mongo:latest</pre>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Indian Court Matters &amp; Chamber Roster
            </span>
            <button
              onClick={() => setIsGuideOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
