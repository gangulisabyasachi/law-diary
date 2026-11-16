import { NextRequest, NextResponse } from "next/server";
import { registerLawyerUser } from "@/lib/dataService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, barEnrollment } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Advocate name, email, and password are required" },
        { status: 400 }
      );
    }

    // Option 1 password security criteria: min 8 chars, uppercase, lowercase, number, special char
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);

    if (!hasLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
        },
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

