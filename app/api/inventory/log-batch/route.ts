import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface LogBatchRequest {
  product: string;
  quantity: number;
  notes: string;
  by: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: LogBatchRequest = await req.json();
    const { product, quantity, notes, by } = body;

    if (!product || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Invalid product or quantity" },
        { status: 400 }
      );
    }

    // Call the Python batch logging script
    const { execSync } = require("child_process");
    
    const result = execSync(
      `python3 /Users/koovican/.openclaw/workspace/bot/log_batch.py "${product}" ${quantity} "${notes || ''}" "${by || 'Big Papa'}"`,
      { encoding: "utf-8" }
    );

    return NextResponse.json({
      success: true,
      message: `Logged batch: ${quantity} units of ${product}`,
      result,
    });
  } catch (error: any) {
    console.error("Error logging batch:", error);
    return NextResponse.json(
      { error: "Failed to log batch", details: error.message },
      { status: 500 }
    );
  }
}
