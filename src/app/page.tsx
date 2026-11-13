"use client";

import React from "react";
import { ChamberProvider, useChamber } from "@/context/ChamberContext";
import { AuthScreen } from "@/components/AuthScreen";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { DashboardView } from "@/components/views/DashboardView";
import { CasesView } from "@/components/views/CasesView";
import { CaseDetailView } from "@/components/views/CaseDetailView";
import { CalendarView } from "@/components/views/CalendarView";
import { ClientsView } from "@/components/views/ClientsView";
import { AssociatesView } from "@/components/views/AssociatesView";
import { ApprovalsView } from "@/components/views/ApprovalsView";
import { ContactsView } from "@/components/views/ContactsView";
import { UsersView } from "@/components/views/UsersView";
import { Modals } from "@/components/Modals";
import { MongoGuideModal } from "@/components/MongoGuideModal";
import { ToastContainer } from "@/components/ToastContainer";
import { motion, AnimatePresence } from "framer-motion";
import { Scale } from "lucide-react";

function MainApp() {
  const { currentUser, loading, activePage } = useChamber();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20 animate-pulse">
          <Scale className="w-7 h-7 text-slate-950" />
        </div>
        <p className="mt-4 text-xs font-semibold tracking-widest uppercase text-amber-400">
          Loading CounselBook...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <AuthScreen />
        <MongoGuideModal />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-body">
      {/* Sidebar */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {activePage === "dashboard" && <DashboardView />}
              {activePage === "cases" && <CasesView />}
              {activePage === "case-detail" && <CaseDetailView />}
              {activePage === "calendar" && <CalendarView />}
              {activePage === "clients" && <ClientsView />}
              {activePage === "associates" && <AssociatesView />}
              {activePage === "approvals" && <ApprovalsView />}
              {activePage === "contacts" && <ContactsView />}
              {activePage === "users" && <UsersView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modals & Overlays */}
      <Modals />
      <MongoGuideModal />
      <ToastContainer />
    </div>
  );
}

export default function Home() {
  return (
    <ChamberProvider>
      <MainApp />
    </ChamberProvider>
  );
}

