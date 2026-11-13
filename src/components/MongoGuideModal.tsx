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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl overflow-hidden bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display tracking-tight text-white flex items-center gap-2">
                  MongoDB Connection Guide
                </h2>
                <p className="text-xs text-slate-300">
                  Step-by-step setup for CounselBook Legal Diary
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsGuideOpen(false)}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Status Banner */}
          <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Current Status:</span>
              {state?.dbConnected ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  MongoDB Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800 border border-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Local In-Memory Mode (Connect Mongo below)
                </span>
              )}
            </div>

            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? "animate-spin text-amber-600" : ""}`} />
              {testing ? "Testing..." : "Test Connection"}
            </button>
          </div>

          {/* Test Result Alert */}
          {testResult && (
            <div
              className={`mx-6 mt-4 p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                testResult.isConnected
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
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
          <div className="flex border-b border-slate-200 px-6 pt-3 gap-4">
            <button
              onClick={() => setActiveTab("atlas")}
              className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === "atlas"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Cloud className="w-4 h-4" /> Option 1: MongoDB Atlas (Cloud - Free)
            </button>
            <button
              onClick={() => setActiveTab("local")}
              className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === "local"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Terminal className="w-4 h-4" /> Option 2: Local Mac (Homebrew)
            </button>
            <button
              onClick={() => setActiveTab("docker")}
              className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === "docker"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Server className="w-4 h-4" /> Option 3: Docker
            </button>
          </div>

          {/* Guide Content */}
          <div className="p-6 overflow-y-auto space-y-4 text-slate-700 text-sm">
            {activeTab === "atlas" && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <p className="font-semibold">Recommended for Production & Cloud Access</p>
                  <p className="mt-0.5">MongoDB Atlas gives you a permanent free 512MB cloud database accessible anywhere.</p>
                </div>

                <ol className="space-y-3 text-xs list-decimal list-inside text-slate-700">
                  <li className="leading-relaxed">
                    <span className="font-semibold text-slate-900">Sign Up / Log In:</span> Go to{" "}
                    <a
                      href="https://www.mongodb.com/cloud/atlas"
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-700 underline font-medium inline-flex items-center gap-0.5"
                    >
                      mongodb.com/cloud/atlas <ExternalLink className="w-3 h-3" />
                    </a>{" "}
                    and create a free account.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-semibold text-slate-900">Deploy Free Cluster:</span> Select the free tier (<b>M0 Free</b>), choose your preferred cloud region, and click <b>Create Deployment</b>.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-semibold text-slate-900">Create Database User:</span> Set a username (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-800 font-mono">counsel_admin</code>) and a strong password. Save this password.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-semibold text-slate-900">Network Access:</span> In "Network Access", add IP Address: <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-800 font-mono">0.0.0.0/0</code> (Allow Access from Anywhere).
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-semibold text-slate-900">Get Connection String:</span> Click <b>Connect</b> → <b>Drivers</b> (Node.js). Copy your connection string.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-semibold text-slate-900">Update .env.local:</span> Paste your connection string into <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-900 font-mono">.env.local</code>:
                  </li>
                </ol>

                <div className="relative group bg-slate-900 text-slate-100 p-3.5 rounded-xl text-xs font-mono">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        "MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/counselbook?retryWrites=true&w=majority",
                        "atlas_uri"
                      )
                    }
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
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
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  Run MongoDB natively on your macOS machine using Homebrew:
                </p>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-800">1. Install MongoDB Community via Homebrew:</p>
                    <div className="relative bg-slate-900 text-slate-100 p-3 rounded-xl text-xs font-mono">
                      <button
                        onClick={() => copyToClipboard("brew tap mongodb/brew && brew install mongodb-community@7.0", "brew_install")}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        {copiedTab === "brew_install" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <pre>brew tap mongodb/brew && brew install mongodb-community@7.0</pre>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-800">2. Start MongoDB as a background macOS service:</p>
                    <div className="relative bg-slate-900 text-slate-100 p-3 rounded-xl text-xs font-mono">
                      <button
                        onClick={() => copyToClipboard("brew services start mongodb-community@7.0", "brew_start")}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        {copiedTab === "brew_start" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <pre>brew services start mongodb-community@7.0</pre>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-800">3. .env.local is already configured for this:</p>
                    <div className="relative bg-slate-900 text-slate-100 p-3 rounded-xl text-xs font-mono">
                      <pre>MONGODB_URI=mongodb://127.0.0.1:27017/counselbook</pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "docker" && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  If you have Docker installed on your Mac, start a container with one command:
                </p>

                <div className="space-y-1">
                  <div className="relative bg-slate-900 text-slate-100 p-3.5 rounded-xl text-xs font-mono">
                    <button
                      onClick={() =>
                        copyToClipboard("docker run -d -p 27017:27017 --name counselbook-mongo mongo:latest", "docker_cmd")
                      }
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      {copiedTab === "docker_cmd" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <pre>docker run -d -p 27017:27017 --name counselbook-mongo mongo:latest</pre>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Once the container starts, click <b>Test Connection</b> at the top of this dialog!
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Auto-seeds 6 chamber accounts &amp; 5 court cases upon first connection.
            </span>
            <button
              onClick={() => setIsGuideOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              Close Guide
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

