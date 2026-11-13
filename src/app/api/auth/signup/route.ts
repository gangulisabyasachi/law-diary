import { NextRequest, NextResponse } from "next/server";
import { registerLawyerUser } from "@/lib/dataService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, barEnrollment } = body;

    if (!name || !email || !password || !barEnrollment) {
      return NextResponse.json(
        { error: "Advocate name, email, password, and Bar Council Enrolment No. are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Security password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const result = await registerLawyerUser(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Signup API error:", error);
    return NextResponse.json({ error: error.message || "Advocate registration failed" }, { status: 500 });
  }
}

