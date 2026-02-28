import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface UpdateStockRequest {
  ingredient: string;
  stock: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: UpdateStockRequest = await req.json();
    const { ingredient, stock } = body;

    if (!ingredient || stock === undefined || stock < 0) {
      return NextResponse.json(
        { error: "Invalid ingredient or stock value" },
        { status: 400 }
      );
    }

    // Call the Python update script
    const { execSync } = require("child_process");
    
    const result = execSync(
      `python3 /Users/koovican/.openclaw/workspace/bot/update_stock.py "${ingredient}" ${stock}`,
      { encoding: "utf-8" }
    );

    return NextResponse.json({
      success: true,
      message: `Updated ${ingredient} to ${stock}`,
      result,
    });
  } catch (error: any) {
    console.error("Error updating stock:", error);
    return NextResponse.json(
      { error: "Failed to update stock", details: error.message },
      { status: 500 }
    );
  }
}
