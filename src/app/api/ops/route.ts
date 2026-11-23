import { NextRequest, NextResponse } from "next/server";
import { applyOp, getChamberState, recordSystemErrorLog } from "@/lib/dataService";
import { getAuthUser } from "@/lib/auth";
import { triggerSitemapRegeneration } from "@/lib/sitemap-generator";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";
  const user = getAuthUser(req);
  const authorId = user?.id || req.headers.get("x-user-id") || "u-lawyer";
  const authorRole = user?.role || req.headers.get("x-user-role") || "lawyer";
  const authorLawyerId = req.headers.get("x-user-lawyer-id");

  try {
    const body = await req.json().catch(() => ({}));
    const ops = Array.isArray(body?.ops) ? body.ops : [];

    for (const op of ops) {
      await applyOp(op, authorId);
    }

    // Auto-update sitemap if matters/cases were altered
    triggerSitemapRegeneration();

    const state = await getChamberState({
      id: authorId,
      role: authorRole,
      lawyerId: authorLawyerId || undefined,
    });
    return NextResponse.json({ state });
  } catch (error: any) {
    console.error("Ops API error:", error);
    recordSystemErrorLog({
      level: "error",
      category: "database",
      message: `Database ledger mutation failure: ${error.message || "Failed to apply operations"}`,
      details: error.stack || String(error),
      source: "api/ops",
      path: "/api/ops",
      userId: authorId,
      userRole: authorRole,
      ip: clientIp,
    }).catch(() => {});

    return NextResponse.json({ error: error.message || "Failed to apply operations" }, { status: 500 });
  }
}
