import { NextResponse } from "next/server";

interface VideoEntry {
  title: string;
  videoId: string;
  published: string;
  channelName: string;
  thumbnail: string;
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
  // Add more as we find official channels - some of these companies don't have active YouTube presence
];

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = xml.match(re);
  return m ? m[1].trim() : "";
}

function isLikelyShort(title: string): boolean {
  const lowerTitle = title.toLowerCase();
  // Filter out obvious shorts indicators
  if (lowerTitle.includes("#short")) return true;
  if (lowerTitle.includes("shorts")) return true;
  // Very short titles (< 20 chars) are often shorts
  if (title.length < 20 && !lowerTitle.includes("launch")) return true;
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
    
    // Only include if it looks like a major launch/announcement
    // Comment this out if you want all non-shorts videos
    // if (!isMajorLaunch(title)) continue;

    const pubMatch = block.match(/<published>([\s\S]*?)<\/published>/i);
    const published = pubMatch ? pubMatch[1].trim() : new Date(0).toISOString();

    entries.push({
      title,
      videoId,
      published,
      channelName,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    });
  }

  return entries;
}

export async function GET() {
  try {
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

    allVideos.sort(
      (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
    );

    return NextResponse.json(allVideos.slice(0, 30));
  } catch (err) {
    console.error("[videos route]", err);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
