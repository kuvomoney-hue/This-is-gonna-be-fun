"use client";

import { useEffect, useState } from "react";

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
  "Anthropic":      "bg-[#1b5e20] text-[#c8e6c9]",
  "Synthesia":      "bg-[#2e7d32] text-[#dcedc8]",
  "Luma AI":        "bg-[#388e3c] text-[#f1f8e9]",
  "Pika":           "bg-[#14591D] text-[#a5d6a7]",
  "Descript":       "bg-[#1b5e20] text-[#c8e6c9]",
  "Veed.io":        "bg-[#2e7d32] text-[#dcedc8]",
  "CapCut":         "bg-[#388e3c] text-[#f1f8e9]",
  "InVideo":        "bg-[#14591D] text-[#a5d6a7]",
  "HeyGen":         "bg-[#1b5e20] text-[#c8e6c9]",
};

function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

function VideoSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#111811] border border-[#1e3320] animate-pulse">
      <div className="w-full aspect-video bg-[#1e3320]" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-[#1e3320] rounded w-full" />
        <div className="h-4 bg-[#1e3320] rounded w-3/4" />
      </div>
    </div>
  );
}

export default function ShareVideosPage() {
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/videos")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then(setVideos)
      .catch(() => setError("Failed to load videos"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e0a] text-[#e8f5e9] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#e8f5e9]">AI Video Feed</h1>
          <p className="text-[#81c784] text-sm mt-1">
            Latest launches from Runway, OpenAI, Google DeepMind &amp; more
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <VideoSkeleton key={i} />)
            : videos.map((v) => {
                const badgeClass =
                  CHANNEL_COLORS[v.channelName] ?? "bg-[#1e3320] text-[#81c784]";
                return (
                  <a
                    key={v.videoId}
                    href={`https://youtube.com/watch?v=${v.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl overflow-hidden bg-[#111811] border border-[#1e3320] hover:border-[#388e3c] transition-all shadow-lg hover:shadow-xl"
                  >
                    <div className="relative w-full aspect-video overflow-hidden bg-[#0f150f]">
                      <img
                        src={v.thumbnail}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                        Video
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-[#e8f5e9] line-clamp-2 leading-tight mb-2">
                        {v.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeClass}`}
                        >
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

        {/* Footer */}
        <div className="text-center text-xs text-[#81c784]/50 mt-8">
          Updated every 30 minutes · Showing launches only (no shorts)
        </div>
      </div>
    </div>
  );
}
