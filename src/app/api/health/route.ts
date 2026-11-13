import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, getSanitizedUri } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { isConnected, error } = await connectToDatabase();
    return NextResponse.json({
      status: "ok",
      database: isConnected ? "connected" : "disconnected",
      uri: getSanitizedUri(),
      error: error || null,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({
      status: "error",
      database: "disconnected",
      error: err.message,
    });
  }
}

