import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), "public/data/inventory.json");
    const fileContents = await fs.readFile(dataPath, "utf8");
    const data = JSON.parse(fileContents);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error reading inventory data:", error);
    return NextResponse.json(
      { error: "Failed to load inventory data", details: error.message },
      { status: 500 }
    );
  }
}
