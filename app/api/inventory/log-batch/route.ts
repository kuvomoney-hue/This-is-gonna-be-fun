import { NextRequest, NextResponse } from "next/server";
import { logBatchWithCommit } from "@/lib/obsidianInventory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface LogBatchRequest {
  product: string;
  quantity: number;
  notes?: string;
  by?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: LogBatchRequest = await req.json();
    const { product, quantity, notes = "", by = "Big Papa" } = body;

    if (!product || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Invalid product or quantity" },
        { status: 400 }
      );
    }

    // Log batch to Obsidian → Git commit
    const batchId = await logBatchWithCommit(product, quantity, notes, by);

    return NextResponse.json({
      success: true,
      batchId,
      message: `Logged ${quantity}x ${product}`,
      note: "Batch logged to Obsidian vault. Syncs to Google Sheet within 30 min.",
    });
  } catch (error: any) {
    console.error("Error logging batch:", error);
    return NextResponse.json(
      { error: "Failed to log batch", details: error.message },
      { status: 500 }
    );
  }
}
