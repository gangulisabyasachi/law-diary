import { NextRequest, NextResponse } from "next/server";
import { queueApproval } from "@/lib/dataService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, by, byName, ts, type, label, payload } = body || {};

    if (!id || !type) {
      return NextResponse.json({ error: "id and type are required" }, { status: 400 });
    }

    await queueApproval({ id, by, byName, ts, type, label, payload });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

