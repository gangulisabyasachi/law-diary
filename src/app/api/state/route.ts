import { NextRequest, NextResponse } from "next/server";
import { getChamberState } from "@/lib/dataService";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    const userId = req.headers.get("x-user-id") || req.nextUrl.searchParams.get("userId") || authUser?.id;
    const role = req.headers.get("x-user-role") || req.nextUrl.searchParams.get("role") || authUser?.role;
    const lawyerId = req.headers.get("x-user-lawyer-id") || req.nextUrl.searchParams.get("lawyerId");

    const filterUser = userId && role ? { id: userId, role, lawyerId: lawyerId || undefined } : undefined;
    const state = await getChamberState(filterUser);
    return NextResponse.json({ state });
  } catch (error: any) {
    console.error("State API error:", error);
    return NextResponse.json({ error: error.message || "Failed to load state" }, { status: 500 });
  }
}
