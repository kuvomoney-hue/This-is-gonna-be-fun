import { NextRequest, NextResponse } from "next/server";
import { updateStockWithCommit } from "@/lib/obsidianInventory";

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

    // Update Obsidian markdown → Git commit
    await updateStockWithCommit(ingredient, stock);

    return NextResponse.json({
      success: true,
      message: `Updated ${ingredient} to ${stock}g`,
      note: "Obsidian vault updated. Syncs to Google Sheet within 30 min.",
    });
  } catch (error: any) {
    console.error("Error updating stock:", error);
    return NextResponse.json(
      { error: "Failed to update stock", details: error.message },
      { status: 500 }
    );
  }
}
