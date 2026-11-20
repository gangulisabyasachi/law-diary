import { NextRequest, NextResponse } from "next/server";
import {
  getAllErrorLogs,
  recordSystemErrorLog,
  resolveSystemErrorLog,
  deleteSystemErrorLog,
} from "@/lib/dataService";
import { getAuthUser } from "@/lib/auth";
import { ErrorLog } from "@/types";

export const dynamic = "force-dynamic";

// GET /api/admin/logs - Fetch all error logs
export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    const role = req.headers.get("x-user-role") || authUser?.role;
    const userId = req.headers.get("x-user-id") || authUser?.id;

    // Only allow platform administrator
    if (role !== "admin" && userId !== "u-admin") {
      return NextResponse.json(
        { error: "Unauthorized access to platform audit logs" },
        { status: 403 }
      );
    }

    const logs = await getAllErrorLogs();
    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error("GET /api/admin/logs error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve logs" },
      { status: 500 }
    );
  }
}

// POST /api/admin/logs - Record a new system/runtime error log
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const authUser = getAuthUser(req);
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const logPayload: Partial<ErrorLog> = {
      level: body.level || "error",
      category: body.category || "system",
      message: body.message || "Unspecified application error",
      details: body.details || "",
      source: body.source || "client",
      path: body.path || "",
      userId: body.userId || authUser?.id || req.headers.get("x-user-id") || "",
      userRole: body.userRole || authUser?.role || req.headers.get("x-user-role") || "",
      ip: body.ip || clientIp,
      resolved: false,
    };

    await recordSystemErrorLog(logPayload);
    return NextResponse.json({ ok: true, message: "Error log recorded" });
  } catch (error: any) {
    console.error("POST /api/admin/logs error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to record log" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/logs - Update resolution status of an error log
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { logId, resolved } = body;

    if (!logId) {
      return NextResponse.json({ error: "logId is required" }, { status: 400 });
    }

    const authUser = getAuthUser(req);
    const resolvedBy = authUser?.name || "Platform Super Admin";

    await resolveSystemErrorLog(logId, Boolean(resolved), resolvedBy);
    return NextResponse.json({ ok: true, logId, resolved: Boolean(resolved) });
  } catch (error: any) {
    console.error("PATCH /api/admin/logs error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update log" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/logs - Delete a single log or clear all logs
export async function DELETE(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    const role = req.headers.get("x-user-role") || authUser?.role;
    if (role !== "admin" && authUser?.id !== "u-admin") {
      return NextResponse.json(
        { error: "Only administrators can delete logs" },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const logId = body.logId || req.nextUrl.searchParams.get("logId");
    const clearAll =
      body.all === true || req.nextUrl.searchParams.get("all") === "true";

    if (clearAll) {
      await deleteSystemErrorLog(undefined, true);
      return NextResponse.json({ ok: true, message: "All error logs cleared" });
    }

    if (logId) {
      await deleteSystemErrorLog(logId, false);
      return NextResponse.json({ ok: true, message: `Deleted error log ${logId}` });
    }

    return NextResponse.json(
      { error: "Specify either logId or all: true" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("DELETE /api/admin/logs error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete log" },
      { status: 500 }
    );
  }
}
