import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

interface VideoEntry {
  title: string;
  videoId: string;
  published: string;
  channelName: string;
  thumbnail: string;
  source?: "youtube" | "x";
}

interface XVideoEntry {
  source: "x";
  brand: string;
  handle: string;
  text: string;
  postUrl: string;
  videoUrl: string;
  thumbnail: string;
  engagement: {
    likes: number;
    retweets: number;
    replies: number;
    views: number;
  };
  timestamp: string;
  duration_sec: number;
}

const CHANNELS: { id: string; name: string }[] = [
  // Original
  { id: "UCn9Q4lQJKi14BzCNg-8VVCA", name: "Runway" },
  { id: "UCXZCJLdBC09xxGZ6gcdrc6A", name: "OpenAI" },
  { id: "UCP4bf6IHJJQehibu6ai__cg",  name: "Google DeepMind" },
  { id: "UCGklKLKMDMIx7YR5BqreR8A", name: "Stability AI" },
  
  // New additions
  { id: "UCLB7AzTwc6VFZrBsO2ucBMg", name: "Anthropic" },
  { id: "UCvD6XFr3BPRrXAAIldJVe-w", name: "Synthesia" },
  { id: "UC4T7fm0Cxoi8HjCB5y3HBIQ", name: "Luma AI" },
  { id: "UCRx3KJNgH38R3BJUBY2q8Dg", name: "Pika" },
  { id: "UC95hKgASVo5ZR6HJ3Qi_E4g", name: "Descript" },
  { id: "UCcuXKLzFxwEPFDEtvjzMSDg", name: "Veed.io" },
  { id: "UCHXa1e9vcONbg9vXWCyh-Hw", name: "CapCut" },
  { id: "UCJsXKiz-6VrZVYFMUqPY8wQ", name: "InVideo" },
  { id: "UCkZMx7V1CRaRSvpfD7fGVcA", name: "HeyGen" },
];

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = xml.match(re);
  return m ? m[1].trim() : "";
}

function isLikelyShort(title: string): boolean {
  const lowerTitle = title.toLowerCase();
  
  // Explicit shorts markers
  if (lowerTitle.includes("#short")) return true;
  if (lowerTitle.includes("shorts")) return true;
  if (lowerTitle.includes("#shorts")) return true;
  
  // Very short titles (unless they mention launch/release/announce)
  const hasLaunchKeyword = /launch|release|announc|introduc|unveil|demo|official/i.test(title);
  if (title.length < 25 && !hasLaunchKeyword) return true;
  
  // Common short patterns
  if (lowerTitle.match(/^(how to|tip|trick|hack|quick)/)) return true;
  if (lowerTitle.match(/\d+ (second|sec|minute|min) /)) return true;
  
  return false;
}

function isMajorLaunch(title: string): boolean {
  const lowerTitle = title.toLowerCase();
  const launchKeywords = [
    "launch", "announcing", "introducing", "new feature",
    "now available", "released", "unveil", "demo",
    "official", "reveal", "preview", "keynote"
  ];
  return launchKeywords.some(kw => lowerTitle.includes(kw));
}

function parseEntries(xml: string, channelName: string): VideoEntry[] {
  const entries: VideoEntry[] = [];
  const entryRe = /<entry>([\s\S]*?)<\/entry>/gi;
  let match: RegExpExecArray | null;

  while ((match = entryRe.exec(xml)) !== null) {
    const block = match[1];

    // yt:videoId
    const vidMatch = block.match(/<yt:videoId>([\s\S]*?)<\/yt:videoId>/i);
    const videoId = vidMatch ? vidMatch[1].trim() : "";
    if (!videoId) continue;

    const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/i);
    const rawTitle = titleMatch ? titleMatch[1].trim() : "";
    const cdataMatch = rawTitle.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
    const title = cdataMatch ? cdataMatch[1].trim() : rawTitle;

    // Skip shorts
    if (isLikelyShort(title)) continue;

    const pubMatch = block.match(/<published>([\s\S]*?)<\/published>/i);
    const published = pubMatch ? pubMatch[1].trim() : new Date(0).toISOString();

    entries.push({
      title,
      videoId,
      published,
      channelName,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      source: "youtube",
    });
  }

  return entries;
}

async function fetchYouTubeVideos(): Promise<VideoEntry[]> {
  const results = await Promise.allSettled(
    CHANNELS.map(({ id, name }) =>
      fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`, {
        next: { revalidate: 1800 },
      })
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status} for ${name}`);
          return r.text();
        })
        .then((xml) => parseEntries(xml, name))
    )
  );

  const allVideos: VideoEntry[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allVideos.push(...result.value);
    }
  }

  return allVideos;
}

async function fetchXVideos(): Promise<VideoEntry[]> {
  // TODO: X scraper needs fixing - currently captures junk UI elements
  // Hiding X videos until scraper is improved
  return [];
  
  /* DISABLED UNTIL SCRAPER IS FIXED
  try {
    const dataPath = join(process.cwd(), "public", "data", "x_videos.json");
    const fileContent = await readFile(dataPath, "utf-8");
    const data = JSON.parse(fileContent);
    
    // Convert X video format to unified VideoEntry format
    const xVideos: VideoEntry[] = (data.videos || []).map((xv: XVideoEntry) => ({
      title: xv.text.slice(0, 100) + (xv.text.length > 100 ? "..." : ""),
      videoId: xv.postUrl.split("/").pop() || "",
      published: xv.timestamp,
      channelName: xv.brand,
      thumbnail: xv.thumbnail,
      source: "x" as const,
      // Additional X-specific data (for future enhancement)
      handle: xv.handle,
      engagement: xv.engagement,
      postUrl: xv.postUrl,
    }));
    
    return xVideos;
  } catch (err) {
    console.log("[videos] No X video data available:", err);
    return [];
  }
  */
}

export async function GET() {
  try {
    // Fetch both YouTube and X videos in parallel
    const [youtubeVideos, xVideos] = await Promise.all([
      fetchYouTubeVideos(),
      fetchXVideos(),
    ]);

    // Combine and sort by published date
    const allVideos = [...youtubeVideos, ...xVideos];
    allVideos.sort(
      (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
    );

    // Return top 30
    return NextResponse.json(allVideos.slice(0, 30));
  } catch (err) {
    console.error("[videos route]", err);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
