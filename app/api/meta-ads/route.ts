import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

interface MetaAd {
  source: "meta_ads";
  company: string;
  advertiser: string;
  text: string;
  impressions: number;
  impression_range: string;
  scraped_at: string;
  ad_url: string;
  thumbnail: string;
}

export async function GET() {
  try {
    const dataPath = join(process.cwd(), "public", "data", "meta_ads.json");
    const fileContent = await readFile(dataPath, "utf-8");
    const data = JSON.parse(fileContent);
    
    // Return ads sorted by impressions (already sorted in scraper, but re-sort for safety)
    const ads = (data.ads || []).sort(
      (a: MetaAd, b: MetaAd) => b.impressions - a.impressions
    );
    
    return NextResponse.json({
      ads,
      stats: data.stats,
      updated: data.updated,
    });
  } catch (err) {
    console.error("[meta-ads route]", err);
    // Return empty state if no data yet
    return NextResponse.json({
      ads: [],
      stats: {
        companies_scraped: 0,
        total_ads: 0,
        top_impression_count: 0,
      },
      updated: new Date().toISOString(),
    });
  }
}
