"use client";

import React from "react";
import { CaseDetailView } from "@/components/views/CaseDetailView";

export default function AdminSingleCasePage({ params }: { params: { id: string } }) {
  return <CaseDetailView caseId={params.id} />;
}

