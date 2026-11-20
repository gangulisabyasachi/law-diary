import { NextRequest, NextResponse } from "next/server";
import { loginUser, recordSystemErrorLog } from "@/lib/dataService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (!email || !password) {
      recordSystemErrorLog({
        level: "warn",
        category: "validation",
        message: "Login attempt with missing email or password",
        source: "api/auth/login",
        path: "/api/auth/login",
        ip: clientIp,
      }).catch(() => {});
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const result = await loginUser(email, password);
    if (!result) {
      recordSystemErrorLog({
        level: "warn",
        category: "auth",
        message: `Authentication challenge rejected for '${email}'`,
        details: "Supplied password or access code did not match credentials on record.",
        source: "api/auth/login",
        path: "/api/auth/login",
        ip: clientIp,
      }).catch(() => {});
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Login API error:", error);
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    recordSystemErrorLog({
      level: "error",
      category: "auth",
      message: `Authentication exception: ${error.message || "Login error"}`,
      details: error.stack || String(error),
      source: "api/auth/login",
      path: "/api/auth/login",
      ip: clientIp,
    }).catch(() => {});

    return NextResponse.json({ error: error.message || "Authentication error" }, { status: 500 });
  }
}
