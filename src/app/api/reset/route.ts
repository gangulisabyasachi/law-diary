import { NextRequest, NextResponse } from "next/server";
import { resetDatabase, getChamberState } from "@/lib/dataService";

export async function POST(req: NextRequest) {
  try {
    await resetDatabase();
    const state = await getChamberState();
    return NextResponse.json({ ok: true, state });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

