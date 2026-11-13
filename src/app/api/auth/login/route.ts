import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/dataService";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const result = await loginUser(email, password);
    if (!result) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: error.message || "Authentication error" }, { status: 500 });
  }
}

