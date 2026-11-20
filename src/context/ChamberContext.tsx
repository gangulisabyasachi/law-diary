"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppState, User, Case, Approval, Decision, ErrorLog } from "@/types";
import type { InkTheme } from "@/components/ui/ink-spill-theme-switch";

export interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ChamberContextType {
  state: AppState | null;
  loading: boolean;
  currentUser: User | null;
  token: string | null;
  activePage: string;
  selectedCaseId: string | null;
  searchQuery: string;
  statusFilter: string;
  isGuideOpen: boolean;
  activeModal: { name: string; payload?: any } | null;
  toasts: ToastItem[];
  theme: "system" | "light" | "dark";
  authModal: null | "signin" | "signup";
  // Actions
  setAuthModal: (modal: null | "signin" | "signup") => void;
  setTheme: (theme: "system" | "light" | "dark") => void;
  toggleTheme: (from?: Element | null, targetTheme?: "light" | "dark") => void;
  setActivePage: (page: string) => void;
  setSelectedCaseId: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setStatusFilter: (f: string) => void;
  setIsGuideOpen: (open: boolean) => void;
  openModal: (name: string, payload?: any) => void;
  closeModal: () => void;
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  login: (email: string, pass: string) => Promise<boolean>;
  signupLawyer: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    barEnrollment?: string;
    chamberName?: string;
    primaryCourt?: string;
  }) => Promise<boolean>;
  logout: () => void;
  refreshState: (userOverride?: User | null, tokenOverride?: string | null) => Promise<void>;
  sendOps: (ops: any[]) => Promise<boolean>;
  submitApproval: (item: any) => Promise<boolean>;
  decideApproval: (id: string, decision: "approve" | "reject") => Promise<boolean>;
  openCase: (caseId: string) => void;
  resetData: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  deleteChamber: (chamberId: string) => Promise<boolean>;
  toggleUserStatus: (userId: string, disabled?: boolean) => Promise<boolean>;
  adminUpdateUser: (userId: string, data: any) => Promise<boolean>;
  updateBroadcast: (active: boolean, message: string) => Promise<boolean>;
  refreshErrorLogs: () => Promise<void>;
  resolveErrorLog: (logId: string, resolved: boolean) => Promise<boolean>;
  deleteErrorLog: (logId: string) => Promise<boolean>;
  clearErrorLogs: () => Promise<boolean>;
  logSystemError: (log: Partial<ErrorLog>) => Promise<boolean>;
}

const ChamberContext = createContext<ChamberContextType | null>(null);

