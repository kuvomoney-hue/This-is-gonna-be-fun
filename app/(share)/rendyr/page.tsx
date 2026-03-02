"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Users, DollarSign, Mail, Video, ExternalLink } from "lucide-react";

interface RendyrData {
  social: {
    instagramFollowers: number;
    instagramEngagement: string;
  };
  skool: {
    members: number;
    activeRate: string;
    weeklyPosts: number;
  };
  bundle: {
    totalSales: number;
    conversionRate: string;
    averageOrderValue: number;
  };
  email: {
    subscribers: number;
    openRate: string;
    clickRate: string;
  };
}

interface Video {
  id: string;
  title: string;
  channel: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  duration?: string;
  viewCount?: number;
}

export default function RendyrPortal() {
  const [data, setData] = useState<RendyrData | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [rendyrRes, videosRes] = await Promise.all([
          fetch("/data/rendyr.json", { cache: "no-store" }),
          fetch("/api/videos", { cache: "no-store" }),
        ]);

        if (rendyrRes.ok) setData(await rendyrRes.json());
        if (videosRes.ok) {
          const videosData = await videosRes.json();
          setVideos(videosData.videos || []);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-pulse text-white text-2xl mb-4">rendyr</div>
          <div className="text-zinc-500 text-sm">loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl">failed to load data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-zinc-900 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-2">rendyr</h1>
              <p className="text-zinc-500 text-sm">real-time performance metrics</p>
            </div>
            <Link 
              href="/" 
              className="text-zinc-500 hover:text-white text-sm font-medium transition-colors"
            >
              ← mission control
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          
          {/* Instagram */}
          <div className="group bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">instagram</div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {data.social.instagramFollowers.toLocaleString()}
            </div>
            <div className="text-sm text-zinc-500">
              {data.social.instagramEngagement} engagement rate
            </div>
          </div>

          {/* Skool Academy */}
          <div className="group bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">academy</div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {data.skool.members.toLocaleString()}
            </div>
            <div className="text-sm text-zinc-500">
              {data.skool.activeRate} active · {data.skool.weeklyPosts} posts/week
            </div>
          </div>

          {/* Bundle Sales */}
          <div className="group bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">bundle</div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {data.bundle.totalSales}
            </div>
            <div className="text-sm text-zinc-500">
              {data.bundle.conversionRate} conversion · ${data.bundle.averageOrderValue} aov
            </div>
          </div>

          {/* Email List */}
          <div className="group bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">email</div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {data.email.subscribers.toLocaleString()}
            </div>
            <div className="text-sm text-zinc-500">
              {data.email.openRate} open · {data.email.clickRate} click
            </div>
          </div>
        </div>

        {/* AI Video Feed Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Video className="w-4 h-4 text-zinc-400" />
              </div>
              <h2 className="text-2xl font-bold">latest ai releases</h2>
            </div>
            <Link 
              href="/videos" 
              className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-2"
            >
              view all <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.slice(0, 9).map((video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-all"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-zinc-800 overflow-hidden">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/90 px-2 py-0.5 rounded text-xs font-mono">
                      {video.duration}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {video.title}
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span className="truncate">{video.channel}</span>
                    {video.viewCount !== undefined && (
                      <span className="ml-2 flex-shrink-0">
                        {video.viewCount.toLocaleString()} views
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <div>powered by scout mission control</div>
          <div>
            last updated: {new Date().toLocaleString("en-US", {
              timeZone: "America/Los_Angeles",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
