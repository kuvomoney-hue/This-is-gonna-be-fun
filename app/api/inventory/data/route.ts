import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/data/inventory.json");
    const data = fs.readFileSync(filePath, "utf8");
    const inventory = JSON.parse(data);

    return NextResponse.json(inventory, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error reading inventory:", error);
    return NextResponse.json(
      {
        inventory: [],
        products: [],
        batches: [],
        alerts: [],
        error: "Failed to load inventory data",
      },
      { status: 500 }
    );
  }
}
