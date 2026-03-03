import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

interface LaunchIntel {
  video_id: string;
  company: string;
  title: string;
  source: string;
  analyzed_at: string;
  transcript: string | null;
  transcript_length: number;
  sentiment: {
    score: number;
    positive: number;
    negative: number;
    neutral: number;
    top_complaints: string[];
  };
  marketing: {
    aha_moment: string;
    positioning: string;
    target_audience: string;
    distribution_strategy: string;
  };
  sentiment_score: number;
  aha_moment: string;
  top_complaints: string[];
}

interface IntelData {
  updated: string;
  total_analyzed: number;
  launches: LaunchIntel[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");
    
    // Load YouTube intel data
    const dataPath = join(process.cwd(), "public", "data", "launch_intel", "youtube_intel.json");
    
    try {
      const fileContent = await readFile(dataPath, "utf-8");
      const data: IntelData = JSON.parse(fileContent);
      
      // If videoId specified, return just that launch
      if (videoId) {
        const launch = data.launches.find(l => l.video_id === videoId);
        if (launch) {
          return NextResponse.json(launch);
        } else {
          return NextResponse.json(
            { error: "Launch not found" },
            { status: 404 }
          );
        }
      }
      
      // Otherwise return all intel
      return NextResponse.json(data);
      
    } catch (fileErr) {
      // No intel data generated yet
      return NextResponse.json({
        updated: new Date().toISOString(),
        total_analyzed: 0,
        launches: [],
        note: "No intel data generated yet. Run launch_intel_analyzer.py to generate."
      });
    }
    
  } catch (err) {
    console.error("[launch-intel route]", err);
    return NextResponse.json(
      { error: "Failed to load launch intel" },
      { status: 500 }
    );
  }
}
