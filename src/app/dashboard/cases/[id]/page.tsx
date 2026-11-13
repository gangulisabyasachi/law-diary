"use client";

import React from "react";
import { CaseDetailView } from "@/components/views/CaseDetailView";

export default function SingleCasePage({ params }: { params: { id: string } }) {
  return <CaseDetailView caseId={params.id} />;
}

