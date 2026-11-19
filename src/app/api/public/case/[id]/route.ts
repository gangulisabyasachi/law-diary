import { NextRequest, NextResponse } from "next/server";
import { getPublicCase } from "@/lib/dataService";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = params.id;
    if (!caseId) {
      return NextResponse.json({ error: "Missing case identifier" }, { status: 400 });
    }
    const publicCase = await getPublicCase(caseId);
    if (!publicCase) {
      return NextResponse.json({ error: "Case docket not found" }, { status: 404 });
    }
    return NextResponse.json({ case: publicCase });
  } catch (error: any) {
    console.error("Public Case API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load judicial docket" },
      { status: 500 }
    );
  }
}
