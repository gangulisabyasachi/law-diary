import { NextRequest, NextResponse } from "next/server";
import { decideApproval, getChamberState } from "@/lib/dataService";
import { getAuthUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(req);
    const userId = user?.id || "u-lawyer";

    const body = await req.json();
    const { decision } = body || {};

    if (!decision || !["approve", "reject"].includes(decision)) {
      return NextResponse.json({ error: "decision must be 'approve' or 'reject'" }, { status: 400 });
    }

    await decideApproval(params.id, decision, userId);
    const state = await getChamberState();
    return NextResponse.json({ state });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

