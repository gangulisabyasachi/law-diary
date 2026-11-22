import { NextRequest, NextResponse } from "next/server";
import { lookupClientByAadhaar, lookupClientByPhone } from "@/lib/dataService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const aadhaar = searchParams.get("aadhaar");
    const phone = searchParams.get("phone");

    if (!aadhaar && !phone) {
      return NextResponse.json({ client: null, error: "Aadhaar or phone number is required" }, { status: 400 });
    }

    let client = null;
    if (aadhaar) {
      client = await lookupClientByAadhaar(aadhaar);
    } else if (phone) {
      client = await lookupClientByPhone(phone);
    }
    return NextResponse.json({ client });
  } catch (err: any) {
    console.error("Client lookup error:", err);
    return NextResponse.json({ client: null, error: err.message }, { status: 500 });
  }
}
