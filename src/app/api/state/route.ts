import { NextRequest, NextResponse } from "next/server";
import { getChamberState } from "@/lib/dataService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const state = await getChamberState();
    return NextResponse.json({ state });
  } catch (error: any) {
    console.error("State API error:", error);
    return NextResponse.json({ error: error.message || "Failed to load state" }, { status: 500 });
  }
}

