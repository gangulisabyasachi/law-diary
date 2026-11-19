import { NextRequest, NextResponse } from "next/server";
import { queueApproval } from "@/lib/dataService";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    const userId = user?.id || req.headers.get("x-user-id") || "u-associate";

    const body = await req.json();
    // Accept payload either directly or nested under `item`
    const data = body?.item ? body.item : body;
    const { id, by, byName, ts, type, label, payload } = data || {};

    const resolvedType = type || body?.type;
    if (!resolvedType) {
      return NextResponse.json({ error: "type is required" }, { status: 400 });
    }

    const resolvedId = id || body?.id || `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const resolvedBy = by || body?.by || userId;
    const resolvedByName = byName || body?.byName || user?.name || "Associate Advocate";
    const resolvedTs = ts || body?.ts || new Date().toISOString();
    const resolvedLabel = label || body?.label || `Draft Submission (${resolvedType})`;
    const resolvedPayload = payload || body?.payload || {};

    await queueApproval({
      id: resolvedId,
      by: resolvedBy,
      byName: resolvedByName,
      ts: resolvedTs,
      type: resolvedType,
      label: resolvedLabel,
      payload: resolvedPayload,
    });

    return NextResponse.json({ ok: true, id: resolvedId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

