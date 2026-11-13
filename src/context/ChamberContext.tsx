"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AppState, User, Case, Approval, Decision } from "@/types";

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
  // Actions
  setActivePage: (page: string) => void;
  setSelectedCaseId: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setStatusFilter: (f: string) => void;
  setIsGuideOpen: (open: boolean) => void;
  openModal: (name: string, payload?: any) => void;
  closeModal: () => void;
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  refreshState: () => Promise<void>;
  sendOps: (ops: any[]) => Promise<boolean>;
  submitApproval: (item: any) => Promise<boolean>;
  decideApproval: (id: string, decision: "approve" | "reject") => Promise<boolean>;
  openCase: (caseId: string) => void;
  resetData: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

const ChamberContext = createContext<ChamberContextType | null>(null);

export function ChamberProvider({ children }: { children: React.ReactNode }) {
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

  const addToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = "t-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const refreshState = useCallback(async () => {
    try {
      const res = await fetch("/api/state", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
      }
    } catch (err: any) {
      console.warn("Could not fetch state:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load: restore session
  useEffect(() => {
    const savedToken = localStorage.getItem("counselbook_token");
    const savedUser = localStorage.getItem("counselbook_user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("counselbook_token");
        localStorage.removeItem("counselbook_user");
      }
    }
    refreshState();
  }, [refreshState]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Authentication failed", "error");
        return false;
      }

      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem("counselbook_token", data.token);
      localStorage.setItem("counselbook_user", JSON.stringify(data.user));
      setActivePage("dashboard");
      addToast(`Welcome back, ${data.user.name.split(" ")[0]}.`, "success");
      await refreshState();
      return true;
    } catch (err: any) {
      addToast(err.message || "Login error", "error");
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
    addToast("Signed out of CounselBook", "info");
  };

  const sendOps = async (ops: any[]): Promise<boolean> => {
    try {
      const res = await fetch("/api/ops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ops }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Failed to save changes", "error");
        return false;
      }
      setState(data.state);
      return true;
    } catch (err: any) {
      addToast(err.message || "Failed to apply operation", "error");
      return false;
    }
  };

  const submitApproval = async (item: any): Promise<boolean> => {
    try {
      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        await refreshState();
        return true;
      }
      return false;
    } catch (err: any) {
      addToast(err.message || "Error submitting for approval", "error");
      return false;
    }
  };

  const decideApproval = async (id: string, decision: "approve" | "reject"): Promise<boolean> => {
    try {
      const res = await fetch(`/api/approvals/${id}/decide`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ decision }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Decision failed", "error");
        return false;
      }
      setState(data.state);
      addToast(
        decision === "approve"
          ? "Approved — modification applied to the court file."
          : "Submission rejected.",
        decision === "approve" ? "success" : "info"
      );
      return true;
    } catch (err: any) {
      addToast(err.message || "Error deciding approval", "error");
      return false;
    }
  };

  const openCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActivePage("case-detail");
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
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (res.ok) {
        setState(data.state);
        addToast("Demo chamber data restored to clean state.", "success");
      }
    } catch (err: any) {
      addToast(err.message || "Reset failed", "error");
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (res.ok) {
        setState(data.state);
        addToast("User account removed.", "success");
      }
    } catch (err: any) {
      addToast(err.message || "Delete failed", "error");
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
        setActivePage,
        setSelectedCaseId,
        setSearchQuery,
        setStatusFilter,
        setIsGuideOpen,
        openModal,
        closeModal,
        addToast,
        login,
        logout,
        refreshState,
        sendOps,
        submitApproval,
        decideApproval,
        openCase,
        resetData,
        deleteUser,
      }}
    >
      {children}
    </ChamberContext.Provider>
  );
}

export function useChamber() {
  const context = useContext(ChamberContext);
  if (!context) {
    throw new Error("useChamber must be used within a ChamberProvider");
  }
  return context;
}

