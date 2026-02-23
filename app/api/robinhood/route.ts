import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const dataPath = join(process.cwd(), "public", "data", "robinhood.json");
    const fileContent = await readFile(dataPath, "utf-8");
    const data = JSON.parse(fileContent);
    
    // Transform to match dashboard expectations
    return NextResponse.json({
      connected: true,
      equity: data.equity || 0,
      buyingPower: data.buying_power || 0,
      hasPositions: data.has_positions || false,
      positions: data.positions || [],
      lastUpdated: data._updated,
    });
  } catch (err) {
    console.error("[robinhood route]", err);
    return NextResponse.json(
      { connected: false, equity: 0, buyingPower: 0, hasPositions: false, positions: [] },
      { status: 500 }
    );
  }
}
