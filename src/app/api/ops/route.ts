import { NextRequest, NextResponse } from "next/server";
import { applyOp, getChamberState } from "@/lib/dataService";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    const authorId = user?.id || req.headers.get("x-user-id") || "u-lawyer";
    const authorRole = user?.role || req.headers.get("x-user-role") || "lawyer";
    const authorLawyerId = req.headers.get("x-user-lawyer-id");

    const body = await req.json();
    const ops = Array.isArray(body?.ops) ? body.ops : [];

    for (const op of ops) {
      await applyOp(op, authorId);
    }

    const state = await getChamberState({
      id: authorId,
      role: authorRole,
      lawyerId: authorLawyerId || undefined,
    });
    return NextResponse.json({ state });
  } catch (error: any) {
    console.error("Ops API error:", error);
    return NextResponse.json({ error: error.message || "Failed to apply operations" }, { status: 500 });
  }
}
