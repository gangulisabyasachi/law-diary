import { NextRequest, NextResponse } from "next/server";
import { registerLawyerUser, recordSystemErrorLog } from "@/lib/dataService";

export async function POST(req: NextRequest) {
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      recordSystemErrorLog({
        level: "warn",
        category: "validation",
        message: "Advocate registration rejected: mandatory fields missing",
        details: `Name present: ${Boolean(name)}, Email present: ${Boolean(email)}, Password present: ${Boolean(password)}`,
        source: "api/auth/signup",
        path: "/api/auth/signup",
        ip: clientIp,
      }).catch(() => {});

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
      recordSystemErrorLog({
        level: "warn",
        category: "validation",
        message: `Advocate registration rejected: weak password complexity for '${email}'`,
        details: "Password failed statutory complexity requirements (minimum 8 characters with upper, lower, digit, and special symbol).",
        source: "api/auth/signup",
        path: "/api/auth/signup",
        ip: clientIp,
      }).catch(() => {});

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
    recordSystemErrorLog({
      level: "error",
      category: "auth",
      message: `Advocate onboarding exception: ${error.message || "Registration failed"}`,
      details: error.stack || String(error),
      source: "api/auth/signup",
      path: "/api/auth/signup",
      ip: clientIp,
    }).catch(() => {});

    return NextResponse.json({ error: error.message || "Advocate registration failed" }, { status: 500 });
  }
}
