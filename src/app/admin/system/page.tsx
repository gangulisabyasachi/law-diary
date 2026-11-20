"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  Database,
  Activity,
  Server,
  Lock,
  Download,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Clock,
  Layers,
  HardDrive,
  RefreshCw,
  Bell,
  Globe,
  Radio,
  Wifi,
} from "lucide-react";
import { useChamber } from "@/context/ChamberContext";

interface HealthTelemetry {
  database: "connected" | "disconnected";
  dbType: string;
  host: string;
  databaseName: string;
  clusterHost: string;
  cloudRegion: string;
  replicationMode: string;
  readConsistency: string;
  writeResilience: string;
  latencyMs: number | null;
  error?: string | null;
}

export default function AdminSystemPage() {
  const { state, currentUser, resetData, addToast, updateBroadcast } = useChamber();

  const [telemetry, setTelemetry] = useState<HealthTelemetry>({
    database: state?.dbConnected ? "connected" : "disconnected",
    dbType: state?.dbType || "mongodb",
    host: "cluster0.eenqcct.mongodb.net",
    databaseName: "counselbook",
    clusterHost: "cluster0.eenqcct.mongodb.net",
    cloudRegion: "ap-south-1 (AWS Mumbai)",
    replicationMode: "Atlas 3-Node Replica Set",
    readConsistency: "Immediate (Primary Node)",
    writeResilience: "Majority Acknowledged",
    latencyMs: null,
  });

  const [pingStatus, setPingStatus] = useState<{
    running: boolean;
    lastPing: string | null;
    latencyMs: number | null;
    status: "healthy" | "idle" | "error";
  }>({
    running: false,
    lastPing: null,
    latencyMs: null,
    status: "idle",
  });

  const isBroadcastActive = Boolean(state?.broadcast?.active);
  const [broadcastMessage, setBroadcastMessage] = useState(
    state?.broadcast?.message ||
      "Scheduled platform maintenance window: System remaining online with full database replication."
  );
  const [isUpdatingBroadcast, setIsUpdatingBroadcast] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Live Query /api/health directly
  const fetchLiveHealth = useCallback(
    async (isManualPing = false) => {
      if (isManualPing) {
        setPingStatus((prev) => ({ ...prev, running: true }));
      }

      try {
        const res = await fetch(`/api/health?t=${Date.now()}`, {
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          setTelemetry({
            database: data.database,
            dbType: data.dbType || "mongodb",
            host: data.host || data.clusterHost || "cluster0.eenqcct.mongodb.net",
            databaseName: data.databaseName || "counselbook",
            clusterHost: data.clusterHost || "cluster0.eenqcct.mongodb.net",
            cloudRegion: data.cloudRegion || "ap-south-1 (AWS Mumbai)",
            replicationMode: data.replicationMode || "Atlas 3-Node Replica Set",
            readConsistency: data.readConsistency || "Immediate (Primary Node)",
            writeResilience: data.writeResilience || "Majority Acknowledged",
            latencyMs: data.latencyMs,
            error: data.error,
          });

          setPingStatus({
            running: false,
            lastPing: new Date().toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }),
            latencyMs: data.latencyMs,
            status: data.database === "connected" ? "healthy" : "idle",
          });

          if (isManualPing) {
            if (data.database === "connected" && data.latencyMs !== null) {
              addToast(
                `MongoDB Atlas ping successful (${data.latencyMs}ms). Live query verified.`,
                "success"
              );
            } else {
              addToast(
                "In-memory store active. MongoDB Atlas is currently offline or reconnecting.",
                "info"
              );
            }
          }
        }
      } catch (err: any) {
        console.warn("Live health query error:", err);
        if (isManualPing) {
          addToast("Failed to reach live health endpoint.", "error");
        }
      } finally {
        setPingStatus((prev) => ({ ...prev, running: false }));
      }
    },
    [addToast]
  );

  // Fetch real data on initial page load
  useEffect(() => {
    fetchLiveHealth(false);
  }, [fetchLiveHealth]);

  useEffect(() => {
    if (state?.broadcast?.message) {
      setBroadcastMessage(state.broadcast.message);
    }
  }, [state?.broadcast?.message]);

  const handleToggleBroadcast = async () => {
    setIsUpdatingBroadcast(true);
    await updateBroadcast(!isBroadcastActive, broadcastMessage);
    setIsUpdatingBroadcast(false);
  };

  const handleSaveBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      addToast("Please enter an advisory banner message.", "error");
      return;
    }
    setIsUpdatingBroadcast(true);
    await updateBroadcast(true, broadcastMessage);
    setIsUpdatingBroadcast(false);
  };

  if (!state || !currentUser) return null;

  const users = state.users || [];
  const cases = state.cases || [];
  const lawyers = users.filter((u) => u.role === "lawyer");

  const handleRunPing = () => {
    fetchLiveHealth(true);
  };

  const handleDownloadSnapshot = () => {
    const snapshot = {
      exportedAt: new Date().toISOString(),
      platform: "LexDaily Multi-Tenant Legal Chambers",
      environment: process.env.NODE_ENV || "production",
      cloudDatabase: {
        provider: "MongoDB Atlas",
        database: telemetry.databaseName,
        host: telemetry.clusterHost,
        activeNode: telemetry.host,
        connected: telemetry.database === "connected",
        realLatencyMs: telemetry.latencyMs,
      },
      counts: {
        totalUsers: users.length,
        lawyers: lawyers.length,
        associates: users.filter((u) => u.role === "associate").length,
        clients: users.filter((u) => u.role === "client").length,
        cases: cases.length,
      },
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        designation: u.designation,
        phone: u.phone,
        lawyerId: u.lawyerId,
        disabled: u.disabled || u.status === "disabled",
      })),
    };

    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lexdaily-backup-snapshot-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("Platform metadata snapshot downloaded successfully.", "info");
  };

  const isConnected = telemetry.database === "connected";

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase font-bold border ${
                isConnected
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20"
              }`}
            >
              {isConnected ? "MongoDB Atlas Live" : "In-Memory Hybrid"}
            </span>
            <span className="text-xs text-[#111111]/40 dark:text-[#f3eee3]/40">•</span>
            <span className="text-xs text-[#111111]/60 dark:text-[#f3eee3]/60 font-serif">
              Real-time Live Cluster Telemetry
            </span>
          </div>
          <h2 className="text-2xl font-bold font-cinzel text-[#111111] dark:text-[#f3eee3] tracking-tight">
            System Health &amp; Cloud Database
          </h2>
          <p className="text-xs text-[#111111]/70 dark:text-[#f3eee3]/70 font-serif italic mt-0.5">
            Cloud cluster connection status, live roundtrip ping metrics, multi-tenant isolation telemetry, and platform broadcast.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <button
            onClick={handleRunPing}
            disabled={pingStatus.running}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#1e1e1e] border border-[#111111]/15 dark:border-[#f3eee3]/20 text-xs font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] hover:bg-[#111111]/5 transition-colors shadow-sm cursor-pointer"
            title="Execute genuine roundtrip ping command to MongoDB Atlas cluster"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                pingStatus.running ? "animate-spin text-[#d9541e]" : "text-[#d9541e]"
              }`}
            />
            <span>{pingStatus.running ? "Pinging Atlas..." : "Test Real DB Ping"}</span>
          </button>

          <button
            onClick={handleDownloadSnapshot}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#111111] dark:bg-[#f3eee3] text-[#f3eee3] dark:text-[#111111] text-xs font-cinzel font-bold tracking-wider hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Snapshot</span>
          </button>
        </div>
      </div>

      {/* Cloud DB & Ping Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: MongoDB Cluster Telemetry */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
                Cloud Database
              </h3>
            </div>
            <span
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
                isConnected
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              {isConnected ? "Connected" : "In-Memory Hybrid"}
            </span>
          </div>

          <div className="space-y-2 text-xs font-serif text-[#111111]/80 dark:text-[#f3eee3]/80 pt-1">
            <div className="flex justify-between py-1 border-b border-[#111111]/5 dark:border-[#f3eee3]/5">
              <span className="text-[#111111]/50 dark:text-[#f3eee3]/50">Cluster Host:</span>
              <span
                className="font-mono text-[11px] font-semibold text-[#111111] dark:text-[#f3eee3] truncate max-w-[200px]"
                title={telemetry.host || telemetry.clusterHost}
              >
                {telemetry.clusterHost}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#111111]/5 dark:border-[#f3eee3]/5">
              <span className="text-[#111111]/50 dark:text-[#f3eee3]/50">Database Name:</span>
              <span className="font-mono text-[11px] font-semibold text-[#111111] dark:text-[#f3eee3]">
                {telemetry.databaseName}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#111111]/5 dark:border-[#f3eee3]/5">
              <span className="text-[#111111]/50 dark:text-[#f3eee3]/50">Cloud Region:</span>
              <span className="font-mono text-[11px] text-[#111111] dark:text-[#f3eee3]">
                {telemetry.cloudRegion}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#111111]/50 dark:text-[#f3eee3]/50">Replication Mode:</span>
              <span
                className={`font-mono text-[11px] font-semibold ${
                  isConnected
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {telemetry.replicationMode}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Live Ping & Network Health */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
                Latency &amp; Throughput
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#111111]/50 dark:text-[#f3eee3]/50">
              {pingStatus.lastPing ? `Checked: ${pingStatus.lastPing}` : "Ready"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f3eee3]/40 dark:bg-[#202020] border border-[#111111]/10 dark:border-[#f3eee3]/10">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#111111]/50 dark:text-[#f3eee3]/50 block">
                Real Roundtrip Latency
              </span>
              <span className="text-xl font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
                {pingStatus.latencyMs !== null
                  ? `${pingStatus.latencyMs} ms`
                  : telemetry.latencyMs !== null
                  ? `${telemetry.latencyMs} ms`
                  : isConnected
                  ? "Connected"
                  : "N/A (Memory Cache)"}
              </span>
            </div>
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                isConnected
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isConnected ? "Nominal" : "Fallback"}</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs font-serif text-[#111111]/70 dark:text-[#f3eee3]/70">
            <div className="flex justify-between">
              <span>Read Consistency:</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {telemetry.readConsistency}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Write Resilience:</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {telemetry.writeResilience}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Security & Multi-Tenancy Architecture */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-[#d9541e] dark:text-[#ea6026]" />
              <h3 className="text-sm font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
                Security Safeguards
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-[#d9541e]/10 text-[#d9541e] border border-[#d9541e]/20">
              Enforced
            </span>
          </div>

          <div className="space-y-2 text-xs font-serif text-[#111111]/80 dark:text-[#f3eee3]/80 pt-1">
            <div className="flex justify-between py-1 border-b border-[#111111]/5 dark:border-[#f3eee3]/5">
              <span className="text-[#111111]/50 dark:text-[#f3eee3]/50">Chamber Isolation:</span>
              <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Enforced (Active)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#111111]/5 dark:border-[#f3eee3]/5">
              <span className="text-[#111111]/50 dark:text-[#f3eee3]/50">Password Hashing:</span>
              <span className="font-mono text-[11px] text-[#111111] dark:text-[#f3eee3]">
                Bcrypt (10 Salt Rounds)
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#111111]/50 dark:text-[#f3eee3]/50">Account Lockout:</span>
              <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Instant Session Revocation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Registry Breakdown */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#111111] dark:text-[#f3eee3]" />
            <h3 className="text-sm font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
              Cloud Document Registry
            </h3>
          </div>
          <span className="text-xs font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">
            Real-time entity counts across the platform
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-[#f3eee3]/40 dark:bg-[#202020] border border-[#111111]/10 dark:border-[#f3eee3]/10">
            <span className="text-[10px] font-mono uppercase text-[#111111]/50 dark:text-[#f3eee3]/50 block">
              users collection
            </span>
            <span className="text-2xl font-bold font-cinzel text-[#111111] dark:text-[#f3eee3] mt-1 block">
              {users.length}
            </span>
            <span className="text-[11px] font-serif text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5 block">
              {lawyers.length} Advocates • {users.filter((u) => u.role === "associate").length} Associates •{" "}
              {users.filter((u) => u.role === "client").length} Clients
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#f3eee3]/40 dark:bg-[#202020] border border-[#111111]/10 dark:border-[#f3eee3]/10">
            <span className="text-[10px] font-mono uppercase text-[#111111]/50 dark:text-[#f3eee3]/50 block">
              chambers directory
            </span>
            <span className="text-2xl font-bold font-cinzel text-blue-600 dark:text-blue-400 mt-1 block">
              {lawyers.length}
            </span>
            <span className="text-[11px] font-serif text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5 block">
              Multi-tenant advocate practices
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#f3eee3]/40 dark:bg-[#202020] border border-[#111111]/10 dark:border-[#f3eee3]/10">
            <span className="text-[10px] font-mono uppercase text-[#111111]/50 dark:text-[#f3eee3]/50 block">
              cases collection
            </span>
            <span className="text-2xl font-bold font-cinzel text-[#d9541e] dark:text-[#ea6026] mt-1 block">
              {cases.length}
            </span>
            <span className="text-[11px] font-serif text-[#111111]/60 dark:text-[#f3eee3]/60 mt-0.5 block">
              Active court matters &amp; dossiers
            </span>
          </div>
        </div>
      </div>

      {/* Platform Notice Broadcast & Admin Maintenance */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#181818] border border-[#111111]/10 dark:border-[#f3eee3]/15 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#111111]/10 dark:border-[#f3eee3]/10">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-[#d9541e] dark:text-[#ea6026]" />
            <div>
              <h3 className="text-sm font-bold font-cinzel text-[#111111] dark:text-[#f3eee3]">
                Platform Broadcast Notice
              </h3>
              <p className="text-[11px] font-serif italic text-[#111111]/60 dark:text-[#f3eee3]/60">
                Publish a live administrative advisory banner displayed across all advocate, associate, and litigant screens.
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleBroadcast}
            disabled={isUpdatingBroadcast}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-bold border transition-colors cursor-pointer ${
              isBroadcastActive
                ? "bg-rose-600 text-white border-rose-700 hover:bg-rose-700"
                : "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
            }`}
          >
            {isBroadcastActive ? "Deactivate Broadcast" : "Publish Broadcast"}
          </button>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f3eee3]/40 dark:bg-[#202020] border border-[#111111]/10 dark:border-[#f3eee3]/10 text-xs font-serif">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isBroadcastActive ? "bg-emerald-500 animate-ping" : "bg-zinc-400"
              }`}
            />
            <span className="font-mono font-bold text-[#111111] dark:text-[#f3eee3]">
              {isBroadcastActive
                ? "BROADCAST STATUS: LIVE ACROSS ALL SESSIONS"
                : "BROADCAST STATUS: INACTIVE"}
            </span>
          </div>
          <span className="text-[11px] text-[#111111]/60 dark:text-[#f3eee3]/60">
            {isBroadcastActive ? "Visible on all dashboards & layouts" : "Hidden from user screens"}
          </span>
        </div>

        {/* Message Input & Action */}
        <div className="space-y-1.5">
          <label className="block text-xs font-cinzel font-bold text-[#111111]/70 dark:text-[#f3eee3]/70">
            Advisory Banner Text
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Enter system announcement, maintenance schedule, or registry holiday notice..."
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-[#f3eee3]/30 dark:bg-[#202020] text-[#111111] dark:text-[#f3eee3] focus:outline-none focus:border-[#111111] dark:focus:border-[#f3eee3]"
            />
            <button
              onClick={handleSaveBroadcast}
              disabled={isUpdatingBroadcast}
              className="px-5 py-2.5 rounded-xl bg-[#111111] dark:bg-[#f3eee3] text-[#f3eee3] dark:text-[#111111] text-xs font-cinzel font-bold hover:opacity-90 transition-opacity cursor-pointer shrink-0"
            >
              {isUpdatingBroadcast ? "Saving..." : "Save & Broadcast"}
            </button>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="pt-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#111111]/50 dark:text-[#f3eee3]/50 block mb-1.5">
            Live Banner Appearance (Preview)
          </span>
          <div className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d9541e]/15 via-amber-500/15 to-[#d9541e]/15 border border-[#d9541e]/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#d9541e]/20 text-[#d9541e]">
                <Radio className="w-3 h-3 animate-pulse" />
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-[#d9541e] text-white">
                Platform Advisory
              </span>
              <p className="font-serif text-[#111111] dark:text-[#f3eee3] text-xs truncate">
                {broadcastMessage || "No notice text specified"}
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#111111]/40 dark:text-[#f3eee3]/40">
              [Dismiss X]
            </span>
          </div>
        </div>

        {/* Technical Architecture Explanation */}
        <div className="p-4 rounded-xl bg-[#111111]/5 dark:bg-white/5 border border-[#111111]/10 dark:border-[#f3eee3]/10 space-y-1.5 text-xs font-serif text-[#111111]/70 dark:text-[#f3eee3]/70">
          <p className="font-cinzel font-bold text-[11px] text-[#111111] dark:text-[#f3eee3]">
            How Platform Broadcast Works:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[11.5px] leading-relaxed">
            <li>
              <strong>Real-Time Replication:</strong> When published, the advisory is saved to MongoDB Atlas (`settings` collection) and synchronized with all active client sessions.
            </li>
            <li>
              <strong>Global Coverage:</strong> The banner renders immediately across all Advocate portals, Associate rosters, Litigant dashboards, and public pages.
            </li>
            <li>
              <strong>Instant Revocation:</strong> Clicking &quot;Deactivate Broadcast&quot; removes the banner immediately from all user sessions platform-wide.
            </li>
          </ul>
        </div>
      </div>

      {/* Danger Zone: Reset Default Records */}
      <div className="p-5 sm:p-6 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 space-y-4">
        <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-400">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <h3 className="text-sm font-bold font-cinzel">
            Platform Reset &amp; Demonstration Restore
          </h3>
        </div>

        <p className="text-xs font-serif text-rose-900/80 dark:text-rose-300/80 leading-relaxed">
          Restores all platform databases to the default seed state, including the Advocate chamber, associate roster, litigant matters, and judicial schedules. Use with caution.
        </p>

        {isResetConfirmOpen ? (
          <div className="p-4 rounded-xl bg-white dark:bg-[#202020] border border-rose-300 dark:border-rose-800 space-y-3">
            <p className="text-xs font-cinzel font-bold text-rose-600">
              Are you sure? This will reset all current chamber modifications and restore the clean master seed records.
            </p>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await resetData();
                  setIsResetConfirmOpen(false);
                  addToast("Master chamber database records restored successfully.", "success");
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-cinzel font-bold hover:bg-rose-700 transition-colors"
              >
                Confirm Restore
              </button>
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#111111]/10 dark:bg-white/10 text-xs font-cinzel font-bold hover:bg-[#111111]/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-cinzel font-bold hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Default Chamber Records</span>
          </button>
        )}
      </div>
    </div>
  );
}
