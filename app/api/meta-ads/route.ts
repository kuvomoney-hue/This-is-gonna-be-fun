import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const dataPath = join(process.cwd(), "public", "data", "meta_ads.json");
    const fileContent = await readFile(dataPath, "utf-8");
    const data = JSON.parse(fileContent);

    const ads = data.ads || [];

    return NextResponse.json({
      ads,
      stats: {
        keywords_searched: data.stats?.keywords_searched ?? 0,
        total_unique_ads: data.stats?.total_unique_ads ?? ads.length,
        total_impressions: data.stats?.total_impressions ?? 0,
        top_impression_count: data.stats?.top_impression_count ?? 0,
      },
      updated: data.updated || new Date().toISOString(),
    });
  } catch (err) {
    console.error("[meta-ads route]", err);
    return NextResponse.json({
      ads: [],
      stats: { keywords_searched: 0, total_unique_ads: 0, total_impressions: 0, top_impression_count: 0 },
      updated: new Date().toISOString(),
    });
  }
}
