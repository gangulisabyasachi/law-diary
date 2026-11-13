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
      <div className="min-h-screen bg-[#14171a] flex flex-col items-center justify-center text-[#f2ede4]">
        <div className="w-12 h-12 rounded-xl bg-[#20242a] border border-[#b89552]/40 flex items-center justify-center">
          <Scale className="w-6 h-6 text-[#b89552]" />
        </div>
        <p className="mt-4 text-[11px] font-mono font-medium tracking-widest uppercase text-[#c5a059]">
          CounselBook Chamber Console
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
    <div className="min-h-screen flex bg-[#f9f8f6] text-[#191817] font-body selection:bg-[#ecdcb9] selection:text-[#191817]">
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

