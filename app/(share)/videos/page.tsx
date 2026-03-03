"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Image from "next/image";

interface VideoEntry {
  title: string;
  videoId: string;
  published: string;
  channelName: string;
  thumbnail: string;
  source?: "youtube" | "x";
  handle?: string;
  postUrl?: string;
  engagement?: {
    likes: number;
    retweets: number;
    replies: number;
    views: number;
  };
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

const CHANNEL_COLORS: Record<string, string> = {
  "Runway":         "bg-[#14591D] text-[#a5d6a7]",
  "OpenAI":         "bg-[#1b5e20] text-[#c8e6c9]",
  "Google DeepMind":"bg-[#2e7d32] text-[#dcedc8]",
  "Stability AI":   "bg-[#388e3c] text-[#f1f8e9]",
  "Anthropic":      "bg-[#2e7d32] text-[#a5d6a7]",
  "Synthesia":      "bg-[#388e3c] text-[#c8e6c9]",
  "Luma AI":        "bg-[#1b5e20] text-[#dcedc8]",
  "Pika":           "bg-[#14591D] text-[#e8f5e9]",
  "Descript":       "bg-[#2e7d32] text-[#c8e6c9]",
  "HeyGen":         "bg-[#388e3c] text-[#a5d6a7]",
};

const COMPANIES = [
  "All",
  // Tier 1: AI Avatar & Video Generation
  "HeyGen",
  "Synthesia",
  "D-ID",
  "Colossyan",
  "Elai.io",
  "DeepBrain AI",
  "Hour One",
  // Tier 2: AI Video Editing & Tools
  "Descript",
  "VEED.io",
  "InVideo",
  "CapCut",
  "Captions.ai",
  "Submagic",
  // Tier 3: AI Ad & Marketing
  "Creatify",
  "AdCreative AI",
  "Vidnoz",
  // Tier 4: Broader AI
  "Runway",
  "ElevenLabs",
  "Canva",
  // Original (keeping for now)
  "OpenAI",
  "Google DeepMind",
  "Stability AI",
  "Anthropic",
  "Luma AI",
  "Pika",
];

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours   = Math.floor(diff / 3_600_000);
  const days    = Math.floor(diff / 86_400_000);
  const weeks   = Math.floor(days / 7);
  const months  = Math.floor(days / 30);

  if (minutes < 60)  return `${minutes}m ago`;
  if (hours < 24)    return `${hours}h ago`;
  if (days < 7)      return `${days} day${days !== 1 ? "s" : ""} ago`;
  if (weeks < 5)     return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  return `${months} month${months !== 1 ? "s" : ""} ago`;
}

function formatImpressions(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

function VideoSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#111811] border border-[#1e3320] animate-pulse">
      <div className="w-full aspect-video bg-[#1e3320]" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-[#1e3320] rounded w-full" />
        <div className="h-4 bg-[#1e3320] rounded w-3/4" />
        <div className="flex gap-2 mt-2">
          <div className="h-5 w-20 bg-[#1e3320] rounded-full" />
          <div className="h-5 w-16 bg-[#1e3320] rounded" />
        </div>
      </div>
    </div>
  );
}

