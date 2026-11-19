import { NextRequest, NextResponse } from "next/server";
import { lookupClientByPhone } from "@/lib/dataService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ client: null, error: "Phone number is required" }, { status: 400 });
    }

    const client = await lookupClientByPhone(phone);
    return NextResponse.json({ client });
  } catch (err: any) {
    console.error("Client lookup error:", err);
    return NextResponse.json({ client: null, error: err.message }, { status: 500 });
  }
}
