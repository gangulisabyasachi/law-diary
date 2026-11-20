"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Flame,
  Search,
  Filter,
  Trash2,
  RotateCcw,
  Download,
  Copy,
  Check,
  RefreshCw,
  ShieldAlert,
  Server,
  Activity,
  User as UserIcon,
  Globe,
  Clock,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";
import { ErrorLog } from "@/types";

export default function AdminLogsPage() {
  const {
    state,
    currentUser,
    refreshErrorLogs,
    resolveErrorLog,
    deleteErrorLog,
    clearErrorLogs,
    logSystemError,
    addToast,
  } = useChamber();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "unresolved" | "resolved">("all");

  // Inspect Modal State
  const [inspectingLog, setInspectingLog] = useState<ErrorLog | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Clear All Modal
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const errorLogs: ErrorLog[] = state?.errorLogs || [];

  // Automatically fetch latest logs on mount
  useEffect(() => {
    refreshErrorLogs();
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshErrorLogs();
    setTimeout(() => {
      setIsRefreshing(false);
      addToast("Error log registry refreshed.", "info");
    }, 400);
  };

  const handleSimulateTestError = async () => {
    setIsSimulating(true);
    try {
      await logSystemError({
        level: "warn",
        category: "auth",
        message: "Diagnostic Verification Probe: Synthetic login challenge test",
        details:
          "Initiated manually from the Platform Administration Console to verify end-to-end telemetry ingestion, MongoDB persistence, and audit logging pipelines.",
        source: "Diagnostic Console",
        path: "/admin/logs",
        userId: currentUser?.id || "u-admin",
        userRole: currentUser?.role || "admin",
      });
    } catch {
      addToast("Failed to transmit diagnostic incident.", "error");
    } finally {
      setIsSimulating(false);
    }
  };

  // Copy Stack Trace / Details
  const handleCopyTrace = (log: ErrorLog) => {
    const text = `LexDaily Incident Log: ${log.id}\nSeverity: ${log.level.toUpperCase()} | Category: ${log.category.toUpperCase()}\nTimestamp: ${log.timestamp}\nMessage: ${log.message}\nPath: ${log.path || "N/A"}\nSource: ${log.source || "N/A"}\nUser: ${log.userId || "Anonymous"} (${log.userRole || "N/A"})\nIP: ${log.ip || "127.0.0.1"}\nResolved: ${log.resolved ? `YES (by ${log.resolvedBy || "Admin"} at ${log.resolvedAt || "N/A"})` : "NO (Active)"}\n\nTechnical Stack / Details:\n${log.details || "No technical stack trace available."}`;
    navigator.clipboard.writeText(text);
    setCopiedId(log.id);
    addToast("Diagnostic incident trace copied to clipboard.", "info");
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Export JSON Report
  const handleExportJSON = () => {
    try {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(errorLogs, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `lexdaily-platform-audit-logs-${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast(`Exported ${errorLogs.length} audit records to JSON.`, "success");
    } catch {
      addToast("Failed to export logs.", "error");
    }
  };

  // Metrics computation
  const metrics = useMemo(() => {
    const total = errorLogs.length;
    const fatal = errorLogs.filter((l) => l.level === "fatal").length;
    const errors = errorLogs.filter((l) => l.level === "error").length;
    const warnings = errorLogs.filter((l) => l.level === "warn").length;
    const resolved = errorLogs.filter((l) => l.resolved).length;
    const unresolved = total - resolved;
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 100;

    return { total, fatal, errors, warnings, resolved, unresolved, rate };
  }, [errorLogs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return errorLogs.filter((log) => {
      // Level filter
      if (levelFilter !== "all" && log.level !== levelFilter) return false;
      // Category filter
      if (categoryFilter !== "all" && log.category !== categoryFilter) return false;
      // Status filter
      if (statusFilter === "resolved" && !log.resolved) return false;
      if (statusFilter === "unresolved" && log.resolved) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchMsg = (log.message || "").toLowerCase().includes(q);
        const matchDet = (log.details || "").toLowerCase().includes(q);
        const matchPath = (log.path || "").toLowerCase().includes(q);
        const matchUser =
          (log.userId || "").toLowerCase().includes(q) ||
          (log.userRole || "").toLowerCase().includes(q);
        const matchIp = (log.ip || "").toLowerCase().includes(q);
        const matchId = (log.id || "").toLowerCase().includes(q);
        return matchMsg || matchDet || matchPath || matchUser || matchIp || matchId;
      }
      return true;
    });
  }, [errorLogs, levelFilter, categoryFilter, statusFilter, searchQuery]);

  // Relative time helper
  const getRelativeTime = (ts: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
      if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}h ago`;
      const diffDays = Math.floor(diffHr / 24);
      return `${diffDays}d ago`;
    } catch {
      return ts;
    }
  };

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return ts;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "fatal":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30">
            <Flame className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            Fatal
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/25">
            <XCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
            Error
          </span>
        );
      case "warn":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Warning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/25">
            <Info className="w-3 h-3 text-sky-600 dark:text-sky-400" />
            Info
          </span>
        );
    }
  };

  const getCategoryBadge = (cat: string) => {
    const labels: Record<string, { label: string; cls: string }> = {
      auth: {
        label: "Security & Auth",
        cls: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
      },
      database: {
        label: "Database Cluster",
        cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
      },
      network: {
        label: "Network & API",
        cls: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
      },
      chamber_scoping: {
        label: "Chamber Scoping",
        cls: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
      },
      validation: {
        label: "Statutory Filing",
        cls: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
      },
      system: {
        label: "System Core",
        cls: "bg-stone-500/10 text-stone-700 dark:text-stone-300 border-stone-500/20",
      },
    };
    const c = labels[cat] || {
      label: cat.toUpperCase(),
      cls: "bg-stone-500/10 text-stone-700 dark:text-stone-300 border-stone-500/20",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide border ${c.cls}`}
      >
        {c.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#111111]/15 dark:border-[#f3eee3]/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-[#d9541e]/10 text-[#d9541e] dark:bg-[#d9541e]/20 dark:text-[#ea6026] border border-[#d9541e]/30">
              <ShieldCheck className="w-3 h-3" /> Root Platform Administration
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <Activity className="w-2.5 h-2.5 animate-pulse text-emerald-500" /> Live Audit Feed
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-[#111111] dark:text-[#f3eee3] tracking-wide">
            Platform Error &amp; Audit Logs
          </h2>
          <p className="text-xs text-[#111111]/65 dark:text-[#f3eee3]/60 font-serif italic mt-0.5">
            Monitor real-time system exceptions, authentication warnings, database connection issues &amp; client errors.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleSimulateTestError}
            disabled={isSimulating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-[#d9541e]/30 bg-[#d9541e]/10 hover:bg-[#d9541e]/20 text-[#d9541e] dark:text-[#ea6026] text-xs font-cinzel font-semibold transition-colors cursor-pointer"
            title="Send a synthetic test event to verify error logging pipeline"
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
            <span>{isSimulating ? "Transmitting..." : "Simulate Test Incident"}</span>
          </button>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] text-[#111111]/70 dark:text-[#f3eee3]/70 hover:text-[#111111] dark:hover:text-white text-xs font-cinzel font-semibold transition-colors cursor-pointer"
            title="Refresh logs from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#d9541e]" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportJSON}
            disabled={errorLogs.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] text-[#111111]/70 dark:text-[#f3eee3]/70 hover:text-[#111111] dark:hover:text-white text-xs font-cinzel font-semibold transition-colors disabled:opacity-40 cursor-pointer"
            title="Export complete diagnostic logs to JSON file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setIsClearModalOpen(true)}
            disabled={errorLogs.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-rose-500/25 bg-rose-500/5 hover:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-cinzel font-semibold transition-colors disabled:opacity-40 cursor-pointer"
            title="Clear all recorded error logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-cinzel font-bold text-[#111111]/60 dark:text-[#f3eee3]/60 uppercase tracking-wider">
              Total Incidents
            </span>
            <Server className="w-4 h-4 text-[#111111]/50 dark:text-[#f3eee3]/50" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#111111] dark:text-[#f3eee3]">
            {metrics.total}
          </p>
          <span className="text-[10px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">
            Platform runtime events
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-cinzel font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Critical &amp; Errors
            </span>
            <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-rose-700 dark:text-rose-400">
            {metrics.fatal + metrics.errors}
          </p>
          <span className="text-[10px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">
            {metrics.fatal} critical · {metrics.errors} errors
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-cinzel font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Security &amp; Warnings
            </span>
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-amber-700 dark:text-amber-400">
            {metrics.warnings}
          </p>
          <span className="text-[10px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">
            Authentication &amp; validation
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-cinzel font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Resolution Rate
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-400">
            {metrics.rate}%
          </p>
          <span className="text-[10px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">
            {metrics.resolved} resolved · {metrics.unresolved} active
          </span>
        </div>
      </div>

      {/* Control & Search Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#111111]/40 dark:text-[#f3eee3]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by error message, path, user ID, IP address or incident ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#fcfaf7] dark:bg-[#121212] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-xs pl-10 pr-12 py-2.5 rounded-2xl focus:outline-none focus:border-[#d9541e] transition-all placeholder:text-[#111111]/40 dark:placeholder:text-[#f3eee3]/40 font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#111111]/40 hover:text-[#111111] dark:text-[#f3eee3]/40 dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-[#fcfaf7] dark:bg-[#121212] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-xs px-3 py-2.5 rounded-2xl focus:outline-none focus:border-[#d9541e] font-sans"
          >
            <option value="all">All Severities</option>
            <option value="fatal">Fatal Incidents</option>
            <option value="error">Errors</option>
            <option value="warn">Warnings</option>
            <option value="info">Informational</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#fcfaf7] dark:bg-[#121212] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-xs px-3 py-2.5 rounded-2xl focus:outline-none focus:border-[#d9541e] font-sans"
          >
            <option value="all">All Categories</option>
            <option value="auth">Security &amp; Auth</option>
            <option value="database">Database Cluster</option>
            <option value="network">Network &amp; API</option>
            <option value="chamber_scoping">Chamber Scoping</option>
            <option value="validation">Statutory Filing</option>
            <option value="system">System Core</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#fcfaf7] dark:bg-[#121212] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111] dark:text-[#f3eee3] text-xs px-3 py-2.5 rounded-2xl focus:outline-none focus:border-[#d9541e] font-sans"
          >
            <option value="all">All Statuses</option>
            <option value="unresolved">Active / Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Main Log Data Table */}
      <div className="rounded-3xl bg-white dark:bg-[#181818] border border-[#111111]/15 dark:border-[#f3eee3]/20 overflow-hidden shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600 dark:text-emerald-400 mb-3" />
            <h3 className="text-sm font-cinzel font-bold text-[#111111] dark:text-[#f3eee3]">
              No Matching Incidents
            </h3>
            <p className="text-xs font-serif text-[#111111]/60 dark:text-[#f3eee3]/60 mt-1 max-w-sm mx-auto">
              No runtime errors or security anomalies match the active filter criteria. Platform diagnostic services report nominal stability.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleSimulateTestError}
                disabled={isSimulating}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#d9541e] hover:bg-[#bf4513] text-white text-xs font-cinzel font-bold shadow-sm transition-colors cursor-pointer"
              >
                <AlertTriangle className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
                <span>{isSimulating ? "Transmitting Event..." : "Simulate Test Incident"}</span>
              </button>
              {(searchQuery || levelFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setLevelFilter("all");
                    setCategoryFilter("all");
                    setStatusFilter("all");
                  }}
                  className="px-4 py-2 rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] text-[#111111] dark:text-[#f3eee3] text-xs font-cinzel font-semibold hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#111111]/10 dark:border-[#f3eee3]/10 bg-[#111111]/5 dark:bg-[#f3eee3]/5">
                  <th className="py-3 px-4 text-[10px] font-cinzel font-bold text-[#111111]/70 dark:text-[#f3eee3]/70 uppercase tracking-wider">
                    Severity &amp; Status
                  </th>
                  <th className="py-3 px-4 text-[10px] font-cinzel font-bold text-[#111111]/70 dark:text-[#f3eee3]/70 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="py-3 px-4 text-[10px] font-cinzel font-bold text-[#111111]/70 dark:text-[#f3eee3]/70 uppercase tracking-wider">
                    Incident &amp; Category
                  </th>
                  <th className="py-3 px-4 text-[10px] font-cinzel font-bold text-[#111111]/70 dark:text-[#f3eee3]/70 uppercase tracking-wider">
                    Source / Actor
                  </th>
                  <th className="py-3 px-4 text-[10px] font-cinzel font-bold text-[#111111]/70 dark:text-[#f3eee3]/70 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111111]/10 dark:divide-[#f3eee3]/10 text-xs">
                {filteredLogs.map((log) => {
                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors ${
                        log.resolved ? "opacity-75" : ""
                      }`}
                    >
                      {/* Severity & Resolved */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getLevelBadge(log.level)}
                          {log.resolved ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              <Check className="w-2.5 h-2.5" /> Resolved
                            </span>
                          ) : (
                            <span className="inline-block w-2 h-2 rounded-full bg-rose-500" title="Active Unresolved" />
                          )}
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-mono text-[11px] text-[#111111] dark:text-[#f3eee3]">
                            {formatTimestamp(log.timestamp)}
                          </span>
                          <span className="text-[10px] text-[#111111]/50 dark:text-[#f3eee3]/50 font-serif italic">
                            {getRelativeTime(log.timestamp)}
                          </span>
                        </div>
                      </td>

                      {/* Incident & Message */}
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {getCategoryBadge(log.category)}
                            {log.path && (
                              <span className="font-mono text-[10px] text-[#111111]/60 dark:text-[#f3eee3]/60 bg-[#111111]/5 dark:bg-[#f3eee3]/5 px-1.5 py-0.5 rounded">
                                {log.path}
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-[#111111] dark:text-[#f3eee3] break-words line-clamp-2 leading-relaxed">
                            {log.message}
                          </p>
                        </div>
                      </td>

                      {/* Source & Actor */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#111111]/80 dark:text-[#f3eee3]/80">
                            <UserIcon className="w-3 h-3 text-[#111111]/40 dark:text-[#f3eee3]/40" />
                            <span className="font-mono font-medium">
                              {log.userId || "anonymous"}
                            </span>
                            {log.userRole && (
                              <span className="text-[#111111]/50 dark:text-[#f3eee3]/50 text-[10px]">
                                ({log.userRole})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#111111]/50 dark:text-[#f3eee3]/50">
                            <Globe className="w-2.5 h-2.5" />
                            <span>{log.ip || "127.0.0.1"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect Modal Trigger */}
                          <button
                            onClick={() => setInspectingLog(log)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] text-[#111111]/80 dark:text-[#f3eee3]/80 hover:text-[#d9541e] hover:border-[#d9541e]/40 text-xs font-cinzel font-semibold transition-all cursor-pointer"
                            title="Inspect full error details and stack trace"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Inspect</span>
                          </button>

                          {/* Toggle Resolved */}
                          <button
                            onClick={() => resolveErrorLog(log.id, !log.resolved)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-cinzel font-semibold border transition-all cursor-pointer ${
                              log.resolved
                                ? "border-[#111111]/15 dark:border-[#f3eee3]/20 text-[#111111]/60 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white"
                                : "border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                            }`}
                            title={log.resolved ? "Reopen incident as active" : "Mark incident as resolved"}
                          >
                            {log.resolved ? (
                              <RotateCcw className="w-3.5 h-3.5" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Delete Log */}
                          <button
                            onClick={() => deleteErrorLog(log.id)}
                            className="p-1.5 rounded-xl border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete this incident log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Incident Modal */}
      {inspectingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#181818] border border-[#111111]/20 dark:border-[#f3eee3]/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-[10px] text-[#111111]/60 dark:text-[#f3eee3]/60 uppercase tracking-wider">
                    INCIDENT ID: {inspectingLog.id}
                  </span>
                  {getLevelBadge(inspectingLog.level)}
                  {getCategoryBadge(inspectingLog.category)}
                </div>
                <h3 className="text-lg font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
                  Diagnostic Incident Trace
                </h3>
              </div>
              <button
                onClick={() => setInspectingLog(null)}
                className="p-1.5 rounded-xl border border-[#111111]/10 dark:border-[#f3eee3]/15 text-[#111111]/60 dark:text-[#f3eee3]/60 hover:text-[#111111] dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Incident Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-[#fcfaf7] dark:bg-[#121212] border border-[#111111]/10 dark:border-[#f3eee3]/10 text-xs">
              <div>
                <span className="block text-[10px] font-cinzel font-bold text-[#111111]/50 dark:text-[#f3eee3]/50 uppercase">
                  Timestamp
                </span>
                <span className="font-mono text-[11px] text-[#111111] dark:text-[#f3eee3]">
                  {formatTimestamp(inspectingLog.timestamp)}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-cinzel font-bold text-[#111111]/50 dark:text-[#f3eee3]/50 uppercase">
                  Source / Path
                </span>
                <span className="font-mono text-[11px] text-[#111111] dark:text-[#f3eee3] truncate block" title={inspectingLog.path || inspectingLog.source}>
                  {inspectingLog.path || inspectingLog.source || "—"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-cinzel font-bold text-[#111111]/50 dark:text-[#f3eee3]/50 uppercase">
                  User ID / Role
                </span>
                <span className="font-mono text-[11px] text-[#111111] dark:text-[#f3eee3]">
                  {inspectingLog.userId || "anonymous"} {inspectingLog.userRole ? `(${inspectingLog.userRole})` : ""}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-cinzel font-bold text-[#111111]/50 dark:text-[#f3eee3]/50 uppercase">
                  Client IP
                </span>
                <span className="font-mono text-[11px] text-[#111111] dark:text-[#f3eee3]">
                  {inspectingLog.ip || "127.0.0.1"}
                </span>
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-1">
              <label className="text-[10px] font-cinzel font-bold text-[#111111]/60 dark:text-[#f3eee3]/60 uppercase tracking-wider">
                Error Message
              </label>
              <div className="p-3 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-rose-800 dark:text-rose-300 font-medium text-xs leading-relaxed">
                {inspectingLog.message}
              </div>
            </div>

            {/* Technical Stack Trace / Details */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-cinzel font-bold text-[#111111]/60 dark:text-[#f3eee3]/60 uppercase tracking-wider">
                  Technical Stack Trace &amp; Payload Details
                </label>
                <button
                  onClick={() => handleCopyTrace(inspectingLog)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#d9541e] hover:underline cursor-pointer"
                >
                  {copiedId === inspectingLog.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Trace</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-[#111111] dark:bg-[#0c0c0c] text-[#f3eee3] font-mono text-xs overflow-x-auto max-h-56 leading-relaxed selection:bg-[#d9541e] border border-[#111111]/20">
                {inspectingLog.details || "No secondary technical details recorded for this event."}
              </pre>
            </div>

            {/* Resolution Information */}
            {inspectingLog.resolved && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Resolved by <strong>{inspectingLog.resolvedBy || "Administrator"}</strong> at{" "}
                  {formatTimestamp(inspectingLog.resolvedAt || inspectingLog.timestamp)}
                </span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={async () => {
                  const newStatus = !inspectingLog.resolved;
                  await resolveErrorLog(inspectingLog.id, newStatus);
                  setInspectingLog({
                    ...inspectingLog,
                    resolved: newStatus,
                    resolvedAt: newStatus ? new Date().toISOString() : "",
                    resolvedBy: newStatus ? currentUser?.name || "Platform Super Admin" : "",
                  });
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-cinzel font-bold border transition-all cursor-pointer ${
                  inspectingLog.resolved
                    ? "border-[#111111]/20 dark:border-[#f3eee3]/20 text-[#111111]/70 dark:text-[#f3eee3]/70 hover:text-[#111111] dark:hover:text-white"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 border-transparent"
                }`}
              >
                {inspectingLog.resolved ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reopen Incident</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Incident Resolved</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setInspectingLog(null)}
                className="px-5 py-2 rounded-2xl bg-[#d9541e] text-white hover:bg-[#bf4513] text-xs font-cinzel font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-[#181818] border border-[#111111]/20 dark:border-[#f3eee3]/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
                Purge All Audit &amp; Error Logs?
              </h3>
              <p className="text-xs font-serif text-[#111111]/60 dark:text-[#f3eee3]/60 max-w-xs mx-auto">
                This will permanently delete all {errorLogs.length} recorded diagnostic logs from the MongoDB cluster and in-memory store. This operation cannot be reversed.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="flex-1 py-2.5 rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs font-cinzel font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await clearErrorLogs();
                  setIsClearModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 text-white hover:bg-rose-700 text-xs font-cinzel font-bold transition-colors cursor-pointer"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