export function ChamberProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<{ name: string; payload?: any } | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [theme, setThemeState] = useState<"system" | "light" | "dark">("dark");
  const [authModal, setAuthModal] = useState<null | "signin" | "signup">(null);

  // Apply Theme Helper
  const applyTheme = useCallback((targetTheme: "system" | "light" | "dark") => {
    if (typeof window === "undefined") return;
    const prefDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = targetTheme === "dark" || (targetTheme === "system" && prefDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Sync theme on mount & listen to system changes
  useEffect(() => {
    const saved = localStorage.getItem("counselbook_theme");
    let initialTheme: "light" | "dark" = "dark";
    if (saved === "light" || saved === "dark") {
      initialTheme = saved;
    } else if (typeof window !== "undefined" && !window.matchMedia("(prefers-color-scheme: dark)").matches) {
      initialTheme = "light";
    }
    setThemeState(initialTheme);
    applyTheme(initialTheme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const current = localStorage.getItem("counselbook_theme");
      if (!current || current === "system") {
        const next = e.matches ? "dark" : "light";
        setThemeState(next);
        applyTheme(next);
      }
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [applyTheme]);

  const setTheme = (t: "system" | "light" | "dark") => {
    setThemeState(t);
    localStorage.setItem("counselbook_theme", t);
    applyTheme(t);
  };

  const toggleTheme = useCallback(
    (from?: Element | null, targetTheme?: "light" | "dark") => {
      const next = targetTheme || (theme === "dark" ? "light" : "dark");

      if (
        typeof document !== "undefined" &&
        "startViewTransition" in document &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        let x = window.innerWidth - 60;
        let y = 40;
        if (from) {
          const b = from.getBoundingClientRect();
          x = b.left + b.width / 2;
          y = b.top + b.height / 2;
        }

        const right = window.innerWidth - x;
        const bottom = window.innerHeight - y;
        const maxRadius = Math.hypot(Math.max(x, right), Math.max(y, bottom));

        const transition = (document as any).startViewTransition(() => {
          setTheme(next);
        });

        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 700,
              easing: "cubic-bezier(0.25, 1, 0.5, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        });
      } else {
        setTheme(next);
      }
    },
    [theme]
  );

  const addToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = "t-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const refreshState = useCallback(
    async (userOverride?: User | null, tokenOverride?: string | null) => {
      try {
        const u = userOverride !== undefined ? userOverride : currentUser;
        const t = tokenOverride !== undefined ? tokenOverride : token;

        const headers: Record<string, string> = {};
        if (t) headers["Authorization"] = `Bearer ${t}`;
        if (u) {
          headers["x-user-id"] = u.id;
          headers["x-user-role"] = u.role;
          if (u.lawyerId) headers["x-user-lawyer-id"] = u.lawyerId;
        }

        const res = await fetch("/api/state", { cache: "no-store", headers });
        if (res.ok) {
          const data = await res.json();
          setState(data.state);
        }
      } catch (err: any) {
        console.warn("Could not fetch state:", err);
      } finally {
        setLoading(false);
      }
    },
    [currentUser, token]
  );

  // Initial load: restore session
  useEffect(() => {
    const savedToken = localStorage.getItem("counselbook_token");
    const savedUser = localStorage.getItem("counselbook_user");
    let u: User | null = null;
    let t: string | null = null;
    if (savedToken && savedUser) {
      try {
        t = savedToken;
        u = JSON.parse(savedUser);
        setToken(savedToken);
        setCurrentUser(u);
      } catch (e) {
        localStorage.removeItem("counselbook_token");
        localStorage.removeItem("counselbook_user");
      }
    }
    refreshState(u, t);
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: pass.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Authentication failed. Please check your credentials.", "error");
        return false;
      }

      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem("counselbook_token", data.token);
      localStorage.setItem("counselbook_user", JSON.stringify(data.user));
      setActivePage("dashboard");
      addToast(`Welcome, ${data.user.name.split(" ")[0]}. Signed in as ${data.user.role.toUpperCase()}.`, "success");
      await refreshState(data.user, data.token);
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      return true;
    } catch (err: any) {
      addToast(err.message || "Login error", "error");
      return false;
    }
  };

  const signupLawyer = async (formData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    barEnrollment?: string;
    chamberName?: string;
    primaryCourt?: string;
  }): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Advocate registration failed", "error");
        return false;
      }
      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem("counselbook_token", data.token);
      localStorage.setItem("counselbook_user", JSON.stringify(data.user));
      setActivePage("dashboard");
      addToast(`Chamber created! Welcome to LexDaily, ${data.user.name}.`, "success");
      await refreshState(data.user, data.token);
      router.push("/dashboard");
      return true;
    } catch (err: any) {
      addToast(err.message || "Registration error", "error");
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem("counselbook_token");
    localStorage.removeItem("counselbook_user");
    setActivePage("dashboard");
    setSelectedCaseId(null);
    addToast("Signed out of LexDaily", "info");
    refreshState(null, null);
    router.push("/");
  };

  const sendOps = async (ops: any[]): Promise<boolean> => {
    try {
      const res = await fetch("/api/ops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(currentUser ? { "x-user-id": currentUser.id, "x-user-role": currentUser.role } : {}),
        },
        body: JSON.stringify({ ops }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Mutation rejected", "error");
        return false;
      }
      if (data.state) {
        setState(data.state);
      } else {
        await refreshState();
      }
      return true;
    } catch (err: any) {
      addToast(err.message || "Failed to submit operations", "error");
      return false;
    }
  };

  const submitApproval = async (item: any): Promise<boolean> => {
    try {
      const payloadItem = {
        id: item?.id || `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        by: item?.by || currentUser?.id || "u-associate",
        byName: item?.byName || currentUser?.name || "Associate Advocate",
        ts: item?.ts || new Date().toISOString(),
        type: item?.type,
        label: item?.label || "Chamber Draft Submission",
        payload: item?.payload || {},
      };

      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(currentUser ? { "x-user-id": currentUser.id, "x-user-role": currentUser.role } : {}),
        },
        body: JSON.stringify(payloadItem),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Submission failed", "error");
        return false;
      }
      addToast("Submitted for Advocate verification", "info");
      await refreshState();
      return true;
    } catch (err: any) {
      addToast(err.message || "Submission error", "error");
      return false;
    }
  };

  const decideApproval = async (id: string, decision: "approve" | "reject"): Promise<boolean> => {
    try {
      const res = await fetch(`/api/approvals/${encodeURIComponent(id)}/decide`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(currentUser ? { "x-user-id": currentUser.id, "x-user-role": currentUser.role } : {}),
        },
        body: JSON.stringify({ decision }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Decision failed", "error");
        return false;
      }
      addToast(decision === "approve" ? "Sign-off recorded & applied to docket" : "Submission returned to associate", "info");
      if (data.state) {
        setState(data.state);
      } else {
        await refreshState();
      }
      return true;
    } catch (err: any) {
      addToast(err.message || "Decision error", "error");
      return false;
    }
  };

  const openCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActivePage("case-detail");
    if (currentUser?.role === "admin") {
      router.push(`/admin/cases/${encodeURIComponent(caseId)}`);
    } else {
      router.push(`/dashboard/cases/${encodeURIComponent(caseId)}`);
    }
  };

  const openModal = (name: string, payload?: any) => {
    setActiveModal({ name, payload });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const resetData = async () => {
    try {
      const res = await fetch("/api/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Reset failed", "error");
        return;
      }
      addToast("Chamber database restored to default Indian court demo data", "success");
      await refreshState();
    } catch (err: any) {
      addToast(err.message || "Reset failed", "error");
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(userId)}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Failed to remove user", "error");
        return;
      }
      addToast("User account de-provisioned", "info");
      await refreshState();
    } catch (err: any) {
      addToast(err.message || "Failed to delete user", "error");
    }
  };

  const deleteChamber = async (chamberId: string): Promise<boolean> => {
    try {
      const res = await sendOps([
        {
          type: "deleteChamber",
          payload: { chamberId },
        },
      ]);
      if (res) {
        addToast("Chamber workspace and all associated records permanently purged.", "success");
        await refreshState();
      }
      return res;
    } catch (e: any) {
      addToast(e.message || "Failed to delete chamber", "error");
      return false;
    }
  };

  const toggleUserStatus = async (userId: string, disabled?: boolean): Promise<boolean> => {
    try {
      const res = await sendOps([
        {
          type: "toggleUserStatus",
          payload: { userId, disabled },
        },
      ]);
      if (res) {
        addToast(disabled ? "User account has been disabled." : "User account has been activated.", "info");
      }
      return res;
    } catch (e: any) {
      addToast(e.message || "Failed to toggle status", "error");
      return false;
    }
  };

  const adminUpdateUser = async (userId: string, data: any): Promise<boolean> => {
    try {
      const res = await sendOps([
        {
          type: "adminUpdateUser",
          payload: { userId, ...data },
        },
      ]);
      if (res) {
        addToast("User profile and credentials updated successfully.", "success");
      }
      return res;
    } catch (e: any) {
      addToast(e.message || "Failed to update user profile", "error");
      return false;
    }
  };

  const updateBroadcast = async (active: boolean, message: string): Promise<boolean> => {
    try {
      const res = await sendOps([
        {
          type: "updateBroadcast",
          payload: { active, message },
        },
      ]);
      if (res) {
        addToast(
          active
            ? "Platform Broadcast Notice published live across all user sessions."
            : "Platform Broadcast Notice deactivated.",
          "info"
        );
      }
      return res;
    } catch (e: any) {
      addToast(e.message || "Failed to update broadcast notice", "error");
      return false;
    }
  };

  const refreshErrorLogs = async (): Promise<void> => {
    try {
      const res = await fetch("/api/admin/logs", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(currentUser ? { "x-user-id": currentUser.id, "x-user-role": currentUser.role } : {}),
        },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.logs)) {
          setState((prev) => (prev ? { ...prev, errorLogs: data.logs } : prev));
        }
      }
    } catch (e) {
      console.warn("Failed to refresh error logs:", e);
    }
  };

  const resolveErrorLog = async (logId: string, resolved: boolean): Promise<boolean> => {
    try {
      // Optimistic state update
      setState((prev) => {
        if (!prev) return prev;
        const updated = (prev.errorLogs || []).map((l) =>
          l.id === logId
            ? {
                ...l,
                resolved,
                resolvedAt: resolved ? new Date().toISOString() : "",
                resolvedBy: resolved ? currentUser?.name || "Platform Super Admin" : "",
              }
            : l
        );
        return { ...prev, errorLogs: updated };
      });

      const res = await fetch("/api/admin/logs", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(currentUser ? { "x-user-id": currentUser.id, "x-user-role": currentUser.role } : {}),
        },
        body: JSON.stringify({ logId, resolved }),
      });

      if (res.ok) {
        addToast(resolved ? "Incident marked as resolved." : "Incident marked as active/unresolved.", "info");
        return true;
      }
      return await sendOps([
        {
          type: "resolveErrorLog",
          payload: { logId, resolved },
        },
      ]);
    } catch (e: any) {
      addToast(e.message || "Failed to update error log status", "error");
      return false;
    }
  };

  const deleteErrorLog = async (logId: string): Promise<boolean> => {
    try {
      // Optimistic state update
      setState((prev) => {
        if (!prev) return prev;
        const filtered = (prev.errorLogs || []).filter((l) => l.id !== logId);
        return { ...prev, errorLogs: filtered };
      });

      const res = await fetch(`/api/admin/logs?logId=${encodeURIComponent(logId)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(currentUser ? { "x-user-id": currentUser.id, "x-user-role": currentUser.role } : {}),
        },
        body: JSON.stringify({ logId }),
      });

      if (res.ok) {
        addToast("Error log purged from system.", "info");
        return true;
      }
      return await sendOps([
        {
          type: "deleteErrorLog",
          payload: { logId },
        },
      ]);
    } catch (e: any) {
      addToast(e.message || "Failed to delete error log", "error");
      return false;
    }
  };

  const clearErrorLogs = async (): Promise<boolean> => {
    try {
      // Optimistic state update
      setState((prev) => (prev ? { ...prev, errorLogs: [] } : prev));

      const res = await fetch("/api/admin/logs?all=true", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(currentUser ? { "x-user-id": currentUser.id, "x-user-role": currentUser.role } : {}),
        },
        body: JSON.stringify({ all: true }),
      });

      if (res.ok) {
        addToast("All error and audit logs cleared.", "info");
        return true;
      }
      return await sendOps([
        {
          type: "clearErrorLogs",
          payload: {},
        },
      ]);
    } catch (e: any) {
      addToast(e.message || "Failed to clear error logs", "error");
      return false;
    }
  };

  const logSystemError = async (log: Partial<ErrorLog>): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(currentUser ? { "x-user-id": currentUser.id, "x-user-role": currentUser.role } : {}),
        },
        body: JSON.stringify(log),
      });

      if (res.ok) {
        await refreshErrorLogs();
        addToast("Diagnostic incident recorded to platform audit stream.", "info");
        return true;
      }
      return await sendOps([
        {
          type: "logSystemError",
          payload: { log },
        },
      ]);
    } catch (e: any) {
      addToast(e.message || "Failed to record system error", "error");
      return false;
    }
  };

  return (
    <ChamberContext.Provider
      value={{
        state,
        loading,
        currentUser,
        token,
        activePage,
        selectedCaseId,
        searchQuery,
        statusFilter,
        isGuideOpen,
        activeModal,
        toasts,
        theme,
        setTheme,
        toggleTheme,
        authModal,
        setAuthModal,
        setActivePage,
        setSelectedCaseId,
        setSearchQuery,
        setStatusFilter,
        setIsGuideOpen,
        openModal,
        closeModal,
        addToast,
        login,
        signupLawyer,
        logout,
        refreshState,
        sendOps,
        submitApproval,
        decideApproval,
        openCase,
        resetData,
        deleteUser,
        deleteChamber,
        toggleUserStatus,
        adminUpdateUser,
        updateBroadcast,
        refreshErrorLogs,
        resolveErrorLog,
        deleteErrorLog,
        clearErrorLogs,
        logSystemError,
      }}
    >
      {children}
    </ChamberContext.Provider>
  );
}

export function useChamber() {
  const ctx = useContext(ChamberContext);
  if (!ctx) throw new Error("useChamber must be used within ChamberProvider");
  return ctx;
}