export default function VideosPage() {
  const [activeTab, setActiveTab] = useState<"launches" | "ads">("launches");
  const [selectedCompany, setSelectedCompany] = useState<string>("All");
  
  // Product Launches state
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState<string | null>(null);
  
  // Meta Ads state
  const [metaAds, setMetaAds] = useState<MetaAd[]>([]);
  const [adsLoading, setAdsLoading] = useState(true);
  const [adsError, setAdsError] = useState<string | null>(null);

  // Fetch Product Launches
  useEffect(() => {
    fetch("/api/videos")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((data) => {
        setVideos(data);
        setVideosLoading(false);
      })
      .catch((e) => {
        setVideosError(e.message);
        setVideosLoading(false);
      });
  }, []);

  // Fetch Meta Ads
  useEffect(() => {
    fetch("/api/meta-ads")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((data) => {
        setMetaAds(data.ads || []);
        setAdsLoading(false);
      })
      .catch((e) => {
        setAdsError(e.message);
        setAdsLoading(false);
      });
  }, []);

  // Filter by company
  const filteredVideos = selectedCompany === "All" 
    ? videos 
    : videos.filter(v => v.channelName === selectedCompany);
  
  const filteredAds = selectedCompany === "All"
    ? metaAds
    : metaAds.filter(ad => ad.keyword === selectedCompany);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#e8f5e9]">AI Video Feed</h1>
        <p className="text-[#81c784] text-sm mt-1">
          Product launches, demos &amp; top performing ads from AI companies
        </p>
      </div>

      {/* Tabs + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("launches")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "launches"
                ? "bg-[#14591D] text-white"
                : "bg-[#111811] text-[#81c784] hover:bg-[#1e3320]"
            }`}
          >
            Product Launches
          </button>
          <button
            onClick={() => setActiveTab("ads")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "ads"
                ? "bg-[#14591D] text-white"
                : "bg-[#111811] text-[#81c784] hover:bg-[#1e3320]"
            }`}
          >
            Meta Ads
          </button>
        </div>

        {/* Company Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#81c784]">Company:</label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="bg-[#111811] border border-[#1e3320] text-[#e8f5e9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4caf50]/50"
          >
            {COMPANIES.map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Launches Tab */}
      {activeTab === "launches" && (
        <>
          {videosError && (
            <div className="bg-[#1e1010] border border-[#4a1010] rounded-lg p-4 text-[#ef9a9a] text-sm">
              ⚠️ {videosError} — YouTube RSS may be blocked server-side. Try again later.
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {videosLoading
              ? Array.from({ length: 6 }).map((_, i) => <VideoSkeleton key={i} />)
              : filteredVideos.map((v) => {
                  const badgeClass = CHANNEL_COLORS[v.channelName] ?? "bg-[#1e3320] text-[#81c784]";
                  const videoLink = v.source === "x" 
                    ? v.postUrl || `https://x.com/search?q=${encodeURIComponent(v.title)}`
                    : `https://youtube.com/watch?v=${v.videoId}`;
                  
                  return (
                    <a
                      key={`${v.source || 'youtube'}-${v.videoId}`}
                      href={videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-xl overflow-hidden bg-[#111811] border border-[#1e3320] hover:border-[#4caf50]/50 transition-all duration-200 hover:shadow-[0_0_16px_rgba(76,175,80,0.15)]"
                    >
                      <div className="relative w-full aspect-video overflow-hidden">
                        <Image
                          src={v.thumbnail}
                          alt={v.title}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                        {v.source === "x" && (
                          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md">
                            <span className="text-xs font-bold text-white">𝕏</span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-[#e8f5e9] text-sm font-medium leading-snug line-clamp-2 mb-2">
                          {v.title}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass}`}>
                            {v.channelName}
                          </span>
                          <span className="text-xs text-[#81c784]">
                            {relativeTime(v.published)}
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
          </div>

          {!videosLoading && filteredVideos.length === 0 && !videosError && (
            <Card title="No videos found">
              <p className="text-[#81c784] text-sm">
                {selectedCompany === "All" 
                  ? "Could not fetch videos from RSS feeds. Check back later."
                  : `No recent videos from ${selectedCompany}.`}
              </p>
            </Card>
          )}
        </>
      )}

      {/* Meta Ads Tab */}
      {activeTab === "ads" && (
        <>
          {adsError && (
            <div className="bg-[#1e1010] border border-[#4a1010] rounded-lg p-4 text-[#ef9a9a] text-sm">
              ⚠️ {adsError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {adsLoading
              ? Array.from({ length: 6 }).map((_, i) => <VideoSkeleton key={i} />)
              : filteredAds.map((ad, idx) => {
                  const badgeClass = CHANNEL_COLORS[ad.keyword] ?? "bg-[#1e3320] text-[#81c784]";
                  
                  return (
                    <a
                      key={ad.id}
                      href={ad.link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-xl overflow-hidden bg-[#111811] border border-[#1e3320] hover:border-[#4caf50]/50 transition-all duration-200 hover:shadow-[0_0_16px_rgba(76,175,80,0.15)]"
                    >
                      {/* Ad Preview (placeholder for now - would show thumbnail if available) */}
                      <div className="relative w-full aspect-video bg-gradient-to-br from-[#14591D] to-[#0a2e0a] flex items-center justify-center">
                        <div className="text-center p-4">
                          <div className="text-4xl mb-2">📊</div>
                          <div className="text-xs text-[#81c784] font-mono">
                            {formatImpressions(ad.impressions)} impressions
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md">
                          <span className="text-xs font-bold text-white">Meta Ad</span>
                        </div>
                      </div>
                      
                      <div className="p-3">
                        <p className="text-[#e8f5e9] text-sm font-medium leading-snug line-clamp-3 mb-2">
                          {ad.text}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass}`}>
                            {ad.keyword}
                          </span>
                          <span className="text-xs text-[#81c784]">
                            {formatImpressions(ad.impressions)} views
                          </span>
                          <span className="text-xs text-[#81c784]/70">
                            {ad.startDate}
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
          </div>

          {!adsLoading && filteredAds.length === 0 && !adsError && (
            <Card title="No ads found">
              <p className="text-[#81c784] text-sm">
                {selectedCompany === "All"
                  ? "No Meta ads scraped yet. Run the scraper to populate this feed."
                  : `No ads found for ${selectedCompany}. Try selecting "All" or run the scraper again.`}
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
