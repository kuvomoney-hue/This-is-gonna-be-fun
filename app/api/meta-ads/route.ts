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
  media_type: "video" | "image";
  scraped_at: string;
  ad_url: string;
  thumbnail: string;
}

export async function GET() {
  try {
    const dataPath = join(process.cwd(), "public", "data", "meta_ads.json");
    const fileContent = await readFile(dataPath, "utf-8");
    const data = JSON.parse(fileContent);
    
    // Transform ads to match expected format
    const transformedAds = (data.ads || []).map((ad: MetaAd, idx: number) => ({
      id: `${ad.company}-${idx}`,
      advertiser: ad.advertiser,
      text: ad.text,
      thumbnail: ad.thumbnail,
      startDate: new Date(ad.scraped_at).toLocaleDateString(),
      link: ad.ad_url,
      impressions: ad.impressions,
      keyword: ad.company,
      scrapedAt: ad.scraped_at,
      hasVideo: ad.media_type === "video"
    }));
    
    // Sort by impressions
    transformedAds.sort((a, b) => b.impressions - a.impressions);
    
    return NextResponse.json({
      ads: transformedAds,
      stats: {
        keywords_searched: data.stats?.companies_scraped || 0,
        total_unique_ads: data.stats?.total_ads || 0,
        total_impressions: transformedAds.reduce((sum, ad) => sum + ad.impressions, 0),
        top_impression_count: data.stats?.top_impression_count || 0,
      },
      updated: data.updated || new Date().toISOString(),
    });
  } catch (err) {
    console.error("[meta-ads route]", err);
    // Return empty state if no data yet
    return NextResponse.json({
      ads: [],
      stats: {
        keywords_searched: 0,
        total_unique_ads: 0,
        total_impressions: 0,
        top_impression_count: 0,
      },
      updated: new Date().toISOString(),
    });
  }
}
