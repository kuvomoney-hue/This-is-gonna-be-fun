"use client";

import { useEffect, useState, useCallback } from "react";

/* ─────────────────────────── types ─────────────────────────── */

interface VideoEntry {
  title: string;
  videoId: string;
  published: string;
  channelName: string;
  thumbnail: string;
  source?: "youtube" | "x";
  handle?: string;
  postUrl?: string;
  engagement?: { likes: number; retweets: number; replies: number; views: number };
}

interface MetaAd {
  id: string;
  advertiser: string;
  text: string;
  thumbnail: string | null;
  startDate: string;
  link: string | null;
  impressions: number;
  keyword: string;
  scrapedAt: string;
  hasVideo: boolean;
}

interface MetaAdsData {
  ads: MetaAd[];
  stats: {
    keywords_searched: number;
    total_unique_ads: number;
    total_impressions: number;
    top_impression_count: number;
  };
  updated: string;
}

/* ─────────────────────────── helpers ─────────────────────────── */

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  const w = Math.floor(d / 7);
  if (m < 60) return `${m}m`;
  if (h < 24) return `${h}h`;
  if (d < 7) return `${d}d`;
  if (w < 5) return `${w}w`;
  return `${Math.floor(d / 30)}mo`;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/* gradient fallback colors indexed by first char */
const GRAD_COLORS: Record<string, string> = {
  A: "from-violet-600 to-purple-800",
  B: "from-blue-600 to-indigo-800",
  C: "from-cyan-600 to-teal-800",
  D: "from-indigo-600 to-blue-800",
  E: "from-emerald-600 to-green-800",
  F: "from-fuchsia-600 to-pink-800",
  G: "from-green-600 to-emerald-800",
  H: "from-rose-600 to-pink-800",
  I: "from-sky-600 to-blue-800",
  J: "from-amber-600 to-orange-800",
  K: "from-lime-600 to-green-800",
  L: "from-violet-600 to-indigo-800",
  M: "from-teal-600 to-cyan-800",
  N: "from-orange-600 to-red-800",
  O: "from-pink-600 to-rose-800",
  P: "from-purple-600 to-violet-800",
  Q: "from-indigo-600 to-violet-800",
  R: "from-red-600 to-rose-800",
  S: "from-sky-600 to-indigo-800",
  T: "from-teal-600 to-green-800",
  U: "from-violet-600 to-blue-800",
  V: "from-fuchsia-600 to-violet-800",
  W: "from-emerald-600 to-teal-800",
  X: "from-zinc-600 to-zinc-800",
  Y: "from-yellow-600 to-amber-800",
  Z: "from-zinc-600 to-slate-800",
};

function gradientFor(name: string): string {
  return GRAD_COLORS[(name[0] || "A").toUpperCase()] ?? "from-indigo-600 to-purple-800";
}

/* channel badge color (consistent per channel) */
const CHANNEL_BADGE: Record<string, string> = {
  "HeyGen":         "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Synthesia":      "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Runway":         "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "OpenAI":         "bg-teal-500/20 text-teal-300 border-teal-500/30",
  "Google DeepMind":"bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Anthropic":      "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Pika":           "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "ElevenLabs":     "bg-violet-500/20 text-violet-300 border-violet-500/30",
  "Descript":       "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "VEED.io":        "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "InVideo":        "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "CapCut":         "bg-rose-500/20 text-rose-300 border-rose-500/30",
  "Luma AI":        "bg-sky-500/20 text-sky-300 border-sky-500/30",
  "Stability AI":   "bg-green-500/20 text-green-300 border-green-500/30",
};

function channelBadge(name: string): string {
  return CHANNEL_BADGE[name] ?? "bg-zinc-700/50 text-zinc-300 border-zinc-600/50";
}

/* keyword badge */
function keywordBadge(kw: string): string {
  const map: Record<string, string> = {
    "AI video generation": "bg-violet-500/20 text-violet-300 border-violet-500/30",
    "text to video AI":    "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "AI avatar":           "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    "AI voice clone":      "bg-amber-500/20 text-amber-300 border-amber-500/30",
    "deepfake video":      "bg-red-500/20 text-red-300 border-red-500/30",
    "synthetic media":     "bg-pink-500/20 text-pink-300 border-pink-500/30",
  };
  return map[kw] ?? "bg-zinc-700/50 text-zinc-300 border-zinc-600/50";
}

