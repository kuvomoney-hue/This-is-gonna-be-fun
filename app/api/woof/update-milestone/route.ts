import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface UpdateMilestoneRequest {
  milestone: string;
  value: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body: UpdateMilestoneRequest = await req.json();
    const { milestone, value } = body;

    if (!milestone) {
      return NextResponse.json(
        { error: "Milestone key is required" },
        { status: 400 }
      );
    }

    // Read current woof.json
    const dataPath = path.join(process.cwd(), "public/data/woof.json");
    const fileContents = await fs.readFile(dataPath, "utf8");
    const data = JSON.parse(fileContents);

    // Update milestone
    if (!data.milestones) {
      data.milestones = {};
    }
    data.milestones[milestone] = value;
    
    // Calculate new status based on milestones
    const milestoneKeys = ["rdComplete", "labelsSubmitted", "kitchenOnboarding", "labelApproval", "launched"];
    const completedCount = milestoneKeys.filter(key => data.milestones[key]).length;
    
    if (data.milestones.launched) {
      data.status = "launched";
    } else if (completedCount >= 3) {
      data.status = "pre-launch";
    } else {
      data.status = "development";
    }

    // Write back to file
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf8");

    // Also trigger git commit (optional - for persistence)
    try {
      const { execSync } = require("child_process");
      execSync(
        `cd ${process.cwd()} && git add public/data/woof.json && git commit -m "chore: Update ${milestone} milestone" && git push`,
        { encoding: "utf-8" }
      );
    } catch (gitError) {
      // Git commit failed - file still updated locally
      console.log("Git commit skipped:", gitError);
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${milestone} to ${value}`,
      data,
    });
  } catch (error: any) {
    console.error("Error updating milestone:", error);
    return NextResponse.json(
      { error: "Failed to update milestone", details: error.message },
      { status: 500 }
    );
  }
}
