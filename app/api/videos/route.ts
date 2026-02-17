import { NextResponse } from "next/server";

interface VideoEntry {
  title: string;
  videoId: string;
  published: string;
  channelName: string;
  thumbnail: string;
}

const CHANNELS: { id: string; name: string }[] = [
  { id: "UCn9Q4lQJKi14BzCNg-8VVCA", name: "Runway" },
  { id: "UCXZCJLdBC09xxGZ6gcdrc6A", name: "OpenAI" },
  { id: "UCP4bf6IHJJQehibu6ai__cg",  name: "Google DeepMind" },
  { id: "UCGklKLKMDMIx7YR5BqreR8A", name: "Stability AI" },
];

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = xml.match(re);
  return m ? m[1].trim() : "";
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

    return NextResponse.json(allVideos.slice(0, 20));
  } catch (err) {
    console.error("[videos route]", err);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