/* ─────────────────────────── skeleton ─────────────────────────── */

function Skeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 animate-pulse">
      <div className="w-full aspect-video bg-zinc-800" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 bg-zinc-800 rounded w-full" />
        <div className="h-3.5 bg-zinc-800 rounded w-4/5" />
        <div className="flex gap-2 mt-3">
          <div className="h-5 w-20 bg-zinc-800 rounded-full" />
          <div className="h-5 w-10 bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── img with fallback ─────────────────────────── */

function Thumb({ src, alt, gradient }: { src: string | null; alt: string; gradient: string }) {
  const [err, setErr] = useState(false);

  if (!src || err) {
    return (
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span className="text-white/60 text-2xl font-bold tracking-wider">{initials(alt)}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setErr(true)}
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

/* ─────────────────────────── page ─────────────────────────── */

export default function IntelPage() {
  const [tab, setTab] = useState<"videos" | "ads">("videos");

  /* video state */
  const [videos, setVideos]       = useState<VideoEntry[]>([]);
  const [videosLoading, setVL]    = useState(true);
  const [videosErr, setVE]        = useState<string | null>(null);
  const [videoFilter, setVF]      = useState("all");

  /* ads state */
  const [adsData, setAdsData]     = useState<MetaAdsData | null>(null);
  const [adsLoading, setAL]       = useState(true);
  const [adsErr, setAE]           = useState<string | null>(null);
  const [adsFilter, setAF]        = useState("all");

  const fetchVideos = useCallback(async () => {
    try {
      const r = await fetch("/api/videos");
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setVideos(await r.json());
    } catch (e: unknown) {
      setVE(e instanceof Error ? e.message : "failed to load");
    } finally {
      setVL(false);
    }
  }, []);

  const fetchAds = useCallback(async () => {
    try {
      const r = await fetch("/api/meta-ads");
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setAdsData(await r.json());
    } catch (e: unknown) {
      setAE(e instanceof Error ? e.message : "failed to load");
    } finally {
      setAL(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
    fetchAds();
  }, [fetchVideos, fetchAds]);

  /* derived */
  const channels = ["all", ...Array.from(new Set(videos.map((v) => v.channelName))).sort()];
  const keywords  = ["all", ...Array.from(new Set((adsData?.ads || []).map((a) => a.keyword))).sort()];

  const shownVideos = videoFilter === "all" ? videos : videos.filter((v) => v.channelName === videoFilter);
  const shownAds    = adsFilter === "all" ? (adsData?.ads || []) : (adsData?.ads || []).filter((a) => a.keyword === adsFilter);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── header ── */}
      <div className="border-b border-zinc-900 px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight">ai intel</h1>
            <p className="text-zinc-500 text-sm mt-0.5">video releases + ad spy · updated live</p>
          </div>
          {/* last updated */}
          {adsData && (
            <p className="text-xs text-zinc-600 shrink-0">
              ads updated {timeAgo(adsData.updated)} ago
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">

        {/* ── tabs ── */}
        <div className="flex gap-1 bg-zinc-900 rounded-xl p-1 w-fit">
          {([["videos", "video feed"], ["ads", "ad spy"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                tab === key
                  ? "bg-white text-black shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ══════════════ VIDEO FEED ══════════════ */}
        {tab === "videos" && (
          <>
            {/* filter row */}
            <div className="flex items-center gap-2 flex-wrap">
              {channels.map((ch) => (
                <button
                  key={ch}
                  onClick={() => setVF(ch)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                    videoFilter === ch
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200"
                  }`}
                >
                  {ch === "all" ? "all channels" : ch}
                </button>
              ))}
            </div>

            {/* error */}
            {videosErr && (
              <div className="rounded-lg bg-red-950/50 border border-red-900/50 px-4 py-3 text-sm text-red-300">
                {videosErr} — RSS feeds may be temporarily unavailable
              </div>
            )}

            {/* grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {videosLoading
                ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)
                : shownVideos.map((v) => {
                    const href =
                      v.source === "x"
                        ? v.postUrl || "#"
                        : `https://youtube.com/watch?v=${v.videoId}`;
                    return (
                      <a
                        key={`${v.source || "yt"}-${v.videoId}`}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-200 hover:shadow-[0_0_24px_rgba(99,102,241,0.12)]"
                      >
                        <div className="relative w-full aspect-video overflow-hidden bg-zinc-800">
                          <Thumb src={v.thumbnail} alt={v.channelName} gradient={gradientFor(v.channelName)} />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                          {v.source === "x" && (
                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">
                              𝕏
                            </div>
                          )}
                          {/* play icon on hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                              <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium text-zinc-100 leading-snug line-clamp-2 mb-2.5 group-hover:text-white transition-colors">
                            {v.title}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${channelBadge(v.channelName)}`}>
                              {v.channelName}
                            </span>
                            <span className="text-xs text-zinc-500">{timeAgo(v.published)}</span>
                          </div>
                        </div>
                      </a>
                    );
                  })}
            </div>

            {!videosLoading && shownVideos.length === 0 && !videosErr && (
              <div className="text-center py-20 text-zinc-600 text-sm">
                {videoFilter === "all" ? "no videos loaded yet" : `no recent videos from ${videoFilter}`}
              </div>
            )}
          </>
        )}

        {/* ══════════════ AD SPY ══════════════ */}
        {tab === "ads" && (
          <>
            {/* stats row */}
            {adsData && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ["ads tracked", adsData.stats.total_unique_ads],
                  ["keywords", adsData.stats.keywords_searched],
                  ["with video", (adsData.ads.filter((a) => a.hasVideo).length)],
                  ["advertisers", new Set(adsData.ads.map((a) => a.advertiser)).size],
                ].map(([label, val]) => (
                  <div key={label as string} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div className="text-xs text-zinc-500 mb-1">{label}</div>
                    <div className="text-xl font-semibold">{val}</div>
                  </div>
                ))}
              </div>
            )}

            {/* filter row */}
            <div className="flex items-center gap-2 flex-wrap">
              {keywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => setAF(kw)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                    adsFilter === kw
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200"
                  }`}
                >
                  {kw === "all" ? `all (${adsData?.ads.length ?? 0})` : `${kw} (${(adsData?.ads || []).filter((a) => a.keyword === kw).length})`}
                </button>
              ))}
            </div>

            {/* error */}
            {adsErr && (
              <div className="rounded-lg bg-red-950/50 border border-red-900/50 px-4 py-3 text-sm text-red-300">
                {adsErr}
              </div>
            )}

            {/* grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {adsLoading
                ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
                : shownAds.map((ad) => (
                    <a
                      key={ad.id}
                      href={ad.link || "#"}
                      target={ad.link ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="group rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-200 hover:shadow-[0_0_24px_rgba(99,102,241,0.12)]"
                    >
                      {/* thumbnail */}
                      <div className="relative w-full aspect-video overflow-hidden bg-zinc-800">
                        <Thumb
                          src={ad.thumbnail}
                          alt={ad.advertiser}
                          gradient={gradientFor(ad.advertiser)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute top-2 left-2 flex gap-1.5">
                          <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                            Meta Ad
                          </div>
                          {ad.hasVideo && (
                            <div className="bg-indigo-600/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                              video
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-3">
                        {/* advertiser */}
                        <div className="text-xs font-semibold text-zinc-200 mb-1.5">{ad.advertiser}</div>

                        {/* ad copy */}
                        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 mb-3">
                          {ad.text}
                        </p>

                        {/* tags */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${keywordBadge(ad.keyword)}`}>
                            {ad.keyword}
                          </span>
                          <span className="text-xs text-zinc-500">{ad.startDate}</span>
                          {ad.link && (
                            <span className="ml-auto text-xs text-indigo-400 group-hover:text-indigo-300 transition-colors">
                              view →
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
            </div>

            {!adsLoading && shownAds.length === 0 && !adsErr && (
              <div className="text-center py-20 text-zinc-600 text-sm">
                {adsFilter === "all" ? "no ads loaded yet — run the scraper" : `no ads for "${adsFilter}"`}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
