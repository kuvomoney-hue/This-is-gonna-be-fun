"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface VideoEntry {
  title: string;
  videoId: string;
  published: string;
  channelName: string;
  thumbnail: string;
}

const CHANNEL_COLORS: Record<string, string> = {
  "Runway":         "bg-[#14591D] text-[#a5d6a7]",
  "OpenAI":         "bg-[#1b5e20] text-[#c8e6c9]",
  "Google DeepMind":"bg-[#2e7d32] text-[#dcedc8]",
  "Stability AI":   "bg-[#388e3c] text-[#f1f8e9]",
};

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

export default function FeedPage() {
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/videos")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0C0C0F] text-[#e8f5e9]">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#e8f5e9] tracking-tight">
            AI Launch Feed
          </h1>
          <p className="text-[#81c784] text-sm md:text-base">
            Latest product launches from Runway, OpenAI, Google DeepMind & Stability AI
          </p>
          <p className="text-[#4a5f4a] text-xs">
            Auto-updated · Curated for creative professionals
          </p>
        </div>

        {error && (
          <div className="bg-[#1e1010] border border-[#4a1010] rounded-lg p-4 text-[#ef9a9a] text-sm text-center">
            ⚠️ {error} — YouTube RSS may be temporarily unavailable. Refresh to try again.
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => <VideoSkeleton key={i} />)
            : videos.map((v) => {
                const badgeClass =
                  CHANNEL_COLORS[v.channelName] ?? "bg-[#1e3320] text-[#81c784]";
                return (
                  <a
                    key={v.videoId}
                    href={`https://youtube.com/watch?v=${v.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-xl overflow-hidden bg-[#111811] border border-[#1e3320] hover:border-[#4caf50]/50 transition-all duration-200 hover:shadow-[0_0_16px_rgba(76,175,80,0.15)]"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image
                        src={v.thumbnail}
                        alt={v.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <p className="text-[#e8f5e9] text-sm md:text-base font-medium leading-snug line-clamp-2 mb-3">
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

        {!loading && videos.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-[#81c784] text-sm">
              No videos available. Check back soon.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-8 pb-4 border-t border-[#1e3320]">
          <p className="text-[#4a5f4a] text-xs">
            Powered by Rendyr · Auto-refreshes on page load
          </p>
        </div>
      </div>
    </div>
  );
}
