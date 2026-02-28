"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
        // Fetch Rendyr stats
        const rendyrRes = await fetch("/data/rendyr.json");
        const rendyrData = await rendyrRes.json();
        setData(rendyrData);

        // Fetch AI videos
        const videosRes = await fetch("/api/videos");
        const videosData = await videosRes.json();
        setVideos(videosData.videos || []);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">loading rendyr...</div>
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
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-2">rendyr</h1>
        <p className="text-gray-400 text-sm md:text-base">
          real-time performance dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Instagram */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">instagram</div>
          <div className="text-3xl font-bold mb-1">
            {data.social.instagramFollowers.toLocaleString()}
          </div>
          <div className="text-gray-500 text-xs">
            {data.social.instagramEngagement} engagement
          </div>
        </div>

        {/* Skool */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">skool academy</div>
          <div className="text-3xl font-bold mb-1">
            {data.skool.members}
          </div>
          <div className="text-gray-500 text-xs">
            {data.skool.activeRate} active • {data.skool.weeklyPosts} posts/week
          </div>
        </div>

        {/* Bundle Sales */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">bundle sales</div>
          <div className="text-3xl font-bold mb-1">
            {data.bundle.totalSales}
          </div>
          <div className="text-gray-500 text-xs">
            {data.bundle.conversionRate} conversion • ${data.bundle.averageOrderValue} AOV
          </div>
        </div>

        {/* Email List */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">email list</div>
          <div className="text-3xl font-bold mb-1">
            {data.email.subscribers.toLocaleString()}
          </div>
          <div className="text-gray-500 text-xs">
            {data.email.openRate} open • {data.email.clickRate} click
          </div>
        </div>
      </div>

      {/* AI Video Feed */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">latest ai video launches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.slice(0, 12).map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-800">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {video.title}
                </div>
                <div className="text-gray-500 text-xs mb-2">{video.channel}</div>
                {video.viewCount !== undefined && (
                  <div className="text-gray-600 text-xs">
                    {video.viewCount.toLocaleString()} views
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-center text-gray-600 text-xs">
        <p>powered by scout mission control</p>
        <p className="mt-2">
          last updated: {new Date().toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
      </div>
    </div>
  );
}
