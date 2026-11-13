import { NextRequest, NextResponse } from "next/server";
import { applyOp, getChamberState } from "@/lib/dataService";
import { getAuthUser } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(req);
    await applyOp({ type: "removeUser", payload: { userId: params.id } }, user?.id || "u-admin");
    const state = await getChamberState();
    return NextResponse.json({ ok: true, state });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

